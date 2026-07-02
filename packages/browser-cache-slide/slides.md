---
theme: seriph
background: https://cover.sli.dev
title: 浏览器缓存机制
info: |
  浏览器缓存机制 —— 多层缓存命中链、内存与磁盘缓存、HTTP 缓存的浏览器侧落地、往返缓存 bfcache、Service Worker 缓存与 Cache API、观测与清除
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:layers class="text-8xl" />
</div>

<br/>

## 浏览器缓存机制

「200 但没发请求」是怎么回事：Service Worker、memory、disk、bfcache 各归谁管、怎么判读、怎么清

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Cache-Control、ETag、304 这些首部语义属于 HTTP 标准；但拿到这些头之后怎么决策，是浏览器自己的事。一次请求会依次面对 Service Worker、内存缓存、磁盘缓存好几层，前进/后退还有一层与 HTTP 缓存完全不同维度的整页快照 bfcache。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**浏览器拿到 HTTP 缓存头之后怎么决策**——每层归谁管、活多久、怎么观测、怎么清

<v-click>

- **多层缓存总览**：SW → memory → disk → 网络的命中序，push cache 之死与 103 Early Hints
- **内存缓存与磁盘缓存**：生命周期、放哪层的决策、DevTools Size 栏判读
- **HTTP 缓存的浏览器侧落地**：fresh/stale 之后怎么走、四种进入方式的行为矩阵
- **往返缓存 bfcache**：整页快照、pageshow/persisted、不可进入条件、诊断与埋点
- **Service Worker 缓存与 Cache API**：不看 HTTP 头、三种策略、版本化收尸
- **观测与清除**：Size 栏全标签、Application 面板、Clear-Site-Data、排查手册

</v-click>

<v-click>

> **网络章管「头是什么意思」，本章管「浏览器拿到头之后干了什么」。**

</v-click>

<!--
首部语义（max-age、ETag、强/协商缓存）属于 HTTP 协议本身，这里不重复。本章专讲浏览器侧的多层缓存实现与命中决策：先立命中链骨架，再拆浏览器自管的两层，然后是刷新行为差异、两个特殊物种（bfcache 与 SW 缓存），最后是观测与清除的工具箱。
-->

---
layout: section
---

# 多层缓存总览

一次请求要过几道关

---

# 一次请求要过几道缓存

页面里一行 `<img src="/logo.png">`，从发起至拿到字节，中途多次机会被「截住」

<v-click>

| 顺序 | 缓存层 | 归谁管 | 一句话职责 |
| --- | --- | --- | --- |
| 1 | **Service Worker（Cache API）** | 开发者代码 | `fetch` 事件拦截，`caches.match()` 直接回响应 |
| 2 | **memory cache** | 浏览器（渲染进程） | 本标签页刚用过的资源，内存复用近 0ms |
| 3 | **disk cache** | 浏览器（网络栈） | 「HTTP 缓存」本体：按语义判新鲜，跨会话持久 |
| 4 | **网络** | — | 以上全 miss（或需协商验证）才真正出网 |

</v-click>

<v-click>

> 越靠前越快，**命中即短路后面所有层**；bfcache 不在这条链上——它作用于「整页导航」而非「单个资源请求」。

</v-click>

<!--
web.dev 原文：浏览器发出的所有 HTTP 请求都会先被路由到浏览器缓存，检查是否有可用的有效缓存响应。三点关键认知：每层归属不同、每层寿命不同、bfcache 是另一个维度的东西。
-->

---

# 分层全景：归属、寿命与语义

每层「归属」不同，每层「寿命」不同

<v-click>

| 层 | 生命周期 | 遵守 HTTP 语义？ | Size 栏 |
| --- | --- | --- | --- |
| SW（Cache API） | 显式删除才消失 | **否**，代码全权做主 | `(ServiceWorker)` |
| memory cache | 标签页会话，关 tab 即失效 | 宽松（实现细节） | `(memory cache)` |
| disk cache | 跨会话持久，容量满按 LRU 淘汰 | **是**（RFC 9111） | `(disk cache)` |

</v-click>

<v-click>

- **Cache API 归你管**：代码写什么就存什么；memory/disk 归浏览器管——不可编程读写，只能靠 HTTP 头影响
- Size 栏的 `(ServiceWorker)` / `(memory cache)` / `(disk cache)` / `(prefetch cache)` 就是各层「身份证」

</v-click>

<!--
Cache API 条目不删就一直在；memory cache 随标签页关闭蒸发；disk cache 跨重启存活。prefetch cache 是 rel=prefetch 拉回的下一页资源暂存区，属于投机加载维度，后面观测一章还会见到。
-->

---

# 命中决策流

以被 Service Worker 控制的页面请求一张图片为例

<v-click>

```text
请求 ──► ① SW 拦截（fetch 事件）─ caches.match() 命中 ──► (ServiceWorker)
           │ fetch() 放行
           ▼
         ② memory cache ── 本文档刚用过 ──► (memory cache)  近 0ms
           │ miss
           ▼
         ③ disk cache ── 新鲜（fresh）──► (disk cache)  灰色 200
           │ 陈旧（stale）/ 无副本
           ▼
         ④ 网络 ── 条件请求：304 续命 / 200 换新；或全量下载
```

</v-click>

<v-click>

> 陈旧 ≠ 重下：浏览器自动带 `If-None-Match` / `If-Modified-Since` 出网协商，`304` 只回头不回体。

</v-click>

<!--
SW 代码可以 caches.match 直接回缓存副本，也可以 fetch 放行，放行的请求继续走后面的层。memory cache 服务本标签页刚加载过的同一资源，比如同页两处引用同一张图。disk cache 按 Cache-Control 判定新鲜或陈旧。
-->

---

# memory cache 会「短路」SW

心智模型 ≠ 实现规范：Chrome 真实实现的著名出入（w3c/ServiceWorker#1174）

<v-click>

- **memory cache 位于渲染进程内部**：同一文档内的重复请求若在 memory cache 命中，请求**根本不会派发出去**
- 结果：**SW 的 `fetch` 事件不会触发**——内存级复用对 SW 完全不可见
- 对照：**disk cache 命中前 `fetch` 事件会正常触发**
- 实战含义：别假设 SW 能观测到页面的**每一个**资源请求

</v-click>

<v-click>

> 分层顺序是最常见的教学模型——拿它建立直觉，别当严格实现规范。

</v-click>

