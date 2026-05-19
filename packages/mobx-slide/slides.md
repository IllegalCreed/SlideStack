---
theme: seriph
background: https://cover.sli.dev
title: Welcome to MobX
info: |
  Presentation MobX for developers.

  Learn more at [https://mobx.js.org/](https://mobx.js.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">🟠</span>
</div>

<br/>

## MobX — Simple, Scalable State Management

observable + 自动依赖追踪，老牌响应式状态管理库（最新 v6.x + mobx-react-lite 4.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 MobX —— 老牌响应式状态管理库，2015 年由 Michel Weststrate 创立，
和 Redux 同年诞生，但走了完全相反的路线。

Redux 走「函数式 + 不可变 + 显式 dispatch」路线，
MobX 走「响应式 + observable + 自动追踪」路线。
对 Vue / Angular / RxJS 开发者来说，MobX 心智更亲切；
对 React 函数式纯粹派来说，MobX 看起来「太魔法」。

当前主线 mobx 6.15+，配合 mobx-react-lite 4.x（轻量函数式绑定）。
6.x 是一次大重写，去掉了老版本对装饰器的强依赖，
现在 makeObservable / makeAutoObservable 两个工厂函数就能搞定。

GitHub 28K+ star，仍然活跃维护。
和 Redux / Zustand / Jotai 并列为 React 状态管理四大主流方案，
在企业级项目（特别是 Angular 团队转 React、Vue 团队转 React）里仍很常见。

下面按「定位 → 核心原语 → store pattern → React 集成 → 配置 → 测试 → 踩坑」的顺序展开。
-->

---
transition: fade-out
---

# 什么是 MobX？

为 JavaScript 应用提供透明响应式（transparent reactivity）的状态管理库

<v-click>

- **observable 派**：把 state 标记为 observable，读写自动被追踪
- **自动依赖追踪**：computed / autorun / observer 自动订阅它们读取的 observable
- **transparent reactivity**：写代码像操作普通对象，响应式由库内部处理
- **三个核心原语**：observable（状态）+ computed（派生）+ reaction（副作用）
- **零样板代码**：无 action type、无 selector、无 dispatch，直接改属性
- **类友好**：与 OOP 风格无缝结合（也支持 plain object / factory function）
- **多框架**：React（mobx-react-lite）、Vue、Angular 都能用，核心库框架无关

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_The gist of MobX_](https://mobx.js.org/the-gist-of-mobx.html)

</div>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 的定位是「透明响应式的状态管理」——
关键词是 transparent：你写代码看不到「订阅 / 派发」之类的样板，
直接 user.name = "Alice"，订阅者自动重渲。

设计三句话讲清：
- 状态：observable 标记一切需要响应的字段（属性、数组、Map、Set）
- 派生：computed 自动从状态计算，缓存到依赖变化才重算
- 响应：autorun / reaction / observer 自动订阅它们读到的 observable

「自动依赖追踪」是 MobX 的核心黑魔法 ——
不需要手写 selector（Redux）、不需要标记依赖数组（React useMemo），
读哪个就追哪个，写哪个就触发哪个。

zero boilerplate 不是营销话术 —— MobX 的 store 写起来就像普通 class：
属性 = state，getter = computed，方法 = action。
没有 reducer，没有 action type，没有 dispatch，没有 selector。

多框架是 MobX 的另一个特色：核心 mobx 包不依赖 React，
mobx-react-lite 是 React 适配层，
Vue / Angular / Svelte 也都有对应绑定。
-->

---
transition: fade-out
---

# MobX 的定位与生态

老牌响应式派的代表，observable 派 vs flux 派

<v-click>

| 维度          | MobX 6              | Redux Toolkit 2       | Zustand 5             | Jotai 2           | Pinia 3           |
| ------------- | ------------------- | --------------------- | --------------------- | ----------------- | ----------------- |
| 框架绑定      | **多框架**          | React (vanilla 可用)   | React (vanilla 可用)  | React             | Vue 3 官方        |
| API 风格      | **observable / 类** | Slice + Hook          | hook + flux           | atom 原子化       | Composition       |
| 状态模型      | **mutable observable** | immutable slice    | immutable single      | 多 atom           | 多 store          |
| 写法          | **直接改属性**      | dispatch action       | set((s) =&gt; ...)        | setAtom           | store.x = y       |
| 派生          | **computed getter** | reselect / Memo       | 手写 selector         | 派生 atom         | getter            |
| 异步          | flow / async + action | Thunk / RTK Query   | 普通 async            | async atom        | action 内 await   |
| Provider      | 无需                 | 需要                 | 无需                  | 可选              | 需要              |
| 包体积        | ~16 KB              | ~10 KB                | ~1 KB                 | ~3 KB             | ~1.5 KB           |
| TypeScript    | 装饰器 / 工厂        | **完整推导**         | curried 推导          | 优秀（自动）       | 原生推导          |
| DevTools      | MobX DevTools       | **Redux DevTools**    | Redux DevTools        | Jotai DevTools    | Vue DevTools      |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_MobX Concepts_](https://mobx.js.org/the-gist-of-mobx.html)

</div>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 在 React 状态管理生态里属于「另类」——
其他主流方案（Redux / Zustand / Jotai）都是 immutable 派，
只有 MobX 是 mutable observable 派，写法和 Vue / Angular 接近。

护城河三件套：
1. 多框架统一 ——
   - 后端转前端、Vue 转 React、Angular 转 React 的团队不用换状态心智
   - 核心 mobx 包能独立用，业务逻辑不绑死框架
2. observable + 类 ——
   - OOP 风格友好，习惯 class / service 思维的团队心智一致
   - 适合大型业务模型（多个领域 store 各自封装）
3. zero boilerplate ——
   - 写起来像普通 class，没有 action type / reducer / selector
   - 改属性即触发更新，调试时栈追踪直观

对比 Redux：哲学完全相反
- Redux：「单一不可变 store + 显式 action + 时间旅行」
- MobX：「多个可变 observable + 隐式响应 + 直接 mutate」
- Redux 适合「严格审计 + 时间旅行调试」，MobX 适合「快速迭代 + OOP 模型」

对比 Zustand：体积差距大
- Zustand ~1 KB，MobX ~16 KB
- Zustand 是「极简单 store」，MobX 是「完整响应式系统」

对比 Jotai：粒度方向相反
- Jotai 是「原子化（bottom-up）」，状态拆得很细
- MobX 是「store 集中化（top-down）」，按业务域分大 store

什么团队适合 MobX？
- 后端 / Java 出身、习惯 OOP 思维
- Vue / Angular 转 React 的团队
- 大型业务模型 + 强领域驱动 (DDD)
- 不喜欢 Redux 样板代码、又需要比 Zustand 更强结构的项目
-->

---
transition: fade-out
---

# MobX 核心三概念

state → derivations → actions 形成单向数据流

<v-click>

**1. State（状态）**

应用的数据，标记为 observable 即可响应。可以是字段、数组、Map、Set。

```ts
// MobX 把 observable 字段比作「电子表格的单元格」
class Timer { secondsPassed = 0 }
```

</v-click>

<v-click>

**2. Derivations（派生）**

任何能从 state 自动推导出的值，应该被自动推导。分两类：

- **computed**：纯函数派生（getter）—— 像「公式单元格」，有缓存
- **reactions**：副作用（autorun / reaction / observer）—— 像「条件格式」，写日志、调 API、重渲染

</v-click>

<v-click>

**3. Actions（动作）**

修改 state 的代码块。强制要求所有写入在 action 内，让变更可追踪。

</v-click>

<v-click>

> 💡 **核心哲学**："Anything that can be derived from the application state, should be derived. Automatically."

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] State：observable 标记的字段，是响应式系统的「源头」。
MobX 把它比作电子表格的单元格 —— 你输入数字，公式自动重算，图表自动重绘。

可以 observable 的东西非常广：
- 字段（primitive + object + array）
- ES6 Map / Set
- class 实例的属性
- plain object 的属性
- 嵌套对象（默认 deep observable，递归标记）

[click] Derivations 是 MobX 的核心价值 ——
React 里要写 useMemo，Vue 要写 computed，Redux 要写 reselect，
MobX 一律用 computed getter，自动追踪 + 自动缓存。

computed 和 reaction 区别：
- computed 是「值」—— 派生新值，可以被其他 computed/observer 读取
- reaction 是「事件」—— 触发副作用（DOM 更新、网络请求、日志）

经验法则：
- 能用 computed 就别用 reaction（computed 自带缓存 + 自动悬挂）
- reaction 用于「无法返回值的副作用」（fetch、写 localStorage、log）

[click] Actions 是「写入的统一入口」——
默认 strict 模式下，observable 必须在 action 里改，
让所有变更可追踪（DevTools、栈追踪）。

非 strict 模式下也能改 observable，
但建议永远开 strict，让状态变更显式化。

[click] 核心哲学这一句话 ——
"任何能从应用状态派生出来的，都应该自动派生。"
反过来想：如果你在手动同步两个字段（设了 a 又去更新 b），
那 b 就应该是 a 的 computed，让 MobX 自动管理。

这个哲学和 Vue 的 computed、Excel 的公式单元格、RxJS 的 stream 派生一脉相承 ——
全是「正向流：状态 → 派生」，避免「反向同步：派生 → 状态」的混乱。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

接入任意 JS 项目只需一个 import

::left::

<v-click>

**安装**

```bash
# React 项目（最常见）
pnpm add mobx mobx-react-lite

# Vue / Angular / vanilla
pnpm add mobx
```

| 版本   | 状态                       |
| ------ | -------------------------- |
| 6.15+  | **当前主线**（无装饰器依赖）|
| 6.x    | 现代版本，工厂函数 API     |
| 4 / 5  | 老版本，强装饰器依赖       |
| 3.x    | 完全废弃                   |

</v-click>

::right::

<v-click>

**TypeScript 关键配置**

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // 必须 true：class 字段在 makeObservable 前先初始化
    "useDefineForClassFields": true,
    "target": "ES2022",
    "experimentalDecorators": false
  }
}
```

```ts
// 最小可运行示例
import { makeAutoObservable } from "mobx";

class Counter {
  count = 0;
  constructor() {
    makeAutoObservable(this);
  }
  increment() { this.count++ }
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 6 之后包结构非常简单：
- mobx：核心响应式系统（observable / computed / action / reaction）
- mobx-react-lite：函数组件的 observer HOC（React 16.8+）
- mobx-react：老版本含 class 组件 + Provider（React 18 推荐用 lite）

6.15+ 是 2026 年的当前主线版本，
最大特点是「彻底无装饰器依赖」—— makeObservable / makeAutoObservable 工厂函数就够用。

老版本（4/5）强依赖装饰器，导致：
- Vite / esbuild 配置复杂
- TypeScript 装饰器规范换了好几轮（legacy → stage 2 → stage 3）
- 项目迁移成本高
MobX 6 把这些坑全填平，新项目无脑装 6.x。

[click] TypeScript 必须开 useDefineForClassFields: true ——
这是 TS 4.9 后的默认值，但老项目可能还是 false。

原因：MobX 在构造函数里调用 makeObservable(this) 时，
需要 class 字段已经初始化完成（这样能扫描属性、生成 observable）。
useDefineForClassFields: true 让字段在 super() 后立即 define 出来。

false 时字段会在赋值表达式里晚初始化 → makeObservable 扫描不到 → 报错。

最小示例三步走：
1. import { makeAutoObservable } from 'mobx'
2. 在 class 里写普通字段和方法
3. constructor 里调用 makeAutoObservable(this) —— MobX 自动扫描并标记

makeAutoObservable 自动推断：
- 字段 → observable
- getter → computed
- method → action

不需要手动列出每个字段。
-->

---
transition: fade-out
---

# 第一个 observable：makeAutoObservable

最简方式：所有属性自动 observable

<v-click>

```ts
import { makeAutoObservable } from "mobx";

class TodoStore {
  todos: { id: number; text: string; done: boolean }[] = [];
  filter: "all" | "active" | "done" = "all";

  constructor() {
    // 把当前实例的所有字段 / getter / 方法自动标记
    makeAutoObservable(this);
  }

  // 字段 → observable（todos / filter）
  addTodo(text: string) {
    // 方法 → action（自动包装）
    this.todos.push({ id: Date.now(), text, done: false });
  }

  toggle(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;  // 直接 mutate，自动触发更新
  }

  // getter → computed（自动缓存）
  get filtered() {
    if (this.filter === "active") return this.todos.filter((t) => !t.done);
    if (this.filter === "done") return this.todos.filter((t) => t.done);
    return this.todos;
  }
}

export const todoStore = new TodoStore();
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] makeAutoObservable 是 MobX 6 最推荐的入门方式 ——
看代码：和普通 class 几乎没区别，唯一新增的就是 constructor 里一行 makeAutoObservable(this)。

自动推断规则：
- 字段（todos / filter）→ observable.deep（递归 observable）
- 方法（addTodo / toggle）→ action（包装为 action）
- getter（filtered）→ computed（缓存 + 自动追踪依赖）
- arrow function 字段 → action.bound（自动绑定 this）

这就是 MobX「zero boilerplate」的体现 ——
写起来像 Vue / Angular 的 service，
没有 action type，没有 reducer，没有 dispatch。

addTodo 里 this.todos.push(...) 直接 mutate ——
看起来违反「不可变原则」，但 MobX 内部用 Proxy 拦截 push，
自动触发依赖该数组的 reaction / observer 更新。

toggle 里 todo.done = !todo.done 也是直接改字段 ——
todo 对象在 push 进数组时被 deep observable 化，
任何字段改动都被追踪。

[click] 注意事项：
- makeAutoObservable 不能用在有继承关系的 class（基类 / 子类）
- 继承场景必须用 makeObservable（显式标记）
- 排除某些字段不被 observable：makeAutoObservable(this, { rawData: false })

filtered 这个 getter 是 computed ——
filter 或 todos 变化时自动重算，
多次读取 todoStore.filtered 共享同一个缓存结果。

实例化 const todoStore = new TodoStore() 后，
所有组件 import { todoStore } 就能共享同一个 store。
对单例（global store）来说足够了。
-->

---
transition: fade-out
---

# makeObservable：显式标记（继承场景）

需要继承时必须用 makeObservable，手动列出每个字段的类型

<v-click>

```ts
import { makeObservable, observable, action, computed } from "mobx";

class BaseStore {
  loading = false;
  constructor() {
    makeObservable(this, {
      loading: observable,
      setLoading: action,
    });
  }
  setLoading(v: boolean) { this.loading = v }
}

class UserStore extends BaseStore {
  user: { id: number; name: string } | null = null;

