---
theme: seriph
background: https://cover.sli.dev
title: JAX 完全指南
info: |
  JAX 完全指南：可组合变换 · 任意阶自动微分 · XLA 跨硬件 · Flax NNX

  Learn more at [https://docs.jax.dev](https://docs.jax.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## JAX

函数式数值计算框架 · 可组合变换 · XLA 编译 · 0.11.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
JAX 以函数式 + 可组合变换 + XLA 成 Google 科研/TPU 首选。
-->

---
transition: fade-out
---

# JAX 是什么

Google 主导的可组合函数变换系统，定位「面向加速器的数组计算」

- **jax.numpy**：与 NumPy 同构，但数组**不可变**
- **四大变换**：`jit`/`grad`/`vmap`/`pmap` 可任意嵌套
- **任意阶自动微分**：`grad(grad(f))` 一行求高阶导
- **XLA 跨硬件**：同一份代码跑 CPU/GPU/TPU
- **函数式纯函数**：状态显式传递，无副作用

> 稳定版 **0.11.0**（2026-07-16），Python ≥ 3.12，文档已迁 docs.jax.dev

<!--
JAX 核心是「可组合的函数变换」，与 PyTorch 面向对象截然不同。
-->

---

# jax.numpy：不可变数组

API 与 NumPy 几乎一致，但数组**不可变**

```python
import jax.numpy as jnp

x = jnp.arange(5.0)          # [0., 1., 2., 3., 4.]
y = jnp.dot(x, x)            # 标量内积
z = x + 1                    # 返回新数组

# 不可变：x[0] = 10 会 TypeError
x = x.at[2].set(10.0)        # 正确：返回新数组
x = x.at[1].add(5.0)         # 等价 x[1] += 5
```

**关键约束**

- 被 `jit`/`grad` 包裹的函数必须是**纯函数**
- 原地操作全部禁用，统一走 `.at[].set()`
- 随机数必须显式传 PRNG key

> 不可变 + 纯函数 = 安全追踪计算，XLA 编译与自动微分的基石。

<!--
不可变是 JAX 函数式模型的硬约束，迁移自 NumPy 成本低。
-->

---
layout: two-cols
---

# jax.jit 与 jax.grad

```python
import jax

@jax.jit                        # XLA 编译加速
def selu(x):
    return jnp.where(x > 0, x, 0)

# 任意阶自动微分
def f(x):
    return jnp.sin(x)

df = jax.grad(f)                # 一阶：cos
d2f = jax.grad(jax.grad(f))     # 二阶：-sin

print(df(1.0), d2f(1.0))
```

::right::

# vmap 与 pmap

```python
# 自动向量化批处理
def vec_dot(v, w):
    return jnp.vdot(v, w)

batched = jax.vmap(
    vec_dot, in_axes=(0, 0))

# 多设备 SPMD 并行
@jax.pmap
def square(x):
    return x ** 2
```

> 四大变换可任意嵌套：`jit(vmap(grad(f)))` 一行搞定。

<!--
jit/grad/vmap/pmap 的正交组合是 JAX 最具表达力的特性。
-->

---

# PRNG：显式随机状态

JAX 强制把随机状态作为显式参数，不藏全局

```python
from jax import random

key = random.key(0)                       # 主 key
key, k1, k2 = random.split(key, 3)        # 分裂 3 份

a = random.normal(k1, (3,))               # 必须传 key
b = random.uniform(k2, (3,), maxval=1.0)
```

**为什么这么做**

- 同一 key 永远产生同一序列（完全可复现）
- 并行时各设备拿不同 subkey，互不干扰
- 老接口 `random.PRNGKey(0)` 仍可用，新代码推荐 `random.key(0)`

> 显式 PRNG 是可复现与可并行的关键，初学最易踩坑。

<!--
显式 PRNG key 是 JAX 函数式纯函数约束的直接体现。
-->

---
layout: two-cols
---

# Flax NNX：神经网络

```python
from flax import nnx
import optax

class MLP(nnx.Module):
    def __init__(self, din, dout, rngs):
        self.fc1 = nnx.Linear(din, 64, rngs=rngs)
        self.fc2 = nnx.Linear(64, dout, rngs=rngs)

    def __call__(self, x):
        return self.fc2(nnx.relu(self.fc1(x)))

model = MLP(2, 3, rngs=nnx.Rngs(0))
opt = nnx.Optimizer(model, optax.adam(1e-3))
logits = model(jnp.ones((1, 2)))
```

::right::

# NNX 训练循环

```python
def loss_fn(model, x, y):
    logits = model(x)
    return optax.softmax_cross_entropy_with_integer_labels(
        logits, y).mean()

grad_fn = nnx.value_and_grad(loss_fn)

for batch in loader:
    loss, grads = grad_fn(
        model, batch['x'], batch['y'])
    opt.update(grads)  # 原地更新
```

> NNX 提供引用语义，体验接近 PyTorch，底层仍是纯函数。

<!--
NNX 是 Flax 新版 API，兼顾函数式内核与 OOP 体验。
-->

---

# Pytree：参数树统一映射

嵌套 dict/list/tuple 视为树，叶子是数组，所有变换透明穿透

```python
import jax

params = {'w1': jnp.ones((3, 4)), 'b1': jnp.zeros(4)}

# 对整棵树统一操作
scaled = jax.tree_util.tree_map(lambda x: x * 2, params)

# 多棵同形树逐叶子运算（如两份参数相加）
added = jax.tree_util.tree_map(lambda a, b: a + b, p1, p2)
```

- `tree_map(f, tree)`：递归映射所有叶子
- `tree_flatten` / `tree_unflatten`：展平与还原结构
- Optax 梯度变换、Flax 参数管理都建立在 pytree 之上

> pytree 是 JAX 处理嵌套参数结构的基础设施。

<!--
pytree 让 grad/vmap/jit 能透明处理任意嵌套参数。
-->

---

# 可微控制流

被 jit/grad 包裹时，普通 Python for/if 会被静态展开

```python
# scan：可微循环（携带状态）
def cumsum(xs):
    def body(carry, x):
        return carry + x, carry + x
    _, ys = jax.lax.scan(body, 0.0, xs)
    return ys

# cond：可微 if（两分支都求值后选）
r = jax.lax.cond(x > 0, lambda: jnp.log(x), lambda: -1e6)
```

**选择原则**

- 能用 `jax.numpy` 向量化就别用循环
- 必须循环优先 `lax.scan`（可微）
- `while_loop` 值相关但**不可微**

> 经验：向量化优先，循环用 scan，避免 jit 下 Python 控制流重编译。

<!--
lax.scan/cond 是 jit 下值相关且可微的控制流原语。
-->

---
layout: two-cols
---

# Optax：可组合优化器

```python
import optax

# 预设
opt = optax.adamw(1e-3, weight_decay=0.01)

# 自定义链：裁剪 + Adam + 调度
sched = optax.warmup_cosine_decay_schedule(
    init_value=0.0, peak_value=1e-3,
    warmup_steps=1000, decay_steps=10000,
    end_value=1e-5)

opt = optax.chain(
    optax.clip_by_global_norm(1.0),
    optax.scale_by_adam(),
    optax.scale_by_schedule(sched),
    optax.scale(-1.0))
```

::right::

# 数据并行：pmap + pmean

```python
n = jax.device_count()
sharded_x = x.reshape(n, batch_per_dev)

@jax.pmap(axis_name='batch')
def train_step(x, y):
    loss = loss_fn(model, x, y)
    grads = jax.grad(loss_fn)(model, x, y)
    # 跨设备平均梯度
    grads = jax.lax.pmean(
        grads, axis_name='batch')
    return loss

# 进阶：jax.sharding.Mesh
# + pjit 做模型并行/张量并行
```

> Optax 把优化器拆成可组合的梯度变换链，数据并行靠 pmean 同步。

<!--
Optax 链式组合 + pmap/pmean 是 JAX 分布式训练标准模式。
-->

---

# 调试技巧

```python
import jax

# 临时关编译，副作用按 eager 行为运行，便于断点
with jax.disable_jit():
    result = f(x)

# jit 内可打印（普通 print 只追踪期跑一次）
jax.debug.print("x={}", x)

# 看追踪出的 jaxpr，定位形状推断错误
print(jax.make_jaxpr(f)(args))
```

- `disable_jit()`：关编译看副作用，断点友好
- `jax.debug.print`：jit 内打印中间值
- `make_jaxpr`：看中间表示，定位 shape 问题
- 计时务必 `y.block_until_ready()`（默认异步调度）

> jit 编译后报错栈深，定位难——善用 disable_jit 与 make_jaxpr。

<!--
调试是 JAX 学习曲线陡的主因，记住这三件套。
-->

---
layout: quote
---

# JAX 的精髓

「`jit(vmap(grad(f)))` 一行表达『编译后的批处理梯度』——可组合变换 + 函数式纯函数 + XLA，这是 JAX 区别于一切框架的核心。」

---

# JAX vs PyTorch vs TensorFlow

| 维度 | JAX | PyTorch | TensorFlow |
|------|------|------|------|
| **范式** | 函数式纯函数 | 面向对象 eager | 面向对象+声明 |
| **变换** | jit/grad/vmap 可组合 | torch.compile | @tf.function |
| **数组** | 不可变 | 可变（原地） | 可变 |
| **微分** | 任意阶，纯函数 | backward 副作用 | GradientTape |
| **硬件** | TPU 一等支持 | GPU 一等支持 | GPU/TPU |

> JAX 函数式心智模型陡，但科研/TPU 场景表达力最强。

<!--
三大框架定位互补，JAX 是科研与 TPU 的首选。
-->

---
layout: center
class: text-center
---

# 小结

JAX = 可组合变换 + 函数式纯函数 + XLA

**jit · grad · vmap · pmap**

[JAX 文档](https://docs.jax.dev) · [Flax NNX](https://flax.readthedocs.io) · [Optax](https://optax.readthedocs.io)

<!--
四大变换 + 函数式 + XLA = JAX 的全部精髓。
-->
