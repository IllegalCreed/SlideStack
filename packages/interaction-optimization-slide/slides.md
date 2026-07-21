---
theme: seriph
background: https://cover.sli.dev
title: 交互优化完全指南
info: |
  前端交互优化：NN/g 三档响应时间 · 骨架屏防 CLS · 乐观更新 · 触摸目标 WCAG · 表单 UX · 错误空状态 · aria-busy / aria-live

  Learn more at https://www.nngroup.com/articles/response-times-3-important-limits/
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 交互优化完全指南

感知 · 反馈 · 即时性 · WCAG · Core Web Vitals

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
交互优化不是性能的别名，而是「用户操作后页面应该给他看到什么」的工程答案。
-->

---
transition: fade-out
---

# 什么是交互优化

不是「让代码跑得更快」，而是回答一个用户感知问题

- **加载感知**：骨架屏 / spinner / 进度条（按等待时长选型）+ 防位移（CLS ≤ 0.1）
- **操作感知**：乐观更新（即时反馈 + 失败回滚）+ NN/g 三档响应时间
- **触控感知**：触摸目标 24×24 (AA) / 44×44 (AAA)
- **输入感知**：表单实时验证（blur 触发）+ `autocomplete` 标准 token
- **状态感知**：错误状态 / 空状态 / `aria-busy` / `aria-live`

> 边界：防抖 / 节流的「性能维度」归性能优化·事件属性叶，本叶只讲 UX 维度。

<!--
感知-反馈主线：用户做了操作，0.1s / 1s / 10s 各应该给他看到什么。
-->

---

# NN/g 三档响应时间

| 等待时长 | 用户感知 | 反馈方式 |
|------|------|------|
| **< 0.1s** | 瞬时、直接操控感 | **无需反馈** |
| **0.1s – 1s** | 思路不中断，可察觉延迟 | 可略延迟，需轻量 spinner |
| **1s – 10s** | 思路被打断，注意力流失 | spinner / 骨架屏明确反馈 |
| **> 10s** | 注意力上限，焦虑想离开 | **必须 percent-done 进度条 + 可中断** |

**关键反模式**：加载 < 1s 放骨架屏或 spinner 反而是负优化——闪一下让用户觉得「跟不上节奏」。

> 来自 Nielsen Norman Group 经典研究（基于 Miller / Card / Shneiderman）。

<!--
三档是判断「该不该给反馈、给什么反馈」的根本依据。
-->

---

# CLS 与骨架屏

**CLS（Cumulative Layout Shift）**：Core Web Vitals 三件套之一

- 三档阈值：良好 **≤ 0.1** / 需改善 0.1–0.25 / 差 > 0.25
- **无单位分数**（区别于 LCP/INP 的毫秒）
- **500ms 宽限**：用户交互后 500ms 内的位移不计入 CLS

**骨架屏防 CLS 的本质**：占位与真实内容**几何一致**，加载完成时零位移

- 占位尺寸必须与最终内容盒模型匹配（图位 / 标题 / 卡片层级）
- 容器加 `aria-busy="true"`
- shimmer 动画必须用 `prefers-reduced-motion: reduce` 降级

> 移除广告位预留 `min-height` 本身也会造成 CLS（web.dev 明确警告）。

<!--
CLS 是无单位分数，与 LCP/INP 的毫秒不同；500ms 交互宽限规则只针对交互后位移。
-->

---
layout: two-cols
---

# 骨架屏 vs Spinner

**按等待时长选型**

- **< 1s**：不放反馈（闪一下是负优化）
- **2–10s**：骨架屏 或 spinner
- **> 10s**：必须 percent-done 进度条

**骨架屏适合**：整页加载（暗示结构 + 防 CLS）

**Spinner 适合**：单个模块（按钮 loading、卡片局部刷新）

::right::

# 信息量差异

| 维度 | 骨架屏 | Spinner |
|------|------|------|
| 信息 | 暗示结构 | 只表示「转」 |
| 防位移 | CLS ≈ 0 | 可能撑开布局 |
| 适用 | 整页 | 局部刷新 |

**反模式**：Frame-display 骨架屏（只画 header/footer + 空背景）= 等同 spinner，NN/g 不推荐