  constructor() {
    super();
    // 继承场景：必须用 makeObservable（不能 makeAutoObservable）
    makeObservable(this, {
      user: observable,
      isLoggedIn: computed,
      setUser: action,
      login: action,
    });
  }

  get isLoggedIn() {
    return this.user !== null;
  }

  setUser(user: { id: number; name: string }) { this.user = user }

  async login(id: number) {
    this.setLoading(true);
    const user = await fetch(`/api/users/${id}`).then((r) => r.json());
    this.setUser(user);
    this.setLoading(false);
  }
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] makeObservable 是「显式标记」版本 ——
你要手动列出每个字段、方法、getter 应该被标记为什么。

API：makeObservable(target, annotations, options?)
- target：通常是 this
- annotations：{ 字段名: 注解类型 }
- options：{ name, autoBind, deep, proxy }

可用注解：
- observable（或 observable.deep）：递归 observable，默认
- observable.ref：只追踪引用变化（不深入对象内部）
- observable.shallow：浅 observable（一层）
- observable.struct：结构相等时不触发（避免无效更新）
- action：包装为 action（state 变更）
- action.bound：包装并绑定 this（用作 callback 时）
- computed：标记 getter 为派生缓存值
- computed.struct：结构相等不触发下游
- flow：generator 异步函数
- false：排除（保持普通属性，不 observable）

为什么需要 makeObservable？
- 继承场景：父子类各自有 observable 字段，makeAutoObservable 无法处理
- 自定义注解：某些字段需要 observable.ref / shallow / struct 等特殊语义
- 类型严格：显式列出比自动推断更明确

继承场景的标准模式：
1. 父类 constructor 里 makeObservable(this, { ... })
2. 子类 constructor 里先 super()，再 makeObservable(this, { ... })
3. 子类可以用 override 注解覆盖父类（参见 override 注解）

makeAutoObservable 的限制是设计权衡 ——
父类调用时不知道子类有哪些字段，无法保证完整性。
继承用 makeObservable 是「明确告诉 MobX 每个字段的语义」。

实际项目中：
- 简单 store / factory function → makeAutoObservable
- 有继承 / 需要 ref / shallow 等特殊注解 → makeObservable
- 这两个 API 覆盖 99% 场景，其他工厂（observable() 函数）用得少
-->

---
transition: fade-out
---

# action：写操作的边界

所有 state 变更必须在 action 内

<v-click>

```ts
import { action, makeAutoObservable, runInAction } from "mobx";

class CounterStore {
  count = 0;
  history: number[] = [];

  constructor() {
    makeAutoObservable(this);  // increment / decrement 自动标记为 action
  }

  increment() {
    this.count++;
    this.history.push(this.count);
    // 一个 action 里所有 mutation 合并为单次通知（事务）
  }

  decrement() { this.count-- }
}
```

</v-click>

<v-click>

**外部函数 / 闭包用 action 工厂**

```ts
import { action } from "mobx";

// 包装事件处理器
const handleClick = action((e: MouseEvent) => {
  store.count++;
  store.lastClickX = e.clientX;
});

// 函数式风格
const reset = action("reset counter", () => {
  store.count = 0;
  store.history = [];
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] action 是 MobX 的「事务边界」——
一个 action 内的多次 mutate 会被合并为单次通知，避免中间状态触发多次重渲。

class 写法下，makeAutoObservable 把所有方法自动标记为 action，
不需要手动加 action 注解。

increment 里两步 mutate（count 和 history）：
- 没有 action：每步都触发一次依赖更新，组件可能渲两次
- 有 action：两步合并为一个事务，组件只渲一次（看到最终态）

这就是 action 的事务语义 ——
对应数据库的 transaction，要么全成功要么全回滚（虽然 MobX 不真的回滚）。

[click] 外部函数 / 工具函数用 action 包装：

action(fn) 返回一个新函数，调用时自动进入 action 上下文：
- 事件 handler（onClick / onInput）
- 异步 callback（setTimeout / fetch then）
- 工具函数（reset / clearAll）

action 还有第二种用法：action('name', fn)
- 第一参传字符串作为 name（DevTools 显示用）
- 调试时一眼能看到「reset counter」是哪个 action

为什么要强制 action？
1. 事务性：合并多次 mutate 为一次通知
2. 可调试：DevTools 看到每个 action 的栈轨迹
3. 隔离 side-effect：reaction / autorun 内不应该改 observable

strict 模式下（enforceActions: 'always'），
不在 action 内的 mutate 会报错。
推荐打开 strict 模式让代码更清晰。
-->

---
transition: fade-out
---

# action.bound：作为 callback 传递

避免 `this` 丢失的标准方案

<v-click>

```ts
import { makeObservable, observable, action } from "mobx";

class TimerStore {
  seconds = 0;

  constructor() {
    makeObservable(this, {
      seconds: observable,
      tick: action.bound,  // 自动绑定 this
    });
  }

  tick() {
    this.seconds++;  // 即使作为 callback 传递，this 也是 TimerStore 实例
  }
}

const timer = new TimerStore();
// 直接传方法引用，this 不丢
setInterval(timer.tick, 1000);
```

</v-click>

<v-click>

**makeAutoObservable + 选项**

```ts
class TimerStore {
  seconds = 0;
  constructor() {
    // autoBind: true 让所有 action 都自动 bound
    makeAutoObservable(this, {}, { autoBind: true });
  }
  tick() { this.seconds++ }
}
```

</v-click>

<v-click>

**或者用箭头函数字段（推荐）**

```ts
class TimerStore {
  seconds = 0;
  constructor() { makeAutoObservable(this) }
  tick = () => { this.seconds++ };  // 箭头函数天然 bound
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] this 丢失是 JS 老问题 ——
把方法作为引用传递时，调用现场的 this 会是 undefined（strict mode）。

经典翻车：
- setInterval(store.tick, 1000) → tick 里 this 是 global / undefined
- <button onClick={store.handleClick}> → 同样翻车
- Promise.then(store.onSuccess) → 同样翻车

[click] MobX 三种解法：

方案 1：action.bound 注解
- makeObservable 时把方法标记为 action.bound
- 自动绑定 this，可以作为 callback 传递
- 显式声明，类型友好

方案 2：autoBind 全局选项
- makeAutoObservable(this, {}, { autoBind: true })
- 让所有 action 都自动 bound
- 一处配置，全 class 生效
- 推荐用法（开发体验最好）

方案 3：箭头函数字段（最现代）
- 用 class field syntax 写 tick = () => {...}
- JavaScript 原生绑定 this，不依赖 MobX
- 性能略差（每个实例一份函数，不共享 prototype）
- 类型自动推断

实际项目建议：
- 短期项目 / 个人项目 → 方案 3（箭头函数最直观）
- 长期 / 团队项目 → 方案 2（autoBind 全局生效）
- 库代码 / 严格类型 → 方案 1（显式标注）

注意：箭头函数字段需要 useDefineForClassFields: true，
否则会和 MobX 的 makeAutoObservable 时序冲突。
TypeScript 4.9+ 默认开了这个选项。

性能考虑：
- prototype 方法（action.bound）所有实例共享一份代码
- 箭头函数字段每个实例独立分配
- 在大量实例（>10000）的场景下选 action.bound 更省内存
-->

---
transition: fade-out
---

# computed：派生值

像 Excel 公式单元格，自动缓存 + 按需重算

<v-click>

```ts
import { makeAutoObservable } from "mobx";

class CartStore {
  items: { name: string; price: number; qty: number }[] = [];
  taxRate = 0.1;

  constructor() {
    makeAutoObservable(this);  // 所有 getter 自动 computed
  }

  // 派生：总数
  get totalCount() {
    return this.items.reduce((s, item) => s + item.qty, 0);
  }

  // 派生：小计
  get subtotal() {
    return this.items.reduce((s, item) => s + item.price * item.qty, 0);
  }

  // 派生可以基于其他派生
  get total() {
    return this.subtotal * (1 + this.taxRate);
  }

  addItem(item: { name: string; price: number; qty: number }) {
    this.items.push(item);
  }
}
```

</v-click>

<v-click>

```tsx
// 组件直接读 totalCount / total，computed 自动缓存
<span>Total ({cartStore.totalCount} items): ${cartStore.total}</span>
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] computed 是 MobX 派生系统的核心 ——
对应 Vue 的 computed、Recoil 的 selector、Redux 的 reselect。

makeAutoObservable 自动把 class 的 getter 标记为 computed，
不需要手动加注解。

computed 的关键特性：
1. 自动追踪：读 this.items / this.taxRate 时建立依赖
2. 智能缓存：依赖不变就返回缓存值（不重新执行 getter 函数）
3. 按需求值：没有 observer 订阅时自动挂起（不浪费计算）
4. 链式派生：computed 可以依赖其他 computed（subtotal → total）

[click] 性能对比：
- 没有 computed：组件 100 次重渲 = 100 次 reduce
- 有 computed：items 只变 5 次 = 5 次 reduce（其他 95 次拿缓存）
- 多组件订阅同一 computed：全局只算一次，所有订阅者共享

智能挂起（lazy evaluation）：
- 没有任何 observer 订阅时 computed 不主动算
- 第一个 observer 订阅时立即算并缓存
- 最后一个 observer 退订时挂起（释放内存）
- 这就是为什么 computed 比 reaction 性能好

注意「依赖一定要是 observable」：
- get total() { return this.items.length * 10 } ✅（依赖 observable）
- get rand() { return Math.random() } ❌（无依赖，每次新值，但不会触发更新）
- get now() { return Date.now() } ❌（同上）

需要时间依赖的 computed → 用 IntervalObservable 之类的 utils 包装。

错误模式：
- ❌ 在 computed 里调 API（这是 reaction 的事）
- ❌ 在 computed 里改 observable（应该用 action）
- ❌ 返回新 observable（应该返回纯值）
-->

---
transition: fade-out
---

# autorun / reaction / when：副作用三剑客

自动追踪 observable 并执行副作用

<v-click>

**autorun：跑一次 + 依赖变化时重跑**

```ts
import { autorun } from "mobx";

const dispose = autorun(() => {
  console.log(`Count is ${counterStore.count}`);
});
// 立即跑一次 → 之后 count 变就重跑
dispose();  // 清理订阅
```

</v-click>

<v-click>

**reaction：分离「追踪」和「副作用」**

```ts
import { reaction } from "mobx";

const dispose = reaction(
  () => counterStore.count,                    // tracker：只追这个
  (count, prev) => console.log(`${prev} → ${count}`),  // effect
);
// 不立即跑，count 变化才跑（除非 fireImmediately: true）
```

</v-click>

<v-click>

**when：一次性条件等待**

```ts
import { when } from "mobx";

// callback 形式
when(() => userStore.isLoggedIn, () => router.push("/dashboard"));

// Promise 形式（异步友好）
await when(() => store.dataReady);
console.log("data is ready!");
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] autorun 是 MobX「reaction」的最简形式 ——
传一个函数，函数里读到的所有 observable 都自动订阅，
任意一个变化就重跑这个函数。

签名：autorun(effect, options?)
- effect: (reaction) => void —— 副作用函数
- options:
  - name: 调试名
  - delay: 节流毫秒数（throttle）
  - onError: 错误处理
  - scheduler: 自定义调度器

返回值：dispose 函数 —— 务必在 unmount / cleanup 时调用！
内存泄漏 Top 1 就是忘了 dispose autorun。

何时用 autorun？
- 自动 console.log debugging
- 自动 localStorage 同步：autorun(() => localStorage.setItem('cart', JSON.stringify(store.items)))
- 自动文档标题：autorun(() => document.title = `(${store.count}) Tasks`)

[click] reaction 是「精确版 autorun」——
把「追什么」和「做什么」分开：
- tracker 函数：只追这里读到的 observable
- effect 函数：执行副作用，不参与追踪

