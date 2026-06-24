---
theme: seriph
background: https://cover.sli.dev
title: HTML 表格
info: |
  HTML 表格 —— 结构语义、表头关联、合并、列样式与无障碍
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:html-5 class="text-8xl" />
</div>

<br/>

## HTML 表格

把二维数据组织成「机器能读、读屏能听」的结构（基于 HTML Living Standard）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
表格不是「画格子」的工具，而是「表达二维数据」的语义结构——它怎么写，决定了读屏用户能不能在里面穿行。
-->

---
transition: fade-out
---

# 这一章讲什么

`<table>` 是**数据**的二维容器，不是排版工具

<v-click>

- **结构**：`<table>` / `<caption>` / `<thead>` / `<tbody>` / `<tfoot>` 的语义与顺序
- **关联**：`<th>` + `scope`，复杂表用 `headers` / `id`
- **合并**：`colspan` / `rowspan` 与取值边界
- **样式**：`<col>` / `<colgroup>`（只 4 类 CSS 生效）
- **无障碍**：caption、读屏、改 `display` 补 `role`、反模式

</v-click>

<v-click>

> 一条贯穿全章的主线：**表越简单越无障碍**——少合并、少嵌套，胜过事后堆一堆 ARIA 补救。

</v-click>

---

# 一张表的骨架

```html
<table>
  <caption>标题</caption>
  <thead> … 表头行 … </thead>
  <tbody> … 数据行 … </tbody>
  <tfoot> … 汇总行 … </tfoot>
</table>
```

- `<table>` 容器 + `<caption>` 标题
- `<thead>` / `<tbody>` / `<tfoot>` 三分区
- `<tr>` 装行，`<th>` / `<td>` 装格

---

# 子元素的法定顺序

写错顺序不「报错」，但会被解析器纠正成你没预期的 DOM

<v-click>

1. 可选一个 `<caption>`（**必须第一个**）
2. 零或多个 `<colgroup>`
3. 可选一个 `<thead>`
4. 零或多个 `<tbody>`，**或**直接若干 `<tr>`（二选一）
5. 可选一个 `<tfoot>`

</v-click>

<v-click>

记忆：`<caption>` → `<colgroup>` → `<thead>` → `<tbody>` → `<tfoot>`

</v-click>

---

# 数量的硬约束

| 元素 | 数量 | 隐式 ARIA 角色 |
| --- | --- | --- |
| `<caption>` | 至多一个（且第一个） | — |
| `<thead>` | **至多一个** | `rowgroup` |
| `<tbody>` | **可有多个** | `rowgroup` |
| `<tfoot>` | **至多一个** | `rowgroup` |

<v-click>

`<tbody>` 可多个，用来把数据语义地分段（如按季度分块）。

</v-click>

---

# `<caption>`：先给表一个名字

```html
<table>
  <caption>2025 年俱乐部成员一览</caption>
  …
</table>
```

<v-click>

- 是表的**可访问名称**，必须是第一个子元素
- 读屏用户靠它一句话判断「细读还是跳过」
- 调标题上 / 下用 CSS `caption-side`（取代废弃的 `align`）

</v-click>

---

# `<tfoot>`：源码位置 vs 渲染位置

```html
<tfoot>
  <tr><th scope="row">合计</th><td>12,300</td></tr>
</tfoot>
```

<v-click>

- 现行标准允许把 `<tfoot>` 写在 `<table>` 末尾
- 但浏览器**渲染时永远把它放到表格底部**
- 早期 HTML 曾强制写在 `<tbody>` 之前，现已放宽

</v-click>

<v-click>

> 按阅读直觉写在最后即可。

</v-click>

---

# 三分区为什么值得写

`<thead>` / `<tbody>` / `<tfoot>` 把行分成「表头 / 主体 / 表尾」

<v-click>

- **语义清晰**：辅助技术分得清哪行是表头、数据、汇总
- **样式抓手**：CSS 可整段命中（给 `thead` 加底色）
- **打印分页**：长表跨页时浏览器可每页重复表头 / 表尾

</v-click>

<v-click>

> 隐式角色都是 `rowgroup`——它们是「行的语义分组」。

