---
theme: seriph
background: https://cover.sli.dev
title: Web Speech API 入门
info: |
  Web Speech API 入门：SpeechSynthesis（TTS）· SpeechRecognition（STT）· 兼容性 · 安全上下文

  Learn more at https://developer.mozilla.org/Web/API/Web_Speech_API
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Web Speech API

浏览器原生语音接口 · TTS 文字转语音 · STT 语音转文字

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
两大模块：SpeechSynthesis（TTS）与 SpeechRecognition（STT）。
-->

---
transition: fade-out
---

# Web Speech API 是什么

W3C WebAudio CG 起草的浏览器原生语音接口

- **SpeechSynthesis（TTS）**：文字转语音，Baseline 全平台支持
- **SpeechRecognition（STT）**：语音转文字，兼容性受限
- **零依赖**：直接调用 `window.speechSynthesis`
- **Chrome/Edge 需前缀**：`webkitSpeechRecognition`
- **Firefox**：STT 默认禁用，需 about:config 开关

> TTS 已稳定可用，STT 仅 Chromium 系与 Safari 支持

<!--
TTS 成熟稳定，STT 受浏览器兼容性制约。
-->

---

# 第一个 TTS：让网页说话

```javascript
const u = new SpeechSynthesisUtterance("你好");
u.lang = "zh-CN";   // BCP-47 语言
u.rate = 1.0;       // 语速 0.1-10
u.pitch = 1.0;      // 音调 0-2
u.volume = 1.0;     // 音量 0-1
window.speechSynthesis.speak(u);
```

**控制方法**

- `speak()` 加入队列朗读（排队不打断）
- `cancel()` 清空队列停止所有朗读
- `pause()` / `resume()` 暂停与恢复
- `getVoices()` 返回可用语音数组
- 只读状态：`speaking` / `paused` / `pending`

> speak 是排队机制，多个 utterance 依次朗读

<!--
几十行 JS 即可完成文字转语音闭环。
-->

---

layout: two-cols

---

# 取声音与选语言

`getVoices()` 首次常返回空，监听 `voiceschanged`

```javascript
let voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
}
loadVoices();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
// 选中文语音
const zh = voices.filter(v =>
  v.lang.startsWith("zh"));
```

::right::

# SpeechSynthesisVoice

| 属性 | 含义 |
|------|------|
| `name` | 语音名称 |
| `lang` | BCP-47 标签 |
| `default` | 系统默认 |
| `localService` | 是否本地引擎 |

```javascript
u.voice = voices.find(
  v => v.lang === "zh-CN");
```

> 优先 `localService=true` 的本地语音

<!--
getVoices 异步加载，必须监听 voiceschanged。
-->

---

# 第一个 STT：让网页听写

```javascript
const SR = window.SpeechRecognition
  || window.webkitSpeechRecognition;
const r = new SR();
r.lang = "zh-CN";
r.continuous = false;    // 单次识别
r.interimResults = true; // 中间结果
r.onresult = (e) => {
  const last = e.results[e.results.length - 1];
  console.log(last[0].transcript);
};
r.start(); // 须用户手势触发
```

> 必须在 HTTPS/localhost 安全上下文 + 麦克风权限

<!--
start() 必须由用户手势触发，不能页面加载即启动。
-->

---

# STT 关键属性与事件

| 属性 | 默认 | 含义 |
|------|------|------|
| `lang` | 浏览器默认 | BCP-47 识别语言 |
| `continuous` | false | false 单次，true 持续 |
| `interimResults` | false | 返回中间结果 |
| `maxAlternatives` | 1 | 候选数量 |

**事件**：`result`（isFinal+confidence）/ `error` / `end`  **方法**：`start()` / `stop()` / `abort()`

> `grammars` 已废弃无效；Chrome 连续模式需 onend 自动重启

<!--
Grammar 接口已从规范移除，仅向后兼容保留。
-->

---

layout: two-cols

---

# STT 浏览器兼容性

