---
theme: seriph
background: https://cover.sli.dev
title: Module Federation 模块联邦
info: |
  Module Federation —— 模块级联邦、运行时化、2026 微前端事实主线：联邦概念与心智模型、shared 版本治理、MF 2.0 运行时化、生态、Native Federation、与应用级方案的选型
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:network-3 class="text-8xl" />
</div>

<br/>

## Module Federation

模块级联邦 · 运行时化 · 无沙箱 —— 把「跨应用共享一个模块」标准化成「跨应用的动态 import()」

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Module Federation（模块联邦，MF）把「一个应用在运行时加载另一个独立部署应用所导出的模块」标准化成一套架构方案。本章只讲架构层：概念、治理、运行时化、生态、Native Federation、选型；exposes/remotes/shared 的插件配置语法归 webpack 章。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**MF 是模块级、运行时、无沙箱的联邦方案 —— 2026 微前端事实主线**

<v-click>

- **联邦概念与心智模型**：host/remote 双向联邦、模块级 vs 应用级复用、运行时 vs 构建时组合、remoteEntry/manifest
- **shared 版本治理**：singleton 最高版本获胜、requiredVersion/strictVersion、双端声明、版本地狱
- **MF 2.0 运行时化**：从 webpack fork 独立、Runtime SDK、registerRemotes、mf-manifest.json、运行时插件
- **MF 2.0 生态**：类型联邦、DevTools、预加载、跨构建工具（Rspack 内置 / 官方 Vite）
- **Native Federation**：ESM + Import Maps、esbuild、bundler-agnostic、Angular 背书
- **vs 应用级方案选型**：无沙箱的代价、混用叠加、模块级 vs 应用级决策树

</v-click>

<v-click>

> **只讲架构层** —— `exposes`/`remotes`/`shared` 的插件配置语法归 webpack 章，本章讲「为什么」与「怎么选」。

</v-click>

<!--
六个主题顺序推进：先立概念（去中心化、host/remote、两段式加载），再看 shared 治理，然后 2.0 运行时化与生态，接着 Native Federation 这个原生底座平替，最后放回全景做选型。配置一律链接不复述。
-->

---

# MF 一句话：跨应用的动态 import()

宿主在运行时去另一个应用的产物里 import 一个**模块**，而不是挂载整个子应用

<v-click>

| 维度 | 应用级方案（qiankun/wujie） | Module Federation |
| --- | --- | --- |
| **组合粒度** | 整个子应用（一条路由一个 app） | **单个模块**（组件/函数/store） |
| **核心动作** | 挂载 / 卸载子应用（生命周期） | 跨应用 `import` 一个模块 |
| **隔离** | JS 沙箱 + 样式隔离（重） | **无沙箱**，同 `window`（轻，需自律） |
| **依赖共享** | 各应用自带 or import maps | **运行时 semver 协商**（shared） |
| **典型诉求** | 老系统渐进拆分、强隔离 | 团队共享 UI/逻辑、去重大依赖 |

</v-click>

<v-click>

> 记住三个定位词：**模块级 + 运行时 + 无沙箱** —— 它与 qiankun 系不是竞品，是不同层次，常叠加使用。

</v-click>

<!--
MF 回答的问题是「五个应用都要用同一套设计系统、同一份 React，怎么让它们运行时共享而不是各打各的」——这是模块级共享；「把订单系统和商品系统拼进一个后台壳」才是应用级组合。心智起点不同。
-->

---

# 一分钟历史脉络：从 webpack 特性到独立运行时

「MF = webpack 插件」是停在 2020 的过时认知

<v-click>

| 时间 | 节点 |
| --- | --- |
| **2020** | webpack 5 内置 MF（Zack Jackson 提出）—— 1.0 时代，此时 **MF 确实 = webpack 特性** |
| **2024-04** | **MF 2.0 公告**：字节 Web Infra + Zack Jackson 把 MF 从 webpack **fork 成独立项目**，运行时抽成 SDK |
| **2024 → 2026** | 生态外扩：Rspack 内置、官方 Vite 插件、类型联邦、DevTools；横跨五六种打包器 |
| **2026-06** | `@module-federation/enhanced` **v2.6.x**、月度迭代，微前端领域**事实主线** |

</v-click>

<v-click>

> 2024 之后的 MF 是一个**独立的微前端运行时**，webpack 只是它支持的众多打包器之一。

</v-click>

<!--
这条线解释了为什么「MF = webpack 插件」过时：那句话停在 2020 的 1.0 时代。2024 之后 MF 是独立运行时，这也是本章把「配置」（webpack 章）与「架构」（本章）分开讲的原因。
-->

---
layout: section
---

# 联邦概念与心智模型

去中心化的对等节点，可兼任的 host / remote

---

# 去中心化：MF 的第一性原理

官方定义：**JavaScript 应用去中心化的架构模式，类似服务端微服务**

<v-click>

- **微服务里没有「主服务」**：每个服务独立部署、通过网络互相调用
- **MF 里也没有「主应用」**：每个前端应用独立构建部署、通过运行时加载互相调用**模块**
- host 直接点名「我要 `shop` 这个 remote 的 `./Button`」——**没有中间的登记调度者**

</v-click>

<v-click>

| | single-spa（中心化编排） | Module Federation（去中心化联邦） |
| --- | --- | --- |
| 结构 | root-config 作「大脑」注册所有子应用 | **无大脑**，host 直接点名要谁的模块 |
| 拓扑 | 树状层级（shell / child） | **对等网络**（peer network） |

</v-click>

<v-click>

> 去中心化带来两个结构后果：**双向**（host/remote 可兼任）与**按需**（两段式加载）。

</v-click>

<!--
「去中心化，类似服务端微服务」这句类比是理解一切的钥匙：没有主应用，只有可互相加载模块的对等节点。这与 single-spa 的中心化编排（root-config 作大脑）形成鲜明对比。
-->

---

# host / remote 与双向联邦

两个角色不是互斥身份，而是可叠加的能力

<v-click>

