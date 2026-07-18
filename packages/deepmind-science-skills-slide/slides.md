---
theme: seriph
background: https://cover.sli.dev
title: Google DeepMind Science Skills
info: |
  Google DeepMind 官方科研 agent 技能集：38 个 skill，覆盖结构生物学、
  基因组、化学药物、文献检索、序列分析、分子可视化。
  google-deepmind/science-skills（Apache-2.0）。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Google DeepMind Science Skills

DeepMind 官方科研技能集——**38 skill** · 6 大领域 · Apache-2.0

<div class="pt-6 opacity-80">
AlphaFold · AlphaGenome · Foldseek · gnomAD · arXiv · PyMOL
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/google-deepmind/science-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
DeepMind 官方出品的科研 agent 技能集，38 个 skill 覆盖六大领域，软件 Apache-2.0 开源，调用的各数据库许可独立。
-->

---
transition: fade-out
---

# 定位：DeepMind 官方科研技能集

不是通用 prompt，是 DeepMind 科研团队沉淀

<v-clicks>

- **出品**：Google DeepMind 官方，配套 Google Antigravity 集成
- **38 个 skill**：结构生物学、基因组、化学药物、文献检索、序列分析、分子可视化
- **格式**：agentskills.io 开放格式（SKILL.md + scripts/ + references/）
- **许可**：软件 Apache-2.0；CC-BY 4.0 文档；**各数据库许可异**
- **依赖**：`uv` 包管理器（首次自动装）；AlphaGenome/OpenAlex 必须 API key

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

不是 AlphaFold 模型推理，是数据库与 API 查询 + 分析

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
官方沉淀、38 skill、Apache-2.0、各数据库许可独立。注意这是查数据库与分析，不是在本地跑 AlphaFold 推理。
-->

---
transition: fade-out
---

# 安装与前置

一条命令 + 一次性依赖

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

**装**

```bash
# 通用 CLI
npx skills add \
  google-deepmind/science-skills

# 或 Antigravity
# Build with Google 勾选 Science
```

</div>
<div v-click>

**前置**

- `uv` 包管理器（首次自动装，约 10s）
- `ALPHAGENOME_API_KEY`（必须）
- `OPENALEX_API_KEY`（必须）
- ClinVar 等有 key 提速率

```bash
echo "ALPHAGENOME_API_KEY=xxx" >> ~/.env
```

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

所有 Python 脚本经 `uv run`，自动隔离依赖；首次用某 skill 在 `.licenses/` 落 LICENSE 提醒。

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两条途径：skills.sh CLI 或 Antigravity 内。前置是 uv 和部分 API key。所有脚本走 uv run，首次会落 LICENSE 提醒。
-->

---
transition: fade-out
---

# 38 skill 分 6 大领域

<div class="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm">

<div>

**结构生物学（4）**
- alphafold-db / foldseek / pdb / uniprot

**基因组学（9）**
- alphagenome（key）· clinvar · gnomad · dbsnp
- jaspar · encode-ccres · gtex · ensembl · ucsc

**化学与药物（3）**
- chembl · pubchem · openfda

</div>
<div v-click>

**文献检索（5）**
- arxiv · biorxiv · europepmc · openalex · pubmed

**序列分析（3）**
- ncbi-fetch · msa · similarity-search

**其它（14）**
- interpro · quickgo · reactome · string · unibind
- human-protein-atlas · embl-ebi-ols
- opentargets · clinical-trials
- pymol · uv · credentials · workflow-creator · predictingthepast

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
38 个 skill 按六大领域分：结构生物学 4 个、基因组 9 个、化学药物 3 个、文献 5 个、序列 3 个，其余 14 个是注释/通路/靶点/工具。
-->

---
transition: fade-out
---

# 结构生物学：AlphaFold 流程

给 UniProt ID → 自动分析

```text
输入：UniProt ID（如 P00520）
   ↓ fetch_structure.py
mmCIF 结构 + PAE 矩阵 + metadata JSON
   ↓ analyze_plddt.py
全局 pLDDT 置信评估（structured/disordered/mixed）
   ↓ analyze_pae.py
滑动窗口 PAE → 刚性域边界检测
   ↓
输出：折叠置信 + 无序区 + 域布局
```

<div v-click class="mt-3 text-sm">

