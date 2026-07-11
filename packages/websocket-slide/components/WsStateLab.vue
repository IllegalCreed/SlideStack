<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

/**
 * WebSocket readyState 状态机 + send 时机实验室
 *
 * 用一个「模拟的」WebSocket（纯定时器驱动、绝不连真实服务器）复现三条 API 事实：
 *  1. CONNECTING(0) 态 send → 抛 InvalidStateError
 *  2. OPEN(1) 态 send → 字节进 bufferedAmount 水位（入队增、后台发出减）
 *  3. CLOSING(2) / CLOSED(3) 态 send → 静默丢弃（不发送、不报错）
 * 额外复现「发送缓冲满 → 浏览器自动关闭连接」。
 * 所有副作用都在按钮回调 / 定时器内触发，模块顶层无浏览器 API 访问 → SSR 安全。
 */

/** 一条操作日志：tone 决定左侧色条，action 是动作，outcome 是结局 */
interface LogEntry {
  key: number;
  tone: "green" | "amber" | "red" | "muted" | "blue";
  action: string;
  outcome: string;
}

// ——— 模拟时序常量（刻意放慢到肉眼可辨） ———
const CONNECT_MS = 1200; // CONNECTING → OPEN 的握手耗时
const CLOSE_MS = 700; // CLOSING → CLOSED 的关闭握手耗时
const CAPACITY = 360; // 发送缓冲容量（字节）；超过即自动关闭
const DRAIN_MS = 150; // 后台「发出」节拍
const DRAIN_BYTES = 16; // 每拍从缓冲发出的字节数

/** readyState：-1=尚未创建（idle），0/1/2/3 对齐标准四态常量 */
const readyState = ref<number>(-1);
/** bufferedAmount：已 send 入缓冲、尚未「发到网络」的字节数 */
const buffered = ref<number>(0);
const logs = ref<LogEntry[]>([]);

let logKey = 0;
let connectTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let drainTimer: ReturnType<typeof setInterval> | null = null;
let payloadIdx = 0;

/** 轮流发送的样例消息，覆盖 JSON / 短文本 / 二进制信封等不同体积 */
const PAYLOADS = [
  '{"type":"chat","body":"你好"}',
  "ping",
  '{"type":"cursor","x":128,"y":40}',
  "hello websocket",
];

/** 四态名，含 idle 兜底 */
const STATE_NAMES: Record<number, string> = {
  [-1]: "—（未创建）",
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED",
};

const stateName = computed(() => STATE_NAMES[readyState.value] ?? "—");
/** 水位百分比，封顶 100% */
const bufferPct = computed(() =>
  Math.min(100, Math.round((buffered.value / CAPACITY) * 100)),
);
/** 状态机四节点，供模板高亮 */
const nodes = [
  { v: 0, label: "CONNECTING" },
  { v: 1, label: "OPEN" },
  { v: 2, label: "CLOSING" },
  { v: 3, label: "CLOSED" },
];

/** 追加日志（保留最近 7 条，够看又不溢出） */
function pushLog(e: Omit<LogEntry, "key">) {
  logs.value.push({ key: logKey++, ...e });
  if (logs.value.length > 7) logs.value.shift();
}

/** 清掉所有定时器 */
function clearTimers() {
  if (connectTimer) clearTimeout(connectTimer);
  if (closeTimer) clearTimeout(closeTimer);
  if (drainTimer) clearInterval(drainTimer);
  connectTimer = closeTimer = drainTimer = null;
}

/** 后台「发出」缓冲：模拟字节陆续上网，bufferedAmount 回落到 0 */
function startDrain() {
  if (drainTimer) return;
  drainTimer = setInterval(() => {
    if (buffered.value > 0) {
      buffered.value = Math.max(0, buffered.value - DRAIN_BYTES);
    }
  }, DRAIN_MS);
}

/** 「连接」= new WebSocket(url)：立即进 CONNECTING，握手后转 OPEN */
function connect() {
  clearTimers();
  readyState.value = 0; // CONNECTING
  buffered.value = 0;
  pushLog({ tone: "blue", action: "new WebSocket()", outcome: "→ CONNECTING(0)，握手中" });
  connectTimer = setTimeout(() => {
    readyState.value = 1; // OPEN
    pushLog({ tone: "green", action: "open 事件", outcome: "→ OPEN(1)，现在可以 send" });
    startDrain();
  }, CONNECT_MS);
}

