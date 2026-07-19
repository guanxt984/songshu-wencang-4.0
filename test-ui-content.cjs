const fs = require("fs");
const path = require("path");

const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
const indexSource = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

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
  ["document perched mascot", "document-perched-mascot"],
  ["document editing handler", "toggleDocumentEdit"],
  ["document save handler", "saveDocumentEdits"],
  ["warehouse icon double click target", "data-icon-target"],
  ["warehouse icon file input", "warehouse-icon-file"],
  ["crop offset control", "data-crop-input=\"offsetX\""],
  ["crop zoom control", "data-crop-input=\"zoom\""],
  ["document edit actions", "document-edit-actions"],
  ["toolbar save document copy", "保存文档"],
  ["toolbar full reorganize copy", "全部重新整理"],
  ["approved warehouse icon", "pinecone-warehouse-icon.png"],
  ["approved shelf icon", "pinecone-shelf-icon.png"],
  ["approved pinecone icon", "pinecone-icon.png"],
  ["document perched mascot png", "icons.squirrel(\"document-perched-mascot\")"],
  ["shelf tab pinecone png", "icons.pinecone(\"shelf-tab-pinecone\")"],
  ["warehouse delete action", "data-action=\"delete-warehouse\""],
  ["warehouse empty state", "renderEmptyWarehouseState"],
  ["warehouse removal helper", "removeWarehouse"],
  ["warehouse card draggable", "draggable=\"true\""],
  ["warehouse drag binder", "bindWarehouseDragEvents"],
  ["warehouse reorder helper", "reorderWarehouses"],
  ["warehouse pointer initiation state", "warehouseDragStartedFromButton"],
  ["warehouse touch drag state", "touchWarehouseDrag"],
  ["warehouse delete confirmation", "仓内松果和整理文档会一并删除"],
  ["warehouse dialog state", "warehouseDialog"],
  ["warehouse dialog renderer", "renderWarehouseDialog"],
  ["warehouse dialog name input", "data-input=\"warehouse-name\""],
  ["warehouse dialog cancel action", "data-action=\"cancel-warehouse-dialog\""],
  ["warehouse dialog create action", "data-action=\"confirm-create-warehouse\""],
  ["warehouse dialog delete action", "data-action=\"confirm-delete-warehouse\""],
];

const cssExpectations = [
  ["paper background", "--paper"],
  ["hand drawn card", ".document-card"],
  ["left panel", ".warehouse-panel"],
  ["document edit actions", ".document-edit-actions"],
  ["document perched mascot", ".document-perched-mascot"],
  ["icon crop modal", ".icon-crop-modal"],
  ["editable document fields", ".editable-field"],
  ["add panel", ".add-panel"],
  ["shelf drawer", ".shelf-drawer"],
  ["warehouse delete button", ".warehouse-delete-button"],
  ["warehouse empty state", ".warehouse-empty-state"],
  ["warehouse dragging state", ".warehouse-card.dragging"],
  ["warehouse before drop target", ".warehouse-card.drop-before"],
  ["warehouse after drop target", ".warehouse-card.drop-after"],
];

const htmlExpectations = [
  ["module app script", '<script type="module" src="app.js"></script>'],
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
  ["old single collapsed toolbar icon", "toolbar-orb-icon"],
  ["floating toolbar drag handle", "toolbar-drag-handle"],
  ["floating toolbar drag target", "data-drag-toolbar"],
  ["detached bottom toolbar", "bottom-toolbar"],
  ["document bottom toolbar tab", "document-toolbar-tab"],
  ["toolbar collapse action", "toggle-toolbar"],
  ["toolbar collapse state", "toolbarCollapsed"],
  ["toolbar renderer", "renderToolbar"],
  ["toolbar orb", "toolbar-orb"],
  ["native warehouse name prompt", "prompt("],
  ["native warehouse delete confirmation", "confirm("],
  ["warehouse panel grass decoration", "panel-grass"],
  ["warehouse panel first grass illustration", "grass-a"],
  ["warehouse panel second grass illustration", "grass-b"],
  ["warehouse panel star illustration", "grass-star"],
];

