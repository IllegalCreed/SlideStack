---
theme: seriph
background: https://cover.sli.dev
title: Grill With Docs
info: |
  Grill Me 的工程升级版：盘问的同时为项目建共享语言（CONTEXT.md + ADR）。
  来自 Matt Pocock 的 Skills For Real Engineers。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Grill With Docs

盘问的同时，为项目建**共享语言**——CONTEXT.md 术语表 + ADR

<div class="pt-6 opacity-80">
Matt Pocock · Grill Me 的工程升级版 · engineering/grill-with-docs
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mattpocock/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Grill With Docs 是 Grill Me 的工程升级版。同样盘问对齐，但边盘问边为项目建共享语言。Matt 说它可能是整个仓库里最酷的一招。
-->

---
transition: fade-out
---

# 从 Grill Me 升级：多做一件事

同样的盘问对齐，额外把对齐**沉淀成项目资产**

<v-clicks>

- **盘问**（复用 grilling 引擎，和 Grill Me 完全一致）
- **+ 建术语表** `CONTEXT.md`——项目的 ubiquitous language
- **+ 记决策** `docs/adr/`——值得留痕的架构决策记录

</v-clicks>

<div v-click class="mt-6 text-center text-xl">

文档不是额外负担，是**盘问过程的副产物**。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它在 Grill Me 之上多做一件事：盘问的同时建 CONTEXT.md 术语表和 ADR。关键是文档不是额外负担，而是访谈的副产物——你盘问着盘问着，文档就沉淀出来了。
-->

---
transition: fade-out
---

# 它治的病：agent 太啰嗦

没有共享语言，agent 用 20 个词说清本该 1 个词的事

````md magic-move
```text
❌ BEFORE（没有共享语言）
「有个问题——当课程某章节里的一个课时
被变得 real（即在文件系统里有了位置）时，
会触发一连串……」
```

```text
✅ AFTER（有了共享语言）
「materialization cascade 有个问题。」
```
````

<div v-click class="mt-4 text-center">

一次省词，**session 复 session 地省**——这是 Matt 眼中「最酷的一招」。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它治的是四大失败模式的第二个——冗长。agent 被丢进项目自己猜黑话，就用一长串解释代替一个术语。给这个概念一个名字「materialization cascade」，之后一个词搞定，session 复 session 地省 token。
-->

---
transition: fade-out
---

# 架构：盘问引擎 + 建模引擎

正文同样只有一句话，挂两个引擎

```markdown
---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design,
  which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

Run a `/grilling` session, using the `/domain-modeling` skill.
```

<v-clicks>

- **grilling**——盘问纪律，和 Grill Me 完全一致
- **domain-modeling**——在盘问中主动建/锐化领域模型，就地落文档

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
架构同样优雅：正文一句话，挂两个可复用引擎。grilling 负责盘问，和 Grill Me 一模一样；domain-modeling 负责在盘问中建领域模型、就地落文档。
-->

---
transition: fade-out
---

# domain-modeling 的五个动作

它是**主动**建模——不只是读术语表，而是在改变模型时锐化它

| 动作 | 例子 |
| --- | --- |
| **挑战术语** | 「术语表定义 cancellation 为 X，你却像指 Y——哪个？」 |
| **锐化模糊语** | 「你说 account——指 Customer 还是 User？」 |
| **编造边界场景** | 发明场景压测概念边界 |
| **与代码交叉核对** | 「代码整单取消，你却说部分取消——哪个对？」 |
| **就地更新** | 术语一定就写进 CONTEXT.md，不批处理 |

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
domain-modeling 是主动纪律——挑战术语、锐化模糊语、编造边界场景、与代码交叉核对、就地更新。特别注意最后一条：不攒着最后写，术语一确定就趁热写进 CONTEXT.md。
-->

---
transition: fade-out
---

# CONTEXT.md：纯术语表

有主见地为每个项目专有概念钉死一个词

```markdown
# {Context Name}

## Language

**Customer**:
下单的个人或组织。
_Avoid_: Client, buyer, account
```

<v-clicks>

- **要有主见**：一概念多词时选最好的，其余进 `_Avoid_`
- **定义要紧**：1-2 句，说「是什么」不是「做什么」
- **只收项目专有词**：通用编程概念（超时、错误类型）不进
- **纯 glossary**：禁放实现细节，不当 spec、不当草稿

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
CONTEXT.md 是纯术语表。每个术语 1-2 句，用 _Avoid_ 列出该避免的同义词，逼你为一个概念钉死一个词。铁律：只收项目专有词，禁放实现细节——它是术语表，不是别的。
-->

---
transition: fade-out
---

# ADR：可短至一段

架构决策记录——价值在记录「做了决策 + 为什么」

```markdown
# {决策的简短标题}

{1-3 句：背景、决定了什么、为什么}
```

<div v-click class="mt-4">