签名：reaction(tracker, effect, options?)
- tracker: () => T —— 返回追踪值
- effect: (val, prev, reaction) => void
- options:
  - fireImmediately: 创建时立即跑一次
  - delay: 节流毫秒数
  - equals: 自定义相等比较（默认 ===）

何时用 reaction？
- 想精确控制触发条件（只追某个字段，不被其他变化干扰）
- 需要拿到 prev 值做对比
- effect 里又要读 observable 但不想建立依赖

经典模式：监听单个字段
- autorun(() => log(store.user.name)) —— store.user 整体变化也会触发
- reaction(() => store.user.name, (name) => log(name)) —— 只在 name 变化时触发

[click] when 是「一次性条件 watcher」——
观察某个条件，一旦变成 true 就跑一次 effect，自动 dispose。

两种用法：
1. 回调式：when(predicate, effect, options) —— 传 callback
2. Promise 式：when(predicate, options) → Promise —— 用 await

Promise 式特别适合异步流程：
- await when(() => store.isReady)
- await when(() => store.cart.items.length > 0)
- timeout: when(predicate, { timeout: 5000 }) —— 超时 reject

何时用 when？
- 等待 store 数据 ready 才执行
- 模态框等待用户输入完成
- 引导式 UI 等待某步骤完成

注意：when 是一次性的，触发后自动 dispose。
要长期监听用 reaction / autorun。
-->

---
transition: fade-out
---

# observer：React 集成

mobx-react-lite 让函数组件订阅 observable

<v-click>

```tsx
import { observer } from "mobx-react-lite";
import { counterStore } from "./stores/counter";

// observer 包装：组件自动订阅渲染中读到的 observable
export const Counter = observer(() => {
  return (
    <div>
      <span>Count: {counterStore.count}</span>
      <button onClick={() => counterStore.increment()}>+1</button>
    </div>
  );
});
```

</v-click>

<v-click>

**Observer 组件：局部包装**

```tsx
import { Observer } from "mobx-react-lite";

function Layout() {
  return (
    <div>
      <Header />
      {/* 只让这部分订阅 */}
      <Observer>{() => <span>{counterStore.count}</span>}</Observer>
    </div>
  );
}
```

</v-click>

<v-click>

**useLocalObservable：组件内 store**

```tsx
import { useLocalObservable, observer } from "mobx-react-lite";

const Form = observer(() => {
  const state = useLocalObservable(() => ({
    name: "",
    setName(v: string) { this.name = v },
  }));
  return <input value={state.name} onChange={(e) => state.setName(e.target.value)} />;
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] observer 是 MobX 在 React 的核心 HOC ——
对应 Redux 的 connect、Zustand 的 hook 订阅、Jotai 的 useAtom。

包装后：
- 组件 render 期间读到的 observable 都被订阅
- 任何被读 observable 变化 → 组件重渲
- 组件 unmount 时自动 dispose 订阅

底层用 useSyncExternalStore（React 18+）实现，
完美支持 React Strict Mode、Suspense、Concurrent Features。

observer 自动 memo：
- 内部已用 React.memo 包装，props 浅比较
- 父组件重渲不会无意义传播到 observer 子组件
- 不需要额外 useMemo / useCallback

[click] Observer 组件 vs observer HOC：

observer HOC：包整个组件，render 内全部追踪
Observer 组件：render prop 形式，只追特定区域

何时用 Observer 组件？
- 父组件不是 observer（如 react-router 的 Route children）
- 局部细粒度订阅（避免整个父组件重渲）
- 列表项映射（让每行独立订阅）

[click] useLocalObservable 是「组件内 store」——
对应 useState 的更强力版本：

const state = useLocalObservable(() => ({
  field: initial,
  setField(v) { this.field = v },
  get derived() { return this.field * 2 },
}));

- 函数返回的对象自动 makeAutoObservable
- 字段 → observable，getter → computed，方法 → action
- 组件内独立 state，不跨组件共享
- unmount 时自动清理

何时用 useLocalObservable？
- 表单组件 + 多字段 + 派生（错误信息、validity）
- 复杂交互组件（拖拽、画布、编辑器）
- 不想升级到全局 store 但需要派生 / 自动追踪

何时不用 useLocalObservable？
- 简单 boolean / count → useState 更轻
- 全局状态 → 普通 class store + observer

进阶：useObserver 是更底层的 hook（mobx-react-lite ≥ 3），
现在推荐用 observer HOC 或 Observer 组件，
useObserver 主要给库作者用。
-->

---
transition: fade-out
---

# observer 关键规则：refs 传递

读 observable 字段的时机决定订阅粒度

<v-click>

**❌ 反模式：父组件解构传给子**

```tsx
// 父组件读 store.user.name，子组件已经拿到字符串
const Parent = observer(() => {
  return <Child name={counterStore.user.name} />;  // 名字字符串
});

// 子组件即使是 observer，也无法订阅 user.name（已经是 string）
const Child = ({ name }) => <h1>{name}</h1>;
```

</v-click>

<v-click>

**✅ 正确：传引用，子组件自己 deref**

```tsx
const Parent = observer(() => {
  return <Child user={counterStore.user} />;  // 传整个 user
});

// 子组件 observer 包装后，读 user.name 时建立订阅
const Child = observer(({ user }) => <h1>{user.name}</h1>);
//                ↑ 必须 observer 包装
```

</v-click>

<v-click>

**为什么？**

observer 只追踪「自己 render 期间读到的 observable」。Parent 读了 `name` 字符串，subscribe 的是 Parent；Child 拿到字符串，没办法 subscribe。

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 mobx-react 入坑率最高的概念 ——
「在哪里 deref（解引用）observable 决定了在哪里订阅」。

反模式分析：
- Parent render 期间读 store.user.name → Parent 订阅 user.name
- Child 拿到的是字符串 'Alice'，已经不是 observable
- user.name 变化 → 触发 Parent 重渲 → 重新传给 Child
- 但如果 Parent 还有其他子组件 / 其他逻辑，全部都跟着重渲

性能问题：
- 用户头像更新 → Parent 重渲 → 整个页面所有兄弟节点重渲
- 实际只有 Avatar 那一行需要更新

[click] 正确模式：传 reference + 子组件 observer

- Parent 只引用 store.user 对象（不读字段）
- Parent 不订阅 user.name（除非读了 user.name）
- Child 是 observer，render 期间读 user.name → Child 订阅
- user.name 变化 → 只重渲 Child
- 兄弟节点不受影响

这种「下推 deref」模式是 MobX + React 的标准最佳实践。

[click] 工程化建议：
1. 整个组件树尽量都用 observer 包装（性能开销几乎可以忽略）
2. 父组件传整个对象（user / item / row）给子组件
3. 子组件 observer 包装 + 内部 deref（user.name / item.price）
4. 列表项必须独立 observer 化（List + Item 都 observer）

列表优化经典模式：
```tsx
const TodoList = observer(() => (
  <ul>{store.todos.map(t => <TodoItem key={t.id} todo={t} />)}</ul>
));
const TodoItem = observer(({ todo }) => <li>{todo.text}</li>);
```
TodoList 只订阅 todos 数组的「增删」，
TodoItem 只订阅自己那个 todo 的「字段变化」。
1000 行列表里改一行不会让其他 999 行重渲。

对比 Redux selector：
- Redux：useSelector(s => s.todos[id].text) 每次新建 selector，浅比较
- MobX：observer 自动追踪，零配置

对比 Zustand selector：
- Zustand：useStore(s => s.todos[id].text) 同样需要写 selector
- MobX：直接 deref，无 selector

MobX 的「无 selector」是它最大的开发体验优势之一。
-->

---
transition: fade-out
---

# 异步：flow vs async + runInAction

两种写法，flow 更结构化

<v-click>

**方式 1：async + await + runInAction（标准 ES）**

```ts
import { makeAutoObservable, runInAction } from "mobx";

class UserStore {
  user: User | null = null;
  loading = false;

  constructor() { makeAutoObservable(this) }

  async fetchUser(id: number) {
    this.loading = true;
    const res = await fetch(`/api/users/${id}`);
    const user = await res.json();
    // await 之后是新的执行栈，不在 action 内 → 必须包 runInAction
    runInAction(() => {
      this.user = user;
      this.loading = false;
    });
  }
}
```

</v-click>

<v-click>

**方式 2：flow + generator（MobX 推荐）**

```ts
import { makeAutoObservable, flow } from "mobx";

class UserStore {
  user: User | null = null;
  loading = false;

  // generator function：每个 yield 后自动包装 action
  *fetchUser(id: number) {
    this.loading = true;
    const res = (yield fetch(`/api/users/${id}`)) as Response;
    this.user = (yield res.json()) as User;
    this.loading = false;
  }

