<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";

/**
 * 背压可视化实验室
 *
 * 用【真实 Streams API】搭一条管道：
 *   源 ReadableStream（pull 型，最快每 SRC_INTERVAL ms 产一块，HWM=6）
 *     → 恒等 TransformStream（透传，作管道中段）
 *       → 慢速 WritableStream（sink.write 里 await 定时器模拟下游慢消费，HWM=1）
 *
 * 观众能看到的三件事：
 *   1. 源产出速率（chunks/s）——被反压时会自动降下来
 *   2. 队列水位 desiredSize / highWaterMark——降到 0/负即背压生效
 *   3. 下游消费速率（chunks/s）——由滑杆调下游延迟直接决定
 *
 * SSR 安全：所有流的创建都在「开始」按钮回调里，顶层零 window/stream 访问；
 * 停止 / 卸载时 AbortController.abort() 取消 pipeTo，清掉计时器。
 */

/** 源最快生产间隔（ms）：源的产出速率上限 = 1000 / SRC_INTERVAL ≈ 6.25 块/s */
const SRC_INTERVAL = 160;
/** 源可读流的高水位（能缓冲的块数），desiredSize 从这里往下掉 */
const SRC_HWM = 6;
/** 速率条的满刻度 = 源的理论最大速率 */
const RATE_MAX = 1000 / SRC_INTERVAL;

/** 下游消费延迟（ms）：sink 每写一块要等这么久——滑杆可调 */
const downstreamDelay = ref(420);
const running = ref(false);
const producedTotal = ref(0); // 累计产出块数
const consumedTotal = ref(0); // 累计消费块数
const srcRate = ref(0); // 源产出速率（块/s）
const sinkRate = ref(0); // 下游消费速率（块/s）
const desired = ref(SRC_HWM); // 源可读流当前 desiredSize

// 非响应式句柄：流控制器、取消器、采样计时器与速率滑动窗口
let srcController: ReadableStreamDefaultController<number> | null = null;
let ac: AbortController | null = null;
let ticker: ReturnType<typeof setInterval> | null = null;
let samples: { t: number; p: number; c: number }[] = [];

/** 可被 abort 打断的 sleep：定时器 + 中止即清 */
function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(id);
      resolve();
    }, { once: true });
  });
}

/**
 * 源：pull 型可读流。返回 Promise 的 pull 让浏览器等它兑现再算一轮拉取完成，
 * 于是产出被 SRC_INTERVAL 限速；队列满（desiredSize<=0）时浏览器不再调 pull——
 * 这正是背压：下游慢 → 队列满 → 源被暂停。
 */
function makeSource(signal: AbortSignal): ReadableStream<number> {
  return new ReadableStream<number>(
    {
      start(controller) {
        srcController = controller;
      },
      async pull(controller) {
        await sleep(SRC_INTERVAL, signal);
        if (signal.aborted) return;
        controller.enqueue(producedTotal.value);
        producedTotal.value += 1;
      },
    },
    new CountQueuingStrategy({ highWaterMark: SRC_HWM }),
  );
}

/** 恒等转换流：原样透传，只作为管道中段（真实 TransformStream） */
function makeTransform(): TransformStream<number, number> {
  return new TransformStream<number, number>({
    transform(chunk, controller) {
      controller.enqueue(chunk);
    },
  });
}

/**
 * 慢速写汇：write 里 await 下游延迟再兑现。write 的 Promise 兑现前这块算"在写"，
 * 浏览器不催下一块——可写流的背压就建立在这个 Promise 上。
 */
function makeSlowSink(signal: AbortSignal): WritableStream<number> {
  return new WritableStream<number>(
    {
      async write() {
        await sleep(downstreamDelay.value, signal);
        if (signal.aborted) return;
        consumedTotal.value += 1;
      },
    },
    new CountQueuingStrategy({ highWaterMark: 1 }),
  );
}

/** 每 250ms 采一次样：用 ~1s 滑动窗口算平滑速率，避免逐拍抖到 0 */
function sample() {
  const now = performance.now();
  samples.push({ t: now, p: producedTotal.value, c: consumedTotal.value });
  while (samples.length > 1 && now - samples[0].t > 1100) samples.shift();
  const oldest = samples[0];
  const dt = (now - oldest.t) / 1000;
  if (dt > 0.05) {
    srcRate.value = Math.max(0, (producedTotal.value - oldest.p) / dt);
    sinkRate.value = Math.max(0, (consumedTotal.value - oldest.c) / dt);
  }
  // desiredSize 是活的：HWM − 队列已缓冲块数
  desired.value = srcController?.desiredSize ?? 0;
}

