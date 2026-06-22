---
theme: seriph
background: https://cover.sli.dev
title: Faker.js 假数据生成
info: |
  Faker.js 全指南：@faker-js/faker v10 + Vitest + Vue 3

  Learn more at [https://fakerjs.dev](https://fakerjs.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:data-table class="text-8xl" />
</div>

<br/>

## Faker.js 假数据生成

逼真但虚假的测试数据 · @faker-js/faker v10

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Faker.js 是生成「逼真但虚假」数据的库，前端开发者用它造测试 fixture、填充 Demo、无后端开发。
今天讲现代正确包 @faker-js/faker v10 的核心用法，重点是测试里的确定性 seed。
-->

---
transition: fade-out
---

# Faker 是什么？

生成逼真但虚假的数据

<v-click>

> "Faker generates fake (but reasonable) data" —— fakerjs.dev

- **单元 / 快照测试**：造 fixture、工厂对象
- **性能测试**：批量造大数据集
- **构建 Demo / 原型**：填充逼真界面
- **无后端开发**：前端先用假数据跑通流程

</v-click>

<v-click>

> 与本课读者（Vue 3 前端）高度契合：后端没好之前，先用 Faker 造数据把界面跑起来

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Faker 造的是「逼真但合理」的数据——像真实用户、订单、地址的样子，而不是随机乱码。四类典型用途：测试、性能、Demo、无后端开发。

[click] 对前端最实用的是「无后端开发」：接口还没好，先用 Faker 把列表、表单、卡片填满逼真数据，UI 先跑通。
-->

---
transition: fade-out
---

# 纠偏：用 @faker-js/faker，不是裸 faker

2022 marak 事件后的正确包

<v-click>

- **2022-01-04**：原作者 **Marak Squires** 蓄意破坏自己维护的 `faker.js` 和 `colors.js`，注入破坏代码并删库
- 成千上万依赖它的应用瞬间崩溃（业界称「colors.js / faker.js 事件」）
- 社区在 `@faker-js/faker` 组织下建立 **fork**，组 8 人团队接管维护

</v-click>

<v-click>

```bash
npm install faker            # ❌ 旧裸包，已废弃 / 不可信
npm install @faker-js/faker  # ✅ 现代正确包（带 scope）
```

> 教程或题目里出现裸 `npm install faker` 即为过时写法

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 2022 年初 Faker 经历了著名的供应链事件：原作者蓄意破坏自己的包并删库，导致大量应用崩溃。社区随即 fork 出 @faker-js/faker 由团队接管。

[click] 所以记住：现代正确的包是带 scope 的 @faker-js/faker。任何写裸 faker 的代码都是 2022 年之前的过时写法。
-->

---
transition: fade-out
---

# 安装与运行环境

dev 依赖 · Node 20+ · ESM-only

<v-click>

```bash
pnpm add @faker-js/faker --save-dev
```

- 只在测试 / 开发 / 构建期用 → **装为 devDependency**，不进生产包
- 最新版 **v10.5.0**（2026-06），大版本线 v10.x

</v-click>

<v-click>

| 要求 | 说明 |
| --- | --- |
| Node.js | **20+**（v20.19 / v22.13 / v24，v18 已不支持） |
| 模块格式 | **ESM-only**；CJS 项目需 Node 20.19+ 经 ESM-require |
| TS `moduleResolution` | `Bundler` / `Node20`(TS 5.9+) / `NodeNext` |

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 关键工程实践：Faker 只在测试和开发期用，必须装为 devDependency，绝不进生产 dependencies——它的数据集很大，没必要打进生产包。

[click] v10 提高了门槛：要求 Node 20+，并且是纯 ESM 包。CJS 项目仍可经 Node 的 ESM-require 使用，但 Node 版本要够新。TS 项目注意 moduleResolution 配置。
-->

---
transition: fade-out
---

# 模块体系总览

faker.<模块>.<方法>()

<v-click>

```ts
import { faker } from '@faker-js/faker' // 默认输出英文数据

faker.person.fullName()      // "Rowan Nikolaus"
faker.internet.email()       // "Kassandra.Haley@erich.biz"
faker.location.city()        // "Grand Rapids"
faker.number.int({ min: 1, max: 10 })
faker.string.uuid()
```

</v-click>

<v-click>

**v10 模块（部分）**：Person、Internet、Location、Finance、Commerce、Company、Date、Lorem、String、Number、Datatype、Helpers、Image、Color、Word……

> 统一形态 `faker.<模块>.<方法>()`；默认 `faker` 实例出**英文**数据

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Faker 的 API 形态非常统一：faker 点模块点方法。person 造人名，internet 造邮箱用户名，location 造地址，number 造数字，string 造 UUID。

[click] v10 有二十多个模块，覆盖人、网络、地址、金融、商品、公司、日期、文本等领域。默认的 faker 实例输出英文数据，本地化见后面。
-->

---
transition: fade-out
---

# 破坏性改名（v8）

模块大重排，最常考

<v-click>

| v7 旧写法 | v8+ 正确写法 | 变化 |
| --- | --- | --- |
| `faker.name.*` | **`faker.person.*`** | Name → Person |
| `faker.address.*` | **`faker.location.*`** | Address → Location |
| `faker.datatype.string()` | `faker.string.*` | String 拆为独立模块 |
| `faker.datatype.number()` | `faker.number.*` | Number 拆为独立模块 |

</v-click>

<v-click>

> v8 还**移除了运行时 locale 切换**（`faker.locale = ...`）→ 改为按需导入本地化实例（见后）

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v8 是最大的一次重排，也是最常考的改名。两个核心：name 改名 person，address 改名 location。同时把 string 和 number 从 datatype 里拆成独立模块。

[click] v8 还砍掉了运行时切换 locale 的能力——以前能 faker.locale 等于某语言，现在改为按需导入预构建的本地化实例。
-->

---
transition: fade-out
---

# 破坏性移除（v9）

清理废弃项

<v-click>

| v8 旧写法 | v9 正确写法 |
| --- | --- |
| `faker.datatype.number()` | **`faker.number.int()`** |
| `faker.datatype.float()` | `faker.number.float()` |
| `faker.random.alpha()` | `faker.string.alpha()` |
| `faker.random.word()` | `faker.lorem.word()` |
| `faker.helpers.unique()` | **移除** → enforce-unique |

</v-click>

<v-click>

> 整个 **`faker.random` 模块被移除**；`faker.datatype` 只剩 `boolean()` 等少量方法

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v9 清理了 v8 标记废弃的东西。最常见：datatype.number 彻底移除，改用 number.int。random 模块整个删掉，字母数字归 string，词归 lorem 或 word。helpers.unique 也移除了，后面专门讲替代。

[click] 记住两条：faker.random 整个模块没了；faker.datatype 缩水到只剩 boolean 等极少数方法。
-->

---
transition: fade-out
---

# 破坏性改名（v10）

ESM-only · 细节坑

<v-click>

| v9 旧写法 | v10 正确写法 |
| --- | --- |
| `faker.internet.userName()` | **`faker.internet.username()`** |
| `faker.internet.color()` | `faker.color.rgb()` |
| `faker.image.urlPlaceholder()` | `faker.image.url()` |
| `faker.image.avatarLegacy()` | `faker.image.avatar()` |

</v-click>

<v-click>

> **Word 模块默认策略改为 `'fail'`**：找不到符合条件的词会**抛错**而非返回随机词；恢复旧行为传 `{ strategy: 'any-length' }`

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v10 的改名比较细。最容易踩的坑：internet.userName 大写 N 改成了小写 n 的 username。还有 internet.color 移到 color.rgb，废弃的占位图相关方法也清理了。

[click] 另一个行为变更：Word 模块默认策略变成 fail，找不到符合长度条件的词会直接抛错，而不是退回随便给一个。要恢复旧行为得显式传 strategy any-length。
-->

---
transition: fade-out
---

# 基本 API 用法

person / internet / location / number / date

<v-click>

```ts
import { faker } from '@faker-js/faker'

faker.person.firstName('female')          // "Alice"
faker.person.jobTitle()                   // "Senior Brand Designer"
faker.internet.email({ firstName, lastName })
faker.internet.username()
faker.location.city()                     // 旧 address 已改名
faker.location.zipCode()
faker.number.int({ min: 18, max: 80 })    // 旧 datatype.number 已移除
faker.number.float({ fractionDigits: 2 })
faker.date.past()                         // 过去的某天
faker.date.between({ from: '2020-01-01', to: '2025-01-01' })
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 把常用模块串起来：person 的 firstName 可传性别参数保证一致；internet 的 email 可传姓名让邮箱和人对得上；location 造城市邮编；number.int 和 float 造数值，注意 float 精度参数是 fractionDigits；date 造过去未来或区间内的日期。这些就是日常造对象最常用的方法。
-->

---
transition: fade-out
---

# ⭐ 确定性：faker.seed()

测试务必 seed

<v-click>

```ts
faker.seed(123)
const a = faker.number.int()

faker.seed(123)              // 重设同一 seed → 序列复位
const b = faker.number.int()

console.log(a === b)         // true
```

</v-click>

<v-click>

- `faker.seed(123)`：固定随机种子，后续序列**可复现**
- `faker.seed()`（无参）：**返回当前 seed**，也用于「取消」固定
- 不 seed → 每次数据不同 → 断言 / 快照 **flaky**，CI 红绿随机

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] seed 是 Faker 在测试里最关键的能力。设定同一个种子，随机序列就完全可复现：seed 123 后取一个数，再 seed 123 取一个，两者相等。

[click] 注意 seed 的双重语义：传数字是固定，不传参数是返回当前 seed（也用来取消固定）。不 seed 的后果很严重——数据每次都变，断言和快照永远不稳定，CI 随机红绿。
-->

---
transition: fade-out
---

# seed 的作用范围与日期基准

实例级全局状态

<v-click>

- **seed 是实例级全局**：影响该实例后续**所有**模块调用，有副作用
- 多测试共享同一 `faker` → 前一个测试消耗的随机数会**影响**后一个
- 故需在 `afterEach(() => faker.seed())` 复位

</v-click>

<v-click>

```ts
// 相对日期默认以「现在」为基准 → 随真实时间漂移
faker.setDefaultRefDate('2023-01-01T00:00:00.000Z')
faker.date.past()  // 之后所有 date.* 以此固定基准，可复现
```

> ⚠️ 同一 seed **跨 Faker 版本不保证同输出**；升级后快照可能需重建

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] seed 是实例级的全局状态，有副作用。多个测试共享同一个 faker 实例时，前一个测试消耗了随机数会影响后一个的输出，所以标准做法是 afterEach 里无参 seed 复位。

[click] 日期类还要额外注意：past、recent 这些相对方法默认以「现在」为基准，会随真实时间漂移，要用 setDefaultRefDate 固定基准。还有一个常见误区——同一 seed 跨 Faker 版本不保证同输出，升级后快照可能要更新。
-->

---
transition: fade-out
---

# helpers 常用方法

组合与批量生成

<v-click>

```ts
faker.helpers.arrayElement(['free', 'basic', 'business']) // 取一个
faker.helpers.arrayElements(list, { min: 1, max: 3 })     // 取若干

faker.helpers.multiple(() => faker.person.fullName(), { count: 5 }) // 造数组

faker.helpers.fake('Hello {{person.lastName}}')           // mustache 模板

faker.helpers.weightedArrayElement([                      // 按权重取
  { weight: 5, value: 'common' },
  { weight: 1, value: 'rare' },
])
```

</v-click>

<v-click>

> `multiple(fn, {count})` 是造对象数组的**标准方式**；`fake()` 用 mustache 模板插值

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] helpers 是组合工具箱。arrayElement 从数组取一个，arrayElements 取若干。multiple 调函数多次返回数组，是造对象数组的标准方式。fake 接受 mustache 模板字符串做插值。weightedArrayElement 按权重取，可以模拟真实分布，比如大部分是 common 少量是 rare。

[click] 重点记两个：造一批用 multiple 加 count，模板拼接用 fake 加双花括号。
-->

---
transition: fade-out
---

# unique 已移除 → enforce-unique

唯一性的正确做法

<v-click>

- `faker.helpers.unique()` 曾用全局 store 记录已生成值，因**全局状态 / 内存泄漏**隐患在 **v9 移除**
- 官方首推迁移到第三方库 **`enforce-unique`**

</v-click>

<v-click>

```ts
import { UniqueEnforcer } from 'enforce-unique'

const enforcer = new UniqueEnforcer()
const name = enforcer.enforce(() => faker.person.firstName())

// 一次性批量不重复：
faker.helpers.uniqueArray(faker.internet.email, 100)
```

> 备选：`uniqueArray` 批量 / 自管 `Set` 撞重重试

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是高频纠偏点：faker.helpers.unique 在 v9 已经移除，原因是它用全局 store 记录重复值，有全局状态和内存泄漏隐患。官方首推迁移到第三方库 enforce-unique。

[click] 用法是 new 一个 UniqueEnforcer，然后 enforce 包住生成函数，撞重会自动重试。如果只是要一次性一批不重复，用内置的 uniqueArray 更直接。再不行就自己维护 Set 撞重重生成。
-->

---
transition: fade-out
---

# 本地化：fakerZH_CN

按需导入预构建实例

<v-click>

```ts
import { fakerZH_CN } from '@faker-js/faker' // 简体中文
import { fakerDE } from '@faker-js/faker'    // 德语

fakerZH_CN.person.fullName()  // "张伟"
fakerZH_CN.location.city()    // "上海"
```

</v-click>

<v-click>

```ts
// 多 locale 回退：按数组顺序取第一个命中的
import { base, de, de_CH, en, Faker } from '@faker-js/faker'
export const myFaker = new Faker({ locale: [de_CH, de, en, base] })
```

> v8 起本地化是**按需导入实例**，**不是** `faker.locale = 'zh_CN'`（已无）；支持 70+ locale

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 要中文数据就导入 fakerZH_CN 这个预构建实例，它的 person、location 会输出中文名和中国城市。每种语言对应一个 faker 加语言代码的导入名。

[click] 需要自定义或多语言回退，用 Faker 构造器传 locale 数组，按顺序取第一个含该数据的 locale。强调一个纠偏：v8 起本地化是按需导入实例，不再是运行时给 faker.locale 赋值——那种写法早就没了。
-->

---
transition: fade-out
---

# Vitest 工厂函数造 fixture

工厂 + overrides 是关键

<v-click>

```ts
import { faker } from '@faker-js/faker'
import type { User } from '@/types'

function createUser(overrides: Partial<User> = {}): User {
  const sex = faker.person.sexType()
  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName, lastName,
    email: faker.internet.email({ firstName, lastName }), // 与姓名一致
    age: faker.number.int({ min: 18, max: 80 }),
    ...overrides,                                          // 测试可覆盖关键字段
  }
}
const users = faker.helpers.multiple(createUser, { count: 10 })
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 工厂模式是 Faker 在测试里的标准用法，两个关键点：第一，字段间有依赖就按顺序生成并传参，比如先生成性别再生成对应名字，再把姓名传给 email，保证数据自洽。第二，加 overrides 参数，让调用方覆盖断言相关的字段。这样既能批量造逼真数据，又能对关键字段精确控制。最后用 multiple 造一批。
-->

