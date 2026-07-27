---
theme: seriph
background: https://cover.sli.dev
title: 行为型设计模式
info: |
  GoF 行为型 10 模式：责任链 / 命令 / 迭代器 / 中介者 / 备忘录 / 观察者 / 状态 / 策略 / 模板方法 / 访问者

  参考资源：Refactoring.Guru · Node.js EventEmitter · XState v5 · MDN 迭代协议
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 行为型设计模式

GoF 10 模式 · 对象协作与通信 · 前端 JS/TS 实现

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
行为型模式关注对象间职责分配与通信算法，是 1994 年 GoF 23 模式中前端工程化最常用的 10 个。
-->

---
transition: fade-out
---

# 什么是行为型设计模式

GoF 23 模式中**关注「对象间职责分配与通信」**的一类

- **关注点**：对象怎么协作、谁在什么时候做什么、信息怎么流动
- **数量**：共 10 个（不含几乎不用在前端的 Interpreter）
- **稳定不变**：GoF 1994 至今 30 年验证，语言无关
- **前端落地现代**：迭代器/观察者是 JS 语言级内置
- **三大场景**：通信（观察者/中介者/责任链）、职责（命令/策略/状态/模板方法）、状态（备忘录/状态/命令）

> 类比：创建型「工厂造零件」、结构型「零件装机器」、行为型「机器运行时各零件如何协调」。

<!--
重点：行为型不涉及对象的创建和组合装配，只回答协作与通信。
-->

---
layout: two-cols
---

# 十模式速览

| 模式 | 定义 | 落地 |
|------|------|------|
| **责任链** | 请求沿链传递 | Express/Koa |
| **命令** | 封装请求，支持 undo | 编辑器/Redux |
| **迭代器** | 统一协议遍历 | `for...of` |
| **中介者** | 中心协调组件 | mitt |
| **备忘录** | 保存恢复状态 | 编辑器撤销 |

::right::

<br>

| 模式 | 定义 | 落地 |
|------|------|------|
| **观察者** | 一对多通知 | EventEmitter |
| **状态** | 行为随状态变 | XState v5 |
| **策略** | 算法切换 | 表单校验器 |
| **模板方法** | 骨架+重写 | React 生命周期 |
| **访问者** | 加操作不改类 | Babel/ESLint AST |

<!--
十个模式覆盖了前端工程化协作的所有常见场景。
-->

---

# 责任链 Chain of Responsibility

**意图**：把请求沿处理器链传递，每个 Handler 决定处理或转交

```ts
abstract class Handler {
  private next: Handler | null = null;

  // 关键：返回 handler 以支持链式 a.setNext(b).setNext(c)
  public setNext(h: Handler): Handler {
    this.next = h;
    return h;
  }

  public handle(req: string): string | null {
    if (this.next) return this.next.handle(req);
    return null; // 链尾兜底
  }
}
```

**前端落地**：Express / Koa 中间件 `next()`、axios `interceptors`

**反模式**：Handler 既不处理也不调用 `next` → 请求静默丢失

<!--
setNext 返回 handler 是关键设计，支持链式组装；Express middleware 是工程化实现。
-->

---

# 命令 Command

**意图**：把请求封装成对象，支持 undo/redo

```ts
interface Command {
  execute(): void;
  undo(): void;
}

class CommandHistory {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  public push(cmd: Command) {
    this.undoStack.push(cmd);
    this.redoStack = []; // 关键：清空 redoStack 防分支错乱
  }
}
```

**关键纪律**：

- 必须用**双栈**（单栈无法 redo）
- `execute` 前必须 `saveBackup`（undo 时才有状态恢复）
- 新命令入栈清空 `redoStack`

<!--
富文本编辑器、Redux dispatch 都是命令模式的体现。
-->

---

# 迭代器 Iterator

**ES6 已语言级内置**，无需写 Iterator 抽象类

- **Iterable 协议**：`[Symbol.iterator]()` 返回迭代器
- **Iterator 协议**：`next() → { value, done }`
- **消费方式**：`for...of` / 扩展 `...` / 解构 / `Array.from()`
- **内置 Iterable**：Array / Map / Set / String / NodeList

