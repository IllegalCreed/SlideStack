<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

/**
 * 事务失活实验室
 * 用真实的浏览器 IndexedDB 复现头号深坑：
 *   路径一「同步连续 put」——全程在活跃窗口内，事务正常提交；
 *   路径二「await 慢 Promise 后再 put」——控制权回到事件循环、事务自动提交/失活，
 *          续发请求同步抛 TransactionInactiveError。
 * SSR 安全：顶层零 window/indexedDB 访问；所有 indexedDB 调用都在 onMounted 或
 *          按钮回调里；组件卸载时 deleteDatabase 清理。
 */

/** 演示用库名与对象存储名（卸载时会被 deleteDatabase 清掉） */
const DB_NAME = "idb-tx-lab-demo";
const STORE = "notes";

type StepStatus = "ok" | "fail" | "pending";
interface Step {
  /** 这一步做了什么 */
  label: string;
  /** 事务此刻的状态：活跃 / 失活 / 已提交 / 等待中 */
  txState: string;
  /** 补充说明或错误信息 */
  detail: string;
  status: StepStatus;
}

const supported = ref(true); // 浏览器是否支持 indexedDB
const running = ref(false); // 是否有实验正在进行
const steps = ref<Step[]>([]); // 分步过程记录
const verdict = ref(""); // 最终结论
const verdictKind = ref<"" | "ok" | "fail">("");
const errName = ref(""); // 触发的错误名（TransactionInactiveError）

/** 数据库连接：非响应式，避免把宿主对象塞进 Vue 响应系统 */
let db: IDBDatabase | null = null;

/** 打开（或建）演示库——只在浏览器端被调用 */
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    // 唯一能建 objectStore 的地方：升级事务
    req.onupgradeneeded = () => {
      const database = req.result;
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * 慢 Promise：用 setTimeout 制造一个真实的宏任务边界，
 * 模拟 `await fetch(...)` —— 等待期间控制权回到事件循环（不发真实网络）。
 */
function slowPromise(ms = 80): Promise<{ title: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ title: "远程草稿（模拟网络返回）" }), ms);
  });
}

function pushStep(label: string, txState: string, detail: string, status: StepStatus) {
  steps.value.push({ label, txState, detail, status });
}

function reset() {
  steps.value = [];
  verdict.value = "";
  verdictKind.value = "";
  errName.value = "";
}

/** 等一笔事务收尾，落库则 resolve，出错/中止则 reject */
function whenSettled(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("error"));
    tx.onabort = () => reject(tx.error ?? new Error("abort"));
  });
}

/** 路径一：事务内同步连续 put —— 全程活跃，正常提交 */
async function runSync() {
  reset();
  running.value = true;
  try {
    if (!db) db = await openDb();
    // 以下一气呵成：创建事务的这个任务里，事务始终活跃
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    pushStep("db.transaction(readwrite)", "活跃", "创建即启动，进入活跃窗口", "ok");
    store.put({ title: "本地草稿 A" });
    pushStep("同步 put A", "活跃", "请求入队，事务仍活跃", "ok");
    store.put({ title: "本地草稿 B" });
    pushStep("紧接着同步 put B", "活跃", "同一活跃窗口，续发合法", "ok");
    await whenSettled(tx); // 这一步 await 在所有请求发出之后，不影响事务
    pushStep("tx.oncomplete", "已提交", "整笔原子落库，2 条写入成功", "ok");
    verdict.value = "同步连续 put：全程在活跃窗口内，事务正常提交";
    verdictKind.value = "ok";
  } catch (e) {
    const name = (e as DOMException)?.name ?? "Error";
    errName.value = name;
    verdict.value = `意外失败：${name}`;
    verdictKind.value = "fail";
  } finally {
    running.value = false;
  }
}

/** 路径二：事务内 await 慢 Promise 后再 put —— 触发 TransactionInactiveError */
async function runAwait() {
  reset();
  running.value = true;
  try {
    if (!db) db = await openDb();
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    pushStep("db.transaction(readwrite)", "活跃", "创建即启动，进入活跃窗口", "ok");
    store.put({ title: "本地草稿" });
    pushStep("同步 put 本地草稿", "活跃", "请求入队，事务仍活跃", "ok");
    pushStep(
      "await 慢 Promise（模拟 await fetch）",
      "等待中",
      "控制权交回事件循环，无未决请求 → 事务自动提交",
      "pending",
    );
    const remote = await slowPromise(); // 关键：跨了一个宏任务
    // 回到这里已经是【另一个任务】了，事务早已提交/失活
    try {
      store.put(remote); // 真实 API：对失活事务发请求 → 同步抛
      pushStep("await 之后再 put", "活跃", "居然成功（不应发生）", "ok");
      verdict.value = "未复现——该环境行为异常";
      verdictKind.value = "ok";
    } catch (e) {
      const name = (e as DOMException)?.name ?? "Error";
      errName.value = name;
      pushStep(`await 之后再 put → 抛错`, "已失活", `${name}：事务在等待期间已提交`, "fail");
      verdict.value = "复现头号深坑：await 非 IDB 异步后事务已失活，续用非法";
      verdictKind.value = "fail";
    }
  } catch (e) {
    const name = (e as DOMException)?.name ?? "Error";
    errName.value = name;
    verdict.value = `意外失败：${name}`;
    verdictKind.value = "fail";
  } finally {
    running.value = false;
  }
}

