---
theme: seriph
background: https://cover.sli.dev
title: 结构型设计模式
info: |
  GoF 结构型设计模式完全指南：7 个模式 + 前端落地

  适配器 / 桥接 / 组合 / 装饰器 / 外观 / 享元 / 代理

  Learn more at https://refactoring.guru/design-patterns/structural-patterns
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 结构型设计模式

GoF 七大模式 · 前端 JS / TS 实现 · Vue reactive · React HOC

<div @click="$slidev.nav.next" class="mt-12 py-1 hover:bg-white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
结构型模式关注「类与对象怎么组合成更大结构」，是 GoF 二十三模式中的第二大类，共 7 个。
-->

---
transition: fade-out
---

# 什么是结构型模式

GoF 二十三模式中的第二大类，共 **7 个**

- **关注点**：类与对象怎么组合成更大的结构
- **创建型 vs 结构型 vs 行为型**
  - 创建型：对象**怎么建**（5 个：单例 / 工厂 / 抽象工厂 / 建造者 / 原型）
  - **结构型**：对象**怎么组合**（7 个）
  - 行为型：对象**怎么协作**（11 个）
- **核心问题**：让原本不兼容或松散的类协作起来
- **典型前端落地**：Vue 3 reactive、React HOC、组件树、虚拟列表

> 假设对象已存在，关心它们的接口契约与组合关系。

<!--
Composite 是结构型（静态树结构），Observer 是行为型（运行时事件流）。
-->

---

# 七大模式速览

| 模式 | 一句话意图 | 前端典型场景 |
|------|------|------|
| **Adapter** | 转换不兼容接口 | 回调转 Promise / 新旧 API 迁移 |
| **Bridge** | 拆抽象与实现两套继承树 | 跨平台 UI / 主题系统 |
| **Composite** | 树形结构统一处理 | UI 组件树 / AST / 虚拟 DOM |
| **Decorator** | 动态叠加职责 | React HOC / middleware |
| **Facade** | 给子系统定义简化接口 | SDK 入口 / API 封装层 |
| **Flyweight** | 共享细粒度对象省内存 | 虚拟列表 / DOM 节点池 |
| **Proxy** | 同接口控制访问 | Vue reactive / 懒加载 / 缓存 |

<!--
七个模式意图相近易混淆，重点记意图差异。
-->

---

# 五者意图辨析（最常考）

| 维度 | Adapter | Bridge | Facade | Proxy | Decorator |
|------|------|------|------|------|------|
| **时机** | 事后补救 | 设计期 | 重封装 | 访问控制 | 行为增强 |
| **对象** | 单个 | 抽象+实现 | 整个子系统 | 单个 | 单个 |
| **接口** | 与 Target 一致 | 拆两套 | 新简化接口 | 与 Subject 一致 | 同接口 |
| **生命管理** | 不管 | 不管 | 不管 | **自管** | 客户端组装 |
| **可递归** | 否 | 否 | 否 | 视变体 | **链式叠加** |

> 选型决策：① 接口不兼容 → Adapter；② 多维度变化 → Bridge；③ 子系统复杂 → Facade；④ 懒加载 / 权限 → Proxy；⑤ 动态叠加 → Decorator。

<!--
Adapter 与 Bridge 最易混：Adapter 事后补救，Bridge 设计期决策。
-->

---

# Adapter 适配器

把不兼容接口转换成客户端期望的接口

- **角色**：Target / Adaptee / Adapter（持 Adaptee 引用）
- **对象适配器**：基于组合（implements Target + 持 Adaptee）
- **类适配器**：基于多继承（仅 C++ 支持，JS / TS 不能用）

**前端典型场景**

- 回调转 Promise（`util.promisify`）
- 第三方库封装（jQuery → fetch 接口）
- 新旧 API 迁移（v1 调用方通过 Adapter 兼容 v2）

```ts
class AjaxAdapter implements Fetcher {
  private legacy = new LegacyAjax();
  fetch(url: string) {
    return new Promise((resolve, reject) => {
      this.legacy.request(url, (e, d) => (e ? reject(e) : resolve(d)));
    });
  }
}
```

<!--
Adapter 必须保持接口契约，只做协议转换，不增删方法。
-->

---

# Bridge 桥接

把抽象与实现拆成两套独立继承树

- **解决**：多维度变化的类爆炸（控件 × 颜色 × 平台 × 主题）
- **角色**：Abstraction / RefinedAbstraction / Implementor / ConcreteImplementor
- **关键**：抽象层持 Implementor 引用，两套独立演化

