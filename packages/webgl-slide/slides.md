---
theme: seriph
background: https://cover.sli.dev
title: Welcome to WebGL
info: |
  Presentation WebGL — 浏览器暴露的底层图形 API。

  Learn more at https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔺</span>
</div>

<br/>

## WebGL — 浏览器里的底层图形 API

浏览器暴露的底层光栅化 API——只认点、线、三角形的 GPU 状态机

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 WebGL——浏览器里驱动 GPU 图形的底层 API,基于 OpenGL ES,通过 canvas 的另一种上下文暴露出来。

一句话定位:WebGL 不是"3D 库",而是一台只认点、线、三角形的 GPU 状态机——你喂给它顶点数据和两个着色器程序,它负责把三角形光栅化成屏幕像素,除此之外(变换、光照、动画)全部要开发者自己用代码算出来。

背景:WebGL1 基于 OpenGL ES 2.0,2015 年起 Baseline Widely available;WebGL2 基于 OpenGL ES 3.0,2021 年起同样 Widely available,全球可用率 94% 以上,且完全向后兼容 WebGL1,WebGL1 代码可直接在 webgl2 上下文运行。

今天顺序:定位 → 上下文与画布 → 渲染管线 → GLSL 着色器 → Buffer/绘制/纹理 → MVP 矩阵 → 深度混合剔除 → FBO → WebGL2 新特性 → 性能调试 → 扩展机制 → 易错点 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 定位:光栅化引擎,而非 3D 引擎

> "WebGL is just a rasterization engine. It draws points, lines, and triangles based on code you supply." —— webglfundamentals.org

<v-clicks>

- 不理解"3D":只认裁剪空间里的点、线、三角形
- 透视、光照、动画全部由开发者写的着色器"算出来"
- 是 `<canvas>` 的另一种上下文,与 Canvas 2D 并列而非从属
- Three.js / Babylon.js / PixiJS 是建在它之上的封装层

</v-clicks>

<!--
这页讲清 WebGL 到底是什么。webglfundamentals.org 开篇原话说得很直白:WebGL 只是一台光栅化引擎,根据你给的代码画点、线、三角形。

它不理解"3D"这个概念——三维效果,不管是透视、光照还是动画,全部是开发者通过顶点着色器和片元着色器"算出来"的假象,WebGL 本身只认裁剪空间里的三角形,作者原话是"Getting WebGL to do anything else is up to you"。

它是 canvas 元素的另一种上下文,用 getContext("webgl") 取得,和 2d 上下文并列,不是谁包含谁——很多页面两者会同时用,比如图表用 2D、背景特效用 WebGL,注意同一个 canvas 一旦创建了某种类型的上下文,类型就固定了。

Three.js、Babylon.js、PixiJS 这些库,都是在 WebGL 这台光栅化引擎之上,封装出场景图、相机、材质、资源管理的高层框架。理解这层关系,后面所有内容才有地基——面试考察的不是背某个函数第几个参数,而是渲染管线心智模型、着色器数据流、WebGL1/2 差异这三条主线。
-->

---

# 上下文与画布

```js
const canvas = document.querySelector("#glcanvas");
const gl =
  canvas.getContext("webgl2") || // 优先 WebGL2
  canvas.getContext("webgl") || // 兜底 WebGL1
  canvas.getContext("experimental-webgl"); // 极旧浏览器
if (!gl) {
  alert("无法初始化 WebGL,你的浏览器、操作系统或硬件可能不支持");
}
```

<v-clicks>

- 同一个 `<canvas>` 不能同时取 `"2d"` 和 `"webgl"`——上下文类型一旦创建即固定
- 画一个三角形需要三件套:着色器程序 + 顶点 Buffer + 一次 draw call
- 清屏三部曲:`clearColor(r,g,b,a)` 设色 → `clear(gl.COLOR_BUFFER_BIT)` 执行

</v-clicks>

<!--
获取上下文的标准写法:优先请求 webgl2,拿不到兜底 webgl,再拿不到兜底极旧浏览器的 experimental-webgl 前缀名,三选一都拿不到就是真的不支持,必须判空处理,否则后续调用全部报错。

三个要点。第一,上下文类型互斥且一旦创建就固定,同一个 canvas 不能先取 2d 再取 webgl。第二,画一个三角形需要三件套:着色器程序、顶点 buffer、一次 draw call,这三样后面几页会逐步搭起来。第三,清屏是每帧最先做的事,设置颜色再执行清除,别忘了后面深度测试还要求清深度缓冲。

getContext 第二个参数还能传 contextAttributes,比如 antialias、preserveDrawingBuffer 这些,控制抗锯齿、截图能力等,今天先跳过,重点放在渲染管线上。
-->

---

# 渲染管线总览(必考核心)

