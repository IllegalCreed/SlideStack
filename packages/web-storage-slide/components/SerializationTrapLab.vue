<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

/**
 * 序列化陷阱实验室：用真实 localStorage 演示"只存字符串"带来的丢形。
 * 每个预设 make() 现造一个值 → 按写入方式落盘 → 读回 → JSON.parse →
 * 肉眼对比"原值 / 落盘字符串 / 取回值"三行。全部存取都在回调内完成，
 * 顶层零 window 访问（SSR 安全），用后 removeItem 清理，绝不污染真实存储。
 */

/** 一个实验预设 */
interface Preset {
  id: string;
  label: string;
  /** json = JSON.stringify 往返；raw = 直接 setItem，触发底层 String() 强转 */
  mode: "json" | "raw";
  /** 手写的原值字面量（比自动 describe 更贴近源码写法） */
  original: string;
  /** 原值的运行时类型（typeof / 构造函数名） */
  originalType: string;
  /** 现造值：循环引用、新 Date 都要求每次新建 */
  make: () => unknown;
  /** 这条路径的结论 */
  note: string;
}

/** 一次往返的结果 */
interface Result {
  stored: string | null; // 落盘的原始字符串（写入抛错时为 null）
  readBack: string; // JSON.parse 后的展示文本
  readBackType: string; // 取回值的运行时类型
  verdict: "faithful" | "lossy" | "threw";
  error: string; // threw 时的真实错误信息
}

/** 把任意值渲染成简短文本，覆盖 JSON.parse 可能产出的形状 */
function describe(v: unknown): string {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return JSON.stringify(v); // 带引号，凸显"这是字符串"
  if (Array.isArray(v)) return `[${v.map(describe).join(", ")}]`;
  if (typeof v === "object") {
    const keys = Object.keys(v as object);
    if (keys.length === 0) return "{}";
    const rec = v as Record<string, unknown>;
    return `{ ${keys.map((k) => `${k}: ${describe(rec[k])}`).join(", ")} }`;
  }
  return String(v);
}

/** typeof + 构造函数名，用来凸显"类型有没有变" */
function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  const t = typeof v;
  if (t === "object") return (v as object).constructor?.name ?? "object";
  return t;
}

const presets: readonly Preset[] = [
  {
    id: "plain",
    label: "普通对象",
    mode: "json",
    original: '{ id: 1, tags: ["a", "b"] }',
    originalType: "Object",
    make: () => ({ id: 1, tags: ["a", "b"] }),
    note: "纯 JSON 形状（字符串/数字/布尔/null/数组/普通对象）→ 无损往返，且读回是深拷贝",
  },
  {
    id: "raw",
    label: "对象裸存",
    mode: "raw",
    original: '{ name: "Ada" }',
    originalType: "Object",
    make: () => ({ name: "Ada" }),
    note: '不经 JSON.stringify 直接 setItem → String(对象) = "[object Object]"，数据实质丢失',
  },
  {
    id: "date",
    label: "Date",
    mode: "json",
    original: 'new Date("2026-07-11T08:00:00Z")',
    originalType: "Date",
    make: () => new Date("2026-07-11T08:00:00.000Z"),
    note: "Date → ISO 8601 字符串；typeof 从 Date 变 string——用 reviver 恢复或干脆存时间戳",
  },
  {
    id: "map",
    label: "Map / Set",
    mode: "json",
    original: 'new Map([["a", 1], ["b", 2]])',
    originalType: "Map",
    make: () => new Map([
      ["a", 1],
      ["b", 2],
    ]),
    note: 'Map / Set / RegExp / Blob → "{}"，条目全丢；保形是 IndexedDB 结构化克隆的管辖区',
  },
  {
    id: "drop",
    label: "undefined / 函数",
    mode: "json",
    original: "{ a: 1, b: undefined, c: () => 0 }",
    originalType: "Object",
    make: () => ({ a: 1, b: undefined, c: () => 0 }),
    note: "对象属性值为 undefined / 函数 / Symbol → 该键被静默跳过（数组里则变 null）",
  },
  {
    id: "nan",
    label: "NaN / Infinity",
    mode: "json",
    original: "NaN",
    originalType: "number",
    make: () => NaN,
    note: "NaN / Infinity → null，静默变形；读回后无从分辨它曾经是 NaN",
  },
  {
    id: "circular",
    label: "循环引用",
    mode: "json",
    original: "const o = {}; o.self = o",
    originalType: "Object",
    make: () => {
      const o: Record<string, unknown> = { name: "loop" };
      o.self = o; // 自引用
      return o;
    },
    note: "循环引用（与 BigInt 同类）→ JSON.stringify 当场抛 TypeError，写入根本没发生",
  },
];