</v-click>

---

# `<table>` 没有专有属性

`<table>` 只接受全局属性，所有表现属性**全部废弃** → 搬到 CSS

| 废弃属性 | 现代 CSS 替代 |
| --- | --- |
| `border` | `border` + `border-collapse` |
| `cellpadding` | `<th>` / `<td>` 的 `padding` |
| `cellspacing` | `border-spacing` |
| `align` / `bgcolor` | `margin-inline` / `background-color` |
| `frame` / `rules` / `summary` | `border-*` / `<caption>` |

---

# 浏览器很宽容，但别依赖

不写 `<tbody>`，浏览器也会自动补一个把游离的 `<tr>` 包进去

<v-click>

后果：`table > tr` 这样的 CSS 选择器往往**选不中**，得写 `table > tbody > tr`。

</v-click>

<v-click>

> 容错虽好却不应依赖——显式写出 `<thead>` / `<tbody>` / `<tfoot>`，结构一目了然，样式与无障碍语义都落到实处。

</v-click>

---
layout: section
---

# 单元格与表头关联

看不见的关联，是读屏用户在表里穿行的全部依据

---

# `<th>` 与 `<td>`：区别在语义

| 格子 | 含义 | 默认样式 | 隐式角色 |
| --- | --- | --- | --- |
| `<th>` | 表头格 | 加粗 + 居中 | `columnheader` / `rowheader` |
| `<td>` | 数据格 | 常规左对齐 | 无表头语义 |

<v-click>

把表头写成 `<td>` + CSS 加粗，**语义就丢了**——读屏不再知道它是表头。凡「给行/列起名」的格，一律用 `<th>`。

</v-click>

---

# `scope`：声明表头管哪片格子

`scope` 是**只能用在 `<th>`** 上的枚举属性，四个取值：

| `scope` 值 | 作用范围 |
| --- | --- |
| `col` | 它所在**列**的所有数据格 |
| `row` | 它所在**行**的所有数据格 |
| `colgroup` | 整个**列组**剩余所有格 |
| `rowgroup` | 整个**行组**剩余所有格 |

---

# 最常见：`col` + `row` 组合

```html
<tr>
  <th scope="col">字母</th>
  <th scope="col">代码词</th>
</tr>
<tr>
  <th scope="row">A</th>
  <td>Alfa</td>
</tr>
```

<v-click>

焦点移到「Alfa」时，读屏播报它对应「字母 A」「代码词」——即使表很长、表头早滚出视口，关联依然成立。

</v-click>

---

# 不写 `scope` 会怎样？

::: tip 简单表也建议显式写
省略 `scope` 时浏览器会**自动推断**该表头管哪些格。简单表里这套推断通常没问题，但**某些读屏会推错**。
:::

<v-click>

显式写上 `scope` 投入很小、却能稳定改善体验——建议养成习惯。

</v-click>

---

# `rowgroup` / `colgroup`：管整个分组

```html
<tbody>
  <tr><th scope="rowgroup" colspan="2">华东地区</th></tr>
  <tr><th scope="row">上海</th><td>2,400 万</td></tr>
  <tr><th scope="row">杭州</th><td>1,200 万</td></tr>
</tbody>
```

<v-click>

> 规范约束：`<th>` **只有锚定在行组里**才能用 `rowgroup`，**只有锚定在列组里**才能用 `colgroup`，否则该取值无效。

</v-click>

---

# `abbr`：给表头一个简短别名

```html
<th scope="col" abbr="净收入">
  本季度净营业收入（人民币元）
</th>
```

<v-click>

- 视觉上单元格仍显示**完整文字**
- 读屏在「报这格属于哪个表头」时只念「净收入」
- 表头全称越长，`abbr` 越能让播报干练

</v-click>

---

# 复杂表：`scope` 不够用

一旦表头跨多行多列、出现两级以上表头、或大量合并

<v-click>

`scope` 的自动关联就会**乱套**——改用最可靠的手段：`headers` + `id` 显式绑定。

</v-click>

<v-click>

