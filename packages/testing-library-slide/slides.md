---
theme: seriph
background: https://cover.sli.dev
title: Testing Library
info: |
  Presentation Testing Library for developers.

  Learn more at [https://testing-library.com/](https://testing-library.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <span class="text-8xl">🧪</span>
</div>

<br/>

## Testing Library：用户中心的组件测试

语义查询 · 真实交互 · 远离实现细节（基于 @testing-library/vue v8 + user-event v14）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Testing Library —— 用户中心的组件测试方案。

它的核心理念是「测试越像软件实际被使用的方式，越能给你信心」。用语义化查询操作 DOM，用 user-event 模拟完整交互，彻底远离组件内部的 state / 方法 / 生命周期。
-->

---
transition: fade-out
---

# 为什么需要 Testing Library？

测实现 vs 测行为

<v-click>

**传统测法（测实现细节）**

```ts
const wrapper = mount(Button)
expect(wrapper.vm.isLoading).toBe(false)      // 访问内部 state
expect(wrapper.find('.btn--primary').exists()) // 依赖 CSS 类名
```

</v-click>

<v-click>

**Testing Library 测法（测用户行为）**

```ts
render(Button)
await user.click(screen.getByRole("button", { name: "提交" }))
expect(screen.getByText("提交成功")).toBeInTheDocument()
```

</v-click>

<v-click>

- 重构 CSS 类名 / 内部 state → 行为测试**不碎**
- 查询基于无障碍语义，倒逼写出可访问性更好的 HTML
- 跨框架（React / Vue / Svelte）共享同一套查询哲学

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 传统测法直接访问 vm.isLoading 或者 .btn--primary 这样的 CSS 类——这些都是实现细节。只要重构内部逻辑，测试就碎了，即使功能完全没变。

[click] Testing Library 的测法：定位"提交"按钮（按角色 + 名称），点击，看用户能否看到"提交成功"。这就是用户真正关心的。

[click] 好处三条：测试稳定、HTML 可访问性提升、跨框架一致。
-->

---
transition: fade-out
---

# 核心哲学

> The more your tests resemble the way your software is used, the more confidence they can give you.

<v-click>

**五条原则**

- **操作 DOM，而非组件实例**：通过 DOM 节点交互，不访问 `vm` / `props`
- **用角色 + 名称定位**：`getByRole("button", { name: "提交" })` 而非 CSS 选择器
- **模拟真实用户**：`user.click()` 触发完整事件序列，不是单个 DOM 事件
- **语义断言**：`toBeInTheDocument()` / `toBeVisible()` 而非 `toBe(true)`
- **不测实现**：state / 方法 / 生命周期是组件私事，不该进测试

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这句话是 Kent C. Dodds 写的，是 Testing Library 的立身之本。

[click] 五条原则一句话：站在用户视角写测试。DOM 节点是用户能看到、能操作的，组件实例是内部细节。如果查询找不到元素，往往说明 UI 对用户不可访问，这本身就是一个信号。
-->

---
transition: fade-out
---

# 安装

三包一配置

<v-click>

```bash
pnpm add -D @testing-library/vue @testing-library/user-event @testing-library/jest-dom
```

</v-click>

<v-click>

在 Vitest setup 文件引入 jest-dom 断言扩展：

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
})

// vitest.setup.ts
import "@testing-library/jest-dom/vitest"
```

</v-click>

<v-click>

- `@testing-library/vue`：核心，提供 `render` + `screen`
- `@testing-library/user-event`：高层交互模拟
- `@testing-library/jest-dom`：语义化断言扩展（`toBeInTheDocument` 等）

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个包配合使用：vue 负责渲染，user-event 负责交互，jest-dom 负责断言。

[click] setupFiles 是关键：把 jest-dom 放进去后，所有测试文件自动有 toBeInTheDocument 等断言，不用每个文件单独 import。
注意 import 路径是 /vitest，不是裸的 @testing-library/jest-dom。

[click] 三包职责分工清晰，缺一不可。
-->

---
transition: fade-out
---

# 第一个测试

render + screen + user-event

<v-click>

```ts
import { render, screen } from "@testing-library/vue"
import userEvent from "@testing-library/user-event"
import MyButton from "./MyButton.vue"

