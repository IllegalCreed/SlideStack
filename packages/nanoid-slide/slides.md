---
theme: seriph
background: https://cover.sli.dev
title: Nano ID — 极小、安全的唯一 ID 生成器
info: |
  Presentation Nano ID — 一个极小、安全、URL 友好的唯一字符串 ID 生成器。

  版本基线 nanoid 5（纯 ESM）。Learn more at [https://github.com/ai/nanoid](https://github.com/ai/nanoid)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🆔</span>
</div>

<br/>

## Nano ID — 极小、安全的唯一 ID 生成器

**118 字节**、零依赖、URL 友好。默认 21 字符、加密随机、比 UUID 更小更短。版本基线 **nanoid 5（纯 ESM）**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/ai/nanoid" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 nanoid。它由 Andrey Sitnik 发起,就是 PostCSS、Autoprefixer 的作者,官方一句话定位是 a tiny, secure, URL-friendly, unique string ID generator——一个极小、安全、URL 友好的唯一字符串 ID 生成器。

一句话抓住它:三个关键词。小,核心代码只有 118 字节,min 加 brotli 压缩,零依赖,大约是 uuid v4 的四分之一;安全,默认用加密级的硬件随机源,不是可预测的 Math.random;URL 友好,默认字母表只有 A 到 Z、a 到 z、0 到 9 再加下划线和连字符,可以直接放进 URL、文件名、DOM 的 id。

主线:为什么用 → 默认值设计 → 装上生成第一个 ID → 自定义长度与字母表 → 加密与非加密 → 随机源与均匀性 → 碰撞概率 → 和 UUID 对比与选型 → React 与 RN → customRandom → 纯 ESM 与 CommonJS → 3 到 5 迁移 → 实战要点 → 总结。版本基线是 nanoid 5,当前最新 5.1.x,纯 ESM。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它

<v-clicks>

- 自增主键**可被枚举、泄露规模**，不适合对外暴露
- UUID v4 字符串**长达 36 字符**，放进 URL 偏笨重
- `Math.random()` 生成 ID **可预测**，有安全隐患
- 想要 ID**直接进 URL / 文件名**，不必转义

</v-clicks>

<div v-click class="mt-6">

nanoid 的回应：

- **118 字节、21 字符** → 更小的代码、更短的 ID
- **加密随机源** → 不可预测、不可枚举
- **64 个 URL 安全字符** → 拿来即用

</div>

<!--
为什么要专门用一个 ID 生成库?几个常见痛点。

第一,数据库自增主键是连续的,对外暴露会被枚举——别人看到 /user/1001 就知道还有 1000、1002,还能推断你的业务规模。第二,UUID v4 虽然解决了枚举,但它的字符串有 36 个字符,还带四个连字符,放进 URL 显得笨重,双击也难全选。第三,有人图省事用 Math.random 拼 ID,但它是伪随机、可预测,用来做 token 或资源 ID 有被猜解的安全风险。第四,我们经常希望 ID 能直接放进 URL、文件名,不用做百分号转义。

nanoid 的回应很对症:它的核心代码只有 118 字节、默认 ID 只有 21 个字符,代码更小、ID 更短;默认用加密随机源,不可预测也就不可枚举;默认字母表是 64 个 URL 安全字符,生成出来直接就能用。这就是今天的主线。
-->

---

# 核心设计：为什么是 21 + 64

```ts
import { nanoid } from "nanoid";
nanoid(); //=> "V1StGXR8_Z5jdHi6B-myT"
```

<div class="mt-4 text-sm">

ID 的随机性（熵）≈ `log2(字母表大小) × 长度`

- 默认字母表 **64 符**（`A-Za-z0-9_-`）→ 每字符 `log2(64) = 6` 位
- 默认长度 **21** → `6 × 21 = 126 位`随机性
- UUID v4 是 **122 位 / 36 字符** —— nanoid 用更短的串装下相当的熵

</div>

<div v-click class="mt-4 text-sm">

> 结论：**更大的字母表把熵打包进更少的字符**，所以 nanoid 更短而抗碰撞与 UUID v4 相当。

</div>

<!--
这是整个 nanoid 最该先建立的认知:默认值 21 和 64 不是随手定的。

先看一行代码,nanoid 不传参,返回一个 21 字符的字符串。

关键在熵的公式:一个 ID 的随机性,约等于 log2 字母表大小,乘以长度。默认字母表是 64 个符号,log2 64 等于 6,所以每个字符携带 6 位随机性;默认长度 21,6 乘 21 等于 126 位。作为对比,UUID v4 是 122 位,但它用了 36 个字符。

所以结论很清楚:nanoid 用一个更大的字母表,把和 UUID 相当的随机位,打包进了更少的字符里——21 比 36 短了不少,但抗碰撞能力相当。这就是它能又短又安全的根本原因。后面所有的自定义,本质都是在这个熵公式上做文章。
-->

---
layout: two-cols-header
---

# 安装与第一个 ID

::left::

**安装（Node 18+）**

```bash
npm install nanoid
pnpm add nanoid
bun add nanoid
```

::right::

**生成**

```ts
import { nanoid } from "nanoid";

const id = nanoid();
// "V1StGXR8_Z5jdHi6B-myT"
```

<div class="mt-4 text-sm">

- `nanoid` 是**具名导出**（用花括号），无默认导出
- 直接调用 `nanoid()`，没有 `.generate()`
- ⚠️ nanoid 5 是**纯 ESM**；CommonJS 项目用 `nanoid@3`

</div>

<!--
安装与上手,很轻。

左边:Node 18 及以上,npm install nanoid,pnpm、yarn、bun 同理。它零运行时依赖,自带 TypeScript 类型。

右边:从 nanoid 具名导入 nanoid 函数,直接调用,就得到一个默认 21 字符的 ID。

三个提醒。第一,nanoid 是具名导出,一定要用花括号 import,它没有默认导出,写成 import nanoid from 会拿到 undefined。第二,直接调用函数本身就行,没有 generate 这种方法。第三,也是最重要的一个坑:nanoid 5 是纯 ESM 包,如果你的项目还在用 CommonJS 的 require,直接装最新版会报错,这种情况要装 nanoid@3,后面会专门讲。
-->

---

# 自定义长度

```ts
import { nanoid } from "nanoid";

nanoid();    //=> "V1StGXR8_Z5jdHi6B-myT"（默认 21）
nanoid(10);  //=> "IRFa-VaY2b"
nanoid(32);  // 更长 → 抗碰撞更强
```

<div v-click class="mt-4 text-sm">

- 长度作为**第一个参数**传入，字母表仍是默认 64 符
- 长度直接决定熵：**长度翻倍，熵翻倍，碰撞概率指数级下降**
- ❌ 别用 `nanoid().slice(0, 10)`：浪费随机字节、非推荐用法

</div>

<!--
改长度很简单,把想要的位数作为第一个参数传进去就行。

看代码:不传是默认 21;传 10 就是 10 字符;传 32 就更长。注意这时字母表没变,还是默认那 64 个 URL 安全字符,只是长度变了。

为什么要能改长度?因为长度直接决定熵。回到刚才的公式,熵等于每字符位数乘长度,所以长度翻倍,熵就翻倍,碰撞概率指数级下降。短链想要更短就调小,但要承担更高的碰撞概率;对唯一性要求极高就调大。

最后一个反模式:不要写 nanoid 再 slice 0 到 10 这种,先生成 21 个字符再截断,既浪费了已经生成的随机字节,也不是 API 设计的用法。要 10 位就直接 nanoid 10。
-->

---

# 自定义字母表 customAlphabet

```ts
import { customAlphabet } from "nanoid";

// 纯十六进制、默认长度 10
const hexId = customAlphabet("1234567890abcdef", 10);
hexId();   //=> "4f90d13a42"
hexId(5);  //=> "f01a2"（单次覆盖默认长度）
```

<div v-click class="mt-3 text-sm">

两条铁律：

- **字母表 ≤ 256 个符号**（随机字节取值 0-255）
- **字符必须唯一**：重复字符会让该符号概率翻倍、破坏均匀（nanoid 不自动去重）

</div>

<!--
默认字母表满足不了时,用 customAlphabet 换一套字符。

它接收字母表字符串和默认长度两个参数,返回一个新的生成函数。看代码:用十六进制字符、默认长度 10,调用就得到一个 hex 风格的 ID。返回的函数同样支持单次传长度,比如 hexId 5,这一次就生成 5 字符,覆盖默认的 10。

常见用途:纯数字做验证码风格、去掉容易混淆的 0 O 1 I l 做人眼可读的码、只用大写做邀请码。

两条铁律必须记住。第一,字母表最多 256 个符号,因为底层随机字节的取值范围是 0 到 255,超过 256 就没法用单个字节均匀映射。第二,字母表里的字符必须唯一,如果你不小心写了重复的,比如 aabc,那个 a 被选中的概率就是别人的两倍,等于人为引入偏置、降低有效熵,而 nanoid 不会帮你自动去重。
-->

---

# 加密 vs 非加密：non-secure

```ts
// 默认版：crypto / Web Crypto，安全
import { nanoid } from "nanoid";

// 非加密版：Math.random()，更快但不安全
import { nanoid, customAlphabet } from "nanoid/non-secure";
nanoid(); //=> "Uakgb_J5m9g-0JDMbcJqLJ"
```

<div v-click class="mt-3 text-sm">

| 维度 | 默认（secure） | non-secure |
|---|---|---|
| 随机源 | crypto / Web Crypto | `Math.random()` |
| 速度 | 快 | 更快 |
| 用途 | token、会话、资源 ID | 前端临时 key、非敏感短码 |

</div>

<div v-click class="text-sm">

> ⚠️ 敏感 ID **必须用默认版**，non-secure 绝不能用于安全场景。

</div>

<!--
nanoid 有两个入口,对应安全和速度的取舍。

默认从 nanoid 导入的是安全版,底层用 Node 的 crypto 或浏览器的 Web Crypto,加密随机源。如果你明确不在意安全性,或者运行在没有硬件随机源的环境,又想要更快,可以从 nanoid 斜杠 non-secure 导入,它底层用 Math.random。注意 non-secure 入口同样导出 customAlphabet,所以非加密版也能自定义字母表。

看这个表对比:随机源,一个是加密的,一个是 Math.random;速度,non-secure 更快;用途,默认版用于 token、会话 ID、对外资源 ID 这些需要安全的地方,non-secure 用于前端列表的临时 key、不敏感的短码。

底下是红线:敏感 ID 必须用默认版。会话 token、密码重置链接、API 密钥,这些如果用了 non-secure,等于把 ID 变得可预测,会被攻击者猜解,这是严重的安全漏洞。记住:图快可以,但别在安全的地方图快。
-->

---

# 随机源与均匀性

<div class="text-sm">

**随机源**：Node 用 `node:crypto`，浏览器用 Web Crypto，都是不可预测的硬件随机。

**为什么不用 `random % alphabet.length`？**

</div>

```ts
// ❌ 取模会偏置：256 不整除字母表长度时，前面的符号概率偏高
id += alphabet[byte % alphabet.length];

// ✅ nanoid 用拒绝采样：丢弃尾部会偏置的字节，保证均匀
const safeByteCutoff = 256 - (256 % alphabet.length);
```

<div v-click class="mt-3 text-sm">

- **模偏置（modulo bias）**：简单取模让部分符号更易出现，破坏分布
- nanoid 用**拒绝采样** + 对 2 的幂字母表走 `& mask` 位掩码快路径
- 官方「**tested for uniformity**」——分布经过均匀性测试

</div>

<!--
这页讲 nanoid 在随机性上的两个讲究。

第一,随机源。Node 里用 node:crypto,浏览器里用 Web Crypto,都是由不可预测的硬件随机源驱动,这是安全的基础。

第二,也是很多人手写 ID 会踩的坑:怎么把随机字节映射到字母表。最直觉的写法是字节对字母表长度取模,但这是个常见错误。看注释:随机字节是 0 到 255,如果 256 不能被字母表长度整除,那么取模之后,前面一部分符号会比后面的符号出现概率更高,这叫模偏置,会破坏分布均匀性,降低有效熵。

nanoid 的做法是拒绝采样:算一个安全截断点 safeByteCutoff,等于 256 减去 256 对字母表长度取余,把落在尾部、会造成偏置的那几个字节直接丢弃、重新取,只接受截断点以内的字节,这样每个符号概率就均等了。而且当字母表长度恰好是 2 的幂,比如默认的 64,它还有一条快路径:用位掩码 and mask 代替取模,更快还天然无偏置。官方明确说分布经过了均匀性测试。这就是 nanoid 比你随手写的 ID 生成器更可靠的地方。
-->

---

# 碰撞概率：与生成量有关，与时间无关

<div class="text-sm">

> 「要让重复概率达到十亿分之一，需生成约 **103 万亿**个 UUID v4。」nanoid 默认值与之相当。

</div>

<v-clicks>

- 碰撞只和**熵（字母表大小 × 长度）**与**生成总量**有关
- 与生成时刻**无关**——nanoid 根本不用时间戳，「同一毫秒并发」不增加碰撞
- 缩短长度 / 缩小字母表 → 熵骤降 → 碰撞概率上升
- 短 ID（6-8 位）务必用 **[nano-id-cc](https://zelark.github.io/nano-id-cc/)** 评估，配唯一约束兜底

</v-clicks>

<!--
碰撞概率是用 nanoid 必须建立的直觉。

先看官方给的一个对照数字:要让出现一次重复的概率达到十亿分之一,需要生成大约 103 万亿个 UUID v4。这是个天文数字,nanoid 默认值的碰撞概率和它相当。所以在常规规模下,碰撞概率小到可以忽略。

但要记住几个要点。第一,碰撞只和两件事有关:一是熵,也就是字母表大小乘长度;二是你总共生成了多少个。第二,一个常见误区:有人担心同一毫秒内并发生成会碰撞——不会。nanoid 的唯一性完全来自随机数,根本不使用时间戳,所以同一毫秒生成多少个都不增加碰撞概率,这点和那些依赖时间戳加序列号的方案有本质区别。

第三,反过来,如果你为了短而把长度砍到 6、8 位,或者把字母表缩到很小,熵会骤降,碰撞概率显著上升。这种短 ID 一定要用 zelark 的 nano-id-cc 这个在线计算器,输入你的字母表、长度、生成速率,它会告诉你多久会碰一次,然后在数据库上加唯一约束、配冲突重试来兜底。
-->

---

# 与 UUID 对比

<div class="text-sm">

| 维度 | nanoid（默认） | UUID v4 | UUID v7 / ULID |
|---|---|---|---|
| 代码体积 | **118 字节** | 423 字节 | 视实现 |
| 字符长度 | **21** | 36（含连字符） | 36 / 26 |
| 随机位 | ~126 位 | ~122 位 | 含时间戳 |
| 字母表 | 64（URL 安全） | hex + `-` | 视实现 |
| 时间有序 | 否 | 否 | **是** |
| 可枚举 | 否 | 否 | 部分（时间段） |

</div>

<div v-click class="mt-3 text-sm">

- nanoid 强在**更小体积 + 更短 ID**，抗碰撞与 v4 相当
- 需要**时间有序**（索引局部性 / 按创建时间排序）→ 选 **v7 / ULID**

</div>

<!--
把 nanoid 放进 ID 方案的大图里对比一下。

看这个表。代码体积:nanoid 118 字节,UUID v4 是 423 字节,nanoid 大约四分之一。字符长度:nanoid 21,UUID 36,还带连字符。随机位:nanoid 126,UUID v4 是 122,基本相当。字母表:nanoid 是 64 个 URL 安全字符,UUID 是十六进制加连字符。时间有序:nanoid 和 v4 都是否,UUID v7 和 ULID 是是。可枚举:nanoid 和 v4 都不可枚举。

结论分两块。nanoid 的强项是更小的代码体积和更短的 ID,而抗碰撞能力和 UUID v4 相当,所以做短链、做对外资源 ID,nanoid 是很好的选择。

但有一个场景 nanoid 不合适:当你需要主键时间有序的时候。比如希望数据库主键随时间单调递增,这样 B 树索引写入有局部性、查询能天然按创建时间排序——这种需求要选 UUID v7 或者 ULID,它们把时间戳编进了 ID 的前缀。nanoid 是纯随机,没有时间成分,强行用会让索引随机写入,性能受损。下一页专门讲选型。
-->

---

# 怎么选：决策表

<div class="text-sm">

| 需求 | 推荐 |
|---|---|
| 短链 slug、API 资源 ID、不可枚举 ID | **nanoid**（加密随机） |
| 前端临时 key、非敏感短码（求快） | **nanoid/non-secure** |
| 通用唯一 ID、兼容现有 UUID 体系 | UUID v4 |
| 主键时间有序（索引局部性 / 时间排序） | **UUID v7 / ULID** |
| 自定义字符集（纯数字 / 去易混字符） | nanoid + `customAlphabet` |

</div>

<div v-click class="mt-3 text-sm">

> 最该记的反例：**核心诉求是「时间有序」时，别用 nanoid。**

</div>

<!--
把选型收成一张决策表,照着对号入座。

第一行,短链的 slug、对外的 API 资源 ID、需要不可枚举的 ID——用 nanoid 默认的加密随机版,又短又安全。

第二行,前端列表里临时元素的 key、不敏感的短码,而且追求生成速度——用 nanoid 斜杠 non-secure。

第三行,如果你要的是通用唯一 ID,或者要和系统里已有的 UUID 体系兼容——那就用 UUID v4。

第四行,主键需要时间有序,为了索引写入局部性或者按创建时间排序——用 UUID v7 或 ULID。

第五行,需要自定义字符集,比如纯数字验证码、去掉易混字符的可读码——nanoid 配 customAlphabet。

底下再强调一遍那个最该记的反例:当你的核心诉求是时间有序的时候,不要用 nanoid。这是它唯一明显不擅长的场景。其余绝大多数生成短而唯一 ID 的需求,nanoid 都很合适。
-->

---

# React 与 React Native

```tsx
// ❌ 别用 nanoid() 当 key：每次渲染都变，丢状态、掉性能
{todos.map((t) => <li key={nanoid()}>{t.text}</li>)}

// ✅ 用数据自带的稳定 ID
{todos.map((t) => <li key={t.id}>{t.text}</li>)}
```

<div v-click class="mt-3 text-sm">

- key 必须**渲染间稳定**；关联 label/input 用 React 18 的 `useId`
- **React Native** 缺 Web Crypto，需 polyfill 且**先于 nanoid 导入**：

</div>

```ts
import "react-native-get-random-values";
import { nanoid } from "nanoid";
```

<!--
两个高频的前端场景,容易踩坑。

第一,React 里的 key。看上面这个错误写法:在 map 里用 nanoid 当 key。为什么错?因为 React 的 key 要求在多次渲染之间保持稳定,React 靠它判断元素有没有变。而每次渲染都调一次 nanoid,每次都是新值,React 会以为整个列表全换了,导致组件状态丢失、性能下降。正确做法是用数据本身自带的稳定 ID,比如 todo.id。如果是给 label 和 input 做无障碍关联,用 React 18 的 useId,那是专门干这个的,不是用随机 ID 替代。

第二,React Native。它的默认环境缺少 Web Crypto 的 getRandomValues,直接用 nanoid 会失败。解法是装 react-native-get-random-values 这个 polyfill,而且关键是导入顺序:必须在 import nanoid 之前先 import 这个 polyfill,因为它要先把全局的 crypto 注入好,nanoid 加载时才能拿到。顺序颠倒了照样报错。
-->

---

# customRandom：替换随机源

```ts
import { customRandom, urlAlphabet } from "nanoid";
import seedrandom from "seedrandom";

const rng = seedrandom("my-seed");
const seededId = customRandom(urlAlphabet, 10, (size) =>
  new Uint8Array(size).map(() => 256 * rng())
);
seededId(); // 同 seed 可复现（如测试快照）
```

<div v-click class="mt-3 text-sm">

- 签名 `customRandom(alphabet, defaultSize, getRandom)`——第三参是随机字节生成器
- 用于**可种子化 / 自定义来源**的随机
- ⚠️ 版本间随机调用序列可能变，**跨版本不保证种子结果一致**

</div>

<!--
进阶 API:customRandom,用来完全替换随机字节的来源。

什么时候用?当你需要可复现的随机,比如测试里想要固定 seed 生成固定 ID 做快照对比;或者你有自己特殊的随机源。

看签名:customRandom 接收三个参数,字母表、默认长度,以及第三个最关键的——一个随机字节生成器函数,它接收 size、返回该长度的随机字节数组。这个例子里我们用 seedrandom 创建一个带种子的伪随机,塞进第三个参数,这样同一个 seed 每次跑出来的 ID 都一样。

注意 customRandom 和 customAlphabet 的区别:customAlphabet 只换字符集,随机源还是默认的;customRandom 换的是随机源本身。它内部仍然用拒绝采样保证均匀。

最后一个重要提醒:官方说 nanoid 版本之间可能改变随机生成器的调用序列,所以如果你依赖种子复现,升级 nanoid 版本后,同一个种子可能产出不同结果,跨版本不保证一致。做种子快照时心里要有数。
-->

---

# 纯 ESM 与 CommonJS 互操作

<div class="text-sm">

nanoid 5 是**纯 ESM**：`"type": "module"`，exports **无 `require`**。CJS 项目三条路：

</div>

```ts
// 路 1（最稳妥）：装 3.x，它有 CJS 产物
// npm install nanoid@3
const { nanoid } = require("nanoid"); // 仅 3.x 可

// 路 2：CJS 里用动态 import()（异步、合法）
const { nanoid } = await import("nanoid");
```

<div v-click class="mt-2 text-sm">

| Node | 在 CJS 里 require 纯 ESM 的 nanoid 5 |
|---|---|
| 22.12+ | 默认支持 `require(ESM)` |
| 20 | 需 `--experimental-require-module` |
| 18 | 不支持，用动态 `import()` 或 3.x |

</div>

<!--
这是 nanoid 5 最容易让人栽跟头的地方,单独一页讲清楚。

nanoid 5 是纯 ESM 包,package.json 里 type 是 module,而且 exports 字段里没有 require 这个条件——也就是说它根本不再发布 CommonJS 产物。如果你的项目还在用 require,直接装最新版会报错。

三条路。路一,最稳妥:装 nanoid@3,3.x 同时提供 CommonJS 产物,可以正常 require,代码几乎不用改,这是老项目最省事的做法。路二:在 CommonJS 文件里用动态 import,注意是函数式的 import 括号,它返回 Promise,在 CJS 里是合法的,但调用处要变成异步。

看这个表,讲第三条路:用 require 直接加载 ESM,这取决于 Node 版本。Node 22.12 及以上,默认就支持 require 一个同步的 ESM;Node 20 需要加 experimental-require-module 这个实验标志;Node 18 不支持,只能走动态 import 或者退回到 3.x。

一句话总结:CommonJS 项目优先用 3.x,新项目用 ESM 加 5.x,别在 5.x 上硬 require。
-->

---

# 3.x → 5.x 迁移要点

<div class="text-sm">

| 主题 | 3.x | 5.x |
|---|---|---|
| 模块系统 | ESM + CJS（可 require） | **纯 ESM** |
| `nanoid/async` | 有 | **已移除** |
| `nanoid/url-alphabet` | 独立子入口 | **已移除**（主入口导出 `urlAlphabet`） |
| `engines.node` | 较宽 | `^18 \|\| >=20` |
| 核心 API | nanoid / customAlphabet / customRandom | **不变** |
| 默认 21 / 64 字母表 | 同 | **不变** |

</div>

<div v-click class="mt-3 text-sm">

> 重点排查：残留的 `require('nanoid')`、`import 'nanoid/async'`、`'nanoid/url-alphabet'`。**核心 API 几乎不用改。**

</div>

<!--
如果你是从 nanoid 3 升到 5,这页是迁移清单。

看表,逐行过。模块系统:3.x 是 ESM 加 CJS 双产物、可以 require,5.x 是纯 ESM,这是最大的变化,上一页讲过了。第二,nanoid 斜杠 async 这个异步入口,3.x 有,5.x 已经移除了。第三,nanoid 斜杠 url-alphabet 这个独立子入口也移除了,现在 urlAlphabet 直接从主入口 nanoid 具名导出。第四,engines.node 收紧到了 18 加 20 以上。

但好消息在下面两行:核心 API,nanoid、customAlphabet、customRandom,完全不变;默认长度 21、默认字母表那 64 个字符,也完全不变。

所以迁移时真正要排查的就三处:第一,残留的 require nanoid;第二,import from nanoid 斜杠 async;第三,import urlAlphabet from nanoid 斜杠 url-alphabet,这个要改成从主入口导入。除了这三处和模块系统,业务代码里调用 API 的地方几乎不用动。迁移压力主要在 ESM 化,不在 API。
-->

---

# 实战要点

<div class="text-sm">

- **前缀区分类型**：`"user_" + nanoid()`，固定前缀不影响随机部分
- **CouchDB/PouchDB**：`_id` 不能以 `_` 开头 → 加前缀（默认字母表含 `_`）
- **CLI flag 冲突**：ID 可能以 `-` 开头被当选项 → `customAlphabet` 去掉 `-`
- **存库**：长度匹配的字符串列 + **大小写敏感 collation**（`A` ≠ `a`）
- **短码必评估**：用 nano-id-cc + 数据库唯一约束兜底
- **复用生成函数**：`customAlphabet` 提到模块级，别在热路径重建

</div>

<div v-click class="mt-3 text-sm">

> 生态：`nanoid-dictionary`（字母表预设）、`nanoid-good`（过滤不雅词）、`nano-id-cc`（碰撞计算器）。

</div>

<!--
把真实项目里会遇到的坑收成一页要点。

第一,给 ID 加业务前缀方便人眼区分类型,直接字符串拼接,比如 user 下划线加 nanoid,固定前缀和随机部分互不影响,类似 Stripe 的 cus_、pi_ 风格。

第二,CouchDB 和 PouchDB 的文档 _id 不能以下划线开头,而 nanoid 默认字母表恰好含下划线,可能凑巧以它开头,所以要加个固定前缀规避。

第三,默认字母表含连字符,ID 可能以连字符开头,被某些命令行参数解析器当成选项标志,解法是用 customAlphabet 去掉连字符。注意别用事后替换,替换会让目标字符概率翻倍、破坏均匀。

第四,存数据库:用长度匹配的字符串列,关键是排序规则要大小写敏感,因为 nanoid 区分大小写,大 A 和小 a 是不同的,如果用了大小写不敏感的 collation,会把不同的 ID 当成相等,破坏唯一约束。

第五,短码一定要用 nano-id-cc 评估碰撞,并加数据库唯一索引兜底。第六,customAlphabet 返回的生成函数提到模块级复用,别在循环里反复创建。

最后生态三件套:nanoid-dictionary 提供常用字母表预设,nanoid-good 确保 ID 不含不雅词,nano-id-cc 是在线碰撞计算器。
-->

---
layout: intro
---

# 总结

nanoid = **极小、安全、URL 友好的唯一 ID**

- 设计：默认 **21 字符 × 64 字母表 ≈ 126 位熵**，与 UUID v4 相当而更短
- 安全：默认 **crypto / Web Crypto** 加密随机；non-secure 版用 `Math.random()`
- 定制：`nanoid(size)` 改长度 / `customAlphabet` 换字母表 / `customRandom` 换随机源
- 碰撞：只看熵与生成量，**与时间无关**；短码用 nano-id-cc 评估
- 选型：短/URL 友好选 nanoid，**时间有序选 UUID v7 / ULID**
- 5.x：**纯 ESM**，CommonJS 用 `nanoid@3`

<!--
总结一下今天的 nanoid。

一句话:极小、安全、URL 友好的唯一 ID 生成器。

技术要点收成六条。

第一,设计:默认 21 个字符配 64 个字母表,约 126 位熵,和 UUID v4 相当,但字符更少、更短。记住熵等于 log2 字母表大小乘长度这个公式,所有定制都围绕它。

第二,安全:默认用 crypto 或 Web Crypto 的加密随机源,不可预测;追求快且不敏感的场景用 non-secure 版,它用 Math.random,但绝不能用在 token 这类安全场景。

第三,定制三件套:nanoid 传 size 改长度,customAlphabet 换字母表,customRandom 换随机源。

第四,碰撞:只和熵与生成总量有关,和生成时间无关,同一毫秒并发不增加碰撞;短码务必用 nano-id-cc 评估并加唯一约束。

第五,选型:要短、要 URL 友好、要不可枚举,用 nanoid;唯一的反例是需要时间有序的主键,那要用 UUID v7 或 ULID。

第六,版本:nanoid 5 是纯 ESM,CommonJS 项目用 nanoid@3,这是升级时最大的坑。

把这些串起来,nanoid 就是你需要又小又安全的唯一 ID 时,第一个该想到的工具。谢谢大家。
-->