```text
顶点数据(Buffer) → 顶点着色器(逐顶点执行) → 图元装配(点/线/三角形)
  → 裁剪(clip space 视锥外裁剪) → 光栅化(生成片元候选像素)
  → 片元着色器(逐片元上色) → 逐片元操作(深度/模板→混合) → 写入帧缓冲
```

<v-clicks>

- 固定顺序,不可跳步、不可乱序
- 可编程阶段:顶点着色器、片元着色器(开发者写 GLSL)
- 固定阶段:图元装配、光栅化、逐片元测试(行为可配置,位置不可编程)
- 光栅化自动做重心插值——varying 从三个顶点插值而来,不需要手写插值代码

</v-clicks>

<!--
这是必考核心:渲染管线。顺序完全固定——顶点数据先喂给顶点着色器逐顶点执行,然后图元装配成点线三角形,裁剪空间视锥外的部分被裁掉,光栅化把三角形转成一系列候选像素也就是片元,片元着色器逐片元上色,最后深度模板测试和混合,写入帧缓冲显示出来。

这条流水线不可跳步、不可乱序,你不能跳过光栅化直接从顶点到片元。

两段可编程:顶点着色器和片元着色器,这是你写 GLSL 代码的地方。其余阶段——图元装配、光栅化、逐片元测试——发生的位置固定不可编程,但可以通过状态开关配置行为,比如深度函数、混合函数、面剔除方向,后面几页会展开。

最后一条很多人会漏:varying 的插值是自动的,GPU 硬件帮你在光栅化阶段做重心插值,不需要写任何插值代码,这是 WebGL 编程模型里"免费"的部分。
-->

---

# 顶点着色器 vs 片元着色器

| 阶段 | 输入 | 必须写出 | 执行频率 |
|---|---|---|---|
| 顶点着色器 | attribute(逐顶点)+ uniform(全局) | `gl_Position`(裁剪空间坐标) | 每顶点 1 次 |
| 片元着色器 | varying(插值后)+ uniform | `gl_FragColor` 或自定义 `out` | 每像素 1 次,远高于顶点 |

<v-clicks>

- **varying** 由顶点着色器写出,光栅化自动重心插值,片元着色器读入——插值不用手写
- 性能要点:能放顶点着色器算的,就不要放片元着色器(执行次数常差数十到数百倍)

</v-clicks>

<!--
细看两个可编程阶段各自的职责。

顶点着色器:输入是 attribute,逐顶点变化的数据,比如位置、法线;还有 uniform,全局不变的数据,比如变换矩阵。它必须写出 gl_Position,也就是裁剪空间坐标,这是这一阶段唯一的强制输出。

片元着色器:输入是 varying,注意这里拿到的已经是插值后的值;它必须写出颜色——WebGL1 写 gl_FragColor,WebGL2 要自定义一个 out vec4 变量。执行频率是逐像素,数量级远高于顶点着色器,一个网格可能只有几百个顶点,覆盖的像素却可能有几十万个。

varying 的插值是自动的:顶点着色器给三个顶点各写一个 varying 值,光栅化阶段做重心插值,片元着色器拿到插值后的结果,不需要手写任何插值代码,这是 GPU 硬件帮你做的。

性能要点由此而来:同样一次计算,能放顶点着色器做就不要放片元着色器,因为片元执行次数常常是顶点的几十到几百倍,这条原则后面性能页还会再强调。
-->

---

# GLSL 着色器:WebGL1(顶点 + 片元)

```glsl
// 顶点着色器
attribute vec4 aVertexPosition, aVertexColor; // 位置 + 颜色,逐顶点输入
uniform mat4 uModelViewMatrix, uProjectionMatrix; // 全局不变
varying lowp vec4 vColor; // 传给片元着色器,自动插值
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
}
```

```glsl
// 片元着色器
varying lowp vec4 vColor;
void main() {
  gl_FragColor = vColor; // WebGL1 片元着色器唯一认的输出变量名
}
```

<!--
WebGL1 用 GLSL ES 1.00。

顶点着色器:attribute 声明逐顶点输入的位置和颜色,uniform 声明两个全局矩阵,varying 声明要传给片元着色器的颜色。main 函数里必须算出 gl_Position,用投影矩阵乘视图模型矩阵乘顶点位置;再把颜色写进 varying。

片元着色器:接住同名的 varying vColor——变量名和插值方式由声明自动匹配,不需要额外绑定代码。main 函数直接把颜色写进 gl_FragColor,这是 WebGL1 片元着色器唯一认的输出变量名,写别的名字不生效,这也是 WebGL1 和 WebGL2 语法差异的起点。

这套 attribute/uniform/varying 三件套,就是 CPU 和 GPU 之间数据流动的全部通道,后面所有着色器代码都是这个模式的变体。
-->

---

# GLSL 着色器:WebGL2(`#version 300 es`)

