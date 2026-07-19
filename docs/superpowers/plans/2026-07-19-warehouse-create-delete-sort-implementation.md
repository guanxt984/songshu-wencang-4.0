# 松鼠仓新建、删除与排序 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为松鼠仓列表实现可持久化的新建、二次确认删除、删除至空状态，以及仅通过拖拽整张卡片完成的排序。

**Architecture:** 将数组重排与删除后的选中规则提取到一个无 DOM 依赖的纯函数模块，以便用 Node 内置测试运行器验证真实行为；`app.js` 负责渲染、浏览器确认框、原生拖放事件和持久化。现有 `state.warehouses` 保持为顺序的唯一来源，不引入第三方依赖。

**Tech Stack:** 原生 JavaScript ES modules、HTML5 Drag and Drop、CSS、Node.js `node:test`、localStorage。

## Global Constraints

- 排序仅支持拖拽整张仓库卡片，不提供上移/下移按钮或独立拖拽手柄。
- 删除前必须二次确认；允许删除最后一个仓库。
- 新建、删除和排序均使用现有 `squirrel-warehouse-mvp` 本地存储键持久化。
- 不实现重命名、批量操作、撤销功能，不引入第三方依赖。
- 保留工作区中已有且与本功能无关的未提交修改。

---

## File Structure

- Create: `warehouse-management.js` — 纯函数：仓库重排、删除及删除后的活动仓选择。
- Create: `warehouse-management.test.mjs` — 上述纯函数的行为测试。
- Modify: `app.js` — 空状态渲染、卡片删除控件、创建/删除流程、拖放事件与持久化。
- Modify: `styles.css` — 删除按钮、拖动态、插入位置和空状态样式。
- Modify: `package.json` — 将行为测试纳入 `npm.cmd run check`。
- Modify: `test-ui-content.cjs` — 补充 DOM/CSS 契约，防止管理控件回退。

### Task 1: 可测试的仓库数组操作

**Files:**
- Create: `warehouse-management.js`
- Create: `warehouse-management.test.mjs`
- Modify: `package.json:7-10`

**Interfaces:**
- Produces: `reorderWarehouses(warehouses, sourceId, targetId, placement)`，返回新数组；`placement` 仅接受 `"before" | "after"`。
- Produces: `removeWarehouse(warehouses, activeWarehouseId, warehouseId)`，返回 `{ warehouses, activeWarehouseId, removed }`。
- Consumes: 仓库对象至少包含唯一字符串 `id`。

- [ ] **Step 1: 写失败测试**

```js
// warehouse-management.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { removeWarehouse, reorderWarehouses } from "./warehouse-management.js";

const ids = (items) => items.map((item) => item.id);
const warehouses = [{ id: "a" }, { id: "b" }, { id: "c" }];

test("reorderWarehouses moves a card before or after the target without mutation", () => {
  assert.deepEqual(ids(reorderWarehouses(warehouses, "c", "a", "before")), ["c", "a", "b"]);
  assert.deepEqual(ids(reorderWarehouses(warehouses, "a", "b", "after")), ["b", "a", "c"]);
  assert.deepEqual(ids(warehouses), ["a", "b", "c"]);
});

test("reorderWarehouses ignores invalid and no-op drops", () => {
  assert.equal(reorderWarehouses(warehouses, "missing", "a", "before"), warehouses);
  assert.equal(reorderWarehouses(warehouses, "a", "a", "before"), warehouses);
});

test("removeWarehouse preserves selection when deleting an inactive warehouse", () => {
  assert.deepEqual(removeWarehouse(warehouses, "a", "c"), {
    warehouses: [{ id: "a" }, { id: "b" }], activeWarehouseId: "a", removed: true,
  });
});

test("removeWarehouse selects next, then previous, and permits an empty list", () => {
  assert.equal(removeWarehouse(warehouses, "b", "b").activeWarehouseId, "c");
  assert.equal(removeWarehouse(warehouses, "c", "c").activeWarehouseId, "b");
  assert.deepEqual(removeWarehouse([{ id: "a" }], "a", "a"), {
    warehouses: [], activeWarehouseId: "", removed: true,
  });
});
```

