---
theme: seriph
background: https://cover.sli.dev
title: NLTK 教学 NLP 指南
info: |
  NLTK 教学 NLP 指南：word_tokenize · pos_tag · WordNetLemmatizer · FreqDist · NaiveBayesClassifier

  Learn more at [https://www.nltk.org/](https://www.nltk.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## NLTK

学术教学型 NLP 库 · 函数式接口 · 3.9.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
NLTK 以「函数式 + 丰富语料」成为 NLP 教学事实标准。
-->

---
transition: fade-out
---

# NLTK 是什么

Bird/Klein/Loper 编写的教学型 NLP 库（Apache 2.0）

- **函数式接口**：`word_tokenize`/`pos_tag` 一函数一任务
- **算法透明**：词干/贝叶斯可逐行读，是教学首选
- **语料极丰富**：内置 Gutenberg/Brown/Reuters/WordNet
- **词干/词形齐全**：Porter/Lancaster/Snowball/WordNet
- **WordNet 深度集成**：synsets/hypernyms 同义层级
- **朴素贝叶斯教学友好**：featureset 字典式分类

> 当前稳定版 **3.9.x**，Python 3.9–3.13

<!--
NLTK 三件套：函数式接口 + 丰富语料 + 算法透明。
-->

---
layout: two-cols
---

# 第一个例子

```python
import nltk
nltk.download("punkt", quiet=True)

text = "NLTK is a leading platform."
tokens = nltk.word_tokenize(text)   # ['NLTK', 'is', ...]

tagged = nltk.pos_tag(tokens)
# [('NLTK', 'NNP'), ('is', 'VBZ'), ...]
```

::right::

# 下载数据

```python
import nltk

nltk.download("punkt")              # 分词
nltk.download("averaged_perceptron_tagger_eng")
nltk.download("stopwords")          # 停用词
nltk.download("wordnet")            # WordNet
nltk.download("omw-1.4")            # 多语言
```

> 首次报 `Resource not found` 就 `nltk.download("名字")`

<!--
铁律：缺数据就 download，CI 里写死列表。
-->

---

# 句子切分与词性标注

```python
import nltk
text = "Hello world. This is a test."

sents = nltk.sent_tokenize(text)   # 句级切分
# ['Hello world.', 'This is a test.']

tagged = nltk.pos_tag(nltk.word_tokenize(text))
# [('Hello', 'NNP'), ('world', 'NN'), ('.', '.'), ...]
```

**常见 Penn Treebank 标签**

| 标签 | 含义 | 标签 | 含义 |
|------|------|------|------|
| NN | 名词 | VB/VBD | 动词 |
| JJ | 形容词 | RB | 副词 |

> `pos_tag` 输出 Penn Treebank 标签集

<!--
punkt 处理缩写，pos_tag 出 Penn Treebank。
-->

---
layout: two-cols
---

# 词干提取

规则粗暴去词缀，结果可能非真词

```python
from nltk.stem import PorterStemmer

porter = PorterStemmer()
print(porter.stem("running"))     # run
print(porter.stem("happiness"))   # happi（非真词）
```

三种选择：Porter 温和 / Lancaster 激进 / Snowball 多语言

::right::

# 词形还原

WordNetLemmatizer 结果必为真词

```python
from nltk.stem import WordNetLemmatizer
wnl = WordNetLemmatizer()

wnl.lemmatize("dogs")              # dog
wnl.lemmatize("running")           # running（没还原）
wnl.lemmatize("running", pos="v")  # run（传 pos 才对）
```

> 动词/形容词**必须传 pos**，默认只还原名词

<!--
词干粗暴可能非真词，词形还原需传 pos。
-->

---

# WordNetLemmatizer 与 POS 映射

实际工程常把 `pos_tag` 的输出映射成 WordNet 词性

```python
def get_wordnet_pos(treebank_tag):
    if treebank_tag.startswith("J"):  return "a"
    elif treebank_tag.startswith("V"): return "v"
    elif treebank_tag.startswith("N"): return "n"
    elif treebank_tag.startswith("R"): return "r"
    else:                              return "n"   # 默认名词
```

**Penn Treebank → WordNet 词性**

| 前缀 | WordNet | 含义 |
|------|---------|------|
| J (JJ/JJS) | a | 形容词 |
| V (VB/VBD) | v | 动词 |
| N (NN/NNS) | n | 名词 |

> 不传 pos 等于只还原名词复数

<!--
先 pos_tag 再映射词性，才能正确还原。
-->

---
layout: two-cols
---

# 频率统计 FreqDist

```python
from nltk.probability import FreqDist

tokens = nltk.word_tokenize("the cat sat on the mat the cat")
fdist = FreqDist(tokens)

print(fdist["the"])           # 3
print(fdist.most_common(3))   # top 词
print(fdist.hapaxes())        # 只出现一次
```

::right::

# 停用词与 WordNet

```python
from nltk.corpus import stopwords, wordnet

stop_en = set(stopwords.words("english"))
tokens = [w for w in tokens if w.lower() not in stop_en]

syn = wordnet.synsets("motorcar")   # 同义词集
print(syn[0].lemma_names())         # ['car', 'auto', 'motorcar']
```

> stopwords 过滤虚词，wordnet 查同义词

<!--
FreqDist 统计，stopwords/wordnet 处理语义。
-->

---

# 朴素贝叶斯分类

```python
from nltk.classify import NaiveBayesClassifier

def feats(words):  # 词袋特征
    return {w: True for w in words}

train_set = [(feats(["good"]), "pos"), (feats(["bad"]), "neg")]
clf = NaiveBayesClassifier.train(train_set)
clf.classify(feats(["good"]))   # 'pos'
```

**要点**

- 特征是 `{name: True/数值}` 字典，决定分类上限
- 文本常用词袋 / TF-IDF / 词长
- `show_most_informative_features` 看判别力
- `nltk.classify.accuracy(clf, test_set)` 评估

> 生产情感分类通常改用 sklearn/transformers

<!--
NLTK 的贝叶斯接口简单，适合讲分类原理。
-->

---
layout: two-cols
---

# 语料库访问

```python
from nltk.corpus import gutenberg
emma = gutenberg.words("austen-emma.txt")
sents = gutenberg.sents("austen-emma.txt")
raw = gutenberg.raw("austen-emma.txt")

fdist = nltk.FreqDist(
    w.lower() for w in emma if w.isalpha())
print(fdist.most_common(10))
```

统一 `.words()`/`.sents()`/`.raw()` 接口

::right::

# 常用语料

| 语料 | 内容 |
|------|------|
| gutenberg | 经典文学 |
| brown | 按体裁分类 |
| reuters | 新闻分类 |
| inaugural | 总统就职演说 |
| wordnet | 同义词典 |

> 内置 50+ 语料，无需自备数据

<!--
gutenberg/brown/reuters 是教学常用语料。
-->

---

# 陷阱与最佳实践

- **首次报 Resource not found**：按提示 `nltk.download("名字")`
- **Lemmatizer 不传 pos**：动词/形容词不还原，先 pos_tag 再映射
- **3.9.x 数据包改名**：punkt 拆 punkt_tab、tagger 拆 _eng
- **Lancaster 过度切词**：激进结果常非真词，生产慎用
- **pos_tag 精度有限**：复杂文本不如 spaCy，要高精度换工具
- **大规模批处理慢**：纯 Python，百万级用 spaCy/HuggingFace

> 缺数据就 download，缺还原就传 pos——两大常坑

<!--
NLTK 的两大坑：缺数据和 Lemmatizer 没传 pos。
-->

---

# NLTK vs spaCy

| 维度 | NLTK | spaCy |
|------|------|------|
| **定位** | 教学 / 学术 | 工业 / 生产 |
| **调用** | 函数式逐个调 | 管线 `nlp(text)` |
| **速度** | 纯 Python 慢 | Cython 加速快 |
| **算法透明** | ✅ 可逐行读 | 模型当黑盒 |
| **语料** | 50+ 内置 | 训练管线包 |

> 教学 / 原型用 NLTK，生产用 spaCy

<!--
NLTK 重教学算法，spaCy 重工业管线。
-->

---
layout: center
class: text-center
---

# 小结

NLTK = 函数式接口 + 丰富语料 + 算法透明

**word_tokenize · pos_tag · WordNetLemmatizer · FreqDist**

[NLTK 文档](https://www.nltk.org/) · [GitHub](https://github.com/nltk/nltk)

<!--
NLTK 是 NLP 入门教学的事实标准。
-->