<!--
服务工作线程规范仓库把这个行为记录为 issue 1174。同文档内的内存级复用发生在渲染进程内部，请求根本不会走到 SW 那一层，这是分层图与真实实现最著名的出入。
-->

---

# push cache 已死

经典「四级缓存」的第四级，已随 HTTP/2 Server Push 一起谢幕

<v-click>

| 时间 | 事件 |
| --- | --- |
| 2022-09 | **Chrome 106** 默认禁用 HTTP/2 Server Push，其他 Chromium 系随后跟进 |
| 2024-10 | **Firefox 132** 默认禁用：「目前没有任何其他主流浏览器支持该特性」 |

</v-click>

<v-click>

- **没人用**：移除决定时仅 **1.25%** 的 HTTP/2 站点在用，后续统计跌到 **0.7%**
- **性能不及预期**：Chrome 官方分析「没有明确的净性能收益，很多情况下反而回退」——服务端看不见浏览器缓存，重复推送白烧带宽
- **HTTP/3 名存实亡**：push 写进了规范，但「很多 HTTP/3 服务端与客户端根本没实现」

</v-click>

<v-click>

> 今天再画命中链，第四级直接是**网络**——网上 2018~2021 年的「四级缓存」图文已过时。

</v-click>

<!--
Server Push 推来的资源先落在连接级的 push cache 里，等页面真正请求时再被认领。两个天生软肋：跟着连接走，连接一关未认领的推送作废；服务端看不见浏览器缓存，客户端磁盘里明明有新鲜副本照推不误。Firefox 132 把 network.http.http2.allow-push 默认置为 false，并预告实现可能彻底删除。
-->

---

# 继任者：103 Early Hints

从「服务端硬塞」改成「服务端提示、浏览器自己拉」

<v-click>

```http
HTTP/1.1 103 Early Hints
Link: </app.css>; rel=preload; as=style

HTTP/1.1 200 OK
Content-Type: text/html
```

</v-click>

<v-click>

- 正式响应还没生成时（比如后端在查库），**提前告诉浏览器「待会儿要用这些资源」**
- 浏览器收到提示后**结合本地缓存自行决定**要不要提前拉取——已有的资源不会重复传输，正好补上 Server Push 的最大短板
- Chrome 官方评价：「出错概率小得多的替代方案」

</v-click>

<!--
103 是临时响应，赶在 200 之前到达。决定权从服务端交还给浏览器：缓存里已有的资源不会被重复传输。Early Hints 与 HTTP 演进的完整脉络在网络章。
-->

---

# 归属决定排查路径

分层的最大实用价值：把「用户拿到旧资源」翻译成「去哪一层修」

<v-click>

| Size 栏证据 | 命中层 | 修在哪 |
| --- | --- | --- |
| `(ServiceWorker)` | Cache API | 改 SW 代码：版本化换仓、activate 收尸 |
| `(disk cache)` | HTTP 缓存 | 改响应头策略：哈希 URL + 正确 `Cache-Control` |
| `(memory cache)` | 内存复用 | 通常无需修——关标签页自愈，测试换新标签页 |
| 无请求、整页是旧状态 | bfcache | 不是资源问题：`pageshow(persisted)` 里刷新时效数据 |

</v-click>

<v-click>

- 别混谈的维度：**单资源命中链**（一个个请求）/ **bfcache**（一次前进/后退导航）/ **prefetch cache**（还没发生的下一次导航）/ V8 编译代码缓存（引擎级，对开发者透明）

</v-click>

<v-click>

> 排查缓存问题，先问「我面对的是哪张地图」，再谈去哪层找旧副本。

</v-click>

<!--
四张地图各归各位：单资源命中链作用于一个个请求；bfcache 作用于一次前进/后退导航，恢复的是完整执行状态；prefetch cache 暂存预取的下一页资源；V8 的 script cache 缓存脚本编译产物，知道存在即可。
-->

---
layout: section
---

# 内存缓存与磁盘缓存

浏览器自管的两层

---

# memory cache：文档会话里的短命高速层

活在渲染进程的内存里，服务对象是「当前这个文档」

<v-click>

- **复用粒度是文档会话**：同一标签页里刚加载过的资源，再次请求直接从内存兑现
- 典型命中：一张商品图在列表出现 20 次——只有第一次真正走网络/磁盘，**其余 19 次全是 `(memory cache)`**；`preload` 预取的资源被正式使用时认领
- **生命周期短**：关标签页、渲染进程退出即蒸发；**不跨标签页共享**（每个渲染进程各一份）
- **快**：无磁盘 I/O、无进程间通信，DevTools Time 栏常显示 **0ms**

</v-click>

<v-click>

> 它是**实现细节而非标准行为**：对 HTTP 头的遵守比 disk cache 宽松、各浏览器不承诺一致——把它当成不可控的加速红利，正确性永远建立在 HTTP 语义之上。

</v-click>

<!--
RFC 9111 定义的「私有缓存」指的是 disk cache 那套按新鲜度工作的机制；memory cache 的匹配与保留策略是各浏览器的内部实现。别写「依赖某资源一定在或一定不在内存缓存」的逻辑。页面内脚本对同一 URL 的重复 fetch（可缓存的 GET）也可能命中。
-->

---

# disk cache：HTTP 缓存的本体

标准意义上的「浏览器 HTTP 缓存」（Chrome 对应 profile 目录下的 Cache 文件）

<v-click>

- **严格遵守 HTTP 语义**：存不存看 `Cache-Control` / 启发式规则；用不用看新鲜度；陈旧后带条件头协商
- **跨会话持久**：重启浏览器、重启系统都还在——「一年 `max-age` + 文件名带哈希」策略的物质基础
- **容量有限、自动淘汰**：满了按近期使用情况淘汰——「缓存一年」是「**最多**一年」，不是保证
- **全 profile 共享**：A 标签页下载过的资源，B 标签页直接命中 `(disk cache)`
- **落盘即痕迹**：敏感响应配 `no-store` 的实质是「**别让隐私数据写进磁盘**」，不是性能考量

</v-click>

<v-click>

> `304` 协商成功后，续命续的正是 **disk cache** 里那份副本的新鲜期。

</v-click>

<!--
磁盘缓存上限随磁盘空间动态调整。落盘意味着共享电脑、取证场景可见，这才是 no-store 的实质理由。协商成功的 304 会按新响应头刷新磁盘副本的新鲜期。
-->

---

# 浏览器怎么决定「放哪层」

没有规范可查，是浏览器内部启发式（以 Chrome 为例）

<v-click>

