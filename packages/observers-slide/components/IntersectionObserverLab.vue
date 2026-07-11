<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";

/** 单张被观察卡片的实时视图模型 */
interface CardView {
  /** 卡片序号（从 1 起，仅展示用） */
  id: number;
  /** 当前交叉比例 0~1，来自 entry.intersectionRatio */
  ratio: number;
  /** 当前是否相交，来自 entry.isIntersecting */
  isIntersecting: boolean;
}

/** 卡片总数：足够多以便在容器内滚动进出 */
const CARD_COUNT = 8;

/** 密集阈值：0 / 0.05 / … / 1 共 21 档，让 intersectionRatio 随滚动平滑刷新 */
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/** 每张卡片的实时状态（reactive 数组，逐字段可响应） */
const cards = reactive<CardView[]>(
  Array.from({ length: CARD_COUNT }, (_, i) => ({
    id: i + 1,
    ratio: 0,
    isIntersecting: false,
  })),
);

/** threshold 命中阈值：可见比例 ≥ 它才算「命中/曝光」，滑杆取 0 / 0.5 / 1 */
const gate = ref(0);
/** 可选的阈值档位 */
const gateOptions = [0, 0.5, 1] as const;

/** rootMargin 输入（CSS 边距语法，仅 px/%）；正值提前触发 */
const rootMargin = ref("0px");
/** rootMargin 是否合法——非法值会让 IO 构造抛错 */
const marginValid = ref(true);

/** 回调触发次数（真实 IntersectionObserver 回调被调用的计数） */
const callbackCount = ref(0);
/** 已处理 entry 的累计条数 */
const entryCount = ref(0);

/** 滚动容器 = IntersectionObserver 的 root；DOM 引用只在挂载后可用 */
const rootRef = ref<HTMLElement | null>(null);

/** 观察器实例：普通变量而非响应式，不参与渲染 */
let observer: IntersectionObserver | null = null;

/** 当前命中卡片数：相交且比例达到 gate */
const hitCount = computed(
  () => cards.filter((c) => c.isIntersecting && c.ratio >= gate.value).length,
);

/** 判断单卡是否命中当前阈值（模板高亮用） */
function isHit(card: CardView): boolean {
  return card.isIntersecting && card.ratio >= gate.value;
}

/** IO 回调：一批 entries 同步更新对应卡片的比例与相交态 */
function handleIntersect(entries: IntersectionObserverEntry[]): void {
  callbackCount.value += 1;
  entryCount.value += entries.length;
  for (const entry of entries) {
    // 用 data-io-index 定位是哪张卡片
    const idx = Number((entry.target as HTMLElement).dataset.ioIndex);
    const card = cards[idx];
    if (!card) continue;
    card.ratio = entry.intersectionRatio;
    card.isIntersecting = entry.isIntersecting;
  }
}

/**
 * 用当前 root / rootMargin 重建观察器。
 * IO 配置构造后不可改，改 rootMargin 只能新建——这里正是那条规则的现场演示。
 */
function rebuild(): void {
  // 顶层零 window 访问：仅在浏览器且 API 存在时构建，保证 SSR 安全
  if (typeof IntersectionObserver === "undefined" || !rootRef.value) return;
  observer?.disconnect();
  try {
    observer = new IntersectionObserver(handleIntersect, {
      root: rootRef.value, // 以滚动容器为 root，组件内自成一体
      rootMargin: rootMargin.value, // 非法值会在此抛错
      threshold: THRESHOLDS,
    });
    marginValid.value = true;
  } catch {
    // rootMargin 非法：保留上一台观察器，标记错误
    marginValid.value = false;
    return;
  }
  // 一个观察器接管容器内全部卡片
  const els = rootRef.value.querySelectorAll<HTMLElement>("[data-io-card]");
  for (const el of els) observer.observe(el);
}

// rootMargin 变化即重建——真实体现「换配置＝换观察器」
watch(rootMargin, rebuild);

onMounted(rebuild);
// 卸载断开，避免观察器持有 DOM 引用造成泄漏
onUnmounted(() => observer?.disconnect());
</script>

