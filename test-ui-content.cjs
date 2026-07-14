const fs = require("fs");
const path = require("path");

const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");

const expectations = [
  ["product title", "松鼠文仓"],
  ["warehouse list", "松果仓列表"],
  ["add pinecone action", "添加松果"],
  ["temporary bin copy", "暂存栏"],
  ["organize into existing shelf", "放进现有果架"],
  ["reorganize warehouse", "重新整理仓库"],
  ["review document", "复盘文档"],
  ["pinecone shelf", "松果架"],
  ["source references", "引用松果"],
  ["mock organizer entry", "organizeWarehouse"],
  ["API seam", "organizeWarehouseWithApi"],
  ["mock organizer", "organizeWarehouseWithMock"],
  ["add pinecone handler", "addPinecone"],
  ["create warehouse handler", "createWarehouse"],
  ["local persistence key", "squirrel-warehouse-mvp"],
  ["transparent PNG asset usage", "assets/illustrations/"],
  ["approved warehouse icon", "pinecone-warehouse-icon.png"],
  ["approved shelf icon", "pinecone-shelf-icon.png"],
  ["approved pinecone icon", "pinecone-icon.png"],
  ["IP logo asset", "squirrel-wencang-logo-ip.png"],
];

const cssExpectations = [
  ["paper background", "--paper"],
  ["hand drawn card", ".document-card"],
  ["left panel", ".warehouse-panel"],
  ["bottom toolbar", ".bottom-toolbar"],
  ["add panel", ".add-panel"],
  ["reference modal", ".modal-backdrop"],
];

const forbidden = [
  ["mojibake title", "鏉鹃紶"],
  ["mojibake warehouse", "鏉炬灉"],
  ["old temp mojibake", "鏆傚瓨"],
  ["old warehouse leaf icon", "icons.leaf(\"warehouse-leaf\")"],
  ["old warehouse split pinecones", "icons.pinecone(\"warehouse-pine"],
  ["old shelf split pinecones", "icons.pinecone(\"shelf-mini"],
  ["old product logo asset", "squirrel-wencang-logo.png"],
  ["workspace decoration renderer", "renderPageDecorations"],
  ["workspace decoration layer", "page-decorations"],
  ["workspace mascot wave illustration", "achang-wave.png"],
  ["workspace mascot document illustration", "achang-doc.png"],
  ["workspace pinecone document illustration", "decor-pinecone-doc.png"],
];

const requiredAssets = [
  "assets/illustrations/pinecone-warehouse-icon.png",
  "assets/illustrations/pinecone-shelf-icon.png",
  "assets/illustrations/pinecone-icon.png",
  "assets/illustrations/squirrel-wencang-logo-ip.png",
  "assets/illustrations/achang-wave.png",
  "assets/illustrations/achang-doc.png",
  "assets/illustrations/decor-pinecone-doc.png",
];

const missing = expectations.filter(([, needle]) => !appSource.includes(needle));
const missingCss = cssExpectations.filter(([, needle]) => !cssSource.includes(needle));
const presentForbidden = forbidden.filter(([, needle]) => appSource.includes(needle) || cssSource.includes(needle));
const missingAssets = requiredAssets.filter((filePath) => !fs.existsSync(path.join(__dirname, filePath)));

if (missing.length > 0 || missingCss.length > 0 || presentForbidden.length > 0 || missingAssets.length > 0) {
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

  process.exit(1);
}

console.log("Product UI content expectations found.");