| 因素 | 倾向 |
| --- | --- |
| 是否本文档刚用过 | 刚加载过的保留在 memory cache，供同文档复用 |
| 资源大小 | 大文件（视频分片、大图）倾向只走磁盘，避免挤占渲染进程内存 |
| 内存压力 | 内存紧张时 memory cache 更早被清理，后续命中降级为 disk cache |

</v-click>

<v-click>

- **不可编程**：没有「请把这个文件放内存」的头或 API——抓手是 HTTP 语义 + `preload`
- **两次刷新来源可能不同**：先 `(memory cache)` 后 `(disk cache)` 属正常现象（内存副本被回收）
- **测缓存要干净基线**：验证 `Cache-Control` 策略用**新标签页**或重启浏览器，绕开内存层干扰

</v-click>

<!--
性能优化的抓手：让 disk cache 尽可能命中，以及用 preload 让关键资源提前进入本文档的服务半径。内存降级不是缓存失效，磁盘副本仍在新鲜期内，只是少了零拷贝级的加速。
-->

---

# DevTools 判读：Size 栏 × Time 栏

Network 面板是判读主战场

<v-click>

| Size 栏显示 | 含义 | Time 栏特征 |
| --- | --- | --- |
| `(memory cache)` | 内存命中，未发请求 | 常为 0ms |
| `(disk cache)` | 磁盘命中，未发请求 | 微小但非零（有磁盘 I/O） |
| 字节数 + Status 304 | 发了条件请求，服务端确认未变 | 一个网络来回 |
| 字节数 + Status 200 | 完整下载 | 正常网络耗时 |

</v-click>

<v-click>

> 勾了 **Disable cache** 为什么还能看到缓存命中？它只禁 HTTP 缓存（memory + disk）、且仅 DevTools 打开期间生效——**不禁 SW 的 Cache API**。要连 SW 一起绕过，去 Application → Service workers 勾 **Bypass for network**。

</v-click>

<!--
Size 栏有括号等于没花流量；Status 304 等于花了一个来回但没花响应体。排查用户拿到旧版时，第一眼永远先看 Size 栏，它告诉你旧资源来自哪一层。
-->

---

# 三连实验：亲手看两层的差别

拿任意静态资源丰富的站点验证

<v-click>

1. **首次访问**（或先清缓存）：资源全部显示真实传输字节——全走网络
2. **同标签页刷新**：`(memory cache)` 与 `(disk cache)` 混合——刚用过的在内存，其余从磁盘拿
3. **重启浏览器再访问**：内存副本蒸发，命中的全部是 `(disk cache)`

</v-click>

<v-click>

| 资源 | ① 首访 | ② 同 tab 刷新 | ③ 重启后再访 |
| --- | --- | --- | --- |
| `logo.svg`（小图，页内多处复用） | 4.2 kB / 200 | `(memory cache)` | `(disk cache)` |
| `app.3f2a.js`（哈希长缓存） | 180 kB / 200 | `(disk cache)` | `(disk cache)` |
| `hero.mp4`（大文件） | 2.1 MB / 200 | `(disk cache)` | `(disk cache)` |
| `index.html`（`no-cache`） | 12 kB / 200 | 条件请求 / 304 | 条件请求 / 304 |

</v-click>

<!--
实验结果因资源大小与内存状况浮动，属正常。大文件倾向只走磁盘；配了 no-cache 的 HTML 每次必协商；哈希长缓存的 JS 稳定命中磁盘层。
-->

---

# 高频问答

入门期最常撞上的四问

<v-click>

- **能把资源「钉」在内存缓存里吗？** 不能——分配对开发者完全不透明；最接近的是 `preload`（让关键资源提前进入本文档服务半径），需要**可编程**的常驻缓存请用 Cache API
- **`preload` 和 `prefetch` 同一层吗？** 不是一个语义：`preload` 服务**本页马上要用**的资源；`prefetch` 拉**下一页可能用**的，命中显示独立的 `(prefetch cache)`
- **隐身窗口的缓存去哪了？** 不与常规 profile 互通、随会话结束丢弃——天然的「干净基线」
- **304 之后 Size 栏为何还是字节数？** 那行记录的是**这次条件请求本身**（头部传输）；效果体现在**下一次**——副本续命，新鲜期内再访问变回 `(disk cache)`

</v-click>

<!--
另一个相关信号：控制台的「resource was preloaded but not used within a few seconds」警告，说的是资源提前进了缓存服务半径却没人认领，preload 了不用白占带宽与内存。
-->

---
layout: section
---

# HTTP 缓存的浏览器侧落地

fresh / stale 之后，浏览器怎么走

---

# 浏览器侧的命中流程

web.dev：「浏览器发出的所有 HTTP 请求都会**先被路由到浏览器缓存**」

<v-click>

1. **查副本**：缓存里没有这个 URL 的条目 → 出网，按响应头决定是否入库
2. **判新鲜**：有副本且仍新鲜（`Age` vs `max-age`）→ **直接兑现，请求不出网**——灰色 200 + `(disk cache)` / `(memory cache)`
3. **陈旧 → 协商**：**自动**带条件头（`ETag` → `If-None-Match`，`Last-Modified` → `If-Modified-Since`）——`304` 不传体、副本续命；`200` 新副本替换旧条目
4. **陈旧且无验证器** → 只能当无缓存处理，完整重下

</v-click>

<v-click>

> 条件头由浏览器根据缓存里的验证器**自动附上**，业务代码全程无感。

</v-click>

<!--
缓存命中的 200，JS 照样执行：缓存兑现的是与当年网络响应字节相同的副本，解析、执行、渲染一切照旧——缓存只是省了传输，没省使用。304 省的是带宽而非延迟，仍花一个完整往返，所以高频小资源与其依赖 304 不如给足 max-age。
-->

---

# 两个高频出事的细节

启发式缓存与 `Vary`

<v-click>

- **没写头 ≠ 不缓存**——web.dev 原文：「**省略 `Cache-Control` 响应头并不会禁用 HTTP 缓存！**」浏览器会针对内容类型猜测最合适的缓存行为
- 生产事故常态：「我没设缓存啊」的接口/页面被启发式缓存住
- 结论：**每个响应都显式声明 `Cache-Control`**——要么给新鲜期，要么 `no-cache` / `no-store` 说清楚

</v-click>

<v-click>

- **缓存键不只是 URL**：响应带 `Vary`（如 `Vary: Accept-Encoding, Origin`）时，匹配副本要连所列**请求头的值**一起比对
- 后果两面：同一 URL 可存**多份副本**；也可能「明明缓存过却不命中」

