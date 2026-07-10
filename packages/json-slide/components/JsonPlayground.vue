<script setup lang="ts">
import { computed, ref } from "vue";

type ExampleKey = "valid" | "syntax" | "integer";

interface Example {
  label: string;
  source: string;
}

interface ParseSuccess {
  ok: true;
  output: string;
  value: unknown;
  precisionWarning: string | null;
}

interface ParseFailure {
  ok: false;
  message: string;
  line: number | null;
  column: number | null;
}

type ParseResult = ParseSuccess | ParseFailure;

const examples: Record<ExampleKey, Example> = {
  valid: {
    label: "合法对象",
    source: `{
  "name": "Ada",
  "skills": ["TypeScript", "JSON"],
  "active": true
}`,
  },
  syntax: {
    label: "语法错误",
    source: `{
  "name": "Ada",
  "active": true,
}`,
  },
  integer: {
    label: "大整数",
    source: `{
  "orderId": 9007199254740993
}`,
  },
};

const activeExample = ref<ExampleKey>("valid");
const source = ref(examples.valid.source);

/** 从不同浏览器的 SyntaxError 文本中尽量提取字符位置。 */
function locateError(
  message: string,
  text: string,
): Pick<ParseFailure, "line" | "column"> {
  const position = Number(message.match(/position\s+(\d+)/i)?.[1]);
  if (!Number.isInteger(position)) return { line: null, column: null };
  const before = text.slice(0, position);
  const rows = before.split("\n");
  return { line: rows.length, column: (rows.at(-1)?.length ?? 0) + 1 };
}

/** 使用浏览器原生 JSON.parse 实时计算解析结果。 */
const parsed = computed<ParseResult>(() => {
  try {
    const value: unknown = JSON.parse(source.value);
    const record = typeof value === "object" && value !== null ? value : null;
    const orderId = record && "orderId" in record ? record.orderId : null;
    const precisionWarning =
      activeExample.value === "integer" && orderId === 9007199254740992
        ? "输入末位 3，解析后变成 2：精度已静默丢失"
        : null;
    return {
      ok: true,
      value,
      output: JSON.stringify(value, null, 2),
      precisionWarning,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知解析错误";
    return { ok: false, message, ...locateError(message, source.value) };
  }
});

/** 切换预置输入，同时保留用户继续编辑的能力。 */
function loadExample(key: ExampleKey) {
  activeExample.value = key;
  source.value = examples[key].source;
}

/** 对合法 JSON 进行标准的两空格格式化。 */
function formatSource() {
  if (!parsed.value.ok) return;
  source.value = JSON.stringify(parsed.value.value, null, 2);
}
</script>

<template>
  <section class="json-lab" aria-label="JSON 实时解析演示">
    <header class="json-lab__toolbar">
      <div class="json-lab__segments" role="group" aria-label="JSON 示例">
        <button
          v-for="(example, key) in examples"
          :key="key"
          type="button"
          :class="[
            'json-lab__segment',
            { 'json-lab__segment--active': activeExample === key },
          ]"
          :aria-pressed="activeExample === key"
          @click="loadExample(key)"
        >
          {{ example.label }}
        </button>
      </div>

      <button
        type="button"
        class="json-lab__format"
        :disabled="!parsed.ok"
        aria-label="格式化 JSON"
        title="格式化 JSON"
        @click="formatSource"
      >
        <carbon:code />
      </button>
    </header>

    <div class="json-lab__workspace">
      <label class="json-lab__pane">
        <span>输入文本</span>
        <textarea
          v-model="source"
          spellcheck="false"
          aria-label="JSON 输入文本"
        />
      </label>

      <div class="json-lab__pane">
        <span>{{ parsed.ok ? "解析结果" : "解析失败" }}</span>
        <pre v-if="parsed.ok" class="json-lab__output">{{ parsed.output }}</pre>
        <div v-else class="json-lab__error" role="status">
          <strong>SyntaxError</strong>
          <code>{{ parsed.message }}</code>
          <small v-if="parsed.line"
            >第 {{ parsed.line }} 行，第 {{ parsed.column }} 列附近</small
          >
        </div>
      </div>
    </div>

    <div
      :class="[
        'json-lab__status',
        parsed.ok ? 'json-lab__status--ok' : 'json-lab__status--error',
      ]"
      role="status"
    >
      <span>{{
        parsed.ok ? "JSON.parse 成功" : "严格语法阻止了模糊输入"
      }}</span>
      <strong v-if="parsed.ok && parsed.precisionWarning">{{
        parsed.precisionWarning
      }}</strong>
      <strong v-else-if="parsed.ok">得到一个真实 JavaScript 值</strong>
      <strong v-else>单引号、注释和尾逗号都不会被接受</strong>
    </div>
  </section>
</template>

<style scoped>
.json-lab {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 14px;
  color: #f3f4f6;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.json-lab__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.json-lab__segments {
  display: grid;
  grid-template-columns: repeat(3, minmax(108px, 1fr));
  overflow: hidden;
  border: 1px solid #4b5563;
  border-radius: 6px;
}

.json-lab__segment,
.json-lab__format {
  min-height: 36px;
  color: #d1d5db;
  background: #1f2937;
  border: 0;
  cursor: pointer;
}

.json-lab__segment {
  padding: 6px 14px;
  border-right: 1px solid #4b5563;
}

.json-lab__segment:last-child {
  border-right: 0;
}

.json-lab__segment--active {
  color: #111827;
  font-weight: 700;
  background: #34d399;
}

.json-lab__format {
  display: grid;
  width: 38px;
  place-items: center;
  border: 1px solid #4b5563;
  border-radius: 6px;
}

.json-lab__format:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.json-lab__workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
}

.json-lab__pane {
  display: grid;
  grid-template-rows: 24px 230px;
  min-width: 0;
}

.json-lab__pane > span {
  color: #9ca3af;
  font-size: 13px;
}

.json-lab textarea,
.json-lab__output,
.json-lab__error {
  box-sizing: border-box;
  width: 100%;
  height: 230px;
  padding: 12px;
  overflow: auto;
  color: #e5e7eb;
  font:
    14px/1.5 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  background: #0b1020;
  border: 1px solid #374151;
  border-radius: 6px;
}

.json-lab textarea {
  resize: none;
  outline: none;
}

.json-lab textarea:focus {
  border-color: #38bdf8;
}

.json-lab__output {
  margin: 0;
  white-space: pre-wrap;
}

.json-lab__error {
  display: grid;
  align-content: center;
  gap: 10px;
  border-color: #7f1d1d;
}

.json-lab__error strong {
  color: #fb7185;
}

.json-lab__error code,
.json-lab__error small {
  color: #fecdd3;
  overflow-wrap: anywhere;
}

.json-lab__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 8px 12px;
  border-left: 4px solid;
}

.json-lab__status span {
  color: #9ca3af;
}

.json-lab__status--ok {
  background: #052e2b;
  border-color: #34d399;
}

.json-lab__status--ok strong {
  color: #a7f3d0;
}

.json-lab__status--error {
  background: #3f111b;
  border-color: #fb7185;
}

.json-lab__status--error strong {
  color: #fecdd3;
}
</style>