| 角色 | 官方别名 | 声明什么 | 产出 / 行为 |
| --- | --- | --- | --- |
| **remote** | Provider / 生产者 | `exposes`：我导出哪些模块 | 构建出 `remoteEntry.js` / `mf-manifest.json` 清单 |
| **host** | Consumer / 消费者 | `remotes`：我从哪些 remote 加载 | 运行时取清单 → 按需拉模块 → 执行 |

</v-click>

<v-click>

```text
        exposes ./Header ─────────────►
  App A                                   App B
        ◄───────────── exposes ./Chart
  （A 用 B 的 Chart，B 也用 A 的 Header —— 对等，无主从）
```

</v-click>

<v-click>

> 一个应用可**同时** `exposes` 与 `remotes` → **双向联邦**。MF 本身不规定谁做壳，需在架构层自己约定。

</v-click>

<!--
关键在于这两个角色不是互斥身份，而是可叠加的能力。对比 single-spa「root-config 在上、子应用在下」的树状层级，MF 是对等网络。这在架构上意味着没有天然的壳应用，需要自己约定。
-->

---

# 模块级复用 vs 应用级复用

MF 与 qiankun 系最本质的分界

<v-click>

| 层面 | 模块级复用（MF） | 应用级复用（qiankun/wujie） |
| --- | --- | --- |
| **复用单位** | 一个模块：组件、hook、函数、store | 一个子应用：带路由的完整 SPA |
| **加载动作** | 跨应用 `import()` 一个导出 | `mount(container)` 挂载整应用 |
| **谁在同一 realm** | 联邦模块与宿主**共享 `window`/React 实例** | 子应用被沙箱**隔离**在代理 `window` |
| **通信** | **直接函数调用 / 共享内存**（同 realm） | 跨沙箱：props / 全局状态 / 事件 |
| **去重依赖** | shared scope 协商，**真共用一份实例** | 各自打包或 import maps（不共实例） |

</v-click>

<v-click>

> **MF 让两个应用「像同一应用里的两个模块」**——同 realm、可直接调用、共用依赖实例，这正是它能共享 React context、共用一个 store 实例的原因。代价是失去隔离。

</v-click>

<!--
一句话：MF 让两个应用像同一应用里的两个模块那样共享代码；qiankun 让两个应用像两个隔离租户那样共存于一页。这解释了为什么 MF 能做到 qiankun 做不到的事——共享 React context、共用一个 Redux store 实例，因为它们本就在同一个 realm。
-->

---

# remoteEntry / manifest：联邦的「目录」

host 加载 remote 的模块是**两段式**的

<v-click>

```text
第 1 段（取目录）：host fetch remote 的入口清单
    remoteEntry.js  或  mf-manifest.json
    └─ 写着：exposes 了 ./Button ./Chart…
             shared 了 react@18.3 react-dom@18.3…
             各 chunk 的 URL、（2.0）类型文件地址

第 2 段（按需取货）：host 真的 import("shop/Button") 时
    └─ 才拉 ./Button 的 chunk 并执行
       shared 先查 share scope，能复用就不重复下载
```

</v-click>

<v-click>

- **remoteEntry 不是「一大包代码」，而是「导出目录 + 加载器」**
- 架构价值 = **解耦部署**：remote 重新部署、清单 URL 不变，host 下次运行时自动拿新版——**无需重构 host**

</v-click>

<!--
remoteEntry 不是一大包代码，而是导出目录 + 加载器。它的架构价值在于解耦部署：remote 重新部署、清单 URL 不变，host 下次运行时自动拿到新版本——这正是「独立部署」在 MF 里的落地方式。mf-manifest.json 是它的结构化升级版，让类型联邦、预加载、DevTools 成为可能。
-->

---

# 运行时组合 vs 构建时组合

同样是「host 加载 remote」，时机可在构建时也可在运行时

<v-click>

| | 构建时组合 | 运行时组合 |
| --- | --- | --- |
| **remote 列表来自** | 构建配置（编译期写死） | Runtime SDK 运行时注册（`registerRemotes`） |
| **改动 remote 需** | 重新构建 host | **不用重构**，改配置/接口即可 |
| **典型能力** | 静态、可 tree-shake、类型好推 | 灰度发布、A/B、动态上下线、按环境切源 |
| **心智** | 编译期把 remote 织进依赖图 | 运行期像插件一样装载 remote |

</v-click>

<v-click>

- MF 1.0（webpack 时代）以**构建时**为主——`remotes` 写在配置里
- MF 2.0 把**运行时**也做成一等公民：`createInstance` + `registerRemotes` 让 remote 清单**运行时才确定**

</v-click>

<v-click>

> 「哪些微前端在线、用哪个版本」从**构建期决策**变成**运行期决策**——MF 从「打包技术」升维成「微前端运行时」的核心。

</v-click>

<!--
MF 1.0 以构建时为主，remotes 写在配置里。MF 2.0 把运行时也做成一等公民：createInstance + registerRemotes 允许 remote 清单运行时才确定，甚至来自服务端接口。这是 MF 从打包技术升维成微前端运行时的核心。
-->

---

# 正交的三个词：联邦 / 编排 / 共享

看清了整个微前端的坐标就立起来了

<v-click>

| 词 | 管什么 | 谁的本命 |
| --- | --- | --- |
| **编排（orchestration）** | 谁在什么路由 mount/unmount **整应用** | single-spa / qiankun |
| **联邦（federation）** | 谁能 import 谁的**模块** | Module Federation |
| **共享（sharing）** | 一份依赖如何被多方复用 | shared / import maps |

</v-click>

<v-click>

- **编排 ⟂ 联邦**：编排在应用级决定「装谁」，联邦在模块级决定「谁能引谁的模块」——正因正交，二者能叠加
- **联邦 ⊃ 共享的一种实现**：MF 的 `shared` 是「共享」的一种运行时实现，import maps 是另一种

</v-click>

<v-click>

> 记牢这张表，就不会再纠结「MF 和 qiankun 谁替代谁」——它们分别是**联邦**与**编排**的代表，压根不在同一层。

</v-click>

<!--
三个词正交、各管一层：编排管「谁在什么路由 mount 整应用」，联邦管「谁能 import 谁的模块」，共享管「一份依赖如何被多方复用」。看清这张表，就不会纠结 MF 和 qiankun 谁替代谁。
-->