</v-click>

<!--
启发式缓存是「我没设缓存啊」类事故的根源。Vary 影响的是查副本环节：请求头不同就是不同的缓存键。
-->

---

# 四种进入方式：穿透力递增

同一个 URL，「怎么到达」决定穿透到哪一层（2025-03 实测，csswizardry 考据）

<v-click>

| 进入方式 | 主文档 | 子资源 | 能否 304 |
| --- | --- | --- | --- |
| 地址栏回车 / 点链接 | 无特殊头，完整走缓存规则 | 新鲜则不发请求 | 陈旧时可 |
| 普通刷新（F5 / ⌘R） | 强制重验证（三家带头不同） | **照常走缓存，不连坐** | 主文档可（Safari 否） |
| 强制刷新（⌘⇧R） | `no-cache` + `Pragma`，**无条件头** | 同主文档，全量重下 | **不可能** |
| DevTools Disable cache | 绕过 HTTP 缓存 | 全部绕过（不含 Cache API） | 否 |

</v-click>

<v-click>

> 强刷「没有浏览器带验证头，304 无从谈起」；移动端没有强刷手势——下拉刷新等价普通刷新，又多一条「根治靠版本化 URL」的理由。

</v-click>

<!--
强制刷新是 Cmd+Shift+R 或 Ctrl+Shift+R，三家一致带 Cache-Control: no-cache 加 Pragma: no-cache 且不带条件头。Disable cache 只在 DevTools 打开期间生效。
-->

---

# 普通刷新：三家「狠劲」不同

用户按刷新 = 「怀疑这页旧了」——只对**主文档**强制重验证

<v-click>

| 浏览器 | 主文档请求头 | 效果 |
| --- | --- | --- |
| Chrome | `Cache-Control: max-age=0` + 条件头 | 居中：视作陈旧、请重验证，可 304 |
| Firefox | 仅条件头 | 最温和：能 304 就 304 |
| Safari | `no-cache` + `Pragma: no-cache`，无条件头 | 最激进：主文档必全量重下 |

</v-click>

<v-click>

- **子资源不连坐**：Chrome 2017「Reload, reloaded」改革——此前刷新会重验证所有子资源，改革后按灰度数据 304 验证请求**约减少一半**
- 推论：静态资源配了长 `max-age`，**用户普通刷新也不会打爆你的 304**

</v-click>

<!--
Reload, reloaded 是 Chromium 官方博客 2017 年 1 月的改革公告，灰度数据出自 loading-dev 邮件组。Firefox 走了另一条路：实现 immutable 指令做逐资源豁免，下一页展开。
-->

---

# immutable 与请求方向的指令

对「刷新」的定向豁免，以及 `max-age=0` vs `no-cache`

<v-click>

- **`Cache-Control: immutable`**：向浏览器承诺「新鲜期内内容**绝不改变**」——普通刷新也不必对它重验证
- 历史：Firefox 走「实现 `immutable`、逐资源豁免」（Facebook 推动）；Chrome 走「改掉刷新行为、子资源不连坐」——殊途同归
- 今天给哈希资源写 `max-age=31536000, immutable` 仍是最佳实践：尊重该指令的浏览器精确豁免，Chrome 里也无害

</v-click>

<v-click>

| 请求方向指令 | 语义 |
| --- | --- |
| `max-age=0` | 「视作陈旧，请重验证」——验证不可达时缓存**仍可**兜底复用 |
| `no-cache` | 「**必须**验证成功才准用缓存」——更严格，强制刷新用它 |

</v-click>

<!--
这两个指令出现在请求头里时，是浏览器对沿途缓存（本地加代理）说话。Pragma: no-cache 是 HTTP/1.0 时代的兼容遗产，与 Cache-Control: no-cache 成对出现，照顾极老的中间缓存。
-->

---

# `no-store` 的波及面

语义是「任何缓存都不得存储」，但各层落地并不一刀切

<v-click>

| 层 | 受影响？ | 说明 |
| --- | --- | --- |
| disk cache | **是** | 完全不写入磁盘 |
| memory cache | **是**（目标行为） | 实现细节，别把安全性押在这上面 |
| bfcache | 历史阻断 → **Chrome 已有条件放宽** | 存的是页面快照不是响应，本就不归 RFC 9111 管 |
| SW Cache API | **否** | 不看任何 HTTP 缓存头——`cache.put()` 什么就存什么 |

</v-click>

<v-click>

> 敏感响应要防 SW 缓存，**响应头拦不住**，得靠代码约定；bfcache 的放宽规则（CCNS）第四章展开。

</v-click>

<!--
no-store 是缓存指令不是安全机制，真正的敏感数据要靠鉴权与传输安全兜底。memory cache 历史上在同文档复用上存在过灰色地带，别把边界押在内存层行为上。
-->

---

# 判走向速练：响应头 × 进入方式

副本已在缓存中，均为 Chrome 行为

<v-click>

| 响应头 | 正常导航 | 普通刷新 | 强制刷新 |
| --- | --- | --- | --- |
| `max-age=31536000, immutable` | **零请求** | 不连坐，零请求 | 全量 200 |
| `no-cache` + `ETag` | 条件请求 → 通常 304 | 304 / 200（带条件头） | 全量 200 |
| `max-age=600` | 零请求，过期后协商 | 主文档才强制验证 | 全量 200 |
| `no-store` | **每次全量重下** | 同左 | 同左 |
| 什么都没写 | **启发式接管**，不可预期 | 视启发式副本状态 | 全量 200 |

</v-click>

<!--
max-age=600 那行：600 秒即 10 分钟内零请求，作为子请求时走正常导航列的规则；普通刷新时 Chrome 主文档带 max-age=0 加条件头。会读这张表，就能从现象反推响应头配置——反向断案：用户明明刷新了还是旧页，说明普通刷新只重验证主文档这一层，问题多半在别层（SW 或代理）。
-->

---

# 实战：发版后用户拿到旧页面

最经典的事故链：HTML 入口被配了长 `max-age`（或被启发式缓存）

<v-click>

- 旧 HTML 一直引用**旧哈希**的 JS/CSS——你怎么发版都无效
- **先判层**：Size 栏 `(disk cache)` → HTTP 缓存层问题；`(ServiceWorker)` → 查 SW 缓存版本化
- **强刷只能救自己**：你按 ⌘⇧R 看到新版 ≠ 用户看到新版——没有用户会强刷，且新鲜期内的正常导航**连请求都不发**

