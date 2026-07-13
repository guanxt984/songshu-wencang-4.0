const asset = (name, className, alt = "") =>
  `<img class="${className}" src="assets/illustrations/${name}" alt="${alt}" aria-hidden="${alt ? "false" : "true"}">`;

const squirrelImg = (className) => asset("squirrel-crayon.png", className);
const pineconeImg = (className) => asset("pinecone-crayon.png", className);
const leafImg = (className) => asset("leaf-crayon.png", className);
const bookImg = (className) => asset("book-crayon.png", className);
const starImg = (className) => asset("star-crayon.png", className);
const searchImg = (className) => asset("search-crayon.png", className);
const userImg = (className) => asset("user-crayon.png", className);
const plusImg = (className) => asset("plus-crayon.png", className);
const moreImg = (className) => asset("more-crayon.png", className);
const grassImg = (className) => asset("grass-crayon.png", className);

const warehouses = [
  {
    id: "interview",
    name: "面试经验整理",
    count: 128,
    updated: "今天 10:30 更新",
    tone: "green",
    badge: "leaf",
    temp: { current: 3, limit: 5 },
    ledger: { shelves: 6, featured: 12, lastOrganized: "今天 10:30", mode: "放进现有果架" },
    intro: "系统梳理面试全过程的经验与技巧，帮助从容应对各类面试。",
    chapters: [
      ["简历准备", "简历不是经历堆叠，而是让面试官快速理解你与岗位的关系。", ["把项目写成背景、行动、结果的清晰故事，减少空泛技术名词。", "围绕目标岗位调整表达，让重点经历先被看见。", "为每个项目准备 1 分钟版本和 3 分钟展开版本。"]],
      ["面试前准备", "提前把岗位、公司、作品和自我介绍放进同一条线，现场表达会更稳定。", ["自我介绍先给结论，再补充最能证明匹配度的经历。", "准备常见问题时，重点是整理自己的判断过程。", "把岗位 JD 中反复出现的词和项目经历对应起来。"]],
      ["面试中的表现", "稳定、清楚、有来有回，比用力表现更容易建立信任。", ["回答前可以先确认理解。", "不会的问题说明思路边界和查证方向。", "用具体场景解释能力，而不是直接贴标签。"]],
      ["常见问题回答思路", "相似问题可以收进同一组答案骨架里，复盘时更容易调用。", ["失败经历要讲清复盘后改变了什么。", "职业规划要体现对岗位阶段的理解。", "离职原因保持事实清楚。"]],
      ["面试后的跟进", "面试结束后的记录能帮助下一次更快修正表达。", ["记录被追问最多的部分。", "把现场卡住的问题补成可复用答案。", "复盘岗位匹配度和判断原因。"]],
      ["其他经验补充", "暂时无法归入前面章节的经验，会先保留在这里。", ["后续松果增多后，AI 会把它们放进更合适的位置。"]],
    ],
    sources: ["07-12 09:41", "07-12 08:22", "07-11 22:15", "07-11 16:05"],
  },
  {
    id: "reading",
    name: "《被讨厌的勇气》摘抄",
    count: 86,
    updated: "昨天 21:15 更新",
    tone: "yellow",
    badge: "book",
    temp: { current: 5, limit: 5 },
    ledger: { shelves: 4, featured: 9, lastOrganized: "昨天 21:15", mode: "等待整理" },
    intro: "把零散摘抄整理成主题清晰的阅读复盘，保留可再次引用的句子入口。",
    chapters: [
      ["课题分离", "许多摘抄都在提醒人分清自己的选择与他人的评价。", ["判断一件事是谁的课题，可以减少过度负责。", "自由常常伴随被评价的风险。", "关系中的边界感比讨好更能带来稳定。"]],
      ["自我接纳", "自我接纳不是自我放弃，而是从真实处境开始行动。", ["接受现在的自己，才知道下一步从哪里开始。", "比较容易让注意力离开自己的生活。", "勇气不是不害怕，而是仍然选择行动。"]],
    ],
    sources: ["07-12 22:18", "07-12 19:02", "07-11 11:32", "07-10 21:45"],
  },
  {
    id: "product",
    name: "产品设计灵感",
    count: 64,
    updated: "07-11 16:40 更新",
    tone: "peach",
    badge: "heart",
    temp: { current: 2, limit: 5 },
    ledger: { shelves: 5, featured: 7, lastOrganized: "07-11 16:40", mode: "放进现有果架" },
    intro: "收拢关于产品体验、AI 整理、信任感和低输入成本的想法。",
    chapters: [
      ["低输入成本", "用户想保存和复盘，而不是先填写目标、选择模板、设计分类。", ["先让用户把材料放进来，再让 AI 根据内容长出果架。", "默认流程短到只有添加和整理。", "不要让用户在开始前理解复杂概念。"]],
      ["来源可追溯", "复盘文档越像一篇自然文章，越需要保留原始松果入口。", ["每个重点条目都应该能打开原始松果。", "精选松果在文档里要更容易被看见。", "重新整理前强调原始内容不会丢失。"]],
    ],
    sources: ["07-11 16:40", "07-11 15:28", "07-10 22:01", "07-10 20:41"],
  },
  {
    id: "study",
    name: "工作学习笔记",
    count: 92,
    updated: "07-10 09:20 更新",
    tone: "purple",
    badge: "case",
    temp: { current: 4, limit: 5 },
    ledger: { shelves: 3, featured: 6, lastOrganized: "07-10 09:20", mode: "放进现有果架" },
    intro: "把工作方法、学习心得和复盘记录整理成可查询的长期笔记。",
    chapters: [["任务拆解", "把模糊任务拆成可执行的下一步，能降低开始成本。", ["先确认目标和交付物。", "任务过大时，先做最小可验证版本。", "把等待外部反馈的事项单独标出来。"]]],
    sources: ["07-10 09:20", "07-09 18:05", "07-08 21:00", "07-08 09:16"],
  },
  {
    id: "life",
    name: "生活中的小确幸",
    count: 31,
    updated: "07-09 22:18 更新",
    tone: "blue",
    badge: "sprout",
    temp: { current: 1, limit: 5 },
    ledger: { shelves: 2, featured: 3, lastOrganized: "07-09 22:18", mode: "稍后整理" },
    intro: "保存日常里值得回看的细小片段，让它们不被时间冲散。",
    chapters: [["温柔瞬间", "一些看似很小的记录，回看时会变成稳定的情绪支点。", ["记录当时的场景，比只写结论更容易唤起记忆。", "可以把同类小事归到同一个章节里。", "精选松果适合保留原句和时间。"]]],
    sources: ["07-09 22:18", "07-08 19:27", "07-07 16:44", "07-07 09:31"],
  },
];