  constructor() {
    // makeAutoObservable 自动把 generator 识别为 flow
    makeAutoObservable(this);
  }
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 异步是 MobX 容易踩坑的地方 ——
async/await 后的代码是新的执行栈，不在原 action 上下文内。

方式 1：async + runInAction
- 函数本身是 async，await 之前的代码在 action 内（如果方法被 makeAutoObservable 标为 action）
- await 之后的代码在新栈，必须用 runInAction 包装才能 mutate observable
- 优点：标准 ES 语法，IDE 类型推断好
- 缺点：每次 await 后都要 runInAction，写多了繁琐

实际项目里很多人会忘了包 runInAction：
- strict 模式 → 直接报错（推荐打开）
- 非 strict 模式 → 静默失败，依赖关系混乱

[click] 方式 2：flow + generator
- 用 generator function（function*） + yield 替代 async / await
- MobX 自动把每个 yield 后的恢复点包装为 action
- 不需要手动 runInAction

makeAutoObservable 自动把 generator method 识别为 flow，
不需要显式 flow() 包装。

优势：
- 整个流程都在「action 上下文」内
- 错误处理：try / catch / finally 都能正常工作
- 取消支持：flow 返回的 Promise 有 cancel() 方法
- 嵌套调用：可以 yield 另一个 flow

劣势：
- generator 语法 / yield 不如 await 流行
- TypeScript 推断略麻烦（需要 cast yield 结果）
- 团队成员不熟悉 generator

建议：
- 简单场景（单次 fetch + setState）→ async + runInAction
- 复杂场景（多步骤 + 取消 + 错误处理）→ flow
- 团队偏 OOP / Backend → flow 更结构化
- 团队偏 FP / React 一脉相承 → async + runInAction

cancellation 用法：
```ts
const promise = userStore.fetchUser(1);
promise.cancel();  // 触发 generator 的 return，cleanup
```

对比 Redux Thunk：
- Thunk：async function 接 dispatch / getState，写起来类似 async + runInAction
- flow 自带 cancellation + 自动 action 包装，更 MobX-native

对比 Saga：
- Saga 也是 generator，但理念是「整个应用的副作用通过 saga 集中管理」
- MobX flow 是「每个 store 自己管自己的异步」
- 哲学不同，MobX 更轻量
-->

---
transition: fade-out
---

# Store Pattern：RootStore + 多 Store

大型应用的标准组织结构

<v-click>

```ts
// stores/RootStore.ts
import { UserStore } from "./UserStore";
import { CartStore } from "./CartStore";
import { UiStore } from "./UiStore";

export class RootStore {
  userStore: UserStore;
  cartStore: CartStore;
  uiStore: UiStore;

  constructor() {
    // 互相注入，每个 store 可以拿到 root 引用
    this.userStore = new UserStore(this);
    this.cartStore = new CartStore(this);
    this.uiStore = new UiStore(this);
  }
}
```

</v-click>

<v-click>

```ts
// stores/CartStore.ts
import { makeAutoObservable } from "mobx";
import type { RootStore } from "./RootStore";

export class CartStore {
  items: CartItem[] = [];
  // 持有 root 引用，可以访问其他 store
  constructor(private root: RootStore) {
    makeAutoObservable(this, { root: false });  // 排除 root（避免循环）
  }

  checkout() {
    // 跨 store 调用：cart → user
    if (!this.root.userStore.isLoggedIn) {
      this.root.uiStore.showLoginModal();  // cart → ui
      return;
    }
    // ...
  }
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] RootStore 是 MobX 大型项目的标准模式 ——
对应 Redux 的 combineReducers / Pinia 的多 store 模式。

核心思想：
- 不用全局 singleton
- 一个 RootStore 持有所有 sub-store
- 每个 sub-store 持有 RootStore 引用，可以跨 store 调用
- 整个 app 只创建一次 RootStore 实例

优势：
- 测试友好：每个测试用例创建独立 RootStore
- SSR 友好：每个请求一个 RootStore，无状态泄漏
- 类型完整：跨 store 调用有完整 TS 推断
- 模块化：sub-store 文件按业务领域分

[click] CartStore 拿到 root 后能做什么？
- 读其他 store 的状态：root.userStore.isLoggedIn
- 调其他 store 的 action：root.uiStore.showLoginModal()
- 触发跨业务流程：登录 → 加购物车 → 弹窗

注意点：
- makeAutoObservable 时要排除 root 字段（{ root: false }）
  否则 root 也会被 observable 化，造成循环
- 不要直接 mutate 其他 store 的字段（违反封装）
  应该调用其他 store 的方法
- 跨 store 的 action 链可能复杂，需要文档化

实际项目划分建议：
- 按业务领域：userStore / cartStore / orderStore / productStore
- 按 UI 范围：uiStore（modals / theme / sidebar）
- 按数据来源：apiStore（HTTP cache）
- 不要按数据类型：避免 listStore / formStore 这种过度泛化

React 集成模式：
1. createContext + RootStoreProvider 包裹整个 app
2. 自定义 hook：useStore() → 返回 RootStore
3. 各组件用 useStore().userStore.xxx

```tsx
const StoreContext = createContext<RootStore>(null!);
export const useStore = () => useContext(StoreContext);
export const StoreProvider = ({ children }) => {
  const store = useMemo(() => new RootStore(), []);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
```

热重载 / SSR / 测试都用这套，绝对正确。

对比 Zustand：
- Zustand 也支持多 store，但通常单 store 加 slice 模式
- MobX 一定是多 store + RootStore，OOP 风格更明显

对比 Pinia：
- Pinia 的多 store 是「按定义文件分」，自动注册
- MobX 是「手动 new + 注入」，控制更精细
-->

---
transition: fade-out
---

# React Context + Provider 模式

跨组件树注入 RootStore

<v-click>

```tsx
// stores/StoreContext.tsx
import { createContext, useContext, useMemo } from "react";
import { RootStore } from "./RootStore";

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // useMemo 确保 RootStore 只创建一次
  const store = useMemo(() => new RootStore(), []);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used within StoreProvider");
  return store;
}
```

</v-click>

<v-click>

```tsx
// main.tsx
<StoreProvider>
  <App />
</StoreProvider>

// 任意组件
const Header = observer(() => {
  const { userStore } = useStore();
  return <span>{userStore.user?.name ?? "Guest"}</span>;
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] React Context + Provider 是 MobX 注入 RootStore 的标准方式 ——
对应 react-redux 的 Provider、Jotai 的 Provider。

为什么不用全局 singleton？
- export const store = new RootStore() —— 跨测试用例会共享状态
- SSR：每个请求需要独立 store（用户 A 数据不能漏给用户 B）
- 热重载：模块替换时 store 可能不一致
- 单元测试：mock / 重置困难

Context + useMemo 是黄金方案：
- useMemo([]) 确保整个 app 生命周期内只 new 一次
- React Strict Mode 下也只 new 一次（dev 双调用 useMemo 是缓存的）
- 组件树外完全不可访问，封装彻底

[click] 使用方式：
1. 顶层 main.tsx 用 StoreProvider 包裹 App
2. 任意组件用 useStore() 拿 RootStore
3. 解构出需要的 sub-store
4. 组件 observer 包装，自动订阅

使用模式：
```tsx
const Header = observer(() => {
  const { userStore } = useStore();
  return <span>{userStore.user?.name}</span>;
});
```

更细粒度的 hook 封装：
```ts
export const useUserStore = () => useStore().userStore;
export const useCartStore = () => useStore().cartStore;
```

这样组件里写 const cart = useCartStore() 更简洁。

SSR / Next.js 模式：
- 服务端每个请求创建 RootStore
- 把 RootStore 的初始 state 序列化传给客户端
- 客户端 hydrate 时用同样的初始 state new RootStore
- 之后客户端和服务端独立运行

具体实现见后面 SSR 章节。

测试模式：
```tsx
function renderWithStore(ui: ReactNode, store = new RootStore()) {
  return render(<StoreProvider initialStore={store}>{ui}</StoreProvider>);
}
```
每个测试独立 store，零跨用例污染。
-->

---
transition: fade-out
---

# observable 的三个变体：deep / ref / shallow

控制响应式的深度

<v-click>

```ts
import { observable, makeObservable } from "mobx";

class Store {
  // 1. deep（默认）：递归 observable，对象内部字段也被追踪
  data = { user: { name: "" } };

  // 2. ref：只追引用变化，对象内部字段不追
  hugeReadOnlyData: HugeJSON | null = null;

  // 3. shallow：浅 observable，外层 array/object 追踪，内部不追
  todos: { id: number; text: string }[] = [];

  constructor() {
    makeObservable(this, {
      data: observable,              // deep
      hugeReadOnlyData: observable.ref,  // 只追引用
      todos: observable.shallow,     // 数组 push/splice 追踪，但 item.text 改不追
    });
  }
}
```

</v-click>

<v-click>

**选择规则**

| 注解               | 行为                          | 适用场景                       |
| ------------------ | ----------------------------- | ------------------------------ |
| `observable`       | 递归 observable               | 默认，大多数情况                 |
| `observable.ref`   | 只追引用                      | 大型只读数据、Date、Set/Map 引用 |
| `observable.shallow` | 一层 observable             | 不可变 item 的数组             |
| `observable.struct` | 结构相等不触发               | 频繁更新但结果可能相同的 computed|

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 默认 observable 是深度递归的 ——
data = { user: { name: '' } } 标记 observable 后，
user 对象也被自动 observable 化，user.name 变化能触发更新。

这是默认且方便的行为，但有些场景需要更精细的控制：

[click] observable.ref：只追引用
- 适合大型只读数据（10 万条记录的 JSON）
- 适合不可变结构（Date、Immutable.js List）
- 适合外部库的对象（不想被 observable 化干扰）

举例：
- hugeReadOnlyData = await fetch(...) 拿到的大 JSON
- 你只关心「整体替换」（用户切换数据集），不关心内部字段
- 用 observable 会浪费 Proxy 包装开销
- 用 observable.ref 只在 = 整体赋值时触发更新

observable.shallow：一层 observable
- 适合数组 / 对象本身的增删改要追踪，但 item 不需要追
- 适合 item 是「不可变」的（每次更新都创建新对象）
- 适合性能敏感场景

举例：
- todos = [...] —— push / splice 触发追踪
- 但 todo.text = '...' 不触发（要新建对象再 replace）

observable.struct：结构相等不触发
- 默认 observable 用 === 比较，引用变就触发
- struct 用结构（深比较）比较，结果相同不触发
- 适合 computed 返回对象的场景（避免下游无谓重算）

举例：
- get position() { return { x: this.x, y: this.y } }
- x / y 都没变，但每次返回新对象引用 → 下游 reaction 触发
- 改成 computed.struct 后，对象结构相同不触发

[click] 经验法则：
- 写业务 store → 默认 observable 就够用
- 性能瓶颈分析后再优化 → 用 ref / shallow / struct
- 不要过早优化（observable 的 Proxy 开销比想象小）

观察对象类型：
- observable.box(value)：装单个值（primitive）
- observable.array([])：等价于 observable 数组
- observable.map(new Map())：等价于 observable Map
- observable.set(new Set())：等价于 observable Set

这些工厂函数早期常用，
makeAutoObservable 出现后大部分场景不需要直接调用。
-->

---
transition: fade-out
---

# 装饰器：legacy 与 stage-3

新项目无脑用 makeObservable，老项目还在装饰器

<v-click>

**Legacy 装饰器（旧版 MobX 4/5、TypeScript experimentalDecorators）**

```ts
import { observable, action, computed } from "mobx";

class Store {
  @observable count = 0;
  @computed get double() { return this.count * 2 }
  @action increment() { this.count++ }
}
```

</v-click>

<v-click>

**Stage-3 装饰器（TC39 标准，MobX 6.x 支持）**

```ts
import { observable, action, computed } from "mobx";

class Store {
  @observable accessor count = 0;    // 注意：必须加 accessor 关键字
  @computed get double() { return this.count * 2 }
  @action increment() { this.count++ }
}
```

</v-click>

<v-click>

**推荐方案：makeObservable（无需装饰器）**

```ts
class Store {
  count = 0;
  constructor() {
    makeObservable(this, {
      count: observable,
      double: computed,
      increment: action,
    });
  }
  get double() { return this.count * 2 }
  increment() { this.count++ }
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 装饰器在 MobX 的历史很曲折 ——

MobX 4/5 时代（2017-2020）：
- 重度依赖 legacy 装饰器（TS experimentalDecorators）
- @observable / @computed / @action 写法标准
- 配置 tsconfig "experimentalDecorators": true + "emitDecoratorMetadata": true
- Babel 配置类似

问题：
- TC39 装饰器规范换了好几轮，社区分裂
- Babel 和 TS 实现不一致
- 老项目升级时一片报错
- 工具链（Vite、esbuild、SWC）支持参差

MobX 6（2020+）的策略：
- 主推 makeObservable / makeAutoObservable 工厂函数
- 完全不依赖装饰器
- 装饰器只作为「可选语法糖」
- 解决了配置地狱问题

[click] Stage-3 装饰器（2023 进入 TC39 stage 3）：
- TypeScript 5.0+ 原生支持（不需要 experimentalDecorators）
- 关键区别：字段必须用 accessor 关键字
- `@observable accessor count = 0`
- accessor 让字段有 get/set，装饰器可以拦截

这是 ES 未来的标准，但目前社区还没完全过渡，
工具链支持也在跟进中。

[click] makeObservable 是最稳的选项：
- 不需要任何工具链配置
- 类型推断完整
- 跨工具（TS / Babel / SWC）一致
- MobX 团队官方推荐

唯一缺点：要在 constructor 里写一遍字段名 ——
但这种「显式声明」反而让代码可读性更好。

迁移建议：
- 新项目：直接 makeObservable / makeAutoObservable
- 老 MobX 4/5 项目升级：
  1. 先升到 MobX 6.x
  2. 装饰器先保留（向下兼容）
  3. 逐步换成 makeObservable
  4. 删除 experimentalDecorators 配置

注意：
- MobX 6 不再「依赖」装饰器，但仍然「兼容」装饰器
- 想用 stage-3 装饰器：要确保编译器输出符合规范
- 不确定就用 makeObservable，万年不出错
-->

---
transition: fade-out
---

# configure：strict 模式

让代码更规范、bug 更早暴露

<v-click>

```ts
import { configure } from "mobx";

// app 入口（main.tsx / index.ts）顶部调用
configure({
  enforceActions: "always",          // 所有 mutation 必须在 action 内
  computedRequiresReaction: true,    // computed 必须在 observer 里读
  reactionRequiresObservable: true,  // reaction 必须读到 observable
  observableRequiresReaction: true,  // observable 必须有 observer 订阅
  disableErrorBoundaries: true,      // 不吞错误，方便测试
});
```

</v-click>

<v-click>

| 选项                          | 默认值     | 严格模式建议 |
| ----------------------------- | --------- | ------------ |
| `enforceActions`              | `observed` | `always`     |
| `computedRequiresReaction`    | `false`    | `true`       |
| `observableRequiresReaction`  | `false`    | `true`       |
| `reactionRequiresObservable`  | `false`    | `true`       |
| `disableErrorBoundaries`      | `false`    | `true`（测试）|
| `useProxies`                  | `always`   | 保持默认     |

</v-click>

<v-click>

> 💡 **建议**：开发期开 strict，所有非规范用法立即报错；生产环境保持一致避免行为差异。

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] configure 是 MobX 的「全局严格模式开关」——
对应 React 的 StrictMode、Vue 的 strict mode。

入口文件调用一次，整个 app 生效。

[click] 各选项含义：

enforceActions: 'always'
- 所有 observable 写操作必须在 action 内
- 不在 action 内 mutate → 控制台报错
- 强制「action 是唯一变更入口」的设计模式
- 推荐：always（开发 + 生产都开）

computedRequiresReaction: true
- 在 action / reaction / observer 之外读 computed 时报错
- 防止 computed 被滥用为「随便算算」的纯函数
- 因为 computed 在无订阅者时不缓存，会重复执行
- 推荐：true

observableRequiresReaction: true
- 在 action / reaction / observer 之外读 observable 时警告
- 避免「读了 observable 但没建立追踪关系」的失效模式
- 推荐：true（生产可关闭，避免误报）

reactionRequiresObservable: true
- reaction / autorun 如果没读任何 observable，警告
- 防止「reaction 包装了纯逻辑」的浪费
- 推荐：true

disableErrorBoundaries: true
- 默认 MobX 在 reaction 内捕获错误（防止崩溃）
- 测试 / 调试时把错误捕获关掉，让错误正常抛出
- 推荐：测试环境 true，生产 false

useProxies
- 'always'（默认）：用 Proxy，需要 ES2015 引擎
- 'never'：用 ES5 fallback，兼容老浏览器
- 'ifavailable'：有 Proxy 用 Proxy，没有用 fallback
- 现代项目保持默认即可（IE 11 也支持 Proxy 的 fallback）

[click] strict 模式的价值：
- 团队代码风格统一
- bug 提前暴露（不让错误用法静默失败）
- code review 更轻松（违反 strict 立刻能看到）

实际项目最佳实践：
- main.tsx 顶部 configure(...) 全开
- 全员养成「mutate 必须在 action 内」的习惯
- 单元测试用 strict 模式 + disableErrorBoundaries: true
- 生产构建保持一致设置（避免 dev/prod 行为差异）

补充：
- isolateGlobalState: true 让 MobX 状态隔离（多个 MobX 实例时用，如 micro-frontend）
- safeDescriptors: false 提高性能但禁用某些保护（不推荐改）
-->

---
transition: fade-out
---

# DevTools：mobx-devtools

时间旅行 + 状态可视化 + reaction 追踪

<v-click>

**安装**

```bash
pnpm add -D mobx-react-devtools
# 或 Chrome / Firefox 浏览器扩展：MobX Developer Tools
```

</v-click>

<v-click>

**Action / Reaction Log**

```ts
import { spy } from "mobx";

// 监听所有 MobX 事件（dev only）
if (import.meta.env.DEV) {
  spy((event) => {
    if (event.type === "action") {
      console.log(`[action] ${event.name}`, event.arguments);
    }
  });
}
```

</v-click>

<v-click>

**Trace：定位某 reaction 为什么触发**

```ts
import { trace } from "mobx";

class Store {
  get total() {
    trace();  // 打印当前 computed 的依赖变化追踪
    return this.items.reduce(...);
  }
}

// 或在 observer 内
const View = observer(() => {
  trace(true);  // true = 触发 debugger 断点
  return <div>{store.total}</div>;
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX DevTools 有两种形态：

1. mobx-react-devtools（npm 包）—— 内嵌一个浮窗
2. MobX Developer Tools（浏览器扩展）—— Chrome / Firefox 商店

功能：
- 实时观察所有 observable 的值
- Reaction 触发日志（哪个 observable 变化 → 哪个 reaction 触发）
- Time travel（time-lapse 模式，回放历史）
- 性能 profiling（识别频繁更新的字段）

注意：mobx-react-devtools 主要支持 React，
通用版本（mobx-devtools）适用于所有框架。

生产环境必须 tree-shake / 条件加载 ——
```ts
if (import.meta.env.DEV) {
  import('mobx-react-devtools').then(...);
}
```

[click] spy 是 MobX 的「事件总线」——
所有 action / reaction / computed 的触发都通过 spy 派发。

event.type 可能值：
- 'action'：action 开始 / 结束
- 'reaction'：reaction 触发
- 'compute'：computed 重新计算
- 'create'：observable 创建
- 'update'：observable 更新

可以基于 spy 做：
- 自定义日志（接 Sentry / Datadog）
- 性能监控（每个 action 耗时）
- 调试辅助（filter 特定 action）

性能开销大，仅 dev 启用。

[click] trace 是「单点追踪工具」——
在某个 computed / observer 里调 trace()，
就会打印「这次重新执行是因为哪些依赖变化」。

trace() vs trace(true):
- 不传参：仅打印 console
- 传 true：触发 debugger; 断点（在 DevTools 里断下来）

适用场景：
- 「这个组件为什么又重渲了？」 → trace(true) 看依赖链
- 「为什么 computed 总在重算？」 → trace() 看哪个 observable 在变
- 「reaction 为什么没触发？」 → 检查 tracker 函数返回值

调试技巧：
- 临时加 trace，看完删除（不要 commit）
- 配合 React DevTools 的「why did you render」插件
- VS Code Debug Console 也能用 trace 输出

补充工具：
- getDebugName(observable) → 拿到 MobX 给 observable 起的友好名
- _getAdministration() → 内部 API，能拿到 listeners / dependencies
- Mobx Inspector（社区工具）：可视化依赖图
-->

---
transition: fade-out
---

# TypeScript：完整类型推导

makeAutoObservable 让 TS 推断完美工作

<v-click>

```ts
import { makeAutoObservable } from "mobx";

interface User {
  id: number;
  name: string;
  email: string;
}

class UserStore {
  // 字段类型 = observable 类型
  user: User | null = null;
  loading: boolean = false;
  errors: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // getter 类型 = computed 类型
  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  get displayName(): string {
    return this.user?.name ?? "Anonymous";
  }

  // 方法类型 = action 类型
  setUser(user: User): void {
    this.user = user;
  }

  async fetchUser(id: number): Promise<void> {
    this.loading = true;
    const user = (await fetch(`/api/users/${id}`).then((r) => r.json())) as User;
    runInAction(() => {
      this.user = user;
      this.loading = false;
    });
  }
}

// 实例化后类型完整
const store = new UserStore();
store.isLoggedIn;  // boolean
store.user?.name;  // string | undefined
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 6 + TypeScript 推导非常自然 ——
class 字段类型 = observable 类型，
getter 类型 = computed 类型，
方法类型 = action 类型。

makeAutoObservable 不改变任何 TS 类型，只是运行时把字段标记为 observable。
所以 TS IntelliSense 和普通 class 完全一样。

[click] 关键 TS 配置：
- "strict": true（必须）
- "useDefineForClassFields": true（MobX 6 必须）
- "experimentalDecorators": false（推荐，不依赖装饰器）
- "target": "ES2022"+（支持 class fields）

类型工具：
- IObservableValue&lt;T&gt; → observable.box 的类型
- IObservableArray&lt;T&gt; → observable 数组
- ObservableMap&lt;K, V&gt; → observable Map
- ObservableSet&lt;T&gt; → observable Set

通常用 class 字段就够了，不需要直接用这些工厂类型。

[click] 异步函数的类型：
- async method 自动是 () => Promise&lt;void&gt;
- flow generator method 需要类型 cast：
  ```ts
  *fetchUser(id: number) {
    const user = (yield fetch(...).then(r => r.json())) as User;
    this.user = user;
  }
  ```
- 这是 generator yield 的类型推断限制
- TypeScript 5+ 改善了一些，但仍需要 as 断言

跨 store 类型推导：
```ts
class CartStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this, { root: false });
  }
  doSomething() {
    this.root.userStore.user;  // 完整类型推导
  }
}
```

useStore() hook 类型：
```ts
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("...");
  return store;  // 返回类型自动是 RootStore
}
```

注意 readonly 字段：
- TS 的 readonly 不影响 MobX 的 observable
- private 字段也可以被 makeAutoObservable
- # private fields（ES2022）暂时不被推断
  → 用 TypeScript 的 private 关键字代替

枚举状态推荐用 union type：
```ts
status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
```
比 enum 更轻量，配合 TS narrowing 用起来很爽。

错误：在类型中用 ObservableArray
```ts
items: IObservableArray<Todo>  // ❌ 没必要
items: Todo[]  // ✅ 普通数组类型，MobX 内部转 observable
```
保持业务类型简单，MobX runtime 处理响应式。
-->

---
transition: fade-out
---

# SSR：Next.js / Remix 集成

每个请求一个独立 RootStore，避免数据泄漏

<v-click>

**StoreProvider（Client Component）**

```tsx
"use client";
import { useState } from "react";
import { RootStore, StoreContext } from "./RootStore";