onMounted(async () => {
  // SSR 安全：仅在客户端挂载后才探测并打开
  if (typeof indexedDB === "undefined") {
    supported.value = false;
    return;
  }
  try {
    db = await openDb();
  } catch {
    supported.value = false;
  }
});

onUnmounted(() => {
  // 卸载兜底：关连接并删库，避免污染演示环境
  try {
    db?.close();
    db = null;
    if (typeof indexedDB !== "undefined") indexedDB.deleteDatabase(DB_NAME);
  } catch {
    /* 忽略清理错误 */
  }
});
</script>

<template>
  <section class="tx-lab" aria-label="IndexedDB 事务失活实验">
    <div class="tx-lab__controls">
      <button
        type="button"
        class="tx-lab__btn tx-lab__btn--ok"
        data-testid="run-sync"
        :disabled="running || !supported"
        @click="runSync"
      >
        ① 事务内同步连续 put
      </button>
      <button
        type="button"
        class="tx-lab__btn tx-lab__btn--bad"
        data-testid="run-await"
        :disabled="running || !supported"
        @click="runAwait"
      >
        ② 事务内 await 后再 put
      </button>
    </div>

    <p v-if="!supported" class="tx-lab__unsupported">
      当前环境不支持 IndexedDB，无法运行本实验。
    </p>

    <ol v-else class="tx-lab__steps" data-testid="steps">
      <li v-if="steps.length === 0" class="tx-lab__hint">
        点上面任一按钮：左路成功提交，右路复现 <code>TransactionInactiveError</code>。
      </li>
      <li v-for="(s, i) in steps" :key="i" :class="['tx-lab__step', `is-${s.status}`]">
        <span class="tx-lab__dot" />
        <code class="tx-lab__label">{{ s.label }}</code>
        <span :class="['tx-lab__state', `state-${s.status}`]">{{ s.txState }}</span>
        <span class="tx-lab__detail">{{ s.detail }}</span>
      </li>
    </ol>

    <div
      v-if="verdict"
      :class="['tx-lab__verdict', `tx-lab__verdict--${verdictKind}`]"
      data-testid="verdict"
    >
      <code v-if="errName" class="tx-lab__errname">{{ errName }}</code>
      <code v-else-if="verdictKind === 'ok'" class="tx-lab__errname">oncomplete</code>
      <span>{{ verdict }}</span>
    </div>
  </section>
</template>

<style scoped>
.tx-lab {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 16px 18px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.tx-lab__controls {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
}

.tx-lab__btn {
  min-height: 42px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.tx-lab__btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.tx-lab__btn--ok {
  color: #052e16;
  background: #4ade80;
}

.tx-lab__btn--bad {
  color: #fef3c7;
  background: #b91c1c;
}

.tx-lab__unsupported,
.tx-lab__hint {
  margin: 0;
  color: #9ca3af;
  font-size: 13.5px;
  line-height: 1.5;
}

.tx-lab__hint code,
.tx-lab__unsupported code {
  color: #fca5a5;
}

.tx-lab__steps {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
  min-height: 128px;
}

.tx-lab__step {
  display: grid;
  align-items: center;
  gap: 10px;
  grid-template-columns: 12px minmax(200px, auto) 56px 1fr;
  padding: 5px 0;
}

.tx-lab__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #64748b;
}

.tx-lab__step.is-ok .tx-lab__dot {
  background: #34d399;
}
.tx-lab__step.is-fail .tx-lab__dot {
  background: #fb7185;
}
.tx-lab__step.is-pending .tx-lab__dot {
  background: #fbbf24;
}

.tx-lab__label {
  color: #f9fafb;
  font-size: 13.5px;
}

.tx-lab__state {
  padding: 2px 6px;
  font-size: 11.5px;
  font-weight: 700;
  text-align: center;
  border-radius: 4px;
}

.state-ok {
  color: #052e16;
  background: #34d399;
}
.state-fail {
  color: #4c0519;
  background: #fb7185;
}
.state-pending {
  color: #451a03;
  background: #fbbf24;
}

.tx-lab__detail {
  color: #9ca3af;
  font-size: 12.5px;
  line-height: 1.4;
}

.tx-lab__verdict {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 9px 14px;
  font-size: 13.5px;
  background: #0f172a;
  border-left: 4px solid #64748b;
  border-radius: 4px;
}

.tx-lab__verdict--ok {
  border-left-color: #34d399;
}
.tx-lab__verdict--fail {
  border-left-color: #fb7185;
}

.tx-lab__errname {
  padding: 4px 10px;
  color: #0f172a;
  font-weight: 800;
  white-space: nowrap;
  background: #94a3b8;
  border-radius: 4px;
}

.tx-lab__verdict--ok .tx-lab__errname {
  background: #34d399;
}
.tx-lab__verdict--fail .tx-lab__errname {
  background: #fb7185;
}
</style>
