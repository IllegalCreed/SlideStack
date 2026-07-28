---
theme: seriph
background: https://cover.sli.dev
title: 代码生成入门
info: |
  代码生成（Copilot-like）入门：补全 · Chat · Agent · Copilot/Continue/Tabby 选型

  Learn more at https://docs.github.com/en/copilot
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 代码生成（Copilot-like）

AI 辅助编写补全重构 · 补全 + Chat + Agent 三模式

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
代表工具：GitHub Copilot、Continue、Tabby。
-->

---
transition: fade-out
---

# 代码生成是什么

用 LLM 在编辑器/终端/PR 流程辅助编写代码

- **代表工具**：GitHub Copilot、Continue、Tabby
- **三种交互模式**：补全 / Chat / Agent
- **Copilot**：闭源 SaaS，订阅制，生态深
- **Continue**：开源，自由选模型（含本地 Ollama）
- **Tabby**：自托管开源，代码不出内网

> 注：Sourcegraph Cody 已 sunset，被 Amp 取代

<!--
三者在私有化与商业模式上各有取舍。
-->

---

# 三种交互模式

| 维度 | 补全 | Chat | Agent |
|------|------|------|------|
| 触发 | 打字时自动 | 主动提问 | 指派后自主 |
| 范围 | 当前光标/文件 | 对话 | 跨多文件+执行 |
| 自主权 | 极低（建议）| 中（给方案）| 高（改码跑命令）|
| 延迟 | 毫秒到秒 | 秒级 | 分钟级 |

**何时用哪种**

- 补全：样板代码（getter/SQL/测试骨架）
- Chat：读陌生代码要解释、生成单函数
- Agent：修 bug、依赖升级、迁移 API

> Agent 不要做「重写整个模块」这种宽泛任务

<!--
补全适合重复，Chat 适合解释，Agent 适合有边界任务。
-->

---

# GitHub Copilot 上手

VS Code 扩展商店搜 GitHub Copilot + Chat

**补全模式**

```javascript
// 边打字出灰色幽灵文本，Tab 接受
// NES（Next Edit Suggestions）预测下一处编辑
function calc(a, b) {
  return a + b;  // ← 灰色预测，Tab 接受
}
```

**Copilot CLI**

```bash
gh extension install github/gh-copilot
gh copilot suggest "列出最近 7 天修改的文件"
gh copilot explain "tar -xvf"   # 解释命令
```

> Copilot Chat 上下文：`@workspace` / `#file` / `@terminal`

<!--
Copilot 订阅：Free / Pro $10 / Pro+ $39 / Max $100。
-->

---

# Copilot coding agent

Issue → PR 自动化链路

```text
1. 开 GitHub Issue 描述任务（含复现步骤）
2. Issue 评论 @github-copilot 或指派 Copilot
3. 自动开分支 copilot/fix-date-bug
4. 改码 → 跑测试 → 迭代修复失败用例
5. 开 PR 说明改动 + 测试结果
6. 人工 review + CI 全绿后才合并
```

**Agent 约束最佳实践**

- 沙箱执行：Agent 跑命令在隔离环境
- 测试门禁：PR 必须 CI 全绿才能合
- 人工评审：Agent PR 不能自动合
- 任务边界清晰：Issue 写清改什么怎么验证

> Agent 失控会引入隐蔽回归，必须强约束

<!--
coding agent 把 Issue→PR 链路自动化。
-->

---

layout: two-cols

---

# Continue 多模型路由

一份 config.yaml 跑三类功能

```yaml
# ~/.continue/config.yaml
models:
  - name: Claude
    provider: anthropic
    model: claude-sonnet-4-5
    roles: [chat, edit]
  - name: 本地补全
    provider: ollama
    model: qwen2.5-coder:1.5b
    apiBase: http://localhost:11434
    roles: [autocomplete]
```

::right::

# 本地 vs 云端

| 维度 | 本地 | 云端 |
|------|------|------|
| 延迟 | 低 | 中 |
| 成本 | 一次投入 | 按 token |
| 质量 | 弱于旗舰 | 旗舰最强 |
| 合规 | 不出域 | 代码出域 |

> 补全用本地够用，Chat/Agent 上云质量更好

<!--
Continue 按 roles 把请求路由到不同 provider。
-->

---

# Tabby 自托管部署

Docker 部署，代码不出内网

```bash
docker run -d --gpus all --name tabby \
  -p 8080:8080 -v ~/.tabby:/data \
  --restart unless-stopped \
  tabbyml/tabby serve \
    --model Qwen2.5-Coder-7B --device cuda
```

**模型选型**

| 模型 | 显存 | 适合 |
|------|------|------|
| Qwen2.5-Coder-1.5B | ~4GB | 实时补全 |
| Qwen2.5-Coder-7B | ~8GB | 主流补全 |
| Qwen2.5-Coder-32B | ~24GB+ | 较强推理 |

> 补全优先 1.5B-7B 求速度，Chat 才上 32B+

<!--
团队共用一个 Tabby server，扩展指向 server 地址。
-->

---

# 三工具横向对比

| 维度 | Copilot | Continue | Tabby |
|------|------|------|------|
| 开源/部署 | 闭源 SaaS | 开源+任意 provider | 开源自托管 |
| 代码出域 | 是 | 可选 | 否（全内网）|
| Agent | coding agent | +MCP | 弱 |

**选型**：省心+GitHub 集成→Copilot / 自由选模型→Continue / 代码不出域→Tabby

> 可并存：Copilot 主力 + Continue 本地补全

<!--
选型一句话决定走哪个工具。
-->

---

# 通用最佳实践

- **接受前读全**：幽灵文本别盲 Tab，读完整段
- **写好注释/上下文**：注释清意图，补全质量提升
- **幻觉 API 必查文档**：模型会编造不存在的签名
- **Agent 任务要可验收**：Issue 给出测试方法
- **定期复核测试**：AI 测试可能测错东西
- **敏感代码隔离**：`.copilotignore` / 限定仓库

> 长上下文补全有时反而拖慢，可调接受阈值

<!--
接受补全前读全代码，幻觉 API 当场识别。
-->

---

layout: quote

---

# 三模式覆盖全粒度

「补全（打字时）+ Chat（问答时）+ Agent（多文件任务时），从补一个函数到改一个模块都有对应工具，核心是选对模式与模型。」

---

# 选型矩阵速记

| 需求 | 选择 |
|------|------|
| 省心、生态深、订阅团队 | GitHub Copilot |
| 自由选模型 / 本地推理 | Continue |
| 强合规、代码不出域 | Tabby |
| 混合：云端主力+本地补全 | Copilot + Continue |

**模型经验**

- 补全：小快模型（Qwen2.5-Coder-1.5B/7B、Codestral）
- Chat/Agent：大模型（Claude/GPT）
- 本地：Ollama 跑补全，零延迟零成本

> 涉密项目必须 Continue/Tabby 自托管才能合规

<!--
选型一句话：省心 Copilot，自由 Continue，不出域 Tabby。
-->

---
layout: center
class: text-center
---

# 小结

代码生成 = 补全 + Chat + Agent

**Copilot 省心 · Continue 自由 · Tabby 合规 · 模式选对**

[Copilot 文档](https://docs.github.com/en/copilot) · [Continue](https://docs.continue.dev) · [Tabby](https://tabbyml.com/docs) · [GitHub](https://github.com/IllegalCreed/SlideStack)

<!--
三模式 + 三工具，按场景选型。
-->
