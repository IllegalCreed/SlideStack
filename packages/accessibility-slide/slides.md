---
theme: seriph
background: https://cover.sli.dev
title: 可访问性 a11y 完全指南
info: |
  前端可访问性完全指南：WCAG 2.2 · ARIA · 键盘导航 · 语义化 HTML · 对比度

  Learn more at https://www.w3.org/WAI/standards-guidelines/wcag/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 可访问性 a11y 完全指南

WCAG 2.2 · ARIA · 键盘导航 · 语义化 HTML · 对比度

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
a11y = accessibility（首尾 a/y 之间 11 个字母），让所有人都能用。WCAG 2.2 于 2023-10-05 正式发布。
-->

---
transition: fade-out
---

# 什么是 a11y

让**所有人**都能用界面——不只是残障用户

- **a11y** = accessibility（首尾 a/y 之间 11 个字母）
- **覆盖人群**：视障 / 听障 / 运动障碍 / 认知障碍 / 临时损伤（手腕扭伤）/ 情境限制（强光下看屏）
- **官方基线**：**WCAG 2.2**（W3C Recommendation 2023-10-05）
- **核心目标**：信息可感知、UI 可操作、内容可理解、辅助技术可读

> a11y 不是「为残障用户的小众优化」，是「为所有人在某些时刻的可用性」。

<!--
强调 a11y 受益人群远比「视障」广：临时扭伤手腕、强光下看屏、单手抱娃都属于。
-->

---

# WCAG 四大原则 POUR

所有准则归到四大原则

| 原则 | 含义 | 典型 SC |
|------|------|------|
| **P**erceivable | 可感知 | 1.1 文本替代 / 1.4 对比度 |
| **O**perable | 可操作 | 2.1 键盘可达 / 2.4 导航 |
| **U**nderstandable | 可理解 | 3.1 可读 / 3.2 可预测 |
| **R**obust | 健壮 | 4.1 兼容（含 ARIA） |

**三级合规**：**A**（30 条·必须满足）／**AA**（20 条·业界基线）／**AAA**（28 条·增强）

> 企业合规目标多为 WCAG 2.2 Level AA（A + AA 共 50 条 SC）。

<!--
POUR = Perceivable / Operable / Understandstandable / Robust，对应 SC 的四大原则。
-->

---

# WCAG 2.2 新增 9 条 SC

2023-10-05 发布，移除 4.1.1 Parsing

| SC | 名称 | 级别 |
|------|------|------|
| **2.4.11 / 12** | Focus Not Obscured（Min / Enhanced） | **AA** / AAA |
| 2.4.13 | Focus Appearance | AAA |
| 2.5.7 | Dragging Movements | AA |
| **2.5.8** | Target Size（Min 24×24 px） | **AA** |
| 3.2.6 | Consistent Help | A |
| 3.3.7 | Redundant Entry | A |
| **3.3.8 / 9** | Accessible Authentication（Min / Enhanced） | **AA** / AAA |

<!--
WCAG 2.2 是当前生产合规的事实基线；Target Size：2.5.8 (AA) = 24×24 px、2.5.5 (AAA) = 44×44 px；WCAG 3.0 仍是草案不要引用。
-->

---

# 对比度（SC 1.4.3 / 1.4.6 / 1.4.11）

按 WCAG 相对亮度（relative luminance）公式计算

| SC | 级别 | 普通文字 | 大字 | 非文字 UI |
|------|------|------|------|------|
| **1.4.3** | **AA** | **≥ 4.5:1** | **≥ 3:1** | - |
| 1.4.6 | AAA | ≥ 7:1 | ≥ 4.5:1 | - |
| 1.4.11 | AA | - | - | **≥ 3:1** |

**大字定义**：≥ 18pt 或 ≥ 14pt **粗体**

**易踩坑**：品牌主色配白底常不达标；placeholder 常 < 4.5:1 且不能替 `<label>`；非文字 UI（图标/边框）也要 ≥ 3:1

> 别凭肉眼判断，按公式算。

<!--
对比度按相对亮度公式（L1+0.05）/（L2+0.05），不是视觉亮度。
-->

---

# ARIA 第一规则

> **能用原生 HTML 元素时不要用 ARIA 重写。**

