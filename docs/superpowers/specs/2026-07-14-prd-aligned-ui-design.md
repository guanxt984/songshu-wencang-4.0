# PRD-Aligned UI Functional Design

Date: 2026-07-14

## Goal

Align the current Squirrel Warehouse UI with the updated PRD while preserving the existing visual style. This is a functional interface retrofit, not a visual redesign.

## Scope

Keep the existing page composition:

- Left warehouse list
- Center review document
- Right collapsible pinecone shelf drawer
- Bottom floating toolbar

The work should change responsibilities, copy, controls, and data flow so the UI matches the PRD concepts.

## Toolbar

The bottom toolbar must only contain warehouse/document-level actions:

- Add Pinecone
- Edit Document / Save Document
- Reorganize All

The toolbar must not contain:

- Temporary-bin organization action
- Pinecone shelf entry
- Pinecone view/edit/delete/move actions
- User-facing reference-pinecone actions

The current floating, draggable, collapsible toolbar style should remain.

## Add Pinecone Flow

The add panel should let the user paste pinecone text and choose one destination:

- Temporary shelf
- Existing material shelf
- New material shelf

Behavior:

- Temporary shelf: save the original pinecone only; do not update the review document.
- Existing material shelf: save the pinecone into that shelf and update only the matching review-document section.
- New material shelf: create the shelf, save the pinecone into it, and create/update the matching review-document section.

The panel should use the current paper/card visual style and avoid introducing a new modal language.

## Review Document

The review document remains the primary reading and editing area.

It should:

- Show title, section headings, summaries, and key bullets.
- Support edit/save for document text.
- Keep internal pinecone IDs for data integrity.
- Not show user-facing "reference pinecone" buttons or labels.

## Pinecone Shelf Drawer

The right drawer remains the place for raw-material management.

It should show:

- A fixed temporary shelf
- All material shelves
- Pinecones inside each shelf

It should support the functional skeleton for:

- Search pinecones
- View pinecone content
- Edit pinecone content
- Delete pinecone
- Move pinecone to another shelf

These actions must stay inside the shelf drawer and must not appear in the toolbar.

## Reorganize All

The toolbar's Reorganize All action should read all pinecones and rebuild shelf assignment plus the review document.

The mock organizer should:

- Avoid generating user-facing tags or labels.
- Avoid user-facing reference entries in the review document.
- Preserve original pinecone text.
- Update the whole document after reorganization.

## Data Model Adjustments

The existing in-browser state can remain localStorage-backed.

Required state additions:

- Add-panel destination mode
- Selected existing shelf ID
- New shelf name
- Shelf-drawer search query
- Pinecone edit draft state, if inline editing needs a stable draft

Existing `pineconeIds` may remain in review-document bullets as internal metadata.

## Testing

Update `test-ui-content.cjs` to assert:

- Toolbar exposes only the three PRD actions.
- Old user-facing actions are absent: "上传知识条", "整理暂存", and visible "引用松果" entry.
- Add Pinecone supports temporary shelf, existing material shelf, and new material shelf.
- Pinecone shelf drawer includes search, edit, delete, and move affordances.
- Existing style anchors remain: bottom toolbar, collapsed toolbar, right shelf drawer, approved icon assets.

Run `npm.cmd run check` after implementation.

## Non-Goals

- No visual redesign.
- No new backend.
- No browser plugin, OCR, file upload, collaboration, public sharing, or custom prompts.
- No full version-history system.