```ts
interface Renderer { renderCircle(r: number): void; }
class WebGLRenderer implements Renderer { /* ... */ }
class CanvasRenderer implements Renderer { /* ... */ }

abstract class Shape {
  constructor(protected renderer: Renderer) {}
}
class Circle extends Shape {
  constructor(r: Renderer, private radius: number) { super(r); }
}
```

> 前端典型：React Native Renderer 抽象（iOS / Android 实现）、跨平台 UI 框架。

<!--
Bridge 是设计期决策；事后补救用 Adapter，别混。
-->

---

# Composite 组合

树形结构统一处理 Leaf 与 Composite

- **角色**：Component / Leaf / Composite（持子节点列表）
- **关键原则**：Leaf 与 Composite **共享同一 Component 接口**
- **前端典型**：UI 组件树、AST、虚拟 DOM、文件系统

**透明式 vs 安全式**

| 设计 | add/remove 位置 | 优点 | 缺点 |
|------|------|------|------|
| 透明式 | Component 接口 | 无须 instanceof | 违反 ISP |
| 安全式 | 仅 Composite | 接口干净 | 需 instanceof |

> UI 组件树普遍用透明式，以统一递归遍历。

<!--
透明式 Leaf 不能 throw，应留空，否则遍历崩溃。
-->

---

# Decorator 装饰器

不改接口下动态叠加职责，链式叠加成栈

- **角色**：Component / ConcreteComponent / BaseDecorator（持引用 + 默认委托）/ ConcreteDecorator
- **执行顺序**：最外层前置 → 逐层向内 → 最内层执行 → 逐层向外后置
- **比继承灵活**：运行时自由组合多个装饰器，无类爆炸

```ts
const ds = new Compression(
  new Encryption(new FileSource("a.txt"))
);
ds.write("hello");
// 写入：[zip][enc]hello
```

> React HOC = Decorator 的函数式实现：`HOC(Wrapped) => Enhanced`。

<!--
链式叠加是 Decorator 的精髓，配合 React HOC 一起讲。
-->

---
layout: two-cols
---

# React HOC 六大注意

React 官方明确 HOC 是 Decorator 的函数式实现

1. **用组合不修改原型**——mixins / 改 prototype 是反模式
2. **透传无关 props**——`{...passThroughProps}`
3. **绝不在 render 内部调用 HOC**——触发子树卸载重挂载
4. **ref 不自动透传**——需 `React.forwardRef`
5. **静态方法需 `hoist-non-react-statics` 拷贝**
6. **设 displayName**——`withAuth(MyComp)`

::right::

# HOC 签名

**经典柯里化**

```ts
connect(selector)(Component);
withRouter(Component);
```

**装饰器形式**

```ts
@withRouter
@withAuth
class MyPage extends Component {}
```

> 单参一等函数 `Component => Component` 可作 ES 装饰器语法。

<!--
react-redux connect / react-router withRouter 是 HOC 经典案例。
-->

---

# Facade 外观

为复杂子系统定义新的简化统一接口

- **角色**：Facade（对外） / Subsystem Classes（复杂子系统）
- **与 Adapter 区别**：
  - Adapter 包装**单个对象**做协议转换
  - Facade 给**整个子系统**定义**新简化接口**

**前端典型场景**

- 统一 API 封装层：`window.$API` 把 fetch / WebSocket / localStorage 包成统一入口
- SDK 简化入口：支付 SDK 一键调用风控 / 签名 / 下单 / 跳转
- 智能家居一键模式：「回家模式」一键关窗帘、开灯、开空调

> Facade 应保持精简，膨胀时考虑拆成多个 Facade。

<!--
Facade 与 Adapter 关键差异：Facade 是新接口，Adapter 是接口转换。
-->

---

# Flyweight 享元

共享细粒度对象的内在状态省内存

- **角色**：Flyweight / ConcreteFlyweight / FlyweightFactory（对象池）/ Context
- **关键**：区分**内在状态** vs **外在状态**

| 状态 | 共享 | 可变 | 存储 | 例子 |
|------|------|------|------|------|
| 内在 | ✅ | ❌ freeze | Flyweight | 棋子颜色、DOM 结构 |
| 外在 | ❌ | ✅ | Context | 坐标、文本、数据项 |

**前端典型**：虚拟列表（react-window）、DOM 节点池、纹理 / 字体缓存

