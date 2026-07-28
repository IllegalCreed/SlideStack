---
theme: seriph
background: https://cover.sli.dev
title: OpenCV 基础完全指南
info: |
  OpenCV 基础完全指南：Mat/ndarray · 图像处理 · 几何变换 · 形态学 · Canny · 特征点 · DNN 推理

  Learn more at [https://docs.opencv.org/5.x](https://docs.opencv.org/5.x)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## OpenCV 基础

通用计算机视觉算法库 · cv::Mat · 图像处理 · 5.0.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
OpenCV 是传统 CV 的事实标准库，5.0 大版本升级 DNN 引擎。
-->

---
transition: fade-out
---

# OpenCV 是什么

Intel 发起、Apache 基金会协同的开源计算机视觉库

- **通用算法库**：图像/视频/标定/特征/几何/DNN 全覆盖
- **统一 cv::Mat**：所有算子共享同一数据容器
- **跨语言**：C++/Python/Java 官方绑定
- **跨平台**：Windows/Linux/macOS/Android/iOS
- **5.0 大升级**：C++17、新 DNN 引擎、Apache 2.0

> 稳定版 **5.0.0**（2026-06），4.14 并行维护（仅修 bug）

<!--
OpenCV = 算法库 + Mat 抽象，CV 教学与原型事实标准。
-->

---

# 读写与显示四件套

```python
import cv2

img = cv2.imread("input.jpg")          # BGR uint8，失败返回 None
if img is None:
    raise FileNotFoundError("读图失败")

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imwrite("gray.png", gray)          # 保存

cv2.imshow("win", img)
cv2.waitKey(0)                         # 0=无限等
cv2.destroyAllWindows()
```

**三个高频踩坑**

- 默认 **BGR** 而非 RGB（与 PIL/Matplotlib 互通前必须转换）
- 透明 PNG 默认丢 alpha，需 `IMREAD_UNCHANGED`
- `imread` 第二参：`GRAYSCALE`(0) / `COLOR`(1) / `UNCHANGED`(-1)

<!--
读图→处理→显示→保存是 CV 最基础流水线。
-->

---
layout: two-cols
---

# Mat 与 ndarray

```python
import cv2, numpy as np

img = cv2.imread("a.jpg")    # ndarray (H,W,3) uint8
print(img.shape, img.dtype)  # (1080,1920,3) uint8

roi = img[100:300, 200:500]  # NumPy 切片=ROI
img[:, :, 2] = 0             # R 通道清零（原地）
```

- Python 用 **numpy.ndarray** 容器
- C++ 用 `cv::Mat`，pybind11 零拷贝互转
- 切片共享内存，改 ROI 即改原图

::right::

# 形状与像素对照

| 操作 | Python | C++ |
|------|--------|-----|
| 形状 | `img.shape` | rows/cols |
| dtype | `img.dtype` | `type()` |
| 像素 | `img[y,x]` | `at&lt;&gt;` |
| ROI | `img[y0:y1,x0:x1]` | `Rect` |

> H×W×C 顺序，第 0 维是行（y）。

<!--
Python 侧 ndarray = cv::Mat 的零拷贝视图。
-->

---

# 色彩空间与几何变换

```python
# 色彩空间
rgb  = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# 缩放
resized = cv2.resize(img, (640, 480))
resized = cv2.resize(img, None, fx=0.5, fy=0.5)

# 旋转（绕中心）
h, w = img.shape[:2]
M = cv2.getRotationMatrix2D((w/2, h/2), 45, 1.0)
rotated = cv2.warpAffine(img, M, (w, h))

# 透视（4 点对）
M = cv2.getPerspectiveTransform(src4, dst4)
bird = cv2.warpPerspective(img, M, (w, h))
```

> 透视变换常用于文档扫描、车牌校正。

<!--
cvtColor + warpAffine/warpPerspective 是几何处理基础。
-->

---
layout: two-cols
---

# 线性与非线性滤波

```python
blurred  = cv2.GaussianBlur(img, (5,5), 0)   # 高斯平滑
denoised = cv2.medianBlur(img, 5)            # 去椒盐
smooth   = cv2.bilateralFilter(img, 9, 75, 75)  # 保边
```

**滤波对比**

| 滤波 | 保边 | 速度 | 场景 |
|------|------|------|------|
| GaussianBlur | 否 | 最快 | 通用平滑 |
| medianBlur | 部分 | 快 | 椒盐噪声 |
| bilateral | 是 | 最慢 | 美颜降噪 |

::right::

# 形态学操作

```python
_, bin = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
k = np.ones((5,5), np.uint8)

cv2.erode(bin, k)               # 腐蚀
cv2.dilate(bin, k)              # 膨胀
cv2.morphologyEx(bin, cv2.MORPH_OPEN, k)     # 开
cv2.morphologyEx(bin, cv2.MORPH_CLOSE, k)    # 闭
cv2.morphologyEx(bin, cv2.MORPH_GRADIENT, k) # 梯度
```

> 开运算去小白点，闭运算填小黑洞。

<!--
滤波 + 形态学是图像预处理标准件。
-->

---

# 边缘检测：Canny

经典「最佳边缘检测」，含平滑+梯度+非极大抑制+双阈值

```python
gray  = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, threshold1=100, threshold2=200)
```

**双阈值含义**

- 梯度 &gt; high：一定是边缘
- 梯度 &lt; low：一定不是边缘
- 介于两者：看是否与确定边缘连通

**轮廓检测**

```python
contours, _ = cv2.findContours(bin, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cv2.drawContours(out, contours, -1, (0,255,0), 2)
area = cv2.contourArea(contours[0])
```

> 5.x 的 `findContours` 只返回 `(contours, hierarchy)` 两个值。

<!--
Canny + findContours 是检测/分割的预处理利器。
-->

---
layout: two-cols
---

# SIFT 与 ORB 特征

```python
# SIFT（专利已过期，回主库）
sift = cv2.SIFT_create()
kp, des = sift.detectAndCompute(gray, None)
# des: (N, 128) float32，尺度/旋转不变

# ORB（免费、快、二进制）
orb = cv2.ORB_create(nfeatures=1000)
kp, des = orb.detectAndCompute(gray, None)
# des: (N, 32) uint8，适合实时/移动端
```

::right::

# 特征匹配

```python
# SIFT 用 L2；ORB 用 NORM_HAMMING
bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=True)
matches = bf.match(des1, des2)
matches = sorted(matches, key=lambda m: m.distance)[:30]
out = cv2.drawMatches(img1, kp1,
                      img2, kp2, matches, None)
```

> ORB 适合实时，SIFT 精度更高。

<!--
特征点 + 匹配是配准、拼接、SLAM 的基础。
-->

---

# DNN 模块（深度学习推理）

5.0 新引擎：ONNX 算子覆盖 23% → 80%+

```python
import cv2, numpy as np

net = cv2.dnn.readNetFromONNX("model.onnx")   # 加载

blob = cv2.dnn.blobFromImage(                 # 预处理 HWC→NCHW
    img, scalefactor=1/255.0, size=(640,640),
    mean=(0,0,0), swapRB=True, crop=False)

net.setInput(blob)                            # 推理
output = net.forward()

net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)  # 或 CUDA
```

> `blobFromImage` 一次完成 resize/减均值/缩放/通道交换。

<!--
DNN 模块只推理不训练，端侧可直接跑 ONNX。
-->

---

# 视频处理

VideoCapture 支持摄像头索引与文件/RTSP 流

```python
import cv2

cap = cv2.VideoCapture(0)            # 0=摄像头；"v.mp4"=文件
while True:
    ret, frame = cap.read()          # ret=False 读完
    if not ret:
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    cv2.imshow("live", gray)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()                        # 必须释放
cv2.destroyAllWindows()
```

> 写视频用 `VideoWriter`，fourcc/fps/size 必须匹配。

<!--
VideoCapture 是视频/流处理的标准入口。
-->

---
layout: quote
---

# 传统 CV 的瑞士军刀

「imread → cvtColor → filter → Canny → findContours，一条流水线 + cv::Mat 抽象 + numpy 互转，这就是 OpenCV 处理图像的全部精髓。」

---

# OpenCV vs Pillow vs DNN 库

| 维度 | OpenCV | Pillow | DNN 库(PyTorch) |
|------|--------|--------|------|
| **定位** | CV 算法库 | 图像 IO/基础 | 训练+推理 |
| **算法** | 最全（标定/特征） | 基础处理 | 仅模型推理 |
| **数据容器** | cv::Mat/ndarray | PIL.Image | Tensor |
| **训练** | 不支持 | 不支持 | 支持 |
| **部署** | 端到云通用 | 轻量 IO | GPU 强 |

> OpenCV 是 CV 生态底座：YOLO/MediaPipe 都用它做 IO 与预处理。

<!--
OpenCV 占据传统 CV 全场景，是其他视觉库的预处理底座。
-->

---
layout: center
class: text-center
---

# 小结

OpenCV = Mat 抽象 + 全算法覆盖

**BGR/ndarray · 图像处理 · Canny · 特征 · DNN 推理**

[OpenCV 文档](https://docs.opencv.org/5.x) · [5.x 迁移指南](https://github.com/opencv/opencv/wiki/Opencv4-to-5-Migration) · [GitHub](https://github.com/opencv/opencv)

<!--
Mat + 算法库 + numpy 互转 = 传统 CV 全栈。
-->
