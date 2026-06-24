---
theme: seriph
background: https://cover.sli.dev
title: HTML 文本内容与超链接
info: |
  HTML 文本内容与超链接 —— 强调与重要性、行内语义全谱、超链接安全、列表、国际化、空白换行
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:html-5 class="text-8xl" />
</div>

<br/>

## HTML 文本内容与超链接

让标签携带语义，而非充当样式钩子（基于 HTML Living Standard）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
浏览器渲染只有粗、斜、等宽这几种长相，但同一种长相背后可能是完全不同的语义。这一章讲的就是怎么按「意思」选标签。
-->

---
transition: fade-out
---

# 这一章讲什么

文本不只是「字」，每段都该带上**正确的语义**

<v-click>

- **强调与重要性**：`<em>` / `<strong>` vs `<b>` / `<i>`
- **行内语义全谱**：代码、引用、时间、缩写、上下标
- **超链接**：`href` 类型、`target` 与 `rel` 安全
- **列表三型** + **国际化** + **空白换行**

</v-click>

<v-click>

> 选错标签大多**不报错**——但屏幕阅读器、搜索引擎、未来维护者读到的「意图」全乱了。

</v-click>

---

# 一条贯穿全章的准则

先问「这段文字**是什么意思**」，再选元素

<v-click>

- 「我想让它变粗 / 变斜」**不是**选 `<strong>` / `<em>` 的理由
- 那是 CSS `font-weight` / `font-style` 的活
- 只有当「粗 / 斜」背后有**语义**（重要、强调、术语、键盘键），才用语义元素

</v-click>

<v-click>

> 浏览器渲染相同，**语义层面却天差地别**——选对了，机器和人才读得懂你的意图。

</v-click>

---
layout: section
---

# 强调与重要性

四个长得像、意思不同的元素

---

# `<em>`：强调（会改变句意）

`<em>` 表示**重音强调**——朗读时重读的那个词

```html
<p>我<em>喜欢</em>猫。</p>   <!-- 强调「喜欢」的程度 -->
<p>我喜欢<em>猫</em>。</p>   <!-- 强调是「猫」不是别的 -->
```

<v-click>

强调的「程度」由**祖先 `<em>` 的层数**决定，嵌套越深越强：

```html
<p><em>叫一辆<em>出租车</em>！</em></p>
```

</v-click>

---

# `<strong>`：重要（不改变句意）

`<strong>` 表示**强重要性、严肃或紧急**——警告、关键步骤

```html
<p><strong>警告：</strong>此操作不可撤销。</p>
<p>使用前请<strong>务必</strong>阅读安全须知。</p>
```

<v-click>

同样可嵌套加深重要性：

```html
<p><strong>满 300 减 50，<strong>仅限今日</strong>。</strong></p>
```

</v-click>

---

# `<em>` 还是 `<strong>`？

根本区别：**改不改变句意**

<v-click>

- `<em>` 改变**朗读重音**进而改变语意
  - 「I `love` carrots」对比「I love `carrots`」
- `<strong>` 给一部分内容**加上重要性**
  - 「`Warning!` This is `very dangerous.`」

</v-click>

<v-click>

> 经验法则：能用「（停顿、加重语气）」念出来的是 `<em>`；像贴了一张「重要！」标签的是 `<strong>`。

</v-click>

---

# `<b>` 与 `<i>`：弱语义的样式占位

它俩只是「带一点点语义」，没有重要性 / 强调

<v-click>

`<b>`：**引人注意但不更重要**——关键词、产品名、导语

```html
<p>本次评测的主角是 <b>MacBook Pro M5</b>。</p>
```

</v-click>

<v-click>

`<i>`：**异声 / 异质**——外文、术语、专名（外文加 `lang`）

```html
<p>他露出一丝 <i lang="fr">je ne sais quoi</i> 的神情。</p>
```

</v-click>

---

# 四者对照

| 元素 | 语义 | 默认样式 | 典型场景 |
| --- | --- | --- | --- |
| `<em>` | 强调（改句意） | 斜体 | 重读的词 |
| `<strong>` | 重要 / 紧急 | 加粗 | 警告、关键步骤 |
| `<b>` | 引人注意（无重要性） | 加粗 | 关键词、产品名 |
| `<i>` | 异声 / 异质 | 斜体 | 外文、术语、专名 |

