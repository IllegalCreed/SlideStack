---
theme: seriph
background: https://cover.sli.dev
title: Keras 完全指南
info: |
  Keras 完全指南：多后端统一 API · Sequential/Functional/子类化 · fit/evaluate/predict · KerasHub · 导出部署

  Learn more at https://keras.io/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Keras

一套 API · JAX / TensorFlow / PyTorch 三后端通吃（基于 Keras 3.15.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Keras 的灵魂是「为人设计的 API」：调试速度、代码优雅、可维护、可部署。
-->

---
transition: fade-out
---

# Keras 是什么

跨后端的深度学习高级 API（Keras 3，2023-11 全面重写）：

- **一套 API 四个后端**：JAX / TensorFlow / PyTorch + OpenVINO（仅推理）
- **Layer / Model 抽象**：Sequential、Functional、子类化三种建模
- **内置循环**：`fit` / `evaluate` / `predict`，通吃 NumPy / tf.data / DataLoader
- **keras.ops**：完整 NumPy API + NN 算子，自定义组件跨后端等价

> 3.15.0（2026-06）：export_torch、MultiOptimizer、滑动窗口注意力。

<!--
选后端用环境变量，代码零修改；后端在 import keras 时锁定。
-->

---
transition: fade-out
---

# 与 TensorFlow 的关系演变

| 时期 | 关系 |
| --- | --- |
| 2015 | Keras 独立诞生，最初跑在 Theano 上 |
| 2019 | TF 2.0 收编：`tf.keras` 成官方高层 API |
| 2023-11 | Keras 3.0 发布：重写 + 多后端 |
| TF 2.16+ | `pip install tensorflow` 附带 Keras 3 |
| 现在 | `tf.keras` 就是 Keras 3；旧版改名 `tf_keras` |

- 留在 Keras 2：`pip install tf_keras` + `TF_USE_LEGACY_KERAS=1`

<!--
坑：TF 2.15 会装 keras==2.15 覆盖你已装的 Keras 3，要重装。
-->

---
transition: fade-out
---

# 安装与后端选择

```bash
pip install --upgrade keras tensorflow   # 三选一：jax / tensorflow / torch
```

```python
import os
os.environ["KERAS_BACKEND"] = "jax"   # 必须在 import keras 之前！
import keras
keras.backend.backend()                # 查当前后端
```

- 或写配置文件 `~/.keras/keras.json` 的 `"backend"` 字段
- 后端在首次 import 时锁定，运行时不可切换
- Keras 3.13 起要求 **Python ≥ 3.11**

<!--
换后端=重启进程；官方兼容矩阵：tf 2.16.1 / torch 2.1 / jax 0.4.20 起。
-->

---
transition: fade-out
---

# 三种建模方式

- **Sequential**：线性堆叠，最快上手
- **Functional API**：`keras.Model(inputs, outputs)`，任意拓扑（多输入/残差/共享层），项目主力
- **子类化**：继承 `Layer` / `Model`，`call` 里写任意 Python，最自由

```python
# Sequential 一瞥
model = keras.Sequential([
    layers.Input(shape=(28, 28)),
    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
```

<!--
三种方式可以互相嵌套混用；Model 本身也是 Layer。
-->

---
transition: fade-out
---

# Functional API（主力）

```python
inputs = keras.Input(shape=(28, 28))
x = layers.Flatten()(inputs)
x = layers.Dense(128, activation="relu")(x)
residual = x
x = layers.Dense(128, activation="relu")(x)
x = layers.Add()([x, residual])                  # 残差连接
outputs = layers.Dense(10, activation="softmax")(x)

model = keras.Model(inputs, outputs, name="mlp_resnet")
keras.utils.plot_model(model, "m.png", show_shapes=True)
```

- 层 = 作用在张量上的函数；自动记录图结构
- 图可内省、可序列化、可可视化

<!--
多输入多输出：inputs=[a, b]，outputs={"score": s, "cls": c}。
-->

---
transition: fade-out
---

# 子类化 Layer / Model

```python
class MLPBlock(layers.Layer):
    def __init__(self, units):
        super().__init__()
        self.dense1 = layers.Dense(units)
        self.dense2 = layers.Dense(units)

    def call(self, inputs, training=None):
        x = keras.activations.relu(self.dense1(inputs))
        return self.dense2(x)
```

- `__init__` 存配置 → `build(input_shape)` 建权重（`add_weight`）→ `call` 前向
- 延迟构建：第一次见输入才建权重；`get_config()` 才能被 `.keras` 序列化
- 自由度最高，但图不隐式可内省

