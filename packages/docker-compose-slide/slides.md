---
theme: seriph
background: https://cover.sli.dev
title: Docker Compose
info: |
  用一个 YAML 编排多容器、一条命令起停的单机编排工具。

  基于 Docker Compose（V2 / Compose Spec）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Docker Compose

**一个 YAML 编排整套多容器应用、一条命令起停 · 单机场景的声明式编排**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<!--
Compose 把一组相互依赖的服务连同网络、卷、配置写进 compose.yaml，up 一次拉起、down 一次清理。它工作在单个 Docker 守护进程之上，主战场是本地开发、CI、单机部署。
-->

---
transition: fade-out
---

# Compose 是什么，为什么需要它

`docker run` 的痛点：多服务全靠人肉串

<v-clicks>

- **痛点**：`docker run` 一次一个容器，参数堆命令行，网络 / 卷 / 启动顺序全手工
- **方案**：用**声明式 YAML** 描述整套栈，一条命令统一起停、可版本化、可共享
- **五类顶层元素**：`services`（核心）/ `networks` / `volumes` / `configs` / `secrets`
- **主战场**：本地开发、CI 自动化测试、单机部署——工作在**单个 Docker 守护进程**上
- **不是什么**：不是集群编排器，跨节点调度 / 自愈 / 扩缩容找 Kubernetes

</v-clicks>

<!--
Compose 底层仍调用 Docker Engine API，是「多容器编排的声明式外壳」。没有控制面、调度器与分布式状态，这是它与 K8s 的根本分野。
-->

---
transition: fade-out
---

# V2、V1 与 version 字段

2026 一律用 V2（`docker compose`，空格）

<div grid="~ cols-2 gap-4">

<div>

**Compose V2（标准）**

- `docker compose`（**空格**，CLI 插件）
- **Go** 重写，内置于 Docker CLI
- 忽略 `version:`，依 Compose Spec 校验

</div>

<div>

**Compose V1（已淘汰）**

- `docker-compose`（**连字符**，独立二进制）
- Python 实现
- **2023 年 EOL**，新版已移除

</div>

</div>

<v-click>

- **`version:` 字段已过时**：写了只警告、无功能效果，新文件直接从 `services:` 写起
- **文件名**：首选 `compose.yaml`（也认 `.yml` / `docker-compose.*`），并存时优先 `compose.yaml`

</v-click>

<!--
V1 迁 V2 时 Docker 建兼容符号链接，老脚本仍能跑。历史上文件格式分 2.x/3.x，现已统一到 Compose Specification。
-->

---
transition: fade-out
---

# 写第一个 compose.yaml

一个 web + 一个 db，直接从 `services:` 起

```yaml
services:
  web:
    build: .
    ports: ["8080:3000"]          # 宿主 8080 → 容器 3000
    environment:
      - DATABASE_URL=postgres://app:secret@db:5432/app  # 用服务名 db
    depends_on:
      db: { condition: service_healthy }   # 等 db 健康再起
  db:
    image: postgres:17-alpine
    volumes: ["db-data:/var/lib/postgresql/data"]  # 命名卷持久化
volumes:
  db-data:
```

<!--
docker compose up -d 一条命令：建 <项目名>_default 网络、建 db-data 卷、先起 db 等它健康、再起 web、把 3000 发布到宿主 8080。
-->

---
transition: fade-out
---

# 核心命令：起停与观察

不加 `-d` 前台聚合日志，`Ctrl-C` 停全部

```bash
docker compose up             # 前台起，聚合所有服务日志
docker compose up -d          # 后台（detached）运行
docker compose up -d --build  # 起之前先重新构建镜像

docker compose ps             # 列出本项目容器、状态与端口
docker compose logs -f web    # 跟随日志（-f follow），可指定服务

docker compose stop / start / restart   # 停 / 起 / 重启（不删除）
docker compose down           # 停并删容器 + 默认网络（默认不删卷）
docker compose down -v        # 连命名卷一起删（会丢数据！）
```

<!--
down 默认只删容器和网络，命名卷保留，数据能跨 up/down 存活。down -v 才删卷，是最常被误用的一对命令。
-->

---
transition: fade-out
---

# exec 与 run：进容器与一次性任务

一个进已有容器，一个新起容器

<div grid="~ cols-2 gap-4">

<div>

**`exec`：进已运行的容器**

```bash
docker compose exec db \
  psql -U app
```

- 面向**已在运行**的容器
- 如进数据库敲 SQL、看进程

</div>

<div>

**`run`：起一次性容器**

```bash
docker compose run --rm web \
  npm test
```

- **新起**容器跑命令，`--rm` 退出即删
- 命令**覆盖服务默认 command**
- 常用于迁移、seed、跑测试

</div>

</div>

<!--
exec 附着到已运行容器；run 每次新建一个容器，命令行给的命令覆盖服务默认 command，适合一次性任务。
-->

---
transition: fade-out
---

