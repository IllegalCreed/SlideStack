<script setup lang="ts">
import { computed, ref } from "vue";

/** 预设流样例：id 用于按钮高亮，text 是原始 text/event-stream 文本 */
interface Preset {
  id: string;
  label: string;
  text: string;
}

/** 行级判定结果：这一行被解析器当成了什么 */
interface LineView {
  raw: string;
  chip: string;
  tone: "green" | "blue" | "amber" | "violet" | "red" | "muted";
  note: string;
}

/** 一个事件块（两个空行之间）的整体结局 */
interface BlockView {
  key: number;
  lines: LineView[];
  status: "dispatched" | "silent" | "discarded";
  type?: string;
  receiver?: string;
  data?: string;
  lastEventId?: string;
  reason?: string;
}

/** 预设一：四字段与多行 data 全家福（以空行完整收尾） */
const presetFields =
  [
    ": 已连接（注释行，客户端不可见）",
    "",
    "retry: 10000",
    "",
    "data: 你好",
    "",
    "data: 第一行",
    "data: 第二行",
    "",
    "event: price",
    "id: 42",
    'data: {"symbol":"AAPL"}',
  ].join("\n") + "\n\n";

/** 预设二：心跳注释、无 data 块、未知字段与 EOF 残块 */
const presetEmpty = [
  ": ping",
  "",
  "event: ping",
  "",
  "data:",
  "",
  "Data: 字段名大小写敏感",
  "data: 上一行按未知字段忽略",
  "",
  "data: 尾部残块（未以空行收尾）",
].join("\n");

/** 预设三：id 记账、裸 id 重置与非法 retry */
const presetIds =
  [
    "id: 41",
    "data: tick 1",
    "",
    "data: tick 2（没带 id，沿用 41）",
    "",
    "id",
    "data: 裸 id 行把最后事件 ID 重置为空",
    "",
    "retry: 5s",
    "data: retry 非纯数字，整行忽略",
  ].join("\n") + "\n\n";

const presets: readonly Preset[] = [
  { id: "fields", label: "四字段全家福", text: presetFields },
  { id: "empty", label: "空块与心跳", text: presetEmpty },
  { id: "ids", label: "id 记账与重置", text: presetIds },
];

/** 可编辑的原始事件流文本 */
const source = ref<string>(presetFields);

/** 当前文本恰好等于某个预设时高亮对应按钮 */
const activeId = computed(
  () => presets.find((p) => p.text === source.value)?.id ?? "",
);