<!--
骨架屏的两个硬要求：几何一致 + aria-busy + prefers-reduced-motion 降级。
-->

---

# 乐观更新三回调链

TanStack Query v5 范式（缺一不可）

```ts
const mutation = useMutation({
  mutationFn: api.updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previousData = queryClient.getQueryData(["todos"]);
    queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);
    return { previousData };
  },
  onError: (_e, _n, ctx) => {
    queryClient.setQueryData(["todos"], ctx.previousData);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

**缺 `cancelQueries`** → 后台 refetch 覆盖乐观值，UI 闪烁（discussion #10712）

<!--
React 19 的 useOptimistic 提供等价的原生 hook 能力。
-->

---

# 触摸目标 WCAG

| 准则 | 等级 | 最低尺寸 | 例外数 |
|------|------|------|------|
| **2.5.8** Target Size (Minimum) | **AA** | **24×24 CSS px** | 5（含 Spacing） |
| **2.5.5** Target Size (Enhanced) | **AAA** | **44×44 CSS px** | 4（无 Spacing） |

**2.5.8 的 5 个例外**：Spacing / Equivalent / Inline / User Agent Control / Essential

- **Spacing 判定**：目标边界框中心画 24px 直径圆与其他目标圆**不相交**
- **2.5.8 是 WCAG 2.2 (2023-10-05) 新增**，老资料常缺

**事实标准**：Apple HIG 44pt / Google Material 48dp 都高于 AA 下限

<!--
即使只追求 AA，也强烈建议做到 44px——手指粗 / 手震 / 颠簸下 24px 仍易误触。
-->

---
layout: two-cols
---

# Spacing 例外判定

当目标做不到 24×24 时，必须留足间距

- 以目标边界框**中心**画 **24px 直径圆**
- 圆与其他目标的圆**不相交**

```text
目标 A (20×20)   目标 B (20×20)
   ┌──────┐         ┌──────┐
   │      │         │      │
   └──────┘         └──────┘
      ←  24px 间距  →
   两目标的 24px 圆不相交
   → 满足 Spacing 例外
