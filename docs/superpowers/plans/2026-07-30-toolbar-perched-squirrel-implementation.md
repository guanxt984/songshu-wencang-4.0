# 工具栏趴伏松鼠 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一文档与松果仓图标，生成趴伏松鼠透明 PNG，并让常驻展开工具栏在默认、悬停和窄屏状态下保持稳定。

**Architecture:** 新素材作为独立 PNG 放入现有插画目录，由 `app.js` 的资源辅助函数渲染。工具栏继续使用文档卡片内的绝对定位容器，但移除折叠状态分支，以三列固定操作布局和不改变几何尺寸的悬停样式保证稳定。

**Tech Stack:** GPT Image、PNG、本地背景移除、原生 JavaScript、HTML、CSS、Node.js 内容契约测试

## Global Constraints

- 松鼠视觉中心位于工具栏宽度约 80% 的位置。
- 松鼠前爪必须与工具栏上边沿重叠。
- 工具栏始终显示三个操作按钮，不保留折叠入口或折叠状态。
- 悬停不得改变工具栏尺寸、网格列、松鼠位置或按钮排版。
- 文档标题使用 `pinecone-warehouse-icon.png`。

---

### Task 1: 趴伏松鼠透明 PNG

**Files:**
- Reference: `assets/illustrations/squirrel-crayon.png`
- Create: `assets/illustrations/squirrel-toolbar-perched.png`

**Interfaces:**
- Produces: 可由 `asset("squirrel-toolbar-perched.png", className)` 使用的透明 PNG。

- [ ] **Step 1: 生成素材**

使用现有松鼠 IP 作为风格参考，生成横向趴伏、前爪搭住水平边沿的单只松鼠，使用纯色抠图背景。

- [ ] **Step 2: 去除纯色背景**

运行 imagegen 技能提供的 `remove_chroma_key.py`，输出透明 PNG 到插画目录。

- [ ] **Step 3: 检查素材**

确认 PNG 具有透明通道、主体边缘无明显底色，并且前爪姿态可与水平工具栏边框重叠。

### Task 2: 图标统一与折叠功能移除

**Files:**
- Modify: `test-ui-content.cjs`
- Modify: `app.js`

**Interfaces:**
- Consumes: `asset("pinecone-warehouse-icon.png", "book-icon")`
- Consumes: `asset("squirrel-toolbar-perched.png", "toolbar-mascot")`
- Produces: 始终展开、仅含三个动作的 `renderToolbar()`。

- [ ] **Step 1: 写入失败契约**

在 `test-ui-content.cjs` 中要求新松鼠素材与文档仓库图标存在，并禁止 `toggle-toolbar`、`toolbarCollapsed`、`.toolbar-collapse` 和 `.bottom-toolbar.collapsed`。

- [ ] **Step 2: 验证契约失败**

Run: `node test-ui-content.cjs`

Expected: FAIL，报告新素材/图标引用缺失以及折叠功能仍存在。

- [ ] **Step 3: 修改最小实现**

在 `app.js` 中：

```js
${asset("pinecone-warehouse-icon.png", "book-icon")}
```

并将 `renderToolbar()` 简化为只渲染三个动作：

```js
function renderToolbar() {
  return `
    <div class="document-toolbar-tab">
      <footer class="bottom-toolbar" data-toolbar>
        ${asset("squirrel-toolbar-perched.png", "toolbar-mascot")}
        <button type="button" data-action="toggle-add">...</button>
        <button type="button" data-action="toggle-document-edit">...</button>
        <button type="button" data-action="reorganize">...</button>
      </footer>
    </div>
  `;
}
```

删除 `toggleToolbar()`、`toggle-toolbar` 事件分支及 `toolbarCollapsed` 持久化状态。

- [ ] **Step 4: 验证脚本行为契约通过**

Run: `node test-ui-content.cjs`

Expected: PASS。

### Task 3: 工具栏视觉与响应式稳定性

**Files:**
- Modify: `test-ui-content.cjs`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.bottom-toolbar` 三列按钮结构。
- Produces: `.toolbar-mascot` 在桌面和窄屏上的稳定趴伏定位。

- [ ] **Step 1: 写入失败样式契约**

要求 `.bottom-toolbar` 使用三列布局，`.toolbar-mascot` 使用约 `left: 80%` 的定位基准和 `transform: translateX(-50%)`，并要求 hover 只改变视觉属性。

- [ ] **Step 2: 验证样式契约失败**

Run: `node test-ui-content.cjs`

Expected: FAIL，报告旧四列布局与松鼠定位不符合要求。

- [ ] **Step 3: 实现稳定布局**

将工具栏网格改为：

```css
.bottom-toolbar {
  grid-template-columns: repeat(3, minmax(132px, 1fr));
}

.toolbar-mascot {
  left: 80%;
  top: 0;
  transform: translate(-50%, -72%);
}
```

删除折叠工具栏、圆形入口及旧松鼠对应样式；为 hover 增加仅涉及 `border-color`、`background` 和 `box-shadow` 的过渡，并加入 `prefers-reduced-motion` 处理。窄屏只调整松鼠尺寸和三列最小宽度。

- [ ] **Step 4: 运行完整检查**

Run: `npm.cmd run check`

Expected: PASS，0 failures。

### Task 4: 浏览器视觉验收

**Files:**
- Verify: `app.js`
- Verify: `styles.css`
- Verify: `assets/illustrations/squirrel-toolbar-perched.png`

**Interfaces:**
- Produces: 默认、悬停和窄屏三个状态的视觉验收结果。

- [ ] **Step 1: 刷新本地产品页面**

确认文档标题显示仓库 Logo，工具栏仅有三个按钮。

- [ ] **Step 2: 检查默认与悬停状态**

确认松鼠位于右侧约 20% 区域，前爪搭住工具栏边沿；悬停前后按钮与松鼠均不跳位。

- [ ] **Step 3: 检查窄屏状态**

在窄视口确认三个按钮不重叠，松鼠不越出文档区域，并且没有缩小工具栏入口。

- [ ] **Step 4: 提交改动**

```powershell
git add -- app.js styles.css test-ui-content.cjs assets/illustrations/squirrel-toolbar-perched.png
git commit -m "feat: refine document toolbar mascot"
```