</v-click>

<v-click>

- **根治靠正确分工**（web.dev 推荐配方）：
  - 带哈希的静态资源：`Cache-Control: max-age=31536000, immutable`——URL 变即新资源，缓存一年也安全
  - HTML 入口等无版本 URL：`Cache-Control: no-cache` 配 `ETag` 走 304——发版后下一次导航即拿到新 HTML
- **SPA 隐蔽变体**：**每条 fallback 路由**返回的 HTML 都得是 `no-cache`——`curl -sI` 逐条深链接核对最稳

</v-click>

<!--
服务端已错发长缓存的止血：改对响应头后等旧副本自然过期，或上 Clear-Site-Data（注意兼容坑，第六章讲）。排查时别忘了 CDN、代理等共享缓存，那在服务侧。静态托管平台对 rewrite 响应的默认缓存策略各不相同。
-->

---
layout: section
---

# 往返缓存 bfcache

不缓存响应，缓存整页执行状态

---

# 整页快照 vs HTTP 缓存

web.dev 定义：「整个页面在内存中的快照（**包括 JavaScript 堆**）」

<v-click>

| 维度 | HTTP 缓存 | bfcache |
| --- | --- | --- |
| 缓存单位 | 单个请求的**响应** | **整页执行状态**（DOM + JS 堆 + 滚动位置） |
| 恢复成本 | 仍需解析 + 执行 JS 重建 | 直接解冻，近乎瞬时 |
| 存储位置 | 磁盘为主（+内存） | **仅内存** |
| 生效场景 | 任何重复请求 | 仅**前进/后退**（Chrome 常规页上限 10 分钟） |

</v-click>

<v-click>

- 支持面：Firefox / Safari 多年前就有；**Chrome 96 起对桌面+移动全量启用**
- 收益巨大：**桌面 1/10、移动 1/5** 的导航是前进/后退；「bfcache 恢复的重访问**永远比 HTTP 缓存更快**」（web.dev）

</v-click>

<!--
传统后退要重新走一遍导航：取 HTML、解析、执行 JS、重建状态；bfcache 直接跳过这一切——离开时页面不销毁而是冻结，返回时解冻，JS 从暂停处继续跑。一次页面加载所需的全部请求都恰好命中 HTTP 缓存的情况非常罕见，所以 bfcache 恢复永远更快。
-->

---

# 感知恢复：pageshow / pagehide

bfcache 恢复**不触发 `load`**、不重新执行脚本——感知靠生命周期事件

<v-click>

```js
// pageshow：初次加载（load 之后）和每次从 bfcache 恢复时都触发
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // true ⇒ 本页刚从 bfcache 解冻
    // 典型动作：补记一次 PV、刷新时效数据（登录态 / 购物车 / token）
  }
});
// pagehide：页面卸载或将被放入 bfcache 时触发
window.addEventListener("pagehide", (event) => {
  // persisted 为 true ⇒ 浏览器「打算」缓存本页——但不保证最终成功
});
```

</v-click>

<v-click>

- Chromium 系另派发 Page Lifecycle API 的 **`freeze` / `resume`**：`resume` 在恢复时**先于 `pageshow`** 触发；也覆盖「后台标签页被冻结」场景

</v-click>

<!--
pageshow 的 persisted 为 true 表示本页刚从 bfcache 恢复；pagehide 的 persisted 为 true 只表示浏览器打算缓存，不保证成功。
-->

---

# 冻结期间发生了什么

离开时页面不销毁而是**冻结**，返回时**解冻**

<v-click>

- **几乎所有队列任务暂停**：未决的定时器、Promise 都停住，恢复时从暂停处**续跑**
- 连带风险：被暂停任务若属于某个 **IndexedDB 事务**，而同源其他标签页正访问同一个库，可能互相影响——这也是「打开着 IndexedDB 连接的页面不给进」的原因之一
- 页面在 bfcache 里收到 **BroadcastChannel 消息**会被逐出

</v-click>

<v-click>

> JS 堆原样冻结、原样回来——用户以为的「重新打开」，可能根本没重新初始化。

</v-click>

<!--
启动逻辑里不能假设「每次可见必然刚跑过 init」。多标签页共享的 IndexedDB 事务是冻结期间唯一要警惕的连带效应。
-->

---

# 不可进入条件清单

浏览器只把「冻结后能安全复活」的页面放进 bfcache

<v-click>

| 阻断项 | 对策 |
| --- | --- |
| **`unload` 监听**（头号杀手） | **永远别用**：改 `pagehide`；`Permissions-Policy: unload=()` 防第三方 |
| `Cache-Control: no-store` | Chrome 已有条件放宽（下页）；动态页用 `no-cache` |
| 打开的 IndexedDB **连接** | 空闲即关；`pagehide` 里 `db.close()` |
| 进行中的 fetch / XHR | 完成或用 `AbortController` 中止 |
| 打开的 WebSocket / WebRTC | `pagehide` 关闭，`pageshow(persisted)` 重连 |
| 非空 `window.opener` | `rel="noopener"`（`target="_blank"` 现代默认） |

</v-click>

<v-click>

- `unload`：桌面直接失格，移动端**事件永不执行**；`beforeunload` 不阻断——保存后即摘

</v-click>

<!--
「永远不要用 unload」是 web.dev 原话。unload 的分端行为：桌面 Chrome/Firefox 页面直接失格；移动端 Chrome 与 Safari 会尝试缓存，但 unload 永远不执行。beforeunload 现代浏览器已不阻断，但应有未保存更改才挂、保存后立刻摘。依赖 window.postMessage 控制弹窗的场景，开窗者与被开窗者都进不了 bfcache。
-->

---

# CCNS：no-store 的有条件放行

带 `Cache-Control: no-store` 的页面，历史上一律不进 bfcache（Chrome 已放宽）

<v-click>

- **Chrome 116 起实验、2025 年 3~4 月全量**：改为「有条件允许进入」
- 逐出条件一：**Cookie 或其他授权凭据发生变化**即逐出
- 逐出条件二：页面内 fetch/XHR 的响应**若也带 `no-store`** 即逐出
- 存活时限：从常规页的 **10 分钟压到 3 分钟**

</v-click>

<v-click>

> 实践建议：只给真正敏感的页面配 `no-store`；普通动态页用 `no-cache` 即可两全——既保新鲜，又不挡 bfcache。

</v-click>

