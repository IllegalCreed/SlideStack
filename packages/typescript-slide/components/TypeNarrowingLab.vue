<script setup lang="ts">
import { computed, ref } from "vue";

type SampleId = "string" | "number" | "null";

interface Sample {
  id: SampleId;
  label: string;
  source: string;
  value: unknown;
}

const samples: readonly Sample[] = [
  { id: "string", label: "字符串", source: '"slidev"', value: "slidev" },
  { id: "number", label: "数字", source: "42", value: 42 },
  { id: "null", label: "空值", source: "null", value: null },
];

const selectedId = ref<SampleId>("string");

/** 当前被送入联合类型函数的真实样本。 */
const selected = computed(
  () => samples.find((sample) => sample.id === selectedId.value) ?? samples[0],
);

/** 展示 JavaScript 运行时 typeof 的真实结果。 */
const runtimeType = computed(() => typeof selected.value.value);

/** 按安全守卫顺序计算 TypeScript 能推断出的分支。 */
const narrowed = computed(() => {
  const value = selected.value.value;
  if (value === null) {
    return {
      guard: "value === null",
      type: "null",
      result: "没有可调用的方法",
      tone: "danger",
    };
  }
  if (typeof value === "string") {
    return {
      guard: 'typeof value === "string"',
      type: "string",
      result: value.toUpperCase(),
      tone: "success",
    };
  }
  if (typeof value === "number") {
    return {
      guard: 'typeof value === "number"',
      type: "number",
      result: value.toFixed(2),
      tone: "info",
    };
  }
  return {
    guard: "else",
    type: "never",
    result: "已穷尽",
    tone: "muted",
  };
});
</script>

<template>
  <section class="narrowing-lab" aria-label="TypeScript 控制流窄化演示">
    <div class="narrowing-lab__segments" role="group" aria-label="输入值">
      <button
        v-for="sample in samples"
        :key="sample.id"
        type="button"
        :class="[
          'narrowing-lab__segment',
          { 'narrowing-lab__segment--active': selectedId === sample.id },
        ]"
        :aria-pressed="selectedId === sample.id"
        @click="selectedId = sample.id"
      >
        {{ sample.label }}
      </button>
    </div>

    <div class="narrowing-lab__flow">
      <div class="narrowing-lab__node">
        <span>输入</span>
        <code>{{ selected.source }}</code>
        <small>静态类型：string | number | null</small>
      </div>

      <div class="narrowing-lab__arrow" aria-hidden="true">→</div>

      <div class="narrowing-lab__node narrowing-lab__node--runtime">
        <span>运行时观察</span>
        <code>typeof → {{ runtimeType }}</code>
        <small v-if="selectedId === 'null'"
          >历史陷阱：null 被报告为 object</small
        >
        <small v-else>JavaScript 提供事实</small>
      </div>

      <div class="narrowing-lab__arrow" aria-hidden="true">→</div>

      <div
        :class="[
          'narrowing-lab__node',
          `narrowing-lab__node--${narrowed.tone}`,
        ]"
      >
        <span>控制流分支</span>
        <code>{{ narrowed.guard }}</code>
        <small>TypeScript 收窄为 {{ narrowed.type }}</small>
      </div>
    </div>

    <div class="narrowing-lab__result">
      <span>分支内可安全得到</span>
      <strong>{{ narrowed.result }}</strong>
    </div>
  </section>
</template>

<style scoped>
.narrowing-lab {
  display: grid;
  gap: 18px;
  width: 100%;
  padding: 18px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.narrowing-lab__segments {
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  justify-self: center;
  overflow: hidden;
  border: 1px solid #4b5563;
  border-radius: 6px;
}

.narrowing-lab__segment {
  min-height: 38px;
  padding: 6px 16px;
  color: #d1d5db;
  background: #1f2937;
  border: 0;
  border-right: 1px solid #4b5563;
  cursor: pointer;
}

.narrowing-lab__segment:last-child {
  border-right: 0;
}

.narrowing-lab__segment--active {
  color: #111827;
  font-weight: 700;
  background: #fbbf24;
}

.narrowing-lab__flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 30px minmax(0, 1fr) 30px minmax(0, 1fr);
  align-items: stretch;
  gap: 8px;
}

.narrowing-lab__node {
  display: grid;
  align-content: center;
  min-height: 142px;
  padding: 14px;
  background: #1f2937;
  border-top: 4px solid #94a3b8;
  border-radius: 6px;
}

.narrowing-lab__node span,
.narrowing-lab__node small {
  color: #9ca3af;
}

.narrowing-lab__node code {
  display: block;
  margin: 10px 0;
  padding: 7px 9px;
  color: #f9fafb;
  font-size: 17px;
  overflow-wrap: anywhere;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 4px;
}

.narrowing-lab__node--runtime {
  border-color: #38bdf8;
}

.narrowing-lab__node--success {
  border-color: #34d399;
}

.narrowing-lab__node--info {
  border-color: #60a5fa;
}

.narrowing-lab__node--danger {
  border-color: #fb7185;
}

.narrowing-lab__node--muted {
  border-color: #a78bfa;
}

.narrowing-lab__arrow {
  display: grid;
  place-items: center;
  color: #fbbf24;
  font-size: 26px;
}

.narrowing-lab__result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 10px 14px;
  background: #0f172a;
  border-left: 4px solid #fbbf24;
}

.narrowing-lab__result span {
  color: #9ca3af;
}

.narrowing-lab__result strong {
  color: #fbbf24;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
</style>
