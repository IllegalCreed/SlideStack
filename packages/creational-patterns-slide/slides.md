---
theme: seriph
background: https://cover.sli.dev
title: 创建型设计模式完全指南
info: |
  创建型设计模式完全指南：工厂方法 · 抽象工厂 · 建造者 · 原型 · 单例

  Learn more at [https://refactoring.guru/design-patterns/creational-patterns](https://refactoring.guru/design-patterns/creational-patterns)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 创建型设计模式

GoF 五种创建型模式 · 前端 JS/TS 实践 · ES2022

<div @click="$slidev.nav.next" class="mt-12 py-1 hover:bg-white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
创建型模式抽象「对象实例化」的过程，让客户端代码不直接 new 具体类。
-->

---
transition: fade-out
---

# 什么是创建型模式

GoF 二十三种设计模式中的**第一大类**，共 5 种

- **核心目标**：抽象「对象实例化」过程，让客户端不直接 `new`
- **解耦点**：分离「对象怎么来」与「对象怎么用」
- **GoF 三大类**：创建型（5）/ 结构型（7）/ 行为型（11）

**五种模式按维度差异划分**

- 工厂方法：**继承 + 单一产品**
- 抽象工厂：**组合 + 一族产品**
- 建造者：**分步装配复杂对象**
- 原型：**克隆已有实例**
- 单例：**全局唯一实例**

> 所有五种模式解决的都是「对象怎么来」——而不是「怎么用、怎么组合」。

<!--
创建型模式的本质：把 new 这个动作抽象出来。
-->

---

# 五模式速览

| 模式 | 意图 | JS/TS 落地 |
|------|------|------|
| **工厂方法** | 子类决定实例化哪种产品 | React `createElement`、Vue `h()` |
| **抽象工厂** | 创建一族相关产品 | 多主题 UI 组件库 |
| **建造者** | 分步装配复杂对象 | 链式 `setA().setB().getResult()` |
| **原型** | 克隆已有实例 | `Object.create` / `structuredClone` |
| **单例** | 全局唯一实例 | ES Module `export const` |

**五种模式常组合使用**

- 抽象工厂基于一组工厂方法实现
- Builder / 原型 / 工厂都可被实现为单例；原型与工厂方法互为替代（克隆 vs 继承）

<!--
五模式不是孤立选择，常常组合出现。
-->

---

# 工厂方法：意图与角色

**子类决定实例化哪种产品**

四个核心角色

- **Product（产品接口）**：所有产品的统一抽象（`Button`）
- **ConcreteProduct（具体产品）**：`HTMLButton` / `WindowsButton`
- **Creator（创建者基类）**：声明 `createButton(): Button`
- **ConcreteCreator（具体创建者）**：重写方法 `return new HTMLButton()`

**关键要点**

- 返回类型必须是**产品接口**而非具体类（依赖倒置）
- 创建不是 Creator 的主业——Dialog 主业是渲染，工厂方法只是钩子
- 何时用：客户端与具体产品解耦、希望扩展不改 Creator 核心逻辑

<!--
返回产品接口是开闭原则的落地。
-->

---

# 工厂方法：JS/TS 实现

```ts
interface Button { render(): void; }

class HTMLButton implements Button {
  render() { console.log("HTML 按钮"); }
}

abstract class Dialog {
  // 工厂方法：返回产品接口，由子类决定实例化哪种
  abstract createButton(): Button;

  renderDialog() {
    const btn = this.createButton(); // 客户端只依赖 Button 接口
    btn.render();
  }
}

class WebDialog extends Dialog {
  createButton(): Button { return new HTMLButton(); }
}

const d: Dialog = new WebDialog();
d.renderDialog(); // 渲染 HTML 按钮
```

> `createButton(): Button` 而非 `: HTMLButton`——这是开闭原则的落地。

<!--
子类决定实例化哪种产品，客户端依赖抽象。
-->

---

# 抽象工厂：意图与角色

**创建一族相关产品并保证风格一致**

四个核心角色

- **AbstractProduct**：每种产品一个接口（`Button`、`Checkbox`）
- **ConcreteProduct**：`WinButton` / `MacButton`、`WinCheckbox` / `MacCheckbox`
- **AbstractFactory**：声明一族 `createButton() / createCheckbox()`
- **ConcreteFactory**：`WinFactory` / `MacFactory` 保证整族风格

**关键要点**

- 同一工厂产出的整族产品**风格必然一致**
- 新增产品种类（如 `createSlider`）要改所有工厂接口——**违反开闭**
- 何时用：多平台 / 多主题 / 一套兼容组件族，且产品种类稳定

<!--
抽象工厂的代价：加新产品种类违反开闭原则。
-->

---

# 工厂方法 vs 抽象工厂

| 维度 | 工厂方法 | 抽象工厂 |
|------|------|------|
| 创建维度 | **单一产品** | **一族相关产品** |
| 实现机制 | **继承**（子类重写） | **组合**（客户端持工厂） |
| 扩展产品类型 | 加子类（开闭友好） | 加产品种类改所有接口（违反） |
| 复杂度 | 4 角色 | 4 × N 角色 |
| 典型场景 | Dialog + 不同 Button | WinFactory / MacFactory 整族 |

> 抽象工厂常基于一组工厂方法实现。

<!--
工厂方法用继承，抽象工厂用组合。
-->

---

# 建造者：链式装配

**分步装配复杂对象，解决伸缩构造函数**

```ts
class Car {
  constructor(
    public seats: number = 2,
    public engine?: string,
    public gps: boolean = false
  ) {}
}

class CarBuilder {
  private car = new Car();

  setSeats(n: number): this { this.car.seats = n; return this; }
  setEngine(e: string): this { this.car.engine = e; return this; }
  enableGPS(): this { this.car.gps = true; return this; }

  getResult(): Car { return this.car; } // 末尾一次性返回
}

// 简单场景直接链式，无需 Director
const car = new CarBuilder().setSeats(4).setEngine("V8").enableGPS().getResult();
```

> Director 不是必需——多套标准构造流程需要复用时才有价值。

<!--
链式 Builder：每个 setXxx 返回 this。
-->

---

# 原型：Object.create 与陷阱

**`Object.create(proto, descriptors?)` 是原型模式的语言级 API**

```ts
const proto = { greet() { return "hi"; } };

const obj = Object.create(proto);
obj.greet(); // "hi"——沿原型链找到 proto.greet

// 陷阱 1：传非对象非 null 的 proto 抛 TypeError
Object.create(42);     // TypeError

// 陷阱 2：propertiesObject 属性默认全 false（与字面量不同！）
const o = Object.create({}, { p: { value: 42 } });
o.p = 24;              // 严格模式抛错（p 是只读的）
for (const k in o) {}  // 遍历不到（p 不可枚举）

// 修复：显式声明描述符
const o2 = Object.create({}, {
  p: { value: 42, writable: true, enumerable: true, configurable: true }
});
```

> Object.create 是 ES5（2009）API，全环境稳定支持。

<!--
propertiesObject 的属性默认全 false 是大坑。
-->

---

# 原型：structuredClone 能力边界

**现代深拷贝标准**（Chrome 98+ / Node 17+）：支持循环引用、Date、Map/Set、TypedArray

```ts
const a = { date: new Date(), map: new Map(), self: null as any };
a.self = a;                   // 循环引用
structuredClone(a);           // 全部正确克隆

structuredClone(new ArrayBuffer(8), { transfer: [buf] }); // transferable 转移
```

**不可克隆**：函数 / DOM / Symbol　**关键陷阱：不保留原型链**

```ts
class Person { constructor(public name: string) {} greet() { return `hi`; } }
const p = new Person("Alice");
const c = structuredClone(p);
c instanceof Person; // false！原型方法丢失
```

> 类实例克隆要自实现 `clone()` 方法。

<!--
类实例别用 structuredClone——原型链会丢。
-->

---

# 单例：三要素

**保证全局只有一个实例并提供访问点**

- **私有静态 instance** · **私有构造函数** · **公有 getInstance()**

```ts
class Database {
  private static instance: Database;
  private constructor(private connStr: string) {}
  public static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database("mysql://localhost/db");
    return Database.instance;
  }
}
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true——全局唯一
```

> 单例同时解决「唯一性」+「全局访问」——**违反单一职责**。

<!--
TS 用 private constructor 编译期约束外部 new。
-->

---

# 现代 JS 替代：ES Module 单例

**模块规范保证仅求值一次——天然单例**

```ts
// config.ts
export const config = {
  apiBaseUrl: "https://api.example.com",
  timeout: 5000,
};

// 多处 import 拿到的是同一对象，模块顶层代码仅跑一次
```

**优先用 ES Module 单例而非手写类**

- 没有隐藏静态依赖——import 关系在文件顶部可见
- 懒加载友好——首次 import 才执行
- Tree-shaking 友好——未用导出可被构建器消除
- 不引入测试 mock 困难——手写 Singleton 的私有构造极难替换

**反模式：双重检查锁（DCL）**

JS 单线程无抢占，DCL 是 JVM 多线程产物，在 JS 里纯属噪音。异步竞态用 Promise 缓存解决而非锁。

<!--
现代代码推荐 ES Module 单例替代手写 Singleton 类。
-->

---

# 前端框架工厂实践

**主流框架的核心 API 本质就是工厂方法**

```ts
// React：工厂函数封装 vnode 构造，调用方不直接 new
const el = React.createElement(
  "button",
  { onClick: () => alert("hi") },
  "点我"
);

// Vue 3：h 是 hyperscript（生成 HTML 的脚本）的简称
import { h } from "vue";
const vnode = h("button", { onClick: () => alert("hi") }, "点我");
```

两者都返回**抽象的虚拟节点**而非具体 DOM——后续 reconciler / patch 根据 vnode 类型创建真实 DOM。

**单例在状态管理层的落地**

```ts
// Pinia——useXxxStore() 在应用生命周期内返回同一 store 实例
import { useUserStore } from "@/stores/user";
const store = useUserStore(); // 全局唯一
```

> 工厂函数 + 单例 store 是创建型模式在前端的日常落地。

<!--
React.createElement 和 Vue h() 都是工厂函数。
-->

---

# 反模式速查

**最易踩的坑**

- 把所有全局状态塞进一个 Singleton → **God Object**，测试难 mock
- 用 `JSON.parse(JSON.stringify(obj))` 深拷贝 → 丢 Date / Map / Set、循环引用抛错
- 用 `structuredClone` 复制类实例后期望保留方法 → 原型方法 undefined、`instanceof` 失败
- `Object.create(42)` 传非对象 proto → 抛 TypeError
- `Object.create({}, { p: { value: 42 } })` 误以为新属性默认可写 → 默认全 false，赋值静默失败
- 简单产品（1-2 种按钮）就上抽象工厂 → 接口爆炸，违反 YAGNI
- 工厂方法在 Creator 里把创建当主业 → 应抽成独立简单工厂
- JS 里写 `if(!instance) instance = new X()` 配双重检查锁 → JS 无抢占，DCL 多余
- 用 `Object.create` 实现继承后忘修复 constructor → 变成 Parent

<!--
反模式的核心：过度设计 + 用错工具。
-->

---
layout: center
class: text-center
---

# 小结

创建型模式 = 把对象实例化抽象出来

工厂方法 · 抽象工厂 · 建造者 · 原型 · 单例

**解耦创建与使用 · 用语言能力替代手写模式 · 警惕过度设计**

[Refactoring.Guru](https://refactoring.guru/design-patterns/creational-patterns) · [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) · [Addy Osmani](https://patterns.addyosmani.com)

<!--
掌握「把 new 抽象出来」的工程思维是学习所有设计模式的起点。
-->