---
layout: section
---

# shared 版本治理

把「运行时协商」买来的独立部署，用治理策略赎回确定性

---

# 为什么 shared 是治理问题

MF 把依赖版本的裁决从「构建期集中裁定」搬到「运行时现场协商」

<v-click>

| | 集中裁定（externals + import maps） | 运行时协商（MF shared） |
| --- | --- | --- |
| **版本裁决者** | import map 维护者（**单点、可审计**） | scope 里最高版本参与者（**分散、动态**） |
| **何时确定** | 部署时（改一行 JSON） | **运行时**（页面加载那一刻现场协商） |
| **你的 lockfile** | 基本等于真相 | **可能说了不算** |

</v-click>

<v-click>

> 运行时协商买到的是**独立部署**（remote 换版本不必惊动 host），卖出去的是**版本的可预测性**。治理，就是用策略把卖出去的那部分**有选择地赎回来**。

</v-click>

<!--
这个问题的根源是一次权力转移：版本裁决从 import map 维护者（单点可审计）转移到 share scope 里的最高版本参与者（分散动态）；确定时机从部署时移到运行时；你的 lockfile 可能说了不算。治理就是用策略把版本确定性有选择地赎回。
-->

---

# singleton 与 lockfile 失效：治理的靶心

`singleton: true` 时 scope 内只留一份，版本不一致则**加载较高版本、低版本方仅告警**

<v-click>

> 你在 `package.json` 锁了 `react@18.2.0`，但某个 remote 带着 `react@18.3.1` 进场——**整个页面跑的就是 18.3.1**。这不是 bug，是 singleton 的**定义行为**。

</v-click>

<v-click>

- **lockfile 不是防线**：防线必须建在**所有参与方的版本范围收敛**上，而非单方 lockfile
- **最高版本获胜 = 升级风险会「传染」**：一个团队激进升级 React，会让所有共享它的 remote 被动跑上新版本
- **告警不等于安全**：低版本方只收到控制台告警，直到某个 API 在新版被移除才炸

</v-click>

<!--
治理要瞄准的头号现象是「你跑的不是你锁的版本」。三个直接启示：lockfile 不是防线（防线在全体收敛）；最高版本获胜让升级风险传染；告警不等于安全，要决定是否升级成硬失败（strictVersion）。
-->

---

# 治理光谱：从 semver 到 strictVersion

治理就是为不同依赖**选择光谱上的档位**

<v-click>

```text
宽 ────────────────────────────────────────────► 严
 不设 requiredVersion      requiredVersion         strictVersion
 （纯 semver 协商）        （不合 → 控制台告警）    （不合 → 拒绝该共享）
 图省事、风险自负          默认档、能跑但会漂        有 fallback 用 fallback
                                                   无 fallback → 运行时抛错
```

</v-click>

<v-click>

- **全局状态库**（React/Vue/状态管理）→ **singleton + 收敛的 requiredVersion**，关键库上 **strictVersion**
- **无状态工具库**（lodash/dayjs）→ 可宽松，甚至**不共享**（各自带一份，换独立升级权）
- **设计系统 / 内部 SDK** → singleton + strictVersion + 明确版本基线

</v-click>

<v-click>

> `strictVersion` 把「版本漂移」这个潜伏到生产才发作的 bug，**提前到联调 / CI 以显式错误暴露**——用可控失败换不可控怪象。

</v-click>

<!--
MF 提供的策略字段本质是一条宽容到严格的光谱。为全局状态库选严（singleton + strictVersion），为无状态工具选宽甚至不共享。strictVersion 的价值常被低估：它把版本漂移从潜伏到生产的 bug 提前到联调/CI 以显式错误暴露。
-->

---

# shareStrategy：把版本策略连到可用性

表面是「协商积极程度」，实质是一道**可用性 / 容错决策**

<v-click>

| 策略 | 行为 | 代价 / 适用 |
| --- | --- | --- |
| **`version-first`**（默认） | 初始化即**拉一遍所有 remote 入口**，登记各家版本保证「最高版本」裁决准确 | **任一 remote 离线 → 启动期白屏**；适合 remote 高可用 |
| **`loaded-first`** | 优先复用**已加载**的副本，remote 按需再拉 | 版本可能非全局最优，换**启动性能 + 离线容错**；适合可用性无保证的生产 |

</v-click>

<v-click>

- 默认的 `version-first` 把**版本正确性置于可用性之上**——它假设所有 remote 都在线
- 生产系统若无法保证每个 remote 可用，应显式改用 `loaded-first` + 错误兜底

</v-click>

<v-click>

> 这是**架构决策**，不是能默认糊弄过去的配置项——「一个 remote 拖垮整站」的风险要主动摘掉。

</v-click>

<!--
shareStrategy 表面是协商积极程度，实质是可用性/容错决策。默认 version-first 把版本正确性置于可用性之上，假设所有 remote 在线。生产系统若无法保证可用性，应显式改 loaded-first + 错误兜底。
-->

---

# 组织治理：谁拥有 shared 名单

MF 的 shared 失控，几乎都源于**没有单一负责人**

<v-click>

1. **中心化的共享依赖契约**：平台/架构组维护「哪些库进 scope、哪些 singleton、版本基线、哪些上 strictVersion」，业务方**遵从而非各自决定**
2. **版本收敛机制**：用共享 preset / 依赖机器人让关键库版本**主动趋同**——让「最高版本获胜」退化成「大家本就同版本」
3. **可观测巡检**：CI 采集所有 remote 的 **mf-manifest.json**，做跨 remote 版本一致性检查

</v-click>

<v-click>

两条底线钉死：

- **shared 名单按需最小**——每个共享项都是一份「必须协同升级」的构建耦合（Fowler），从「不共享」起步
- **同一依赖不要混用 import maps + MF shared**——两套解析必然双份实例、singleton 名存实亡

</v-click>

<!--
shared 失控几乎都源于没有单一负责人。有效治理需要三件组织层的事：中心化契约、版本收敛机制、基于 mf-manifest.json 的 CI 巡检。两条底线：名单按需最小（Fowler：每个共享项都是协同升级负担）；同一依赖别混两套解析。
-->

