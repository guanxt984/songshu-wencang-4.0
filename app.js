const storageKey = "nestnote-prototype:v1";

const nestTypes = {
  interview: {
    label: "面试复习型",
    manual: "前端面试知识手册",
    rules: [
      ["JavaScript 基础", ["闭包", "原型", "事件循环", "this", "作用域", "promise", "异步", "类型", "js"]],
      ["浏览器与网络", ["浏览器", "缓存", "渲染", "跨域", "http", "https", "tcp", "性能", "页面"]],
      ["React 与工程化", ["react", "hooks", "hook", "fiber", "组件", "状态", "webpack", "vite", "工程化"]],
      ["项目表达", ["项目", "亮点", "难点", "性能优化", "组件封装", "权限", "业务", "成果", "指标"]],
      ["面试策略", ["面试", "反问", "简历", "表达", "star", "复盘", "准备", "沟通"]],
    ],
  },
  reading: {
    label: "读书摘抄型",
    manual: "读书摘抄主题手册",
    rules: [
      ["自我认知", ["自己", "自我", "选择", "成长", "身份", "内心", "理解"]],
      ["人与关系", ["关系", "孤独", "亲密", "朋友", "爱", "理解", "沟通"]],
      ["时间与生活", ["时间", "生活", "日常", "年龄", "记忆", "过去", "未来"]],
      ["行动与勇气", ["行动", "勇气", "犹豫", "坚持", "改变", "开始"]],
      ["语言与表达", ["句子", "表达", "比喻", "文字", "叙述", "写作"]],
    ],
  },
  general: {
    label: "通用知识型",
    manual: "长期知识手册",
    rules: [
      ["核心概念", ["概念", "定义", "原理", "本质", "是什么"]],
      ["方法步骤", ["方法", "步骤", "流程", "怎么", "如何", "策略"]],
      ["案例素材", ["案例", "例子", "故事", "场景", "经验"]],
      ["问题洞察", ["问题", "原因", "痛点", "风险", "挑战"]],
      ["待整理", []],
    ],
  },
};

const seedState = {
  activeNestId: "nest-interview",
  nests: [
    {
      id: "nest-interview",
      name: "官官的面试巢",
      type: "interview",
      twigs: [
        {
          id: "twig-1",
          raw: "项目经历不要只写做了什么，要写清楚背景、动作和结果，最好用数据证明影响，比如耗时下降、转化率提升、错误率降低。",
          source: "面经摘录",
          createdAt: Date.now() - 1000 * 60 * 60 * 5,
        },
        {
          id: "twig-2",
          raw: "React Hooks 面试里经常追问 useEffect 依赖项。回答时要说清楚闭包、依赖数组、清理函数，以及为什么不能随意省略依赖。",
          source: "前端帖子",
          createdAt: Date.now() - 1000 * 60 * 60 * 4,
        },
        {
          id: "twig-3",
          raw: "面试结束反问可以问团队当前最重要的目标、这个岗位前三个月的评价标准，以及新人最常见的挑战。",
          source: "经验帖",
          createdAt: Date.now() - 1000 * 60 * 60 * 3,
        },
      ],
      sections: [],
      logs: [],
      merges: 0,
    },
    {
      id: "nest-reading",
      name: "我的读书巢",
      type: "reading",
      twigs: [
        {
          id: "twig-4",
          raw: "人并不是在独处时突然认识自己，而是在一次次选择、关系和行动里慢慢看清自己的形状。",
          source: "读书摘抄",
          createdAt: Date.now() - 1000 * 60 * 60 * 2,
        },
      ],
      sections: [],
      logs: [],
      merges: 0,
    },
  ],
};

let state = loadState();

const elements = {
  nestList: document.querySelector("#nestList"),
  newNestButton: document.querySelector("#newNestButton"),
  activeNestTitle: document.querySelector("#activeNestTitle"),
  manualType: document.querySelector("#manualType"),
  manualTitle: document.querySelector("#manualTitle"),
  twigCount: document.querySelector("#twigCount"),
  mergeCount: document.querySelector("#mergeCount"),
  sectionCount: document.querySelector("#sectionCount"),
  tocList: document.querySelector("#tocList"),
  manualView: document.querySelector("#manualView"),
  twigInput: document.querySelector("#twigInput"),
  sourceInput: document.querySelector("#sourceInput"),
  weaveButton: document.querySelector("#weaveButton"),
  sampleButton: document.querySelector("#sampleButton"),
  searchInput: document.querySelector("#searchInput"),
  weaveLog: document.querySelector("#weaveLog"),
  logCount: document.querySelector("#logCount"),
  growthTitle: document.querySelector("#growthTitle"),
  growthText: document.querySelector("#growthText"),
  toast: document.querySelector("#toast"),
};