**关键规则**：只收 UniProt ID；大蛋白（>2700 AA）触发 fragment fallback，必 relay `[!] WARNING`；想找结构同源用 **Foldseek**，实验结构用 **pdb_database**。

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
alphafold_database_fetch_and_analyze 是结构生物学入口。三步脚本：拉结构、分析 pLDDT、分析 PAE。只接 UniProt ID，大蛋白会警告，结构同源去找 Foldseek。
-->

---
transition: fade-out
---

# AlphaFold 输出怎么读

pLDDT 分级 + 域边界

| pLDDT | 含义 | 处置 |
| --- | --- | --- |
| > 90 | Very High（骨架精准） | 可信 dock/比对 |
| 70–90 | High（骨架可信） | 一般可信 |
| 50–70 | Low（慎用） | 局部参考 |
| < 50 | Very Low（无序） | **别**做下游分析 |

<v-clicks>

- **域边界**：PAE 滑窗自动判「刚性段 vs 柔性连接」
- **无序警告**：< 50 占比高 → 警告用户别整段做 docking
- **B-factor 列** = 每残基 pLDDT（mmCIF 内嵌）

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
pLDDT 四级：Very High/High/Low/Very Low。<50 视为无序，不能整段做下游结构分析。PAE 矩阵用于检测刚性域边界。
-->

---
transition: fade-out
---

# 基因组：AlphaGenome 变异工作流

非编码变异 → 调控影响

<v-clicks>

- 输入：`chr2:1234:A>C` 变异
- 输出：对 RNA-seq 表达、DNASE、ChIP、TF 结合的影响
- **必 API key**：`ALPHAGENOME_API_KEY`
- **必 `uv run`**：禁裸 `python3`/`python3 -c`
- **离线基因查找**：本地 GTF `lookup_gene_info.py`，禁外部 MyGene/Ensembl REST

</v-clicks>

<div v-click class="mt-3 text-sm">

**两阶段发现**：先 `score_variant` 跨差分 scorer 广撒发现意外组织效应 → 按疾病关键词（如 `liver`）筛 → 用 `predict_variant` 加 ontology 深入。

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AlphaGenome 分析非编码变异对调控的影响。必须 key、必须 uv run、必须离线查基因。两阶段：先 score_variant 广撒、再聚焦。
-->

---
transition: fade-out
---

# AlphaGenome 代码骨架

差分 scorer 广撒发现

```python
from alphagenome.models import dna_client, variant_scorers
from alphagenome.data import genome
import os, dotenv

dotenv.load_dotenv(os.path.expanduser('~/.env'))
dna_model = dna_client.create(
    api_key=os.environ['ALPHAGENOME_API_KEY'],
    address='dns:///gdmscience.googleapis.com:443')

variant = genome.Variant('chr2', 1234, 'A', 'C')
scorers = [variant_scorers.RECOMMENDED_VARIANT_SCORERS[m]
           for m in variant_scorers.RECOMMENDED_VARIANT_SCORERS
           if 'ACTIVE' not in m and 'CAGE' not in m]
scores = dna_model.score_variant(interval=interval, variant=variant,
                                 variant_scorers=scorers)
```

<div v-click class="mt-2 text-center text-sm opacity-80">

→ `tidy_scores` → `quantile_score > 0.995` → 排序看 top hits

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
代码骨架：建 client、定义 variant、选差分 scorer、score_variant、用 tidy_scores 整理、按 quantile_score 筛 top hits。
-->

---
transition: fade-out
---

# 化学与药物：3 库联动

药物再利用工作流

<div class="grid grid-cols-3 gap-4 mt-3 text-sm">
<div v-click>

**ChEMBL**

药物活性化合物
靶点、IC50、Ki

</div>
<div v-click>

**PubChem**

化合物结构与性质
CID、SMILES、LogP

</div>
<div v-click>

**openFDA**

不良反应、召回
药品标签、审批

</div>
</div>

<v-clicks>

- 配 `clinical_trials_database` 看试验进度
- 配 `opentargets_database` 找靶点-疾病关联
- 串起「靶点 → 化合物 → 临床 → 不良反应」全链

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
化学药物三库：ChEMBL 活性、PubChem 结构、openFDA 不良反应。配 clinical-trials 和 opentargets 串成药物再利用链。
-->

---
transition: fade-out
---

# 文献检索：arXiv 的硬规则

rate-limit + 安全解压

<v-clicks>