```glsl
#version 300 es
in vec4 aVertexPosition, aVertexColor; // attribute → in
uniform mat4 uModelViewMatrix, uProjectionMatrix;
out lowp vec4 vColor; // 顶点着色器里 varying → out
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
}
```

```glsl
#version 300 es
precision mediump float; // 片元着色器必须显式声明精度
in lowp vec4 vColor; // 片元着色器里 varying → in
out vec4 outColor; // 自定义 out 变量替代 gl_FragColor
void main() {
  outColor = vColor;
}
```

<!--
WebGL2 用 GLSL ES 3.00,语法上几个关键改名。首行必须是 #version 300 es,前面不能有任何字符、空行或注释,否则编译报错。

顶点着色器:attribute 改名 in,顶点着色器里的 varying 改名 out——"写出去"的意思,逻辑和上一页 WebGL1 版本完全一样,只是关键字变了。

片元着色器:同样首行 #version 300 es;必须显式声明浮点精度 precision mediump float,不声明直接编译失败——这条规则 WebGL1/2 都适用,但顶点着色器有默认精度 highp,片元着色器没有默认值。原来片元着色器里的 in vColor 对应顶点着色器写出的 out vColor,类型和名字要对上。不再用 gl_FragColor,要自定义一个 out vec4 变量,这里叫 outColor。

一个容易踩的坑:版本声明和语法必须成对升级。如果 WebGL2 上下文里只加了 #version 300 es,却还留着老的 attribute、gl_FragColor,会编译失败——不能只改一半。反过来,不加 #version 300 es,继续用 attribute/varying/gl_FragColor,在 WebGL2 上下文里也能正常编译,因为向后兼容。
-->

---

# 着色器编译与链接(样板代码)

```js
function compile(gl, type, src) {
  const shader = gl.createShader(type); // VERTEX_SHADER / FRAGMENT_SHADER
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    console.error(gl.getShaderInfoLog(shader)); // 编译错误日志,调试第一步
  return shader;
}
const program = gl.createProgram();
gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vsSource));
gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fsSource));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS))
  console.error(gl.getProgramInfoLog(program)); // 链接错误日志
```

<!--
这段样板代码几乎每题都会考。

编译四步:createShader 传类型(顶点或片元)、shaderSource 塞源码字符串、compileShader 编译、用 getShaderParameter 查 COMPILE_STATUS 判断是否成功,失败就打印 getShaderInfoLog——这是调试着色器的第一步,GLSL 报错信息都在这里。

链接四步:createProgram 建一个 program、attachShader 挂上顶点和片元两个编译好的着色器、linkProgram 链接、用 getProgramParameter 查 LINK_STATUS,失败打印 getProgramInfoLog。两个着色器必须先各自编译成功,才能链接成一个可用的 program。

生产代码里编译失败通常还会 deleteShader 释放资源,这里为了篇幅省略,但思路和链接失败一样:查状态、打日志、清理。
-->

---

# Buffer 与顶点属性

```js
// 创建 + 绑定 + 写入数据
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 顶点属性:告诉 GPU 如何从 buffer 取数据喂给 attribute
gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(location); // 必须显式开启,否则恒为默认值
```

<v-clicks>

- `ARRAY_BUFFER`:通用顶点数据;`ELEMENT_ARRAY_BUFFER`:索引缓冲,配合 `drawElements` 复用顶点
- **VAO**:把"buffer 绑定 + 属性配置"整套状态打包,渲染循环只需 `bindVertexArray`
- WebGL2 原生 `createVertexArray`;WebGL1 需 `OES_vertex_array_object` 扩展

</v-clicks>

<!--
Buffer 三步走:createBuffer 创建、bindBuffer 绑定到 ARRAY_BUFFER 目标、bufferData 把 Float32Array 写进去,第三个参数 STATIC_DRAW 是性能提示,告诉驱动这份数据不常变。

顶点属性配置:vertexAttribPointer 告诉 GPU 怎么从当前绑定的 buffer 里取数据喂给某个 attribute——第二个参数 2 表示每个顶点取几个分量,第三参是数据类型,后面是是否归一化、stride、offset。配置完一定要 enableVertexAttribArray,忘了这一步该 attribute 会静默取默认值,典型症状是图形全黑或所有顶点重合在原点。

两种 buffer 目标:ARRAY_BUFFER 放通用顶点数据,ELEMENT_ARRAY_BUFFER 放索引,配合 drawElements 复用顶点、省内存。

VAO 顶点数组对象是个重要优化:把"哪个 buffer 绑定到哪个 attribute、格式怎样"整套状态打包成一个对象,初始化时配一次,渲染循环里只需 bindVertexArray,不用每次重复一堆状态设置调用。WebGL2 原生支持,WebGL1 要用 OES_vertex_array_object 扩展。
-->

---

# 绘制调用与图元类型

```js
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // 无索引,按顶点顺序绘制
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0); // 按索引缓冲绘制
gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 100); // WebGL2:一次绘制 100 个实例
```

