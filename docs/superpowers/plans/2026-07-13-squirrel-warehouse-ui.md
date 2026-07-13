# Squirrel Warehouse UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing static front-end so the browser UI closely matches the provided hand-drawn squirrel warehouse reference and shows PRD progress concepts.

**Architecture:** Keep the current vanilla HTML/CSS/JavaScript app. Extend `app.js` data and markup for temporary-bin and ledger status, then tune `styles.css` for reference-image fidelity and responsive fit.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, local PNG assets, Node syntax checks.

## Global Constraints

- Use existing crayon PNG assets from `assets/illustrations`.
- Keep the MVP focused on warehouse list, review document, search, status, collapsible shelf, and bottom toolbar.
- Use user-facing words from the PRD: 松果, 松果仓, 暂存栏, 松果架, 精选松果, 复盘文档, 页面工具栏.
- Do not add dependencies, persistence, upload, collaboration, direct document editing, or custom AI prompt features.
- Preserve current warehouse switching, document filtering, and toast behavior.

---

### Task 1: Add PRD Progress State To Markup

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: existing `warehouses` array and `render()` function.
- Produces: `warehouse.ledger`, `warehouse.temp`, richer cards, and document status markup used by CSS.

- [ ] **Step 1: Verify existing syntax before changes**

Run: `npm run check`
Expected: exit code 0.

- [ ] **Step 2: Update warehouse data**

Add `temp` and `ledger` objects to each warehouse. Example:

```js
temp: { current: 3, limit: 5 },
ledger: {
  shelves: 6,
  featured: 12,
  lastOrganized: "今天 10:30",
  mode: "放进现有果架"
}
```

- [ ] **Step 3: Update markup**

Add a document status row under the document intro and a progress strip inside each warehouse card. Keep all text static and local.

- [ ] **Step 4: Run syntax check**

Run: `npm run check`
Expected: exit code 0.

### Task 2: Tune Visual Styling To Match Reference

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Consumes: class names from Task 1 plus existing class names.
- Produces: reference-like paper panels, crayon borders, compact desktop composition, and non-overlapping responsive layouts.

- [ ] **Step 1: Add styles for status row and temp progress**

Use warm paper fills, green progress, dashed hand-drawn borders, and compact labels.

- [ ] **Step 2: Adjust desktop proportions**

Reduce overly large vertical spacing where needed so the right document content remains visible at a 1280x720 viewport.

- [ ] **Step 3: Improve hand-drawn feel**

Strengthen sketchy outlines, paper texture, soft card color, title underline, and source-card styling using existing assets.

- [ ] **Step 4: Run syntax check**

Run: `npm run check`
Expected: exit code 0.

### Task 3: Browser Verification

**Files:**
- Read: `index.html`, `app.js`, `styles.css`

**Interfaces:**
- Consumes: local dev server at `http://127.0.0.1:5173/`.
- Produces: verified screenshot observations.

- [ ] **Step 1: Open the local page**

Navigate to `http://127.0.0.1:5173/`.

- [ ] **Step 2: Verify visible requirements**

Confirm the page shows: 松鼠仓库 brand, 松果仓列表, selected warehouse, 暂存栏 progress, 复盘文档 title area, 目录, 重点要点, 松果架, and bottom toolbar actions.

- [ ] **Step 3: Compare to reference image**

Check that the composition and styling match the supplied reference: hand-drawn paper panels, crayon icons, warm palette, left list, right document, and squirrel mascot.

- [ ] **Step 4: Check responsive fit**

Inspect at desktop and a narrower viewport. Confirm text does not overlap and buttons/cards retain stable dimensions.
