---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Angular
info: |
  Presentation Angular 21 for frontend developers.

  Learn more at [https://angular.dev](https://angular.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:angular-icon class="text-7xl" />
</div>

<br/>

## Angular 21：Signals 默认 + Zoneless 默认 + Standalone 唯一

企业级一体化框架，从 NgModule 时代彻底跨入 Signal 时代

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Angular 21。

Google 自 2016 年起持续维护的企业级前端框架，2026.5 的 v21 已经把 Signals / Zoneless / Standalone / 新控制流四件大事全部稳定化。
-->

---
transition: fade-out
---

# 什么是 Angular？

Google 主导的企业级 TS 框架，从 2016 年 Angular 2 重写起一直按半年大版本迭代

<v-click>

- **企业级一体化**：路由 / 表单 / HTTP / DI / i18n / SSR / Service Worker 全部官方内置
- **TypeScript 一等公民**：从 v1 起就是 TS-only，模板属性绑定也有完整类型检查
- **依赖注入设计严谨**：Hierarchical Injector + `inject()` 函数，强类型 Provider 体系
- **CLI 生态最完整**：`ng new` / `ng generate` / `ng add` / `ng update`（自动 codemod）一条龙
- **Signals 时代**：v17+ 引入，v21 默认 Zoneless，从全树脏检查迁移到细粒度推送
- **企业 UI 库丰富**：Angular Material（M3）/ CDK / PrimeNG / NG-ZORRO / Clarity 都很成熟

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Angular_](https://angular.dev/)

</div>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 评价

优点是「企业级一体化 + TS 强类型」，缺点是「学习曲线 + bundle 体积」

<v-clicks>

**优点**
- 路由 / 表单 / HTTP / DI / SSR / i18n / SW 全官方，零选型决策疲劳
- 大版本迁移有 `ng update` 自动 codemod 保障，从 v14 → v21 一条命令
- DI 设计比 React Context / Vue provide-inject 强一档（强类型 + Hierarchical）
- Ivy 编译器 + 新控制流 + Signals，性能逼近 Solid / Svelte
- Material / CDK / NgRx / Nx 企业级配套最完整

**缺点**
- 学习曲线陡（DI / 装饰器 / RxJS / Zone / Modules / 编译时模板叠加）
- bundle 体积偏大（默认 Hello World ~150KB gzip，约 React / Vue 的 2-3 倍）
- 历史包袱重（v8-v15 的 NgModule + `*ngIf` 老代码还活在大量项目里）
- 国际人才市场偏弱（独立开发者 / 创业公司选择较少）
- Zoneless 仍处于过渡期，第三方库适配需要时间

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键变化 |
|---|---|---|
| **2** / **9** | 2016.9 / 2020.2 | 重写为 TypeScript / **Ivy 默认** |
| **14** / **15** | 2022 | `inject()` / **Standalone 稳定** + `provideRouter` |
| **16** / **17** | 2023 | **Signals** + `DestroyRef` / **`@if` `@for` `@defer`** |
| **18** / **19** | 2024 | 控制流稳定 + `@let` / `linkedSignal` + `resource` |
| **20** / **21** | 2025 / 2026.5 | Zoneless 稳定 / **Zoneless 默认** + 新 builder |

<v-click>

**今天默认讲 v21**。看到老资料讲 `*ngIf` / `NgModule` 是 v15 之前的写法，可读但不主流。

</v-click>

---
transition: slide-up
---

# Angular 不是 AngularJS

| 维度 | AngularJS（v1.x） | Angular（v2+） |
|------|------------------|---------------|
| 语言 | JavaScript ES5 | TypeScript |
| 模板 | HTML + `ng-*` 指令 | 强类型模板编译 |
| 数据绑定 | scope + `$digest` 脏检查 | Zone.js / Signals（v17+） |
| 模块化 | `angular.module()` | NgModule / Standalone |
| 当前状态 | EOL（2022.1） | LTS 半年大版本，2026 已 v21 |

<v-click>

> AngularJS 1.x 已于 2022.1 EOL。现代「Angular」资料默认指 v2+——2016 年 TS 重写的新框架，不是 v1 升级版。

</v-click>

---
transition: slide-up
---

# 心智模型：一句话总结

**编译时把模板转成强类型实例化函数，运行时按 Signal / Zone 驱动局部更新**

```
*.ts + *.html → Ivy 编译器 → ComponentDef + render function（LView/TView）
              → 强类型 vnode + DI 树 + Signal 反应图
```

<v-click>

对比 React / Vue：

| 维度 | Angular 21 | Vue 3 | React 19 |
|---|---|---|---|
| 模板 | 编译期 + 强类型 | 编译期 + patchFlag | JSX 全运行时 |
| 响应式 | Signal + Zone | Proxy 自动追踪 | useState + 手动 |
| DI | Hierarchical（强类型） | provide / inject | Context |
| 范式 | OOP + 装饰器 | SFC + Composition | FP + Hooks |

</v-click>

---
transition: slide-up
---

# 快速开始

```bash
# 推荐：Angular CLI（交互式询问 SCSS / SSR / AI tools）
pnpm dlx @angular/cli@latest new my-app --package-manager=pnpm
cd my-app && pnpm start    # 浏览器 http://localhost:4200
```

<v-click>

```
my-app/
├── src/app/{app.config.ts, app.routes.ts, app.ts, app.html, app.scss}
├── src/{main.ts, styles.scss, index.html}
├── public/                     # 不经构建的静态资源（v17+）
├── angular.json                # CLI 工作空间配置
└── package.json
```

</v-click>

<v-click>

要求 Node 20.19+ / 22.12+。HMR 默认开启，保存即热更。

</v-click>

---
transition: slide-up
---

# ng new 关键标志

| 标志 | 用途 |
|------|------|
| `--standalone` / `--routing` / `--strict` | standalone / 路由 / 严格模式（默认 true） |
| `--ssr` / `--no-ssr` | 启用 / 关闭 SSR |
| `--style=scss\|sass\|less\|css` | 样式语言 |
| `--package-manager=pnpm` | 包管理器 |
| `--inline-template` / `--minimal` / `--skip-git` | 内联模板 / 最小骨架 / 不初始化 Git |

<v-click>

```bash
ng config -g cli.packageManager pnpm    # 强制 CLI 默认 pnpm
```

</v-click>

---
transition: slide-up
---

# 第一个 Standalone 组件

```ts
import { Component, input, output, signal } from '@angular/core'

@Component({
  selector: 'app-hello-button',
  template: `
    <button [disabled]="disabled()" (click)="handleClick()">
      {{ label() }} ({{ count() }})
    </button>
  `,
  styles: `button { padding: 8px 16px; background: #dd0031; color: white; }`,
})
export class HelloButton {
  label = input.required<string>()             // Signal-based 输入
  disabled = input(false)
  clicked = output<{ ts: number }>()           // Signal-based 输出
  count = signal(0)

  handleClick() {
    this.count.update(c => c + 1)
    this.clicked.emit({ ts: Date.now() })
  }
}
```

---
transition: slide-up
---

# Standalone：v15+ 引入 / v17 默认 / v20+ 唯一

```ts
@Component({
  selector: 'app-user-page',
  imports: [UserCard, RouterLink, FormsModule, CommonModule],   // 显式列出依赖
  template: `
    <app-user-card [user]="user" />
    <a routerLink="/home">Home</a>
    <input [(ngModel)]="search" />
  `,
})
export class UserPage {}
```

<v-click>

**没有 NgModule**：组件 / 指令 / 管道 / RouterLink / FormsModule 全部在 `imports` 中显式声明。未导入 → `NG8001: 'app-user-card' is not a known element`。

</v-click>

<v-click>

> 💡 迁移工具：`ng generate @angular/core:standalone` 自动把组件转 standalone / 删 NgModule。

</v-click>

---
transition: slide-up
---

# @Component 装饰器选项

| 选项 | 用途 |
|------|------|
| `selector` / `template` / `styles` | 选择器 / 模板 / 样式（v17+ `styleUrl` 单数） |
| `imports` / `host` | 依赖 / 宿主属性 + 事件（取代 `@HostBinding` / `@HostListener`） |
| `changeDetection` / `encapsulation` | `OnPush`（推荐）/ `Emulated`/`None`/`ShadowDom` |

<v-click>

```ts
@Component({ selector: 'app-user-card' })          // 标签
@Component({ selector: '[appHighlight]' })          // 属性
@Component({ selector: 'button[appConfirm]' })      // 组合
```

</v-click>

---
transition: slide-up
---

# 模板语法核心

```html
<!-- 文本插值（仅表达式，禁用赋值 / new / 自增） -->
<span>{{ message }}</span>
<span>{{ user.name + ' (' + user.age + ')' }}</span>
<span>{{ count > 10 ? 'large' : 'small' }}</span>

<!-- 属性绑定 [prop] -->
<img [src]="imgUrl" [alt]="imgAlt" />
<button [disabled]="isLoading">Submit</button>

<!-- 显式 attribute（DOM property 无对应时） -->
<td [attr.colspan]="span"></td>
<svg [attr.viewBox]="viewBox"></svg>

<!-- 事件绑定 (event) -->
<button (click)="onClick()">Click</button>
<input (keyup.enter)="submit()" />               <!-- 键盘修饰符 -->
<input (keydown.control.shift.s)="save()" />

<!-- class / style 绑定 -->
<div [class.active]="isActive" [class]="cssClasses"></div>
<div [style.color]="textColor" [style.font-size.px]="fontSize"></div>
```

---
transition: slide-up
---

# 双向绑定

```ts
@Component({
  imports: [FormsModule],
  template: `<input [(ngModel)]="name" /><p>Hello, {{ name() }}!</p>`,
})
export class FormCmp {
  name = signal('')
}
```

<v-click>

**`[(value)]` 语法糖**：等价于 `[value]="x" (valueChange)="x.set($event)"`。和 Vue `v-model` 模式相同，但 Angular 是显式「属性 + 事件」组合。

</v-click>

<v-click>

```ts
// 自定义 model（v17.2+，推荐）
export class Toggle {
  checked = model(false)                    // 创建双向 Signal
}
// 父组件 <app-toggle [(checked)]="isOn" />
```

</v-click>

---
transition: slide-up
---

# 新控制流（v17+）

v17 之前用 `*ngIf` / `*ngFor` / `*ngSwitch` 结构指令，v17 起官方推荐**模板控制流块**

```html
@if (user.role === 'admin') {
  <admin-panel />
} @else if (user.role === 'editor') {
  <editor-panel />
} @else {
  <viewer-panel />
}

