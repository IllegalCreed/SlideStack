---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Lit
info: |
  Presentation Lit 3 for frontend developers.

  Learn more at [https://lit.dev](https://lit.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:lit class="text-7xl" />
</div>

<br/>

## Lit 3：Web Components 框架，Google 维护

把 LitElement 设计为 HTMLElement 的薄层封装——组件就是浏览器原生 custom element

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Lit 3。

Google 维护、原 Polymer 团队主导的 Web Components 框架——组件就是浏览器原生 custom element，可以在 React / Vue / Angular / 原生 HTML 任何环境使用。Adobe Spectrum / IBM Carbon / SAP UI5 / Salesforce Lightning 都用 Lit 作底层。
-->

---
transition: fade-out
---

# 什么是 Lit？

Google 维护的 Web Components 框架，跨框架组件库的标准选择

<v-click>

- **基于 Web Standards**：Custom Elements + Shadow DOM + ES Modules + HTML Templates
- **跨框架**：同一个 `<my-button>` 在 React / Vue / Angular / 原生 HTML 都能用
- **包体积极小**：核心 5-7 KB（min+gzip），比 React 小一个数量级
- **样式天然隔离**：默认 Shadow DOM，组件样式不污染外部
- **企业背书强**：Adobe Spectrum / IBM Carbon / SAP UI5 / Salesforce Lightning / Microsoft Fluent
- **学习曲线平缓**：API 表面小（LitElement + 装饰器 + html 模板 + Reactive Controllers）

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Lit_](https://lit.dev/)

</div>

<style>
h1 {
  background-color: #324FFF;
  background-image: linear-gradient(45deg, #324FFF 10%, #4B6BFF 90%);
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

跨框架设计系统的最优解，但生态规模仍然有限

<v-clicks>

**优点**
- 基于 Web Standards，组件 = 浏览器原生 custom element
- **唯一**适合做跨框架设计系统的方案
- Bundle 极小（5-7 KB），适合嵌入式 SDK / 微前端
- 样式 Shadow DOM 默认隔离，彻底解决 CSS 命名冲突
- Google / Adobe / IBM / Salesforce / SAP / Microsoft 多家在用
- TypeScript 一流，装饰器 + HTMLElementTagNameMap 类型推导
- Reactive Controllers 替代 Mixin，组合复用清晰

**缺点**
- 不是 SPA 框架——无内置路由 / 状态管理 / 数据获取
- Shadow DOM 限制 → 全局样式（Tailwind utility）穿不进
- SSR 仍在 Labs，相对 Next.js 不够成熟
- 生态规模小，UI 组件库数量级远小于 React 生态
- 招聘市场小，候选人少一个数量级
- React 集成需要 @lit/react wrapper

</v-clicks>

---
transition: slide-up
---

# 历史：Polymer 到 Lit

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **Polymer 0.5** | 2014 | Google 推出，最早的 Web Components 框架 |
| **Polymer 1.0** | 2015 | data-binding 表达式 + behaviors（mixin） |
| **Polymer 2.0** | 2017 | 拥抱 ES Class + Custom Elements v1 |
| **Polymer 3.0** | 2018 | 转 npm + ES Modules（最后一个 Polymer） |
| **LitElement 2.x** | 2019 | 抽离模板引擎 lit-html + LitElement 基类 |
| **Lit 2** | 2021 | 单包 lit + Reactive Controllers |
| **Lit 3** | 2023.11 | ES2021 基线 + TC39 装饰器 + 移除 IE11 |
| **Lit 3.2** | 2024 | useDefault + 装饰器优化 |

<v-click>

**今天主要讲 Lit 3.2+**——稳定且与 TypeScript 5.x 标准装饰器对齐。

</v-click>

---
transition: slide-up
---

# 心智模型：组件 = HTMLElement 子类

**Lit 不是「重写组件模型」，而是「让标准 Web Components 好用」**

```ts
@customElement('my-button')
export class MyButton extends LitElement {
  // ↑ 这就是浏览器原生 HTMLElement 的子类
  // ↓ 注册之后 <my-button> 在任何 HTML 中都能用
}
```

<v-click>

继承链：

```
HTMLElement
  └── ReactiveElement     // Lit 的响应式基类（无模板能力）
        └── LitElement    // 加上 html 模板能力
```

</v-click>

<v-click>

对比 React / Vue：

| 维度 | Lit | React | Vue |
|---|---|---|---|
| 组件本质 | **浏览器原生 custom element** | JS 函数（VDOM 节点） | 编译产物 |
| 跨框架可用 | **是** | 否 | 否 |
| 样式作用域 | **Shadow DOM** | CSS Modules | scoped CSS |
| Bundle 核心 | **5-7 KB** | ~45 KB | ~25 KB |

</v-click>

---
transition: slide-up
---

# 快速开始

```bash
# 官方 Starter Kit（TypeScript，含测试 + 演示）
git clone https://github.com/lit/lit-element-starter-ts.git my-element
cd my-element
npm install
npm run dev

# Vite 模板（更现代）
pnpm create vite@latest my-lit -- --template lit-ts
cd my-lit && pnpm install && pnpm dev

# 裸装到现有项目
pnpm add lit
pnpm add @lit/context @lit/task @lit/react @lit/localize
```

<v-click>

```
my-element/                       # 标准结构
├── src/
│   ├── my-element.ts            # 组件定义
│   ├── my-element.test.ts       # 测试
│   └── index.ts                 # 公共导出
├── docs/                        # 文档站
├── custom-elements.json         # CEM（IDE 类型提示）
├── package.json
└── tsconfig.json
```

</v-click>

<v-click>

要求：Node 18+ / Chrome 88+ / Edge 88+ / Firefox 90+ / Safari 14+。**IE11 不再支持**。

</v-click>

---
transition: slide-up
---

# 第一个组件

```ts
import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('my-counter')
export class MyCounter extends LitElement {
  static styles = css`
    :host { display: inline-block; font-family: system-ui; }
    button { padding: 6px 12px; cursor: pointer; }
    .count { font-weight: bold; margin: 0 8px; }
  `

  @property({ type: String })  label = 'Click me'
  @property({ type: Number })  step = 1
  @state() private _count = 0

  render() {
    return html`
      <button @click=${() => this._count += this.step}>${this.label}</button>
      <span class="count">${this._count}</span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'my-counter': MyCounter }
}
```

---
transition: slide-up
---

# 模板基础：5 种绑定语法

`html` tagged template 用前缀区分绑定类型：

```ts
render() {
  return html`
    <!-- 1. 子节点表达式 -->
    <p>${this.message}</p>
    <ul>${this.items.map(i => html`<li>${i}</li>`)}</ul>

    <!-- 2. attribute 绑定（字符串化） -->
    <input type="text" placeholder=${this.label}>

    <!-- 3. property 绑定（点前缀，直接 setter） -->
    <input .value=${this.text}>

    <!-- 4. 布尔 attribute（?前缀） -->
    <button ?disabled=${this.loading}>提交</button>

    <!-- 5. 事件监听（@前缀，等价 addEventListener） -->
    <button @click=${this._onClick}>Click</button>
  `
}
```

<v-click>

::: tip 同位置不同前缀
5 种语法用前缀（无 / `.` / `?` / `@`）区分作用——这是 Lit 模板的核心心智模型。
:::

</v-click>

---
transition: slide-up
---

# 装饰器全表

```ts
import {
  customElement, property, state,
  query, queryAll, queryAsync,
  queryAssignedElements, queryAssignedNodes,
  eventOptions,
} from 'lit/decorators.js'
```

| 装饰器 | 作用 |
|---|---|
| `@customElement('x')` | 注册 custom element |
| `@property(opts?)` | 公共响应式属性（带 attribute 映射） |
| `@state()` | 内部响应式状态（无 attribute） |
| `@query(sel, cache?)` | 单元素 querySelector |
| `@queryAll(sel)` | querySelectorAll（NodeList） |
| `@queryAsync(sel)` | 异步 query（等下次更新） |
| `@queryAssignedElements(opts?)` | 获取 slot 分配的元素 |
| `@queryAssignedNodes(opts?)` | 获取 slot 分配的节点（含文本） |
| `@eventOptions(opts)` | 给方法附加 addEventListener 选项 |

---
transition: slide-up
---

# @property 完整选项

```ts
@property({
  type: Number,                   // 反序列化类型
  attribute: 'data-id',           // attribute 名（默认属性名 kebab-case）
  reflect: true,                  // 属性 → attribute 反射
  noAccessor: false,              // 不要自动生成 getter/setter
  state: false,                   // 等价 @state()
  hasChanged: (n, o) => n !== o,  // 自定义变化判断
  converter: {                    // 自定义 attribute ↔ property 转换
    fromAttribute: (v) => Number(v),
    toAttribute: (v) => String(v),
  },
  useDefault: true,               // Lit 3.x 新增：初始值不反射 + 移除时重置
})
count = 0
```

<v-click>

**默认 converter 行为**：

| `type` | attribute → property | property → attribute |
|---|---|---|
| `String` | 直接字符串 | 字符串 |
| `Number` | `Number(attr)` | `String(value)` |
| `Boolean` | attribute 存在 = true | true 加 attribute / false 移除 |
| `Array` / `Object` | `JSON.parse(attr)` | `JSON.stringify(value)` |

</v-click>

---
transition: slide-up
---

# @state vs @property

```ts
@customElement('open-menu')
export class OpenMenu extends LitElement {
  // 公共 API：HTML <open-menu open> 可控
  @property({ type: Boolean })
  open = false

  // 内部状态：键盘高亮项（不暴露为 attribute）
  @state()
  private _highlightedIndex = 0
}
```

<v-click>

| 维度 | `@property` | `@state` |
|---|---|---|
| 是否映射 attribute | **是**（默认） | 否 |
| 暴露给外部消费者 | **公共 API** | 内部细节 |
| TypeScript 修饰 | 通常 public | 通常 private |
| 命名约定 | 普通名 | `_` 前缀 |

</v-click>

<v-click>

约定：**公共 → `@property`，私有 → `@state() private _xxx`**。

</v-click>

---
transition: slide-up
---

# @query 和 @queryAssigned*

```ts
@customElement('text-input')
export class TextInput extends LitElement {
  @query('input')
  private _input!: HTMLInputElement   // lazy getter

  @query('input', true)
  private _inputCached!: HTMLInputElement  // cache=true 只 querySelector 一次

  @queryAll('li')
  private _items!: NodeListOf<HTMLLIElement>

  @queryAssignedElements({ slot: 'icon', selector: 'svg' })
  private _icons!: SVGElement[]

  @queryAssignedNodes({ slot: '' })
  private _defaultNodes!: Node[]

  focus() {
    this._input.focus()
  }

  render() {
    return html`<input>`
  }
}
```

---
transition: slide-up
---

# 响应式更新流程

属性变化触发完整的更新管线：

```
this.count = 1
  ↓ hasChanged(new, old) 返回 true
requestUpdate()
  ↓ 微任务批处理
performUpdate()
  ↓ shouldUpdate(changed)
willUpdate(changed)        ← 计算派生状态
  ↓
update(changed)             ← 反射 attribute + 调 render()
  ↓
render() 返回新 TemplateResult
  ↓ Lit 对槽位做 dirty-check + 更新 DOM
updated(changed)            ← DOM 已更新，可读
  ↓ 首次：firstUpdated()
updateComplete Promise resolves
```

<v-click>

**关键点**：默认所有 `@property` 变化都进入下次微任务批处理——**不会同步更新 DOM**，可以批量改属性。

</v-click>

---
transition: slide-up
---

# 生命周期钩子

| 钩子 | 触发时机 | 典型用途 |
|---|---|---|
| `constructor()` | 元素创建 | 默认值（很少用） |
| `connectedCallback()` | 加入 DOM | 注册外部事件 / 启动控制器 |
| `disconnectedCallback()` | 离开 DOM | 清理订阅 |
| `attributeChangedCallback()` | observed attribute 变化 | Lit 自动处理 |
| `shouldUpdate(changed)` | 更新前 | 返回 false 跳过更新 |
| `willUpdate(changed)` | render 前 | **计算依赖其他属性的派生值** |
| `update(changed)` | render 前 | 罕见重写 |
| `render()` | update 中 | **返回 TemplateResult** |
| `firstUpdated(changed)` | 首次 DOM 更新后 | 一次性 DOM 初始化（focus / Observer） |
| `updated(changed)` | 每次 DOM 更新后 | 读 DOM / 派发事件 / 动画 |
| `updateComplete` | DOM 更新完成 Promise | `await` 等更新（测试常用） |

---
transition: slide-up
---

# willUpdate vs updated

```ts
@customElement('user-card')
export class UserCard extends LitElement {
  @property() firstName = ''
  @property() lastName = ''
  @state() private _fullName = ''

  // 计算派生值：在 willUpdate 里
  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('firstName') || changed.has('lastName')) {
      this._fullName = `${this.firstName} ${this.lastName}`
    }
  }

  // 读 DOM：在 updated 里
  updated(changed: PropertyValues<this>) {
    if (changed.has('_fullName')) {
      console.log('rendered', this.shadowRoot!.textContent)
    }
  }

  render() {
    return html`<p>${this._fullName}</p>`
  }
}
```

---
transition: slide-up
---

# Reactive Controllers：组合复用核心机制

```ts
import { ReactiveController, ReactiveControllerHost } from 'lit'