---
transition: fade-out
---

# 喂组件 props + seed 复位

断言字段写死，避免 flaky

<v-click>

```ts
import { mount } from '@vue/test-utils'
import { beforeEach, afterEach, expect, it } from 'vitest'

beforeEach(() => faker.seed(2026)) // 固定 → 快照稳定
afterEach(() => faker.seed())      // 复位 → 不污染后续测试

it('renders user name', () => {
  const user = createUser({ firstName: 'Ada', lastName: 'Lovelace' })
  const wrapper = mount(UserCard, { props: { user } })
  expect(wrapper.text()).toContain('Ada Lovelace') // 断言字段已写死
})
```

</v-click>

<v-click>

> 要断言的字段用 `overrides` **写死**，不要依赖未 seed 的随机值

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 实战组合：beforeEach 固定 seed 让快照稳定，afterEach 无参 seed 复位避免污染后续测试。造组件 props 时，断言要用到的字段通过 overrides 写死，比如直接给 Ada Lovelace，再断言文本包含它。

[click] 一句话原则：要断言的字段就写死或覆盖，不要去断言一个未 seed 的随机值，否则测试 flaky。
-->

---
transition: fade-out
---

# 与 Zod 结合：zod-schema-faker

schema 驱动假数据

<v-click>

```ts
import { z } from 'zod'
import { faker } from '@faker-js/faker'
import { setFaker } from 'zod-schema-faker/v4'
import { fake } from 'zod-schema-faker'

setFaker(faker)

const Player = z.object({ username: z.string(), xp: z.number() })
const data = fake(Player)  // { username: "billie", xp: 100 }
```