---

# 落地：一份共享依赖契约示例

平台/架构组该维护、业务方该遵从的东西

<v-click>

| 依赖 | 共享？ | singleton | 版本策略 | 理由 |
| --- | --- | --- | --- | --- |
| `react` / `react-dom` | ✅ | ✅ | strictVersion | 全局状态，两份实例必崩 |
| `react-dom/`（尾斜杠） | ✅ | ✅ | 同上 | 漏尾斜杠 → `client` 打进第二份 |
| 设计系统 `@org/ui` | ✅ | ✅ | strictVersion | 跨团队一致性，漂移即断裂 |
| 状态管理 `@org/store` | ✅ | ✅ | strictVersion | 单实例才有意义 |
| `dayjs` / `lodash` | ❌ | — | — | 无状态、体积小，换独立升级权 |
| 业务小工具 | ❌ | — | — | Fowler：小到可以重复 |

</v-click>

<v-click>

> **反模式钉死**：只在一端声明 shared（静默双份）· 漏尾斜杠 · 拿 lockfile 当版本防线 · 同一依赖混用 import maps + MF shared。

</v-click>

<!--
把策略收敛成一张可以直接抄的契约表：全局状态库与设计系统 singleton + strictVersion，无状态工具不共享。反模式：只一端声明、漏尾斜杠、lockfile 当防线、混用两套解析。契约变更走评审——抬高共享库下限会传染给所有人。
-->

---
layout: section
---

# MF 2.0 运行时化

把运行时能力从 webpack 里搬出来，做成独立 SDK

---

# 2.0 是一次「从 webpack 里搬出来」

2024-04-26 由字节 Web Infra + Zack Jackson + 社区从 webpack 5 fork 出来、重设计为独立项目

<v-click>

> 官方公告总纲：**「原本内嵌在 Webpack 里的运行时能力，已被抽取出来形成一个独立的 SDK。」**

</v-click>

<v-click>

- **MF 1.0**：webpack 5 内置——`ModuleFederationPlugin` 把模块共享**编译进** webpack，前提是「你在用 webpack」
- **MF 2.0**：联邦的「加载 + 版本协商」**不再需要 webpack 参与**
- webpack / Rspack 插件从此只干**编译期**一件事：把 `import("shop/Button")` 改写成对 runtime 的调用、产出 manifest
- **运行期真正加载模块、协商 shared 的，是那个独立 runtime**——这就是「运行时化」

</v-click>

<!--
要理解 2.0，先看它从哪来。1.0 是 webpack 内置特性。2024-04-26 官方发布 2.0 公告，把 MF 从 webpack fork 出来做成独立项目。一句话架构后果：联邦的加载 + 版本协商不再需要 webpack，插件只干编译期织入，运行期真正干活的是独立 runtime。
-->

---

# Runtime SDK：脱离构建工具

`@module-federation/enhanced/runtime` 可在**无任何构建插件**的纯运行时里联邦

<v-click>

```ts
// 纯运行时：不需要 webpack/Rspack 的 MF 插件也能联邦
import { createInstance } from "@module-federation/enhanced/runtime";

// ① 建联邦实例：声明自己是谁、初始有哪些 remote
const mf = createInstance({
  name: "mf_host", // 本宿主名
  remotes: [
    { name: "shop", entry: "https://cdn.example.com/shop/mf-manifest.json" },
  ], // entry 指向 remote 的结构化清单，而非一大包代码
});

// ② 运行时加载 remote 暴露的模块（等价于「跨应用 import」）
const { add } = await mf.loadRemote("shop/util");
```

</v-click>

<v-click>

> `loadRemote` 先读清单、再按需拉 chunk，全程活在运行时。构建插件用法只是这套 runtime 的**编译期糖衣**，底层同一内核。

</v-click>

<!--
运行时化的落点是 Runtime SDK。最小用法：createInstance 建实例、loadRemote 加载模块。entry 指向清单而非一大包代码。这套流程完全活在运行时，webpack 不在场。构建插件用法只是编译期糖衣，底层同一内核。
-->

---

# registerRemotes：把「哪些 remote」变成运行期决策

remote 不必在启动时定死——2.0 相对 1.0 最重要的能力跃迁

<v-click>

```ts
import { createInstance } from "@module-federation/enhanced/runtime";

// 初始为空，remote 列表运行时才确定
const mf = createInstance({ name: "mf_host", remotes: [] });

// 从服务端/配置中心拿到「当前该加载哪些 remote、哪个版本」后再注册
const list = await fetch("/api/active-microfrontends").then((r) => r.json());
mf.registerRemotes(
  // 版本/灰度由服务端决定，前端不重构
  list.map((m) => ({ name: m.name, entry: m.manifestUrl })),
);
```

</v-click>

<v-click>

由此解锁的能力——1.0「remotes 编译期写死」做不到：

- **灰度发布**（给部分用户注册新版 remote）· **A/B 实验**（按分流注册不同 remote）· **动态上下线**（配置中心一改，前端无需发版）

</v-click>

<!--
createInstance 的 remotes 是初始列表，但 registerRemotes 可以在运行时追加/动态注册。架构意义：哪些微前端在线、各用哪个版本，从构建期决策变成运行期决策。灰度、A/B、动态上下线在 1.0 的编译期写死模型里做不到。
-->

---

# mf-manifest.json：联邦的公共协议

2.0 新增的**结构化清单**，比裸 remoteEntry.js 多带元信息

<v-click>

```jsonc
// 一个 remote 的「自我描述」（示意，真实字段更多）
{
  "name": "shop",
  "exposes": [{ "id": "shop:Button", "name": "Button", "path": "./Button" }], // 我导出了什么
  "shared": [{ "name": "react", "version": "18.3.1", "singleton": true }], // 我共享哪些依赖及版本
  "remotes": [], // 我又依赖哪些别的 remote
  "types": { "path": "@mf-types.zip" }, // 类型联邦的类型包地址
}
```

</v-click>

<v-click>

正因为版本、导出、类型都被**结构化**写下，这些能力才成为可能：