<v-click>

> `<strong>` / `<em>` 携带语义，`<b>` / `<i>` 只是带一点语义的样式占位，纯样式归 CSS。

</v-click>

---

# 决策流程

遇到「想加粗 / 加斜」，按顺序自问：

<v-click>

1. 会改变这句话的**意思 / 朗读重音**吗？→ `<em>`
2. 内容上**很重要**（警告、必读）吗？→ `<strong>`
3. 是**外文 / 术语 / 专名 / 异声**吗？→ `<i>`（外文加 `lang`）
4. 只是**想视觉醒目**（关键词、专名）吗？→ `<b>`
5. 以上都不是，**纯为好看**？→ CSS `font-weight` / `font-style`

</v-click>

---
layout: section
---

# 行内语义全谱

代码、引用、时间、缩写——一词一义

---

# 代码四件套

四种角色，别无脑全写成 `<code>`

| 元素 | 角色 | 例子 |
| --- | --- | --- |
| `<code>` | 代码片段 | `Array.map()` |
| `<kbd>` | 用户输入的键 | `Ctrl + S` |
| `<samp>` | 程序输出 | `Error 404` |
| `<var>` | 变量 / 占位符 | `x`、`username` |

<v-click>

> `<kbd>`（用户输入）与 `<samp>`（程序输出）正好是一对。

</v-click>

---

# `<code>`：行内 vs 代码块

```html
<p>用 <code>Array.prototype.map()</code> 遍历数组。</p>
```

<v-click>

`<code>` 只标**行内**代码；多行代码块要放进 `<pre>` 保留空白换行：

```html
<pre><code class="language-js">function add(a, b) {
  return a + b;
}</code></pre>
```

规范建议用 `class="language-*"` 供语法高亮识别。

</v-click>

---

# `<kbd>`：可嵌套表组合键

`<kbd>` 表示用户输入，可**嵌套**表达组合键或序列

```html
<p>按 <kbd>Enter</kbd> 提交。</p>
<!-- 组合键：外层包整组，内层包单个键 -->
<p>保存：<kbd><kbd>Ctrl</kbd> + <kbd>S</kbd></kbd></p>
```

<v-click>

`<var>` 标变量，常和 `<code>` / `<sup>` 配合：

```html
<p>面积：<var>S</var> = <var>π</var><var>r</var><sup>2</sup></p>
```

</v-click>

---

# `<mark>`：相关性高亮

因「与用户**当前活动相关**」而高亮——最典型是搜索命中

```html
<p>这份文档讲了 <mark>viewport</mark> 的全部取值。</p>
```

<v-click>

也可在引文里标出**你想让读者注意**的部分（非原文所有）：

```html
<blockquote>
  <p>性能优化的第一原则是 <mark>先测量再优化</mark>。</p>
</blockquote>
```

</v-click>

<v-click>

> 区别于 `<b>`：`<mark>` 是「与读者当下相关」（动态），`<b>` 只是「实用地引人注意」（静态）。

</v-click>

---

# `<q>`：行内引语（自动加引号）

铁律：**不要自己敲引号**——浏览器按 `lang` 自动插入

```html
<p>他说：<q>代码即文档。</q></p>
<!-- 中文环境渲染「」，英文环境渲染 "" -->
```

<v-click>

可选 `cite` 属性放来源 URL（机器可读，不显示）：

```html
<p>正如文档所述：<q cite="https://example.com/doc">默认惰性加载。</q></p>
```

</v-click>

---

# `<cite>`：作品标题（不是人名！）

`<cite>` 标书、文章、电影、软件等**作品的标题**

```html
<p>正如 <cite>《重构》</cite> 一书所言……</p>
<p>这段引文出自电影 <cite>盗梦空间</cite>。</p>
```

<v-click>

::: warning 规范明确禁令
人名**不是**作品标题，`<cite>` **绝不能**用来标记人名。人名请用 `<b>` 或 `<span>`。
:::

