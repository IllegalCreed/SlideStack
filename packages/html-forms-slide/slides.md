---
theme: seriph
background: https://cover.sli.dev
title: HTML 表单与约束校验
info: |
  HTML 表单 —— 提交机制、input 全谱、可访问关联、约束校验与移动端
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:html-5 class="text-8xl" />
</div>

<br/>

## HTML 表单与约束校验

采集用户数据的主战场：提交、控件、校验、移动端（基于 HTML Living Standard）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
表单是 Web 上「用户给服务器递数据」唯一的原生机制。看懂它，要分四块：数据怎么递、用什么控件接、怎么让它无障碍、怎么在提交前拦住错误。
-->

---
transition: fade-out
---

# 这一章讲什么

表单是浏览器原生的「数据采集器」，四块拼图

<v-click>

- **怎么递**：`action` / `method` / `enctype` 决定数据去哪、怎么打包
- **用什么接**：`<input>` 22 种类型 + `<select>` / `<textarea>`
- **怎么无障碍**：每个控件配 `<label>`，分组用 `<fieldset>`
- **怎么拦错**：约束校验 + Constraint Validation API

</v-click>

<v-click>

> 一条贯穿全章的铁律：**客户端校验只为体验，服务器端必须再校验一次**——前端能被绕过。

</v-click>

---
layout: section
---

# 一、表单提交机制

数据去哪、怎么去、什么会被交

---

# `<form>` 与 `name`：数据怎么递

```html
<form action="/signup" method="post">
  <input type="text" name="username" />
  <!-- 提交时发送 username=用户填的值 -->
</form>
```

| 属性 | 作用 |
| --- | --- |
| `action` | 数据提交到的 URL（省略=当前页） |
| `method` | HTTP 方法：`get` / `post` / `dialog` |
| `enctype` | 数据编码方式（仅 `post` 有意义） |
| `target` / `novalidate` | 响应打开位置 / 跳过校验 |

<v-click>

> 提交收集每个控件的 `name=value` 对——**没 `name` 不参与提交**（后端收不到数据的头号原因）。

</v-click>

---

# GET vs POST：怎么选

```html
<form action="/search" method="get"></form>
<form action="/login" method="post"></form>
```

| 维度 | `get` | `post` |
| --- | --- | --- |
| 数据位置 | 拼进 URL 查询串 | 放进请求体 |
| 可见 / 收藏 | 出现在地址栏 | URL 不暴露数据 |
| 数据量 | 受 URL 长度限制 | 基本不受限 |
| 适用 | 搜索、筛选、分页 | 登录、下单、上传 |

<v-click>

::: warning 敏感数据绝不要用 GET
密码、令牌用 `get` 会原样出现在地址栏、历史、日志、`Referer`。涉及敏感或有副作用一律 `post`。
:::

</v-click>

---

# `enctype` 与文件上传三连

```html
<form action="/upload" method="post"
      enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/*" />
</form>
```

| `enctype` | 何时用 |
| --- | --- |
| `application/x-www-form-urlencoded` | **默认**，纯文本字段 |
| `multipart/form-data` | **文件上传必用** |
| `text/plain` | 仅调试 |

<v-click>

文件上传三者缺一不可：`post` + `multipart/form-data` + `<input type="file">`。漏 `enctype` → 后端只收到文件名。

</v-click>

---

# 什么不会被提交

<v-click>

- **没 `name`** 的控件：完全不参与
- **`disabled`** 的控件：不提交（含被禁用 `<fieldset>` 内的全部）
- **未选中**的 `checkbox` / `radio`：只交选中项
- **`<output>`**：只展示，不进数据集

</v-click>

<v-click>

::: tip 想展示却仍提交？
用 `readonly` 而非 `disabled`——`readonly` 外观正常、可复制、**照常提交**。`method="dialog"`（在 `<dialog>` 内）则只关弹窗、不发数据。
:::

</v-click>

---

# 单按钮覆盖 + 无刷新提交

```html
<button type="submit" formaction="/publish"
        formnovalidate>直接发布</button>
```