- [ ] **Step 2: 运行测试并确认因模块缺失而失败**

Run: `node --test warehouse-management.test.mjs`

Expected: FAIL，包含 `ERR_MODULE_NOT_FOUND`，证明行为尚未实现。

- [ ] **Step 3: 编写最小纯函数实现**

```js
// warehouse-management.js
export function reorderWarehouses(warehouses, sourceId, targetId, placement) {
  const sourceIndex = warehouses.findIndex((item) => item.id === sourceId);
  const targetIndex = warehouses.findIndex((item) => item.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return warehouses;

  const next = [...warehouses];
  const [source] = next.splice(sourceIndex, 1);
  const adjustedTarget = next.findIndex((item) => item.id === targetId);
  const insertIndex = adjustedTarget + (placement === "after" ? 1 : 0);
  next.splice(insertIndex, 0, source);
  return idsEqual(next, warehouses) ? warehouses : next;
}

export function removeWarehouse(warehouses, activeWarehouseId, warehouseId) {
  const index = warehouses.findIndex((item) => item.id === warehouseId);
  if (index < 0) return { warehouses, activeWarehouseId, removed: false };
  const next = warehouses.filter((item) => item.id !== warehouseId);
  const nextActive = activeWarehouseId === warehouseId
    ? (next[index]?.id || next[index - 1]?.id || "")
    : activeWarehouseId;
  return { warehouses: next, activeWarehouseId: nextActive, removed: true };
}

function idsEqual(left, right) {
  return left.length === right.length && left.every((item, index) => item.id === right[index].id);
}
```

- [ ] **Step 4: 运行行为测试并确认通过**

Run: `node --test warehouse-management.test.mjs`

Expected: PASS，4 tests、0 failures。

- [ ] **Step 5: 将行为测试纳入完整检查**

```json
"check": "node --check app.js && node --check server.mjs && node --test warehouse-management.test.mjs && node test-ui-content.cjs"
```

Run: `npm.cmd run check`

Expected: PASS，行为测试与现有内容契约全部通过。

- [ ] **Step 6: 提交纯函数与测试**

```powershell
git add -- warehouse-management.js warehouse-management.test.mjs package.json
git commit -m "test: specify warehouse ordering and deletion rules"
```

### Task 2: 删除、空状态与安全创建流程

**Files:**
- Modify: `app.js:1-3,191-317,319-333,605-666,995-1021`
- Modify: `test-ui-content.cjs:7-64`
- Modify: `styles.css:206-260,1317-1335`

**Interfaces:**
- Consumes: `removeWarehouse` from `warehouse-management.js`。
- Produces: `deleteWarehouse(warehouseId)`；确认后更新状态、保存并渲染。
- Produces: `renderEmptyWarehouseState()`；仓库数组为空时提供 `data-action="create-warehouse"` 入口。

- [ ] **Step 1: 扩展内容契约并确认失败**

在 `expectations` 增加：

```js
["warehouse delete action", "data-action=\"delete-warehouse\""],
["warehouse empty state", "renderEmptyWarehouseState"],
["warehouse removal helper", "removeWarehouse"],
["warehouse delete confirmation", "仓内松果和整理文档会一并删除"],
```

在 `cssExpectations` 增加：

```js
["warehouse delete button", ".warehouse-delete-button"],
["warehouse empty state", ".warehouse-empty-state"],
```

Run: `node test-ui-content.cjs`

Expected: FAIL，列出缺少删除操作、空状态和对应样式。

- [ ] **Step 2: 导入删除纯函数并允许加载空仓状态**

在 `app.js` 顶部加入：

```js
import { removeWarehouse, reorderWarehouses } from "./warehouse-management.js";
```

将 `loadState()` 的保存态判断改为允许空数组：

