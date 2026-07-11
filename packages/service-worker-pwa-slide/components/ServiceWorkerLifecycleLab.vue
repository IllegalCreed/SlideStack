<script setup lang="ts">
import { computed, ref } from "vue";

/**
 * Service Worker 生命周期状态机实验室（纯前端模拟）
 * 不注册真实 SW（headless 沙箱注册 SW 不稳），全部逻辑在组件内的响应式状态上跑，
 * 不触碰 window / navigator / document，天然 SSR 安全。
 * 演示四条路径：首次安装直接 activate、有旧 SW 新版进 waiting、
 * skipWaiting 跳过等待、关闭所有受控标签才激活。
 */

/** SW 状态（对应 ServiceWorker.state 与 registration 的三个槽位） */
type SwState = "installing" | "waiting" | "activating" | "activated" | "redundant";

/** 模拟中的一个 Service Worker 实例 */
interface SimWorker {
  id: number; // 唯一 id
  version: number; // 版本号，每次“部署有变化的 sw.js”递增
  state: SwState; // 当前状态
  skipWaiting: boolean; // 本实例是否在 install 里调用 self.skipWaiting()
}

/** 事件日志条目：还原每一步触发的生命周期事件 */
interface LogEntry {
  seq: number;
  tag: string; // 事件名（install / activate / statechange / skipWaiting…）
  tone: "blue" | "green" | "amber" | "violet" | "red" | "muted";
  note: string; // 该事件的说明
}

/** 状态机轨道的四个主态（redundant 单列在侧） */
const STAGES: { key: SwState; title: string; sub: string; transient: boolean }[] = [
  { key: "installing", title: "installing", sub: "download + install 事件", transient: true },
  { key: "waiting", title: "installed (waiting)", sub: "有旧 SW 时排队", transient: false },
  { key: "activating", title: "activating", sub: "activate 事件", transient: true },
  { key: "activated", title: "activated", sub: "接管 fetch / push", transient: false },
];

// —— 响应式状态：全部在组件内，无任何浏览器全局访问 ——
const workers = ref<SimWorker[]>([]); // 现存的所有 SW（含已作废）
const controlledTabs = ref<number>(1); // 当前 active SW 控制的标签数（初始 1 个页面开着）
const skipNext = ref<boolean>(false); // 下次部署的 SW 是否在 install 里 skipWaiting
const log = ref<LogEntry[]>([]); // 事件日志（最新在前）
let nextId = 1;
let nextVersion = 1;
let seq = 1;

/** registration 的三个槽位：同一时刻各至多一个 */
const active = computed(() => workers.value.find((w) => w.state === "activated"));
const waiting = computed(() => workers.value.find((w) => w.state === "waiting"));
const redundant = computed(() => workers.value.filter((w) => w.state === "redundant"));

/** 某状态当前占用的 worker（用于轨道高亮 + 版本徽标） */
function occupant(state: SwState): SimWorker | undefined {
  return workers.value.find((w) => w.state === state);
}

/** 日志倒序展示（最新事件在最上，无需滚动即见） */
const logView = computed(() => [...log.value].reverse());

/** 追加一条事件日志 */
function record(tag: string, tone: LogEntry["tone"], note: string): void {
  log.value.push({ seq: seq++, tag, tone, note });
}

/** 走完 activate → activated（含收尸旧缓存与 clients.claim 最佳实践） */
function activate(worker: SimWorker, why: string): void {
  worker.state = "activating";
  record("activate", "green", `v${worker.version} activate 事件 · statechange → activating`);
  worker.state = "activated";
  if (controlledTabs.value > 0) {
    record("clients.claim()", "green", `v${worker.version} 立即接管 ${controlledTabs.value} 个已打开标签`);
  } else {
    record("clients.claim()", "muted", `v${worker.version} 已激活；当前无标签打开，下次导航即受控`);
  }
  record("activated", "green", `v${worker.version} statechange → activated（${why}）`);
}

/** 部署一版内容有变化的 sw.js —— 字节比对有差异，触发更新 */
function deploy(): void {
  const version = nextVersion++;
  const worker: SimWorker = {
    id: nextId++,
    version,
    state: "installing",
    skipWaiting: skipNext.value,
  };

  // 已有 waiting 的 SW 会被这次新版本替换、作废
  const prevWaiting = waiting.value;
  if (prevWaiting) {
    prevWaiting.state = "redundant";
    record("redundant", "red", `v${prevWaiting.version} 被更新的 SW 替换 → redundant`);
  }

  const oldActive = active.value;
  const hasController = !!oldActive && controlledTabs.value > 0;

  workers.value.push(worker);
  record("download", "muted", `逐字节比对 sw.js：有差异 → 抓取 v${version} 脚本`);
  record("install", "blue", `v${version} install 事件 · statechange → installing`);
  record("installed", "blue", `v${version} 预缓存完成（waitUntil resolve）· statechange → installed`);

  if (!hasController) {
    // 首次安装：没有旧 SW 在控制页面 → 直接激活接管
    if (oldActive) oldActive.state = "redundant";
    activate(worker, "无旧 SW 控制页面 → 直接激活");
    return;
  }

  if (worker.skipWaiting) {
    // 有旧 SW，但 install 里调了 skipWaiting → 跳过 waiting、立即激活
    record("skipWaiting()", "violet", `v${version} 调用 self.skipWaiting() → 跳过 waiting`);
    oldActive!.state = "redundant";
    record("redundant", "red", `旧 v${oldActive!.version} 被替换 → statechange → redundant`);
    activate(worker, "skipWaiting 生效，不等标签关闭");
    return;
  }

  // 有旧 SW 且未 skipWaiting → 进入 waiting 排队（默认行为）
  worker.state = "waiting";
  record(
    "waiting",
    "amber",
    `旧 v${oldActive!.version} 仍控制 ${controlledTabs.value} 个标签 → v${version} 进入 waiting 排队`,
  );
}

