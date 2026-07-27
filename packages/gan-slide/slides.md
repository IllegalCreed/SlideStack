---
theme: seriph
background: https://cover.sli.dev
title: 生成对抗网络（GAN）完全指南
info: |
  生成对抗网络（GAN）完全指南：极大极小博弈 · DCGAN · WGAN · StyleGAN · 模式崩溃对策

  Learn more at https://arxiv.org/abs/1406.2661
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 生成对抗网络（GAN）

让生成器与判别器在对抗博弈中共同进化 · 极大极小博弈（minimax game）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
GAN 用「造假者 vs 警察」的博弈绕开显式似然建模，单次前向即可生成高保真样本，但训练极不稳定。
-->

---
transition: fade-out
---

# GAN 是什么

一个**生成模型框架**，不写概率密度，靠博弈让生成器拟合数据分布：

- **生成器 G**：噪声 `z` → 假样本 `G(z)`，目标是骗过判别器
- **判别器 D**：样本 → 真实概率 `D(x)∈(0,1)`，目标是识破假货
- 二者共同进化：D 越强 G 越逼真，最终 D 输出恒为 1/2
- 无需似然函数，只需可微采样即可反向传播

> 「counterfeiters vs police」——Goodfellow 原论文的奠基性比喻。

<!--
核心直觉：博弈让 G 的输出分布收敛到数据分布，D 失去判别力即达成纳什均衡。
-->

---
transition: fade-out
---

# 价值函数：minimax 博弈

```text
min_G max_D  V(D, G) = E_{x~p_data}[ log D(x) ]
                    + E_{z~p_z}[ log(1 - D(G(z))) ]

D 想最大化 V（真假判对），G 想最小化 V（让假样本被判真）
```

**理论最优**：固定 G 时最优判别器 `D*_G(x) = p_data(x) / (p_data(x) + p_g(x))`

| 阶段 | p_g 与 p_data | D(x) |
| --- | --- | --- |
| 训练初期 | 远离 | 轻松区分（真→1，假→0） |
| 训练中期 | 靠近 | 区分变难 |
| 理论最优 | **p_g = p_data** | **D(x) = 1/2** |

> 全局最优时判别器彻底失去判别力，这就是 GAN「生成分布」的本质。

<!--
注意公式里的尖括号都已在代码块内，避免 Vue 解析为未闭合标签。
-->

---
transition: fade-out
---

# 训练算法：交替更新

G 与 D 目标相反，不能一次性反向传播，需交替训练：

```text
for 每个训练批次:
    # 训练 D（k 次，原论文 k=1）：梯度【上升】最大化 V
    采样真样本 x_i 与噪声 z_i
    更新 D: log D(x_i) + log(1 - D(G(z_i)))

    # 训练 G（1 次）：梯度【下降】最小化 V
    采样噪声 z_i
    更新 G: log(1 - D(G(z_i)))
```

**实践技巧**：G 改用最大化 `-log D(G(z))`——训练初期梯度更大，优化更顺畅，理论最优解不变。

> Adam 优化器 lr=2e-4、beta1=0.5 是图像 GAN 的经典起点配置。

<!--
detach() 阻断梯度流回 G 是 D 训练的关键细节；G 训练时标签用 1（真）。
-->

---
transition: fade-out
---

# DCGAN：卷积 GAN 的奠基

三条经验准则，至今仍是图像 GAN 的事实标准：

1. **步长卷积/转置卷积替代池化**——让网络自学上/下采样
2. **全用 BatchNorm**——稳定训练（G 输出层、D 输入层除外）
3. **激活函数**：G 用 ReLU（输出 Tanh），D 用 LeakyReLU(0.2)

```text
G: z[100] → Linear → reshape → 4×ConvTranspose(stride2) → Tanh
D: x[3,64,64] → 4×Conv(stride2) + BN + LeakyReLU → Sigmoid
```

> 统一 Adam（lr=2e-4, beta1=0.5），64×64 人脸/卧室稳定生成。

<!--
G 输出必须用 Tanh 归一化到 [-1,1]，用 ReLU 会导致输出值域失控、训练崩。
-->

---
transition: fade-out
---

# WGAN：解决梯度消失的根本方案

用 **Wasserstein 距离**替换 JS 散度，即使分布不相交也提供平滑梯度：

| 性质 | JS 散度（原 GAN） | Wasserstein（WGAN） |
| --- | --- | --- |
| 分布不相交时 | 恒为 log2，**梯度为 0** | 仍提供**平滑梯度** |
| 损失与质量 | 无关 | **单调相关** |
| 训练稳定性 | 易震荡/发散 | 几乎不需调参 |

**1-Lipschitz 约束**：原 WGAN 用权重裁剪（粗糙），WGAN-GP 改用梯度惩罚 `λ·E[(‖∇f‖₂ - 1)²]`，λ 常取 10。

> critic 不再用 Sigmoid（输出实数 f(x)），不用 BatchNorm 改用 LayerNorm。

