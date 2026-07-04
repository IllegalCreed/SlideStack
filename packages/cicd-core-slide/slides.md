---
theme: seriph
background: https://cover.sli.dev
title: CI/CD 核心机制
info: |
  持续集成 / 持续交付 / 持续部署的通用机制。

  基于 CI/CD 通用模型（GitHub Actions / GitLab CI 为例）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# CI/CD 核心机制

用流水线把软件交付变得**持续、自动、可复现**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<!--
本节讲工具无关的 CI/CD 理论地基：把 GitHub Actions、GitLab CI、Jenkins 都当成同一套机制的方言。
-->

---
transition: fade-out
---

# CI / CD 到底指什么

一个缩写，三层含义，别混

<v-clicks>

- **CI 持续集成**：**高频**把小改动合入主干，每次自动**构建 + 测试** —— 尽早暴露冲突
- **CD-交付 Continuous Delivery**：自动准备到「随时可发布」，上生产**需人工放行**
- **CD-部署 Continuous Deployment**：通过全部检查**自动上生产**，无人工闸门
- 交付 vs 部署的**唯一区别**：最后一步是否需要人点头（高频考点）
- 目标：缩短**反馈环** + 降低**发布风险**

</v-clicks>

<!--
CI 的本质是频繁集成的习惯，不是「有台服务器在跑测试」。
-->

---
transition: fade-out
---

# CI 的本质：频繁集成

「上了 CI 工具」≠「在做 CI」

<v-clicks>

- 理想：开发者**每天至少一次**把小批量改动合入主干
- 各自在长命分支憋很久才合 → 退化成「偶尔集成」→ 合并地狱
- 配套：**主干开发** + **特性开关**隐藏未完成功能，才敢频繁合
- 自动化构建/测试只是**手段**，频繁集成才是**前提**

</v-clicks>

<!--
频率是 CI 的核心变量。
-->

---
transition: fade-out
---

# 流水线模型：Stage / Job / Step

`Pipeline ⊃ Stage ⊃ Job ⊃ Step`

<div grid="~ cols-2 gap-4">

<div>

- **Stage**：阶段（build→test→deploy），**顺序**推进
- **Job**：作业，同 Stage 内**默认并行**
- **Step**：步骤，Job 内**串行**
- **Runner**：真正执行 Job 的机器/进程

</div>

<div>

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
  test:
    needs: build    # DAG 依赖
    steps: [{ run: npm test }]
