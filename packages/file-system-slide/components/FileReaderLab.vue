<script setup lang="ts">
import { onUnmounted, ref } from "vue";

/**
 * File 读文件交互实验室
 * 真实 File API：input 选择 / 拖放 → 读元信息、slice 切片、文本预览或图片缩略图。
 *   · 元信息：name / size（带字节）/ type / lastModified
 *   · slice：file.slice(0,16) 零拷贝切前 16 字节，仅此刻读入内存 → 十六进制
 *   · 文本：file.slice(0,2048).text()（同时演示 slice + 新式 Promise 读法）
 *   · 图片：URL.createObjectURL 造缩略图，onload 后 revokeObjectURL（图仍显示）
 * SSR 安全：顶层零 window/FileReader/URL 访问；一切文件操作都在事件回调里；
 *          object URL 在图片 load 后 revoke，换文件与卸载再兜底 revoke，杜绝泄漏。
 */

/** 选中文件的元信息（全部在事件回调里赋值） */
interface Meta {
  name: string;
  size: number;
  type: string;
  lastModified: string;
}

const meta = ref<Meta | null>(null); // 元信息，null 时显示提示
const textPreview = ref(""); // 文本预览
const isImage = ref(false); // 当前文件是否图片
const imgUrl = ref(""); // 图片 object URL，绑定到 <img :src>
const sliceHex = ref(""); // slice(0,16) 的十六进制串
const urlNote = ref(""); // object URL 状态说明
const dragging = ref(false); // 拖放高亮态
const errorMsg = ref(""); // 错误信息

/** 当前存活的 object URL（非响应式，供幂等 revoke 兜底） */
let liveUrl = "";

/** 字节数 → 人类可读（纯函数，SSR 安全） */
function humanSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

/** 撤销当前 object URL（幂等，重复调用无害） */
function revokeLive(): void {
  if (liveUrl) {
    URL.revokeObjectURL(liveUrl);
    liveUrl = "";
  }
}

/** 处理一个 File —— 只在 input change / drop 回调里被调用，故可安全用浏览器 API */
async function handleFile(file: File): Promise<void> {
  errorMsg.value = "";
  revokeLive(); // 换文件先撤旧图 URL
  imgUrl.value = "";
  urlNote.value = "";

  // 元信息：type 可能为空串（浏览器未识别）；lastModified 是毫秒时间戳
  meta.value = {
    name: file.name,
    size: file.size,
    type: file.type || "(空 · 浏览器未识别)",
    lastModified: new Date(file.lastModified).toLocaleString("zh-CN"),
  };

  // slice 演示：零拷贝切前 16 字节，仅此刻真正读入内存
  try {
    const head = file.slice(0, 16); // 仍是 Blob，不占内存
    const bytes = new Uint8Array(await head.arrayBuffer());
    sliceHex.value = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
  } catch {
    sliceHex.value = "";
  }

  isImage.value = file.type.startsWith("image/");
  if (isImage.value) {
    // 图片：createObjectURL 造缩略图短链
    const url = URL.createObjectURL(file);
    liveUrl = url;
    imgUrl.value = url;
    textPreview.value = "";
  } else {
    // 文本：slice 前 2KB 再 text()（同时演示 slice + 新式 Promise 读法）
    try {
      const chunk = file.slice(0, 2048);
      textPreview.value = (await chunk.text()) || "(空文件)";
    } catch {
      textPreview.value = "(无法按文本预览此文件)";
    }
  }
}

/** 图片解码完成即可撤 URL —— DOM 已持解码结果，图仍显示，内存已释放 */
function onImgLoad(): void {
  revokeLive();
  urlNote.value = "onload 后已 revokeObjectURL —— 图仍显示，内存已释放";
}

/** input change 回调 */
function onChange(e: Event): void {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) void handleFile(file);
}

/** drop 回调：取 dataTransfer.files 第一个 */
function onDrop(e: DragEvent): void {
  e.preventDefault();
  dragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) void handleFile(file);
}

/** dragover 必须 preventDefault，否则浏览器直接打开文件、drop 不触发 */
function onDragOver(e: DragEvent): void {
  e.preventDefault();
  dragging.value = true;
}
function onDragLeave(): void {
  dragging.value = false;
}

// 卸载兜底：撤销残留 object URL，杜绝跨页泄漏
onUnmounted(revokeLive);
</script>

