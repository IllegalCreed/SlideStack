---
theme: seriph
layout: cover
title: JSON 数据交换格式
info: |
  从六种值到工程边界，理解 JSON 的语法、精度、序列化与验证。

  Learn more at [https://www.rfc-editor.org/rfc/rfc8259](https://www.rfc-editor.org/rfc/rfc8259)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="json-glyph"><span>{</span><i>:</i><span>}</span></div>

# JSON

## 六种值，一条跨系统的数据通道

<div class="cover-path">
  <code>对象</code><carbon:arrow-right /><code>文本</code><carbon:arrow-right /><code>对象</code>
</div>

<div class="cover-meta">
  <span>RFC 8259</span>
  <span>语法 · 序列化 · 精度 · Schema</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://www.rfc-editor.org/rfc/rfc8259" target="_blank" class="slidev-icon-btn" aria-label="RFC 8259">
    <carbon:document />
  </a>
  <a href="https://www.json.org/json-en.html" target="_blank" class="slidev-icon-btn" aria-label="JSON 官网">
    <carbon:code />
  </a>
</div>

<!--
JSON 的语法很小，但工程问题并不少：数字精度、不可序列化值、日期恢复、重复键、边界校验都发生在“看起来能 parse”之后。

这套内容会从一个值的心智模型开始，经过现场解析实验，最后落到 API 与配置文件的选型和安全边界。
-->

---
layout: default
---

# 一个 JSON 文本，只承载一个值

<div class="value-root mt-5">
  <div class="root-node">JSON text</div>
  <div class="root-line"></div>
  <div class="value-grid">
    <div v-click class="value-node tone-red"><code>"text"</code><span>string</span></div>
    <div v-click class="value-node tone-blue"><code>42.5</code><span>number</span></div>
    <div v-click class="value-node tone-green"><code>true</code><span>boolean</span></div>
    <div v-click class="value-node tone-gray"><code>null</code><span>null</span></div>
    <div v-click class="value-node tone-amber"><code>[ ]</code><span>array</span></div>
    <div v-click class="value-node tone-violet"><code>{ }</code><span>object</span></div>
  </div>
</div>

<div v-click class="callout mt-6">
  RFC 8259 允许顶层是任意 JSON 值；并不要求必须从对象或数组开始。
</div>

<!--
先纠正最常见的心智偏差：JSON 文本不等于对象，它是一个序列化的值。这个值只有六种可能。

[click:6] string、number、boolean、null 是标量，array 和 object 用来组合。
[click] 早期规范曾限制顶层为对象或数组，当前 RFC 8259 明确允许任意值。某些旧系统仍可能保留历史限制。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# 语法骨架：严格，才能跨语言一致

::left::

```json {1|2-3|4-5|6-8|all}
{
  "orderId": "A-1042",
  "paid": true,
  "items": ["book", "pen"],
  "coupon": null,
  "total": 39.5,
  "shipping": {
    "city": "Tokyo"
  }
}
```

::right::

<div class="syntax-list">
  <div v-click><span class="token token-key">键</span><strong>必须是双引号字符串</strong></div>
  <div v-click><span class="token token-sep">:</span><strong>键和值之间只用冒号</strong></div>
  <div v-click><span class="token token-comma">,</span><strong>成员之间用逗号，末项不留逗号</strong></div>
  <div v-click><span class="token token-space">WS</span><strong>只允许空格、Tab、LF、CR</strong></div>
  <div v-click><span class="token token-utf">UTF-8</span><strong>开放系统交换必须使用 UTF-8</strong></div>
</div>

<!--
JSON 刻意不接受 JavaScript 对象字面量的许多便利语法。键必须双引号，分隔符固定，末尾不能多逗号，也没有注释。

[click:5] 这种严格性让不同语言的解析器得到一致结果。开放系统之间的 JSON 文本按 RFC 要求使用 UTF-8。
-->

---
layout: default
---

# 从“像对象”到真正合法的 JSON

````md magic-move {at:1}
```js
{
  user: 'Ada',
  active: True,
  tags: ['compiler',],
  note: undefined,
}
```

```js
{
  "user": "Ada",
  "active": true,
  "tags": ["compiler"],
  "note": undefined
}
```

```json
{
  "user": "Ada",
  "active": true,
  "tags": ["compiler"],
  "note": null
}
```
````

<div class="grid grid-cols-4 gap-3 mt-5">
  <div v-click class="mini-rule"><strong>双引号</strong><span>键与字符串</span></div>
  <div v-click class="mini-rule"><strong>小写字面量</strong><span>`true` / `false` / `null`</span></div>
  <div v-click class="mini-rule"><strong>无尾逗号</strong><span>对象和数组都一样</span></div>
  <div v-click class="mini-rule"><strong>无 `undefined`</strong><span>语义要显式设计</span></div>
</div>

<!--
先展示一段常见的 JavaScript 风格配置。第一步修复引号、布尔值与尾逗号，但 undefined 仍不是 JSON 值。

[click] 最后一版把“明确没有值”设计为 null。注意 null 是否正确取决于协议语义；有时更合理的做法是省略整个字段。
[click:4] 四条规则足以解释大多数初学者语法错误。
-->

---
layout: default
class: lab-slide
---

# 交互实验：解析器会接受什么，又会损失什么

<JsonPlayground />

<!--
先切换“语法错误”，观察 JSON.parse 给出的错误位置；再切换“大整数”，注意它虽然语法合法，却在进入 JavaScript Number 后丢失精度。

最后点格式化，说明格式化是 parse 再 stringify 的结果：只有成功解析的数据才能被标准化输出。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# JSON 的数字没有精度上限，宿主语言可能有

::left::

```js {1|3-5|7-9|all}
const text = '{"orderId": 9007199254740993}';

const data = JSON.parse(text);
data.orderId;
// 9007199254740992

Number.isSafeInteger(data.orderId);
// false
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>解析成功不等于数值语义保持不变</span>
</div>

::right::

<div class="number-line mt-3">
  <span>−(2<sup>53</sup>−1)</span>
  <div class="safe-zone">JavaScript 安全整数区间</div>
  <span>2<sup>53</sup>−1</span>
</div>

<table class="decision-table mt-7">
  <thead><tr><th>数据</th><th>推荐传输</th></tr></thead>
  <tbody>
    <tr v-click><td>订单号、雪花 ID</td><td>字符串</td></tr>
    <tr v-click><td>货币</td><td>最小单位整数或十进制字符串</td></tr>
    <tr v-click><td>科学计算</td><td>明确精度协议与专用解析器</td></tr>
  </tbody>
</table>

<!--
JSON 的 number 语法可以写很大的整数，但 JavaScript JSON.parse 默认落到双精度 Number。超过安全整数区间后，不同文本可能变成同一个值。

[click:3] 标识符用字符串，货币使用最小单位整数或十进制字符串，精密计算则需要双方约定精度与解析器。不要靠“目前数字还不大”维持协议。
-->

---
layout: default
---

# `JSON.stringify` 不是对象的完美快照

<table class="behavior-table mt-5">
  <thead>
    <tr><th>输入位置</th><th>`undefined` / function / symbol</th><th>`NaN` / `Infinity`</th><th>`BigInt`</th></tr>
  </thead>
  <tbody>
    <tr v-click><td>对象属性</td><td><span class="badge omit">省略属性</span></td><td><span class="badge null">变成 `null`</span></td><td><span class="badge throw">抛异常</span></td></tr>
    <tr v-click><td>数组元素</td><td><span class="badge null">变成 `null`</span></td><td><span class="badge null">变成 `null`</span></td><td><span class="badge throw">抛异常</span></td></tr>
    <tr v-click><td>顶层值</td><td><span class="badge omit">返回 `undefined`</span></td><td><span class="badge null">字符串 `"null"`</span></td><td><span class="badge throw">抛异常</span></td></tr>
  </tbody>
</table>

```js {1-5|7-9|all}
JSON.stringify({ a: undefined, b: NaN });
// '{"b":null}'

JSON.stringify([undefined, Infinity]);
// '[null,null]'

JSON.stringify(1n);
// TypeError: Do not know how to serialize a BigInt
```

<!--
这张表适合留作速查。undefined、函数和 symbol 在对象里被省略，在数组里为了保持索引位置变成 null，顶层则返回 undefined。

[click:2] 非有限数字统一变成 null。
[click] BigInt 默认直接抛异常，因为 JSON 没有对应值类型。工程中应显式转换为字符串，并约定恢复规则。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# `replacer` 与 `reviver`：在通道两端控制语义

::left::

### 写出前：过滤或编码

```js {1-6|all}
const text = JSON.stringify(order, (key, value) => {
  if (key === "token") return undefined;
  if (typeof value === "bigint") {
    return { $bigint: value.toString() };
  }
  return value;
});
```

<div v-click class="mini-note">`replacer` 自顶向下访问值；返回 `undefined` 可省略对象属性。</div>

::right::

### 读入后：识别并恢复

```js {1-7|all}
const order = JSON.parse(text, (key, value) => {
  if (value && typeof value === "object" && "$bigint" in value) {
    return BigInt(value.$bigint);
  }
  return value;
});
```

<div v-click class="mini-note">`reviver` 自底向上运行；协议标记必须避免与真实业务字段冲突。</div>

<div v-click class="col-span-2 callout mt-3">转换函数是协议的一部分，应被版本化、测试并在两端共享。</div>

<!--
replacer 和 reviver 可以建立可控的序列化协议。例子同时移除敏感 token，并把 BigInt 编码为带标记的对象。

[click:2] reviver 在解析后从叶子向根恢复值。标记名、冲突策略和错误行为都必须被当作协议设计，而不是散落在业务代码中的技巧。
[click] 两端最好共享同一份 schema 和测试样例。
-->

---
layout: default
---

# 往返之后，哪些 JavaScript 值不再是原来的它

<div class="roundtrip mt-4">
  <div class="roundtrip-source">
    <code>Date</code><code>Map</code><code>Set</code><code>RegExp</code><code>class</code><code>循环引用</code>
  </div>
  <carbon:arrow-right class="text-2xl" />
  <div class="roundtrip-core">
    <span>JSON.stringify</span>
    <carbon:arrows-horizontal />
    <span>JSON.parse</span>
  </div>
  <carbon:arrow-right class="text-2xl" />
  <div class="roundtrip-result">
    <strong>字符串 / 普通对象</strong>
    <span>原型、方法和容器语义消失</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-7">
  <div v-click class="fact"><strong>`Date`</strong><span>通常经 `toJSON()` 变 ISO 字符串</span></div>
  <div v-click class="fact"><strong>`Map` / `Set`</strong><span>默认变普通空对象 `{}`</span></div>
  <div v-click class="fact"><strong>循环引用</strong><span>默认抛 `TypeError`</span></div>
</div>

<div v-click class="callout mt-5">JSON 保存的是数据表示，不是 JavaScript 对象身份。</div>

<!--
序列化往返并不保持 JavaScript 对象身份。Date 通过 toJSON 变字符串，Map 和 Set 没有可枚举字符串键，默认得到空对象，循环引用则无法表示。

[click:3] 如果业务需要恢复这些语义，要设计显式结构和版本，而不是希望 JSON 猜出来。
[click] 因此 JSON 适合数据交换，不适合无损克隆任意对象。浏览器内克隆可考虑 structuredClone。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# JSON Schema：把“约定”变成机器可验证的契约

::left::

```json {1-3|4-8|9-11|all}
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "total"],
  "properties": {
    "id": { "type": "string" },
    "total": { "type": "number", "minimum": 0 }
  },
  "additionalProperties": false
}
```

::right::

<div class="schema-flow mt-1">
  <div class="schema-node external"><carbon:document /> JSON 输入</div>
  <carbon:arrow-down />
  <div v-click class="schema-node schema"><carbon:rule /> Schema + Validator</div>
  <carbon:arrow-down />
  <div class="grid grid-cols-2 gap-3 w-full">
    <div v-click class="schema-node valid"><carbon:checkmark /> 领域数据</div>
    <div v-click class="schema-node invalid"><carbon:close /> 路径化错误</div>
  </div>
</div>

<div v-click class="mini-note mt-4">Schema 能验证结构和值域；业务不变量仍需领域代码检查。</div>

<!--
JSON.parse 只回答语法是否合法，JSON Schema 才回答结构是否符合契约。required、properties、minimum 和 additionalProperties 可以形成可执行规则。

[click:3] 验证器输出可信数据或带路径的错误，适合 API、配置和表单。
[click] Schema 仍无法自动理解“结束时间必须晚于开始时间”等跨字段业务规则，这部分留给领域校验。
-->

---
layout: default
---

# JSON、JSONC、JSON5、NDJSON：名称相近，契约不同

<table class="variant-table mt-5">
  <thead><tr><th>格式</th><th>主要能力</th><th>适合</th><th>不要默认用于</th></tr></thead>
  <tbody>
    <tr v-click><td><strong>JSON</strong></td><td>严格、通用</td><td>公开 API、跨语言交换</td><td>需要注释的手写配置</td></tr>
    <tr v-click><td><strong>JSONC</strong></td><td>JSON + 注释</td><td>编辑器和工具配置</td><td>标准 JSON 解析器</td></tr>
    <tr v-click><td><strong>JSON5</strong></td><td>单引号、裸键、尾逗号等</td><td>人类维护的本地配置</td><td>未协商的网络协议</td></tr>
    <tr v-click><td><strong>NDJSON</strong></td><td>每行一个独立 JSON 值</td><td>日志、流式处理、大数据集</td><td>多行格式化记录</td></tr>
  </tbody>
</table>

<div v-click class="callout mt-6">扩展格式必须由文件后缀、MIME、解析器和文档共同明确，不能只因为“看起来像 JSON”。</div>

<!--
JSONC 与 JSON5 主要服务人类手写配置，NDJSON 服务流式记录。它们都不是 RFC 8259 JSON 的隐式兼容模式。

[click:4] 选择时先看接收方解析器，再看是否需要注释、宽松语法或逐行流式处理。
[click] 对公开协议，严格 JSON 仍是互操作性最高的默认值。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# API 边界：能解析，只是第一道门

::left::

<div class="api-checklist">
  <div v-click><carbon:checkmark-outline /><span><strong>媒体类型</strong><small>`Content-Type: application/json`</small></span></div>
  <div v-click><carbon:checkmark-outline /><span><strong>大小与深度限制</strong><small>防止内存和递归耗尽</small></span></div>
  <div v-click><carbon:checkmark-outline /><span><strong>Schema 校验</strong><small>拒绝未知字段与错误值域</small></span></div>
  <div v-click><carbon:checkmark-outline /><span><strong>错误不回显原始机密</strong><small>记录路径，不泄露载荷</small></span></div>
</div>

::right::

```js {1|3-6|8-10|all}
const payload = JSON.parse(untrustedText);

