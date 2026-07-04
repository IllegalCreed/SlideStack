---
theme: seriph
background: https://cover.sli.dev
title: Docker 深入浅出
info: |
  容器化的事实标准。

  基于 Docker（Engine 2x / BuildKit 默认）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Docker

**容器化**的事实标准：镜像、分层、Dockerfile 与运行时

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<!--
Docker 把应用连同依赖打包成可移植的镜像，在任何装了容器运行时的机器上一致地跑。
-->

---
transition: fade-out
---

# 容器 vs 虚拟机

本质区别：是否共享内核

<div grid="~ cols-2 gap-4">

<div>

**容器**

- **共享宿主内核**，只隔离进程/文件/网络
- 秒级启动、镜像小、开销低
- 隔离弱于 VM

</div>

<div>

**虚拟机**

- Hypervisor 虚拟硬件，各跑**完整内核**
- 启动慢、镜像大
- 隔离更强

</div>

</div>

<div v-click class="mt-4">

「共享内核」是容器**轻量**的根本原因

</div>

<!--
容器不是轻量级虚拟机，它根本不虚拟硬件。
-->

---
transition: fade-out
---

# 镜像 · 容器 · 分层

类比：镜像像类，容器像实例

<v-clicks>

- **镜像 image**：只读模板（分层文件系统 + 元数据）
- **容器 container**：镜像的可运行实例，在只读层上加一个**可写层**
- 同一镜像可起**多个**独立容器
- **分层**：每条指令约生成一层，层可**跨镜像复用**、可缓存 → 省存储/带宽、加速构建
- 容器删除 → **可写层数据丢失**，持久化须用卷

</v-clicks>

<!--
分层 + 写时复制（overlay2）是镜像高效的基础。
-->

---
transition: fade-out
---

# Dockerfile 三对易混指令

考点密集区

<v-clicks>

- **CMD vs ENTRYPOINT**：ENTRYPOINT 定固定程序，CMD 给默认参数；`run` 追加参数覆盖 CMD 不覆盖 ENTRYPOINT
- **COPY vs ADD**：COPY 只复制；ADD 多了解压 tar / URL 下载 → **优先 COPY**
- **ARG vs ENV**：ARG 仅**构建期**（不入运行容器）；ENV 是**运行期**环境变量、写入镜像
- **EXPOSE** 只声明端口（文档），**不发布** → 对外需 `-p` 映射

</v-clicks>

<!--
ARG 值会进镜像历史，不应传密钥。
-->

---
transition: fade-out
---

# 多阶段构建

分离「构建」与「运行」，镜像瘦身

```dockerfile
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine          # 精简运行镜像
COPY --from=build /app/dist /usr/share/nginx/html
```

<div v-click class="mt-3">

前阶段含编译器/依赖，**最终镜像只 COPY 产物** → 体积小、攻击面小

</div>

<!--
多个 FROM 定义多阶段，只把最终产物带进运行镜像。
-->

---
transition: fade-out
---

# 构建缓存：层顺序是关键

把不常变的放前面

<v-clicks>

- 缓存**自某层失效则其后全失效**
- 先 `COPY package.json` + `RUN npm ci`，再 `COPY . .`（源码）
- → 改代码时**依赖层仍命中缓存**，不重装依赖
- 合并 `RUN a && b` 并在**同层清理**，减少层/体积
- 后层 `rm` 前层文件**不减体积**（只是加覆盖层）

</v-clicks>

<!--
先拷 lockfile 装依赖、再拷源码，是最经典的缓存优化。
-->

---
transition: fade-out
---

# 数据卷 vs 绑定挂载

数据持久化与开发挂载

| | 命名卷 volume | 绑定挂载 bind mount |
| --- | --- | --- |
| 管理 | Docker 管理、可移植 | 宿主任意路径 |
| 场景 | 持久化数据库数据 | 开发挂源码热更 |
| 写法 | `-v myvol:/data` | `-v ./src:/app/src` |

<div v-click class="mt-2 text-sm">

命名卷生命周期**独立于容器**；容器可写层随容器删除而丢失 —— 数据要放卷里