@if (currentUser(); as user) {     <!-- 别名 -->
  <p>Hi, {{ user.name }}</p>
}
```

<v-click>

**为什么**：编译时知道分支边界，编译器优化更激进、bundle 更小、类型推导更准（不需要 `ngTemplateContextGuard`）。

</v-click>

<v-click>

> 💡 **迁移工具**
>
> 官方提供 schematic 自动改写：
>
> ```bash
> ng g @angular/core:control-flow
> ```

</v-click>

---
transition: slide-up
---

# @for 完整语法

```html
@for (item of items(); track item.id) {
  <li>{{ $index }}: {{ item.name }}</li>
} @empty {
  <p>No items</p>
}
```

<v-click>

**`track` 必填**——告诉 Angular 用什么作为唯一标识（对应 Vue `:key`）：

```html
<!-- 唯一 ID（首选） -->
@for (user of users(); track user.id) { ... }

<!-- 不可变值（引用比较） -->
@for (chip of chips; track chip) { ... }

<!-- 兜底（不推荐，顺序变化时全部重建） -->
@for (item of items; track $index) { ... }
```

</v-click>

<v-click>

上下文变量：`$index` / `$count` / `$first` / `$last` / `$even` / `$odd`，可用 `let` 别名：

```html
@for (user of users(); track user.id; let idx = $index, isFirst = $first) {
  <div [class.first]="isFirst">{{ idx }}. {{ user.name }}</div>
}
```

</v-click>

---
transition: slide-up
---

# @switch / @defer

```html
@switch (user.role) {
  @case ('admin') { <admin-panel /> }
  @case ('editor') { <editor-panel /> }
  @case ('viewer') { <viewer-panel /> }
  @default { <not-allowed /> }
}
```

<v-click>

```html
@defer (on viewport; prefetch on idle) {
  <large-chart [data]="data()" />
} @placeholder (minimum 500ms) {
  <skeleton-card />
} @loading (after 100ms; minimum 1s) {
  <spinner />
} @error {
  <p>Failed to load</p>
}
```

</v-click>

<v-click>

`@defer` 触发器：`idle`（默认）/ `viewport` / `interaction` / `hover` / `immediate` / `timer(500ms)` / `when condition`。编译期生成单独 chunk，触发时才下载组件代码——首屏外的大组件用它最香。

</v-click>

---
transition: slide-up
---

# @let 模板变量（v18+）

模板内声明局部变量，避免重复表达式：

```html
@let total = items().reduce((s, i) => s + i.price * i.qty, 0)
@let discount = total > 100 ? total * 0.1 : 0
@let final = total - discount

<p>Total: {{ total | currency }}</p>
<p>Discount: {{ discount | currency }}</p>
<p>Final: <strong>{{ final | currency }}</strong></p>
```

<v-click>

**为什么**：

```html
<!-- ❌ 老写法：computed 在 .ts，模板里重复访问 -->
<p>{{ total() | currency }}</p>
<p>{{ total() | currency }}</p>      <!-- 多次重算？不，computed 有缓存 -->

<!-- ✅ 用 @let 让模板自解释，且作用域局限 -->
@let total = computeTotal()
<p>{{ total | currency }}</p>
```

</v-click>

<v-click>

> 💡 **作用域**
>
> `@let` 是块级作用域（与 `@if` / `@for` 一致），不会污染父模板。声明顺序也重要——后声明能用前声明。

</v-click>

---
transition: slide-up
---

# Signals：v17 引入、v21 全面采用

Signal 是 Angular 的细粒度响应式原语，对标 Vue `ref` / Solid Signal / React `useState`

```ts
import { signal, computed, effect } from '@angular/core'

// 1. signal —— 可写
const count = signal(0)
count()                       // 读：函数调用（不是 .value）
count.set(5)                  // 写：直接设值
count.update(c => c + 1)      // 写：基于旧值

// 2. computed —— 派生只读，带缓存
const doubled = computed(() => count() * 2)
console.log(doubled())        // 10

// 3. effect —— 副作用，自动追踪依赖
effect(() => {
  console.log('count is:', count())   // count 变化触发
})

count.set(7)                  // → 触发 effect 打印 "count is: 7"
```

<v-click>

`computed` 是 **lazy + memoized**：从未读时不执行，依赖未变时多次读返回缓存。

</v-click>

---
transition: slide-up
---

# Signals 在组件中

```ts
@Component({
  template: `<p>{{ count() }} / doubled: {{ doubled() }}</p>
             <button (click)="increment()">+1</button>`,
})
export class Counter {
  count = signal(0)
  doubled = computed(() => this.count() * 2)
  increment() { this.count.update(c => c + 1) }

  constructor() {
    // effect 必须在 injection context（构造函数）内创建
    effect(() => console.log('count:', this.count()))
  }
}
```

<v-click>

> 💡 `effect` 内不能写 signal：默认 `signal.set()` 会抛 `NG0600`。需要时显式 `{ allowSignalWrites: true }`，但通常意味设计有问题。

</v-click>

---
transition: slide-up
---

# untracked 与 effect 调试

```ts
const count = signal(0)
const log = signal<string[]>([])

effect(() => {
  const c = count()
  const old = untracked(log)    // 读 log 但不订阅其变化
  log.set([...old, `count=${c}`])
})
```

<v-click>

**调度细节**：

- Effect 非同步——默认在**下一个 microtask** 集中跑
- 连续修改同一 signal 只触发一次 effect
- 组件销毁时自动停止；也可手动 `effectRef.destroy()`

```ts
effect((onCleanup) => {
  const id = setInterval(() => { /* ... */ }, 1000)
  onCleanup(() => clearInterval(id))
})
```

</v-click>

---
transition: slide-up
---

# linkedSignal（v19 稳定）

「与其它 signal 相关联但可被手动覆盖」的 signal：

```ts
const shippingOptions = signal(['Standard', 'Express'])
const selected = linkedSignal(() => shippingOptions()[0])   // 跟随第一个

selected()                        // 'Standard'
selected.set('Express')           // 用户手动改
shippingOptions.set(['A', 'B'])   // 选项变了，selected 重置为 'A'
```

<v-click>

```ts
// 完整 API：可访问 previous
const sel = linkedSignal<string[], string>({
  source: shippingOptions,
  computation: (next, previous) =>
    previous && next.includes(previous.value) ? previous.value : next[0],
})
```

</v-click>

<v-click>

**应用场景**：表单初始值跟随 props / tab 跟随路由 / 列表选中项跟随数据。

</v-click>

---
transition: slide-up
---

# resource API（v19 引入，experimental）

异步数据流的 signal 化：

```ts
const userId = signal<string | undefined>(undefined)

const userResource = resource({
  params: () => ({ id: userId() }),                          // 反应式参数
  loader: async ({ params, abortSignal }) => {
    if (!params.id) return null
    const res = await fetch(`/api/users/${params.id}`, { signal: abortSignal })
    return res.json()
  },
})
```

<v-click>

```html
@if (userResource.isLoading()) { <spinner /> }
@else if (userResource.error()) { <p>{{ userResource.error()?.message }}</p> }
@else if (userResource.value(); as data) { <p>{{ data.name }}</p> }
```

</v-click>

<v-click>

> 💡 v21 仍 experimental。`abortSignal` 会在新参数到来时自动 abort 上一次请求——天然防竞态。

</v-click>

---
transition: slide-up
---

# input() 全部用法

```ts
import { input, booleanAttribute, numberAttribute } from '@angular/core'

export class Slider {
  value = input(0)                                          // 可选 + 默认值
  label = input.required<string>()                          // 必填（无默认）
  step = input<number>()                                    // 仅类型（| undefined）
  size = input(10, { transform: numberAttribute })          // 字符串 → number
  disabled = input(false, { transform: booleanAttribute })  // 布尔属性
  tag = input('', { transform: (v: string) => v.toLowerCase() })   // 自定义转换
  internalName = input('', { alias: 'name' })               // 别名
}
```

<v-click>

```html
<app-slider [value]="50" label="Volume" step="5" size="20" disabled name="vol" />
```

</v-click>

---
transition: slide-up
---

# output() 与 RxJS 互通

```ts
@Component({
  template: `<button (click)="submit()">Submit</button>`,
})
export class FormCmp {
  saved = output<{ id: number; name: string }>()
  closed = output<void>()
  submit() { this.saved.emit({ id: 1, name: 'Alice' }) }
}
```

<v-click>

```ts
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop'

// Observable → output
class Cmp {
  private clicks$ = new Subject<MouseEvent>()
  clicked = outputFromObservable(this.clicks$)
}

// output → Observable
const obs$ = outputToObservable(comp.clicked)
```

</v-click>

---
transition: slide-up
---

# viewChild() / contentChild()

```ts
@Component({
  template: `<input #search /><button #btn>One</button><button #btn>Two</button>`,
})
export class Stage {
  search = viewChild<ElementRef<HTMLInputElement>>('search')           // 可选
  searchRequired = viewChild.required<ElementRef<HTMLInputElement>>('search')  // 必填
  buttons = viewChildren<ElementRef<HTMLButtonElement>>('btn')         // 多元素

  constructor() {
    effect(() => {
      console.log('input:', this.search()?.nativeElement)             // 自动响应
    })
  }
}
```

<v-click>

**vs 旧 `@ViewChild`**：旧 API 需 `AfterViewInit` 才能拿值；新 `viewChild()` 返回 Signal，模板挂载后自动有值，不再需要生命周期接口。

</v-click>

---
transition: slide-up
---

# contentChild() —— 内容投影

「Content」是父组件投影到 `<ng-content>` 中的节点：

```ts
@Component({ selector: 'app-tab-group', template: `<ng-content />` })
export class TabGroup {
  tabs = contentChildren(Tab)        // 查询父组件投影进来的 <app-tab>
}

@Component({ selector: 'app-tab', template: `...` })
export class Tab {
  title = input.required<string>()
}
```

<v-click>

```html
<app-tab-group>
  <app-tab title="One">Content 1</app-tab>
  <app-tab title="Two">Content 2</app-tab>