export class MouseController implements ReactiveController {
  host: ReactiveControllerHost
  pos = { x: 0, y: 0 }

  private _onMove = (e: MouseEvent) => {
    this.pos = { x: e.clientX, y: e.clientY }
    this.host.requestUpdate()
  }

  constructor(host: ReactiveControllerHost) {
    this.host = host
    host.addController(this)
  }

  hostConnected() {
    window.addEventListener('mousemove', this._onMove)
  }

  hostDisconnected() {
    window.removeEventListener('mousemove', this._onMove)
  }
}
```

---
transition: slide-up
---

# 使用 Reactive Controller

```ts
@customElement('mouse-tracker')
export class MouseTracker extends LitElement {
  private mouse = new MouseController(this)

  render() {
    return html`<p>x=${this.mouse.pos.x} y=${this.mouse.pos.y}</p>`
  }
}
```

<v-click>

**4 个生命周期钩子**：

| 钩子 | 触发时机 |
|---|---|
| `hostConnected()` | host 加入 DOM 后 |
| `hostDisconnected()` | host 离开 DOM 后 |
| `hostUpdate()` | host update 前（DOM 未变） |
| `hostUpdated()` | host updated 后（DOM 已变） |

</v-click>

<v-click>

::: tip 替代 Mixin
Reactive Controller 是 Lit 对 Mixin 的**官方替代**——有独立 this，支持多实例，类型友好，无命名冲突。
:::

</v-click>

---
transition: slide-up
---

# Controller vs Mixin

| 维度 | Reactive Controller | Mixin（旧路线） |
|---|---|---|
| 接入方式 | `new C(this)` + `addController` | `class X extends Mixin(LitElement)` |
| 标识 | 独立对象（this.mouse） | 混入到 host 原型 |
| 多实例 | **可**（同 host 两个 ClockController） | 不可 |
| 类型 | 标准 TS class | TS Mixin 类型推导复杂 |
| 命名冲突 | 无（隔离在 controller） | 高（同名方法覆盖） |
| 测试 | 独立测试 | 必须配合 host |
| 推荐度 | **强推荐** | 仅遗留场景 |

<v-click>

```ts
// 多实例：完全 OK
class MyEl extends LitElement {
  private clock1 = new ClockController(this, 1000)
  private clock2 = new ClockController(this, 5000)
}
```

</v-click>

---
transition: slide-up
---

# 内置指令速查（一）

```ts
import { classMap }    from 'lit/directives/class-map.js'
import { styleMap }    from 'lit/directives/style-map.js'
import { repeat }      from 'lit/directives/repeat.js'
import { when }        from 'lit/directives/when.js'
import { ifDefined }   from 'lit/directives/if-defined.js'
import { ref, createRef } from 'lit/directives/ref.js'
```

```ts
render() {
  return html`
    <div
      class=${classMap({ card: true, active: this.active })}
      style=${styleMap({ color: this.color, '--var': '#fff' })}
    >
      ${when(this.loading,
        () => html`<spinner></spinner>`,
        () => html`<content></content>`,
      )}

      <ul>${repeat(this.items, i => i.id, i => html`<li>${i.name}</li>`)}</ul>

      <a href=${ifDefined(this.url)}>${this.text}</a>
    </div>
  `
}
```

---
transition: slide-up
---

# 内置指令速查（二）

| 指令 | 用途 | 性能场景 |
|---|---|---|
| `classMap(obj)` | 类名切换 | - |
| `styleMap(obj)` | 样式切换 | - |
| `when(cond, T, F?)` | 条件渲染 | 替代三元 |
| `choose(key, cases, fb?)` | switch/case | - |
| `map(items, fn)` | iterable 映射 | 短列表 |
| `repeat(items, keyFn, tpl)` | 带 key 列表 | 长列表 / 重排 |
| `ifDefined(v)` | undefined 移除 attribute | - |
| `live(v)` | 与 DOM 实际值比较 | **受控 input 必备** |
| `ref(refOrCb)` | DOM 引用 | - |
| `cache(tpl)` | 切换保留 DOM | Tab / 路由切换 |
| `guard(deps, fn)` | 依赖不变跳过 | 贵子模板 |
| `keyed(key, tpl)` | key 变化强制重建 | 切 user 重置状态 |
| `unsafeHTML(str)` | 字符串解析 HTML | XSS 注意 |
| `until(...vals)` | Promise / 同步混合 | - |

---
transition: slide-up
---

# 受控 input：必须用 live

```ts
@customElement('text-field')
export class TextField extends LitElement {
  @property() value = ''