> **何时用**：对象万级以上 + 大量重复；**何时不用**：对象少或无可共享。

<!--
虚拟列表是 Flyweight 工程化：DOM 复用 + 数据切换。
-->

---
layout: two-cols
---

# Proxy 代理

同接口控制访问，自主管理 RealSubject 生命周期

- **角色**：Subject / RealSubject / Proxy（接口一致可互换）

**六变体**

<div class="text-sm">

| 变体 | 意图 |
|------|------|
| Virtual | 延迟初始化 |
| Protection | 权限校验 |
| Remote | 远程对象 |
| Logging / Smart Ref | 调用日志 / 引用计数 |
| Caching | 结果缓存 |

</div>

::right::

# Proxy vs Decorator

| 维度 | Proxy | Decorator |
|------|------|------|
| 生命管理 | **自管** | 客户端组装 |
| 意图 | 控制访问 | 增强行为 |
| 何时用 | 懒加载 / 权限 | 日志 / 性能 |

**前端典型**：图片懒加载=Virtual · 接口鉴权=Protection · 请求缓存=Caching

<!--
本应懒加载写成 Decorator 是反模式——客户端被迫组装，丧失自管性。
-->

---

# JS Proxy + Vue reactive

ES6 Proxy 是 Proxy 设计模式的**语言特性**

```ts
const proxy = new Proxy(target, {
  get(obj, key, receiver) {
    track(obj, key);            // Vue 3 收集依赖
    return Reflect.get(obj, key, receiver);
  },
  set(obj, key, v, receiver) {
    const ok = Reflect.set(obj, key, v, receiver);
    if (obj[key] !== v) trigger(obj, key);
    return ok;                   // 必须 return true
  },
});
```

**三原则**：① 配合 Reflect 转发 ② `set` 返回 true ③ 私有字段用 target

> Vue 3 弃 `Object.defineProperty` 选 Proxy：能感知属性增删、拦截 `in` / `ownKeys` / 数组索引、惰性深度响应。

<!--
Vue 3 reactive = Proxy 设计模式（意图） + JS Proxy（语言能力）的工业级落地。
-->

---

# JS Proxy 13 个 trap

<div class="text-sm">

| 类别 | trap（共 13） | 拦截 |
|------|------|------|
| 属性 | `get` `set` `has` `deleteProperty` | 读 / 写 / in·with / delete |
| 描述符 | `defineProperty` `getOwnPropertyDescriptor` | 定义 / 读描述符 |
| 原型 | `getPrototypeOf` `setPrototypeOf` | 原型读 / 写 |
| 扩展性 | `isExtensible` `preventExtensions` | isExtensible / preventExtensions |
| 函数 | `apply` `construct` | 函数调用 / new |
| 枚举 | `ownKeys` | Object.keys |

</div>

**限制**

- 不能代理私有字段 `#field`、不能转发 Map/Set/Date 内部插槽（用 target）
- target 必须是对象（原始值不行）、无法 polyfill 到 ES5

<!--
违反 Proxy invariants 会抛 TypeError；Map/Set 等原生对象直接代理会崩。
-->

---
layout: quote
---

# Proxy 设计模式 ≠ JS Proxy 对象

「前者是『控制访问的意图』，后者是『实现手段』；Vue 3 reactive 是用语言特性落地设计模式的范例。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 修改被装饰组件原型（mixins / 改 prototype）
- 在 render 内部调用 HOC（子树卸载重挂载）
- Proxy trap 不用 Reflect、`set` 不返回 true（抛 TypeError）
- 享元在对象数量少时强用（无内存收益）
- 混淆 Adapter / Bridge / Facade / Proxy / Decorator 意图
- Composite 透明式 Leaf 中 throw（遍历崩溃）
- HOC 不透传 props（破坏下游契约）
- 继续把 Vue 2 defineProperty 思路用于新项目

<!--
意图选错是最常见的反模式，先理清意图再选型。
-->

---
layout: center
class: text-center
---

# 小结

结构型模式 = 类与对象怎么组合成更大结构

7 个模式 · 前端 JS / TS 实现 · Vue reactive · React HOC

**优先组合而非继承 · 接口意图先于实现 · Proxy 设计模式 ≠ JS Proxy 对象**

[Refactoring.Guru](https://refactoring.guru/design-patterns/structural-patterns) · [MDN Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [GoF 书](https://en.wikipedia.org/wiki/Design_Patterns)

<!--
掌握五者意图辨析 + 前端落地映射，结构型模式就过了主干。
-->