/** 开始：在回调里现造整条管道并跑 pipeThrough → pipeTo */
function start() {
  if (running.value) return;
  ac = new AbortController();
  const signal = ac.signal;
  producedTotal.value = 0;
  consumedTotal.value = 0;
  srcRate.value = 0;
  sinkRate.value = 0;
  desired.value = SRC_HWM;
  samples = [{ t: performance.now(), p: 0, c: 0 }];
  running.value = true;

  // 真实管道：源 → 恒等转换流 → 慢速写汇；signal 可中途取消整条管道
  makeSource(signal)
    .pipeThrough(makeTransform())
    .pipeTo(makeSlowSink(signal), { signal })
    .catch(() => {
      /* abort 会以 AbortError reject，属正常收尾，忽略 */
    });

  ticker = setInterval(sample, 250);
}

/** 停止：取消管道 + 停采样 */
function stop() {
  ac?.abort();
  if (ticker) clearInterval(ticker);
  ticker = null;
  running.value = false;
  srcRate.value = 0;
  sinkRate.value = 0;
  srcController = null;
}

/** 卸载兜底 */
onUnmounted(stop);

// —— 展示派生量 ——
// pull 源被反压时 desiredSize 在 0~1 间抖动、队列长期近满；
// 用"队列缓冲已超过 2/3（desiredSize ≤ 2）"判定背压生效，稳定不闪。
const backpressured = computed(() => running.value && desired.value <= 2);
/** 队列已缓冲块数（近似）= HWM − desiredSize，夹到 0..HWM */
const queued = computed(() =>
  Math.min(SRC_HWM, Math.max(0, SRC_HWM - desired.value)),
);
const queuePct = computed(() => Math.round((queued.value / SRC_HWM) * 100));
const srcPct = computed(() =>
  Math.min(100, Math.round((srcRate.value / RATE_MAX) * 100)),
);
const sinkPct = computed(() =>
  Math.min(100, Math.round((sinkRate.value / RATE_MAX) * 100)),
);
const inflight = computed(() =>
  Math.max(0, producedTotal.value - consumedTotal.value),
);

const statusText = computed(() => {
  if (!running.value) {
    return "待开始：拖慢下游延迟（> 160ms）就能看到背压把源的产出速率压下来";
  }
  if (backpressured.value) {
    return "背压生效：队列近满（desiredSize 逼近 0），源被反压、pull 暂停 → 产出速率被拉到与下游一致";
  }
  return "源自由生产：下游够快、队列有空位（desiredSize 高），源跑在最大速率";
});
</script>

<template>
  <section class="bp-lab" aria-label="背压可视化实验">
    <div class="bp-lab__controls">
      <button
        type="button"
        class="bp-lab__btn bp-lab__btn--start"
        :disabled="running"
        @click="start"
      >
        开始
      </button>
      <button
        type="button"
        class="bp-lab__btn bp-lab__btn--stop"
        :disabled="!running"
        @click="stop"
      >
        停止 / abort()
      </button>
      <label class="bp-lab__slider">
        <span>下游消费延迟 sink.write 里 await {{ downstreamDelay }}ms</span>
        <input
          v-model.number="downstreamDelay"
          type="range"
          min="80"
          max="1400"
          step="20"
        />
      </label>
    </div>

    <div class="bp-lab__pipe">
      <span class="bp-lab__pipe-node">源 ReadableStream</span>
      <span class="bp-lab__pipe-arrow">▸ HWM 6 ▸</span>
      <span class="bp-lab__pipe-node">恒等 TransformStream</span>
      <span class="bp-lab__pipe-arrow">▸ HWM 1 ▸</span>
      <span class="bp-lab__pipe-node bp-lab__pipe-node--sink">慢速 WritableStream</span>
    </div>

    <div class="bp-lab__track">
      <div class="bp-lab__track-label">
        <span>源产出速率</span>
        <code>{{ srcRate.toFixed(1) }} 块/s</code>
      </div>
      <div class="bp-lab__bar">
        <div
          :class="['bp-lab__fill', backpressured ? 'bp-lab__fill--src-slow' : 'bp-lab__fill--src']"
          :style="{ width: `${srcPct}%` }"
        />
      </div>
    </div>

    <div class="bp-lab__track">
      <div class="bp-lab__track-label">
        <span>队列水位 desiredSize = {{ desired }} / HWM {{ SRC_HWM }}（在途未消费 {{ inflight }} 块）</span>
        <code>{{ queuePct }}%</code>
      </div>
      <div class="bp-lab__bar">
        <div
          :class="['bp-lab__fill', backpressured ? 'bp-lab__fill--queue-full' : 'bp-lab__fill--queue']"
          :style="{ width: `${queuePct}%` }"
        />
      </div>
    </div>

    <div class="bp-lab__track">
      <div class="bp-lab__track-label">
        <span>下游消费速率</span>
        <code>{{ sinkRate.toFixed(1) }} 块/s</code>
      </div>
      <div class="bp-lab__bar">
        <div
          class="bp-lab__fill bp-lab__fill--sink"
          :style="{ width: `${sinkPct}%` }"
        />
      </div>
    </div>

    <div :class="['bp-lab__status', backpressured ? 'bp-lab__status--pressed' : running ? 'bp-lab__status--free' : 'bp-lab__status--idle']">
      <code>{{ backpressured ? "BACKPRESSURE" : running ? "FLOWING" : "IDLE" }}</code>
      <span>{{ statusText }}</span>
    </div>

    <p class="bp-lab__legend">
      源是 pull 型可读流：队列满（<code>desiredSize ≤ 0</code>）时浏览器不再调
      <code>pull</code>，产出被反压压到与下游一致——玫红 = 背压生效，蓝 =
      源自由生产。全程真实 <code>ReadableStream</code> ·
      <code>TransformStream</code> · <code>WritableStream</code>，用后 abort。
    </p>
  </section>
