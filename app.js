const storageKey = "nestnote-prototype:v5";

const nestTypes = {
  interview: {
    label: "面试准备",
    tone: "leaf",
    topics: [
      ["JavaScript 基础", ["闭包", "原型", "事件循环", "this", "作用域", "promise", "异步", "类型", "js"]],
      ["浏览器与网络", ["浏览器", "缓存", "渲染", "跨域", "http", "https", "tcp", "性能", "页面"]],
      ["React 与工程化", ["react", "hooks", "hook", "fiber", "组件", "状态", "webpack", "vite", "工程化"]],
      ["项目表达", ["项目", "亮点", "难点", "性能优化", "组件封装", "权限", "业务", "成果", "指标"]],
      ["面试策略", ["面试", "反问", "简历", "表达", "star", "复盘", "准备", "沟通"]],
    ],
  },
  reading: {
    label: "读书摘抄",
    tone: "pond",
    topics: [
      ["自我认知", ["自己", "自我", "选择", "成长", "身份", "内心", "理解"]],
      ["人与关系", ["关系", "孤独", "亲密", "朋友", "爱", "理解", "沟通"]],
      ["时间与生活", ["时间", "生活", "日常", "年龄", "记忆", "过去", "未来"]],
      ["行动与勇气", ["行动", "勇气", "犹豫", "坚持", "改变", "开始"]],
      ["语言与表达", ["句子", "表达", "比喻", "文字", "叙述", "写作"]],
    ],
  },
  general: {
    label: "通用知识",
    tone: "sun",
    topics: [
      ["核心概念", ["概念", "定义", "原理", "本质", "是什么"]],
      ["方法步骤", ["方法", "步骤", "流程", "怎么", "如何", "策略"]],
      ["案例素材", ["案例", "例子", "故事", "场景", "经验"]],
      ["问题洞察", ["问题", "原因", "痛点", "风险", "挑战"]],
      ["待整理", []],
    ],
  },
};

const seedState = {
  route: "home",
  activeNestId: "nest-interview",
  drawer: null,
  editMode: false,
  query: "",
  nests: [
    {
      id: "nest-interview",
      name: "官官的面试巢",
      type: "interview",
      merges: 0,
      updatedAt: Date.now() - 1000 * 60 * 25,
      twigs: [
        {
          id: "twig-1",
          raw: "项目经历不要只写做了什么，要写清楚背景、动作和结果，最好用数据证明影响，比如耗时下降、转化率提升、错误率降低。",
          source: "面经摘录",
          createdAt: Date.now() - 1000 * 60 * 60 * 5,
          position: "项目表达",
        },
        {
          id: "twig-2",
          raw: "React Hooks 面试里经常追问 useEffect 依赖项。回答时要说清楚闭包、依赖数组、清理函数，以及为什么不能随意省略依赖。",
          source: "前端帖子",
          createdAt: Date.now() - 1000 * 60 * 60 * 4,
          position: "React 与工程化",
        },
        {
          id: "twig-3",
          raw: "面试结束反问可以问团队当前最重要的目标、这个岗位前三个月的评价标准，以及新人最常见的挑战。",
          source: "经验帖",
          createdAt: Date.now() - 1000 * 60 * 60 * 3,
          position: "面试策略",
        },
      ],
      sections: [],
    },
    {
      id: "nest-reading",
      name: "我的读书巢",
      type: "reading",
      merges: 0,
      updatedAt: Date.now() - 1000 * 60 * 40,
      twigs: [
        {
          id: "twig-4",
          raw: "人并不是在独处时突然认识自己，而是在一次次选择、关系和行动里慢慢看清自己的形状。",
          source: "读书摘抄",
          createdAt: Date.now() - 1000 * 60 * 60 * 2,
          position: "自我认知",
        },
        {
          id: "twig-5",
          raw: "孤独有时不是没有人陪，而是无法把内心准确地交到另一个人手里。",
          source: "读书摘抄",
          createdAt: Date.now() - 1000 * 60 * 60,
          position: "人与关系",
        },
      ],
      sections: [],
    },
    {
      id: "nest-ideas",
      name: "产品灵感巢",
      type: "general",
      merges: 0,
      updatedAt: Date.now() - 1000 * 60 * 90,
      twigs: [
        {
          id: "twig-6",
          raw: "好的知识整理产品不应该只负责保存内容，而应该让用户看见结构正在变清晰。",
          source: "产品想法",
          createdAt: Date.now() - 1000 * 60 * 20,
          position: "问题洞察",
        },
      ],
      sections: [],
    },
  ],
};

