---
theme: seriph
background: https://cover.sli.dev
title: Fuse.js — 轻量模糊搜索
info: |
  Presentation Fuse.js — the lightweight, zero-dependency fuzzy-search library.

  Learn more at [https://www.fusejs.io/](https://www.fusejs.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔍</span>
</div>

<br/>

## Fuse.js — 轻量模糊搜索

零依赖、纯前端可用：`new Fuse(list, options)` + `fuse.search(pattern)`，在内存里做容错匹配。打错字也能搜到，无需后端、无需搜索服务器

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/krisk/Fuse" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Fuse.js,一个零依赖的轻量模糊搜索库。一句话定位:把一份数据数组喂给 new Fuse,再用 fuse.search 做容错的模糊匹配,即使查询词打错一两个字母也能按相关度搜到。

关键是它完全在内存里完成,不需要后端、不需要搜索服务器、不需要外部索引服务。纯 JavaScript,可用在浏览器、Node、Deno。版本基线是 7.x,本仓库锁定 7.4.2。

主线:为什么用它 → 怎么建实例 → 结果与 score → keys 配字段 → threshold 调宽严 → location/distance 位置 → 高亮 → 扩展搜索 → 逻辑搜索 → 动态数据 → 预建索引 → 性能与 Worker → 选型取舍 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用模糊搜索

<v-clicks>

- 精确匹配（`includes`/正则）：打错一个字母就零结果
- 用户输入天然带拼写错误、缩写、近似词
- 上后端搜索引擎太重：要服务、要运维、有延迟
- 很多场景数据量不大，却想要即时搜索

</v-clicks>

<div v-click class="mt-6">

Fuse.js 的回应：

- 容错匹配 → **打错也能搜到**
- 零依赖纯前端 → **即时、零延迟、离线可用**
- 不改数据形态 → **普通数组/对象进出**

</div>

<!--
为什么需要模糊搜索?先看痛点。

第一,精确匹配如 includes 或正则,只能命中字面完全一致的内容,用户打错一个字母就什么都搜不到。第二,真实用户输入天然带拼写错误、缩写、近似词。第三,为这点搜索需求上 Elasticsearch 这类后端引擎太重了,要部署服务、要运维、还有网络延迟。第四,很多场景数据量其实不大,几百到几万条,却仍然想要即时搜索体验。

Fuse.js 的回应:容错匹配,打错也能搜到;零依赖纯前端,即时、零延迟、甚至离线可用;不引入新数据结构,普通数组和对象直接进出。这就是它的定位。
-->

---

# 上手：new Fuse + search

```js
import Fuse from "fuse.js"

const books = [
  { title: "Old Man's War", author: "John Scalzi" },
  { title: "The Lock Artist", author: "Steve Hamilton" },
]

const fuse = new Fuse(books, {
  keys: ["title", "author"], // 对象数组：指定搜哪些字段
})

fuse.search("jon") // 容错命中 author: "John Scalzi"
```

<v-clicks>

- 第一参：数据列表；第二参：配置。**必须用 `new`**（Fuse 是 class）
- 纯字符串数组 **不需要** keys；对象数组 **必须** 配 keys

</v-clicks>

<!--
上手三步。第一,import Fuse。第二,new Fuse,第一个参数是要搜索的数据列表,可以是字符串数组也可以是对象数组,第二个参数是配置。注意必须用 new,Fuse 是一个 class,不带 new 会报错。

第三,调 fuse.search 传查询词。这里搜 jon,虽然拼错了,也能容错命中 author 是 John Scalzi 的那本书。

两个要点:如果数据是纯字符串数组,不需要配 keys,Fuse 直接对字符串匹配;如果是对象数组,必须用 keys 告诉 Fuse 在哪些字段里找,这里是 title 和 author。
-->

---

# 结果结构与 score

```js
const fuse = new Fuse(["apple", "banana"], { includeScore: true })
fuse.search("aple")
// [{ item: "apple", refIndex: 0, score: 0.25 }]
```

| 字段 | 含义 |
|---|---|
| `item` | 命中的原始数据项 |
| `refIndex` | 在原始 list 中的下标（回溯源数据） |
| `score` | 相关度（需 `includeScore`） |

<div v-click class="mt-3 text-sm">

> ⚠️ **score：`0` 完美匹配、`1` 完全不匹配——越小越相关，别讲反！**

</div>

<!--
search 返回结果数组,每项的结构。item 是命中的原始数据项,直接回指你传进去的对象。refIndex 是它在原始 list 里的下标,因为结果会被重排,靠它能回溯到源数据。

默认结果不带分数,要开 includeScore 才有 score 字段。这里搜 aple,命中 apple,分数 0.25。

最重要、也最容易踩的坑在这:score 的方向。0 是完美匹配,1 是完全不匹配,越小越相关。千万别理解成相关度百分比、越大越好——恰恰相反。结果默认就按 score 升序排,最相关的排最前。无匹配时返回的是空数组,不是 null,可以放心 map。
-->

---

# keys：指定搜哪些字段

```js
const fuse = new Fuse(data, {
  keys: [
    "title", // 顶层字段
    "author.firstName", // 嵌套：点号路径
    ["author", "first.name"], // 数组路径（键名含字面点号时必用）
    ["tags", "value"], // 数组内对象的字段
    { name: "title", weight: 0.7 }, // 加权（默认权重 1）
  ],
})
```

<v-clicks>

- 嵌套用 **点号路径**；键名含字面点号改用 **数组路径**
- `{ name, weight }` 给字段加权，weight 越大越重要

</v-clicks>

<!--
keys 是对象搜索的核心,有几种写法,可混用。

顶层字段直接写字段名字符串。嵌套字段用点号路径,比如 author.firstName,Fuse 会逐层取值。

但有个坑:如果键名本身就含字面点号,比如键就叫 first.name,点号会被误拆成两层。这时改用数组路径,把每一层作为数组元素,数组里的点号就不会被拆。搜数组里对象的字段,比如 tags 是个对象数组,也用数组路径 tags、value,Fuse 会遍历数组元素取 value 一起匹配。

最后,字段加权:写成 name、weight 对象,weight 越大该字段命中越重要,没写 weight 的字段默认权重 1。比如让标题比作者更重要。
-->

---

# threshold：控制匹配宽严

```js
new Fuse(list, { keys: ["title"], threshold: 0.3 }) // 更严格
```

| threshold | 效果 |
|---|---|
| `0.0` | 只接受完美匹配（最严格） |
| `0.3` | 较严格，结果少而精 |
| `0.6`（默认） | 偏宽松 |
| `1.0` | 几乎匹配一切 |

<div v-click class="mt-3 text-sm">

> **threshold 越小越严格**。它是 score 上限闸门：score 高于它的结果被丢弃。限制条数用 `search(pattern, { limit })`，别混淆。

</div>

<!--
匹配宽严由 threshold 控制,默认 0.6,范围 0 到 1。它是一个 score 上限闸门:score 高于 threshold 的结果会被直接丢弃。

记忆口诀:threshold 越小越严格。0.0 只接受完美匹配,最苛刻;0.3 较严格,结果少而精,是常见的调严取值;0.6 是默认值,偏宽松;1.0 几乎匹配一切。

调参直觉:结果太多太杂,调小 threshold;该匹配的没匹配上,调大 threshold。

注意别把 threshold 和返回条数搞混:限制条数是用 search 的第二个参数 limit,比如 search 词,limit 10。threshold 改的是匹配的宽严,不是数量上限。
-->

---

# location / distance：位置约束

<v-clicks>

- `location`（默认 `0`）：期望匹配出现在文本的大致位置
- `distance`（默认 `100`）：匹配离 location 多远还能接受
- 默认窗口 ≈ `threshold × distance` = `0.6 × 100` = **60 字符**

</v-clicks>

<div v-click class="mt-4">

```js
const text = ["...fuzzy-search library, with zero dependencies"]
new Fuse(text).search("zero") // 可能搜不到："zero" 在第 62 字符，窗口外
```

</div>

<div v-click class="mt-2 text-sm">

> 长文本里靠后的词常匹配不上——这是默认位置约束导致的。

</div>

<!--
这是 Fuse 最容易让人困惑的地方:默认匹配并非文本任意位置都算。

location 默认 0,表示期望匹配大致出现在文本开头。distance 默认 100,表示匹配实际位置离 location 多远还能接受。两者再配合 threshold,粗略地说,匹配窗口约等于 threshold 乘 distance,默认就是 0.6 乘 100,等于 60 个字符,从位置 0 起算。

看例子:在一段长文本里搜 zero,但 zero 出现在第 62 个字符,落在 60 字符窗口外,默认就搜不到。

所以你会遇到这种现象:短文本搜得好好的,一到长文本、目标词在靠后位置,就匹配不上了。这不是 bug,是默认位置约束。下一页讲怎么解决。
-->

---

# ignoreLocation：放开位置

```js
const text = ["...fuzzy-search library, with zero dependencies"]

new Fuse(text).search("zero") // ❌ 默认带位置约束，搜不到
new Fuse(text, { ignoreLocation: true }).search("zero") // ✅ 命中
```

<v-clicks>

- `ignoreLocation: true`（默认 false）→ 忽略 location/distance，**任意位置可匹配**
- 做整词/子串匹配、不在意位置时，开它最省心
- 比反复调 location/distance 更直接

</v-clicks>

<!--
解决靠后匹配不上的最直接办法:设 ignoreLocation 为 true,默认是 false。开启后,Fuse 忽略 location 和 distance,匹配可以出现在文本任意位置,相关度也不再因为匹配偏离 location 而被惩罚。

还是刚才的例子,开了 ignoreLocation,搜 zero 就能命中了。

经验是:当你做的是整词或子串匹配、并不在意匹配出现在文本哪个位置时,直接开 ignoreLocation,比反复去调 location 和 distance 两个旋钮省心得多。

补充一句:distance 除了限定窗口,还影响位置惩罚力度,distance 越大、偏离的惩罚越轻。所以另一种思路是把 distance 调大,但多数时候 ignoreLocation 更干脆。
-->

---

# 高亮：includeMatches

```js
const fuse = new Fuse(books, { keys: ["title"], includeMatches: true })
const [hit] = fuse.search("artist")

hit.matches
// [{ indices: [[4, 9]], value: "The Lock Artist", key: "title" }]
```

<v-clicks>

- `indices`：命中的 `[start, end]` **闭区间**数组 → 切片包 `<mark>`
- `value`：被命中原文；`key`：命中的字段名
- ⚠️ 闭区间：切片要取到 `end + 1`

</v-clicks>

<!--
要在 UI 上做搜索高亮,开 includeMatches,默认是 false。开启后每条结果带一个 matches 数组。

每个 match 项有三个字段。indices 是命中的字符区间数组,形如 4 到 9,注意是闭区间,含端点。value 是被命中的原文。key 是命中的字段名,多字段搜索时用它判断要在哪个字段上高亮。

实现高亮的做法:遍历 indices,按每个区间把原文切成三段,中间命中的那段用 mark 标签包起来。

最容易错的点:indices 是闭区间,所以 slice 的时候结束位置要取到 end 加 1,否则会少高亮一个字符。
-->

---

# 扩展搜索语法

```js
const fuse = new Fuse(list, { useExtendedSearch: true, keys: ["title"] })
fuse.search("'Man 'Old | Artist$") // 先开 useExtendedSearch
```

| 写法 | 含义 |
|---|---|
| `'python` | 包含匹配 |
| `!ruby` | 不包含（排除） |
| `^java` | 以…开头（前缀） |
| `.js$` | 以…结尾（后缀） |
| `=scheme` | 精确相等 |
| 空格 / `\|` | AND / OR |

<!--
Fuse 还支持 unix 风格的扩展搜索语法,做精细控制。前提是先开 useExtendedSearch,默认是 false,不开的话这些符号只会被当成普通字符。

操作符:单引号前缀,包含匹配,要求精确含这个子串;感叹号前缀,反向,排除含这个词的项;脱字符前缀,前缀匹配,以这个词开头;美元后缀,后缀匹配,以这个词结尾;等号前缀,精确相等,整项完全等于这个词。

组合规则:空格表示 AND,所有词都要满足;竖线表示 OR,任一组满足即可。

看例子:单引号 Man 空格 单引号 Old 竖线 Artist 美元,意思是,含 Man 且含 Old,或者以 Artist 结尾。这样不写代码就能表达复杂的与或查询。
-->

---

# 逻辑搜索：$and / $or

```js
// 同时满足
fuse.search({ $and: [{ author: "abc" }, { title: "xyz" }] })

// 任一满足
fuse.search({ $or: [{ author: "abc" }, { author: "def" }] })

// 键名含字面点号：用 $path + $val
fuse.search({
  $and: [{ $path: ["author", "first.name"], $val: "jon" }],
})
```

<div v-click class="mt-2 text-sm">

> 操作符必须带 `$`；开 `useExtendedSearch` 后，逻辑里的字符串值也按扩展语法解析。

</div>

<!--
除了字符串查询,search 还能收一个逻辑查询对象,用结构化的方式表达多字段条件。

$and,所有子句都满足才命中,比如 author 匹配 abc 且 title 匹配 xyz。$or,任一子句满足即可,比如 author 是 abc 或 def。这比把条件拼成扩展搜索字符串更清晰。

如果字段键名含字面点号,在逻辑搜索里用 $path 加 $val:$path 是路径数组,精确表达每一层;$val 是要匹配的值。这和普通 keys 里用数组路径解决点号是一个思路。

两个注意点:操作符必须带美元符号,写裸的 and、or 是不行的;另外,如果同时开了 useExtendedSearch,逻辑表达式里的字符串值也会按扩展语法解析,可以在逻辑查询里嵌入单引号、感叹号这些操作符。
-->

---

# 动态数据：增删条目

```js
fuse.add(newDoc) // 新增一条
fuse.remove(doc => doc.id === "x") // 按谓词删（返回被删项）
fuse.removeAt(2) // 按下标删
fuse.setCollection(newList) // 整体替换
```

<v-clicks>

- 实例方法会**同步维护内部索引**，无需 new 新实例
- 改某条：先 `removeAt` 再 `add`（没有 `update`）
- ⚠️ 别对实例 `push`/`splice`——数组方法不更新索引

</v-clicks>

<!--
数据运行时会变怎么办?Fuse 实例提供了增删方法,而且会同步维护内部索引,不用每次都 new 一个新实例。

add 新增一条。remove 按谓词删除,返回被删的项数组。removeAt 按下标删除。setCollection 整体替换整个集合。

想改某一条数据,没有 update 方法,做法是先 removeAt 删掉再 add 加回去。

最关键的反模式提醒:千万别直接对实例 push 或 splice。那些是数组方法,不会更新 Fuse 的内部索引,改了也搜不到新数据。一定要用实例的 add、remove 方法。
-->

---

# 预建索引：createIndex

```js
import Fuse from "fuse.js"
const keys = ["title", "author"]

const index = Fuse.createIndex(keys, list) // 预建一次
const fuse = new Fuse(list, { keys }, index) // 作为第三参传入
```

<v-clicks>

- 大数据集避免每次 `new Fuse` 都重建索引
- 可序列化：`index.toJSON()` 导出 → `Fuse.parseIndex(...)` 还原
- 把建索引开销移到**构建期**，运行时直接加载

</v-clicks>

<!--
大数据集里,每次 new Fuse 都要重新建索引,很浪费。可以用 createIndex 预建一次,再把它作为 new Fuse 的第三个参数传进去,这样实例化就不用重建了。

更进一步,索引可以序列化:用 index.toJSON 导出成 JSON,保存下来甚至打包进构建产物;运行时再用 Fuse.parseIndex 把它还原成索引对象。注意还原必须用 parseIndex,不是裸的 JSON.parse。

这样就把建索引的开销从运行时移到了构建期,运行时直接加载现成索引,首屏搜索更快。

一个约束:预建索引用的 keys 和 getFn,必须和构造 Fuse 时一致,否则索引和查询对不上。预建之后仍然可以 add、remove 增量更新。
-->

---

# 性能：别卡主线程

<v-clicks>

- `search` 是**同步 CPU 计算**——大数据集每次按键全量搜会卡 UI
- type-ahead 输入要 **debounce / throttle**
- **复用实例 + 预建索引**（别每次按键 `new Fuse`）
- 大数据集移到 **Web Worker**（官方支持，含 worker 产物）
- `async/await` **不能**把同步计算移出主线程

</v-clicks>

<div v-click class="mt-3 text-sm">

> 还可用 basic 构建（约 6.8KB）替代完整版（约 8.6KB），不需高级特性时更省。

</div>

<!--
性能要点。首先认清一件事:search 是同步的 CPU 计算。大数据集里如果每次按键都全量搜,会卡住 UI。

所以做输入即搜,第一,对输入做 debounce 或 throttle,别每次按键都搜。第二,复用同一个实例并预建索引,最常见的性能反模式就是每次按键都 new 一个 Fuse,反复重建索引。第三,数据真的很大,把搜索移到 Web Worker,官方专门支持,包里就带 worker 构建产物,通过 postMessage 和主线程通信。

特别提醒:仅仅把 search 包成 async await 是没用的,它本质是同步计算,async 不会把它移出主线程,该卡还是卡。

最后,如果不需要扩展搜索、逻辑搜索这些高级特性,可以用 basic 构建,约 6.8KB,比完整版 8.6KB 更小。
-->

---

# 何时用 / 何时不用

| 场景 | 选型 |
|---|---|
| 中小数据集、可全量入内存、要即时搜 | ✅ **Fuse.js** |
| 上千万文档、复杂聚合、分布式 | ❌ 后端引擎（ES） |
| 按语义/近义召回（car→automobile） | ❌ 语义搜索（向量） |
| 容忍拼写错误的关键词搜索 | ✅ **Fuse.js** |

<div v-click class="mt-3 text-sm">

> Fuse 是**词法级**模糊匹配（懂字形、不懂语义）；与语义搜索常**互补**。

</div>

<!--
选型取舍,什么时候该用、什么时候别用。

适合 Fuse 的甜区:数据集中小、能一次性加载进前端内存,几百到几万条,又想要即时、零延迟、零后端的容错搜索。比如站内文档、菜单、标签、命令面板。

不适合的场景:上千万文档、要复杂聚合分析、要分布式检索,这些交给 Elasticsearch 这类后端引擎。

还有一个重要边界:Fuse 是词法级模糊匹配,它懂字形、能容忍拼写错误,但不懂语义。搜 car 不会因为意思相近而召回 automobile,那是语义搜索的活,基于向量嵌入,需要嵌入模型和向量库。

所以容忍拼写错误的关键词搜索用 Fuse;按语义、近义召回用语义搜索。两者解决不同问题,实践中常常互补,比如先语义召回再用 Fuse 做关键词精排。
-->

---
layout: intro
---

# 总结

Fuse.js = **零依赖、纯前端的轻量模糊搜索**

- 上手：`new Fuse(list, options)` + `fuse.search(pattern)`
- 配字段：`keys`（点号/数组路径、`{ name, weight }` 加权）
- 调宽严：`threshold`（默认 0.6，**越小越严格**）
- score：**0 完美、1 不匹配，越小越相关**（别讲反）
- 位置：长文本靠后搜不到 → `ignoreLocation: true`
- 进阶：扩展/逻辑搜索、`includeMatches` 高亮、createIndex、Worker
- 边界：**词法模糊 ≠ 语义搜索**；海量/聚合交给后端

<!--
总结一下。

Fuse.js 是零依赖、纯前端可用的轻量模糊搜索库。

上手就两步:new Fuse 传数据和配置,fuse.search 传查询词。配字段用 keys,支持点号路径、数组路径,以及 name、weight 加权。调匹配宽严用 threshold,默认 0.6,记住越小越严格。

最该记牢的一点:score,0 是完美匹配,1 是完全不匹配,越小越相关,千万别讲反。

位置陷阱:长文本里靠后的词搜不到,开 ignoreLocation 解决。进阶能力有扩展搜索语法、逻辑搜索、includeMatches 做高亮、createIndex 预建索引、Web Worker 不卡主线程。

最后记住边界:Fuse 是词法级模糊匹配,不等于语义搜索;数据量极大、要复杂聚合,交给后端引擎。把这几条记住,就能在对的场景用对 Fuse。谢谢大家。
-->