```js
if (saved?.version === initialState.version && Array.isArray(saved?.warehouses)) {
```

将 `getActiveWarehouse()` 改为显式返回 `null`：

```js
function getActiveWarehouse() {
  return state.warehouses.find((warehouse) => warehouse.id === state.activeWarehouseId)
    || state.warehouses[0]
    || null;
}
```

- [ ] **Step 3: 添加空状态渲染分支**

在 `render()` 计算统计前加入：

```js
const warehouse = getActiveWarehouse();
if (!warehouse) {
  app.innerHTML = renderEmptyWarehouseState();
  bindEvents();
  renderToast();
  return;
}
```

新增：

```js
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
    ${state.toast ? `<div class="toast show">${escapeHtml(state.toast)}</div>` : '<div class="toast"></div>'}
  `;
}
```

- [ ] **Step 4: 在卡片加入删除按钮并实现确认删除**

在 `renderWarehouseCard()` 的关闭标签前加入：

```js
<button class="warehouse-delete-button" type="button"
  data-action="delete-warehouse" data-warehouse-id="${warehouse.id}"
  aria-label="删除 ${escapeHtml(warehouse.name)}">×</button>
```

在 `[data-action]` 事件分派中加入：

```js
if (action === "delete-warehouse") {
  event.stopPropagation();
  deleteWarehouse(element.dataset.warehouseId);
}
```

新增：

```js
function deleteWarehouse(warehouseId) {
  const warehouse = state.warehouses.find((item) => item.id === warehouseId);
  if (!warehouse) return;
  const approved = confirm(`确定删除“${warehouse.name}”吗？仓内松果和整理文档会一并删除。`);
  if (!approved) return;

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
}
```

- [ ] **Step 5: 修正创建后的即时渲染并增加样式**

在 `createWarehouse()` 的 `showToast` 前加入 `render();`，确保从空状态创建后立即进入新仓。

```css
.warehouse-delete-button {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #8f6b55;
  opacity: 0;
  cursor: pointer;
}

.warehouse-card:hover .warehouse-delete-button,
.warehouse-delete-button:focus-visible { opacity: 1; }

.warehouse-empty-state {
  grid-column: 1 / -1;
  min-height: 520px;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  gap: 12px;
}
```

- [ ] **Step 6: 运行完整检查并提交**

Run: `npm.cmd run check`

Expected: PASS，0 failures，内容契约不再报告缺失项。

```powershell
git add -- app.js styles.css test-ui-content.cjs
git commit -m "feat: add warehouse deletion and empty state"
```

### Task 3: 整张卡片原生拖拽排序

**Files:**
- Modify: `app.js:151-160,319-333,572-706`
- Modify: `styles.css:206-260`
- Modify: `test-ui-content.cjs:7-64`

**Interfaces:**
- Consumes: `reorderWarehouses` from `warehouse-management.js`。
- Produces: `bindWarehouseDragEvents()`；只在有效 drop 后保存和渲染。
- Produces: 模块级 `draggedWarehouseId` 临时变量，不写入 localStorage。

- [ ] **Step 1: 添加拖拽内容契约并确认失败**

在 `expectations` 增加：

```js
["warehouse card draggable", "draggable=\"true\""],
["warehouse drag binder", "bindWarehouseDragEvents"],
["warehouse reorder helper", "reorderWarehouses"],
```

在 `cssExpectations` 增加：

```js
["warehouse dragging state", ".warehouse-card.dragging"],
["warehouse before drop target", ".warehouse-card.drop-before"],
["warehouse after drop target", ".warehouse-card.drop-after"],
```

Run: `node test-ui-content.cjs`

Expected: FAIL，列出缺少 draggable、拖拽绑定和反馈样式。

- [ ] **Step 2: 标记整张卡片并绑定原生拖放事件**

将卡片开始标签改为：

```js
<article class="warehouse-card ${active ? "active" : ""}"
  data-warehouse-card="${warehouse.id}" draggable="true">