let state = loadState();

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

bootstrap();

function bootstrap() {
  state.nests.forEach((nest) => rebuildNest(nest));
  persist();
  render();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (parsed?.nests?.length) return parsed;
  } catch {
    // Use seed state when local storage is not available.
  }
  return structuredClone(seedState);
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function activeNest() {
  return state.nests.find((nest) => nest.id === state.activeNestId) || state.nests[0];
}

function activeType(nest = activeNest()) {
  return nestTypes[nest.type] || nestTypes.general;
}

function render() {
  if (state.route === "nest") {
    renderNestPage();
  } else {
    renderHomePage();
  }
}

function renderHomePage() {
  app.className = "app home-page";
  app.innerHTML = `
    <section class="home-hero">
      <div class="paper-sun" aria-hidden="true"></div>
      <div class="floating-doodle doodle-tree" aria-hidden="true"></div>
      <div class="floating-doodle doodle-duck" aria-hidden="true"></div>
      <div class="floating-doodle doodle-flower" aria-hidden="true"></div>

      <div class="brand-lockup">
        <div class="brand-bird" aria-hidden="true">
          <svg class="brand-logo" viewBox="0 0 148 92" role="img">
            <path class="logo-body" d="M28 48C28 25 47 12 72 16c22 3 38 19 38 38 0 18-17 28-42 27-24-1-40-12-40-33Z"></path>
            <path class="logo-wing" d="M62 48c12-10 27-8 36 2-5 13-21 18-34 10-5-3-6-8-2-12Z"></path>
            <path class="logo-tail" d="M26 47 8 35l4 20L4 70l24-7Z"></path>
            <path class="logo-beak" d="M107 45 128 55 108 63Z"></path>
            <circle class="logo-eye" cx="78" cy="36" r="4"></circle>
            <g class="logo-branch">
              <path d="M119 58c11-2 20-5 27-10"></path>
              <path d="M135 53c-1-8 6-13 13-12-1 8-6 12-13 12Z"></path>
              <path d="M132 55c5 2 8 7 7 13-6 0-10-5-7-13Z"></path>
            </g>
          </svg>
        </div>
        <p>NestNote</p>
        <h1>枝枝笔记</h1>
        <span>拾起零散知识小树枝，编成清晰的知识巢</span>
      </div>

      <button class="new-nest-button" id="newNestButton" type="button">
        <span class="crayon-plus" aria-hidden="true"></span>
        新建知识巢
      </button>
    </section>

    <section class="forest-board" aria-label="知识巢森林">
      ${state.nests.map(renderNestCard).join("")}
    </section>
  `;

  app.querySelector("#newNestButton").addEventListener("click", createNest);
  app.querySelectorAll("[data-open-nest]").forEach((button) => {
    button.addEventListener("click", () => openNest(button.dataset.openNest));
  });
}

function renderNestCard(nest, index) {
  const type = activeType(nest);
  return `
    <button class="nest-card tone-${type.tone}" data-open-nest="${nest.id}" type="button" style="--tilt:${index % 2 ? "2deg" : "-2deg"}">
      <span class="tree-top" aria-hidden="true"></span>
      <span class="tiny-nest" aria-hidden="true"></span>
      <strong>${escapeHtml(nest.name)}</strong>
      <small>${nest.twigs.length} 根小树枝 · ${type.label}</small>
    </button>
  `;
}