- `id`：全文档**唯一**的标识
- `headers`：写在 `<td>` / `<th>` 上，值是**空格分隔的 id 列表**
- 每个 id 必须指向**同一张表**内某个 `<th>`

</v-click>

---

# `headers` + `id` 示例

```html
<tr>
  <td></td>
  <th id="midterm" scope="col">期中</th>
  <th id="final" scope="col">期末</th>
</tr>
<tr>
  <th id="class-a" scope="row">一班</th>
  <td headers="class-a midterm">88</td>
  <td headers="class-a final">92</td>
</tr>
```

<v-click>

读屏在「92」播报「一班 / 期末 / 92」——`headers="class-a final"` 把它和两个表头都绑死了。

</v-click>

---

# 先想「能不能把表简化」

::: warning headers / id 是兜底，不是首选
要为每个表头编 `id`、每个数据格手写关联，**量大且易错**——漏一个 id、拼错一个 token，关联就断。
:::

<v-click>

> 规范与 web.dev 同一条忠告：**结构越简单的表越好理解、也越好维护**。能拆成两张简单表、能少用合并，就别硬堆一张复杂表。

</v-click>

---
layout: section
---

# 单元格合并

`colspan` 横向、`rowspan` 纵向

---

# `colspan`：横向合并

让一格在**同一行内**横跨相邻多列，默认值 `1`

```html
<tr>
  <th scope="col" rowspan="2">姓名</th>
  <th scope="col" colspan="2">会籍日期</th>
</tr>
<tr>
  <th scope="col">加入</th>
  <th scope="col">取消</th>
</tr>
```

<v-click>

「会籍日期」横跨两列，盖在「加入 / 取消」之上，形成两级表头。

</v-click>

---

# `colspan` 也用于汇总行

让「合计」标签横跨前几列，只在最后一列放数字

```html
<tfoot>
  <tr>
    <th scope="row" colspan="3">合计</th>
    <td>52.00</td>
  </tr>
</tfoot>
```

<v-click>

::: tip colspan 取值上限
有效值是「大于 0 且小于等于 **1000**」，默认 `1`。日常远用不到上限，写超界值会被钳到合法范围。
:::

</v-click>

---

# `rowspan`：纵向合并

让一格**向下**跨越后续若干行的同列位置，写在最上面那行

```html
<tr>
  <th scope="rowgroup" rowspan="2">饮品</th>
  <td>美式咖啡</td><td>18</td>
</tr>
<tr>
  <!-- 这一行不再写「饮品」，已被上面盖住 -->
  <td>拿铁</td><td>22</td>
</tr>
```

---

# `rowspan` 的取值与 `0` 特例

::: warning rowspan 边界
有效值是「小于等于 **65534**」的整数，默认 `1`。
:::

<v-click>

- `rowspan="0"` = 跨满它所在**行组剩余的所有行**（行数不定时方便）
- `colspan` **没有**这个 `0` 特例
- 上限对照：`colspan` ≤ 1000、`rowspan` ≤ 65534

</v-click>

---

# 关键坑：别在被盖住的位置写格子

合并后该格占据多个网格槽位，被盖住的位置**不能再写格子**

```html
<!-- ❌ 第二行多写一格，行被挤宽 -->
<tr><td rowspan="2">A</td><td>B</td></tr>
<tr><td>多余</td><td>C</td></tr>

<!-- ✅ 第二行只写没被盖住的那格 -->
<tr><td rowspan="2">A</td><td>B</td></tr>
<tr><td>C</td></tr>
```

<v-click>

记忆法：合并后把那块矩形**当成已填满**，后续只填空着的槽位。

</v-click>

---

# 合并与可访问性

合并是双刃剑：视觉上层次分明，但**对读屏是负担**

<v-click>

1. **多级表头必配 `headers` / `id`**：把每个下级表头/数据格显式关联到上级，别指望 `scope` 在多级结构还能推对
2. **能不合并就不合并**：web.dev 与规范一致——合并越少的表越好理解、越好维护

</v-click>

<v-click>

> 一张表若靠大量 `colspan` / `rowspan` 才能表达，先想想能不能拆成两张简单表。

</v-click>

---
layout: section
---

# 列样式 `<col>` / `<colgroup>`

