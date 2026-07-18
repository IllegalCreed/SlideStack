---
theme: seriph
background: https://cover.sli.dev
title: Playwright CLI
info: |
  Microsoft 官方 token-efficient 浏览器自动化 CLI，面向 coding agent。
  microsoft/playwright-cli · @playwright/cli · Apache-2.0
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Playwright CLI

Microsoft 官方 **token-efficient** CLI——为 coding agent 驱动浏览器而生

<div class="pt-6 opacity-80">
microsoft/playwright-cli · @playwright/cli · Node 18+ · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/microsoft/playwright-cli" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Playwright CLI 是 Microsoft 官方出品的浏览器自动化命令行工具，专为 coding agent 设计。核心特点：token-efficient——不把整页可访问性树灌进 LLM。
-->

---
transition: fade-out
---

# 为什么是 CLI，不是 MCP

coding agent 越来越偏爱 CLI + SKILL

<v-clicks>

- **CLI 调用更省 token**——不必把大工具 schema 与冗长 a11y 树加载进上下文
- **agent 通过简短专用命令行动**——`open / click / snapshot / route / eval`
- **适合 coding agent**——既要跑浏览器，又要扛大代码库 + 推理

</v-clicks>

<div v-click class="mt-5 grid grid-cols-2 gap-4 text-sm">

<div>

**CLI + skills**（本叶）
- coding agent
- 省 token
- 命令式、按需取数据

</div>

<div>

**Playwright MCP**（对照）
- 自治/探索式 agent 循环
- 持久状态、富内省
- 长跑、自愈测试

</div>

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
现代 coding agent 偏爱 CLI + SKILL：调用省 token，agent 通过简短命令行动，适合既要跑浏览器又要扛大代码库的场景。MCP 更适合自治式 agent 循环。
-->

---
transition: fade-out
---

# 安装

一条命令装 CLI，再装 skills

```bash
# 1. 全局装 CLI
npm install -g @playwright/cli@latest
playwright-cli --help

# 2. 装 skills（Claude Code / Copilot 自动读本地技能）
playwright-cli install --skills
```

<div v-click class="mt-4">

**退化路径**：本地有 playwright 但无全局 CLI

```bash
npx --no-install playwright --version    # 检查
npx playwright cli open https://example.com   # 替代 playwright-cli
```

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

要求：**Node.js 18+**；可选 coding agent（也支持无 agent 单跑）。

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装 CLI 一条 npm install -g @playwright/cli。再跑 install --skills 让本地技能说明被 agent 读到。本地有 playwright 但没全局 CLI 时用 npx playwright cli 退化。
-->

---
transition: fade-out
---

# skills + references：CLI 的「说明书」

装 skills 后 agent 读到一组本地文档

<div class="grid grid-cols-2 gap-4 mt-3 text-sm">
<div>

**主文件**
- `SKILL.md`——命令清单 + 示例
- `allowed-tools: Bash(playwright-cli:*)`

</div>
<div>

**references（高频）**
- `element-attributes` 属性定位
- `playwright-tests` 测试调试
- `request-mocking` 请求 mock
- `running-code` / `session-management`
- `tracing` / `video-recording` / `test-generation`

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-90">

**skills-less 也行**：指向 CLI，让 agent 读 `playwright-cli --help` 自悟。

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装 skills 后 agent 读到 SKILL.md 主文件和一组 references：element-attributes、playwright-tests、request-mocking、running-code、session-management、tracing、video-recording 等。skills-less 模式也行，让 agent 读 --help 自悟。
-->

---
transition: fade-out
---

# 最小工作流

开浏览器 → 取 snapshot → 用 ref 交互

```bash
playwright-cli open https://demo.playwright.dev/todomvc/
playwright-cli snapshot                  # 拿元素 ref（e15、e21…）
playwright-cli fill e21 "Buy groceries" --submit
playwright-cli check e35
playwright-cli screenshot
playwright-cli close
```

<div v-click class="mt-4 text-center">

**snapshot 返回 YAML 结构化页面树**——不全量塞 a11y tree，按需取你需要的部分。

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最小流：open、snapshot 拿 ref、用 ref click/fill/check、screenshot、close。snapshot 是 YAML 结构化页面树，每节点带 ref。这是省 token 的关键。
-->

---
transition: fade-out
---

# 三种定位元素的方式

ref、CSS、Playwright locator

```bash
playwright-cli click e15                                  # 1. snapshot ref（默认推荐）
playwright-cli click "#main > button.submit"              # 2. CSS 选择器
playwright-cli click "getByRole('button', { name: 'Submit' })"
playwright-cli click "getByTestId('submit-button')"       # 3. locator / test id
```

<div v-click class="mt-4">

**snapshot 不显示的属性**（`id` / `class` / `data-*`）用 `eval` 取：

```bash
playwright-cli eval "el => el.id" e7
playwright-cli eval "el => el.getAttribute('data-testid')" e7
playwright-cli eval "el => getComputedStyle(el).display" e7
```

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三种定位：snapshot ref（默认）、CSS 选择器、Playwright locator/test id。snapshot 不显示的属性如 id/class/data-* 用 eval 取。
-->

---
transition: fade-out
---

# 请求 Mock：拦截 / 改写 / 屏蔽

`route` 简单 mock，`run-code` 高级场景

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "**/api/users" \
  --body='[{"id":1,"name":"Alice"}]' --content-type=application/json
