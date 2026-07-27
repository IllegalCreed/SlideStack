---
theme: seriph
background: https://cover.sli.dev
title: 架构模式（MVC / MVP / MVVM）完全指南
info: |
  前端 UI 架构三大模式：MVC / MVP / MVVM 原理、数据流与框架体现

  基于 Martin Fowler GUI Architectures + React/Vue/Angular 官方文档
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 架构模式 MVC / MVP / MVVM

表现层三大架构 · Separated Presentation · React/Vue/Angular

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
三大模式共同根：Separated Presentation——Model 不依赖 UI 框架。
-->

---
transition: fade-out
---

# 三大模式是什么

UI 表现层的**职责划分**模式

- 解决同一类问题：**View / 输入处理 / Model** 三块职责如何切
- 共同根：**Separated Presentation**（Martin Fowler）
- Model 完全不感知 UI 框架，可独立测试与复用
- 三模式差别 = 中间层长什么样

**核心心智三句话**

- Model 是自包含的：领域数据 + 业务规则
- View 只展示 + 转发用户手势
- 中间层负责编排：手势 → Model → 状态投影回 View

> 反例：Fat Controller / Massive View Controller。

---

# 三模式速览

| 模式 | 中间层 | 持 View 引用 | View 对 Model 可见性 | 同步机制 |
|------|------|------|------|------|
| **MVC** | Controller | 短期 | 有（观察 Model） | Observer Sync |
| **MVP** | Presenter | 长期持 | **零**（彻底解耦） | Presenter 命令 |
| **MVVM** | ViewModel | **不持** | 通过 VM 间接 | Data Binding |

演化主线：**让 View 越来越被动、让逻辑越来越可测**

> MVC → MVP → Presentation Model 的自然推进（Fowler）。

---

# MVC 三角色

1970s Smalltalk-80 提出

- **Model**：领域数据 + 业务逻辑，**不感知 UI**
- **View**：展示 Model 状态，**观察变更通知**
- **Controller**：接收用户输入，决定如何作用于 Model

**关键原则**

- Controller **不直接 set View 的值**
- View 由 Model 的通知触发刷新
- 多个 View 可观察同一 Model，**自动多屏同步**

> Web 时代「MVC = 路由层 Controller」是被重新解释的，与原意已分裂。

---

# MVC 数据流

```text
1. 用户在 View 上点击 / 输入
2. Controller 接收事件，调用 Model 命令接口
3. Model 更新状态，发出变更通知
4. 所有观察该 Model 的 View 收到通知
5. 各 View 自行重新读取 Model 并刷新
```

**Observer Synchronization 优缺点**

- 优点：多屏自动同步、解耦、易扩展
- 缺点：更新链路**隐式难追踪**、级联更新风险

> Controller 既改 Model 又改 View = MVC 退化反模式。

---
layout: two-cols
---

# MVP：Presenter 完全中介

1996 Potel 提出，2004 Fowler 系统化

- **Model**：与 MVC 同，但**与 View 彻底解耦**
- **View**：widget 结构，**无 view/controller 分裂**
- **Presenter**：主动响应用户手势、完全中介

**与 MVC 关键差异**

- View 对 Model **零可见**
- Presenter 显式 set View 各字段
- View 是被动的，可单测

::right::

# MVP 数据流

```text
1. 用户手势 → View
2. View 转发给 Presenter
3. Presenter 调 Model
4. Model 更新状态
5. Presenter 读新状态
6. Presenter 主动 set View
```

**测试动机**

Fowler：Presenter 是纯逻辑，
可用 Test Double 替身 View 做单测。

<!--
MVP 的核心价值在于可测试性。
-->

---

# MVP 两变体

Fowler 把 MVP 拆成两个变体

| 维度 | Passive View | Supervising Controller |
|------|------|------|
| Presenter 范围 | **全部 widget** | 仅复杂逻辑 |
| View 对 Model | **零可见** | 有（简单同步用绑定） |
| 样板代码 | 多 | 少 |
| 可测试性 | **最高** | 中 |
| 适用 | 严格单测 / 框架替换 | 大多数平衡场景 |

> Fowler 直言：「测试是 Passive View 的首要动机」。

---

# MVVM = Presentation Model 特化

2004 Fowler 提出 PM，2005 Gossman 在 WPF 特化为 MVVM

**三大特征**