<v-clicks>

- 图元类型:`POINTS`/`LINES`/`LINE_STRIP`/`LINE_LOOP`/`TRIANGLES`/`TRIANGLE_STRIP`/`TRIANGLE_FAN`
- 索引类型:WebGL1 默认仅 `UNSIGNED_SHORT`(超 65536 需 `OES_element_index_uint`),WebGL2 原生 `UNSIGNED_INT`
- 一个 canvas 画多个对象:通常靠多次 draw 调用,每次前切换所需的 buffer/uniform

</v-clicks>

<!--
两个基础绘制调用。drawArrays 不用索引,直接按 buffer 里顶点的顺序绘制,三个参数是图元模式、起始顶点、顶点数量。drawElements 按索引缓冲绘制,能复用顶点省内存,第三参是索引的数据类型,第四参是偏移。drawArraysInstanced 是 WebGL2 原生的实例化绘制,最后一个参数是实例数量,一次调用画出上百个副本,后面 WebGL2 新特性会细讲。

图元类型七种,三角形系列最常用,TRIANGLE_STRIP 相邻三个顶点组一个三角形,顶点数量比 TRIANGLES 少,适合连续条带状几何体。

索引类型有个历史包袱:WebGL1 默认索引类型上限是 UNSIGNED_SHORT,也就是 65535,顶点数超过就要么分批画要么申请 OES_element_index_uint 扩展;WebGL2 原生支持 UNSIGNED_INT,不用再操心这个限制。

一个 canvas 想画多个不同对象,标准做法就是循环调用多次 drawArrays 或 drawElements,每次绘制前切换到该对象需要的 buffer、纹理、uniform 值。
-->

---

# 纹理:创建、加载与坑

```js
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture); // 先 bind 再操作,顺序反了无效

const image = new Image();
image.crossOrigin = "anonymous"; // 跨域图片必须设置,否则纹理被"污染"
image.onload = () => {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // 图片左上原点→WebGL左下原点
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D); // 非 2 次幂(WebGL1)禁用,须判断走 CLAMP_TO_EDGE
};
image.src = url;
gl.activeTexture(gl.TEXTURE0); // 激活纹理单元
gl.uniform1i(samplerLocation, 0); // sampler2D 传的是纹理单元号,非纹理对象本身
```

<!--
纹理这块坑最密集,逐条过。

流程:createTexture 建对象,bindTexture 绑定——WebGL 是状态机,必须先 bind 再操作,顺序反了后续调用无效。图片异步加载,onload 里重新 bind 一次,因为加载期间可能有别的纹理占用了绑定点。

三个隐蔽坑:第一,跨域图片必须设 crossOrigin,否则绘制本身不报错,但后续 readPixels/toDataURL 会因画布被"污染"而报错或静默失败。第二,图片默认左上角是原点,WebGL 纹理坐标默认左下角是原点,不处理会上下颠倒,要设 UNPACK_FLIP_Y_WEBGL。第三,非 2 次幂尺寸的纹理在 WebGL1 下不能生成 mipmap、不能用 REPEAT 环绕,画面会显示纯黑或纯色而不报错,需要判断尺寸后走 CLAMP_TO_EDGE 加非 mip 过滤,或者直接换 WebGL2(无此限制)。

绘制时的三步:activeTexture 选一个纹理单元,bindTexture 把纹理绑上去,uniform1i 把纹理单元号——不是纹理对象本身——传给着色器里的 sampler2D uniform。这一步经常被误解,容易传错东西。

补充:实际生产代码通常还会先塞一个 1x1 纯色像素占位,防止图片没加载完时黑屏或报错,今天为了篇幅省略。WebGL2 额外支持 texImage3D 和 texStorage2D 一次性分配存储,以及非 2 次幂纹理完全不受限。
-->

---

# MVP 矩阵变换

```js
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, aspect, 0.1, 100.0); // fov,宽高比,近裁剪,远裁剪
const modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);
mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 1, 0]);
```

<v-clicks>

- **模型矩阵**:模型空间 → 世界空间(缩放/旋转/平移)
- **视图矩阵**:世界空间 → 视图空间("移动相机"数学上等价于反向移动整个场景)
- **投影矩阵**:视图空间 → 裁剪空间(透视 / 正交)
- WebGL **不内置任何矩阵运算**,教程与生产代码普遍依赖 gl-matrix

</v-clicks>

<!--
WebGL 不像 Three.js 那样内置相机、内置矩阵运算,一切要靠 gl-matrix 这类库手写。

代码示例:mat4.create 建一个单位矩阵,mat4.perspective 填入视野角度、宽高比、近远裁剪面算出投影矩阵;mat4.translate 和 mat4.rotate 在模型视图矩阵上叠加位移和旋转。

