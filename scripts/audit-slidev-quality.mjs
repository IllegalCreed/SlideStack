#!/usr/bin/env node
/**
 * Slidev 教学与呈现质量的纯本地基线审计。
 *
 * 自动评分只用于排序人工审阅优先级，不能替代内容准确性、全页截图、
 * 实际交互、build 与 overflow 检查。
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const slideStackRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packagesRoot = path.join(slideStackRoot, "packages");
const defaultReportPath =
  "/Users/zhangxu/illegal/quiz-monorepo/docs/audits/20260710-slidev-quality-baseline.md";
const args = new Set(process.argv.slice(2));

/** 将数值限制在指定区间。 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** 将简单 Slidev frontmatter 转成键值对象。 */
function parseFrontmatter(lines) {
  const result = {};
  for (const line of lines) {
    const match = line.match(/^([\w-]+):\s*(.*?)\s*$/);
    if (match) result[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
  return result;
}

/** 判断分隔线后是否紧跟一段页面 frontmatter。 */
function readSlideFrontmatter(lines, start) {
  const nextDelimiter = lines.indexOf("---", start);
  if (nextDelimiter === -1) return null;
  const candidate = lines.slice(start, nextDelimiter);
  const first = candidate.find((line) => line.trim() !== "");
  if (!first || !/^[\w-]+:\s*/.test(first)) return null;
  if (candidate.some((line) => /^\s*(?:#|```|::::?|<)/.test(line))) return null;
  return {
    frontmatter: parseFrontmatter(candidate),
    nextIndex: nextDelimiter + 1,
  };
}

/**
 * 解析 Slidev 页面边界。
 * 支持「单个 --- 直接换页」和「--- + 页面 frontmatter + ---」两种常见写法。
 */
function parseSlides(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let index = 0;
  let deckFrontmatter = {};
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    if (end !== -1) {
      deckFrontmatter = parseFrontmatter(lines.slice(1, end));
      index = end + 1;
    }
  }

  const slides = [];
  let current = { frontmatter: {}, lines: [] };
  while (index < lines.length) {
    if (lines[index] !== "---") {
      current.lines.push(lines[index]);
      index += 1;
      continue;
    }

    if (current.lines.some((line) => line.trim() !== "")) {
      slides.push(current);
    }
    current = { frontmatter: {}, lines: [] };
    index += 1;
    const parsed = readSlideFrontmatter(lines, index);
    if (parsed) {
      current.frontmatter = parsed.frontmatter;
      index = parsed.nextIndex;
    }
  }
  if (current.lines.some((line) => line.trim() !== "")) slides.push(current);
  if (slides[0] && deckFrontmatter.layout && !slides[0].frontmatter.layout) {
    slides[0].frontmatter.layout = deckFrontmatter.layout;
  }
  return { deckFrontmatter, slides };
}

/** 提取代码围栏信息，并返回去除围栏内容后的 Markdown。 */
function inspectFences(content) {
  const lines = content.split("\n");
  const fenceInfos = [];
  const visibleLines = [];
  let marker = null;
  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (!marker && fence) {
      marker = fence[1];
      fenceInfos.push(fence[2].trim());
      visibleLines.push("");
      continue;
    }
    if (marker && line.trim().startsWith(marker)) {
      marker = null;
      visibleLines.push("");
      continue;
    }
    visibleLines.push(marker ? "" : line);
  }
  return { fenceInfos, nonCode: visibleLines.join("\n") };
}

/** 计算一套幻灯片中最长的连续命中页数。 */
function longestRun(values) {
  let longest = 0;
  let current = 0;
  for (const value of values) {
    current = value ? current + 1 : 0;
    longest = Math.max(longest, current);
  }
  return longest;
}

/** 将自动分数转换为初步等级。 */
function gradeFor(score) {
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  return "D";
}

/** 审计单个 Slidev 包。 */
function auditDeck(packageName) {
  const packageRoot = path.join(packagesRoot, packageName);
  const slidesPath = path.join(packageRoot, "slides.md");
  const source = readFileSync(slidesPath, "utf8");
  const { deckFrontmatter, slides } = parseSlides(source);
  const componentsRoot = path.join(packageRoot, "components");
  const componentNames = existsSync(componentsRoot)
    ? readdirSync(componentsRoot)
        .filter((file) => file.endsWith(".vue"))
        .map((file) => path.basename(file, ".vue"))
    : [];

  const slideSignals = slides.map((slide, slideIndex) => {
    const content = slide.lines.join("\n");
    const noteMatches = [...content.matchAll(/<!--[\s\S]*?-->/g)];
    const withoutNotes = content.replace(/<!--[\s\S]*?-->/g, "");
    const { fenceInfos, nonCode } = inspectFences(withoutNotes);
    const title =
      nonCode.match(/^#{1,3}\s+(.+?)\s*$/m)?.[1]?.trim() ??
      `Slide ${slideIndex + 1}`;
    const listItems = (nonCode.match(/^\s*(?:[-*]|\d+\.)\s+/gm) ?? []).length;
    const proseLines = nonCode.split("\n").filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed !== "" &&
        !/^(?:#|[-*]\s|\d+\.\s|\||::|<[^>]+>\s*$)/.test(trimmed)
      );
    }).length;
    const layout = slide.frontmatter.layout ?? "default";
    const hasCode = fenceInfos.length > 0;
    const hasTable = /^\|(?:.*\|)+\s*$/m.test(nonCode);
    const hasDiagram = fenceInfos.some((info) =>
      /^(?:mermaid|plantuml)\b/.test(info),
    );
    const hasMagicMove = fenceInfos.some((info) => /\bmagic-move\b/.test(info));
    const hasCodeSteps =
      hasMagicMove ||
      fenceInfos.some((info) => /\{[^}\n]*\|[^}\n]*\}/.test(info));
    const hasMonaco = fenceInfos.some((info) =>
      /\{monaco(?:-run|-write)?\}/.test(info),
    );
    const usedComponents = componentNames.filter((name) =>
      new RegExp(`<${name}(?:\\s|/|>)`).test(nonCode),
    );
    const interactionSource = nonCode.replace(
      /@click="\$slidev\.nav\.next"/g,
      "",
    );
    const hasInteractiveMarkup =
      slideIndex > 0 &&
      (hasMonaco ||
        usedComponents.length > 0 ||
        /<(?:canvas|iframe|input|select|textarea)\b|\bv-model\b|@(?:input|change|update):?/i.test(
          interactionSource,
        ));
    const imageSources = [
      ...[...nonCode.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(
        (match) => match[1],
      ),
      ...[...nonCode.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(
        (match) => match[1],
      ),
      ...(slide.frontmatter.image ? [slide.frontmatter.image] : []),
    ];
    const topicImages = imageSources.filter(
      (sourceUrl) => !sourceUrl.includes("cover.sli.dev"),
    );
    const clickCount = (
      nonCode.match(/<v-clicks\b|\bv-click(?:\.\w+)?(?:=|\s|>)/g) ?? []
    ).length;
    const hasProgressiveReveal = clickCount > 0 || hasCodeSteps;
    const hasGrid =
      /\bgrid\b|::(?:left|right)::/.test(nonCode) ||
      layout.includes("two-cols");
    const linkCount =
      (nonCode.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) ?? []).length +
      (nonCode.match(/href=["']https?:\/\//g) ?? []).length;
    const listDominant =
      listItems >= 4 &&
      listItems >= proseLines &&
      !hasDiagram &&
      !hasInteractiveMarkup &&
      topicImages.length === 0;

    return {
      no: slideIndex + 1,
      title,
      layout,
      hasNotes: noteMatches.length > 0,
      listItems,
      hasCode,
      hasTable,
      hasDiagram,
      hasMagicMove,
      hasCodeSteps,
      hasMonaco,
      hasInteractiveMarkup,
      usedComponents,
      imageCount: imageSources.length,
      topicImageCount: topicImages.length,
      clickCount,
      hasProgressiveReveal,
      hasGrid,
      linkCount,
      listDominant,
    };
  });

  const slideCount = slideSignals.length;
  const count = (key) => slideSignals.filter((slide) => slide[key]).length;
  const sum = (key) =>
    slideSignals.reduce((total, slide) => total + slide[key], 0);
  const layouts = [...new Set(slideSignals.map((slide) => slide.layout))];
  const noteCoverage = slideCount === 0 ? 0 : count("hasNotes") / slideCount;
  const progressiveCoverage =
    slideCount === 0 ? 0 : count("hasProgressiveReveal") / slideCount;
  const titlesAndSource = `${slideSignals.map((slide) => slide.title).join("\n")}\n${source}`;
  const arcPatterns = [
    /什么是|定位|简介|概念/i,
    /为什么|痛点|价值|场景/i,
    /安装|开始|上手|第一个|hello/i,
    /原理|机制|心智|核心/i,
    /实战|示例|配置|集成|实践|demo/i,
    /陷阱|误区|问题|边界|性能|安全/i,
    /总结|回顾|结尾|选型|下一步/i,
  ];
  const arcSignals = arcPatterns.filter((pattern) =>
    pattern.test(titlesAndSource),
  ).length;
  const stockTemplate = /# Welcome to \[Slidev\]/.test(source);
  const usedComponentNames = [
    ...new Set(slideSignals.flatMap((slide) => slide.usedComponents)),
  ];
  const unusedComponents = componentNames.filter(
    (name) => !usedComponentNames.includes(name),
  );

  const teaching = Math.round(
    clamp(noteCoverage * 7, 0, 7) +
      clamp((arcSignals / arcPatterns.length) * 10, 0, 10) +
      (slideCount >= 8 && slideCount <= 40 ? 3 : 1) +
      clamp(sum("linkCount") / Math.max(1, slideCount / 5), 0, 5),
  );
  const examples = Math.round(
    clamp(count("hasCode") * 2, 0, 8) +
      clamp(arcSignals >= 5 ? 5 : arcSignals, 0, 5) +
      (count("hasCodeSteps") > 0 || /前后|before|after|输入|输出/i.test(source)
        ? 4
        : 0) +
      clamp(count("hasInteractiveMarkup") + count("hasDiagram"), 0, 3),
  );
  const visual = Math.round(
    clamp(layouts.length * 1.5, 0, 6) +
      clamp(count("hasDiagram") * 2 + sum("topicImageCount"), 0, 5) +
      clamp(count("hasTable") + count("hasGrid"), 0, 4),
  );
  const progressive = Math.round(
    clamp(progressiveCoverage * 10, 0, 7) +
      clamp(count("hasCodeSteps") * 4 + count("hasMagicMove") * 2, 0, 8),
  );
  const interaction = Math.round(
    clamp(count("hasInteractiveMarkup") * 5 + count("hasMonaco") * 3, 0, 9) +
      clamp(count("hasCodeSteps") * 2 + count("hasMagicMove") * 2, 0, 6),
  );
  const notesAndReadability = Math.round(
    clamp(noteCoverage * 6, 0, 6) +
      clamp(sum("linkCount") / Math.max(1, slideCount / 4), 0, 2) +
      clamp(sum("topicImageCount") > 0 ? 2 : 1, 0, 2),
  );
  const rawScore =
    teaching +
    examples +
    visual +
    progressive +
    interaction +
    notesAndReadability;
  const score = clamp(rawScore - (stockTemplate ? 3 : 0), 0, 100);
  const riskFlags = [];
  const listDominantRun = longestRun(
    slideSignals.map((slide) => slide.listDominant),
  );
  if (layouts.length <= 3) riskFlags.push("layout-monotony");
  if (listDominantRun >= 3) riskFlags.push("list-outline-run");
  if (count("hasCode") >= 5 && count("hasCodeSteps") === 0) {
    riskFlags.push("static-code-only");
  }
  if (
    count("hasDiagram") +
      sum("topicImageCount") +
      count("hasInteractiveMarkup") ===
    0
  ) {
    riskFlags.push("no-topic-visuals");
  }
  if (count("hasInteractiveMarkup") === 0)
    riskFlags.push("no-interaction-signal");
  if (noteCoverage < 0.7) riskFlags.push("low-notes-coverage");
  if (unusedComponents.length > 0) riskFlags.push("unused-local-components");
  if (stockTemplate) riskFlags.push("stock-slidev-ending");

  return {
    package: packageName,
    slidesFile: `packages/${packageName}/slides.md`,
    title: deckFrontmatter.title ?? packageName,
    slideCount,
    score,
    grade: gradeFor(score),
    dimensions: {
      teaching,
      examples,
      visual,
      progressive,
      interaction,
      notesAndReadability,
    },
    signals: {
      layouts,
      noteCoverage: Number(noteCoverage.toFixed(3)),
      progressiveCoverage: Number(progressiveCoverage.toFixed(3)),
      codeSlides: count("hasCode"),
      tableSlides: count("hasTable"),
      diagramSlides: count("hasDiagram"),
      codeStepSlides: count("hasCodeSteps"),
      magicMoveSlides: count("hasMagicMove"),
      monacoSlides: count("hasMonaco"),
      interactiveSlides: count("hasInteractiveMarkup"),
      topicImageCount: sum("topicImageCount"),
      listDominantSlides: count("listDominant"),
      longestListDominantRun: listDominantRun,
      linkCount: sum("linkCount"),
      localComponents: componentNames,
      usedLocalComponents: usedComponentNames,
    },
    riskFlags,
    slides: slideSignals,
  };
}

/** 将全量结果渲染为便于人工排期的摘要。 */
function renderReport(result) {
  const gradeRows = ["A", "B", "C", "D"].map((grade) => [
    grade,
    String(result.decks.filter((deck) => deck.grade === grade).length),
  ]);
  const riskRows = Object.entries(result.riskCounts).sort(
    (a, b) => b[1] - a[1],
  );
  const priorityRows = [...result.decks]
    .sort((a, b) => a.score - b.score || a.package.localeCompare(b.package))
    .slice(0, 60)
    .map(
      (deck) =>
        `| ${deck.package} | ${deck.slideCount} | ${deck.score} | ${deck.grade} | ${deck.riskFlags.join(", ") || "-"} |`,
    )
    .join("\n");
  return `# Slidev 教学质量自动基线

> 生成时间：${result.generatedAt}
> 口径：自动信号只用于安排人工审阅顺序，不代表最终教学质量结论。
> 内部参考：prettier-slide（${result.benchmark.score} 分 / ${result.benchmark.grade}）。

## 摘要

| 指标 | 数量 |
| --- | ---: |
| Slidev 套件 | ${result.totals.decks} |
| 页面总数 | ${result.totals.slides} |
| 含分步代码套件 | ${result.totals.withCodeSteps} |
| 含图解套件 | ${result.totals.withDiagrams} |
| 含交互信号套件 | ${result.totals.withInteraction} |
| 含本地组件实际引用套件 | ${result.totals.usingLocalComponents} |

## 等级分布

| 初步等级 | 套件数 |
| --- | ---: |
${gradeRows.map((row) => `| ${row[0]} | ${row[1]} |`).join("\n")}

## 风险信号

| 风险 | 套件数 |
| --- | ---: |
${riskRows.map(([risk, count]) => `| ${risk} | ${count} |`).join("\n")}

## 优先人工审阅

| 套件 | 页数 | 分数 | 等级 | 风险信号 |
| --- | ---: | ---: | --- | --- |
${priorityRows}
`;
}

const packageNames = readdirSync(packagesRoot)
  .filter((name) => name.endsWith("-slide"))
  .filter((name) => existsSync(path.join(packagesRoot, name, "slides.md")))
  .sort((a, b) => a.localeCompare(b));
const decks = packageNames.map(auditDeck);
const riskCounts = {};
for (const deck of decks) {
  for (const risk of deck.riskFlags)
    riskCounts[risk] = (riskCounts[risk] ?? 0) + 1;
}
const benchmarkDeck = decks.find((deck) => deck.package === "prettier-slide");
const result = {
  generatedAt: new Date().toISOString(),
  methodology: {
    provisional: true,
    gradeThresholds: { A: 85, B: 75, C: 60, D: 0 },
    benchmark: "prettier-slide",
  },
  totals: {
    decks: decks.length,
    slides: decks.reduce((total, deck) => total + deck.slideCount, 0),
    withCodeSteps: decks.filter((deck) => deck.signals.codeStepSlides > 0)
      .length,
    withDiagrams: decks.filter((deck) => deck.signals.diagramSlides > 0).length,
    withInteraction: decks.filter((deck) => deck.signals.interactiveSlides > 0)
      .length,
    usingLocalComponents: decks.filter(
      (deck) => deck.signals.usedLocalComponents.length > 0,
    ).length,
  },
  benchmark: benchmarkDeck
    ? {
        score: benchmarkDeck.score,
        grade: benchmarkDeck.grade,
        riskFlags: benchmarkDeck.riskFlags,
      }
    : { score: 0, grade: "D", riskFlags: ["benchmark-missing"] },
  riskCounts,
  decks,
};

if (args.has("--write-report")) {
  const reportPath = process.env.SLIDEV_AUDIT_REPORT_PATH ?? defaultReportPath;
  writeFileSync(reportPath, renderReport(result));
  console.log(`Wrote ${reportPath}`);
}

if (args.has("--json")) {
  console.log(JSON.stringify(result, null, 2));
} else if (!args.has("--write-report")) {
  console.log(
    [
      `Slidev decks: ${result.totals.decks}`,
      `Slides: ${result.totals.slides}`,
      `Code steps/diagrams/interaction: ${result.totals.withCodeSteps}/${result.totals.withDiagrams}/${result.totals.withInteraction}`,
      `Prettier benchmark: ${result.benchmark.score} (${result.benchmark.grade})`,
    ].join("\n"),
  );
}