</app-tab-group>
```

</v-click>

<v-click>

`read` 选项：指定要读取的 token 类型

```ts
form = viewChild('myForm', { read: NgForm })
template = viewChild('tmpl', { read: TemplateRef })
```

</v-click>

---
transition: slide-up
---

# Signal-based API 全景

| 函数 | 用途 | 替代旧 API |
|---|---|---|
| `signal` / `computed` / `effect` | 状态 / 派生 / 副作用 | `BehaviorSubject` / `subscribe` |
| `linkedSignal` | 可手动覆盖的派生 | （无） |
| `resource` / `httpResource` | 异步资源 | `HttpClient` + `tap` |
| `input` / `output` / `model` | 输入 / 输出 / 双向 | `@Input` / `@Output` |
| `viewChild` / `contentChild` | 视图 / 内容查询 | `@ViewChild` / `@ContentChild` |
| `toSignal` / `toObservable` | RxJS ↔ Signal 互通 | （新增） |

<v-click>

> 💡 旧装饰器仍兼容，但新代码应全面切换到函数式 API——类型推断更稳、与 Signal 反应图天然集成。

</v-click>

---
transition: slide-up
---

# 父子通信：input / output / model

```ts
// 父 → 子：input
@Component({ template: `<p>{{ name() }}</p>` })
export class Child {
  name = input.required<string>()
}
// 父: <app-child [name]="userName" />
```

```ts
// 子 → 父：output
@Component({ template: `<button (click)="save()">Save</button>` })
export class Child {
  saved = output<string>()
  save() { this.saved.emit('done') }
}
// 父: <app-child (saved)="onSaved($event)" />
```

<v-click>

```ts
// 双向：model
@Component({
  template: `<button (click)="checked.set(!checked())">{{ checked() }}</button>`,
})
export class Child {
  checked = model(false)
}
// 父: <app-child [(checked)]="isOn" />
//   等价于 [checked]="isOn()" (checkedChange)="isOn.set($event)"
```

</v-click>

---
transition: slide-up
---

# 内容投影（Content Projection）

类似 Vue slot / React children：

```ts
@Component({
  selector: 'app-card',
  template: `<div class="card"><ng-content /></div>`,
})
export class Card {}
```

```html
<app-card><h2>Title</h2><p>Body</p></app-card>
```

<v-click>

**多槽（具名）**：

```ts
@Component({
  template: `<header><ng-content select="[slot=header]" /></header>
             <main><ng-content /></main>
             <footer><ng-content select="[slot=footer]" /></footer>`,
})
```

```html
<app-page>
  <h1 slot="header">Welcome</h1>
  <small slot="footer">© 2026</small>
</app-page>
```

</v-click>

---
transition: slide-up
---

# 经典生命周期接口

| Hook | 时机 |
|------|------|
| `ngOnChanges` / `ngOnInit` | 输入变化（每次）/ 首次初始化（一次） |
| `ngDoCheck` | 每次变更检测前（性能敏感） |
| `ngAfterContentInit` / `Checked` | 内容投影初始化 / 检测后 |
| `ngAfterViewInit` / `Checked` | 视图初始化 / 检测后 |
| `ngOnDestroy` | 销毁前（一次） |

<v-click>

```ts
export class Demo implements OnInit, OnDestroy {
  id = input.required<string>()
  ngOnInit() { console.log('init, id =', this.id()) }
  ngOnDestroy() { console.log('destroy') }
}
```

</v-click>

---
transition: slide-up
---

# afterNextRender / DestroyRef

新的渲染回调（v16+，**不在 SSR 服务端运行**）：

```ts
export class Cmp {
  constructor() {
    afterNextRender(() => console.log('First paint done'))      // 首次渲染（一次）
    afterEveryRender(() => { /* 取代 ngAfterViewChecked */ })   // 每次渲染
  }
}
```

<v-click>

`DestroyRef`（v16+）替代 `OnDestroy` 接口：

```ts
export class Cmp {
  private destroyRef = inject(DestroyRef)
  constructor() {
    const sub = someObservable$.subscribe()
    this.destroyRef.onDestroy(() => sub.unsubscribe())
  }
}
```

</v-click>

---
transition: slide-up
---

# 依赖注入（DI）：核心抽象

```ts
@Injectable({ providedIn: 'root' })   // 全局单例（推荐）
export class UserService {
  getCurrent() { return { name: 'Alice' } }
}
```

<v-click>

`providedIn` 可选值：

| 值 | 含义 |
|----|------|
| `'root'` | 全局单例（懒加载也共用） |
| `'platform'` | 多 Angular 应用之间共享 |
| `'any'` | 每个懒加载模块独立实例 |

</v-click>

<v-click>

不传 `providedIn`，必须显式注册到组件 / app 的 `providers`：

```ts
@Component({ providers: [UserService] })   // 仅此组件树共享一个实例
```

</v-click>

---
transition: slide-up
---

# inject() 函数（v14+ 推荐）

```ts
export class Profile {
  private user = inject(UserService)    // 字段初始化时即注入，类型自动推断
  current = this.user.getCurrent()
}
```

<v-click>

vs 旧 constructor 注入：

```ts
export class Profile {
  constructor(private user: UserService) {}
}
```

</v-click>

<v-click>

**优势**：不需要 constructor 样板 / 可在工厂函数 / `provideXxx` 内使用 / 类型推断更稳 / 推荐在新代码全面切换。

</v-click>

---
transition: slide-up
---

# InjectionToken 与 Provider

非 class 类型（接口、字面量、配置对象）注入：

```ts
export interface AppConfig { apiUrl: string; debug: boolean }

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({ apiUrl: '/api', debug: false }),
})

// 使用：private config = inject(APP_CONFIG)
```

<v-click>

**Provider 配置方式**：

```ts
providers: [
  UserService,                                          // useClass 简写
  { provide: API_URL, useValue: '/api/v2' },            // useValue
  { provide: TIMER, useFactory: () => new Timer() },    // useFactory
  { provide: ILogger, useExisting: ConsoleLogger },     // useExisting（别名）
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },  // multi
]
```

</v-click>

---
transition: slide-up
---

# inject() 配置选项

```ts
class Cmp {
  optional = inject(MaybeMissingService, { optional: true })    // 无 provider → null
  parent = inject(ParentService, { skipSelf: true })            // 跳过当前 injector
  self = inject(SelfService, { self: true })                    // 仅当前 injector
  host = inject(HostService, { host: true })                    // 指令注入宿主组件
}
```

<v-click>

**层次化 Injector**：

```
Root Injector (providedIn: 'root')
  ├─ Lazy Module Injector
  └─ Component Injector → Sub-component Injector
```

子组件 `inject(X)`：自己 `providers` → 父 → 祖先 → root → `NullInjectorError`。

</v-click>

---
transition: slide-up
---

# Hierarchical DI：组件级 provider

```ts
@Component({
  providers: [WizardState],   // 每个 wizard 实例独立 state
  template: `<step-one /> <step-two /> <step-three />`,
})
export class FormWizard {}
// step-one/two/three 通过 inject(WizardState) 拿同一实例
```

<v-click>

**vs React Context / Vue provide-inject**：

| 维度 | Angular DI | React Context | Vue provide-inject |
|---|---|---|---|
| 类型推导 | 强 | 中 | 中 |
| 自动单例 | ✅ | 需手动 | 需手动 |
| Tree-shaking | ✅（`providedIn: 'root'`） | ❌ | ❌ |
| 测试替换 | ✅ override providers | ⚠️ | ⚠️ |

</v-click>

---
transition: slide-up
---

# 路由：provideRouter

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then(m => m.Home) },
  { path: 'users', loadComponent: () => import('./pages/users').then(m => m.Users) },
  { path: 'users/:id', loadComponent: () => import('./pages/user').then(m => m.User) },
  { path: '**', loadComponent: () => import('./pages/not-found').then(m => m.NotFound) },
]
```

```ts
// src/app/app.config.ts
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),    // 路由参数自动绑定到 input()
      withViewTransitions(),          // CSS view transitions
    ),
  ],
}
```

---
transition: slide-up
---

# 路由：导航与链接

```html
<a routerLink="/users">Users</a>
<a [routerLink]="['/users', userId]" [queryParams]="{ page: 2 }">User</a>
<a routerLink="/home" routerLinkActive="active">Home</a>            <!-- 当前激活 -->
<a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Root</a>

<router-outlet />                          <!-- 路由出口 -->
<router-outlet name="sidebar" />           <!-- 多 outlet -->
```

<v-click>

```ts
// 编程式
class Cmp {
  private router = inject(Router)
  goUser(id: number) {
    this.router.navigate(['/users', id], { queryParams: { tab: 'info' } })
  }
}
```

</v-click>

---
transition: slide-up
---

# withComponentInputBinding()（v16+）

路由参数自动绑定到 `input()`，**取代手动订阅 ActivatedRoute**：

```ts
provideRouter(routes, withComponentInputBinding())

export class UserPage {
  id = input<string>()      // 路径参数 :id 自动绑定（同名）
  tab = input<string>()     // queryParam ?tab=info 自动绑定
  role = input<string>()    // 路由 data 也可
}
```

<v-click>

```ts
// ❌ 旧 ActivatedRoute 订阅样板
export class UserPage {
  private route = inject(ActivatedRoute)
  id$ = this.route.paramMap.pipe(map(p => p.get('id')))
  id = toSignal(this.id$, { initialValue: null })
}
// ✅ 新写法一行 input()
```

</v-click>

---
transition: slide-up
---

# 路由守卫（函数式，v15+）

```ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  if (auth.isLoggedIn()) return true
  return router.createUrlTree(['/login'], { queryParams: { from: state.url } })
}
```

<v-click>

| 守卫 | 用途 |
|------|------|
| `CanActivateFn` / `CanActivateChildFn` | 能否激活路由 / 子路由 |
| `CanDeactivateFn<Cmp>` | 能否离开（脏表单提示） |
| `CanMatchFn` / `ResolveFn<T>` | 是否匹配 / 进入前预取数据 |

</v-click>

<v-click>

```ts
{ path: 'profile', canActivate: [authGuard], loadComponent: () => import('./profile') }
```

</v-click>

---
transition: slide-up
---

# 路由：懒加载与 Resolve

```ts
// 组件 / 子路由懒加载（v14+ 推荐）
{ path: 'admin', loadComponent: () => import('./pages/admin').then(m => m.Admin) }
{ path: 'admin', loadChildren: () => import('./admin/routes').then(m => m.adminRoutes) }
```