/** 专用测试键：与业务键空间隔离，且每次用后立即清除 */
const TEST_KEY = "__ws_serialize_lab__";

const activeId = ref<string>("plain");
const result = ref<Result | null>(null);

/** 当前选中的预设 */
const activePreset = computed(
  () => presets.find((p) => p.id === activeId.value) ?? presets[0],
);

/** 结论标签 */
const verdictLabel = computed(() => {
  switch (result.value?.verdict) {
    case "faithful":
      return "无损往返";
    case "threw":
      return "写入抛错";
    default:
      return "丢形";
  }
});

/**
 * 真跑一遍：写真实 localStorage → 读回 → parse → 清理。
 * 所有存储访问都在本函数内，仅由 onMounted 与点击触发（永不在 SSR 阶段执行）。
 */
function run(preset: Preset): void {
  activeId.value = preset.id;
  const value = preset.make();
  try {
    if (preset.mode === "raw") {
      // 故意把对象直接交给 setItem：底层做一次 String() → "[object Object]"
      localStorage.setItem(TEST_KEY, value as unknown as string);
      const stored = localStorage.getItem(TEST_KEY);
      result.value = { stored, readBack: "—", readBackType: "—", verdict: "lossy", error: "" };
    } else {
      // JSON 往返：stringify 可能抛（循环引用 / BigInt）
      const serialized = JSON.stringify(value);
      localStorage.setItem(TEST_KEY, serialized);
      const stored = localStorage.getItem(TEST_KEY);
      const parsed = JSON.parse(stored as string);
      result.value = {
        stored,
        readBack: describe(parsed),
        readBackType: typeOf(parsed),
        verdict: preset.id === "plain" ? "faithful" : "lossy",
        error: "",
      };
    }
  } catch (e) {
    result.value = {
      stored: null,
      readBack: "—",
      readBackType: "—",
      verdict: "threw",
      error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
    };
  } finally {
    // 用后即清，绝不给真实存储留垃圾
    localStorage.removeItem(TEST_KEY);
  }
}

// 仅在浏览器挂载后跑首个预设：天然的 SSR 守卫
onMounted(() => run(presets[0]));
</script>

