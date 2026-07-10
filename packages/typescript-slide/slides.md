---
theme: seriph
layout: cover
title: TypeScript 语言核心
info: |
  从 JavaScript 运行时出发，建立 TypeScript 的推断、窄化、泛型与边界校验心智。

  Learn more at [https://www.typescriptlang.org](https://www.typescriptlang.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">TS</div>

# TypeScript

## 让错误更早出现，让代码关系可以被检查

<div class="cover-meta">
  <span>TypeScript 7.0</span>
  <span>推断 · 窄化 · 泛型 · 工程边界</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://www.typescriptlang.org/docs/" target="_blank" class="slidev-icon-btn" aria-label="TypeScript 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/microsoft/TypeScript" target="_blank" class="slidev-icon-btn" aria-label="TypeScript GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这不是一份类型语法目录。我们从 JavaScript 运行时出发，逐步回答三个问题：类型检查器看到了什么、它如何缩小不确定性、工程边界为什么仍然需要运行时校验。

当前 npm latest 是 TypeScript 7.0。后面会专门解释原生编译器带来的性能收益，以及迁移期为什么部分工具仍需保留 TypeScript 6。
-->

---
layout: default
---

# 先建立边界：TS 不在运行时存在

<div class="pipeline mt-8">
  <div class="pipeline-step tone-blue">
    <span class="step-no">01</span>
    <strong>TypeScript 源码</strong>
    <code>price: number</code>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">02</span>
    <strong>类型检查器</strong>
    <span>推断、约束、报错</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">03</span>
    <strong>JavaScript 产物</strong>
    <code>price</code>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-10">
  <div v-click class="fact"><strong>超集</strong><span>合法 JavaScript 可以渐进迁移</span></div>
  <div v-click class="fact"><strong>擦除</strong><span>类型注解不会进入产物</span></div>
  <div v-click class="fact"><strong>不担保输入</strong><span>网络和存储仍是不可信边界</span></div>
</div>

<!--
第一张心智图非常重要：TypeScript 的工作发生在运行之前。

[click] 它是 JavaScript 的超集，所以可以从一个文件、一个目录开始渐进迁移。
[click] 编译后类型会被擦除，浏览器看不到 interface 或 number 注解。
[click] 因此 TypeScript 不能证明 API 响应真的符合声明；边界处仍需运行时验证。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 类型系统的第一份回报：把线上事故挪到编辑器

::left::

### JavaScript：合法，但结果悄悄坏掉

```js {1-3|5|all}
function subtotal(price, quantity) {
  return price * quantity;
}

subtotal(39, undefined); // NaN
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>直到这条路径运行，错误才暴露</span>
</div>

::right::

### TypeScript：关系先被检查

```ts {1-3|5|all}
function subtotal(price: number, quantity: number) {
  return price * quantity;
}

subtotal(39, undefined);
//          ~~~~~~~~~ undefined 不能传给 number
```

<div v-click class="signal signal-good mt-4">
  <carbon:checkmark-outline />
  <span>函数签名同时成为可执行的接口文档</span>
</div>

<!--
动态类型并不等于错误，它只是让错误更晚暴露。这个例子在 JavaScript 中完全合法，结果是 NaN，而且 NaN 还可能继续污染后续计算。

[click:2] 加上参数关系后，调用处立即得到反馈。TypeScript 的价值不是多写几个类型名，而是让跨函数、跨模块的关系可以自动验证。
-->

---
layout: default
---

# 推断优先：让数据流替你写类型

<div class="grid grid-cols-[1.25fr_.75fr] gap-8 mt-5 items-start">

````md magic-move {at:1}
```ts
const retries = 3;
const labels = ["new", "paid"];
```

```ts
const retries = 3;
//    ^? number
const labels = ["new", "paid"];
//    ^? string[]
```

```ts
function greet(name: string) {
  return `Hello ${name}`;
  //     ^? string
}
```
````

<div class="rule-stack">
  <div class="rule tone-green"><strong>交给推断</strong><span>局部变量、明显返回值</span></div>
  <div v-click class="rule tone-blue"><strong>主动标注</strong><span>参数、公共 API、空容器</span></div>
  <div v-click class="rule tone-amber"><strong>固定意图</strong><span>联合类型、契约与边界</span></div>
</div>
</div>

<div v-click class="takeaway mt-6">类型越多不等于越安全；让编译器保留精确信息，通常比重复声明更好。</div>

<!--
第一条实践原则是推断优先。局部值和明显的返回值让编译器自己推导，代码更少，类型也会随实现同步变化。

[click] 参数和公共 API 是调用者依赖的契约，应主动标注。
[click] 当我们需要把范围限制为几个状态，或者声明系统边界时，也要明确写出意图。
[click] 类型注解不是目标，可靠的数据关系才是。
-->

---
layout: default
---

# 一张图看懂常用类型工具

<div class="type-map mt-7">
  <div v-click class="type-cell tone-blue"><code>string</code><span>原始值</span></div>
  <div v-click class="type-cell tone-blue"><code>Order[]</code><span>同类集合</span></div>
  <div v-click class="type-cell tone-green"><code>{ id: string }</code><span>对象结构</span></div>
  <div v-click class="type-cell tone-green"><code>(x: T) =&gt; U</code><span>函数关系</span></div>
  <div v-click class="type-cell tone-amber"><code>A | B</code><span>多种可能</span></div>
  <div v-click class="type-cell tone-amber"><code>A &amp; B</code><span>同时满足</span></div>
  <div v-click class="type-cell tone-red"><code>unknown</code><span>先验证再使用</span></div>
  <div v-click class="type-cell tone-red"><code>never</code><span>不可能到达</span></div>
</div>

<div v-click class="mt-7 text-center text-sm text-gray-500">
  先描述真实数据，再组合工具；不要从“类型体操”倒推业务模型。
</div>

<!--
这张图不要求一次记住所有语法，只要看到四组关系：值、结构、组合和边界。

[click:4] 原始类型、数组、对象、函数描述最常见的数据形状。
[click:4] 联合表示多种可能，交叉表示同时具备。
[click:2] unknown 要求先验证，never 则帮助我们检查不可能遗漏的分支。
[click] 后面的高级工具都建立在这些关系之上。
-->

---
layout: default
class: lab-slide
---

# 交互实验：为什么要先处理 `null`

<TypeNarrowingLab />

<!--
现在现场切换三个输入。string 和 number 都能被 typeof 正确区分，但 null 会返回 object，这是 JavaScript 的历史行为。

先点 null，让大家观察原始 typeof，再看安全判断为什么把 value === null 放在最前面。TypeScript 的窄化不会修复 JavaScript 语义，它只是准确跟随控制流。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 可辨识联合：把“状态组合爆炸”变成有限分支

::left::

```ts {1-4|6-13|all}
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; message: string };