按钮上的 `formaction` / `formmethod` / `formenctype` / `formtarget` / `formnovalidate` 覆盖 `<form>` 对应设置。

<v-click>

```js
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form); // 按 name 收集，含文件
  await fetch(form.action, { method: "post", body: data });
});
```

⚠️ 传 `FormData` 时浏览器自动设 multipart 边界，**别手动设 `Content-Type`**。

</v-click>

---
layout: section
---

# 二、`input` 类型全谱

同一标签，靠 `type` 切出 22 种控件

---

# `type` 决定一切

```html
<input type="email" />  <!-- 不写 type 默认是 text -->
```

<v-click>

`type` 同时决定三件事：

- **渲染成什么 UI**
- **做什么校验**
- **移动端唤起哪种虚拟键盘**

</v-click>

<v-click>

> 选对 `type`，就同时拿到了合适的外观、内置校验和移动端键盘。

</v-click>

---

# 文本输入族

| `type` | 特点 |
| --- | --- |
| `text` | 单行纯文本（默认），无特殊校验 |
| `search` | 搜索框，部分浏览器带清除按钮 |
| `url` | 校验合法绝对 URL；URL 键盘 |
| `email` | 校验邮箱格式；`@` 键盘；`multiple` |
| `tel` | **不校验格式**；拨号键盘 |
| `password` | 输入以圆点遮蔽 |

<v-click>

`tel` 因各国号码格式差异太大不做校验，需要时自己加 `pattern="1[3-9]\d{9}"`。

</v-click>

---

# 数字与范围族

```html
<input type="number" name="age" min="0" max="120" step="1" />
<input type="range" name="vol" min="0" max="100" value="50" />
```

<v-click>

- `min` / `max` 越界触发校验失败；`step` 定粒度（`step="any"` 取消）
- `number` 适合「精确输入数值」，`range` 适合「只关心大致比例」

</v-click>

<v-click>

::: warning number ≠ 只能输数字
卡号、邮编、手机号「由数字组成却不参与运算」**别用 `number`**（前导零丢失、可输 `e`/`+`/`-`）→ 用 `text` + `inputmode="numeric"` + `pattern`。
:::

</v-click>

---

# 日期与时间族

浏览器提供原生日历 / 时钟选择器：

| `type` | 提交格式示例 |
| --- | --- |
| `date` | `2026-06-24` |
| `time` | `14:30` |
| `datetime-local` | `2026-06-24T14:30` |
| `month` | `2026-06` |
| `week` | `2026-W26` |

<v-click>

同样支持 `min` / `max`（限范围）和 `step`（`time` 用 `step="900"` 表示 15 分钟一档）。

</v-click>

---

# 选择、特殊与 hidden

```html
<input type="checkbox" name="hobby" value="reading" />
<input type="radio" name="gender" value="male" />
<input type="color" value="#0d6efd" />
<input type="file" accept=".pdf" multiple />
<input type="hidden" name="userId" value="42" />
```

<v-click>

- `radio` 凭**相同 `name`** 互斥；`checkbox` **务必写 `value`**（否则交无意义的 `on`）
- `file`：`accept` 限类型、`multiple` 多选；`hidden`：不可见但照常提交（CSRF 令牌、ID）

</v-click>

---

# disabled vs readonly

| | `disabled` | `readonly` |
| --- | --- | --- |
| 外观 | 灰显 | 正常 |
| 可聚焦 | 否 | 是（可复制） |
| 是否提交 | **不提交** | **照常提交** |

<v-click>

::: tip 怎么选
「想展示一个不可改、但要随表单一起交回」的值 → 用 `readonly`。现代按钮更推荐 `<button>` 而非 `<input type="submit">`。
:::

</v-click>

---
layout: section
---

# 三、label / fieldset 可访问关联

每个控件都必须有名字

---

# `<label>`：两种关联方式

```html
<!-- 显式（首选）：for 指向控件 id，二者相同 -->
<label for="email">邮箱</label>
<input type="email" id="email" name="email" />

<!-- 隐式：把控件包进 label 内部，可省 for/id -->
<label>邮箱 <input type="email" name="email" /></label>
```

<v-click>