export function StoreProvider({ children, initialData }) {
  // useState 初始化函数确保每个浏览器 mount 一个独立 store
  const [store] = useState(() => {
    const s = new RootStore();
    // 把服务端拉到的数据塞进 store
    s.userStore.hydrate(initialData.user);
    return s;
  });
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
```

</v-click>

<v-click>

**Server Component 拉数据**

```tsx
// app/page.tsx（RSC）
async function Page() {
  const user = await fetchUserFromDB();  // 服务端拉数据
  return (
    <StoreProvider initialData={{ user }}>
      <UserDashboard />
    </StoreProvider>
  );
}
```

</v-click>

<v-click>

**Hydrate 方法**

```ts
class UserStore {
  user: User | null = null;
  constructor() { makeAutoObservable(this) }

  // 用服务端数据初始化
  hydrate(data: User | null) { this.user = data }
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 在 SSR / Next.js 项目里需要解决两个问题：
1. 服务端的 store 状态如何传给客户端？
2. 多请求并发时如何避免 store 互相污染？

第二个问题是 SSR 安全的关键 ——
全局 singleton 在 Node.js 进程里被多请求共享，
用户 A 的 store 数据可能漏给用户 B（严重 bug）。

[click] 标准模式：

1. RootStore 不要 export default new RootStore()
2. 用 Provider + Context 注入
3. 每个浏览器请求一个独立实例（useState init 函数）
4. 服务端拉数据 → 序列化传给客户端 → 客户端 hydrate

useState 初始化函数 vs useMemo：
- useState(() => new RootStore()) ✅ —— 严格保证只创建一次
- useMemo(() => new RootStore(), []) ✅ —— 也只创建一次
- React 18 Strict Mode 下两者都能正确工作

[click] Next.js App Router 完整流程：
1. Server Component 用 await 拉数据（RSC fetch）
2. 数据作为 initialData prop 传给 StoreProvider（Client Component）
3. StoreProvider 在客户端 mount 时 new RootStore + hydrate
4. 子组件用 useStore() 拿到注入的 store

注意点：
- StoreProvider 必须 'use client'（Context 只能在 Client Component 用）
- 数据必须可序列化（不能传 Date 对象、Class 实例 → 转 JSON）
- 复杂数据用 Zod / yup 校验后再 hydrate

服务端不要 import 客户端 store ——
RSC 是「只读 fetcher」，不应该承载状态逻辑。
所有 MobX store 都在客户端运行。

[click] 序列化策略：
- 简单 store → JSON.stringify(store.toJSON())
- 复杂 store → 提供 toJSON() / fromJSON() 静态方法
- Map / Set → 转 Array 序列化

```ts
class UserStore {
  toJSON() {
    return { user: this.user, preferences: this.preferences };
  }
  static fromJSON(data: any) {
    const s = new UserStore();
    Object.assign(s, data);
    return s;
  }
}
```

Pages Router（旧 Next.js）：
- getServerSideProps 里 new RootStore + 拉数据
- store.toJSON() 序列化到 page props
- _app.tsx 里 useState 创建 store + hydrate

注意 React Query / SWR：
- 如果数据层用 RQ，可以让 RQ 管 fetch + cache
- MobX 只管 UI state 和派生
- 两者各司其职，整合方案社区有不少模板
-->

---
transition: fade-out
---

# 测试：MobX store 单元测试

不需要 mock React，直接测 store

<v-click>

```ts
// CartStore.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { CartStore } from "./CartStore";
import { configure } from "mobx";

// 测试期开 strict（在测试 setup 文件）
configure({ enforceActions: "always", disableErrorBoundaries: true });

describe("CartStore", () => {
  let store: CartStore;

  beforeEach(() => {
    // 每个测试独立实例
    store = new CartStore();
  });

  it("adds item", () => {
    store.addItem({ id: 1, name: "Apple", price: 10, qty: 1 });
    expect(store.items.length).toBe(1);
    expect(store.subtotal).toBe(10);
  });

  it("computes total with tax", () => {
    store.addItem({ id: 1, name: "Apple", price: 100, qty: 2 });
    expect(store.subtotal).toBe(200);
    expect(store.total).toBeCloseTo(220);  // 10% tax
  });

  it("clears all items", () => {
    store.addItem({ id: 1, name: "X", price: 1, qty: 1 });
    store.clear();
    expect(store.items.length).toBe(0);
  });
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX store 的测试比 Redux 简单很多 ——
不需要 mock dispatch，不需要 mock middleware，
直接 new Store + 调方法 + 断言字段。

测试结构：
1. beforeEach 创建独立实例 → 零跨测试污染
2. 调用 action 方法 → 触发 mutation
3. 断言字段 / computed 的值 → 验证结果

为什么 MobX 测试这么直接？
- store 就是普通 class，可以独立实例化
- action 是普通方法，直接调用
- computed 是普通 getter，直接读取
- 不需要 React，不需要 Provider，不需要 dom

测试期 strict 配置：
- enforceActions: 'always' → 验证所有写操作都在 action 内
- disableErrorBoundaries: true → 让错误正常抛出（默认会被 MobX 吞）
- 推荐放在 vitest.setup.ts / jest.setup.js

[click] 异步测试：
```ts
it('fetches user', async () => {
  await store.fetchUser(1);
  expect(store.user).toMatchObject({ id: 1, name: 'Alice' });
});
```

mock fetch 用 MSW / vi.fn()：
```ts
import { vi } from 'vitest';
global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({ id: 1, name: 'Alice' }),
} as any));
```

reaction 测试：
- 不能简单断言「componentXXX 是否重渲」
- 而是断言「state 变化后另一个字段是否同步变化」
- 或者用 spy / mock callback 验证 effect

React 组件测试（@testing-library/react）：
```tsx
test('Counter increments', async () => {
  const store = new CounterStore();
  const { getByRole } = render(
    <StoreContext.Provider value={store}>
      <Counter />
    </StoreContext.Provider>
  );
  await userEvent.click(getByRole('button'));
  expect(store.count).toBe(1);
  expect(getByRole('button')).toHaveTextContent('1');
});
```

双重断言：
- store.count === 1（state 层）
- DOM 文本 '1'（UI 层）
- 比 Redux 测试更直接

跨 store 测试：
```ts
beforeEach(() => {
  root = new RootStore();  // 一次创建所有 sub-store
});