  render() {
    return html`
      <!-- 错误：用户输入后表达式与上次相同，Lit 不更新 DOM -->
      <input
        .value=${this.value}
        @input=${(e: any) => this.value = e.target.value}
      >

      <!-- 正确：live 与 DOM 当前值比较 -->
      <input
        .value=${live(this.value)}
        @input=${(e: any) => this.value = e.target.value}
      >
    `
  }
}
```

<v-click>

::: warning live 的必要性
Lit 默认把表达式与「上次表达式值」比较，但**用户输入会改变 DOM**——下次 Lit 看到「表达式没变」就不更新。`live()` 与 **DOM 当前值** 比较，是受控输入的标准做法。
:::

</v-click>

---
transition: slide-up
---

# 自定义指令：Directive 基类

```ts
import { Directive, directive, PartInfo, PartType } from 'lit/directive.js'

class HighlightDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo)
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('highlight 只能用在 child 位置')
    }
  }

  render(text: string, color = 'yellow') {
    return html`<mark style=${styleMap({ background: color })}>${text}</mark>`
  }
}

export const highlight = directive(HighlightDirective)

// 使用
html`<p>${highlight(text, 'lime')}</p>`
```

<v-click>

PartType: `ATTRIBUTE` / `CHILD` / `PROPERTY` / `BOOLEAN` / `EVENT` / `ELEMENT`——构造时校验位置。

</v-click>

---
transition: slide-up
---

# AsyncDirective：异步更新

```ts
import { AsyncDirective, directive } from 'lit/async-directive.js'