<!--
model(x) 默认 training=False；Dropout/BN 行为靠 training 参数分叉。
-->

---
transition: fade-out
---

# 训练三行：compile / fit / evaluate

```python
model.compile(
    optimizer=keras.optimizers.Adam(1e-3),
    loss=keras.losses.SparseCategoricalCrossentropy(),
    metrics=[keras.metrics.SparseCategoricalAccuracy(name="acc")],
)

history = model.fit(x_train, y_train,
                    batch_size=64, epochs=5, validation_split=0.1)
loss, acc = model.evaluate(x_test, y_test)
probs = model.predict(x_test[:8])
```

- 整数标签用 Sparse 损失；输出 logits 时 `from_logits=True`
- `history.history` 含每轮全部指标

<!--
validation_split 从训练集尾部切；时序数据先 shuffle 或改传 validation_data。
-->

---
transition: fade-out
---

# 数据源自由

`fit` / `evaluate` / `predict` 与后端解耦，随便喂：

- **NumPy 数组 / Pandas DataFrame**
- **tf.data.Dataset**（Torch 后端也能吃！）
- **PyTorch DataLoader**（TF 后端也能吃！）
- **Keras PyDataset / Grain**（3.12+）

```python
ds = tf.data.Dataset.from_tensor_slices((x, y))
ds = ds.shuffle(10000).batch(64).prefetch(tf.data.AUTOTUNE)
model.fit(ds, epochs=5)      # 已组批，不传 batch_size
```

<!--
数据管线选型不再绑死框架，这是多后端红利的另一半。
-->

---
transition: fade-out
---

# 回调（Callbacks）

```python
callbacks = [
    keras.callbacks.EarlyStopping(
        monitor="val_loss", patience=5, restore_best_weights=True),
    keras.callbacks.ModelCheckpoint(
        "best.keras", save_best_only=True),
    keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=2),
    keras.callbacks.TensorBoard(log_dir="logs"),
]
model.fit(x, y, epochs=100, validation_split=0.1, callbacks=callbacks)
```

- 钩子点：`on_epoch_end` / `on_batch_begin` / `on_train_end`……
- `BackupAndRestore`：训练崩溃后断点续训

<!--
EarlyStopping 记得 restore_best_weights=True，否则留的是最后而非最优。
-->

---
transition: fade-out
---

# keras.ops：跨后端自定义组件

```python
from keras import ops

class MyMSE(keras.losses.Loss):
    def call(self, y_true, y_pred):
        return ops.mean(ops.square(y_true - y_pred), axis=-1)
```

- `ops` = 完整 NumPy API（matmul/einsum/stack/take……）
- 外加 NN 算子：`softmax` / `conv` / `pool` / `binary_crossentropy`
- **只用 ops + 内置层 ⇒ 三后端数值一致**；混入原生调用即锁死后端

<!--
3.15 ops 扩列：unique/pinv/matrix_rank/ssim/sobel_edges 等。
-->

---
transition: fade-out
---

# 自定义训练：两个层级

**① 重写 train_step**（保留 compile/fit 的进度条与回调）

```python
class MyModel(keras.Model):
    def train_step(self, data):
        # 自定义每步逻辑，返回指标 dict
        return {m.name: m.result() for m in self.metrics}
```

**② 后端原生循环**（完全控制）

- JAX：`stateless_call` + `jax.grad` + optax
- TF：`tf.GradientTape` + `tf.distribute`
- Torch：Keras 模型即 `nn.Module`，配 `torch.optim` / DDP

<!--
3.15 的 MultiOptimizer 让多优化器场景不必手写 train_step。
-->

---
transition: fade-out
---

# 混合精度与量化

```python
# 混合精度：一行全局策略
keras.mixed_precision.set_dtype_policy("mixed_float16")
outputs = layers.Dense(10, activation="softmax",
                       dtype="float32")(x)   # 输出层保 float32

# 训练后量化（3.12+）
model.quantize("int8")
model.quantize("gptq", config=GPTQConfig(dataset=calib_ds,
                                         weight_bits=4, group_size=128))
```

- 计算 float16、变量 float32，提速省显存
- GPTQ：逐层二阶校准的 int4 权重量化

<!--
3.13 起 QuantizationConfig 可按层定制，filters 正则选层。
-->

---
transition: fade-out
---

# 保存：.keras 标准格式

