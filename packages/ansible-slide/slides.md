---
theme: seriph
background: https://cover.sli.dev
title: Ansible
info: |
  配置管理 · 应用部署 · 多机编排的 agentless 自动化引擎。

  基于 Ansible · 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Ansible

**无 agent · SSH push · YAML 幂等收敛**的自动化引擎

配置管理 · 应用部署 · 多机编排（基于 ansible-core 2.21）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/ansible/ansible" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊 Ansible —— Red Hat 出品、当今最主流的自动化工具之一。
它的关键词只有几个：无 agent、SSH 推送、YAML 剧本、幂等收敛。记住这几点，就抓住了它的世界观。
-->

---
transition: fade-out
---

# 什么是 Ansible

Red Hat 出品的自动化引擎：把一批远程主机收敛到「期望状态」

<v-clicks>

- **三大主职**：配置管理（装包 / 改配置 / 起服务）、应用部署、多机编排
- **agentless（无 agent）**：被管机不装常驻软件，只需 SSH + Python
- **push 模型**：控制机主动把模块推到节点，执行完即走
- **幂等**：已达标就不动，重复运行安全
- **无中心 state**：每次现采 facts、靠模块自查真实态收敛

</v-clicks>

<!--
Ansible 官方一句话定义：自动化远程系统的管理，并把它们控制到期望状态。
三大主职是配置管理、部署、编排；它不是云资源供给工具，那是 Terraform 的活。
无 agent、push、幂等、无 state 这四个词后面每一张都会展开。
-->

---
transition: fade-out
---

# agentless 与 push 模型

无 agent + SSH 推送，是 Ansible 相对 Puppet/Chef 的最大差异

| 维度 | Ansible | Puppet / Chef |
| --- | --- | --- |
| agent | **无**（agentless） | 每节点装 agent 常驻 |
| 中心服务 | 控制机即可，无需 master | 通常有 master / server |
| 触发方向 | **push**：控制机主动推 | **pull**：节点定时拉 |
| 传输 | SSH / WinRM | 专有协议 + 证书 |
| 语言 | YAML（playbook） | Puppet DSL / Chef Ruby |

<div v-click>

> 超大规模可用 `ansible-pull` 反转成节点 cron 自拉 git、本地应用，近乎无限扩展。

</div>

<!--
理解 Ansible 的第一把钥匙就是无 agent。传统的 Puppet/Chef 要在每台机器装 agent 常驻，定期去中心 master 拉配置。
Ansible 反过来：被管机零安装，控制机用现有 OS 凭据经 SSH 把模块推过去，跑完即走。好处是上手快、攻击面小。
控制节点必须是类 Unix，Windows 只能当被管节点（走 WinRM）。上万节点时可用 ansible-pull 反转成 pull。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# playbook · play · task · module

自上而下的四层执行结构，是 Ansible 的核心心智模型

::left::

<v-clicks>

- **playbook**：一组 play 的有序列表（就是那个 YAML 文件）
- **play**：把一批 hosts 映射到一串有序 task
- **task**：施加于主机的一个动作，引用一个 module
- **module**：真正拷到节点执行的代码，幂等主力

</v-clicks>

::right::

```yaml
# playbook.yaml
- name: My first play
  hosts: myhosts
  tasks:
    - name: Ping my hosts
      ansible.builtin.ping:

    - name: Print message
      ansible.builtin.debug:
        msg: Hello world
```

<!--
这四层务必分清。playbook 是你写的 YAML 文件，里面是一组 play；每个 play 把一批主机映射到一串 task；
每个 task 引用一个 module；module 才是真正被拷到节点上执行的代码，也是幂等的主力。
右边是官方最小示例，跑 ansible-playbook -i inventory playbook.yaml 即可。开跑前会先隐式 Gathering Facts。
模块名带 ansible.builtin. 前缀是 FQCN，后面 collection 那页讲。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# inventory：告诉 Ansible 管哪些机器

一份主机名单，INI 或 YAML 两种格式

::left::