class StreamDirective extends AsyncDirective {
  private _stream?: AsyncIterable<string>

  render(stream: AsyncIterable<string>) {
    if (this._stream !== stream) {
      this._stream = stream
      this._consume()
    }
    return ''
  }

  private async _consume() {
    for await (const value of this._stream!) {
      if (!this.isConnected) break
      this.setValue(value)   // 异步推送新值
    }
  }

  disconnected() { /* 清理 */ }
  reconnected() { /* 重连 */ }
}

export const stream = directive(StreamDirective)
```

<v-click>

`setValue(v)` 在异步操作完成时主动推送——不依赖响应式更新流程。

</v-click>

---
transition: slide-up
---

# 样式系统：static styles + css

```ts
@customElement('my-card')
export class MyCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid var(--card-border, #ddd);
      border-radius: 8px;
    }
    :host([variant="primary"]) {
      background: #007aff;
      color: white;
    }
    .title { font-size: 18px; font-weight: bold; }
    ::slotted(p) { margin: 8px 0; }
  `

  render() {
    return html`
      <h2 class="title"><slot name="title"></slot></h2>
      <slot></slot>
    `
  }
}
```

<v-click>

**关键选择器**：`:host` / `:host(sel)` / `:host-context(sel)` / `::slotted(sel)` / `::part(name)`

</v-click>

---
transition: slide-up
---

# 共享样式 + unsafeCSS

```ts
// styles/button.ts
import { css } from 'lit'
export const buttonStyles = css`
  button { padding: 6px 12px; border-radius: 4px; cursor: pointer; }
`

// my-button.ts
import { buttonStyles } from './styles/button'
import { css, unsafeCSS } from 'lit'

const accent = '#007aff'

@customElement('my-button')
export class MyButton extends LitElement {
  static styles = [
    buttonStyles,
    css`
      button { color: var(--btn-color, ${unsafeCSS(accent)}); }
    `,
  ]
}
```

<v-click>

::: warning unsafeCSS XSS
`css` tagged template 只允许嵌套 `CSSResult` 或数字——其他类型必须用 `unsafeCSS()`。**只对可信输入使用**。
:::

</v-click>

---
transition: slide-up
---

# CSS Custom Properties 主题

Shadow DOM 唯一的样式渗透通道：

```ts
@customElement('themed-button')
export class ThemedButton extends LitElement {
  static styles = css`
    :host {
      --btn-bg: #007aff;
      --btn-color: white;
    }
    button {
      background: var(--btn-bg);
      color: var(--btn-color);
    }
  `
}
```

```html
<themed-button style="--btn-bg: red;"></themed-button>

<style>
  :root { --btn-bg: #28a745; }  /* 全局变量穿透 Shadow DOM */
</style>
```

<v-click>

**这是 Lit 设计系统主题化的标准方案**——所有可定制的视觉变量都暴露为 CSS Custom Property。

</v-click>

---
transition: slide-up
---

# CSS Parts：精准选中 Shadow DOM 元素

```ts
@customElement('my-tab')
export class MyTab extends LitElement {
  render() {
    return html`
      <div part="label">${this.label}</div>
      <div part="indicator"></div>
    `
  }
}
```

```css
/* 外部样式可以选中 Shadow DOM 内部 */
my-tab::part(label) {
  color: red;
}
my-tab[active]::part(indicator) {
  background: blue;
  height: 2px;
}
```

<v-click>

::: tip CSS Custom Property vs Part
- **Custom Property**：暴露**值**（颜色 / 间距），适合主题化
- **CSS Part**：暴露**结构**（哪些元素可定制），适合精准样式覆盖
:::

</v-click>

---
transition: slide-up
---

# Shadow DOM + Slots

```ts
@customElement('my-card')
export class MyCard extends LitElement {
  render() {
    return html`
      <header><slot name="title"></slot></header>
      <main><slot></slot></main>
      <footer>
        <slot name="actions">默认 Action</slot>
      </footer>
    `
  }
}
```