function renderNestPage() {
  const nest = activeNest();
  const type = activeType(nest);
  const branches = flattenBranches(nest);
  const sections = filteredSections(nest);

  app.className = `app nest-page tone-${type.tone}`;
  app.innerHTML = `
    <header class="nest-topbar">
      <button class="soft-icon-button" id="backHome" type="button" aria-label="返回首页">
        <span class="icon-home" aria-hidden="true"></span>
      </button>

      <div class="nest-title">
        <p>${type.label}</p>
        <h1>${escapeHtml(nest.name)}</h1>
        <span>${nest.twigs.length} 根小树枝 · ${nest.sections.length} 个主题 · 最近更新 ${formatTime(nest.updatedAt)}</span>
      </div>

      <label class="search-box">
        <span aria-hidden="true"></span>
        <input id="searchInput" type="search" value="${escapeHtml(state.query)}" placeholder="在知识巢里搜索">
      </label>

      <div class="top-actions" aria-label="文档操作">
        <button class="text-action" id="editButton" type="button">${state.editMode ? "完成修改" : "修改内容"}</button>
        <button class="text-action" id="exportButton" type="button">导出文档</button>
        <button class="text-action" id="rebuildButton" type="button">重新整理</button>
      </div>
    </header>

    <section class="workspace">
      <article class="document-shell">
        <div class="document-paper" id="documentPaper" ${state.editMode ? 'contenteditable="true"' : ""}>
          ${sections.length ? sections.map(renderDocumentSection).join("") : renderEmptyDocument()}
        </div>
      </article>

      <aside class="quick-tools" aria-label="轻操作区">
        <button class="tool-button" id="warehouseButton" type="button" title="树枝仓库">
          <span class="tool-icon icon-warehouse" aria-hidden="true"></span>
          <small>仓库</small>
        </button>
        <button class="tool-button primary-tool" id="pickButton" type="button" title="拾取树枝">
          <span class="tool-icon icon-pick" aria-hidden="true"></span>
          <small>拾枝</small>
        </button>
      </aside>
    </section>

    ${state.drawer ? renderDrawer(nest, branches) : ""}
  `;

  bindNestEvents(nest);
}

function renderDocumentSection(section) {
  return `
    <section class="doc-section" data-section="${escapeHtml(section.title)}">
      <h2>${escapeHtml(section.title)}</h2>
      <p class="summary">${escapeHtml(section.summary)}</p>
      ${section.points
        .map(
          (point) => `
            <div class="doc-point">
              <h3>${escapeHtml(point.title)}</h3>
              <p>${escapeHtml(point.body)}</p>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderEmptyDocument() {
  return `
    <div class="empty-document">
      <div class="empty-flower" aria-hidden="true"></div>
      <h2>这个知识巢还很安静</h2>
      <p>点击右侧“拾枝”，放入第一段碎片知识。</p>
    </div>
  `;
}

function renderDrawer(nest, branches) {
  const isWarehouse = state.drawer === "warehouse";
  return `
    <div class="drawer-backdrop" data-close-drawer></div>
    <aside class="drawer ${isWarehouse ? "warehouse-drawer" : "pick-drawer"}">
      <header class="drawer-header">
        <div>
          <p>${isWarehouse ? "树枝仓库" : "拾取树枝"}</p>
          <h2>${isWarehouse ? "所有小树枝" : "新建小树枝"}</h2>
        </div>
        <button class="close-button" data-close-drawer type="button" aria-label="关闭"></button>
      </header>

      ${
        isWarehouse
          ? renderWarehouse(branches)
          : renderPickForm(nest)
      }
    </aside>
  `;
}

function renderWarehouse(branches) {
  return `
    <div class="warehouse-list">
      ${branches.length
        ? branches.map(renderWarehouseItem).join("")
        : `<div class="empty-drawer">树枝仓库还是空的。</div>`}
    </div>
  `;
}

function renderWarehouseItem(branch) {
  return `
    <article class="warehouse-item">
      <div class="branch-count">${branch.weight} 次提到</div>
      <h3>${escapeHtml(branch.title)}</h3>
      <p>${escapeHtml(branch.body)}</p>
      <dl>
        <div><dt>拾取时间</dt><dd>${formatTime(branch.createdAt || branch.updatedAt)}</dd></div>
        <div><dt>体现位置</dt><dd>${escapeHtml(branch.position || branch.topic)}</dd></div>
        <div><dt>来源备注</dt><dd>${escapeHtml([...new Set(branch.sources)].join("、") || "未标注")}</dd></div>
      </dl>
    </article>
  `;
}

function renderPickForm() {
  return `
    <form class="pick-form" id="pickForm">
      <label>
        <span>知识内容</span>
        <textarea id="twigInput" required placeholder="粘贴一段面经、摘抄、课程笔记或网页片段"></textarea>
      </label>
      <label>
        <span>来源备注，可选</span>
        <input id="sourceInput" type="text" placeholder="例如：读书摘抄 / 某篇帖子 / 课程笔记">
      </label>
      <button class="save-twig-button" type="submit">保存小树枝</button>
      <button class="sample-button" id="sampleButton" type="button">放入示例</button>
    </form>
  `;
}

function bindNestEvents(nest) {
  app.querySelector("#backHome").addEventListener("click", () => {
    state.route = "home";
    state.drawer = null;
    state.query = "";
    state.editMode = false;
    persist();
    render();
  });

  app.querySelector("#warehouseButton").addEventListener("click", () => {
    state.drawer = "warehouse";
    render();
  });

  app.querySelector("#pickButton").addEventListener("click", () => {
    state.drawer = "pick";
    render();
  });

  app.querySelector("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderNestPage();
  });

  app.querySelector("#editButton").addEventListener("click", () => {
    if (state.editMode) {
      showToast("修改已保留在当前页面预览中。");
    }
    state.editMode = !state.editMode;
    render();
  });

  app.querySelector("#exportButton").addEventListener("click", () => exportDocument(nest));
  app.querySelector("#rebuildButton").addEventListener("click", () => {
    rebuildNest(nest);
    persist();
    render();
    showToast("已经重新整理知识巢。");
  });

  app.querySelectorAll("[data-close-drawer]").forEach((node) => {
    node.addEventListener("click", () => {
      state.drawer = null;
      render();
    });
  });

  const pickForm = app.querySelector("#pickForm");
  if (pickForm) {
    pickForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveTwig();
    });
    app.querySelector("#sampleButton").addEventListener("click", fillSample);
  }
}