```ini
# inventory.ini
mail.example.com

[webservers]
foo.example.com
bar.example.com

[dbservers]
one.example.com
```

::right::

<v-clicks>

- **两个默认组**：`all`（全部）与 `ungrouped`
- **主机范围**：`www[01:50].example.com` 展开 01–50
- **嵌套组**：INI `[prod:children]` / YAML `children:`
- **连接变量**：`ansible_host` / `ansible_user` / `ansible_port`

</v-clicks>

<div v-click>

一次性小事用 ad-hoc：`ansible all -m ping`

</div>

<!--
inventory 就是主机名单，可以 INI 也可以 YAML。方括号是组名，方便这次只对 web 组动手。
即使一个组都不建，也自带 all 和 ungrouped。规律命名的主机可写成范围。组之间可建父子关系。
连接变量告诉 Ansible 怎么连过去。不值得写 playbook 的临时活，直接 ad-hoc：ansible <pattern> -m 模块 -a 参数。
-->

---
transition: fade-out
---

# 模块幂等与 task 状态

声明「期望态」，模块负责「已经对了就别动」

<v-clicks>

- **task 状态**：`ok`（已达标 / 绿）、`changed`（改了 / 黄）、`failed`、`skipped`、`unreachable`
- **`state` 是幂等抓手**：`present` / `absent` / `started` / `latest` 描述期望态
- **`command`/`shell` 不幂等**：每次都报 `changed`，Ansible 无从判断命令效果

</v-clicks>

<div v-click>

```yaml
# 驯服不幂等命令：creates / changed_when
- ansible.builtin.command: tar xzf /tmp/app.tgz -C /opt
  args:
    creates: /opt/app          # 目标已存在就跳过

- ansible.builtin.command: myapp --version
  register: ver
  changed_when: false          # 只读查询，永不算 changed
```

</div>

<!--
Ansible 的世界观：你描述要什么态，模块负责已经对了就别动。第一次跑报 changed（真装了），
原样再跑变成 ok（什么都没动），这就是幂等。state 是幂等的抓手。
但 command/shell 例外——Ansible 无从知道命令有没有产生改变，默认每次 changed。
用 creates/removes 或 changed_when 驯服；能用专用模块（copy/service/user）就别用 shell。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 条件 when 与循环 loop

按主机差异执行，批量迭代一组值

::left::

**`when`：裸表达式，不加花括号**

```yaml
- ansible.builtin.command: /sbin/reboot
  when: ansible_facts['os_family'] == "Debian"

# 多条件写成列表 = 逻辑 AND
- ansible.builtin.service:
    name: nginx
    state: restarted
  when:
    - config is changed
    - env == "prod"
```

::right::

**`loop`：循环变量取当前元素**

```yaml
- ansible.builtin.user:
    name: "{{ item }}"
    state: present
  loop:
    - alice
    - bob
```

<div v-click>

`register` 捕获输出、`until`+`retries` 做重试。

</div>

<!--
when 控制 task 跑不跑，最大的坑是加花括号——它本身就是表达式上下文，写 when: x == 1 就行，绝不能包大括号。
多条件写成列表等于逻辑 AND，比一长串 and 可读。
loop 是 2.5 起的推荐写法，取代老的 with_*，用循环变量取当前元素；元素是字典就取它的键。
register 把输出存进变量供后续判断，until + retries 做轮询重试。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# handler 与 notify：改了才重启

「配置文件变了 → 重启服务」的经典模式

::left::

```yaml
tasks:
  - name: 下发配置
    ansible.builtin.template:
      src: httpd.conf.j2
      dest: /etc/httpd/conf/httpd.conf
    notify: Restart apache

handlers:
  - name: Restart apache
    ansible.builtin.service:
      name: httpd
      state: restarted
```

::right::

<v-clicks>

- task 报 `changed` 才触发，`ok` 不触发
- handler **等 play 全部 task 跑完后**统一执行
- 同一 handler **被通知多次也只跑一次**
- `listen` 让多个 handler 监听同一主题
- `meta: flush_handlers` 可中途立即刷

