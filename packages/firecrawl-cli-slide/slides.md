---
theme: seriph
background: https://cover.sli.dev
title: Firecrawl CLI
info: |
  Firecrawl 官方 Claude Code Plugin——把 firecrawl CLI 装进 Claude Code /
  Codex / Gemini CLI，提供 live web data：scrape / crawl / search / map /
  parse / agent / interact / download / monitor。firecrawl/firecrawl-claude-plugin。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Firecrawl CLI

Firecrawl 官方 Claude Code Plugin——**live web data 全家桶**

<div class="pt-6 opacity-80">
firecrawl-claude-plugin · scrape / crawl / search / map / parse / agent · AGPL-3.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/firecrawl/firecrawl-claude-plugin" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Firecrawl 官方把 firecrawl CLI 打包成 Claude Code Plugin，10 个 skill 覆盖 live web data 全链路。源仓是 firecrawl-claude-plugin，不是 firecrawl 主仓。
-->

---
transition: fade-out
---

# 定位：三个仓库分工

不是主仓，是 plugin 仓

| 仓库 | 角色 |
| --- | --- |
| `firecrawl/firecrawl` | 服务端主体（API server、worker、self-host） |
| `firecrawl/cli` | CLI 二进制（`npm i -g firecrawl-cli`） |
| `firecrawl/firecrawl-claude-plugin` | **本叶主角**，10 个 skill 分发 |

<div v-click class="mt-4 text-center">

装 plugin 后，**Claude Code / Codex / Gemini CLI** 都能用自然语言触发。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三个仓库分工：主仓是服务端，CLI 仓是命令行二进制，plugin 仓是面向 AI agent 的 skill 分发。本叶讲 plugin 仓。
-->

---
transition: fade-out
---

# 安装：4 步走

```bash
# 1. Claude Code 里装 plugin
/plugin          # 搜 firecrawl，选装

# 2. 全局装 CLI
npm install -g firecrawl-cli

# 3. 认证（任选其一）
firecrawl login --browser
firecrawl login --api-key "fc-YOUR-API-KEY"
export FIRECRAWL_API_KEY=fc-YOUR-API-KEY

# 4. 验证（看 Concurrency 与 Credits）
firecrawl --status
```

<div v-click class="mt-3 text-center text-sm opacity-80">

免费 API key 在 firecrawl.dev/app/api-keys 申请；无 key 走 keyless free tier（限速）。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
4 步：装 plugin、装 CLI、认证、验证。免 API key 也能用，限速降级。
-->

---
transition: fade-out
---

# 10 Skill 全家桶

<div class="grid grid-cols-2 gap-4 mt-2">
<div>

**URL / 站点操作**

- `scrape` 取单页
- `crawl` 批量爬站段
- `map` 站内 URL 发现
- `search` Web 搜索
- `download` 整站存本地

</div>
<div>

**高阶 / 周边**

- `agent` AI 抽 JSON
- `parse` 本地文件解析
- `interact` 浏览器交互
- `monitor` 变化监控告警
- `cli` 总入口编排

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

每个 skill 一个 `SKILL.md`，触发词明确、选项齐全；agent 按需自动激活。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
10 skill 分两组：URL/站点操作（scrape/crawl/map/search/download）和高阶周边（agent/parse/interact/monitor/cli）。
-->

---
transition: fade-out
---

# 心智模型：递进升级链

先用便宜的命令

```text
1. search       ── 没具体 URL，先搜
2. scrape       ── 有 URL，直接抓
3. map + scrape ── 站太大，先 map 找子页
4. crawl        ── 需要整段（全部 /docs/）
5. monitor      ── 持续观察，替代重复 scrape
6. interact     ── scrape 失败、需点击/登录
```

<div v-click class="mt-4 text-center">

**核心**：search/map 是 URL 发现（便宜）；scrape 取 1 页；crawl/interact 才是大头。
盲目从 crawl 开始 = credits 黑洞。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
递进升级链是省钱核心：search/map 是 URL 发现，单次便宜；scrape 取一页；crawl/interact 才是大头。先便宜的试。
-->

---
transition: fade-out
---

# scrape：取单页内容

最常用——给 URL，返回 clean markdown

```bash
# 基础抓取
firecrawl scrape "https://example.com/page" -o .firecrawl/page.md

# 去导航栏 / footer / sidebar
firecrawl scrape "<url>" --only-main-content -o .firecrawl/page.md

# 等 JS 渲染（SPA）
firecrawl scrape "<url>" --wait-for 3000 -o .firecrawl/page.md

# 多 URL 并发（每个写 .firecrawl/）
firecrawl scrape https://a.com https://b.com https://c.com
```

<div v-click class="mt-3 text-center text-sm opacity-80">

自动处理 JS 渲染、反爬、代理轮换。约 1 credit/页。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
scrape 是最常用的：给 URL 取 clean markdown。自动 JS 渲染、反爬、代理轮换。优先普通 scrape，慎用 --query（贵 5 credits）。
-->

---
transition: fade-out
---

# crawl：批量爬站段

跟随链接爬多页——**总加 `--wait` 和 `--include-paths`**

```bash
# 爬文档段（推荐限定路径）
firecrawl crawl "<url>" --include-paths /docs \
  --limit 50 --wait -o .firecrawl/crawl.json

# 全站爬，限深度 + 进度
firecrawl crawl "<url>" --max-depth 3 --wait --progress \
  -o .firecrawl/crawl.json

# 异步任务状态查询
firecrawl crawl <job-id>
```

<div v-click class="mt-3 text-center text-sm opacity-80">

crawl 按页扣费；跑前先 `firecrawl credit-usage` 看余额。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
crawl 批量爬站段，必须 --wait 才返回结果，必须 --include-paths 否则爬整站烧 credits。
-->