能上色、能定宽，却给不了语义

---

# `<col>` / `<colgroup>` 是干什么的

想给「整列」统一上底色或定宽，又不愿逐个 `<td>` 加类

<v-click>

- `<colgroup>`：把连续若干列**归为一组**
- `<col>`：代表组内**某一列**（或借 `span` 代表连续几列）

</v-click>

<v-click>

> 它们**纯为样式服务**，对无障碍树**没有任何语义**（隐式角色「无」，也不允许加 `role`）——列的语义关系仍靠表头的 `scope` / `headers` 表达。

</v-click>

---

# 位置与 `span`

`<colgroup>` 位置固定：紧跟 `<caption>` 之后、在 `<thead>` 等之前

```html
<table>
  <caption>每周个人活动</caption>
  <colgroup span="5" class="weekdays"></colgroup>
  <colgroup span="2" class="weekend"></colgroup>
  <thead>…</thead>
</table>
```

<v-click>

`span` = 覆盖多少列，取值「大于 0 且不超过 1000」，默认 `1`。这里把 7 列分成「工作日 5 + 周末 2」。

</v-click>

---

# `span` 与 `<col>` 子元素互斥

::: warning 二选一
`<colgroup>` 一旦内含 `<col>` 子元素，就**不能**再写 `span`。
:::

```html
<colgroup>
  <col style="background:#eef" />     <!-- 第 1 列 -->
  <col span="2" style="width:6rem" /> <!-- 第 2~3 列 -->
  <col />                             <!-- 第 4 列 -->
</colgroup>
```

<v-click>

逐列写法适合给组内不同列**分别**定宽 / 上色（`<col>` 自己也能用 `span`）。

</v-click>

---

# 哪些 CSS 真能作用在列上

这是最反直觉处：**绝大多数 CSS 对列无效**，实测只有 4 类生效

| 属性 | 在列上的效果 |
| --- | --- |
| `background` | 给列内单元格设背景（受绘制层级影响） |
| `border` | 生效，但**仅当** `border-collapse: collapse` |
| `width` | 等同设 `min-width`（最小宽度） |
| `visibility` | 取 `collapse` 时整列不渲染 |

---

# 列上无效的 CSS

```html
<col style="padding: 8px; color: red; text-align: center" />
```

<v-click>

像 `padding` / `color` / `font-size` / `text-align` 写在 `<col>` 上**统统不起作用**。

</v-click>

<v-click>

> 它们得写到 `<td>` / `<th>` 上。换句话说：列元素只管「整列的**底色、边框、宽度、显隐**」这四件事。

</v-click>

---

# 背景的绘制层级

列、行、单元格都设背景时，谁盖谁有固定顺序（从底到顶）

<v-click>

1. 列组 `<colgroup>`（**最底层**）
2. 列 `<col>`
3. 行组 `<thead>` / `<tbody>` / `<tfoot>`
4. 行 `<tr>`
5. 单元格 `<th>` / `<td>`（**最顶层**）

</v-click>

<v-click>

> 「给 `<col>` 设了背景怎么没效果？」——多半是某个 `<tr>` / `<td>` 设了不透明背景，把列色盖住了。

</v-click>

---

# 改 `display` 会让列样式失效

::: tip 响应式的连带代价
为做响应式把 `table { display: block }` 改掉，**表格内部布局模型就被打破**。
:::

<v-click>

`<col>` / `<colgroup>` 这类依赖表格布局的样式也会随之失效——响应式表格的取舍见后文。

</v-click>

---
layout: section
---

# 表格可访问性

立在三根支柱上

---

# 读屏用户是怎么「看」表的

视觉用户一眼把握行列，读屏用户却是**线性听**的

<v-click>

辅助技术专门提供「**表格导航模式**」：按上下左右在单元格间移动焦点，每进一格自动播报对应的**行表头与列表头**，再念内容。

</v-click>

<v-click>

> 这套机制能不能用，全看 HTML 写得对不对——它依赖 `<caption>` + `<th>` + `scope`（或 `headers`/`id`）三样东西。

</v-click>

---

# 支柱一：`<caption>` 给名字