elements.newNestButton.addEventListener("click", createNest);
elements.weaveButton.addEventListener("click", weaveTwig);
elements.sampleButton.addEventListener("click", fillSample);
elements.searchInput.addEventListener("input", () => render());
elements.searchInput.addEventListener("search", () => render());
elements.searchInput.addEventListener("change", () => render());

bootstrap();

function bootstrap() {
  state.nests.forEach((nest) => {
    if (!nest.sections.length) rebuildManual(nest, "初始化手册结构");
  });
  persist();
  render();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (parsed?.nests?.length) return parsed;
  } catch {
    // Ignore broken local data and reset to seed state.
  }
  return structuredClone(seedState);
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function activeNest() {
  return state.nests.find((nest) => nest.id === state.activeNestId) || state.nests[0];
}

function createNest() {
  const name = window.prompt("给新知识巢取个名字", "新的知识巢");
  if (!name?.trim()) return;
  const nest = {
    id: crypto.randomUUID(),
    name: name.trim(),
    type: "general",
    twigs: [],
    sections: [],
    logs: [],
    merges: 0,
  };
  state.nests.unshift(nest);
  state.activeNestId = nest.id;
  persist();
  render();
  showToast("新巢搭好啦，等你带回第一根树枝。");
}

function weaveTwig() {
  const raw = elements.twigInput.value.trim();
  if (!raw) {
    elements.twigInput.focus();
    showToast("先放入一段内容，小鸟才知道要叼哪根树枝。");
    return;
  }

  const nest = activeNest();
  const fragments = splitFragments(raw);
  let added = 0;
  let merged = 0;
  const touched = new Set();

  fragments.forEach((fragment) => {
    const duplicate = findDuplicate(nest, fragment);
    if (duplicate) {
      duplicate.weight += 1;
      duplicate.sources.push(sourceLabel());
      duplicate.body = combineBody(duplicate.body, fragment);
      duplicate.updatedAt = Date.now();
      nest.merges += 1;
      merged += 1;
      touched.add(duplicate.id);
      return;
    }

    const sectionName = classify(nest, fragment);
    let section = nest.sections.find((item) => item.title === sectionName);
    if (!section) {
      section = createSection(sectionName);
      nest.sections.push(section);
    }

    const twig = {
      id: crypto.randomUUID(),
      raw: fragment,
      source: sourceLabel(),
      createdAt: Date.now(),
    };
    nest.twigs.push(twig);

    const point = {
      id: crypto.randomUUID(),
      title: makePointTitle(fragment),
      body: polish(fragment),
      rawIds: [twig.id],
      sources: [twig.source],
      weight: 1,
      updatedAt: Date.now(),
    };
    section.points.push(point);
    touched.add(point.id);
    added += 1;
  });

  nest.logs.unshift({
    id: crypto.randomUUID(),
    title: merged ? "相似树枝已加固" : "新树枝已编入手册",
    detail: `新增 ${added} 条，合并加固 ${merged} 条`,
    createdAt: Date.now(),
  });

  elements.twigInput.value = "";
  elements.sourceInput.value = "";
  persist();
  render([...touched]);
  showToast(merged ? `编好啦：新增 ${added} 条，${merged} 根相似树枝用于加固。` : `编好啦：${added} 根树枝已进入知识手册。`);
}

function rebuildManual(nest, reason) {
  nest.sections = [];
  const source = [...nest.twigs].sort((a, b) => a.createdAt - b.createdAt);
  source.forEach((twig) => {
    const sectionName = classify(nest, twig.raw);
    let section = nest.sections.find((item) => item.title === sectionName);
    if (!section) {
      section = createSection(sectionName);
      nest.sections.push(section);
    }
    const duplicate = section.points.find((point) => similarity(point.body, twig.raw) > 0.72);
    if (duplicate) {
      duplicate.weight += 1;
      duplicate.rawIds.push(twig.id);
      duplicate.sources.push(twig.source || "未标注来源");
      duplicate.body = combineBody(duplicate.body, twig.raw);
      nest.merges += 1;
    } else {
      section.points.push({
        id: crypto.randomUUID(),
        title: makePointTitle(twig.raw),
        body: polish(twig.raw),
        rawIds: [twig.id],
        sources: [twig.source || "未标注来源"],
        weight: 1,
        updatedAt: twig.createdAt,
      });
    }
  });
  nest.logs.unshift({
    id: crypto.randomUUID(),
    title: reason,
    detail: "小鸟梳理了已有树枝，生成当前手册骨架。",
    createdAt: Date.now(),
  });
}

