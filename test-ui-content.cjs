const fs = require("fs");
const path = require("path");

const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

const expectations = [
  ["temporary-bin copy", "暂存栏"],
  ["ledger copy", "果仓账簿"],
  ["temp progress class", "temp-progress"],
  ["ledger strip class", "ledger-strip"],
  ["organizing mode copy", "放进现有果架"],
  ["shelf copy", "松果架"],
  ["shelf panel class", "shelf-panel"],
  ["shelf drawer class", "shelf-drawer"],
  ["shelf illustration class", "shelf-illustration"],
  ["shelf board class", "shelf-board"],
  ["bottom toolbar class", "bottom-toolbar"],
  ["toolbar dock class", "toolbar-dock"],
  ["toolbar item class", "toolbar-item"],
  ["toolbar meta class", "toolbar-meta"],
  ["shelf count class", "shelf-count"],
  ["reorganize action copy", "重新整理"],
  ["edit document action copy", "编辑文档"],
  ["reorganize helper copy", "AI 重新梳理内容"],
  ["edit helper copy", "修改复盘文档内容"],
];

const forbidden = [
  ["source section copy", "原始松果来源"],
  ["source strip class", "source-strip"],
  ["source render function", "renderSource"],
];

const missing = expectations.filter(([, needle]) => !appSource.includes(needle));
const presentForbidden = forbidden.filter(([, needle]) => appSource.includes(needle));

if (missing.length > 0 || presentForbidden.length > 0) {
  if (missing.length > 0) {
  console.error("Missing UI content:");
  for (const [label, needle] of missing) {
    console.error(`- ${label}: ${needle}`);
  }
  }
  if (presentForbidden.length > 0) {
    console.error("Forbidden old UI content still present:");
    for (const [label, needle] of presentForbidden) {
      console.error(`- ${label}: ${needle}`);
    }
  }
  process.exit(1);
}

console.log("UI content expectations found.");
