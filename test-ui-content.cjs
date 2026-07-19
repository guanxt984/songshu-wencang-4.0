const fs = require("fs");
const path = require("path");

const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");

const expectations = [
  ["product title", "松鼠文仓"],
  ["warehouse list", "松果仓列表"],
  ["add pinecone action", "添加松果"],
  ["temporary shelf option", "暂存栏"],
  ["existing material shelf option", "已有素材栏"],
  ["new material shelf option", "新建素材栏"],
  ["review document", "复盘文档"],
  ["pinecone shelf", "松果架"],
  ["shelf drawer search", "搜索松果"],
  ["pinecone edit action", "编辑"],
  ["pinecone delete action", "删除"],
  ["pinecone move action", "移动到"],
  ["toolbar edit action", "toggle-document-edit"],
  ["toolbar add action", "toggle-add"],
  ["toolbar reorganize action", "reorganize"],
  ["add destination state", "addDestination"],
  ["selected shelf state", "selectedShelfId"],
  ["new shelf name state", "newShelfName"],
  ["shelf search state", "shelfQuery"],
  ["local persistence key", "squirrel-warehouse-mvp"],
  ["mock organizer entry", "organizeWarehouse"],
  ["mock organizer", "organizeWarehouseWithMock"],
  ["add pinecone handler", "addPinecone"],
  ["create warehouse handler", "createWarehouse"],
  ["custom warehouse icon handler", "openIconPicker"],
  ["icon crop save handler", "saveWarehouseIcon"],
  ["toolbar collapse handler", "toggleToolbar"],
  ["toolbar drag handler", "startToolbarDrag"],
  ["document editing handler", "toggleDocumentEdit"],
  ["document save handler", "saveDocumentEdits"],
  ["warehouse icon double click target", "data-icon-target"],
  ["warehouse icon file input", "warehouse-icon-file"],
  ["crop offset control", "data-crop-input=\"offsetX\""],
  ["crop zoom control", "data-crop-input=\"zoom\""],
  ["toolbar drag target", "data-drag-toolbar"],
  ["toolbar save document copy", "保存文档"],
  ["toolbar full reorganize copy", "全部重新整理"],
  ["approved warehouse icon", "pinecone-warehouse-icon.png"],
  ["approved shelf icon", "pinecone-shelf-icon.png"],
  ["approved pinecone icon", "pinecone-icon.png"],
  ["toolbar mascot png", "icons.squirrel(\"toolbar-mascot\")"],
  ["collapsed toolbar mascot png", "icons.squirrel(\"toolbar-orb-mascot\")"],
  ["shelf tab pinecone png", "icons.pinecone(\"shelf-tab-pinecone\")"],
  ["warehouse delete action", "data-action=\"delete-warehouse\""],
  ["warehouse empty state", "renderEmptyWarehouseState"],
  ["warehouse removal helper", "removeWarehouse"],
  ["warehouse delete confirmation", "仓内松果和整理文档会一并删除"],
];

const cssExpectations = [
  ["paper background", "--paper"],
  ["hand drawn card", ".document-card"],
  ["left panel", ".warehouse-panel"],
  ["bottom toolbar", ".bottom-toolbar"],
  ["collapsed toolbar", ".bottom-toolbar.collapsed"],
  ["toolbar orb", ".toolbar-orb"],
  ["icon crop modal", ".icon-crop-modal"],
  ["editable document fields", ".editable-field"],
  ["add panel", ".add-panel"],
  ["shelf drawer", ".shelf-drawer"],
  ["warehouse delete button", ".warehouse-delete-button"],
  ["warehouse empty state", ".warehouse-empty-state"],
];

const forbidden = [
  ["old product title", "枝枝笔记"],
  ["old product logo asset", "squirrel-wencang-logo.png"],
  ["toolbar upload knowledge action", "上传知识条"],
  ["toolbar organize temporary action", "整理暂存"],
  ["old organize existing action", "organize-existing"],
  ["old organize into shelf copy", "放进现有果架"],
  ["old reorganize warehouse copy", "重新整理仓库"],
  ["visible reference pinecone entry", "引用松果"],
  ["automatic tag generator", "makeTags("],
  ["workspace decoration renderer", "renderPageDecorations"],
  ["workspace decoration layer", "page-decorations"],
  ["workspace mascot wave illustration", "achang-wave.png"],
  ["workspace mascot document illustration", "achang-doc.png"],
  ["workspace pinecone document illustration", "decor-pinecone-doc.png"],
  ["shelf toolbar icon", "toolbar-shelf-icon"],
  ["old warehouse split pinecones", "icons.pinecone(\"warehouse-pine"],
  ["old shelf split pinecones", "icons.pinecone(\"shelf-mini"],
  ["css drawn toolbar mascot", ".toolbar-mascot::before"],
  ["css drawn toolbar mascot face", ".toolbar-mascot::after"],
  ["css drawn collapsed toolbar mascot", ".toolbar-orb-mascot::before"],
  ["css drawn collapsed toolbar mascot face", ".toolbar-orb-mascot::after"],
  ["css drawn shelf tab pinecone", ".shelf-tab-pinecone {\n  position: relative;\n  width:"],
];

const requiredAssets = [
  "assets/illustrations/pinecone-warehouse-icon.png",
  "assets/illustrations/pinecone-shelf-icon.png",
  "assets/illustrations/pinecone-icon.png",
  "assets/illustrations/squirrel-wencang-logo-ip.png",
];

const missing = expectations.filter(([, needle]) => !appSource.includes(needle));
const missingCss = cssExpectations.filter(([, needle]) => !cssSource.includes(needle));
const presentForbidden = forbidden.filter(([, needle]) => appSource.includes(needle) || cssSource.includes(needle));
const missingAssets = requiredAssets.filter((filePath) => !fs.existsSync(path.join(__dirname, filePath)));

const toolbarSource = appSource.slice(
  appSource.indexOf("function renderToolbar()"),
  appSource.indexOf("function renderIconCropModal()"),
);
const toolbarFailures = [];
["toggle-document-edit", "toggle-add", "reorganize"].forEach((action) => {
  if (!toolbarSource.includes(`data-action="${action}"`)) {
    toolbarFailures.push(`Missing toolbar action: ${action}`);
  }
});
["organize-existing", "toggle-shelf"].forEach((action) => {
  if (toolbarSource.includes(`data-action="${action}"`)) {
    toolbarFailures.push(`Forbidden toolbar action: ${action}`);
  }
});

if (missing.length > 0 || missingCss.length > 0 || presentForbidden.length > 0 || missingAssets.length > 0 || toolbarFailures.length > 0) {
  if (missing.length > 0) {
    console.error("Missing app content:");
    for (const [label, needle] of missing) {
      console.error(`- ${label}: ${needle}`);
    }
  }

  if (missingCss.length > 0) {
    console.error("Missing CSS content:");
    for (const [label, needle] of missingCss) {
      console.error(`- ${label}: ${needle}`);
    }
  }

  if (presentForbidden.length > 0) {
    console.error("Forbidden content still present:");
    for (const [label, needle] of presentForbidden) {
      console.error(`- ${label}: ${needle}`);
    }
  }

  if (missingAssets.length > 0) {
    console.error("Missing icon assets:");
    for (const filePath of missingAssets) {
      console.error(`- ${filePath}`);
    }
  }

  if (toolbarFailures.length > 0) {
    console.error("Toolbar contract failures:");
    for (const failure of toolbarFailures) {
      console.error(`- ${failure}`);
    }
  }

  process.exit(1);
}

console.log("Product UI content expectations found.");