function createSection(title) {
  return {
    id: crypto.randomUUID(),
    title,
    summary: sectionSummary(title),
    points: [],
  };
}

function splitFragments(text) {
  return text
    .replace(/\r/g, "\n")
    .split(/\n{2,}|(?=^\s*[-*•]\s+)/m)
    .map((item) => item.replace(/^\s*[-*•]\s*/, "").trim())
    .filter((item) => item.length >= 8);
}

function classify(nest, text) {
  const rules = nestTypes[nest.type]?.rules || nestTypes.general.rules;
  const normalized = text.toLowerCase();
  const result = rules
    .map(([title, keys]) => ({
      title,
      score: keys.reduce((score, key) => score + (normalized.includes(key.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)[0];
  return result?.score ? result.title : rules.at(-1)[0];
}

function findDuplicate(nest, fragment) {
  return nest.sections
    .flatMap((section) => section.points)
    .find((point) => similarity(point.body, fragment) > 0.72 || normalize(point.title) === normalize(makePointTitle(fragment)));
}

function similarity(a, b) {
  const aa = new Set(normalize(a));
  const bb = new Set(normalize(b));
  if (!aa.size || !bb.size) return 0;
  const overlap = [...aa].filter((char) => bb.has(char)).length;
  return overlap / Math.max(aa.size, bb.size);
}

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{Script=Han}a-z0-9]/gu, "");
}

function polish(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const sentences = cleaned.split(/(?<=[。！？!?])\s*/).filter(Boolean);
  const selected = sentences.length > 2 ? sentences.slice(0, 2).join("") : cleaned;
  return selected.length > 180 ? `${selected.slice(0, 178)}...` : selected;
}

function combineBody(current, incoming) {
  const polished = polish(incoming);
  if (similarity(current, polished) > 0.84) return current;
  return current.length > polished.length ? current : polished;
}

function makePointTitle(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const colon = cleaned.split(/[：:]/)[0];
  const sentence = colon.split(/[。！？!?]/)[0];
  return sentence.length > 22 ? `${sentence.slice(0, 22)}...` : sentence || "新的知识点";
}

function sectionSummary(title) {
  const summaries = {
    "JavaScript 基础": "沉淀语言机制、运行模型与高频追问，形成可复述的面试表达。",
    "浏览器与网络": "整理页面运行、请求响应、缓存与性能相关知识，便于按链路查找。",
    "React 与工程化": "归纳框架原理、组件实践和工程体系，让零散经验进入稳定结构。",
    "项目表达": "把项目经历编成背景、动作、结果清晰的讲述素材。",
    "面试策略": "收纳简历、沟通、反问和复盘策略，帮助面试表达更有秩序。",
    "自我认知": "把关于自我、选择和成长的摘录整理成可回看的主题段落。",
    "人与关系": "沉淀关于孤独、亲密、沟通和理解的表达。",
    "时间与生活": "归拢关于时间、日常、记忆和生活感受的句子。",
    "行动与勇气": "整理关于开始、坚持、改变和犹豫的摘录。",
    "语言与表达": "保存有表达价值的句式、比喻和写作素材。",
    "核心概念": "记录定义、原理和关键观点。",
    "方法步骤": "整理可以复用的方法、流程和行动路径。",
    "案例素材": "收集能支撑观点的案例、故事和场景。",
    "问题洞察": "归纳痛点、原因、风险和挑战。",
    "待整理": "暂时无法归入已有章节的树枝会先放在这里。",
  };
  return summaries[title] || "小鸟为这个主题临时搭起的新枝架。";
}

function sourceLabel() {
  return elements.sourceInput.value.trim() || "本次拾枝";
}

function fillSample() {
  const nest = activeNest();
  const isReading = nest.type === "reading";
  elements.twigInput.value = isReading
    ? `人并不是通过孤立思考认识自己，而是在关系、行动和选择中逐渐看清自己。

孤独有时不是没有人陪，而是无法把内心准确地交到另一个人手里。

真正有力量的句子，往往不是替人下结论，而是让人突然看见自己一直说不清的感受。`
    : `React Hooks 面试里经常追问 useEffect 依赖项，回答时要说清楚闭包、依赖数组、清理函数，以及为什么不能随意省略依赖。

项目经历最好按照 STAR 来讲：背景是什么，任务是什么，你做了什么，最后产生了什么结果。不要堆技术名词，要让面试官听见你的判断。

浏览器缓存可以从强缓存和协商缓存讲起，再补充 cache-control、etag、last-modified 的区别。`;
  elements.sourceInput.value = isReading ? "读书摘抄" : "示例面经";
  elements.twigInput.focus();
}

function render(highlightIds = []) {
  const nest = activeNest();
  const type = nestTypes[nest.type] || nestTypes.general;
  const query = elements.searchInput.value.trim();

  elements.activeNestTitle.textContent = nest.name;
  elements.manualType.textContent = type.label;
  elements.manualTitle.textContent = `《${type.manual}》`;
  elements.twigCount.textContent = nest.twigs.length;
  elements.mergeCount.textContent = nest.merges;
  elements.sectionCount.textContent = `${nest.sections.length} 章`;
  elements.logCount.textContent = `${nest.logs.length} 条`;

  renderNests();
  renderGrowth(nest);
  renderToc(nest);
  renderManual(nest, query, highlightIds);
  renderLogs(nest);
}

function renderNests() {
  const template = document.querySelector("#nestButtonTemplate");
  elements.nestList.innerHTML = "";
  state.nests.forEach((nest) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.classList.toggle("active", nest.id === state.activeNestId);
    node.querySelector("strong").textContent = nest.name;
    node.querySelector("small").textContent = `${nest.twigs.length} 根树枝 / ${nest.sections.length} 章`;
    node.addEventListener("click", () => {
      state.activeNestId = nest.id;
      persist();
      render();
    });
    elements.nestList.append(node);
  });
}

function renderGrowth(nest) {
  const count = nest.twigs.length;
  const status =
    count >= 100
      ? ["成熟知识巢", "结构已经稳定，新增树枝会优先进行章节级整合。"]
      : count >= 30
        ? ["枝叶成形", "手册已经有清晰骨架，适合持续补充和搜索。"]
        : count >= 8
          ? ["稳固巢架", "多个主题正在长出来，重复树枝会变成重点信号。"]
          : ["初筑小巢", "拾起第一批树枝，手册会慢慢长出骨架。"];
  elements.growthTitle.textContent = status[0];
  elements.growthText.textContent = status[1];
}

function renderToc(nest) {
  elements.tocList.innerHTML = "";
  nest.sections.forEach((section) => {
    const button = document.createElement("button");
    button.className = "toc-link";
    button.type = "button";
    button.textContent = section.title;
    button.addEventListener("click", () => {
      document.querySelector(`[data-section-id="${section.id}"]`)?.scrollIntoView({ block: "start" });
    });
    elements.tocList.append(button);
  });
}

function renderManual(nest, query, highlightIds) {
  const template = document.querySelector("#sectionTemplate");
  const normalizedQuery = normalize(query);
  const sections = nest.sections
    .map((section) => ({
      ...section,
      points: section.points.filter((point) => {
        if (!normalizedQuery) return true;
        return normalize(`${section.title}${point.title}${point.body}${point.sources.join("")}`).includes(normalizedQuery);
      }),
    }))
    .filter((section) => section.points.length || !normalizedQuery);

  elements.manualView.innerHTML = "";

  if (!sections.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = query ? "这片巢里暂时没找到相关树枝。" : "还没有手册内容，先拾起第一根小树枝吧。";
    elements.manualView.append(empty);
    return;
  }

  sections.forEach((section, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.sectionId = section.id;
    node.querySelector("p").textContent = `第 ${index + 1} 章`;
    node.querySelector("h4").textContent = section.title;
    const totalWeight = section.points.reduce((sum, point) => sum + point.weight, 0);
    node.querySelector(".frequency-pill").textContent = `${totalWeight} 根树枝`;

    const body = node.querySelector(".section-body");
    const summary = document.createElement("p");
    summary.textContent = section.summary;
    body.append(summary);

    section.points.forEach((point) => {
      const paragraph = document.createElement("p");
      paragraph.innerHTML = `<strong>${escapeHtml(point.title)}</strong>：${escapeHtml(point.body)}`;
      body.append(paragraph);

      if (highlightIds.includes(point.id)) {
        node.classList.add("is-new");
      }
    });

    const sources = document.createElement("div");
    sources.className = "source-list";
    [...new Set(section.points.flatMap((point) => point.sources))]
      .slice(0, 5)
      .forEach((source) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = `来源：${source}`;
        sources.append(tag);
      });
    body.append(sources);
    elements.manualView.append(node);
  });
}

function renderLogs(nest) {
  elements.weaveLog.innerHTML = "";
  if (!nest.logs.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "小鸟还没开始编巢。";
    elements.weaveLog.append(empty);
    return;
  }

  nest.logs.slice(0, 8).forEach((log) => {
    const item = document.createElement("article");
    item.className = "log-item";
    item.innerHTML = `<strong>${escapeHtml(log.title)}</strong><small>${escapeHtml(log.detail)} · ${formatTime(log.createdAt)}</small>`;
    elements.weaveLog.append(item);
  });
}

function formatTime(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}
