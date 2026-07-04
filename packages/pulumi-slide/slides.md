---
theme: seriph
background: https://cover.sli.dev
title: Pulumi
info: |
  用真实编程语言写基础设施，底层仍是声明式期望状态引擎。

  基于 Pulumi v3 · 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Pulumi

用**真实编程语言**写 IaC，底层仍是**声明式**期望状态引擎

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<!--
Pulumi 让你用 TS/Python/Go 等真实语言描述基础设施，引擎再把现状收敛到期望状态。
-->

---
transition: fade-out
---

# 什么是 Pulumi

用你已经会的语言写 IaC，而非发明新 DSL

<v-clicks>

- **通用语言流派 IaC**：用 **TS / JS / Python / Go / C# / Java / YAML** 写云资源
- 循环 / 条件 / 函数 / 类 / 包 / 单测 / IDE 补全，**全部直接可用**
- **关键**：语言是命令式的，**模型仍是声明式**——你「搭出」一张期望状态图
- `new Bucket("b")` 只是**声明**它属于期望态，**不代表已创建**
- 引擎对比上次 state 算差异，把现状**收敛**到这张图

</v-clicks>

<div v-click class="mt-3 text-sm">

对比 Terraform / CloudFormation 的专用 DSL：Pulumi **不发明语言**

</div>

<!--
理解「语言命令式、模型声明式」是读懂 Pulumi 的第一把钥匙。
-->

---
transition: fade-out
---

# 三层架构：程序怎样变成基础设施

语言宿主 → 部署引擎 → provider

<div grid="~ cols-2 gap-4">

<div>

<v-clicks>

- **语言宿主**：跑你的程序，每 `new` 一次就向引擎发一个**资源注册**
- **部署引擎**：对比 state 算差异（`+ ~ +- -`），排序并尽量并行
- **provider**：真正调云 API；引擎**不直接**碰 AWS

</v-clicks>

</div>

<div v-click>

```text
index.ts
  │ new Bucket("b") → 注册(≠创建)
  ▼
语言宿主 nodejs
  ▼
部署引擎 ── 对比 state 算差异
  │ 「把桶建出来」
  ▼
AWS provider ── 调云 API
```

</div>

</div>

<div v-click class="mt-2 text-sm">

依赖天然形成：A 的 output 喂给 B 的 input，引擎**自动记录** B 依赖 A

</div>

<!--
注册不等于创建：程序跑完，引擎才拿到完整期望图再落地。
-->

---
transition: fade-out
---

# 核心工作流

preview → up → refresh → destroy

<div grid="~ cols-2 gap-4">

<div>

<v-clicks>

- **`pulumi new`**：从模板起项目（`aws-typescript`）
- **`pulumi preview`**：只算不做，列出 diff（≈ `plan`）
- **`pulumi up`**：跑程序 → 注册 → 比对 → 执行
- **`pulumi refresh`**：同步云上真实态，检测漂移
- **`pulumi destroy`**：拆除本 stack 全部资源

</v-clicks>

</div>

<div>

<div v-click>

变更符号：

```bash
+   create    # 新建
~   update    # 原地改
+-  replace   # 先建后删
-   delete    # 销毁
```

</div>

<div v-click class="mt-2 text-sm">

**幂等**：不改代码反复 `up`，第二次起都是「无变化」

</div>

</div>

</div>

<!--
生产先 preview 再 up；默认不主动核对现状，怀疑漂移才 refresh。
-->

---
transition: fade-out
---

# stack = 环境：一套程序，多份实例

隔离、可独立配置的实例，各有独立 config 与 state

<div grid="~ cols-2 gap-4">

<div>

<v-clicks>

- 一个环境一个 stack：`dev` / `staging` / `prod`
- 每个 stack **独立 config + 独立 state**，互不干扰
- 程序里用真实 `if` 按 `pulumi.getStack()` 分环境
- 命名可带层级：`org/project/stack`

</v-clicks>

</div>

<div v-click>

```bash
pulumi stack init prod   # 建并切换
pulumi stack ls          # 列出
pulumi stack select dev  # 切回
```

```ts
const env = pulumi.getStack();
const size = env === "prod"
  ? "m5.large" : "t3.micro";
```

</div>

</div>

<div v-click class="mt-2 text-sm">

两个 yaml：`Pulumi.yaml`（项目）+ `Pulumi.<stack>.yaml`（该栈 config，**该提交进库**）

</div>

<!--
stack 是部署基本单元；配置随 stack 走，代码用真实条件分叉。
-->

---
transition: fade-out
---

# Output&lt;T&gt;：Pulumi 的核心类型

资源属性是「创建后才知道」的异步值

<div grid="~ cols-2 gap-4">

<div>

<v-clicks>

- **`Input<T>`**：你能供给资源的值——普通值 / Promise / `Output<T>` 都收
- **`Output<T>`**：资源建后才有的异步值（ID/ARN/DNS），类似 promise
- **不能直接打印 / 拼接**——要进 `apply` 的世界
- 额外携带两条元信息：**依赖**与 **secret 标记**

</v-clicks>

</div>

<div v-click>