<!--
CCNS 即 Cache-Control: no-store 页面的 bfcache 放宽，规则详见 Chrome 官方文档 bfcache-ccns。放宽的逻辑：bfcache 存的是页面快照不是响应，语义上本就不是 RFC 9111 管的缓存。
-->

---

# 诊断：NotRestoredReasons 与 DevTools

线上真实用户为什么没命中？导航条目直接给出原因

<v-click>

```js
// 未从 bfcache 恢复的原因（NotRestoredReasons API，Chrome 125+，实验性）
const [nav] = performance.getEntriesByType("navigation");
console.log(nav.notRestoredReasons);
// { url: "…", reasons: [{ reason: "unload-listener" }],
//   children: [...同源 iframe 逐个列出...] }
```

</v-click>

<v-click>

- 常见 reason：`unload-listener`、`websocket`、`fetch`、`lock`、`response-cache-control-no-store`、`broadcastchannel-message`；**跨域 iframe 的原因折叠为 `masked`**（防跨域信息泄露）
- **DevTools**：Application → **Back/forward cache** → **Run Test**——自动「导航离开再返回」，失败列出原因，标 *Actionable* 的是开发者可修的
- **Lighthouse 10.0 起**内置 bfcache 审计；该 API Firefox/Safari 未实现

</v-click>

<!--
老式的 PerformanceNavigation.type === TYPE_BACK_FORWARD 只能算命中率、给不出原因，已不推荐。bfcache 命中率监控：用 back_forward 导航数与其中 bfcache 恢复数两个计数相除。
-->

---

# 对埋点与 SPA 的影响

恢复不触发 `load`——统计与状态都要为它改口径

<v-click>

- **PV 少算**：传统「load 时上报」漏掉这批访问——`pageshow(persisted)` 里补报；Firefox/Safari 用户「你多半早就在少算了」
- **Core Web Vitals 口径**：恢复后 **LCP 用 `pageshow` 时间戳到下一帧绘制的差值**、**INP/CLS 归零重计**——否则数据分布显得变慢，用户体验实际变好了
- **会话终点**：`unload` 移动端常根本不触发、挂它还阻断 bfcache——用 **`visibilitychange`（转 hidden）/ `pagehide` + `sendBeacon`**

</v-click>

<v-click>

- **SPA**：站内路由切换是同文档行为，**与 bfcache 无关**；作用场景是「从 SPA 跳去第三方支付页再按后退回来」
- 恢复时 **JS 堆原样回来**：Pinia/Redux 状态、定时器、组件树停在离开那一刻——在 `pageshow(persisted)` 里做「回魂检查」：登录态、余额/库存/购物车拉新、断开的 WebSocket 重连

</v-click>

<!--
零成本还原是好处，坏处是时效性数据全是旧的。回魂检查要统一做：登录态是否过期、数据是否要拉新、被 pagehide 断开的连接重连。
-->

---
layout: section
---

# Service Worker 缓存与 Cache API

开发者全权的可编程缓存层

---

# CacheStorage 与 Cache：模型与 API 面

全局 `caches`：window / worker 通用（**不限于 SW**）；按源隔离、仅 HTTPS

<v-click>

| 方法 | 语义 |
| --- | --- |
| `caches.open(name)` | 取具名 `Cache`，**不存在则创建** |
| `caches.match(req)` | 在**登记的所有 Cache** 中查找匹配项 |
| `caches.keys()` / `delete(name)` | 缓存名列表 / 整仓删除——版本化清理的原料 |
| `cache.add(req)` / `addAll(reqs)` | **fetch 并存入**；非 2xx 即 reject，一条失败整批失败 |
| `cache.put(req, resp)` | 直接写入一对键值（**不校验状态码**），同键覆盖 |
| `cache.match` / `delete` / `keys` | 查 / 删 / 列条目 |

</v-click>

<v-click>

- 匹配默认参与 **`Vary`** 头；`ignoreSearch` / `ignoreMethod` / `ignoreVary` 选项可放宽

</v-click>

<!--
Baseline 2018 年 4 月起全浏览器可用。非 HTTPS 直接 SecurityError，Firefox 隐私窗口可能不可用。每个 Cache 存 Request/Response 键值对，键是 Request，实践中常直接传 URL 字符串；cache.match 还有 matchAll 变体。
-->

---

# 与 HTTP 缓存的根本区别

MDN 原文：「**Cache API 不遵守 HTTP 缓存头**」

<v-click>

| 维度 | HTTP 缓存（disk cache） | Cache API |
| --- | --- | --- |
| 谁决定存什么 | 服务端响应头 | **开发者代码**（`put`/`add` 什么存什么） |
| 过期机制 | 新鲜期一到自动陈旧、可协商续命 | **没有**——「不删除就不过期」 |
| 更新机制 | 浏览器自动协商（304/200） | 开发者自己 fetch 新版、自己写回 |
| 淘汰 | 容量满 LRU 逐条淘汰 | 配额压力下**整源一起删**（all-or-none） |
| 对页面 | 透明（页面无感知） | 完全可编程（`fetch` 事件里任意决策） |

</v-click>

<v-click>

- 纪律一：**敏感数据防缓存不能只靠响应头**——`no-store` 拦不住一行 `cache.put()`
- 纪律二：**忘了清理 = 用户永远旧版**——版本化清理不是优化项，是**正确性要求**

</v-click>

<!--
条目不主动更新、不删除就不过期——存、更、删全是开发者的责任。这两条纪律是本章后半部分的主线。
-->

---

# 策略①：cache-first

适合带哈希的静态资源（JS/CSS/字体/图）——内容不可变，越快越好

<v-click>

```js
// cache-first：先查缓存，命中直接回；未命中走网络并写回
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached; // 缓存命中：0 网络成本
      return fetch(event.request).then((resp) => {
        // 响应流只能消费一次：一份给页面、一份克隆后入缓存
        const clone = resp.clone();
        caches.open("static-v2").then((cache) => cache.put(event.request, clone));
        return resp;
      });
    }),
  );
});
```

</v-click>

<!--
SW 在 fetch 事件里编排 Cache API 与网络，就是「缓存策略」。cache-first 的新鲜度最低，靠版本化换仓保证正确性。
-->

---

# 策略②：network-first

适合接口数据、HTML 入口——新鲜度优先，缓存做离线兜底

<v-click>

```js
// network-first：先走网络，失败（离线/超时）才回退缓存
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        const clone = resp.clone();
        caches.open("data-v1").then((cache) => cache.put(event.request, clone));
        return resp; // 网络成功：顺手更新缓存副本
      })
      .catch(() => caches.match(event.request)), // 网络失败：用旧副本救场
  );
});
```