# 服务名 DNS：容器间怎么互访

最省心也最容易踩的一点

<v-clicks>

- **默认网络**：`up` 自动建 `<项目名>_default`，所有服务**自动加入**
- **服务名即主机名**：走内置 DNS，`web` 连 `db` 直接写 `db`
- **用服务名，别用 IP**：容器重建后 IP 会变，服务名始终稳定
- **容器间用容器端口**：`ports: "8080:5432"` 的宿主端口只给**外部**；不写 `ports` 也能内部互访

</v-clicks>

<div v-click>

```yaml
services:
  web:
    environment:
      - DATABASE_URL=postgres://app:secret@db:5432/app  # host=db，端口=容器 5432
  db:
    image: postgres:17-alpine
```

</div>

<!--
项目名默认取目录名。同网络内互访用目标服务监听的容器端口，与 ports 是否发布无关。
-->

---
transition: fade-out
---

# services：image 与 build

用现成镜像，还是自己构建

<v-clicks>

- **二选一**：每个 service 至少有 `image`（拉现成镜像）或 `build`（从 Dockerfile 构建）
- **并存**：`image` 值作为 `build` 产物的 **tag**（可 `push`）
- **`build` 长语法**：`context` / `dockerfile` / `args`（构建期 ARG）/ `target`（多阶段）/ `platforms`

</v-clicks>

<div v-click>

```yaml
services:
  cache:
    image: redis:7-alpine        # 本地无则拉取
  web:
    build:
      context: ./web             # 目录或 Git URL
      target: prod               # 多阶段只构建到 prod
      args: { NODE_VERSION: "22" }
```

</div>

<!--
拉取还是构建由 pull_policy 决定（always/never/missing/build/daily/…）。构建触发：build 或 up --build。
-->

---
transition: fade-out
---

# services：ports · environment · volumes

发布端口、注入变量、挂载数据

<v-clicks>

- **`ports`**：`"[HOST:]CONTAINER"`，如 `"8080:80"`；`"127.0.0.1:5432:5432"` 只绑本机（安全）
- **端口铁律**：容器间用**容器端口**，`ports` 宿主端口只给外部；`expose` 仅声明内部端口
- **`environment` 优先 `env_file`**；`environment` 里只写 `KEY`（无值）= 从宿主透传
- **`volumes`**：短语法 `SOURCE:TARGET[:MODE]`（`ro`/`rw`）；`type` 可 volume / bind / tmpfs

</v-clicks>

<!--
内部服务（数据库、Redis）不必发布端口；要发布就绑 127.0.0.1 而非 0.0.0.0，否则绕过防火墙对整网暴露。environment 注入容器，与做文件插值的 .env 是两回事。
-->

---
transition: fade-out
---

# depends_on 与 healthcheck

经典坑：默认只等「启动」，不等「就绪」

<v-clicks>

- **默认 `service_started`**：只等容器 running，**不等应用 ready**——数据库「起来了」≠「能连了」
- **三个 `condition`**：`service_started`（默认）/ `service_healthy` / `service_completed_successfully`
- **`healthcheck`** 定义就绪判据：`test` + `interval` / `timeout` / `retries` / `start_period`

</v-clicks>

<div v-click>

```yaml
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER"]  # $$ 转义
      interval: 10s
      retries: 5
      start_period: 30s          # 宽限期内失败不计入 retries
```

</div>

<!--
即便用 service_healthy，依赖仍可能中途重启，应用自身也要有连接重试能力。test 用 CMD 直接执行、CMD-SHELL 经 /bin/sh -c；退出码 0=healthy。
-->

---
transition: fade-out
---

# restart 与 deploy：重启与部署

`restart` 是 `up` 的运行时策略，`deploy` 主要给 Swarm

<div grid="~ cols-2 gap-4">

<div>

**`restart`（`up` 生效）**

- `no`（默认）
- `always`
- `on-failure[:N]`
- `unless-stopped`（手动 stop 后不复活）

</div>

<div>

**`deploy`（主要 Swarm）**

- `replicas` / `placement`
- `update_config` / `rollback_config`
- `up` 仅部分支持（如 `resources` 限额）
- `container_name` 与多副本互斥

</div>

</div>

<!--
restart ≠ deploy.restart_policy。单机想多副本用 --scale；deploy.* 多为 Swarm 语义。
-->

---
transition: fade-out
---

# 数据卷：命名卷 vs 绑定挂载

容器可写层随删除丢失，持久化靠挂载

| 类型 | 数据存在哪 | 典型用途 |
| --- | --- | --- |
| **命名卷** | Docker 管理的卷区 | 数据库等持久数据（可移植） |
| **绑定挂载** | 宿主**具体路径** | 开发挂源码 / 配置文件 |
| **tmpfs** | **内存**，不落盘 | 临时 / 敏感数据 |

<v-clicks>