```ts
const b = new aws.s3.BucketV2("b");

// ❌ 拼出 "[object Object]"
const bad = "arn: " + b.arn;

// ✅ 进入 output 世界变换
const ok = b.arn.apply(
  a => `arn: ${a}`
);
```

</div>

</div>

<!--
任何来自资源的属性都是 Output，用它就得进 apply/all/interpolate。
-->

---
transition: fade-out
---

# 变换 Output：apply / all / interpolate

进得去出不来——变换的结果仍是 Output

<div grid="~ cols-2 gap-4">

<div>

- **`.apply(fn)`**：变换单个 output
- **`pulumi.all([...])`**：组合多个再变换
- **`pulumi.interpolate`**：模板串拼接（最常用）
- **`jsonStringify`**：含 output 的对象转 JSON

</div>

<div>

```ts
// 组合多个 output
const conn = pulumi
  .all([db.address, db.port])
  .apply(([a, p]) => `${a}:${p}`);

// 模板串拼接（最顺手）
const url = pulumi
  .interpolate`https://${lb.dnsName}`;
```

</div>

</div>

<div v-click class="mt-2 text-sm">

**依赖自动追踪**：引用 output 即建依赖 · **secret 传播**：secret 派生的 output 仍是 secret · ⚠️ 别在 `apply` 里 `new` 资源

</div>

<!--
interpolate 最顺手；apply 回调里是明文，别写日志、别在里面建资源。
-->

---
transition: fade-out
---

# 语言红利：消除重复 + 可测试

真实语言最直观的两处价值

<div grid="~ cols-2 gap-4">

<div>

**用原生循环 / 条件 / 抽象**（非 HCL count/for_each）

```ts
// 造一批子网 = 普通 map
const subnets = azs.map((az, i) =>
  new aws.ec2.Subnet(`sn-${az}`, {
    vpcId: vpc.id,
    cidrBlock: `10.0.${i}.0/24`,
  }));
```

</div>

<div>

**给基础设施写单测**（`setMocks` 不碰云）

```ts
pulumi.runtime.setMocks({
  newResource: a => ({
    id: `${a.name}_id`,
    state: a.inputs,
  }),
  call: a => a.inputs,
});
```

</div>

</div>

<div v-click class="mt-2 text-sm">

可复用 Jest / pytest / go test；代价是语言太自由 → 需自律保证**确定性**

</div>

<!--
循环条件抽象是相对 HCL 的红利；setMocks 拦截创建，毫秒级跑单测。
-->

---
transition: fade-out
---

# Component Resource：封装与复用

把一组资源封装成对外表现为单个资源

<div grid="~ cols-2 gap-4">

<div>

编写三步：

<v-clicks>

- `class X extends pulumi.ComponentResource`
- `super("包:模块:类型", …)` 传 **type token**
- 子资源全传 **`{ parent: this }`**，结尾 `registerOutputs({})`

</v-clicks>

</div>

<div>

```ts
export class SecureBucket
  extends pulumi.ComponentResource {
  constructor(name, args, opts) {
    super("illegal:s3:SecureBucket",
      name, {}, opts);
    new aws.s3.BucketV2(
      name, {}, { parent: this });
    this.registerOutputs({});
  }
}
```

</div>

</div>

<div v-click class="mt-2 text-sm">

**复用三层**：程序内 函数/循环 → 跨程序/语言 Component + Package → 跨栈 `StackReference`

</div>

<!--
平台团队把安全默认烘焙进组件；Package 可跨语言消费，Stack Reference 跨栈组合。
-->

---
transition: fade-out
---

# 配置与密钥

每栈参数存 `Pulumi.<stack>.yaml`，secret 默认加密进 state

<div grid="~ cols-2 gap-4">

<div>

**配置**（CLI 设、代码读）

```bash
pulumi config set aws:region us-west-2
pulumi config set --secret db S3cr37
```

```ts
const c = new pulumi.Config();
c.require("name");     // 缺则抛错
c.requireSecret("db"); // 加密 Output
```

</div>

<div>

**secret 要点**

<v-clicks>

- 带命名空间 `aws:region`，漏 `aws:` provider 读不到
- secret 经组合**仍是 secret**、state 里加密
- ⚠️ 物理 ID **永远明文**，别塞敏感值

</v-clicks>

</div>

</div>

<div v-click class="mt-2 text-sm">

secret provider：默认 Pulumi Cloud（每栈独立密钥）/ `passphrase` / `awskms://` / `azurekeyvault://` / `gcpkms://`

</div>

<!--
配置只能读不能写；要编程改配置用 Automation API。物理 ID 明文是常见坑。
-->

---
transition: fade-out
---

# state 与后端

state = 资源元数据；后端负责存 state

<div grid="~ cols-2 gap-4">

<div>

<v-clicks>

- **Pulumi Cloud**（默认）：`login` 即用，自带并发锁 / 历史 / 协作 / 密钥托管
- **DIY 自管**：S3 / Azure Blob / GCS / 本地文件 / PostgreSQL
- DIY 只有基础文件锁，备份 / 访问控制**自负** → 团队优先 Cloud
- 换后端用 `pulumi stack export / import` 搬家