三个矩阵各管一段变换:模型矩阵把模型空间的顶点变到世界空间,做缩放旋转平移;视图矩阵把世界空间变到视图空间,本质是相机变换的逆矩阵——"移动相机看场景"和"反向移动整个场景"在数学上是等价的;投影矩阵把视图空间变到裁剪空间,透视投影模拟近大远小,正交投影没有这个效果。

这三个矩阵的乘法顺序极其重要,下一页专门展开——顺序写反是 WebGL 里最隐蔽的坑之一。
-->

---

# 齐次坐标 w 与乘法顺序(易错高发区)

```text
gl_Position = projection × view × model × position
```

<v-clicks>

- 矩阵乘法**不满足交换律**——从右向左依次生效:先 model,再 view,最后 projection
- 顺序颠倒 → 画面错位甚至消失,且**通常没有任何报错信息**
- 齐次坐标第四分量 **w**:普通点 w=1(参与平移),方向向量 w=0(不参与平移)
- 裁剪空间坐标除以 w 得到 **NDC**(-1~1 立方体)——"透视除法",近大远小的数学根源
- 正交投影平行线保持平行;透视投影远处物体在 NDC 中收缩

</v-clicks>

<!--
这一页专讲最容易翻车的两个数学细节。

第一,乘法顺序。矩阵乘法不满足交换律,gl_Position 等于 projection 乘 view 乘 model 乘 position,变换从右向左依次生效——先对顶点做 model 变换,再做 view,最后做 projection。顺序写反,画面会错位甚至物体直接消失,而且通常没有任何报错或警告,只能靠肉眼和经验排查,是 WebGL 里最隐蔽的坑之一。

第二,齐次坐标。位置是四分量向量 (x, y, z, w),普通点的 w 是 1,表示参与平移;方向向量比如法线的 w 是 0,不参与平移,这样同一套矩阵运算对点和方向的处理方式才能统一。裁剪空间坐标除以 w 这一步叫透视除法,得到的结果就是 NDC 归一化设备坐标,范围 -1 到 1 的立方体,这一步除法正是"近大远小"效果的数学根源。

补充一句正交和透视的区别:正交投影平行线保持平行,没有近大远小,常用于 2D 或 CAD;透视投影按视野角度、宽高比、远近裁剪面构造,远处物体在 NDC 里收缩得更小。
-->

---

# 深度测试、面剔除与混合

```js
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL); // 默认 LESS,LEQUAL 常用于天空盒等边界情形
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 每帧必须同时清深度

gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK); // 剔除背面,减少片元着色器执行次数

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // 标准 alpha 混合公式
```

<div v-click class="text-sm mt-2">

> 透明物体渲染:先画不透明物体,再按**远到近**画透明物体——混合结果依赖绘制顺序,顺序错了会穿帮。

</div>

<!--
三组独立但常一起用的状态开关。

深度测试:enable DEPTH_TEST 开启,depthFunc 设比较函数,默认 LESS,LEQUAL 常用在天空盒这种边界重合的场景。关键提醒:clear 的时候必须同时带上 DEPTH_BUFFER_BIT,只清颜色不清深度,深度值只增不减,后续帧会被挡住画不出来。

面剔除:enable CULL_FACE 开启,cullFace 设 BACK 剔除背面,减少片元着色器的执行次数,这是免费的性能优化,前提是模型的正反面缠绕方向一致,默认逆时针为正面。

混合:enable BLEND 开启透明混合,blendFunc 设 SRC_ALPHA 和 ONE_MINUS_SRC_ALPHA,是标准的 alpha-over 合成公式。

透明排序是个经典坑:混合结果依赖绘制顺序,标准做法是先画完全部不透明物体,再把透明物体按距离从远到近排序绘制,顺序错了会看到本该被挡住的物体透出来,业内叫穿帮。模板测试 stencilFunc/stencilOp 也是这组状态的一员,常用于镜面反射、描边这类"只在特定区域画"的效果,今天不展开。
-->

---

# 帧缓冲 FBO 与离屏渲染

```js
const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

const targetTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, targetTexture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

// 之后 drawArrays/drawElements 的结果画进 targetTexture 而非屏幕
gl.bindFramebuffer(gl.FRAMEBUFFER, null); // 用完切回默认帧缓冲(屏幕)
```

<v-clicks>

- 用途:渲染到纹理(阴影贴图/镜面反射)、后处理(全屏滤镜)、MRT(WebGL2 `drawBuffers()` 一次输出多张纹理)

</v-clicks>

<!--
帧缓冲对象 FBO 是离屏渲染的基础设施。

流程:createFramebuffer 建一个帧缓冲,bindFramebuffer 绑定它;再建一张纹理,用 texImage2D 分配空间但传 null 不填数据;framebufferTexture2D 把这张纹理挂到帧缓冲的颜色附件0上。挂好之后,后续的绘制调用不再画到屏幕,而是画进这张纹理。用完记得把帧缓冲切回 null,也就是默认帧缓冲,才能重新在屏幕上显示东西。