</div>

<!--
源以 / 或 . 开头是 bind mount，否则当卷名。
-->

---
transition: fade-out
---

# 网络与端口

同网络内靠服务名互通，对外靠 -p

<v-clicks>

- 默认 bridge：容器有内网 IP，**未 -p 则外部访问不到**
- `-p 宿主:容器`（如 `-p 8080:80`）把端口发布到宿主
- **自定义 bridge 网络**：容器间可用**容器名经内建 DNS** 互访
- 默认 bridge 无自动服务发现 → 多容器应用建自定义网络
- `host` 模式共享宿主网络（省 NAT 但失隔离、易端口冲突）

</v-clicks>

<!--
Compose 默认建项目网络，服务名即主机名。
-->

---
transition: fade-out
---

# Docker 架构

一条从 CLI 到底层运行时的调用链

<v-clicks>

- **docker CLI** → 向 **dockerd**（守护进程）发 API
- **dockerd**：镜像/网络/卷等高层管理
- → 委托 **containerd**（容器生命周期管理）
- → 通过 OCI 运行时 **runc** 真正起容器进程
- 底层隔离靠 Linux **namespaces**（视图）+ **cgroups**（资源）

</v-clicks>

<!--
namespaces 管「看得见什么」，cgroups 管「能用多少」。
-->

---
transition: fade-out
---

# 镜像瘦身与安全

更小 = 更快 + 攻击面更小

<v-clicks>

- 基础镜像选 **alpine / -slim / distroless**（distroless 无 shell，攻击面最小）
- 用 `USER` 切**非 root**运行（默认 root，风险大）；进阶用 rootless Docker
- `HEALTHCHECK` 探测应用健康供编排决策
- `.dockerignore` 排除 node_modules/.git，减小构建上下文
- 用 BuildKit `--mount=type=secret` 传构建期密钥**不入镜像层**

</v-clicks>

<!--
把密钥用 ARG/COPY 传会残留在镜像历史，可被 dump。
-->

---
transition: fade-out
---

# 标签 vs 摘要 · latest 陷阱

生产用 digest 锁定

<v-clicks>

- **tag 可变**：`latest`/`v1` 可被重新推送指向不同镜像
- **digest 不可变**：`image@sha256:...` 是内容哈希，唯一确定
- `latest` 只是**默认标签名**，**不保证最新/稳定**
- 生产用**明确版本标签**或 **digest** 锁定 → 可复现、可回滚、防漂移
- CI/生产用 digest 还能抵御上游标签被篡改（供应链）

</v-clicks>

<!--
依赖 latest 会导致「不知道跑的哪个版本」。
-->

---
transition: fade-out
---

# 常用命令与运维

日常操作速记

<div grid="~ cols-2 gap-4">

<div>

- `build -t name .`（. 是**构建上下文**）
- `run --rm -p -v`
- `exec -it <c> sh` 进容器
- `logs -f`（读 stdout/stderr）

</div>

<div>

- `ps` / `stop`（SIGTERM 宽限）/ `kill`（SIGKILL）
- `rm` 删容器 / `rmi` 删镜像
- `system prune -a` 谨慎（删未用镜像）
- `--restart unless-stopped` 自愈

</div>

</div>

<!--
日志写 stdout/stderr 才能被 docker logs 捕获。
-->

---
layout: center
class: text-center
---

# 小结

**镜像**（只读分层模板）→ **容器**（可写层实例）

Dockerfile → **CMD/ENTRYPOINT · COPY/ADD · ARG/ENV · 多阶段 · 缓存层序**
数据 → **命名卷持久化**；网络 → **自定义网络服务名互通 + -p 发布**
架构 → **CLI→dockerd→containerd→runc + namespaces/cgroups**
生产 → **精简镜像 · 非 root · digest 锁定 · 构建期 secret 挂载**

<div class="mt-6 text-sm opacity-70">
容器化让应用「构建一次，到处一致地跑」
</div>

<!--
容器 vs VM 的共享内核、镜像分层缓存、digest 锁定是三大高频考点。
-->