<!--
梯度惩罚在真伪样本间插值点 x̂ 上计算，是 WGAN 的事实标准实现。
-->

---
layout: two-cols
transition: fade-out
---

# 条件 GAN 与 CycleGAN

**CGAN（条件 GAN）**：把条件 y 拼到 G 与 D 的输入，实现可控生成：

```text
G(z, y) → 生成符合 y 的样本
D(x, y) → 判断 x 是否符合 y 且为真
```

开启「可控生成」范式，后续 Pix2Pix、Text-to-Image 都是延伸。

::right::

<br>

**CycleGAN**：无配对图像翻译（马↔斑马），双 G 双 D + 循环一致性：

```text
L_cyc = E[‖F(G(x)) - x‖]
      + E[‖G(F(y)) - y‖]
```

迫使翻译「保留内容、只改风格」，无需配对数据，λ 常取 10。

> 风格迁移、季节转换、画质增强的利器。

<!--
循环一致性是 CycleGAN 摆脱配对依赖的核心，广泛应用于无监督图像翻译。
-->

---
transition: fade-out
---

# StyleGAN：解耦风格的高质量人脸

NVIDIA 把 GAN 推到 1024×1024 几可乱真的人脸，核心是**基于风格的生成器**：

```text
传统 GAN：z → 卷积链 → 图像（z 一次性注入）
StyleGAN ：z → 映射网络 f → w（512 维风格向量）
        常量输入 → 每层用 AdaIN 注入 w + 随机噪声
```

**风格解耦收益**：

- 高层 w 控制粗粒度（姿态、脸型）
- 低层 w 控制细粒度（发色、肤色）
- 随机噪声控制微观随机性（雀斑、发丝）

> StyleGAN2 去 AdaIN 伪影，StyleGAN3 解决纹理粘附（alias-free）。

<!--
AdaIN = 实例归一化后用 w 的 scale/bias 重新缩放，实现逐层风格控制。
-->

---
transition: fade-out
---

# BigGAN：规模 + 截断的 SOTA

把 GAN 推到 ImageNet 类条件生成 SOTA，关键贡献：

- **大规模**：大 batch（2048）、大模型（参数量 2-4 倍）
- **截断技巧**：z 从截断正态采样，丢弃离均值过远的样本
- **自注意力**：中间层加自注意力捕捉长程依赖
- **类条件注入**：类别嵌入 + 共享嵌入

```text
threshold 小 → 样本集中 → 更标准但多样性下降
threshold 大 → 样本多样 → 质量下降（可能出怪样本）
```

> 截断技巧直观体现所有生成模型的「质量 vs 多样性」核心矛盾。

<!--
BigGAN 证明了 GAN 在规模扩展上仍有潜力，但训练成本与难度极高。
-->

---
transition: fade-out
---

# 训练难点：JS 散度梯度消失 & 模式崩溃

**JS 散度梯度消失**（数学根源）：

- 分布不相交时 JS = log2 常数，梯度为 0 → G 学不动
- 分布完全重合时 JS = 0 常数，梯度为 0（最优态，无害）

**模式崩溃（mode collapse）**：

- G 只输出少数几种能骗过 D 的样本，丧失多样性
- 对策：Minibatch discrimination、Unrolled GAN、特征匹配、WGAN

> 必须用 FID/IS 量化多样性，不能只看几张样本就收工。

<!--
模式崩溃是 GAN 最经典顽疾，WGAN 的 Wasserstein 距离天然缓解此问题。
-->

---
transition: fade-out
---

# 反模式（生产坑）

1. **Sigmoid + JS 训大模型**：易梯度消失，改 WGAN-GP/hinge loss
2. **G 输出用 ReLU 不用 Tanh**：值域失控，训练崩
3. **WGAN critic 用 BatchNorm**：破坏 1-Lipschitz，改 LayerNorm
4. **权重裁剪 c 设置不当**：太小图糊，太大失效，不如梯度惩罚
5. **忽视模式崩溃**：只看几张图就收工，必须 FID/IS 量化
6. **D 更新次数与 G 不匹配**：D 太强 G 梯度消失，WGAN 推荐 D:G = 5:1

> 复现困难是 GAN 的常态，论文结果常需精细调参才能达到。

<!--
这六条是生产环境最常见的崩溃点，逐条对应明确的修复方案。
-->

---
layout: center
class: text-center
---

# 小结

GAN 用对抗博弈绕开显式似然，单次前向生成高保真样本，但训练不稳定。

**极大极小博弈 · DCGAN · WGAN · StyleGAN · 模式崩溃**

[Goodfellow 2014 原论文](https://arxiv.org/abs/1406.2661) · [WGAN 论文](https://arxiv.org/abs/1701.07875) · [StyleGAN 论文](https://arxiv.org/abs/1812.04948)

<!--
GAN 曾主导图像生成近十年，在实时/可控生成、风格迁移场景仍不可替代，但大规模多模态赛道已被扩散模型超越。
-->