```html
<my-card>
  <h2 slot="title">标题</h2>
  <p>正文内容</p>
  <button slot="actions">OK</button>
  <button slot="actions">Cancel</button>
</my-card>
```

<v-click>

**slot 是「透明插入点」**——子节点仍在外部 light DOM 中，渲染位置由组件控制。`<slot>fallback</slot>` 提供默认内容。

</v-click>

---
transition: slide-up
---

# Light DOM 模式

需要外部样式穿透时覆写 `createRenderRoot`：

```ts
@customElement('light-dom-el')
export class LightDomEl extends LitElement {
  protected createRenderRoot() {
    return this   // 渲染到自己，无 Shadow DOM
  }

  // 注意：static styles 在 light DOM 模式下不生效
}
```

<v-click>

**代价**：

- 失去样式作用域（外部样式会污染内部）
- 失去 slot 抽象（外部 light DOM 元素直接是 children）
- 失去 `::slotted` 选择器

</v-click>

<v-click>

::: tip 何时用 Light DOM
- 与 Tailwind / 全局 CSS 框架集成
- SEO 重度依赖（搜索引擎对 Shadow DOM 支持差）
- SSR 时无 DSD polyfill 的旧浏览器

否则**始终保持 Shadow DOM 默认开启**——这是 Lit 最大的卖点之一。
:::

</v-click>

---
transition: slide-up
---

# Context API：@lit/context

```ts
import { createContext, provide, consume } from '@lit/context'

export interface Theme { mode: 'light' | 'dark'; toggle: () => void }
export const themeContext = createContext<Theme>(Symbol('theme'))

@customElement('theme-provider')
export class ThemeProvider extends LitElement {
  @provide({ context: themeContext })
  theme: Theme = {
    mode: 'light',
    toggle: () => {
      this.theme = { ...this.theme, mode: this.theme.mode === 'light' ? 'dark' : 'light' }
    },
  }
  render() { return html`<slot></slot>` }
}

@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  theme?: Theme

  render() {
    return html`<button @click=${this.theme?.toggle}>${this.theme?.mode}</button>`
  }
}
```

---
transition: slide-up
---

# Context API：工作机制

基于 W3C **Context Community Protocol**——本质是 DOM 事件：

```
Consumer:
  this.dispatchEvent(new ContextRequestEvent(...))
       ↓ bubbles: true, composed: true
Provider 监听并调用 callback(value, dispose)
       ↓
Consumer 拿到 value
```

<v-click>

**特性**：

- 沿 DOM 树自然传播（跨 Shadow DOM 边界）
- 不限于 Lit 组件——任何符合协议的库都能互通
- `subscribe: true` 时自动监听 provider 值更新
- `dispose()` 取消订阅

</v-click>

<v-click>

::: tip 替代 prop drilling
跨 5+ 层组件传递主题 / 用户信息 / API 配置——用 Context 比层层 prop 干净。
:::

</v-click>

---
transition: slide-up
---

# 异步数据：@lit/task

```ts
import { Task } from '@lit/task'

@customElement('user-card')
export class UserCard extends LitElement {
  @property({ type: Number }) userId = 0

  private _task = new Task(this, {
    task: async ([userId], { signal }) => {
      if (!userId) return null
      const res = await fetch(`/api/users/${userId}`, { signal })
      return res.json()
    },
    args: () => [this.userId],
  })

  render() {
    return this._task.render({
      initial: () => html`<p>请选择用户</p>`,
      pending: () => html`<spinner></spinner>`,
      complete: (user) => html`<p>${user?.name}</p>`,
      error: (err) => html`<p>Error: ${(err as Error).message}</p>`,
    })
  }
}
```

<v-click>

`args` 变化时**自动 abort 上次请求**（通过 `signal: AbortSignal`）——避免回包乱序。

</v-click>

---
transition: slide-up
---

# Task 状态机

```ts
enum TaskStatus {
  INITIAL  = 0,   // 还没跑过
  PENDING  = 1,   // 进行中
  COMPLETE = 2,   // 完成
  ERROR    = 3,   // 失败
}

// 直接访问
console.log(this._task.status)
console.log(this._task.value)
console.log(this._task.error)

// 手动控制
new Task(this, {
  autoRun: false,                      // 关闭自动
  task: async () => { /* ... */ },
  args: () => [],
  onComplete: (value) => { /* 副作用 */ },
  onError: (err) => { /* 错误处理 */ },
})

private _onClick() {
  this._task.run()                     // 手动触发
}
```

---
transition: slide-up
---

# Lit SSR：@lit-labs/ssr

```ts
import { render } from '@lit-labs/ssr'
import { html } from 'lit'
import './my-counter'

const stream = render(html`<my-counter label="Hi"></my-counter>`)

let str = ''
for await (const chunk of stream) {
  str += chunk
}

console.log(str)
// <my-counter label="Hi">
//   <template shadowrootmode="open">
//     <button>Hi</button><span class="count">0</span>
//   </template>
// </my-counter>
```

<v-click>

**Declarative Shadow DOM**：`<template shadowrootmode="open">` 是浏览器原生 DSD——Chrome 90+ / Safari 16.4+ / Firefox 123+ 支持，无需 JS 就能渲染 Shadow DOM。

</v-click>

---
transition: slide-up
---

# Lit SSR：集成与限制

**集成**：

- **Eleventy**：`@lit-labs/eleventy-plugin-lit`
- **Next.js**：`@lit-labs/nextjs`（pages router）
- **Astro**：`@astrojs/lit`
- **Hono / Express**：手动包装
- **Nuxt 3**：`nuxt-ssr-lit`

<v-click>

**限制**：

- 不支持 async 组件（render 是同步的）
- Light DOM 组件不支持
- 仍标 Labs，API 可能小幅调整
- 旧浏览器需要 DSD polyfill `@webcomponents/template-shadowroot`

</v-click>

<v-click>

::: warning 生产前评估
Lit SSR 已经可用，但相对 React SSR 生态成熟度仍有差距——生产前评估你的需求是否能接受 Labs 状态。
:::

