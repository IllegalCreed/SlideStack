---
theme: seriph
background: https://cover.sli.dev
title: dnd-kit
info: |
  Presentation dnd-kit — React 现代化拖拽工具集。

  Learn more at [https://dndkit.com/legacy/introduction/installation/](https://dndkit.com/legacy/introduction/installation/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧩</span>
</div>

<br/>

## dnd-kit —— React 拖拽工具集

Hook 驱动、无外部运行时依赖，键盘无障碍是一等公民。当前 @dnd-kit/core 6.3.1

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/clauderic/dnd-kit" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 dnd-kit —— 一句话定位：它是面向 React 的现代化拖拽工具集，以 useDraggable/useDroppable/useSortable 等 hook 作为核心交互单元，无外部运行时依赖，默认支持指针/鼠标/触摸/键盘多种输入，把无障碍访问当作一等公民。

背景数据：npm 周下载量 @dnd-kit/core 1838 万、@dnd-kit/sortable 1818 万，是当前 React 拖拽生态实际的主流选择，远超 react-dnd（507 万）和 sortablejs（398 万）。当前稳定版本 core 6.3.1，2024 年 12 月发布。

今天的顺序：定位评价 → 安装模块划分 → DndContext → useDraggable → useDroppable → DragOverlay → Sortable 预设（SortableContext/useSortable）→ arrayMove → Sensors/activationConstraint → Modifiers → 碰撞检测 → 无障碍键盘拖拽 → 多容器看板 → 易错点 → 新架构展望 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 dnd-kit？

<v-clicks>

- React 专用、hook 驱动，不是对原生 HTML5 DnD API 的简单封装
- 仅依赖 `tslib`：无其它外部运行时依赖
- 默认支持指针 / 鼠标 / 触摸 / 键盘四种输入方式
- 无障碍访问是一等公民，同类库中处于领先地位

</v-clicks>

<div v-click class="mt-6 text-sm">

对比同类：Sortable.js 直接操作真实 DOM、无障碍弱；react-dnd 需按输入切换 Backend、样板代码多。dnd-kit 状态完全由 React 管理，单一 Sensor 统一处理各种输入——详细选型对比见结尾。

</div>

<!--
为什么用 dnd-kit？先看定位：它是 React 专用、hook 驱动的拖拽工具集，不是对原生 HTML5 Drag and Drop API 的简单封装。

优点：仅依赖 tslib，没有其它外部运行时依赖；默认同时支持指针、鼠标、触摸、键盘四种输入方式；无障碍访问被当作一等公民来设计，这在同类库里处于领先地位。

和同类方案比一句话：Sortable.js 是框架无关的原生 DOM 操作库，无障碍支持弱；react-dnd 更早期，用 Backend 概念切换鼠标和触屏、样板代码较多。dnd-kit 状态完全由 React 管理，不直接操作真实 DOM 顺序，用单一 Sensor 体系统一处理各种输入设备。后面结尾会有更详细的选型对比表，这里先记住这个大方向。
-->

---

# 安装与模块划分

```bash
npm install @dnd-kit/core       # 必装：DndContext、useDraggable/useDroppable、DragOverlay、Sensors
npm install @dnd-kit/sortable   # 可选：排序预设 SortableContext/useSortable/arrayMove
npm install @dnd-kit/modifiers  # 可选：坐标修饰符 restrictToVerticalAxis 等
```

| 包 | 版本 | 职责 |
| --- | --- | --- |
| `@dnd-kit/core` | 6.3.1 | 核心：Context、hooks、Overlay、Sensors |
| `@dnd-kit/sortable` | 10.0.0 | 排序预设，依赖 core |
| `@dnd-kit/modifiers` | 9.0.0 | 坐标修饰符，依赖 core |
| `@dnd-kit/utilities` | 3.2.2 | `CSS` 助手等，随依赖自动安装 |

<div v-click class="mt-4 text-sm">

npm 周下载量：`core` 1838 万 / `sortable` 1818 万 —— 远超 `react-dnd`（507 万）、`sortablejs`（398 万）。

</div>

<!--
先看安装。必装的只有 core，提供 DndContext、useDraggable、useDroppable、DragOverlay、Sensors 这套最基础的能力。sortable 是可选的排序预设，封装了 SortableContext、useSortable、arrayMove 这些排序场景专用 API。modifiers 是可选的坐标修饰符，比如限制单轴运动。

utilities 包提供 CSS 助手等通用工具，它是 core/sortable/modifiers 的依赖，会被自动安装，一般不需要单独 install。

版本上目前 core 是 6.3.1，sortable 10.0.0，modifiers 9.0.0，utilities 3.2.2。周下载量能看出生态地位：core 和 sortable 都在 1800 万上下，远超 react-dnd 的 507 万和 sortablejs 的 398 万，说明 dnd-kit 已经是 React 拖拽方案事实上的主流选择。
-->

---

# DndContext —— 拖拽上下文

拖拽应用的根组件：通过 React Context 让 `useDraggable` / `useDroppable` / `DragOverlay` 共享内部状态。用到这些 API 的组件都**必须**嵌套在其内部，且支持嵌套多个相互独立的 `DndContext`。

```jsx
import { DndContext } from '@dnd-kit/core';

function App() {
  function handleDragEnd(event) {
    if (event.over?.id === 'droppable') setDropped(true); // over 为 null 表示未命中
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Draggable id="drag-1" />
      <Droppable id="droppable" />
    </DndContext>
  );
}
```

<!--
DndContext 是整个拖拽应用的根组件。它通过 React Context，让内部所有用到 useDraggable、useDroppable、DragOverlay 的组件共享同一份拖拽状态。这是一个硬性约束：凡是用这几个 API 的组件，都必须是某个 DndContext 的后代，否则拿不到 context、会报错或者行为异常。它也支持嵌套多个互相独立的 DndContext，各管一摊。

看这个最小示例：onDragEnd 回调里判断 event.over，如果 over 是 null，说明没有落在任何 droppable 上——这是最容易忽略的一个细节，很多人写代码时忘了判空。事件对象里还有 active、delta、collisions、activatorEvent 这些字段，后面用到具体 hook 时再展开。
-->

---

# useDraggable

```jsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function Draggable(props) {
  // id 必填，仅需同类型内唯一（可与 droppable 同名共享）
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'draggable' });
  const style = { transform: CSS.Translate.toString(transform) }; // 只应用位移，忽略缩放
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
```

<div v-click class="text-sm mt-2">

拖拽把手模式：把 `listeners` 只绑到独立节点（如 ⠿ 图标），而非整个可拖拽元素——用 `setActivatorNodeRef` 分离。

</div>

<!--
useDraggable 是最小的可拖拽单元。返回值里，setNodeRef 绑定要拖拽的 DOM 节点，listeners 和 attributes 展开到节点上处理事件和无障碍属性，transform 是自拖拽开始以来的位移增量，形状是 x/y/scaleX/scaleY。

样式这里用 CSS.Translate.toString，它只应用位移、忽略缩放，是 draggable 场景最常用的写法；如果需要缩放动画才用 CSS.Transform。

id 只需要在同类型内唯一，文档明确说 draggable 和 droppable 可以共享同一个 id，各自独立存储，不会冲突。

还有一个常用模式：拖拽把手。不是整个卡片都能拖，而是只有一个把手图标能拖——做法是用 setActivatorNodeRef 把 listeners 单独绑到那个把手节点上，setNodeRef 还是绑整个容器。
-->

---

# useDroppable

```jsx
import { useDroppable } from '@dnd-kit/core';

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({ id: props.id });
  const style = { color: isOver ? 'green' : undefined }; // 悬停时变色反馈
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
```

<v-clicks>

- 返回值：`active`、`rect`、`isOver`、`node`、`over`、`setNodeRef`
- `id` 与 draggable 的 `id` 各自独立存储，允许同名共享
- `disabled` 控制启停——不能用 `if` 包裹 hook 本身
- `resizeObserverConfig`：控制本容器 resize 时需连带重测的其它容器

</v-clicks>

<!--
useDroppable 是可放置区域的最小单元。最常用的是 isOver，表示当前是否有拖拽项悬停在这个区域上方，可以用来做高亮反馈，这里示例里悬停变绿色。

返回值里 active、over 让你能读到当前拖拽项和自己是否命中的完整信息，setNodeRef 绑定 DOM 节点。id 和 draggable 的 id 是各自独立存储的两套命名空间，可以放心同名。

disabled 参数控制这个 droppable 是否启用，注意 useDroppable 是 hook，不能写在 if 里条件调用，必须无条件调用、用 disabled 控制开关。

resizeObserverConfig 是实测发现的一个进阶参数，官方文字没怎么展开：用来控制这个容器尺寸变化时，还有哪些其它容器需要连带重新测量，以及防抖的 timeout。多容器看板场景会用到。
-->

---

# DragOverlay（一）—— 为什么需要

直接给拖拽源加 `transform` 会被容器 `overflow` 裁剪，跨容器/虚拟列表还可能因源节点卸载导致拖拽中断。`DragOverlay` 脱离文档流、相对 viewport 定位，规避这些问题并自带放下动画。

```jsx
import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';

function App() {
  const [activeId, setActiveId] = useState(null);
  return (
    <DndContext
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={() => setActiveId(null)}
    >
      <Draggable id="item-1" />
      <DragOverlay>{activeId ? <ItemPreview id={activeId} /> : null}</DragOverlay>
    </DndContext>
  );
}
```

<!--
DragOverlay 要解决的是三个经典拖拽难题：第一，滚动容器设了 overflow hidden 时，直接给源节点加 transform 会被裁剪出视野；第二，跨容器拖拽时源节点可能挂载卸载，拖拽会被打断；第三，虚拟列表滚动时源节点可能被卸载，同样中断拖拽。

DragOverlay 渲染的覆盖层脱离正常文档流、相对 viewport 定位，天然不受这些限制，而且内置了放下动画。用法很直接：onDragStart 时记下 active.id，onDragEnd 时清空，DragOverlay 内部根据这个 id 渲染对应的预览组件。下一页看两个最容易踩的坑。
-->

---

# DragOverlay（二）—— 关键建议与易错

<v-clicks>

- **应始终挂载** `DragOverlay` 本身，只对内部 `children` 做条件渲染——否则卸载瞬间直接跳变，`dropAnimation` 失效
- 复用同一份「展示型组件」，源节点与覆盖层预览共用 UI，避免在 `DragOverlay` 内部重复调用 `useDraggable`
- `wrapperElement` 默认 `div`；列表项场景应改成 `ul`，避免无效 DOM 嵌套
- `dropAnimation` 默认 250ms ease，传 `null` 关闭

</v-clicks>

```typescript
interface Props {
  dropAnimation?: DropAnimation | null;
  modifiers?: Modifiers;          // 只影响覆盖层视觉位置，不影响真实碰撞判定
  wrapperElement?: keyof JSX.IntrinsicElements; // 默认 div
  zIndex?: number;                 // 默认 999
}
```

<!--
这一页是 DragOverlay 最容易踩坑的地方。第一个也是最关键的：DragOverlay 组件本身要始终挂载在 JSX 里，只对它的 children 做条件渲染——如果连 DragOverlay 一起被条件卸载，松手瞬间就是直接跳变消失，内置的 dropAnimation 完全不生效。

第二点，官方推荐把展示内容拆成一个纯展示型组件，源节点和覆盖层预览共用同一份 UI，不要在 DragOverlay 内部又调一次 useDraggable，那样语义是错的。

wrapperElement 默认是 div，如果你的可拖拽项是列表项，应该改成 ul，避免出现 div 包 li 这种无效 DOM 嵌套。dropAnimation 默认 250 毫秒 ease 缓动，传 null 可以关掉。modifiers 这里要注意，它只影响覆盖层的视觉呈现位置，不影响真实的碰撞判定，这个和 DndContext.modifiers 语义不同，后面模块讲 Modifiers 时还会再强调一次。
-->

---

# Sortable 预设架构 —— SortableContext

`SortableContext`（提供当前容器的排序信息）→ `useSortable`（`useDraggable` + `useDroppable` 的组合封装）。必须是 `DndContext` 的后代，可在同一个 `DndContext` 下嵌套多个（多容器/看板场景）。

```typescript
// SortableContext props
{
  items: UniqueIdentifier[];   // 必填：已排序 id 数组，必须与实际渲染顺序一致！
  strategy?: SortingStrategy;  // 默认 rectSortingStrategy
  id?: string;                 // 可选，高级/自定义 sensor 用
}
```

| 策略 | 适用场景 |
| --- | --- |
| `rectSortingStrategy` | 默认值，网格/不规则布局 |
| `verticalListSortingStrategy` | 垂直列表，支持虚拟化 |
| `horizontalListSortingStrategy` | 水平列表，支持虚拟化 |
| `rectSwappingStrategy` | 交换式排序，配合 `arraySwap` |

<!--
Sortable 预设是建在 core 之上的两层架构。SortableContext 通过 Context 提供当前容器的排序信息，它自己不处理拖拽逻辑；真正消费这些信息的是 useSortable，它是 useDraggable 加 useDroppable 的组合封装。SortableContext 必须是 DndContext 的后代，而且同一个 DndContext 下可以嵌套多个 SortableContext，这是多容器看板场景的基础。

最重要的一个 prop 是 items，一个已排序的唯一 id 数组，官方文档反复强调它必须和实际渲染顺序保持一致，不一致会导致动画和位置计算错乱，这是后面易错点会再提的高频坑。

排序策略有四种，rectSortingStrategy 是默认值，适合网格这种不规则布局；vertical 和 horizontal 两个是列表方向优化过的，都支持虚拟化列表的计算；rectSwappingStrategy 是交换式而非插入式，要配合 arraySwap 使用，配错会有问题，下一页讲 arrayMove 时细说。
-->

---

# useSortable —— 消费排序状态

`useDraggable` + `useDroppable` 的组合封装，额外返回排序相关状态：

<v-clicks>

- `index`/`newIndex`/`overIndex`/`activeIndex`/`items`/`isSorting`
- `setDraggableNodeRef`/`setDroppableNodeRef`：高级用法，分离拖拽节点与放置节点
- `animateLayoutChanges`：控制哪些布局变化触发过渡动画
- `transition`：默认 250ms，传 `null` 关闭过渡

</v-clicks>

```jsx
function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition }; // 位移+缩放都应用
  return <li ref={setNodeRef} style={style} {...attributes} {...listeners}>{id}</li>;
}
```

<!--
useSortable 在 useDraggable/useDroppable 的返回值基础上，额外给了一组排序专用状态：index 是当前下标，newIndex/overIndex/activeIndex 是拖拽过程中的中间状态，items 是当前完整列表，isSorting 表示是否正处于排序过程中。

setDraggableNodeRef 和 setDroppableNodeRef 是进阶用法，把拖拽节点和放置节点分离到不同 DOM 元素上，一般场景用不到，用统一的 setNodeRef 就够了。

样式上注意这里用的是 CSS.Transform 而不是上一页 useDraggable 用的 CSS.Translate——排序场景需要位移加缩放一起应用，才能配合内置的排序过渡动画；transition 默认 250 毫秒，传 null 可以关掉过渡效果。
-->

---

# arrayMove / arraySwap —— 更新数组

```typescript
// 插入式：把 array[from] 移到 to 位置，中间项顺移，返回新数组
function arrayMove<T>(array: T[], from: number, to: number): T[];
// 交换式：把 array[from] 与 array[to] 直接互换，返回新数组（配合 rectSwappingStrategy）
function arraySwap<T>(array: T[], from: number, to: number): T[];
```

```jsx
function handleDragEnd(event) {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    setItems((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex); // 纯函数，返回新数组
    });
  }
}
```

<!--
排序最终要落地成数组更新，dnd-kit/sortable 提供两个纯函数。arrayMove 是插入式：把某一项从 from 位置搬到 to 位置，中间的项整体顺移，适合默认的 rectSortingStrategy 等插入式策略。arraySwap 是交换式：只把 from 和 to 两个位置的项直接互换，其它项不动，要配合上一页提到的 rectSwappingStrategy 使用。两者都是纯函数，不改变原数组，返回一个新数组。

典型用法在 onDragEnd 里：先判断 over 存在且和 active 不是同一项，再用 indexOf 找到两个下标，调 arrayMove 算出新数组，交给 setItems 触发 React 重新渲染。整个过程 dnd-kit 不直接操作 DOM 顺序，真实顺序完全由 React state 驱动。
-->

---

# Sensors —— 输入检测

一组检测不同输入方式的类，负责识别激活、响应移动、结束或取消拖拽。`DndContext` 默认使用 `PointerSensor` + `KeyboardSensor`。基于类而非 hook 实现——需同步实例化以立即响应交互，且必须可条件调用。

| Sensor | 激活事件 | 说明 |
| --- | --- | --- |
| `PointerSensor` | `onPointerDown`（仅主指针） | 统一处理鼠标/触摸/触控笔，现代浏览器首选 |
| `MouseSensor` | `onMouseDown` | 仅响应鼠标事件 |
| `TouchSensor` | `onTouchStart`（仅单指） | 仅响应触摸，建议配 `touch-action: manipulation` |
| `KeyboardSensor` | 聚焦后按键 | 无障碍支持关键，见后文 |

```jsx
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
);
```

<!--
Sensor 负责检测不同输入设备、识别拖拽的激活、移动、结束和取消。DndContext 不传 sensors 时默认用 PointerSensor 加 KeyboardSensor 这一组合。注意实现上 Sensor 是基于类而不是 hook，原因是它需要同步实例化以立即响应用户交互，而且要支持条件性调用，这和 hook 的调用规则是冲突的。

四种内置 Sensor：PointerSensor 基于原生 Pointer Events，统一处理鼠标、触摸、触控笔，是官方推荐的现代浏览器首选；MouseSensor 和 TouchSensor 分别只响应对应设备的事件；KeyboardSensor 靠聚焦后按键触发，是无障碍支持的关键，下一个模块细讲。

用法上要通过 useSensor 包一层配置，再用 useSensors 组合成数组传给 DndContext.sensors，这里用了 sortableKeyboardCoordinates，是排序场景专用的键盘坐标获取器。
-->

---

# activationConstraint —— 区分点击与拖拽

用于区分"点击"与"拖拽意图"，防止按钮/复选框等交互元素的点击被拖拽手势吞掉。`Pointer`/`Mouse`/`Touch` 三种 Sensor 共用：

<v-clicks>

- `{ distance: number }` —— 需要移动的像素数才激活拖拽
- `{ delay: number; tolerance: number }` —— 按住 `delay` 毫秒后激活，期间允许 `tolerance` 像素内抖动
- 两种约束**互斥**，按场景二选一
- **Sensor 生命周期**：检测到激活事件 → 满足约束触发 `onDragStart`（未满足则重复触发新增的 `onDragPending`）→ 派发 move → 派发 end/cancel → 卸载清理

</v-clicks>

```jsx
const sensors = useSensors(
  useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
  useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
);
```

<!--
activationConstraint 是 Sensor 的一个配置项，作用是区分"点击"和"拖拽意图"。不设置的话，任何一次按下都会立刻触发 dragStart，按钮、复选框这些交互元素的点击事件会被拖拽手势整个吞掉，这是新手最常踩的坑之一。

两种约束方式二选一：distance 是需要移动够多少像素才真正激活拖拽，适合鼠标场景；delay 加 tolerance 是按住多少毫秒后激活，期间允许一定像素的抖动，适合触屏长按拖拽的场景。

Sensor 的完整生命周期是：检测到激活事件后，如果满足 activationConstraint 就真正触发 onDragStart；如果还没满足，会重复触发 6.3.x 新增的 onDragPending 事件，这是过渡等待态；之后正常响应输入派发 move，最后派发 end 或者 cancel，传感器卸载时清理监听器。
-->

---

# Modifiers —— 坐标修饰符

| Modifier | 作用 |
| --- | --- |
| `restrictToHorizontalAxis` / `restrictToVerticalAxis` | 限制仅沿单一轴运动 |
| `restrictToWindowEdges` | 限制在浏览器窗口边界内 |
| `restrictToParentElement` / `restrictToFirstScrollableAncestor` | 限制在父元素 / 可滚动祖先范围内 |
| `restrictToBoundingRect` | 限制在指定任意矩形范围内 |
| `snapCenterToCursor` / `createSnapModifier(gridSize)` | 居中吸附光标 / 按网格尺寸吸附 |

用法：`<DndContext modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>`

<!--
Modifiers 在拖拽过程中对 Sensor 检测到的坐标做二次加工，比如限制运动范围、吸附网格。内置一共 8 个：轴向限制的 horizontal 和 vertical、窗口边界限制、父元素限制、第一个可滚动祖先限制、任意矩形限制，还有居中吸附和网格吸附工厂函数，比官方页面摘要文字更全。

最容易搞混的一点：同样是 modifiers，挂在 DndContext 上会影响所有被拖拽节点的实际计算坐标，进而影响 over 和碰撞判定；但挂在 DragOverlay 上，只影响覆盖层的视觉呈现位置，不影响真实的碰撞判定结果。这两者语义完全不同，用错地方会出现「看起来吸附对了，但实际放不进去」这种诡异现象。

自定义 modifier 也很简单，是一个接收 transform 等参数、返回新 Transform 的纯函数，必须不可变更新，不能直接改传进来的对象。
-->

---

# Collision Detection —— 碰撞检测

判定被拖拽项与哪些可放置区域相交，决定 `event.over`。内置算法均基于 AABB 轴对齐包围盒。

| 算法 | 原理 | 适用场景 |
| --- | --- | --- |
| `rectIntersection`（默认） | 两矩形是否几何相交 | 大多数常规拖放 |
| `closestCenter` | 中心点距离最近 | 可排序列表 |
| `closestCorners` | 四角距离最近 | 看板等堆叠容器，优先于 closestCenter |
| `pointerWithin` | 指针坐标是否落入容器 | 高精度拖放，仅对指针类 sensor 有效 |

```jsx
function customCollisionDetection(args) {
  const pointerCollisions = pointerWithin(args); // 优先用指针精确判定
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args); // 无结果时降级
}
```

<!--
碰撞检测算法负责判定被拖拽项和哪些可放置区域相交，这个结果就是 event.over。内置算法都基于 AABB 轴对齐包围盒，也就是假设元素是矩形来做计算。

rectIntersection 是默认值，判断两个矩形是否几何相交，适合大多数常规拖放场景。closestCenter 比较容器中心点和拖拽项中心点的距离，比 rectIntersection 更宽容，适合可排序列表。closestCorners 比较四个角的距离，官方明确建议看板这种堆叠容器场景优先用它而不是 closestCenter，因为堆叠场景中心点判断容易误判。pointerWithin 只在指针坐标真正落入容器范围时才判定，精度最高，但只对指针类 sensor 有效。

也支持自定义组合策略，比如这里的降级模式：优先用 pointerWithin 做精确判定，如果没有命中结果，再降级用 rectIntersection 兜底，两者结合能兼顾精度和容错。
-->

---

# 无障碍（一）—— 键盘拖拽全流程

dnd-kit 区别于原生 HTML5 DnD（完全不支持键盘/读屏）和多数同类库的最大差异化卖点。

<v-clicks>

- **操作流程**：Tab 聚焦可拖拽元素 → Space/Enter 拾取 → 方向键移动（默认 25px/次）→ Space/Enter 确认放置，或 Esc 取消
- **默认 ARIA**（`useDraggable` 自动写入 `attributes`）：`role="button"`、`aria-roledescription="draggable"`
- `aria-describedby` 指向自动生成的说明文本节点、`tabIndex=0`、`aria-disabled`
- 拖拽中会切换 `aria-pressed`

</v-clicks>

<div v-click class="mt-4 text-sm">

> 原生 HTML5 Drag and Drop API 完全没有键盘/读屏支持，这是选型时的关键差异点。

</div>

<!--
无障碍是 dnd-kit 最核心的差异化卖点，也是它区别于原生 HTML5 拖拽 API 和多数同类库最大的地方——原生 API 完全不支持键盘操作和读屏。

完整的键盘拖拽流程：先用 Tab 键把焦点移到可拖拽元素上，按 Space 或 Enter 拾取，拾取后用方向键移动，默认每次移动 25 像素，再按一次 Space 或 Enter 确认放置到新位置，或者按 Esc 取消整个操作，元素会回到原位。

这一整套流程能跑通，靠的是 useDraggable 自动写入的默认 ARIA 属性：role 是 button，aria-roledescription 是 draggable，aria-describedby 指向一段自动生成的说明文本节点，tabIndex 默认 0 让元素可聚焦，aria-disabled 反映禁用状态，拖拽过程中还会切换 aria-pressed。这些全部是开箱即用，不用自己写。
-->

---

# 无障碍（二）—— 播报与说明文案

`screenReaderInstructions`：通过 `accessibility.screenReaderInstructions` 自定义"如何操作"的静态说明，聚焦时朗读。`announcements`：拖拽过程中的实时播报（Live Region）。

```jsx
const announcements = {
  onDragStart({ active }) {
    return `Picked up item ${active.id}. Position ${getPosition(active.id)} of ${itemCount}.`;
  },
  onDragEnd({ active, over }) {
    if (over) return `Item ${active.id} dropped at position ${getPosition(over.id)}.`;
  },
};
```

<div v-click class="text-sm mt-2">

官方建议播报**位置语义**（"第几项，共几项"）而非数组下标（0 起始易误导）。

</div>

<!--
除了默认的 ARIA 属性，dnd-kit 还提供两层可定制的文案。screenReaderInstructions 是静态说明，通过 DndContext 的 accessibility.screenReaderInstructions 配置，读屏软件在用户聚焦到可拖拽元素时朗读，告诉用户"怎么操作"，有一段合理的默认文案。

announcements 是动态的实时播报，靠浏览器的 Live Region 机制实现，onDragStart、onDragOver、onDragEnd、onDragCancel 四个回调各自返回一段播报文本，在对应时机念给用户听，这里演示了 onDragStart 和 onDragEnd 两个。

一个重要的最佳实践：官方明确建议播报"当前第几项，共几项"这种位置语义，而不是数组下标——下标是 0 起始的，直接念出来容易让用户误解自己拖到了第几个位置。这一层定制常常被教程忽略，但对真实无障碍体验影响很大。
-->

---

# 多容器看板（Kanban）

官方未提供开箱即用的多容器组件，通用模式：

<v-clicks>

- 同一个 `DndContext` 下嵌套多个 `SortableContext`（每个容器一个）
- **`onDragOver`** 中检测跨容器移动，手动把 item 从旧数组 `splice` 到新数组（视觉过渡在这一步完成）
- `onDragEnd` 里再用 `arrayMove`/`arraySwap` 处理容器内最终排序
- 碰撞检测建议用 `closestCorners` 而非 `closestCenter`
- 空容器需额外包一层 `useDroppable` 兜底——否则"接不住"拖入项

</v-clicks>

<!--
多容器看板，也就是常见的多列拖拽场景，dnd-kit 官方没有提供开箱即用的组件，需要业务代码按固定模式自己搭。

模式是：同一个 DndContext 下嵌套多个 SortableContext，每个看板列对应一个。关键在 onDragOver 回调里检测 active 是否跨容器移动到了新的 over 容器，检测到就手动把 item 从旧数组 splice 到新数组，这一步完成的是拖拽过程中的实时视觉过渡；onDragEnd 则只负责用 arrayMove 或 arraySwap 处理容器内的最终排序确认，两者分工不能写反。

碰撞检测这种堆叠容器场景建议用 closestCorners 而不是 closestCenter，之前碰撞检测那页提过原因。最后一个容易被忽略的细节：空容器需要额外包一层 useDroppable 兜底，因为容器为空时 SortableContext 内没有可测量的节点提供碰撞目标，不兜底的话空列表"接不住"拖进来的新项。
-->

---

# 易错点 Top 8

<v-clicks>

- **`CSS.Translate` 与 `CSS.Transform` 选错**——前者只应用位移，后者位移+缩放都应用
- **忘记设置 `activationConstraint`**——按钮/复选框的点击会被拖拽手势吞掉
- **移动端忘记设置 `touch-action`**——触摸拖拽与页面滚动手势冲突
- **`SortableContext.items` 顺序与渲染顺序不一致**——动画与位置计算错乱
- **`rectSwappingStrategy` 配 `arrayMove`**——语义不符，交换式策略要配 `arraySwap`
- **用条件语句包裹 `useDraggable`/`useDroppable`**——hook 不能按需调用，须用 `disabled`
- **用数组下标当 `id`/`key`**——增删后下标漂移，动画状态错乱
- **`accessibility` 相关 prop 新旧写法混用**——早期教程顶层写法已收纳进嵌套对象

</v-clicks>

<!--
汇总八个高频易错点。第一，CSS.Translate 和 CSS.Transform 选错，前者只应用位移忽略缩放，后者位移缩放都应用，混用会带来意外的缩放效果。第二，忘记设置 activationConstraint，任何点击都会触发拖拽，按钮点击事件被吞掉。第三，移动端忘记设置 touch-action，触摸拖拽和页面滚动手势会打架。

第四，SortableContext.items 的顺序必须和实际渲染 DOM 顺序一致，官方文档反复强调这点。第五，rectSwappingStrategy 要配 arraySwap，配成 arrayMove 语义就错了。第六，useDraggable/useDroppable 是 hook，不能用 if 条件调用，必须始终无条件调用、用 disabled 参数控制。

第七，列表的 id 或 key 不能用数组下标，增删元素后下标会漂移，dnd-kit 内部维护的过渡动画状态会错乱。第八，accessibility 相关的 prop，比如 announcements、screenReaderInstructions，早期教程写在 DndContext 顶层，现在的类型定义已经收纳进嵌套的 accessibility 对象，照抄旧教程会被 TypeScript 拒绝。
-->

---

# 新架构展望

作者正在开发全新的**框架无关**重写版：`@dnd-kit/abstract` + `@dnd-kit/dom` + `@dnd-kit/react`（还有 vue/svelte/solid 包），当前均为 **0.5.0**（pre-1.0）。

<v-clicks>

- 核心概念：`DragDropManager`/`Draggable`/`Droppable`/`Sortable` 类 + React 侧 `DragDropProvider`
- hook 名字**同名但来自 `@dnd-kit/react`、API 完全不同**：`useDraggable`/`useDroppable`/`useSortable`
- Sensor 从 core 搬到了 `@dnd-kit/dom`；`@dnd-kit/react` 周下载量仅 84.9 万（约为 core 的 4.6%）
- ⚠️ 官网 `dndkit.com` 首页默认展示新架构文档，经典 API 被移到 `/legacy/` 路径下——查资料认准 legacy

</v-clicks>

<!--
最后聊一下未来方向。dnd-kit 作者正在开发一套全新的、框架无关的重写版本，包名是 abstract、dom、react（还有 vue、svelte、solid 对应包），目前都还是 0.5.0，处于 pre-1.0 的早期阶段。

新架构的核心概念变成了 DragDropManager、Draggable、Droppable、Sortable 这几个类，加上 React 侧的 DragDropProvider。一个特别容易踩的坑：新架构里也有 useDraggable、useDroppable、useSortable 这几个 hook，名字完全一样，但它们来自 @dnd-kit/react 包，API 和今天讲的经典版完全不同，Sensor 也从 core 搬到了 @dnd-kit/dom。@dnd-kit/react 目前周下载量只有 84.9 万，大约是 core 的 4.6%，还处于早期采用阶段。

调研中发现的一个关键坑：官网 dndkit.com 首页默认展示的就是这套新架构文档，导航是 DragDropManager 这些新概念；今天讲的经典 API 文档被移到了 /legacy/ 路径下面。直接搜索或者 AI 摘要很容易找错文档、装错包，查资料一定要认准 legacy 路径。
-->

---

# 选型对比

| 方案 | 周下载量 | 无障碍 | 优势场景 |
| --- | --- | --- | --- |
| **dnd-kit** | core 1838 万 | 键盘/读屏一等公民 | 纯 React、看重无障碍 |
| Sortable.js | 398 万 | 弱 | 跨框架复用、开箱即用嵌套多列表分组 |
| react-dnd | 507 万 | 弱 | 存量代码、需要其生态现成组件 |
| 原生 HTML5 DnD | — | 无 | 接收操作系统文件拖入浏览器（dnd-kit 做不到） |

<div v-click class="mt-4 text-sm">

**结论**：纯 Web 应用内部件拖拽排序，dnd-kit 全面胜出；只有"接收系统文件拖入"这类原生能力是硬需求时才必须上原生 HTML5 DnD（可与 dnd-kit 混用）。

</div>

<!--
汇总一下选型对比。Sortable.js 是框架无关的原生 JS 库，零依赖、体积小、上手快，天然支持嵌套列表和多列表拖拽，但 React 封装是社区包不是官方一等公民，直接操作 DOM 顺序容易和 React 虚拟 DOM diff 打架，无障碍支持薄弱。适合需要跨框架复用、或者需要开箱即用嵌套多列表分组能力的场景。

react-dnd 是更早期的方案，约 2015 年就有了，用 monitor 加 connector 模式，依赖 HTML5Backend 或 TouchBackend，API 偏底层、样板代码多。新项目基本没理由再选它，除非已有大量存量代码，或者需要它生态里特定的现成组件。

原生 HTML5 拖拽 API 零依赖，且是唯一能接住"从操作系统拖文件到浏览器"这类原生能力的方案，dnd-kit 完全做不到这个。但它移动端支持长期残缺、完全没有键盘读屏支持。

结论很清楚：纯 Web 应用内部件拖拽排序场景，dnd-kit 全面胜出；只有系统文件拖入浏览器这种硬需求才必须上原生 API，甚至可以混用——文件拖入区用原生事件，页面内部件排序用 dnd-kit。
-->

---
layout: intro
---

# 总结

dnd-kit = **React hook 驱动的现代化拖拽工具集**

- `DndContext` 共享状态；`useDraggable`/`useDroppable` 是最小交互单元
- `DragOverlay` 解决裁剪/跨容器卸载难题；Sortable 预设覆盖列表/看板排序
- `Sensors` + `activationConstraint` 统一输入、区分点击与拖拽意图
- 键盘无障碍是核心卖点：Tab → Space/Enter → 方向键 → Space/Enter/Esc
- 当前 `@dnd-kit/core` 6.3.1，新架构 `@dnd-kit/react` 0.5.0 尚处早期阶段

<div class="mt-6 text-sm">

官方文档（legacy）：<a href="https://dndkit.com/legacy/introduction/installation/" target="_blank">dndkit.com/legacy</a> · GitHub：<a href="https://github.com/clauderic/dnd-kit" target="_blank">clauderic/dnd-kit</a>

</div>

<!--
总结一下。dnd-kit 是 React hook 驱动的现代化拖拽工具集。

核心心智模型：DndContext 提供共享状态，useDraggable 和 useDroppable 是最小的可拖拽、可放置交互单元；DragOverlay 从架构层面解决滚动裁剪、跨容器卸载这些经典难题；Sortable 预设的 SortableContext 加 useSortable 覆盖列表和看板排序场景，配合 arrayMove/arraySwap 更新数组。

输入层面，Sensors 加 activationConstraint 统一处理指针、鼠标、触摸、键盘，区分点击和拖拽意图。dnd-kit 最大的差异化卖点是无障碍：完整的键盘拖拽流程，从 Tab 聚焦，到 Space/Enter 拾取，方向键移动，再到 Space/Enter 确认或 Esc 取消，这是原生 HTML5 拖拽 API 完全做不到的。

现状：当前主流稳定版本是 core 6.3.1，作者也在推进一套框架无关的新架构，@dnd-kit/react 目前 0.5.0，还处于早期阶段，查资料记得认准 legacy 路径。谢谢大家。
-->
