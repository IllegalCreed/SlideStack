<script setup lang="ts">
import { computed, ref } from "vue";

/**
 * 历史栈可视化实验室
 *
 * 教学模拟栈：忠实复刻 WHATWG「会话历史」语义（pushState 截断前进项、
 * replaceState 原地替换且 key 不变、back/forward 移动指针），但**不触碰真实
 * 地址栏**——因为 Slidev 自身就用 History API + popstate 驱动翻页，真改会劫持
 * 演示。所有状态在内存内，顶层零 window 访问，SSR 安全。
 *
 * 核心演示：**pushState / replaceState 不触发 popstate，只有 back / forward
 * 才触发**——这是自研 SPA 路由的头号坑。
 */

/** 一条会话历史条目：url + 绑定的结构化 state + slot 标识 key */
interface HistoryEntry {
  url: string;
  state: { id: number } | null;
  key: string;
}

/** 一次操作的记录：操作名、是否触发 popstate、说明 */
interface OpRecord {
  seq: number;
  op: string;
  popstate: boolean;
  detail: string;
}

/** 可推入的示例路径 */
const paths = ["/home", "/users/1", "/users/2", "/settings"] as const;
/** 当前选中的目标路径 */
const selected = ref<string>("/users/1");

/** 教学模拟的会话历史栈与当前指针（初始一条、state 为 null，对齐真实首屏） */
const stack = ref<HistoryEntry[]>([{ url: "/home", state: null, key: "k0" }]);
const index = ref<number>(0);

/** 单调递增计数：state id / key / 操作序号（仅用于可视化区分） */
let stateSeq = 0;
let keySeq = 1;
let opSeq = 0;

/** 最近若干次操作日志（新在最前） */
const log = ref<OpRecord[]>([]);
/** 最近一次操作——驱动「头号坑」大徽标 */
const last = computed<OpRecord | null>(() => log.value[0] ?? null);

/** 派生量：能否前进后退、当前条目、history.length */
const canGoBack = computed(() => index.value > 0);
const canGoForward = computed(() => index.value < stack.value.length - 1);
const current = computed(() => stack.value[index.value]);
const historyLength = computed(() => stack.value.length);

/** 记录一次操作，日志只保留最近 5 条 */
function record(op: string, popstate: boolean, detail: string): void {
  log.value = [{ seq: ++opSeq, op, popstate, detail }, ...log.value].slice(0, 5);
}

/** pushState：截断前进项 → 追加新条目 → 指针到栈顶；**不触发 popstate** */
function pushState(): void {
  const entry: HistoryEntry = {
    url: selected.value,
    state: { id: ++stateSeq },
    key: `k${keySeq++}`,
  };
  // 分叉即截断：当前指针之后的前进条目全部丢弃
  stack.value = [...stack.value.slice(0, index.value + 1), entry];
  index.value = stack.value.length - 1;
  record("pushState", false, `推入 ${entry.url}：前进项被截断、length +1`);
}

/** replaceState：原地替换当前条目、**key 不变、长度不变**；**不触发 popstate** */
function replaceState(): void {
  const cur = stack.value[index.value];
  stack.value[index.value] = {
    url: selected.value,
    state: { id: ++stateSeq },
    key: cur.key, // 同一 slot：key 保持不变
  };
  record("replaceState", false, `替换当前条目为 ${selected.value}：key 不变、length 不变`);
}

/** back：指针后退一条；**触发 popstate** */
function back(): void {
  if (!canGoBack.value) return;
  index.value -= 1;
  record("back", true, `后退到 ${current.value.url}：popstate 携带该条 state`);
}

/** forward：指针前进一条；**触发 popstate** */
function forward(): void {
  if (!canGoForward.value) return;
  index.value += 1;
  record("forward", true, `前进到 ${current.value.url}：popstate 携带该条 state`);
}

/** 复位到初始单条历史 */
function reset(): void {
  stack.value = [{ url: "/home", state: null, key: "k0" }];
  index.value = 0;
  stateSeq = 0;
  keySeq = 1;
  log.value = [];
}
</script>