```ts
function* rangeGen(start: number, end: number) {
  for (let i = start; i <= end; i++) yield i;
}

for (const n of rangeGen(1, 3)) console.log(n); // 1 2 3
```

**反模式**：多个消费者共用一个迭代器实例 → 互相踩状态

> Generator（`function*` + `yield`）是创建迭代器的语法糖。

<!--
关键纪律：[Symbol.iterator]() 每次调用必须返回新迭代器。
-->

---
layout: two-cols
---

# 中介者 Mediator

**意图**：用中心对象协调多组件，消除网状依赖（N×N → N×1）

**三角色**

- `Mediator` 接口：`notify(sender, event)`
- `ConcreteMediator`：持所有 Component 引用
- `Component`：只持 Mediator 引用，互不感知

**前端落地**

- Vue 3 mitt（替代 Vue 2 event bus）
- 复杂对话框（按钮 + 输入 + 列表）协调
- Pinia / Redux 是宏观中介者

::right::

# EventBus vs Mediator

| 维度 | Mediator | EventBus |
|------|----------|----------|
| 通信 | 集中协调 | 松散订阅 |
| 感知 | 知道组件身份 | 只关心事件名 |
| 协调 | 内部封装 | 散落订阅者 |

**反模式**：God Mediator

中介者膨胀成全知全能巨型类，所有逻辑堆在 `notify` 里 → 拆多个职责单一的中介者

<!--
EventBus 是 Mediator + Observer 的松散混合形式。
-->

---

# 备忘录 Memento

**意图**：不破坏封装下保存与恢复对象内部状态

**三角色**

- `Originator`（原发器）：`createSnapshot()` + `restore(snap)`
- `Memento`（备忘录）：**不可变**状态快照
- `Caretaker`（管理者）：管栈但不修改内容

```ts
class EditorMemento {
  constructor(
    public readonly text: string,
    public readonly cursor: number
  ) {}
}
```

**关键纪律**

- Memento 必须不可变（防篡改）
- 限制历史长度（典型 50 步）防内存膨胀
- 与 Command 配合：Command 当 Caretaker，execute 前 saveBackup

<!--
富文本撤销、游戏存档、表单草稿都是备忘录的典型应用。
-->

---

# 观察者 Observer

**一对多依赖，目标状态变化自动通知所有订阅者**

| 落地形态 | API | 模型 |
|---------|-----|------|
| **EventEmitter** | `on/emit/once/off` | 推 / 拉 |
| **Redux store.subscribe** | `subscribe + getState` | 拉模型 |
| **mitt / EventTarget** | `on/emit/off` | 事件总线 |

```ts
const ee = new EventEmitter();
const onMsg = (d: string) => console.log(d);
ee.on("msg", onMsg);
ee.emit("msg", "hello");
ee.off("msg", onMsg); // 组件卸载必须取消订阅！
```

**反模式**：未取消订阅 → 内存泄漏；通知风暴 → 用 selector + 浅比较

<!--
未取消订阅是前端内存泄漏的头号来源。
-->

---

# 状态 State

**状态变化时行为也跟着变**，消除巨型 switch-case

**vs 策略的关键区别**

| 维度 | 状态 | 策略 |
|------|------|------|
| 状态间感知 | 可相互感知 | 互不感知 |
| 主动切换方 | 状态对象自身 | 客户端 |

```ts
import { createActor, createMachine } from "xstate";
const machine = createMachine({
  initial: "inactive",
  states: {
    inactive: { on: { TOGGLE: "active" } },
    active: { on: { TOGGLE: "inactive" } },
  },
});
createActor(machine).start(); // v5 用 createActor 替代 v4 interpret
```

<!--
状态超过 3 个或转换有守卫/副作用时，必须用 XState 而非手写 switch。
-->

---

# 策略 Strategy

**一族可互换算法运行时切换**，典型应用：表单校验器

