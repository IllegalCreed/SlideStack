---
theme: seriph
background: https://cover.sli.dev
title: TensorFlow 完全指南
info: |
  TensorFlow 完全指南：tf.keras 主线 · tf.data · tf.function 图模式 · SavedModel · TF Serving/TFLite/TFJS 部署矩阵

  Learn more at https://www.tensorflow.org/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## TensorFlow

tf.keras + tf.data + tf.function：从训练到全端部署的深度学习平台（基于 TensorFlow 2.21.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
eager 默认 + 图编译可选 + 部署矩阵，是 TF2 的三张牌。
-->

---
transition: fade-out
---

# TensorFlow 是什么

Google 主导的深度学习平台，四部分核心：

- **tf.Tensor + Eager**：默认即时执行，风格对齐 NumPy/PyTorch
- **tf.function**：AutoGraph 把 Python 编译成计算图，可叠 XLA
- **tf.keras（= Keras 3）**：内置高级 API，可切 TF/JAX/PyTorch 后端
- **tf.data**：声明式输入管线，AUTOTUNE 自动调优

```python
import tensorflow as tf
print(tf.__version__)                          # 2.21.0
tf.config.list_physical_devices("GPU")         # GPU 自检
```

> 2.21.0（2026-03）：Python 3.10–3.13，Keras ≥ 3.12，TensorBoard 分离安装。

<!--
护城河在部署：SavedModel → Serving / LiteRT / TFJS 全链路。
-->

---
transition: fade-out
---

# 安装与平台

```bash
# 纯 CPU（各平台通用）
pip install tensorflow

# Linux + NVIDIA GPU（官方文档配套 CUDA 12.3 + cuDNN 8.9.7）
pip install 'tensorflow[and-cuda]'
```

- Python **3.10–3.13**（2.21 移除 3.9）
- **Windows**：2.10 后原生无 GPU → 用 WSL2
- **macOS**：无官方 GPU 支持
- 2.21 起 TensorBoard 单独 `pip install tensorboard`

<!--
驱动要求 ≥ 525.60.13；Windows CPU wheel 由 Intel 代构建。
-->

---
transition: fade-out
---

# Eager 张量与变量

```python
a = tf.constant([[1, 2], [3, 4]])    # 建张量
b = tf.random.normal((2, 2))
c = a @ b                            # 矩阵乘
d = a * 2                            # 逐元素乘（广播）
arr = c.numpy()                      # 转 NumPy（eager 专属）

w = tf.Variable(1.0)                 # 可训练变量
w.assign_add(0.5)                    # 原地更新
```

- `tf.Tensor` **不可变**；`tf.Variable` 可变，是权重载体
- GPU 可用时运算自动上卡，无需手动 `.to(device)`

<!--
没有 1.x 的 Session/placeholder——每行立即求值。
-->

---
transition: fade-out
---

# 第一个模型：Sequential

```python
from tensorflow import keras
from tensorflow.keras import layers

(xtr, ytr), (xte, yte) = keras.datasets.fashion_mnist.load_data()
xtr, xte = xtr / 255.0, xte / 255.0

model = keras.Sequential([
    keras.Input(shape=(28, 28)),
    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.2),
    layers.Dense(10),               # 输出 logits
])
```

- `keras.Input` 显式声明形状；层按序堆叠
- 末层**不加 softmax**，交给损失函数

<!--
官方 quickstart：FashionMNIST 28×28 灰度图 10 分类。
-->

---
transition: fade-out
---

# compile → fit → evaluate

```python
model.compile(
    optimizer="adam",
    loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=[keras.metrics.SparseCategoricalAccuracy()],
)
model.fit(xtr, ytr, epochs=5, validation_split=0.1)
model.evaluate(xte, yte)
probs = tf.nn.softmax(model.predict(xte[:3]), axis=-1)
```

- `from_logits=True`：损失内部做 softmax，数值更稳
- **整数标签用 Sparse 系损失**；one-hot 用 Categorical
- `fit` 自动完成 batch/前向/反向/更新

<!--
要概率：推理后对 logits 手动 softmax。
-->

---
transition: fade-out
---

# tf.data：声明式输入管线

```python
train_ds = (
    tf.data.Dataset.from_tensor_slices((xtr, ytr))
    .shuffle(60000)                    # 缓冲打乱
    .batch(32)                         # 组批
    .prefetch(tf.data.AUTOTUNE)        # 与训练重叠
)
model.fit(train_ds, epochs=5)          # Dataset 直接喂 fit
```

