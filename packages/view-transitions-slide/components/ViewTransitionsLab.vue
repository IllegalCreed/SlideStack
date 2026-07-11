<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

/** 单张演示卡片 */
interface Card {
  /** 稳定唯一 id —— 用于拼出稳定唯一的 view-transition-name 做前后态配对 */
  id: number;
  /** 展示字母 */
  label: string;
  /** 主题色相（inline 渐变背景用） */
  hue: number;
}

/** 生成初始 6 张卡片，色相均匀铺开 */
function makeCards(): Card[] {
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    label: labels[i] ?? "?",
    hue: (i * 47) % 360,
  }));
}

/** 卡片列表（reactive：顺序 / 增删都会驱动模板更新） */
const cards = reactive<Card[]>(makeCards());
/** 自增 id 源，保证新增卡片 id 唯一（→ view-transition-name 唯一） */
let nextId = cards.length + 1;
/** 被展开的卡片 id（null=无）；展开会改变尺寸 → group 自动形变补间 */
const expandedId = ref<number | null>(null);

/** 浏览器是否支持 startViewTransition —— SSR 安全：初值 false，挂载后再检测 */
const supported = ref(false);
/** 手动强制降级：对照「不支持」路径，也让两条分支都可被测到 */
const forceFallback = ref(false);
/** 过渡状态机 */
const status = ref<"idle" | "running" | "finished" | "skipped" | "fallback">("idle");
/** 触发过渡的累计次数 */
const count = ref(0);

/** 状态中文文案（模板展示用） */
const statusText = computed(
  () =>
    ({
      idle: "待触发",
      running: "过渡中…",
      finished: "finished ✓",
      skipped: "skipped（跳过）",
      fallback: "降级 · 直接更新",
    })[status.value],
);

/** 单卡内联样式：唯一 view-transition-name + 渐变背景 */
function cardStyle(card: Card): Record<string, string> {
  return {
    // 驼峰 viewTransitionName → CSS view-transition-name；不支持的浏览器忽略，无害
    viewTransitionName: `vtlab-${card.id}`,
    background: `linear-gradient(135deg, hsl(${card.hue} 68% 54%), hsl(${(card.hue + 42) % 360} 68% 44%))`,
  };
}

/**
 * 统一入口：把一次「纯 DOM 变更」交给浏览器补间前后态。
 * - 支持且未强制降级：真 document.startViewTransition，挂 finished/ready 观测生命周期
 * - 否则：特性检测降级，直接改 DOM（无动画）
 * SSR 安全：document 只在此浏览器端点击回调里访问，顶层零 window / document。
 */
function runTransition(update: () => void): void {
  count.value += 1;
  // 特性检测降级：不支持 或 手动强制 → 直接更新，不进过渡流程
  if (!("startViewTransition" in document) || forceFallback.value) {
    update();
    status.value = "fallback";
    return;
  }
  status.value = "running";
  const transition = document.startViewTransition(update);
  // finished：动画结束、新视图可交互（DOM 更新成功即 resolve）
  transition.finished
    .then(() => {
      if (status.value === "running") status.value = "finished";
    })
    .catch(() => {
      status.value = "skipped";
    });
  // ready 被跳过（撞名 / 不可见）会 reject —— 兜底并吞掉未处理拒绝
  transition.ready.catch(() => {
    status.value = "skipped";
  });
}

/** 打乱顺序：首张轮转到末尾 —— 位置变化触发形变补间（同名元素自动「飞」到新位） */
function shuffle(): void {
  runTransition(() => {
    const first = cards.shift();
    if (first) cards.push(first);
  });
}

/** 增删元素：>4 张删末张，否则补一张 —— 删的淡出、增的淡入 */
function toggleCount(): void {
  runTransition(() => {
    if (cards.length > 4) {
      cards.pop();
    } else {
      cards.push({
        id: nextId,
        label: String.fromCharCode(64 + ((nextId - 1) % 26) + 1),
        hue: (nextId * 47) % 360,
      });
      nextId += 1;
    }
  });
}

/** 展开 / 收起首张卡片 —— 尺寸变化触发 group 形变补间（同名元素自动「长大 / 缩回」） */
function toggleExpand(): void {
  runTransition(() => {
    const target = cards[0];
    if (!target) return;
    expandedId.value = expandedId.value === target.id ? null : target.id;
  });
}