</v-clicks>

<!--
handler 是只在被通知时才运行的特殊 task，最经典用途就是配置变了才重启服务。
规则很关键：task 报 changed 才 notify；handler 不是立刻跑，而是等 play 所有 task 跑完统一执行；
被通知多次也只跑一次——改了三个配置只重启一次，正是我们要的。ok 不触发。
listen 解耦具体名字，flush_handlers 可以中途强制刷新。
-->

---
transition: fade-out
---

# 变量与 22 级优先级

同名变量在多处定义，记牢两头即可

<v-clicks>

- **来源**：`vars` / `group_vars/` / `host_vars/` / role `defaults` 与 `vars` / `-e` / `register` / `set_fact`
- **最低**：role `defaults/main.yml`——就是放着给人覆盖的默认值
- **最高**：`--extra-vars`（`-e`）——命令行大锤，永远 always win
- **越具体越优先**：host_vars > group_vars，task vars > play vars

</v-clicks>

<div v-click>

```bash
# extra vars 压过一切，适合 CI 注入 / 临时强制
ansible-playbook site.yml -e "env=prod app_port=8080"
```

</div>

<!--
同名变量多处定义时有一套严格的 22 级优先级，全记住没必要，记两头：
role defaults 最低，就是给人覆盖的默认值；命令行 extra vars -e 永远最高，always win。
大体规律是越靠近具体主机/任务越优先。-e 是大锤，适合临时强制和 CI 注入，但别滥用，否则变量来源难追。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# facts 与 Jinja2 模板

自动采集主机信息，渲染出因机而异的配置

::left::

<v-clicks>

- **facts**：play 前自动采集（`Gathering Facts`），存进 `ansible_facts`
- **关采集提速**：不需要时 `gather_facts: false`
- **模板在控制节点渲染**，目标机无需装 Jinja2
- **filter 用管道**：`| default('x')`、`| dict2items`

</v-clicks>

::right::

```jinja
# templates/nginx.conf.j2
server {
    listen {{ http_port }};
    server_name {{ ansible_facts['fqdn'] }};
    root {{ doc_root }};
}
```

<div v-click>

`template` 先渲染再下发；`copy` 原样拷贝。

</div>

<!--
facts 是自动采集的主机信息——OS、IP、内存等，存进 ansible_facts 字典，那步隐式 Gathering Facts 就是在采。
不用时关掉可提速。Jinja2 模板的关键事实：渲染都发生在控制节点，目标机不需要装 Jinja2。
template 模块先渲染 .j2 再下发，copy 是原样拷贝。filter 用管道链式变换值，test 用 is 判断真假。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# role：可复用内容的标准封装

约定优于配置——按标准目录组织，各目录默认读 main.yml

::left::

```text
roles/nginx/
  tasks/main.yml       # 入口任务
  handlers/main.yml
  templates/           # template 默认找这
  files/               # copy 默认找这
  defaults/main.yml    # 默认变量(最低)
  vars/main.yml        # 角色变量(较高)
  meta/main.yml        # 依赖/元数据
```

::right::

**三种用法**

<v-clicks>

- `roles:` 关键字——经典静态，play 顶声明
- `import_role`——静态导入，可控位置
- `include_role`——动态，可配 `when` / `loop`
- 依赖写 `meta/main.yml`，被依赖者**先跑**

</v-clicks>

<!--
playbook 变大后，把装并配 Nginx 这类逻辑封成 role 复用。role 的威力来自约定优于配置的标准目录，
各目录默认读 main.yml，无需手动 include。defaults 最低给人覆盖，vars 较高。
用 role 三法：roles: 经典静态、import_role 静态可控位置、include_role 动态可配 when/loop。
要循环条件选 include_role，否则 import_role 或 roles:。依赖写 meta，被依赖者先跑。
-->

---
transition: fade-out
---

# collection 与 FQCN：2.10 的大拆分

引擎与内容彻底分离，用完全限定名引用

<v-clicks>