function createNest() {
  const name = window.prompt("给新知识巢取个名字", "新的知识巢");
  if (!name?.trim()) return;
  const nest = {
    id: crypto.randomUUID(),
    name: name.trim(),
    type: "general",
    merges: 0,
    updatedAt: Date.now(),
    twigs: [],
    sections: [],
  };
  state.nests.push(nest);
  state.activeNestId = nest.id;
  state.route = "nest";
  state.drawer = "pick";
  persist();
  render();
}

function openNest(nestId) {
  state.activeNestId = nestId;
  state.route = "nest";
  state.drawer = null;
  state.query = "";
  persist();
  render();
}

function saveTwig() {
  const nest = activeNest();
  const content = app.querySelector("#twigInput").value.trim();
  const source = app.querySelector("#sourceInput").value.trim() || "未标注来源";
  if (!content) {
    app.querySelector("#twigInput").focus();
    return;
  }

  let added = 0;
  let merged = 0;
  splitFragments(content).forEach((fragment) => {
    const topic = classify(nest, fragment);
    const twig = {
      id: crypto.randomUUID(),
      raw: fragment,
      source,
      createdAt: Date.now(),
      position: topic,
    };
    nest.twigs.push(twig);

    const duplicate = findDuplicate(nest, fragment);
    if (duplicate) {
      duplicate.weight += 1;
      duplicate.sources.push(source);
      duplicate.rawIds.push(twig.id);
      duplicate.body = combineBody(duplicate.body, fragment);
      duplicate.updatedAt = Date.now();
      nest.merges += 1;
      merged += 1;
      return;
    }

    let section = nest.sections.find((item) => item.title === topic);
    if (!section) {
      section = createSection(topic);
      nest.sections.push(section);
    }
    section.points.push({
      id: crypto.randomUUID(),
      title: makePointTitle(fragment),
      body: polish(fragment),
      rawIds: [twig.id],
      sources: [source],
      weight: 1,
      createdAt: twig.createdAt,
      updatedAt: twig.createdAt,
      position: topic,
    });
    added += 1;
  });

  nest.updatedAt = Date.now();
  persist();
  state.drawer = null;
  render();
  showToast(`拾枝完成：新增 ${added} 条，合并加固 ${merged} 条。`);
}

function fillSample() {
  const nest = activeNest();
  if (nest.type === "reading") {
    app.querySelector("#twigInput").value = "真正有力量的句子，往往不是替人下结论，而是让人突然看见自己一直说不清的感受。";
    app.querySelector("#sourceInput").value = "读书摘抄";
  } else {
    app.querySelector("#twigInput").value = "项目经历最好按照 STAR 来讲：背景是什么，任务是什么，你做了什么，最后产生了什么结果。不要堆技术名词。";
    app.querySelector("#sourceInput").value = "示例内容";
  }
}

