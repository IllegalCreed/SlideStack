---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Sortable.js
info: |
  Presentation Sortable.js —— 轻量无依赖的可拖拽排序 JavaScript 库。

  Learn more at [https://github.com/SortableJS/Sortable](https://github.com/SortableJS/Sortable)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔀</span>
</div>

<br/>

## Sortable.js —— 拖拽排序的事实标准

零依赖轻量级拖拽排序库，v1.15.7 稳定成熟

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/SortableJS/Sortable" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Sortable.js —— 一个轻量、无第三方依赖的可拖拽重排序 JavaScript 库。

它基于原生 HTML5 Drag & Drop API 实现桌面端拖拽，并为不支持该 API 的场景（主要是移动端触摸）提供自动降级的 Fallback 模拟拖拽。核心场景：列表内重排序、跨列表拖放、多列表互拖。

当前最新版本 v1.15.7，2026-02-11 发布。npm 周下载量约 398 万，GitHub 3 万+ star，是"列表拖拽排序"场景的事实标准库，尤其是在非 React 技术栈里。近年发布节奏很低频（2024-11 到 2026-02 中断了约 14 个月），说明它已进入功能稳定、慢维护的成熟期，而非活跃迭代期。

顺序：定位 → 基本用法 → Options → 样式类 → group 跨列表 → 事件系统 → 方法 → 插件 → 框架集成 → 移动端 → 易错点 → 选型对比 → 资源 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Sortable.js？

裸写原生 HTML5 拖拽 API 很繁琐：

<v-clicks>

- 要手动处理 dragstart/dragover/drop 一整套事件
- 自行维护占位符、索引计算逻辑
- 移动端触摸**完全不支持**原生 HTML5 DnD

</v-clicks>

<div v-click class="mt-6">

Sortable.js 把这些封装成开箱即用的能力：

- `options` + `events` 声明式配置，一行创建实例
- 内置触摸设备 Fallback 模拟拖拽
- 零依赖、框架无关，各生态都有官方/社区封装层

</div>

<!--
为什么用 Sortable.js？直接手写原生 HTML5 Drag & Drop API 很繁琐：要自己处理 dragstart/dragover/dragenter/drop 一整套事件，自行维护占位符和索引计算逻辑，而且移动端触摸完全不支持原生 HTML5 DnD。

Sortable.js 把这套底层事件封装成语义化的 options 和 events：new Sortable(el, options) 一行起步，group/onEnd/onAdd 等把常见需求抽象成配置项，并且内置了触摸设备的 Fallback 模拟拖拽，开箱即用。

它零依赖（不需要 jQuery）、框架无关，vanilla JS 核心之外，Vue/React/Angular/Knockout/Ember/Meteor 都有官方或社区维护的封装层，是列表拖拽排序场景的事实标准库，尤其是非 React 技术栈里。局限也要说清楚：基于原生 HTML5 DnD API，继承了它的历史包袱，比如移动端原生不支持要靠 Fallback 模拟，这些后面会展开。
-->

---

# 基本用法：创建一个 Sortable 实例

```html
<ul id="items">
  <li>item 1</li>
  <li>item 2</li>
</ul>
```

```js
// 方式一：构造函数（推荐写法）
const el = document.getElementById('items');
const sortable = new Sortable(el, { animation: 150 });

// 方式二：静态方法，效果完全等价
Sortable.create(el, { animation: 150 });
```

<v-clicks>

- 作用对象是容器的**直接子元素**，容器标签任意（不限 `ul`，`div` 也可）
- 安装三选一：`npm install sortablejs` / CDN（jsDelivr）/ Bower

</v-clicks>

<!--
基本用法非常简单。HTML 侧就是一个普通容器加若干子元素，标签不限于 ul/li，div 也完全可以。

JS 侧两种等价写法：构造函数 new Sortable(el, options)，或者静态方法 Sortable.create(el, options)，是完全等价的语法糖，用哪个看团队习惯。

两个关键点：第一，Sortable 默认操作的是容器的直接子元素，可以用 draggable 选项进一步收窄范围；第二，安装方式三选一，npm、CDN jsDelivr、或者 Bower，最常见的是 npm install sortablejs --save。1.15+ 还支持模块化按需引入：核心版 sortable.core.esm.js 体积最小，完整版 sortable.complete.esm.js 含 MultiDrag/Swap 等全部插件，默认版可以用 Sortable.mount 按需挂载插件，插件部分后面会细讲。
-->

---

# 核心 Options（一）：行为与动画

| Option | 作用 |
|---|---|
| `sort` | 是否允许列表内排序 |
| `animation` / `easing` | 排序动画时长（ms）/ 缓动函数 |
| `disabled` | 动态禁用整个实例 |
| `delay` / `delayOnTouchOnly` | 拖拽前延迟（ms）/ 仅触摸设备生效 |
| `direction` | `vertical`/`horizontal`/函数，未指定自动探测 |
| `swapThreshold` / `invertSwap` | 交换区域阈值 / 反转交换区 |

<div class="mt-4 text-sm">

> `group`（跨列表拖放）内容较多，单独用两页详解，见后文。

</div>

<!--
先看行为和动画相关的核心 options。sort 控制是否允许列表内排序；animation 是排序过渡动画时长，单位毫秒，0 表示无动画，easing 是配套的缓动函数，参考 easings.net。disabled 可以动态禁用整个实例，配合 sortable.option('disabled', true) 使用。

delay 和 delayOnTouchOnly 控制拖拽前的延迟，常用来避免误触；direction 一般不用手动设置，未指定时会自动探测垂直还是水平布局。swapThreshold 和 invertSwap 影响交换区域判定，用于微调"插入到两项之间"的手感，属于中级选项，选型对比里的嵌套 Sortable 场景会用到调低的 swapThreshold。

group 是最重要也内容最多的一个 option，跨列表拖放的全部能力都挂在它下面，后面单独用两页展开，这里先跳过。
-->

---

# 核心 Options（二）：样式类与 handle/filter

```js
new Sortable(el, {
  handle: '.my-handle',        // 拖拽手柄选择器
  filter: '.ignore-elements',  // 不可拖拽元素（字符串或函数）
  preventOnFilter: true,       // filter 命中时是否阻止默认事件
  draggable: '.item',          // 限定可拖拽的子元素

  ghostClass: 'sortable-ghost',   // 占位符（拖拽目标位置）样式
  chosenClass: 'sortable-chosen', // 被选中项样式
  dragClass: 'sortable-drag',     // 正在拖拽项样式
});
```

<v-clicks>

- `handle` 必须指向**子元素内部**的选择器，配成整个容器/item 自身会导致手柄逻辑失效
- `preventOnFilter` 默认 `true`：filter 排除的元素若含 checkbox/input，需显式设 `false` 才能正常交互

</v-clicks>

<!--
handle 限定拖拽必须从指定手柄元素发起，常见坑是把它指向了整个 item 或容器本身，导致"看起来能拖但手柄形同虚设"。filter 排除不可拖拽的元素，可以是选择器字符串也可以是函数，preventOnFilter 默认 true，意味着点击 filter 排除的元素默认会被阻止默认行为，如果这个元素上有 checkbox 或 input，需要显式设成 false，不然点不动。

draggable 收窄容器内哪些子元素可被拖拽。三个样式类是拖拽三态的视觉钩子：ghostClass 是占位符也就是拖拽目标位置的样式，chosenClass 是被选中项的样式，dragClass 是正在拖拽中那个元素的样式，三者互不重叠，可以分别定制视觉反馈。
-->

---

# group 跨列表（一）：基础语法

```js
// 字符串简写：两个列表 group 值相同即可互拖
Sortable.create(listA, { group: 'shared' });
Sortable.create(listB, { group: 'shared' });

// 对象形式：细粒度控制拖入拖出
Sortable.create(source, { group: { name: 'workflow', pull: 'clone', put: false } });
Sortable.create(target, { group: { name: 'done', pull: true, put: ['workflow'] } });
```

<v-clicks>

- `pull`：`true|false|['组名']|'clone'|函数`，默认 `true`
- `put`：`true|false|['组名']|函数`，控制是否接受外部元素拖入
- 两个列表要互拖，`group.name` 必须完全一致——漏配是最常见的"能拖起来但放不进去"坑

</v-clicks>

<!--
group 是跨列表拖放的核心。最简单的用法是字符串简写：两个列表的 group 值写成同一个字符串，就能互相拖拽，适合"完全对等、无限制"的场景。

需要精细控制时用对象形式，name 相当于字符串简写的那个值，pull 控制"能不能拖出去"，put 控制"能不能接受别人拖进来"。这一页的例子：source 列表用 pull:'clone'，意味着拖出去时原位保留一份副本；target 列表用 put:['workflow']，意味着它只接受来自 workflow 组的元素，形成一个单向工作流。

最常见的坑排第一位：两个列表要互拖，group 的 name 必须完全一致，哪怕只是大小写或多一个空格不一致，都会导致"看起来能拖起来，但松手放不进去"的困惑现象。
-->

---

# group 跨列表（二）：clone 与函数式动态判断

```js
// clone：拖出时保留原位副本；revertClone 让非法位置的克隆动画归位
Sortable.create(source, { group: { name: 'workflow', pull: 'clone' } });
Sortable.create(target, { group: { name: 'done', put: ['workflow'] }, revertClone: true });

// pull/put 也支持函数式动态判断（依据 to/from/dragEl 运行时决策）
Sortable.create(el, {
  group: {
    pull: (to, from) => to.el.id !== 'locked-list',
    put: (to, from, dragEl) => dragEl.dataset.type === 'allowed'
  }
});
```

<v-clicks>

- `revertClone`：克隆元素被拖到非法位置后，是否播放动画归位
- 函数式 `pull`/`put` 让跨列表规则按运行时状态动态决定，而非写死的静态配置

</v-clicks>

<!--
继续 group 的进阶用法。pull:'clone' 是克隆模式，拖出时原列表保留一份副本，元素本身被"复制"到目标列表而不是"移动"过去，适合"从素材库拖一份到画布"这类场景。revertClone 配合使用：如果这份克隆被拖到了不合法的位置（比如 put 规则不允许），会播放动画让它退回原处，而不是尴尬地悬空消失。

更进阶的是函数式 pull/put：不再是写死的布尔值或数组，而是一个函数，参数是 to、from、dragEl，可以在运行时读取任意状态做判断，比如示例里"目标列表是不是被锁定的列表"或者"被拖拽元素的 dataset.type 是否在白名单里"。这让跨列表规则可以对接权限系统、业务状态机等复杂场景，而不只是静态配置。
-->

---

# 事件系统（一）：生命周期事件总览

拖拽的每个阶段都有对应回调，事件对象详解见下下页：

| 事件 | 触发时机 |
|---|---|
| `onChoose` / `onUnchoose` | 元素被选中（mousedown/tapstart）/ 取消选中 |
| `onStart` / `onEnd` | 开始拖拽 / 拖拽结束（属性最全） |
| `onAdd` | 元素从其他列表拖入本列表 |
| `onUpdate` | 同列表内排序改变 |
| `onRemove` | 元素被拖到其他列表（从本列表移除） |
| `onSort` | add/update/remove 任一种变化都触发的"总闸" |
| `onFilter` | 尝试拖拽了被 `filter` 排除的元素 |

<!--
事件系统覆盖拖拽的完整生命周期。onChoose 在元素被选中时触发，也就是 mousedown 或触屏的 tapstart，onUnchoose 是取消选中；onStart 是真正开始拖拽，onEnd 是拖拽结束，onEnd 的事件对象属性最全，下下页会展开讲。

三个语义化的"结果"事件要区分清楚：onAdd 是元素从别的列表拖进本列表，onUpdate 是同一个列表内部排序发生了变化，onRemove 是元素被拖到了别的列表、从本列表里移除了。onSort 是最粗的一个，只要 add/update/remove 任意一种变化发生，onSort 都会触发，适合统一做"保存"这类不关心具体分类的逻辑。onFilter 在用户尝试拖拽被 filter 排除的元素时触发。
-->

---

# 事件系统（二）：onMove 语义与 onClone/onChange

```js
new Sortable(el, {
  onMove(evt) {
    evt.related;          // 当前参照的目标元素
    evt.willInsertAfter;  // 默认是否插入到目标之后
    // 返回值控制插入位置：false 取消 / -1 之前 / 1 之后 / true·void 默认
  },
  onClone(evt) { evt.item; evt.clone; },  // 原元素 / 克隆出的元素
  onChange(evt) { evt.newIndex; }          // 拖拽过程中位置变化即触发
});
```

<div class="mt-3 text-sm">

> `onChange` 在拖拽过程中持续触发；`onSort` 是拖拽结束后 add/update/remove 的统一语义事件，二者不是一回事。

</div>

<!--
onMove 是拖拽移动过程中持续触发的事件，用来自定义插入逻辑。它的第二个参数是原生事件 originalEvent，可以读 clientY 这类鼠标位置；evt.dragged 和 evt.draggedRect 是拖拽中的元素及其 DOMRect，evt.related 和 evt.relatedRect 是当前参照的目标元素及其 DOMRect，evt.willInsertAfter 表示默认会不会插入到目标之后。

最关键的是它的返回值语义：返回 false 表示取消本次移动，不允许放在这里；返回 -1 强制插入到目标之前；返回 1 强制插入到目标之后；返回 true 或者不返回（void）就保持默认的插入位置判断。这是精细控制拖拽插入行为的入口。

onClone 在克隆发生时触发，item 是原元素，clone 是克隆出来的元素。onChange 在拖拽元素改变位置时触发，注意它是拖拽过程中实时触发的，跟 onSort 那种"结束后的语义分类事件"是两回事，容易混淆。
-->

---

# 事件对象详解：oldIndex / newIndex 等字段

```js
onEnd(evt) {
  evt.item;              // 被拖拽的 HTMLElement
  evt.to;                 // 目标列表容器
  evt.from;               // 源列表容器
  evt.oldIndex;           // 原索引（旧父级中）
  evt.newIndex;           // 新索引（新父级中）
  evt.oldDraggableIndex;  // 原索引（仅计算 draggable 元素）
  evt.newDraggableIndex;  // 新索引（仅计算 draggable 元素）
  evt.clone;              // 克隆元素（若有）
  evt.pullMode;           // "clone" | true | false | undefined
}
```

<div class="mt-2 text-sm">

> `onAdd`/`onUpdate`/`onRemove`/`onSort` 的事件对象拥有完全相同的字段结构。

</div>

<!--
以属性最全的 onEnd 为例看事件对象。item 是被拖拽的 HTMLElement 本身；to 和 from 分别是目标容器和源容器，同列表内排序时 to 和 from 是同一个元素。

oldIndex 和 newIndex 是最常用的两个字段，表示元素在旧父级和新父级里的索引位置。oldDraggableIndex 和 newDraggableIndex 是它们的"精确版"，只计算被 draggable 选项认可的元素，如果容器里有 filter 排除的元素混杂，这两个字段更准确。clone 是克隆元素（如果本次拖拽产生了克隆），pullMode 反映当前的拖出模式，是 "clone" 字符串、true、false 还是 undefined。

好消息是这套字段是通用的：onAdd、onUpdate、onRemove、onSort 拿到的事件对象，字段结构和 onEnd 完全一样，理解了 onEnd 就理解了全部。
-->

---

# 实例方法：toArray / destroy / sort + Store 持久化

```js
sortable.option('disabled', true);  // 设置配置项
sortable.toArray();                  // 序列化 data-id 为字符串数组
sortable.sort(order, true);          // 按给定顺序重排，第二参数控制动画
sortable.save();                     // 触发 store.set() 持久化当前顺序
sortable.destroy();                  // 解绑监听器，防内存泄漏必调
```

```js
Sortable.create(el, {
  store: {
    get: (s) => (localStorage.getItem(s.options.group.name) || '').split('|').filter(Boolean),
    set: (s) => localStorage.setItem(s.options.group.name, s.toArray().join('|'))
  }
});
```

<!--
几个高频实例方法。option 可以动态读写任意配置项，比如运行时切换 disabled。toArray 把当前顺序按 dataIdAttr（默认 data-id）序列化成字符串数组，是最常用的"读取当前排序结果"手段。sort 接受一个顺序数组编程式重排，第二参数控制要不要用动画。save 会主动触发 store.set() 做一次持久化。destroy 彻底移除 Sortable 功能、解绑所有监听器，组件卸载或路由切换时不调用它是常见的内存泄漏点，必须记得调。

Store 机制负责排序的持久化：get 在初始化时调用一次，返回顺序数组；set 在每次 onEnd（元素放下）时调用，负责把当前顺序写回存储。示例用 localStorage 演示，实际项目里换成任意后端接口都一样成立。
-->

---

# 插件：MultiDrag 多选拖拽

```js
import Sortable, { MultiDrag } from 'sortablejs';
Sortable.mount(new MultiDrag());
Sortable.create(list, {
  multiDrag: true,
  selectedClass: 'sortable-selected',
  multiDragKey: 'Control',       // 需按住的修饰键才能多选
  onSelect(evt) { evt.items; },  // 选中一项
  onEnd(evt) {
    evt.oldIndicies; // [{ multiDragElement, index }, ...]
    evt.newIndicies;
  }
});
```

<div class="mt-2 text-sm">

> 忘记 `Sortable.mount()` 不会报错，`multiDrag:true` 只是静默不生效。

</div>

<!--
MultiDrag 是 Extra 插件，默认版本不内置，需要手动 import 并 Sortable.mount 挂载。挂载之后，multiDrag:true 开启多选拖拽，selectedClass 是选中项的样式类，multiDragKey 是需要按住才能多选的修饰键，默认是 Ctrl。

onSelect 和 onDeselect（图上省略）分别在选中/取消选中一项时触发，evt.items 是当前已选中的全部元素。onEnd 里多了 oldIndicies 和 newIndicies 两个数组，每一项是 { multiDragElement, index } 结构，对应本次一起拖拽的每个元素各自的原索引和新索引；evt.items 是本次拖拽的所有元素，evt.clones 是对应的克隆元素。

还有编程式选中：Sortable.utils.select(item) 和 Sortable.utils.deselect(item)，可以脱离用户点击、由代码触发选中状态。avoidImplicitDeselect 设 true 后，点击列表外不会自动取消选择。
-->

---

# 插件：Swap 交换模式

```js
import Sortable, { Swap } from 'sortablejs/modular/sortable.core.esm';
Sortable.mount(new Swap());
Sortable.create(list, {
  swap: true,
  swapClass: 'sortable-swap-highlight', // 目标项高亮类
  animation: 150,
  onEnd(evt) {
    evt.swapItem; // 与之交换位置的元素，HTMLElement 或 undefined
  }
});
```

<v-clicks>

- Default 插件（`AutoScroll`/`OnSpill`）默认版本已内置；Extra 插件（`MultiDrag`/`Swap`）需手动 `mount()`
- 忘记 mount **不会报错**，只是相关 option 静默不生效——最容易被误判成"配置写错了"

</v-clicks>

<!--
Swap 插件把默认的"插入"行为换成"交换"：拖拽元素松手后，不是插到目标位置，而是跟目标位置的元素互换。swap:true 开启，swapClass 是交换目标高亮提示的样式类，onEnd 里的 evt.swapItem 是与之交换位置的那个元素，如果没有发生交换则是 undefined。

插件系统分两类：Default 插件是 AutoScroll（拖拽时自动滚动容器或页面）和 OnSpill（拖出有效区域后的处理策略），默认版本已经内置，不需要额外 mount；Extra 插件是 MultiDrag 和 Swap，只有 complete 版本内置，其他情况都需要手动 Sortable.mount() 注册。

这里有一个团队踩坑率很高的细节：如果忘记 mount，Sortable 不会抛任何错误，只是 multiDrag 或 swap 相关的 option 悄悄不生效，界面上看起来"配置了但没反应"，很容易被误判成配置项写错了，其实是少了一行 mount。
-->

---

# 框架集成（一）：Vue —— vuedraggable

```vue
<template>
  <draggable v-model="myArray" group="people" item-key="id"
             @start="drag=true" @end="drag=false">
    <template #item="{ element }">
      <div>{{ element.name }}</div>
    </template>
  </draggable>
</template>
```

<v-clicks>

- 同一 npm 包名 `vuedraggable`，靠 **dist-tag** 区分：Vue2 用 `latest`（2.24.3），Vue3 须显式装 `@next`（4.1.0）
- Vue3 三处破坏性变更：具名 `item` slot 替代默认 slot+`v-for`；必须提供 `item-key`；`tag`+`componentData` 替代 `transition-group`
- 所有 Sortable 原生 options 都可作为 kebab-case props 直传（如 `ghost-class`）

</v-clicks>

<!--
Vue 生态的官方封装是 vuedraggable，注意它是同一个 npm 包名，靠 dist-tag 区分 Vue2 和 Vue3 版本，而不是两个独立的包。Vue2 版本装 latest tag，当前 2.24.3，最后发布于 2020-10，处于纯维护状态；Vue3 版本必须显式加 @next 后缀安装，也就是 npm i -S vuedraggable@next，当前 4.1.0，很多人图省事直接 npm i vuedraggable，结果装成了 Vue2 版本，这是一个高频踩坑点。

图上是 Vue3 的写法，相对 Vue2 有三处破坏性变更：用具名的 item slot 配合 template #item 替代默认 slot 加 v-for 的写法；必须提供 item-key 这个 prop；用 tag 加 componentData 替代直接包裹 transition-group。组件事件就是 Sortable 原生事件的转发：start/add/remove/update/end/choose/unchoose/sort/filter/clone，外加一个综合性的 change 事件，携带 added/removed/moved 三种子形态。所有 Sortable 原生 options 都可以用 kebab-case 的 props 直接传，比如 ghost-class。

顺带一提，还有个小众替代方案 vue3-sortablejs（1.0.7），走指令式 v-sortable 路线，非组件式非 v-model，下载量远低于 vuedraggable，不是主流选择。而 vuedraggable(Vue2) 内部还锁定了 sortablejs@1.10.2 这个较旧的版本，如果项目里同时装了新版 sortablejs，混用时要留意 API 细微差异。
-->

---

# 框架集成（二）：React —— react-sortablejs

```jsx
import { ReactSortable } from "react-sortablejs";
import { useState } from "react";

const [state, setState] = useState([
  { id: 1, name: "shrek" }, { id: 2, name: "fiona" }
]);

<ReactSortable list={state} setList={setState}>
  {state.map(i => <div key={i.id}>{i.name}</div>)}
</ReactSortable>
```

<div class="mt-3 text-sm">

> item 必须带唯一 `id`，**禁止用数组下标当 key**（官方警告，会破坏排序/动画）；官方 README 亦自曝当前 "not considered ready for production"，采用前需评估风险。

</div>

<!--
React 生态的官方封装是 react-sortablejs，当前版本 6.1.4（注意：曾有网页摘要显示 6.1.5，但 npm registry 实测是 6.1.4，以实测为准）。用法是受控模式：list 和 setList 对应组件自身的状态，ReactSortable 内部拖拽产生的顺序变化会通过 setList 回写。

两个必须强调的点。第一，数组里每一项必须有唯一的 id 字段，官方原文明确警告"Never use array index as key"，用下标当 key 会导致拖拽后组件复用错乱、动画和状态错位，这是最容易踩的坑。第二，也是选型时必须权衡的：react-sortablejs 官方 README 自己承认"this is not considered ready for production, as there are still a number of bugs being sent through"，也就是自曝还没到生产就绪的程度，团队选型前要认真评估这个风险声明，而不能想当然地认为"有官方封装就等于生产级"。

其他细节：Sortable 原生 options 直接当 props 传入即可；插件用法是 import { ReactSortable, Sortable, MultiDrag, Swap } 之后 Sortable.mount；item 对象还能额外带 selected（MultiDrag 选中态）、chosen、filtered 字段。
-->

---

# 移动端触摸与 Fallback 模式

```js
new Sortable(el, {
  delay: 200,                  // 拖拽开始前的延迟（ms）
  delayOnTouchOnly: true,      // 仅触摸设备生效延迟（鼠标不受影响）
  touchStartThreshold: 5,      // px，延迟期间允许的指针移动容差

  forceFallback: true,         // 强制启用 Fallback，忽略原生 HTML5 DnD
  fallbackOnBody: true,        // 克隆元素挂载到 document.body（常用于嵌套场景）
  fallbackTolerance: 3,        // px，判定"开始拖拽"所需的最小移动距离
});
```

<div class="mt-3 text-sm">

> ⚠️ IE/Edge 原生 DnD 下 `delay` **无法生效**（官方 README 明确警告），需用 `forceFallback` 规避。嵌套 Sortable 同理建议 `fallbackOnBody:true` + 调低 `swapThreshold`（约 0.65）。

</div>

<!--
移动端触摸主要靠这几个 option 协调。delay 是拖拽开始前的延迟，delayOnTouchOnly 设成 true 之后这个延迟只对触摸设备生效，鼠标操作不受影响；touchStartThreshold 是延迟期间允许的指针移动容差，超过这个像素数会取消本次延迟拖拽判定。

forceFallback 强制启用 Fallback 模式，忽略原生 HTML5 DnD，让桌面和移动的拖拽体验完全统一；fallbackOnBody 让克隆出来的拖拽元素挂载到 document.body 而不是留在原容器里，常用于嵌套 Sortable 或者有 overflow:hidden 限制的容器；fallbackTolerance 是判定"确实开始拖拽了"所需的最小移动像素数，用来过滤误触。

有个官方原文明确写出来的限制：由于浏览器限制，IE 和 Edge 在原生 HTML5 拖放下 delay 无法生效，如果依赖 delay 做防误触，需要用 forceFallback 规避这个限制。嵌套 Sortable 的实现要点也在这里提一下：默认内外层容器的拖拽判定会互相干扰，需要 fallbackOnBody:true 并把 swapThreshold 调低到大约 0.65 才能正常工作。
-->

---

# 易错点清单

<v-clicks>

- **虚拟 DOM 冲突**：手写 `onEnd` 直接改数组易致 DOM 顺序与数据顺序不一致，应使用官方框架封装协调
- **React key 用数组下标**：拖拽后组件复用错乱、动画错位（官方明确警告）
- **忘记 `destroy()`**：SPA 路由切换/组件卸载不销毁 = 常见内存泄漏
- **忘记设置 `group`**：两列表 `name` 不一致 = 能拖起但放不进
- **插件未 `mount()`**：`MultiDrag`/`Swap` 静默不生效，不报错
- **嵌套 Sortable**：默认互相干扰，需 `fallbackOnBody` + 调低 `swapThreshold`

</v-clicks>

<!--
易错点清单，排第一位的是虚拟 DOM 冲突：Sortable.js 拖拽时直接移动真实 DOM 节点，而 React/Vue 是基于虚拟 DOM diff 来渲染的。如果不用官方框架封装、自己手写 onEnd 直接改数组，很容易出现"DOM 顺序"和"数据顺序"不一致的问题，正确理解应该是：先允许 Sortable 操作真实 DOM，事件触发后交给框架接管重新渲染并纠正 DOM，这正是 vuedraggable 和 react-sortablejs 内部做的事。

其余几条都是高频真实案例：React 用数组下标当 key 会让拖拽后的组件复用、动画、状态全部错位；忘记调用 destroy() 是 SPA 场景最常见的内存泄漏点；两个列表的 group.name 没对齐，会出现"看起来能拖起来但放不进去"的诡异现象；MultiDrag/Swap 插件忘记 mount 不会报错，只是静默不生效；嵌套 Sortable 默认内外层会互相干扰，需要专门配置。

补充两条没放上屏但同样值得注意的：vuedraggable(Vue2) 内部锁定的是 sortablejs@1.10.2，跟项目独立安装的新版本混用要留意 API 细微差异；preventOnFilter 默认是 true，如果 filter 排除的元素上有需要正常交互的 checkbox 或 input，默认行为会拦截它的点击，要显式设成 false。
-->

---

# vs dnd-kit 选型对比

| 维度 | Sortable.js | dnd-kit |
|---|---|---|
| 适用框架 | 框架无关（vanilla + 各框架封装层） | 仅 React |
| 底层机制 | 原生 HTML5 DnD + Fallback 模拟触摸 | 自建指针事件系统 |
| 可访问性 | 无内置键盘拖拽支持 | 内置键盘导航等 a11y，官方主打卖点 |
| 定制粒度 | Options+Events 声明式，较"整体" | Hooks 化 API，碰撞检测可自定义 |
| 周下载量 | 约 398 万（sortablejs 本体） | 约 1838 万（`@dnd-kit/core`，仅 React 场景可比） |

<div class="mt-4 text-sm">

> 纯 React + 强可访问性/自定义碰撞检测 → 优先 **dnd-kit**；多框架并存或只是"给列表加拖拽" → **Sortable.js** 更省心，尤其 Vue 生态封装成熟。

</div>

<!--
对比 dnd-kit（@dnd-kit/core，当前 6.3.1）。适用范围上 Sortable.js 框架无关，vanilla 核心加各框架封装层；dnd-kit 只服务 React。底层机制上 Sortable.js 基于原生 HTML5 Drag & Drop API 加 Fallback 模拟触摸；dnd-kit 是自建的指针事件系统，完全不依赖原生 HTML5 DnD。

可访问性是 dnd-kit 的官方主打差异化卖点：内置键盘导航等无障碍支持，Sortable.js 没有内置键盘拖拽。定制粒度上，Sortable.js 是 options 加 events 的声明式配置，够用但比较"整体"；dnd-kit 是 useDraggable/useDroppable 这类 hooks 化 API，可以自定义碰撞检测算法，粒度更细。

周下载量 sortablejs 本体约 398 万，dnd-kit/core 约 1838 万，但要注意这两个数字场景基数不同：dnd-kit 只服务 React 生态，sortablejs 是全框架通用，不能简单下"谁更火"的结论。有意思的是，Sortable.js 官方在线示例站的 Comparisons 分区只列出了 jQuery-UI 和 Dragula 作为对比对象，完全没提 dnd-kit，侧面说明它的自我定位还停留在 jQuery UI 时代替代品的坐标系里。结论：纯 React 技术栈、要强可访问性或自定义碰撞检测，优先 dnd-kit；多框架并存或只是常规列表拖拽需求，Sortable.js 更简单省心，尤其 Vue 生态的 vuedraggable 封装最成熟。
-->

---

# 资源与生态

<v-clicks>

- **Angular**：`ngx-sortablejs`（11.1.0，Angular 2+，支持 `FormArray`）/ `angular-legacy-sortablejs`（0.4.1，Angular 1.x 遗留）
- **其他框架**：Knockout / Polymer / Ember / Meteor 均有社区封装；`jquery-sortablejs` 是 jQuery 兼容桥接层
- **类型定义**：`@types/sortablejs`，TypeScript 项目直接引入
- **官方示例站**：sortablejs.github.io/Sortable —— 共享列表、克隆、嵌套、MultiDrag、Swap、网格排序全场景可玩
- **仓库**：github.com/SortableJS/Sortable —— 3 万+ star，历史悠久的事实标准库

</v-clicks>

<!--
除了 Vue 和 React，Angular 生态有 ngx-sortablejs，原名 angular-sortablejs，当前 11.1.0，服务 Angular 2 以上版本，peer 依赖 @angular/core ^11.0.0，除了标准数组还支持 Angular 的 FormArray；老项目如果还在用 Angular 1.x，有 angular-legacy-sortablejs 这个遗留封装可用。

再往外，Knockout、Polymer、Ember、Meteor 都有对应的社区封装包，命名规律都是 xxx-sortablejs；如果项目还在用 jQuery，有 jquery-sortablejs 这层兼容桥接。TypeScript 项目可以直接装 @types/sortablejs 获得类型定义。

想要系统性地把玩各种场景，官方在线示例站 sortablejs.github.io/Sortable 是最好的起点，导航分 Features / Examples / Plugins / Comparisons / Framework Support 几个区，覆盖共享列表、克隆、嵌套 Sortable、拖拽手柄、过滤、MultiDrag、Swap、网格表格布局等几乎所有场景。仓库本身在 GitHub 有 3 万多 star，是这个领域历史最悠久的事实标准库。
-->

---
layout: intro
---

# 总结

Sortable.js = **零依赖的原生拖拽排序库，多框架事实标准**

- 核心：`new Sortable(el, options)`；`group` + `pull`/`put`/`clone` 搞定跨列表拖放
- 事件完整：`onAdd`/`onUpdate`/`onRemove`/`onSort` 语义清晰，`onMove` 精确控制插入位置
- 插件按需 `mount()`：`MultiDrag` 多选、`Swap` 交换
- 框架封装：Vue `vuedraggable`（认准 `@next`）、React `react-sortablejs`（慎评生产风险）
- 选型：多框架/简单排序选 Sortable.js；纯 React + a11y/自定义碰撞选 dnd-kit

<!--
总结一下。

Sortable.js 是一个零依赖、基于原生 HTML5 Drag & Drop API 的拖拽排序库，核心用法就一行：new Sortable(el, options)。它把跨列表拖放这件复杂的事抽象成 group 加 pull/put/clone 几个配置项，事件模型区分 onAdd/onUpdate/onRemove/onSort，语义清晰，onMove 的返回值还能精确控制插入位置。

进阶能力靠插件按需挂载：MultiDrag 做多选拖拽，Swap 做交换而非插入，都要记得先 mount 再用。多框架生态里，Vue 用 vuedraggable，记住 Vue3 要显式装 @next；React 用 react-sortablejs，但官方自己也说还没到生产就绪的程度，采用前要评估风险。

技术选型上一句话：多框架并存、或者只是要给列表加个拖拽排序，Sortable.js 更简单省心；纯 React 技术栈、需要强可访问性或自定义碰撞检测，优先考虑 dnd-kit。谢谢大家。
-->
