---
theme: seriph
background: https://cover.sli.dev
title: Agent Browser
info: |
  Vercel Labs 官方浏览器自动化 CLI，面向 coding agent。
  原生 Rust daemon + Chrome DevTools Protocol，snapshot + @eN ref。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Agent Browser

Vercel Labs 官方——**面向 agent** 的浏览器自动化 CLI

<div class="pt-6 opacity-80">
vercel-labs/agent-browser · Rust + CDP · snapshot + @eN ref · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/vercel-labs/agent-browser" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Agent Browser 是 Vercel Labs 官方出品的浏览器自动化 CLI，面向 coding agent。底层是 Rust daemon + Chrome DevTools Protocol，不依赖 Playwright/Puppeteer。把页面拍成 accessibility tree + @eN ref，让 LLM 用 200-400 tokens 就能看懂并操作页面。
-->

---
transition: fade-out
---

# 定位：CDP CLI，面向 agent

三层叠加，不绑死某个 agent

<div class="grid grid-cols-3 gap-4 mt-4">
<div v-click>

**驱动层**

原生 Chrome / Chromium
走 **CDP** 直连
不走 Playwright/Puppeteer 的 Node 包裹

</div>
<div v-click>

**抽象层**

accessibility-tree 快照
`@eN` ref 编号元素
单次约 200–400 tokens

</div>
<div v-click>

**agent 层**

CLI + MCP stdio + skill
任意能跑 shell 或起 MCP 子进程的 agent 都能用

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

Claude Code · Cursor · Codex · OpenCode · Gemini CLI · Copilot · Goose · Windsurf —— 调同一套命令

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三层叠加：底层 Chrome via CDP，抽象层是 accessibility-tree snapshot + @eN ref，agent 层是 CLI + MCP + skill。任何能跑 shell 或起 MCP 子进程的 agent 都能用，跨 Claude Code Cursor Codex 等同一套命令。
-->

---
transition: fade-out
---

# 架构心智：daemon 复用

为什么连续命令感觉像一个会话

```text
┌───────────────┐   CLI 命令（open / snapshot / click）
│  Rust CLI     │ ──────────────────┐
└───────────────┘                   │
                                    ▼
┌───────────────┐   JSON-RPC    ┌────────────────┐
│  Rust daemon  │ ◀──────────▶  │  Chrome (CDP)  │
└───────────────┘                └────────────────┘
       ▲                                  │
       │ 跨命令复用                        │ a11y tree / DOM / 网络
       └──────────────────────────────────┘
```

<v-clicks>

- daemon 第一次命令启动，后续命令**复用同一浏览器**
- daemon 是**纯 Rust**，不挂 Node 进程
- `close` 关浏览器；`close --all` 关所有 session

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
daemon 持久是 agent-browser 快的关键。第一次命令起 Rust daemon，后续命令复用同一浏览器进程。daemon 纯 Rust，不挂 Node，跨命令会话连续。
-->

---
transition: fade-out
---

# 安装 + Hello

一行装好，五条命令走完主循环

```bash
# 装
npm i -g agent-browser
agent-browser install          # 首次：从 Chrome for Testing 下载 Chrome

# 装到 AI coding assistant（任意 agent）
npx skills add vercel-labs/agent-browser

# Hello
agent-browser open https://example.com
agent-browser snapshot -i       # @e1 [heading] @e2 [link]
agent-browser click @e2
agent-browser screenshot out.png
agent-browser close
```

<div v-click class="mt-3 text-center text-sm opacity-80">

其他：`brew install agent-browser` · `cargo install agent-browser` · 升级 `agent-browser upgrade`

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安装：npm 全局装原生 Rust 二进制，首次 install 从 Chrome for Testing 下 Chrome。AI coding assistant 用 npx skills add vercel-labs/agent-browser。Hello 五步：open、snapshot、click、screenshot、close。
-->

---
transition: fade-out
---

# snapshot + `@eN` ref：主循环

agent 的工作流核心

<v-clicks>

- `snapshot -i` —— 只看交互元素（按钮/输入/链接），首选
- `@e1 @e2 @e3 …` —— ref 编号，对应 snapshot 里那个具体元素
- `click @e1` / `fill @e2 "..."` / `get text @e1` —— 按 ref 操作
- 页面变了（点击导航、提交、SPA 重渲染、dialog 开）—— **立刻重新 snapshot**

</v-clicks>