<template>
  <section class="hist-lab" aria-label="历史栈可视化实验室">
    <!-- 左：操作台 + 头号坑徽标 -->
    <div class="hist-lab__left">
      <div class="hist-lab__paths" role="group" aria-label="目标路径">
        <button
          v-for="p in paths"
          :key="p"
          type="button"
          :class="['hist-lab__path', { 'hist-lab__path--active': selected === p }]"
          :aria-pressed="selected === p"
          @click="selected = p"
        >
          {{ p }}
        </button>
      </div>

      <div class="hist-lab__actions">
        <button type="button" class="hist-lab__btn hist-lab__btn--push" @click="pushState">
          pushState()
        </button>
        <button type="button" class="hist-lab__btn hist-lab__btn--replace" @click="replaceState">
          replaceState()
        </button>
        <button
          type="button"
          class="hist-lab__btn hist-lab__btn--nav"
          :disabled="!canGoBack"
          @click="back"
        >
          ← back()
        </button>
        <button
          type="button"
          class="hist-lab__btn hist-lab__btn--nav"
          :disabled="!canGoForward"
          @click="forward"
        >
          forward() →
        </button>
      </div>

      <!-- 头号坑：这次操作到底触没触发 popstate -->
      <div
        class="hist-lab__badge"
        :class="last ? (last.popstate ? 'is-fire' : 'is-nofire') : 'is-idle'"
        aria-live="polite"
      >
        <span class="hist-lab__badge-op">{{ last ? last.op + "()" : "等待操作" }}</span>
        <strong>{{
          last ? (last.popstate ? "popstate 触发 ✓" : "popstate 未触发 ✗") : "popstate —"
        }}</strong>
        <em>{{
          last
            ? last.detail
            : "push / replace 不触发 popstate；back / forward 才触发"
        }}</em>
      </div>

      <button type="button" class="hist-lab__reset" @click="reset">复位</button>
      <p class="hist-lab__note">教学模拟栈：忠实复刻会话历史语义，不改真实地址栏（避免影响 Slidev）</p>
    </div>

    <!-- 右：历史栈可视化 + 状态读数 + 操作日志 -->
    <div class="hist-lab__right">
      <div class="hist-lab__stack" aria-label="会话历史栈">
        <div class="hist-lab__legend">
          <span><i class="dot back"></i>可后退</span>
          <span><i class="dot current"></i>当前</span>
          <span><i class="dot forward"></i>可前进</span>
        </div>
        <div class="hist-lab__entries">
          <div
            v-for="(entry, i) in stack"
            :key="entry.key + '-' + i"
            :class="[
              'hist-lab__entry',
              i === index ? 'is-current' : i < index ? 'is-back' : 'is-forward',
            ]"
          >
            <span class="hist-lab__ptr">{{ i === index ? "▶" : "" }}</span>
            <span class="hist-lab__eidx">#{{ i }}</span>
            <code class="hist-lab__eurl">{{ entry.url }}</code>
            <span class="hist-lab__ekey">{{ entry.key }}</span>
            <span class="hist-lab__estate">{{
              entry.state ? "state#" + entry.state.id : "null"
            }}</span>
          </div>
        </div>
      </div>

      <footer class="hist-lab__readout">
        <span>history.length = <strong>{{ historyLength }}</strong></span>
        <span>history.state = <strong>{{ current.state ? JSON.stringify(current.state) : "null" }}</strong></span>
        <span>canGoBack = <strong>{{ canGoBack }}</strong></span>
        <span>canGoForward = <strong>{{ canGoForward }}</strong></span>
      </footer>

      <div class="hist-lab__log" aria-label="操作日志">
        <div v-for="rec in log" :key="rec.seq" class="hist-lab__log-row">
          <span class="hist-lab__log-op">{{ rec.op }}</span>
          <span :class="['hist-lab__log-chip', rec.popstate ? 'fire' : 'nofire']">
            {{ rec.popstate ? "popstate ✓" : "popstate ✗" }}
          </span>
          <em>{{ rec.detail }}</em>
        </div>
        <p v-if="!log.length" class="hist-lab__log-empty">操作日志为空——点击左侧按钮开始</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hist-lab {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 12px;
  width: 100%;
  height: 400px;
  padding: 12px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.hist-lab__left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

/* 路径选择 */
.hist-lab__paths {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.hist-lab__path {
  min-height: 28px;
  padding: 4px 6px;
  color: #d1d5db;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  background: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 5px;
  cursor: pointer;
}

.hist-lab__path--active {
  color: #111827;
  font-weight: 700;
  background: #60a5fa;
  border-color: #60a5fa;
}

/* 操作按钮 */
.hist-lab__actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}

.hist-lab__btn {
  min-height: 30px;
  padding: 5px 6px;
  color: #f9fafb;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
  border-radius: 5px;
  cursor: pointer;
}

.hist-lab__btn--push {
  background: #164e2f;
  border-color: #34d399;
}
.hist-lab__btn--replace {
  background: #4a3208;
  border-color: #fbbf24;
}
.hist-lab__btn--nav {
  background: #1e3a5f;
  border-color: #60a5fa;
}

.hist-lab__btn:disabled {
  color: #6b7280;
  background: #1f2937;
  border-color: #374151;
  cursor: not-allowed;
}

/* 头号坑徽标 */
.hist-lab__badge {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border: 1px solid;
  border-radius: 7px;
}

.hist-lab__badge.is-idle {
  background: #1f2937;
  border-color: #4b5563;
}
.hist-lab__badge.is-fire {
  background: #052e1b;
  border-color: #34d399;
}
.hist-lab__badge.is-nofire {
  background: #3f1d24;
  border-color: #fb7185;
}

.hist-lab__badge-op {
  color: #9ca3af;
  font-family: ui-monospace, monospace;
  font-size: 10px;
}

.hist-lab__badge strong {
  font-size: 15px;
}
.hist-lab__badge.is-fire strong {
  color: #34d399;
}
.hist-lab__badge.is-nofire strong {
  color: #fb7185;
}

.hist-lab__badge em {
  color: #cbd5e1;
  font-size: 10.5px;
  font-style: normal;
  line-height: 1.35;
}

.hist-lab__reset {
  min-height: 26px;
  color: #d1d5db;
  font-size: 11px;
  background: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 5px;
  cursor: pointer;
}

.hist-lab__note {
  margin: 0;
  color: #6b7280;
  font-size: 9.5px;
  line-height: 1.35;
}

/* 右侧 */
.hist-lab__right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.hist-lab__stack {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  padding: 8px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.hist-lab__legend {
  display: flex;
  gap: 14px;
  color: #9ca3af;
  font-size: 10px;
}

.hist-lab__legend span {
  display: inline-flex;
  gap: 5px;
  align-items: center;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 2px;
}
.dot.back {
  background: #475569;
}
.dot.current {
  background: #60a5fa;
}
.dot.forward {
  background: #334155;
  border: 1px dashed #64748b;
}

.hist-lab__entries {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  overflow-y: auto;
}

.hist-lab__entry {
  display: grid;
  grid-template-columns: 16px 30px 1fr auto auto;
  gap: 8px;
  align-items: baseline;
  padding: 5px 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  border: 1px solid transparent;
  border-radius: 5px;
}

.hist-lab__entry.is-current {
  background: #172a44;
  border-color: #60a5fa;
}
.hist-lab__entry.is-back {
  background: #1e293b;
}
.hist-lab__entry.is-forward {
  background: #131c2e;
  border-style: dashed;
  border-color: #334155;
  opacity: 0.7;
}

.hist-lab__ptr {
  color: #60a5fa;
  font-size: 11px;
}
.hist-lab__eidx {
  color: #64748b;
  font-size: 11px;
}
.hist-lab__eurl {
  overflow: hidden;
  color: #f1f5f9;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hist-lab__ekey {
  color: #a78bfa;
  font-size: 10px;
}
.hist-lab__estate {
  color: #34d399;
  font-size: 10px;
}

/* 状态读数 */
.hist-lab__readout {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 14px;
  padding: 7px 10px;
  color: #9ca3af;
  font-family: ui-monospace, monospace;
  font-size: 10.5px;
  background: #0f172a;
  border-left: 4px solid #60a5fa;
  border-radius: 0 4px 4px 0;
}

.hist-lab__readout strong {
  color: #e5e7eb;
}

/* 操作日志 */
.hist-lab__log {
  height: 112px;
  padding: 6px 8px;
  overflow-y: auto;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.hist-lab__log-row {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding: 2px 0;
}

.hist-lab__log-op {
  flex: 0 0 88px;
  color: #e5e7eb;
  font-family: ui-monospace, monospace;
  font-size: 11px;
}

.hist-lab__log-chip {
  flex: 0 0 74px;
  font-size: 9.5px;
  font-weight: 700;
  text-align: center;
  border-radius: 3px;
}

.hist-lab__log-chip.fire {
  color: #052e1b;
  background: #34d399;
}
.hist-lab__log-chip.nofire {
  color: #3f1d24;
  background: #fb7185;
}

.hist-lab__log-row em {
  color: #9ca3af;
  font-size: 10px;
  font-style: normal;
}

.hist-lab__log-empty {
  margin: 0;
  color: #64748b;
  font-size: 11px;
}
</style>
