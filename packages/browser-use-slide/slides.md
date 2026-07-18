---
theme: seriph
background: https://cover.sli.dev
title: Browser Use
info: |
  Browser Use 官方 Python AI agent 浏览器自动化库——让 LLM agent 像人一样
  自主操作浏览器，完成开放式 web 任务。browser-use/browser-use，MIT，★105k。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Browser Use

官方 Python 库——**LLM agent 自主操作浏览器**

<div class="pt-6 opacity-80">
browser-use/browser-use · MIT · ★105k · Odysseys 200 长程任务 #1（87.4%）
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/browser-use/browser-use" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Browser Use 是官方 Python 库，让 LLM agent 像人一样自主操作浏览器完成开放任务。★105k，Odysseys 基准 200 长程任务上排第一。
-->

---
transition: fade-out
---

# 是什么

让 LLM agent 像人一样用浏览器

<v-clicks>

- **官方 Python 库**（MIT，★105k）——`uv add browser-use`，`Agent(task=..., llm=...)` 即跑
- **开放任务，非脚本**——agent 看页面、推理下一步、点击/填表；页面改版不破
- **模型自由**——`ChatBrowserUse`（官方优化）/ OpenAI / Anthropic / Google / 本地 Ollama
- **6 skills 配套**——本地 CDP / Cloud / 开源库 / QA / 远程浏览器 / x402 付费
- **Odysseys #1**——200 长程 web 任务基准，87.4% 平均，领先 OpenAI/Anthropic/Google

</v-clicks>

<div v-click class="mt-5 text-center text-sm opacity-80">

不是 Playwright 替代——它是 **LLM agent 层**，做不了精确固定选择器脚本。

</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
定位：Browser Use 是让 LLM agent 自主操作浏览器的官方 Python 库。开放任务，模型自由，6 skills 配套，Odysseys 基准第一。不是 Playwright 替代——它是 agent 层而非脚本层。
-->

---
transition: fade-out
---

# 安装与第一个 Agent

`uv add browser-use`，Python ≥ 3.11

```python
import asyncio
from browser_use import Agent, ChatBrowserUse

async def main():
    agent = Agent(
        task="Find the number of stars of the browser-use repo",
        llm=ChatBrowserUse(model='openai/gpt-5.5'),
        # llm=ChatBrowserUse(model='bu-2-0'),   # 官方优化，最快最省
    )
    history = await agent.run()

asyncio.run(main())
```

<div v-click class="mt-3 text-center text-sm opacity-80">

`.env` 设 `BROWSER_USE_API_KEY`；async 入口用 `asyncio.run()`。

</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装：uv add browser-use。第一个 Agent 三件套：task、llm、run。库是 async，入口 asyncio.run。ChatBrowserUse 是默认推荐——专门为浏览器任务优化，比通用模型快 3-5x。
-->

---
transition: fade-out
---

# 6 个 Skills 总览

本地 · 云 · 开源 · QA · 远程 · 付费

<div class="grid grid-cols-2 gap-4 mt-3">
<div v-click>

**本地 / 开源**

- `browser-use` 核心（本地 CDP）
- `open-source` Python 库参考
- 自己 Chrome，免费、深度可控

</div>
<div v-click>

**云 / 远程**

- `cloud` 官方云 REST/SDK
- `remote-browser` 沙箱 CLI（无 GUI）
- 隔离、stealth、并发、代理轮换

</div>
</div>
<div v-click class="mt-4">

**特别形态**

- `qa` → 给网站打 1–5 分 + 证据
- `x402` → USDC on Base 钱包付费，免 API key

</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
6 skills 分三档：本地/开源（browser-use 核心、open-source 库）、云/远程（cloud、remote-browser 沙箱）、特别形态（qa 评分、x402 钱包付费）。
-->

---
transition: fade-out
---

# LLM 驱动浏览器

看页面用 AX 树，不用截图

<v-clicks>

- **找元素优先 AX 树**：`cdp("Accessibility.getFullAXTree")` 给每个元素 role/name/`backendDOMNodeId`
- **坐标点击默认**：CDP 鼠标事件穿透 iframe / shadow / 跨域
- **截图是兜底**——布局/图像信息才用；原始 HTML 仅 AX 缺元素时（canvas）
- **登录墙停下问人**——例外：Chrome 已登 SSO 可自动用
- **每次导航后**：`wait_for_load()`；标签失效调 `ensure_real_tab()`

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

心智：**AX 树 → 盒子中心 → 点击 → 验证**。比像素稳得多。

</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
LLM 驱动浏览器的核心心智：优先 AX 树而非截图找元素，坐标点击穿透 iframe/shadow，登录墙停下问人。AX → 盒子中心 → 点击 → 验证，比像素稳。
-->

---
transition: fade-out
---

# 核心 Skill：browser-use（本地 CDP）

接管你正在用的 Chrome——共享登录态