- 显式关联标签与控件可在 DOM 里分开放，对组件化框架最友好
- `for` 是 JS 保留字，脚本里用 `labelEl.htmlFor` 读写

</v-click>

---

# label 的三大好处

控件本身对屏幕阅读器是「没有名字的东西」，`<label>` 给它程序化关联的名字：

<v-click>

- **读屏友好**：聚焦控件时读出标签
- **放大命中区**：点 / 触标签即聚焦激活控件——对触屏尤其友好
- **视觉清晰**：一目了然

</v-click>

<v-click>

> 这是无障碍底线，不是可选项。

</v-click>

---

# 哪些元素能被标签

只有这些「可被标签元素」能与 `<label>` 关联：

<v-click>

`<button>`、`<input>`（**`type="hidden"` 除外**）、`<meter>`、`<output>`、`<progress>`、`<select>`、`<textarea>`

</v-click>

<v-click>

::: warning 别往 label 里塞交互元素
「同意《条款》」里的链接应**移到 label 外**，label 内只留纯文本，否则干扰辅助技术解析。
:::

</v-click>

---

# `<fieldset>` + `<legend>`：分组

```html
<fieldset>
  <legend>选择套餐</legend>
  <label><input type="radio" name="plan" value="free" /> 免费版</label>
  <label><input type="radio" name="plan" value="pro" /> 专业版</label>
</fieldset>
```

<v-click>

- `<legend>` 必须是 `<fieldset>` 的**第一个子元素**，渲染在边框上沿
- 屏幕阅读器把 legend 连同每个选项播报：「选择套餐，免费版，单选按钮，三选一」

</v-click>

---

# 为什么单选 / 复选组离不开它

<v-click>

只有 `<label>` 时，读屏听到「免费版 单选按钮」「专业版 单选按钮」——**听不出它们属于同一个问题**。

</v-click>

<v-click>

> 经验法则：**凡单选按钮组、相关复选框组，都包在 `<fieldset>` 里并配 `<legend>`。**

</v-click>

<v-click>

`<fieldset disabled>` 一键禁用组内**所有后代控件**（变灰、不提交）；但 `<legend>` 内的控件不受影响（仍可放「编辑」开关）。

</v-click>

---
layout: section
---

# 四、选择类控件

`<input>` 之外的主力控件

---

# `<select>`：下拉选择

```html
<select id="pet" name="pet" required>
  <option value="">请选择</option>
  <option value="dog">狗</option>
  <option value="cat" selected>猫</option>
</select>
```

<v-click>

- `value` 是提交值；**省略则提交选项文本**
- 没任何 `selected` → 默认选中**第一个**；故占位项常放第一并给空 `value` + `required`
- 多选项用 `<optgroup label="…">` 分组

</v-click>

---

# 多选与 `<datalist>`

```html
<select name="langs" multiple size="4">…</select>
<!-- 多选提交为 langs=js&langs=ts -->

<input list="flavors" name="flavor" />
<datalist id="flavors"><option value="香草"></option></datalist>
```

| | `<datalist>` | `<select>` |
| --- | --- | --- |
| 角色 | 给输入框提供建议 | 本身就是控件 |
| 限制取值 | **不限制** | 只能选预设 |
| 适用 | 常见值+允许自定义 | 必须从固定集合选 |

---

# `<textarea>` 与 `<button>`

```html
<textarea name="msg" rows="5" maxlength="500">
初始值写在标签之间（无 value 属性）
</textarea>

<button type="submit">提交</button>
```

<v-click>

- `<textarea>` 与 `<input>` 两点不同：**能换行**、**初始值在开闭标签之间**
- ⚠️ `<button>` 在 `<form>` 内**不写 `type` 默认是 `submit`**——养成显式写 `type`，否则意外提交

</v-click>

---

# `<output>`：展示计算结果

```html
<input type="range" id="a" value="50" /> +
<input type="number" id="b" value="10" /> =
<output name="sum" for="a b">60</output>
```

<v-click>

- `for`：参与计算的控件 `id` 列表（语义关联）
- 是 `aria-live` 实时区域，内容变化时辅助技术自动播报
- **内容不随表单提交**——纯粹用于展示