function render(state: RequestState) {
  switch (state.status) {
    case "success":
      return state.data.length;
    case "error":
      return state.message;
  }
}
```

::right::

<div class="state-flow mt-2">
  <div v-click class="state-node">idle</div>
  <carbon:arrow-right />
  <div v-click class="state-node active">loading</div>
  <carbon:arrow-right />
  <div class="flex flex-col gap-3">
    <div v-click class="state-node success">success + data</div>
    <div v-click class="state-node error">error + message</div>
  </div>
</div>

<div v-click class="takeaway mt-7">
  `status` 一旦确定，对应字段就自动可用；无效组合无法被构造。
</div>

<!--
多个布尔值很容易产生 loading 为 false、data 和 error 同时存在的无效状态。可辨识联合用一个字面量字段描述有限状态机。

[click:4] 切换 status 后，TypeScript 会沿控制流缩小类型。success 分支只出现 data，error 分支只出现 message。
[click] 这既减少判断，也让非法状态在建模层面消失。
-->

---
layout: two-cols-header
layoutClass: gap-x-10 grid-rows-[88px_1fr]
---

# `interface` 与 `type`：按能力选，不必站队

::left::

### `interface` 擅长可扩展对象契约

```ts
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}
```

<div v-click class="mini-note">支持声明合并，适合公开、可扩展的对象 API。</div>

::right::

### `type` 擅长组合任意类型

```ts
type Id = string | number;

type Result<T> = { ok: true; value: T } | { ok: false; error: Error };
```

<div v-click class="mini-note">联合、元组、原始类型别名与条件类型都需要 `type`。</div>

<div v-click class="col-span-2 takeaway mt-4">
  团队规则可以统一默认值，但代码审查应关注模型是否准确，而不是关键字偏好。
</div>

<!--
interface 和 type 在对象建模上高度重叠。interface 有声明合并和 extends，适合希望被第三方扩展的公开对象契约。

[click] type 可以命名任何类型，尤其适合联合和泛型结果。
[click] 选型没有绝对输赢；模型清晰、团队一致更重要。
-->

---
layout: default
---

# 泛型不是占位符，而是“保留输入与输出的关系”

<div class="grid grid-cols-[1.15fr_.85fr] gap-8 mt-4">

```ts {1-3|5-8|10-12|all}
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const user = first([
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Lin" },
]);