// 挂载后（浏览器端）做特性检测；顶层不访问 document，保证 SSR 安全
onMounted(() => {
  supported.value = "startViewTransition" in document;
});
</script>

<template>
  <section class="vt-lab" aria-label="View Transitions 交互实验室">
    <!-- 左：控制 + 实时状态 -->
    <div class="vt-lab__panel">
      <div class="vt-lab__actions">
        <button type="button" class="vt-lab__btn" data-test="shuffle" @click="shuffle">
          打乱顺序
        </button>
        <button type="button" class="vt-lab__btn" data-test="toggle-count" @click="toggleCount">
          增 / 删元素
        </button>
        <button type="button" class="vt-lab__btn" data-test="expand" @click="toggleExpand">
          展开 / 收起
        </button>
      </div>

      <label class="vt-lab__switch">
        <input v-model="forceFallback" type="checkbox" data-test="force-fallback" />
        <span>强制降级（模拟不支持）</span>
      </label>

      <dl class="vt-lab__stats">
        <div>
          <dt>startViewTransition</dt>
          <dd :class="supported ? 'is-yes' : 'is-no'" data-test="supported">
            {{ supported ? "in document ✓" : "不可用" }}
          </dd>
        </div>
        <div><dt>触发次数</dt><dd data-test="count">{{ count }}</dd></div>
        <div><dt>本次状态</dt><dd data-test="status">{{ statusText }}</dd></div>
      </dl>

      <p class="vt-lab__hint">
        点按钮只改 DOM，浏览器自动补间前后态；勾「强制降级」走特性检测的直更路径（无动画）。
      </p>
    </div>

    <!-- 右：过渡舞台 —— 每张卡片一个稳定 view-transition-name，重排 / 形变自动补间 -->
    <div class="vt-lab__stage">
      <article
        v-for="card in cards"
        :key="card.id"
        class="vt-lab__card vtlab-card"
        :class="{ 'vt-lab__card--wide': expandedId === card.id }"
        :style="cardStyle(card)"
        data-test="card"
      >
        <span class="vt-lab__cardno">{{ card.label }}</span>
        <span class="vt-lab__cardid">#{{ card.id }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.vt-lab {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 14px;
  width: 100%;
  height: 402px;
  padding: 14px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.vt-lab__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.vt-lab__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vt-lab__btn {
  min-height: 38px;
  color: #f9fafb;
  font-size: 14px;
  font-weight: 700;
  background: #1f2937;
  border: 1px solid #4b5563;
  border-left: 3px solid #34d399;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}

.vt-lab__btn:hover {
  background: #273449;
  border-left-color: #6ee7b7;
}

.vt-lab__switch {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #cbd5e1;
  font-size: 12px;
  cursor: pointer;
}

.vt-lab__switch input {
  width: 15px;
  height: 15px;
  accent-color: #34d399;
}

.vt-lab__stats {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0;
  padding: 11px;
  background: #0f172a;
  border-left: 4px solid #34d399;
  border-radius: 4px;
}

.vt-lab__stats div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.vt-lab__stats dt {
  color: #9ca3af;
  font-size: 11px;
}

.vt-lab__stats dd {
  margin: 0;
  color: #e5e7eb;
  font-size: 13px;
  font-weight: 700;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.vt-lab__stats dd.is-yes {
  color: #34d399;
}

.vt-lab__stats dd.is-no {
  color: #fb7185;
}

.vt-lab__hint {
  margin: auto 0 0;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.5;
}

.vt-lab__stage {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 10px;
  min-height: 0;
  padding: 12px;
  overflow: hidden;
  background: #0b1220;
  border: 1px solid #334155;
  border-radius: 6px;
}

.vt-lab__card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  min-height: 0;
  color: #0b1220;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.vt-lab__card--wide {
  grid-column: 1 / -1;
}

.vt-lab__cardno {
  font-size: 22px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.vt-lab__cardid {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.75;
}
</style>

<style>
/* 非 scoped：view-transition-class 与伪元素动画作用在 :root 上的伪元素树，scoped 选择器够不到 */
.vtlab-card {
  view-transition-class: vtlab;
}
/* 只调本实验室卡片这一组的节奏，不碰其它组（含 Slidev 自身可能的过渡） */
::view-transition-group(.vtlab) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
</style>