```html
<table>
  <caption>2021 年俱乐部成员状态</caption>
  …
</table>
```

<v-click>

- 是表的**可访问名称**，对低视力 / 读屏用户尤其重要
- 也可用 `aria-label` / `aria-labelledby` 起名
- 但 `<caption>` **默认且对所有人可见**，应优先用

</v-click>

---

# 支柱二：`<th>` + `scope` 建关联

```html
<tr>
  <th scope="col">姓名</th>
  <th scope="col">毕业年份</th>
</tr>
<tr>
  <th scope="row">娄敏秋</th>
  <td>1956</td>
</tr>
```

<v-click>

「1956」拥有两个表头——「毕业年份」（列）+「娄敏秋」（行）——读屏会告诉用户「这是娄敏秋的毕业年份」。

</v-click>

---

# 支柱三：复杂表用 `headers` / `id`

规范明确：**结构复杂的表**（合并、两级以上表头）需**显式**标明关联

```html
<td headers="class-a final">92</td>
```

<v-click>

- 读屏据此播报「一班 / 期末 / 92」
- 这类表 `scope` 的自动推断会**失准**
- 是对「拆不开的复杂表」的终极手段

</v-click>

---

# 降低认知负担

当一张表「在说明某个观点」或需要解读时，给一段简短摘要

<v-click>

- **长摘要**：`aria-describedby` 关联描述文字，或用 `<figure>` + `<figcaption>`
- **冗长表头**：`<th abbr="简称">` 给读屏一个简短播报名

</v-click>

```html
<figure>
  <figcaption>各季度营收同比增长。Q3 受促销拉动明显。</figcaption>
  <table>…</table>
</figure>
```

---

# 改了 `display`，务必补回 `role`

这是响应式表格**最隐蔽的陷阱**——改 `display` 会打散无障碍树

| 元素 | 需补的 `role` |
| --- | --- |
| `<table>` | `table` |
| `<thead>` / `<tbody>` / `<tfoot>` | `rowgroup` |
| `<tr>` | `row` |
| `<th>`（列 / 行） | `columnheader` / `rowheader` |
| `<td>` | `cell` |

---

# 「看起来多余」不等于可以省

::: warning 看不见的回归
`display` 会实打实地影响无障碍树。改了 `display` 又不补 `role`——**视觉照常，读屏却已读不出行列关系**。
:::

<v-click>

> 响应式方案务必**连带验证无障碍**，别只看视觉效果。

</v-click>

---

# 交互表：`grid` 与 `treegrid`

普通展示型数据表用原生 `<table>` 即可，带交互才换角色

<v-click>

- `role="grid"`：维护选中状态 / 支持二维键盘导航 / 允许重排单元格
- `role="treegrid"`：在 grid 基础上，行还能**展开 / 折叠**（树形表格）

</v-click>

<v-click>

> 这两种角色伴随一整套键盘交互契约，用了就得补全，否则更糟。普通只读表**不要**乱加 `grid`。

</v-click>

---

# 第一性原则：简单 > 补救

贯穿本章的主线再强调一次

<v-click>

- 少合并、少嵌套、少两级表头的表，**天然更易被理解**，维护成本也更低
- ARIA（`role` / `headers`/`id` / `aria-describedby`）是「原生结构表达不了时」的补救
- **不是**用来给一张过度复杂的表打补丁

</v-click>

<v-click>

> 先把表设计简单，再谈无障碍增强。

</v-click>

---
layout: section
---

# 数据表 vs 布局表

最根本的一条反模式

---

# 一条铁律：表格只装数据

现行标准与 web.dev 态度毫不含糊：**`<table>` 只用于数据**

<v-click>

朴素判据：内容是否被**对比 / 排序 / 计算 / 交叉引用**？

</v-click>

<v-click>

- ✅ **数据**：成绩单、价目表、对账单 → 用 `<table>`
- ❌ **布局**：分栏、缩略图网格 → 交给 CSS Grid / Flexbox

</v-click>

---

# 为什么不能拿表格排版

CSS 普及前曾用嵌套 `<table>` 拼布局，今天是明确的**反模式**

<v-click>