- **版本治理巡检**（CI 采集 shared 版本）· **类型联邦**（拉 `types`）· **预加载**（chunk 信息）· **DevTools**（可视化依赖图）

</v-click>

<!--
运行时化需要一份机器可读的联邦契约，这就是 mf-manifest.json。它比裸 remoteEntry.js 多带 exposes/shared/remotes/chunks/type。正因为结构化，才使版本治理巡检、类型联邦、预加载、DevTools 成为可能——它是 2.0 生态的公共数据源。
-->

---

# 运行时插件机制：可插拔的加载生命周期

把「模块加载」拆成一串**生命周期钩子**，开放成 Runtime Plugin System

<v-click>

```ts
const mf = createInstance({
  name: "mf_host",
  remotes: [{ name: "shop", entry: "https://cdn.example.com/shop/mf-manifest.json" }],
  plugins: [
    {
      name: "resilience-plugin", // 一个运行时插件 = 一组钩子
      // remote 加载失败时兜底：返回降级模块，避免整页崩
      errorLoadRemote(args) {
        return { default: () => null };
      },
    },
  ],
});
```

</v-click>

<v-click>

- 常见钩子：`beforeInit` / `beforeRequest` / `afterResolve` / `onLoad` / `errorLoadRemote`
- 把**重试、鉴权、按环境切源、降级兜底、埋点监控**从「散落在业务里」收敛成「可复用的运行时插件」

</v-click>

<!--
MF 2.0 把模块加载拆成一串生命周期钩子，开放成 Runtime Plugin System。它把重试、鉴权、按环境切源、降级兜底、埋点监控这些横切关注点从散落在业务里收敛成可复用的运行时插件。这套机制正是生态里 retry、预加载、DevTools 的统一底座。
-->

---

# MF 1.0 vs 2.0 对比

一张表看清「运行时化」改变了什么

<v-click>

| 维度 | MF 1.0 | MF 2.0 |
| --- | --- | --- |
| **载体** | webpack 5 内置 | **独立项目**（2024-04 fork） |
| **构建工具** | 必须 webpack | **脱离构建工具**（运行时 SDK） |
| **运行时 API** | 无 | `createInstance` / `registerRemotes` |
| **清单** | 裸 `remoteEntry.js` | **mf-manifest.json**（结构化） |
| **类型 / 可观测** | 手写 `.d.ts`、无工具 | **类型联邦 + DevTools + 运行时插件** |
| **跨构建工具** | 仅 webpack | **Rspack 内置** / Vite / Rollup / Metro |

</v-click>

<!--
一张表看清运行时化改变了什么：载体从 webpack 内置变独立项目，从必须 webpack 变脱离构建工具，多了运行时 API、registerRemotes、mf-manifest.json、类型联邦、DevTools、运行时插件、跨构建工具。维护方从 Zack Jackson 一人变字节 Web Infra + Zack Jackson。
-->

---
layout: section
---

# MF 2.0 生态

围绕独立 runtime 长出的一整圈工具

---

# 类型联邦：补上跨 remote 的 TypeScript

联邦模块天生的「类型黑洞」：运行时能拿到，编译时 TS 不认识

<v-click>

- **问题**：`import("shop/Button")` 运行时有真实模块，但它是另一个独立部署应用的产物，**不在你的 `node_modules` 里**
- **1.0 时代**：只能手写 `.d.ts`，随 remote 改动而腐烂

</v-click>

<v-click>

- **2.0 类型联邦**：remote 构建时用 DTS 插件**自动生成类型包**、写进 manifest 的 `types` 字段；host 拉取后获得 remote 模块的**真实 TS 类型**，本地开发**实时同步**

</v-click>

<v-click>

> 联邦模块从此享有和本地模块一样的类型安全与 IDE 智能提示——这是 MF 相对「裸 `import()` + 手写声明」的 import maps 路线的实打实优势。

</v-click>

<!--
联邦模块有天生的类型黑洞：运行时能拿到，编译时 TS 不认识（不在 node_modules 里）。1.0 只能手写 .d.ts。2.0 类型联邦用 DTS 插件自动生成类型包、写进 manifest 的 types 字段，host 拉取后获得真实类型，本地实时同步。
-->

---

# Chrome DevTools：让联邦可观测

去中心化的代价是**难排查**——一个页面加载了哪些 remote、各自哪个版本，肉眼看不见

<v-click>

- **可视化**：展示模块依赖关系、各 remote 的配置，把「哪份 React 在跑、谁加载了谁」变成可点开的图
- **本地代理 + 热更新**：把线上某个 remote 的清单指向本机 dev server，在完整线上环境里**联调单个 remote**

</v-click>

<v-click>

> 对比 import maps 路线只能靠「读 JSON + 看 network 面板」推断，MF DevTools 把依赖解析可视化——这是 InfoQ 把「工具化成熟度」列为 MF 规模化差异点的原因之一。

</v-click>

<!--
去中心化的代价是难排查。MF 2.0 的 Chrome DevTools 插件把联邦依赖图可视化，并支持本地代理 + 热更新，把线上某个 remote 指向本机 dev server 联调。对比 import maps 只能读 JSON + 看 network 面板，这是工具化成熟度的差异点。
-->

---

# 预加载：拍平请求瀑布

联邦默认加载是**串行瀑布**：拉 manifest → 解析 → 拉 chunk → 又发现依赖 shared……每步都等上一步

<v-click>

```ts
// 运行时预加载：把「用到才发现要加载」的串行往返，提前并行拉好
mf.preloadRemote([
  {
    nameOrAlias: "shop",
    resourceCategory: "all", // all=同步+异步资源；sync=仅同步
    exposes: ["Button"], // 只预取 shop 的 Button，不整包拉
    filter: (assetUrl) => assetUrl.indexOf("ignore") === -1, // 过滤无关资源
  },
]);
```

</v-click>

<v-click>

> `resourceCategory` / `exposes` / `filter` 三个旋钮**精准预取**而非无脑全拉；再叠加 SSR、data prefetch，共同把去中心化的额外网络往返代价降回可接受。

</v-click>