/** 模拟 send()：严格按当前 readyState 复现四种结局 */
function send() {
  if (readyState.value === -1) {
    pushLog({ tone: "muted", action: "send()", outcome: "还没 new，先点「连接」" });
    return;
  }
  const msg = PAYLOADS[payloadIdx % PAYLOADS.length];
  payloadIdx += 1;
  const bytes = new TextEncoder().encode(msg).length;

  if (readyState.value === 0) {
    // CONNECTING：真实浏览器会抛 InvalidStateError
    const err = new DOMException("Still in CONNECTING state.", "InvalidStateError");
    pushLog({ tone: "red", action: `send() @ CONNECTING`, outcome: `✗ 抛 ${err.name}` });
    return;
  }
  if (readyState.value === 1) {
    // OPEN：入发送缓冲，水位抬升
    buffered.value += bytes;
    pushLog({ tone: "green", action: `send("${short(msg)}") @ OPEN`, outcome: `+${bytes} 字节 入 bufferedAmount` });
    if (buffered.value > CAPACITY) {
      // 缓冲满 → 浏览器自动关闭连接
      pushLog({ tone: "red", action: "缓冲溢出", outcome: "浏览器自动关闭连接" });
      beginClose(true);
    }
    return;
  }
  // CLOSING(2) / CLOSED(3)：静默丢弃
  pushLog({ tone: "muted", action: `send() @ ${stateName.value}`, outcome: "静默丢弃（不发送、不报错）" });
}

/** 「关闭」= close()：OPEN/CONNECTING → CLOSING → CLOSED */
function beginClose(auto = false) {
  if (readyState.value === -1 || readyState.value >= 2) return; // 已在关或未创建
  readyState.value = 2; // CLOSING
  if (!auto) pushLog({ tone: "amber", action: "close(1000)", outcome: "→ CLOSING(2)，关闭握手中" });
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    readyState.value = 3; // CLOSED
    if (drainTimer) {
      clearInterval(drainTimer);
      drainTimer = null;
    }
    pushLog({ tone: "amber", action: "close 事件", outcome: "→ CLOSED(3)，实例作废、不可复用" });
  }, CLOSE_MS);
}

/** 「重置」：回到 idle 空态 */
function reset() {
  clearTimers();
  readyState.value = -1;
  buffered.value = 0;
  logs.value = [];
  payloadIdx = 0;
}

/** 截断样例消息用于日志展示 */
function short(s: string) {
  return s.length > 12 ? s.slice(0, 12) + "…" : s;
}

onBeforeUnmount(clearTimers);
</script>

<template>
  <section class="ws-lab" aria-label="WebSocket readyState 状态机与 send 时机实验室">
    <div class="ws-lab__left">
      <!-- 控制区 -->
      <div class="ws-lab__controls" role="group" aria-label="连接控制">
        <button type="button" class="ws-lab__btn ws-lab__btn--blue" data-testid="ws-connect" @click="connect">
          连接 new
        </button>
        <button type="button" class="ws-lab__btn ws-lab__btn--green" data-testid="ws-send" @click="send">
          发送 send
        </button>
        <button type="button" class="ws-lab__btn ws-lab__btn--amber" data-testid="ws-close" @click="beginClose(false)">
          关闭 close
        </button>
        <button type="button" class="ws-lab__btn" data-testid="ws-reset" @click="reset">重置</button>
      </div>

      <!-- 状态机四节点 -->
      <div class="ws-lab__machine">
        <template v-for="(n, i) in nodes" :key="n.v">
          <div
            :class="['ws-lab__node', { 'ws-lab__node--on': readyState === n.v }]"
            :data-testid="`ws-node-${n.v}`"
          >
            <span class="ws-lab__node-v">{{ n.v }}</span>
            <span class="ws-lab__node-l">{{ n.label }}</span>
          </div>
          <span v-if="i < nodes.length - 1" class="ws-lab__arrow">›</span>
        </template>
      </div>

      <!-- readyState 实时值 -->
      <div class="ws-lab__readystate" data-testid="ws-readystate">
        readyState = <strong>{{ readyState === -1 ? "—" : readyState }}</strong>
        <span>· {{ stateName }}</span>
      </div>

      <!-- bufferedAmount 水位条 -->
      <div class="ws-lab__buffer">
        <div class="ws-lab__buffer-label">
          <span>bufferedAmount</span>
          <strong data-testid="ws-buffered">{{ buffered }} B</strong>
        </div>
        <div class="ws-lab__gauge">
          <div
            :class="['ws-lab__gauge-fill', { 'ws-lab__gauge-fill--hot': bufferPct > 80 }]"
            :style="{ width: bufferPct + '%' }"
          ></div>
          <span class="ws-lab__gauge-cap">容量 {{ CAPACITY }} B · 满则自动断连</span>
        </div>
      </div>
    </div>

    <!-- 操作日志 -->
    <div class="ws-lab__right">
      <div class="ws-lab__log" data-testid="ws-log">
        <p v-if="!logs.length" class="ws-lab__empty">点「连接」→ 试着在不同状态下「发送」，看 send 的不同结局</p>
        <div v-for="e in logs" :key="e.key" :class="['ws-lab__row', `ws-lab__row--${e.tone}`]">
          <code>{{ e.action }}</code>
          <em>{{ e.outcome }}</em>
        </div>
      </div>
      <p class="ws-lab__hint">CONNECTING 发 → 抛错 · OPEN 发 → 入水位 · CLOSING/CLOSED 发 → 静默丢弃</p>
    </div>
  </section>