</v-click>

---

# `<blockquote>`：块级引用

`cite` 是**属性**（存来源 URL、不显示），出处写在外面

```html
<blockquote cite="https://example.com/article">
  <p>过早优化是万恶之源。</p>
</blockquote>
<p>—— <cite>《计算机程序设计艺术》</cite>，Donald Knuth</p>
```

<v-click>

> 浏览器给 `<blockquote>` 加缩进，但**不会**自动加引号（这点和 `<q>` 不同）。

</v-click>

---

# `<time>`：日期与时间

同时承载「给人看的文字」和「给机器读的 `datetime`」

```html
<p>活动定于 <time datetime="2026-07-07">7 月 7 日</time> 举行。</p>
<p>最后更新：<time datetime="2026-06-24T14:30+08:00">下午 2:30</time></p>
```

<v-click>

| 含义 | 格式 | 示例 |
| --- | --- | --- |
| 日期 | `YYYY-MM-DD` | `2026-06-24` |
| 本地日期时间 | `…THH:MM` | `2026-06-24T14:30` |
| 带时区 | `…±HH:MM` / `…Z` | `…+08:00` |
| 时长 | `PnDTnHnMnS` | `PT2H30M` |

</v-click>

---

# `<data>` 与上下标

`<data>`：把人类可读文字关联到**机器可读值**（非时间类）

```html
<p>商品：<data value="SKU-12345">蓝色小组件</data></p>
```

<v-click>

`<sub>` / `<sup>`：有语义的下标 / 上标（化学式、幂、脚注）

```html
<p>水的化学式是 H<sub>2</sub>O。</p>
<p>这是一处脚注<sup><a href="#fn1">[1]</a></sup>。</p>
```

> 不是「缩小并升降字」——纯排版用 CSS `vertical-align`。

</v-click>

---

# `<small>` · `<s>` · `<span>`

三个收尾元素，各有边界

<v-click>

- `<small>`：小字附注（版权、免责、署名）——**别**包大段文字
- `<s>`：内容**不再准确 / 相关**（过期价、已不成立的事实）
  - ≠ `<del>`（编辑删除，见国际化页）
- `<span>`：**无任何语义**的兜底容器，仅挂样式 / 钩子

</v-click>

<v-click>

```html
<footer><small>© 2026 Example 公司。</small></footer>
<p>原价 <s>￥299</s> 现价 ￥199。</p>
```

</v-click>

---
layout: section
---

# 超链接

HTML 的灵魂，以及它背后的安全机制

---

# `<a>` 与 `href` 类型

没有 `href` 的 `<a>` 只是占位符（不可点、不可聚焦）

```html
<a href="https://example.com">绝对 URL</a>
<a href="/docs/html">根相对</a>
<a href="./sibling">目录相对</a>
<a href="#install">页内锚点</a>
```

<v-click>

> `href` 还支持协议相对 `//host`、`mailto:`、`tel:`、`sms:`、`data:`、`blob:` 等多种形态。

</v-click>

---

# 页内锚点

`href="#id"` 跳到 `id` 等于该值的元素

```html
<a href="#features">查看功能</a>
...
<h2 id="features">功能</h2>
```

<v-click>

- `href="#top"` 与 `href="#"`（大小写不敏感）回到页顶
- 锚点可拼在绝对 URL 后：`https://ex.com/doc#install`
- 配 CSS `scroll-behavior: smooth` 平滑滚动
- 配 `scroll-margin-top` 避免固定页头遮挡

</v-click>

---

# 协议链接：mailto · tel · sms

```html
<a href="mailto:hi@example.com?subject=反馈&body=你好">带主题正文</a>
<a href="tel:+8675512345678">+86 0755-1234-5678</a>
<a href="sms:+8613800000000">发短信</a>
```

<v-click>

- 多个查询参数用 `&` 连接、`?` 起头
- 参数值里的空格 / 中文**必须 URL 编码**（空格→`%20`）
- 可用 CSS 属性选择器自动加图标：`a[href^="mailto:"]::before`

</v-click>

---

# `download`：触发下载

