# 工具栏内容重制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重制工具栏松鼠素材与三按钮排版，让松鼠真正趴住上边沿，并让图标和文字水平、端正、稳定。

**Architecture:** 新松鼠以独立透明 PNG 替换现有素材引用，保持 `renderToolbar()` 的三个动作不变。CSS 使用统一图标盒、正文无衬线字体和固定三列布局，hover 仅改变视觉属性；内容契约覆盖素材、字体、对齐、焦点和响应式规则。

**Tech Stack:** GPT Image、PNG、Python 背景移除、原生 JavaScript、CSS、Node.js 内容契约、应用内浏览器

## Global Constraints

- 保留“添加松果 / 编辑文档 / 全部重新整理”三个功能和文字。
- 松鼠腹部贴近工具栏上边沿，两只前爪明确压住边框。
- 按钮文字使用正文无衬线字体，图标不旋转，三组内容共用水平基线。
- hover 不改变按钮、图标、文字或松鼠的几何位置。
- 窄屏保持三列，不换行、不重叠、不溢出。

---

### Task 1: 新趴伏松鼠素材

**Files:**
- Reference: `assets/illustrations/squirrel-toolbar-perched.png`
- Create: `assets/illustrations/squirrel-toolbar-perched-v2-source.png`
- Create: `assets/illustrations/squirrel-toolbar-perched-v2.png`

**Interfaces:**
- Produces: `asset("squirrel-toolbar-perched-v2.png", "toolbar-mascot")` 可直接使用的紧边界透明 PNG。

- [ ] **Step 1: 生成纯色背景素材**

根据截图中的橙棕色松鼠 IP，生成横向趴伏姿态：腹部与水平边沿接触，双爪越过边沿，尾巴向右；背景为均匀纯色，不含文字、阴影或其他对象。

- [ ] **Step 2: 转换透明背景**

运行 `remove_chroma_key.py`，以 border 自动取色、soft matte 和 despill 输出 `squirrel-toolbar-perched-v2.png`。

- [ ] **Step 3: 验证素材**

确认 PNG 为 32 位透明格式、角点 alpha 为 0，主体边界紧凑且无明显纯色毛边。

### Task 2: 工具栏内容契约与实现

**Files:**
- Modify: `test-ui-content.cjs`
- Modify: `app.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `asset("squirrel-toolbar-perched-v2.png", "toolbar-mascot")`
- Produces: `.toolbar-icon-box`、端正的三按钮排版、键盘焦点与稳定 hover。

- [ ] **Step 1: 写失败契约**

在 `test-ui-content.cjs` 中要求新素材引用、`.toolbar-icon-box`、`font-family: var(--font-body)`、`white-space: nowrap`、`align-items: center`、`:focus-visible`，并禁止工具栏图标 transform/rotate。

- [ ] **Step 2: 验证契约失败**

Run: `node test-ui-content.cjs`

Expected: FAIL，报告新素材和统一内容布局尚未实现。

- [ ] **Step 3: 实现最小结构**

将三个按钮图标包入：

```html
<span class="toolbar-icon-box">...</span><b>按钮文字</b>
```

并将松鼠引用改为 `squirrel-toolbar-perched-v2.png`。

- [ ] **Step 4: 实现稳定样式**

```css
.bottom-toolbar button {
  align-items: center;
  font-family: var(--font-body);
  font-weight: 700;
  white-space: nowrap;
}

.toolbar-icon-box {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
}
```

图标自身使用 `transform: none`，松鼠以工具栏上边沿为锚点重叠放置；hover 仅保留背景、边框和阴影变化，并添加 `:focus-visible` 轮廓。

- [ ] **Step 5: 验证契约通过**

Run: `node test-ui-content.cjs`

Expected: PASS。

### Task 3: 完整与视觉验收

**Files:**
- Verify: `app.js`
- Verify: `styles.css`
- Verify: `assets/illustrations/squirrel-toolbar-perched-v2.png`

**Interfaces:**
- Produces: 桌面、hover、键盘焦点和窄屏验收结果。

- [ ] **Step 1: 运行完整检查**

Run: `npm.cmd run check`

Expected: 4 tests pass，UI 内容契约通过，0 failures。

- [ ] **Step 2: 浏览器桌面验收**

确认松鼠双爪压住上边沿；三组图标与文字基线一致；按钮文字端正且无换行。

- [ ] **Step 3: 浏览器交互与窄屏验收**

确认 hover 前后几何矩形不变，键盘焦点清晰，窄屏三列不重叠，控制台无错误。

- [ ] **Step 4: 提交实现**

```powershell
git add -- app.js styles.css test-ui-content.cjs assets/illustrations/squirrel-toolbar-perched-v2.png
git commit -m "feat: redesign toolbar content"
```
