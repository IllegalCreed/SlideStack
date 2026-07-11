<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

/**
 * Worker 卸载实验室
 * 用同一段 CPU 密集计算（试除法数素数）跑两条路径，直观对比「主线程被不被阻塞」：
 *   路径一「主线程直接算」——同步跑在主线程，期间 requestAnimationFrame 无法触发，
 *          界面心跳（旋转方块 + 帧计数）冻结，实测「期间推进 0 帧」；
 *   路径二「丢给 Worker 算」——真实 Web Worker（内联 Blob）跑同一段计算，主线程空闲，
 *          rAF 持续触发，界面心跳流畅，实测「期间推进数十帧」。
 * SSR 安全：顶层零 window/Worker 访问；Worker 只在按钮回调里用 Blob 创建，收到结果即 terminate；
 *          rAF 循环在 onMounted 启动、onUnmounted 取消并清理 Worker 与对象 URL。
 */

/** 计算规模：数 [2, LIMIT) 内的素数个数——够重才能看出主线程卡顿（约数百 ms） */
const LIMIT = 3000000;

const supported = ref(true); // 当前环境是否支持 Web Worker
const angle = ref(0); // rAF 驱动的旋转角度（JS 驱动，主线程一卡就停）
const heartbeat = ref(0); // rAF 帧计数：界面「心跳」，冻结即停止跳动
const runningMain = ref(false); // 主线程路径进行中
const runningWorker = ref(false); // Worker 路径进行中

// 主线程路径结果
const mainMs = ref(0); // 计算用时
const mainFrames = ref(-1); // 计算期间界面推进的帧数（≈0 表示冻结）
const mainPrimes = ref(0); // 素数个数（两路径应一致，佐证做了同样的活）

// Worker 路径结果
const workerMs = ref(0);
const workerFrames = ref(-1); // 计算期间界面推进的帧数（数十 表示未阻塞）
const workerPrimes = ref(0);

/** rAF 句柄与 Worker/URL 句柄：非响应式，避免把宿主对象塞进 Vue 响应系统 */
let rafId = 0;
let worker: Worker | null = null;
let blobUrl = "";

/** 试除法数素数——主线程路径用；worker 里内联同一段逻辑（保证两路径算的是同一件事） */
function countPrimes(limit: number): number {
  let count = 0;
  for (let n = 2; n < limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return count;
}

/** 界面心跳：每个动画帧推进角度与帧计数——主线程一旦被同步计算占住，这里就停跳 */
function tick() {
  angle.value = (angle.value + 6) % 360;
  heartbeat.value += 1;
  rafId = requestAnimationFrame(tick);
}

/** 路径一：主线程直接算——同步占用主线程，界面心跳冻结 */
function runMain() {
  if (runningMain.value || runningWorker.value) return;
  runningMain.value = true;
  mainFrames.value = -1;
  // 先让「运行中」状态渲染出来，再在下一帧真正开跑，这样能看清心跳被卡住的瞬间
  window.setTimeout(() => {
    const framesBefore = heartbeat.value;
    const t0 = performance.now();
    const primes = countPrimes(LIMIT); // 同步重计算：期间 rAF 无法触发
    mainMs.value = Math.round(performance.now() - t0);
    // 同步循环期间心跳一次都没跳，差值≈0，正是「主线程被阻塞」的铁证
    mainFrames.value = heartbeat.value - framesBefore;
    mainPrimes.value = primes;
    runningMain.value = false;
  }, 60);
}

/** 路径二：丢给 Worker 算——真实后台线程，主线程空闲，界面心跳照常 */
function runWorker() {
  if (runningMain.value || runningWorker.value) return;
  if (!supported.value) return;
  runningWorker.value = true;
  workerFrames.value = -1;

  // 内联 Blob worker：把同一段素数计算放进后台线程（SSR 安全——只在此回调内触碰 Worker）
  const code = `
    self.onmessage = (e) => {
      const limit = e.data;
      let count = 0;
      for (let n = 2; n < limit; n++) {
        let isPrime = true;
        for (let d = 2; d * d <= n; d++) {
          if (n % d === 0) { isPrime = false; break; }
        }
        if (isPrime) count++;
      }
      self.postMessage(count);
    };
  `;
  const blob = new Blob([code], { type: "text/javascript" });
  blobUrl = URL.createObjectURL(blob);
  worker = new Worker(blobUrl);

  const framesBefore = heartbeat.value;
  const t0 = performance.now();

  worker.onmessage = (e: MessageEvent<number>) => {
    workerMs.value = Math.round(performance.now() - t0);
    // 计算在后台跑，这段时间主线程空闲、心跳照跳——差值是数十帧，证明主线程没被阻塞
    workerFrames.value = heartbeat.value - framesBefore;
    workerPrimes.value = e.data;
    runningWorker.value = false;
    cleanupWorker(); // 用完即弃：terminate + 释放对象 URL
  };
  worker.onerror = () => {
    runningWorker.value = false;
    cleanupWorker();
  };

  worker.postMessage(LIMIT); // 立即返回，主线程继续跑心跳
}

/** 关闭并释放 worker 资源 */
function cleanupWorker() {
  worker?.terminate();
  worker = null;
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
    blobUrl = "";
  }
}

onMounted(() => {
  // SSR 安全：仅客户端挂载后才探测能力、启动心跳
  supported.value = typeof Worker !== "undefined";
  rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  cleanupWorker();
});
</script>