</v-click>

<!--
网络成功时顺手把副本写回缓存，离线或超时时才回退到缓存里的旧副本救场。新鲜度最高的可编程策略。
-->

---

# 策略③：stale-while-revalidate

适合头像、配置等「旧一拍也能接受」的资源——速度与新鲜度折中

<v-click>

```js
// stale-while-revalidate：立即回缓存副本，同时后台拉新写回
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("swr-v1").then(async (cache) => {
      const cached = await cache.match(event.request);
      const refresh = fetch(event.request).then((resp) => {
        cache.put(event.request, resp.clone()); // 下次请求就是新的
        return resp;
      });
      return cached ?? refresh; // 有旧用旧，没旧等网络
    }),
  );
});
```

</v-click>

<v-click>

> 选型速记：**哈希静态资源 cache-first · 接口/HTML network-first · 可容忍旧一拍 SWR**。

</v-click>

<!--
补充两个极端策略：network-only 适合支付等绝不容忍旧数据的场景；cache-only 适合预缓存的离线专用资源。
-->

---

# 版本化清理：install 备货、activate 收尸

Cache API 没有过期机制——「发新版」必须显式换仓（MDN：按名字给缓存分版本）

<v-click>

```js
const CACHE_NAME = "static-v3"; // 每次发布静态资源集合变化时递增
// install：预缓存新版本资源清单（备货）
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(["/", "/app.js"])));
});
// activate：新 SW 正式接管后，删掉所有旧版本缓存（收尸）
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))),
    ),
  );
});
```

</v-click>

<v-click>

- 为什么放 activate：新旧 SW 会**短暂并存**，旧 SW 可能还在用旧缓存——新 SW 正式接管再删才安全

</v-click>

<!--
不收尸就是双倍配额加旧资源风险。install 备货、activate 收尸是口诀；install/activate/waiting 的完整状态机属于 SW 生命周期话题。
-->

---

# 坑位清单

SW 缓存的五个高频事故点

<v-click>

- **opaque 响应**：跨域 no-cors 响应 status 恒为 **0** → `add()/addAll()` 必 reject，只能自己 `fetch` + `put`；读不到头与体、**配额按真实体积记账**——能用 CORS 就用 CORS
- **`clone()` 不是仪式**：body 是流、只能消费一次——忘 clone 的「body already used」是 SW 第一高频异常
- **`put()` 不校验状态码**：按 `response.ok` 过滤再写回，别把 500 页面缓存成「永久故障」
- **`Set-Cookie` 被剥离**（Fetch 规范）：存进 Cache 的响应不会种 Cookie——依赖响应种 Cookie 的接口不适合重放
- **配额连坐**：用量算入源的存储配额（`navigator.storage.estimate()` 估算）；浏览器兜底清理时**整源一起删**——别把关键数据只放缓存里

</v-click>

<!--
add 会把错误页缓存下来吗？不会，非 2xx 直接 reject；但 put 会，所以自己写策略时要像 MDN 示例那样按状态码过滤。SW 兑现的请求 Size 栏显示 (ServiceWorker)。
-->

---
layout: section
---

# 观测与清除

Size 栏、Application 面板与 Clear-Site-Data

---

# Size 栏判读全表

<v-click>

| 显示 | 来源层 | 出网络了吗 |
| --- | --- | --- |
| `(memory cache)` | 渲染进程内存 | 否（Time≈0ms） |
| `(disk cache)` | HTTP 缓存（磁盘） | 否 |
| `(prefetch cache)` | 预取暂存 | 之前取的 |
| `(ServiceWorker)` | Cache API / SW 构造的响应 | 否（SW 内 fetch 另计） |
| 字节数 + Status 200 | 网络 | 是，全量下载 |
| 字节数 + Status 304 | 网络（协商命中） | 是，一个 RTT + 头部 |

</v-click>

<v-click>

- **304 看 Status 栏**：Size 栏不会出现「(304)」标签
- **Size 两行**：上＝传输量（压缩+头），下＝解压后大小

</v-click>

<!--
Size 两行显示要开 Big request rows。两行数字的差距就是压缩与缓存的功劳。有括号等于没出网络；304 是真发了请求、只传头不传体。
-->

---

# 观察前先拨好开关

「本地怎么都不命中」的头号元凶：Disable cache 勾着呢

<v-click>

- **Preserve log**：跨导航保留请求记录——不然一跳转证据就没了
- **Big request rows**：Size 栏两行显示，缓存效果一目了然
- **确认 Disable cache 没勾**：勾着它永远观察不到缓存命中；它只在 **DevTools 打开期间**生效
- 过滤技巧：filter 输入 `is:from-cache` 筛缓存命中；隐藏扩展注入的请求——扩展流量常污染「缓存命中率」的目测结论

</v-click>

<v-click>

> **Disable cache ≠ 全素颜**：它只禁 HTTP 缓存（memory + disk），**管不到 Cache API**——SW 控制的页面照样 `(ServiceWorker)`。要完全素颜，再去 Application → Service workers 勾 **Bypass for network**（请求越过 SW 直连网络）。

</v-click>

<!--
Disable cache 用于模拟首访用户。三个开关拨好再谈判读，不然结论全是噪声。
-->

---

# Application 面板三件套

查看与一键清

<v-click>

- **Cache storage**：列出本源全部具名 Cache（`static-v3` 之类），逐条查看 Request/Response、删除单条或整仓——验证 SW 版本化收尸是否干净就看这里；「发版后躺着 v1~v7 七个仓」＝配额慢性病的直接证据
- **Storage → Clear site data**：按复选框一键清空本源 Cookie、各类 Storage、Cache storage、**并可注销 Service Worker**——开发期「彻底从零来一遍」的正确姿势（比手动挨个删可靠）；同视图还有本源存储用量分布
- **Back/forward cache**：bfcache 专用测试入口——Run Test 自动「离开再返回」，报告能否恢复与阻断原因

</v-click>

<!--
Cache storage 占了多少配额在 Clear site data 视图一目了然。三件套覆盖了看、清、测三个动作。
-->

---

# Clear-Site-Data：服务端远程清除

用户点「退出登录」，怎么保证这台设备上的缓存与存储残留也被清掉？

<v-click>

```http
HTTP/1.1 200 OK
Clear-Site-Data: "cache", "cookies", "storage"
```

</v-click>

<v-click>

