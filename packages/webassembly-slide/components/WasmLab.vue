<script setup lang="ts">
import { onMounted, ref } from "vue";

/**
 * 经 node 逐字节验证的 52 字节 Wasm 模块（真实字节码，非模拟）。等价 WAT：
 * (module
 *   (memory (export "mem") 1)
 *   (func (export "add") (param i32 i32) (result i32)
 *     local.get 0
 *     local.get 1
 *     i32.add))
 */
const WASM_BYTES = [
  0x00, 0x61, 0x73, 0x6d, // 魔数 "\0asm"
  0x01, 0x00, 0x00, 0x00, // 版本 1
  0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f, // type 段：(i32, i32) -> i32
  0x03, 0x02, 0x01, 0x00, // func 段：1 个函数，用 type 0
  0x05, 0x03, 0x01, 0x00, 0x01, // memory 段：1 页（64KiB）
  0x07, 0x0d, 0x02, // export 段：2 条导出
  0x03, 0x6d, 0x65, 0x6d, 0x02, 0x00, // "mem" → memory 0
  0x03, 0x61, 0x64, 0x64, 0x00, 0x00, // "add" → func 0
  0x0a, 0x09, 0x01, 0x07, 0x00, // code 段：1 个函数体
  0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b, // local.get 0 / local.get 1 / i32.add / end
];

/** 实例化状态：SSG 构建不执行浏览器代码，运行态在 onMounted 里才建立 */
const status = ref<"loading" | "ready" | "error">("loading");
const errorMsg = ref("");
const instTime = ref("");
const exportNames = ref<string[]>([]);
const memBytes = ref(0);

/** add 演示状态 */
const a = ref(40);
const b = ref(2);
const sum = ref<number | null>(null);
const callTime = ref("");

/** 线性内存演示状态 */
const text = ref("你好，Wasm");
const byteLen = ref(0);
const hexDump = ref("");
const decoded = ref("");

/** 实例导出的强类型引用（仅客户端赋值） */
let wasmExports: { add: (x: number, y: number) => number; mem: WebAssembly.Memory } | null = null;

/** 调用 Wasm 导出的 add：数值直通边界，参数按 ToInt32 截断 */
function callAdd() {
  if (!wasmExports) return;
  const t0 = performance.now();
  const result = wasmExports.add(Number(a.value), Number(b.value));
  callTime.value = ((performance.now() - t0) * 1000).toFixed(1);
  sum.value = result;
}

/** 写线性内存再读回：TextEncoder 编码 → 视图复制进 buffer → 读回解码 */
function writeMemory() {
  if (!wasmExports) return;
  const bytes = new TextEncoder().encode(text.value);
  const cap = Math.min(bytes.length, 4096); // 演示场景限幅，防超长输入
  // 用时现建视图（工程守则：grow 会 detach 旧 buffer，视图不要长期缓存）
  new Uint8Array(wasmExports.mem.buffer, 0, cap).set(bytes.subarray(0, cap));
  const readBack = new Uint8Array(wasmExports.mem.buffer, 0, cap);
  byteLen.value = cap;
  hexDump.value =
    [...readBack.subarray(0, 12)].map((x) => x.toString(16).padStart(2, "0")).join(" ") +
    (cap > 12 ? " …" : "");
  decoded.value = new TextDecoder().decode(readBack);
}

// 实例化只在浏览器端进行：顶层不 touch window / WebAssembly，SSR 安全
onMounted(async () => {
  try {
    const t0 = performance.now();
    // 真实编译 + 实例化：字节重载 resolve 为 { module, instance }
    const { instance } = await WebAssembly.instantiate(new Uint8Array(WASM_BYTES));
    instTime.value = (performance.now() - t0).toFixed(2);
    wasmExports = instance.exports as unknown as {
      add: (x: number, y: number) => number;
      mem: WebAssembly.Memory;
    };
    exportNames.value = Object.keys(instance.exports);
    memBytes.value = wasmExports.mem.buffer.byteLength;
    status.value = "ready";
    // 进页即有数据：自动跑一遍两个演示
    callAdd();
    writeMemory();
  } catch (e) {
    // 兜底错误态：老引擎 / CSP 拦截等场景可见原因
    status.value = "error";
    errorMsg.value = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }
});
</script>

