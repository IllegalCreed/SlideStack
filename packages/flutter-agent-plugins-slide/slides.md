---
theme: seriph
background: https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80
title: Flutter Agent Plugins
info: |
  ## Flutter Agent Plugins
  Flutter 官方 agent 插件——skills + MCP + rules 捆绑。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Flutter Agent Plugins

Flutter 官方 agent 插件

<div class="pt-8 text-xl opacity-80">
skills + MCP + rules 捆绑 · flutter-* & dart-* · happy path 工作流
</div>

<div class="abs-br m-6 text-sm opacity-60">
flutter/agent-plugins · BSD-3 · Flutter 团队维护
</div>

---
layout: two-cols
layoutClass: gap-8
---

# 它是什么

<v-clicks>

- **Flutter 官方**（flutter 团队，BSD-3）
- 把 **skills + MCP 配置 + rules** 捆绑成插件
- 为 Flutter「happy path」开发提供工作流
- **Skill vs MCP**：MCP 给工具访问，Skill 教「怎么用」
- flutter-\* 10 个 + dart-\* 12 个

</v-clicks>

::right::

<div v-click="1" class="mt-16 p-6 rounded-xl bg-gradient-to-br from-sky-500/15 to-blue-500/10 border border-sky-400/25">

**一句话**

> 给 agent 领域专长 + 可复用工作流，大幅减少 Flutter/Dart 开发出错。

</div>

<div v-click="2" class="mt-4 p-4 rounded-lg bg-gray-500/10 text-sm">

```bash
claude plugin marketplace add \
  flutter/agent-plugins
claude plugin install \
  dart-flutter@dart-flutter
```

</div>

---
layout: default
---

# 安装 + skills 两大类

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1">

**安装**

```bash
# 通用（.agents/skills）
npx skills@1.5.17 add \
  flutter/agent-plugins \
  --skill '*' --agent universal --yes

# Claude Code plugin
claude plugin marketplace add \
  flutter/agent-plugins
claude plugin install \
  dart-flutter@dart-flutter
```

</div>

<div v-click="2">

**两大类 skill**

- **flutter-\***（10）：架构/布局/路由/本地化/响应式/preview/test/集成测试/JSON/HTTP
- **dart-\***（12+）：单测/覆盖率/静态分析/FFI/ffigen/pattern matching/primary constructors

另可装 `dart-lang/skills`

</div>

</div>

---
layout: default
---

# Skill 与 MCP 互补

<div class="grid grid-cols-2 gap-6 mt-8">

<div v-click="1" class="p-6 rounded-xl bg-blue-500/10 border border-blue-400/30 text-center">

**MCP**

给 agent<br/>**访问**专用工具

（Dart/Flutter 分析、hot reload…）

</div>

<div v-click="2" class="p-6 rounded-xl bg-green-500/10 border border-green-400/30 text-center">

**Skill**

教 agent<br/>「**怎么用**」工具

（完成特定任务的 how-to）

</div>

</div>

<div v-click="3" class="mt-8 text-center text-lg">

插件把 **skills + MCP 配置 + rules** 一起捆绑 → happy path 开箱即用

</div>

---
layout: default
---

# flutter-apply-architecture-best-practices

<div class="text-sm mt-2">

强制关注点分离，分三层，**绝不**混 UI 渲染 / 业务逻辑 / 数据获取：

</div>

<div class="grid grid-cols-3 gap-3 mt-4 text-sm">

<div v-click="1" class="p-4 rounded-lg bg-purple-500/10">

**UI 层（MVVM）**

- View：精简 widget，只放 UI 逻辑
- ViewModel：extends ChangeNotifier，暴露**不可变状态快照**

</div>

<div v-click="2" class="p-4 rounded-lg bg-orange-500/10">

**Data 层（Repository）**

- Service：包外部 API
- Repository：转 Domain Model + 缓存/离线/重试（单一真相源）

</div>

<div v-click="3" class="p-4 rounded-lg bg-teal-500/10">

**Domain（可选）**

- Use Case：仅逻辑复杂 / 需跨 ViewModel 复用时才用

</div>

</div>

<div v-click="4" class="mt-4 p-3 rounded-lg bg-gray-500/10 text-center text-sm">

`lib/` → `data/`（models/repositories/services）+ `domain/` + `ui/`（按 feature）

</div>

---
layout: default
---

# flutter-fix-layout-issues：布局排错

<div v-click="1" class="mt-2 p-4 rounded-xl bg-sky-500/10 border border-sky-400/30 text-center text-lg">

铁律：**Constraints go down. Sizes go up. Parent sets position.**

</div>

<div v-click="2" class="mt-4 text-sm">

| 错误签名 | 触发 |
| --- | --- |
| Vertical viewport unbounded height | ListView/GridView 放进未约束的 Column |
| RenderFlex overflowed | Row/Column 子请求尺寸 > 父约束（黄黑条） |
| Incorrect use of ParentData widget | Expanded 在 Flex 外、Positioned 在 Stack 外 |
| RenderBox was not laid out | 级联副作用，**忽略它**，往上看真正的约束违规 |

</div>

---
layout: two-cols
layoutClass: gap-6
---

# 更多 skills

<v-clicks>

**flutter-\***

- setup-declarative-routing（声明式路由）
- setup-localization（本地化）
- build-responsive-layout
- add-widget-preview（previews.dart）
- add-integration-test（Flutter Driver）
- implement-json-serialization

</v-clicks>

::right::

<v-clicks>

**dart-\***

- add-unit-test / collect-coverage
- run-static-analysis
- fix-runtime-errors
- generate-test-mocks
- use-ffigen / setup-ffi-assets
- use-pattern-matching
- use-primary-constructors

</v-clicks>

<div v-click="8" class="mt-6 p-3 rounded-lg bg-amber-500/10 text-sm">

💡 SKILL.md 元数据标 Gemini（Flutter=Google 系），但 skill agent-agnostic，Claude Code 可装用

</div>

---
layout: center
class: text-center
---

# 小结

<div class="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-sky-500/10">

**核心机制**

- skills + MCP 配置 + rules 捆绑
- Skill 教「怎么用」，MCP 给工具
- flutter-\* 10 + dart-\* 12+

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10">

**记住这些**

- 分层架构：UI(MVVM)/Data(Repo)/Domain
- 布局铁律：约束向下、尺寸向上
- `claude plugin install dart-flutter@dart-flutter`

</div>

</div>

<div v-click="3" class="mt-10 text-xl">

**Flutter 官方 · BSD-3 · happy path 工作流开箱即用**

</div>

<div v-click="4" class="abs-br m-6 text-sm opacity-60">
flutter/agent-plugins · docs.flutter.dev/ai
</div>