1. **语义错乱**：读屏把它当数据表念行列表头，用户听到一堆无意义导航提示
2. **难以响应式**：表格按内容撑宽、列宽相互牵制，天生不适应窄屏
3. **维护沉重**：嵌套表 HTML 又深又脆，改一处牵一片

</v-click>

<v-click>

> 正确工具：CSS **Grid**（二维）/ **Flexbox**（一维）/ **多列**（分栏文本）。

</v-click>

---

# 实在要用：`role="presentation"`

历史包袱里确有 `<table>` 做纯排版的，须摘掉表格语义

```html
<table role="presentation">
  <tr>
    <td><!-- 仅排版的左栏 --></td>
    <td><!-- 仅排版的右栏 --></td>
  </tr>
</table>
```

<v-click>

`role="presentation"`（同义词 `role="none"`）移除表格的隐式语义，免得读屏当数据表念。

</v-click>

---

# presentation 的级联行为

<v-click>

- 加在 `<table>` 上时，会**连带**让 `<caption>` / `<thead>` / `<tbody>` / `<tfoot>` / `<tr>` / `<th>` / `<td>` 一起退出无障碍树
- 但 `<th>` / `<td>` **内部**的内容（链接、控件、嵌套表）**仍照常暴露**

</v-click>

<v-click>

::: warning 两条细则
被标为 `presentation` 的元素**不要**再加 `aria-label`；浏览器会**忽略**加在可聚焦元素上的 `presentation`。
:::

</v-click>

---

# presentation 只是创可贴

> 说到底，`role="presentation"` 是给「拆不掉的历史布局表」兜底用的创可贴。

<v-click>

**新代码不该走到这一步**——一开始就用 CSS 布局，根本不需要它。

</v-click>

---

# 数据表默认不响应式

即便正经数据表也得面对：表格按**内容固有尺寸**撑开

<v-click>

窄屏上要么撑破容器、要么被压到不可读——需要额外手段，常见三招：

</v-click>

<v-click>

1. 外层容器横向滚动（**最稳**，不动语义）
2. `display: block` + 滚动 / 粘性表头
3. 断点重排为「卡片」

</v-click>

---

# 招式一：外层容器横向滚动

把 `<table>` 包进可横向滚动的容器，**表格结构不动**——最稳妥

```html
<div class="table-scroll" tabindex="0"
     role="region" aria-label="季度营收表">
  <table>…</table>
</div>
```

```css
.table-scroll { overflow-x: auto; }
```

<v-click>

加 `tabindex="0"` + `role="region"` + `aria-label`，键盘用户也能聚焦滚动。

</v-click>

---

# 招式二：`display:block` + 粘性表头

让表格自身可滚，并把表头用 `position: sticky` 钉住

```css
table { display: block; overflow: auto; height: 240px; }
th { position: sticky; top: 0; background: #fff; }
```

<v-click>

::: warning 改 display 必补 role
一旦改 `display: block`，表格隐式语义就被打破——**必须**补回 `role="table"` / `rowgroup` / `row` / `columnheader` / `rowheader` / `cell`。
:::

</v-click>

---

# 招式三：断点重排为卡片

很窄屏上用 CSS 把每行重排成一张「字段名—值」卡片

<v-click>

常借 `data-*` 属性 + `::before` 把列名显示在每个值前面。

</v-click>

<v-click>

- 视觉体验好
- 但**最易破坏无障碍**（动了 `display`）
- 务必连带补 `role` 并**实测读屏**

</v-click>

---

# 最佳实践小结

<v-click>

- 子元素顺序：`caption` → `colgroup` → `thead` → `tbody` → `tfoot`
- 表头用 `<th>` + `scope`（`col`/`row`）；复杂表才上 `headers`/`id`
- 合并：`colspan` ≤ 1000、`rowspan` ≤ 65534（`0` 跨满行组），别在被盖位置写格子
- `<col>` / `<colgroup>` 只为样式，仅 4 类 CSS 生效、无语义
- 表只装数据，布局交 Grid / Flexbox；改 `display` 必补 `role`

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把表写成「机器能读、读屏能听」的语义结构——**表越简单，越无障碍**

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