- **2.10 起**：`ansible-core`（引擎）与海量内容 collection 拆开，各自发版
- **社区包**（`pip install ansible`，13.x）= core + 一批预装 collection
- **FQCN**：`namespace.collection.module`，如 `community.general.docker_container`
- **`ansible.builtin`**：随 core 内置的核心集合（copy / template / service …）
- **Galaxy**：`galaxy.ansible.com` 检索安装，依赖锁进 `requirements.yml`

</v-clicks>

<div v-click>

```bash
ansible-galaxy collection install community.general
ansible-galaxy install -r requirements.yml
```

</div>

<!--
collection 是 2.10 起的分发格式，理解现代 Ansible 的关键背景：以前几千个模块塞一个大包，现在按领域拆进独立 collection，各自发版。
pip install ansible 装的社区包 = core + 一批预装 collection；只装 ansible-core 就只有 ansible.builtin。
FQCN 是 namespace.collection.module，2.10 后强烈建议总写 FQCN 避免同名歧义。
Galaxy 是社区分发平台，工程化把依赖写进 requirements.yml 锁版本、团队一键装齐。
-->

---
transition: fade-out
---

# Ansible Vault：加密敏感数据

密码 / 密钥不进明文 Git；但**只保护「静态数据」**

<v-clicks>

- **`ansible-vault`**：`create` / `edit` / `view` / `encrypt` / `decrypt` / `rekey`
- **`encrypt_string`**：只加密单个变量值，密文可嵌进普通 YAML
- **运行期供密**：`--ask-vault-pass` / `--vault-password-file` / `--vault-id`
- **只保护 data at rest**：解密后防泄露靠作者，`no_log: true` 屏蔽敏感输出

</v-clicks>

<div v-click>

```bash
ansible-vault encrypt_string 's3cr3t' --name 'db_password'
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

</div>

<!--
密码、API key、证书私钥不能明文进 Git，用 Ansible Vault 加密。可整文件加密，也能用 encrypt_string 只加密单个变量值嵌进普通 YAML。
运行带 Vault 内容的 playbook 时三选一提供密码。
但要记住：Vault 只保护静态数据 data at rest，一旦解密后运行期防泄露就是作者的责任——别在 debug 里打印解密后的密码，敏感 task 加 no_log。
-->

---
transition: fade-out
---

# check mode：先演练再动手

`--check` 只预测不改动，`--diff` 显示前后差异

<v-clicks>

- **模块须支持 check mode**：支持的报「会做什么」，不支持的什么都不做
- **`--diff`**：显示（将）变更的具体内容，尤其 `template` / `copy` 的文件 diff
- **task 级覆盖**：`check_mode: true` 强制演练，`false` 强制真跑（只读查询用）
- **`ansible_check_mode`**：布尔魔术变量，可在演练态跳过某些逻辑

</v-clicks>

<div v-click>

```bash
ansible-playbook site.yml --check --diff --limit web01
```

</div>

<!--
Ansible 的 dry run 就是 check mode，--check 只预测会改什么不真改，--diff 显示前后差异，两者常合用。
前提是模块支持 check mode，支持的报会做什么，不支持的什么都不报也不做。
task 级可以覆盖：check_mode: true 强制演练，false 强制真跑，适合只读查询类 task。
局限：依赖前一步注册变量的条件 task 在演练下可能无输出。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 规模化：forks · serial · strategy

并发多少、分几批滚动、齐步走还是各跑各的

::left::

<v-clicks>

- **`forks`**：并发主机数，默认 **5**，大批量调高（`-f 30`）
- **`serial`**：分批滚动发布，防「同时重启全站 = 瞬断」
- **`max_fail_percentage`**：单批失败超阈值就整体中止

</v-clicks>

::right::

```yaml
- hosts: webservers
  serial:
    - 1          # 先 1 台试水(金丝雀)
    - 5
    - "20%"      # 之后每批 20%
  max_fail_percentage: 20
