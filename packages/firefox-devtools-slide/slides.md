---
theme: seriph
background: https://cover.sli.dev
title: Firefox Developer Tools 完全指南
info: |
  Firefox Developer Tools 完全指南：Gecko 引擎内置开发者工具 · CSS 布局 / 可访问性利器

  Learn more at [https://firefox-source-docs.mozilla.org/devtools-user/](https://firefox-source-docs.mozilla.org/devtools-user/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Firefox Developer Tools

Gecko 引擎内置工具 · CSS 布局 / 可访问性利器

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Firefox DevTools 在 CSS 调试和可访问性上提供业界最细致的工具。
-->

---
transition: fade-out
---

# 什么是 Firefox Developer Tools

Mozilla Firefox（**Gecko 引擎**）内置的 Web 开发者工具

- **功能对齐 Chrome**：Inspector / Console / Debugger / Network / Performance
- **CSS 调试最强**：Grid / Flexbox Inspector 可视化叠加业界最佳
- **独家 CSS 工具**：Fonts Editor、Shape Path Editor、Compatibility
- **可访问性王牌**：a11y 树 + 对比度评级 + 色觉障碍模拟
- **独立引擎视角**：非 Chromium，验证跨引擎渲染差异

> 专业前端 Chrome + Firefox 双修，各取所长。

<!--
Firefox 的不可替代价值在 CSS、可访问性和 Gecko 引擎视角。
-->

---

# Chrome vs Firefox：定位差异

| 维度 | Chrome | Firefox |
|------|--------|---------|
| 引擎 | Blink | Gecko |
| 性能剖析 | ★★★ Insights/CWV | ★★ Profiler |
| AI 集成 | ✅ Gemini | — |
| CSS 布局 | ★★ | ★★★ Grid/Flex |
| 可访问性 | ★★ | ★★★ 色觉模拟 |
| 独家 CSS | — | Fonts/Shape/Compat |

> Chrome 强在性能与 AI，Firefox 强在 CSS 与 a11y。

<!--
两者不是替代关系，而是互补。
-->

---

# 面板总览

| 面板 | 用途 |
|------|------|
| **Inspector** | HTML/CSS、Grid/Flex 可视化 |
| **Console** | 日志、运行 JS |
| **Debugger** | 源码、断点调试 |
| **Network** | 请求分析、Edit and Resend |
| **Performance / Memory** | Profiler / 堆快照 |
| **Storage** | Cookie / 存储 / SW |
| **Accessibility** | a11y 树 / 对比度 / 色觉模拟 |

<!--
面板与 Chrome 大体对应，Accessibility 是独立一级面板。
-->

---

# Inspector：三栏布局

| 区域 | 内容 |
|------|------|
| **HTML 树** | DOM 结构，双击编辑 |
| **Rules** | 匹配的 CSS，实时编辑 |
| **Layout / Computed** | 布局叠加、盒模型、计算值 |

- 实时编辑、强制伪类 `:hov`、增删 class —— 同 Chrome
- 工具栏 **Eyedropper** 吸取页面任意颜色
- 差异在于布局可视化更强

<!--
Inspector 是 Firefox CSS 调试的主场。
-->

---

# Grid Inspector（业界最佳）

元素 `display:grid` 时点 **`grid` 徽章**叠加

- **网格线编号**：每条行 / 列线标号
- **轨道尺寸**：显式 / 隐式尺寸
- **命名区域**：`grid-template-areas` 区域名标出
- **多网格**：同时叠加，各配颜色
- Layout 面板开关：行号 / 区域名 / 无限延长线

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

<!--
Grid 叠加是 Firefox 最受推崇的功能。
-->

---

# Flexbox Inspector

元素 `display:flex` 时点 **`flex` 徽章**叠加

- 高亮 flex 容器与各 item 边界
- 标出**主轴 / 交叉轴**方向
- 点单个 item 看尺寸如何由
  `flex-basis` / `grow` / `shrink` 计算
- 图解「最小 → 基础 → 最终」尺寸

> 「为什么这个子项是这个宽度」——图解直接回答。

<!--
Flexbox Inspector 用图解解释 flex 尺寸计算。
-->

---

# Fonts Editor：可变字体

Inspector → **Fonts** 标签

- 列出页面 / 元素**实际应用的所有字体**
- 对**可变字体**提供轴值滑块：
  - `wght`（字重）/ `wdth`（字宽）/ `slnt`（倾斜）/ 自定义轴
- 拖滑块实时预览，找到数值再写回

```css
h1 {
  font-variation-settings: "wght" 720, "wdth" 85;
}
```

<!--
调可变字体比盲写数值高效得多。
-->

---

# Shape Path Editor：形状可视化

`clip-path` / `shape-outside` 难以盲调

Rules 里属性值旁的**形状图标**，点击后在页面：

- **polygon**：拖拽各顶点
- **circle**：拖半径与圆心
- **ellipse**：拖两个半径

```css
.clipped {
  clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%);
}
```

> Chrome 没有的可视化能力，做异形裁切利器。

<!--
Shape Path Editor 是 Firefox 独家 CSS 工具。
-->

---

# Changes 面板

Inspector → **Changes** 标签

- 记录本会话改过的**所有 CSS**（增 / 改 / 删）
- 以 diff 形式展示
- 一键**复制**改动

> 调样式调到满意后，把 Changes 复制回源码，不必凭记忆重敲。

<!--
Changes 解决「调完忘了改了啥」的痛点。
-->

---

# Compatibility 面板

Inspector → **Compatibility** 标签

- 标注当前 CSS 属性的**跨浏览器兼容问题**（基于 MDN 数据）
- Settings 配置关心的目标浏览器
- 用实验性 / 前缀属性时直接提示风险

> 不必频繁查 caniuse——兼容性检查内置进调试流程。

<!--
Compatibility 把兼容性检查带进了 DevTools。
-->

---

# Accessibility：a11y 树

DevTools → **Accessibility** 面板

辅助技术（屏幕阅读器）实际感知的语义树：

- **Role**：角色（button / heading / link）
- **Name**：可访问名称（aria-label / 文本 / alt）
- **State**：状态（focused / checked / disabled）

> 验证「这个 div 当按钮用，但角色不是 button」之类问题。

<!--
a11y 树展示辅助技术看到的页面语义。
-->

---

# Accessibility：对比度评级

选含文本的元素，显示对比度比值并标注

- 是否通过 **WCAG AA**（正文 4.5:1 / 大字 3:1）
- 是否通过 **WCAG AAA**（更严格）

<br>

> Firefox 把对比度整合进可访问性检查流程，配合色觉模拟一起用。

<!--
对比度评级帮助保证文本可读性。
-->

---

# Accessibility：色觉障碍模拟

模拟不同色觉缺陷下页面的样子

| 模拟 | 对应 |
|------|------|
| Protanopia | 红色盲 |
| Deuteranopia | 绿色盲 |
| Tritanopia | 蓝色盲 |
| Achromatopsia | 全色盲 |
| Contrast loss | 对比度损失 |

> 「红=错、绿=对」仅靠颜色？色盲用户无法分辨。

<!--
色觉模拟发现「仅靠颜色传达信息」的问题。
-->

---

# Check for issues（自动检查）

Accessibility 面板顶部下拉自动扫描

- **Contrast**：对比度不足的文本
- **Keyboard**：键盘可达性问题
- **Text labels**：缺可访问名称的表单 / 控件

> 手动查细节 + 自动扫一遍，开发时随手验证可访问性。

<!--
注意：可纳入 CI 的自动化 a11y 测试（axe）属「前端测试」专题。
-->

---

# Web Console

与 Chrome 高度一致

- 工具函数：`$0`、`$(sel)` / `$$(sel)`、`copy(obj)`、`clear()`
- **多行编辑器模式**：左侧像编辑器写多行，`Cmd/Ctrl+Enter` 运行
- console API：`table` / `group` / `time` / `count` / `dir`

```js
const items = $$(".item");
console.table(items.map((el) => ({ text: el.textContent })));
```

<!--
Console 通用功能与 Chrome 几乎无切换成本。
-->

---

# Debugger：断点调试

对应 Chrome 的 Sources

- **断点**：行 / 条件 / Logpoint；DOM / Event / XHR 断点
- **单步**：`F8` 继续 / `F10` 跨过 / `F11` 步入 / `Shift+F11` 步出
- **Pretty print**：`{ }` 格式化压缩代码
- **Blackbox**：跳过第三方栈帧
- **Outline**：函数大纲快速跳转

> 断点体系与 Chrome 基本对等。

<!--
日常断点调试在两家浏览器间几乎无差异。
-->

---

# Network：Edit and Resend

请求分析 + Firefox 实用差异

- 标签：Headers / Cookies / Request / Response / Timing
- **Edit and Resend**：右键改 URL / 头 / 体后**重新发送**
- **Block**：右键 Block URL，模拟资源加载失败
- 限速下拉模拟弱网；HAR 导入导出

> Edit and Resend 让你不写代码就反复试同一接口的不同入参。

<!--
Edit and Resend 是调试接口的利器。
-->

---

# Storage 与 Performance

**Storage**（对应 Chrome Application）

- Cookies / Local / Session / IndexedDB / Cache / Service Workers

**Performance**（Firefox Profiler）

- 调用树 + 火焰图 + 栈图
- 可生成**可分享的在线 profile 链接**
- JS 剖析够用，综合性能体验仍推荐 Chrome

<!--
Storage 管存储，Performance 用 Firefox Profiler 分析 JS 热点。
-->

---

# 响应式与 Developer Edition

**响应式设计模式** `Cmd+Opt+M` / `Ctrl+Shift+M`

- 机型 / 尺寸 / DPR / 方向 / 限速 / 触摸模拟
- 近似模拟，iOS WebKit 真机仍需 Safari

**Firefox Developer Edition**

- 实验 DevTools 功能**默认开启** + 暗色主题
- 与稳定版同源，普通版手动开即可

<!--
Developer Edition 方便但非必须，普通 Firefox 够用。
-->

---

# Firefox 独家 / 领先功能速查

| 功能 | 用途 |
|------|------|
| Grid Inspector | 网格线 / 轨道 / 区域可视化 |
| Flexbox Inspector | flex item 尺寸图解 |
| Fonts Editor | 可变字体轴滑块 |
| Shape Path Editor | clip-path 可视化 |
| Changes | 追踪导出 CSS 改动 |
| Compatibility | CSS 兼容标注 |
| Accessibility | 色觉模拟 + 对比度 |

<!--
这些是选择 Firefox 调试的核心理由。
-->

---
layout: center
class: text-center
---

# 小结

Firefox DevTools = CSS 布局 + 可访问性 + 跨引擎视角

Grid/Flex 可视化最佳 · 可变字体/形状编辑 · 色觉模拟

**通用调试对等 Chrome，独家价值在 CSS 与 a11y**

[用户文档](https://firefox-source-docs.mozilla.org/devtools-user/) · [Accessibility Inspector](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)

<!--
把 Firefox 与 Chrome 配合使用，CSS 调试和可访问性检查事半功倍。
-->
