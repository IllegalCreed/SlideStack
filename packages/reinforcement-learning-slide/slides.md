---
theme: seriph
background: https://cover.sli.dev
title: 强化学习完全指南
info: |
  强化学习完全指南：MDP · Q-Learning · DQN · PPO · RLHF

  Learn more at https://spinningup.openai.com/en/latest/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 强化学习

智能体试错学策略最大化长期回报 · Q-Learning · DQN · PPO · RLHF

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
强化学习是机器学习第三大范式：智能体通过与环境交互试错，依据奖励信号学习最优策略。数学基础是马尔可夫决策过程。RLHF 是 ChatGPT 对齐的核心技术。
-->

---
transition: fade-out
---

# 强化学习是什么

- **智能体**（Agent）与环境交互，依据**奖励**学策略
- **回报** G_t：从时刻 t 起的累计折扣奖励
- **策略** π(a|s)：状态到动作的决策规则
- 对比监督学习：无「正确答案」，只有延迟奖励

> RL 要在「当前动作」与「未来好结果」间建立因果

<!--
强化学习的「强化」源自行为主义心理学——强化获奖励的行为、抑制招惩罚的行为。核心是延迟奖励下的序列决策。
-->

---
transition: fade-out
---

# MDP：强化学习的数学语言

五元组 `(S, A, P, R, γ)`：

- `S` 状态集 / `A` 动作集 / `P(s'|s,a)` 转移概率
- `R(s,a)` 奖励 / `γ` 折扣因子（0-1，权衡眼前 vs 长远）
- 马尔可夫性：下一步只依赖当前状态和动作

> γ 接近 0 重眼前（贪心），接近 1 重长远，常取 0.9-0.99

<!--
核心是马尔可夫性——下一步只依赖当前状态和动作，与历史无关。POMDP 是推广：智能体只看到观察而非完整状态，需用信念状态或 RNN 估计。
-->

---
transition: fade-out
---

# 三大核心函数

- `V^π(s)`：状态价值，从 s 出发的期望回报
- `Q^π(s,a)`：动作价值，从 s 做 a 再按 π
- `π(a|s)`：策略，状态到动作的映射

```text
贝尔曼方程：V(s) = E[R + γ·V(s')]
当前价值 = 即时奖励 + 折扣后继价值
```

> 贝尔曼方程是所有 RL 算法的递归根基

<!--
Q-Learning/DQN/PPO 都是在不同近似下求解贝尔曼方程。最优价值 V*(s)=max_π V^π(s)，最优策略 π*(s)=argmax_a Q*(s,a)。
-->

---
transition: fade-out
---

# 三大算法阵营

| 阵营 | 代表 | 机制 |
|---|---|---|
| 基于价值 | Q-Learning/DQN | 学 Q 函数 |
| 基于策略 | Policy Gradient | 直接优化 π |
| Actor-Critic | PPO/SAC | 两者结合 |

> on-policy（PPO）稳定低效 vs off-policy（DQN/SAC）高效有偏

<!--
Actor-Critic 架构：Actor（策略网络）输出动作 + Critic（价值网络）评估状态。优势函数 A(s,a)=Q(s,a)-V(s) 降低策略梯度方差。
-->

---
transition: fade-out
---

# Q-Learning：表格 RL 入门

```python
# off-policy，用 max 估计后继
td_target = r + gamma * np.max(Q[s_next]) * (not done)
Q[s, a] += alpha * (td_target - Q[s, a])
# epsilon-greedy：epsilon 概率探索，否则取 Q 最大
```

- 状态空间小用表存所有 Q(s,a)
- 空间一大（如棋盘 10^47）必须用神经网络 → DQN

> Q-Learning 是「乐观主义者」，假设未来能选最优

<!--
Q-Learning 更新式 r+γ·max_a' Q(s',a')，off-policy。SARSA 是 on-policy 版 r+γ·Q(s',a')，用实际下一动作，高风险环境更安全。
-->

---
transition: fade-out
---

# DQN：深度 Q 网络

两大稳定化创新：