<template>
  <section class="fr-lab" aria-label="File 读文件实验">
    <!-- 选择 / 拖放区 -->
    <div
      class="fr-lab__drop"
      :class="{ 'is-drag': dragging }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input
        id="fr-input"
        type="file"
        class="fr-lab__input"
        data-testid="file-input"
        @change="onChange"
      />
      <label for="fr-input" class="fr-lab__btn">选择文件</label>
      <span class="fr-lab__tip">或拖文件到此 · 文本看预览 / 图片看缩略图</span>
    </div>

    <!-- 未选：提示 -->
    <p v-if="!meta" class="fr-lab__hint" data-testid="hint">
      选一个文件：读 <code>name/size/type/lastModified</code>、<code>slice(0,16)</code>
      十六进制、以及文本 <code>text()</code> 预览或图片缩略图。
    </p>

    <!-- 已选：元信息 + 预览 -->
    <div v-else class="fr-lab__grid">
      <dl class="fr-lab__meta" data-testid="meta">
        <div><dt>name</dt><dd data-testid="m-name">{{ meta.name }}</dd></div>
        <div>
          <dt>size</dt>
          <dd><code>{{ humanSize(meta.size) }}</code> <em>{{ meta.size }} 字节</em></dd>
        </div>
        <div><dt>type</dt><dd>{{ meta.type }}</dd></div>
        <div><dt>lastModified</dt><dd>{{ meta.lastModified }}</dd></div>
      </dl>

      <div class="fr-lab__preview">
        <div v-if="isImage" class="fr-lab__img-wrap">
          <img
            :src="imgUrl"
            alt="缩略图"
            class="fr-lab__img"
            data-testid="thumb"
            @load="onImgLoad"
          />
          <span class="fr-lab__note" data-testid="url-note">{{ urlNote }}</span>
        </div>
        <pre v-else class="fr-lab__text" data-testid="text-preview">{{ textPreview }}</pre>
      </div>
    </div>

    <!-- slice 演示 -->
    <div v-if="meta" class="fr-lab__slice" data-testid="slice-row">
      <code class="fr-lab__slice-label">file.slice(0, 16)</code>
      <span class="fr-lab__hex" data-testid="slice-hex">{{ sliceHex || "（空）" }}</span>
      <span class="fr-lab__slice-note">零拷贝切片，仅此刻读入这 16 字节</span>
    </div>
  </section>
</template>

<style scoped>
.fr-lab {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.fr-lab__drop {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border: 1.5px dashed #4b5563;
  border-radius: 8px;
  transition: border-color 0.15s, background 0.15s;
}

.fr-lab__drop.is-drag {
  background: #0b2540;
  border-color: #60a5fa;
}

/* 视觉隐藏原生 input，但保留可聚焦与 Playwright setInputFiles 可用 */
.fr-lab__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.fr-lab__btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 700;
  color: #052e16;
  background: #4ade80;
  border-radius: 6px;
  cursor: pointer;
}

.fr-lab__tip {
  color: #9ca3af;
  font-size: 13px;
}

.fr-lab__hint {
  margin: 0;
  min-height: 150px;
  padding: 18px 4px;
  color: #9ca3af;
  font-size: 13.5px;
  line-height: 1.6;
}

.fr-lab__hint code {
  color: #fca5a5;
}

.fr-lab__grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1.05fr 1fr;
  min-height: 150px;
}

.fr-lab__meta {
  display: grid;
  gap: 8px;
  margin: 0;
  align-content: start;
}

.fr-lab__meta > div {
  display: grid;
  grid-template-columns: 108px 1fr;
  align-items: baseline;
  gap: 10px;
}

.fr-lab__meta dt {
  color: #93c5fd;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12.5px;
  font-weight: 700;
}

.fr-lab__meta dd {
  margin: 0;
  color: #f3f4f6;
  font-size: 13px;
  word-break: break-all;
}

.fr-lab__meta dd code {
  color: #34d399;
  font-weight: 700;
}

.fr-lab__meta em {
  color: #9ca3af;
  font-size: 11.5px;
  font-style: normal;
}

.fr-lab__preview {
  display: flex;
  min-width: 0;
}

.fr-lab__img-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.fr-lab__img {
  max-width: 100%;
  max-height: 132px;
  object-fit: contain;
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
}

.fr-lab__note {
  color: #6ee7b7;
  font-size: 11.5px;
  line-height: 1.4;
}

.fr-lab__text {
  width: 100%;
  max-height: 150px;
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  color: #d1d5db;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
}

.fr-lab__slice {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 9px 14px;
  background: #0f172a;
  border-left: 4px solid #fbbf24;
  border-radius: 4px;
}

.fr-lab__slice-label {
  padding: 4px 10px;
  color: #451a03;
  font-weight: 800;
  white-space: nowrap;
  background: #fbbf24;
  border-radius: 4px;
}

.fr-lab__hex {
  color: #fcd34d;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12.5px;
  letter-spacing: 0.5px;
  word-break: break-all;
}

.fr-lab__slice-note {
  margin-left: auto;
  color: #9ca3af;
  font-size: 11.5px;
  white-space: nowrap;
}
</style>