/** 按 WHATWG Server-sent events 处理模型逐行解析整段流 */
const parsed = computed(() => {
  // 流开头的一个 BOM 会被剥掉
  const text = source.value.replace(/^\uFEFF/, "");
  // 行尾 CRLF / CR / LF 三种都合法
  const segments = text.split(/\r\n|\r|\n/);
  // split 的最后一段未被换行终结：非空则是 EOF 处的"半行"，不作为完整行处理
  const tail = segments.pop() ?? "";

  const blocks: BlockView[] = [];
  let cur: LineView[] = [];
  let dataBuf = ""; // 数据缓冲：data 字段追加"值 + 换行"
  let eventType = ""; // 事件类型缓冲：派发后重置
  let idBuffer = ""; // 最后事件 ID 缓冲：派发后不重置、持续沿用
  let lastEventId = ""; // 连接的"最后事件 ID"（空行到来时从缓冲写入）
  let retry: number | null = null; // retry 字段设定的重连间隔
  let dispatched = 0;
  let key = 0;

  /** 空行到来：先应用 id 缓冲，再决定派发与否（无 data 不派发） */
  const flush = () => {
    lastEventId = idBuffer; // id / retry 的副作用照常生效
    if (dataBuf === "") {
      if (cur.length) {
        blocks.push({
          key: key++,
          lines: cur,
          status: "silent",
          reason: "数据缓冲为空 → 不派发（块内 id / retry 副作用照常生效）",
        });
      }
      eventType = "";
      cur = [];
      return;
    }
    // 数据缓冲末尾的一个换行剥掉 → 多行 data 以 \n 拼接
    const data = dataBuf.endsWith("\n") ? dataBuf.slice(0, -1) : dataBuf;
    const type = eventType === "" ? "message" : eventType;
    blocks.push({
      key: key++,
      lines: cur,
      status: "dispatched",
      type,
      receiver:
        type === "message" ? "onmessage 可收" : `仅 addEventListener("${type}")`,
      data,
      lastEventId,
    });
    dispatched += 1;
    dataBuf = "";
    eventType = "";
    cur = [];
  };

  /** 处理一条完整行：注释 / 字段 / 未知，并记录行级判定 */
  const processLine = (raw: string) => {
    if (raw === "") {
      flush();
      return;
    }
    if (raw.startsWith(":")) {
      cur.push({
        raw,
        chip: "注释",
        tone: "muted",
        note: "整行忽略，不产生任何客户端事件",
      });
      return;
    }
    // 第一个冒号切分字段名 / 值；值的一个前导空格被剥掉
    const idx = raw.indexOf(":");
    const field = idx === -1 ? raw : raw.slice(0, idx);
    let value = idx === -1 ? "" : raw.slice(idx + 1);
    if (value.startsWith(" ")) value = value.slice(1);

    switch (field) {
      case "data":
        dataBuf += value + "\n";
        cur.push({
          raw,
          chip: "data",
          tone: "green",
          note: value === "" ? "空值也追加换行 → 缓冲非空，仍会派发" : "追加进数据缓冲",
        });
        break;
      case "event":
        eventType = value;
        cur.push({
          raw,
          chip: "event",
          tone: "blue",
          note: `事件类型设为 "${value}"`,
        });
        break;
      case "id":
        if (value.includes("\u0000")) {
          cur.push({ raw, chip: "id", tone: "red", note: "值含 NULL → 整行忽略" });
        } else {
          idBuffer = value;
          cur.push({
            raw,
            chip: "id",
            tone: "amber",
            note:
              value === ""
                ? "空值 → 最后事件 ID 重置为空"
                : `最后事件 ID ← "${value}"`,
          });
        }
        break;
      case "retry":
        if (/^\d+$/.test(value)) {
          retry = Number(value);
          cur.push({
            raw,
            chip: "retry",
            tone: "violet",
            note: `重连间隔设为 ${value}ms`,
          });
        } else {
          cur.push({
            raw,
            chip: "retry",
            tone: "red",
            note: "非纯 ASCII 数字 → 整行忽略",
          });
        }
        break;
      default:
        cur.push({
          raw,
          chip: "未知",
          tone: "red",
          note: "未知字段（大小写敏感）→ 整行忽略",
        });
    }
  };

  for (const line of segments) processLine(line);

  // EOF：未以空行收尾的残块整体丢弃，不派发不完整事件
  if (tail !== "") {
    cur.push({
      raw: tail,
      chip: "半行",
      tone: "red",
      note: "未被换行终结，EOF 不处理",
    });
  }
  if (cur.length) {
    blocks.push({
      key: key++,
      lines: cur,
      status: "discarded",
      reason: "EOF 未以空行收尾 → 残块整体丢弃，不派发",
    });
  }

  return { blocks, lastEventId, retry, dispatched };
});
</script>

<template>
  <section class="stream-lab" aria-label="SSE 事件流解析实验室">
    <div class="stream-lab__left">
      <div class="stream-lab__presets" role="group" aria-label="预设样例">
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          :class="[
            'stream-lab__preset',
            { 'stream-lab__preset--active': activeId === preset.id },
          ]"
          :aria-pressed="activeId === preset.id"
          @click="source = preset.text"
        >
          {{ preset.label }}
        </button>
      </div>
      <textarea
        v-model="source"
        class="stream-lab__source"
        spellcheck="false"
        aria-label="原始 text/event-stream 文本，可编辑"
      ></textarea>
      <p class="stream-lab__hint">原始 text/event-stream，可直接编辑；空行分隔事件块</p>
    </div>

    <div class="stream-lab__right">
      <div class="stream-lab__blocks">
        <article
          v-for="block in parsed.blocks"
          :key="block.key"
          :class="['stream-lab__block', `stream-lab__block--${block.status}`]"
        >
          <div v-for="(line, i) in block.lines" :key="i" class="stream-lab__line">
            <span :class="['stream-lab__chip', `stream-lab__chip--${line.tone}`]">
              {{ line.chip }}
            </span>
            <code>{{ line.raw }}</code>
            <em>{{ line.note }}</em>
          </div>
          <footer class="stream-lab__outcome">
            <template v-if="block.status === 'dispatched'">
              <strong>派发 {{ block.type }}</strong>
              <span>{{ block.receiver }}</span>
              <code>data = {{ JSON.stringify(block.data) }}</code>
              <code>lastEventId = {{ JSON.stringify(block.lastEventId) }}</code>
            </template>
            <template v-else>
              <strong>{{ block.status === "silent" ? "不派发" : "残块丢弃" }}</strong>
              <span>{{ block.reason }}</span>
            </template>
          </footer>
        </article>
      </div>
      <footer class="stream-lab__state">
        <span>
          共派发 <strong>{{ parsed.dispatched }}</strong> 个事件
        </span>
        <span>
          lastEventId = {{ JSON.stringify(parsed.lastEventId) }} ·
          {{
            parsed.lastEventId === ""
              ? "重连不带 Last-Event-ID 头"
              : `重连自动带 Last-Event-ID: ${parsed.lastEventId}`
          }}
        </span>
        <span>
          retry =
          {{ parsed.retry === null ? "未设置（浏览器默认，几秒量级）" : `${parsed.retry}ms` }}
        </span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.stream-lab {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 12px;
  width: 100%;
  height: 396px;
  padding: 12px;
  color: #e5e7eb;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
}