```python
model.save("mnist.keras")                        # 架构+权重+compile 配置
model2 = keras.saving.load_model("mnist.keras")

model.save_weights("mnist.weights.h5")           # 必须 .weights.h5 结尾
model2.load_weights("mnist.weights.h5")
```

- `.keras` = zip：config.json + model.weights.h5 + metadata
- 旧 `.h5` 整模型格式已废弃
- 安全：不可信存档别开 `enable_unsafe_deserialization()`

<!--
3.12–3.15 连环安全补丁：HDF5 外链、tar 穿越、Lambda 反序列化 fail-closed。
-->

---
transition: fade-out
---

# 导出部署：一个 export 四个出口

| format | 产物 | 版本 |
| --- | --- | --- |
| 默认 | TF SavedModel | 3.0 |
| `"onnx"` | ONNX 图 | 3.x |
| `"litert"` | LiteRT（原 TFLite） | 3.13+ |
| `"torch"` | 原生 nn.Module | 3.15+ |

```python
model.export("model.tflite", format="litert")
model.export("model.pt", format="torch")
```

- `save` 存可续训模型，`export` 出交付/推理格式

<!--
LiteRT 导出需要装 TF；torch 导出打通 PyTorch 部署链。
-->

---
transition: fade-out
---

# KerasHub：预训练模型库

原 **KerasNLP 更名而来**（2024），并吸收视觉模型：

```python
import keras_hub

clf = keras_hub.models.BertClassifier.from_preset(
    "bert_base_en_uncased", num_classes=2)
clf.fit(imdb_train, validation_data=imdb_test)

img = keras_hub.models.ImageClassifier.from_preset(
    "resnet_50_imagenet", activation="softmax")
```

- `pip install keras-hub`；checkpoint 托管 Kaggle Models
- 三后端可用；安装会拉 TF（预处理复用 tf.data）

<!--
生成式也在：Gemma CausalLM、Stable Diffusion TextToImage，from_preset 同款。
-->

---
transition: fade-out
---

# 分布式：keras.distribution

```python
from keras import distribution

dp = distribution.DataParallel(devices=devices)   # 数据并行

mesh = distribution.DeviceMesh(                   # 模型并行
    shape=(2, 4), axis_names=("data", "model"))
```

- 模型定义 / 训练逻辑 / 分片配置三者解耦
- **JAX 后端功能最全**（TPU 大规模训练主推路线）
- 3.15 ModelParallel 持续增强

<!--
单机多卡到 TPU Pod 同一套 API；TF/Torch 后端覆盖在追赶中。
-->

---
transition: fade-out
---

# 版本速览（3.0 → 3.15）

| 版本 | 关键变化 |
| --- | --- |
| 3.0 | 多后端重写；keras.ops；distribution |
| 3.12 | 蒸馏 Distiller；GPTQ；Grain |
| 3.13 | Python ≥ 3.11；LiteRT 导出 |
| 3.14 | Orbax checkpoint；AWQ 量化 |
| 3.15 | export_torch；MultiOptimizer；Flash SDPA |

- 升级先看 Release Notes 的 BREAKING 一节
- 生产锁定 `keras==x.y.z` + 对应后端版本

<!--
3.12.x 是维护线，持续收安全补丁（3.12.3）。
-->

---
transition: fade-out
---

# 陷阱速览

- **后端不可运行时切换**：import 后改环境变量无效，重启进程
- **TF 2.15 覆盖安装**：装完 TF 2.15 记得重装 Keras 3
- **自定义层忘 `get_config`**：`.keras` 保存时炸在反序列化
- **子类模型没 build**：先 `model.build(shape)` 或跑假数据再 summary
- **`model(x)` 默认 training=False**：调试 Dropout/BN 的灵异现象源头
- **不可信存档**：保持 safe_mode，别开 unsafe deserialization

<!--
另有：save_weights 文件名必须 .weights.h5 结尾。
-->

---
transition: fade-out
---

# 速查表

| 主题 | 一行 |
| --- | --- |
| 后端 | `KERAS_BACKEND=jax`（import 前） |
| 建模 | Sequential / Functional / 子类化 |
| 训练 | `compile → fit → evaluate / predict` |
| 数据 | NumPy / tf.data / DataLoader 通吃 |
| 组件 | 自定义只用 `keras.ops` |
| 保存/导出 | `.keras` / `export(format=...)` |
| 预训练 | `keras_hub.from_preset()` |

<!--
完整内容见笔记站 Keras 章节。
-->

---

## 谢谢观看

Keras · 多后端统一 API / Model & Layer / fit 三件套 / KerasHub / 导出部署

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