让浏览器把目标**存为文件**而非导航过去

```html
<a href="/report.pdf" download>下载报告</a>
<a href="/files/2026.pdf" download="年度报告.pdf">下载</a>
```

<v-click>

::: warning 同源限制
`download` **只**对同源 / `blob:` / `data:` 生效；**跨域**资源多被忽略。要强制跨域下载，需服务端返回 `Content-Disposition: attachment`。
:::

</v-click>

---

# `target`：在哪里打开

| 取值 | 行为 |
| --- | --- |
| `_self` | 当前上下文（**默认**） |
| `_blank` | 新标签 / 新窗口 |
| `_parent` | 父级浏览上下文 |
| `_top` | 最顶层（跳出深层 iframe） |
| 自定义名 | **复用**同名标签，不存在则新建 |

<v-click>

> `_blank` **每次都开新标签**，自定义名**复用同名标签**——避免「点一次开一个」。

</v-click>

---

# 安全：反向标签劫持

`target="_blank"` 打开的新页可通过 `window.opener` 操控**原页**

```html
<!-- 危险（老浏览器）：新页可把原标签重定向到钓鱼站 -->
<a href="https://untrusted.com" target="_blank">外站</a>
```

<v-click>

修复：加 `rel="noopener"` 切断对 `window.opener` 的访问

```html
<a href="https://untrusted.com" target="_blank" rel="noopener">外站</a>
```

</v-click>

<v-click>

> 现代浏览器（Chrome 88+ / Firefox 79+ / Safari）**已自动隐含 `noopener`**；但为兼容老浏览器与表达意图，仍建议显式写。

</v-click>

---

# `noopener` vs `noreferrer`

| `rel` 值 | 作用 |
| --- | --- |
| `noopener` | 拿不到 `window.opener`，**但仍发 `Referer`** |
| `noreferrer` | 隐含 noopener，**且不发 `Referer`**（隐私） |

<v-click>

指向不可信外站的稳妥写法：

```html
<a href="https://ex.com" target="_blank" rel="noopener noreferrer">外站</a>
```

</v-click>

---

# 其他常用 `rel` 值

| `rel` 值 | 含义 |
| --- | --- |
| `nofollow` | 别让搜索引擎追踪（UGC、广告、付费链接） |
| `external` | 指向外部站点 |
| `alternate` | 替代版本（配 `hreflang` / `type`） |
| `author` | 指向作者信息 |
| `me` | 「我」的另一处身份页（IndieAuth / Mastodon） |
| `license` / `search` | 许可 / 搜索 |

<v-click>

```html
<a href="https://user-site.com" rel="nofollow noopener" target="_blank">用户的站点</a>
```

</v-click>

---

# 链接可访问性

屏幕阅读器可「列出页面全部链接」——此时**只读链接文字**

<v-click>

```html
<!-- 差：脱离上下文听不懂 -->
<p>了解我们的产品，<a href="/products">点这里</a>。</p>
<!-- 好：链接文字本身说明去向 -->
<p>了解 <a href="/products">我们的产品线</a>。</p>
```

</v-click>

<v-click>

- 新标签 / 下载要给用户**文字提示**（如「在新标签打开」）
- 别拿 `<a href="#">` + JS 当按钮——**动作**用 `<button>`

</v-click>

---
layout: section
---

# 列表 · 国际化 · 空白

把项目组织起来，再处理语言、方向与换行

---

# 列表：`<ul>` 还是 `<ol>`？

判据：**把项目重新排序，意义变了吗？**

```html
<ul>                          <ol>
  <li>苹果</li>                  <li>混合面粉、糖、盐。</li>
  <li>香蕉</li>                  <li>打入鸡蛋。</li>
  <li>橙子</li>                  <li>烤 20 分钟。</li>
</ul>                         </ol>
```

<v-click>

- 变了（菜谱步骤、比赛名次）→ `<ol>`
- 没变（配料清单、标签云）→ `<ul>`
- **别**因为「想要 / 不想要圆点」而选——那是 CSS `list-style`

</v-click>

---

# `<ol>` 的四个调号属性