</v-clicks>

</div>

<div v-click>

```bash
pulumi login              # Cloud
pulumi login --local      # file://~
pulumi login s3://<bucket>
pulumi login azblob://<c>
pulumi login gs://<bucket>
pulumi login \
  postgres://u:p@host/db
```

</div>

</div>

<!--
state 是真相来源；Pulumi 默认不主动核对现状，怀疑漂移用 refresh。
-->

---
transition: fade-out
---

# provider 生态：原生 + 桥接

调云 API 的插件 + SDK，四种形态

<v-clicks>

- **桥接（bridged）**：用 **Terraform Bridge** 包装任意 TF/OpenTofu provider——AWS/GCP 等大量包如此而来
- **原生（native）**：按云 API 规范生成，更新更快更贴原生（Azure Native、Kubernetes）
- **参数化（parameterized）**：安装时传参、本地生成 SDK（`pulumi package add terraform-provider …`）
- **动态（dynamic）**：仅 TS/Python，内联声明自定义资源逻辑

</v-clicks>

<div v-click class="mt-3 text-sm">

**战略意义**：TF 生态几乎任何 provider 都能桥接进 Pulumi → 「provider 覆盖度」不再是选型痛点

</div>

<!--
桥接让 provider 覆盖不再是短板；原生 provider 贴合云 API 更新最快。
-->

---
transition: fade-out
---

# 自动化与策略即代码

把 Pulumi 嵌进你的工程

<div grid="~ cols-2 gap-4">

<div>

**Automation API**

<v-clicks>

- 用 SDK **在程序里驱动引擎**（up/preview/destroy），不经 CLI
- 场景：CI/CD、集成测试、**自助平台 / IDP**、包成 REST 服务
- inline（无独立 `Pulumi.yaml`）/ local 两种程序

</v-clicks>

</div>

<div>

**CrossGuard 策略**

<v-clicks>

- 策略包用 TS / Python / **OPA Rego** 写，`preview`/`up` 时拦违规
- 层级：policy → pack → group（生产更严）
- `enforcementLevel`：advisory / mandatory / remediate
- 也能管 Terraform / CloudFormation 资源

</v-clicks>

</div>

</div>

<!--
Automation API 让「自助平台」成为可能，是相对 Terraform 的差异能力；策略即代码在部署前拦违规。
-->

---
transition: fade-out
---

# 非确定性风险：自由的代价

图灵完备语言 → 你「能」写出引擎无法安全处理的程序

<v-clicks>

- **逻辑名必须稳定**：用 `Math.random()` / `Date.now()` 拼 `new Res("名")` → 两次运行改名 → **误删重建**
- **副作用**：每次 preview/up 都完整跑程序，网络/IO 使结果不可复现——保持程序尽量纯
- **重构爆炸半径**：改逻辑名 / 挪层级触发替换 → 用 `aliases` 声明旧名保住资源
- **抽象过度**：真实语言太能抽象，约定「基础设施代码优先直白」

</v-clicks>

<div v-click class="mt-3 text-sm">

**对策 = 工程化**：CI 跑 `preview` 门禁 + CrossGuard 拦违规 + 单测锁行为 + pin provider 版本

</div>

<!--
这是通用语言 IaC 最大的心智负担；用工程纪律补住自由的代价，红利才不反噬。
-->

---
transition: fade-out
---

# 与 Terraform 选型

同为声明式 IaC，核心分野：真实语言 vs HCL DSL

<div grid="~ cols-2 gap-4">

<div>

| 维度 | Pulumi | Terraform |
| --- | --- | --- |
| 语言 | 真实语言 | HCL DSL |
| state | 默认 Cloud | 默认本地 |
| secrets | **默认加密** | 默认不加密 |
| 可编程 | Automation API | 无 |
| 许可 | Apache 2.0 | BUSL 1.1 |

</div>

<div>

<v-clicks>

- **选 Pulumi**：团队写代码、要抽象/测试/跨语言复用、要自助平台、看重 state 加密
- **选 TF / OpenTofu**：偏好 DSL 的克制、组织已标准化 HCL、运维主导
- **provider 覆盖不再是决定因素**（Pulumi 能桥接）

</v-clicks>

</div>

</div>

<div v-click class="mt-2 text-sm">

迁移：`pulumi convert --from terraform`（转代码）· `pulumi import`（纳管已有资源）

</div>

<!--
决策落在语言 vs DSL、团队画像、state/secrets/策略/许可偏好；provider 覆盖两边高度重叠。
-->

---
layout: center
transition: fade-out
---

# 一句话小结

**用真实语言搭出一张声明式资源图，Pulumi 负责把现状收敛到它**

<div class="mt-4 text-sm opacity-80">

命令式语言写 · 声明式引擎跑 · stack 分环境 · Output 串依赖 · secret 默认加密 · 桥接全生态 · 自律保确定性

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.pulumi.com/docs/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/pulumi/pulumi" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/engineering/iac/pulumi/" target="_blank" class="slidev-icon-btn">
    <carbon:notebook />
  </a>
</div>

<!--
记住这一句：命令式语言搭图，声明式引擎收敛。谢谢！
-->
