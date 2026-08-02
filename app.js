import { removeWarehouse, reorderWarehouses } from "./warehouse-management.js";

const STORAGE_KEY = "squirrel-warehouse-mvp";
const USE_API_ORGANIZER = false;
const TOUCH_DRAG_HOLD_MS = 300;
const TOUCH_DRAG_MOVE_THRESHOLD = 8;
const WAREHOUSE_AUTO_SCROLL_EDGE = 56;
const WAREHOUSE_AUTO_SCROLL_SPEED = 10;

const asset = (name, className, alt = "") =>
  `<img class="${className}" src="assets/illustrations/${name}" alt="${alt}" ${alt ? "" : 'aria-hidden="true"'}>`;

const icons = {
  squirrel: (className) => asset("squirrel-crayon.png", className),
  logo: (className) => asset("squirrel-wencang-logo-ip.png", className, "松鼠文仓 logo"),
  pinecone: (className) => asset("pinecone-icon.png", className),
  leaf: (className) => asset("leaf-crayon.png", className),
  book: (className) => asset("book-crayon.png", className),
  star: (className) => asset("star-crayon.png", className),
  search: (className) => asset("search-crayon.png", className),
  user: (className) => asset("user-crayon.png", className),
  plus: (className) => asset("plus-crayon.png", className),
  more: (className) => asset("more-crayon.png", className),
  grass: (className) => asset("grass-crayon.png", className),
};

const nowText = () => "今天 " + new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) + " 更新";
const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const initialState = {
  version: 5,
  activeWarehouseId: "interview",
  query: "",
  shelfOpen: false,
  addOpen: false,
  editMode: false,
  newPineconeText: "",
  addDestination: "temp",
  selectedShelfId: "",
  newShelfName: "",
  shelfQuery: "",
  editingPineconeId: null,
  referenceIds: [],
  iconCrop: null,
  warehouseDialog: null,
  toast: "",
  warehouses: [
    {
      id: "interview",
      name: "面试经验整理",
      updatedAt: "今天 10:30 更新",
      tempLimit: 5,
      pinecones: [
        { id: "p1", content: "项目经历要写清楚背景、行动和结果，不要只堆技术名词。", status: "shelved", shelfId: "resume", tags: ["重点"], isFeatured: true, createdAt: "07-12 09:41" },
        { id: "p2", content: "简历内容要围绕目标岗位展开，减少无关经历。", status: "shelved", shelfId: "resume", tags: ["可执行"], isFeatured: true, createdAt: "07-12 08:22" },
        { id: "p3", content: "提前把岗位、公司、作品和自我介绍放进同一条线，现场表达会更稳定。", status: "shelved", shelfId: "before", tags: ["重点"], isFeatured: true, createdAt: "07-11 22:15" },
        { id: "p4", content: "每个项目准备 1 分钟版本和 3 分钟展开版本。", status: "shelved", shelfId: "resume", tags: ["可执行"], isFeatured: true, createdAt: "07-11 16:05" },
        { id: "p5", content: "回答问题时先给结论，再补充判断过程和具体例子。", status: "shelved", shelfId: "performance", tags: ["重点"], isFeatured: true, createdAt: "07-11 11:20" },
        { id: "p6", content: "遇到不会的问题，可以说明思路边界，再讲自己会如何继续验证。", status: "shelved", shelfId: "performance", tags: ["可执行"], isFeatured: true, createdAt: "07-11 10:08" },
        { id: "p7", content: "常见问题要提前准备结构，不要背完整稿，避免现场僵硬。", status: "shelved", shelfId: "qa", tags: ["高频"], isFeatured: true, createdAt: "07-10 22:40" },
        { id: "p8", content: "反问环节优先问团队目标、评价标准和岗位真实挑战。", status: "shelved", shelfId: "qa", tags: ["重点"], isFeatured: true, createdAt: "07-10 21:55" },
        { id: "p9", content: "面试后记录被追问最多的部分，下一轮重点补齐。", status: "shelved", shelfId: "follow", tags: ["复盘"], isFeatured: true, createdAt: "07-10 21:10" },
        { id: "p10", content: "每轮结束后写下自己卡住的表达，下一次用更短的句子重讲。", status: "shelved", shelfId: "follow", tags: ["复盘"], isFeatured: true, createdAt: "07-10 20:36" },
        { id: "p11", content: "零散经验先放在补充区，等相似内容多了再合并进正式章节。", status: "shelved", shelfId: "other", tags: ["补充"], isFeatured: true, createdAt: "07-09 18:20" },
        { id: "p12", content: "不确定是否重要的提醒先保留引用，后续复盘时再决定取舍。", status: "shelved", shelfId: "other", tags: ["补充"], isFeatured: true, createdAt: "07-09 17:44" },
      ],
      shelves: [
        { id: "resume", name: "简历准备", description: "把经历整理成岗位能快速理解的讲述线。" },
        { id: "before", name: "面试前准备", description: "让岗位、公司和自我介绍提前对齐。" },
        { id: "performance", name: "面试中的表现", description: "现场表达要稳定、清楚、有来有回。" },
        { id: "qa", name: "常见问题回答思路", description: "把高频问题整理成可复用答案。" },
        { id: "follow", name: "面试后的跟进", description: "用复盘记录修正下一次表达。" },
        { id: "other", name: "其他经验补充", description: "暂时无法归入前面章节的经验。" },
      ],
      reviewDocument: {
        title: "面试经验整理",
        sections: [
          {
            shelfId: "resume",
            heading: "简历准备",
            summary: "简历不是经历堆叠，而是让面试官快速理解你与岗位的关系。",
            bullets: [
              { text: "把项目写成背景、行动、结果的清晰故事，减少空泛技术名词。", pineconeIds: ["p1"] },
              { text: "围绕目标岗位调整表达，让重点经历先被看见。", pineconeIds: ["p2"] },
              { text: "为每个项目准备 1 分钟版本和 3 分钟展开版本。", pineconeIds: ["p4"] },
            ],
          },
          {
            shelfId: "before",
            heading: "面试前准备",
            summary: "提前把岗位、公司、作品和自我介绍放进同一条线，现场表达会更稳定。",
            bullets: [
              { text: "自我介绍先给结论，再补充最能证明匹配度的经历。", pineconeIds: ["p3"] },
              { text: "准备常见问题时，重点整理自己的判断过程和反问要点。", pineconeIds: ["p3"] },
            ],
          },
          {
            shelfId: "performance",
            heading: "面试中的表现",
            summary: "现场表达要稳定、清楚、有来有回，先把对方的问题接住。",
            bullets: [
              { text: "回答问题时先给结论，再补充判断过程和具体例子。", pineconeIds: ["p5"] },
              { text: "遇到不会的问题，说明思路边界并讲清后续验证方式。", pineconeIds: ["p6"] },
            ],
          },
          {
            shelfId: "qa",
            heading: "常见问题回答思路",
            summary: "高频问题不需要背稿，更适合整理成可复用的回答结构。",
            bullets: [
              { text: "提前准备问题结构，保留自然表达空间。", pineconeIds: ["p7"] },
              { text: "反问优先围绕团队目标、评价标准和岗位挑战。", pineconeIds: ["p8"] },
            ],
          },
          {
            shelfId: "follow",
            heading: "面试后的跟进",
            summary: "把被追问和表达卡住的地方记录下来，下一轮有明确补齐点。",
            bullets: [
              { text: "记录被追问最多的部分，下一轮重点补齐。", pineconeIds: ["p9"] },
              { text: "用更短的句子重讲卡住的表达。", pineconeIds: ["p10"] },
            ],
          },
          {
            shelfId: "other",
            heading: "其他经验补充",
            summary: "暂时无法归类的提醒先保留引用，等内容变多后再合并。",
            bullets: [
              { text: "相似经验积累到一定数量后再并入正式章节。", pineconeIds: ["p11"] },
              { text: "不确定是否重要的提醒先保留引用。", pineconeIds: ["p12"] },
            ],
          },
        ],
      },
    },
    makeWarehouse("reading", "《被讨厌的勇气》摘抄", "昨天 21:15 更新", [
      "课题分离能让人分清自己的选择和他人的评价。",
      "自由常常伴随被评价的风险。",
      "自我接纳不是放弃，而是从真实处境开始行动。",
    ]),
    makeWarehouse("product", "产品设计灵感", "07-11 16:40 更新", [
      "用户想保存和复盘，而不是先填写目标或选择模板。",
      "复盘文档越像自然文章，越需要保留原始松果入口。",
    ]),
    makeWarehouse("study", "工作学习笔记", "07-10 09:20 更新", [
      "把模糊任务拆成可执行的下一步，能降低开始成本。",
      "等待外部反馈的事项要单独标出。",
    ]),
    makeWarehouse("life", "生活中的小确幸", "07-09 22:18 更新", [
      "记录当时的场景，比只写结论更容易唤起记忆。",
      "同类小事可以归到同一个章节里。",
    ]),
  ],
};