<template>
  <section class="wasm-lab" aria-label="WebAssembly 真实运行实验">
    <div v-if="status === 'error'" class="wasm-lab__error" role="alert">
      <strong>实例化失败</strong>
      <code>{{ errorMsg }}</code>
    </div>

    <template v-else>
      <div class="wasm-lab__status">
        <span
          :class="['wasm-lab__badge', { 'wasm-lab__badge--ready': status === 'ready' }]"
        >{{ status === "ready" ? "Instance ready" : "instantiating…" }}</span>
        <code>字节码 {{ WASM_BYTES.length }} B</code>
        <code>instantiate {{ instTime || "—" }} ms</code>
        <code>exports: {{ exportNames.join(" · ") || "—" }}</code>
        <code>Memory {{ memBytes.toLocaleString() }} B（1 页）</code>
      </div>

      <div class="wasm-lab__grid">
        <div class="wasm-lab__panel">
          <h4>JS → Wasm：调用导出函数 <code>add</code></h4>
          <div class="wasm-lab__row">
            <input v-model.number="a" type="number" aria-label="参数 a" />
            <span class="wasm-lab__op">+</span>
            <input v-model.number="b" type="number" aria-label="参数 b" />
            <button type="button" :disabled="status !== 'ready'" @click="callAdd">
              调用 Wasm
            </button>
          </div>
          <div class="wasm-lab__out">
            <span>i32 返回值</span>
            <strong>{{ sum ?? "—" }}</strong>
            <small>本次调用 {{ callTime || "—" }} µs · 参数按 ToInt32 截断（试试 2147483647 + 1）</small>
          </div>
        </div>

        <div class="wasm-lab__panel">
          <h4>线性内存：<code>mem.buffer</code> 上现建视图读写</h4>
          <div class="wasm-lab__row">
            <input v-model="text" type="text" class="wasm-lab__text" aria-label="写入文本" />
            <button type="button" :disabled="status !== 'ready'" @click="writeMemory">
              写入 → 读回
            </button>
          </div>
          <div class="wasm-lab__out">
            <span>UTF-8 {{ byteLen }} B @ 地址 0</span>
            <strong class="wasm-lab__hex">{{ hexDump || "—" }}</strong>
            <small>TextDecoder 读回：{{ decoded || "—" }}</small>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.wasm-lab {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.wasm-lab__error {
  display: grid;
  gap: 8px;
  padding: 18px;
  color: #fecaca;
  background: #1f2937;
  border-left: 4px solid #f87171;
  border-radius: 6px;
}

.wasm-lab__status {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.wasm-lab__badge {
  padding: 4px 10px;
  color: #111827;
  font-size: 0.7rem;
  font-weight: 700;
  background: #fbbf24;
  border-radius: 999px;
}

.wasm-lab__badge--ready {
  background: #34d399;
}

.wasm-lab__status > code {
  padding: 4px 8px;
  color: #c4b5fd;
  font-size: 0.7rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 4px;
}

.wasm-lab__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.wasm-lab__panel {
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 12px 14px;
  background: #1f2937;
  border-top: 3px solid #654ff0;
  border-radius: 6px;
}

.wasm-lab__panel h4 {
  margin: 0;
  color: #d1d5db;
  font-size: 0.8rem;
  font-weight: 600;
}

.wasm-lab__panel h4 code {
  color: #a78bfa;
}

.wasm-lab__row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.wasm-lab__row input {
  min-width: 0;
  width: 86px;
  min-height: 32px;
  padding: 4px 8px;
  color: #f9fafb;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #0f172a;
  border: 1px solid #4b5563;
  border-radius: 5px;
}

.wasm-lab__row input.wasm-lab__text {
  flex: 1;
  width: auto;
}

.wasm-lab__op {
  color: #9ca3af;
}

.wasm-lab__row button {
  min-height: 32px;
  padding: 4px 12px;
  color: #ede9fe;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
  background: #654ff0;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}

.wasm-lab__row button:disabled {
  opacity: 0.5;
  cursor: wait;
}

.wasm-lab__out {
  display: grid;
  gap: 3px;
  padding: 8px 10px;
  background: #0f172a;
  border-left: 3px solid #a78bfa;
  border-radius: 4px;
}

.wasm-lab__out span,
.wasm-lab__out small {
  color: #9ca3af;
  font-size: 0.66rem;
}

.wasm-lab__out strong {
  color: #fbbf24;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.05rem;
}

.wasm-lab__out strong.wasm-lab__hex {
  font-size: 0.78rem;
  overflow-wrap: anywhere;
}
</style>