test("点击按钮后显示成功", async () => {
  const user = userEvent.setup()   // v14：render 前 setup
  render(MyButton)
  // 用「角色 + 名称」定位——最推荐的方式
  await user.click(screen.getByRole("button", { name: /提交/i }))
  expect(screen.getByText("提交成功")).toBeInTheDocument()
})
```

</v-click>

<v-click>

三步走：**setup → render → 操作 + 断言**

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 完整的第一个测试。几个关键点：
- userEvent.setup() 在 render 之前调用，共享输入设备状态
- screen 是全局对象，推荐用它查询而不是解构 render 的返回值
- getByRole("button", { name: /提交/i }) 是最推荐的定位方式，正则忽略大小写
- 所有交互都要 await

[click] 记住三步：先 setup，再 render，最后操作 + 断言。
-->

---
transition: fade-out
---

# render 与 screen

挂载 + 全局查询对象

<v-click>

```ts
render(MyComponent, {
  props: { msg: "hi", count: 3 },
  global: {
    plugins: [pinia, router], // 注入依赖
    stubs: { BaseIcon: true },
  },
})
```

</v-click>

<v-click>

`render` 返回值：`debug()`（打印 DOM）/ `rerender(props)` / `unmount()`

</v-click>

<v-click>

`screen` 绑定到 `document.body`，所有 `getBy*` 在 body 范围内搜索。

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] render 的第二参数是配置对象。global.plugins 与 Vue Test Utils 完全一致，可以直接传 pinia、router 实例。

[click] render 的返回值平时不常用，但调试时 debug() 非常好用——直接把当前 DOM 打印出来，方便确认元素结构。

[click] screen 用全局变量而不是解构返回值的好处是：import 时就能看出来用了哪些查询，且不需要每次都从 render 解构。
-->

---
transition: fade-out
---

# 查询优先级金字塔

越高级越语义，越贴近用户

<v-click>

| 级别 | 查询 | 适用场景 |
| ---- | ---- | -------- |
| 1 | `getByRole` | 几乎一切：按钮、输入框、标题、链接 |
| 2 | `getByLabelText` | 表单字段（最贴近填表行为） |
| 3 | `getByPlaceholderText` | 无 label 时用 placeholder |
| 4 | `getByText` | 非交互元素（div/span/p）的文本 |
| 5–6 | `getByAltText` / `getByTitle` | img alt / title 属性 |
| 7 | `getByTestId` | 无法语义匹配时的兜底 |

</v-click>

<v-click>

优先级越高越能反映用户真实体验；`getByRole` 基于 ARIA 无障碍树——查不到往往说明 UI 本身不可访问。

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这个优先级不是随意的，是按"这个查询能反映多少真实用户体验"排的。getByRole 基于 ARIA 无障碍树，用它不仅让测试更稳定，还在倒逼你写语义化 HTML。getByTestId 和用户体验无关，仅作最后兜底。

[click] 实践原则：从顶往下找，第一个能用的就用它，不要跳过高优先级去用低优先级。
-->

---
transition: fade-out
---

# getByRole 细节

role + name 定位一切

<v-click>

```ts
screen.getByRole("button", { name: "提交" })
screen.getByRole("button", { name: /取消/i })  // 正则匹配
screen.getByRole("heading", { level: 2 })       // h2 标题
screen.getByRole("tab", { selected: true })     // aria-selected
```

</v-click>

<v-click>

常见隐式 role：`button` / `link` / `textbox` / `checkbox` / `heading`（带 level）；`<input type="password">` 无隐式 role，用 `getByLabelText`。

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] getByRole 第二参数 name 匹配"可访问名称"——可以是按钮文本、aria-label、aria-labelledby 指向的文本，正则是最宽松的写法，推荐在有中英文混排时用 /i 忽略大小写。

[click] password input 没有隐式 role 是一个常见绊脚石。遇到这种情况改用 getByLabelText("密码") 就可以了。
-->

---
transition: fade-out
---

# 查询变体：getBy / queryBy / findBy

按"是否存在 + 是否异步"三选一

<v-click>

| 变体 | 0 个匹配 | 多个匹配 | 异步重试 |
| ---- | -------- | -------- | -------- |
| `getBy` | **抛错** | 抛错 | 否 |
| `queryBy` | **返 null** | 抛错 | 否 |
| `findBy` | 抛错（超时后）| 抛错 | **是** |

</v-click>

<v-click>

```ts
// getBy：元素必须存在（最常用）
screen.getByRole("button", { name: "提交" })
// queryBy：断言「不存在」专用
expect(screen.queryByText("错误信息")).not.toBeInTheDocument()
// findBy：等待异步出现（默认超时 1000ms）
const msg = await screen.findByText("加载完成")
// 多个元素：getAllBy / queryAllBy / findAllBy（返回数组）
expect(screen.getAllByRole("listitem")).toHaveLength(3)
```

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三种变体选哪个取决于两个问题：1. 元素是否一定存在？2. 是否需要等待异步？

[click] 最易踩的坑：断言"元素不存在"时必须用 queryBy，因为 getBy 找不到直接抛错，测试会因为抛错而失败，而不是因为断言失败。findBy 在有 API 请求时非常好用，帮你等到元素出现再继续。
-->

---
transition: fade-out
---

# user-event vs fireEvent

真实交互 vs 单事件派发

<v-click>

| 维度 | `fireEvent` | `user-event` |
| ---- | ----------- | ------------ |
| 点击 | 只派发 `click` | pointer→mousedown→mouseup→click 全序列 |
| 输入 | 只派发 `input/change` | 获焦 → 逐字符 keydown/input/keyup |
| 可见性 | 无检查 | **有**：隐藏 / disabled 不可操作 |
| 推荐 | 边缘兜底 | **日常首选** |

</v-click>

<v-click>

**Vue 里的 fireEvent 是异步的**

```ts
await fireEvent.click(button)
await fireEvent.update(input, "Alice") // v-model 专用
```

Testing Library 把 fireEvent 包了一层 `nextTick`，务必 `await`。

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] user-event 与 fireEvent 最大的区别是"模拟深度"。fireEvent 是最底层的单事件派发；user-event 模拟完整交互序列，包含 pointer 事件、焦点变化、可见性检查。用 user-event 会发现更多真实问题。

[click] Vue 里有一个特殊点：Testing Library 把 fireEvent 重导出时包了 nextTick，所以即使用 fireEvent 也必须 await。v-model 更新用 fireEvent.update 比较顺手，它会同时触发 input 和 change 事件。
-->

---
transition: fade-out
---

# user-event setup 与常用方法

v14 推荐先 setup 再 render

<v-click>

```ts
import userEvent from "@testing-library/user-event"