**ARIA 三层**

- **roles**（角色）：`role="alert"` / `role="navigation"` / `role="dialog"`
- **states**（状态）：`aria-expanded` / `aria-checked` / `aria-current` / `aria-invalid`
- **properties**（属性）：`aria-label` / `aria-labelledby` / `aria-describedby`

```html
<!-- 错：用 div 重写 button，缺键盘交互 -->
<div role="button" onclick="submit()">提交</div>

<!-- 对：用原生 button，自动有键盘、焦点、disabled -->
<button type="submit">提交</button>
```

> ARIA 是补丁不是替代。原生 `<button>` 自带 Tab、Enter/Space、`disabled`、`role="button"`。

<!--
ARIA 第一规则：HTML 元素自带键盘交互 + 焦点管理 + 隐式角色，自定义重写易漏。
-->

---
layout: two-cols
---

# aria-label vs labelledby

**aria-label**：直接给文本（纯图标按钮）

```html
<button aria-label="关闭">
  <svg aria-hidden="true">...</svg>
</button>
```

**aria-labelledby**：引用页面文本 ID（优先用）

```html
<h2 id="title">用户注册</h2>
<section aria-labelledby="title">
  ...
</section>
```

> 别用 aria-label 覆盖可见文本——语音控制用户混乱。

::right::

# aria-hidden 陷阱

**铁律**：`aria-hidden="true"` 绝不能用在可聚焦元素或其祖先上

```html
<!-- 错：屏幕阅读器看不见但键盘仍能 Tab 进入 -->
<button aria-hidden="true">提交</button>
```

= **焦点黑洞**：焦点跳到无名空间

**正确做法**

- 装饰图标：`<svg aria-hidden="true">`
- 信息图标：`<img alt="警告">`

<!--
aria-hidden 加在可聚焦元素上 = 屏幕阅读器看不见 + 键盘能进 = 焦点黑洞。
-->

---

# role="alert" 与 role="status"

动态内容更新用 live region 通知屏幕阅读器

| role | 隐式 aria-live | 用途 |
|------|------|------|
| `role="alert"` | **assertive** | 紧急错误（立即打断读屏） |
| `role="status"` | **polite** | 普通通知（等读屏空闲） |
| `role="log"` | polite | 日志流 |

**aria-live 默认 off**

```html
<!-- 不写 aria-live = 不通知 -->
<div aria-live="polite" aria-atomic="true">
  购物车已添加 1 件商品
</div>
```

> 反模式：多个 assertive 并存 → 读屏互相打断。

<!--
普通内联验证用 polite，仅紧急错误用 alert（隐式 assertive + atomic）。
-->

---

# 键盘导航三件套

**Tab 顺序**：用 DOM 自然顺序（别用正数 tabindex 重排）

**tabindex 三种用法**

- 不写 —— 默认（button / a / input）
- `tabindex="0"` —— 加入 Tab 序（按 DOM 顺序）
- `tabindex="-1"` —— 可编程 focus 但不在 Tab 序
- 正数 —— **禁用**（强制重排，业界反对）

**`:focus-visible`**（W3C 技法 C45）

```text
/* 错：outline none 后不补替代 */
button { outline: none; }

/* 对：仅键盘显示焦点环 */
button:focus { outline: none; }
button:focus-visible {
  outline: 2px solid #005fcc;
}
```

> SC 2.4.7 Focus Visible (AA) / 2.4.11 Focus Not Obscured (AA)。

<!--
正数 tabindex 是大坑；:focus-visible 仅键盘显示焦点环，鼠标点击不闪。
-->

---

# 跳过链接（skip-link）

对应 SC 2.4.1 Bypass Blocks (A)

```html
<body>
  <a href="#main" class="skip-link">跳到主内容</a>
  <header>...重复的导航...</header>
  <main id="main" tabindex="-1">...</main>
</body>
```

```text
.skip-link {
  position: absolute;
  top: -100px;  /* 默认隐藏 */
}
.skip-link:focus {
  top: 0;       /* :focus 时显现 */
  background: #fff;
  z-index: 1000;
}
```

> 关键：目标 `<main>` 必须设 `tabindex="-1"` 才能真正接收焦点，仅 `scrollIntoView` 不够。