- 链式变换：顺序即执行顺序
- `shuffle(buffer)`：buffer ≥ 样本数或上万
- `prefetch(AUTOTUNE)` 几乎永远放最后

<!--
大数据：from_generator / TFRecordDataset，指南页展开。
-->

---
transition: fade-out
---

# tf.function：图模式

```python
@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        loss = loss_fn(y, model(x, training=True))
    grads = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(grads, model.trainable_variables))
    return loss

@tf.function(jit_compile=True)       # 叠加 XLA 融合
def fast_block(x): ...
```

- AutoGraph 自动改写控制流（if/for → 图操作）
- 换来算子融合、整图优化、可部署性

<!--
eager 写逻辑，function 拿性能——不用二选一。
-->

---
transition: fade-out
---

# retracing 三条规则

- **Tensor 参数**：按 shape+dtype 建签名，新组合会重 trace
- **Python 值参数**（int/str/对象）：一变必 retracing——改传 Tensor
- **副作用只跑一次**：`print`/列表追加仅在 trace 时执行，图内用 `tf.print`

```python
@tf.function(input_signature=[
    tf.TensorSpec([None, 784], tf.float32),   # None = 任意 batch
])
def serve(x): ...
```

> 生产代码用 `input_signature` 固定签名，杜绝意外重 trace。

<!--
动态 shape：把可变维标 None，避免每个 shape 一张图。
-->

---
transition: fade-out
---

# GradientTape：自定义训练循环

```python
for epoch in range(10):
    for x, y in train_ds:
        with tf.GradientTape() as tape:
            logits = model(x, training=True)
            loss = loss_fn(y, logits)
        grads = tape.gradient(loss, model.trainable_variables)
        optimizer.apply_gradients(zip(grads, model.trainable_variables))
```

- tape 上下文记录所有可导运算 → `tape.gradient` 一次取全部
- 监视普通张量要 `tape.watch(x)`；二次梯度 `persistent=True`
- 适用：GAN、多损失、梯度手术等 `fit` 装不下的场景

<!--
套 @tf.function 后自定义循环照样跑图模式。
-->

---
transition: fade-out
---

# Keras 进阶：Functional 与 Callbacks

```python
inputs = keras.Input(shape=(784,))
x = layers.Dense(128, activation="relu")(inputs)
x = layers.Dense(64, activation="relu")(x)
model = keras.Model(inputs, layers.Dense(10)(x))
```

- **Functional**：张量连线，多输入/多输出/共享层
- **子类化**：重写 `call`，最大自由度
- Callbacks：`EarlyStopping` / `ModelCheckpoint` / `TensorBoard` / `ReduceLROnPlateau`

```python
keras.mixed_precision.set_global_policy("mixed_float16")  # 混合精度一行
```

<!--
子类化模型的 forward 逻辑写在 call 里，training 参数别丢。
-->

---
transition: fade-out
---

# tf.distribute 概览

```python
strategy = tf.distribute.MirroredStrategy()   # 单机多卡
with strategy.scope():        # scope 内建模型 + compile
    model = build_model()
    model.compile(optimizer="adam", loss=...)
model.fit(train_ds, epochs=5) # 数据自动分片
```

- **MirroredStrategy**：单机多卡同步 all-reduce，最常用
- **MultiWorkerMirroredStrategy**：多机（TF_CONFIG 组网）
- **TPUStrategy / ParameterServerStrategy**：TPU / 异步大规模

<!--
strategy scope 之外代码零改动，是 TF 分布式最省心的一点。
-->

---
transition: fade-out
---

# SavedModel：部署交换格式

```python
@tf.function(input_signature=[tf.TensorSpec([None, 784], tf.float32)])
def serve_fn(x):
    return {"probabilities": tf.nn.softmax(model(x))}

tf.saved_model.save(model, "saved/1/", signatures={"serving_default": serve_fn})
```

```bash
saved_model_cli show --dir saved/1/ --all   # 排查签名/输入输出
```

- 计算图 + 权重 + 签名，语言无关
- Keras 3 捷径：`model.export("saved/1/")`
- `.keras` 存训练模型；SavedModel 是推理工件

<!--
Serving / TFLite / TFJS 都吃 SavedModel——一次导出多处用。
-->

---
transition: fade-out
---

# TF Serving：在线服务

```bash
# 目录约定：/models/<名字>/<整数版本号>/
docker run -p 8501:8501 \
  -v $(pwd)/saved:/models/mnist -e MODEL_NAME=mnist \
  tensorflow/serving

curl -X POST http://localhost:8501/v1/models/mnist:predict \
  -H 'Content-Type: application/json' -d '{"instances": [[...]]}'
```