| 属性 | 作用 |
| --- | --- |
| `type` | 编号样式：`1` / `a` / `A` / `i` / `I` |
| `start` | 起始数（**始终用阿拉伯数字**） |
| `reversed` | 从高到低倒数 |
| `<li value>` | 覆盖单项编号，后续接着续 |

```html
<ol start="4" type="a">      <!-- 从 d 开始 -->
  <li>第四项（显示 d）</li>
  <li>第五项（显示 e）</li>
</ol>
```

---

# `<dl>`：描述列表

`<dt>`（术语）+ `<dd>`（描述），支持多对多配对

```html
<dl>
  <dt>Firefox</dt>
  <dt>火狐</dt>          <!-- 多术语共一描述 -->
  <dd>Mozilla 开发的开源浏览器。</dd>
</dl>
```

<v-click>

::: warning 别为缩进滥用 `<dl>`
`<dd>` 默认带左缩进，但拿 `<dl>` 当「缩进工具」会破坏语义。缩进请用 CSS `margin`，`<dl>` 只用于真正的「术语—描述」配对。
:::

</v-click>

---

# 国际化：局部语言标注 `lang`

正文里夹杂的外文片段应**就地再标 `lang`**

```html
<p>菜名叫 <span lang="fr">crème brûlée</span>，意为「焦糖布丁」。</p>
<p>他常把 <span lang="ja">いただきます</span> 挂在嘴边。</p>
```

<v-click>

- 帮屏幕阅读器切到正确的**语音引擎**
- 帮浏览器正确**断词与选字体**
- 值是 BCP 47 语言标签（`fr`、`ja`、`zh-Hant`）

</v-click>

---

# `<ruby>`：注音

给汉字标拼音、给日语汉字标振假名

```html
<ruby>
  汉 <rp>(</rp><rt>hàn</rt><rp>)</rp>
  字 <rp>(</rp><rt>zì</rt><rp>)</rp>
</ruby>
```

<v-click>

- `<rt>`（ruby text）：注音内容本身
- `<rp>`（ruby parenthesis）：**降级括号**——老环境显示为 `汉(hàn) 字(zì)`，支持时隐藏
- 自 2015 年起 Baseline，可放心使用

</v-click>

---

# 双向文字：`<bdi>` 隔离

RTL 文字（阿拉伯语 / 希伯来语）与 LTR 混排易方向错乱

```html
<!-- 不用 bdi：阿拉伯语名字把后面「- 1st」方向带乱 -->
<li>اَلأَعْشَى - 1st place</li>
<!-- 用 bdi：名字被隔离，方向正常 -->
<li><bdi>اَلأَعْشَى</bdi> - 1st place</li>
```

<v-click>

- 专治**方向未知的用户生成内容**（用户名、评论）
- `dir` 默认 `auto`、**不继承父元素**——自适应任意语言
- 自 2020 年起 Baseline，比 CSS `unicode-bidi` 更语义化

</v-click>

---

# `<bdo>` 与 `dir`

`<bdo dir="rtl">`：**强行**覆盖一段文字方向（罕用）

| `dir` 取值 | 含义 |
| --- | --- |
| `ltr` | 从左到右（默认） |
| `rtl` | 从右到左（阿拉伯语、希伯来语） |
| `auto` | 按首个强方向字符推断（适合 UGC） |

<v-click>

> `<bdi>` 是「**隔离**，让浏览器算对方向」；`<bdo>` 是「**覆盖**，强行规定方向」。用户内容用 `<bdi>`，明确反转才用 `<bdo>`。

</v-click>

---

# 编辑标注：`<ins>` · `<del>`

呈现「修订痕迹（track changes）」或代码 diff

```html
<p>会议时间改为 <del>周三下午</del> <ins>周四上午</ins>。</p>
```

<v-click>

两者都支持 `cite`（说明 URL）+ `datetime`（修改时间）：

```html
<del cite="https://ex.com/ticket/42" datetime="2026-06-20">旧条款</del>
```

> `<del>` 是「编辑删除」，`<s>` 是「内容不再准确 / 相关」——别混淆。

</v-click>

---

# 空白默认折叠