// 风险发生在后续“解释”或合并，而非 parse 本身
const safe = validator(payload);
if (!safe.ok) {
  return response.status(400).json(safe.errors);
}

// 嵌入 HTML 时要做上下文相关转义
script.textContent = JSON.stringify(safe.value);
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>避免把不可信对象直接深合并到配置或原型敏感对象中。</span>
</div>

<!--
JSON.parse 本身只是构造数据。风险通常发生在后续：无限制载荷消耗资源、未校验字段进入业务、原型敏感键被深合并、原始文本被拼进 HTML。

[click:4] 一条稳健边界包括媒体类型、体积限制、Schema 和不泄密的错误。
[click:2] 嵌入 HTML 时必须按 HTML 上下文处理，不能把 JSON 字符串直接拼接到 script 标签源码。
-->

---
layout: default
---

# 选型不是“JSON 能不能”，而是“约束是否匹配”

<div class="decision-flow mt-7">
  <div class="decision-question">跨语言或公开协议？</div>
  <div class="decision-branch">
    <span>是</span><carbon:arrow-down />
    <strong class="choice json">JSON + Schema</strong>
  </div>
  <div v-click class="decision-question">主要由人维护且需要注释？</div>
  <div v-click class="decision-branch">
    <span>是</span><carbon:arrow-down />
    <strong class="choice config">JSONC / YAML / TOML</strong>
  </div>
  <div v-click class="decision-question">数据持续到达或体积很大？</div>
  <div v-click class="decision-branch">
    <span>是</span><carbon:arrow-down />
    <strong class="choice stream">NDJSON / 流协议</strong>
  </div>