const state = {
  activeId: "interview",
  query: "",
  shelfOpen: false,
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

render();

function render() {
  const warehouse = getActiveWarehouse();
  const chapters = getFilteredChapters(warehouse.chapters);
  const activeTitle = chapters[0]?.[0] || warehouse.chapters[0][0];

  app.innerHTML = `
    <section class="page-shell">
      <header class="topbar">
        <button class="brand" type="button" data-action="home">
          ${squirrelImg("brand-squirrel")}
          <span>松鼠仓库</span>
          ${leafImg("leaf brand-leaf")}
        </button>
        <div class="top-mascot">${pineconeImg("top-pinecone")}${squirrelImg("top-squirrel")}${leafImg("leaf top-leaf")}</div>
        <div class="top-actions">
          <button class="round-button" type="button" data-action="global-search" aria-label="搜索">${searchImg("ui-search")}</button>
          <button class="round-button" type="button" data-action="profile" aria-label="账号">${userImg("ui-user")}</button>
        </div>
      </header>

      <aside class="warehouse-panel">
        <div class="panel-head">
          ${pineconeImg("tiny-pinecone")}
          <h2>松果仓列表</h2>
          <button type="button" data-action="new" aria-label="新建">${plusImg("ui-plus")}</button>
        </div>
        <div class="warehouse-list">
          ${warehouses.map(renderWarehouseCard).join("")}
        </div>
        <div class="bottom-grass" aria-hidden="true">${grassImg("grass grass-a")}${grassImg("grass grass-b")}${grassImg("grass grass-c")}</div>
      </aside>

      <main class="document-panel">
        <section class="document-card">
          <header class="doc-head">
            <div class="title-block">
              ${bookImg("book-icon")}
              <div>
                <h1>${warehouse.name}</h1>
                <p>${warehouse.intro}</p>
              </div>
              ${leafImg("leaf title-leaf")}
            </div>
            <div class="doc-actions">
              <label class="search-box">
                ${searchImg("ui-search search-small")}
                <input type="search" placeholder="搜索文档内容..." value="${escapeHtml(state.query)}" data-input="search">
              </label>
              <button class="tool-button starred" type="button" data-action="favorite" aria-label="精选">${starImg("star-icon")}</button>
              <button class="tool-button" type="button" data-action="more" aria-label="更多">${moreImg("ui-more")}</button>
            </div>
            ${renderLedger(warehouse)}
          </header>

          <div class="content-stage ${state.shelfOpen ? "shelf-open" : ""}">
            <div class="doc-body">
            <nav class="toc" aria-label="目录">
              <h2>目录</h2>
              ${warehouse.chapters.map((chapter, index) => `
                <a class="${chapter[0] === activeTitle ? "active" : ""}" href="#${slug(chapter[0])}">
                  <span>${index + 1}.</span>${chapter[0]}
                </a>
              `).join("")}
            </nav>

            <article class="review-doc">
              ${chapters.length ? chapters.slice(0, 2).map((chapter, index) => renderChapter(chapter, index)).join("") : renderEmpty()}
            </article>
            </div>

            <aside class="shelf-panel shelf-drawer" aria-label="松果架" aria-expanded="${state.shelfOpen}">
              <button class="shelf-toggle" type="button" data-action="toggle-shelf" aria-label="${state.shelfOpen ? "收起松果架" : "展开松果架"}">
                ${pineconeImg("tiny-pinecone")}
                <span>松果架</span>
              </button>
              <div class="shelf-content">
                <div class="shelf-illustration" aria-hidden="true">
                  <span class="shelf-board board-top">${pineconeImg("shelf-pinecone shelf-pinecone-a")}${pineconeImg("shelf-pinecone shelf-pinecone-b")}</span>
                  <span class="shelf-board board-mid">${pineconeImg("shelf-pinecone shelf-pinecone-c")}${pineconeImg("shelf-pinecone shelf-pinecone-d")}</span>
                  <span class="shelf-board board-bottom">${pineconeImg("shelf-pinecone shelf-pinecone-e")}</span>
                </div>
                <h2>松果架</h2>
                <p>分区与复盘文档章节一致。</p>
                ${warehouse.chapters.map((chapter, index) => renderShelfSection(chapter, index)).join("")}
              </div>
            </aside>
          </div>

          <footer class="bottom-toolbar toolbar-dock" aria-label="页面工具栏">
            <div class="toolbar-status">
              ${pineconeImg("tiny-pinecone")}
              <span>当前松果仓：${warehouse.name}</span>
            </div>
            <div class="toolbar-actions">
              <button class="toolbar-button toolbar-item primary" type="button" data-action="reorganize">
                ${leafImg("toolbar-icon")}
                <span><b>重新整理</b><small class="toolbar-meta">AI 重新梳理内容</small></span>
              </button>
              <button class="toolbar-button toolbar-item" type="button" data-action="edit-document">
                ${bookImg("toolbar-icon")}
                <span><b>编辑文档</b><small class="toolbar-meta">修改复盘文档内容</small></span>
              </button>
              <button class="toolbar-button toolbar-item" type="button" data-action="add-pinecone">
                ${plusImg("toolbar-icon")}
                <span><b>添加松果</b><small class="toolbar-meta">放入暂存栏</small></span>
              </button>
              <button class="toolbar-button toolbar-item icon-only" type="button" data-action="toggle-shelf" aria-label="切换松果架">
                ${pineconeImg("toolbar-icon")}
                <span><b>${state.shelfOpen ? "收起" : "松果架"}</b><small class="toolbar-meta">查看分区</small></span>
              </button>
            </div>
          </footer>
        </section>
      </main>
    </section>
  `;

  bindEvents();
}

function renderWarehouseCard(warehouse) {
  const activeClass = warehouse.id === state.activeId ? "active" : "";
  const tempPercent = Math.min(100, Math.round((warehouse.temp.current / warehouse.temp.limit) * 100));
  return `
    <button class="warehouse-card tone-${warehouse.tone} ${activeClass}" type="button" data-warehouse="${warehouse.id}">
      ${pineconeImg("card-pinecone")}
      <span class="badge badge-${warehouse.badge}" aria-hidden="true"></span>
      <strong>${warehouse.name}</strong>
      <small>${pineconeImg("count-pinecone")} ${warehouse.count}</small>
      <em>${warehouse.updated}</em>
      <span class="temp-progress" aria-label="暂存栏 ${warehouse.temp.current}/${warehouse.temp.limit}">
        <span>暂存栏 ${warehouse.temp.current}/${warehouse.temp.limit}</span>
        <b style="width: ${tempPercent}%"></b>
      </span>
      <i></i>
    </button>
  `;
}

function renderLedger(warehouse) {
  return `
    <div class="ledger-strip" aria-label="果仓账簿">
      <span><b>果仓账簿</b></span>
      <span>${pineconeImg("count-pinecone")} ${warehouse.ledger.shelves} 个果架</span>
      <span>${starImg("ledger-star")} ${warehouse.ledger.featured} 颗精选松果</span>
      <span>${warehouse.ledger.mode}</span>
      <time>${warehouse.ledger.lastOrganized}</time>
    </div>
  `;
}

function renderChapter(chapter, index) {
  const [title, note, points] = chapter;
  return `
    <section class="chapter" id="${slug(title)}">
      <h2>${index + 1}. ${title}${leafImg("chapter-leaf")}</h2>
      <p>${note}</p>
      <div class="fake-lines" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      ${index === 0 ? `
        <div class="key-box">
          <h3>${starImg("star-icon")}<span>重点要点</span></h3>
          <ul>${points.map((point) => `<li>${point}</li>`).join("")}</ul>
        </div>
        <div class="green-stitch" aria-hidden="true"></div>
      ` : ""}
    </section>
  `;
}

function renderShelfSection(chapter, index) {
  const [title, note, points] = chapter;
  return `
    <section class="shelf-section">
      <h3><span>${index + 1}. ${title}</span><em class="shelf-count">${points.length} 颗</em></h3>
      <p>${note}</p>
      <ul>${points.map((point) => `<li>${point}</li>`).join("")}</ul>
    </section>
  `;
}

function renderEmpty() {
  return `<div class="empty-state">${pineconeImg("card-pinecone")}<h2>没有找到相关内容</h2><p>换一个关键词试试，松果还在仓库里。</p></div>`;
}

function bindEvents() {
  app.querySelectorAll("[data-warehouse]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeId = button.dataset.warehouse;
      state.query = "";
      state.shelfOpen = false;
      render();
    });
  });

  const searchInput = app.querySelector("[data-input='search']");
  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
    const nextInput = app.querySelector("[data-input='search']");
    nextInput.focus();
    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
  });

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });
}

function handleAction(action) {
  if (action === "toggle-shelf") {
    state.shelfOpen = !state.shelfOpen;
    render();
    return;
  }

  const messages = {
    home: "已经在松鼠仓库首页。",
    new: "这里会新建一个松果仓。",
    "global-search": "这里会搜索全部松果仓。",
    profile: "这里会打开账号设置。",
    favorite: "这里会把当前文档标为精选。",
    more: "这里会展开更多文档操作。",
    reorganize: "这里会重新整理当前松果仓。",
    "edit-document": "这里会进入复盘文档编辑状态。",
    "add-pinecone": "这里会添加一颗新松果。",
  };

  showToast(messages[action] || "功能准备中。");
}

function getActiveWarehouse() {
  return warehouses.find((warehouse) => warehouse.id === state.activeId) || warehouses[0];
}

function getFilteredChapters(chapters) {
  const query = normalize(state.query);
  if (!query) return chapters;

  return chapters.filter(([title, note, points]) => {
    return normalize([title, note, ...points].join("")).includes(query);
  });
}

function normalize(value) {
  return String(value).toLowerCase().replace(/\s+/g, "");
}

function slug(value) {
  return encodeURIComponent(value.replace(/\s+/g, "-"));
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
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}
