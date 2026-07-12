<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";

/*
 * 常用杂项 API 四探针实验台——全部调用真实浏览器 API，每探针含特性检测降级。
 * SSR 安全：顶层零 window/document/navigator 访问，一律在 onMounted / 事件回调 / watch 里触碰。
 */

/* ============ 探针①：Clipboard writeText 复制 ============ */
/** 待复制文本 */
const clipText = ref("https://illegalscreed.cn");
/** 复制结果态：待命 / 成功 / 失败 / 不支持 */
const clipStatus = ref<"idle" | "ok" | "fail" | "unsupported">("idle");

/** 点击复制：特性检测 → 真实 writeText → 结果反馈（navigator 只在回调内访问，SSR 安全） */
async function doCopy(): Promise<void> {
  // 特性检测降级：非安全上下文 / 老浏览器没有 clipboard.writeText
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    clipStatus.value = "unsupported";
    return;
  }
  try {
    await navigator.clipboard.writeText(clipText.value);
    clipStatus.value = "ok";
  } catch {
    // 无焦点 / 权限被拒 / 激活过期都会落这里——优雅兜底、不抛脸给用户
    clipStatus.value = "fail";
  }
}

/* ============ 探针②：Page Visibility 实时 visibilityState ============ */
/** 当前可见性文本 */
const visState = ref("—");
/** visibilitychange 触发次数 */
const visChanges = ref(0);

/** 可见性回调：同步读取最新 visibilityState 并计数 */
function onVisChange(): void {
  visState.value = document.visibilityState;
  visChanges.value += 1;
}

/* ============ 探针③：Permissions query 权限状态 ============ */
/** 单条权限查询结果 */
interface PermRow {
  /** 权限名 */
  name: string;
  /** 查询到的状态（含跨浏览器兜底值） */
  state: string;
}
/** 要探测的权限名——含 clipboard-read（Firefox/Safari 不认，会抛 TypeError） */
const perms = reactive<PermRow[]>([
  { name: "geolocation", state: "…" },
  { name: "notifications", state: "…" },
  { name: "camera", state: "…" },
  { name: "clipboard-read", state: "…" },
]);

/** 逐个查询权限：query 不支持 / 名字不认都要兜底，绝不让整段逻辑崩 */
async function queryPerms(): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    for (const p of perms) p.state = "unsupported";
    return;
  }
  for (const p of perms) {
    try {
      // 各浏览器可查名单不一，TS 的 PermissionName 不含 clipboard-read，此处放宽
      const s = await navigator.permissions.query({
        name: p.name as PermissionName,
      });
      p.state = s.state; // "granted" | "denied" | "prompt"
    } catch {
      // Firefox/Safari 查 clipboard-read 抛 TypeError → 记为 unknown
      p.state = "unknown";
    }
  }
}

/* ============ 探针④：URLPattern 匹配 + 命名分组 ============ */
/** 固定模式：两段命名分组 */
const URL_PATTERN = "/users/:id/posts/:postId";
/** 可编辑的待匹配 URL */
const urlInput = ref("https://example.com/users/42/posts/7");
/** 是否匹配：null = 未算 / 不支持 */
const urlMatched = ref<boolean | null>(null);
/** 命名分组结果 */
const urlGroups = reactive<Record<string, string>>({});
/** URLPattern 是否可用（特性检测结果） */
const urlSupported = ref(true);

/** 执行匹配：SSR 安全——仅在 onMounted / watch 回调里触碰浏览器全局 URLPattern */
function runMatch(): void {
  // 特性检测：URLPattern 到 2025 才 Baseline，旧环境需降级
  const g = globalThis as unknown as {
    URLPattern?: new (init: { pathname: string }) => {
      exec: (
        url: string,
      ) => { pathname: { groups: Record<string, string> } } | null;
    };
  };
  urlSupported.value = typeof g.URLPattern === "function";
  // 清空旧分组
  for (const k of Object.keys(urlGroups)) delete urlGroups[k];
  if (!g.URLPattern) {
    urlMatched.value = null;
    return;
  }
  const pattern = new g.URLPattern({ pathname: URL_PATTERN });
  const result = pattern.exec(urlInput.value);
  urlMatched.value = result !== null;
  if (result) Object.assign(urlGroups, result.pathname.groups);
}

/* ============ 生命周期：顶层零 window，全部在挂载后接线 ============ */
onMounted(() => {
  // Page Visibility：特性检测 + 首帧读一次 + 订阅变化
  if (typeof document !== "undefined" && "visibilityState" in document) {
    visState.value = document.visibilityState;
    document.addEventListener("visibilitychange", onVisChange);
  } else {
    visState.value = "unsupported";
  }
  // 权限与 URLPattern 首次计算
  queryPerms();
  runMatch();
});

// 编辑 URL 即时重算匹配
watch(urlInput, runMatch);

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", onVisChange);
  }
});
</script>