</v-click>

<v-click>

- `zod-schema-faker` v2.1.1，支持 **Zod 3 / 4 / Mini**，底层 `@faker-js/faker` + randexp.js
- 从**已有 Zod schema** 一键生成 mock → schema 是单一事实来源，字段改了不用手动同步工厂

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 如果项目里已经用 Zod 定义了接口或表单 schema，zod-schema-faker 能直接把 schema 转成符合它的假数据。setFaker 注入 faker 实例后，fake 传一个 schema 就生成对应 mock。

[click] 它支持 Zod 3、4 和 Mini，底层就是 faker 加 randexp。最大价值是单一事实来源：mock 由 schema 驱动，schema 改字段后不用再手动改工厂函数。
-->

---
transition: fade-out
---

# 边界：Faker vs fast-check

目的不同，必须讲清

<v-click>

| 维度 | **Faker.js** | **fast-check**（属性测试） |
| --- | --- | --- |
| 目的 | 造**逼真样本**数据 | 造**任意 / 边界**输入 |
| 数据 | 落在「正常」分布 | 空、最值、特殊字符、NaN、负数 |
| 失败处理 | 无内置，靠记 seed | **shrinking** 收缩为最小反例 |
| 典型 | fixture、Demo、mock | 验证纯函数 / 不变量 |
| 一句话 | 「看起来像真数据」 | 「能不能打破我的代码」 |