.stream-lab__left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.stream-lab__presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border: 1px solid #4b5563;
  border-radius: 6px;
}

.stream-lab__preset {
  min-height: 30px;
  padding: 4px 6px;
  color: #d1d5db;
  font-size: 11px;
  background: #1f2937;
  border: 0;
  border-right: 1px solid #4b5563;
  cursor: pointer;
}

.stream-lab__preset:last-child {
  border-right: 0;
}

.stream-lab__preset--active {
  color: #111827;
  font-weight: 700;
  background: #fbbf24;
}

.stream-lab__source {
  flex: 1;
  min-height: 0;
  padding: 8px 10px;
  color: #f9fafb;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  resize: none;
}

.stream-lab__hint {
  margin: 0;
  color: #6b7280;
  font-size: 10px;
}

.stream-lab__right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.stream-lab__blocks {
  flex: 1;
  min-height: 0;
  padding-right: 4px;
  overflow-y: auto;
}

.stream-lab__block {
  margin-bottom: 8px;
  padding: 6px 8px;
  background: #1f2937;
  border-left: 3px solid #34d399;
  border-radius: 4px;
}

.stream-lab__block--silent {
  border-left-color: #fbbf24;
}

.stream-lab__block--discarded {
  border-left-color: #fb7185;
}

.stream-lab__line {
  display: flex;
  gap: 6px;
  align-items: baseline;
  padding: 2px 0;
}

.stream-lab__chip {
  flex: 0 0 42px;
  color: #111827;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  border-radius: 3px;
}

.stream-lab__chip--green {
  background: #34d399;
}
.stream-lab__chip--blue {
  background: #60a5fa;
}
.stream-lab__chip--amber {
  background: #fbbf24;
}
.stream-lab__chip--violet {
  background: #a78bfa;
}
.stream-lab__chip--red {
  background: #fb7185;
}
.stream-lab__chip--muted {
  color: #d1d5db;
  background: #4b5563;
}

.stream-lab__line code {
  overflow: hidden;
  color: #f9fafb;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.stream-lab__line em {
  margin-left: auto;
  color: #9ca3af;
  font-size: 10px;
  font-style: normal;
  white-space: nowrap;
}

.stream-lab__outcome {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: baseline;
  margin-top: 4px;
  padding-top: 4px;
  font-size: 11px;
  border-top: 1px dashed #374151;
}

.stream-lab__outcome strong {
  color: #fbbf24;
}

.stream-lab__block--dispatched .stream-lab__outcome strong {
  color: #34d399;
}

.stream-lab__block--discarded .stream-lab__outcome strong {
  color: #fb7185;
}

.stream-lab__outcome span {
  color: #9ca3af;
  font-size: 10px;
}

.stream-lab__outcome code {
  color: #e5e7eb;
  font-size: 10px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.stream-lab__state {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 14px;
  padding: 7px 10px;
  font-size: 10.5px;
  color: #9ca3af;
  background: #0f172a;
  border-left: 4px solid #fbbf24;
}

.stream-lab__state strong {
  color: #fbbf24;
}

.stream-lab__state code {
  color: #e5e7eb;
}
</style>