<template>
  <section class="probe" aria-label="常用杂项 API 四探针实验台">
    <!-- 探针①：Clipboard writeText -->
    <article class="probe__card">
      <header class="probe__head">
        <span class="probe__no">01</span>
        <strong>Clipboard 复制</strong>
        <code>writeText</code>
      </header>
      <div class="probe__body">
        <input
          v-model="clipText"
          class="probe__input"
          spellcheck="false"
          aria-label="要复制的文本"
        />
        <button type="button" class="probe__btn" @click="doCopy">
          复制到剪贴板
        </button>
        <p class="probe__status" :class="`is-${clipStatus}`">
          <span v-if="clipStatus === 'idle'">
            点按钮触发真实 writeText（需焦点 + 激活）
          </span>
          <span v-else-if="clipStatus === 'ok'">✓ 已写入系统剪贴板</span>
          <span v-else-if="clipStatus === 'fail'">
            ✗ 被拒 / 无焦点——已优雅兜底
          </span>
          <span v-else>该环境不支持，降级到 execCommand</span>
        </p>
      </div>
    </article>

    <!-- 探针②：Page Visibility -->
    <article class="probe__card">
      <header class="probe__head">
        <span class="probe__no">02</span>
        <strong>Page Visibility</strong>
        <code>visibilityState</code>
      </header>
      <div class="probe__body">
        <div
          class="probe__big"
          :class="visState === 'visible' ? 'is-on' : 'is-off'"
        >
          {{ visState }}
        </div>
        <p class="probe__hint">切到别的标签再切回 → 状态翻转、计数 +1</p>
        <p class="probe__meta">visibilitychange 已触发 {{ visChanges }} 次</p>
      </div>
    </article>

    <!-- 探针③：Permissions query -->
    <article class="probe__card">
      <header class="probe__head">
        <span class="probe__no">03</span>
        <strong>Permissions 查询</strong>
        <code>query</code>
      </header>
      <div class="probe__body">
        <ul class="probe__perms">
          <li v-for="p in perms" :key="p.name">
            <code>{{ p.name }}</code>
            <span class="probe__pill" :class="`is-${p.state}`">
              {{ p.state }}
            </span>
          </li>
        </ul>
        <p class="probe__hint">
          clipboard-read 在 Firefox/Safari 抛 TypeError → 兜底 unknown
        </p>
      </div>
    </article>

    <!-- 探针④：URLPattern -->
    <article class="probe__card">
      <header class="probe__head">
        <span class="probe__no">04</span>
        <strong>URLPattern 匹配</strong>
        <code>exec</code>
      </header>
      <div class="probe__body">
        <p class="probe__pattern">/users/:id/posts/:postId</p>
        <input
          v-model="urlInput"
          class="probe__input"
          spellcheck="false"
          aria-label="待匹配 URL"
        />
        <p v-if="urlSupported" class="probe__match">
          <span
            class="probe__pill"
            :class="urlMatched ? 'is-granted' : 'is-denied'"
          >
            {{ urlMatched ? "匹配 ✓" : "不匹配" }}
          </span>
          <span v-if="urlMatched" class="probe__groups">
            id=<b>{{ urlGroups.id }}</b> · postId=<b>{{ urlGroups.postId }}</b>
          </span>
        </p>
        <p v-else class="probe__status is-unsupported">
          该环境无 URLPattern → 用 urlpattern-polyfill
        </p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.probe {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  width: 100%;
  height: 400px;
  padding: 12px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.probe__card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 11px 12px;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
}

.probe__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 9px;
}

.probe__no {
  color: #6b7280;
  font-size: 11px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.probe__head strong {
  color: #f9fafb;
  font-size: 13px;
}

.probe__head code {
  margin-left: auto;
  color: #34d399;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.probe__body {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-height: 0;
}

.probe__input {
  padding: 6px 9px;
  color: #f9fafb;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 5px;
}

.probe__btn {
  padding: 6px 10px;
  color: #052e1a;
  font-size: 12px;
  font-weight: 700;
  background: #34d399;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}

.probe__btn:hover {
  background: #6ee7b7;
}

.probe__status {
  margin: 0;
  color: #9ca3af;
  font-size: 10.5px;
  line-height: 1.35;
}

.probe__status.is-ok {
  color: #34d399;
}
.probe__status.is-fail {
  color: #fbbf24;
}
.probe__status.is-unsupported {
  color: #fb7185;
}

.probe__big {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px;
  font-size: 22px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.02em;
  background: #0f172a;
  border-radius: 6px;
}

.probe__big.is-on {
  color: #052e1a;
  background: #34d399;
}
.probe__big.is-off {
  color: #cbd5e1;
  background: #374151;
}

.probe__hint {
  margin: 0;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.35;
}

.probe__meta {
  margin: 0;
  color: #22d3ee;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.probe__perms {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.probe__perms li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.probe__perms code {
  color: #d1d5db;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.probe__pill {
  padding: 1px 7px;
  color: #cbd5e1;
  font-size: 10px;
  font-weight: 700;
  background: #374151;
  border-radius: 3px;
}

.probe__pill.is-granted {
  color: #052e1a;
  background: #34d399;
}
.probe__pill.is-denied {
  color: #4c0519;
  background: #fb7185;
}
.probe__pill.is-prompt {
  color: #422006;
  background: #fbbf24;
}
.probe__pill.is-unknown,
.probe__pill.is-unsupported {
  color: #e5e7eb;
  background: #4b5563;
}

.probe__pattern {
  margin: 0;
  padding: 4px 8px;
  color: #93c5fd;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #0f172a;
  border-radius: 4px;
}

.probe__match {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.probe__groups {
  color: #9ca3af;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.probe__groups b {
  color: #f9fafb;
}
</style>