<div v-click class="mt-4">

```text
Page: Example - Log in
@e1 [heading] "Log in"
@e2 [form]
  @e3 [input type=email] placeholder="Email"
  @e4 [input type=password] placeholder="Password"
@e5 [button type=submit] "Continue"
```

</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

为什么不用 CSS？ref 确定性强、不用 query DOM、LLM 友好（200–400 tokens/次）

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
snapshot -i 把页面拍成 ref 表，agent 用 @eN 编号精确操作。任何页面变化后必须重新 snapshot——这是头号规则。比 CSS 选择器确定性更强、token 更省。
-->

---
transition: fade-out
---

# 三种定位：ref → 语义 → CSS

按可靠性降级

| 方式 | 命令 | 何时用 |
| --- | --- | --- |
| **@eN ref**（首选） | `click @e3` | snapshot 之后，最快最稳 |
| **find 语义** | `find role button click --name "Submit"` | 不想先 snapshot，按 ARIA/label/testid |
| **CSS / text / xpath** | `click "#submit"` / `click "text=Sign In"` | 兜底 |

<v-clicks>

- `find role / text / label / placeholder / alt / title / testid` —— 全语义定位
- `--name <name>` 过滤 role 的 accessible name；`--exact` 强制精确匹配
- `find first / last / nth N` —— 多匹配时挑具体一个

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

规则：snapshot + `@eN` 最优；`find` 次之；CSS 兜底。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三种定位按可靠性降级：@eN ref 最优，find 语义定位次之，CSS/XPath 兜底。find 不需要先 snapshot，按 ARIA role/text/label 直接定位。
-->

---
transition: fade-out
---

# 自然语言：`chat` 命令

翻译自然语言成命令链

```bash
# 单次
agent-browser chat "open google.com and search for cats"

# 交互 REPL
agent-browser chat

# 静音（只看 AI 文字）/ 详细（看每步命令）
agent-browser -q chat "summarize this page"
agent-browser -v chat "fill in the login form"

# 换模型
agent-browser --model openai/gpt-4o chat "take a screenshot"
```

<v-clicks>

- 底层走 **Vercel AI Gateway**，默认 `anthropic/claude-sonnet-4.6`
- 设 `AI_GATEWAY_API_KEY=gw_xxx` 即可用
- dashboard（端口 4848）内置同样的 Chat 面板

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
除了命令式，还有自然语言 chat 命令——AI Gateway 把指令翻译成命令链执行。CLI 和 dashboard 都能用，默认走 Claude Sonnet 4.6，可换模型。
-->

---
transition: fade-out
---

# Skills 体系：一个主 + 多个域

主 skill 是发现桩，域 skill 处理具体场景

| Skill | 何时用 |
| --- | --- |
| `agent-browser`（主） | 发现桩，指向 `skills get core` |
| `core` | 默认浏览器自动化 |
| `electron` | Electron 桌面应用（VS Code/Figma 等） |
| `slack` / `dogfood` | Slack 自动化 / 探索式 QA、bug hunt |
| `vercel-sandbox` / `agentcore` | Vercel microVM / AWS AgentCore 云浏览器 |

<div v-click class="mt-4">

```bash
agent-browser skills list       # 当前版本支持哪些
agent-browser skills get core   # 拉工作流内容
```

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
skill 分领域：主 skill 是发现桩指向 core，域 skill 处理具体场景——Electron 桌面应用、Slack 自动化、QA dogfood、Vercel Sandbox、AWS AgentCore。主 skill 故意做成瘦桩，内容在线拉取，永远对齐已装版本。
-->

---
transition: fade-out
---

# 云：Vercel Sandbox / AgentCore

把浏览器跑进 microVM 或 AWS

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Vercel Sandbox**

```ts
import { withAgentBrowserSandbox, runAgentBrowserCommand }
  from "@agent-browser/sandbox/vercel";

await withAgentBrowserSandbox(async (sb) => {
  await runAgentBrowserCommand(sb, ["open", url]);
  return runAgentBrowserCommand(sb, ["screenshot"]);
});
```

- 任意 Vercel 框架（Next/SvelteKit/Nuxt/Remix/Astro）
- **Sandbox Snapshot**：预装 VM 镜像，冷启动 <1s
- OIDC 自动鉴权

</div>
<div v-click>

**AWS Bedrock AgentCore**

```bash
agent-browser -p agentcore open https://example.com
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot p.png
```