<!--
没有 skip-link，键盘/读屏用户每页都要 Tab 过整段重复导航。
-->

---

# HTML5 landmark 元素

页面骨架——每页都用上

| 元素 | 隐式 role | 说明 |
|------|------|------|
| `<header>` | banner | 顶栏（每页一个） |
| `<nav>` | navigation | 多个时用 `aria-label` 区分 |
| **`<main>`** | **main** | **主内容（每页唯一）** |
| `<aside>` | complementary | 侧边栏 |
| `<footer>` | contentinfo | 页脚（每页一个） |
| `<section>` | region | 需 `aria-label` |
| `<search>` | search | **2023 新元素** |

<!--
反模式：多个 main、多个未命名同名 landmark（如多个 nav）让读屏 landmark 导航失效；section 需命名才进 landmark 导航。
-->

---

# 焦点管理（模态 / SPA）

**模态对话框**

1. 打开时焦点移入第一个可聚焦元素
2. **focus trap**：Tab 在模态内循环
3. 关闭时焦点**回到触发器**
4. Esc 键关闭

```html
<div role="dialog" aria-modal="true" aria-labelledby="t">
  <h2 id="t">确认删除</h2>
  <button>取消</button>
  <button>确认</button>
</div>
```

**SPA 路由切换**

```text
const main = document.querySelector('main');
main.setAttribute('tabindex', '-1');
main.focus();  // 手动聚焦新页面
```

> 否则键盘 / 读屏用户焦点滞留原页，念错内容（SC 2.4.3 Focus Order）。

<!--
模态关闭焦点要回到触发器，不是页面顶部；SPA 路由切换后手动 focus 新 main。
-->

---

# prefers-reduced-motion

对应 SC 2.3.3 Animation from Interactions (AAA) + 2.2.2 Pause Stop Hide (A)

```text
.fade-in { animation: fadeIn 0.5s ease; }

@media (prefers-reduced-motion: reduce) {
  .fade-in { animation: none; }
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

**信息不只靠颜色**（SC 1.4.1 Use of Color）

- 错：错误状态只把边框变红
- 对：颜色 + 图标 + 文字（`aria-invalid="true"` + 错误文本）

> 前庭功能障碍用户对大幅动画可能眩晕；色盲用户无法感知纯颜色差异。

<!--
prefers-reduced-motion 系统级降级；错误提示要颜色 + 图标 + 文字三件套。
-->

---
layout: quote
---

# ARIA 滥用比无 ARIA 更危险

「`aria-hidden` 加在可聚焦元素上 = 焦点黑洞；`role="alert"` 滥用 = 读屏被频繁打断；正数 tabindex 重排 = 维护灾难。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- `<div role="button">` 替 `<button>`（ARIA 第一规则）
- `aria-hidden="true"` 加可聚焦元素（焦点黑洞）
- `outline: none` 后不补替代焦点样式（违反 SC 2.4.7）
- 用 `aria-label` 覆盖可见文本（语音控制混乱）
- 正数 tabindex 重排 Tab 顺序（业界反对）
- 多个未命名同名 landmark（读屏 landmark 导航失效）
- 多个 `aria-live="assertive"` 并存（互相打断）
- 纯颜色编码信息（违反 SC 1.4.1）
- 装饰图标加 alt 文本（噪音干扰读屏）
- placeholder 替代 `<label>`（违反 SC 3.3.2）
- 模态关闭焦点不回触发器（违反 SC 2.4.3）
- WCAG 3.0 用于生产合规（仍是草案）

<!--
ARIA 滥用比不用更糟，先理解规则再用。
-->

---
layout: center
class: text-center
---

# 小结

a11y = 让所有人都能用

WCAG 2.2 · ARIA · 键盘导航 · 语义化 HTML · 对比度

**原生 HTML 优先 · 键盘可达 · 对比度 4.5:1 · aria-live 通知**

[WCAG 2.2 标准](https://www.w3.org/TR/WCAG22/) · [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) · [web.dev Learn Accessibility](https://web.dev/learn/accessibility)

<!--
掌握原生 HTML 优先 + 键盘可达 + 对比度合规 + aria-live，就能落到生产 a11y。
-->
