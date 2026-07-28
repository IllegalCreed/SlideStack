---
theme: seriph
background: https://cover.sli.dev
title: AI 测试用例生成
info: |
  AI 测试用例生成入门：强化学习（Diffblue）· 进化算法（EvoSuite）· LLM 生成 · 断言复核

  Learn more at https://docs.diffblue.com/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## AI 测试用例生成

自动产出单元测试 · 三大流派 · 提升覆盖率 · 复核断言

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
核心共识：AI 测试必须人工复核断言。
-->

---
transition: fade-out
---

# AI 测试生成是什么

用 RL / 进化算法 / LLM 自动产出单元测试

- **强化学习派**：Diffblue Cover 跑代码学行为
- **进化算法派**：EvoSuite 遗传算法最大化覆盖
- **LLM 派**：Copilot/Cursor/Claude 提示词生成
- **核心共识**：AI 测试必须人工复核断言
- **覆盖率 ≠ 验证质量**：只衡量触达不衡量断言

> Qodo Cover 自 2025-06 停维护，仅作学习样本

<!--
三流派技术路线不同，断言可靠性差异显著。
-->

---

# 三流派一句话区分

```text
Diffblue Cover（强化学习）
  真正执行代码学行为 → 生成带正确断言的 JUnit 测试

EvoSuite（进化算法）
  遗传算法迭代优化测试 → 最大化覆盖率

LLM（Copilot/Cursor/Claude）
  大模型读代码 + 提示词 → 生成测试（断言可能不准）
```

**关键差异**

- Diffblue 跑代码验证断言（可靠）
- LLM 凭模型猜测断言（易幻觉）
- EvoSuite 纯靠搜索算法找高覆盖解

> Diffblue 断言基于实际输出，而非猜测

<!--
Diffblue 区别于 LLM 的核心是真正执行代码。
-->

---

layout: two-cols

---

# Diffblue Cover

强化学习智能体实际执行目标代码

**生成效果**

```java
// 被测：add(2,3) 返回 5
@Test
void shouldReturnSumWhenAdd() {
    Calculator calc = new Calculator();
    // 断言来自实际执行
    assertThat(calc.add(2, 3))
      .isEqualTo(5);
}
```

::right::

# 版本与安装

| 版本 | 特点 |
|------|------|
| Community | 免费 IntelliJ 插件，有每日上限 |
| Enterprise | 付费，批量+CI 集成 |

**安装**

1. Settings → Plugins → Marketplace
2. 搜 Diffblue Cover，安装重启
3. Java 类右键 → Write Tests

> 后续若代码改行为，测试会失败

<!--
Diffblue 真跑了一遍代码拿到 5 才断言 5。
-->

---

# EvoSuite

遗传算法在测试用例空间里找高覆盖解

```bash
java -jar evosuite.jar \
  -targetClass com.example.Calculator \
  -projectCP target/classes
# 输出 src/test/java/.../Calculator_ESTest.java
```

**进化流程**

1. 随机生成一批测试用例（种群）
2. 执行，计算适应度（分支/行覆盖增量）
3. 选择高适应度个体 → 交叉/变异
4. 重复若干代，直到覆盖收敛
5. 输出覆盖最大化的测试集

> 不依赖训练数据或 LLM，纯本地可解释

<!--
EvoSuite 用搜索式软件测试，纯靠算法搜索。
-->

---

# LLM 派生成测试

Copilot/Cursor/Claude 跨语言灵活但易幻觉

**提示词模板（关键）**

```text
为以下函数生成 {JUnit5/Pytest/Jest} 测试：
1. 覆盖正常路径、边界值、异常路径
2. 用 {AssertJ/pytest/Vitest} 断言，禁止硬编码期望值
3. 外部依赖用 Mock，标注 mock 点
4. 每个测试一个明确意图命名
代码：{粘贴函数}
```

> 要求「禁止硬编码期望值」缓解最常见的幻觉断言

<!--
明确框架、覆盖目标、Mock 策略是提示词关键。
-->

---

# 幻觉断言陷阱

LLM 派最常见的无效测试

```java
// 错误示范 1：断言恒真，毫无意义
@Test
void shouldAdd() {
    Calculator c = new Calculator();
    c.add(2, 3);
    assertThat(true).isTrue();   // ← 恒真！
}
// 错误示范 2：硬编码期望值
assertThat(result).isEqualTo(5); // result 可能没赋值
```

**复核清单（必做）**

- 断言是否针对真实返回值
- 边界与异常路径是否真覆盖
- Mock 是否正确隔离外部依赖
- 删测试后原代码有 bug 时测试会失败吗

> 恒真断言 = 覆盖率虚高但不验证任何行为

<!--
LLM 测试覆盖率虚高但不真正验证，必须人审。
-->

---

# 三流派横向对比

| 维度 | Diffblue（RL）| EvoSuite | LLM |
|------|------|------|------|
| 断言可靠性 | 高（基于执行）| 中（基于覆盖）| 低（可能幻觉）|
| 语言 | Java | Java | 几乎任意 |
| 联网 | 否（本地）| 否（本地）| 多数需云 |
| 新框架兼容 | 跟进 Enterprise | 慢，偶发问题 | 快 |
| 成本 | 免费/付费 | 开源免费 | 按 LLM 计费 |

> EvoSuite 学术出身，对新版本 Java 兼容跟进慢

<!--
Diffblue 仅限 Java，LLM 跨语言但断言质量无保障。
-->

---

# 通用最佳实践

- **复核断言**：每条 AI 测试看断言是否针对真实行为
- **变异测试辅助**：PIT/Stryker 验证能否抓出改坏的代码
- **覆盖目标分层**：核心逻辑高覆盖+强断言，DTO 放宽
- **CI 卡覆盖率门槛**：不让覆盖率下降，但不盲目追高
- **人机分工**：AI 生骨架，人补业务语义与边界设计

> 高覆盖 + 弱断言是假象，能抓 bug 才是有效测试

<!--
变异测试能验证测试是否真正有效。
-->

---

layout: quote

---

# 覆盖率陷阱

「覆盖率只衡量代码被触达，不衡量断言验证了真实行为——盲信覆盖率数字是最大陷阱，AI 生成的测试必须人工复核断言。」

---

# 选型矩阵

| 场景 | 选择 |
|------|------|
| Java 重资产求可靠断言 | Diffblue Cover |
| 学术研究 / 纯拉覆盖率 | EvoSuite |
| 快速跨语言生成 | Copilot/Cursor/Claude |
| Java 生态 + CI 批量 | Diffblue Enterprise |

**一句话选型**

- Java 项目追求可靠回归 → Diffblue
- 学术或纯覆盖率 → EvoSuite
- 跨语言、人能复核 → LLM 生成 + 提示词工程

> Qodo Cover 已停维护，新项目不应再采用

<!--
按语言、断言可靠性需求、是否需 CI 选型。
-->

---
layout: center
class: text-center
---

# 小结

AI 测试生成 = 提覆盖率 + 人复核断言

**Diffblue 可靠 · EvoSuite 覆盖 · LLM 跨语言 · 复核为王**

[Diffblue 文档](https://docs.diffblue.com/) · [EvoSuite](https://www.evosuite.org/docs/) · [Copilot](https://docs.github.com/en/copilot) · [GitHub](https://github.com/IllegalCreed/SlideStack)

<!--
三大流派各有取舍，核心是人工复核断言。
-->