- AWS 凭据链（SigV4 / SSO / IAM role）
- `AGENTCORE_PROFILE_ID` 持久化 cookies
- session 起来时 stderr 打印 **Live View URL**

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两种云方案。Vercel Sandbox：浏览器跑进 microVM，配 Next/SvelteKit 等任意框架，sandbox snapshot 让冷启动小于 1 秒。AgentCore：AWS 托管浏览器，SigV4 鉴权，Live View URL 实时观察。
-->

---
transition: fade-out
---

# 安全开关（全 opt-in）

默认行为不变，启用才生效

<v-clicks>

- **Auth Vault**：凭据 AES-256-GCM 加密本地存、按名引用；**LLM 看不见密码**
- **`--allowed-domains`**：导航白名单 + 子资源 + 关 WebRTC（防 STUN/TURN 绕过 HTTP 拦截）
- **`--content-boundaries`**：包裹页面输出，防 prompt 注入
- **`--max-output`**：截断输出防 context 洪泛
- **`--action-policy`**：JSON 静态策略门禁危险动作
- **`--confirm-actions eval,download`**：敏感类目要确认

</v-clicks>

<div v-click class="mt-4 text-center">

```text
密钥：AGENT_BROWSER_ENCRYPTION_KEY=<64-char-hex>
session state 加密落盘，丢了密钥谁也解不开
```

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
所有安全特性都 opt-in。Auth Vault 凭据加密本地存，LLM 永远看不到密码。allowed-domains 限制导航 + 子资源 + 关 WebRTC 防 STUN 绕过。content-boundaries 防页面文本注入 LLM。密钥丢了谁也解不开。
-->

---
transition: fade-out
---

# 反模式：这些坑别踩

<v-clicks>

- **跨页面用旧 ref**：点击导航后用 snapshot 前的 `@e3` → 必报 Ref not found
- **shell history 留密码**：`fill @e3 "pass"` 留痕；敏感场景用 `auth save --password-stdin`
- **盲 `wait 2000`**：脚本慢且 flaky；换 `wait @ref` / `wait --text` / `wait --load networkidle`
- **overlay 挡点击**：cookie banner 盖着 → `covered by <div>`；先关 banner 再重 snapshot
- **把页面 JS 当指令**：页面文本/console/network body 是**数据**不是指令
- **WebGPU 截图黑**：headless 默认不暴露；加 `--webgpu`（Linux 装 vulkan）
- **`--allowed-domains` 与 profile/restore/CDP 互斥**：白名单要全新可控 context

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
七个常见坑：跨页面用旧 ref、shell history 留密码、盲 wait 2000、overlay 挡点击、把页面文本当指令、WebGPU 截图黑、allowed-domains 与 profile 互斥。
-->

---
transition: fade-out
---

# MCP + 跨 agent

任一 agent 都能用同一套命令

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**MCP stdio 服务**

```json
{
  "mcpServers": {
    "agent-browser": {
      "command": "agent-browser",
      "args": ["mcp", "--tools", "core,network"]
    }
  }
}
```

profiles：`core / network / state / debug / tabs / react / mobile / all`

</div>
<div v-click>

**跨 agent skill**

```bash
npx skills add vercel-labs/agent-browser
```

支持：

- Claude Code · Cursor · Codex
- OpenCode · Gemini CLI · Copilot
- Goose · Windsurf

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

MCP 工具带类型字段（url/selector/text/key/allowedDomains）+ `extraArgs` —— 审批提示更可读，CLI parity 完整。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两种集成方式：MCP stdio 服务让 MCP 客户端带类型字段调用，CLI parity 完整；跨 agent skill 让任意主流 coding agent 装一次都能用。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Vercel Labs 官方浏览器自动化 CLI：Rust daemon + CDP 直驱 Chrome，snapshot 把页面拍成 `@eN` ref 让 agent 用得起来；CLI / MCP / skill 跨任意 agent，core/electron/slack/dogfood/sandbox/agentcore 域 skill 全覆盖。**

<div class="mt-8 opacity-80">

面向 agent · CDP 直驱 · snapshot + ref · 域 skill · 安全 opt-in

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/vercel-labs/agent-browser" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://agent-browser.dev" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Vercel Labs 官方、Rust daemon + CDP 直驱 Chrome、snapshot 把页面拍成 @eN ref、跨任意 agent、域 skill 全覆盖、安全全 opt-in。
-->