- REST `:8501` / gRPC `:8500`；默认服务最大版本号
- `--model_config_file` 支持版本灰度/多模型
- 配套 Python 客户端 `tensorflow-serving-api`（当前 2.20.0）

<!--
版本号子目录是硬约定，不带版本号不识别。
-->

---
transition: fade-out
---

# TFLite → LiteRT：端侧部署

```python
converter = tf.lite.TFLiteConverter.from_saved_model("saved/1/")
converter.optimizations = [tf.lite.Optimize.DEFAULT]  # 动态范围量化
def representative_dataset():        # int8 全整数量化必需
    for x in calib: yield [x.astype("float32")[None]]
converter.representative_dataset = representative_dataset
open("m.tflite", "wb").write(converter.convert())
```

- 量化三档：动态范围 / float16 / int8 全整数（需代表性数据集）
- **2.20 官方宣布 tf.lite 弃用 → 迁 LiteRT**（google-ai-edge/LiteRT）

<!--
2.19 起 tf.lite.Interpreter 警告指向 ai_edge_litert；新项目直接评估 LiteRT。
-->

---
transition: fade-out
---

# TensorFlow.js：浏览器与 Node

```bash
pip install tensorflowjs
tensorflowjs_converter --input_format=keras fashion.keras web_model/
```

- 当前版本 **4.22.0**（`@tensorflow/tfjs`）
- `loadLayersModel`（Keras 格式）/ `loadGraphModel`（图模型）
- 后端可选：**webgl / webgpu / wasm / cpu**
- 浏览器本地推理：隐私好、零服务端成本

<!--
Node 侧用 @tensorflow/tfjs-node 走原生加速。
-->

---
transition: fade-out
---

# 部署矩阵一页看懂

| 目标场景 | 工具 | 模型来源 |
| --- | --- | --- |
| 服务端高并发 | TF Serving（REST/gRPC） | SavedModel 版本目录 |
| Android/iOS/MCU | LiteRT（原 TFLite） | TFLiteConverter |
| 浏览器/Node.js | TensorFlow.js | tensorflowjs_converter |
| 训练侧保存/续训 | Keras `.keras` | `model.save` |
| 边缘 TPU | Coral（编译 tflite） | int8 量化模型 |

> 三者共享 SavedModel/Keras 模型作为转换源——一次训练，全端落地。

<!--
选型先看运行环境，再看量化/延迟预算。
-->

---
transition: fade-out
---

# 版本速览（2.16 → 2.21）

| 版本 | 关键变化 |
| --- | --- |
| 2.16 | Keras 3 成默认；tf.estimator 移除 |
| 2.17 | 移除 Maxwell GPU（CC 5.x） |
| 2.18 | 默认 NumPy 2.0；Hermetic CUDA |
| 2.19 | tf.lite.Interpreter 弃用警告 |
| 2.20 | 宣布 tf.lite 迁 LiteRT；GCS 文件系统变可选 |
| 2.21 | 移除 Py3.9；TensorBoard 分离；int2/uint4 量化算子 |

- 升级必看 Breaking Changes；生产锁 `tensorflow==2.21.0`

<!--
Keras 3 独立发版，pip install -U keras 可单独升级。
-->

---
transition: fade-out
---

# 常见坑

- `from_logits=True` 又在末层加 softmax——**二选一**
- `@tf.function` 传递增 Python int → retracing 爆炸，改传 Tensor
- `shuffle(100)` 对百万级数据 ≈ 没打乱，buffer 给足
- `tf.Variable` 在 `@tf.function` 内反复创建 → 二次调用报错
- 自定义循环忘传 `training=True` → Dropout/BN 行为错
- Serving 目录不带整数版本号 → 模型不识别

<!--
前四个是面试与生产都高频的坑。
-->

---
transition: fade-out
---

# 速查表

| 主题 | 一行 |
| --- | --- |
| 安装 | `pip install tensorflow` / `'tensorflow[and-cuda]'` |
| 模型 | `Sequential/Functional` → `compile → fit → evaluate` |
| 数据 | `from_tensor_slices → shuffle → batch → prefetch` |
| 图模式 | `@tf.function`（+`jit_compile`） |
| 自定义训练 | `GradientTape → gradient → apply_gradients` |
| 保存/导出 | `.keras` / `model.export` → SavedModel |
| 部署 | Serving / LiteRT / TFJS 三件套 |

<!--
完整内容见笔记站 TensorFlow 章节。
-->

---

## 谢谢观看

TensorFlow · tf.keras / tf.data / tf.function / SavedModel / 部署矩阵

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