<!--
联邦默认加载是串行瀑布：每一步都要等上一步返回。preloadRemote 把这条瀑布提前拍平，配合 resourceCategory/exposes/filter 三个旋钮精准预取。再往上还有 SSR、data prefetch 继续压缩首屏。
-->

---

# 跨构建工具：2.0 最大的红利

任何能产出「协议 chunk + manifest」的打包器都能加入联邦

<v-click>

| 构建工具 | MF 支持方式 | 状态 |
| --- | --- | --- |
| **webpack 5** | `ModuleFederationPlugin` + `enhanced` | 发源地，一等支持 |
| **Rspack** | **内置 MF v1.5** + `enhanced`（2.0） | **一等支持、开箱内置** |
| **Vite** | **官方 `@module-federation/vite`** | **活跃**（周级更新） |
| **Vite（社区旧）** | `originjs/vite-plugin-federation` | **已停滞**（Vite 7 不兼容） |
| Rollup / Rolldown / Rsbuild / Metro | 官方插件 | 支持（含 RN 联邦） |

</v-click>

<v-click>

> 构建工具选择与联邦能力**解耦**了——webpack 产的 host 能联邦 Rspack/Vite 产的 remote。「MF = webpack 插件」自此过时。

</v-click>

<!--
运行时化最直接的兑现是摆脱对 webpack 的绑定。两个要点钉死：Rspack 内置 MF v1.5，要 2.0 增强再叠 enhanced；Vite 官方 @module-federation/vite 直接接官方 runtime，取代停滞的 originjs（约一年未更、Vite 7 不兼容）。「MF 在 Vite 上只有 originjs」是过时信息。
-->

---

# @module-federation/* 包地图

认清分工能少走弯路

<v-click>

| 包 | 角色 | 说明 |
| --- | --- | --- |
| `@module-federation/runtime` | **运行时内核** | 与构建工具无关的联邦 runtime |
| `@module-federation/enhanced` | **增强插件 + runtime** | webpack/Rspack 的 2.0 全家桶 |
| `@module-federation/vite` | **Vite 官方插件** | 接官方 runtime，取代 originjs |
| `@module-federation/bridge-react` · `-vue3` | 框架 **bridge** | 桥接带路由的整页面 |
| `@module-federation/dts-plugin` | 类型联邦 | 生成/消费 remote 的 `.d.ts` |
| `@module-federation/node` | SSR / Node | 服务端联邦、SSR 支持 |

</v-click>

<v-click>

> 记忆：**`runtime` 内核 · `enhanced` webpack/Rspack 全家桶 · `vite` 官方入口 · `bridge-*` 应用级页面桥接 · `node` SSR。**

</v-click>

<!--
生态能力分散在一组包里：runtime 是内核，enhanced 是给 webpack/Rspack 的 2.0 全家桶，vite 是给 Vite 的官方入口，bridge-* 把模块级联邦补出应用级页面桥接，dts-plugin 管类型，node 管 SSR。它们跟随 enhanced 的 v2.6.x 月度迭代。
-->

---

# bridge：让模块级联邦也能承载整页面

MF 天生模块级（`loadRemote` 拿到一个组件），但常需联邦一整个带路由的页面

<v-click>

- `bridge-react` / `-vue3` 在模块级之上包一层**应用级适配**：remote 把「整个子应用」exposes 成桥接单元，host 用 bridge 渲染进容器并托管路由
- 于是 MF 覆盖**全谱**：细粒度用裸 `loadRemote`，整页面用 bridge

</v-click>

<v-click>

- **但 bridge 仍是无沙箱的**（同 realm）——它挂的是**不隔离**的整应用，隔离靠自律而非框架兜底
- 要不要这层隔离，正是模块级与应用级路线的分水岭

</v-click>

<v-click>

> **差异化壁垒**（InfoQ）：MF 的护城河不是「能加载远程模块」，而是围绕**运行时版本协商**长出的一整圈治理与工具——类型、可观测、预加载、跨工具、内建错误边界。

</v-click>

<!--
MF 天生模块级，但实践常需联邦带路由的整页面，这是 bridge 的作用：在模块级之上包一层应用级适配。于是 MF 覆盖全谱。但 bridge 仍是无沙箱的，挂的是不隔离的整应用——要不要隔离正是模块级与应用级的分水岭。MF 的护城河是围绕运行时协商长出的治理与工具。
-->

---
layout: section
---

# Native Federation

同一套联邦心智，换一副浏览器原生底座

---

# 同一个心智，换一副底座

官方：「API 面与 MF 非常相似，重心在可移植性与 ECMAScript 模块、Import Maps 这些标准」

<v-click>

| 联邦概念 | webpack MF 的底座 | Native Federation 的底座 |
| --- | --- | --- |
| **remote 加载** | `remoteEntry.js` + **自有运行时容器** | 标准 **ESM** 产物 + `remotes` 清单 |
| **shared 去重** | share scope 运行时 semver 协商 | **Import Map** 声明映射，交浏览器解析 |
| **模块解析** | MF runtime 接管 | **浏览器原生模块系统** |
| **构建** | webpack/Rspack 插件织入 | **esbuild**（经 Angular ApplicationBuilder） |

</v-click>

<v-click>

> 立意（Manfred Steyer）：**「把联邦的理念与具体打包器彻底解耦」**。MF 2.0 靠自造跨打包器 runtime 脱离 webpack；Native Federation 更激进——**直接押注浏览器已原生具备的 ESM + Import Maps**。

</v-click>

<!--
学完 MF 再看 Native Federation，最省事的理解是：心智没变，底座换了。你依然讲 host/remote、依然 exposes、依然声明 shared，变的只是底下靠什么实现。MF 2.0 靠自造跨打包器 runtime 脱离 webpack；Native Federation 更激进，直接押注浏览器原生的 ESM + Import Maps。
-->

---

# 为什么现在能押注「原生」

可行性建立在一个**平台事实**上

<v-click>

- **Import Maps 已 Baseline Widely available（自 2023-03 起）**，主流浏览器普遍支持
- 原生化之前：同页多版本、裸说明符映射只能靠 **SystemJS** 这类 polyfill 模拟
- 原生化之后：这些能力**内置于浏览器**，SystemJS 退居「兼容化石浏览器」的历史层