三大用途:第一,渲染到纹理,比如从光源视角渲染一次深度得到阴影贴图,或者渲染镜面反射;第二,后处理,先把场景渲染到 FBO 纹理,再画一个铺满屏幕的四边形,用专门的片元着色器二次采样这张纹理,实现模糊、色调映射这类全屏滤镜;第三是 WebGL2 的多渲染目标 MRT,drawBuffers 一次绘制能同时输出多张纹理,比如同时输出颜色、法线、深度,这是延迟渲染管线的基础设施。
-->

---

# WebGL2 新特性总览(必考)

| 特性 | WebGL1 | WebGL2 |
|---|---|---|
| GLSL 版本 | ES 1.00(`attribute`/`gl_FragColor`) | ES 3.00(`in`/`out`) |
| VAO | 扩展 `OES_vertex_array_object` | 原生 `createVertexArray` |
| 实例化绘制 | 扩展 `ANGLE_instanced_arrays` | 原生 `drawArraysInstanced` |
| 多渲染目标 MRT | 扩展 `WEBGL_draw_buffers` | 原生 `drawBuffers` |
| Uniform 缓冲对象 UBO | 无 | `bindBufferBase(UNIFORM_BUFFER,…)` |
| 变换反馈 | 无 | 顶点着色器输出可写回 buffer |
| 非 2 次幂纹理 | 受限(禁 mipmap/REPEAT) | 完全支持 |

<!--
WebGL2 基于 OpenGL ES 3.0,获取方式是 canvas.getContext("webgl2"),能力完全向后兼容——WebGL1 的 API 和常量在 WebGL2 上下文里原样可用。

这张表挑了七个最重要的能力对比。GLSL 版本从 ES 1.00 升到 ES 3.00,关键字改名前面已经讲过。VAO、实例化绘制、多渲染目标,这三个在 WebGL1 时代都得靠扩展——OES_vertex_array_object、ANGLE_instanced_arrays、WEBGL_draw_buffers,WebGL2 里全部转正为核心 API,不用再查扩展是否支持。

UBO 和变换反馈是 WebGL2 全新引入、WebGL1 完全没有的能力,下一页会展开讲。非 2 次幂纹理这条是对 WebGL1 限制的直接松绑,之前踩过的坑到 WebGL2 就不用担心了;另外索引类型上限这条前面绘制调用那页已经提过,WebGL1 默认仅 UNSIGNED_SHORT、WebGL2 原生支持 UNSIGNED_INT。

这张表也是候选人快速判断"这是 WebGL1 还是 WebGL2 特有 API"的备忘单,下一页展开五个核心机制怎么用。
-->

---

# WebGL2 新特性细节:五大核心机制

<v-clicks>

- **VAO**:打包"buffer 绑定 + 属性配置",切换对象只需 `bindVertexArray`
- **UBO**:一次上传一组 uniform,多个 program 可共享同一个 UBO
- **实例化绘制**:`drawArraysInstanced` + `vertexAttribDivisor`,一次画上千个变体
- **MRT**:`drawBuffers()` 一次输出多张纹理,延迟渲染管线的基础
- **变换反馈**:顶点着色器输出写回 buffer,跳过光栅化,用于 GPU 端粒子模拟

</v-clicks>

<!--
展开五个 WebGL2 核心机制,都是从"扩展"转正为"原生 API"或全新能力。

VAO 顶点数组对象:把一整套"哪个 buffer 绑定到哪个 attribute、格式怎样"的状态打包成一个对象,初始化配一次,渲染循环里只需要 bindVertexArray 切换,避免每次重复好几条状态设置调用。

UBO Uniform 缓冲对象:可以把一组 uniform 打包成一块 buffer 一次性上传,减少多次 uniform1f/uniform4fv 调用的开销,而且多个 program 之间能共享同一个 UBO,比如多个材质共用同一份光照参数。

实例化绘制:drawArraysInstanced 或 drawElementsInstanced,配合 vertexAttribDivisor 让某个 attribute 按实例而不是按顶点前进,一次 draw call 就能画出成百上千个变体几何体,是减少 draw call 数量的核心手段,森林、粒子、人群这类场景离不开它。

MRT 多渲染目标:drawBuffers 让片元着色器在一次绘制里同时输出到多张纹理,比如同时输出颜色、法线、深度,这是延迟渲染 deferred shading 管线的基础设施。

变换反馈 Transform Feedback:让顶点着色器的输出直接写回一个 buffer,不经过光栅化和片元阶段,常用来做 GPU 端的粒子系统模拟,避免每帧在 CPU 和 GPU 之间来回传输位置数据。
-->

---

# 性能优化与调试

<v-clicks>