/** 重新部署字节完全相同的 sw.js —— 不触发更新 */
function deploySame(): void {
  record("no-op", "muted", "逐字节比对 sw.js：无差异 → 不触发更新、不安装新 SW");
}

/** 关闭一个受控标签；关到 0 且有 waiting 时，waiting 的 SW 激活接管 */
function closeTab(): void {
  if (controlledTabs.value <= 0) return;
  controlledTabs.value--;
  record("tab close", "muted", `关闭 1 个受控标签 → 剩余 ${controlledTabs.value} 个`);
  if (controlledTabs.value === 0 && waiting.value) {
    const w = waiting.value;
    const old = active.value;
    if (old) {
      old.state = "redundant";
      record("redundant", "red", `所有标签关闭，旧 v${old.version} → redundant`);
    }
    activate(w, "所有受控标签关闭 → waiting 的 SW 激活");
  }
}

/** 打开一个标签（由当前 active SW 控制） */
function openTab(): void {
  controlledTabs.value++;
  const who = active.value ? `，由 v${active.value.version} 控制` : "（尚无 SW 控制）";
  record("tab open", "muted", `打开 1 个标签${who} → 共 ${controlledTabs.value} 个`);
}

/** 重置到初始态 */
function reset(): void {
  workers.value = [];
  controlledTabs.value = 1;
  skipNext.value = false;
  log.value = [];
  nextId = 1;
  nextVersion = 1;
  seq = 1;
}

/** 底部“下一步建议”——把四条演示路径串成可跟随的剧本 */
const hint = computed<string>(() => {
  if (!active.value && !waiting.value) return "剧本①：点「部署新版」——无旧 SW，新版直接 activate 接管";
  if (waiting.value) return "剧本④：连点「关闭标签」到 0——waiting 的新版才激活（普通刷新不算关闭）";
  if (active.value && !skipNext.value) return "剧本②：再点「部署新版」——有旧 SW，新版进 waiting 排队";
  return "剧本③：已勾选 skipWaiting，点「部署新版」——跳过 waiting 立即接管";
});
</script>