</v-click>

<v-click>

```html
<!-- Native Federation 运行时的核心其实就是一张原生 Import Map（示意） -->
<!-- 必须在任何模块加载前声明；shared 依赖在此映射到唯一 URL 实现去重 -->
<script type="importmap">
  {
    "imports": {
      "react": "https://cdn.example.com/react@18.3.1/index.js",
      "shop/Button": "https://cdn.example.com/shop/Button-a1b2.js"
    }
  }
</script>
```

</v-click>

<!--
Native Federation 的可行性建立在一个平台事实上：Import Maps 已 Baseline Widely available（2023-03 起）。原生化之前靠 SystemJS 模拟，之后内置于浏览器。于是运行时可以极薄：remote 产出标准 ESM，host 用一张 Import Map 声明去哪取、哪些共享，加载缓存去重全交给浏览器。
-->

---

# bundler-agnostic：适配器包装现有打包器

「不依赖打包器」≠「不用打包器」——它仍需打包器编译成 ESM，只是**不绑定某一个**

<v-click>

```text
Native Federation 编译期
      │
      ├─ 适配器（可替换 exchangeable adapter）
      │        │
      │        ├─ esbuild（Angular ApplicationBuilder 默认）
      │        ├─ 其他打包器…
      │        └─ CLI 未来的新能力…
      └─ 产出：标准 ESM + import map + 联邦清单
```

</v-click>

<v-click>

- **换打包器只换适配器**：上层联邦语义（exposes/remotes/shared）与产物形态（ESM + import map）不变
- Angular 集成里适配器委托给 **Angular ApplicationBuilder**（用 esbuild）——**既得联邦、又得 esbuild 构建速度**

</v-click>

<!--
不依赖打包器不等于不用打包器：它仍需打包器编译成 ESM，只是不绑定某一个。官方架构：编译期是现有打包器之上的一层包装，通过可替换适配器与底层打包器通信。换打包器只换适配器，上层联邦语义与产物形态不变。Angular 侧委托给 ApplicationBuilder，用 esbuild。
-->

---

# 与 webpack MF 的取舍

别把它们看成对立两代——**同一心智的两种底座实现**

<v-click>

| 维度 | webpack/Rspack MF（2.0） | Native Federation |
| --- | --- | --- |
| **底座** | 打包器编译 + 自有运行时容器 | **原生 ESM + Import Maps** |
| **构建器绑定** | 需 MF 插件（webpack/Rspack/官方 Vite） | **适配器包装任意打包器**（走 esbuild） |
| **生态厚度** | 厚：类型联邦、DevTools、预加载、bridge | 相对薄，聚焦可移植 + 标准 |
| **官方背书** | 字节 Web Infra + Zack Jackson | **Manfred Steyer / Angular** |
| **甜区** | 多团队、要治理/工具的规模化联邦 | Angular、贴标准、不愿绑私有运行时 |

</v-click>

<v-click>

> 两条路在**收敛**：MF 2.0 的官方 Vite 插件、拥抱原生 ESM，和 Native Federation 押注的 import maps，方向一致。注意：两者清单格式**不互通**，是另一套实现，不能直接混联邦。

</v-click>

<!--
别把它们看成对立两代，而是同一心智的两种底座实现。MF 2.0 生态更厚、治理与工具更全；Native Federation 更贴浏览器标准、更可移植、在 Angular 生态有官方地位。两条路在收敛。但注意：两者清单格式不互通，是另一套实现，不能假设产物直接混联邦。
-->

---
layout: section
---

# 与应用级方案的选型

要共享「模块」还是要隔离「应用」

---

# 两个物种：模块级 vs 应用级

MF 和 qiankun 不是同类工具的两个牌子，而是**解决粒度不同的两个物种**

<v-click>

| | Module Federation | qiankun / wujie（应用级） |
| --- | --- | --- |
| **复用单位** | 模块（组件/函数/store） | 整个子应用（带路由的 SPA） |
| **核心动作** | 跨应用 `import()` 一个模块 | `mount(container)` 挂载整应用 |
| **隔离** | **无沙箱**，同 `window`/DOM/CSS | **JS 沙箱 + 样式隔离** |
| **依赖共享** | 运行时 semver 协商（真共用实例） | 各自带 / import maps（不共实例） |
| **通信** | 同 realm，**直接函数调用** | 跨沙箱：props / 全局状态 / 事件 |
| **典型诉求** | 多团队**共享代码**、去重大依赖 | 老系统**渐进拆分**、强隔离共存 |

</v-click>

<v-click>

> **MF 让两个应用「像同一应用里的两个模块」，qiankun 让两个应用「像同一页里的两个隔离租户」**——这条差异是一切选型判断的根。

</v-click>

<!--
先把最容易混的钉死：MF 和 qiankun 不是同类工具的两个牌子，而是两个物种，差异在解决的粒度不同。MF 让两个应用像同一应用里的两个模块，qiankun 让两个应用像同一页里的两个隔离租户。这条差异是一切选型判断的根。
-->

---

# 「无沙箱」到底意味着什么

不是「不成熟」，是**刻意的定位选择**：联邦模块与宿主共享同一个 realm / `window` / DOM / CSS

<v-click>

**红利（为什么无沙箱是优点）**

- **能真正共享运行时**：两个应用用**同一个 React 实例**——hooks、context、Suspense 跨应用可用（沙箱做不到）
- **零隔离开销**：没有 Proxy 代理 `window`、没有 iframe——加载快、内存省
- **通信零成本**：同 realm，import 来的函数直接调、store 直接订阅

</v-click>

<v-click>

**代价（自治成本）**

- **全局互撞无兜底**：都往 `window` 上写，没有沙箱拦着，直接互相覆盖
- **CSS 会泄漏**：全靠 CSS Modules / scoped / BEM 前缀等**约定**自保
- **副作用不回收**：卸载时全局监听、定时器、`<style>` 不会被沙箱记账清理

</v-click>

<!--
无沙箱常被误读成不成熟，其实是刻意的定位选择：联邦模块执行在宿主同一个 realm 里。这一个事实同时是红利与代价的来源。红利：真正共享运行时（同一个 React 实例）、零隔离开销、通信零成本。代价：全局互撞无兜底、CSS 泄漏、副作用不回收——责任从框架下放给团队纪律。
-->

