---
theme: seriph
background: https://cover.sli.dev
title: Caveman
info: |
  让 AI agent 说话像穴居人，省 65% 输出 token，技术零损失。
  JuliusBrussee/caveman。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Caveman

why use many token when few token do trick

<div class="pt-6 opacity-80">
让 AI agent 说话像穴居人 · 省 65% 输出 token · 脑不变小，嘴变小
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/JuliusBrussee/caveman" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Caveman，why use many token when few token do trick。让 AI 编码 agent 说话像穴居人，删掉废话，省 65% 输出 token，技术零损失。它缩小 agent 的嘴，不缩小脑。
-->

---
transition: fade-out
---

# before / after

同一个修复，三分之一的词

````md magic-move
```text
❌ 正常 agent —— 69 token
你的 React 组件重渲染，很可能因为你每次渲染都创建了新对象引用。
把内联对象作为 prop 传入时，React 浅比较每次视为不同对象，触发
重渲染。建议用 useMemo 记忆这个对象。
```

```text
✅ caveman —— 19 token
New object ref each render. Inline object prop = new ref = re-render.
Wrap in `useMemo`.
```
````

<div v-click class="mt-4 text-center">

技术一点没丢——缩小的是 agent 的**嘴**，不是**脑**。

</div>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
before after 对比：正常 agent 69 token，caveman 19 token，三分之一的词，同一个修复，技术一点没丢。缩小的是嘴不是脑。
-->

---
transition: fade-out
---

# 核心规则

删废话，留实质

<v-clicks>

- **删**：冠词（a/the）、filler（just/really/basically）、寒暄、hedging
- **片段 OK**，短同义词（big 不 extensive、fix 不「implement a solution for」）
- **逐字保留**：代码、命令、错误、API 名、commit 类型（feat/fix）
- 无工具旁白、无装饰表格/emoji、不倒长错误日志

</v-clicks>

<div v-click class="mt-4">

模式：`[thing] [action] [reason]. [next step].`
> ✅「Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:」

</div>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心规则：删冠词、filler、寒暄、hedging；片段 OK、用短同义词；但代码命令错误逐字保留。模式是 thing action reason next step。
-->

---
transition: fade-out
---

# tokenizer 洞察：禁自造缩写

最有技术含量的一条规则

<div v-click>

```text
❌ cfg / impl / req / res / fn / auth  （自造缩写）
   → tokenizer 拆分成和全词一样的 token
   → 零 token 节省 + 读者多一步解码

✅ config / implement / request  （全词）
   → 又便宜又清晰
```

</div>

<v-clicks>

- **表面变短 ≠ token 变少**——省 token 要顺着 tokenizer 粒度
- 同理**禁因果箭头**（X → Y）：箭头自成一个 token，省不了还损清晰

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最有技术含量的规则：禁自造缩写。cfg impl req 这些 tokenizer 会拆成和全词一样的 token，零节省还损可读性。全词又便宜又清晰。关键洞察：表面变短不等于 token 变少，要顺着 tokenizer 粒度。
-->

---
transition: fade-out
---

# wenyan 文言文：极限压缩

给中文的彩蛋，也是真本事——古文每 token 载义最多

<div v-click>

「为什么 React 组件重渲染？」

</div>

<v-clicks>

- `full`：New object ref each render. Inline prop = new ref = re-render. `useMemo`.
- `wenyan-full`：每繪新生對象參照，故重繪；以 useMemo 包之則免。
- `wenyan-ultra`：新參照則重繪。useMemo 包之。

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

wenyan-full 达 80–90% 字符缩减。这是「保留语言」规则的**刻意例外**。

</div>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
wenyan 文言文模式是给中文的彩蛋。同一个问题，full 是英文 caveman，wenyan-full 用古文 80 到 90% 字符缩减，wenyan-ultra 更极限。正常情况 caveman 保留你的语言不翻译，wenyan 是刻意例外，因为古文每 token 载义最多。
-->

---
transition: fade-out
---

# Auto-Clarity：该清楚时一定清楚

简短服务于沟通，不以牺牲正确性为代价

<div v-click>

以下情形**自动退出 caveman**、恢复正常表达：

</div>

<v-clicks>

- **安全警告**
- **不可逆操作确认**（`DROP TABLE`）
- **多步序列**省略连词会误读
- 压缩本身制造技术歧义

</v-clicks>

<div v-click class="mt-4 text-center">

清晰的部分做完，再恢复 caveman。极简，但不冒险。

</div>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Auto-Clarity 是安全阀：安全警告、不可逆操作确认、多步序列歧义、压缩制造歧义时，自动退出 caveman 恢复正常表达，清晰部分做完再恢复。极简但不冒险。
-->

---
transition: fade-out
---

# 诚实数字：别只冲着省钱

作者主动泼冷水（HONEST-NUMBERS.md）

<v-clicks>

- Caveman **只压缩输出** token；输入/推理不动
- skill 自身每轮加 ~1–1.5k 输入 token
- **整会话省得比 65% 少**，已简洁场景甚至**可能净负**

</v-clicks>

<div v-click class="mt-4 text-center text-xl">

**真正的赢面是可读性与速度，省钱是 bonus。**

</div>

<div v-click class="mt-2 text-center text-sm opacity-70">

基准输出均值 65%（22–87%，真实 API 可复现）；/caveman-compress 改 CLAUDE.md 减 ~46% 输入（永久）。

</div>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最值得敬佩的一点：诚实数字。作者主动说，caveman 只压缩输出，输入推理不动，skill 自身还加 1 到 1.5k 输入每轮，整会话省得少甚至净负。真正的赢面是可读性和速度，省钱是 bonus。别只冲着省钱来。
-->

---
transition: fade-out
---

# 7 个技能 + 零遥测

不止压缩回复

| 命令 | 作用 |
| --- | --- |
| `/caveman [level]` | 压缩每条回复 |
| `/caveman-compress <file>` | 改写 CLAUDE.md，省 ~46% 输入（永久） |
| `/caveman-commit` | Conventional Commit，≤50 字标题 |
| `/caveman-review` | 一行 PR 评论 |
| `/caveman-stats` | 真实 token 用量 + 终身节省 |
| `cavecrew-*` | Caveman 子代理，主上下文更耐用 |

<div v-click class="mt-2 text-center text-sm opacity-80">

**零遥测零 network**：装后无 telemetry、无 backend、零网络调用。

</div>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
7 个技能不止压缩回复：caveman-compress 改写 CLAUDE.md 省 46% 输入永久生效，caveman-commit 精简提交信息，caveman-review 一行 PR 评论，caveman-stats 看省了多少，cavecrew 子代理。零遥测零网络调用。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Caveman 让 agent 说话像穴居人省 65% 输出 token；代码逐字保留、Auto-Clarity 兜安全、wenyan 极限压缩；诚实看——真价值在可读性/速度。**

<div class="mt-8 opacity-80">

省 token · 缩嘴不缩脑 · tokenizer 洞察 · wenyan · 诚实数字

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/JuliusBrussee/caveman" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #ca8a04 10%, #78716c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Caveman 让 agent 说话像穴居人省 65% 输出 token，代码逐字保留，Auto-Clarity 兜安全，wenyan 极限压缩。记住诚实数字：真正价值在可读性和速度。
-->