</div>

<div v-click class="grid grid-cols-3 gap-4 mt-8">
  <div class="fact"><strong>协议优先</strong><span>接收方能力决定格式</span></div>
  <div class="fact"><strong>Schema 同行</strong><span>语法之外还要验证语义</span></div>
  <div class="fact"><strong>版本可演进</strong><span>新增、弃用与兼容策略写清楚</span></div>
</div>

<!--
选择格式要从约束开始。公开或跨语言协议优先 JSON 加 Schema；人类维护配置可考虑支持注释的格式；持续数据流使用逐条可解析的协议。

[click:3] 三条工程原则：以接收方能力为准，让 Schema 与样例一起交付，并提前设计协议版本演进。
-->

---
layout: center
class: summary-slide
---

# 一分钟复盘

<div class="summary-grid mt-8">
  <div><span>01</span><strong>JSON 文本是一个值</strong><small>六种值，严格语法</small></div>
  <div><span>02</span><strong>解析成功不等于无损</strong><small>数字、日期和特殊对象会改变</small></div>
  <div><span>03</span><strong>序列化要设计协议</strong><small>明确省略、`null` 与恢复规则</small></div>
  <div><span>04</span><strong>边界必须验证</strong><small>限制资源，再用 Schema 检查</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://www.rfc-editor.org/rfc/rfc8259" target="_blank"><carbon:document /> RFC 8259</a>
  <a href="https://ecma-international.org/publications-and-standards/standards/ecma-404/" target="_blank"><carbon:rule /> ECMA-404</a>
  <a href="https://json-schema.org/learn/getting-started-step-by-step" target="_blank"><carbon:checkmark-outline /> JSON Schema</a>
</div>

<!--
最后带走四点：JSON 是一个严格编码的值；解析可能造成宿主语言精度或语义损失；特殊值必须有显式协议；所有外部 JSON 都要经过资源限制和结构验证。
-->