it('checkout requires login', () => {
  root.cartStore.addItem(...);
  root.cartStore.checkout();
  expect(root.uiStore.showingLoginModal).toBe(true);
});
```

时间相关测试：
- vi.useFakeTimers() / jest.useFakeTimers()
- 配合 setTimeout / setInterval 内的 action
- runInAction 内的 mutate 会立即生效，不受 fake timer 影响
-->

---
transition: fade-out
---

# 生态对比：vs Redux / Zustand / Jotai

何时选 MobX

<v-click>

**vs Redux**

- Redux：immutable + 单一 store + 显式 action + 时间旅行
- MobX：mutable observable + 多 store + 直接 mutate + 响应式自动追踪
- **选 MobX 当**：团队偏 OOP / 不喜欢样板代码 / 需要 Vue-like 心智

</v-click>

<v-click>

**vs Zustand**

- Zustand：~1 KB + hook-only + immutable + 极简
- MobX：~16 KB + 多框架 + observable + 完整 OOP 模型
- **选 MobX 当**：大型业务模型 / 多领域 store / class 风格组织

</v-click>

<v-click>

**vs Jotai**

- Jotai：原子化（多 atom）+ React-only + 派生自动追踪
- MobX：店化（多 store）+ 多框架 + observable 派
- **选 MobX 当**：业务模型清晰 / 不需要 Suspense 集成 / 已用 OOP

</v-click>

<v-click>

**vs Pinia**

- Pinia：Vue 官方 + Composition + 自动追踪
- MobX：跨框架 + 类 / 工厂 + observable
- **MobX 在 Vue 里也可用**，但 Pinia 是 Vue 第一选择

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vs Redux：两个完全相反的哲学

Redux 优势：
- 时间旅行调试（DevTools 最强）
- 严格规范，大团队 code review 友好
- 不可变数据流，可预测性极强
- 生态完整（Redux Toolkit + RTK Query）

MobX 优势：
- 零样板（无 action type / dispatch / selector）
- 响应式心智（写起来像 Vue）
- 直接 mutate（不需要 spread / Immer）
- 多框架（React / Vue / Angular）

选型逻辑：
- 大型 React 项目 + 强规范要求 → Redux
- 中型项目 + OOP 团队 → MobX
- 新项目 + 快速迭代 → MobX 写起来更爽

[click] vs Zustand：体积和复杂度的取舍

Zustand 优势：
- 极小体积（1 KB）
- 极简 API（一个 create 函数）
- React-first，hook 集成完美
- 学习曲线最短

MobX 优势：
- 完整响应式系统
- 自动派生（computed）
- OOP 风格组织（class store）
- 多框架支持

选型：
- 小 / 中项目 + 简单状态 → Zustand
- 大项目 + 复杂业务模型 → MobX
- 团队倾向函数式 → Zustand
- 团队倾向 OOP → MobX

[click] vs Jotai：粒度方向相反

Jotai 优势：
- 极致细粒度（每个 atom 独立订阅）
- Suspense 深度集成
- 派生 atom 自动追踪
- bottom-up 组合

MobX 优势：
- 集中式 store（领域驱动）
- OOP 友好
- 不依赖 Suspense（兼容老 React）
- 跨框架

选型：
- 大量独立小状态 + 派生 → Jotai
- 业务模型清晰 + 强封装 → MobX
- React 18+ + Suspense → Jotai
- 跨框架 / OOP 团队 → MobX

[click] vs Pinia：Vue 生态对位

Pinia 是 Vue 3 官方状态管理，
和 MobX 哲学相近（响应式 + 自动追踪 + store-based），
所以 Vue 项目里 Pinia 是默认选择，
MobX 在 Vue 里能用但不是主流。

但反过来：React 项目里没有「官方钦定」状态管理，
MobX 在 React 里和 Redux / Zustand / Jotai 并列竞争。

混用场景：
- Web 框架：用各自原生（Vue → Pinia、React → MobX）
- 跨框架共享逻辑：可以用 MobX 写纯 JS 业务层 + 各框架的绑定
- Mobile（React Native）：MobX 也能用，体验和 web 一致

[click] 终极选型决策树：
1. 已有项目用啥继续用啥
2. 新项目 + 简单 → Zustand
3. 新项目 + 复杂 + React → Redux Toolkit 或 MobX
4. 新项目 + 跨框架 → MobX
5. 新项目 + 大量原子状态 → Jotai
6. 团队习惯 OOP / Java / C# → MobX
7. 团队偏 FP / Haskell → Redux 或 Jotai
-->

---
transition: fade-out
---

# 完整实战：购物车 Store

observable + computed + action + persist

<v-click>

```ts
import { makeAutoObservable, reaction } from "mobx";

type CartItem = { id: number; name: string; price: number; qty: number };

export class CartStore {
  items: CartItem[] = [];
  taxRate = 0.1;

  constructor() {
    makeAutoObservable(this);

    // localStorage 持久化（autorun 风格）
    const saved = localStorage.getItem("cart");
    if (saved) this.items = JSON.parse(saved);

    reaction(
      () => JSON.stringify(this.items),
      (json) => localStorage.setItem("cart", json),
    );
  }

  // computed：总数量
  get count() { return this.items.reduce((s, i) => s + i.qty, 0) }

  // computed：小计 / 税 / 总价
  get subtotal() { return this.items.reduce((s, i) => s + i.price * i.qty, 0) }
  get tax() { return this.subtotal * this.taxRate }
  get total() { return this.subtotal + this.tax }

  // action：增加（已存在则 +1）
  add(item: Omit<CartItem, "qty">) {
    const existing = this.items.find((i) => i.id === item.id);
    if (existing) existing.qty++;
    else this.items.push({ ...item, qty: 1 });
  }

  // action：减少 / 删除
  remove(id: number) { this.items = this.items.filter((i) => i.id !== id) }