- **节流**：≤ 1 req / 3s，脚本自动 enforce
- **批量**：先写文件再解析（>100 条 JSON 撑爆 context）
- **下载**：PDF / HTML / LaTeX 源码（tar.gz）三种

</v-clicks>

<div v-click class="mt-3">

**LaTeX 源码必须安全解压**：

```bash
# ❌ 禁止直接在工作目录解压
tar -xzf source.tar.gz

# ✅ 必须解到独立目录
mkdir paper_source && \
  tar -xzf source.tar.gz -C paper_source
```

</div>

<div v-click class="mt-2 text-sm opacity-80">

另 4 个来源：bioRxiv、Europe PMC、OpenAlex（需 key）、PubMed

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
arXiv 严格 1 req/3s。大批结果先写文件。LaTeX 源码必须解到独立目录，否则污染工作区。另有 bioRxiv、Europe PMC、OpenAlex、PubMed。
-->

---
transition: fade-out
---

# PyMOL 渲染：OSMesa 软渲染

无 GPU 也能出图

<v-clicks>

- **OSMesa 软件渲染**，无需 GPU/Display/X server
- **必设** `PYOPENGL_PLATFORM=osmesa`
- **用 `cmd.png()`**，禁 `cmd.ray()` / `cmd.draw()`
- **必带 init 样板**：`finish_launching()` 后才 `from pymol import cmd`
- **同时输出 `.pse` session**，方便本地继续调
- **必调 `cmd.quit()`**，否则进程卡死
- **加载后校验**：`cmd.count_atoms("all")` 为 0 立即退出

</v-clicks>

<div v-click class="mt-2 text-sm opacity-80">

14+ recipe：cartoon、surface、静电、B-factor/pLDDT 着色、距离、对齐 RMSD、配体互作、诱变。

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
PyMOL 用 OSMesa 软件渲染。必须设环境变量、用 cmd.png、带 init 样板、同时输出 .pse、必 quit、加载后校验原子数。
-->

---
transition: fade-out
---

# 工作流编排：靶点 → 药物

多 skill 串成端到端

```text
opentargets_database        # 找疾病相关靶点
        ↓
alphafold-db-fetch-analyze  # 看靶点蛋白结构
        ↓
pymol                       # 渲染口袋、找活性残基
        ↓
chembl / pubchem            # 找已知配体
        ↓
openfda                     # 查不良反应
        ↓
clinical-trials             # 看试验进度
```

<div v-click class="mt-2 text-center text-sm opacity-80">

`workflow_skill_creator` 可把多步流程固化成自定义 skill

</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
六个 skill 串成靶点到药物的完整流程。workflow_skill_creator 可把这种流程固化成自定义 skill。
-->

---
transition: fade-out
---

# 反模式与边界

这些坑要避开

<div class="grid grid-cols-2 gap-6 mt-2 text-sm">
<div>

**反模式**

- 裸 `python3`（系统 Python 缺依赖）
- 直接调数据库 API（绕过 rate-limit）
- 手硬编码 API key
- 改 Antigravity plugin 目录文件
- 拿无序区蛋白做 docking
- PyMOL 用 `cmd.ray()`
- 忽略 `.licenses/` 落盘

</div>
<div v-click>

**边界**

- **软件 Apache-2.0 ≠ 数据自由**——各库许可异
- **AlphaGenome 必须有 API key**
- **不能跑模型推理**——只查 DB/API
- **arXiv 严格节流**，大批量慢拉
- **大表面渲染占内存**，超 500MB 放宽 `--max_output_mb`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式和边界：禁裸 python、禁绕脚本、禁硬编码 key；软件 Apache 不等于数据自由；AlphaGenome 必须 key；只查 DB 不跑推理。
-->

---
layout: center
class: text-center
---

# 一句话记住

**DeepMind 官方 38 科研 skill：AlphaFold/AlphaGenome 查结构变异、6 领域数据库齐全、`uv run` 统一隔离、各数据库许可各自合规。**

<div class="mt-6 opacity-80">

官方沉淀 · 38 skill · 6 领域 · Apache-2.0 · 数据许可异

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/google-deepmind/science-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://antigravity.google/use-cases/science" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #1a73e8 10%, #34a853 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。DeepMind 官方 38 科研 skill，六大领域，uv run 统一，软件 Apache 但各数据库许可独立需自查。
-->
