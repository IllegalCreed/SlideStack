<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";

/** 模拟下载参数：32 块 × 32 KiB，每 100ms 到一块 → 全部收完约 3.2s */
const CHUNK_SIZE = 32 * 1024;
const CHUNK_COUNT = 32;
const CHUNK_INTERVAL = 100;
const TOTAL_BYTES = CHUNK_SIZE * CHUNK_COUNT;

type Phase = "idle" | "running" | "done" | "aborted" | "timeout";

const phase = ref<Phase>("idle");
const loaded = ref(0); // 已接收字节数
const elapsed = ref(0); // 已用时（ms）
const timeoutMs = ref(2000); // 超时闸（滑杆可调）
const errorName = ref(""); // 触发后的 err.name

let userController: AbortController | null = null;
let ticker: ReturnType<typeof setInterval> | null = null;
let startAt = 0;

/**
 * 自造慢速字节流：定时吐 Uint8Array 块，模拟分块到达的下载。
 * 不依赖任何真实网络；cancel() 时清掉内部定时器。
 */
function makeSlowStream(): ReadableStream<Uint8Array> {
  let sent = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  return new ReadableStream({
    start(ctrl) {
      timer = setInterval(() => {
        ctrl.enqueue(new Uint8Array(CHUNK_SIZE));
        sent += 1;
        if (sent >= CHUNK_COUNT) {
          if (timer) clearInterval(timer);
          ctrl.close();
        }
      }, CHUNK_INTERVAL);
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });
}

/** 开始一轮「下载 vs 超时闸 vs 手动取消」的竞速 */
async function start() {
  // 信号一次性：每轮都新建 controller 与 timeout 信号
  userController = new AbortController();
  const combined = AbortSignal.any([
    userController.signal,
    AbortSignal.timeout(timeoutMs.value),
  ]);

  phase.value = "running";
  loaded.value = 0;
  elapsed.value = 0;
  errorName.value = "";
  startAt = performance.now();
  ticker = setInterval(() => {
    elapsed.value = Math.min(performance.now() - startAt, timeoutMs.value);
  }, 50);

  const reader = makeSlowStream().getReader();
  // 中止即弃读：让挂起的 read() 尽快返回（对齐 fetch 里 body 读取被打断的行为）
  const onAbort = () => reader.cancel();
  combined.addEventListener("abort", onAbort, { once: true });

  try {
    while (true) {
      const { value, done } = await reader.read();
      // any() 组合信号的 reason 取第一个触发的源信号 —— err.name 天然可分流
      if (combined.aborted) throw combined.reason;
      if (done) break;
      loaded.value += value.byteLength;
    }
    phase.value = "done";
  } catch (err) {
    const name = (err as DOMException | undefined)?.name ?? "Error";
    errorName.value = name;
    phase.value = name === "TimeoutError" ? "timeout" : "aborted";
  } finally {
    combined.removeEventListener("abort", onAbort);
    if (ticker) clearInterval(ticker);
    ticker = null;
  }
}

/** 手动取消：默认 reason 是 name 为 AbortError 的 DOMException */
function abortNow() {
  userController?.abort();
}

/** 组件卸载兜底：停掉计时器与在途模拟流 */
onUnmounted(() => {
  if (ticker) clearInterval(ticker);
  userController?.abort();
});

const dataPct = computed(() => Math.round((loaded.value / TOTAL_BYTES) * 100));
const timePct = computed(() =>
  Math.min(100, Math.round((elapsed.value / timeoutMs.value) * 100)),
);
const loadedKiB = computed(() => Math.round(loaded.value / 1024));
const totalKiB = TOTAL_BYTES / 1024;

const statusText = computed(() => {
  switch (phase.value) {
    case "idle":
      return "待开始：数据全部到达约需 3.2s，与右侧超时闸竞速";
    case "running":
      return `竞速中… 已用 ${(elapsed.value / 1000).toFixed(1)}s / 闸 ${(timeoutMs.value / 1000).toFixed(1)}s`;
    case "done":
      return "下载完成 —— 数据跑赢了超时闸，Promise 正常兑现";
    case "aborted":
      return "用户取消 → 预期内流程：静默收尾，别灌进错误监控";
    case "timeout":
      return "超时 → 面向用户提示，或按退避策略重试";
    default:
      return "";
  }
});
</script>

<template>
  <section class="race-lab" aria-label="fetch 取消与超时竞速演示">
    <div class="race-lab__controls">
      <button
        type="button"
        class="race-lab__btn race-lab__btn--start"
        :disabled="phase === 'running'"
        @click="start"
      >
        开始下载
      </button>
      <button
        type="button"
        class="race-lab__btn race-lab__btn--abort"
        :disabled="phase !== 'running'"
        @click="abortNow"
      >
        controller.abort()
      </button>
      <label class="race-lab__slider">
        <span>超时闸 AbortSignal.timeout({{ timeoutMs }})</span>
        <input
          v-model.number="timeoutMs"
          type="range"
          min="500"
          max="6000"
          step="100"
          :disabled="phase === 'running'"
        />
      </label>
    </div>

    <div class="race-lab__track">
      <div class="race-lab__track-label">
        <span>数据到达（自造慢速 ReadableStream）</span>
        <code>{{ loadedKiB }} / {{ totalKiB }} KiB</code>
      </div>
      <div class="race-lab__bar">
        <div
          :class="[
            'race-lab__fill',
            phase === 'done' ? 'race-lab__fill--done' : 'race-lab__fill--data',
          ]"
          :style="{ width: `${dataPct}%` }"
        />
      </div>
    </div>

    <div class="race-lab__track">
      <div class="race-lab__track-label">
        <span>时间逼近超时闸</span>
        <code>{{ (elapsed / 1000).toFixed(1) }}s / {{ (timeoutMs / 1000).toFixed(1) }}s</code>
      </div>
      <div class="race-lab__bar">
        <div
          :class="[
            'race-lab__fill',
            phase === 'timeout'
              ? 'race-lab__fill--timeout'
              : 'race-lab__fill--time',
          ]"
          :style="{ width: `${timePct}%` }"
        />
      </div>
    </div>

    <div :class="['race-lab__status', `race-lab__status--${phase}`]">
      <code v-if="errorName" class="race-lab__errname">{{ errorName }}</code>
      <code v-else-if="phase === 'done'" class="race-lab__errname">fulfilled</code>
      <span>{{ statusText }}</span>
    </div>

    <p class="race-lab__legend">
      两个信号经 <code>AbortSignal.any()</code> 合并交给读取过程；reason
      取第一个触发的源信号——琥珀 = AbortError（取消），玫红 =
      TimeoutError（超时），绿 = 正常完成。
    </p>
  </section>