```ts
interface Validator {
  validate(v: string): string | null;
}

class EmailValidator implements Validator {
  validate(v: string) {
    return /^[^@]+@[^@]+\.[^@]+$/.test(v) ? null : "邮箱格式错误";
  }
}

class FormField {
  constructor(private validators: Validator[] = []) {}
  public addValidator(v: Validator) {
    this.validators.push(v);
    return this;
  }
  public validate(value: string) {
    return this.validators.map((v) => v.validate(value));
  }
}
```

**JS 替代方案**：高阶函数数组 `ValidatorFn[]`，无需 Strategy 抽象类

<!--
Refactoring.Guru：现代语言可用高阶函数实现策略而无需额外类。
-->

---

# 模板方法 Template Method

**父类定义算法骨架，子类重写个别步骤**

**三种步骤类型**

- **抽象步骤**：父类声明 abstract，子类必须实现
- **可选步骤**：父类默认实现，子类可重写
- **钩子 Hook**：空方法扩展点，默认不影响骨架

```ts
abstract class Pipeline {
  // 模板方法：约定不重写（TS 无 final，靠注释约束）
  public run(): void {
    const data = this.parse(this.fetch());
    if (this.shouldSave(data)) this.save(data);
    this.afterSave(); // 钩子，默认空操作
  }
  protected abstract fetch(): string;
  protected abstract parse(raw: string): unknown;
  protected shouldSave(d: unknown): boolean { return true; }
  protected afterSave(): void {}
}
```

**反模式**：钩子里塞大量业务逻辑改变流程，实质重写骨架

<!--
模板方法 vs 策略：继承（静态）vs 组合（运行时可切换）。
-->

---

# 访问者 Visitor

**不修改类的前提下为其新增操作（双分派）**

**前端典型**：Babel / ESLint 插件 visitor 对象遍历 AST

```ts
const babelPlugin = () => ({
  name: "no-console",
  visitor: {
    // 每个 AST 节点类型对应一个 visit 方法
    CallExpression(path) {
      const callee = path.get("callee");
      if (callee.isMemberExpression()) {
        const obj = callee.get("object");
        if (obj.isIdentifier({ name: "console" })) path.remove();
      }
    },
  },
});
```

**双分派**：`element.accept(v)` 内 `v.visitXxx(this)`——先按 element 类型，再按 visitor 类型共同决定执行

**反模式**：对象结构频繁变动用 Visitor（每加元素类型就要改所有 Visitor）

<!--
仅在「对象结构稳定但操作频繁变化」时用 Visitor，AST 节点类型固定但 lint/transform 规则常新增。
-->

---
layout: quote
---

# 解耦协作，分清职责

「行为型模式回答的是：对象之间怎么协作、谁在何时做什么、信息怎么流动。」

---
layout: center
class: text-center
---

# 反模式清单

**最易踩的坑**

- 责任链断裂：Handler 既不处理也不调用 `next`
- 观察者未取消订阅 → 内存泄漏
- 单栈 undo 无法 redo
- 巨型 switch-case 模拟状态机
- God Mediator 中介者膨胀
- 备忘录不限制历史长度 → 快照栈爆炸
- Visitor 用于变动结构 → 维护成本爆炸
- 1-2 个变体硬套策略/状态类层次（过度设计）
- 共享迭代器实例 → 多消费者互相踩状态
- 模板方法钩子被滥用实质重写骨架

<!--
每个反模式都是 GoF 模式要消除的反面典型。
-->

---
layout: center
class: text-center
---

# 小结

行为型模式 = 对象协作与通信的词汇表

10 模式 · GoF 1994 · 前端 JS/TS 现代化落地

**优先用语言内置 · 状态机用 XState · undo 必双栈 · 卸载必取消订阅**

[Refactoring.Guru](https://refactoring.guru/design-patterns/behavioral-patterns) · [Node.js EventEmitter](https://nodejs.org/api/events.html) · [XState v5](https://stately.ai/docs/xstate) · [MDN 迭代协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)

<!--
掌握这 10 个模式等于掌握前端工程化协作的底层词汇表。
-->