const user = userEvent.setup()  // 在 render 之前
render(MyForm)
```

</v-click>

<v-click>

```ts
// 点击 / 双击
await user.click(screen.getByRole("button"))
await user.dblClick(el)
// 输入（自动点击获焦 → 逐字符键入）
await user.type(screen.getByLabelText("用户名"), "Alice")
await user.clear(input)              // 全选 → 删除
// 下拉选择
await user.selectOptions(screen.getByRole("listbox"), ["选项A"])
// 文件上传
const file = new File(["内容"], "a.png", { type: "image/png" })
await user.upload(screen.getByLabelText(/上传/i), file)
```

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v14 的 setup() 模式让同一个 user 实例共享"输入设备状态"——比如按住 Shift 时所有后续操作都在 Shift 状态下。所以 setup 要在 render 之前调用。

[click] 所有方法都要 await。type 内部先点击获焦再逐字符键入，所以不需要手动先 click 再 type。clear 做的是"全选 + 删除"，比 type 到空更贴近真实用户行为。
-->

---
transition: fade-out
---

# 键盘记号系统

`user.keyboard()` 做纯键盘操作

<v-click>

```ts
await user.keyboard("hello")           // 逐字母键入
await user.keyboard("{Enter}")         // 特殊键用 {Key}
await user.keyboard("{Backspace}{Tab}")