---

# 沙箱方案的对称取舍

qiankun / wujie 的沙箱，取舍正好镜像 MF

<v-click>

- **红利**：**「乱写也不互相污染」**——子应用随便用全局/CSS，沙箱兜底，老系统塞进一个壳成为可能
- **代价**：**重**（Proxy/iframe）、**难共享运行时**、**沙箱自身的坑**（弹窗逃逸、`@keyframes` 不改写）

</v-click>

<v-click>

| | 无沙箱（MF） | 带沙箱（qiankun/wujie） |
| --- | --- | --- |
| 隔离 | 靠**团队自律** | 靠**框架兜底** |
| 共享运行时（一份 React） | **天然可以** | 别扭 / 做不到 |
| 开销 | 轻 | 重（Proxy/iframe） |
| 适合团队 | 同组织、能统一约定 | 互不信任、技术栈杂 |
| 适合系统 | 新系统、共享驱动 | 老系统、隔离驱动 |

</v-click>

<!--
反过来看沙箱的取舍正好镜像：红利是乱写也不互相污染，让把老系统塞进壳成为可能；代价是重、难共享运行时、沙箱自身的坑。一张表看穿对称性：MF 靠团队自律、qiankun 靠框架兜底，各有适合的团队与系统。
-->

---

# 叠加模式：编排 + 共享各取所长

真实的大型微前端常常**不是二选一，而是叠加**——因为二者本就正交

<v-click>

```text
┌─────────────────────────────────────────────┐
│  single-spa / qiankun  ← 应用级编排层          │
│  （谁在什么路由 mount/unmount、沙箱隔离）       │
│                                               │
│      每个子应用内部 ↓ 又用                      │
│  Module Federation    ← 模块级共享层           │
│  （大家共用一份 React、共享设计系统组件）        │
└─────────────────────────────────────────────┘
```

</v-click>

<v-click>

> single-spa 官方也把「single-spa 编排 + MF 共享」列为成熟模式。**唯一红线**：同一依赖只能有一个权威解析源——别让同一个 React 既走 import maps 又走 MF shared，否则双份实例、singleton 名存实亡。

</v-click>

<!--
真实的大型微前端常常不是二选一而是叠加，因为应用级编排和模块级共享本就正交。single-spa 官方也把 single-spa 编排 + MF 共享列为成熟模式。唯一红线：同一依赖只能有一个权威解析源，工程混用没问题但依赖名单必须二选一划界。
-->

---

# 选型决策树

把上面的判断收敛成一棵树

<v-click>

```text
你的首要诉求是「隔离整应用」还是「共享模块」？
│
├─ 隔离整应用（老系统林立 / CSS 混乱 / 技术栈各异 / 团队互不信任）
│   └─ 应用级方案（带沙箱）
│       ├─ 存量 webpack + 要开箱即用 ──► qiankun
│       └─ 新项目 / Vite / 要更强隔离 ──► wujie / micro-app（ESM 友好）
│
├─ 共享模块（同技术栈 / 多团队共用组件与大依赖 / 团队能自律）
│   └─ Module Federation
│       ├─ webpack/Rspack 主力 ──────► MF 2.0（Rspack 内置）
│       ├─ Vite 主力 ──────────────► @module-federation/vite（官方）
│       └─ Angular / 想贴浏览器标准 ──► Native Federation
│
└─ 两个都要 ──► 叠加：single-spa/qiankun 编排 + MF 共享
                 └─ 红线：同一依赖只走一套解析
```

</v-click>

<v-click>

> 一句话收尾：**要隔离「应用」选带沙箱的 qiankun/wujie，要共享「模块」选无沙箱的 MF，都要就叠加。**

</v-click>

<!--
把判断收敛成一棵树：首要诉求是隔离整应用还是共享模块？隔离走应用级（qiankun / wujie / micro-app），共享走 MF（webpack/Rspack 用 MF 2.0、Vite 用官方插件、Angular 用 Native Federation），都要就叠加。MF 的差异化壁垒是运行时版本协商 + 内建错误边界。
-->

---
layout: center
class: text-center
---

# 小结

Module Federation —— 模块级、运行时、无沙箱的联邦方案

<v-click>

- **概念**：去中心化对等节点，host/remote 兼任 → 双向联邦；共享**模块**非应用；manifest 是运行时「目录」
- **治理**：singleton 最高版本获胜 + lockfile 失效；防线在**全体版本收敛**；strictVersion 把漂移提前到 CI
- **运行时化**：2024 从 webpack fork；`registerRemotes` 把「装谁 / 哪版」变运行期决策；mf-manifest.json 作协议
- **生态**：类型联邦 · DevTools · 预加载 · 跨构建工具（Rspack 内置、官方 Vite 取代 originjs）
- **Native Federation**：同一心智换 ESM + Import Maps 底座，Angular 背书，与 MF 正在收敛
- **选型**：共享模块 → MF（无沙箱需自律）；隔离应用 → qiankun/wujie（带沙箱）；都要就叠加

</v-click>

<v-click>

> 「MF = webpack 插件」是过时认知 —— 2026 的 MF 是横跨五六种打包器的**独立微前端运行时**。

</v-click>

<!--
六块收束：概念（去中心化、host/remote 兼任、模块级、manifest 目录）、治理（singleton 与 lockfile 失效、全体收敛、strictVersion）、运行时化（fork、registerRemotes、mf-manifest.json）、生态（类型/DevTools/预加载/跨工具）、Native Federation、选型。MF 是横跨五六种打包器的独立微前端运行时。
-->

---
layout: center
class: text-center
---

# 谢谢

Module Federation · 模块级联邦 · 运行时化 · 无沙箱

<div class="mt-8 text-gray-400">
基于 Module Federation 2.0（v2.6 2026-06）· 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/architecture/micro-frontend/module-federation/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖联邦概念与心智模型、shared 版本治理、MF 2.0 运行时化、生态、Native Federation、与应用级方案的选型。配套笔记见文档图标链接。感谢观看。
-->
