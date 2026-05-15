---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vee-validate
info: |
  Presentation Vee-validate for developers.

  Learn more at [https://vee-validate.logaretm.com/](https://vee-validate.logaretm.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:vue class="text-7xl" />
  <span class="text-7xl">✔️</span>
</div>

<br/>

## Vee-validate：Vue 表单的标准答案

校验、状态、提交、重置 —— 一套 hooks 全搞定（基于 v4）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vee-validate —— Vue 生态最流行的表单库。

它不提供 UI 控件，只解决"值收集 + 校验 + 提交"这件事。
-->

---
transition: fade-out
---

# 什么是 Vee-validate？

Vue 生态最流行的表单库，专注表单状态管理与校验

<v-click>

- **不提供 UI**：你可以搭 Element Plus、Naive UI、Vuetify 或裸 input
- **校验解耦**：Yup / Zod / Valibot 通过 `toTypedSchema` 任选其一
- **三种 API**：Composition / 声明组件 / Field + slot，可混用
- **类型完整**：schema → `values` / submit 参数全自动推导
- **动态字段**：`useFieldArray` 原生支持增删改换序
- **生态完整**：i18n / devtools / nuxt module / rules 子包

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Vee-validate_](https://vee-validate.logaretm.com/)

</div>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 三种使用风格

同一项目可混用，挑顺手的写

<v-clicks>

**Composition API（推荐）**
```ts
const { defineField, handleSubmit, errors } = useForm({ validationSchema })
const [email, emailAttrs] = defineField('email')
```

**声明式组件**
```vue
<Form :validation-schema="schema" @submit="onSubmit">
  <Field name="email" />
  <ErrorMessage name="email" />
</Form>
```

**Field + slot：接入第三方组件**
```vue
<Field name="role" v-slot="{ field }">
  <ElSelect v-bind="field" />
</Field>
```

</v-clicks>

---
transition: slide-up
---

# 安装与 Schema 适配器

```bash
pnpm add vee-validate
# 选一个 schema 库（任意三选一，也可以都不用）
pnpm add zod @vee-validate/zod
pnpm add yup @vee-validate/yup
pnpm add valibot @vee-validate/valibot
```

<v-click>

| 适配器     | 体积    | 类型推导 | 备注                |
| ---------- | ------- | -------- | ------------------- |
| zod        | ★★      | ★★★      | TS-first，主流首选  |
| yup        | ★★      | ★★       | 老牌库，文档最多    |
| valibot    | ★（最小） | ★★★    | tree-shake 最友好   |

</v-click>

<v-click>

需要 Vue 3.4+，v4.15 是当前主线。

</v-click>

---
transition: slide-up
---

# useForm：表单的中心枢纽

```ts {all|1-7|9-14|16-19}
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = toTypedSchema(
  z.object({ email: z.string().email(), password: z.string().min(8) })
)

const {
  values, errors, defineField, handleSubmit,
  meta, isSubmitting, submitCount, resetForm,
  setFieldValue, setErrors,
} = useForm({ validationSchema: schema })

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit((vals) => api.login(vals))
```

---
transition: slide-up
---

# defineField：拿到 [model, attrs]

```vue
<script setup lang="ts">
const [email, emailAttrs] = defineField('email')
// email      → Ref<string>，配 v-model
// emailAttrs → { onBlur, onInput, onChange ... }，配 v-bind
</script>

<template>
  <input v-model="email" v-bind="emailAttrs" />
</template>
```

<v-click>

**为什么不用 useField？**

v4.10+ 推荐 `defineField`。`useField` 需嵌在 `useForm` 上下文中，独立用会脱管，不参与提交也不被 schema 校验。新代码直接用 `defineField`。

</v-click>

---
transition: slide-up
---

# 校验时机：从激进到温和

<v-clicks>

**默认**：input / blur / model-update 都触发

```ts
const [email, emailAttrs] = defineField('email')  // 三个都开
```

**温和模式**：先 blur，出错后才 input 校验

```ts
const [email, emailAttrs] = defineField('email', (state) => ({
  validateOnModelUpdate: state.errors.length > 0,
}))
```

**只在 submit 时校验**

```ts
const [email, emailAttrs] = defineField('email', {
  validateOnModelUpdate: false,
  validateOnBlur: false,
})
```

</v-clicks>

---
transition: slide-up
---

# handleSubmit：提交与异常

```ts {all|1|3-9|11-13}
const { handleSubmit, isSubmitting } = useForm({ validationSchema })

const onSubmit = handleSubmit(
  async (values, actions) => {
    try {
      await api.post('/login', values)
      actions.resetForm()
    } catch (e) {
      actions.setErrors(e.response.data)
    }
  },
  // 失败回调：可选
  ({ errors }) => console.log('失败字段：', Object.keys(errors)),
)
```

<v-click>

`isSubmitting` 异步回调完成前一直为 `true`，按钮 `:disabled` 直接绑。

</v-click>

---
transition: slide-up
---

# errors / meta：状态都在 ref 里

```ts
const { errors, meta } = useForm({ validationSchema })
// errors.value         { email: '邮箱格式不正确', ... }
// meta.value.valid     boolean    整表是否全部通过
// meta.value.touched   boolean    至少一个字段失焦过
// meta.value.dirty     boolean    至少一个字段被改过
// meta.value.pending   boolean    异步校验进行中
```

<v-click>

**最佳实践**：只在 `touched` 后显示错误，避免一进页面就红字

```vue
<span v-if="meta.touched && errors.email">{{ errors.email }}</span>
```

</v-click>

---
transition: slide-up
---

# 声明式组件：Form / Field / ErrorMessage

```vue
<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
</script>

<template>
  <Form :validation-schema="schema" @submit="onSubmit" v-slot="{ meta, isSubmitting }">
    <Field name="email" type="email" />
    <ErrorMessage name="email" class="err" />

    <Field name="password" type="password" />
    <ErrorMessage name="password" class="err" />

    <button :disabled="!meta.valid || isSubmitting">登录</button>
  </Form>
</template>
```

<v-click>

Form 的默认 slot 还能拿到 `values` / `errors` / `submitCount` / `setFieldValue` 等。

</v-click>

---
transition: slide-up
---

# useFieldArray：动态字段

```ts
const { fields, push, remove, swap, move } = useFieldArray<{
  label: string; url: string
}>('links')
```

```vue
<template>
  <div v-for="(item, idx) in fields" :key="item.key">
    <Field :name="`links[${idx}].label`" />
    <Field :name="`links[${idx}].url`" />
    <button @click="remove(idx)">删除</button>
  </div>
  <button @click="push({ label: '', url: '' })">+ 新增</button>
</template>
```

<v-click>

注意路径用 `links[0].url`（方括号），不能写 `links.0.url`。

</v-click>

---
transition: slide-up
---

# 全局规则：Laravel 风格短表单

```ts
// main.ts
import { defineRule } from 'vee-validate'
import { all } from '@vee-validate/rules'

Object.entries(all).forEach(([name, rule]) => defineRule(name, rule))
```

```vue
<Field name="username" rules="required|min:6" />
<Field name="email" rules="required|email" />
<Field name="confirm" rules="confirmed:@password" />
<!-- @ 前缀引用同表单其它字段 -->
```

<v-click>

内置 30+ 规则：`required` / `email` / `min` / `max` / `numeric` / `url` / `regex` / `confirmed` / `image` / `mimes` / `size`...

</v-click>

---
transition: slide-up
---

# 错误消息本地化：@vee-validate/i18n

```ts
import { configure, defineRule } from 'vee-validate'
import { all } from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhCN from '@vee-validate/i18n/dist/locale/zh_CN.json'

Object.entries(all).forEach(([k, r]) => defineRule(k, r))

configure({
  generateMessage: localize({
    'zh-CN': { ...zhCN, names: { email: '邮箱地址' } },
  }),
})
setLocale('zh-CN')
```

<v-click>

40+ 内置语言包，`names` 字段映射字段显示名。

</v-click>

---
transition: slide-up
---

# TypeScript：schema 反向推导

```ts
const schema = toTypedSchema(
  z.object({
    email: z.string().email(),
    age: z.coerce.number().min(18),
  })
)

const { values, handleSubmit } = useForm({ validationSchema: schema })

handleSubmit((vals) => {
  vals.email  // string
  vals.age    // number （zod coerce 后）
})
```

<v-click>

`values.value` 自动带类型；IDE 补全嵌套路径 `links[0].url`。schema 与 API DTO 共享，前后端类型不再漂移。

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：字段多 / 跨字段校验 / 已有 Zod 或 Yup schema / 需要 i18n

不需要：只有 1-2 个 input / FormKit / Naive UI Form 已经够用

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://vee-validate.logaretm.com/" target="_blank">vee-validate.logaretm.com</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/logaretm/vee-validate" target="_blank">logaretm/vee-validate</a>
</div>