<v-click>

**Resolve 示例**：

```ts
export const userResolver: ResolveFn<User> = (route) =>
  inject(ApiService).getUser(route.paramMap.get('id')!)

{
  path: 'users/:id',
  resolve: { user: userResolver },
  loadComponent: () => import('./pages/user').then(m => m.User),
}

// 组件内（配合 withComponentInputBinding）
export class User {
  user = input.required<User>()    // 自动从 resolve 数据注入
}
```

</v-click>

---
transition: slide-up
---

# 路由：预加载策略

```ts
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router'

// 全部预加载
provideRouter(routes, withPreloading(PreloadAllModules))
```

<v-click>

```ts
// 或自定义策略
import { PreloadingStrategy, Route } from '@angular/router'
import { Observable, of } from 'rxjs'

class PreloadOnHover implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>) {
    return route.data?.['preload'] ? load() : of(null)
  }
}

provideRouter(routes, withPreloading(PreloadOnHover))
```

</v-click>

<v-click>

**`withViewTransitions()`（v17+）**：启用浏览器 View Transitions API（路由切换有原生过渡动画）

```ts
provideRouter(routes, withViewTransitions())
```

仅 Chromium 系支持，其它浏览器自动回退。

</v-click>

---
transition: slide-up
---

# HTTP 客户端：provideHttpClient

```ts
// app.config.ts
provideHttpClient(
  withFetch(),                          // 用 fetch API 代替 XHR（v17+）
  withInterceptors([authInterceptor]),  // 函数式拦截器
)
```

<v-click>

基本 CRUD：

```ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient)
  private base = '/api/users'
  list() { return this.http.get<User[]>(this.base) }
  get(id: number) { return this.http.get<User>(`${this.base}/${id}`) }
  create(data: Omit<User, 'id'>) { return this.http.post<User>(this.base, data) }
  update(id: number, data: Partial<User>) { return this.http.patch<User>(`${this.base}/${id}`, data) }
  delete(id: number) { return this.http.delete<void>(`${this.base}/${id}`) }
}
```

</v-click>

---
transition: slide-up
---

# 函数式拦截器（v15+）

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token()
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req
  return next(authReq)
}
```

<v-click>

```ts
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const t0 = performance.now()
  return next(req).pipe(
    tap(event => {
      if (event.type === 4) console.log('←', req.url, performance.now() - t0)
    }),
  )
}
```

</v-click>

<v-click>

```ts
provideHttpClient(withInterceptors([loggingInterceptor, authInterceptor]))   // 顺序即执行顺序
```

</v-click>

---
transition: slide-up
---

# 错误处理 + 全局错误拦截器

```ts
this.http.get<User>(`/api/users/${id}`).pipe(
  catchError((err: HttpErrorResponse) => {
    if (err.status === 404) return of(null)
    return throwError(() => err)
  }),
)
```

<v-click>

全局错误拦截器：

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService)
  const router = inject(Router)
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) router.navigate(['/login'])
      else toast.error(err.message)
      return throwError(() => err)
    }),
  )
}
```

</v-click>

---
transition: slide-up
---

# httpResource（v19 experimental）

把 HTTP 请求直接转 signal resource：

```ts
export class UserView {
  userId = input.required<string>()
  user = httpResource<User>(() => `/api/users/${this.userId()}`)
  // user.value() / user.isLoading() / user.error() / user.reload()
}
```

<v-click>

```html
@if (user.isLoading()) { <spinner /> }
@else if (user.error()) { <p>{{ user.error()?.message }}</p> }
@else if (user.value(); as data) { <p>{{ data.name }}</p> }
```

</v-click>

<v-click>

```ts
// 完整请求配置
user = httpResource<User>(() => ({
  url: `/api/users/${this.userId()}`, method: 'GET',
  headers: { 'X-Trace': '1' }, params: { include: 'profile' },
}))
```

</v-click>

---
transition: slide-up
---

# Forms：Template-driven

适合简单表单（注册 / 登录）：

```ts
@Component({
  imports: [FormsModule],
  template: `
    <form #f="ngForm" (ngSubmit)="onSubmit(f)">
      <input name="email" type="email" [(ngModel)]="email" required email
             #emailRef="ngModel" />
      @if (emailRef.invalid && emailRef.touched) {
        <p class="error">
          @if (emailRef.errors?.['required']) { Email is required }
          @if (emailRef.errors?.['email']) { Invalid email }
        </p>
      }
      <button [disabled]="f.invalid">Sign Up</button>
    </form>
  `,
})
export class Signup {
  email = signal('')
  onSubmit(f: NgForm) { console.log(f.value) }
}
```

---
transition: slide-up
---

# Forms：Reactive Forms

适合复杂表单 / 动态字段 / 大量校验：

```ts
@Component({
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <input formControlName="name" />
      <input formControlName="email" />
      <button [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class Profile {
  private fb = inject(FormBuilder)
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phones: this.fb.nonNullable.array<string>([]),
  })
  save() { console.log(this.form.value) }
}
```

---
transition: slide-up
---

# Typed Forms（v14+ 默认）

`FormControl<T>` / `FormGroup<T>` 全程类型安全：

```ts
// 显式 / 非 null
const email = new FormControl<string | null>('', Validators.required)  // FormControl<string | null>
const name = new FormControl('', { nonNullable: true, validators: Validators.required })  // FormControl<string>

// FormGroup 类型化
interface ProfileForm {
  name: FormControl<string>
  age: FormControl<number | null>
}
const form = new FormGroup<ProfileForm>({
  name: new FormControl('', { nonNullable: true }),
  age: new FormControl<number | null>(null),
})
form.controls.name.value   // string
form.getRawValue()         // { name: string; age: number | null }
```

---
transition: slide-up
---

# 自定义校验器

```ts
// 同步
export function noSpaces(c: AbstractControl): ValidationErrors | null {
  return /\s/.test(c.value) ? { noSpaces: true } : null
}

// 带参数
export function minWords(min: number): ValidatorFn {
  return (c) => {
    const words = (c.value || '').trim().split(/\s+/)
    return words.length < min ? { minWords: { min, actual: words.length } } : null
  }
}

// 异步
export function uniqueUsername(api: ApiService): AsyncValidatorFn {
  return (c) => api.checkUsername(c.value).pipe(map(exists => exists ? { taken: true } : null))
}
```

<v-click>

```ts
fb.nonNullable.group({
  username: ['', [Validators.required, noSpaces], [uniqueUsername(api)]],
  bio: ['', minWords(3)],
})
```

</v-click>

---
transition: slide-up
---

# Signal Forms（v20 实验 / v21 developer preview）

基于 Signals 的全新表单 API（`@angular/forms/signals`）：

```ts
import { form, required, email } from '@angular/forms/signals'

const userModel = signal({ name: '', email: '' })
const f = form(userModel, {
  name: { validators: [required()] },
  email: { validators: [required(), email()] },
})
// 模板：f().valid / f.name().value / f.name().errors
```

<v-click>

> 💡 v21 升级为 developer preview，API 仍可能调整，**生产慎用**。方向：表单完全建在 Signal 之上，告别 RxJS-based Reactive Forms 样板。

</v-click>

<v-click>

**对比 Reactive Forms**：不需要 `FormBuilder` / `FormGroup` / `FormControl` 三层封装；直接基于 model signal，valid / touched / dirty 都是 Signal。

</v-click>

---
transition: slide-up
---

# RxJS 互操作：toSignal / toObservable

```ts
import { toSignal, toObservable } from '@angular/core/rxjs-interop'

export class Cmp {
  user$ = this.api.getUser()
  user = toSignal(this.user$, { initialValue: null })          // Observable → Signal
  userSync = toSignal(this.user$, { requireSync: true })       // 要求 sync 发射

  count = signal(0)
  count$ = toObservable(this.count)                            // Signal → Observable
}
```

<v-click>

`toSignal` 自动订阅 + 在 DestroyRef 销毁时退订——RxJS 接入 Signal 反应图的官方桥梁。

</v-click>

<v-click>

**rxResource（v19+）**：

```ts
userResource = rxResource({
  params: () => ({ id: this.userId() }),
  stream: ({ params }) => this.api.user$(params.id),
})
```

</v-click>

---
transition: slide-up
---

# takeUntilDestroyed（v16+）

自动在组件销毁时退订：

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

export class Cmp {
  private destroyRef = inject(DestroyRef)
  constructor() {
    interval(1000).pipe(takeUntilDestroyed()).subscribe()   // 自动绑当前 DestroyRef
  }
  start() {
    interval(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }
}
```

<v-click>

**替代了样板**：

```ts
// ❌ 老代码：手动 destroy$ Subject
class Cmp {
  private destroy$ = new Subject<void>()
  ngOnInit() { interval(1000).pipe(takeUntil(this.destroy$)).subscribe() }
  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete() }
}
```

</v-click>

---
transition: slide-up
---

# 典型 RxJS 模式：debounced 搜索

```ts
import { debounceTime, distinctUntilChanged, switchMap, of, Subject } from 'rxjs'

export class Search {
  private api = inject(ApiService)
  private query$ = new Subject<string>()
  onChange(v: string) { this.query$.next(v) }

  results = toSignal(
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q ? this.api.search(q) : of([])),
    ),
    { initialValue: [] },
  )
}
```

<v-click>

`switchMap` 自动取消上次请求；`toSignal` 把流转 Signal 供模板使用。

</v-click>

---
transition: slide-up
---

# 变更检测：Default vs OnPush

```ts
import { ChangeDetectionStrategy } from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

<v-click>

| 策略 | 触发条件 |
|---|---|
| **Default** | 每次 Zone.js 通知（事件 / setTimeout / Promise）→ 整棵树脏检查 |
| **OnPush** | 仅以下情况：1) 输入引用变化 2) 组件 / 子组件触发了事件 3) `AsyncPipe` 收到新值 4) 手动 `cdr.markForCheck()` 5) Signal 依赖变化（v17+） |

</v-click>

<v-click>

> 💡 **Zoneless 时代 OnPush 等价于默认**
>
> v21 Zoneless 模式下没有 Zone.js 触发的「整树脏检查」，所有组件本质上都按 OnPush 工作。新代码可以不写 `changeDetection: OnPush`，**但仍是好习惯**——能在 Zoned / Zoneless 之间无缝迁移。