```

<div v-click>

`strategy`：`linear`（默认齐步）/ `free`（各跑到底）

</div>

<!--
forks 是并发数默认只有 5，大批量要调高。默认一个 task 会在所有主机跑完才进下一个，发布服务时很危险，同时重启全站等于瞬断。
serial 把主机分批滚动，可以给递进列表做金丝雀：先 1 台试水，再 5 台，之后每批 20%，配 max_fail_percentage 熔断。
strategy 默认 linear 齐步走，free 是各主机自跑到底、不等别人。
-->

---
transition: fade-out
---

# 与 Terraform 互补：供给 vs 配置

各管一段，常组合使用，而非竞争

| 维度 | Terraform | Ansible |
| --- | --- | --- |
| 主职 | **供给**：建 VM / 网络 / DNS | **配置 + 部署 + 编排** |
| state | 维护 **state 文件**（真相之源） | **无中心 state**，现采 facts 收敛 |
| 删除语义 | 删资源块 → `apply` 自动销毁 | 删 task **不回收**，须显式 `state: absent` |

<div v-click>

> 典型组合：**Terraform 建出机器 / 网络 → Ansible 进去装软件、下发配置、编排发布**。无 state 让 Ansible 心智更轻，但它不记「上次建过什么」。

</div>

<!--
Ansible 和 Terraform 常被拿来比，其实互补而非竞争。Terraform 管供给——建 VM、网络、DNS，维护 state 文件作为真相之源，删资源块 apply 会自动销毁。
Ansible 管配置、部署、编排，无中心 state，每次现采 facts 靠幂等收敛，删 task 不会回收，要移除得显式 state: absent。
典型组合：Terraform 把机器建出来，Ansible 进去装软件下发配置。无 state 省去漂移和锁，但它不记上次建过什么。
-->

---
transition: fade-out
---

# AWX 与 Ansible Automation Platform

命令行之上，企业要 Web UI、RBAC、调度、审计

<v-clicks>

- **AWX**：上游开源项目，提供 Web UI + REST API + 任务引擎，免费
- **automation controller**（原 Tower）：取 AWX 加固后交付的组件
- **AAP**：Red Hat 商业订阅，打包 controller + 私有 Galaxy + EE 构建 + 官方支持
- **EE（Execution Environment）**：打包 core + collection + 依赖的容器镜像
- **`ansible-navigator`**：在 EE 容器里跑 playbook 的 CLI / TUI

</v-clicks>

<!--
裸命令行之上，企业需要 Web UI、RBAC、审批、调度、密钥托管、审计日志，这就是 AWX/AAP。
AWX 是上游开源项目免费；automation controller 就是原来的 Tower，取 AWX 加固后交付；AAP 是 Red Hat 商业订阅，打包 controller、私有 Galaxy、EE 构建加官方支持。
EE 是打包好依赖的容器镜像，解决环境漂移；ansible-navigator 就在 EE 容器里跑 playbook。选型：小规模裸 ansible-playbook 够用，团队协作上 AWX/AAP。
-->

---
layout: center
class: text-center
transition: fade-out
---

# 小结

**agentless + push**：只需 SSH，被管机零安装

四层 → **playbook → play → task → module，YAML 描述期望态**
幂等 → **`ok` vs `changed`；`command`/`shell` 靠 `creates`/`changed_when` 收敛**
复用 → **role（组织）→ collection（分发）→ Galaxy**
工程 → **Vault 加密 · `--check` 演练 · `serial` 滚动 · AWX/AAP**

<div class="mt-6 text-sm opacity-70">
配置管理定位，与 Terraform（供给）互补，无中心 state
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://docs.ansible.com/ansible/latest/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/ansible/ansible" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/engineering/iac/ansible/" target="_blank" class="slidev-icon-btn">
    <carbon:link />
  </a>
</div>

<!--
一页收束：agentless + push 是底座；四层结构 + 幂等是世界观；role/collection/Galaxy 是复用分发；Vault、check、serial、AWX 是工程化。
定位是配置管理，与 Terraform 供给互补，且无中心 state。下面三个图标分别是官方文档、GitHub 和我的笔记，欢迎深入。谢谢！
-->