let state = loadState();
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let draggedWarehouseId = "";
let warehouseDragStartedFromButton = false;
let touchWarehouseDrag = null;
let warehouseAutoScrollFrame = 0;

document.addEventListener("touchmove", preventActiveWarehouseTouchScroll, { passive: false });
render();

function makeWarehouse(id, name, updatedAt, contents) {
  const pinecones = contents.map((content, index) => ({
    id: `${id}_p${index + 1}`,
    content,
    status: "shelved",
    shelfId: index === 0 ? "main" : "notes",
    tags: index === 0 ? ["重点"] : ["摘录"],
    isFeatured: index === 0,
    createdAt: `07-${12 - index} ${index ? "21:15" : "16:40"}`,
  }));

  return {
    id,
    name,
    updatedAt,
    tempLimit: 5,
    pinecones,
    shelves: [
      { id: "main", name: name.includes("摘抄") ? "核心观点" : "主要线索", description: "最适合放入复盘文档的内容。" },
      { id: "notes", name: "补充记录", description: "保留上下文和后续可展开的材料。" },
    ],
    reviewDocument: buildReviewDocument(name, [
      {
        shelfId: "main",
        heading: name.includes("摘抄") ? "先把关键观点收拢起来" : "先抓住最重要的线索",
        summary: "这部分把当前仓库里最值得回看的松果整理成一段清楚的复盘。",
        bullets: pinecones.slice(0, 2).map((pinecone) => ({ text: pinecone.content, pineconeIds: [pinecone.id] })),
      },
    ]),
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.version === initialState.version && Array.isArray(saved?.warehouses)) {
      return {
        ...initialState,
        ...saved,
        toast: "",
        referenceIds: [],
        newPineconeText: "",
        addDestination: "temp",
        selectedShelfId: "",
        newShelfName: "",
        shelfQuery: "",
        editingPineconeId: null,
        warehouseDialog: null,
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return structuredClone(initialState);
}

function saveState() {
  const {
    toast: _toast,
    referenceIds: _referenceIds,
    iconCrop: _iconCrop,
    editMode: _editMode,
    warehouseDialog: _warehouseDialog,
    ...persisted
  } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function getActiveWarehouse() {
  return state.warehouses.find((warehouse) => warehouse.id === state.activeWarehouseId)
    || state.warehouses[0]
    || null;
}

function render() {
  const warehouse = getActiveWarehouse();
  if (!warehouse) {
    app.innerHTML = renderEmptyWarehouseState();
    bindEvents();
    renderToast();
    return;
  }

  const tempCount = warehouse.pinecones.filter((pinecone) => pinecone.status === "temp").length;
  const featuredCount = warehouse.pinecones.filter((pinecone) => pinecone.isFeatured).length;

  app.innerHTML = `
    <section class="page-shell">
      <header class="topbar">
        <div class="brand">
          ${icons.logo("brand-squirrel")}
          <div>
            <h1>松鼠文仓</h1>
            <p>把零散松果整理成可复盘的文档 ${icons.leaf("brand-leaf")}</p>
          </div>
        </div>
        <div class="top-actions">
          <button class="round-button" type="button" data-action="focus-search" aria-label="搜索">${icons.search("icon-img")}</button>
          <button class="round-button" type="button" aria-label="账户">${icons.user("icon-img")}</button>
        </div>
      </header>

      <aside class="warehouse-panel">
        <div class="panel-head">
          <h2>松果仓列表</h2>
          <button class="icon-button green" type="button" data-action="create-warehouse" aria-label="新建松果仓">${icons.plus("icon-img")}</button>
        </div>
        <div class="warehouse-list">
          ${state.warehouses.map(renderWarehouseCard).join("")}
        </div>
      </aside>

      <main class="document-panel">
        <section class="document-card">
          <header class="doc-head">
            <div class="doc-title">
              ${asset("pinecone-warehouse-icon.png", "book-icon")}
              <div>
                <h2>${escapeHtml(warehouse.reviewDocument.title)}</h2>
                <div class="title-underline"></div>
              </div>
            </div>
            <div class="doc-actions">
              <label class="search-box">
                ${icons.search("search-icon")}
                <input id="doc-search" type="search" placeholder="搜索文档内容..." value="${escapeHtml(state.query)}" data-input="search">
              </label>
              <button class="tool-button" type="button" aria-label="精选">${icons.star("tool-img")}</button>
              <button class="tool-button" type="button" aria-label="更多">${icons.more("tool-img more")}</button>
            </div>
            <div class="chips">
              <span>${icons.book("chip-img")} ${warehouse.reviewDocument.sections.length} 个章节</span>
              <span>${icons.star("chip-img")} ${featuredCount} 颗精选松果</span>
              <span><b class="clock-dot"></b>${escapeHtml(warehouse.updatedAt)}</span>
              <span class="${tempCount >= warehouse.tempLimit ? "chip-hot" : ""}">暂存栏 ${tempCount}/${warehouse.tempLimit}</span>
            </div>
          </header>

          ${tempCount >= warehouse.tempLimit ? renderTemporaryShelfNotice(tempCount) : ""}

          <div class="content-wrap">
            <nav class="toc" aria-label="目录">
              <h3>目录</h3>
              ${warehouse.reviewDocument.sections.map((section, index) => `
                <button class="${index === 0 ? "active" : ""}" type="button">
                  <span>${index + 1}. ${escapeHtml(section.heading)}</span>
                  ${index === 0 ? "<b></b>" : ""}
                </button>
              `).join("")}
            </nav>
            <article class="review-doc">
              ${renderReviewDocument(warehouse)}
            </article>
          </div>

          ${state.addOpen ? renderAddPanel(warehouse) : ""}
          ${renderShelfDrawer(warehouse)}

          ${renderToolbar()}
        </section>
      </main>
    </section>

    <input id="warehouse-icon-file" type="file" accept="image/*" hidden>
    ${state.iconCrop ? renderIconCropModal() : ""}
    ${state.warehouseDialog ? renderWarehouseDialog() : ""}
  `;

  bindEvents();
  renderToast();
}

function renderEmptyWarehouseState() {
  return `
    <section class="page-shell empty-warehouse-shell">
      <header class="topbar">
        <div class="brand">
          ${icons.logo("brand-squirrel")}
          <div>
            <h1>松鼠文仓</h1>
            <p>把零散松果整理成可复盘的文档 ${icons.leaf("brand-leaf")}</p>
          </div>
        </div>
      </header>
      <main class="warehouse-empty-state">
        ${icons.logo("empty-warehouse-squirrel")}
        <h2>还没有松鼠仓</h2>
        <p>新建一个松鼠仓，开始收集和整理松果。</p>
        <button class="primary-button" type="button" data-action="create-warehouse">新建松鼠仓</button>
      </main>
    </section>
    ${state.warehouseDialog ? renderWarehouseDialog() : ""}
  `;
}

function renderWarehouseCard(warehouse) {
  const active = warehouse.id === state.activeWarehouseId;
  return `
    <article class="warehouse-card ${active ? "active" : ""}"
      data-warehouse-card="${warehouse.id}" draggable="true">
      <button class="warehouse-icon-button" type="button" data-icon-target="${warehouse.id}" aria-label="自定义 ${escapeHtml(warehouse.name)} 图标">
        ${renderWarehouseIcon(warehouse)}
      </button>
      <button class="warehouse-copy" type="button" data-warehouse="${warehouse.id}">
        <strong>${escapeHtml(warehouse.name)}</strong>
        <small>${escapeHtml(warehouse.updatedAt)}</small>
      </button>
      ${active ? '<i class="active-dot"></i>' : ""}
      <button class="warehouse-delete-button" type="button"
        data-action="delete-warehouse" data-warehouse-id="${warehouse.id}"
        aria-label="删除 ${escapeHtml(warehouse.name)}">×</button>
    </article>
  `;
}

function renderWarehouseIcon(warehouse) {
  if (warehouse.iconDataUrl) {
    return `<img class="warehouse-icon custom-warehouse-icon" src="${warehouse.iconDataUrl}" alt="">`;
  }

  return asset("pinecone-warehouse-icon.png", "warehouse-icon");
}

function renderShelfIcon(className) {
  return asset("pinecone-shelf-icon.png", className);
}

function renderToolbar() {
  return `
    <div class="document-toolbar-tab">
      <footer class="bottom-toolbar" data-toolbar>
        ${asset("squirrel-toolbar-perched.png", "toolbar-mascot")}
        <button type="button" data-action="toggle-add">${icons.plus("toolbar-img add")}<b>添加松果</b></button>
        <button type="button" data-action="toggle-document-edit">${icons.book("toolbar-img")}<b>${state.editMode ? "保存文档" : "编辑文档"}</b></button>
        <button type="button" data-action="reorganize">${icons.leaf("toolbar-img")}<b>全部重新整理</b></button>
      </footer>
    </div>
  `;
}
function renderIconCropModal() {
  return `
    <div class="modal-backdrop" data-action="cancel-icon-crop">
      <section class="icon-crop-modal" role="dialog" aria-modal="true" aria-label="调整松果仓图标">
        <header>
          <h3>调整图标圆形区域</h3>
          <button type="button" data-action="cancel-icon-crop" aria-label="关闭">×</button>
        </header>
        <div class="crop-stage">
          <div class="crop-preview">
            <img src="${state.iconCrop.dataUrl}" alt="" style="transform: translate(${state.iconCrop.offsetX}px, ${state.iconCrop.offsetY}px) scale(${state.iconCrop.zoom / 100});">
          </div>
        </div>
        <label>左右 <input type="range" min="-100" max="100" value="${state.iconCrop.offsetX}" data-crop-input="offsetX"></label>
        <label>上下 <input type="range" min="-100" max="100" value="${state.iconCrop.offsetY}" data-crop-input="offsetY"></label>
        <label>缩放 <input type="range" min="70" max="220" value="${state.iconCrop.zoom}" data-crop-input="zoom"></label>
        <footer>
          <button type="button" data-action="cancel-icon-crop">取消</button>
          <button class="primary-action" type="button" data-action="save-icon-crop">保存图标</button>
        </footer>
      </section>
    </div>
  `;
}

function renderWarehouseDialog() {
  const dialog = state.warehouseDialog;
  if (!dialog) return "";

  const isCreate = dialog.type === "create";
  const warehouse = isCreate
    ? null
    : state.warehouses.find((item) => item.id === dialog.warehouseId);
  if (!isCreate && !warehouse) return "";

  return `
    <div class="modal-backdrop warehouse-dialog-backdrop">
      <section class="warehouse-dialog" role="dialog" aria-modal="true" aria-labelledby="warehouse-dialog-title">
        <header>
          <h3 id="warehouse-dialog-title">${isCreate ? "新建松果仓" : "删除松果仓"}</h3>
        </header>
        ${isCreate ? `
          <label for="warehouse-name-input">松果仓名称</label>
          <input id="warehouse-name-input" type="text" data-input="warehouse-name" autocomplete="off" required>
        ` : `
          <p>确定删除“${escapeHtml(warehouse.name)}”吗？仓内松果和整理文档会一并删除。</p>
        `}
        <footer>
          <button type="button" data-action="cancel-warehouse-dialog">取消</button>
          ${isCreate
            ? '<button class="primary-action" type="button" data-action="confirm-create-warehouse">创建</button>'
            : '<button class="primary-action danger-action" type="button" data-action="confirm-delete-warehouse">确认删除</button>'}
        </footer>
      </section>
    </div>
  `;
}

function renderTemporaryShelfNotice(tempCount) {
  return `
    <div class="organize-notice">
      <strong>暂存栏已有 ${tempCount} 颗松果。</strong>
      <span>需要整体更新时，可以使用底部工具栏的“全部重新整理”。</span>
      <button type="button" data-action="dismiss-notice">稍后</button>
    </div>
  `;
}

function renderReviewDocument(warehouse) {
  const sections = getFilteredSections(warehouse);
  if (!sections.length) {
    return `
      <div class="empty-doc">
        ${icons.pinecone("empty-pine")}
        <h3>还没有匹配的复盘内容</h3>
        <p>换个关键词，或添加新的松果后再整理。</p>
      </div>
    `;
  }

  return sections.map((section, index) => `
    <section class="doc-section" data-section-index="${index}">
      <h3>
        <span class="${state.editMode ? "editable-field" : ""}" ${state.editMode ? `contenteditable="true" data-edit-field="heading" data-section-index="${index}"` : ""}>${index + 1}. ${escapeHtml(section.heading)}</span>
        ${icons.leaf("section-leaf")}
      </h3>
      <p class="${state.editMode ? "editable-field" : ""}" ${state.editMode ? `contenteditable="true" data-edit-field="summary" data-section-index="${index}"` : ""}>${escapeHtml(section.summary)}</p>
      ${index === 0 ? renderKeyBox(section, index) : ""}
      <div class="soft-lines"><i></i><i></i><i></i></div>
    </section>
  `).join("");
}

function renderKeyBox(section, sectionIndex) {
  return `
    <div class="key-box">
      <h4>${icons.star("key-star")} 重点要点</h4>
      <ul>
        ${section.bullets.map((bullet, bulletIndex) => `
          <li>
            <span></span>
            <div class="key-item">
              <span class="${state.editMode ? "editable-field" : ""}" ${state.editMode ? `contenteditable="true" data-edit-field="bullet" data-section-index="${sectionIndex}" data-bullet-index="${bulletIndex}"` : ""}>${escapeHtml(bullet.text)}</span>
            </div>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

function renderAddPanel(warehouse) {
  const tempCount = warehouse.pinecones.filter((pinecone) => pinecone.status === "temp").length;
  const selectedShelfId = state.selectedShelfId || warehouse.shelves[0]?.id || "";
  return `
    <aside class="add-panel">
      <div>
        <h3>添加松果</h3>
        <button type="button" data-action="toggle-add" aria-label="关闭">×</button>
      </div>
      <textarea data-input="pinecone" placeholder="粘贴一段经验、摘抄、灵感或聊天记录...">${escapeHtml(state.newPineconeText)}</textarea>
      <fieldset class="add-destination">
        <legend>选择去向</legend>
        <label><input type="radio" name="add-destination" value="temp" ${state.addDestination === "temp" ? "checked" : ""}> 暂存栏</label>
        <label><input type="radio" name="add-destination" value="existing" ${state.addDestination === "existing" ? "checked" : ""}> 已有素材栏</label>
        <label><input type="radio" name="add-destination" value="new" ${state.addDestination === "new" ? "checked" : ""}> 新建素材栏</label>
      </fieldset>
      ${state.addDestination === "existing" ? `
        <label class="add-field">素材栏
          <select data-input="selected-shelf">
            ${warehouse.shelves.map((shelf) => `<option value="${shelf.id}" ${selectedShelfId === shelf.id ? "selected" : ""}>${escapeHtml(shelf.name)}</option>`).join("")}
          </select>
        </label>
      ` : ""}
      ${state.addDestination === "new" ? `
        <label class="add-field">新素材栏名称
          <input type="text" data-input="new-shelf-name" placeholder="例如：面试表达" value="${escapeHtml(state.newShelfName)}">
        </label>
      ` : ""}
      <p>${state.addDestination === "temp" ? `添加后只保存原始松果，不更新复盘文档。当前暂存栏 ${tempCount}/${warehouse.tempLimit}。` : "添加后会更新对应文档分区，不影响其他分区。"}</p>
      <button class="primary-action" type="button" data-action="add-pinecone">添加松果</button>
    </aside>
  `;
}

function renderShelfDrawer(warehouse) {
  const query = state.shelfQuery.trim();
  const shelves = [
    {
      id: "temp",
      name: "暂存栏",
      description: "暂时保存原始松果，不更新复盘文档。",
      pinecones: warehouse.pinecones.filter((pinecone) => pinecone.status === "temp"),
    },
    ...warehouse.shelves.map((shelf) => ({
      ...shelf,
      pinecones: warehouse.pinecones.filter((pinecone) => pinecone.shelfId === shelf.id && pinecone.status === "shelved"),
    })),
  ].map((shelf) => ({
    ...shelf,
    pinecones: query ? shelf.pinecones.filter((pinecone) => pinecone.content.includes(query)) : shelf.pinecones,
  }));

  return `
    <aside class="shelf-drawer ${state.shelfOpen ? "open" : ""}">
      <button class="shelf-tab" type="button" data-action="toggle-shelf">
        ${renderShelfIcon("drawer-shelf-icon")}
        ${icons.pinecone("shelf-tab-pinecone")}
        <span>松果架</span>
      </button>
      <div class="shelf-content">
        <header class="shelf-rack-header">
          <h3>松果架</h3>
          <p>查看和管理处理前的原始松果。</p>
          <label class="shelf-search">搜索松果
            <input type="search" data-input="shelf-search" value="${escapeHtml(state.shelfQuery)}" placeholder="搜索松果">
          </label>
        </header>
        <div class="shelf-rack-body">
          ${shelves.map((shelf) => renderShelfSection(shelf, warehouse)).join("")}
        </div>
      </div>
    </aside>
  `;
}

function renderShelfSection(shelf, warehouse) {
  return `
    <section class="shelf-section">
      <div class="shelf-section-head">
        <strong>${escapeHtml(shelf.name)}</strong>
        <small>${shelf.pinecones.length} 颗松果</small>
      </div>
      <p>${escapeHtml(shelf.description)}</p>
      <div class="shelf-pinecones">
        ${shelf.pinecones.length ? shelf.pinecones.map((pinecone) => renderShelfPinecone(pinecone, warehouse)).join("") : '<em class="empty-shelf">这里还没有松果</em>'}
      </div>
    </section>
  `;
}

function renderShelfPinecone(pinecone, warehouse) {
  const isEditing = state.editingPineconeId === pinecone.id;
  return `
    <article class="shelf-pinecone">
      ${isEditing ? `
        <textarea data-input="pinecone-edit" data-pinecone-id="${pinecone.id}">${escapeHtml(pinecone.content)}</textarea>
        <div class="pinecone-actions">
          <button type="button" data-action="save-pinecone" data-pinecone-id="${pinecone.id}">保存</button>
          <button type="button" data-action="cancel-pinecone-edit">取消</button>
        </div>
      ` : `
        <p>${escapeHtml(pinecone.content)}</p>
        <time>${escapeHtml(pinecone.createdAt)}</time>
        <label class="move-control">移动到
          <select data-action="move-pinecone" data-pinecone-id="${pinecone.id}">
            <option value="temp" ${pinecone.status === "temp" ? "selected" : ""}>暂存栏</option>
            ${warehouse.shelves.map((shelf) => `<option value="${shelf.id}" ${pinecone.shelfId === shelf.id ? "selected" : ""}>${escapeHtml(shelf.name)}</option>`).join("")}
          </select>
        </label>
        <div class="pinecone-actions">
          <button type="button" data-action="edit-pinecone" data-pinecone-id="${pinecone.id}">编辑</button>
          <button type="button" data-action="delete-pinecone" data-pinecone-id="${pinecone.id}">删除</button>
        </div>
      `}
    </article>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-icon-target]").forEach((button) => {
    button.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openIconPicker(button.dataset.iconTarget);
    });
  });

  document.querySelectorAll("[data-warehouse]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeWarehouseId = button.dataset.warehouse;
      state.query = "";
      state.addOpen = false;
      state.editMode = false;
      state.iconCrop = null;
      saveState();
      render();
    });
  });

  document.querySelector("#warehouse-icon-file")?.addEventListener("change", handleIconFileSelected);

  document.querySelectorAll("[data-crop-input]").forEach((input) => {
    input.addEventListener("input", () => {
      updateIconCrop(input.dataset.cropInput, Number(input.value));
    });
  });

  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", (event) => {
      const action = element.dataset.action;
      if (action === "toggle-add") {
        state.addOpen = !state.addOpen;
        state.editMode = false;
        render();
      }
      if (action === "toggle-document-edit") {
        toggleDocumentEdit();
      }
      if (action === "toggle-shelf") {
        state.shelfOpen = !state.shelfOpen;
        render();
      }
      if (action === "add-pinecone") {
        addPinecone();
      }
      if (action === "reorganize") {
        organizeWarehouse("reorganize");
      }
      if (action === "create-warehouse") {
        createWarehouse();
      }
      if (action === "delete-warehouse") {
        event.stopPropagation();
        deleteWarehouse(element.dataset.warehouseId);
      }
      if (action === "cancel-warehouse-dialog") {
        cancelWarehouseDialog();
      }
      if (action === "confirm-create-warehouse") {
        confirmCreateWarehouse();
      }
      if (action === "confirm-delete-warehouse") {
        confirmDeleteWarehouse();
      }
      if (action === "focus-search") {
        document.querySelector("#doc-search")?.focus();
      }
      if (action === "dismiss-notice") {
        showToast("新松果会继续留在暂存栏。");
      }
      if (action === "cancel-icon-crop") {
        if (event.target === element || element.tagName === "BUTTON") {
          state.iconCrop = null;
          render();
        }
      }
      if (action === "save-icon-crop") {
        saveWarehouseIcon();
      }
      if (action === "edit-pinecone") {
        state.editingPineconeId = element.dataset.pineconeId;
        render();
      }
      if (action === "cancel-pinecone-edit") {
        state.editingPineconeId = null;
        render();
      }
      if (action === "save-pinecone") {
        savePineconeEdit(element.dataset.pineconeId);
      }
      if (action === "delete-pinecone") {
        deletePinecone(element.dataset.pineconeId);
      }
    });
  });

  document.querySelectorAll("[data-edit-field]").forEach((field) => {
    field.addEventListener("input", () => updateDocumentDraft(field));
  });

  document.querySelector("[data-input='search']")?.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  document.querySelector("[data-input='pinecone']")?.addEventListener("input", (event) => {
    state.newPineconeText = event.target.value;
  });

  document.querySelector("[data-input='warehouse-name']")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmCreateWarehouse();
    }
  });

  document.querySelectorAll("input[name='add-destination']").forEach((input) => {
    input.addEventListener("change", () => {
      state.addDestination = input.value;
      render();
    });
  });

  document.querySelector("[data-input='selected-shelf']")?.addEventListener("change", (event) => {
    state.selectedShelfId = event.target.value;
  });

  document.querySelector("[data-input='new-shelf-name']")?.addEventListener("input", (event) => {
    state.newShelfName = event.target.value;
  });

  document.querySelector("[data-input='shelf-search']")?.addEventListener("input", (event) => {
    state.shelfQuery = event.target.value;
    render();
  });

  document.querySelectorAll("[data-action='move-pinecone']").forEach((select) => {
    select.addEventListener("change", () => {
      movePinecone(select.dataset.pineconeId, select.value);
    });
  });

  bindWarehouseDragEvents();
}

function bindWarehouseDragEvents() {
  document.querySelectorAll("[data-warehouse-card]").forEach((card) => {
    card.addEventListener("pointerdown", (event) => {
      if (touchWarehouseDrag) {
        if (event.pointerType === "touch") {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      warehouseDragStartedFromButton = Boolean(event.target.closest("button"));
      if (warehouseDragStartedFromButton || event.pointerType !== "touch") return;

      touchWarehouseDrag = {
        pointerId: event.pointerId,
        sourceId: card.dataset.warehouseCard,
        startX: event.clientX,
        startY: event.clientY,
        clientX: event.clientX,
        clientY: event.clientY,
        targetId: "",
        placement: "before",
        active: false,
        activationTimer: window.setTimeout(() => {
          activateTouchWarehouseDrag(card, event.pointerId);
        }, TOUCH_DRAG_HOLD_MS),
      };
    }, { capture: true });

    card.addEventListener("dragstart", (event) => {
      if (warehouseDragStartedFromButton) {
        event.preventDefault();
        return;
      }
      if (touchWarehouseDrag) {
        event.preventDefault();
        return;
      }
      draggedWarehouseId = card.dataset.warehouseCard;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedWarehouseId);
    });

    card.addEventListener("pointermove", (event) => {
      if (!touchWarehouseDrag || event.pointerId !== touchWarehouseDrag.pointerId || event.pointerType !== "touch") return;
      touchWarehouseDrag.clientX = event.clientX;
      touchWarehouseDrag.clientY = event.clientY;

      if (!touchWarehouseDrag.active) {
        const distance = Math.hypot(
          event.clientX - touchWarehouseDrag.startX,
          event.clientY - touchWarehouseDrag.startY,
        );
        if (distance > TOUCH_DRAG_MOVE_THRESHOLD) {
          clearWarehouseDragState();
        }
        return;
      }

      event.preventDefault();
      updateTouchWarehouseDropTarget(event.clientX, event.clientY);
      startWarehouseAutoScroll();
    });

    card.addEventListener("pointerup", (event) => {
      warehouseDragStartedFromButton = false;
      finishTouchWarehouseDrag(card, event, true);
    });

    card.addEventListener("pointercancel", (event) => {
      warehouseDragStartedFromButton = false;
      finishTouchWarehouseDrag(card, event, false);
    });

    card.addEventListener("lostpointercapture", (event) => {
      if (touchWarehouseDrag?.active && event.pointerId === touchWarehouseDrag.pointerId) {
        clearWarehouseDragState();
      }
    });

    card.addEventListener("dragover", (event) => {
      if (!draggedWarehouseId || draggedWarehouseId === card.dataset.warehouseCard) return;
      event.preventDefault();
      clearWarehouseDropIndicators();
      const rect = card.getBoundingClientRect();
      card.classList.add(event.clientY < rect.top + rect.height / 2 ? "drop-before" : "drop-after");
    });

    card.addEventListener("drop", (event) => {
      event.preventDefault();
      const placement = card.classList.contains("drop-after") ? "after" : "before";
      const next = reorderWarehouses(state.warehouses, draggedWarehouseId, card.dataset.warehouseCard, placement);
      if (next !== state.warehouses) {
        state.warehouses = next;
        saveState();
        render();
      }
      clearWarehouseDragState();
    });

    card.addEventListener("dragend", clearWarehouseDragState);
  });
}

function activateTouchWarehouseDrag(card, pointerId) {
  if (!touchWarehouseDrag || touchWarehouseDrag.pointerId !== pointerId) return;
  if (!card.isConnected) {
    clearWarehouseDragState();
    return;
  }

  touchWarehouseDrag.active = true;
  touchWarehouseDrag.activationTimer = 0;
  draggedWarehouseId = touchWarehouseDrag.sourceId;
  card.classList.add("dragging");
  card.setPointerCapture(pointerId);
  updateTouchWarehouseDropTarget(touchWarehouseDrag.clientX, touchWarehouseDrag.clientY);
  startWarehouseAutoScroll();
}

function preventActiveWarehouseTouchScroll(event) {
  if (touchWarehouseDrag?.active) {
    event.preventDefault();
  }
}

function updateTouchWarehouseDropTarget(clientX, clientY) {
  if (!touchWarehouseDrag?.active) return;

  clearWarehouseDropIndicators();
  const targetCard = document.elementFromPoint(clientX, clientY)?.closest("[data-warehouse-card]");
  touchWarehouseDrag.targetId = "";
  if (!targetCard || targetCard.dataset.warehouseCard === touchWarehouseDrag.sourceId) return;

  const rect = targetCard.getBoundingClientRect();
  touchWarehouseDrag.targetId = targetCard.dataset.warehouseCard;
  touchWarehouseDrag.placement = clientY < rect.top + rect.height / 2 ? "before" : "after";
  targetCard.classList.add(`drop-${touchWarehouseDrag.placement}`);
}

function startWarehouseAutoScroll() {
  if (warehouseAutoScrollFrame || !touchWarehouseDrag?.active) return;
  warehouseAutoScrollFrame = requestAnimationFrame(runWarehouseAutoScroll);
}

function runWarehouseAutoScroll() {
  warehouseAutoScrollFrame = 0;
  if (!touchWarehouseDrag?.active) return;

  const { clientX, clientY } = touchWarehouseDrag;
  const warehouseList = document.querySelector(".warehouse-list");
  let didScrollX = false;
  let didScrollY = false;

  if (warehouseList) {
    const rect = warehouseList.getBoundingClientRect();
    const deltaX = getWarehouseAutoScrollDelta(clientX, rect.left, rect.right);
    const deltaY = getWarehouseAutoScrollDelta(clientY, rect.top, rect.bottom);
    if (deltaX) {
      const previousScrollLeft = warehouseList.scrollLeft;
      warehouseList.scrollLeft += deltaX;
      didScrollX = warehouseList.scrollLeft !== previousScrollLeft;
    }
    if (deltaY) {
      const previousScrollTop = warehouseList.scrollTop;
      warehouseList.scrollTop += deltaY;
      didScrollY = warehouseList.scrollTop !== previousScrollTop;
    }
  }

  if (!didScrollX || !didScrollY) {
    const deltaX = didScrollX ? 0 : getWarehouseAutoScrollDelta(clientX, 0, window.innerWidth);
    const deltaY = didScrollY ? 0 : getWarehouseAutoScrollDelta(clientY, 0, window.innerHeight);
    if (deltaX || deltaY) {
      const previousScrollX = window.scrollX;
      const previousScrollY = window.scrollY;
      window.scrollBy(deltaX, deltaY);
      didScrollX = didScrollX || window.scrollX !== previousScrollX;
      didScrollY = didScrollY || window.scrollY !== previousScrollY;
    }
  }

  updateTouchWarehouseDropTarget(clientX, clientY);
  if (didScrollX || didScrollY) startWarehouseAutoScroll();
}

function getWarehouseAutoScrollDelta(coordinate, start, end) {
  if (coordinate < start + WAREHOUSE_AUTO_SCROLL_EDGE) return -WAREHOUSE_AUTO_SCROLL_SPEED;
  if (coordinate > end - WAREHOUSE_AUTO_SCROLL_EDGE) return WAREHOUSE_AUTO_SCROLL_SPEED;
  return 0;
}

function stopWarehouseAutoScroll() {
  if (!warehouseAutoScrollFrame) return;
  cancelAnimationFrame(warehouseAutoScrollFrame);
  warehouseAutoScrollFrame = 0;
}

function finishTouchWarehouseDrag(card, event, shouldReorder) {
  if (!touchWarehouseDrag || event.pointerId !== touchWarehouseDrag.pointerId || event.pointerType !== "touch") return;

  const { sourceId, targetId, placement, active } = touchWarehouseDrag;
  if (active && card.hasPointerCapture(event.pointerId)) {
    card.releasePointerCapture(event.pointerId);
  }
  clearWarehouseDragState();

  if (!shouldReorder || !active || !targetId) return;
  const next = reorderWarehouses(state.warehouses, sourceId, targetId, placement);
  if (next !== state.warehouses) {
    state.warehouses = next;
    saveState();
    render();
  }
}

function clearWarehouseDropIndicators() {
  document.querySelectorAll(".drop-before, .drop-after").forEach((card) => {
    card.classList.remove("drop-before", "drop-after");
  });
}

function clearWarehouseDragState() {
  if (touchWarehouseDrag?.activationTimer) {
    window.clearTimeout(touchWarehouseDrag.activationTimer);
  }
  stopWarehouseAutoScroll();
  draggedWarehouseId = "";
  warehouseDragStartedFromButton = false;
  touchWarehouseDrag = null;
  document.querySelectorAll(".warehouse-card").forEach((card) => {
    card.classList.remove("dragging", "drop-before", "drop-after");
  });
}

function openIconPicker(warehouseId) {
  const input = document.querySelector("#warehouse-icon-file");
  if (!input) return;
  input.dataset.warehouseId = warehouseId;
  input.value = "";
  input.click();
}

function handleIconFileSelected(event) {
  const file = event.target.files?.[0];
  const warehouseId = event.target.dataset.warehouseId;
  if (!file || !warehouseId) return;
  if (!file.type.startsWith("image/")) {
    showToast("请选择图片文件。");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.iconCrop = {
      warehouseId,
      dataUrl: String(reader.result),
      offsetX: 0,
      offsetY: 0,
      zoom: 100,
    };
    render();
  });
  reader.readAsDataURL(file);
}

function updateIconCrop(key, value) {
  if (!state.iconCrop) return;
  state.iconCrop = { ...state.iconCrop, [key]: value };
  render();
}

async function saveWarehouseIcon() {
  if (!state.iconCrop) return;
  const warehouse = state.warehouses.find((item) => item.id === state.iconCrop.warehouseId);
  if (!warehouse) return;

  const image = await loadImage(state.iconCrop.dataUrl);
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);
  context.save();
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  context.clip();
  const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight) * (state.iconCrop.zoom / 100);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const drawX = (size - drawWidth) / 2 + state.iconCrop.offsetX;
  const drawY = (size - drawHeight) / 2 + state.iconCrop.offsetY;
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  context.restore();

  warehouse.iconDataUrl = canvas.toDataURL("image/png");
  warehouse.updatedAt = nowText();
  state.iconCrop = null;
  saveState();
  showToast("松果仓图标已保存。");
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function toggleDocumentEdit() {
  if (state.editMode) {
    saveDocumentEdits();
    return;
  }

  state.editMode = true;
  state.addOpen = false;
  render();
}

function updateDocumentDraft(field) {
  const warehouse = getActiveWarehouse();
  const section = warehouse.reviewDocument.sections[Number(field.dataset.sectionIndex)];
  if (!section) return;
  const value = field.textContent.trim().replace(/^\d+\.\s*/, "");

  if (field.dataset.editField === "heading") {
    section.heading = value || section.heading;
  }
  if (field.dataset.editField === "summary") {
    section.summary = value;
  }
  if (field.dataset.editField === "bullet") {
    const bullet = section.bullets[Number(field.dataset.bulletIndex)];
    if (bullet) bullet.text = value;
  }
  warehouse.updatedAt = nowText();
}

function saveDocumentEdits() {
  state.editMode = false;
  saveState();
  showToast("复盘文档已保存。");
}

function addPinecone() {
  const warehouse = getActiveWarehouse();
  const content = state.newPineconeText.trim();
  if (!content) {
    showToast("先放入一段松果内容。");
    return;
  }

  let status = "temp";
  let shelfId = null;
  let shelfName = "暂存栏";

  if (state.addDestination === "existing") {
    const shelf = warehouse.shelves.find((item) => item.id === (state.selectedShelfId || warehouse.shelves[0]?.id));
    if (!shelf) {
      showToast("请先选择一个素材栏。");
      return;
    }
    status = "shelved";
    shelfId = shelf.id;
    shelfName = shelf.name;
  }

  if (state.addDestination === "new") {
    const name = state.newShelfName.trim();
    if (!name) {
      showToast("请填写新素材栏名称。");
      return;
    }
    const newShelf = {
      id: uid("shelf"),
      name,
      description: `围绕“${name}”补充的原始松果。`,
    };
    warehouse.shelves.push(newShelf);
    status = "shelved";
    shelfId = newShelf.id;
    shelfName = newShelf.name;
  }

  warehouse.pinecones.unshift({
    id: uid("pinecone"),
    content,
    status,
    shelfId,
    isFeatured: false,
    createdAt: nowText().replace(" 更新", ""),
  });

  if (status === "shelved") {
    updateReviewSectionForShelf(warehouse, shelfId);
  }

  warehouse.updatedAt = nowText();
  state.newPineconeText = "";
  state.newShelfName = "";
  state.addDestination = "temp";
  state.selectedShelfId = "";
  state.addOpen = false;
  saveState();
  showToast(status === "temp" ? "已放入暂存栏。" : `已放入“${shelfName}”，对应文档分区已更新。`);
}

function movePinecone(pineconeId, destinationId) {
  const warehouse = getActiveWarehouse();
  const pinecone = warehouse.pinecones.find((item) => item.id === pineconeId);
  if (!pinecone) return;
  const previousShelfId = pinecone.shelfId;

  if (destinationId === "temp") {
    pinecone.status = "temp";
    pinecone.shelfId = null;
  } else {
    pinecone.status = "shelved";
    pinecone.shelfId = destinationId;
    updateReviewSectionForShelf(warehouse, destinationId);
  }

  if (previousShelfId && previousShelfId !== destinationId) {
    updateReviewSectionForShelf(warehouse, previousShelfId);
  }

  warehouse.updatedAt = nowText();
  saveState();
  showToast(destinationId === "temp" ? "已移动到暂存栏。" : "已移动到素材栏，对应分区已更新。");
}

function savePineconeEdit(pineconeId) {
  const warehouse = getActiveWarehouse();
  const pinecone = warehouse.pinecones.find((item) => item.id === pineconeId);
  const input = document.querySelector(`[data-input='pinecone-edit'][data-pinecone-id="${pineconeId}"]`);
  if (!pinecone || !input) return;
  const nextContent = input.value.trim();
  if (!nextContent) {
    showToast("松果内容不能为空。");
    return;
  }

  pinecone.content = nextContent;
  if (pinecone.status === "shelved") updateReviewSectionForShelf(warehouse, pinecone.shelfId);
  warehouse.updatedAt = nowText();
  state.editingPineconeId = null;
  saveState();
  showToast("松果已更新。");
}

function deletePinecone(pineconeId) {
  const warehouse = getActiveWarehouse();
  const pinecone = warehouse.pinecones.find((item) => item.id === pineconeId);
  if (!pinecone) return;

  warehouse.pinecones = warehouse.pinecones.filter((item) => item.id !== pineconeId);
  warehouse.reviewDocument.sections.forEach((section) => {
    section.bullets = section.bullets.filter((bullet) => !bullet.pineconeIds?.includes(pineconeId));
  });
  if (pinecone.status === "shelved") updateReviewSectionForShelf(warehouse, pinecone.shelfId);
  warehouse.updatedAt = nowText();
  state.editingPineconeId = null;
  saveState();
  showToast("松果已删除。");
}

function deleteWarehouse(warehouseId) {
  const warehouse = state.warehouses.find((item) => item.id === warehouseId);
  if (!warehouse) return;

  state.warehouseDialog = { type: "delete", warehouseId };
  render();
}

function confirmDeleteWarehouse() {
  if (state.warehouseDialog?.type !== "delete") return;
  const warehouseId = state.warehouseDialog.warehouseId;

  const result = removeWarehouse(state.warehouses, state.activeWarehouseId, warehouseId);
  if (!result.removed) return;
  state.warehouses = result.warehouses;
  state.activeWarehouseId = result.activeWarehouseId;
  resetWarehouseTransientState();
  saveState();
  render();
  showToast("松鼠仓已删除。");
}

function resetWarehouseTransientState() {
  state.query = "";
  state.addOpen = false;
  state.editMode = false;
  state.iconCrop = null;
  state.shelfOpen = false;
  state.editingPineconeId = null;
  state.warehouseDialog = null;
}

function createWarehouse() {
  state.warehouseDialog = { type: "create" };
  render();
  document.querySelector("[data-input='warehouse-name']")?.focus();
}

function cancelWarehouseDialog() {
  state.warehouseDialog = null;
  render();
}

function confirmCreateWarehouse() {
  if (state.warehouseDialog?.type !== "create") return;
  const input = document.querySelector("[data-input='warehouse-name']");
  const name = input?.value.trim();
  if (!name) {
    input?.setCustomValidity("请输入松果仓名称");
    input?.reportValidity();
    return;
  }
  input.setCustomValidity("");

  const id = uid("warehouse");
  state.warehouses.unshift({
    id,
    name,
    updatedAt: nowText(),
    tempLimit: 5,
    pinecones: [],
    shelves: [
      { id: "ideas", name: "待整理线索", description: "新松果整理后会先放到这里。" },
    ],
    reviewDocument: buildReviewDocument(name, [
      {
        shelfId: "ideas",
        heading: "先存下零散松果",
        summary: "这个仓库还在积累材料，添加松果后可以让 AI 开始整理。",
        bullets: [],
      },
    ]),
  });
  state.activeWarehouseId = id;
  state.warehouseDialog = null;
  saveState();
  render();
  showToast("松果仓已创建。");
}

async function organizeWarehouse(mode = "existing") {
  const warehouse = getActiveWarehouse();
  const tempCount = warehouse.pinecones.filter((pinecone) => pinecone.status === "temp").length;
  if (tempCount === 0 && mode === "existing") {
    showToast("暂存栏里还没有新松果。");
    return;
  }

  const result = USE_API_ORGANIZER
    ? await organizeWarehouseWithApi(warehouse, mode)
    : organizeWarehouseWithMock(warehouse, mode);

  Object.assign(warehouse, result);
  warehouse.updatedAt = nowText();
  saveState();
  showToast(mode === "reorganize" ? "已全部重新整理，复盘文档已更新。" : `${tempCount} 颗松果已放入素材栏。`);
}

async function organizeWarehouseWithApi(_warehouse, _mode) {
  throw new Error("API organizer is reserved. Replace this function with an OpenAI API call.");
}

function organizeWarehouseWithMock(warehouse, mode) {
  const working = structuredClone(warehouse);
  const targetPinecones = mode === "reorganize"
    ? working.pinecones
    : working.pinecones.filter((pinecone) => pinecone.status === "temp");

  ensureDefaultShelves(working);

  targetPinecones.forEach((pinecone) => {
    const shelfId = chooseShelfId(pinecone.content);
    pinecone.shelfId = shelfId;
    pinecone.status = "shelved";
  });

  working.reviewDocument = buildReviewFromShelves(working);
  return working;
}

function ensureDefaultShelves(warehouse) {
  const defaults = [
    { id: "resume", name: "简历准备", description: "关于简历内容选择、表达和优化的建议。" },
    { id: "before", name: "面试前准备", description: "关于岗位、公司、自我介绍和作品准备。" },
    { id: "performance", name: "面试中的表现", description: "关于现场回答、沟通节奏和信任感。" },
    { id: "qa", name: "常见问题回答思路", description: "关于高频问题、反问和答案结构。" },
    { id: "follow", name: "面试后的跟进", description: "关于记录、复盘和下一轮改进。" },
    { id: "other", name: "其他经验补充", description: "暂时无法归入前面章节的经验。" },
  ];

  defaults.forEach((shelf) => {
    if (!warehouse.shelves.some((current) => current.id === shelf.id)) {
      warehouse.shelves.push(shelf);
    }
  });
}

function chooseShelfId(content) {
  if (/简历|项目|经历|岗位|JD/.test(content)) return "resume";
  if (/准备|公司|作品|自我介绍|提前/.test(content)) return "before";
  if (/现场|表达|回答|沟通|不会/.test(content)) return "performance";
  if (/问题|反问|规划|失败|离职/.test(content)) return "qa";
  if (/面试后|记录|复盘|下一轮|跟进/.test(content)) return "follow";
  return "other";
}

function updateReviewSectionForShelf(warehouse, shelfId) {
  const shelf = warehouse.shelves.find((item) => item.id === shelfId);
  if (!shelf) return;
  const pinecones = warehouse.pinecones.filter((pinecone) => pinecone.status === "shelved" && pinecone.shelfId === shelfId);
  const nextSection = {
    shelfId: shelf.id,
    heading: shelf.name,
    summary: shelf.description,
    bullets: pinecones.slice(0, 4).map((pinecone) => ({
      text: summarizePinecone(pinecone.content),
      pineconeIds: [pinecone.id],
    })),
  };
  const index = warehouse.reviewDocument.sections.findIndex((section) => section.shelfId === shelfId);
  if (index >= 0) {
    warehouse.reviewDocument.sections[index] = nextSection;
  } else {
    warehouse.reviewDocument.sections.push(nextSection);
  }
}

function buildReviewFromShelves(warehouse) {
  const sections = warehouse.shelves.map((shelf) => {
    const pinecones = warehouse.pinecones.filter((pinecone) => pinecone.status === "shelved" && pinecone.shelfId === shelf.id);
    if (!pinecones.length) return null;
    return {
      shelfId: shelf.id,
      heading: shelf.name,
      summary: shelf.description,
      bullets: pinecones.slice(0, 4).map((pinecone) => ({
        text: summarizePinecone(pinecone.content),
        pineconeIds: [pinecone.id],
      })),
    };
  }).filter(Boolean);

  return buildReviewDocument(warehouse.name, sections.length ? sections : [{
    shelfId: "other",
    heading: "先积累更多松果",
    summary: "当前内容还不多，可以继续添加材料再整理。",
    bullets: [],
  }]);
}

function buildReviewDocument(title, sections) {
  return { title, sections };
}

function summarizePinecone(content) {
  const clean = content.replace(/\s+/g, " ").trim();
  return clean.length > 42 ? `${clean.slice(0, 42)}。` : clean;
}

function getFilteredSections(warehouse) {
  const query = state.query.trim();
  if (!query) return warehouse.reviewDocument.sections;
  return warehouse.reviewDocument.sections.filter((section) =>
    [section.heading, section.summary, ...section.bullets.map((bullet) => bullet.text)].some((text) => text.includes(query)),
  );
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = "";
    renderToast();
  }, 2200);
}

function renderToast() {
  toast.textContent = state.toast;
  toast.classList.toggle("show", Boolean(state.toast));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