</v-click>

---
transition: slide-up
---

# TypeScript 集成

```ts
@customElement('my-button')
export class MyButton extends LitElement {
  @property() label = ''
}

declare global {
  interface HTMLElementTagNameMap {
    'my-button': MyButton
  }
}

// 之后：
const btn = document.createElement('my-button')  // 类型 MyButton
btn.label = 'OK'                                 // 有类型检查

document.querySelector<MyButton>('my-button')
const found = document.querySelector('my-button')  // 自动推为 MyButton | null
```

<v-click>

**tsconfig 关键选项**：

```json
{
  "experimentalDecorators": true,
  "useDefineForClassFields": false    // 必须 false（与装饰器配合）
}
```

</v-click>

---
transition: slide-up
---

# tsconfig 陷阱：useDefineForClassFields

```json
{
  "experimentalDecorators": true,
  "useDefineForClassFields": true    // 错误！
}
```

<v-click>

**为什么错**：

- TS 5 之前的实验装饰器把 `@property` 装为 setter/getter
- `useDefineForClassFields: true` 让字段初始化走 `[[DefineOwnProperty]]`，**覆盖 Lit 的 setter**
- 结果：属性更新不再触发渲染——**静默失败，最难排查**

</v-click>

<v-click>

**两条正确路线**：

```jsonc
// 路线 A：实验装饰器 + 关闭 defineForClassFields
{
  "experimentalDecorators": true,
  "useDefineForClassFields": false
}

// 路线 B：TC39 标准装饰器（TS 5.0+）
{
  "experimentalDecorators": false,
  "useDefineForClassFields": true
}
```

</v-click>

---
transition: slide-up
---

# 在 React 里用 Lit 组件

```bash
pnpm add @lit/react
```

```ts
// MyCounterReact.ts
import { createComponent } from '@lit/react'
import * as React from 'react'
import { MyCounter } from './my-counter'

export const MyCounterReact = createComponent({
  tagName: 'my-counter',
  elementClass: MyCounter,
  react: React,
  events: {
    onChange: 'change',     // change DOM 事件映射到 onChange prop
    onSelect: 'select',
  },
})
```

```tsx
<MyCounterReact
  label="点击"
  step={2}
  onChange={(e) => console.log(e.detail.count)}
/>
```

---
transition: slide-up
---

# 为什么需要 @lit/react

| 问题 | @lit/react 解决 |
|---|---|
| React 把 JSX 属性视为 attribute（字符串） | 自动走 property，支持对象 / 数组 / 函数 |
| DOM 事件 `dispatchEvent` 不能 onChange 监听 | `events` 映射 → React 风格 callback |
| TypeScript 缺类型 | 自动从 element class 推导 props |
| ref forwarding | 自动支持 |

<v-click>

```ts
import { EventName } from '@lit/react'

events: {
  'onChange': 'change' as EventName<CustomEvent<{ count: number }>>,
}
// onChange handler 的 event.detail 现在有类型
```

</v-click>

<v-click>

::: tip React 19 原生支持
React 19 已经原生支持自定义元素 + property + event，但**建议仍用 wrapper**——获得类型推导 + 一致 API。
:::

</v-click>

---
transition: slide-up
---

# 在 Vue 里用 Lit 组件

Vue 3 原生支持：

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './my-counter'

const app = createApp(App)
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
app.mount('#app')
```

```vue
<template>
  <my-counter
    :label="text"
    :step.prop="step"
    @change="onChange"
  />