playwright-cli route-list              # 列活动 route
playwright-cli unroute "**/*.jpg"      # 撤销指定
playwright-cli unroute                 # 撤销全部
```

<div v-click class="mt-3 text-sm opacity-90">

URL 模式：`**/api/users`（精确）· `**/api/*/details`（通配）· `**/*.{png,jpg}`（扩展名）

</div>

<div v-click class="mt-3">

**条件 / 改写 / 失败 / 延迟** → `run-code`（直接调 Playwright `page.route` API）

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
route 做简单 mock：指定状态码、body、content-type、header。URL 模式支持通配和扩展名。条件响应、改写真实响应、模拟失败、延迟这些高级场景走 run-code，直接调 Playwright 的 page.route API。
-->

---
transition: fade-out
---

# 调试失败的 Playwright 测试

`--debug=cli` + `attach`

<v-clicks>

- 测试归 `npx playwright test` 跑——**CLI 是测试外的调试入口**
- 后台跑 `--debug=cli` 会在起点暂停，打印 session 名
- `playwright-cli attach <session>` 接入探查
- 每条 CLI 操作同步生成 TS 代码，可直接复制回 spec

</v-clicks>

<div v-click class="mt-4">

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test --debug=cli
# …打印 session 名（如 tw-abcdef）…
playwright-cli attach tw-abcdef
```

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
测试用 npx playwright test 跑，不是 CLI。调试失败用例：--debug=cli 后台跑会打印 session 名，attach 进去探查。每条 CLI 操作同步生成 Playwright TS 代码，可直接复制回 spec。
-->

---
transition: fade-out
---

# Token-efficient 三招

不强行把 page 数据灌进 LLM

<div class="grid grid-cols-3 gap-4 mt-4">
<div v-click>

**按需 snapshot**

`snapshot <ref>` 取子树
`--depth=N` 限深
`--boxes` 带坐标

</div>
<div v-click>

**搜索优先**

`find "Add to cart"`
`find --regex "/sign (in|up)/i"`
类 grep -C 上下文

</div>
<div v-click>

**`--raw` 管道化**

剥 status/code/snapshot
`| jq` 计算
`diff before.yml after.yml`

</div>
</div>

<div v-click class="mt-5">

```bash
playwright-cli --raw snapshot > before.yml
playwright-cli click e5
playwright-cli --raw snapshot > after.yml
diff before.yml after.yml
```

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三招：按需 snapshot（子树/限深/坐标）、搜索优先（find 类 grep -C）、--raw 管道化（剥 metadata 便于 jq 与 diff）。
-->

---
transition: fade-out
---

# 会话化与可视化

多项目并发 + 可观察的 Dashboard

```bash
playwright-cli -s=todo open https://demo.playwright.dev/todomvc/
playwright-cli -s=example open https://example.com --persistent
playwright-cli list                     # 列所有 session
playwright-cli close-all                # 关所有
PLAYWRIGHT_CLI_SESSION=todo-app claude . # 给 agent 锁一个 session

playwright-cli show                      # Dashboard 网格预览
playwright-cli show --annotate           # 让用户画框 + 写注释
```

<div v-click class="mt-3 text-center text-sm opacity-90">

`--persistent` 跨重启保留 profile；`show --annotate` 把用户在页面上的标注回传给 agent——适合「问用户想要什么」。

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
-s=name 隔离多项目，PLAYWRIGHT_CLI_SESSION 给 agent 锁 session。show 开 Dashboard 网格化看所有 session 的实时预览。show --annotate 让用户画框写注释，回传给 agent——适合问用户想要什么。
-->

---
transition: fade-out
---

# 反模式：这些别做

<v-clicks>

- ❌ **在 agent 上下文塞重 SDK 文档**——CLI + skills 的意义就是省 token
- ❌ **用 CLI 跑 Playwright 测试**——测试归 `npx playwright test`，CLI 只做调试
- ❌ **无脑 screenshot**——snapshot 是常态，screenshot 是少数（视觉验证）
- ❌ **Windows 上 URL 含 `&` 不转义**——cmd.exe 用 `^&`、PowerShell 用 `--%`
- ❌ **把 CLI 当 MCP 用**——要持久状态/富内省/自治循环，用 Playwright MCP

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五个反模式：不塞 SDK 文档、不跑测试（测试用 npx playwright test）、不无脑 screenshot、Windows URL 转义 &、不要当 MCP 用。
-->

---
transition: fade-out
---

# Open 参数与配置

浏览器选择、设备模拟、CDP 接入

```bash
playwright-cli open --browser=chrome|firefox|webkit|msedge
playwright-cli open --mobile                     # 通用移动设备
playwright-cli open --device="iPhone 15"          # 指定设备
playwright-cli open --persistent                  # profile 存盘
playwright-cli open --config=my-config.json       # 配置文件

playwright-cli attach --cdp=chrome                # 接入运行中的 Chrome/Edge
playwright-cli attach --cdp=http://localhost:9222 # CDP 端点接入
playwright-cli detach                             # 脱离外部浏览器
```

<div v-click class="mt-3 text-sm opacity-90">

默认读 `.playwright/cli.config.json`；也可走 `PLAYWRIGHT_MCP_*` 环境变量（CLI 与 MCP 共用一组）。

</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Open 参数：选浏览器、模拟设备（mobile/iPhone 15）、persistent 存盘、config 文件。attach 通过 CDP 接入运行中的 Chrome/Edge/远程端点，detach 脱离但不关外部浏览器。配置可走文件或环境变量。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Microsoft 官方 token-efficient CLI——coding agent 用简短命令驱动 Playwright，snapshot/find/--raw 三招按需取数据，省 token 又保留能力。**

<div class="mt-8 opacity-80">

官方出品 · CLI + skills · 省 token · 会话化 · 可视化 Dashboard

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/microsoft/playwright-cli" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://playwright.dev/agent-cli/skills" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #2EAD33 10%, #0179C0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Microsoft 官方 token-efficient CLI，coding agent 用简短命令驱动 Playwright。snapshot、find、--raw 三招按需取数据，省 token 又保留能力。
-->