  // action：清空
  clear() { this.items = [] }
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个完整的购物车 store 涵盖 MobX 所有重要 pattern ——

1. observable 字段：items / taxRate
2. computed getter：count / subtotal / tax / total（自动派生 + 缓存）
3. action method：add / remove / clear（事务性 mutation）
4. reaction：自动持久化到 localStorage

文件结构：
- stores/CartStore.ts（单文件包含完整购物车逻辑）
- 组件 import { useStore } 拿到 cart
- 不到 40 行代码，承载完整电商功能

对比 Redux 实现需要：
- cart-slice.ts（slice）
- cart-actions.ts（action creators）
- cart-selectors.ts（reselect）
- middleware 或 listener（persist）
- store.ts 注册
总代码量 100+ 行，4-5 个文件。

MobX 直接 mutate 写法的优势：
- existing.qty++ —— 直接改属性
- this.items.push(...) —— 直接 push
- this.items = this.items.filter(...) —— 整体替换也行
- 自动触发所有订阅者更新

reaction 自动持久化：
- 读 items 建立追踪
- items 任意变化 → 自动重新 setItem
- JSON.stringify 比较保证只在内容变化时写（避免引用变化触发）

实战进阶（未在示例展示）：
- async fetchProducts() —— 拉取商品列表
- async submit() —— 提交订单
- 跨 store 调用：root.userStore.user / root.uiStore.showToast()
- 错误处理：try/catch + 设置 error 字段
- loading 状态：loading: boolean + setLoading action

组件使用：
```tsx
const Cart = observer(() => {
  const { cartStore: cart } = useStore();
  return (
    <div>
      <span>Total: ${cart.total.toFixed(2)}</span>
      <button onClick={() => cart.clear()}>Clear</button>
      {cart.items.map((item) => (
        <CartRow key={item.id} item={item} />
      ))}
    </div>
  );
});
```

CartRow 也用 observer，订阅 item 字段。
列表性能优化：只重渲变化的行。
-->

---
transition: fade-out
---

# 常见踩坑（一）：非 action 内 mutate

最常见的入门错误

<v-click>

**❌ 错误：在 setTimeout / fetch callback 内直接 mutate**

```ts
class Store {
  count = 0;
  constructor() { makeAutoObservable(this) }

  delayedIncrement() {
    setTimeout(() => {
      this.count++;  // ❌ 在 callback 内，已经脱离 action 上下文
      // strict 模式下会报错：mutating state outside of an action
    }, 1000);
  }
}
```

</v-click>

<v-click>

**✅ 方案 1：runInAction**

```ts
delayedIncrement() {
  setTimeout(() => {
    runInAction(() => {
      this.count++;  // ✅ 显式标记为 action
    });
  }, 1000);
}
```

</v-click>

<v-click>

**✅ 方案 2：把 callback 本身用 action 包装**

```ts
delayedIncrement() {
  setTimeout(action(() => {
    this.count++;  // ✅ callback 本身是 action
  }), 1000);
}
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 MobX 入门踩坑率 Top 1 ——
makeAutoObservable 把方法标记为 action，
但方法内部的 callback（setTimeout / Promise.then / addEventListener）
不再继承 action 上下文。

为什么？
- action 上下文是基于「同步执行栈」追踪的
- callback 是异步执行栈，已经脱离原 action
- MobX 无法自动延续到所有 callback

strict 模式（enforceActions: 'always'）会报错：
"[MobX] Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed."

非 strict 模式静默成功，但：
- 多次 mutate 不能合并通知（每次单独触发）
- DevTools 看不到这个变更归属哪个 action
- 依赖追踪可能错乱

[click] 方案 1：runInAction
- 一次性 action，立即执行
- 适合 callback 内多步 mutate（合并通知）
- 写法直观，团队接受度高

[click] 方案 2：action 包装 callback
- 把 callback 本身变成 action
- 适合 callback 单次 mutate
- 函数式风格

何时用哪个？
- 单次 mutate → action(cb)
- 多次 mutate（事务）→ runInAction
- 多个嵌套 callback → 每层都包

async / await 场景：
- await 之前的代码在 action 内
- await 之后是新栈 → runInAction
- flow generator 自动包装每个 yield 后的恢复点

事件 handler 场景：
```tsx
<button onClick={action(() => store.increment())} />
// 或更优雅：方法已经是 action.bound
<button onClick={store.increment} />
```

DOM 事件 / IndexedDB / WebSocket 同样要包：
- ws.onmessage = action((e) => { store.messages.push(e.data) })
- db.onsuccess = action(() => { store.ready = true })

第三方库回调也要包：
- IntersectionObserver、ResizeObserver 等

记忆口诀：「同步直接改，异步包 action」
任何脱离当前同步栈的 callback 都要重新进 action 上下文。
-->

---
transition: fade-out
---

# 常见踩坑（二）：observer 闭包陷阱

解构 observable 后失去追踪

<v-click>

**❌ 错误：组件外 / 顶层解构**

```tsx
const { user } = store;  // 模块顶层解构

const Header = observer(() => {
  return <span>{user.name}</span>;  // 用的是「快照」，store.user 变化不会触发更新
});
```

</v-click>

<v-click>

**❌ 错误：组件内但 render 外解构**

```tsx
const Header = observer(() => {
  const user = store.user;  // ✅ 这里 ok，render 函数内

  // ❌ 但这个 callback 在 mount 时执行一次，不会再追踪 user 变化
  useEffect(() => {
    console.log(user.name);  // 永远是 mount 时的 name
  }, []);

  return <span>{user.name}</span>;
});
```

</v-click>

<v-click>

**✅ 正确：render 内 deref + observer 包装**

```tsx
const Header = observer(() => {
  // 直接在 render 期间读取，建立追踪
  return <span>{store.user.name}</span>;
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] observer 闭包陷阱是 mobx-react 进阶踩坑 ——
不在 observer 的 render 函数同步执行栈内读取 observable，就不会建立追踪。

[click] 错误模式 1：模块顶层解构
- const { user } = store —— 模块加载时执行一次
- 拿到的是「mount 时的 user 引用」
- 之后 store.user = newUser 不会更新这个 user 引用
- 组件渲染时用 user.name —— 永远显示旧用户名

[click] 错误模式 2：组件内但脱离 render 同步栈
- useEffect / useCallback / useMemo 内读 observable
- 这些 hook 的 callback 在不同时机执行
- observer 的「追踪期」只持续同步 render 那段
- 异步 callback 内读不到也不追

为什么？
- observer 内部用 reaction 包装 render
- reaction 只追踪「同步执行期间读的 observable」
- useEffect 是 React 调度的异步阶段，不在 reaction 范围内

[click] 正确做法：

1. 直接在 render 期间读：
   ```tsx
   return <span>{store.user.name}</span>;
   ```

2. 在 useEffect 内主动重新订阅（如果真的需要 effect）：
   ```tsx
   useEffect(() => {
     const dispose = autorun(() => {
       console.log(store.user.name);  // 这里建立独立追踪
     });
     return dispose;
   }, []);
   ```

3. 把数据传给子组件，子组件 observer 包装：
   ```tsx
   const Header = observer(() => <UserName user={store.user} />);
   const UserName = observer(({ user }) => <span>{user.name}</span>);
   ```

useEffect + observable 的标准模式：
- 用 reaction 而不是 useEffect 来响应 observable 变化
- 或者 useEffect 内调 autorun + 返回 dispose

经验：
- 优先用 observer 自动追踪
- 必要时用 reaction（精确控制）
- 不要在 useEffect 依赖数组里写 observable.field（无法被 deps 检测）

另一个相关的坑：observer 内 hook 顺序
- observer 内可以用 hook（useState、useEffect）
- 顺序要稳定（不能条件性调用）
- 这点和普通 React 组件一致
-->

---
transition: fade-out
---

# 常见踩坑（三）：忘记 observer 包装

组件不重渲，状态明明已经变了

<v-click>

**❌ 现象：state 变了，UI 没刷新**

```tsx
import { store } from "./store";

// 没有 observer 包装！
export function Counter() {
  return (
    <div>
      <span>{store.count}</span>  {/* 永远显示初始值 */}
      <button onClick={() => store.increment()}>+1</button>
    </div>
  );
}
```

</v-click>

<v-click>

**✅ 包装 observer**

```tsx
import { observer } from "mobx-react-lite";

export const Counter = observer(() => {
  return (
    <div>
      <span>{store.count}</span>  {/* 自动重渲 */}
      <button onClick={() => store.increment()}>+1</button>
    </div>
  );
});
```

</v-click>

<v-click>

**调试技巧**

- React DevTools 看组件名 `observer(Counter)` —— 没有就是没包
- 临时加 `console.log` 在 render 顶部，看是否被重新调用
- 整个项目「全员 observer」是最简单的策略

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 MobX 新手最高频的「翻车」——
忘记 observer 包装，组件读 store 没问题，但完全不重渲。

为什么？
- 没有 observer 包装的组件 = 普通 React 组件
- 普通组件只在「props / state / context 变化」时重渲
- store 是外部 mutable 对象，React 不知道它变了
- 所以 store.count 改了，组件不会重渲

[click] 解决：observer 包装

observer 内部用 React 的 useSyncExternalStore（React 18+）
监听 MobX 的变化通知，触发组件 force update。

实战 best practice：
- 任何「读 observable」的组件都要 observer 包装
- 包括子组件、孙组件、整个组件树
- observer 几乎零开销（内部 memo + useSyncExternalStore）

「全员 observer」策略：
- 全项目所有组件默认 observer 包装
- 不包就当成「会主动用 useObserver 或不读 observable」
- ESLint rule 强制（社区有 eslint-plugin-mobx）

[click] 调试技巧：

1. React DevTools 组件树：
   - 看组件名 → 有 observer 的会显示 "observer(Counter)" 或 "ForwardRef(Counter)"
   - 没有就是没包

2. 临时加 log：
   ```tsx
   const Counter = () => {
     console.log("Counter render", store.count);
     return <span>{store.count}</span>;
   };
   ```
   - 点 +1 后看 console
   - 没有新 log → 没重渲 → 没包 observer

3. 故意 mutate 看反应：
   - 在 console 直接调 store.increment()
   - UI 没变 → 没包 observer

4. ESLint 规则：
   ```js
   // .eslintrc
   { "extends": ["plugin:mobx/recommended"] }
   ```
   - eslint-plugin-mobx 提供 missing-observer 规则
   - 自动检测「读 observable 但没 observer」

补充：mobx-react-lite vs mobx-react
- mobx-react-lite：仅函数组件 + observer HOC（推荐）
- mobx-react：包含 class 组件支持 + Provider
- React 18+ 推荐 lite，体积更小

类组件场景（虽然现代项目少见）：
```tsx
import { observer } from "mobx-react";  // 注意是 mobx-react，不是 lite

@observer
class Counter extends React.Component {
  render() { return <span>{store.count}</span> }
}
```

但 React 18+ 建议用函数组件 + observer HOC。
-->

---
transition: fade-out
---

# 项目结构建议

大规模 MobX 应用的目录组织

<v-click>

```
src/
├── stores/                    # MobX store 集中
│   ├── RootStore.ts           # 聚合根
│   ├── UserStore.ts           # 用户领域
│   ├── CartStore.ts           # 购物车领域
│   ├── UiStore.ts             # UI 状态（modals / toasts）
│   ├── StoreContext.tsx       # React Context + Provider
│   └── index.ts               # 统一导出
├── hooks/                     # 派生 hook
│   ├── useUserStore.ts        # () => useStore().userStore
│   └── useCart.ts             # 组合 cart + user
├── components/
│   └── observer 包装的组件
└── pages/
```

</v-click>

<v-click>

**命名约定**

- store 类：`XxxStore`（`UserStore` / `CartStore`）
- 实例：`xxxStore`（注入到 RootStore 字段）
- observable 字段：camelCase（`user` / `loading` / `items`）
- computed getter：camelCase（`isLoggedIn` / `total` / `filtered`）
- action 方法：动词 camelCase（`addItem` / `login` / `setUser`）

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 项目结构建议：

stores/ 集中所有 store
- 一个文件一个 store（按业务领域分）
- RootStore 聚合所有 sub-store
- StoreContext 提供 React 注入

为什么按领域分？
- UserStore：用户、登录、权限
- CartStore：购物车、订单
- ProductStore：商品、分类、搜索
- UiStore：UI 状态（modals / toasts / theme）
- ApiStore（可选）：HTTP 缓存

避免按数据类型分：
- ❌ ListStore（什么列表？）
- ❌ FormStore（什么表单？）
- ❌ EntityStore（混杂业务）

[click] 命名约定：

类名：XxxStore（明确是 store 类）
实例字段：xxxStore（去掉首字母大写）
observable 字段：camelCase（不加前缀）
computed：camelCase + 形容词/属性词
action：动词 camelCase

避免：
- isXxx：computed 适合 boolean 派生
- setXxx / updateXxx：action 适合写操作
- xxxList：observable 数组（直接复数即可）

文件命名：PascalCase（class 文件） + index.ts（导出）

```ts
// stores/index.ts
export { RootStore } from './RootStore';
export { StoreProvider, useStore } from './StoreContext';
export type { CartItem } from './CartStore';
```

hooks/ 派生 hook
- useStore() → 拿到 RootStore
- useUserStore() → 直接拿 userStore（语法糖）
- 组合 hook：useCart() = 组合多个 sub-store

```ts
export const useUserStore = () => useStore().userStore;
export const useCartStore = () => useStore().cartStore;
export function useCart() {
  const cart = useCartStore();
  const user = useUserStore();
  return { items: cart.items, canCheckout: !!user.user };
}
```

components/ 包含组件
- 默认全员 observer 包装
- 业务逻辑放 store，组件只渲染 + 调 action
- 复杂逻辑用 useLocalObservable

样板模板：
```tsx
const ComponentName = observer(() => {
  const { someStore } = useStore();
  const handleClick = () => someStore.doSomething();
  return <div onClick={handleClick}>{someStore.state}</div>;
});
```

测试组织：
- stores/__tests__/UserStore.test.ts
- 每个 store 一个测试文件
- 组件测试在 components/ 同目录或 __tests__/

大型项目演进：
- 单 stores/ 目录文件多了 → 按领域子目录
- stores/user/UserStore.ts + stores/user/AuthStore.ts
- 配合 barrel export（index.ts）保持清爽
-->

---
transition: fade-out
---

# 性能优化

大规模 observable + 频繁更新场景

<v-click>

**1. 细粒度 observer**

```tsx
// ❌ 一个大 observer 包整页
const Page = observer(() => <Layout>{store.everything}</Layout>);

// ✅ 每个数据点独立 observer
const Page = () => (
  <Layout>
    <Header />          {/* observer 包装 */}
    <Sidebar />         {/* observer 包装 */}
    <Content />         {/* observer 包装 */}
  </Layout>
);
```

</v-click>

<v-click>

**2. 传 reference 而非值**

```tsx
// ❌ 父组件 deref，所有兄弟跟着重渲
<Child name={user.name} />

// ✅ 传引用，子组件自己 deref
<Child user={user} />
```

</v-click>

<v-click>

**3. observable.ref / shallow 减少深度追踪**

```ts
hugeData: HugeJSON = ...;
constructor() {
  makeObservable(this, { hugeData: observable.ref });  // 只追整体替换
}
```

</v-click>

<v-click>

**4. computed.struct 减少无效下游触发**

```ts
get position() { return { x: this.x, y: this.y } }  // 每次新对象 → 下游 reaction 误触发
// 加 computed.struct 注解后，结构相同则不触发
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 性能优化的四大方向：

[click] 1. 细粒度 observer 包装
- observer 的「重渲」只影响自己，不影响兄弟节点
- 把大组件拆成小组件 + 各自 observer
- 用户头像变化只重渲 Avatar 组件，不影响 Header 其他部分

经验：
- 「全员 observer」是默认策略
- 关键性能场景拆得更细
- 列表项必须独立 observer 化

[click] 2. 传 reference 而非 deref 后的值
- 父组件 deref user.name → 父组件订阅 user.name
- name 变化触发父组件 + 所有子组件重渲
- 改为传 user 引用，子组件 deref → 只重渲子组件

记忆要点：「deref 越深越好」——
让最深的组件读 observable，订阅最细。

[click] 3. observable.ref / shallow
- 默认 observable 深度递归，开销大
- 大数据（10000+ 条记录）用 ref 只追整体替换
- 不变 item 的数组用 shallow

常见场景：
- 路由数据（fetch 一次，整体替换）→ observable.ref
- 配置树（外部加载，内部不变）→ observable.shallow
- 用户 profile（增量 patch）→ 默认 observable（要深追踪）

[click] 4. computed.struct
- 默认 computed 返回新对象 → === 比较失败 → 下游全触发
- struct 用结构比较 → 内容相同不触发
- 性能优化关键

例子：
```ts
get bounds() {
  return { x: this.x, y: this.y, w: this.w, h: this.h };
}
```
即使 x/y/w/h 没变，每次 read 都新对象引用。
加 computed.struct 后内容相同则保持原引用。

进阶优化：

5. 避免 computed 内重复计算
   - 拆分多个 computed，复用中间结果
   - 不要在 computed 里调 expensive 函数

6. reaction 用 delay 节流
   - 高频更新场景（拖拽、scroll）
   - reaction(track, effect, { delay: 100 })

7. transaction 批量更新
   - 多个 mutate 用 transaction 包装
   - 但 action 已经隐含 transaction，一般不需要手动

8. autorun vs reaction
   - autorun 自动追踪所有读到的 observable
   - reaction 只追 tracker 函数中读的
   - 想精确控制 → 用 reaction

9. observerBatching（mobx-react-lite ≥ 3.4）
   - 自动批量化 React 状态更新
   - 默认开启，不需要手动配置

DevTools 性能分析：
- React DevTools Profiler 看 observer 组件重渲次数
- 标记「why did you render」找无效重渲
- Chrome Performance 看 reaction 时长

何时优化？
- 用户报告卡顿
- DevTools Profile 看到瓶颈
- 组件超过 50ms 渲染时间
- 不要过早优化（MobX 默认性能已经很好）
-->

---
transition: fade-out
---

# 生态与扩展

MobX 周边库矩阵

<v-click>

| 库                     | 定位                      | 典型场景                       |
| ---------------------- | ------------------------- | ------------------------------ |
| **mobx-react-lite**    | React 函数组件绑定        | 函数组件 + observer            |
| **mobx-react**         | 完整 React 绑定（含 class）| 老项目 / class 组件           |
| **mobx-state-tree**    | MobX 上的 schema-driven 框架 | 严格领域模型 / snapshot       |
| **mobx-utils**         | 实用工具集合              | fromPromise / lazyObservable   |
| **mobx-keystone**      | MST 的现代替代             | 类风格 + snapshot              |
| **mobx-persist-store** | 持久化扩展                | localStorage / IndexedDB 自动同步|
| **mobx-react-form**    | 表单方案                  | 表单 + validation              |

</v-click>

<v-click>

**MST（MobX State Tree）是关联项目**

- 在 MobX 上构建的「opinionated」框架
- 引入 type system / snapshot / undo-redo / middleware
- 适合超大型项目、强领域驱动设计
- 学习曲线陡，但生产价值高
- 不展开，参考 [mobx-state-tree.js.org](https://mobx-state-tree.js.org/)

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 的扩展生态没有 Redux / React Query 那么繁荣，
但核心刚需都有现成方案。

[click] 各库定位：

mobx-react-lite vs mobx-react：
- lite：仅函数组件，体积小，React 18+ 推荐
- 完整：包含 class 组件支持 + Provider 组件
- 新项目无脑 lite
- 老项目升 React 18 时一起换 lite

mobx-state-tree（MST）：
- 不是简单的 MobX 增强，而是构建在 MobX 上的「重型框架」
- 引入 schema：types.model({ field: types.string })
- 引入 snapshot：onSnapshot 监听整树变化
- 引入 action：自动 wrap，时间旅行
- 引入 middleware：拦截 action（log / undo-redo）
- 适合「应用即数据库」的领域驱动项目

mobx-utils：
- fromPromise：把 Promise 包装为 observable
- lazyObservable：延迟初始化
- fromResource：长连接数据源（WebSocket / SSE）
- 偶尔有用，按需引入

mobx-keystone：
- 类似 MST 但用 class 风格
- 装饰器 + class field
- 更现代的 API（基于 MobX 6）
- 替代 MST 的选项

mobx-persist-store：
- 自动 localStorage / sessionStorage 同步
- 比手写 reaction 更结构化
- 配合 RootStore 模式

mobx-react-form：
- 完整表单解决方案
- 字段 / validation / 提交
- 不如 React Hook Form 流行，但 MobX 内集成更好

[click] MST 简单介绍：

```ts
import { types } from 'mobx-state-tree';

const Todo = types
  .model({ id: types.identifier, text: types.string, done: false })
  .actions((self) => ({
    toggle() { self.done = !self.done }
  }));

const RootStore = types.model({ todos: types.array(Todo) });
```

特点：
- types.string / number / array / model 等运行时类型
- snapshot：拿到当前状态的 JSON 快照
- onSnapshot：监听整树变化（自动持久化 / 时间旅行）
- patch：JSON Patch 格式记录每次变更
- type-safe action：actions 自动 wrap action()
- references：跨节点引用（Foreign Key 概念）

何时上 MST？
- 项目 50+ 个 model + 复杂关联
- 需要时间旅行 / undo-redo
- 需要严格的「shape 验证」
- 团队接受额外学习成本

何时不上？
- 简单项目（MobX 已经够）
- 团队不熟悉 schema-driven 思维
- 性能敏感（MST 多一层 wrapping）

MST 是 MobX 生态的「重型武器」，威力大但成本高。
不少 Fortune 500 公司用它做大型企业应用。
-->

---
transition: fade-out
---

# Vue / Angular 集成

MobX 跨框架的可能性

<v-click>

**Vue：mobx-vue-lite**

```ts
import { observable } from "mobx";
import { useObserver } from "mobx-vue-lite";

const store = observable({ count: 0 });

export default {
  setup() {
    return useObserver(() => ({
      count: store.count,
      increment: () => store.count++,
    }));
  },
};
```

</v-click>

<v-click>

**Angular：mobx-angular**

```ts
import { observer } from "mobx-angular";

@observer
@Component({
  template: `<span>{{ store.count }}</span>`,
})
export class CounterComponent {
  store = new CounterStore();
}
```

</v-click>

<v-click>

**纯 JS / vanilla**

```ts
import { autorun } from "mobx";

const store = observable({ count: 0 });

// 手动绑定 DOM
autorun(() => {
  document.getElementById("count").textContent = store.count.toString();
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 跨框架是它的独特优势之一 ——
核心 mobx 包不绑死任何视图框架，
每个框架有对应的绑定库。

[click] Vue 集成：
- mobx-vue-lite（推荐 Vue 3）
- mobx-vue（旧版，Vue 2 / 3）
- 整体使用率不高（Vue 自带 Pinia / Vuex）

Vue 团队为什么不主流用 MobX？
- Pinia / Vuex 是 Vue 官方，集成度更好
- Vue 的 reactive 系统本质和 MobX 类似（都是 Proxy 追踪）
- 没必要叠加两个响应式系统

但有用 MobX 的场景：
- 共享业务逻辑给 React + Vue 双端
- 团队同时维护 React 和 Vue 项目
- 渐进迁移（React 旧项目 + Vue 新项目共享 store）

[click] Angular 集成：
- mobx-angular（社区维护）
- @observer 装饰器包装组件
- 与 Angular 的 Change Detection 集成

Angular 默认用 Zone.js + Observable（RxJS），
MobX 在 Angular 里也是「小众选择」，
但比 NgRx 更轻量。

[click] vanilla JS：
- import { observable, autorun } from 'mobx'
- 手动 autorun + DOM 操作
- 适合插件 / 小工具 / 老项目

应用场景：
- jQuery 项目想引入响应式 state
- Web Components 自定义元素
- 浏览器扩展（content script）

[click] 跨框架共享业务逻辑：

```ts
// shared/UserStore.ts（无框架依赖）
import { makeAutoObservable } from 'mobx';

export class UserStore {
  user = null;
  constructor() { makeAutoObservable(this) }
  async login(...) { ... }
}

// 共用纯业务逻辑 + 每个框架自己的视图绑定
```

这是 MobX 多框架的核心价值：
- 业务模型一次写，多端复用
- 测试纯 JS，不依赖框架 mock
- 微前端场景共享状态

但实际项目里这种「真跨框架」需求很少，
大多数团队还是单一框架，MobX 在 React 里的使用占绝大多数。

补充：
- React Native 用 mobx-react-lite，体验和 web 一致
- Solid.js / Svelte 有社区 bindings
- 服务端（Node.js）也能直接用 MobX 做响应式数据流
-->

---
transition: fade-out
---

# 生产部署清单

上线前必做的检查项

<v-click>

**1. configure 严格模式 + DevTools 隔离**

```ts
// main.tsx
import { configure } from "mobx";

configure({
  enforceActions: "always",
  computedRequiresReaction: import.meta.env.DEV,
  observableRequiresReaction: import.meta.env.DEV,
  reactionRequiresObservable: import.meta.env.DEV,
});

if (import.meta.env.DEV) {
  import("mobx-react-devtools").then(...);
}
```

</v-click>

<v-click>

**2. localStorage 数据兼容**

- key 加版本前缀（`v1:cart`）
- 加 try/catch 防止 JSON 解析失败
- 敏感字段不入 localStorage

</v-click>

<v-click>

**3. SSR 隔离检查**

每个请求一个独立 RootStore，避免泄漏到其他用户。

</v-click>

<v-click>

**4. Bundle 验证**

`pnpm dlx vite-bundle-visualizer`：mobx ~16 KB（gzip），mobx-react-lite ~3 KB。

</v-click>

<v-click>

**5. 监控 + 错误上报**

```ts
spy((event) => {
  if (event.type === "action" && event.name === "criticalAction") {
    monitoring.log(event);
  }
});
```

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 生产部署前的检查清单：

[click] 1. configure 严格模式
- enforceActions: 'always' 全环境保持一致
- 警告类选项（computedRequiresReaction 等）仅 dev
- 生产关掉警告但保留 action 强制

DevTools 隔离：
- 用 import.meta.env.DEV 守卫
- 生产构建 tree-shake 掉 devtools 模块
- 避免 production bundle 含 devtools 代码

[click] 2. localStorage 兼容性
- 版本前缀：'v1:cart' → 'v2:cart' 不冲突
- 旧用户数据迁移：v1 数据读取后转换为 v2 格式
- JSON 解析 try/catch：损坏数据不让 app 崩溃

```ts
constructor() {
  try {
    const saved = JSON.parse(localStorage.getItem('v1:cart') ?? '[]');
    this.items = saved;
  } catch (e) {
    this.items = [];  // fallback
  }
}
```

敏感字段：
- token → httpOnly cookie，不入 localStorage
- 个人信息 → 加密或不持久化
- 任何 XSS 都能读 localStorage（防御性思维）

[click] 3. SSR 隔离
- Node.js 进程内多请求并发
- 全局 singleton store → 跨请求数据污染
- 必须用 useState/useMemo 在每个请求 boundary 创建独立 RootStore

Code review 强制：
- StoreProvider 在每个 layout / page 的根
- 检查没有 export const store = new RootStore() 这种全局
- 检查 hydrate 用了请求专属数据

[click] 4. Bundle 体积
- mobx 本体 ~16 KB（gzip 后）
- mobx-react-lite ~3 KB（gzip 后）
- 总计 ~20 KB —— 中型项目可接受
- 与 Zustand（~1 KB）有差距，但比 Redux Toolkit + react-redux（~15 KB）类似

减小 bundle：
- 不要用 mobx-react（lite 就够）
- 不引入 mobx-utils 整包，按需 import
- 不在生产 bundle 含 devtools

vite-bundle-visualizer / rollup-plugin-visualizer 可视化检查。

[click] 5. 监控 / 错误上报
- spy 接 Sentry / Datadog
- 记录关键 action（结算、提交订单、登录）
- 配合 error boundary 捕获 reaction 错误

```ts
spy((event) => {
  if (event.type === 'action') {
    Sentry.addBreadcrumb({
      category: 'mobx-action',
      message: event.name,
      data: event.arguments,
    });
  }
});
```

性能监控：
- DevTools Profile 看 observer 重渲次数
- 自定义 trace 记录关键 computed 计算时长
- 用户体验指标（FCP / TTI）受 MobX 影响有限

补充清单：
- E2E 测试用 store API 注入状态（playwright + store.setUser(...)）
- 主流浏览器兼容性（IE 11 不支持 Proxy 默认）
- 关键路径性能预算（首屏 200ms 内渲完）
- A/B 测试时多 store 隔离
-->

---
transition: fade-out
---

# 学习路径

从入门到精通的资源地图

<v-click>

**官方资源**

- [MobX 官网](https://mobx.js.org/) — 文档结构清晰，2-3 小时过完核心
- [MobX GitHub](https://github.com/mobxjs/mobx) — 28K+ star，活跃维护
- [mobx-react-lite](https://github.com/mobxjs/mobx-react-lite) — React 函数组件绑定
- [Egghead.io MobX 课程](https://egghead.io/courses/manage-complex-state-in-react-apps-with-mobx) — Michel Weststrate 亲讲

</v-click>

<v-click>

**进阶内容**

- [MobX 6 迁移指南](https://mobx.js.org/migrating-from-4-or-5.html) — 老项目升级
- [mobx-state-tree 文档](https://mobx-state-tree.js.org/) — schema-driven 升级方案
- [Tips & Tricks](https://mobx.js.org/defining-data-stores.html) — Store 设计模式

</v-click>

<v-click>

**实战参考**

- [mobx-examples](https://github.com/mobxjs/mobx/tree/main/examples) — 官方示例项目
- [TodoMVC](https://github.com/mobxjs/mobx-react-todomvc) — 经典 TodoMVC 实现
- [《Pro MobX》by Pavan Podila](https://pro-mobx.com/) — 系统化书籍

</v-click>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MobX 学习路径建议：

第 1 周：核心原语
- 官方文档 The gist of MobX
- observable / computed / action 三个核心
- 写一个 Counter / Todo 项目

第 2 周：React 集成
- mobx-react-lite + observer
- useLocalObservable
- Store + Context 模式
- 重写一个 Cart 项目

第 3 周：异步 + 高级模式
- async / await + runInAction
- flow generator
- reaction + autorun + when
- RootStore + 跨 store 通信

第 4 周：生产实战
- TypeScript 完整集成
- 测试单元 + E2E
- SSR / Next.js
- 性能调优 + DevTools

[click] 进阶学习：

MobX 6 迁移：
- 老项目从 4/5 升级的 case study
- 装饰器 → makeObservable 转换
- 工具链配置变化

mobx-state-tree：
- 当 MobX 6 不够用时上 MST
- types / snapshot / patches
- 时间旅行 / undo-redo
- middleware 体系

设计模式：
- Domain store vs UI store
- 跨 store 通信（root injection）
- 数据规范化（normalize / denormalize）
- 服务层 / repository 模式

[click] 实战项目：

mobx-examples 仓库：
- /counter：最简单 hello world
- /todomvc：经典 TodoMVC 实现
- /react-typescript：完整 TS 项目模板
- /create-react-app：CRA 集成

TodoMVC：
- 涵盖增删改查 / 过滤 / 持久化
- 经典对比基准（vs Redux / Zustand 实现）
- 看完能掌握 80% 业务场景

Pro MobX 书：
- Pavan Podila 著（MobX 核心贡献者）
- 系统化讲解 MobX 设计哲学
- 涵盖 React / Angular / Vue 集成
- 适合深入理解的开发者

社区资源：
- Michel Weststrate（作者）Twitter：高质量 tips
- React Podcast / JavaScript Jabber 节目
- Stack Overflow + GitHub Discussions

学习节奏：
- 周 1-2：上手能写
- 周 3-4：能 hold 中型项目
- 月 2-3：精通 + 能教别人
- 半年：能贡献 MobX 源码 / 衍生库

一个月入门到能 hold 住中大型项目，
半年到能贡献社区。这是 MobX 的学习曲线特点。

对比 Redux 学习曲线：
- Redux 上手快但精通慢（要理解 Flux / middleware / saga）
- MobX 上手中等但天花板平稳（响应式系统理解后就一通百通）

对比 Zustand：
- Zustand 学习曲线最短（一个 create 就懂）
- MobX 学习曲线略长，但深度更高
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🟠

MobX — Simple, Scalable State Management

<div class="mt-8 text-lg">

**核心心智**

- 一切皆 observable —— 字段、数组、Map、Set 都可响应
- 派生用 computed —— 自动追踪 + 智能缓存 + 按需挂起
- 副作用三剑客 —— autorun / reaction / when
- React 集成只一个 observer HOC —— mobx-react-lite
- 严格模式让 bug 提早暴露 —— `configure` 开启 `enforceActions: 'always'`

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://mobx.js.org/" target="_blank" class="slidev-icon-btn">
    📖 官方文档
  </a>
  <a href="https://github.com/mobxjs/mobx" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
</div>

<style>
h1 {
  background-color: #FF7139;
  background-image: linear-gradient(45deg, #FF7139 10%, #FFB270 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：MobX = 响应式状态管理「Vue 心智 + React 集成」 ——
observable 字段 + 自动追踪 + 直接 mutate。

核心心智五条：
1. 一切皆 observable：字段、数组、Map、Set 都可响应；makeAutoObservable 一行搞定
2. 派生用 computed：getter 自动缓存 + 智能挂起，永远不会过早算
3. 副作用三剑客：autorun（广撒网）/ reaction（精准追踪）/ when（一次性条件）
4. React 集成只一个 HOC：observer 包装组件，自动订阅 + 自动 unmount 清理
5. 严格模式 + DevTools：configure 强制规范，spy / trace 调试响应链

下一步建议：写一个 Cart / Todo 项目，从 makeAutoObservable 开始 ——
把 observable / computed / action / observer 全部用上，
那时再回头看 Redux / Zustand / Jotai，能立刻体会到响应式范式的爽点。

最后留一句话：MobX 不是为了取代 Redux 或 Zustand，
而是给「需要响应式自动追踪 + OOP 模型 + 多框架」的项目一个老牌选择。
- 大型 React 项目 + 函数式偏好 → Redux Toolkit
- 极简 + React-first → Zustand
- 大量原子状态 → Jotai
- OOP 模型 + 多框架 + 响应式 → MobX 几乎无敌

感谢观看！🟠
-->