</template>
```

<v-click>

**关键**：`:step.prop="step"` 用 `.prop` 修饰符强制走 property——数字 / 对象正确传递，不经过字符串。

</v-click>

---
transition: slide-up
---

# 在 Angular 里用 Lit 组件

```ts
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@NgModule({
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```html
<my-counter
  [label]="text"
  [step]="step"
  (change)="onChange($event)"
></my-counter>
```

<v-click>

- `[prop]` 走 property binding（正确传对象）
- `(event)` 走 `addEventListener`（自动监听 DOM 事件）

</v-click>

<v-click>

::: tip 跨框架价值
**一份 Lit 组件，三个生态都能用**——React / Vue / Angular / 原生 HTML。这是 Lit 最大的卖点。
:::

</v-click>

---
transition: slide-up
---

# i18n：@lit/localize

```ts
import { msg, str, updateWhenLocaleChanges } from '@lit/localize'

@customElement('greeting')
export class Greeting extends LitElement {
  constructor() {
    super()
    updateWhenLocaleChanges(this)
  }

  @property() name = 'World'

  render() {
    return html`
      <h1>${msg('Hello!')}</h1>
      <p>${msg(str`Hi ${this.name}!`)}</p>
      <p>${msg(html`Welcome to <b>${this.name}</b>!`)}</p>
    `
  }
}
```

<v-click>

**工作流**：

```bash
npx lit-localize extract   # 提取 → XLIFF 文件
# 翻译团队填 XLIFF
npx lit-localize build     # 生成 locale chunks
```

</v-click>

---
transition: slide-up
---

# Localize：runtime vs transform

| 维度 | Runtime 模式 | Transform 模式 |
|---|---|---|
| Bundle 数量 | 单 bundle + 动态 locale chunk | 每个 locale 单独 bundle |
| 切换语言 | `setLocale('zh')` 无刷新 | 必须刷新页面 |
| 运行时开销 | ~1.3 KB | **0** |
| 适合场景 | 用户经常切语言 | 国家版本独立 |

<v-click>

```ts
// runtime 配置
configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['zh-CN', 'ja'],
  loadLocale: (locale) => import(`./generated/locales/${locale}.js`),
})

await setLocale('zh-CN')
```

</v-click>

---
transition: slide-up
---

# 测试：@web/test-runner + @open-wc/testing

```bash
pnpm add -D @web/test-runner @open-wc/testing @web/test-runner-playwright
```

```ts
import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './my-counter'
import type { MyCounter } from './my-counter'

it('渲染初始 label', async () => {
  const el = await fixture<MyCounter>(html`<my-counter label="Hi"></my-counter>`)
  expect(el.shadowRoot!.textContent).to.include('Hi')
})

it('点击后 count 增加', async () => {
  const el = await fixture<MyCounter>(html`<my-counter step="3"></my-counter>`)
  el.shadowRoot!.querySelector('button')!.click()
  await el.updateComplete
  expect(el.shadowRoot!.querySelector('.count')!.textContent).to.equal('3')
})

it('派发 change 事件', async () => {
  const el = await fixture<MyCounter>(html`<my-counter></my-counter>`)
  setTimeout(() => el.shadowRoot!.querySelector('button')!.click())
  const e = await oneEvent(el, 'change')
  expect(e.detail.count).to.equal(1)
})
```

---
transition: slide-up
---

# 跨浏览器测试

```js
// web-test-runner.config.mjs
import { playwrightLauncher } from '@web/test-runner-playwright'

export default {
  files: 'src/**/*.test.ts',
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  coverage: true,
}
```

<v-click>

::: warning jsdom 慎用
jsdom / happy-dom 对 Shadow DOM 支持有限——复杂场景仍建议用 Web Test Runner 跑**真实浏览器**。

`await el.updateComplete` 是必备习惯：等更新完成再断言 DOM。
:::

</v-click>

---
transition: slide-up
---

# vs Stencil

| 维度 | Lit 3 | Stencil 4 |
|---|---|---|
| 编译策略 | 运行时 | **编译时** |
| 模板语法 | `html` tagged template | JSX |
| Shadow DOM | 默认开（手动覆写走 light） | **默认 / 关闭可选** |
| 多输出 | 单源码 | **编译 React / Vue / Angular wrapper** |
| SSR | `@lit-labs/ssr`（Labs） | 内置 prerender |
| 包体积 | 5-7 KB | ~10 KB（运行时） |
| 响应式 API | `@property` setter | `@Prop` / `@State` / `@Watch` |
| 企业用户 | Adobe / IBM / SAP / Salesforce | Ionic / 多家 |

<v-click>

**怎么选**：

- **想要更接近 HTML 原生 + 更小体积** → Lit
- **已有 React 经验 + 想 React-first 但跨框架** → Stencil
- **要一键生成多框架 wrapper** → Stencil

</v-click>

---
transition: slide-up
---

# vs FAST / Hybrids / 原生

| 维度 | Lit 3 | Microsoft FAST | Hybrids | 原生 WC |
|---|---|---|---|---|
| 维护方 | Google | Microsoft | 个人 / 社区 | W3C |
| 模板语法 | `html` tagged template | `html` tagged template | 函数式 + descriptor | 手写 DOM |
| 类风格 | OOP（class + 装饰器） | OOP | **函数式** | OOP |
| 设计 Tokens | CSS Custom Property | **完整 Token 系统** | CSS Custom Property | 无 |
| 体积 | 5-7 KB | ~30 KB | ~3 KB | **0** |
| 企业使用 | Adobe Spectrum / IBM Carbon | Microsoft Fluent UI | 小众 | - |

<v-click>

::: tip 怎么选
- **企业组件库 / 跨框架设计系统** → **Lit**（最广采用 + 最稳生态）
- **Microsoft 生态** → FAST（Fluent UI 一脉相承）
- **函数式偏好** → Hybrids
- **学习 / demo** → 原生 Web Components
:::

</v-click>

---
transition: slide-up
---

# vs React / Vue / Angular

| 维度 | Lit 3 | React 19 | Vue 3.5 | Angular 18 |
|---|---|---|---|---|
| 自我定位 | Web Components 框架 | UI 库 | 完整框架 | 完整框架 |
| 跨框架可用 | **是** | 否 | 否 | 否 |
| 模板 | `html` tagged template | JSX | SFC 模板 | HTML 模板 |
| Virtual DOM | **无**（局部 dirty-check） | 有 | 有 | 无（增量 DOM） |
| 样式 | **Shadow DOM** | CSS Modules | scoped CSS | Shadow DOM / Emulated |
| 路由 | **无内置** | 无内置 | vue-router | @angular/router |
| 状态管理 | **无内置** | 无内置 | 无内置 | Signal Store |
| SSR | Labs | Next.js（生产） | Nuxt（生产） | Angular Universal |
| Bundle 核心 | **5-7 KB** | ~45 KB | ~25 KB | ~50 KB |

<v-click>

**Lit 不是 SPA 框架的替代** —— 它解决「**Web Components 开发效率**」问题。

</v-click>

---
transition: slide-up
---

# 实战：跨框架设计系统

完整流程：

```
@my-org/ui/
├── src/
│   ├── button/my-button.ts      # Lit 组件
│   ├── card/my-card.ts
│   ├── styles/tokens.ts          # CSS Custom Properties
│   └── index.ts
├── react-wrapper/                # @my-org/ui-react
│   └── src/index.ts              # @lit/react createComponent
├── vue-wrapper/                  # @my-org/ui-vue (可选)
├── custom-elements.json          # CEM (IDE 类型提示)
└── package.json
```

<v-click>

```ts
// styles/tokens.ts —— Design Tokens
export const tokens = css`
  :host {
    --color-primary: #007aff;
    --space-1: 4px;
    --space-2: 8px;
    --font-base: system-ui, sans-serif;
  }
  :host([theme="dark"]) {
    --color-text: white;
    --color-bg: #1a1a1a;
  }
`
```

</v-click>

---
transition: slide-up
---

# 实战：Button 组件

```ts
@customElement('my-button')
export class MyButton extends LitElement {
  static styles = [tokens, css`
    :host { display: inline-block; }
    button {
      font: var(--font-base);
      padding: var(--space-2) var(--space-4);
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
    .variant-primary { background: var(--color-primary); color: white; }
    .variant-danger { background: var(--color-danger); color: white; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]

  @property() variant: 'primary' | 'danger' | 'text' = 'primary'
  @property({ type: Boolean }) disabled = false

  render() {
    return html`
      <button
        class=${classMap({ [`variant-${this.variant}`]: true })}
        ?disabled=${this.disabled}
        @click=${this._onClick}
      ><slot></slot></button>
    `
  }

  private _onClick() {
    this.dispatchEvent(new CustomEvent('press', { bubbles: true, composed: true }))
  }
}
```

---
transition: slide-up
---

# 实战：React Wrapper

```ts
// react-wrapper/src/index.ts
import { createComponent } from '@lit/react'
import * as React from 'react'
import { MyButton } from '@my-org/ui'

export const Button = createComponent({
  tagName: 'my-button',
  elementClass: MyButton,
  react: React,
  events: { onPress: 'press' },
})
```

```tsx
// App.tsx（React 应用）
import { Button } from '@my-org/ui-react'

function App() {
  return (
    <Button variant="primary" onPress={() => alert('clicked')}>
      点击
    </Button>
  )
}
```

<v-click>

**Vue 不需要 wrapper**——Vue 3 原生支持 custom element：

```vue
<my-button variant="primary" @press="onPress">点击</my-button>
```

</v-click>

---
transition: slide-up
---

# 实战：发布与文档

```bash
# 生成 Custom Elements Manifest（IDE 类型提示）
pnpm add -D @custom-elements-manifest/analyzer
npx cem analyze --litelement

# package.json
{
  "customElements": "custom-elements.json"
}

# 发布
pnpm publish --access public
```

<v-click>

**消费方 IDE 体验**：

- VSCode / WebStorm 都支持读取 CEM
- 输入 `<my-button` 时自动补全 props / events / slots
- hover 显示 JSDoc 注释

</v-click>

<v-click>

::: tip 文档站
配合 **Storybook 7+** 或 **VitePress + Lit 集成**生成可交互文档站——文档站本身也是 Lit 组件的天然消费者。
:::

</v-click>

---
transition: slide-up
---

# 常见陷阱速查

<v-clicks>

- **`useDefineForClassFields: true` 与实验装饰器冲突** → 设 `false`
- **`@property` boolean** → HTML 中 attribute 存在即 true（即使 `disabled="false"`）
- **受控 input 不更新** → 必须用 `live(this.value)` 而非 `.value=${this.value}`
- **`unsafeHTML` XSS** → 只对可信输入
- **CustomEvent 不跨 Shadow DOM** → `composed: true` 才能穿透
- **`@queryAssignedElements` slot 名错** → 必须与模板 `<slot name="x">` 一致
- **CSS `::slotted` 只匹配直接子元素** → 嵌套结构匹配不到
- **Light DOM 模式 `static styles` 不生效** → 必须 Shadow DOM 才能样式隔离
- **`unsafeStatic` 摧毁模板缓存** → 慎用，会重新解析整个模板
- **`reflect: true` 性能开销** → 只在 CSS / 外部读 attribute 时开启

</v-clicks>

---
transition: slide-up
---

# 性能优化清单

<v-clicks>

- **`repeat` vs `map`** → 长列表 / 重排用 repeat（带 key）
- **`classMap` / `styleMap`** → 局部更新，比插表达式更高效
- **`guard(deps, fn)`** → 守护贵子模板
- **`cache(tpl)`** → Tab 切换保留隐藏 Tab 状态
- **`shouldUpdate`** → 跳过不必要的渲染
- **避免 `unsafeStatic`** → 摧毁模板缓存
- **少用 `reflect: true`** → 反射有开销
- **Reactive Controller 复用** → 多组件共用一份逻辑
- **`@lit-labs/virtualizer`** → 长列表虚拟滚动

</v-clicks>

---
transition: slide-up
---

# 不要选 Lit 的场景

<v-clicks>

- **完整 SPA + 重视成熟生态** → React + Next.js / Vue + Nuxt 仍首选
- **需要内置路由 / 状态管理 / 数据获取** → Angular / Nuxt / Next.js 更全
- **团队不熟悉 Shadow DOM** → 学习成本高，要重学样式系统
- **重度依赖 Tailwind utility 类** → Shadow DOM 把 utility 挡在外面
- **追求最广浏览器支持** → Lit 3 要 ES2021（IE11 不支持）
- **SEO 至上 + 高度依赖爬虫看到内容** → SSR 仍 Labs

</v-clicks>

<v-click>

> **经验**：跨框架设计系统 / 微前端 / 大型企业组件库 → **Lit 首选**。完整 SPA → React/Vue/Angular。

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **跨框架设计系统 → 首选 Lit**：唯一能让 React / Vue / Angular / HTML 共用的方案
- **微前端 / 嵌入式 SDK → Lit 体积最小**：5-7 KB 不污染宿主框架
- **企业组件库 → Lit 有大厂背书**：Adobe / IBM / SAP / Salesforce
- **`useDefineForClassFields: false`** → 实验装饰器路线必做
- **Shadow DOM 默认开** → 用 CSS Custom Properties 主题化
- **Reactive Controller 替代 Mixin** → 优先组合
- **`@lit/context` 跨层级共享** → 比 prop drilling 干净
- **`@lit/task` 异步数据** → 不要自己造 loading / error 状态机
- **`@lit/react` 包装给 React** → 即使 React 19 原生支持也建议用
- **`@web/test-runner` 真实浏览器** → 不要用 jsdom 测 Shadow DOM
- **生成 Custom Elements Manifest** → 消费方 IDE 自动补全

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：跨框架设计系统 / 微前端 / 嵌入式 SDK / 大型企业组件库

少做：完整 SPA / 重生态依赖 / Tailwind utility 重度使用

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://lit.dev/" target="_blank">lit.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/lit/lit" target="_blank">lit/lit</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://lit.dev/playground/" target="_blank">Lit Playground</a>
</div>