function getId<T extends { id: string }>(value: T) {
  return value.id;
}
```

<div class="relation-diagram">
  <div class="relation-input">输入<br><strong>`T[]`</strong></div>
  <carbon:arrow-down />
  <div class="relation-core">同一个 `T`</div>
  <carbon:arrow-down />
  <div class="relation-output">输出<br><strong>`T | undefined`</strong></div>
</div>
</div>

<div v-click class="takeaway mt-5">约束 `extends` 只要求最低能力，不会抹掉调用者更具体的类型。</div>

<!--
把 T 读作“由调用者决定、并在整段关系中保持一致的类型”。first 接收 T 数组，所以返回值仍然知道具体对象结构。

[click:2] 调用处无需手写泛型参数，编译器会从数组推断。
[click] extends 声明最低要求：对象必须有 id，但额外字段会被完整保留。
[click] 如果输入输出没有关系，只出现一次的泛型往往应换成普通类型。
-->

---
layout: default
---

# 类型变换：从一个事实源派生其他视图

<div class="transform-flow mt-5">
  <div class="transform-source">
    <span>事实源</span>
    <code>type User</code>
  </div>
  <carbon:arrow-right />
  <div v-click class="transform-op"><code>keyof</code><span>键的联合</span></div>
  <carbon:arrow-right />
  <div v-click class="transform-op"><code>Pick</code><span>选择字段</span></div>
  <carbon:arrow-right />
  <div v-click class="transform-op"><code>Partial</code><span>全部可选</span></div>
</div>

```ts {1-5|7|9|11-13|all}
type User = {
  id: string;
  name: string;
  active: boolean;
};

type UserKey = keyof User;

type UserSummary = Pick<User, "id" | "name">;

type FormState<T> = {
  [K in keyof T]: { value: T[K]; dirty: boolean };
};
```

<!--
高级类型最实用的场景，是避免复制同一份事实。keyof 从 User 取键，Pick 选出摘要，映射类型再把每个字段变成表单状态。

[click:3] 每一步都是从源模型派生，而不是维护第二套容易漂移的声明。
[click:2] 当 User 增删字段，派生类型会自动更新或立即报错。
-->

---
layout: default
---

# `as const` 与 `satisfies`：既校验，又保留精度

````md magic-move {at:1}
```ts
const routes: Record<string, { path: string }> = {
  home: { path: "/" },
  settings: { path: "/settings" },
};
```

```ts
const routes = {
  home: { path: "/" },
  settings: { path: "/settings" },
} satisfies Record<string, { path: string }>;

routes.home.path;
//     ^ 自动补全保留 home 与 settings
```

```ts
const levels = ["info", "warn", "error"] as const;
//    ^? readonly ["info", "warn", "error"]

type Level = (typeof levels)[number];
//   ^? "info" | "warn" | "error"
```
````

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>`satisfies`</strong><span>验证形状，不把值拓宽成目标类型</span></div>
  <div v-click class="fact"><strong>`as const`</strong><span>保留字面量，并把结构变为只读</span></div>
</div>

<!--
直接给对象写 Record 注解会丢掉具体键名。satisfies 只验证兼容性，同时保留对象自己的精确推断。

[click] as const 则阻止字面量被拓宽，可以从一个运行时数组派生联合类型。
[click] 两者都比无条件的 as 类型断言更诚实，因为断言可能跳过检查。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 网络响应不是 `User`，它首先是 `unknown`

::left::

```ts {1-4|6-11|13-16|all}
type User = {
  id: string;
  name: string;
};

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