<template>
  <section class="wk-lab" aria-label="Worker 卸载实验">
    <!-- 界面心跳：JS 驱动的旋转方块 + 帧计数；主线程一卡，这里立刻停 -->
    <div class="wk-lab__pulse">
      <div class="wk-lab__spinner" :style="{ transform: `rotate(${angle}deg)` }" />
      <div class="wk-lab__beat">
        <span class="wk-lab__beat-label">界面心跳</span>
        <code class="wk-lab__beat-num" data-testid="heartbeat">{{ heartbeat }}</code>
      </div>
      <div class="wk-lab__controls">
        <button
          type="button"
          class="wk-lab__btn wk-lab__btn--bad"
          data-testid="run-main"
          :disabled="runningMain || runningWorker"
          @click="runMain"
        >
          ① 主线程直接算
        </button>
        <button
          type="button"
          class="wk-lab__btn wk-lab__btn--ok"
          data-testid="run-worker"
          :disabled="runningMain || runningWorker || !supported"
          @click="runWorker"
        >
          ② 丢给 Worker 算
        </button>
      </div>
    </div>

    <p v-if="!supported" class="wk-lab__unsupported">当前环境不支持 Web Worker，无法运行本实验。</p>

    <div v-else class="wk-lab__results">
      <!-- 主线程路径 -->
      <div class="wk-lab__card wk-lab__card--bad" data-testid="main-card">
        <div class="wk-lab__card-head">
          <span class="wk-lab__tag wk-lab__tag--bad">主线程</span>
          <span class="wk-lab__card-title">同步占用主线程</span>
        </div>
        <div class="wk-lab__metric">
          <span>用时</span>
          <code data-testid="main-ms">{{ mainMs ? `${mainMs} ms` : "—" }}</code>
        </div>
        <div class="wk-lab__metric">
          <span>计算期间界面推进</span>
          <code data-testid="main-frames">{{ mainFrames < 0 ? "—" : `${mainFrames} 帧` }}</code>
        </div>
        <div v-if="mainFrames >= 0" class="wk-lab__verdict wk-lab__verdict--bad">
          UI 冻结：心跳几乎停跳，点击/动画全卡住
        </div>
      </div>

      <!-- Worker 路径 -->
      <div class="wk-lab__card wk-lab__card--ok" data-testid="worker-card">
        <div class="wk-lab__card-head">
          <span class="wk-lab__tag wk-lab__tag--ok">Worker</span>
          <span class="wk-lab__card-title">后台线程并行算</span>
        </div>
        <div class="wk-lab__metric">
          <span>用时</span>
          <code data-testid="worker-ms">{{ workerMs ? `${workerMs} ms` : "—" }}</code>
        </div>
        <div class="wk-lab__metric">
          <span>计算期间界面推进</span>
          <code data-testid="worker-frames">{{
            workerFrames < 0 ? "—" : `${workerFrames} 帧`
          }}</code>
        </div>
        <div v-if="workerFrames >= 0" class="wk-lab__verdict wk-lab__verdict--ok">
          UI 流畅：心跳照跳，主线程全程能响应用户
        </div>
      </div>
    </div>

    <p class="wk-lab__hint">
      同一段计算（数 {{ LIMIT.toLocaleString() }} 内素数），用时相近——差别只在<strong>谁被卡住</strong>。
    </p>
  </section>
</template>

<style scoped>
.wk-lab {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.wk-lab__pulse {
  display: grid;
  align-items: center;
  gap: 16px;
  grid-template-columns: 40px auto 1fr;
}

.wk-lab__spinner {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  border-radius: 7px;
  will-change: transform;
}

.wk-lab__beat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wk-lab__beat-label {
  color: #9ca3af;
  font-size: 11.5px;
}

.wk-lab__beat-num {
  color: #f9fafb;
  font-size: 20px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.wk-lab__controls {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
}

.wk-lab__btn {
  min-height: 40px;
  padding: 8px 14px;
  font-size: 14.5px;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.wk-lab__btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.wk-lab__btn--bad {
  color: #fef2f2;
  background: #b91c1c;
}

.wk-lab__btn--ok {
  color: #052e16;
  background: #4ade80;
}

.wk-lab__unsupported {
  margin: 0;
  color: #9ca3af;
  font-size: 13.5px;
}

.wk-lab__results {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
}

.wk-lab__card {
  display: grid;
  gap: 7px;
  align-content: start;
  padding: 11px 13px;
  background: #0f172a;
  border: 1px solid #334155;
  border-left-width: 4px;
  border-radius: 6px;
  min-height: 132px;
}

.wk-lab__card--bad {
  border-left-color: #fb7185;
}
.wk-lab__card--ok {
  border-left-color: #34d399;
}

.wk-lab__card-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wk-lab__tag {
  padding: 2px 8px;
  font-size: 11.5px;
  font-weight: 800;
  border-radius: 4px;
}

.wk-lab__tag--bad {
  color: #4c0519;
  background: #fb7185;
}
.wk-lab__tag--ok {
  color: #052e16;
  background: #34d399;
}

.wk-lab__card-title {
  color: #cbd5e1;
  font-size: 13px;
}

.wk-lab__metric {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  font-size: 12.5px;
  color: #9ca3af;
}

.wk-lab__metric code {
  color: #f9fafb;
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.wk-lab__verdict {
  margin-top: 2px;
  padding: 6px 9px;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 4px;
}

.wk-lab__verdict--bad {
  color: #fecaca;
  background: rgba(190, 18, 60, 0.28);
}
.wk-lab__verdict--ok {
  color: #bbf7d0;
  background: rgba(5, 150, 105, 0.24);
}

.wk-lab__hint {
  margin: 0;
  color: #94a3b8;
  font-size: 12.5px;
  line-height: 1.45;
}

.wk-lab__hint strong {
  color: #e2e8f0;
}
</style>