| 浏览器 | 状态 |
|------|------|
| Chrome/Edge | 支持（webkit 前缀）|
| Safari | 14.1+ 支持 |
| Opera | 支持（Chromium 内核）|
| **Firefox** | **默认禁用** |

> Chrome STT 是云端引擎，音频上传 Google，离线不可用

::right::

# TTS 兼容性

| 浏览器 | 状态 |
|------|------|
| Chrome/Edge | 全支持 |
| Firefox | 全支持 |
| Safari | 全支持（iOS 7+）|
| Samsung | 全支持 |

> SpeechSynthesis 2018.09 进入 Baseline，可放心用于生产

<!--
TTS 广泛支持，STT 仍 Limited availability。
-->

---

# 跨浏览器降级

检测 `SpeechRecognition` 不存在时降级 Whisper API

```javascript
function getSTTEngine() {
  const NativeSR = window.SpeechRecognition
    || window.webkitSpeechRecognition;
  if (NativeSR) return { type: "native", Ctor: NativeSR };
  return { type: "whisper", Ctor: null }; // 降级
}
```

| 维度 | 原生 STT | Whisper API |
|------|------|------|
| 浏览器 | Chromium/Safari | 全部 |
| 实时性 | 实时 interim | 秒级延迟 |
| 离线 | 不可 | 不可 |
| 成本 | 免费 | 按分钟计费 |

> 原生实时免费，Whisper 跨浏览器高精度

<!--
跨浏览器/离线场景通常改用第三方方案。
-->

---

# Chrome 长文本 TTS Bug

Chrome 朗读长文本（约 15 秒）会莫名停止

**方案 1：分句朗读**

```javascript
function speakLong(text) {
  const chunks = text.match(/[^。！？.!?]+[。！？.!?]?/g) || [text];
  let i = 0;
  const next = () => { if (i < chunks.length) {
    const u = new SpeechSynthesisUtterance(chunks[i++]);
    u.onend = next; window.speechSynthesis.speak(u);
  }};
  next();
}
```

> 也可定时 `pause()/resume()` 保活，或用 onboundary 切分

<!--
长文本分句是社区最稳的 workaround。
-->

---

# 常见陷阱

| 陷阱 | 解决 |
|------|------|
| `getVoices()` 返回空 | 监听 voiceschanged |
| Chrome STT 一会儿就停 | onend 自动重启 |
| Firefox 报未定义 | 降级 Whisper API |
| 长文本 TTS 中途停 | 分句或定时 resume |
| 识别中文全是乱字 | `lang` 设错（应为 zh-CN）|
| `grammars` 无效 | 已废弃，改关键词匹配 |

> start() 在已运行时调用抛 InvalidStateError，需 try/catch

<!--
权限被拒时引导到浏览器地址栏权限设置。
-->

---

layout: quote

---

# 浏览器语音闭环

「SpeechSynthesis 让网页说话，SpeechRecognition 让网页听懂，几十行 JS 即可构建语音助手——但 STT 受兼容性与云端依赖制约，生产场景常需降级方案。」

---

# 选型一句话

- **只需朗读（TTS）**：`window.speechSynthesis`，全平台稳定
- **只需听写（STT）**：Chrome/Edge/Safari 受众用原生
- **必须跨浏览器**：降级 Whisper API / AssemblyAI
- **必须离线/隐私**：whisper.cpp WASM / Vosk
- **语音助手**：STT + LLM + TTS 组合，注意回声消除

> 音质要求高 → Azure TTS / ElevenLabs

<!--
选型第一问：只要 TTS 还是要 STT。
-->

---
layout: center
class: text-center
---

# 小结

Web Speech API = TTS + STT

**原生接口 · 零依赖 · 安全上下文 · 跨浏览器降级**

[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) · [W3C 草案](https://webaudio.github.io/web-speech-api/) · [GitHub](https://github.com/IllegalCreed/SlideStack)

<!--
TTS 稳定可用，STT 注意兼容性与降级方案。
-->