源码里连续的空格 / 制表符 / 换行**合并成一个空格**

```html
<p>你好     世界</p>
<p>你好
   世界</p>
<!-- 都渲染成：你好 世界 -->
```

<v-click>

- 行首 / 行尾空白被丢弃
- **不能靠敲多个空格或回车来排版**
- 想要空格 / 换行 / 缩进，都得用专门手段（`&nbsp;` / `<br>` / CSS）

</v-click>

---

# `<br>`：强制换行

空元素，仅用于「**换行本身就是内容**」的场景

```html
<p>
  北京市海淀区<br />
  中关村大街 1 号<br />
  100080
</p>
```

<v-click>

::: warning 别用 `<br><br>` 分隔段落
段落是有语义的结构单元（可按段导航、统一控间距），`<br><br>` 只是「视觉空一行」，没有语义。**段落分隔永远用 `<p>`。**
:::

</v-click>

---

# `<wbr>`：建议性断点

和 `<br>` 相反——只是「这里**可以**换行」，断开时**不加连字符**

```html
<p>https://example.com<wbr />/very<wbr />/deep<wbr />/path</p>
<code>my<wbr />_very<wbr />_long<wbr />_variable<wbr />_name</code>
```

<v-click>

- 专治长 URL、长标识符、超长复合词**撑破容器**
- 没有空格的长串否则会撑破布局或触发横向滚动
- 等价于零宽空格 `U+200B`，但是合法标签、更可控

</v-click>

---

# `<wbr>` vs `&shy;`（软连字符）

唯一区别：**断开时是否显示连字符**

| | `<wbr>` | `&shy;` |
| --- | --- | --- |
| 行为 | 可选断点 | 可选断点 |
| 断开时 | **不**显示连字符 | **显示**连字符 `-` |
| 适合 | URL、代码标识符 | 需连字符的长单词 |

<v-click>

> URL / 代码用 `<wbr>`（加连字符会被误认成路径一部分），自然语言长词用 `&shy;`。

</v-click>

---

# `<pre>` 与 CSS `white-space`

`<pre>`：**原样保留**空白与换行（等宽字体），常配 `<code>`

```html
<pre><code>function add(a, b) {
  return a + b;       // 缩进和空格都被保留
}</code></pre>
```

<v-click>

折叠行为最终由 CSS `white-space` 控制：

| 值 | 折叠空白 | 折叠换行 | 自动换行 |
| --- | --- | --- | --- |
| `normal`（默认） | 是 | 是 | 是 |
| `pre` | 否 | 否 | 否 |
| `pre-wrap` | 否 | 否 | 是 |

</v-click>

---

# 长文本换行：CSS 才是主力

`<wbr>` 是「精准点位」补充，成片处理靠 CSS

```css
.text {
  overflow-wrap: break-word;  /* 单词太长时允许词内换行 */
  word-break: break-all;      /* 更激进：任意字符间可断 */
  hyphens: auto;              /* 自动加连字符断词（需配 lang） */
}
```

<v-click>

- `&nbsp;`：不折叠、不可断的空格——让「5&nbsp;MB」不被拆两行
- 实践：正文加 `overflow-wrap: break-word` 兜底，个别长串再用 `<wbr>`

</v-click>

---

# 最佳实践小结

<v-click>

- **先问意思再选标签**：粗 / 斜只是结果，语义才是依据
- 强调四件套：`<em>` 强调 / `<strong>` 重要 / `<b>` 醒目 / `<i>` 异声
- 代码四件套：`<code>` / `<kbd>` / `<samp>` / `<var>` 各司其职
- 链接安全铁律：`target="_blank"` 配 `rel="noopener"`，外链加 `noreferrer`
- 无障碍红线：链接别「点这里」、`<cite>` 别标人名、`<dl>` 别当缩进
- 空白默认折叠：段落永远 `<p>`，长串用 `<wbr>`，长文本靠 CSS

</v-click>

---
layout: center
class: text-center
---

# 谢谢

让每段文字都带上**正确的语义**——屏幕阅读器、搜索引擎、未来的你，都会读懂你的意图

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