<template>
  <section class="ser-lab" aria-label="序列化陷阱实验室">
    <!-- 左栏：预设按钮 + 原值 -->
    <div class="ser-lab__left">
      <div class="ser-lab__presets" role="group" aria-label="预设值">
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          :class="['ser-lab__preset', { 'ser-lab__preset--active': activeId === preset.id }]"
          :aria-pressed="activeId === preset.id"
          @click="run(preset)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="ser-lab__original">
        <span class="ser-lab__tag ser-lab__tag--ink">原值</span>
        <code>{{ activePreset.original }}</code>
        <em>typeof → {{ activePreset.originalType }}</em>
      </div>

      <p class="ser-lab__mode">
        写入方式：<code>{{
          activePreset.mode === "raw"
            ? "setItem(对象) —— 不经 JSON"
            : "setItem(JSON.stringify(值))"
        }}</code>
      </p>
    </div>

    <!-- 右栏：落盘字符串 → 取回值 → 结论 -->
    <div v-if="result" class="ser-lab__right">
      <div class="ser-lab__row">
        <span class="ser-lab__tag ser-lab__tag--blue">落盘字符串</span>
        <code>{{ result.stored === null ? "（未写入）" : result.stored }}</code>
      </div>

      <div class="ser-lab__row">
        <span class="ser-lab__tag ser-lab__tag--green">取回值</span>
        <code>{{ result.readBack }}</code>
        <em v-if="result.readBackType !== '—'">typeof → {{ result.readBackType }}</em>
      </div>

      <div :class="['ser-lab__verdict', `ser-lab__verdict--${result.verdict}`]">
        <strong>{{ verdictLabel }}</strong>
        <span>{{ activePreset.note }}</span>
        <code v-if="result.verdict === 'threw'" class="ser-lab__err">{{ result.error }}</code>
      </div>

      <p class="ser-lab__foot">真实 <code>localStorage</code> 现场往返，读毕即 <code>removeItem</code> 清理</p>
    </div>
  </section>
</template>

<style scoped>
.ser-lab {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: 14px;
  width: 100%;
  height: 392px;
  padding: 14px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.ser-lab__left,
.ser-lab__right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.ser-lab__presets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.ser-lab__preset {
  min-height: 34px;
  padding: 5px 8px;
  color: #d1d5db;
  font-size: 12px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
  cursor: pointer;
}

.ser-lab__preset:hover {
  border-color: #6b7280;
}

.ser-lab__preset--active {
  color: #111827;
  font-weight: 700;
  background: #fbbf24;
  border-color: #fbbf24;
}

.ser-lab__original,
.ser-lab__row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  align-items: baseline;
  padding: 10px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.ser-lab__row {
  flex: 0 0 auto;
}

.ser-lab__tag {
  flex: 0 0 auto;
  padding: 1px 7px;
  color: #111827;
  font-size: 10px;
  font-weight: 700;
  border-radius: 3px;
}

.ser-lab__tag--ink {
  color: #e5e7eb;
  background: #4b5563;
}
.ser-lab__tag--blue {
  background: #60a5fa;
}
.ser-lab__tag--green {
  background: #34d399;
}

.ser-lab__original code,
.ser-lab__row code {
  color: #f9fafb;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12.5px;
  overflow-wrap: anywhere;
}

.ser-lab__original em,
.ser-lab__row em {
  margin-left: auto;
  color: #9ca3af;
  font-size: 11px;
  font-style: normal;
  white-space: nowrap;
}

.ser-lab__mode {
  margin: 0;
  color: #9ca3af;
  font-size: 11px;
}

.ser-lab__mode code {
  color: #cbd5e1;
  font-size: 11px;
}

.ser-lab__verdict {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  min-height: 0;
  padding: 10px 12px;
  background: #052e2b;
  border-left: 4px solid #34d399;
  border-radius: 4px;
}

.ser-lab__verdict--lossy {
  background: #2a1e05;
  border-left-color: #fbbf24;
}

.ser-lab__verdict--threw {
  background: #2b1114;
  border-left-color: #fb7185;
}

.ser-lab__verdict strong {
  color: #34d399;
  font-size: 13px;
}

.ser-lab__verdict--lossy strong {
  color: #fbbf24;
}

.ser-lab__verdict--threw strong {
  color: #fb7185;
}

.ser-lab__verdict span {
  color: #d1d5db;
  font-size: 11.5px;
  line-height: 1.5;
}

.ser-lab__err {
  margin-top: 2px;
  color: #fecdd3;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10.5px;
  overflow-wrap: anywhere;
}

.ser-lab__foot {
  margin: 0;
  color: #6b7280;
  font-size: 10px;
}

.ser-lab__foot code {
  color: #9ca3af;
  font-size: 10px;
}
</style>
