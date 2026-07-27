---
theme: seriph
background: https://cover.sli.dev
title: 供应链安全完全指南
info: |
  npm 依赖投毒 · lockfile 锁定 · SRI · npm audit / audit-ci · SBOM · sigstore · .npmrc

  Learn more at [https://docs.npmjs.com](https://docs.npmjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 供应链安全完全指南

npm 依赖链路 · 消费端 / 发布端 / 架构层 · npm CLI v10 / pnpm v10+

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
前端供应链安全覆盖从源码到生产运行时的全链路，本页给出全局视图。
-->

---
transition: fade-out
---

# 什么是供应链安全

保护软件从「源码 → 依赖 → 构建 → 发布 → 消费」整条链路**不被篡改与投毒**

- **多层防御**：lockfile / audit / lockfile-lint / SBOM / SRI / provenance 各管一段，互补覆盖不同攻击面
- **可审计**：lockfile 是依赖完整性与来源 hash 的可审计清单；SBOM 让「是否含某 CVE 组件」可机器查询
- **可验证**：provenance + Sigstore 让下游可验证「这个包确实由这条 CI 构建」
- **生态默认收敛**：pnpm v10+ 默认禁 postinstall、npm CI 锁死 lockfile，安全默认逐步变成开箱即用
- **合规可量化**：SBOM + VEX 满足 EU CRA / EO 14028

> 供应链安全 ≠ 源码 SAST/DAST，≠ 运行时 XSS/CSRF，≠ 容器镜像签名（cosign for OCI）。

<!--
强调三层定位：多层防御、可审计、可验证；明确边界。
-->

---

# 三条主线

| 主线 | 关注 | 关键工具 |
|------|------|---------|
| **消费端** | 你装的依赖 | lockfile / `npm ci` / `ignore-scripts` / `npm audit` / SRI |
| **发布端** | 你发布的包 | `npm publish --provenance` / Sigstore / SLSA / SBOM |
| **架构层** | 你的私包生态 | scope 锁定 / virtual registry / 同名占位 |

**消费端** 是大多数前端项目的主战场——90% 的防护都在这里。

> 发布端 + 架构层面向团队 / 公司：自有 npm 包、内部 scope、私服。
<!--
三条主线覆盖完整链路，前端项目重点在消费端。
-->

---

# npm 生态风险速览

| 攻击向量 | 入口 | 典型案例 |
|----------|------|---------|
| **typosquatting** | 拼错包名 | `loadsh` 冒充 `lodash` |
| **account takeover** | maintainer 账号被盗 | 2021 `ua-parser-js`/`coa`/`rc` |
| **dependency confusion** | 私有名公共 registry 未占位 | Alex Birsan 打进 Apple/MS |
| **postinstall 投毒** | lifecycle 脚本执行任意代码 | 2018 `event-stream` |
| **registry MITM** | 中间人替换 tarball | 关 `strict-ssl` 时可注入 |
| **lockfile 漂移** | CI 用 `npm install` | PR 插入恶意版本被写入 lockfile |
| **CDN 篡改** | 跨域 CDN 资源被替换 | 无 SRI 的 `<script src=cdn>` |

> postinstall 是 npm 投毒首选——执行晚于杀软扫描、可读 env 凭据、跨平台。

<!--
postinstall 是投毒最常用载体，必须重点防御。
-->

---
layout: two-cols
---

# 三大投毒手法

**typosquatting（拼错抢注）**

- `loadsh` 冒充 `lodash`
- `react-native` 后缀变种
- 防：核对 maintainer / 下载量

**postinstall 投毒**

- lifecycle：preinstall → install → **postinstall**
- 执行晚于杀软，可读 `process.env`
- 防：`ignore-scripts=true` 或 pnpm 白名单

::right::

# Dependency Confusion

**攻击链**

- 私有名 `@mycorp/utils` 公共 registry 未占位
- 攻击者抢先发布同名恶意包
- 你的 CI 配置允许回退公共 registry
- 私有包被公共同名恶意包替换

**Alex Birsan 2021** 用此手法打进 Apple / Microsoft / PayPal 等 35+ 公司

> 防御三件套：scope 锁定 + 同名占位 + virtual registry 顺序
<!--
三大经典投毒手法覆盖最常见的供应链攻击入口。
-->

---

# lockfile 锁定与 npm ci

**`npm ci` vs `npm install`**

| 维度 | `npm ci` | `npm install` |
|------|---------|--------------|
| 需要 lockfile | **是** | 否 |
| 修改 lockfile | **否** | 是 |
| 速度 | 更快 | 慢 |
| 适用 | **CI / 生产** | 本地新装包 |

> pnpm 等价物：`pnpm install --frozen-lockfile`

**lockfile 必须提交版本库**——依赖完整性与来源 hash 的可审计清单。

```bash
npm ci                              # npm
pnpm install --frozen-lockfile      # pnpm
```
<!--
npm ci 是 CI 标配，禁止 npm install 改写 lockfile。
-->

---

# 安装脚本：白名单优于全禁

**npm 默认开 postinstall，是攻击面**

```text
# .npmrc（npm）
ignore-scripts=true
```

**pnpm v10+ 默认禁，用白名单精细放行**（推荐）

```text
# pnpm-workspace.yaml
onlyBuiltDependencies:    # v11 改名 allowBuilds
  - esbuild
  - swc
  - prisma
minimumReleaseAge: 1440   # v11 默认 1 天，延迟引入新版本
trustPolicy: no-downgrade # 阻止信任降级
```

> `dangerouslyAllowAllBuilds: true` 是**反模式**——丢失白名单审计价值，等于回到 npm 默认行为。

**本仓库实战**：`apps/quiz-backend` 有 `postinstall: pnpm run prisma:generate`，必须白名单放行 prisma，否则 client 生成失败。
<!--
pnpm v10 默认禁 + 白名单是最佳实践，全禁会破坏原生编译。
-->

---

# SRI：校验 CDN 资源

**语法**

```text
<script src="https://cdn.example.com/lib.js"
        integrity="sha256-abc... sha384-def... sha512-ghi..."
        crossorigin="anonymous"></script>
```

**关键规则**

- 空格分隔多 hash，浏览器选**最强算法**（SHA-256 < 384 < 512）
- 同算法多 hash：**任一匹配即通过**
- 完全不匹配 → 返回网络错误，**阻止执行**

**为何强制 `crossorigin="anonymous"`**

- no-cors 模式启用 SRI 会带来 **XS-Leak**（推断跨域内容）
- CDN 必须返回 `Access-Control-Allow-Origin`

> 漏了 `crossorigin` → 浏览器拒绝校验 → 脚本反而加载不出来。
<!--
SRI 是 CDN 资源完整性的最后一道防线，crossorigin 是强制项。
-->

---

# npm audit 与 audit-ci

```bash
npm audit                          # 列全部
npm audit --audit-level=high       # high 以上 exit 非零
npm audit fix --dry-run            # 预览变更（先看！）
npm audit fix --force              # ⚠️ 允许 major 跳变
```

**陷阱**：`--audit-level` 只改阈值不过滤报告（漏洞清单仍全列）；`fix --force` 允许 SemVer major 跳变（含 breaking，可打断生产）

**audit-ci（IBM）三精度 allowlist**

| 精度 | 写法 | 含义 |
|------|------|------|
| module | `"axios"` | 不含传递依赖 |
| advisory | `"GHSA-xxxx"` | 按 GHSA ID |
| path | `"pkg>pkg>pkg"` | 含 `*` 通配链路 |

> NSPRecord 的 `expiry`/`active`/`notes` 防止豁免被遗忘。
<!--
audit 阈值改了报告还在，fix --force 是大坑。
-->

---

# SBOM 与 CycloneDX

**生成 bom.json**

```bash
npx @cyclonedx/cyclonedx-npm --output-file bom.json
```

**CycloneDX vs SPDX**

| 维度 | CycloneDX | SPDX |
|------|-----------|------|
| 标准 | **ECMA-424** | **ISO 5962:2021** |
| VEX / 依赖图 | 原生内嵌 / 完整 | 单独 profile / 较弱 |
| 起点强项 | 漏洞管理 | 许可证合规 |

**实际价值**：合规（EU CRA / EO 14028） · 反查（grep `bom.json` 找含 Log4j 2.14 的 release） · VEX 减少误报
<!--
SBOM 把「是否含某 CVE 组件」从人工 grep 变成可机器查询。
-->

---
layout: two-cols
---

# provenance + SLSA

**`npm publish --provenance` 前置**

- npm CLI 9.5.0+，`repository` 字段公开且大小写匹配
- GitHub Actions / GitLab 云端托管 runner，`permissions.id-token: write`

**SLSA Build L0-L3**

| 级别 | 要求 |
|------|------|
| **L1** | provenance 存在（可未签名） |
| **L2** | 托管平台签名（`--provenance` 即达） |
| **L3** | 构建隔离 + 密钥不可见 |

::right::

# Sigstore keyless

**三组件**

| 组件 | 作用 |
|------|------|
| **Fulcio CA** | OIDC 签发短期证书 |
| **Rekor** | 透明日志账本 |
| **Cosign** | 签名 / 验证 CLI |

> provenance 只提供「where & how built」的可验证链接，**不保证无恶意代码**，仍需源码审计。
<!--
provenance 是发布端核心，Sigstore 提供 keyless 签名基础设施。
-->

---

# .npmrc 配置安全

| 配置 | 作用 | 默认 |
|------|------|------|
| `ignore-scripts=true` | 禁 lifecycle 脚本 | false（npm 默认开） |
| `strict-ssl=true` | 强制 HTTPS | **true（别关）** |
| `@scope:registry=` | scope 锁私有 registry | - |
| `//host/:_authToken=${NPM_TOKEN}` | token 占位 | - |
| `provenance=true` | 发布启用 provenance | false |

**配置优先级链**（高 → 低）

```text
命令行 flag > npm_config_* 环境变量
  > 项目 / 用户 / 全局 .npmrc > 内置默认
```

> 明文 token 写进项目 `.npmrc` 并提交是**经典反模式**——用 CI secret + 占位符。
<!--
token 必须用占位符 + CI secret，禁止明文提交。
-->

---

# 防护层级全景

| 层 | 工具 | 防什么 |
|----|------|--------|
| lockfile | `npm ci` / `pnpm --frozen-lockfile` | 依赖树漂移 |
| 安装脚本 | `ignore-scripts` / `allowBuilds` | postinstall 投毒 |
| CVE 扫描 | `npm audit` / audit-ci | 已知漏洞 |
| lockfile-lint | `--allowed-hosts --validate-https` | host 注入（**互补 audit**） |
| SRI | `integrity` + `crossorigin` | CDN 篡改 |
| 发布/架构层 | `--provenance` / `cyclonedx-npm` / `@scope:registry=` | 来源可验证 / 合规 / dep confusion |

> npm audit 查 CVE，lockfile-lint 查来源是否被替换——**覆盖不同攻击面，应并用**。
<!--
每个工具覆盖不同攻击面，多层防御互补。
-->

---
layout: quote
---

# provenance ≠ 包是安全的

「provenance 只提供『where & how built』的可验证链接，**不保证无恶意代码**，仍需源码审计。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 明文 token 写进项目 `.npmrc` 并提交
- 为「解决报错」随手 `strict-ssl=false`（开 MITM 大门）
- CI 用 `npm install` 而非 `npm ci`（依赖树漂移）
- `npm audit fix --force` 不 dry-run（允许 major 跳变）
- SRI 加 `integrity` 漏 `crossorigin`（脚本加载不出来）
- 私有 scope 同名包在公共 registry 未占位
- `dangerouslyAllowAllBuilds: true` 一放了之
- allowlist GHSA 当永久豁免不设 expiry
- 以为 provenance 后包就安全（仍需源码审计）
- `pnpm.overrides` 锁死传递依赖长期不升级

<!--
反模式多数来自「为图省事关掉安全默认」，要养成质疑习惯。
-->

---
layout: center
class: text-center
---

# 小结

供应链安全 = 多层防御 × 可审计 × 可验证

消费端 · 发布端 · 架构层 · npm CLI v10 / pnpm v10+

**lockfile + 白名单脚本 + audit + SRI + provenance + SBOM**

[npm docs](https://docs.npmjs.com) · [pnpm SCS](https://pnpm.io/supply-chain-security) · [SLSA](https://slsa.dev/spec/v1.0/levels) · [CycloneDX](https://cyclonedx.org/specification/overview/)

<!--
记住三条主线 + 各层工具的边界，就能构建可审计可验证的依赖链路。
-->