```

</div>

</div>

<!--
needs 打破「必须等整个 Stage」的粗粒度，按真实依赖并行。
-->

---
transition: fade-out
---

# 触发器 · needs · matrix

流水线何时跑、怎么编排

<div grid="~ cols-2 gap-4">

<div>

**触发器**

- push / PR / tag
- 定时 cron
- 手动 dispatch
- webhook

</div>

<div>

**编排提速**

- `needs`：只等指定前置 → DAG
- `matrix`：一份定义展开多维并行
- `concurrency`：同 PR 取消过时构建

</div>

</div>

<!--
matrix 如 node×os，用少量配置覆盖多维兼容测试。
-->

---
transition: fade-out
---

# artifact vs cache

一字之差，语义天壤

| | artifact 制品 | cache 缓存 |
| --- | --- | --- |
| 用途 | 交付/传递的**产物** | **加速**用的复用物 |
| 可靠性 | 须可靠保存/传递 | 尽力而为、可失效 |
| 例子 | 构建包、报告 | node_modules、编译缓存 |
| 失败后果 | 丢产物=出错 | 只是变慢 |

<div v-click class="mt-2 text-sm">

**cache key 绑 lockfile 哈希**；Job 间靠**上传/下载 artifact** 传产物（环境隔离）

</div>

<!--
把长期发布物存进会过期的 artifact，是常见坑。
-->

---
transition: fade-out
---

# 部署策略：蓝绿 / 金丝雀 / 滚动

三种降低发布风险的姿势

<v-clicks>

- **蓝绿**：两套对等环境，验证后**整体切流量**，旧环境留作**秒级回滚**
- **金丝雀**：**小流量灰度**（1%→5%→…），指标无恙再扩大、快速止损
- **滚动**：**逐批替换**实例直到全量，控制同时不可用数
- **回滚**能力压低 **MTTR** → 团队才敢高频发布

</v-clicks>

<!--
金丝雀重「小流量验证再扩大」，滚动重「平滑替换实例」。
-->

---
transition: fade-out
---

# 构建一次，到处部署

同一制品晋级各环境，差异用配置注入

<v-clicks>

- 用 **digest 锁定**的同一产物依次上 staging → prod
- **测过的正是上线的**，消除各环境构建差异
- 环境差异（地址/密钥/开关）**运行时注入**，而非重新编译
- **幂等部署**：执行一次或多次结果一致 → 可安全重试
- **可复现构建**：锁依赖 + 固定镜像 + 去随机/时间

</v-clicks>

<!--
不可变制品 + 构建一次，是快速可靠回滚的前提。
-->

---
transition: fade-out
---

# 安全（一）：密钥与 OIDC

密钥是 CI 的重灾区

<v-clicks>

- 存平台**加密 Secret** → 运行时注入 → 日志**打码**
- **禁止**：明文写进 YAML / 打进镜像层 / 打印到日志
- **OIDC 无密钥**：CI 出示**短时令牌**换云端**临时凭据**
- → 仓库无需存长期密钥，按仓库/分支/环境细粒度授信
- **fork PR 默认不给密钥**（不可信外部代码会窃取）

</v-clicks>

<!--
OIDC 是 2026 安全部署到云的主流方案。
-->

---
transition: fade-out
---

# 安全（二）：供应链加固

制品与依赖也要防篡改

<v-clicks>

- **临时 Runner**：每 Job 全新环境跑完销毁，防残留污染
- 第三方 Action 用**完整 SHA 固定**，防可变标签被劫持
- **SLSA / provenance**：可验证制品来源与构建过程
- **缓存投毒**：隔离作用域、fork 只读、键绑内容哈希
- **最小权限**：令牌只给最小必要，缩小爆炸半径

</v-clicks>

<!--
@v3/@main 可被上游移动指向恶意代码，SHA 不可变。
-->

---
transition: fade-out
---

# 用 DORA 度量效能

四个指标：两看吞吐、两看稳定

| 指标 | 衡量 | 类别 |
| --- | --- | --- |
| 部署频率 | 多久部署一次 | 吞吐 |
| 变更前置时间 | 提交→上线耗时 | 吞吐 |
| 变更失败率 | 生产变更致故障比例 | 稳定 |
| MTTR | 故障→恢复耗时 | 稳定 |

<div v-click class="mt-2 text-sm">

**吞吐与稳定可兼得**（非此消彼长）；代码行数**不是** DORA 指标

</div>

<!--
别混淆变更前置时间（速度）与 MTTR（稳定）。
-->

---
transition: fade-out
---

# 关键实践

让流水线又快又可靠

<v-clicks>

- **主干开发**：小批量高频合入 + 特性开关，避免合并地狱
- **左移**：测试/安全/质量检查尽量提前到 PR 阶段
- **流水线即代码**：配置进仓库，可版本控制/Review/复现
- **快慢测试分层**：PR 跑快测试，全量 E2E 放合并后
- **DevSecOps**：安全扫描自动化进流水线做质量门

</v-clicks>

<!--
慢流水线会摧毁反馈价值，靠并行+缓存+affected+分层提速。
-->

---
layout: center
class: text-center
---

# 小结

**CI** 频繁集成 · **CD** 交付（人工放行）/ 部署（自动上生产）

流水线 = Stage/Job/Step + Runner + 触发器
提速 → **needs/DAG · matrix · cache≠artifact · 质量门**
发布 → **蓝绿 / 金丝雀 / 滚动 + 快速回滚**
安全 → **加密 secret · OIDC · SHA 固定 · 最小权限**
度量 → **DORA 四指标**

<div class="mt-6 text-sm opacity-70">
先懂机制，再看 GitHub Actions / GitLab CI / Jenkins 只是方言
</div>

<!--
吃透这套通用模型，任何 CI 工具都能对号入座。
-->