</v-click>

---
transition: slide-up
---

# Signals 与 OnPush 完美配合

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Count: {{ count() }}</p><button (click)="inc()">+1</button>`,
})
export class Counter {
  count = signal(0)                       // signal 变化自动触发 CD，不需 markForCheck
  inc() { this.count.update(c => c + 1) }
}
```

<v-click>

**手动控制 CD**：

```ts
class Cmp {
  private cdr = inject(ChangeDetectorRef)
  triggerCheck() { this.cdr.detectChanges() }   // 立刻同步检测
  markForCheck() { this.cdr.markForCheck() }    // 标记后下次 tick 检测
  detach() { this.cdr.detach(); this.cdr.reattach() }   // 暂停 / 恢复 CD
}
```

</v-click>

---
transition: slide-up
---

# Signals 内部：Push-Pull 混合

Angular Signals 用的是 **push-pull hybrid**：

```ts
const a = signal(0)
const b = signal(0)
const sum = computed(() => a() + b())

a.set(1)         // sum dirty（push）
b.set(2)         // sum still dirty（不重算）
console.log(sum())   // 3，此时才真正算（pull）

a.set(5)         // sum dirty
console.log(sum())   // 7
```

<v-click>

- **Push**：写入 signal 时，所有依赖被标记 dirty（不立即重算）
- **Pull**：读 computed 时，发现是 dirty 才重算；不脏则返回缓存

</v-click>

<v-click>

与 React 「pull only」（每次 render 全跑）和 BehaviorSubject「push only」（每次都推下游）不同。**Push-pull 在保证最小重算的同时避免 glitch（中间不一致状态）**。

</v-click>

---
transition: slide-up
---

# Signals 内部：依赖图按需建立

Signal 的依赖关系**不是静态声明**，而是「**运行时读到谁就依赖谁**」：

```ts
const showA = signal(true)
const a = signal(10)
const b = signal(20)

const result = computed(() => showA() ? a() : b())

result()                 // 10；依赖 = { showA, a }（b 未被读到，不订阅）
showA.set(false)
result()                 // 20；依赖图重新建立 = { showA, b }
a.set(999)               // result 不脏（a 不再是依赖）
console.log(result())    // 20，未重算
```

<v-click>

与 Vue Composition API 的 `computed` 机制类似，但 Angular Signal 没有 `.value` 概念（用函数调用代替）——更接近 Solid 和 Knockout。

</v-click>

<v-click>

**Glitch-free 调度**：内部用全局版本号 + 拓扑遍历，保证所有 computed 在一次「重算 pass」内串行更新，**避免「b 是旧值 10 但 a 已经是 5」的中间状态**。

</v-click>

---
transition: slide-up
---

# Zoneless 模式（v21 默认）

**Zone.js**：monkey-patch 浏览器异步入口（`setTimeout` / `Promise` / `XHR` / DOM 事件），让 Angular 在异步完成时自动跑变更检测。

<v-click>

**代价**：bundle 多 ~30KB / 调试栈混乱 / 第三方库忘 patch 导致 CD 失效 / 严重影响 Core Web Vitals（INP / TBT）。

</v-click>

<v-click>

**Zoneless**：去掉 Zone.js，改用 Signal 驱动 CD

```ts
// app.config.ts（v20 写法，v21 默认）
export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection()],
}
// main.ts 删除 import 'zone.js'
```

</v-click>

---
transition: slide-up
---

# Zoneless 触发 CD 的机制

去掉 Zone.js 后，Angular 不再监听异步事件，而是：

- Signal 变化 → 关联组件 / `effect` 标记 dirty
- 模板事件（`(click)`）→ 当前组件标记 dirty
- 路由 / HTTP 完成 → 内部 Signal-based scheduler

<v-click>

```ts
// ❌ 在 setTimeout / Promise 里改普通字段（不触发 CD）
class Cmp {
  data: any = null
  load() { fetch('/api').then(r => r.json()).then(d => this.data = d) }
}

// ✅ 改用 signal
class Cmp {
  data = signal<any>(null)
  load() { fetch('/api').then(r => r.json()).then(d => this.data.set(d)) }
}
```

</v-click>

---
transition: slide-up
---

# Zoneless：升级检查清单

> 💡 **v21 默认 Zoneless**
>
> `ng new` 默认 Zoneless（不再生成 `polyfills.ts` 里的 `zone.js`）。老项目升级时 `ng update` 会询问是否切换。

<v-click>

升级到 Zoneless 前的检查：

1. **所有可变状态用 signal 包裹**——`data: User = null` → `data = signal<User | null>(null)`
2. **第三方库公告**中提到「Zoneless ready」/「Signal compatible」
3. dev 模式打开 `provideExperimentalCheckNoChangesForDebug` 检测未被通知的更新

</v-click>

<v-click>

```ts
// 检查未在 Angular 调度内的 task
const appRef = inject(ApplicationRef)
appRef.isStable.subscribe(stable => {
  if (!stable) console.warn('App is unstable, CD pending')
})
```

</v-click>

<v-click>

> ⚠️ **过渡期**
>
> 很多第三方库（特别是依赖 `setTimeout` / `Promise` 自动检测变更）需要时间适配。老项目升级前要测试库兼容性。

</v-click>

---
transition: slide-up
---

# SSR：创建项目

```bash
ng new my-app --ssr     # 询问会自动配 SSR
# 或为已有项目加 SSR：
ng add @angular/ssr
```

<v-click>

入口结构：

```
src/
├── app/
│   ├── app.config.ts                # 浏览器配置（共用）
│   ├── app.config.server.ts         # 服务端配置（merge）
│   ├── app.routes.ts                # 客户端路由
│   ├── app.routes.server.ts         # SSR / Prerender 配置
│   └── app.ts
├── main.ts                          # 浏览器入口
├── main.server.ts                   # 服务器入口
└── server.ts                        # Express / Node 服务器
```

</v-click>

---
transition: slide-up
---

# SSR：服务端配置

```ts
// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
}
export const config = mergeApplicationConfig(appConfig, serverConfig)
```

<v-click>

```ts
// app.routes.server.ts —— 每条路由的渲染模式
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },              // SSR
  { path: 'dashboard', renderMode: RenderMode.Client },     // CSR
  { path: 'about', renderMode: RenderMode.Prerender },      // SSG
  {
    path: 'posts/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      (await fetch('/api/posts').then(r => r.json())).map((p: any) => ({ id: p.id })),
  },
]
```

</v-click>

---
transition: slide-up
---

# Incremental Hydration（v20 稳定）

让部分组件**保持 dehydrated 状态**，直到触发条件才水合：

```ts
// app.config.ts
provideClientHydration(withIncrementalHydration())
```

```html
@defer (hydrate on viewport) {
  <heavy-chart [data]="data" />
} @placeholder {
  <div class="skeleton">Chart placeholder</div>
}
```

<v-click>

`hydrate on` 触发器：`idle` / `viewport` / `interaction` / `hover` / `immediate` / `timer(500ms)` / `when expr`。

</v-click>

<v-click>

效果：首屏 JS bundle 缩到最小（只发当前视口需要的代码）；滚动 / 交互按需补齐。

</v-click>

---
transition: slide-up
---

# SSR 中的浏览器 API

服务端没有 `window` / `document`——直接访问会崩。两种方案：

```ts
export class Cmp {
  private platformId = inject(PLATFORM_ID)

  constructor() {
    // 方案 1：守卫判断
    if (isPlatformBrowser(this.platformId)) console.log(window.innerWidth)

    // 方案 2（推荐）：afterNextRender 本身不在 SSR 跑
    afterNextRender(() => { const w = window.innerWidth })
  }
}
```

<v-click>

> 💡 第三方库（Chart.js / Quill / Echarts）SSR 时常报 `window is not defined`。规则：**任何 DOM / `window` / `document` 访问必须放在 `afterNextRender` 内**。

</v-click>

---
transition: slide-up
---

# 状态管理：Service + Signals

最轻量方案，适合中小项目：

```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<Item[]>([])

  readonly items = this._items.asReadonly()
  readonly total = computed(() => this._items().reduce((s, i) => s + i.price * i.qty, 0))
  readonly count = computed(() => this._items().reduce((n, i) => n + i.qty, 0))

  add(item: Item) {
    this._items.update(list => {
      const idx = list.findIndex(i => i.id === item.id)
      if (idx === -1) return [...list, item]
      const next = [...list]
      next[idx] = { ...next[idx], qty: next[idx].qty + item.qty }
      return next
    })
  }
  remove(id: string) { this._items.update(list => list.filter(i => i.id !== id)) }
}
```

---
transition: slide-up
---

# NgRx：Redux 风格（企业级首选）

```bash
pnpm add @ngrx/store @ngrx/effects @ngrx/entity
```

```ts
// actions
export const CounterActions = createActionGroup({
  source: 'Counter',
  events: { Increment: emptyProps(), Decrement: emptyProps(), Set: props<{ value: number }>() },
})

// reducer
export const counterReducer = createReducer(
  { count: 0 },
  on(CounterActions.increment, s => ({ ...s, count: s.count + 1 })),
  on(CounterActions.set, (s, { value }) => ({ ...s, count: value })),
)

// selector
export const selectCount = createSelector(
  createFeatureSelector<{ count: number }>('counter'), s => s.count,
)
```

---
transition: slide-up
---

# NgRx：注册与使用

```ts
// app.config.ts
import { provideStore } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ counter: counterReducer }),
    provideEffects(),
  ],
}
```

<v-click>

```ts
// 组件
import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({ /* ... */ })
export class CounterView {
  private store = inject(Store)

  count = toSignal(this.store.select(selectCount), { initialValue: 0 })

  inc() { this.store.dispatch(CounterActions.increment()) }
  dec() { this.store.dispatch(CounterActions.decrement()) }
}
```

</v-click>

---
transition: slide-up
---

# NgRx Signals（新 API）

NgRx Signal Store 完全基于 Signal，无 Action / Reducer 开销：

```ts
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals'

export const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withComputed(({ count }) => ({ doubled: computed(() => count() * 2) })),
  withMethods(store => ({
    increment: () => patchState(store, { count: store.count() + 1 }),
    reset: () => patchState(store, { count: 0 }),
  })),
)
```