</v-click>

<v-click>

> 互补不互斥：Faker 给 happy-path 逼真数据；**找边界 bug 用 fast-check**（Faker 不主动探测极端值）

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是核心边界题。Faker 造的是逼真样本，数据落在正常分布；fast-check 是属性测试，故意造任意和边界输入——空值、最大最小、特殊字符、NaN、负数。失败处理上 fast-check 有 shrinking，能自动把失败用例收缩成最小反例，这是 Faker 完全没有的。

[click] 两者互补：Faker 给 happy-path 的逼真数据，fast-check 给对抗性的边界数据找 bug。记住 Faker 不是用来探测边界的——它造的是「正常的中间地带」。
-->

---
transition: fade-out
---

# 最佳实践 + 反模式

<v-click>

**最佳实践 ✅**

- 测试**务必 seed**；需要随机覆盖面时再无参 `seed()` 解开
- 装为 **devDependency**，不进生产
- 字段间有依赖时按序生成并传参（`email({ firstName, lastName })`）
- 升级 Faker 后留意快照基线

</v-click>

<v-click>

**反模式 ❌**

- 用裸 `faker` / 已移除的 `unique` / `datatype.number` / `random.*` / `name` / `address`
- 不 seed 却断言具体随机值 → flaky
- 把 Faker 当「边界 / 对抗输入生成器」用

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最佳实践四条：测试务必 seed，需要随机覆盖面再解开；装 devDependency；有依赖的字段按序生成传参保证自洽；升级后留意快照。

