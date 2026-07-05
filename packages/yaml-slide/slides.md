---
theme: seriph
background: https://cover.sli.dev
title: YAML 数据序列化语言
info: |
  Presentation YAML —— 对人类友好的数据序列化语言。

  Learn more at [https://yaml.org](https://yaml.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-7xl font-mono">key:</span>
</div>

<br/>

## YAML —— 对人类友好的数据序列化语言

缩进即层级、配置界的通用语，当前规范 1.2.2（2021 修订）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/yaml" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 YAML —— YAML Ain't Markup Language，一种对人类友好、跨语言、基于 Unicode 的数据序列化语言，当前规范是 1.2.2，2021 年 10 月的修订版，相对 2009 年的 1.2 只做勘误澄清、没有规范性改动。

它围绕映射、序列、标量这三类原生数据结构设计，首要目标就是易于人类阅读，因此成了写配置的首选，k8s、Docker Compose、GitHub Actions、Ansible 全都用它。

今天的顺序：定位 → 选型对比 → 缩进骨架 → 禁 Tab 与冒号空格坑 → 流式写法 → 标量三种引号 → 块标量 | 与 > → chomping → 嵌套 → 复杂键与集合 → 注释与多文档 → 锚点别名 → 合并键 → 类型与 schema → Norway 坑 → 版本差异 → 解析器差异 → 工程场景 → 易错点与安全 → 选型总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# YAML 是什么

一种对人类友好、跨语言的**数据序列化语言**：

<v-clicks>

- 靠**缩进**表达层级，`key: value` / `- item`，无引号括号噪音
- 只描述数据（映射/序列/标量），不带编程能力
- **JSON 的超集**：合法 JSON 基本能被 YAML 1.2 直接解析
- 表达力强：注释、多文档、锚点复用、多行块、显式标签

</v-clicks>

<div v-click class="mt-4 text-sm">

> 全称 YAML Ain't Markup Language（递归缩写，强调面向数据而非标记）；扩展名 `.yaml` / `.yml`。

</div>

<!--
YAML 全称 YAML Ain't Markup Language，是一个递归缩写，通过否定式强调它面向数据、不是标记语言。

它最大的特点是靠缩进表达层级，写映射用 key 冒号空格 value，写列表用短横线，几乎没有 JSON 那种大括号和引号的视觉噪音，非常贴近人类阅读习惯。

它只描述数据，不像脚本那样有循环条件。一个重要事实：YAML 1.2 的设计目标之一是做 JSON 的严格超集，规范明确说 JSON 几乎是 YAML 的完整子集，所以合法 JSON 基本可以直接被 YAML 1.2 解析器解析。

同时它的表达力又远超 JSON：支持注释、多文档、锚点别名复用、多行文本块、显式类型标签，这些都是标准 JSON 没有的。文件扩展名 yaml 或 yml 都行，官方推荐 yaml。
-->

---

# 选型：YAML vs JSON vs TOML

| 维度 | YAML | JSON | TOML |
| --- | --- | --- | --- |
| 定位 | 人类友好配置 | 机器数据交换 | 清晰应用配置 |
| 注释 | ✅ `#` | ❌ | ✅ `#` |
| 复用 | ✅ 锚点/合并键 | ❌ | ❌ |
| 隐式类型坑 | 多 | 少 | 少 |
| 典型场景 | k8s / CI/CD | API / `package.json` | Cargo / pyproject |

<div v-click class="mt-4 text-sm">

> 选型速记：机器传数据要无歧义 → **JSON**；人写复杂配置要注释/复用/多行 → **YAML**；中小应用配置要类型清晰又少坑 → **TOML**。

</div>

<!--
把三种配置格式放一起对比。定位上，YAML 主打人类友好的配置，JSON 主打机器间数据交换，TOML 主打清晰直观的应用配置。

注释方面，YAML 和 TOML 都支持井号注释，JSON 是出了名的不支持注释，这也是它做配置文件时最大的痛点。复用方面只有 YAML 有锚点别名合并键。隐式类型坑 YAML 最多，JSON 和 TOML 因为类型更显式所以坑少。

典型场景：YAML 是 k8s、CI/CD 的标配，JSON 是 API 和 package.json，TOML 是 Rust 的 Cargo 和 Python 的 pyproject。

选型速记一句话：机器间传数据、要严格无歧义选 JSON；人写复杂配置、需要注释复用多行选 YAML；中小型应用配置、想类型清晰又不容易踩坑选 TOML。三者互补，没有绝对优劣。
-->

---

# 基础骨架：缩进、映射、序列

```yaml
name: Alice          # 映射：冒号后必须有空格
server:              # 嵌套映射：子键缩进更深
  host: localhost
  port: 8080
fruits:              # 序列：每个元素 - 开头
  - apple
  - banana
users:               # 序列套映射（k8s/CI 最常见）
  - name: Alice
    role: admin
```

<div v-click class="mt-2 text-sm">

> 缩进即层级：靠前导空格数表达嵌套；同层键对齐到相同列；惯例用 2 个空格。

</div>

<!--
看 YAML 的三大基础结构。映射就是键值对，key 冒号空格 value，注意冒号后那个空格是硬性要求。嵌套映射靠更深的缩进表达从属关系，比如 server 下面缩进两格写 host 和 port。

序列就是列表，每个元素用短横线加空格开头。最常见的复合结构是序列套映射，也就是列表的每个元素是一个对象，短横线和对象的第一个键写在同一行，其余键缩进对齐，k8s 的 containers、CI 的 steps 全是这个结构。

核心心智就一句话：缩进即层级，靠前导空格数表达嵌套，同一层的键必须对齐到相同的缩进列，惯例用 2 个空格。
-->

---

# 两个高频坑：禁 Tab / 冒号空格

<v-clicks>

- **缩进只能用空格，禁止 Tab**——不同系统 Tab 宽度不一致会破坏可移植性，混入 Tab 直接非法
- **冒号后必须有空格**：`key:value`（无空格）会被当成一整个**字符串标量**，而不是键值对

</v-clicks>

```yaml
time: 12:30          # ❌ 想写映射却漏了空格？其实这行是 key=time
url: http://x.com    # ❌ 冒号后有空格但值含 : ，可能歧义
url: "http://x.com"  # ✅ 含特殊字符的值加引号最稳
```

<div v-click class="mt-2 text-sm">

> 写 URL、时间这类含冒号的值时，给整个值加引号避免误解析。

</div>

<!--
两个最高频的坑。第一，缩进只能用空格，绝对禁止 Tab。因为不同系统对 Tab 的显示宽度不一致，用 Tab 会破坏可移植性，YAML 规范直接禁掉了，文件里混入 Tab 缩进会解析报错。

第二，冒号后必须有一个空格。写成 key 冒号 value 没有空格时，YAML 会把整行当成一个字符串标量，而不是键值对，这个坑很隐蔽因为它不报错，只是语义不对。

写 URL、时间这种值里本身带冒号的内容时最容易触发，最稳妥的做法是给整个值加双引号，明确它是一个字符串，避免解析器产生歧义。
-->

---

# 流式写法：借自 JSON

块式靠缩进换行，**流式**用括号写一行，语法与 JSON 一致：

```yaml
# 块式（多行）
fruits:
  - apple
  - banana

# 流式（一行）—— 等价
fruits: [apple, banana]
point: { x: 10, y: 20 }

# JSON 是 YAML 子集，这段合法 JSON 也是合法 YAML
config: { "name": "Alice", "tags": ["a", "b"] }
```

<div v-click class="mt-2 text-sm">

> 块式与流式**语义等价**：长列表/深嵌套用块式易读，短小内容用流式紧凑。

</div>

<!--
YAML 有两种写集合的风格。前面看到的多行缩进写法叫块式。还有一种流式写法，用方括号写序列、花括号写映射，写在一行里，语法和 JSON 完全一样。

比如 fruits 方括号 apple 逗号 banana，等价于块式的两行短横线列表。point 花括号 x 冒号 10 逗号 y 冒号 20，等价于块式的缩进映射。

因为 JSON 是 YAML 1.2 的子集，所以一段合法的 JSON，带双引号带花括号的，直接就是合法的 YAML。

块式和流式语义完全等价，只是排版风格不同：长列表、深嵌套用块式更易读，短小内容用流式更紧凑，按场景选。
-->

---

# 标量：三种引号

```yaml
plain:  hello world           # 普通标量：最简洁
single: 'it''s a "test"'      # 单引号：'' → 一个字面单引号
double: "line1\nline2\ttab"   # 双引号：\n 变真换行
```

<v-clicks>

- **普通 plain**：最简洁，但含 `:` `#` `[` 等特殊字符、或形似其他类型时要加引号
- **单引号**：几乎不转义，按字面；仅 `''` 表示一个字面单引号
- **双引号**：支持完整转义 `\n` `\t` `\"` `\uXXXX`，需要换行/Unicode 时必用

</v-clicks>

<div v-click class="text-sm">

> ⚠️ 单引号里 `\n` 是**两个字面字符**（反斜杠+n），不是换行——写 Windows 路径优先单引号。

</div>

<!--
标量有三种单行引号样式，区别在转义能力。普通标量不加引号最简洁，但当值里含冒号井号方括号这些特殊字符，或者形似布尔数字这类会被类型误判时，就需要加引号。

单引号几乎不做转义，内容按字面保留，唯一的转义是两个连续单引号表示一个字面单引号，双引号在单引号里是原样字符。

双引号支持完整的转义序列，反斜杠 n 换行、反斜杠 t 制表、反斜杠 u 加四位十六进制的 Unicode，需要这些转义时必须用双引号。

一个容易踩的点：单引号里的反斜杠 n 是反斜杠和字母 n 两个字面字符，不是换行符，所以写 Windows 路径、正则表达式时优先用单引号，避免双引号的意外转义。
-->

---

# 块标量：字面 `|` 与折叠 `>`

<div grid="~ cols-2 gap-4">

<div>

**字面块 `|`**：保留换行

```yaml
script: |
  #!/bin/bash
  echo "line 1"
  echo "line 2"
```

值 = 带换行的多行字符串

</div>

<div>

**折叠块 `>`**：换行折叠成空格

```yaml
desc: >
  很长一段话
  换行只为好读
  解析后拼成一段
```

值 = 一整段连续文本

</div>

</div>

<div v-click class="mt-4 text-sm">

> 记忆：`|` 保留换行（所见即所得，写脚本）；`>` 折叠换行为空格（写长段落）。空行→真换行，更深缩进行的换行保留。

</div>

<!--
写多行文本 YAML 有两种块标量。左边竖线，叫字面块，块内所有换行都原样保留，成为字符串的一部分，适合写多行脚本、模板，CI 里写多行 shell 命令几乎都用它。

右边大于号，叫折叠块，块内普通行之间的换行被折叠成一个空格，从而把多行拼成一段连续文本，适合写长段落，源码里换行方便阅读，解析后是一整段。

记忆口诀：竖线保留换行，所见即所得，写脚本用它；大于号折叠换行为空格，写长段落用它。补充两条折叠规则：空行会转成一个真正的换行用于分段，比基准缩进更深的行它的换行会被保留，可以内嵌代码或列表片段。
-->

---

# chomping：控制末尾换行

块标量末尾换行怎么处理，由**削减指示符**控制：

| 指示符 | 名称 | 末尾换行 |
| --- | --- | --- |
| `-`（`\|-`） | strip | 全部删除 |
| 无（`\|`） | clip（默认） | 保留一个 |
| `+`（`\|+`） | keep | 全部保留 |

```yaml
strip: |-
  no trailing newline
keep: |+
  keeps all below

```

<div v-click class="mt-2 text-sm">

> `|-` 拼接命令不留尾换行；默认 clip 保留一个；`|+` 精确保留末尾多空行。还可加缩进数字如 `|2`。

</div>

<!--
块标量末尾往往有换行，YAML 用 chomping 削减指示符控制怎么处理，三种取值。

短横线是 strip，删掉末尾所有换行，一个都不留。不写指示符是默认的 clip，保留单个末尾换行，去掉多余空行，这是最常见的。加号是 keep，保留末尾全部换行，包括结尾的空行。

用法上，竖线短横线常用于拼接命令、不希望结尾多出换行；默认的竖线保留一个收尾换行；竖线加号在需要精确保留末尾多个空行时用。

块标量还能加缩进指示数字，比如竖线 2，在首行本身就有前导空格、自动缩进探测有歧义时，显式指定缩进量。
-->

---

# 嵌套：序列套映射

```yaml
containers:
  - name: web             # - 与首键同行
    image: nginx:latest   # 其余键缩进对齐
    ports:
      - 80                # 映射套序列
      - 443
  - name: db
    image: postgres:16
```

<v-clicks>

- `- ` 后紧跟映射首键，同元素其余键**缩进对齐**
- 同一父节点下**不能**序列 `-` 与映射 `key:` 混用同层

</v-clicks>

<!--
真实配置几乎都是嵌套结构，最常见的是序列套映射，也就是列表的每个元素是一个对象。

看这个 k8s 风格的例子，containers 是个列表，每个元素短横线后紧跟对象的第一个键 name，其余键 image、ports 缩进对齐到 name 的位置。ports 又是映射套序列，它的值是一个短横线列表。

两个要点：短横线后紧跟映射的第一个键，同一个元素的其余键要缩进对齐；还有一条铁律，同一个父节点下面，要么全是短横线序列元素，要么全是键值对映射键，不能一半列表一半键值对混用同层，否则解析会出错。
-->

---

# 复杂键 `?` 与集合 set

<div grid="~ cols-2 gap-4">

<div>

**复杂键**：键本身是复合结构

```yaml
? - Manchester
  - Real Madrid
: 2001-01-01

? |
  多行的
  键
: 对应的值
```

</div>

<div>

**集合 set**：键存在、值 null

```yaml
tags:
  ? backend
  ? critical

# 等价于
tags:
  backend: null
```

</div>

</div>

<div v-click class="mt-4 text-sm">

> 复杂键用 `?` 标记键、`:` 标记值，允许键是序列/多行/映射；日常简单标量键占绝大多数。

</div>

<!--
两个进阶结构。左边是复杂键，当映射的键本身需要是序列、多行文本或映射，而不是简单字符串时，用问号显式标记键、冒号标记值。比如键是一个球队序列、值是日期，或者键是一段多行文本。日常配置里简单标量键占绝大多数，复杂键是键为复合结构时的标准解法。

右边是集合 set，YAML 用键存在、值为 null 的映射来表示一组无重复元素的集合，每个元素用问号标记、省略值，等价于值都是 null 的映射。也有流式写法，花括号里逗号分隔。这两个特性不常用，但遇到了要认得。
-->

---

# 注释与多文档

```yaml
name: Alice   # 行内注释，# 前要有空白
---           # 三个短横线：文档起始（分隔多文档）
kind: Service
---
kind: Deployment
...           # 三个点：文档结束（可选）
```

<v-clicks>

- **注释 `#`**：到行尾；`#` 前需空白；**不能出现在标量内部**；解析后丢弃
- **多文档**：一个文件可含多个 `---` 分隔的文档——k8s 多资源清单靠它
- `...` 表示文档结束但不开启新文档（通信管道常用）

</v-clicks>

<!--
注释用井号，从井号到行尾都是注释。行内注释的井号前必须有空白分隔，而且注释不能出现在标量内部，否则会被当成字符串字符。注释是表现层细节，解析后就丢弃了。

多文档是 YAML 的一个重要特性：一个文件可以包含多个独立文档，用三个短横线分隔。Kubernetes 把多个资源对象，比如 Service 和 Deployment，写进一个清单文件，就是靠这个。文件开头的第一个三短横线可以省略。

三个点表示一个文档结束，但不开启新文档，主要用于通信管道场景。解析多文档时，库通常提供加载全部文档的接口，比如 js-yaml 的 loadAll、PyYAML 的 load_all。
-->

---

# 锚点 `&` 与别名 `*`

```yaml
base: &base          # & 定义锚点
  timeout: 30
  retries: 3

service_a: *base     # * 引用锚点 → 复用整个映射
service_b: *base
```

<v-clicks>

- `&name` 定义锚点（命名节点），`*name` 引用它实现复用
- ⚠️ **别名是引用不是拷贝**：多处 `*base` 通常指向同一份数据
- 作用域限**单个文档**，不能跨 `---`，不能前向引用

</v-clicks>

<!--
锚点和别名是 YAML 消除重复配置的机制。用 and 符号定义锚点，给某个节点起名，比如给 base 这个映射打上 and base 锚点，之后用星号 base 就能引用它，复用整个映射的内容，避免重复书写。

要强调一个关键点：别名是引用，不是深拷贝。多处星号 base 在多数解析器里引用的是同一份数据对象，如果解析后得到的是可变对象，改动一处可能牵连所有引用点，用的时候要意识到这种共享语义。

还有作用域限制：锚点别名的作用域限于单个文档，别名不能跨三短横线分隔的文档引用，也不能前向引用，必须先定义后引用。
-->

---

# 合并键 `<<`：继承 + 覆盖

```yaml
defaults: &defaults
  adapter: postgres
  timeout: 30

production:
  <<: *defaults        # 合并 defaults 的键
  host: db.prod.com    # 追加/覆盖自己的键
```

<v-clicks>

- `<<` 把引用映射的键合并进当前映射，自身键**覆盖**同名合并值
- 优先级：**自身键 > 先出现来源 > 后出现来源**（`<<: [*a, *b]`）
- ⚠️ `<<` **不在 YAML 1.2 规范**（是 1.1 类型）；js-yaml 默认不开，需 `YAML11_SCHEMA`

</v-clicks>

<!--
只用别名是整体复用，没法在复用的同时局部改几个字段。合并键解决这个问题：小于小于把引用映射的键合并进当前映射，当前映射自己写的同名键会覆盖合并进来的值。

看例子，production 用小于小于星号 defaults 继承 defaults 的所有键，然后自己写 host 覆盖掉默认的 host，还能追加新键。最终 production 等价于合并后的完整映射。

优先级规则是：自身显式键最高，多个来源之间靠前的优先于靠后的。

这里有两个重要的坑必须强调。第一，合并键其实不在 YAML 1.2 规范正文里，它是 YAML 1.1 时代定义的语言无关类型，1.2 没正式收录，靠解析器约定支持。第二，具体到 js-yaml，它默认的 core schema 不含合并键，小于小于会被当普通字符串键、合并不生效，需要显式切到 YAML11 schema 才行。如果你发现合并没生效，八成就是这个原因。
-->

---

# 类型推断与三种 schema

不加引号的标量按 **schema 正则**推断类型：

| schema | 类型集合 | 特点 |
| --- | --- | --- |
| Failsafe | map/seq/**str** | 最保守，全当字符串 |
| JSON | +null/bool/int/float | 对齐 JSON，正则严格 |
| **Core** | 同上但放宽正则 | 常用默认，认 `~`/`0o`/`.inf` |

<div v-click class="mt-3 text-sm">

> 同一个 `.5` / `TRUE`：JSON schema 下退化为**字符串**，Core schema 下是 **float / bool**。Core 布尔只认 `true`/`false`，八进制是 `0o`。

</div>

<!--
YAML 对不加引号的标量做隐式类型推断，42 变整数、true 变布尔、波浪号变 null。具体哪些写法被识别成什么类型，取决于用的 schema，也就是一组标签解析规则。

1.2 规范推荐三种，识别类型由少到多。Failsafe 最保守，只有映射、序列、字符串三种类型，任何标量都当字符串，绝不误判。JSON schema 加上 null、布尔、整数、浮点，正则严格，对齐 JSON 字面量。Core schema 类型集合和 JSON 一样但放宽了正则，能识别更多写法，比如波浪号、0o 八进制、点 inf 无穷，这是最常用的默认 schema。

举个例子说明差异：同一个点 5 或大写 TRUE，在 JSON schema 下不匹配严格正则、退化成字符串，在 Core schema 下分别是浮点和布尔。要记住 Core schema 的布尔只认 true 和 false，八进制要用 0o 前缀。
-->

---

# 头号坑：Norway problem

```yaml
countries:
  - GB   # → 字符串 "GB"
  - NO   # → YAML 1.1 里被当布尔 false！
  - SE   # → 字符串 "SE"
```

<v-clicks>

- YAML 1.1 把 `yes`/`no`/`on`/`off`（不分大小写）当布尔 → 挪威代码 `NO` 变 `false`
- YAML 1.2 core 已收紧只认 `true`/`false`，但 PyYAML 等默认仍沿用 1.1
- **解法**：加引号 `"NO"`，或 `!!str` 强制字符串

</v-clicks>

<div v-click class="text-sm">

> 同类：`version: 1.20`→浮点 1.2、邮编 `010010`→丢零、`date: 2026-07-05`→时间戳。形似其他类型的字符串**一律加引号**。

</div>

<!--
YAML 最著名的坑，Norway problem 挪威问题。运维想在配置里列国家代码，写了短横线 NO 表示挪威，结果在某些解析器里 NO 变成了布尔 false。

根源是 YAML 1.1 把 yes、no、on、off 不分大小写都当布尔，所以挪威的国家代码 NO 被解析成 false。YAML 1.2 core schema 已经收紧，只认 true 和 false，NO 是字符串。但很多解析器尤其 PyYAML 默认仍沿用 1.1 行为，所以这个坑至今存在。解法就是给值加引号，或者用双感叹号 str 强制成字符串。

同类的隐式转换坑还有一批：版本号 1.20 不加引号会被当浮点变成 1.2，尾零丢了；邮编 010010 会丢前导零；日期 2026-07-05 可能被当时间戳类型。经验就一条：凡是看着像别的类型、语义上是字符串的值，版本号、邮编、电话、国家代码、纯数字 ID，一律加引号。
-->

---

# 版本差异：1.1 vs 1.2

| 写法 | YAML 1.1 | YAML 1.2 core |
| --- | --- | --- |
| `no` / `yes` / `on` / `off` | 布尔 | **字符串** |
| `010`（前导零） | 八进制 = **8** | 十进制 = **10** |
| 八进制写法 | `010` | `0o10` |
| 合并键 `<<` | 规范内类型 | 未收录（靠约定） |

<div v-click class="mt-4 text-sm">

> 同一份 YAML，类型/数值可能因版本不同而不同。`mode: 010` 在 1.1 是 8、1.2 是 10——处理文件权限时的隐蔽坑。

</div>

<!--
YAML 1.1 和 1.2 在类型解析上有几处关键差异，这是同一份 YAML 不同结果的根源。

第一，no、yes、on、off 在 1.1 里是布尔，1.2 里是字符串，这就是刚才 Norway problem 的根子。第二，前导零 010 在 1.1 里是八进制等于 8，在 1.2 core 里是十进制等于 10，因为 1.2 的八进制改用 0o 前缀了。第三，合并键小于小于在 1.1 是规范内的类型，1.2 没收录、靠约定支持。

这些差异意味着同一份 YAML 文件，里面的类型和数值可能因为解析用的版本不同而不同。举个实际影响：mode 冒号 010，本意可能是文件权限，在 1.1 里是 8，在 1.2 里是 10，这是个很隐蔽的数值坑。
-->

---

# 解析器默认不一致

| 解析器 | 语言 | 默认 | `no` 结果 |
| --- | --- | --- | --- |
| js-yaml | JS | core ≈1.2 | 字符串 `"no"` |
| PyYAML | Python | 近 1.1 | 布尔 `False` |
| ruamel.yaml | Python | 1.2 | 字符串 `"no"` |
| SnakeYAML | Java | 1.1 | 布尔 |

<div v-click class="mt-4 text-sm">

> 前端 js-yaml 写、后端 PyYAML 读，一个没加引号的 `no` 就可能一边字符串一边布尔。**团队规约：布尔只写 `true`/`false`，其余加引号。**

</div>

<!--
即便是同一份 YAML，不同语言的库因为默认 schema 和版本不同，结果可能不一样，这是跨语言协作的暗礁。

看这张表，js-yaml 默认 core schema 接近 1.2，debug 冒号 no 解析成字符串。PyYAML 的 safe_load 默认接近 1.1，同样的 no 解析成布尔 False。Python 的另一个库 ruamel.yaml 默认 1.2，是字符串。Java 的 SnakeYAML 默认 1.1，是布尔。

想象一个场景：前端用 js-yaml 写配置、后端用 PyYAML 读，一个没加引号的 no，前端认为是字符串、后端认为是布尔，就会引发很难排查的 bug。

所以最省心的团队规约是：布尔只写 true 和 false 这两个词，其余所有形似类型的值一律加引号，从源头消除歧义。
-->

---

# 工程场景

<v-clicks>

- **GitHub Actions**：`.github/workflows/*.yml`，`jobs`/`steps` 用序列套映射
- **GitLab CI**：`.gitlab-ci.yml`，锚点 + `<<` 复用 job 配置
- **Kubernetes**：资源清单，`---` 多文档一文件
- **Docker Compose**：`compose.yaml`，`services`/`volumes` 映射
- **Ansible**：Playbook，序列套映射描述 tasks
- **应用配置**：Spring `application.yml`、各类框架 config

</v-clicks>

<div v-click class="mt-4 text-sm">

> YAML 几乎是「配置界的通用语」——DevOps 工具链全都以它作为声明式配置的载体。

</div>

<!--
YAML 在工程里无处不在，过一遍主要场景。

GitHub Actions 的工作流文件放在 .github/workflows 下，jobs 和 steps 都是序列套映射的结构。GitLab CI 的配置文件里大量用锚点加合并键来复用 job 配置，减少重复。Kubernetes 的资源清单用三短横线把多个资源对象写进一个文件。Docker Compose 的 compose.yaml 用 services、volumes 这些映射描述服务。Ansible 的 Playbook 用序列套映射描述一系列 task。还有各类应用配置，比如 Spring 的 application.yml。

可以说 YAML 几乎是配置界的通用语，整个 DevOps 工具链都以它作为声明式配置的载体，这也是学好 YAML 的现实意义。
-->

---

# 易错点与安全

<v-clicks>

- 冒号后漏空格 → 整行变字符串标量
- 用了 Tab 缩进 → 直接非法报错
- `no`/`yes`/`1.20`/`010010` 未加引号 → 隐式类型转换损坏数据
- 合并键 `<<` 没生效 → 解析器 schema 没开 merge
- 别名当拷贝用 → 实为共享引用，改一处牵连多处
- ⚠️ **安全**：`yaml.load` 可实例化任意对象（RCE 风险）→ 用 `safe_load`

</v-clicks>

<!--
汇总一遍最高频的易错点。冒号后漏空格，整行变成字符串标量。用了 Tab 缩进，直接非法报错。no、yes、1.20、010010 这些没加引号，被隐式类型转换损坏数据。合并键小于小于没生效，是因为解析器的 schema 没开 merge。把别名当拷贝用，实际是共享引用，改一处会牵连多处。

最后特别强调安全：某些语言的全功能加载器会根据标签实例化任意对象，解析不受信的 YAML 有远程代码执行风险，最典型的是 Python PyYAML 的 yaml.load，历史上有 RCE 利用。原则是解析任何来源不完全可信的 YAML，一律用安全接口，比如 PyYAML 的 safe_load。能力越大越要收敛攻击面，这和 YAML 表达力强是一体两面。
-->

---
layout: intro
---

# 总结

YAML = **对人类友好的数据序列化语言**（规范 1.2.2）

- 缩进即层级、**禁 Tab**；`key: value`（冒号后空格）/ `- item`
- 五种标量：plain / 单双引号 / 字面块 `|` / 折叠块 `>` + chomping
- 复用：锚点 `&` / 别名 `*` / 合并键 `<<`（不在 1.2 规范）
- **JSON 是 YAML 1.2 的子集**；多文档 `---`；注释 `#`
- 头号坑：Norway（`no`→布尔）、隐式类型、解析器默认不一
- 规约：布尔只写 `true`/`false`、形似类型加引号、`safe_load`

<!--
总结一下。YAML 是一种对人类友好的数据序列化语言，当前规范 1.2.2。

核心心智：缩进即层级、禁用 Tab，映射写 key 冒号空格 value、列表写短横线。标量有五种样式：普通、单双引号、字面块竖线、折叠块大于号，配合 chomping 控制末尾换行。复用靠锚点、别名、合并键，注意合并键不在 1.2 规范、靠解析器约定支持。

要记住 JSON 是 YAML 1.2 的子集，多文档用三短横线分隔，注释用井号。

坑方面，头号是 Norway problem，no 被当布尔，本质是隐式类型推断加上解析器默认版本不一致。

最后是三条团队规约保平安：布尔只写 true 和 false，形似其他类型的值一律加引号，解析不受信输入用 safe_load 安全接口。谢谢大家。
-->