<template>
  <section class="sw-lab" aria-label="Service Worker 生命周期状态机实验室">
    <!-- 状态机轨道：高亮当前占用的状态，显示版本徽标 -->
    <div class="sw-lab__track">
      <template v-for="(stage, i) in STAGES" :key="stage.key">
        <div
          :class="[
            'sw-lab__stage',
            { 'is-active': !!occupant(stage.key), 'is-transient': stage.transient },
          ]"
        >
          <span class="sw-lab__badge" v-if="occupant(stage.key)">v{{ occupant(stage.key)!.version }}</span>
          <code>{{ stage.title }}</code>
          <span class="sw-lab__sub">{{ stage.sub }}</span>
        </div>
        <span v-if="i < STAGES.length - 1" class="sw-lab__arrow">→</span>
      </template>
      <span class="sw-lab__arrow">⤵</span>
      <div :class="['sw-lab__stage', 'sw-lab__stage--redundant', { 'is-active': redundant.length > 0 }]">
        <span class="sw-lab__badge" v-if="redundant.length">×{{ redundant.length }}</span>
        <code>redundant</code>
        <span class="sw-lab__sub">被替换 / 作废</span>
      </div>
    </div>

    <div class="sw-lab__body">
      <!-- 左：控制面板 -->
      <div class="sw-lab__panel">
        <div class="sw-lab__status">
          <span
            >控制中：<strong>{{ active ? `v${active.version}` : "无" }}</strong></span
          >
          <span
            >受控标签：<strong>{{ controlledTabs }}</strong></span
          >
          <span
            >waiting：<strong>{{ waiting ? `v${waiting.version}` : "无" }}</strong></span
          >
        </div>

        <label class="sw-lab__skip">
          <input type="checkbox" v-model="skipNext" />
          <span>install 里调用 <code>self.skipWaiting()</code></span>
        </label>

        <div class="sw-lab__btns">
          <button type="button" class="sw-lab__btn sw-lab__btn--primary" @click="deploy">
            部署新版 sw.js
          </button>
          <button type="button" class="sw-lab__btn" @click="deploySame">部署相同 sw.js</button>
          <button type="button" class="sw-lab__btn" :disabled="controlledTabs <= 0" @click="closeTab">
            关闭标签
          </button>
          <button type="button" class="sw-lab__btn" @click="openTab">打开标签</button>
          <button type="button" class="sw-lab__btn sw-lab__btn--ghost" @click="reset">重置</button>
        </div>

        <p class="sw-lab__hint">{{ hint }}</p>
      </div>

      <!-- 右：事件日志（最新在上） -->
      <div class="sw-lab__log">
        <div v-if="!logView.length" class="sw-lab__empty">
          点「部署新版 sw.js」开始——每一步触发的 install / activate / statechange 事件都会记在这里
        </div>
        <div v-for="entry in logView" :key="entry.seq" class="sw-lab__line">
          <span :class="['sw-lab__chip', `sw-lab__chip--${entry.tone}`]">{{ entry.tag }}</span>
          <span class="sw-lab__note">{{ entry.note }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sw-lab {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 406px;
  padding: 12px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

/* ——— 状态机轨道 ——— */
.sw-lab__track {
  display: grid;
  grid-template-columns: 1fr 16px 1.15fr 16px 1fr 16px 1fr 18px 0.86fr;
  align-items: stretch;
  gap: 4px;
}

.sw-lab__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 6px;
  text-align: center;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
}

.sw-lab__stage.is-transient {
  border-style: dashed;
}

.sw-lab__stage.is-active {
  background: #0b3b2e;
  border-color: #34d399;
  border-style: solid;
}

.sw-lab__stage--redundant.is-active {
  background: #3f1d24;
  border-color: #fb7185;
}

.sw-lab__stage code {
  color: #f9fafb;
  font-size: 0.76rem;
  font-weight: 700;
}

.sw-lab__sub {
  color: #9ca3af;
  font-size: 0.62rem;
  line-height: 1.2;
}

.sw-lab__badge {
  position: absolute;
  top: -8px;
  right: -6px;
  padding: 1px 6px;
  color: #062018;
  font-size: 0.62rem;
  font-weight: 800;
  background: #34d399;
  border-radius: 999px;
}

.sw-lab__stage--redundant .sw-lab__badge {
  color: #3f1120;
  background: #fb7185;
}

.sw-lab__arrow {
  align-self: center;
  justify-self: center;
  color: #6b7280;
  font-size: 0.85rem;
}

/* ——— 主体：控制面板 + 日志 ——— */
.sw-lab__body {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.sw-lab__panel {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-height: 0;
}

.sw-lab__status {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 8px 10px;
  font-size: 0.72rem;
  color: #cbd5e1;
  background: #0f172a;
  border-left: 3px solid #60a5fa;
  border-radius: 4px;
}

.sw-lab__status strong {
  color: #f9fafb;
}

.sw-lab__skip {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 7px 10px;
  font-size: 0.72rem;
  color: #d1d5db;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
  cursor: pointer;
}

.sw-lab__skip code {
  color: #a78bfa;
  font-size: 0.7rem;
}

.sw-lab__btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.sw-lab__btn {
  padding: 8px 6px;
  color: #e5e7eb;
  font-size: 0.72rem;
  font-weight: 600;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 6px;
  cursor: pointer;
}

.sw-lab__btn:hover:not(:disabled) {
  background: #4b5563;
}

.sw-lab__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sw-lab__btn--primary {
  grid-column: 1 / -1;
  color: #052e2b;
  background: #34d399;
  border-color: #34d399;
}

.sw-lab__btn--primary:hover:not(:disabled) {
  background: #6ee7b7;
}

.sw-lab__btn--ghost {
  background: transparent;
}

.sw-lab__hint {
  margin: 0;
  padding: 7px 10px;
  color: #fcd34d;
  font-size: 0.68rem;
  line-height: 1.35;
  background: rgba(251, 191, 36, 0.08);
  border-left: 3px solid #fbbf24;
  border-radius: 4px;
}

.sw-lab__log {
  min-height: 0;
  padding: 8px;
  overflow-y: auto;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.sw-lab__empty {
  padding: 10px;
  color: #6b7280;
  font-size: 0.72rem;
  line-height: 1.5;
}

.sw-lab__line {
  display: flex;
  gap: 7px;
  align-items: baseline;
  padding: 3px 0;
  border-bottom: 1px dashed #1e293b;
}

.sw-lab__chip {
  flex: 0 0 auto;
  min-width: 64px;
  padding: 1px 6px;
  color: #062018;
  font-size: 0.62rem;
  font-weight: 700;
  text-align: center;
  border-radius: 3px;
}

.sw-lab__chip--blue {
  background: #60a5fa;
}
.sw-lab__chip--green {
  background: #34d399;
}
.sw-lab__chip--amber {
  color: #3a2606;
  background: #fbbf24;
}
.sw-lab__chip--violet {
  color: #21103f;
  background: #a78bfa;
}
.sw-lab__chip--red {
  color: #3f1120;
  background: #fb7185;
}
.sw-lab__chip--muted {
  color: #e5e7eb;
  background: #4b5563;
}

.sw-lab__note {
  color: #cbd5e1;
  font-size: 0.68rem;
  line-height: 1.35;
}
</style>