<v-click>

```ts
// 组件
export class Cmp {
  store = inject(CounterStore)
  // store.count(), store.doubled(), store.increment()
}
```

</v-click>

---
transition: slide-up
---

# 状态管理选型

| 方案 | 适合 |
|---|---|
| **Service + Signals** | 中小项目 / 简单状态 |
| **NgRx Store** | 企业级 Redux 风格（Action / Reducer / Selector） |
| **NgRx Signals** | Signal 时代企业级（signalStore） |
| **Component Store** / Akita / NGXS | 局部 store / 历史项目 |

<v-click>

**经验**：新项目 → Service + Signals 或 NgRx Signals；重 Redux 习惯 → NgRx Store + `toSignal`；老项目 RxJS-heavy → Component Store。

</v-click>

<v-click>

> 💡 不要过度设计：80% Angular 项目用 Service + Signals 够用。引入 NgRx 前问问「真有跨组件 / 路由的复杂状态吗？」

</v-click>

---
transition: slide-up
---

# 完整 Signal Store 模板

```ts
@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private http = inject(HttpClient)
  private state = signal({ items: [] as Product[], loading: false, filter: '' })

  readonly items = computed(() => this.state().items)
  readonly loading = computed(() => this.state().loading)
  readonly filtered = computed(() => {
    const q = this.state().filter.toLowerCase()
    return q ? this.items().filter(p => p.name.toLowerCase().includes(q)) : this.items()
  })

  setFilter(filter: string) { this.state.update(s => ({ ...s, filter })) }

  load() {
    this.state.update(s => ({ ...s, loading: true }))
    this.http.get<Product[]>('/api/products').pipe(
      finalize(() => this.state.update(s => ({ ...s, loading: false }))),
      takeUntilDestroyed(),
    ).subscribe(items => this.state.update(s => ({ ...s, items })))
  }
}
```

---
transition: slide-up
---

# 管道（Pipes）

| 管道 | 用途 |
|------|------|
| `async` | 自动订阅 / 退订 Observable / Promise |
| `date` / `currency` / `number` / `percent` | 格式化日期 / 货币 / 数值 / 百分比 |
| `json` / `slice` / `keyvalue` | 序列化 / 切片 / 对象转数组 |
| `uppercase` / `lowercase` / `titlecase` | 字符串大小写 |

```html
<p>{{ date | date:'yyyy-MM-dd' }}</p>
<p>{{ price | currency:'USD':'symbol':'1.2-2' }}</p>
<p>{{ rate | percent:'1.0-2' }}</p>
```

<v-click>

> 💡 Signal 时代不太需要 AsyncPipe：直接 `toSignal(obs$)` 然后 <span v-pre>`{{ data() }}`</span>。

</v-click>

---
transition: slide-up
---

# 自定义 Pipe

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength = 20, suffix = '...'): string {
    if (!value || value.length <= maxLength) return value
    return value.slice(0, maxLength) + suffix
  }
}
```

```ts
@Component({
  imports: [TruncatePipe],
  template: `<p>{{ longText | truncate:50:'…' }}</p>`,
})
```

<v-click>

**Pure vs Impure**：`@Pipe({ name: 'filter', pure: false })` 默认 true；false 每次 CD 都重算，性能差，尽量避免。

</v-click>

---
transition: slide-up
---

# 指令：属性指令

加在元素上改变行为：

```ts
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
    '[style.background-color]': 'color()',
  },
})
export class HighlightDirective {
  private el = inject(ElementRef<HTMLElement>)
  color = input<string>('yellow')
  onEnter() { this.el.nativeElement.style.outline = '2px solid red' }
  onLeave() { this.el.nativeElement.style.outline = '' }
}
```

<v-click>

```html
<p appHighlight color="lightblue">Hover me</p>
```

</v-click>

<v-click>

> 💡 v17+ 推荐 `host` 字段：取代 `@HostBinding` / `@HostListener`，更简洁，metadata 可见。

</v-click>

---
transition: slide-up
---

# 指令：结构指令（自定义）

```ts
@Directive({ selector: '[appUnless]' })
export class UnlessDirective {
  private tpl = inject(TemplateRef<unknown>)
  private vc = inject(ViewContainerRef)
  appUnless = input.required<boolean>()

  constructor() {
    effect(() => {
      this.vc.clear()
      if (!this.appUnless()) this.vc.createEmbeddedView(this.tpl)
    })
  }
}
```

```html
<p *appUnless="isHidden">Visible when isHidden is false</p>
```

<v-click>

> 💡 新代码优先用 `@if`：v17+ 自定义结构指令不太需要——`@if` / `@for` 配合 signal 就能搞定。

</v-click>

---
transition: slide-up
---

# 测试：Karma + Jasmine（默认）

```ts
describe('Counter', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Counter] }).compileComponents()
  })

  it('renders count', () => {
    const fixture = TestBed.createComponent(Counter)
    fixture.detectChanges()
    expect(fixture.nativeElement.textContent).toContain('Count: 0')
  })

  it('increments on click', () => {
    const fixture = TestBed.createComponent(Counter)
    fixture.detectChanges()
    fixture.nativeElement.querySelector('button').click()
    fixture.detectChanges()
    expect(fixture.nativeElement.textContent).toContain('Count: 1')
  })
})
```

<v-click>

> ⚠️ Karma 自 2023 起 deprecated，官方建议迁移到 Web Test Runner / Vitest / Jest。`ng new` 默认仍是 Karma，但未来版本会切换。

</v-click>

---
transition: slide-up
---

# 测试：Jest / Vitest（社区主流）

```bash
ng add jest-preset-angular
```

API 与 Jasmine 几乎一致，只是 `describe` / `it` 换成 Jest 全局，不需要浏览器。

<v-click>

**Vitest（v17+ experimental）**：

```bash
pnpm add -D vitest @analogjs/vite-plugin-angular jsdom
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import angular from '@analogjs/vite-plugin-angular'

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
  },
})
```

</v-click>

<v-click>

Vitest 速度比 Karma 快 5-10x，已被很多新项目（包括 Analog 框架）采纳。

</v-click>

---
transition: slide-up
---

# 测试：HttpClientTestingModule

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [UserService],
  })
})

it('loads users', () => {
  const svc = TestBed.inject(UserService)
  const http = TestBed.inject(HttpTestingController)

  let result: User[] = []
  svc.list().subscribe(users => result = users)

  const req = http.expectOne('/api/users')
  expect(req.request.method).toBe('GET')
  req.flush([{ id: 1, name: 'Alice' }])

  expect(result).toEqual([{ id: 1, name: 'Alice' }])
  http.verify()       // 确保所有请求都被消费
})
```

<v-click>

`expectOne` / `expectNone` / `match` 让 HTTP 测试无需 mock fetch。

</v-click>

---
transition: slide-up
---

# 测试：Cypress / Playwright

```ts
// Cypress：ng add @cypress/schematic
describe('Home', () => {
  it('shows welcome', () => {
    cy.visit('/')
    cy.get('button').contains('+1').click()
    cy.contains('Count: 1')
  })
})
```

<v-click>

```ts
// Playwright
test('shows counter', async ({ page }) => {
  await page.goto('http://localhost:4200/')
  await page.getByRole('button', { name: '+1' }).click()
  await expect(page.getByText('Count: 1')).toBeVisible()
})
```

</v-click>

<v-click>

Playwright 速度 / 跨浏览器 / Debug 都比 Cypress 好，社区采用率快速上升。

</v-click>

---
transition: slide-up
---

# i18n：@angular/localize

```bash
ng add @angular/localize
```

```html
<!-- 标记可翻译文本 -->
<h1 i18n>Welcome</h1>
<p i18n="@@homeWelcomeMessage">Welcome to Angular!</p>
<button i18n-aria-label aria-label="Close">×</button>

<!-- 插值 -->
<p i18n>Hello, {{ user.name }}!</p>

<!-- ICU 复数 -->
<p i18n>
  { count, plural,
    =0 {no items}
    =1 {1 item}
    other {{{ count }} items}
  }
</p>
```

<v-click>

```bash
# 抽取消息 → src/locale/messages.xlf
ng extract-i18n

# 构建多语言
ng build --localize       # 生成 dist/{en-US,fr,zh-CN}/
```

</v-click>

---
transition: slide-up
---

# 性能优化清单

<v-clicks>

- **OnPush + Signal** → 默认基线（Zoneless 模式零成本）
- **`@for` 用合适的 `track`** → 唯一 ID > 引用 > $index
- **`@defer` / `loadComponent` / `prefetch on idle`** → 延迟下载 / 路由懒加载 / 预下载
- **`NgOptimizedImage`** → 图像优化（自动 srcset / lazy / priority）
- **Service Worker + SSR + Prerender** → 离线缓存 / 首屏 < 100ms

</v-clicks>

```ts
// runOutsideAngular：高频任务跳出 Zone
class Cmp {
  private zone = inject(NgZone)
  startAnimation() {
    this.zone.runOutsideAngular(() => {
      const loop = () => requestAnimationFrame(loop)
      loop()
    })
  }
}
```

---
transition: slide-up
---

# Ivy 渲染引擎：局部性

Ivy（v9+ 默认）把模板编译为**针对该组件的独立 instance closure**：

```html
<div>{{ name }}</div>
<button (click)="onClick()">Click</button>
```

编译后：

```js
function MyCmp_Template(rf, ctx) {
  if (rf & 1) {           // create
    ɵɵelementStart(0, 'div'); ɵɵtext(1); ɵɵelementEnd()
    ɵɵelementStart(2, 'button')
    ɵɵlistener('click', () => ctx.onClick())
    ɵɵtext(3, 'Click'); ɵɵelementEnd()
  }
  if (rf & 2) { ɵɵadvance(); ɵɵtextInterpolate(ctx.name) }   // update
}
```

<v-click>

每个组件的模板 → 独立函数 → **tree-shake 友好**（未用代码不进 bundle）。

</v-click>

---
transition: slide-up
---

# Ivy vs React Fiber

| 维度 | Angular Ivy | React Fiber |
|------|------------|-------------|
| 编译 | 模板编译为 instance closure | JSX → `React.createElement` |
| 节点结构 | LView + TView 数组结构 | Fiber 链表（child / sibling） |
| 调度 | OnPush / Zone / Signal 驱动 | concurrent mode（time-slicing） |