</template>

<style scoped>
.race-lab {
  display: grid;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.race-lab__controls {
  display: grid;
  align-items: center;
  gap: 12px;
  grid-template-columns: auto auto 1fr;
}

.race-lab__btn {
  min-height: 38px;
  padding: 6px 18px;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.race-lab__btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.race-lab__btn--start {
  color: #052e16;
  background: #4ade80;
}

.race-lab__btn--abort {
  color: #fef3c7;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #92400e;
}

.race-lab__slider {
  display: grid;
  gap: 4px;
  justify-items: stretch;
  color: #9ca3af;
  font-size: 13px;
}

.race-lab__slider input {
  width: 100%;
  accent-color: #fbbf24;
}

.race-lab__track {
  display: grid;
  gap: 6px;
}

.race-lab__track-label {
  display: flex;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 13px;
}

.race-lab__track-label code {
  color: #f9fafb;
}

.race-lab__bar {
  height: 14px;
  overflow: hidden;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 999px;
}

.race-lab__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.12s linear;
}

.race-lab__fill--data {
  background: #60a5fa;
}

.race-lab__fill--done {
  background: #34d399;
}

.race-lab__fill--time {
  background: #fbbf24;
}

.race-lab__fill--timeout {
  background: #fb7185;
}

.race-lab__status {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 10px 14px;
  background: #0f172a;
  border-left: 4px solid #64748b;
  border-radius: 4px;
}

.race-lab__status--running {
  border-left-color: #60a5fa;
}

.race-lab__status--done {
  border-left-color: #34d399;
}

.race-lab__status--aborted {
  border-left-color: #fbbf24;
}

.race-lab__status--timeout {
  border-left-color: #fb7185;
}

.race-lab__errname {
  padding: 4px 10px;
  color: #0f172a;
  font-weight: 800;
  background: #94a3b8;
  border-radius: 4px;
}

.race-lab__status--done .race-lab__errname {
  background: #34d399;
}

.race-lab__status--aborted .race-lab__errname {
  background: #fbbf24;
}

.race-lab__status--timeout .race-lab__errname {
  background: #fb7185;
}

.race-lab__legend {
  margin: 0;
  color: #9ca3af;
  font-size: 12.5px;
  line-height: 1.5;
}

.race-lab__legend code {
  color: #fbbf24;
}
</style>