</template>

<style scoped>
.ws-lab {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 12px;
  width: 100%;
  height: 398px;
  padding: 12px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.ws-lab__left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.ws-lab__controls {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.ws-lab__btn {
  min-height: 34px;
  padding: 4px 6px;
  color: #f3f4f6;
  font-size: 12px;
  font-weight: 600;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 6px;
  cursor: pointer;
}

.ws-lab__btn:hover {
  filter: brightness(1.12);
}

.ws-lab__btn--blue {
  color: #0b1220;
  background: #60a5fa;
  border-color: #93c5fd;
}
.ws-lab__btn--green {
  color: #0b1220;
  background: #34d399;
  border-color: #6ee7b7;
}
.ws-lab__btn--amber {
  color: #0b1220;
  background: #fbbf24;
  border-color: #fcd34d;
}

.ws-lab__machine {
  display: flex;
  align-items: stretch;
  gap: 2px;
}

.ws-lab__node {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  padding: 8px 2px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
}

.ws-lab__node--on {
  background: #0b3a53;
  border-color: #38bdf8;
  box-shadow: 0 0 0 1px #38bdf8;
}

.ws-lab__node-v {
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 700;
}

.ws-lab__node--on .ws-lab__node-v {
  color: #7dd3fc;
}

.ws-lab__node-l {
  font-size: 9.5px;
  letter-spacing: 0.02em;
}

.ws-lab__arrow {
  align-self: center;
  color: #6b7280;
  font-size: 14px;
}

.ws-lab__readystate {
  font-size: 13px;
}

.ws-lab__readystate strong {
  color: #7dd3fc;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 16px;
}

.ws-lab__readystate span {
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}

.ws-lab__buffer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
}

.ws-lab__buffer-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
}

.ws-lab__buffer-label strong {
  color: #fbbf24;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.ws-lab__gauge {
  position: relative;
  height: 26px;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.ws-lab__gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #34d399);
  transition: width 0.16s linear;
}

.ws-lab__gauge-fill--hot {
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.ws-lab__gauge-cap {
  position: absolute;
  top: 0;
  left: 8px;
  line-height: 26px;
  color: #cbd5e1;
  font-size: 10px;
}

.ws-lab__right {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
}

.ws-lab__log {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  min-height: 0;
  padding: 8px;
  overflow-y: auto;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.ws-lab__empty {
  margin: auto;
  color: #6b7280;
  font-size: 11px;
  text-align: center;
}

.ws-lab__row {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 4px 8px;
  background: #1f2937;
  border-left: 3px solid #4b5563;
  border-radius: 3px;
}

.ws-lab__row--blue {
  border-left-color: #60a5fa;
}
.ws-lab__row--green {
  border-left-color: #34d399;
}
.ws-lab__row--amber {
  border-left-color: #fbbf24;
}
.ws-lab__row--red {
  border-left-color: #fb7185;
}
.ws-lab__row--muted {
  border-left-color: #6b7280;
}

.ws-lab__row code {
  color: #f9fafb;
  font-size: 11px;
}

.ws-lab__row em {
  color: #9ca3af;
  font-size: 10.5px;
  font-style: normal;
}

.ws-lab__row--red em {
  color: #fca5a5;
}
.ws-lab__row--green em {
  color: #6ee7b7;
}

.ws-lab__hint {
  margin: 0;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.4;
}
</style>
