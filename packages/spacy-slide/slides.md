---
theme: seriph
background: https://cover.sli.dev
title: spaCy 工业级 NLP 指南
info: |
  spaCy 工业级 NLP 指南：nlp(text) 管线 · Doc/Span/Token · 属性下划线 · Matcher 规则匹配 · spacy-transformers

  Learn more at [https://spacy.io/usage](https://spacy.io/usage)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## spaCy

工业级 NLP 管线 · Cython 加速 · 3.8.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
spaCy 以「管线 + Cython」成为工业级 NLP 事实标准。
-->

---
transition: fade-out
---

# spaCy 是什么

Explosion 维护的工业级开源 NLP 库（MIT）

- **管线化设计**：`nlp(text)` 一次跑全套标注
- **Cython 加速**：核心编译，速度远超纯 Python
- **三层对象**：Doc / Span / Token 绑定原文与标注
- **官方模型广**：20+ 语言开箱即用管线包
- **Transformer 集成**：spacy-transformers 接入 BERT
- **规则匹配**：Matcher + PhraseMatcher 信息抽取

> 当前稳定版 **3.8.x**，CPython 3.7+

<!--
spaCy 核心是「管线 + 对象 + 训练模型」三件套。
-->

---
layout: two-cols
---

# 第一个例子

```python
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple is buying a U.K. startup")

# 词性 + 词形还原
for token in doc:
    print(token.text, token.pos_, token.lemma_)
```

**铁律**：直接传原文 `nlp(text)`

::right::

# 三层对象

```python
doc = nlp("I like red apples")

token = doc[3]      # apples
token.pos_          # 'NOUN'
token.lemma_        # 'apple'

span = doc[2:4]     # "red apples"
doc.ents            # 实体 Span 列表（len=4）
```

> Doc 整篇 / Span 连续切片 / Token 单词

<!--
Doc/Span/Token 三层，下划线取可读字符串。
-->

---

# 属性后缀规则

spaCy 把字符串编码成 hash 存储以省内存

| 写法 | 返回 | 示例 |
|------|------|------|
| `token.pos` | hash（int） | `95` |
| `token.pos_` | 可读字符串 | `'NOUN'` |
| `token.dep_` | 可读字符串 | `'nsubj'` |
| `token.lemma_` | 可读字符串 | `'apple'` |

> 给人看的可读值**末尾加下划线**，新手第一坑

<!--
pos 是 hash，pos_ 是字符串，记牢下划线。
-->

---

# 处理管线（Pipeline）

`nlp(text)` 先 tokenize 再流经各组件

```python
nlp = spacy.load("en_core_web_sm")
print(nlp.pipe_names)
# ['tagger', 'parser', 'ner', 'lemmatizer']

# 加载时排除 / 临时禁用
nlp = spacy.load("en_core_web_sm", disable=["ner"])
with nlp.select_pipes(disable=["parser", "ner"]):
    doc = nlp(text)   # 只跑 tagger
```

> tokenizer 是固定第一步，不可替换、不在 pipe_names

<!--
管线组件可插拔，禁用提速是生产常用技巧。
-->

---
layout: two-cols
---

# 词性与依存

```python
doc = nlp("Autonomous cars shift liability")

for token in doc:
    print(token.text, token.pos_)
    print(token.dep_, token.head.text)
# cars NOUN / nsubj shift
# shift VERB / ROOT shift
```

`pos_` 词性、`dep_` 依存、`head` 支配词

::right::

# 可视化

```python
from spacy import displacy

doc = nlp("Apple bought a U.K. startup")
# 实体高亮 / 依存树（Jupyter 内）
displacy.render(doc, style="ent", jupyter=True)
displacy.render(doc, style="dep", jupyter=True)
```

> displacy 一行出依存树 / 实体图

<!--
pos_ 词性、dep_ 依存、head 支配词。
-->

---

# 命名实体识别（NER）

```python
doc = nlp("Apple buys a U.K. startup for $1 billion")

for ent in doc.ents:
    print(ent.text, ent.label_)
# Apple ORG / U.K. GPE / $1 billion MONEY

spacy.explain("GPE")   # 'Countries, cities, states'
```

**常见实体类型**

| 标签 | 含义 | 标签 | 含义 |
|------|------|------|------|
| PERSON | 人名 | GPE | 国家/城市 |
| ORG | 机构 | DATE | 日期 |
| MONEY | 金额 | PRODUCT | 产品 |

> `spacy.explain("ORG")` 一行查标签含义

<!--
doc.ents 是 Span 列表，ent.label_ 是类型。
-->

---
layout: two-cols
---

# Matcher 模式匹配

```python
from spacy.matcher import Matcher

matcher = Matcher(nlp.vocab)
pattern = [{"LOWER": "hello"},
           {"IS_PUNCT": True, "OP": "?"},
           {"LOWER": "world"}]
matcher.add("HW", [pattern])   # (id, start, end)
```

OP 量词：`?` / `+` / `*` / `!`

::right::

# PhraseMatcher 术语表

```python
from spacy.matcher import PhraseMatcher

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
# 用 make_doc 省 pipeline，别用 nlp()
patterns = [nlp.make_doc("Apple"),
            nlp.make_doc("Google")]
matcher.add("TECH", patterns)
```

> 模式用 `nlp.make_doc` 只分词，跑全管线慢几十倍

<!--
Matcher 用模式，PhraseMatcher 用词表。
-->

---
layout: two-cols
---

# 自定义组件

```python
from spacy.language import Language

@Language.component("print_len")
def print_len(doc):
    print(f"Doc length: {len(doc)}")
    return doc   # 必须返回 Doc

nlp.add_pipe("print_len", last=True)
```

组件**接收 Doc、返回 Doc**

::right::

# 批量处理

```python
texts = ["doc one.", "doc two.", "doc three."]

# nlp.pipe 比循环 nlp(t) 快得多
docs = list(nlp.pipe(texts, batch_size=100, n_process=4))

# 只需分词用空管线
nlp = spacy.blank("en")
```

> 批处理用 `nlp.pipe`，可快数倍且多进程

<!--
组件收 Doc 返 Doc，批处理用 nlp.pipe。
-->

---
layout: two-cols
---

# Transformer 管线

spacy-transformers 把 BERT 接入管线

```bash
pip install "spacy[transformers]"
python -m spacy download en_core_web_trf
```

```python
nlp = spacy.load("en_core_web_trf")
doc = nlp("Apple bought a startup")
# 下游 tagger/ner 共享上下文向量
```

trf 精度高但慢、占资源

::right::

# 中文处理

```python
nlp = spacy.load("zh_core_web_sm")
doc = nlp("我爱北京天安门")

for token in doc:
    print(token.text, token.pos_)   # 我 PRON / 爱 VERB

for ent in doc.ents:   # 北京 GPE / 天安门 FAC
    print(ent.text, ent.label_)
```

> 中文分词依赖模型，精度不如英文

<!--
trf 精度高，中文需对应中文管线模型。
-->

---

# 陷阱与最佳实践

- **忘加下划线**：`token.pos` 给 hash，`pos_` 才是字符串
- **自己分词再喂**：tokenizer 是固定第一步，直接传 `nlp(text)`
- **PhraseMatcher 用 `nlp()`**：改用 `nlp.make_doc` 只分词，省几十倍
- **循环 `nlp(t)` 而非 `nlp.pipe`**：批处理用 pipe，支持多进程
- **加载大模型跑简单任务**：只需分词用 `spacy.blank("en")`
- **训练后忘留 config**：config.cfg 是复现训练的钥匙

> 可读属性一律末尾加下划线——新手第一坑

<!--
六大陷阱里，下划线和 pipe 最常踩。
-->

---

# spaCy vs NLTK

| 维度 | spaCy | NLTK |
|------|------|------|
| **定位** | 工业 / 生产 | 教学 / 学术 |
| **调用** | 管线 `nlp(text)` | 函数式逐个调 |
| **速度** | Cython 加速快 | 纯 Python 慢 |
| **Transformer** | 原生集成 | 无 |

> 生产用 spaCy，教学 / 语料分析用 NLTK

<!--
两者互补：spaCy 重生产，NLTK 重教学。
-->

---
layout: center
class: text-center
---

# 小结

spaCy = 管线 + Doc/Span/Token + 训练模型

**Cython 加速 · nlp(text) 一行 · 可插拔组件 · Transformer**

[spaCy 文档](https://spacy.io/usage) · [GitHub](https://github.com/explosion/spaCy)

<!--
spaCy = 管线 + 对象 + 模型，工业级 NLP。
-->