- 减少 **draw call** 是首要目标:合批绘制、实例化替代循环调用
- 减少**状态切换**:纹理/着色器切换有开销,按材质排序;多图打包进 texture atlas
- 顶点着色器能算的不要放片元着色器(执行次数常差几十到几百倍)
- 避免每帧调用 `getError()`/`readPixels()`/`finish()`——CPU-GPU 同步点,极慢
- `getUniformLocation()`/`getAttribLocation()` 应在初始化阶段缓存,不放渲染循环
- 调试:`getShaderInfoLog()`/`getProgramInfoLog()` 看编译错误;Spector.js 逐帧抓调用记录

</v-clicks>

<!--
性能优化第一抓手永远是减少 draw call:能合批就合批,一个 draw call 画多个对象;海量同款物体用实例化替代循环调用,前面刚讲过。

第二是减少状态切换:纹理绑定、着色器切换都有驱动开销,按材质和纹理给绘制顺序排序,减少来回切换;多张小图打包进一张 texture atlas 图集,减少纹理绑定次数。

第三是老生常谈但极重要的一条:顶点着色器能算的东西,绝不要放到片元着色器算,因为片元执行次数常常是顶点的几十到几百倍。

第四,几个函数是 CPU-GPU 同步点,会强制 CPU 等待 GPU 排空当前所有命令——getError、readPixels、finish,渲染循环里高频调用会让本该并行的 CPU/GPU 流水线变成串行,帧率断崖式下跌,只应该在离线排查时偶尔用。类似地,getUniformLocation 和 getAttribLocation 有查表开销,应该在初始化阶段查一次缓存起来,不要每帧重复查询。

调试工具:编译链接失败第一步永远是看 getShaderInfoLog 和 getProgramInfoLog 的报错信息;画面不对但代码看起来没问题,用 Spector.js 这类浏览器扩展逐帧抓取全部 WebGL 调用记录并可视化每一步渲染状态,是排查隐蔽问题的关键工具。
-->

---

# 扩展机制与上下文丢失

```js
canvas.addEventListener("webglcontextlost", (e) => {
  e.preventDefault(); // 阻止默认行为,声明"我要处理恢复"
  // 停止渲染循环
});
canvas.addEventListener("webglcontextrestored", () => {
  // 重新创建全部 buffer/texture/program/framebuffer,再恢复渲染循环
});
```

<v-clicks>

- `getExtension(name)` 返回扩展对象(不支持返回 `null`);`getSupportedExtensions()` 查全部列表
- WebGL1 扩展多数在 WebGL2 转正:`OES_vertex_array_object` → 原生 VAO,`ANGLE_instanced_arrays` → 原生实例化

</v-clicks>

<!--
上下文丢失在真实设备上并不罕见——GPU 驱动崩溃、多标签页显存竞争、移动端切后台被系统回收显存,都会触发。

处理方式:监听 webglcontextlost 事件,一定要调用 preventDefault,这是在告诉浏览器"我要自己处理恢复",不调用的话上下文就不会被恢复;同时停止渲染循环,避免对着失效的上下文疯狂报错。等 webglcontextrestored 事件触发,说明上下文恢复了,但这时候所有的 buffer、texture、program、framebuffer 全部失效了,必须重新创建一遍,再恢复渲染循环。生产级引擎都要求处理这套事件,否则恢复后画面会永久黑屏且没有任何报错提示。

扩展机制:getExtension 传扩展名字符串,支持就返回扩展对象,不支持返回 null,一定要判空,不能假设扩展一定存在;getSupportedExtensions 能查到当前环境全部支持的扩展列表。一个有意思的规律:WebGL1 时代很多常用扩展,到了 WebGL2 直接转正成了核心 API,比如 OES_vertex_array_object 变成原生 VAO,ANGLE_instanced_arrays 变成原生实例化绘制,WEBGL_depth_texture 变成标准化的深度纹理。
-->

---

# 易错点 Top 7

| 坑 | 后果 / 对策 |
|---|---|
| 片元着色器不声明精度 | 编译直接失败,须写 `precision mediump float` |
| 纹理上下颠倒 | `pixelStorei(UNPACK_FLIP_Y_WEBGL, true)` |
| 忘记 `enableVertexAttribArray` | attribute 静默恒为默认值(全黑/顶点重合) |
| 矩阵乘序颠倒 | 物体消失/错位,且通常无报错信息 |
| 深度缓冲区未清除 | `clear()` 忘带 `DEPTH_BUFFER_BIT`,后续帧全被挡 |
| 状态机泄漏 | 切对象前忘重新绑定 buffer/texture/program |
| GPU 资源不释放 | 显存不自动 GC,须显式 `delete*()` |

<!--
七个最高频的坑,快速过一遍,前面几页大多已经单独提过,这里做个汇总备忘(非 2 次幂纹理的坑在纹理那页已经讲过,这里不重复列)。