- **语法铁律**：每个指令必须是**带双引号**的字符串（quoted-string 文法，裸写无效）；仅 HTTPS 安全上下文生效
- **作用域**：只有 `"cookies"` 波及**整个注册域（含全部子域）**的 Cookie + HTTP 认证凭据；其余指令按**源**清——多子域架构下登出接口放哪个域名要想清楚
- **登出推荐**：`"cache", "cookies", "storage"` 三件套起步；用了投机加载再补 `"prefetchCache", "prerenderCache"`（防预渲染页里还带着登录态）

</v-click>

<!--
验证生效：走一遍登出流程，Network 确认响应头带上了且引号正确，再到 Application 面板核对 Cookie、Cache storage、Local storage 是否真被清空。
-->

---

# 指令兼容表：`"cache"` 是重灾区

<v-click>

| 指令 | Chrome | Firefox | Safari |
| --- | --- | --- | --- |
| `"cache"` | 61+，**长期 partial** | **63~94 → 移除 → 138 恢复** | 17+ |
| `"cookies"` / `"storage"` | 61+ | 63+ | 17+ |
| `"clientHints"` | 117+ | ✗ | ✗ |
| `"executionContexts"` | ✗ 未实现 | 63~68 后移除 | 17~18.3 后移除 |
| `"prefetchCache"` / `"prerenderCache"` | 138+ | ✗ | ✗ |
| `"*"` | 117+（partial） | 63+ | 17+ |

</v-click>

<v-click>

- Chrome partial 的已知 bug：「当前标签页不重载则部分请求照走缓存」+ 秒级卡顿——修「错发长缓存」它只是辅助，**根治仍靠资源版本化**；验证要换新标签页

</v-click>

<!--
"storage" 清本源全部 DOM 存储：localStorage、sessionStorage、IndexedDB 逐库删除、注销 Service Worker、FileSystem API 等。"cache" 视浏览器还可能连带预渲染页、bfcache、脚本缓存、着色器缓存。"executionContexts" 目前三家都不支持。"cache" 别当精确武器。
-->

---

# 用户「清除浏览数据」影响矩阵

以 Chrome 对话框为例（Firefox/Safari 分类名不同、归属逻辑一致）

<v-click>

| 层 | 「缓存的图片和文件」 | 「Cookie 及其他网站数据」 |
| --- | --- | --- |
| disk cache（HTTP 缓存） | **清** | — |
| memory cache | —（本就不落盘） | — |
| Cache API（SW 缓存） | — | **清**（属「网站数据」） |
| Service Worker 注册 | — | **清** |
| Cookie / localStorage / IndexedDB | — | **清** |
| bfcache | — | —（纯内存：导航逐出、超时、重启即没） |

</v-click>

<v-click>

> 不对称性要背：勾「清缓存」**救不了** SW 缓存的旧版本——旧 SW 还注册着、Cache API 还在，下次打开照旧接管。止血必须勾「Cookie 及其他网站数据」（代价是全站登录态一起没）——**根治永远优于清除**。

</v-click>

<!--
给客服/支持同学的止血话术也要照此校准：只清「缓存的图片和文件」对 PWA 类事故完全无效。这就是 SW 事故比 HTTP 缓存事故难救的原因，防线必须建在版本化清理上。
-->

---

# 排查手册：改了代码还是旧版

固定动作，从建立干净基线开始

<v-click>

```bash
# 第 0 步：无痕窗口复现——新的 → 缓存层问题；也是旧的 → 查部署产物 / CDN
# 再用 curl 看服务端此刻返回的头，排除浏览器因素
curl -sI https://example.com/index.html | grep -iE "cache-control|etag|age"
```

</v-click>

<v-click>

1. **Size 栏定层**：`(ServiceWorker)` / `(disk cache)` / `(memory cache)` 三个方向，处理路径完全不同
2. `(ServiceWorker)` → 查 SW 版本化收尸；开发期勾 **Update on reload + Bypass for network**
3. `(disk cache)` → 查该资源的 `Cache-Control`——HTML 入口配长 `max-age` 是头号事故源
4. `(memory cache)` → 新开标签页或重启浏览器即可排除
5. **无任何请求且整页状态旧** → bfcache：`pageshow(persisted)` 判定并刷新时效数据
6. 浏览器侧全排除 → 查 CDN / 代理等共享缓存（服务侧的层）

</v-click>

<v-click>

> 修复强度阶梯：等自然过期 < `Clear-Site-Data` < **改 URL（哈希换名，唯一 100% 可靠）**。

</v-click>

<!--
无痕窗口自带空缓存、无 SW 注册，等价于一个自带作废机制的干净环境。线上 SW 问题还要检查新 SW 是否卡在 waiting，那属于 SW 生命周期话题。
-->

---
layout: center
class: text-center
---

# 小结

一次请求，四层机会；一次后退，一个快照

<v-click>

- **命中链**：SW → memory → disk → 网络；push cache 已死（Chrome 106 / Firefox 132），继任者 103 Early Hints
- **两层自管缓存**：memory＝tab 会话内存复用；disk＝HTTP 缓存本体（RFC 9111、跨会话）；放哪层浏览器说了算
- **浏览器侧落地**：灰色 200 + 括号＝没发请求，304＝条件请求；普通刷新只重验证主文档，强刷不可能 304
- **bfcache**：整页快照含 JS 堆，`pageshow(persisted)` 感知；unload 是头号杀手，no-store Chrome 已条件放宽
- **Cache API**：不看 HTTP 头、不自动过期——install 备货、activate 收尸是正确性要求
- **观测与清除**：Size 栏 + Application 面板；`Clear-Site-Data` 指令带引号；「清缓存」救不了 SW 事故

</v-click>

<v-click>

> 缓存排查的本领 ＝ 能对每一行 Network 记录说出：它命中的是哪层、为什么。

</v-click>

<!--
六个主题收束：命中链与 push cache 讣告、memory/disk 两层、刷新行为矩阵、bfcache 整页快照、Cache API 三策略与版本化、观测清除工具箱。
-->

---
layout: center
class: text-center
---

# 谢谢

浏览器缓存机制 · 多层命中、整页快照与可编程缓存

<div class="mt-8 text-gray-400">
基于 Web 现代标准 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/base/browser/browser-cache/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖多层缓存总览、内存与磁盘缓存、HTTP 缓存的浏览器侧落地、往返缓存 bfcache、Service Worker 缓存与 Cache API、观测与清除。配套笔记见文档图标链接。感谢观看。
-->
