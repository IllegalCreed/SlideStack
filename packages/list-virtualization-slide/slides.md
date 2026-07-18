---
theme: seriph
background: https://cover.sli.dev
title: 长列表虚拟化完全指南
info: |
  长列表虚拟化完全指南：TanStack Virtual · react-window · vue-virtual-scroller

  只渲染可视区 + overscan，把 DOM 从 O(N) 降到 O(可见)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 长列表虚拟化完全指南

TanStack Virtual · react-window · vue-virtual-scroller

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
虚拟化的本质是只渲染可见 + overscan 缓冲区，把 DOM 数量从 O(N) 降到 O(可见)。
-->

---
transition: fade-out
---

# 什么是虚拟化

只把**可见区 + 一段 overscan 缓冲区**渲染成 DOM，其余项完全不进 DOM 树

- **几何模型**：根据 `scrollTop`、视口 `H`、`itemSize` 计算 `[startIndex, endIndex]`
- **位置还原**：父容器 `position:relative` + `getTotalSize()` 撑总高；子项 `position:absolute` + `transform:translateY(start)`
- **节点量级**：从 O(N) 降到 O(可见 + overscan)，常量级开销
- **滚动顺滑**：每次滚动只更新少量节点，FPS 稳定 60

> 10 万条数据 ≈ 真实 DOM 只有 10~30 个，差两个数量级。

<!--
虚拟化的本质是几何计算 + 绝对定位，把 DOM 节点数降到常量级。
-->

---

# 为何需要虚拟化：DOM 数量瓶颈

节点数过千时，渲染管线全线吃紧

- **首屏渲染慢**：解析 / 创建 DOM / 布局 / 绘制，每步都随节点数线性甚至超线性增长
- **滚动掉帧**：每次滚动触发重排，FPS 跌破 60 / 30
- **内存吃紧**：10 万节点轻松占数百 MB，移动端直接 OOM
- **样式匹配变慢**：CSS 选择器匹配复杂度随节点数上升

> 经验阈值：复杂项 > 500 行、简单项 > 2000 行，就要警惕 DOM 数量瓶颈。

<!--
DOM 节点数过千后，浏览器渲染管线全面承压，这是虚拟化的根本动机。
-->

---

# 虚拟化核心原理

```text
┌──────── 滚动容器（视口高度 H）────────┐
│  ↑ overscan 上缓冲（如 1~3 行）       │
│  ─────── 可见区（H / itemSize 行）────│  ← 只这部分真实渲染
│  ↓ overscan 下缓冲（如 1~3 行）       │
└──────────────────────────────────────┘
              ↑ getTotalSize() 撑出总高
```

- **可见窗口**：`[scrollTop/itemSize, (scrollTop+H)/itemSize]`
- **加 overscan**：上下各扩展 N 行，消除快速滚动白屏
- **绝对定位**：父 relative + 子 absolute + `transform:translateY()`

<!--
核心三步：算窗口、加缓冲、绝对定位。所有库的底层都是这套几何模型。
-->

---

# 几何计算示例

```text
scrollTop: 1200    itemSize: 40    viewport H: 480    overscan: 4

可见窗口 = [scrollTop/itemSize, (scrollTop+H)/itemSize]
         = [30, 42]

加上 overscan → 渲染 [26, 46] 共 21 个 DOM 节点
（而非全量 10 万）
```

- 等高列表的 `index ↔ offset` 计算是 **O(1)**
- 动态高度需维护测量缓存前缀和，向上滚动时可能跳动

<!--
等高列表性能最好；动态高度需要测量缓存，向上滚动可能有跳动。
-->

---

# 三库定位对比

| 维度 | TanStack Virtual | react-window | vue-virtual-scroller |
|------|------------------|--------------|----------------------|
| 版本 | v3.14.x | v2.2.x | v3.0.x |
| 形态 | headless | React 组件 | Vue 组件 |
| 跨框架 | ✅ | ❌ | ❌ |
| 控制 | 最高 | 中 | 中 |
| 心智 | 中 | 低 | 低 |

> 想最大控制力 / 跨框架 → TanStack；最少样板 → react-window / vue-virtual-scroller。

<!--
三库定位差异：TanStack headless 最灵活，另两个开箱即用。
-->

---

# TanStack Virtual：useVirtualizer

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const parentRef = useRef<HTMLDivElement>(null);
const row = useVirtualizer({
  count: items.length,                  // 必填
  getScrollElement: () => parentRef.current,  // 必填
  estimateSize: () => 40,               // 必填
  overscan: 4,
  getItemKey: (i) => items[i].id,
});
// 实例方法：getVirtualItems() / getTotalSize() / scrollToIndex()
```

- 必填三件套：`count` + `getScrollElement` + `estimateSize`
- 实例取 `getVirtualItems()` 渲染、`getTotalSize()` 撑总高

<!--
TanStack 三件套：count、getScrollElement、estimateSize。
-->

---

# 动态测量：measureElement

```tsx
{row.getVirtualItems().map((vi) => (
  <div
    key={vi.key}
    data-index={vi.index}            // measureElement 靠这个识别
    ref={row.measureElement}         // 自动挂 ResizeObserver
    style={{
      position: "absolute",
      top: 0,
      transform: `translateY(${vi.start}px)`,
    }}
  >
    {items[vi.index].content}
  </div>
))}
```

> **estimateSize 取接近最大值**，不要返回 0——避免首屏批量修正跳动。

<!--
动态测量：measureElement ref + data-index；estimateSize 取最大值。
-->

---
layout: two-cols
---

# react-window v1 vs v2

**v1（旧项目兼容）**

- `FixedSizeList` / `VariableSizeList`
- `FixedSizeGrid` / `VariableSizeGrid`
- `itemSize: number \| fn`
- 手动 `React.memo`
- 手动 `resetAfterIndex`

> v1 仍维护，但拿不到 v2 新特性

::right::

<br>

**v2（新项目首选）**

- `List` / `Grid`
- `rowComponent` + `rowProps`
- `rowHeight` 支持动态缓存
- **内置自动 memo**
- **ResizeObserver 基线**
- `useDynamicRowHeight` hook

> API 重构为组件式，自动 memo / sizing

<!--
v2 是最小破坏性变更的大版本升级，新项目应直接用 v2。
-->

---

# react-window v2 必填 props

```tsx
import { List, useDynamicRowHeight } from "react-window";