</v-click>

---

# `<meter>` 与 `<progress>`

```html
<meter min="0" max="100" low="33" high="66" value="82">82%</meter>
<progress max="100" value="40">40%</progress>
```

| | `<meter>` | `<progress>` |
| --- | --- | --- |
| 表达 | 范围内**测量值** | 任务**完成进度** |
| 典型 | 磁盘、电量、评分 | 下载、安装进度 |
| 缺省 | 必须给 `value` | 省略=不确定（动画） |

<v-click>

⚠️ 下载进度用 `<progress>`，别拿 `<meter>` 当进度条。

</v-click>

---
layout: section
---

# 五、约束校验

不写 JS 就能拦错，但别忘服务器端

---

# 内置约束：声明即校验

```html
<input type="email" required />
<input type="text" pattern="\d{6}" title="6 位邮编" />
<input type="number" min="1" max="99" step="1" />
```

<v-click>

声明属性，浏览器提交时自动检查，不通过就拦下并弹原生气泡，**全程无需 JS**。

约束属性：`required` / `pattern` / `min` / `max` / `step` / `minlength` / `maxlength` + `type="email|url"`。

</v-click>

<v-click>

`pattern`：JS 正则、**隐式匹配整个值**（不用写 `^…$`），配 `title` 写格式说明。

</v-click>

---

# 用 CSS 反映校验状态

```css
input:user-invalid { border-color: #dc2626; }
input:user-valid { border-color: #16a34a; }
```

| 伪类 | 匹配 |
| --- | --- |
| `:required` / `:optional` | 有 / 无 `required` |
| `:valid` / `:invalid` | 满足 / 不满足约束 |
| `:user-valid` / `:user-invalid` | 同上，**仅交互后**生效 |

<v-click>

::: tip 优先 :user-invalid
`:invalid` 页面一加载就对空必填项生效→满屏标红；`:user-invalid` 仅用户交互后生效，现代首选（已 Baseline）。
:::

</v-click>

---

# ValidityState：错在哪一类

`el.validity` 的布尔属性精确说明错因：

| 属性 | 含义 |
| --- | --- |
| `valueMissing` | `required` 却为空 |
| `typeMismatch` | 不符 `type`（邮箱 / URL） |
| `patternMismatch` | 不匹配 `pattern` |
| `tooLong` / `tooShort` | 超 `maxlength` / 不足 `minlength` |
| `rangeOverflow` / `rangeUnderflow` | 超 `max` / 低于 `min` |
| `badInput` / `customError` | 无法转换 / 设过自定义错误 |

---

# Constraint Validation API：三方法

```js
const ok = form.checkValidity();      // 静默查，返回布尔
form.reportValidity();                // 查 + 弹气泡 + 聚焦首错
input.setCustomValidity("两次密码不一致"); // 设自定义错误
input.setCustomValidity("");          // 通过后务必清空
```

<v-click>

- 都能在单控件或整个 `<form>` 上调
- ⚠️ **`form.submit()` 不触发校验**——想保留校验应触发提交按钮点击

</v-click>

---

# 自定义校验与 invalid 事件

```js
function validatePostal() {
  const ok = /^\d{6}$/.test(postal.value);
  postal.setCustomValidity(ok ? "" : "中国邮编为 6 位数字");
}
postal.addEventListener("input", validatePostal);
```

<v-click>

- 内置约束管不了「两字段相等、依国家变邮编」→ 用 `setCustomValidity`，**通过时必须传空串清空**
- 控件触发 `invalid` 事件：`e.preventDefault()` 可阻止原生气泡，自绘错误 UI

</v-click>

---

# 关闭校验 + 一条铁律

```html
<form novalidate>…</form>
<button type="submit" formnovalidate>保存草稿</button>
```

`novalidate` 关掉拦截后，`el.validity` / `checkValidity()` 这些 **API 依然可用**。

<v-click>

::: danger 客户端校验永远不能替代服务器端校验
改 DevTools 删 `required`、脚本赋非法值、直接构造 HTTP 请求都能绕过前端。**客户端为体验，服务器端为安全——任何要入库的数据必须在服务器端再校验一遍。**
:::

