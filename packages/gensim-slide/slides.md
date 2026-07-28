---
theme: seriph
background: https://cover.sli.dev
title: Gensim 词向量与主题模型指南
info: |
  Gensim 词向量与主题模型指南：Word2Vec · KeyedVectors · FastText 子词 · LDA/LSI 主题模型 · 流式语料

  Learn more at [https://radimrehurek.com/gensim/](https://radimrehurek.com/gensim/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Gensim

主题模型与词向量库 · 流式大语料 · 4.4.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Gensim 以「流式 + 向量空间」专攻无监督语义建模。
-->

---
transition: fade-out
---

# Gensim 是什么

Radim Řehůřek 创建的词向量与主题模型库（LGPL-2.1）

- **流式处理大语料**：模型接受迭代器，内存恒定
- **词向量工业实现**：Word2Vec / FastText 原生多线程
- **KeyedVectors 语义查询**：most_similar / 类比
- **主题模型齐全**：TF-IDF / LSI / LDA 一条管线
- **FastText 解决未登录词**：子词 n-gram 合成向量
- **无监督无需标注**：直接喂原始文本流

> 当前稳定版 **4.4.0**，Python 3.8+

<!--
Gensim 核心是「流式 + 向量 + 主题模型」。
-->

---
layout: two-cols
---

# 词袋两件套

```python
from gensim import corpora

texts = [["human", "computer"], ["survey", "user", "computer"]]

dictionary = corpora.Dictionary(texts)
corpus = [dictionary.doc2bow(t) for t in texts]
print(corpus[0])   # [(0, 1), (1, 1)]  id=0 出现 1 次
```

Dictionary 管「词↔id」映射

::right::

# 核心抽象

```
Document（文档）
   ↓
Corpus（语料，可流式）
   ↓
Vector（向量）
   ↓
Model（变换模型）
```

每文档一个 `[(id, count), ...]` 列表

> 语料是迭代器，按需逐文档读取

<!--
Dictionary 建 id，doc2bow 转稀疏词袋。
-->

---

# 训练 Word2Vec

```python
from gensim.models import Word2Vec

sentences = [["human", "computer"], ["dog", "barks"]]
model = Word2Vec(sentences=sentences,
    sg=1,            # 1=Skip-gram，0=CBOW
    vector_size=100, window=5,  # 维度 / 窗口
    min_count=1, epochs=10, workers=4)
```

> sg=0 CBOW（大语料快）/ sg=1 Skip-gram（小语料好）

<!--
sg 选 CBOW 或 Skip-gram，调 4 个核心参数。
-->

---

# Word2Vec 核心参数

| 参数 | 含义 | 典型值 |
|------|------|--------|
| `sg` | 0=CBOW，1=Skip-gram | 小语料 1，大 0 |
| `vector_size` | 词向量维度 | 100–300 |
| `window` | 上下文窗口 | 5 |
| `min_count` | 忽略低频词 | 5 |
| `epochs` | 训练轮数 | 5–15 |

> 小窗口偏句法、大窗口偏主题语义

<!--
vector_size/window/min_count/epochs 是调参重点。
-->

---
layout: two-cols
---

# KeyedVectors 语义查询

训练好的向量存在 `model.wv`

```python
kv = model.wv

kv["king"]                         # 取向量
kv.most_similar("king", topn=5)    # 最相似词
kv.similarity("king", "queen")     # 相似度
kv.doesnt_match(["k","q","apple"]) # 找不同类
```

::right::

# 经典词类类比

```python
kv.most_similar(
    positive=["king", "woman"],
    negative=["man"],
)
# 经典结果接近
# [('queen', 0.7...), ...]
```

**向量运算**

```python
vec = kv["king"] - kv["man"] + kv["woman"]
```

> KeyedVectors 可脱离模型单独保存

<!--
king-man+woman≈queen 经典类比出自这里。
-->

---
layout: two-cols
---

# FastText 子词向量

为未登录词合成向量，弥补 Word2Vec 硬伤

```python
from gensim.models import FastText

model = FastText(sentences,
    vector_size=100, min_count=1,
    min_n=3, max_n=6,  # 子词 n-gram
    epochs=10)

model.wv["runnable_unseen"]   # 不报错
```

::right::

# Doc2Vec 文档向量

```python
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

docs = [TaggedDocument(words=t, tags=[f"D{i}"])
        for i, t in enumerate(texts)]
model = Doc2Vec(docs, vector_size=100, epochs=40, dm=1)

vec = model.infer_vector(["new", "doc"], epochs=50)
```

> dm=1 PV-DM / dm=0 PV-DBOW

<!--
FastText 靠子词合成 OOV，Doc2Vec 出文档向量。
-->

---

# 主题模型管线

```python
from gensim import models

tfidf = models.TfidfModel(corpus)            # 词袋→加权
corpus_tfidf = tfidf[corpus]
lsi = models.LsiModel(corpus_tfidf,          # 降维到 50 维
    id2word=dictionary, num_topics=50)
lda = models.LdaModel(corpus, num_topics=10, passes=20)  # 主题分布
```

> 管线可串接：词袋 → TF-IDF → LSI/LDA

<!--
每步模型包装语料返回新语料，可串接。
-->

---

# 流式处理大语料

Gensim 的核心优势——语料逐文档 yield，内存恒定

```python
from gensim import utils
from gensim.models import Word2Vec

class MyCorpus:  # 实现 __iter__，逐文档 yield
    def __iter__(self):
        for line in open("large.txt", encoding="utf-8"):
            yield utils.simple_preprocess(line)  # 小写去标点
model = Word2Vec(MyCorpus(), vector_size=100, workers=8)
```

> 不管文件多大，内存每次只留一行

<!--
类实现 __iter__ 逐文档 yield，是流式精髓。
-->

---

# 陷阱与最佳实践

- **整语料读成 list**：违背流式设计，大语料爆内存，用 `__iter__`
- **workers 大却没装 Cython**：GIL 限制单核，训练极慢
- **Word2Vec 取未登录词**：报 KeyError，用 FastText 或调小 `min_count`
- **infer_vector 不稳定**：固定 alpha 与 epochs、多次取平均
- **LDA 主题数乱定**：用 CoherenceModel 评估，别拍脑袋
- **中文不分词就喂**：中文需先 jieba 分词，字符级无意义

> 流式用 `__iter__`，未登录词用 FastText

<!--
两大坑：违背流式设计、未登录词 KeyError。
-->

---

# 4.0 迁移要点

| 3.x | 4.x |
|-----|-----|
| `Word2Vec(size=)` | `Word2Vec(vector_size=)` |
| `model["king"]` | `model.wv["king"]` |
| `model.most_similar(...)` | `model.wv.most_similar(...)` |
| 训练状态含向量 | 向量分离，注意存 wv |

> 4.0 大量重命名，老代码迁移需逐行改

<!--
size→vector_size、model→model.wv 是 4.0 主要改动。
-->

---
layout: center
class: text-center
---

# 小结

Gensim = 流式语料 + 词向量 + 主题模型

**Word2Vec · KeyedVectors · FastText · LDA/LSI**

[Gensim 文档](https://radimrehurek.com/gensim/) · [GitHub](https://github.com/piskvorky/gensim)

<!--
Gensim 专攻无监督语义建模，流式是灵魂。
-->