function Row({ index, style, data }) {
  return <div style={style}>{data[index].title}</div>;
}

const rowHeight = useDynamicRowHeight(); // 动态缓存

<List
  rowCount={items.length}
  rowHeight={rowHeight}
  rowComponent={Row}
  rowProps={items}     // 即便 {} 也必填
  height={480}
  width="100%"
/>
```

> v2 别再手写 `React.memo`，与自动 memo 冲突或失效。

<!--
v2 必填四件套：rowCount、rowHeight、rowComponent、rowProps。
-->

---

# vue-virtual-scroller：两大组件

| 维度 | RecycleScroller | DynamicScroller |
|------|-----------------|-----------------|
| 场景 | 等高 / 接近等高 | 动态高度 |
| 复用 | recycle DOM | 测量 + 缓存 |
| 必填 | `items`、`itemSize` | `items`、`minItemSize` |
| 性能 | 最优 O(1) | 略低 |

> 变高场景必须切到 `DynamicScroller` + `DynamicScrollerItem`，否则尺寸错算。

<!--
两大组件按是否等高选择：RecycleScroller vs DynamicScroller。
-->

---

# RecycleScroller 示例

```text
<template>
  <RecycleScroller
    :items="items"
    :item-size="40"
    key-field="id"
    :buffer="200"
    v-slot="{ item }"
  >
    <div class="row">{{ item.text }}</div>
  </RecycleScroller>
</template>

<script setup lang="ts">
import "vue-virtual-scroller/index.css";  // 必须！
import { RecycleScroller } from "vue-virtual-scroller";
</script>
```

> **必须 import CSS**，否则定位全乱；Vue 3.3+ ESM only，Vue 2 用 v1 分支。

<!--
RecycleScroller 等高复用 DOM；必须 import CSS。
-->

---

# DynamicScrollerItem：size-dependencies

```text
<DynamicScroller :items="items" :min-item-size="60" key-field="id">
  <template #default="{ item, active }">
    <DynamicScrollerItem
      :item="item"
      :active="active"
      :data-index="item.id"
      :size-dependencies="[item.title, item.body]"
    >
      <h3>{{ item.title }}</h3>
      <p>{{ item.body }}</p>
    </DynamicScrollerItem>
  </template>
</DynamicScroller>
```

> `size-dependencies` 只列**真正影响尺寸的字段**，传整对象会过度触发重排。

<!--
DynamicScrollerItem 必须传 size-dependencies，只列影响尺寸的字段。
-->

---

# 反向滚动 / 聊天流

TanStack v3 反转流组合，专为聊天 / 日志场景设计

```tsx
const row = useVirtualizer({
  count: messages.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
  getItemKey: (i) => messages[i].id,
  anchorTo: "end",           // 锚定视口底端
  followOnAppend: true,      // 新消息自动跟随
  scrollEndThreshold: 30,    // 距底 30px 内才算「在底端」
});
```

> 默认 `anchorTo:'start'` 会把当前可见项顶出视口——聊天场景要切到 `'end'`。

<!--
聊天 / 日志反转流用 anchorTo end + followOnAppend + scrollEndThreshold。
-->

---

# 共同反模式

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| 漏 `overflow:auto` / 固定高 | 子项无滚动容器 | 父必有 `height` + `overflow:auto` |
| key 设成 `index` | 增删后状态错配 | 用稳定 id |
| 小列表强行虚拟化 | 样板代码 + 测量开销 | DOM < 500 直接 v-for |
| 动态高度用错组件 | 尺寸错算 | 切 DynamicScroller / measureElement |
| 漏 `getItemKey` | 反转流 / 增删状态错配 | 必返回稳定 id |

> **何时不该虚拟化**：< 500 行、需要全文 Ctrl+F 搜索、屏幕阅读器全量可访问。

<!--
反模式集中在容器配置、键值复用、组件选型三大类。
-->

---
layout: center
class: text-center
---

# 小结

虚拟化 = 只渲染可见 + overscan · 绝对定位还原位置

**TanStack Virtual（headless） · react-window v2（React 组件） · vue-virtual-scroller（Vue 组件）**

[文档](https://tanstack.com/virtual/latest/docs/introduction) · [react-window](https://react-window.vercel.app/) · [vue-virtual-scroller](https://vue-virtual-scroller.netlify.app/guide/)

<!--
三库都活跃维护；按框架与控制力需求选型。
-->
