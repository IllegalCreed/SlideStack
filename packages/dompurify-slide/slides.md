---
theme: seriph
background: https://cover.sli.dev
title: DOMPurify — XSS HTML Sanitizer
info: |
  Presentation DOMPurify — the DOM-only XSS sanitizer for HTML, MathML and SVG.

  Learn more at [https://github.com/cure53/DOMPurify](https://github.com/cure53/DOMPurify)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧼</span>
</div>

<br/>

## DOMPurify — XSS HTML 净化器

把不可信的 HTML / MathML / SVG 解析成 DOM、按白名单清理后再渲染。一个 `sanitize()` 搞定，抗绕过、抗 mXSS，远胜手写正则

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/cure53/DOMPurify" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 DOMPurify，一个由 cure53 安全团队维护的 XSS 净化器。它的官方定位是：a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG。

核心场景是：你要把用户提交的富文本，比如评论、文章、富文本编辑器的产出，渲染成 HTML 显示出来。直接 innerHTML 会有 XSS 风险，DOMPurify 就是用来把这段 HTML 清洗干净的。

它的思路和自己写正则完全不同：借浏览器自身的 DOM 解析器把脏字符串解析成真实 DOM，再按白名单删危险标签和属性，最后序列化回安全字符串。主线：为什么需要 → 怎么用 → 净化不等于转义 → 配置白名单 → 返回类型 → hooks → Node/SSR → Trusted Types → DOM Clobbering → mXSS → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要它

<v-clicks>

- `innerHTML` / `v-html` / `dangerouslySetInnerHTML` 都直接写 HTML，不转义
- 用户富文本里可能藏 `<script>`、`onerror`、`javascript:`
- 自己写正则过滤：变体太多，永远补不全，必被绕过
- 还有 mXSS：看着安全的 HTML 解析后「变异」成可执行

</v-clicks>

<div v-click class="mt-6">

DOMPurify 的回应：

- 借**浏览器解析器**解析成 DOM → 按**白名单**清理
- 抗大小写、编码、畸形嵌套、命名空间、mXSS

</div>

<!--
为什么要专门用一个库？因为渲染用户 HTML 的几个入口，innerHTML、Vue 的 v-html、React 的 dangerouslySetInnerHTML，都会绕过框架的自动转义，直接把字符串当 HTML 写进 DOM。

用户富文本里可能藏 script 标签、img 的 onerror 事件、a 标签的 javascript 协议，这些一旦被解析就执行，就是 XSS。

很多人第一反应是写正则把 script 删掉。这是危险误区：HTML 解析容错极强，大小写变体、编码实体、属性折行、SVG 命名空间，正则无法穷尽，攻击者总能绕过。更别说 mutation XSS，一段看着安全的 HTML 在解析再序列化时会被浏览器变异成危险结构。

DOMPurify 的根本优势：复用浏览器自己的 DOM 解析器解析成真实 DOM，再按白名单清理，从源头消除解析差异带来的绕过。
-->

---

# 第一条净化

```js
import DOMPurify from 'dompurify';

const dirty = '<img src=x onerror=alert(1)><b>hello</b>';
const clean = DOMPurify.sanitize(dirty);
// → '<img src="x"><b>hello</b>'

el.innerHTML = clean; // 安全
```

<v-clicks>

- 核心 API 只有一个：`DOMPurify.sanitize(dirty, config?)`
- `<img>`、`<b>` 是白名单内安全标签 → **保留**
- `onerror` 等 `on*` 内联事件 → **剥离**
- 默认返回**净化后的字符串**，可直接赋给 `innerHTML`

</v-clicks>

<!--
第一条净化。import 默认导出的 DOMPurify，调 sanitize，传入脏字符串。

例子里 dirty 是一个带 onerror 的 img 加一个 b 标签。净化后，img 和 b 都是白名单里的安全标签，保留下来；但危险的 onerror 内联事件属性被剥离。结果是干净的 img src=x 加 b hello，可以安全地赋给 innerHTML。

记住三点：第一，核心 API 就一个 sanitize，第二参数是可选配置。第二，它保留白名单内的安全标签，剥离危险标签和属性，所有 on 开头的内联事件默认都被删。第三，默认返回的是净化后的字符串，直接能用。
-->

---

# 净化 ≠ 转义（关键辨析）

| 维度 | 净化（DOMPurify） | 转义（escape） |
|---|---|---|
| 手段 | 解析成 DOM，按白名单删危险节点 | 把 `< > &` 变成实体 |
| `<b>x</b>` | 仍是 `<b>x</b>`，**渲染粗体** | `&lt;b&gt;x&lt;/b&gt;`，**显示文本** |
| 适用 | 安全地**渲染富文本** | 只当**纯文本**显示 |

<div v-click class="mt-4 text-sm">

> 要展示富文本（保留部分标签）→ DOMPurify；只想纯文本 → 框架默认插值（如 `{{ }}`）即可。

</div>

<!--
一个最容易混的概念：净化不等于转义。

转义是把尖括号这些字符变成 HTML 实体，让它作为纯文本显示。net 化是解析成 DOM 后按白名单删危险节点，安全的标签仍然以 HTML 形式渲染。

看 b 标签的例子：净化后还是 b 标签，会渲染成粗体；转义后变成实体文本，会显示成 < b > x 这串字符。

所以两者用途完全不同。你要展示用户富文本、保留部分格式标签，用 DOMPurify。你只想把内容当纯文本显示，用框架默认的文本插值，比如 Vue 的双花括号，本身就转义，根本不需要 DOMPurify。别把 DOMPurify 说成转义，它是白名单净化。
-->

---

# 先净化，再插入

<v-clicks>

- XSS 触发点 = HTML 被**解析执行**的那一刻（写入 `innerHTML`）
- 先插入脏 HTML 再清理 → 脚本可能**已经执行**，净化形同虚设
- 正解：在内存里把字符串**净化好**，再写入页面

</v-clicks>

<div v-click>

```js
// ✗ 危险：先插入，注入代码可能已执行
el.innerHTML = dirty;
clean(el);

// ✓ 正确：先净化，再插入
el.innerHTML = DOMPurify.sanitize(dirty);
```

</div>

<!--
一个时序铁律：先净化，再插入。

XSS 的触发点，是 HTML 被解析并执行的那一刻，也就是写入 innerHTML 的瞬间。

如果你先把脏 HTML 插入 DOM，再去清理，那么注入的脚本或事件可能在你清理之前就已经执行了，净化就形同虚设。

正确做法是：在内存里把字符串净化好，再写入页面。看代码对比，上面先 innerHTML 脏内容再清理是危险的；下面先 sanitize 再赋给 innerHTML 才安全。还有一点后面会讲：净化之后也别让其它库再去改写这段 HTML。
-->

---

# 配合框架

```vue [Vue]
<script setup lang="ts">
import DOMPurify from 'dompurify';
import { computed } from 'vue';
const props = defineProps<{ raw: string }>();
const safeHtml = computed(() => DOMPurify.sanitize(props.raw));
</script>

<template>
  <div v-html="safeHtml" />
</template>
```

```tsx [React]
const __html = DOMPurify.sanitize(raw);
return <div dangerouslySetInnerHTML={{ __html }} />;
```

<!--
配合框架的标准写法。

Vue 里，用一个 computed 计算属性，里面调 sanitize 净化 props 传进来的原始字符串，模板的 v-html 只绑定净化后的 safeHtml。这样每次原始内容变化，都会重新净化。

React 里，把 sanitize 的结果作为 __html，传给 dangerouslySetInnerHTML。

关键点：v-html 和 dangerouslySetInnerHTML 本身就是绕过框架自动转义的，DOMPurify 的角色就是在它们写入之前，补上净化这一环。绝不要把用户原始输入直接绑给它们。
-->

---

# 白名单：替换 vs 追加

| 配置 | 语义 | 结果 |
|---|---|---|
| `ALLOWED_TAGS: ['b']` | **替换**白名单 | 只允许 `<b>`，其余移除 |
| `ADD_TAGS: ['my-x']` | **追加**到默认 | 默认安全标签 + `<my-x>` |
| `FORBID_TAGS: ['style']` | 精确**移除** | 默认集合里唯独去掉 `<style>` |

```js
// 评论区：整体替换，只留极少标签
DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['b', 'i', 'a'], ALLOWED_ATTR: ['href'] });
// 富文本：保留默认，禁掉 style 和 form
DOMPurify.sanitize(dirty, { FORBID_TAGS: ['style', 'form'] });
```

<!--
配置白名单，最该先理解的是替换和追加的区别。

ALLOWED_TAGS 是整体替换默认白名单，你给什么就只允许什么。ALLOWED_ATTR 对属性同理。ADD_TAGS 是在默认白名单基础上追加，源码会先克隆默认集合再扩展，不会把其它默认安全标签弄丢。FORBID_TAGS 是在白名单上精确移除某几个标签。

看代码：评论区场景用 ALLOWED_TAGS 整体替换，只留 b、i、a 三个标签，属性只留 href，最严格。富文本场景用 FORBID_TAGS，保留默认丰富的安全标签，但唯独禁掉 style 和 form。

属性侧的 ADD_ATTR、FORBID_ATTR 语义完全对应，记住替换和追加这对概念就不会配错。
-->

---

# USE_PROFILES 与默认白名单

```js
// 只允许 HTML（排除 SVG、MathML）—— 最常用
DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });

// 允许内联 SVG 图标
DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true, svg: true, svgFilters: true } });
```

<v-clicks>

- profile 可选键：`html` / `svg` / `svgFilters` / `mathMl`
- **默认白名单** = HTML + SVG（含滤镜）+ MathML + 文本（相当丰富）
- 想收窄到纯 HTML，记得用 `USE_PROFILES: { html: true }`
- `<script>`、`on*`、`javascript:` 默认**永远**被清理

</v-clicks>

<!--
不想逐个列标签，用 USE_PROFILES 预设白名单。

设 html true 就只启用 HTML 的标签和属性集合，排除 SVG 和 MathML，这是最常用的收窄到纯 HTML 的方式。要支持内联 SVG 图标，就同时开 html、svg、svgFilters，profile 自带配套的 SVG 属性白名单，比手动 ADD_TAGS 列一堆 SVG 标签可靠得多。

profile 可选四个键：html、svg、svgFilters、mathMl。

这里有个容易忽略的点：DOMPurify 的默认白名单其实相当丰富，是 HTML 加 SVG 含滤镜加 MathML 加文本五组合并的。所以如果你只想要纯 HTML，别忘了用 profile 收窄。但不管怎么配，script、on 事件、javascript 协议默认永远被清理。
-->

---

# data / aria / 协议

```js
// 默认：data-* 与 aria-* 都允许
DOMPurify.sanitize('<div data-id="5" aria-label="x">hi</div>'); // 原样保留

// 禁掉所有 data-*
DOMPurify.sanitize(dirty, { ALLOW_DATA_ATTR: false });

// 危险协议默认被剥离
DOMPurify.sanitize('<a href="javascript:alert(1)">x</a>'); // → '<a>x</a>'
```

| 配置 | 默认 | 含义 |
|---|---|---|
| `ALLOW_DATA_ATTR` | `true` | 是否允许 `data-*` |
| `ALLOW_ARIA_ATTR` | `true` | 是否允许 `aria-*` |
| `ALLOW_UNKNOWN_PROTOCOLS` | `false` | 放行未知协议（有风险） |

<!--
几个常用属性和协议开关。

默认情况下，data 星和 aria 星属性都是允许的，ALLOW_DATA_ATTR 和 ALLOW_ARIA_ATTR 默认都是 true。所以 data-id、aria-label 会原样保留。要禁掉所有 data 星，设 ALLOW_DATA_ATTR false。

协议方面，DOMPurify 默认用内置正则限制链接协议，javascript 协议不在允许之列，所以 a 标签的 javascript href 会被剥离，标签和文本保留，结果是空 href 的 a。

表格里三个开关：data、aria 默认 true。ALLOW_UNKNOWN_PROTOCOLS 默认 false，设成 true 会放行未知协议，扩大攻击面，要谨慎。
-->

---

# 返回类型随配置变化

| 配置 | 返回类型 | 用途 |
|---|---|---|
| （默认） | `string` | 直接赋给 `innerHTML` |
| `RETURN_DOM: true` | `Node` | 直接做 DOM 操作 |
| `RETURN_DOM_FRAGMENT: true` | `DocumentFragment` | 批量插入 |
| `RETURN_TRUSTED_TYPE: true` | `TrustedHTML` | 严格 CSP |
| `IN_PLACE: true`（入参 Node） | `Node` | 就地净化离线节点 |

```ts
const a = DOMPurify.sanitize(dirty);                       // a: string
const b = DOMPurify.sanitize(dirty, { RETURN_DOM: true }); // b: Node
```

<!--
sanitize 的返回类型不是固定的，随配置变化，这是它一个很有特色的设计。

默认返回字符串，直接赋给 innerHTML。设 RETURN_DOM true 返回一个 DOM 节点，具体是 HTMLBodyElement，方便直接做 DOM 操作。RETURN_DOM_FRAGMENT 返回 DocumentFragment，更轻、无语义，适合批量插入，而且内部会强制打开 RETURN_DOM。RETURN_TRUSTED_TYPE 返回 TrustedHTML，用于严格 CSP 环境，后面会讲。IN_PLACE 就地净化，要求传入的本身是 Node，返回也是 Node。

而且 3.x 用 TypeScript 函数重载精确刻画了这些。看代码，不传标志推断成 string，传 RETURN_DOM true 推断成 Node。这意味着忘记处理非字符串返回，编译期就能发现。
-->

---

# hooks：定制净化过程

```js
// 给所有外链 <a> 补 target 与 rel
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});
const clean = DOMPurify.sanitize(dirty);
DOMPurify.removeHook('afterSanitizeAttributes'); // 用完清理
```

<v-clicks>

- 常用入口：`uponSanitizeElement`（逐元素）、`afterSanitizeAttributes`（属性后）
- `uponSanitizeAttribute` 里设 `hookEvent.forceKeepAttr = true` 强制保留属性

</v-clicks>

<!--
需要在净化过程里插自定义逻辑，用 hooks。addHook 传入入口点和回调。

最常见的例子：给所有外链 a 标签补 target blank 和 rel noopener noreferrer。在 afterSanitizeAttributes 钩子里，判断是 A 标签且有 href，就 setAttribute。这是官方推荐的定制方式，比净化得到字符串后再用正则改安全得多。

最常用两个入口：uponSanitizeElement 逐个元素触发，回调第二参数 data 里有 tagName 可以判断元素；afterSanitizeAttributes 在属性净化后触发。还有 uponSanitizeAttribute，在里面把 hookEvent.forceKeepAttr 设为 true，可以强制保留某个本不在白名单的属性。

注意最后一行：用完 removeHook 清理，下一页讲为什么。
-->

---

# hooks 是全局的，记得清理

<v-clicks>

- `addHook` 注册在**实例（常为全局单例）** 上，影响**每一次** `sanitize`
- 多模块各自 addHook → 钩子**叠加、全局生效**、相互干扰
- `removeHook(e)` 移除最近一个；`removeAllHooks()` 清空全部

</v-clicks>

<div v-click class="mt-3">

两种隔离思路：

- **多实例**：`createDOMPurify(window)` 造独立实例，各挂各的
- **配对管理**：`addHook` / `removeHook` 成对出现

</div>

<!--
一个工程上的坑：hooks 是全局的。

addHook 注册在 DOMPurify 实例上，而通常我们用的是全局单例，所以它会影响这个实例的每一次 sanitize 调用，而不是只影响下一次。

在大型应用里，如果多个模块各自 addHook，钩子会叠加、全局生效、相互干扰，顺序还难控。

清理 API：removeHook 传入口点，移除该入口最近一个钩子；removeHooks 移除该入口全部；removeAllHooks 清空所有入口的全部钩子。

两种隔离思路：第一，用 createDOMPurify 传 window 造出独立实例，不同场景各挂各的钩子，互不影响。第二，addHook 和 removeHook 成对出现，用完即清。或者把差异化逻辑放进 config 而不是全局钩子。
-->

---

# Node / SSR：用 jsdom 提供 DOM

```js
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const clean = DOMPurify.sanitize('<b>hi</b><script>x</script>');
// → '<b>hi</b>'
```

<v-clicks>

- DOMPurify 依赖 DOM，Node 端需 **jsdom 造 window**
- jsdom 要**最小化**：不加载子资源、不执行脚本（默认即如此）
- 同构项目（Next/Nuxt/Astro）→ 用 `isomorphic-dompurify` 一个 import 通吃

</v-clicks>

<!--
在 Node 端用 DOMPurify，因为它依赖 DOM，而 Node 默认没有 window 和 document。

经典做法：用 jsdom 创建一个 window，再用工厂函数 createDOMPurify 传入这个 window，得到实例，之后就能正常 sanitize。例子里 script 被清掉，b 保留。

一个安全提醒：DOMPurify 本身不发任何网络请求，风险来自 jsdom。如果 jsdom 开了 resources usable 之类的配置，它会去加载外链资源，有 SSRF 和隐私风险。所以让 jsdom 当纯 DOM 宿主就行，不加载子资源、不执行外部脚本，这也是 jsdom 的默认行为。

如果是 Next、Nuxt、Astro、SvelteKit 这种同构项目，直接用 isomorphic-dompurify 封装，浏览器走原生、Node 端自动用 jsdom，一个 import 通吃两端，省去环境判断。
-->

---

# Trusted Types 集成

```js
// 直接产出可赋给受保护 sink 的 TrustedHTML
const clean = DOMPurify.sanitize(dirty, { RETURN_TRUSTED_TYPE: true });
el.innerHTML = clean; // 满足 require-trusted-types-for 'script'
```

<v-clicks>

- 严格 CSP（Trusted Types）下，`RETURN_TRUSTED_TYPE: true` 返回 `TrustedHTML`
- TS 类型也从 `string` 收窄为 `TrustedHTML`

</v-clicks>

<div v-click class="mt-2 text-sm">

> ⚠️ 递归陷阱：自定义 policy 的 `createHTML` 里调 `sanitize`，而 sanitize 又用该 policy → 无限递归。

</div>

<!--
Trusted Types 集成。在启用了 Trusted Types、CSP 要求 require-trusted-types-for script 的页面，普通字符串不能直接赋给 innerHTML 这种 sink。

设 RETURN_TRUSTED_TYPE true，sanitize 在支持的环境会返回一个 TrustedHTML 对象，可以直接赋给受保护的 sink，满足严格 CSP。而且 TypeScript 类型也会从 string 收窄为 TrustedHTML，类型安全。

DOMPurify 对 Trusted Types 是原生支持的，这是它的一大优势。

但有个递归陷阱要警惕：如果你自己创建一个 Trusted Types policy，在它的 createHTML 内部又去调 DOMPurify.sanitize，而 DOMPurify 内部又用了这个 policy，就会无限递归。官方明确提醒：不要把一个会回调 sanitize 的 policy 再传回给 DOMPurify。
-->

---

# DOM Clobbering 防护

<v-clicks>

- **DOM Clobbering**：用 `id` / `name` 覆盖 `document`/`form` 的原生属性或全局变量
- `SANITIZE_DOM`（默认 `true`）：基础防护，自动开启
- `SANITIZE_NAMED_PROPS`（默认 `false`）：给命名属性加 `user-content-` 前缀，彻底隔离

</v-clicks>

<div v-click>

```js
// 处理高风险内容时，叠加更严格的命名空间隔离
DOMPurify.sanitize(dirty, { SANITIZE_NAMED_PROPS: true });
```

</div>

<!--
DOM Clobbering 防护。这是一类比较隐蔽的攻击。

DOM Clobbering 是指：攻击者用 id 或 name 这种命名属性，去覆盖 document 或 form 上的原生属性，或者覆盖全局变量。比如让 document.cookie、form.action 被一个注入的元素顶替，从而扰乱你的脚本逻辑。

DOMPurify 有两层防护。第一层 SANITIZE_DOM，默认就是 true，自动开启，做基础的 DOM Clobbering 防护。第二层 SANITIZE_NAMED_PROPS，默认 false，开启后会给 id、name 这些命名属性加上 user-content 前缀，做命名空间隔离，让用户内容里的命名属性不会和页面真实的命名冲突。

实践建议：处理那些会被脚本通过 document 点什么、form 点什么访问的高风险内容时，叠加 SANITIZE_NAMED_PROPS 更稳。
-->

---

# mXSS：为何离不开专业净化器

<v-clicks>

- **mutation XSS**：看着安全的 HTML，在「解析 → 序列化 → 再解析」中被浏览器**变异**成可执行结构
- 诱因：解析器对畸形写法的自动「纠正」、不同上下文（svg/math/template）规则差异
- DOMPurify：针对解析变异做处理，并**随浏览器更新持续迭代规则**

</v-clicks>

<div v-click class="mt-4 text-sm">

> 结论：务必用**当前维护的版本**，优先用官方 profile / 默认白名单，别自创放行规则。这正是手写正则永远做不到的。

</div>

<!--
mXSS，mutation XSS，这是 DOMPurify 长期对抗的高级威胁，也是为什么你离不开专业净化器。

它的本质是：一段看着完全安全的 HTML，在被解析、序列化、再解析的过程中，浏览器的容错和规范化机制会把它变异成可执行的危险结构，从而绕过一次性的净化。

诱因是 HTML 解析器对畸形或边界写法的自动纠正，以及 svg、math、template 这些不同上下文的解析规则差异。

DOMPurify 基于对解析器变异行为的深入研究做针对性处理，并且随浏览器更新持续迭代规则。

结论很实际：务必用当前维护的版本，因为 mXSS 防御依赖与浏览器同步的规则更新；优先用官方维护的 profile 和默认白名单，别自创放行规则。这种对抗，是你自己写正则永远做不到的，也是用 DOMPurify 而不是手撸过滤的根本理由。
-->

---

# 与 CSP：纵深防御

| 层 | 职责 | 失效场景 |
|---|---|---|
| **DOMPurify** | 内容层：移除注入向量 | 配置放太宽 / 净化后被改写 |
| **CSP** | 执行层：限制脚本来源、禁内联 | 策略疏漏 / 允许 unsafe-inline |

<v-clicks>

- 两者**互补、不可替代**：有 CSP 仍要净化，有净化也要配 CSP
- Trusted Types 下用 `RETURN_TRUSTED_TYPE` 让二者无缝衔接

</v-clicks>

<!--
DOMPurify 和 CSP 的关系：纵深防御，互补的两层。

DOMPurify 是内容层，在内容进入 DOM 前移除注入向量。它的失效场景是配置放太宽，或者净化后又被别的库改写。CSP 是执行层，通过限制脚本来源、禁止内联脚本，在执行那一关兜底。它的失效场景是策略有疏漏，或者图省事允许了 unsafe-inline。

关键认识：两者互补、不可互相替代。即使你有严格的 CSP，仍然应该净化用户 HTML，因为 CSP 可能有配置疏漏；即使你净化了，也应该配 CSP 兜底，多一层保险。

在支持 Trusted Types 的环境，用 RETURN_TRUSTED_TYPE true，让净化和 CSP 无缝衔接。别因为做了净化就省掉 CSP，反之亦然。
-->

---
layout: intro
---

# 总结

DOMPurify = **解析成 DOM + 白名单清理**的 XSS 净化器

- 用法：一个 `DOMPurify.sanitize(dirty, config?)`，默认返回字符串
- 辨析：是**净化**不是转义；务必**先净化、再插入**
- 配置：`ALLOWED_TAGS` 替换 / `ADD_TAGS` 追加 / `USE_PROFILES` 预设
- 返回：字符串 / Node / Fragment / TrustedHTML，TS 重载精确推断
- 进阶：hooks 定制、Node 用 jsdom、Trusted Types、DOM Clobbering
- 根本价值：抗 mXSS、与浏览器同步更新——**别用正则、别省 CSP**

<!--
总结一下。

DOMPurify 的本质，是把不可信 HTML 解析成 DOM、再按白名单清理的 XSS 净化器。

用法上，核心就一个 sanitize，第二参数可选配置，默认返回净化后的字符串。

概念上，记住它是净化不是转义，安全标签会保留并渲染；时序上务必先净化、再插入。

配置上，ALLOWED_TAGS 整体替换白名单、ADD_TAGS 在默认上追加、USE_PROFILES 用预设集合，这三个是常用主力。

返回类型可选字符串、Node、Fragment、TrustedHTML，3.x 用 TypeScript 重载做精确推断。

进阶能力：hooks 定制净化过程、Node 端用 jsdom 提供 DOM、Trusted Types 原生集成、DOM Clobbering 防护。

最后是它的根本价值：能抗 mutation XSS、随浏览器同步更新规则。两句话收尾：别用正则自己过滤，别因为净化了就省掉 CSP。谢谢大家。
-->