</v-click>

---
layout: section
---

# 六、自动填充与移动端

不报错、却实打实影响完成率

---

# autocomplete：让浏览器替用户填

```html
<input name="fname" autocomplete="given-name" />
<input type="email" autocomplete="email" />
```

| 类别 | 常用 token |
| --- | --- |
| 姓名 | `name` / `given-name` / `family-name` |
| 账号 | `username` / `new-password` / `current-password` |
| 联系 | `email` / `tel` / `url` |
| 地址 | `street-address` / `postal-code` / `country` |
| 支付 | `cc-name` / `cc-number` / `cc-exp` / `cc-csc` |

---

# new-password vs current-password

```html
<!-- 注册：触发「生成强密码」 -->
<input type="password" autocomplete="new-password" />

<!-- 登录：自动填入已存密码 -->
<input type="password" autocomplete="current-password" />
```

<v-click>

::: tip 最该记住的一对
注册 / 改密用 `new-password`（主动提议生成强密码）；登录用 `current-password`（自动填入已存密码）。填反会让密码管理器行为错乱。
:::

</v-click>

---

# 验证码与分组前缀

```html
<!-- 短信验证码：自动送到键盘建议条 -->
<input inputmode="numeric" autocomplete="one-time-code" />

<!-- 收货 vs 账单：同样邮编靠前缀区分 -->
<input autocomplete="shipping postal-code" />
<input autocomplete="billing postal-code" />
```

<v-click>

前缀顺序：`section-*` → `shipping`/`billing` → `home`/`work` → 字段名 →（可选）`webauthn`（passkey）。

</v-click>

---

# inputmode：只换键盘不校验

| `inputmode` | 唤起的键盘 |
| --- | --- |
| `numeric` | 仅 0–9 数字盘 |
| `decimal` | 数字 + 小数点（金额） |
| `tel` | 电话拨号盘 |
| `email` / `url` | 带 `@` / 带 `/` 的键盘 |
| `search` / `none` | 回车为「搜索」/ 不弹键盘 |

<v-click>

::: warning 不能替代 type 的校验
能用 `type` 就优先用——`type="email"` 既给键盘又校验。`inputmode` 真正价值：验证码 / 卡号 / 邮编用 `text` + `inputmode="numeric"`。
:::

</v-click>

---

# enterkeyhint：定制回车键

```html
<input type="search" enterkeyhint="search" />
<input type="text" enterkeyhint="next" />
<textarea enterkeyhint="send"></textarea>
```

| `enterkeyhint` | 回车键变为 |
| --- | --- |
| `done` / `go` | 「完成」/「前往」 |
| `next` / `previous` | 「下一项」/「上一项」 |
| `search` / `send` | 「搜索」/「发送」 |

---

# 移动端友好字段长这样

```html
<label for="phone">手机号</label>
<input type="tel" id="phone" name="phone"
       inputmode="tel" autocomplete="tel"
       enterkeyhint="next" required />
```

<v-click>

落地四步：

- **选对 `type`**：拿到键盘 + 内置校验
- **`type` 不够再加 `inputmode`**：验证码 / 卡号 / 金额
- **`autocomplete` 填准**：区分 `new-` / `current-password`
- **`enterkeyhint` 给回车键正确文案**

</v-click>

---

# 全章最佳实践小结

<v-click>

- 数据靠 `name` 提交；敏感 / 上传用 `post`，文件配 `multipart/form-data`
- `type` 选对，同时拿 UI + 校验 + 键盘；非数值字段别用 `number`
- 每控件配 `<label>`（首选 `for` + `id`），单选 / 复选组用 `<fieldset>` + `<legend>`
- 约束校验解决八成场景，跨字段用 `setCustomValidity`；样式优先 `:user-invalid`
- 移动端：`type` → `inputmode` → `autocomplete` → `enterkeyhint`

</v-click>

<v-click>

> 始终牢记：**客户端校验为体验，服务器端校验为安全。**

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把表单写对——数据递得准、控件无障碍、错误拦在前、移动端填得顺

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