const payload: unknown = await response.json();
if (!isUser(payload)) throw new Error("Invalid user");
payload.name;
```

::right::

<div class="boundary-stack mt-1">
  <div class="boundary external"><carbon:cloud /> HTTP / localStorage / postMessage</div>
  <carbon:arrow-down />
  <div v-click class="boundary check"><carbon:security /> Schema 或类型守卫</div>
  <carbon:arrow-down />
  <div v-click class="boundary trusted"><carbon:checkmark /> 可信领域对象</div>
</div>

<div v-click class="signal signal-bad mt-5">
  <carbon:warning-alt />
  <span>`response.json() as User` 只让报错消失，不会验证任何字节。</span>
</div>

<!--
外部数据必须从 unknown 开始。类型守卫适合简单结构，复杂业务通常使用 Zod、Valibot、ArkType 或 JSON Schema 验证器。

[click:2] 验证通过后，系统内部才把数据当作可信领域对象。
[click] as User 只是告诉编译器相信你，它不会生成检查代码，也不会改变响应内容。
-->

---
layout: default
---

# TypeScript 7.0：原生编译器已经到来

<div class="release-grid mt-5">
  <div class="release-hero">
    <span class="release-label">2026-07-08</span>
    <strong>8×–12×</strong>
    <span>官方基准中的构建加速范围</span>
  </div>
  <div class="release-detail tone-green">
    <carbon:flash />
    <strong>Go 原生实现</strong>
    <span>更快启动、更低内存、可并行检查</span>
  </div>
  <div class="release-detail tone-blue">
    <carbon:terminal />
    <strong>`tsgo` / `typescript` 7.0</strong>
    <span>CLI 与语言服务进入原生路线</span>
  </div>
  <div class="release-detail tone-amber">
    <carbon:warning />
    <strong>迁移期边界</strong>
    <span>7.0 尚无编程 API；Vue、Angular、MDX、Astro、Svelte 等嵌入式工具可能需并存 TS 6</span>
  </div>
</div>

<div v-click class="takeaway mt-5">
  升级前先检查构建插件、语言服务与框架工具链，不要只比较 `tsc` 是否能运行。
</div>

<!--
TypeScript 7.0 在 2026 年 7 月 8 日正式发布，原生 Go 端口在官方代码库基准中通常快 8 到 12 倍。

[click] 但这不是所有生态工具都能立刻无缝替换的版本。7.0 暂时没有编程 API；需要嵌入语言服务的 Vue、Angular、MDX、Astro、Svelte 等工具，可能要让 TypeScript 6 与 7 并存。升级应从真实工具链验证开始。
-->

---
layout: two-cols-header
layoutClass: gap-x-9 grid-rows-[88px_1fr]
---

# 一份能长期工作的起步配置

::left::

```json {2-3|4-6|7-9|all}
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true
  }
}
```

::right::

<table class="decision-table">
  <thead><tr><th>目标</th><th>选项</th></tr></thead>
  <tbody>
    <tr v-click><td>完整严格检查</td><td><code>strict</code></td></tr>
    <tr v-click><td>索引结果诚实地含 `undefined`</td><td><code>noUncheckedIndexedAccess</code></td></tr>
    <tr v-click><td>区分缺失与显式 `undefined`</td><td><code>exactOptionalPropertyTypes</code></td></tr>
    <tr v-click><td>交给 Vite / bundler 发射</td><td><code>noEmit</code></td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-4">从框架官方模板继承，再按运行环境选择 `moduleResolution`、`lib` 与 project references。</div>

<!--
起步配置不应从网上复制一份“最严格大全”。先使用框架或运行时官方模板，再逐项理解。

[click:4] strict 是底线；两个额外选项让索引和可选属性更符合真实运行时；Vite 项目通常让 TypeScript 只检查，由 bundler 负责发射。
[click] moduleResolution、lib 和项目引用必须结合实际环境决定。
-->

---
layout: default
---

# 日常工作流：把类型检查放进最短反馈环

<div class="workflow mt-7">
  <div class="workflow-item"><carbon:edit /><strong>编辑器</strong><span>即时诊断与重构</span></div>
  <carbon:arrow-right />
  <div v-click class="workflow-item"><carbon:terminal /><strong>本地</strong><span>`tsc --noEmit` / `vue-tsc`</span></div>
  <carbon:arrow-right />
  <div v-click class="workflow-item"><carbon:test-tool /><strong>测试</strong><span>验证运行时行为</span></div>
  <carbon:arrow-right />
  <div v-click class="workflow-item"><carbon:continuous-deployment /><strong>CI</strong><span>锁定跨包契约</span></div>
</div>

<div class="grid grid-cols-3 gap-4 mt-9">
  <div v-click class="fact"><strong>少用断言</strong><span>优先窄化、守卫与 schema</span></div>
  <div v-click class="fact"><strong>别追求零 `unknown`</strong><span>它是边界的诚实标记</span></div>
  <div v-click class="fact"><strong>类型不代替测试</strong><span>值域与副作用仍需执行验证</span></div>
</div>

<!--
类型检查越靠近编辑动作，修复成本越低。编辑器给即时反馈，本地命令覆盖整个项目，测试负责类型无法证明的运行时行为，CI 则防止跨包契约被破坏。

[click:3] 三条审查原则：看到断言先问能否窄化；unknown 是正确的边界设计；通过类型检查不代表业务行为正确。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>能推断就不重复</strong><small>显式声明公共关系</small></div>
  <div><span>02</span><strong>用联合表达状态</strong><small>让非法组合无法出现</small></div>
  <div><span>03</span><strong>用泛型保留关系</strong><small>不是给类型起临时名字</small></div>
  <div><span>04</span><strong>在边界验证 `unknown`</strong><small>类型擦除后，数据仍需检查</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://www.typescriptlang.org/docs/handbook/intro.html" target="_blank"><carbon:book /> Handbook</a>
  <a href="https://www.typescriptlang.org/play" target="_blank"><carbon:play-filled-alt /> Playground</a>
  <a href="https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/" target="_blank"><carbon:rocket /> 7.0 发布说明</a>
</div>

<!--
最后用四句话复盘：让推断减少噪音；用可辨识联合建模状态；用泛型保留输入输出关系；把外部数据当 unknown 并在边界验证。

掌握这四条以后，再学习条件类型、模板字面量和框架类型工具，就有稳定的判断基座。
-->