// 组合键：{Key>} 按住不放，{/Key} 抬起
await user.keyboard("{Shift>}A{/Shift}")    // Shift+A → 大写 A
await user.keyboard("{Control>}a{/Control}") // Ctrl+A 全选
await user.keyboard("{Control>}c{/Control}") // Ctrl+C 复制
```

</v-click>

<v-click>

**`type` vs `keyboard`**

- `user.type(el, "文本")`：先定位元素再键入，适合"在某输入框里输入"
- `user.keyboard("记号")`：纯键盘序列，不依赖焦点，适合测快捷键 / Tab 导航

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 键盘记号系统：普通字符直接写，特殊键用花括号包起来。组合键用 > 表示按住、/键名 表示抬起，这样可以精确控制按下和释放的时序。

[click] type 和 keyboard 的区别要记清楚。测输入框填值用 type；测全局快捷键、Tab 导航、Modal 用 Escape 关闭等场景用 keyboard。
-->

---
transition: fade-out
---

# 异步（一）：findBy 与 waitFor

等元素出现 · 等断言通过

<v-click>

**findBy：等待异步元素出现**

```ts
// findBy = getBy + waitFor，默认超时 1000ms、每 50ms 轮询
const msg = await screen.findByText("加载完成")
const items = await screen.findAllByRole("listitem")
await screen.findByText("慢加载", {}, { timeout: 3000 }) // 自定义超时
```

</v-click>

<v-click>

**waitFor：等断言通过**

```ts
import { waitFor } from "@testing-library/vue"

// 回调里的断言抛出错误才重试（返回 falsy 不够）
await waitFor(() => {
  expect(screen.getByText("异步内容")).toBeInTheDocument()
})
await waitFor(
  () => expect(mockApi).toHaveBeenCalledTimes(1),
  { timeout: 2000, interval: 100 }
)
```

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] findBy 是最常用的异步查询：内置了 waitFor 逻辑，等到元素出现或超时抛错。适合"点击后出现的弹窗"、"API 响应后渲染的列表"场景。

[click] waitFor 更灵活：可以等任意断言通过。关键是回调里必须用 expect 断言，断言失败（抛错）才会触发重试，返回 false 不会重试。
-->

---
transition: fade-out
---

# 异步（二）：waitForElementToBeRemoved

等元素消失

<v-click>

```ts
import { waitForElementToBeRemoved } from "@testing-library/vue"