- **经验回放**：存 (s,a,r,s',done) 到缓冲区，随机采样打破时序相关
- **目标网络**：单独网络算 TD target，每 N 步同步，防追逐移动目标

```python
td_target = r + gamma * Q_target(s_next).max() * (not done)
loss = mse(Q_main(s, a), td_target)
```

> 离散动作空间基石；连续动作用 DDPG/TD3/SAC

<!--
DeepMind 2015 用 DQN 攻克 Atari 开启深度强化学习。变体有 Double/Dueling/Rainbow DQN，都在解决 Q 值过高估计等问题。
-->

---
transition: fade-out
---

# PPO：当前主流 Actor-Critic

```python
# clipped surrogate objective 限制策略更新幅度
ratio = exp(log_pi_new - log_pi_old)
surrogate = clip(ratio, 1 - 0.2, 1 + 0.2) * advantage
loss = -min(ratio * advantage, surrogate)
```

- on-policy：用当前策略采的数据更新当前策略
- 稳定、易调、效果好，OpenAI 默认算法

> RLHF 第三阶段用 PPO 而非 SAC：稳定性优先于样本效率

<!--
clip 防止概率比过大——这是「足够好就停」的保守哲学。完整损失含策略 clip + 价值 MSE + 熵奖励鼓励探索。ε=0.2、γ=0.99、GAE λ=0.95。
-->

---
transition: fade-out
---

# SAC：连续动作 SOTA

- **最大熵 RL**：目标变为「最大化回报 + 熵」
- 熵正则鼓励策略保持随机性，避免过早收敛
- off-policy（样本高效）+ 随机策略（抗干扰）
- `α` 可自动调节（自适应温度）

```text
J(π) = E[ Σ_t (R_t + α·H(π(·|s_t))) ]
```

> 离散动作用 DQN/Rainbow；通用/RLHF 用 PPO

<!--
SAC 是连续动作空间（机器人、机械臂）的事实标准。固定 α 在不同任务表现差异巨大，务必用自适应 α 按目标熵自动调节。
-->

---
transition: fade-out
---

# 探索 vs 利用困境

| 策略 | 机制 | 适用 |
|---|---|---|
| ε-greedy | ε 概率随机 | 通用默认 |
| UCB | Q+置信上界 | 多臂老虎机 |
| 熵正则（SAC） | +α·H(π) | 连续动作 |
| 好奇心驱动 | 预测误差给奖励 | 稀疏奖励 |

> ε 通常从 1.0 衰减到 0.05：前期探索后期利用

<!--
利用当前知识陷局部最优，探索新动作可能发现更好策略。两者无银弹，ε-greedy 最简单通用。
-->

---
transition: fade-out
---

# RLHF：ChatGPT 对齐核心

三阶段让大语言模型与人类偏好对齐：

1. **SFT**：监督微调，学会按指令回答
2. **奖励模型（RM）**：人类偏好对打分，Bradley-Terry 损失
3. **PPO 优化**：带 KL 惩罚防漂移

> 无 KL 惩罚模型会输出乱码骗高分（reward hacking）

<!--
奖励 = r_RM(prompt,response) - β·KL(π_new||π_SFT)。KL 惩罚防止优化后模型偏离 SFT 太远。变体有 RLAIF（AI 标注）、DPO（跳过 RM）。
-->

---
transition: fade-out
---

# 反模式（生产坑）

- 奖励 shaping 不当 → reward hacking（倒跑刷圈数）
- PPO 不加 KL 惩罚做 RLHF → 输出乱码
- DQN 不用经验回放/目标网络 → 训练发散
- SAC 不调 α → 用自适应温度
- 模拟器训练直接迁移真实 → Sim-to-Real Gap

> 样本效率极低是 DRL 最大痛点，模拟器是刚需

<!--
DRL 常需千万次交互才收敛。Sim-to-Real Gap 应对用域随机化、渐进迁移、真实环境微调。信用分配难题也是长序列的核心挑战。
-->

---
layout: center
class: text-center
---

# 小结

强化学习 = **智能体试错学策略**最大化长期回报

**MDP · Q-Learning · DQN · PPO · RLHF**

[OpenAI Spinning Up](https://spinningup.openai.com/en/latest/) · [Stable-Baselines3](https://stable-baselines3.readthedocs.io/)

<!--
RL 三大阵营：基于价值（DQN）、基于策略（PG）、Actor-Critic（PPO/SAC）。RLHF 三阶段是当前 LLM 训练事实标准。选型：离散用 DQN、连续用 SAC、通用/RLHF 用 PPO。
-->