存 `docs/adr/`，顺序编号 `0001-slug.md`。**不必填满章节**——一段话就够，可选的 Status / Options / Consequences 多数不需要。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
ADR 刻意做得极轻：可短至一段话。价值在记录「做了这个决策，因为这些理由」，不在填满模板章节。存在 docs/adr 顺序编号。
-->

---
transition: fade-out
---

# ADR 三门槛：全真才记

不是什么决策都值得记——满足三条才建

<v-clicks>

- **① 难逆**——以后改主意的代价很大
- **② 无 context 会困惑**——未来读者会想「为啥这么做？」
- **③ 真实权衡**——确有备选，你为具体理由选了这个

</v-clicks>

<div v-click class="mt-4">

> 任一条不满足就跳过：易逆的以后再逆就是；不惊讶的没人会问；无备选的没什么可记。够格的如：架构形状、带锁定的技术选型、刻意偏离显而易见路径。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
ADR 稀疏而精：只在难逆、无背景会困惑、有真实权衡三条全真时才记。这避免了把 ADR 堆成噪音。够格的典型是架构形状、带锁定的技术选型、刻意偏离常规路径。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 单上下文 vs 多上下文

引擎自动推断该用哪种

::left::

<div v-click>

**单上下文**（多数仓库）

根目录一个 `CONTEXT.md`

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

</div>

::right::

<div v-click>

**多上下文**

根 `CONTEXT-MAP.md` + 各自 CONTEXT.md

```
/
├── CONTEXT-MAP.md
└── src/
    ├── ordering/CONTEXT.md
    └── billing/CONTEXT.md
```

</div>

::bottom::

<div v-click class="mt-3 text-center">

有 MAP 读 MAP；只有根 CONTEXT.md 是单上下文；都没有则第一个术语时懒创建。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两种结构：多数仓库单上下文，根一个 CONTEXT.md；多子领域时用 CONTEXT-MAP.md 列出各上下文及关系。引擎会自动推断该用哪种，都没有就在第一个术语确定时懒创建。
-->

---
transition: fade-out
---

# 共享语言的连锁好处

降冗长只是开始——它还带来三个复利

<v-clicks>

- **命名一致**：变量、函数、文件都用共享语言，风格统一
- **代码库更好导航**：agent 用同一套词，找路更快
- **更省 thinking token**：有了更浓缩的语言，思考也更省

</v-clicks>

<div v-click class="mt-6 text-center">

> 「很难形容这有多强大。它可能是这个仓库里最酷的一招。试试就知道。」——Matt Pocock

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
共享语言的好处是复利式的：命名一致、代码库好导航、思考更省 token。这些好处 session 复 session 地累积。Matt 说这可能是整个仓库里最酷的一招。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Grill Me vs Grill With Docs

同一个盘问引擎，要不要落文档

::left::

<div v-click>

**Grill Me**

- 桶：productivity（通用）
- 产出：共识
- 治：misalignment
- 适合：一次性/非代码对齐

</div>

::right::

<div v-click>

**Grill With Docs**

- 桶：engineering（代码）
- 产出：共识 + 术语表 + ADR
- 治：misalignment + 冗长
- 适合：长期维护的代码库

</div>

::bottom::

<div v-click class="mt-3 text-center">

只需对齐用 Grill Me；想让对齐**沉淀成项目资产**、长期降冗长用 Grill With Docs。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两者选择很简单：只需一次性对齐用 Grill Me；想把对齐沉淀成项目的术语表和决策记录、长期降低 agent 冗长，就用 Grill With Docs。它们共用同一个盘问引擎。
-->

---
transition: fade-out
---

# 反模式

| 反模式 | 问题 |
| --- | --- |
| 往 CONTEXT.md 塞实现细节 | 违背「纯术语表」，它不是 spec |
| 什么决策都记 ADR | 三门槛全真才记，否则是噪音 |
| 收录通用编程概念进术语表 | 只收项目专有词 |
| 攒着最后批量写文档 | 应就地更新，趁热打铁 |
| 一次性小改动也用它 | 不涉新术语时用 Grill Me 更轻 |

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五个反模式。核心两条：CONTEXT.md 是纯术语表不是 spec，别塞实现细节；ADR 三门槛全真才记，别什么都记成噪音。
-->

---
layout: center
class: text-center
---

# 一句话记住

**`/grill-with-docs`：盘问对齐 + 就地建 CONTEXT.md 术语表和 ADR，用共享语言长期降 agent 冗长。**

<div class="mt-8 opacity-80">

对齐 + 落文档 · 纯术语表 · ADR 三门槛 · session 复 session 复利

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/mattpocock/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #db2777 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。grill-with-docs 就是 grill-me 的盘问加上就地建 CONTEXT.md 术语表和 ADR，用共享语言长期降低 agent 冗长。文档是访谈的副产物，价值 session 复 session 地累积。
-->