- **ViewModel = 视图的抽象**：持有 UI 状态 + 展示逻辑
- **ViewModel 不持 View 引用**：完全靠 Data Binding
- **声明式绑定**：模板里写绑定，框架自动建立通道

**为什么不能持 View 引用？**

- 退化成 MVP
- 丧失声明式绑定的解耦优势
- VM 被钉死在特定 UI 框架

> Fowler 明确：PM 引用 View 会增加耦合。

---

# 现代框架映射

| 框架 | 模式归属 | 关键证据 |
|------|------|------|
| **React 19** | 单向数据流（非 MVVM） | 无双向绑定；data down / events up |
| **Vue 3.5** | 类 MVVM（声明式 + 响应式） | `v-model` 是 props + emit 语法糖 |
| **Angular 17-20** | MVVM 直接实现 | 组件类 = VM；`[( )]` signal 驱动 |

**关键**

- React **没有框架级双向绑定**
- Vue v-model **本质单向**
- Angular 是最贴近 MVVM 的直接实现

> 别强行往 React 上套 MVVM——逆范式造成级联更新难追踪。

---
layout: two-cols
---

# React 单向数据流

**三原则**

- data flows down（props 向下）
- events flow up（callback 向上）
- Lifting State Up（提升到共同父）

**反模式**

- 子组件直接 mutate prop
- 受控 / 非受控混用
- 数据源不唯一

::right::

# 受控组件示例

```ts
function Parent() {
  const [text, setText] =
    useState("");
  return (
    <Child
      value={text}
      onChange={setText}
    />
  );
}

// Child 不能改 props.value
// 只能 onChange 上报
```

> 表单同步靠受控组件 + setState。

---

# Vue v-model 语法糖

**One-way-down**：props 只读，子组件不可直接 mutate

`v-model` **不是**真正的双向绑定

```text
<!-- 父组件 -->
<Child v-model="text" />

<!-- 编译后等价于 -->
<Child
  :modelValue="text"
  @update:modelValue="text = $event"
/>
```

子组件用 `defineModel()` 或 `defineProps + defineEmits`

> 深层嵌套滥用 v-model = 级联更新难追踪。

---

# Angular banana in a box

组件类 = **ViewModel**，模板 = **View**

- `[ ]` property binding（VM → View）
- `( )` event binding（View → VM）
- `[( )]` 两路绑定 = banana in a box

```ts
@Component({
  template: `
    <input [(ngModel)]="name" />
    <span>{{ name }}</span>
  `,
})
export class HelloComponent {
  name = "World";
}
```

**[(ngModel)] 脱糖** = `[ngModel]="name" (ngModelChange)="name = $event"`

> Angular 17+ 全面转向 Signals（`model()` / `signal()` / `computed()`）。

---

# 可测试性排序

Fowler 给出的排序（必背）

| 排名 | 模式 | 原因 |
|------|------|------|
| 1 | **Passive View** | Presenter 纯逻辑，Test Double 替身 View |
| 2 | **MVVM / PM** | VM 不持 View 引用，纯逻辑测试 |
| 3 | **Supervising Controller** | 简单同步散落在 View |
| 4 | **经典 MVC** | View 与 Model 双向耦合 |

**Humble Object 原则**

- 难测对象（View/DOM）只含最少行为
- 逻辑推到可测的 Presenter/ViewModel
- Fowler 把 Passive View 与 PM 都归为 Humble Object 体现

<!--
可测试性是 MVP/Presentation Model 出现的核心动机。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- Fat Controller（业务 + 视图 + 数据全塞 Controller）
- View 直接观察 Model（违反 MVP）
- 子组件直接 mutate prop（Vue 触发警告）
- 深层嵌套滥用 v-model / [(ngModel)]
- ViewModel 持 View 引用（MVVM 退化）
- 受控/非受控混用、数据源不唯一（React）
- 领域业务规则写进 ViewModel/Presenter

> 修正：拆 Service / emit 事件 / store 单向 / 纯绑定解耦 / 业务下沉 Model

---
layout: center
class: text-center
---

# 小结

架构模式 = 表现层的职责划分标尺

Separated Presentation · Observer Sync · Passive View · Presentation Model

**Passive View 最可测 · MVVM 声明式解耦 · React 单向流**

[Fowler GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html) · [Angular 双向绑定](https://angular.dev/guide/templates/two-way-binding) · [Vue v-model](https://vuejs.org/guide/components/v-model.html)

<!--
掌握三模式的中间层差异，是看懂现代框架设计哲学的前提。
-->