[click] 反模式对应着记：别用裸 faker 和那些已移除改名的旧 API；别在不 seed 的情况下断言具体随机值；别把 Faker 当边界输入生成器——那是 fast-check 的活。
-->

---
layout: intro
transition: fade-out
---

# 总结速查

正确包 · 改名 · seed · 边界

- **包名**：`@faker-js/faker`（2022 marak 事件后的 fork），装 devDependency
- **环境**：v10.5.0，Node 20+，ESM-only
- **改名**：`name→person`、`address→location`(v8)；`datatype.number→number.int`、`random.*` / `unique` 移除(v9)；`userName→username`(v10)
- **seed**：`seed(n)` 固定 / `seed()` 取当前；测试必 seed + `afterEach` 复位
- **唯一性**：`unique` 已移除 → **enforce-unique**
- **边界**：Faker = 逼真样本；找 bug 用 **fast-check**（有 shrinking）

<div class="abs-br m-6 text-xl">
  <a href="https://fakerjs.dev" target="_blank" class="slidev-icon-btn">
    <carbon:data-table />
  </a>
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条核心记忆点：
1. 正确包是带 scope 的 @faker-js/faker，装 devDependency
2. v10 要求 Node 20+ 且 ESM-only
3. 改名链：v8 改 person/location，v9 移除 random 和 unique，v10 改 username
4. 测试必 seed，afterEach 复位
5. 唯一性迁移到 enforce-unique
6. Faker 造逼真样本，找边界 bug 用 fast-check
-->

---
layout: end
---