```

在模块状态附近加入：

```js
let draggedWarehouseId = "";
```

在 `bindEvents()` 尾部调用：

```js
bindWarehouseDragEvents();
```

新增：

```js
function bindWarehouseDragEvents() {
  document.querySelectorAll("[data-warehouse-card]").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      if (event.target.closest("button")) {
        event.preventDefault();
        return;
      }
      draggedWarehouseId = card.dataset.warehouseCard;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedWarehouseId);
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

function clearWarehouseDropIndicators() {
  document.querySelectorAll(".drop-before, .drop-after").forEach((card) => {
    card.classList.remove("drop-before", "drop-after");
  });
}

function clearWarehouseDragState() {
  draggedWarehouseId = "";
  document.querySelectorAll(".warehouse-card").forEach((card) => {
    card.classList.remove("dragging", "drop-before", "drop-after");
  });
}
```

- [ ] **Step 3: 添加拖拽反馈样式**

```css
.warehouse-card[draggable="true"] { cursor: grab; }
.warehouse-card.dragging { opacity: .48; cursor: grabbing; }
.warehouse-card.drop-before::before,
.warehouse-card.drop-after::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  height: 3px;
  border-radius: 3px;
  background: #6f9b72;
}
.warehouse-card.drop-before::before { top: -5px; }
.warehouse-card.drop-after::after { bottom: -5px; }
```

- [ ] **Step 4: 运行完整检查并提交**

Run: `npm.cmd run check`

Expected: PASS，行为测试和内容契约全部通过。

```powershell
git add -- app.js styles.css test-ui-content.cjs
git commit -m "feat: support drag sorting warehouse cards"
```

### Task 4: 浏览器验收与回归验证

**Files:**
- Modify only if a verified defect requires a focused fix: `app.js`, `styles.css`, `warehouse-management.test.mjs`, or `test-ui-content.cjs`

**Interfaces:**
- Consumes: 完成后的本地页面 `http://127.0.0.1:5173/`。
- Produces: 验收证据，不新增产品能力。

- [ ] **Step 1: 启动服务并运行自动检查**

Run: `npm.cmd run check`

Expected: PASS，Node syntax checks、4+ behavior tests、UI content contract 均为 0 failures。

Run: `npm.cmd start`

Expected: 服务监听 `http://127.0.0.1:5173/`。

- [ ] **Step 2: 在浏览器验证创建与持久化**

操作：点击加号，取消一次；再次点击并输入 `排序测试仓`。刷新页面。

Expected: 取消时无变化；新仓创建在首位并自动选中；刷新后仍存在且仍在首位。

- [ ] **Step 3: 在浏览器验证整卡拖拽排序**

操作：从仓库卡片非按钮区域拖动 `排序测试仓` 到第二张卡片下半区后松开，然后刷新。

Expected: 拖动期间有透明度和插入线反馈；松开后顺序改变；当前仓不变；刷新后顺序保持。

- [ ] **Step 4: 在浏览器验证删除规则**

操作：点击非当前仓的删除按钮并取消，再确认删除；删除当前仓；继续删除至列表为空。

Expected: 取消不改变数据；确认会删除；当前仓删除后选择后一个，否则前一个；最后一个也能删除；空状态出现“新建松鼠仓”入口。

- [ ] **Step 5: 检查交互隔离和控制台**

操作：点击仓库图标按钮和删除按钮，观察是否意外开始拖拽；读取浏览器控制台错误。

Expected: 按钮只执行自己的行为，不启动拖拽；控制台无 error。

- [ ] **Step 6: 最终验证与提交必要修复**

若步骤 2–5 暴露缺陷，先为缺陷补失败测试，再做单一修复。随后运行：

Run: `npm.cmd run check`

Expected: PASS，0 failures。

仅在发生修复时提交：

```powershell
git add -- app.js styles.css warehouse-management.test.mjs test-ui-content.cjs
git commit -m "fix: address warehouse management acceptance issues"
```