精度报错和纹理颠倒是入门期最先撞见的两个;忘记 enableVertexAttribArray 和矩阵乘序颠倒,症状都很诡异——前者图形全黑或顶点全部重合到原点,后者物体直接消失且没有任何报错,排查起来最费时间。深度缓冲区未清除是"看起来什么都对但后面物体画不出来"的经典原因。

状态机泄漏是 WebGL 编程模型本身带来的坑——忘记在画下一个对象前重新绑定正确的 buffer、texture、program,导致"改了这个物体,另一个物体也跟着变",这也是为什么 Three.js 这类封装库要花大力气帮你管理绑定状态。

GPU 资源不释放是任何图形 API 都要面对的手动管理显存问题——长时间运行的单页应用如果反复创建销毁 WebGL 场景又不调用 delete 系列方法,显存只增不减,最终会导致上下文丢失。
-->

---

# 选型对比:Canvas 2D / WebGL / Three.js / WebGPU

| 维度 | Canvas 2D | WebGL | Three.js | WebGPU |
|---|---|---|---|---|
| 定位 | 2D 位图 API | 底层光栅化 API | 场景图引擎 | 下一代 GPU API |
| 3D / GPGPU | 均无 | 3D 靠手写,无 GPGPU | 3D 开箱即用,无 GPGPU | 均原生支持 |
| 性能上限 | 千~万级图元 | 万~百万级 | 同 WebGL,多一层调度 | 更高,尤其计算密集 |
| 学习曲线 | 低 | 高 | 中 | 高于 WebGL |
| 何时选它 | 2D 图表/图像 | 极致定制/超小体积 3D | 绝大多数业务 3D 首选 | 计算密集,兜底 WebGL |

<!--
面试常问的选型对比,一张表说清四者关系。

WebGL vs Canvas 2D 是"3D/GPU 光栅化"与"2D 位图绘制"的定位差异,不是竞争关系——很多页面两者并用,图表用 Canvas 2D、背景特效用 WebGL。

WebGL vs Three.js 是"底层 API"与"上层框架"的关系,业务项目几乎不会脱离 Three.js 或 Babylon.js 直接手写 WebGL,除非做引擎本身,或者对包体积、控制粒度有极端要求。

WebGL vs WebGPU 是"现状主力"与"未来标准"的过渡关系。WebGPU 原生对接 Direct3D 12、Metal、Vulkan,提供计算着色器能力,三大浏览器引擎已经在 2025 年内全部完成首发,但截至现在 Baseline 仍处于"Newly available"阶段,离"Widely available"预计还要到 2028 年前后。Three.js 自 r171 起支持 WebGPURenderer 并能自动回退 WebGL2,这正是行业现状——渐进增强,不是替代当天生效,生产项目现阶段普遍两者并存。
-->

---
layout: intro
---

# 总结

WebGL = **浏览器暴露的底层光栅化 API**(基于 OpenGL ES)

- 心智模型:GPU 状态机,只认点/线/三角形,3D 效果全靠着色器算出来
- 管线:顶点着色器 → 光栅化(自动插值)→ 片元着色器 → 深度/混合 → 帧缓冲
- 三件套:attribute(逐顶点)+ uniform(全局)+ varying(插值传递)
- WebGL2:VAO/UBO/实例化/MRT/变换反馈原生化,完全向后兼容 WebGL1
- 选型:业务 3D 首选 Three.js,极致定制才手写 WebGL;WebGPU 渐进增强中

<div class="text-sm mt-6 op-60">

延伸阅读:MDN WebGL_API · webglfundamentals.org · webgl2fundamentals.org

</div>

<!--
总结一下。

WebGL 是浏览器暴露的底层光栅化 API,基于 OpenGL ES。核心心智模型是把它当成一台只认点、线、三角形的 GPU 状态机,3D 效果不管是透视、光照还是动画,全部靠开发者写的着色器算出来,WebGL 本身不理解"3D"这个概念。

渲染管线固定不可跳步:顶点着色器逐顶点执行,光栅化阶段自动做重心插值,片元着色器逐片元上色,再经过深度和混合测试写入帧缓冲。CPU 往 GPU 传数据靠三件套:attribute 逐顶点变化,uniform 全局不变,varying 在顶点和片元着色器之间插值传递。

WebGL2 把 VAO、UBO、实例化绘制、多渲染目标、变换反馈这些 WebGL1 时代要么没有要么靠扩展的能力全部原生化,而且完全向后兼容 WebGL1 的代码。

选型上,绝大多数业务 3D 需求应该直接用 Three.js 这类封装库,只有做引擎本身或者对体积、控制粒度有极端要求时才手写 WebGL;WebGPU 是面向未来的下一代标准,现阶段是渐进增强、和 WebGL 共存的过渡姿态。今天就到这里,谢谢大家。
-->