- **命名卷生命周期**：`up` 不存在则建、存在则复用；**`down` 默认不删**（数据保留）
- **`down` vs `down -v`**：`down` 保留卷（数据安全），`down -v` 才删卷（重置本地库）

</v-clicks>

<!--
命名卷默认命名 <项目名>_<卷名>，name: 可绕过前缀，external: true 引用预先存在的卷。down -v 是最易误用的命令。
-->

---
transition: fade-out
---

# 变量：插值 vs 容器内变量

两条路径别混淆

<v-clicks>

- **插值**：`.env` / shell 变量 → 替换文件里的 `${VAR}`（作用于 **compose 文件**）
- **容器内变量**：`environment` / `env_file` → 注入**容器**；`.env` 变量**默认不进容器**
- **`${VAR:-x}` vs `${VAR-x}`**：冒号版把「**空值**」也当未设置，无冒号版只看是否设置
- **`$$` 转义**字面美元符：防被 Compose 当插值（如 healthcheck 引用容器内变量）

</v-clicks>

<div v-click>

```yaml
    image: "myapp:${TAG:-latest}"   # 未设置或为空 → latest
    ports: ["${PORT-8080}:80"]      # 仅未设置 → 8080（空值仍用空）
```

</div>

<!--
容器内变量优先级（高→低）：run -e > shell（经插值）> environment > env_file > Dockerfile ENV。默认自动读项目根 .env 做插值。
-->

---
transition: fade-out
---

# profiles：按需启用服务

把调试工具、可选组件从默认启动集摘出去

<v-clicks>

- **无 profile 的服务始终启动**；有 profile 的仅在激活时启动
- **激活**：`--profile debug`（可多次）或 `COMPOSE_PROFILES=debug`；`--profile "*"` 全开
- **自动激活**：命令行显式点名（`run phpmyadmin`）会连同其 profile 与依赖一起起

</v-clicks>

<div v-click>

```yaml
services:
  backend:                # 无 profiles = 始终启动
    image: backend
  phpmyadmin:
    profiles: [debug]     # 仅 --profile debug 时启动
```

</div>

<!--
docker compose up 只起无 profile 的服务。合法 profile 名 [a-zA-Z0-9][a-zA-Z0-9_.-]+。
-->

---
transition: fade-out
---

# 多文件合并与 override

基础配置 + 环境差异，分层组合

<v-clicks>

- **多 `-f`**：`docker compose -f a.yaml -f b.yaml up`，按顺序合并，**后者覆盖 / 追加前者**
- **`compose.override.yaml` 自动叠加**：与 `compose.yaml` 并存时 `up` 自动叠加，无需 `-f`
- **合并规则**：标量**替换** / 序列（`ports`）**追加** / 映射（`environment`）**按键合并**
- **`docker compose config`**：渲染合并 + 插值后的**最终文件**，调试合并结果的利器

</v-clicks>

<div v-click>

> `extends`：单服务复用 · `include`：组合独立子栈 · `x-` + YAML 锚点：DRY

</div>

<!--
-f 是同一模型多层覆盖；extends 是单服务复用；include 把独立子应用整体拷进当前模型。x- 开头顶层键被 Compose 静默忽略。
-->

---
transition: fade-out
---

# Compose Watch：开发热更

监听源码变化自动同步 / 重建，替代手动 `up --build`

<v-clicks>

- **四种动作**：`sync`（同步文件）/ `rebuild`（重建镜像）/ `sync+restart` / `sync+exec`
- **只对 `build` 本地源码的服务生效**，纯预构建镜像不适用
- 相比裸绑定挂载：可精细 `ignore`（排除 `node_modules/`，避免同步平台相关产物）

</v-clicks>

<div v-click>

```yaml
    develop:
      watch:
        - action: sync           # 实时同步，配合框架 HMR
          path: ./src
          target: /app/src
          ignore: [node_modules/]
```

</div>

<!--
docker compose watch 或 up --watch 启动。ignore 相对 path，不是项目根。前提：镜像内有 stat/mkdir/rmdir。
-->

---
layout: center
class: text-center
---

# 小结

**一个 compose.yaml 声明多容器 → up 一键起、down 一键清 · 单机为主**

命令 → **up -d --build · down（-v 删卷）· ps · logs -f · exec / run**
网络 → **默认「项目名_default」+ 服务名 DNS 互访 · 用容器端口非宿主端口**
服务 → **image/build · ports · environment · depends_on + healthcheck 就绪**
数据 → **命名卷持久（down 默认不删）· 插值 :- 兜空值 / - 仅未设置**
组合 → **多 -f 合并 · override 自动叠加 · profiles 按需 · watch 热更**

<div class="mt-6 text-sm opacity-70">
V2（docker compose）· 不写 version 字段 · 声明式、可版本化、可复现
</div>

<!--
Compose 的定位是单机声明式编排：本地开发、CI、单机部署。跨节点调度、自愈、扩缩容找 Kubernetes。
-->