<template>
  <section class="io-lab" aria-label="IntersectionObserver 交互实验室">
    <!-- 左：控制与实时状态 -->
    <div class="io-lab__panel">
      <div class="io-lab__group">
        <span class="io-lab__label">threshold 命中阈值</span>
        <div class="io-lab__seg" role="group" aria-label="threshold 阈值">
          <button
            v-for="g in gateOptions"
            :key="g"
            type="button"
            :class="['io-lab__segbtn', { 'io-lab__segbtn--active': gate === g }]"
            :aria-pressed="gate === g"
            @click="gate = g"
          >
            {{ g }}
          </button>
        </div>
      </div>

      <div class="io-lab__group">
        <label class="io-lab__label" for="io-rm">rootMargin</label>
        <input
          id="io-rm"
          v-model="rootMargin"
          class="io-lab__input"
          spellcheck="false"
          :aria-invalid="!marginValid"
        />
        <p class="io-lab__tip">
          仅 px / %，正值提前触发；改它＝新建观察器（IO 构造后不可改）
          <span v-if="!marginValid" class="io-lab__err">· 值非法，保留上一台</span>
        </p>
      </div>

      <dl class="io-lab__stats">
        <div><dt>回调触发</dt><dd>{{ callbackCount }} 次</dd></div>
        <div><dt>处理 entry</dt><dd>{{ entryCount }} 条</dd></div>
        <div><dt>当前命中</dt><dd>{{ hitCount }} / {{ CARD_COUNT }}</dd></div>
      </dl>

      <p class="io-lab__hint">
        滚动右侧列表 → 看 ratio 随可见比例连续变化、命中集合随阈值切换
      </p>
    </div>

    <!-- 右：滚动容器 = IntersectionObserver 的 root -->
    <div ref="rootRef" class="io-lab__scroll">
      <div class="io-lab__spacer">root 顶部 · 向下滚动</div>
      <article
        v-for="(card, i) in cards"
        :key="card.id"
        :data-io-card="true"
        :data-io-index="i"
        :class="['io-lab__card', { 'io-lab__card--hit': isHit(card) }]"
      >
        <header class="io-lab__cardhead">
          <span class="io-lab__cardno">#{{ card.id }}</span>
          <span
            :class="[
              'io-lab__badge',
              card.isIntersecting ? 'io-lab__badge--in' : 'io-lab__badge--out',
            ]"
          >
            {{ card.isIntersecting ? "isIntersecting" : "已离开" }}
          </span>
          <span class="io-lab__ratio">ratio {{ card.ratio.toFixed(2) }}</span>
        </header>
        <div class="io-lab__bar" aria-hidden="true">
          <div class="io-lab__barfill" :style="{ width: `${card.ratio * 100}%` }"></div>
          <div class="io-lab__gate" :style="{ left: `${gate * 100}%` }"></div>
        </div>
      </article>
      <div class="io-lab__spacer">root 底部</div>
    </div>
  </section>
</template>

<style scoped>
.io-lab {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 12px;
  width: 100%;
  height: 396px;
  padding: 12px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.io-lab__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.io-lab__group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.io-lab__label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.io-lab__seg {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border: 1px solid #4b5563;
  border-radius: 6px;
}

.io-lab__segbtn {
  min-height: 30px;
  color: #d1d5db;
  font-size: 13px;
  font-weight: 700;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #1f2937;
  border: 0;
  border-right: 1px solid #4b5563;
  cursor: pointer;
}

.io-lab__segbtn:last-child {
  border-right: 0;
}

.io-lab__segbtn--active {
  color: #111827;
  background: #34d399;
}

.io-lab__input {
  padding: 7px 10px;
  color: #f9fafb;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.io-lab__input[aria-invalid="true"] {
  border-color: #fb7185;
}

.io-lab__tip {
  margin: 0;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.4;
}

.io-lab__err {
  color: #fb7185;
}

.io-lab__stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 10px;
  background: #0f172a;
  border-left: 4px solid #34d399;
  border-radius: 4px;
}

.io-lab__stats div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.io-lab__stats dt {
  color: #9ca3af;
  font-size: 11px;
}

.io-lab__stats dd {
  margin: 0;
  color: #34d399;
  font-size: 15px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.io-lab__hint {
  margin: auto 0 0;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.45;
}

.io-lab__scroll {
  min-height: 0;
  padding: 0 8px;
  overflow-y: auto;
  background: #0b1220;
  border: 1px solid #334155;
  border-radius: 6px;
}

.io-lab__spacer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  color: #475569;
  font-size: 11px;
  letter-spacing: 0.04em;
}

.io-lab__card {
  margin: 8px 0;
  padding: 12px;
  background: #1f2937;
  border: 1px solid #374151;
  border-left: 3px solid #4b5563;
  border-radius: 6px;
  transition: border-color 0.12s, background 0.12s;
}

.io-lab__card--hit {
  background: #14231d;
  border-color: #34d399;
  border-left-color: #34d399;
}

.io-lab__cardhead {
  display: flex;
  gap: 10px;
  align-items: baseline;
  margin-bottom: 9px;
}

.io-lab__cardno {
  color: #f9fafb;
  font-size: 14px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.io-lab__badge {
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 3px;
}

.io-lab__badge--in {
  color: #052e1a;
  background: #34d399;
}

.io-lab__badge--out {
  color: #cbd5e1;
  background: #374151;
}

.io-lab__ratio {
  margin-left: auto;
  color: #9ca3af;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.io-lab__bar {
  position: relative;
  height: 12px;
  background: #0f172a;
  border-radius: 6px;
  overflow: hidden;
}

.io-lab__barfill {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #34d399);
  border-radius: 6px;
  transition: width 0.1s linear;
}

.io-lab__gate {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 2px;
  background: #fbbf24;
}
</style>
