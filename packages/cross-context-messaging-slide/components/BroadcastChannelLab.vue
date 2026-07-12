<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";

/**
 * BroadcastChannel 交互实验室
 * 同一页里开 3 个连到【同一频道】的独立 BroadcastChannel 实例，
 * 每个实例扮演一个“模拟标签页”。任一面板发送：
 *   - 其他面板实时收到（跨实例广播）
 *   - 发送面板自己收不到（WHATWG「Remove source from destinations」＝不回发）
 * 三个实例共处一页，恰好证明「不回发的是发送实例本身，别的实例照收」。
 */

/** 频道名：三个面板都连到它，同名即同频道 */
const CHANNEL = "bc-lab-demo";

/** 一条收发日志 */
interface LogEntry {
  /** send＝本面板发出；recv＝收到别的面板广播 */
  kind: "send" | "recv";
  /** 展示文本 */
  text: string;
}

/** 单个面板（模拟一个标签页）的视图模型 */
interface Panel {
  /** 面板标识 A / B / C */
  id: string;
  /** 本面板已发送条数，用于生成消息序号 */
  sent: number;
  /** 本面板收发日志（最新在上，最多 5 条） */
  logs: LogEntry[];
}

/** 三个面板的响应式状态 */
const panels = reactive<Panel[]>([
  { id: "A", sent: 0, logs: [] },
  { id: "B", sent: 0, logs: [] },
  { id: "C", sent: 0, logs: [] },
]);

/** 每个面板独立的 BroadcastChannel 实例；非响应式，仅 onMounted 后创建 */
const channels: (BroadcastChannel | null)[] = [null, null, null];

/** 跨实例收到的消息总数（证明广播确实在流动） */
const recvTotal = ref(0);
/** 发送总数 */
const sentTotal = ref(0);

/** 往某面板日志头部压入一条，仅保留最近 5 条 */
function pushLog(idx: number, entry: LogEntry): void {
  const logs = panels[idx].logs;
  logs.unshift(entry);
  if (logs.length > 5) logs.pop();
}

/** 面板发送：用自己的 BroadcastChannel 广播一条带 senderId 的消息 */
function send(idx: number): void {
  const ch = channels[idx];
  if (!ch) return;
  const panel = panels[idx];
  panel.sent += 1;
  sentTotal.value += 1;
  const text = `${panel.id} #${panel.sent}`;
  // 广播：同频道【其他】实例会收到；本实例的 onmessage 不会因此触发（不回发）
  ch.postMessage({ senderId: panel.id, text });
  // 发送面板只记录“发出”，绝不因这次 postMessage 收到自己的消息
  pushLog(idx, { kind: "send", text: `发出 ${text}` });
}

onMounted(() => {
  // 顶层零 window：仅挂载后、且 API 存在时创建，保证 SSR 安全
  if (typeof BroadcastChannel === "undefined") return;
  panels.forEach((panel, idx) => {
    const ch = new BroadcastChannel(CHANNEL);
    // 收别的实例广播来的消息——自己发的不会进这里（源已被移出投递列表）
    ch.onmessage = (event: MessageEvent) => {
      const data = event.data as { senderId: string; text: string };
      recvTotal.value += 1;
      pushLog(idx, { kind: "recv", text: `收到 ${data.text}` });
    };
    channels[idx] = ch;
  });
});

onUnmounted(() => {
  // 卸载即关闭，避免频道悬挂、重复处理
  channels.forEach((ch) => ch?.close());
  channels.fill(null);
});
</script>

<template>
  <section class="bc-lab" aria-label="BroadcastChannel 交互实验室">
    <!-- 顶栏：频道名 + 计数 + 说明 -->
    <header class="bc-lab__bar">
      <span class="bc-lab__chan">频道 <code>"{{ CHANNEL }}"</code></span>
      <span class="bc-lab__note">任一面板发送 → 其他面板实时收到；发送面板自己<strong>不回发</strong></span>
      <span class="bc-lab__counts">
        发送 <b>{{ sentTotal }}</b> · 收到 <b>{{ recvTotal }}</b>
      </span>
    </header>

    <!-- 三个模拟标签页面板：各持一个独立 BroadcastChannel 实例 -->
    <div class="bc-lab__grid">
      <article
        v-for="(panel, i) in panels"
        :key="panel.id"
        class="bc-lab__panel"
        :data-panel="panel.id"
      >
        <div class="bc-lab__head">
          <span class="bc-lab__tab">模拟标签页 {{ panel.id }}</span>
          <button
            type="button"
            class="bc-lab__send"
            :data-send="panel.id"
            @click="send(i)"
          >
            广播一条
          </button>
        </div>
        <ul class="bc-lab__log">
          <li
            v-for="(entry, j) in panel.logs"
            :key="j"
            class="bc-lab__item"
            :class="`bc-lab__item--${entry.kind}`"
            :data-kind="entry.kind"
          >
            <span class="bc-lab__dot" aria-hidden="true"></span>
            {{ entry.text }}
          </li>
          <li v-if="panel.logs.length === 0" class="bc-lab__empty">
            暂无收发
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.bc-lab {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 388px;
  padding: 12px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.bc-lab__bar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #374151;
}

.bc-lab__chan {
  color: #9ca3af;
  font-size: 12px;
}

.bc-lab__chan code {
  color: #f9fafb;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.bc-lab__note {
  color: #9ca3af;
  font-size: 12px;
}

.bc-lab__note strong {
  color: #fbbf24;
}

.bc-lab__counts {
  margin-left: auto;
  color: #9ca3af;
  font-size: 12px;
  white-space: nowrap;
}

.bc-lab__counts b {
  color: #34d399;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.bc-lab__grid {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  min-height: 0;
}

.bc-lab__panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #0b1220;
  border: 1px solid #334155;
  border-radius: 6px;
}

.bc-lab__head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 9px 10px;
  border-bottom: 1px solid #1f2937;
}

.bc-lab__tab {
  color: #f9fafb;
  font-size: 12px;
  font-weight: 700;
}

.bc-lab__send {
  padding: 5px 10px;
  color: #041016;
  font-size: 12px;
  font-weight: 700;
  background: #22d3ee;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}

.bc-lab__send:hover {
  background: #67e8f9;
}

.bc-lab__log {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  margin: 0;
  padding: 9px;
  overflow-y: auto;
  list-style: none;
}

.bc-lab__item {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 5px 8px;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  border-radius: 4px;
}

.bc-lab__item--send {
  color: #bae6fd;
  background: #0c2537;
  border-left: 3px solid #38bdf8;
}

.bc-lab__item--recv {
  color: #bbf7d0;
  background: #0e2a1e;
  border-left: 3px solid #34d399;
}

.bc-lab__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.bc-lab__empty {
  color: #475569;
  font-size: 11px;
  text-align: center;
}
</style>
