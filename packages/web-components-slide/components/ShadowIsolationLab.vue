<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

/** 注入 document.head 的"页面级样式"节点 id：卸载时必须清理，避免残留 */
const POLLUTION_STYLE_ID = "wc-lab-pollution-style";

/** 演示用自定义元素标签名 */
const DEMO_TAG = "wc-demo-chip";

/** 页面级攻击样式是否已注入 */
const polluted = ref(false);

/** CSS 自定义属性（主题变量）是否已改写 */
const themed = ref(false);

/** 影子树宿主的挂载容器 */
const shadowMount = ref<HTMLElement | null>(null);

/** 攻击样式：与两侧内容完全同名的 class 选择器（只会命中普通 DOM 一侧） */
const POLLUTION_CSS = `
.wc-victim-badge { background: #e11d48 !important; border-color: #9f1239 !important; color: #fff !important; }
.wc-victim-text { color: #fda4af !important; text-decoration: line-through !important; }
`;

/** 切换"页面级全局样式"注入：选择器进不了影子边界，只有左侧被改写 */
function togglePollution() {
  const existing = document.getElementById(POLLUTION_STYLE_ID);
  if (existing) {
    existing.remove();
    polluted.value = false;
    return;
  }
  const style = document.createElement("style");
  style.id = POLLUTION_STYLE_ID;
  style.textContent = POLLUTION_CSS;
  document.head.appendChild(style);
  polluted.value = true;
}

/** 切换 CSS 变量：自定义属性沿继承链穿透影子边界，两侧一起变（设计好的主题开口） */
function toggleTheme() {
  themed.value = !themed.value;
}

onMounted(() => {
  // SSG 构建阶段没有 window/customElements：类声明与 define 都只能放在挂载后执行
  if (!customElements.get(DEMO_TAG)) {
    customElements.define(
      DEMO_TAG,
      class extends HTMLElement {
        constructor() {
          super();
          // 影子树内刻意使用与外部完全相同的 class 名，验证页面选择器进不来；
          // 变量 --wc-accent 用 var() 消费，验证自定义属性能穿透进来
          this.attachShadow({ mode: "open" }).innerHTML = `
            <style>
              :host { display: block; }
              .wc-victim-card {
                display: grid; gap: 6px; padding: 10px 12px;
                background: #0f172a; border: 1px solid #334155;
                border-left: 4px solid var(--wc-accent, #38bdf8); border-radius: 6px;
              }
              .wc-victim-badge {
                justify-self: start; padding: 2px 10px; font-size: 12px;
                color: var(--wc-accent, #38bdf8); background: #1e293b;
                border: 1px solid var(--wc-accent, #38bdf8); border-radius: 999px;
              }
              .wc-victim-text { margin: 0; color: #e2e8f0; font-size: 13px; }
            </style>
            <div class="wc-victim-card">
              <span class="wc-victim-badge">class="wc-victim-badge"</span>
              <p class="wc-victim-text">同名 class，但我在影子树里</p>
            </div>
          `;
        }
      },
    );
  }
  // 命令式创建实例：避免 Vue 模板把未知标签当组件解析
  if (shadowMount.value && !shadowMount.value.firstChild) {
    shadowMount.value.appendChild(document.createElement(DEMO_TAG));
  }
});

onBeforeUnmount(() => {
  // 清理注入的页面级样式，不留垃圾给其他页面
  document.getElementById(POLLUTION_STYLE_ID)?.remove();
  polluted.value = false;
});
</script>

<template>
  <section
    class="iso-lab"
    aria-label="Shadow DOM 样式隔离实验"
    :style="{ '--wc-accent': themed ? '#fbbf24' : '#38bdf8' }"
  >
    <div class="iso-lab__controls" role="group" aria-label="实验操作">
      <button
        type="button"
        :class="['iso-lab__btn', { 'iso-lab__btn--danger': polluted }]"
        :aria-pressed="polluted"
        @click="togglePollution"
      >
        {{ polluted ? "移除页面级 CSS" : "注入页面级 CSS（.wc-victim-*）" }}
      </button>
      <button
        type="button"
        :class="['iso-lab__btn', { 'iso-lab__btn--on': themed }]"
        :aria-pressed="themed"
        @click="toggleTheme"
      >
        {{ themed ? "还原 CSS 变量 --wc-accent" : "改写 CSS 变量 --wc-accent" }}
      </button>
    </div>

    <div class="iso-lab__panels">
      <div class="iso-lab__panel">
        <header>普通 DOM<small>无封装，直接躺在页面里</small></header>
        <div class="iso-lab__card">
          <span class="wc-victim-badge iso-lab__badge">class="wc-victim-badge"</span>
          <p class="wc-victim-text iso-lab__text">同名 class，我在页面里</p>
        </div>
        <footer
          :class="[
            'iso-lab__verdict',
            polluted ? 'iso-lab__verdict--bad' : '',
          ]"
        >
          {{ polluted ? "被页面选择器命中：样式已改写" : "尚无页面级样式注入" }}
        </footer>
      </div>

      <div class="iso-lab__panel">
        <header>Shadow DOM<small>attachShadow({ mode: "open" })</small></header>
        <div ref="shadowMount" class="iso-lab__mount"></div>
        <footer
          :class="[
            'iso-lab__verdict',
            themed ? 'iso-lab__verdict--themed' : '',
          ]"
        >
          {{ polluted ? "选择器被影子边界挡住：纹丝不动" : "影子树自带样式，独立渲染" }}{{ themed ? "；CSS 变量已穿透进来" : "" }}
        </footer>
      </div>
    </div>
  </section>
</template>

<style scoped>
.iso-lab {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 14px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.iso-lab__controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.iso-lab__btn {
  min-height: 34px;
  padding: 5px 14px;
  color: #d1d5db;
  font-size: 13px;
  background: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 6px;
  cursor: pointer;
}

.iso-lab__btn--danger {
  color: #fff;
  font-weight: 700;
  background: #e11d48;
  border-color: #e11d48;
}

.iso-lab__btn--on {
  color: #111827;
  font-weight: 700;
  background: #fbbf24;
  border-color: #fbbf24;
}

.iso-lab__panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.iso-lab__panel {
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 10px 12px;
  background: #1f2937;
  border: 1px solid #334155;
  border-radius: 8px;
}

.iso-lab__panel header {
  display: flex;
  gap: 8px;
  align-items: baseline;
  color: #f9fafb;
  font-weight: 700;
  font-size: 14px;
}

.iso-lab__panel header small {
  color: #9ca3af;
  font-weight: 400;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* 与影子树内的样式保持一致：初始状态两侧看起来一模一样 */
.iso-lab__card {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-left: 4px solid var(--wc-accent, #38bdf8);
  border-radius: 6px;
}

.iso-lab__badge {
  justify-self: start;
  padding: 2px 10px;
  color: var(--wc-accent, #38bdf8);
  font-size: 12px;
  background: #1e293b;
  border: 1px solid var(--wc-accent, #38bdf8);
  border-radius: 999px;
}

.iso-lab__text {
  margin: 0;
  color: #e2e8f0;
  font-size: 13px;
}

.iso-lab__verdict {
  padding: 6px 10px;
  color: #94a3b8;
  font-size: 12px;
  background: #0f172a;
  border-left: 3px solid #475569;
  border-radius: 6px;
}

.iso-lab__verdict--bad {
  color: #fda4af;
  border-left-color: #e11d48;
}

.iso-lab__verdict--themed {
  color: #fbbf24;
  border-left-color: #fbbf24;
}
</style>
