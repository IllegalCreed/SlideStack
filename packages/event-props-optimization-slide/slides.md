---
theme: seriph
background: https://cover.sli.dev
title: 事件及属性优化
info: |
  事件及属性优化：防抖节流 · 事件委托 · React 记忆化 · Vue 浅响应
  React 19.2 + React Compiler / Vue 3.5 / Lodash 4.17.15 / MDN

  Learn more at [https://react.dev/reference/react/useMemo](https://react.dev/reference/react/useMemo)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 事件及属性优化

高频事件回调 + 框架重渲染 · React 19.2 / Vue 3.5 / Lodash 4.17.15

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
事件及属性优化处理两条线：高频事件回调 + 框架过度重渲染，本质都是减少主线程不必要的工作。
-->

---
transition: fade-out
---

# 两条主线

把「用户操作 → 主线程负载」拆成两个独立优化点

- **事件侧**：滚动 / 拖拽 / 输入触发回调过频 → 防抖 / 节流 / 委托 / passive
- **渲染侧**：状态变化 → 子树过度重渲染 → React 记忆化 / Vue 浅响应

> 共同目标：**减少主线程上不必要的计算与渲染**

<!--
不是所有事件都要防抖，不是所有组件都要 memo——先 Profiler 再优化。
-->

---
layout: two-cols
layoutClass: gap-8
---

# 防抖 vs 节流

Lodash 官方 API · 同源降频，区别在「何时执行」


```text
100ms 内连点 5 次，wait=200ms：

debounce → 停手后 200ms 执行 1 次
throttle → 首次立即 + 停手后补 1 次
```

| API | 默认选项 |
|------|---------|
| `_.debounce` | trailing:true |
| `_.throttle` | leading+trailing:true |

::right::

<br>

**选项语义**

| 选项 | 默认值 | 作用 |
|------|--------|------|
| `leading` | debounce:false | 序列首次是否立即 |
| `trailing` | true | 延迟到期补一次 |
| `maxWait` | throttle=wait | 允许最大延迟 |

> 两者返回函数都带 `.cancel()` 与 `.flush()`

<!--
debounce 合并多次成最后一次；throttle 保证固定频率至少执行一次。
-->

---

# 场景选型

按「用户期望」选——「停手再执行」vs「按节奏跟手」

| 场景 | 选型 | 理由 |
|------|------|------|
| 搜索框自动补全 | debounce 300ms | 停手才发请求 |
| 表单字段校验 | debounce 400ms | 不打扰输入 |
| window resize | debounce 200ms | 拖动结束后再算 |
| 滚动加载 / 吸顶 | throttle 100ms | 按节奏跟手 |
| 拖拽 / mousemove | throttle 16~50ms | 跟手不卡帧 |
| 按钮防连点 | throttle 1000ms（trailing:false）| 首次响应 |

<!--
场景选错效果相反：搜索框用 throttle 会狂发请求，拖拽用 debounce 会不跟手。
-->

---

# React 实例管理（关键坑）

`useMemo` / `useRef` 只创建一次；卸载时 cancel

```tsx
// ✅ 正确：useMemo 单实例 + 卸载 cancel
function SearchBox() {
  const debounced = useMemo(
    () => _.debounce((q: string) => fetchResults(q), 300),
    []
  );
  useEffect(() => () => debounced.cancel(), [debounced]);
  return <input onChange={(e) => debounced(e.target.value)} />;
}
```

```tsx
// ❌ 反模式：每次 render 重建实例 → 防抖完全失效
const onChange = (e) => _.debounce(fetchResults, 300)(e.target.value);
```

<!--
组件卸载时未 cancel 会在卸载后仍 setState，造成内存泄漏与警告。
-->

---
layout: two-cols
layoutClass: gap-8
---

# 事件委托

冒泡 + 父容器单监听器，动态子项无需重绑


```html
<ul id="list">
  <li data-id="1" data-action="select">项 1</li>
  <!-- ... 几千项 ... -->
</ul>
```

```ts
list.addEventListener('click', (e) => {
  const item = e.target.closest('[data-id]');
  if (!item) return;
  console.log('id =', item.dataset.id);
});
```

::right::

<br>

**API 区分**

| 属性 | 含义 |
|------|------|
| `event.target` | 实际触发元素（最深） |
| `event.currentTarget` | 绑定监听器者 |
| `stopPropagation` | 阻止冒泡 |
| `capture:true` | 捕获阶段触发 |

> 监听器从 N → 1，内存与重绑开销大幅下降

<!--
closest 上溯是事件委托的标配；stopPropagation 慎用。
-->

---

# passive 事件

承诺「不 preventDefault」→ 浏览器并行滚动

```ts
// ✅ 显式声明 passive
window.addEventListener('scroll', _.throttle(onScroll, 100), {
  passive: true,
});
```

- 浏览器无需等监听器跑完，**并行滚动不卡顿**
- 监听器内调 `preventDefault()` 控制台报警且无效
- 现代 Chrome/Firefox 对 document 上的 touchstart/touchmove 已默认 passive

> 滚动监听器典型组合：`_.throttle + { passive: true }`

<!--
passive 是给浏览器的承诺，让滚动这类高频事件不再阻塞主线程。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# React useMemo / useCallback

3 类场景才值得用，滥用反损性能

```tsx
// useCallback(fn, deps) ≡ useMemo(() => fn, deps)
const onClick = useCallback((id) => select(id), []);
const visible = useMemo(() => items.filter(expensivePred), [items]);
```

**3 类有效场景**

- 计算昂贵且依赖少变（>1ms 过滤 / 排序）
- 作为 prop 传给 memo 子组件
- 作为其他 Hook 的依赖

> 箭头返回对象必须 `() => ({...})`，否则被当代码块返回 undefined

<!--
滥用 useMemo 反而增加首屏开销，可读性也下降。
-->

---

# memo 与失效场景

props 浅比较（Object.is）跳过重渲染

```tsx
const Profile = memo(function Profile({ name, age }: Props) {
  return <div>{name} - {age}</div>;
});
```

**失效的根因——内联对象 / 函数引用每次都变**

```tsx
// ❌ memo 失效
<List items={items.filter(x)} />
<Button onClick={() => handleClick(id)} />

// ✅ 配合 useMemo / useCallback
<List items={visibleItems} />  {/* useMemo */}
<Button onClick={handleClick} />{/* useCallback */}
```

<!--
memo 默认浅比较，传新引用就失效；常见错误是忘了配合 useMemo/useCallback。
-->

---
layout: section
---

# React Compiler · Vue 浅响应

2026 自动 memoize · 大数据结构低开销

<!--
两大现代优化范式：编译期自动化 vs 浅响应降低 Proxy 开销。
-->

---

# React Compiler（2026 正式）

编译期自动 memoize，多数场景可移除手动三者

```tsx
// 启用 Compiler 后，下面代码会被自动 memoize
function FilteredList({ items, threshold }) {
  const visible = items.filter(x => x.value > threshold);
  const onClick = (id) => select(id);
  return visible.map(x => <Item key={x.id} onClick={onClick} />);
}
```

- 自动缓存值 / 函数 / 组件，**包括中间值**
- 编译产物比 `memo + useMemo` 组合更全面
- 启用后官方 Reference 注明「通常无需手动 memoize」

> 迁移期可共存：新代码不手写，老代码先 Profiler 再删

<!--
React Compiler 是 2026 年最大改动，让手写 memoize 大幅减少。
-->

---

# Vue shallowRef / shallowReactive

浅响应：仅顶层响应，深层不变 Proxy

```ts
const state = shallowRef({ count: 0, list: [] });
state.value.count++;          // ❌ 不触发更新
state.value = { count: 1 };   // ✅ 整体替换
triggerRef(state);            // ✅ 手动触发
```

```ts
const sr = shallowReactive({ user: { name: 'A' }, count: 0 });
sr.count = 1;                 // ✅ 根级响应
isReactive(sr.user);          // ❌ false
```

> **官方 Use with Caution**：shallowReactive 不可嵌套进深 reactive

<!--
大列表/第三方数据源用 shallowRef 降低 Proxy 拦截开销；触发整体替换或 triggerRef。
-->

---

# Vue v-memo

模板子树记忆化，依赖全等则跳过创建

```html
<!-- ✅ 与 v-for 同元素 -->
<div v-for="item in list" :key="item.id"
     v-memo="[item.id, item.id === selected]">
  <ItemContent :data="item" />
</div>

<!-- v-memo="[]" 等价 v-once：只渲染一次 -->
<header v-memo="[]">永不变</header>
```

**官方 WARNING**：必须与 v-for **同一元素**，写在内部子元素不生效

> 适用场景：v-for length > 1000 的大列表选中态切换

<!--
v-memo 依赖漏写真实变化值会导致 UI 不刷新，要谨慎用。
-->

---
layout: center
class: text-center
---

# 反模式速查

`useMemo(fn)` 忘传依赖 → 没缓存　·　memo 子组件接内联对象 → 失效
　·　卸载未 cancel debounce → 内存泄漏　·　`shallowRef.value.count++` 不触发
　·　v-memo 写在 v-for 内层 → 不生效　·　委托里 `event.target` 不 `.closest()` → 不命中

<!--
这些反模式都在生产环境频繁出现，逐一对照排查。
-->

---
layout: center
class: text-center
---

# 小结

事件及属性优化 = 降低回调频率 + 缩小渲染范围

**事件侧**：debounce / throttle / 委托 / passive
**渲染侧**：useMemo / useCallback / memo / Compiler / shallow / v-memo

[React useMemo](https://react.dev/reference/react/useMemo) · [Vue Reactivity Advanced](https://vuejs.org/api/reactivity-advanced.html) · [Lodash debounce](https://lodash.com/docs/4.17.15#debounce)

<!--
两条主线本质相同：减少主线程不必要的工作。先 Profiler 测量，再对症下药。
-->