```

::right::

# 技术实现

**目标够大**：直接给 `min-width` + `min-height`

```css
.icon-button {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

**目标小**：用 padding 扩大可点区域，比改图标本身视觉尺寸更优雅

<!--
Spacing 例外是 2.5.8 (AA) 的关键逃生通道，但 2.5.5 (AAA) 没有这个例外。
-->

---

# 表单 UX 与 autocomplete

**WCAG 1.3.5 (AA) Identify Input Purpose**

- 用 HTML `autocomplete` 标准 token 标识输入用途
- 技术 **H98**；失败 **F107**（值不合法）
- `type=email` **不满足** 1.3.5——太粗，不区分本人 / 他人邮箱

| 场景 | 常用 token |
|------|------|
| 姓名 | `name` / `given-name` / `family-name` |
| 联系 | `email` / `tel` / `street-address` |
| 账号 | `username` / `current-password` |
| 日期 | `bday` / `bday-day` / `bday-month` |

**实时验证时机**：blur 触发而非 keystroke——onChange 每次按键报错会让放弃率上升

<!--
autocomplete 标准 token 让浏览器自动填充，对记忆 / 阅读 / 运动障碍用户显著降负。
-->

---
layout: two-cols
---

# 错误三阶梯

| 准则 | 等级 | 要求 |
|------|------|------|
| **3.3.1** Error Identification | A | **以文本告知**出错 + 错在哪 |
| **3.3.3** Error Suggestion | AA | 给**可操作**的修正建议 |
| **3.3.4** Error Prevention | AA | 法律 / 财务 / 删数据三选一 |

**3.3.4 三条满足路径**：

- 可撤销（如 Gmail 30 秒撤销发信）
- 提交前校验给修正机会
- 提交前用户确认

::right::

# 实时验证时机

**正确**：blur（失焦）后触发

```html
<input
  type="email"
  autocomplete="email"
  @blur="validateEmail"
  aria-describedby="email-error"
/>
<div
  id="email-error"
  role="alert"
  v-if="error"
>
  {{ error }}
</div>
```

**反模式**：onChange 每次按键报错

<!--
blur 表示用户认为该项已完成，此时反馈才被接受。
-->

---

# 错误状态与空状态

**错误状态三要素**（不能只靠颜色）：① **出错了**（视觉+文本）② **错在哪**（3.3.1）③ **怎么修**（3.3.3）

**空状态**（NN/g 研究）：空白页让用户以为系统坏了，必须解释「**为什么空 + 下一步做什么**」+ 至少一个主 CTA

| 类型 | 设计要点 |
|------|------|
| 首次空（onboarding） | 解释价值 + 引导首次操作 |
| 完成空（success） | 庆祝 + 后续动作 |
| 无结果空 | 解释 + 调整筛选 |

**反模式**：裸「No data」/ 空白页

<!--
空状态是「把死胡同变成行动入口」的关键设计。
-->

---

# aria-busy 与 aria-live

**`aria-busy="true"`**：标记容器正在加载 / 修改，辅助技术在内容就绪后再暴露

**`aria-live`** 三档：

| 值 | 行为 | 用途 |
|------|------|------|
| `off` | 不播报 | 不重要的动态内容 |
| `polite` | 当前任务结束才播报 | 普通内联验证、内容就绪 |
| `assertive` | 立即打断当前任务 | 紧急错误 |

**ARIA19 关键结论**：

- `role="alert"` 等价 `aria-live="assertive"`，**仅用于紧急错误**
- 多个 `aria-live="assertive"` 区域并存是**反模式**——读屏互相打断

> 普通内联验证用 `polite`；只有必须立即通知的错误才用 `assertive` 或 `role="alert"`。

<!--
aria-live 用错比不用更糟——多个 assertive 区域会让读屏用户彻底混乱。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- Frame-display 骨架屏（只画 header/footer = 等同 spinner）
- 不 `cancelQueries` 直接 `setQueryData`（UI 闪烁）
- 多个 `aria-live="assertive"` 并存（读屏混乱）
- 表单错误只说「错误」「无效」（违反 3.3.1 / 3.3.3）
- 移除广告位预留 `min-height`（移除本身造成 CLS）
- `<img>` 不写 `width/height`（加载完撑开布局）
- onChange 每次按键报错（用户被错误淹没）
- 触摸目标 16×16 / 20×20 无间距（违反 2.5.8 AA）
- 裸「No data」/ 空白页空状态（无解释无 CTA）

<!--
反模式清单：每一项都能在 WCAG / NN/g 找到明确的官方证据。
-->

---
layout: two-cols
---

# 与相邻概念的边界

| 主题 | 归本叶 | 归相邻章 |
|------|------|------|
| 防抖 / 节流 | UX 维度 | **性能维度 → 性能优化·事件属性叶** |
| RAIL 模型 | 引用响应时间 | **性能预算 → 性能优化章** |
| `rAF` / `rIC` | 不展开 | **性能优化章** |
| Web Worker / 虚拟列表 | 不展开 | **性能优化章** |

::right::

# CLS 与框架边界

| 主题 | 归本叶 | 归相邻章 |
|------|------|------|
| CLS 阈值 | 引用为度量 | **字体 size-adjust / bfcache → 性能章** |
| React 19 `useOptimistic` | 实现注脚 | **hook 原理 → 前端框架章** |
| TanStack Query API | 实现注脚 | **内部原理 → 前端框架章** |

> 本叶只讲「**用户感知与交互**」层面

<!--
防抖节流的性能维度归事件属性叶，本叶只讲 UX 维度。
-->

---
layout: center
class: text-center
---

# 小结

交互优化 = 把性能 / 可访问性 / 视觉稳定 / 表单 UX / 状态设计拧成一条感知链

**NN/g 三档 · CLS ≤ 0.1 · WCAG 24/44 · blur 验证 · polite 播报**

[NN/g Response Times](https://www.nngroup.com/articles/response-times-3-important-limits/) · [WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/) · [web.dev CLS](https://web.dev/articles/optimize-cls) · [TanStack Query Optimistic](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates)

<!--
掌握感知-反馈主线 + WCAG 硬阈值 + 边界区分，就能把交互优化做到生产水准。
-->