</template>

<style scoped>
.bp-lab {
  display: grid;
  gap: 11px;
  width: 100%;
  padding: 14px 18px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.bp-lab__controls {
  display: grid;
  align-items: center;
  gap: 12px;
  grid-template-columns: auto auto 1fr;
}

.bp-lab__btn {
  min-height: 36px;
  padding: 5px 18px;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.bp-lab__btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.bp-lab__btn--start {
  color: #052e16;
  background: #4ade80;
}

.bp-lab__btn--stop {
  color: #fee2e2;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #9f1239;
}

.bp-lab__slider {
  display: grid;
  gap: 3px;
  color: #9ca3af;
  font-size: 12.5px;
}

.bp-lab__slider input {
  width: 100%;
  accent-color: #fb7185;
}

.bp-lab__pipe {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 7px 10px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  font-size: 12px;
}

.bp-lab__pipe-node {
  padding: 4px 9px;
  color: #dbeafe;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #1e293b;
  border: 1px solid #3b4a63;
  border-radius: 5px;
}

.bp-lab__pipe-node--sink {
  color: #fecdd3;
  border-color: #9f1239;
}

.bp-lab__pipe-arrow {
  color: #64748b;
  font-size: 11px;
}

.bp-lab__track {
  display: grid;
  gap: 5px;
}

.bp-lab__track-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #9ca3af;
  font-size: 12.5px;
}

.bp-lab__track-label code {
  color: #f9fafb;
  white-space: nowrap;
}

.bp-lab__bar {
  height: 13px;
  overflow: hidden;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 999px;
}

.bp-lab__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.22s linear;
}

.bp-lab__fill--src {
  background: #60a5fa;
}
.bp-lab__fill--src-slow {
  background: #fb7185;
}
.bp-lab__fill--queue {
  background: #38bdf8;
}
.bp-lab__fill--queue-full {
  background: #fb7185;
}
.bp-lab__fill--sink {
  background: #fbbf24;
}

.bp-lab__status {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 8px 14px;
  background: #0f172a;
  border-left: 4px solid #64748b;
  border-radius: 4px;
  font-size: 12.5px;
}

.bp-lab__status code {
  padding: 3px 9px;
  color: #0f172a;
  font-weight: 800;
  background: #94a3b8;
  border-radius: 4px;
  white-space: nowrap;
}

.bp-lab__status--free {
  border-left-color: #60a5fa;
}
.bp-lab__status--free code {
  background: #60a5fa;
}
.bp-lab__status--pressed {
  border-left-color: #fb7185;
}
.bp-lab__status--pressed code {
  color: #fee2e2;
  background: #9f1239;
}

.bp-lab__legend {
  margin: 0;
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.5;
}

.bp-lab__legend code {
  color: #fbbf24;
}
</style>