const requiredAssets = [
  "assets/illustrations/pinecone-warehouse-icon.png",
  "assets/illustrations/pinecone-shelf-icon.png",
  "assets/illustrations/pinecone-icon.png",
  "assets/illustrations/squirrel-wencang-logo-ip.png",
];

const missing = expectations.filter(([, needle]) => !appSource.includes(needle));
const missingCss = cssExpectations.filter(([, needle]) => !cssSource.includes(needle));
const missingHtml = htmlExpectations.filter(([, needle]) => !indexSource.includes(needle));
const presentForbidden = forbidden.filter(([, needle]) => appSource.includes(needle) || cssSource.includes(needle));
const missingAssets = requiredAssets.filter((filePath) => !fs.existsSync(path.join(__dirname, filePath)));

const emptyWarehouseSource = appSource.slice(
  appSource.indexOf("function renderEmptyWarehouseState()"),
  appSource.indexOf("function renderWarehouseCard("),
);
const emptyWarehouseFailures = [];
if (emptyWarehouseSource.includes('class="toast')) {
  emptyWarehouseFailures.push("Empty warehouse state renders a duplicate toast");
}

const warehouseDialogSource = appSource.slice(
  appSource.indexOf("function renderWarehouseDialog()"),
  appSource.indexOf("function renderTemporaryShelfNotice("),
);
const warehouseDialogFailures = [];
[
  ["Warehouse dialog is modal", 'aria-modal="true"'],
  ["Warehouse dialog has a dialog role", 'role="dialog"'],
  ["Warehouse dialog has an accessible label", "aria-labelledby"],
  ["Warehouse create field has a label", 'for="warehouse-name-input"'],
].forEach(([failure, needle]) => {
  if (!warehouseDialogSource.includes(needle)) {
    warehouseDialogFailures.push(failure);
  }
});
if (!appSource.includes("warehouseDialog: _warehouseDialog")) {
  warehouseDialogFailures.push("Warehouse dialog state is persisted");
}

