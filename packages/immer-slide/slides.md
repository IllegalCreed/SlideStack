---
theme: seriph
background: https://cover.sli.dev
title: Immer — Immutable State the Easy Way
info: |
  Presentation Immer — 用「可变写法」安全产出不可变数据。

  Learn more at [https://immerjs.github.io/immer/](https://immerjs.github.io/immer/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🥶</span>
</div>

<br/>

## Immer — 用「可变写法」产出不可变数据

在临时 draft 上随意 mutate，自动生成全新的不可变 state；结构共享、自动冻结、用原生对象，核心仅约 3KB

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/immerjs/immer" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Immer。一句话：用你最熟悉的可变写法,也就是直接赋值、push、delete,去安全地产出不可变数据。

你在一个临时的草稿 draft 上随便改,Immer 记录这些改动,据此生成一个全新的不可变状态,而原状态分毫不动。它的三大关键词:结构共享、自动冻结、用原生对象——不引入任何新数据结构。核心只有约 3KB。

主线:为什么需要不可变 → 手写有多痛 → produce 与 draft → 工作原理 → 结构共享 → 自动冻结 → 返回值规则 → Map/Set 与类 → patches → React/Redux → 性能与取舍 → 总结。版本基线 Immer 11。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么要「不可变」

<v-clicks>

- 不可变 = 永不改原对象，总是造改过的副本
- 收益一：变更检测便宜 —— 引用没变就是没变
- 收益二：克隆便宜 —— 未变部分共享内存
- React / Redux 的 memo 化全靠它

</v-clicks>

<div v-click class="mt-6">

但手写不可变很痛：

- 深层更新要层层浅拷贝，啰嗦
- 漏拷一层就意外共享，埋 bug

</div>

<!--
先说为什么要不可变。不可变的本质是:永远不改原对象,任何修改都生成一份改过的副本。

它带来两个核心收益。第一,变更检测变便宜:只要对象引用没变,就能断定内容没变,用三个等号比较即可,这是 React memo、Redux reselect 的根基。第二,克隆变便宜:未改动的部分可以和旧版本共享内存,不必整棵树重新复制。

但手写不可变很痛苦。深层更新时,你得把改动路径上的每一层都浅拷贝一遍,层级一深就极其啰嗦;而且只要漏拷某一层,就会意外共享对象、埋下难查的 bug。Immer 就是来解决这个痛点的。
-->

---

# 手写 vs Immer

```js
// 不用 Immer：更新第 2 个 todo，再加一个
const next = base.slice()              // 浅拷贝数组
next[1] = { ...next[1], done: true }   // 浅拷贝元素再改
next.push({ title: "Tweet about it" }) // 追加
```

```js
// 用 Immer：直接改 draft
import { produce } from "immer"
const next = produce(base, draft => {
  draft[1].done = true
  draft.push({ title: "Tweet about it" })
})
```

<div v-click class="mt-2 text-sm">

> 同样的不可变结果，Immer 把层层 `...` 的样板代码全消除。

</div>

<!--
直观对比一下。上面是不用 Immer:要更新数组第二个元素的 done,再追加一个,你得先 slice 浅拷贝数组,再用扩展运算符浅拷贝那个元素并改 done,最后 push。每一层都得小心翼翼。

下面是用 Immer:一个 produce,里面直接写 draft 方括号 1 点 done 等于 true,再 draft 点 push。就这么直白,跟写可变代码一模一样。

两者产出的不可变结果完全相同——base 都不变、next 都是结构共享的新状态——但 Immer 把那些层层展开的样板代码全部消除了。这就是它最直接的价值。
-->

---

# produce 与 draft

```js
const base = { user: { name: "Ann", age: 30 }, tags: ["a"] }

const next = produce(base, draft => {
  draft.user.age++      // 深层赋值
  draft.tags.push("b")  // 数组追加
})

base.user.age          // 30  —— 原状态不变
next.user.age          // 31
next.tags === base.tags // false（改过，新引用）
```

<v-clicks>

- `produce(base, recipe)`：recipe 收到 draft
- draft 是 base 的 **Proxy**；配方通常**不用 return**
- **无改动时返回原引用**，便于跳过重渲染

</v-clicks>

<!--
核心 API 就一个:produce,接收基础状态和一个配方函数,配方收到 draft。

看例子:base 里有 user 和 tags。在 produce 里,我直接 draft 点 user 点 age 自增,draft 点 tags 点 push。出来后,base 点 user 点 age 还是 30,原状态分毫不动;next 点 user 点 age 是 31;next 点 tags 和 base 点 tags 三个等号比较是 false,因为改过了,是新引用。

三个要点。第一,produce 第一参是状态、第二参是配方。第二,draft 是 base 的 Proxy 代理,配方通常不需要 return,Immer 自动产出。第三个很重要:如果配方根本没改任何东西,produce 会原样返回传入的 base,同一个引用,这让下游能识别出没变、跳过重渲染。
-->

---

# 它怎么做到的：Proxy

<v-clicks>

1. **建代理**：把 base 包成 Proxy（draft），子对象按需才包
2. **跑配方**：每次写入被 trap 拦截，记录「此节点已改」
3. **终态化**：只复制改动节点，未改子树复用旧引用，再冻结

</v-clicks>

<div v-click class="mt-6 text-sm">

> 关键：**不会一上来就深拷贝**。没碰的节点不代理、不复制——所以又轻又快。

</div>

<!--
Immer 怎么做到的?靠 Proxy,三步走。

第一步,建代理:把 base 包成一个 Proxy,也就是 draft。注意是惰性的,你读到哪个嵌套对象,它才把那个包成 draft,没碰的不包。

第二步,跑配方:你对 draft 的每次写入,都被 Proxy 的 trap 拦截下来,记录「这个节点改了」。

第三步,终态化:配方结束后,Immer 沿着被改动的节点复制出新对象,而未改动的子树直接复用旧引用,最后默认递归冻结结果返回。

最关键的一句:Immer 不会一上来就深拷贝整个对象。你没碰过的节点,既不包代理、也不复制。这就是它既轻量又快的根本原因。
-->

---

# 结构共享：未变即引用不变

```js
const base = { a: { x: 1 }, b: { y: 2 } }
const next = produce(base, draft => {
  draft.a.x = 100   // 只动了 a
})

next       !== base    // 根变了
next.a     !== base.a  // a 改了，新引用
next.b     === base.b  // b 没动，共享引用！
```

<div v-click class="mt-4">

`next.b === base.b` 为真 → React `memo`、`reselect` 可据此**跳过未变部分**。

</div>

<!--
结构共享是 Immer 的灵魂。

看代码:base 有 a 和 b 两个子对象。produce 里我只改了 a 点 x。结果是:next 和 base 不相等,根变了;next 点 a 和 base 点 a 不相等,因为 a 改了,是新引用;但是 next 点 b 和 base 点 b 三个等号比较为真——b 没动,所以共享同一个引用!

这个 next 点 b 等于 base 点 b 为真,意味着什么?意味着 React 的 memo、Redux 的 reselect 这些做引用比较的工具,能据此判定 b 这块没变,从而跳过它的重渲染或重新计算。这就是不可变数据「便宜的变更检测」的具体兑现。
-->

---

# 自动冻结：默认防错

```js
const next = produce({ a: { x: 1 } }, draft => {
  draft.a.x = 2
})

next.a.x = 999  // 严格模式下抛错：read only
```

<v-clicks>

- 默认 **auto-freeze**：产出结果被**递归深冻结**
- 目的：从根上防止配方之外的意外 mutate
- 大且不变的数据：`freeze(data, true)` 预冻结更省
- 关闭：`setAutoFreeze(false)`

</v-clicks>

<!--
Immer 默认会自动冻结。

看例子:produce 产出 next 后,如果你在配方之外写 next 点 a 点 x 等于 999,严格模式下会直接抛错,提示这是只读属性。

四个要点。第一,默认开启 auto-freeze,产出的状态树会被递归深冻结,深层也冻。第二,目的是从根本上防止你在配方之外意外 mutate,破坏不可变性。第三,有个性能注意点:对于很大、而且以后不会再改的数据,每次让 Immer 递归冻结是浪费,可以先用 freeze 加 true 一次性深冻结好再放进状态。第四,如果确实要关,用 setAutoFreeze false,但要谨慎,会丢掉防错保护。
-->

---

# 返回值规则（最易踩坑）

| 写法 | 结果 |
|---|---|
| 改 draft，不 return | ✅ 产出新状态 |
| 不改 draft，`return 新对象` | ✅ 整体替换 |
| `draft = 新对象` | ❌ 无效（重指变量） |
| 改 draft **且** return 新值 | ❌ 抛错 |
| `return undefined` | ⚠️ 当作「没改」 |

<div v-click class="mt-2 text-sm">

要产出 `undefined`，用哨兵：`import { nothing }` → `return nothing`

</div>

<!--
返回值规则是新手最容易踩坑的地方,一张表记牢。

改 draft、不 return,产出改动后的新状态,这是最常用的。不改 draft、return 一个新对象,用它整体替换状态,这也对。

下面是坑。写 draft 等于一个新对象,无效!因为这只是把局部变量 draft 重新指向别处,Immer 完全看不到,改动丢失。既改了 draft、又 return 新值,抛错!因为意图冲突,Immer 不知道你要哪个。还有 return undefined,会被当作「没改动」,而不是把状态变成 undefined。

那如果我真的想把状态产出为 undefined 呢?用 Immer 提供的哨兵值 nothing:import 进来,然后 return nothing,这才明确表示「请产出 undefined」。
-->

---

# Map / Set 与 类

```js
import { enableMapSet, immerable, produce } from "immer"
enableMapSet()  // Map/Set 需先启用！

class Clock {
  [immerable] = true            // 类需标记才可 draft
  constructor(h, m) { this.hour = h; this.minute = m }
}
```

<v-clicks>

- Map/Set 是**可选插件**，忘了 `enableMapSet()` 会报错
- Map 的 **key 永不被 draft 化**（保持引用相等）
- 类需 `[immerable] = true`；**构造函数不会被调用**
- 不支持 DOM Node / Buffer / `Date` 原地改

</v-clicks>

<!--
Map、Set 和类需要特别注意。

先看代码:用 Map 或 Set 之前,必须 import enableMapSet 并在入口调用一次,这是可选插件。类呢,要给它设置方括号 immerable 等于 true,才能被 draft。

四个要点。第一,Map/Set 支持默认是关的,忘了 enableMapSet 就直接 mutate 会报错。第二,Map 的 key 永远不会被 draft 化,这是刻意设计,保证 key 始终引用相等、避免语义混乱,只有 value 会按需被代理。第三,类必须标记 immerable 才可 draft,而且 draft 会保留原型、只复制自有属性,但构造函数不会被调用。第四,DOM 节点、Buffer 这些奇异对象不支持,Date 也不能原地改,要创建新实例替换。
-->

---

# patches：undo/redo 与同步

```js
import { enablePatches, produceWithPatches, applyPatches } from "immer"
enablePatches()

const [next, patches, inverse] = produceWithPatches(
  { age: 33 }, draft => { draft.age++ }
)
// patches:  [{ op: "replace", path: ["age"], value: 34 }]
// inverse:  [{ op: "replace", path: ["age"], value: 33 }]

applyPatches(next, inverse) // 回到 { age: 33 } —— 撤销
```

<v-clicks>

- 先 `enablePatches()`；`path` 是**数组**（非斜杠字符串）
- inverse 做 undo/redo；只传补丁 → WebSocket 增量同步

</v-clicks>

<!--
patches,补丁,是 Immer 的高级能力,用于撤销重做和增量同步。

先要 enablePatches。然后用 produceWithPatches,它返回一个三元组:新状态、正向补丁 patches、反向补丁 inverse。看注释,patches 描述怎么从旧到新,age 替换为 34;inverse 描述怎么从新回旧,age 替换回 33。最后对 next 应用 inverse,就回到了 age 等于 33,这就是撤销。

两个要点。第一,补丁要先 enablePatches 启用,而且它的 path 是数组形式,比如方括号 age,跟标准 JSON Patch 的斜杠字符串不同,互通要转换。第二,反向补丁 inverse 可以做 undo/redo;而因为补丁本身很小,你可以只通过 WebSocket 传补丁、而不是传整个状态,实现跨端增量同步。
-->

---

# React / Redux Toolkit

```js
// React：use-immer
import { useImmer } from "use-immer"
const [state, setState] = useImmer(initial)
setState(draft => { draft.count++ })
```

```js
// Redux Toolkit 内置 Immer，直接 mutate
createSlice({
  name: "counter", initialState: { value: 0 },
  reducers: { inc(state) { state.value++ } },
})
```

<div v-click class="mt-2 text-sm">

> RTK 2.x 内置依赖 immer 11.x，`createSlice` 里直接改 state 即可。

</div>

<!--
Immer 和 React、Redux 生态深度集成。

React 这边,最省事的是 use-immer 这个包:useImmer 返回 state 和 setState,你给 setState 一个配方,里面直接 draft 点 count 自增就行,它把 produce 自动包好了。

Redux Toolkit 更进一步,它内置了 Immer。createSlice 里的 reducer,比如 inc,你直接写 state 点 value 自增——直接 mutate!因为 RTK 在内部用 produce 包裹了每个 case reducer,所以这是安全的不可变更新。

底下这句记住:RTK 2.x 内置依赖 immer 11.x,你不需要单独安装或配置 Immer,createSlice 里直接改 state 就是开箱即用的特性。这也是 RTK 大幅减少样板代码的关键之一。
-->

---

# 性能与取舍

<v-clicks>

- 比手写 reducer 慢约 **2–3 倍**，实践中通常**可忽略**
- 还能因「无改动返回原引用」**省掉重渲染**
- 别把 `produce` 放循环里 → 把循环**收进一次** produce
- v11：array methods 插件、loose iteration 默认提速

</v-clicks>

<div v-click class="mt-4 text-sm">

> 甜区：**深层、局部、频繁**的不可变更新。浅层一次性大改，手写 / `structuredClone` 可能更简单。

</div>

<!--
性能要客观看待。

第一,基于 Proxy 的 Immer,比纯手写 reducer 慢大约 2 到 3 倍,但实践中通常可以忽略。而且它还能因为「无改动时返回原引用」帮你省掉不必要的重渲染,所以整体有时反而更快。

第二,一个常见性能坑:别把 produce 放进循环里逐次调用,那样每个元素都要完整建代理、终态化、冻结一遍;正确做法是把整个循环收进一次 produce。

第三,v11 带来了性能改进:新增可选的 array methods 插件加速数组方法,默认迭代也改成了 loose iteration 更快。

最后讲取舍。Immer 的甜区是深层、局部、频繁的不可变更新。如果你的更新是浅层、一次性、大面积替换,那直接 return 新对象或者用 structuredClone 可能更简单。没有银弹,看更新的形态来选。
-->

---
layout: intro
---

# 总结

Immer = **用可变写法，安全产出不可变数据**

- 核心：`produce(base, draft => { ... })`，draft 是 Proxy
- 结构共享：只复制改动节点，未变即引用不变
- 自动冻结：默认深冻结防错，`setAutoFreeze` 可关
- 坑：`draft = x` 无效、不能「既改又返回」、`nothing` 产 undefined
- 扩展：`enableMapSet` / `enablePatches`；类需 `[immerable]`
- 生态：Redux Toolkit 内置、`use-immer`；约 3KB（v11）

<!--
总结一下。

Immer 一句话:用你最熟悉的可变写法,安全地产出不可变数据。

技术要点:核心就是 produce,base 加一个配方,draft 是 Proxy。结构共享让它只复制改动的节点,未变的部分引用不变,支撑高效的变更检测。默认自动深冻结防止意外修改,需要时用 setAutoFreeze 关闭。

要记住几个坑:draft 等于新对象是无效的;不能既改 draft 又 return 新值;要产出 undefined 得 return nothing。

能力按需扩展:enableMapSet 开 Map/Set,enablePatches 开补丁;自定义类要标记 immerable。生态上 Redux Toolkit 内置 Immer,React 有 use-immer,核心只有约 3KB,当前是 v11。掌握这些,你就能用最少的代码写出最稳的不可变更新。谢谢大家。
-->