// 等"加载中"消失（元素必须先存在！）
await waitForElementToBeRemoved(
  () => screen.queryByText("加载中...")
)
```

</v-click>

<v-click>

```ts
// 实际场景：等 loading 消失后断言列表
render(AsyncList)
await waitForElementToBeRemoved(
  () => screen.queryByRole("progressbar")
)
expect(screen.getAllByRole("listitem")).toHaveLength(5)
```

</v-click>

<v-click>

**注意**：传 callback（`() => queryByText(...)`）而非直接传元素——避免同步查询在元素已消失时抛错。

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] waitForElementToBeRemoved 测"loading 消失"这类场景非常直观。但有一个前提：被等待的元素必须在调用时就存在，否则立即报错。

[click] 传 callback 是必须的。如果直接传 screen.queryByText("加载中...") 的结果（一个 DOM 节点），元素消失后节点是 null，会出现意外行为。传 callback 让它每次重新查询。
-->

---
transition: fade-out
---

# jest-dom 断言扩展

语义化断言，让失败信息更好读

<v-click>

| matcher | 说明 |
| ------- | ---- |
| `toBeInTheDocument()` | 元素在文档中 |
| `toBeVisible()` | 元素可见（display/visibility/opacity 全检） |
| `toBeDisabled()` / `toBeEnabled()` | 表单元素禁用 / 可用 |
| `toHaveValue(v)` | input / select / textarea 的当前值 |
| `toHaveTextContent(t)` | 文本内容（支持正则） |
| `toHaveAttribute(a, v?)` | 含某属性（可选值） |
| `toBeChecked()` | checkbox / radio 选中 |

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
jest-dom 扩展的语义化断言让测试代码几乎像英语一句话，失败信息也更友好。

toBeVisible 会检查 display、visibility、opacity 以及所有祖先元素，比 toBeInTheDocument 更严格。toHaveValue 适合断言输入框的值，记得 type 之后再断言。
-->

---
transition: fade-out
---

# jest-dom 实战

综合示例

<v-click>

```ts
test("表单交互状态", async () => {
  const user = userEvent.setup()
  render(LoginForm)
  const btn = screen.getByRole("button", { name: "登录" })
  const input = screen.getByLabelText("用户名")
  expect(btn).toBeDisabled()             // 初始禁用
  expect(screen.queryByText("错误")).not.toBeInTheDocument()
  await user.type(input, "Alice")
  expect(input).toHaveValue("Alice")
  expect(btn).toBeEnabled()              // 有值后可用
})
```

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
一个完整的表单测试示例，串起了我们讲过的所有知识：
- userEvent.setup 在 render 前
- getByRole 定位按钮，getByLabelText 定位输入框
- 初始状态用 toBeDisabled 和 not.toBeInTheDocument
- user.type 后用 toHaveValue 和 toBeEnabled 断言状态变化

这就是 Testing Library 的标准写法。
-->

---
transition: fade-out
---

# 与 VTU 的边界

注入依赖 · 何时用哪个

<v-click>

```ts
render(App, {
  global: { plugins: [createPinia(), router] },
})
// 路由初始导航是异步的，用 findBy 等待
expect(await screen.findByText("首页内容")).toBeInTheDocument()
```

</v-click>

<v-click>

| 维度 | Testing Library | Vue Test Utils |
| ---- | --------------- | -------------- |
| 哲学 | 用户中心、操作 DOM | 组件中心、访问内部 |
| 查询 | 语义（role/label） | CSS 选择器、组件引用 |
| 内部访问 | **主动隐藏** vm/props | `wrapper.vm` / `emitted()` |
| 适合 | 集成 / 行为测试 | 单元 / 契约测试 |

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] render 的 global 选项与 Vue Test Utils 完全一致。注入 Pinia 和 Router 后，路由初始导航是异步的，用 findBy 等待渲染完成。

[click] TL 和 VTU 不是竞争关系，而是互补。TL 主动屏蔽 vm/props，强迫你从用户视角测试；VTU 把内部全暴露出来，适合验证 emits/props 契约。同一项目可以混用。
-->

---
transition: fade-out
---

# 互补使用

TL + VTU 各司其职

<v-click>

```ts
// 验证用户行为 → Testing Library
test("点击提交后显示成功", async () => {
  const user = userEvent.setup()
  render(Form)
  await user.click(screen.getByRole("button", { name: "提交" }))
  expect(screen.getByText("成功")).toBeInTheDocument()
})
```

</v-click>

<v-click>

```ts
// 验证组件契约（emitted 事件）→ Vue Test Utils
import { mount } from "@vue/test-utils"
test("emit submit 带正确 payload", async () => {
  const wrapper = mount(Form)
  await wrapper.find("button").trigger("click")
  expect(wrapper.emitted("submit")?.[0]).toEqual([{ username: "" }])
})
```

</v-click>

<v-click>

**选择原则**：关注"用户能否完成操作"用 TL；关注"组件 props/emits 契约"用 VTU。

</v-click>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] TL 测用户能不能完成"提交"这个操作，断言的是用户能看到什么。

[click] VTU 测组件接口：emitted("submit") 的 payload 是不是正确的，这是组件契约层面的验证，TL 主动屏蔽了这类内部细节，所以这里用 VTU。

[click] 一句话总结：用哪个工具取决于你关心的是用户视角还是组件契约视角。二者在同一项目里共存很正常。
-->

---
layout: intro
transition: fade-out
---

# 总结

Testing Library = 用户视角 + 语义查询 + 真实交互

<v-click>

- **核心哲学**：测用户能看到什么、能做什么，不测组件内部 state / 方法
- **查询优先级**：`getByRole` > `getByLabelText` > `getByText` > `getByTestId`（`queryBy` 断不存在 / `findBy` 等异步）
- **user-event**：`setup()` + `await user.click/type/keyboard`，模拟完整交互序列比 `fireEvent` 更真实
- **异步**：`findBy` / `waitFor` / `waitForElementToBeRemoved` 三招覆盖全部场景
- **jest-dom**：`toBeInTheDocument` / `toHaveValue` / `toBeDisabled` 等语义断言
- **TL + VTU**：行为测试用 TL，组件契约（emits/props/slots）用 VTU，二者互补

</v-click>

<div class="abs-br m-6 text-xl">
  <a href="https://testing-library.com/docs/vue-testing-library/intro/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/testing-library/vue-testing-library" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/testing/component-testing/testing-library/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #E44F26;
  background-image: linear-gradient(45deg, #E44F26 10%, #F16529 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
七条总结覆盖了整个 Testing Library 的精华。

从哲学到查询、交互、异步、断言，最后到与 VTU 的协作——这就是一套完整的用户中心测试思路。记住：测试不是为了覆盖率数字，而是为了有信心地重构和发布。
-->

---
layout: end
---