---
transition: fade-out
---

# search：Web 搜索

没具体 URL 时第一步

```bash
# 基础搜索
firecrawl search "react hooks best practices" \
  -o .firecrawl/result.json --json

# 搜并抓全文（别再二次 scrape 结果 URL）
firecrawl search "react hooks" --scrape \
  -o .firecrawl/scraped.json --json

# 搜最近一天新闻
firecrawl search "AI agent" --sources news --tbs qdr:d \
  -o .firecrawl/news.json --json
```

<div v-click class="mt-3 text-center text-sm opacity-80">

2 credits/call；用完结果后 `search-feedback` 退 1 credit（每日 100 上限）。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
search 没具体 URL 时第一步。--scrape 一并抓全文，别再二次 scrape 结果 URL。search-feedback 退 1 credit。
-->

---
transition: fade-out
---

# map：站内 URL 发现

在大站点里找特定子页

```bash
# 找特定子页（推荐心智）
firecrawl map "<url>" --search "authentication" \
  -o .firecrawl/filtered.txt

# 列全部 URL
firecrawl map "<url>" --limit 500 --json \
  -o .firecrawl/urls.json
```

<div v-click class="mt-6 text-center">

**经典模式**：`map --search "auth"` → 找到 `/docs/api/authentication`
→ `scrape` 那个 URL

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

比 crawl 整站便宜得多——先 map 定位再 scrape。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
map 站内 URL 发现。经典模式：map --search 找子页、scrape 那个 URL。比 crawl 便宜。
-->

---
transition: fade-out
---

# agent：AI 结构化抽取

自主导航多页站点抽 JSON（耗时 2–5 分钟）

```bash
# 抽定价档
firecrawl agent "extract all pricing tiers" --wait \
  -o .firecrawl/pricing.json

# 给 JSON schema 控制输出结构
firecrawl agent "extract products" \
  --schema '{"type":"object","properties":{"name":{"type":"string"}}}' \
  --wait -o .firecrawl/products.json

# 限上限避免跑飞
firecrawl agent "get feature list" --urls "<url>" \
  --max-credits 100 --wait -o .firecrawl/features.json
```

<div v-click class="mt-3 text-center text-sm opacity-80">

单页结构化优先 `scrape`；agent 比 scrape 贵且慢，专为多页复杂站点。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
agent 自主导航多页抽 JSON。总设 --max-credits 上限。单页用 scrape。
-->

---
transition: fade-out
layout: two-cols
---

# parse / interact / monitor

::right::

<div class="pl-4 text-sm">

**parse**（本地文件 → md）

```bash
firecrawl parse ./paper.pdf -o .firecrawl/paper.md
firecrawl parse ./doc.docx -S -o .firecrawl/sum.md
```

支持 PDF/DOCX/XLSX/HTML。单文件 50 MB。

**interact**（浏览器会话）

```bash
firecrawl scrape "<url>"
firecrawl interact --prompt "Click login"
firecrawl interact stop
```

仅 scrape 失败时用——**不是** web search 替代。

**monitor**（监控告警）

```bash
firecrawl monitor create \
  --name "Blog" --schedule "every 5 minutes" \
  --goal "Alert on new posts." \
  --page https://example.com/blog
```

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
parse 解析本地文件、interact 是 scrape 失败的最后手段、monitor 替代 cron+scrape+diff 脚本。
-->

---
transition: fade-out
---

# 反模式：哪些不要做

<v-clicks>

- **不写 `-o`**：默认打到 stdout 会撑爆上下文——总 `-o .firecrawl/xxx.md`
- **URL 不加引号**：`?` 和 `&` 被 shell 解析——总 `"https://..."`
- **二次 scrape search 结果**：`--scrape` 已抓全文，别再抓
- **crawl 不设 `--include-paths`**：会爬整站，credits 黑洞
- **crawl 不加 `--wait`**：返回 job ID 异步，结果漏读
- **interact 当 web search**：官方明确禁止，用 `search`
- **每次都 `--query` scrape**：贵 5 credits，先抓再 grep
- **agent 不设 `--max-credits`**：可能跑飞

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式：不写 -o、URL 不加引号、二次 scrape search 结果、crawl 不设路径、interact 当 search 等。
-->

---
transition: fade-out
---

# 信用管理 + 输出落盘

`firecrawl --status` 看 Concurrency 与 Credits

| 命令 | 单价 |
| --- | --- |
| `scrape` | ~1 credit/页（`--query` +5） |
| `search` | 2 credits/call（feedback 退 1） |
| `crawl` | 按页计（跟 `--limit`） |
| `parse` | PDF ~1/页，HTML 1 扁平 |
| `agent` | 最贵（**必设 `--max-credits`**） |

<div v-click class="mt-4">

**输出落盘**（加 `.firecrawl/` 到 `.gitignore`，大文件用 `head -50`/`grep` 增量读）：

```bash
.firecrawl/search-{query}.json
.firecrawl/{site}-{path}.md
```

</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
信用管理：scrape/search 便宜，agent 最贵必设上限。输出总落 .firecrawl/，加 .gitignore，大文件增量读。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Firecrawl 官方 Claude Code Plugin——10 skill 覆盖 live web data 全链路：search → scrape → map → crawl → monitor → interact 递进升级，便宜先行。**

<div class="mt-8 opacity-80">

官方 plugin · 10 skill · live web data · 递进省钱 · 落盘保上下文

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/firecrawl/firecrawl-claude-plugin" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.firecrawl.dev" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF6B35 10%, #FFB088 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Firecrawl 官方 Claude Code Plugin，10 skill 覆盖 live web data 全链路。递进升级链省钱，输出落盘保上下文。
-->