<v-click>

**bundle**：Ivy 编译强绑组件 → 未引用代码 100% 不进 bundle；React runtime 通用化 → 整个运行时打入 bundle。

</v-click>

<v-click>

**性能**：React 整组件函数重跑 vs Angular OnPush + Signal 局部精确；Zoneless 后接近 Solid 细粒度更新。

</v-click>

---
transition: slide-up
---

# 微前端：Native Federation

[Native Federation](https://github.com/angular-architects/module-federation-plugin)（基于 Import Maps，无需 Webpack）是 Angular 21 推荐的微前端方案：

```bash
ng add @angular-architects/native-federation
```

```js
// federation.config.js
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config')

module.exports = withNativeFederation({
  name: 'shell',
  exposes: {},
  remotes: {
    mfe1: 'http://localhost:4201/remoteEntry.json',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),
  },
})
```

---
transition: slide-up
---

# 微前端：加载远程组件

```ts
import { loadRemoteModule } from '@angular-architects/native-federation'

const Cmp = await loadRemoteModule({ remoteName: 'mfe1', exposedModule: './FlightsCmp' })
  .then(m => m.FlightsCmp)

// 路由内懒加载远程
{
  path: 'flights',
  loadComponent: () => loadRemoteModule({
    remoteName: 'mfe1', exposedModule: './FlightsCmp',
  }).then(m => m.FlightsCmp),
}
```

<v-click>

| 方案 | 隔离原理 | 适合 |
|---|---|---|
| **Native Federation** | Import Maps | Angular 全栈微前端 |
| **single-spa-angular** | 各自隔离 | 跨框架 |
| **Angular Elements** | Web Component | 嵌入非 Angular 项目 |

</v-click>

---
transition: slide-up
---

# Angular Elements（Web Component）

把组件编译为 Custom Element，任意项目都能用：

```ts
import { createCustomElement } from '@angular/elements'

@Injectable()
export class App {
  constructor(injector: Injector) {
    customElements.define('my-greeter', createCustomElement(GreeterCmp, { injector }))
  }
}
```

<v-click>

```html
<!-- 在任意 HTML / React / Vue 项目都能用 -->
<my-greeter name="Alice"></my-greeter>
```

</v-click>

<v-click>

**用途**：非 Angular 项目嵌入（旧 React / WordPress）/ 微前端共享 / Storybook 跨框架。

</v-click>

---
transition: slide-up
---

# Service Worker：@angular/pwa

```bash
ng add @angular/pwa    # 自动配置 manifest / SW / 图标
```

```ts
// app.config.ts（已自动加）
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerWhenStable:30000',
})
```

<v-click>

**SwUpdate 检测新版本**：

```ts
const swUpdate = inject(SwUpdate)
swUpdate.versionUpdates.subscribe(evt => {
  if (evt.type === 'VERSION_READY' && confirm('New version. Reload?')) {
    location.reload()
  }
})
```

</v-click>

---
transition: slide-up
---

# Angular CLI 常用命令

| 命令 | 简写 | 用途 |
|------|------|------|
| `ng new <name>` | - | 创建工作空间 |
| `ng serve` | `ng s` | 启动开发服务器（4200） |
| `ng build` / `ng test` / `ng e2e` | `ng b/t/e` | 构建 / 单测 / E2E |
| `ng generate component/service/guard <name>` | `ng g c/s/g` | 生成代码 |
| `ng add <package>` | - | 安装并配置 schematic |
| `ng update [@angular/core]` | - | 列出 / 升级并自动迁移 |
| `ng lint` | - | 跑 ESLint |

---
transition: slide-up
---

# ng update：自动迁移神器

```bash
pnpm add -g @angular/cli                          # 升级 CLI
ng update @angular/core @angular/cli              # 自动迁移
ng update @angular/material @ngrx/store           # 升级第三方
ng update --create-commits                        # 运行所有 schematic
```

<v-click>

跨版本迁移 schematic：

```bash
ng g @angular/core:control-flow                   # *ngIf / *ngFor → @if / @for
ng g @angular/core:standalone                     # NgModule → Standalone
ng g @angular/core:inject                         # constructor → inject()
ng g @angular/core:cleanup-unused-imports         # 清理未用 imports
```

</v-click>

<v-click>

> 💡 React / Vue 都做不到的工业能力：`ng update` 自动 codemod 通常一条命令就能从 v14 升到 v21。

</v-click>

---
transition: slide-up
---

# v14 → v21 升级路径

| 起始版本 | 推荐路径 |
|---------|---------|
| v8 - v12 | 先升 v12 启用 Ivy，再 → v15 → v17 → v21 |
| v13 - v14 | 直升 v17（享 standalone + 控制流）→ v21 |
| v15 - v20 | `ng update` 一步到位 |

<v-click>

**关键 deprecation**：View Engine（v9 弃用/v12 移除）；`*ngIf` / `*ngFor` / `NgModule` 仍兼容；Zone.js（v21 默认 Zoneless）；`@angular/universal`（v17 弃用，改 `@angular/ssr`）。

</v-click>

---
transition: slide-up
---

# Angular Material（M3）

```bash
ng add @angular/material    # 交互式询问 M3 theme / typography / animations
```

```ts
@Component({
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-title>Sign In</mat-card-title>
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" />
      </mat-form-field>
      <button mat-flat-button color="primary">Login</button>
    </mat-card>
  `,
})
export class Login {}
```

---
transition: slide-up
---

# Angular CDK（无样式组件层）

[Angular CDK](https://material.angular.io/cdk/categories) 提供「无样式行为模块」，对标 Radix UI / Headless UI：

| 模块 | 用途 |
|---|---|
| `overlay` / `dialog` / `menu` | Portal / 对话框 / 菜单 |
| `drag-drop` / `scrolling` | 拖拽 / 虚拟滚动 |
| `a11y` / `clipboard` / `testing` | 可访问性 / 剪贴板 / 测试 Harness |

<v-click>

```ts
// 虚拟滚动示例
@Component({
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" style="height: 500px">
      @for (item of items; track item.id) { <div>{{ item.name }}</div> }
    </cdk-virtual-scroll-viewport>
  `,
})
```

</v-click>

---
transition: slide-up
---

# UI 库选型

| 库 | 风格 | 适合 |
|---|---|---|
| **Angular Material** | Material 3 | 跨设备 / 官方 |
| **PrimeNG** | 企业级（80+ 组件） | 大型管理系统 / 数据表格 |
| **NG-ZORRO** | Ant Design | 国内项目（阿里出品） |
| **Spartan / shadcn-ng** | 抄写式 + Tailwind | 完全定制（新趋势） |

<v-click>

**经验**：跨设备 → Material；大型后台 → PrimeNG（组件最全）；Ant Design 风 → NG-ZORRO；Tailwind 定制 → Spartan。

</v-click>

---
transition: slide-up
---

# Nx（Monorepo 事实标准）

[Nx](https://nx.dev/) 是 Nrwl（Angular 早期核心团队成员创办）的 monorepo 工具：

```bash
pnpm dlx create-nx-workspace@latest my-org --preset=angular-monorepo
```

```
my-org/
├── apps/{web, admin}/          # Angular 应用
├── libs/{ui, data-access, feature-auth}/   # 共享库
├── nx.json                     # Nx 配置
└── package.json
```

<v-click>

**Nx 关键命令**：

```bash
nx g @nx/angular:lib ui                   # 创建库
nx build web / nx serve web               # 构建 / 启动特定项目
nx affected:test / nx affected:build      # 只跑变更影响的项目
nx graph                                  # 可视化依赖图
```

</v-click>

---
transition: slide-up
---

# Ionic（移动端）

[Ionic](https://ionicframework.com/) 是基于 Web Components 的跨平台 UI 框架：

```bash
pnpm dlx @ionic/cli@latest start my-app blank --type=angular --capacitor
cd my-app
ionic serve         # 在浏览器调试
```

<v-click>

加 Capacitor 平台：

```bash
ionic cap add ios
ionic cap add android

ionic cap sync      # 同步 web 资源到原生项目
ionic cap run ios   # 在 Xcode 跑
ionic cap run android
```

</v-click>

<v-click>

```ts
// Ionic 7+ Standalone
import { provideIonicAngular } from '@ionic/angular/standalone'

export const appConfig: ApplicationConfig = {
  providers: [provideIonicAngular()],
}
```

[Capacitor](https://capacitorjs.com/) 是 Ionic 官方的原生桥（取代旧 Cordova），跨 iOS / Android / Web / Electron 一套代码。

</v-click>

---
transition: slide-up
---

# Analog：Angular 的 Next.js

[Analog](https://analogjs.org/) 是 Brandon Roberts（Angular GDE）做的 Angular 元框架，基于 Vite：`pnpm create analog@latest my-app`

<v-click>

提供：文件路由（`src/app/pages/`）/ API 路由（`src/server/routes/`）/ Markdown SSG / 内置 Vitest。

</v-click>

<v-click>

```ts
// src/app/pages/users.[id].page.ts
@Component({ template: `<h1>User {{ id() }}</h1>` })
export default class UserPage {
  id = input.required<string>()
}
```

</v-click>

<v-click>

**适合**：纯 Angular 全栈站点 / 静态博客。生产采用率仍较低，但活跃维护。

</v-click>

---
transition: slide-up
---

# 桌面与浏览器扩展

**Electron + Angular**：

```bash
ng new desktop-app && cd desktop-app
pnpm add -D electron electron-builder
```

```js
// electron/main.js
app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1200, height: 800 })
  win.loadFile('dist/desktop-app/browser/index.html')
})
```

<v-click>

**Tauri + Angular**（bundle 约 Electron 1/10）：`pnpm create tauri-app@latest my-app`

</v-click>

<v-click>

**浏览器扩展**：直接用 Angular CLI 输出静态文件，配 `manifest.json`：

```json
{ "manifest_version": 3, "name": "My Ext", "action": { "default_popup": "index.html" } }
```

</v-click>

---
transition: slide-up
---

# Tailwind / UnoCSS 集成

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init
```

```scss
// src/styles.scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

<v-click>

**Tailwind 4（CSS-first 配置）**：

```scss
@import "tailwindcss";
@theme { --color-primary: #dd0031; }
```

无需 `tailwind.config.js`。

</v-click>

<v-click>

**UnoCSS**：`pnpm add -D unocss`，需 Angular CLI 走 Vite（v17+ 默认）才能用 `virtual:uno.css`。

</v-click>

---
transition: slide-up
---

# 开发工具：Angular DevTools

[Angular DevTools](https://angular.dev/tools/devtools) 是 Chrome / Edge 扩展，提供：

<v-clicks>

- **组件树**：查看 standalone / module 组件树、props、signals、injector
- **性能分析**：变更检测耗时火焰图
- **Profiler**：Zone 任务 / 渲染时间 / change detection 计数
- **路由 inspector**：当前激活路由 / 参数 / data / 守卫
- **DI 树**：每个组件 / 服务的依赖来源

</v-clicks>

<v-click>

> 💡 **Chrome DevTools 协议集成（v21+）**
>
> Angular CLI 21+ 已经把 Chrome DevTools 集成进了 `ng serve` 工作流——在 DevTools 里直接看 Angular 组件名、signal 值、`afterNextRender` 钩子，无需安装扩展。

```bash
ng serve --hmr   # 默认开 HMR + DevTools 接入
```

</v-click>

---
transition: slide-up
---

# 常见陷阱速查

<v-clicks>

- **`effect` 必须在 injection context 内创建** → constructor / `inject()` 调用点 / 工厂函数；其它地方需显式 `injector` 参数
- **`effect` 内不能写 signal** → 默认抛 `NG0600`；需要时 `allowSignalWrites: true`，但通常意味设计有问题
- **Zoneless 下 `setTimeout` 改字段不触发 CD** → 改字段为 signal 或显式 `markForCheck`
- **`@for` 必须 `track`** → 不写编译错；优先 `track item.id`
- **新 `inject()` 只能在 injection context 内** → 抛 `NG0203`；用 `runInInjectionContext` 在任意函数内
- **`provideXxx` 不能放在组件 `providers`** → 仅应用 / 路由 providers；编译错
- **SSR 中 `window` 不存在** → 用 `afterNextRender` 或 `isPlatformBrowser` 守卫
- **`@if` 别名 `as` 不会在条件内自动 narrow** → 显式用 `as user`，模板内访问 `user.xxx`
- **Standalone 组件忘记 import** → `NG8001: 'app-xxx' is not a known element`

</v-clicks>

---
transition: slide-up
---

# 一份完整的 main.ts 模板

```ts
// src/main.ts
bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    provideAnimationsAsync(),
    provideClientHydration(withIncrementalHydration()),
  ],
}).catch(err => console.error(err))
```

<v-click>

**关键 provider 速记**：

- `withComponentInputBinding()` —— 路由参数自动注入
- `withFetch()` —— 用 fetch API 取代 XHR
- `withIncrementalHydration()` —— SSR 增量水合
- `provideAnimationsAsync()` —— 异步加载动画（替代 `provideAnimations()`）

</v-click>

---
transition: slide-up
---

# vs React

| 维度 | Angular 21 | React 19 |
|---|---|---|
| 范式 | OOP + 装饰器 + 强 DI | FP + Hooks |
| 模板 | HTML 编译 + 强类型 | JSX 运行时 |
| 响应式 | Signal + Zoneless | useState + 手动依赖 |
| 更新粒度 | 局部脏检查 + Signal 推送 | 整组件函数重跑 |
| TypeScript | 强制 + 模板类型检查 | 可选 |
| 路由 / SSR | 官方 Router / `@angular/ssr` | React Router / Next.js |
| RSC | 暂无 | 有（实验） |

<v-click>

**选 Angular**：大型企业应用 / 后端 OOP 团队 / 强约定 + 强类型需求 / 10+ 年长期维护。

</v-click>

---
transition: slide-up
---

# vs Vue

| 维度 | Angular 21 | Vue 3.5 |
|---|---|---|
| 范式 | 严格（DI / 装饰器） | 灵活（SFC + Composition） |
| 响应式 | Signal + Zone（可选） | Proxy 自动追踪 |
| TypeScript | 强制 | 推荐 |
| Bundle | ~150KB gzip | ~50KB |
| 学习曲线 | 陡峭 | 平缓 |
| 适合 | 大型企业级 | 中小项目 / 国内团队 |

<v-click>

**Angular**：长期项目 5+ 年 / 后端 OOP 团队 / 强约定 + 类型。**Vue**：快速迭代 / 前端思维 / 国内招聘。

</v-click>

---
transition: slide-up
---

# vs Svelte / Solid

| 维度 | Angular 21 | Svelte 5 | Solid |
|---|---|---|---|
| 编译 | 模板 → LView/TView | 编译消失 + 直接 DOM | JSX → 细粒度 signal |
| 响应式 | Signal（push-pull） | runes（`$state`） | Signal + tracking |
| 运行时 | 中（DI / Router 全套） | 极小（KB 级） | 中等 |
| 元框架 | Analog（社区） | SvelteKit（官方） | SolidStart |
| 生态 | 极大（企业级） | 中 | 小但增长 |

<v-click>

**Angular**：大型企业 / 强约定 / 强 DI / RxJS 资产 / Java/C# 转岗团队。

</v-click>

<v-click>

**Svelte / Solid**：创业项目 / bundle 敏感 / 拥抱新范式 / DX 优先。

</v-click>

---
transition: slide-up
---

# 四大框架统一对比

| 维度 | Angular 21 | Vue 3.5 | React 19 | Svelte 5 |
|---|---|---|---|---|
| 心智 | OOP + DI + Signal | SFC + Composition | FP + Hooks | 编译时 runes |
| 响应式 | Signal（push-pull） | Proxy（自动） | useState（手动） | runes（编译） |
| 类型 | 强制 + 模板检查 | 推断 + 编译宏 | 手动 | 部分 |
| Bundle | 大 | 中 | 中 | 极小 |
| 元框架 | `@angular/ssr` / Analog | Nuxt | Next.js | SvelteKit |
| 大版本迁移 | `ng update` 自动 | 半自动 codemod | 手动 | 手动 |

<v-click>

**一句话**：Angular 全套企业工业、Vue 灵活渐进、React 最大生态、Svelte 编译时极致。

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **新代码全 Signal**：`signal` / `computed` / `effect` 替代字段 + lifecycle
- **新代码全 Standalone**：不再写 NgModule
- **新代码全控制流**：`@if` / `@for` / `@switch` 替代 `*ngIf` / `*ngFor`
- **`inject()` 优先于 constructor**：减少样板 + 类型推断更稳
- **OnPush 永远写**：迁移 Zoneless 无感
- **`@for` 必须 `track item.id`**：性能差 10x
- **路由参数用 `withComponentInputBinding()` + `input()`**：告别 `ActivatedRoute` 订阅
- **HTTP 拦截器用函数式**：`HttpInterceptorFn`，DI 集成天然
- **每年 `ng update` 一次**：自动 codemod 是 Angular 杀手锏

</v-clicks>

---
transition: slide-up
---

# 不要选 Angular 的场景

<v-clicks>

- **团队全是 React / Vue 老手** → 学习曲线成本高
- **bundle 极度敏感**（嵌入第三方页面 / 小程序） → 150KB+ 默认包不可接受
- **小型 / 个人项目** → Angular 的 DI / 装饰器开销远超收益
- **快速 prototype / Demo** → 写完一个 Angular 组件的时间能写完 3 个 Vue 组件
- **国内独立开发者 / 小团队** → 招聘困难，生态偏企业
- **需要 RSC + Edge Streaming** → React 19 + Next.js 15 更前沿

</v-clicks>

<v-click>

> **经验**：Angular 是「**给大企业 + 长期维护项目用的强约定框架**」。如果你是 5 人创业团队 / 个人 SaaS，几乎一定不该选它。

</v-click>

---
transition: slide-up
---

# 选 Angular 的最佳场景

<v-clicks>

- **大型企业级应用**：银行 / 保险 / 电信 / 政府
- **后端思维团队**：Java / C# / Spring 工程师迁移
- **长期维护项目**：5+ 年生命周期，需要强约定
- **强类型 + DI 需求**：模板 / 表单 / 服务全程类型安全
- **跨平台 + 跨设备**：Ionic + Capacitor 一套代码
- **企业级 UI 库**：Angular Material / CDK / PrimeNG / NG-ZORRO
- **monorepo + 多团队协作**：Nx 强约束 + tag-based dep constraint
- **大版本可控升级**：`ng update` 自动 codemod，团队成本最低

</v-clicks>

---
transition: slide-up
---

# 一份能跑的完整示例

```ts
// services/products.ts
@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private http = inject(HttpClient)
  private state = signal({ items: [] as Product[], loading: false, filter: '' })

  readonly items = computed(() => this.state().items)
  readonly loading = computed(() => this.state().loading)
  readonly filtered = computed(() => {
    const q = this.state().filter.toLowerCase()
    return q ? this.items().filter(p => p.name.toLowerCase().includes(q)) : this.items()
  })

  setFilter(filter: string) { this.state.update(s => ({ ...s, filter })) }

  load() {
    this.state.update(s => ({ ...s, loading: true }))
    this.http.get<Product[]>('/api/products').pipe(
      finalize(() => this.state.update(s => ({ ...s, loading: false }))),
      takeUntilDestroyed(),
    ).subscribe(items => this.state.update(s => ({ ...s, items })))
  }
}
```

---
transition: slide-up
---

# 完整示例（续）

```ts
@Component({
  selector: 'app-products',
  imports: [FormsModule],
  template: `
    <input [ngModel]="store.filter()" (ngModelChange)="store.setFilter($event)" />
    @if (store.loading()) { <p>Loading...</p> }
    @else {
      <ul>
        @for (p of store.filtered(); track p.id) {
          <li>{{ p.name }} - {{ p.price | currency }}</li>
        } @empty { <li>No products</li> }
      </ul>
    }
  `,
})
export class Products {
  store = inject(ProductsStore)
  constructor() { this.store.load() }
}
```

<v-click>

涵盖：Signal Store / computed / `@if`+`@for` / Pipe / inject() / FormsModule。

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：大型企业级应用 / 强约定 + 强类型团队 / 长期维护项目

少做：个人项目 / 快速 prototype / bundle 极度敏感场景

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://angular.dev/" target="_blank">angular.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/angular/angular" target="_blank">angular/angular</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://stackblitz.com/edit/angular-starter" target="_blank">StackBlitz Playground</a>
</div>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>