const toolbarSource = appSource.slice(
  appSource.indexOf('<div class="doc-actions">'),
  appSource.indexOf('<div class="chips">'),
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
if (toolbarSource.includes("toolbarPosition")) {
  toolbarFailures.push("Toolbar still renders persisted floating position");
}
[
  ["Document actions do not use the natural edit action group", toolbarSource, "document-edit-actions"],
  ["Document add action does not render as an inline edit button", toolbarSource, "document-edit-action add"],
  ["Document edit action does not render as an inline edit button", toolbarSource, "document-edit-action edit"],
  ["Document reorganize action does not render as an inline edit button", toolbarSource, "document-edit-action reorganize"],
  ["Document actions do not keep the add PNG helper", toolbarSource, 'icons.plus("document-edit-icon add")'],
  ["Document actions do not keep the book PNG helper", toolbarSource, 'icons.book("document-edit-icon")'],
  ["Document actions do not keep the leaf PNG helper", toolbarSource, 'icons.leaf("document-edit-icon")'],
].forEach(([failure, source, needle]) => {
  if (!source.includes(needle)) {
    toolbarFailures.push(failure);
  }
});
const documentCardCssSource = cssSource.slice(
  cssSource.indexOf(".document-card {"),
  cssSource.indexOf(".doc-head,"),
);
const contentWrapCssSource = cssSource.slice(
  cssSource.indexOf(".content-wrap {"),
  cssSource.indexOf(".toc {"),
);
const documentMascotCssSource = cssSource.slice(
  cssSource.indexOf(".document-perched-mascot"),
  cssSource.indexOf(".doc-head {"),
);
const documentEditActionsCssSource = cssSource.slice(
  cssSource.indexOf(".document-edit-actions"),
  cssSource.indexOf(".document-edit-action {"),
);
[
  ["Document card does not reserve space for a top perched mascot", documentCardCssSource, "overflow: visible"],
  ["Document card does not use column layout for integrated header actions", documentCardCssSource, "display: flex"],
  ["Document content still uses a fixed header-height subtraction", contentWrapCssSource, "flex: 1"],
  ["Document perched mascot is not positioned on the document top edge", documentMascotCssSource, "top: -44px"],
  ["Document edit actions do not occupy their own header row", documentEditActionsCssSource, "grid-column: 1 / -1"],
].forEach(([failure, source, needle]) => {
  if (!source.includes(needle)) {
    toolbarFailures.push(failure);
  }
});

const warehouseDragSource = appSource.slice(
  appSource.indexOf("function bindWarehouseDragEvents()"),
  appSource.indexOf("function openIconPicker("),
);
const warehouseDragFailures = [];
[
  ["Pointer down records button initiation", 'card.addEventListener("pointerdown"'],
  ["Native drag checks recorded initiation", "if (warehouseDragStartedFromButton)"],
  ["Touch dragging has a pointer move path", 'card.addEventListener("pointermove"'],
  ["Touch dragging commits on pointer up", 'card.addEventListener("pointerup"'],
  ["Touch dragging cancels on pointer cancel", 'card.addEventListener("pointercancel"'],
  ["Touch dragging hit-tests the card under the pointer", "document.elementFromPoint"],
  ["Touch dragging is limited to touch pointers", 'event.pointerType !== "touch"'],
  ["Touch dragging waits for long-press activation", "activateTouchWarehouseDrag"],
  ["Touch dragging cancels an armed moving pointer", "TOUCH_DRAG_MOVE_THRESHOLD"],
  ["Touch dragging rejects a second pointer", "if (touchWarehouseDrag)"],
  ["Touch edge scrolling uses animation frames", "requestAnimationFrame"],
  ["Touch edge scrolling targets the warehouse list", 'document.querySelector(".warehouse-list")'],
  ["Touch edge scrolling includes the viewport edge", "window.innerHeight"],
  ["Touch edge scrolling refreshes drop placement", "updateTouchWarehouseDropTarget"],
  ["Touch edge scrolling is cancelled during cleanup", "cancelAnimationFrame"],
  ["Active touch dragging suppresses browser panning", "preventActiveWarehouseTouchScroll"],
  ["Touch edge scrolling uses horizontal list offsets", "warehouseList.scrollLeft"],
  ["Touch edge scrolling uses horizontal bounds", "rect.left"],
  ["Touch edge scrolling includes horizontal viewport fallback", "window.scrollX"],
  ["Touch dragging cleans up lost pointer capture", 'card.addEventListener("lostpointercapture"'],
].forEach(([failure, needle]) => {
  if (!warehouseDragSource.includes(needle)) {
    warehouseDragFailures.push(failure);
  }
});
if (warehouseDragSource.includes('if (event.target.closest("button"))')) {
  warehouseDragFailures.push("Native drag still checks the retargeted dragstart target");
}
if (!appSource.includes('document.addEventListener("touchmove", preventActiveWarehouseTouchScroll, { passive: false });')) {
  warehouseDragFailures.push("Active touch drag does not install a non-passive scroll prevention hook");
}
const pointerDownSource = warehouseDragSource.slice(
  warehouseDragSource.indexOf('card.addEventListener("pointerdown"'),
  warehouseDragSource.indexOf('card.addEventListener("dragstart"'),
);
if (!pointerDownSource.includes("event.preventDefault();") || !pointerDownSource.includes("event.stopPropagation();") || !pointerDownSource.includes("{ capture: true }")) {
  warehouseDragFailures.push("Second touch is not suppressed before nested button activation");
}
const touchActivationSource = warehouseDragSource.slice(
  warehouseDragSource.indexOf("function activateTouchWarehouseDrag("),
  warehouseDragSource.indexOf("function preventActiveWarehouseTouchScroll("),
);
if (!touchActivationSource.includes("if (!card.isConnected)") || !touchActivationSource.includes("clearWarehouseDragState();")) {
  warehouseDragFailures.push("Disconnected touch activation does not fully clear gesture state");
}
const warehouseCardCss = cssSource.slice(
  cssSource.indexOf('.warehouse-card[draggable="true"]'),
  cssSource.indexOf(".warehouse-icon-button,"),
);
if (!warehouseCardCss.includes("touch-action: auto") && !warehouseCardCss.includes("touch-action: pan-x pan-y")) {
  warehouseDragFailures.push("Warehouse cards do not preserve horizontal and vertical touch scrolling");
}
if (warehouseCardCss.includes("touch-action: none")) {
  warehouseDragFailures.push("Warehouse cards still block all native touch scrolling");
}
const holdDelay = Number(appSource.match(/const TOUCH_DRAG_HOLD_MS = (\d+);/)?.[1]);
if (!Number.isFinite(holdDelay) || holdDelay < 250 || holdDelay > 350) {
  warehouseDragFailures.push("Touch drag long-press delay is outside 250-350ms");
}
const moveThreshold = Number(appSource.match(/const TOUCH_DRAG_MOVE_THRESHOLD = (\d+);/)?.[1]);
if (!Number.isFinite(moveThreshold) || moveThreshold < 4 || moveThreshold > 12) {
  warehouseDragFailures.push("Touch drag movement threshold is not small and bounded");
}
const warehouseListCss = cssSource.slice(
  cssSource.indexOf(".warehouse-list {"),
  cssSource.indexOf(".warehouse-card {"),
);
if (!warehouseListCss.includes("grid-auto-rows: 132px")) {
  warehouseDragFailures.push("Warehouse list does not keep every card row at a fixed height");
}
if (!warehouseListCss.includes("align-content: start")) {
  warehouseDragFailures.push("Warehouse list still allows rows to stretch into leftover space");
}
const warehouseCardBaseCss = cssSource.slice(
  cssSource.indexOf(".warehouse-card {"),
  cssSource.indexOf('.warehouse-card[draggable="true"]'),
);
if (!warehouseCardBaseCss.includes("height: 132px")) {
  warehouseDragFailures.push("Warehouse cards do not declare the shared fixed height");
}
const responsiveWarehouseListCss = cssSource.slice(
  cssSource.indexOf("@media (max-width: 1220px)"),
  cssSource.indexOf("@media (max-width: 720px)"),
);
if (!responsiveWarehouseListCss.includes("grid-template-columns: repeat(3, 260px)")) {
  warehouseDragFailures.push("Responsive warehouse list does not keep fixed-width card columns");
}

if (missing.length > 0 || missingCss.length > 0 || missingHtml.length > 0 || presentForbidden.length > 0 || missingAssets.length > 0 || toolbarFailures.length > 0 || emptyWarehouseFailures.length > 0 || warehouseDialogFailures.length > 0 || warehouseDragFailures.length > 0) {
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

  if (missingHtml.length > 0) {
    console.error("Missing HTML content:");
    for (const [label, needle] of missingHtml) {
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

  if (emptyWarehouseFailures.length > 0) {
    console.error("Empty warehouse contract failures:");
    for (const failure of emptyWarehouseFailures) {
      console.error(`- ${failure}`);
    }
  }

  if (warehouseDialogFailures.length > 0) {
    console.error("Warehouse dialog contract failures:");
    for (const failure of warehouseDialogFailures) {
      console.error(`- ${failure}`);
    }
  }

  if (warehouseDragFailures.length > 0) {
    console.error("Warehouse drag contract failures:");
    for (const failure of warehouseDragFailures) {
      console.error(`- ${failure}`);
    }
  }

  process.exit(1);
}

console.log("Product UI content expectations found.");