function exportDocument(nest) {
  const text = nest.sections
    .map((section) => {
      const points = section.points.map((point) => `${point.title}\n${point.body}`).join("\n\n");
      return `${section.title}\n${section.summary}\n\n${points}`;
    })
    .join("\n\n---\n\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${nest.name}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function rebuildNest(nest) {
  nest.sections = [];
  nest.merges = 0;
  nest.twigs.forEach((twig) => {
    const topic = classify(nest, twig.raw);
    twig.position = topic;
    let section = nest.sections.find((item) => item.title === topic);
    if (!section) {
      section = createSection(topic);
      nest.sections.push(section);
    }
    const duplicate = section.points.find((point) => similarity(point.body, twig.raw) > 0.78);
    if (duplicate) {
      duplicate.weight += 1;
      duplicate.sources.push(twig.source || "未标注来源");
      duplicate.rawIds.push(twig.id);
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
        createdAt: twig.createdAt,
        updatedAt: twig.createdAt,
        position: topic,
      });
    }
  });
}

function filteredSections(nest) {
  const query = normalize(state.query);
  if (!query) return nest.sections;
  return nest.sections
    .map((section) => ({
      ...section,
      points: section.points.filter((point) =>
        normalize(`${section.title}${section.summary}${point.title}${point.body}${point.sources.join("")}`).includes(query),
      ),
    }))
    .filter((section) => section.points.length);
}

function flattenBranches(nest) {
  return nest.sections
    .flatMap((section) =>
      section.points.map((point) => ({
        ...point,
        topic: section.title,
      })),
    )
    .sort((a, b) => b.weight - a.weight || b.updatedAt - a.updatedAt);
}

function classify(nest, text) {
  const topics = activeType(nest).topics;
  const normalized = text.toLowerCase();
  const result = topics
    .map(([title, keys]) => ({
      title,
      score: keys.reduce((score, key) => score + (normalized.includes(key.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)[0];
  return result?.score ? result.title : topics.at(-1)[0];
}

function createSection(title) {
  return {
    id: crypto.randomUUID(),
    title,
    summary: sectionSummary(title),
    points: [],
  };
}

function findDuplicate(nest, fragment) {
  return nest.sections
    .flatMap((section) => section.points)
    .find((point) => similarity(point.body, fragment) > 0.76 || normalize(point.title) === normalize(makePointTitle(fragment)));
}

function splitFragments(text) {
  return text
    .replace(/\r/g, "\n")
    .split(/\n{2,}|(?=^\s*[-*•]\s+)/m)
    .map((item) => item.replace(/^\s*[-*•]\s*/, "").trim())
    .filter((item) => item.length >= 8);
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
  if (similarity(current, polished) > 0.86) return current;
  return current.length > polished.length ? current : polished;
}

function makePointTitle(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const sentence = cleaned.split(/[。！？!?:：]/)[0];
  return sentence.length > 22 ? `${sentence.slice(0, 22)}...` : sentence || "新的小树枝";
}

function sectionSummary(title) {
  const summaries = {
    "JavaScript 基础": "把语言机制和高频追问整理成可以复述的表达。",
    "浏览器与网络": "把页面运行、请求响应、缓存与性能知识串成一条链路。",
    "React 与工程化": "沉淀框架原理、组件实践和工程化经验。",
    "项目表达": "把项目经历编成背景、动作、结果清晰的讲述素材。",
    "面试策略": "收纳简历、沟通、反问和复盘策略。",
    "自我认知": "把关于自我、选择和成长的摘录整理成可回看的主题段落。",
    "人与关系": "沉淀关于孤独、亲密、沟通和理解的表达。",
    "时间与生活": "归拢关于时间、日常、记忆和生活感受的句子。",
    "行动与勇气": "整理关于开始、坚持、改变和犹豫的摘录。",
    "语言与表达": "保存有表达价值的句式、比喻和写作素材。",
    "核心概念": "记录定义、原理和关键观点。",
    "方法步骤": "整理可以复用的方法、流程和行动路径。",
    "案例素材": "收集能支撑观点的案例、故事和场景。",
    "问题洞察": "归纳痛点、原因、风险和挑战。",
    "待整理": "暂时无法归入已有主题的小树枝会先放在这里。",
  };
  return summaries[title] || "围绕这个主题整理出的一段知识内容。";
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
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}
