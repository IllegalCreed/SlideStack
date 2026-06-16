---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Secretlint
info: |
  Presentation about Secretlint for developers.

  Learn more at [https://secretlint.github.io/](https://secretlint.github.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Secretlint

可插拔的密钥泄露检测工具，提交前拦下硬编码凭据（基于 v13.0.2）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/secretlint/secretlint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Secretlint —— 一个专门在你提交代码前，把硬编码的 API Key、Token、私钥这些凭据拦下来的工具。
它怎么用、有哪些规则、怎么接进工作流？我们一起看看。
-->

---
transition: fade-out
---

# 什么是 Secretlint？

可插拔（Pluggable）的密钥检测 Linter，专为「提交前拦截」而生

<v-clicks>

- 扫描项目里的**硬编码凭据**：AWS / GCP / GitHub / Slack / OpenAI 等
- **Shift-left**：在 `pre-commit` 拦下，而非等密钥进了仓库才报警
- **Opt-in 设计**：默认零规则，按需装规则包，误报极低
- 作者同 textlint —— Node.js 生态熟悉的「可插拔 Linter」思路

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_Secretlint_](https://secretlint.github.io/)

</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Secretlint 是一个可插拔的密钥检测工具。

[click] 它扫描代码里硬编码的凭据，比如 AWS 密钥、GitHub Token、OpenAI Key 等等。

[click] 核心理念是 shift-left，在 pre-commit 这一步就拦下来，而不是等密钥被提交甚至推送之后才发现。

[click] 它是 opt-in 设计，默认一条规则都没有，你装什么规则包才检查什么，所以误报很低。

[click] 作者是 azu，和 textlint 同一个人，沿用了 Node.js 生态熟悉的可插拔 Linter 思路。
-->

---
transition: fade-out
---

# 为什么需要它？

密钥一旦进了 Git 历史，删都删不干净

<v-clicks>

- GitHub Secret Scanning 等方案多在**提交/推送之后**才告警
- 而 Secretlint 跑在**本地、提交之前**，从源头阻断
- 对比 git-secrets：后者偏全局安装，Secretlint **按项目**配置、可定制
- 「规则即文档」：每条规则都解释**为什么这是密钥**，降低误报

</v-clicks>

<div v-click mt-4>

```bash
# 一条命令体验：当前目录下所有文件
npx @secretlint/quick-start "**/*"
```

</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
为什么要专门搞这么个工具？

[click] 因为像 GitHub Secret Scanning 这类方案，大多是在你提交甚至推送之后才告警。

[click] 而 Secretlint 跑在本地、提交之前，从源头就阻断了。

[click] 和老牌的 git-secrets 比，git-secrets 偏向全局安装，Secretlint 则是按项目配置、可以定制规则。

[click] 它还有个理念叫「规则即文档」，每条规则都会说明为什么这个东西被判定为密钥，这能有效降低误报。

[click] 想快速体验？一条 npx 命令就能扫当前目录。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与运行

三种方式：Node.js / Docker / 单文件二进制

::left::

<div v-click>

- **Node.js（推荐）**：

  ```bash
  npm install -D secretlint \
    @secretlint/secretlint-rule-preset-recommend
  ```

</div>

<div v-click>

- **生成配置 + 运行**：

  ```bash
  npx secretlint --init
  npx secretlint "**/*"
  ```

  <span text-xs text-gray>glob 必须用双引号包裹</span>

</div>

::right::

<div v-click>

- **Docker（零配置）**：

  ```bash
  docker run -v `pwd`:`pwd` -w `pwd` \
    --rm secretlint/secretlint \
    secretlint "**/*"
  ```

</div>

<div v-click>

- **退出码**：`0` 干净 / `1` 发现密钥 / `2` 致命错误

  <span text-xs text-gray>需 Node.js 20+</span>

</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
上手有三种方式。

[click] 推荐 Node.js：装 secretlint 本体加 recommend 预设规则包，因为 Secretlint 本身没有内置规则。

[click] 然后 --init 生成配置、跑 secretlint 扫描，注意 glob 必须用双引号包起来，否则会被 shell 提前展开。

[click] 如果项目用 Docker，官方镜像零配置内置了 recommend 预设，直接挂目录跑即可。

[click] 退出码很重要：0 表示干净，1 表示发现密钥，2 是致命错误，CI 里靠它判断成败。注意需要 Node.js 20 以上。
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 配置 .secretlintrc.json

`--init` 生成，`rules` 数组按 `id` 挂规则包

<div v-click>

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend"
    }
  ]
}
```

</div>

<v-clicks>

- 无内置规则：**装包**并**写进 `rules`** 才生效
- `options`：规则选项（如 `allows` 忽略名单）
- `disabled`：关闭该规则
- `allowMessageIds`：按 messageId 抑制特定告警

</v-clicks>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
配置文件长这样。

[click] --init 会生成 .secretlintrc.json，核心就是一个 rules 数组，每个元素用 id 挂一个规则包，这里挂的是 recommend 预设。

[click] 记住：Secretlint 没有内置规则，必须先装包再写进 rules 才生效。每条规则有三个通用配置：options 配选项，比如 allows 忽略名单；disabled 关闭规则；allowMessageIds 按消息 id 精确抑制某类告警。配置文件也支持 yml 和 js 格式。
-->

---
transition: fade-out
---

# 规则包与 recommend 预设

规则都是独立 npm 包，预设打包一组常用规则

<div v-click>

| 类别       | 规则包（节选）                                            |
| ---------- | --------------------------------------------------------- |
| 云厂商     | `aws` · `gcp`                                             |
| 平台 Token | `github` · `slack` · `sendgrid` · `shopify`              |
| AI 服务    | `openai` · `anthropic` · `linear` · `1password`          |
| 通用密钥   | `privatekey` · `basicauth` · `database-connection-string` |
| 工具       | `npm` · `filter-comments`（支持忽略注释）                |

</div>

<div v-click text-xs mt-2>

_`preset-recommend` 内置以上 15 条规则。_ _另有 `pattern` / `no-dotenv` 等可选规则。_

</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Secretlint 的规则都是独立的 npm 包，预设则把一组常用规则打包到一起。

[click] recommend 预设涵盖：云厂商 AWS、GCP；平台 Token 像 GitHub、Slack、SendGrid、Shopify；AI 服务 OpenAI、Anthropic、Linear、1Password；通用密钥如私钥、Basic Auth、数据库连接串；还有 npm token 和 filter-comments。

[click] recommend 一共 15 条规则。此外还有 pattern 自定义正则、no-dotenv 等不在预设里的可选规则，按需自己装。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 忽略与降噪

三种手段：注释 / ignore 文件 / allowMessageIds

::left::

<div v-click>

### 注释指令

```js
/* secretlint-disable */
const FAKE = "ghp_xxxxxxxx";
/* secretlint-enable */
```

<span text-xs text-gray>还有 `-disable-line` / `-disable-next-line`</span>

</div>

::right::

<div v-click>

### .secretlintignore

```text
# 与 .gitignore 同语法
**/*.test.ts
!keep/this.ts
```

<span text-xs text-gray>默认已忽略 node_modules / .git</span>

</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
遇到测试桩、示例密钥等误报怎么办？三种降噪手段。

[click] 第一种：注释指令。secretlint-disable 到 enable 之间的内容会被忽略，还能针对单行用 disable-line 或 disable-next-line。这个能力由 filter-comments 规则提供，recommend 预设已内置。

[click] 第二种：.secretlintignore 文件，语法和 .gitignore 完全一样，感叹号取消忽略，node_modules、.git 默认就被忽略了。第三种是配置里的 allowMessageIds，按规则的 messageId 精确放行某一类告警。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8 grid-rows-[100px_1fr_40px]!
---

# 接入工作流

本地 pre-commit + CI 双保险

::left::

<div v-click>

### Husky + lint-staged

```json
// package.json
"lint-staged": {
  "*": ["secretlint --no-glob"]
}
```

<span text-xs text-gray>提交前只查暂存文件，`--no-glob` 关键</span>

</div>

::right::

<div v-click>

### GitHub Actions

```yaml
- run: npm ci
- run: npx secretlint "**/*"
```

<span text-xs text-gray>失败即阻断 PR；可配 SARIF 上报</span>

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_integrations_](https://github.com/secretlint/secretlint#integrations)

</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么接进日常工作流？本地加 CI 双保险。

[click] 本地用 Husky 加 lint-staged：在 package.json 配 lint-staged，提交前只扫暂存文件。注意这里要加 --no-glob，因为 lint-staged 已经把文件名传进来了，不需要 Secretlint 再做 glob 匹配。

[click] CI 用 GitHub Actions：npm ci 装依赖，再跑 secretlint 扫全量，发现密钥就让流水线失败、阻断 PR。还能输出 SARIF 格式上报到代码扫描面板。两道关卡，本地漏了 CI 兜底。
-->

---
transition: fade-out
---

# 输出与安全细节

默认脱敏，多种 formatter 对接工具链

<v-clicks>

- **默认脱敏**：错误信息里的密钥被 mask，避免在 CI 日志二次暴露
- 想看原值：`--no-maskSecrets`
- `--format`：`stylish`（默认）/ `json` / `unix` / `mask-result` 等
- `mask-result` + `--output`：把文件里的密钥就地打码（如 `.zsh_history`）
- SARIF：`--format @secretlint/secretlint-formatter-sarif`

</v-clicks>

<div v-click="'+1'" text-xs mt-2>

_Read more about_ [_CLI usage_](https://github.com/secretlint/secretlint#usage)

</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最后聊聊输出和几个安全细节。

[click] 一个很贴心的默认行为：错误信息里的密钥默认是脱敏打码的，避免它在 CI 日志或终端里被二次暴露，尤其在用 AI 工具时很重要。

[click] 真要看原值，加 --no-maskSecrets。

[click] --format 控制输出格式，默认 stylish，还有 json、unix、mask-result 等。

[click] mask-result 配合 --output 很妙：可以把某个文件里的密钥就地打码覆写，比如清洗 .zsh_history。

[click] 要对接安全平台就用 SARIF formatter。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

把密钥泄露挡在提交之前

- 一条命令体验：`npx @secretlint/quick-start "**/*"`
- 装 recommend 预设 + 接 pre-commit，团队即刻受益
- opt-in、可定制、规则即文档 —— 误报低、好维护

<div class="abs-br m-6 text-xl">
  <a href="https://secretlint.github.io/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/secretlint/secretlint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/secretlint/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #b91c1c;
  background-image: linear-gradient(45deg, #ef4444 10%, #b91c1c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 Secretlint。

它把密钥泄露挡在提交之前；一条 quick-start 命令就能体验；装上 recommend 预设、接进 pre-commit，整个团队立刻受益。

opt-in、可定制、规则即文档，所以误报低、好维护。文档、GitHub、笔记链接都在下面，去试试吧！
-->

---
layout: end
---