```bash
browser-use <<'PY'
print(page_info())          # helpers 已预导入
PY

browser-use --doctor        # 连不上先跑诊断
```

<v-clicks>

- Heredoc 喂多行 Python；`page_info()`、`new_tab()`、`click_at_xy()`、`cdp()`、`js()` 都已预导入
- 首次导航用 `new_tab(url)`，**不是** `goto_url(url)`
- Chrome 要在 `chrome://inspect/#remote-debugging` 打开远程调试；首次弹「Allow」
- 任务完成、云浏览器还在跑 → 主动问「关掉吗」（计费到停为止）

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心 skill 是本地形态：browser-use 命令通过 CDP 接管你正在用的 Chrome，共享登录态。Heredoc 喂 Python，helpers 已预导入。Chrome 要开远程调试。云浏览器跑完要关——计费到停为止。
-->

---
transition: fade-out
---

# Cloud 与 Remote-browser

规模化 / Stealth / 沙箱

<div class="grid grid-cols-2 gap-4 mt-3">
<div v-click>

**Cloud（REST + SDK）**

- `api.browser-use.com/api/v2`（30 端点）
- `.../api/v3`（BU Agent 会话）
- header `X-Browser-Use-API-Key`
- CDP `wss://connect.browser-use.com`
- 可挂 Playwright/Puppeteer/Selenium

</div>
<div v-click>

**Remote-browser（沙箱）**

- 无 GUI 控 headless Chromium
- `open` → `state` → `click/input`
- `tunnel <port>` 暴露 localhost
- `--connect` 多 agent 共享分标签

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

并发/stealth/过验证码 → Cloud；无 GUI 沙箱 → Remote-browser。

</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
云用于规模化：stealth、并发、代理轮换、过验证码。remote-browser 给无 GUI 沙箱，state/click/input 配合 tunnel 暴露 localhost。
-->

---
transition: fade-out
---

# QA 与 x402

打分 / 钱包付费

<div class="grid grid-cols-2 gap-4 mt-3">
<div v-click>

**QA（1–5 评分）**

- 输出 `Score: N/5` + 证据
- 单流程直连 / 多流程 fan-out
- 文本模型统一走 v2 cloud agent
- 必装 browser-harness，自动 tunnel localhost

</div>
<div v-click>

**x402（钱包付费）**

- 仅 SDK，无 CLI
- USDC on Base，免 API key
- `.env` 的 `BROWSER_USE_X402_PRIVATE_KEY`
- `max_value=$1.5` 强制 $1 测试

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

x402 要 **async** client，sync 在 env 存在时不跑。

</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
QA skill 输出 1-5 评分，按规模选策略，文本模型统一走 v2。x402 用 USDC on Base 钱包付费，免 API key，要 async client。
-->

---
transition: fade-out
---

# CLI vs Python 库

怎么选

<div class="grid grid-cols-2 gap-4 mt-3">
<div v-click>

**CLI（给 agent 用）**

- 你已有 Claude Code / Cursor / Codex
- 一次性任务
- 「上传视频到 YouTube」
- 「对比三款笔记本给价格表」
- 「填这份招聘表」

</div>
<div v-click>

**Python 库（写代码）**

- 定时/并发跑很多任务
- 嵌进自己产品
- 自定义 tools、自定义系统提示
- 结构化输出、细粒度浏览器控制

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

经验：**一次性给 agent → CLI；可重复自动化入代码 → 库**。

</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
选型：一次性任务给已有 agent 用就 CLI；可重复自动化要写代码就 Python 库。
-->

---
transition: fade-out
---

# 边界与反模式

什么不该用它做

<v-clicks>

- **生产并发别本地跑**——Chrome 单实例，多 agent 抢标签/焦点 → 用 Cloud
- **别截图找元素**——AX 树才稳，截图是兜底
- **别绕登录墙**——开源版默认停下；要 stealth、profile 复用或云
- **别混 skill**——库问题 `open-source`，云 API `cloud`，CLI 直控 `browser-use`/`remote-browser`
- **别忘 teardown**——云浏览器计费到停为止
- **别用 sync client 跑 x402**——x402 要 async

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：本地不能跑生产并发；AX 树而非截图；登录墙不绕；skill 别混；teardown 别忘；x402 要 async。
-->

---
layout: center
class: text-center
---

# 一句话记住

**官方 Python 库，让 LLM agent 像人一样自主操作浏览器——开放任务、模型自由、6 skills 配套（核心/云/开源/QA/远程/x402）、Odysseys #1。**

<div class="mt-8 opacity-80">

官方沉淀 · 开放任务 · AX 树优先 · 云扩展 · 钱包付费

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/browser-use/browser-use" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.browser-use.com/open-source/introduction" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0c4a6e 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Browser Use：官方 Python 库，LLM agent 自主操作浏览器，开放任务、模型自由、6 skills 配套、Odysseys 基准第一。
-->
