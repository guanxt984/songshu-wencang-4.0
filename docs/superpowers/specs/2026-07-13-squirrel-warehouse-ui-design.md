# Squirrel Warehouse UI Design

## Goal

Align the local browser interface with the supplied hand-drawn reference while reflecting the PRD's current MVP direction: a single-page "pinecone warehouse" where saved fragments are organized by AI into a readable review document and matching pinecone shelf.

## Product Context

The PRD defines the core concepts as pinecones, pinecone warehouses, a temporary bin, shelves, tags, featured pinecones, review documents, and a basic warehouse ledger. The MVP must make warehouse switching, pinecone accumulation, AI organizing, review-document reading, the collapsible shelf, and page-level tools understandable without academic or engineering copy.

## Visual Direction

The interface should closely match the reference image: warm paper background, sketchy tan borders, brown hand-drawn title treatment, green accents, crayon-style squirrel/pinecone/leaf/grass assets, and soft pastel warehouse cards. It should avoid a modern SaaS dashboard feel, large marketing sections, glossy gradients, and generic decorative blobs.

## Layout

Keep the existing two-panel workbench:

- Header: brand mark, squirrel mascot, search and profile icon buttons.
- Left panel: "松果仓列表" with warehouse cards, pinecone counts, update times, selected state, and a compact temporary-bin progress cue.
- Right panel: current warehouse content area, with review document as the primary surface.
- Shelf: a right-side pinecone shelf that is collapsed by default and expands on demand. Its sections match the review document chapters.
- Toolbar: bottom page toolbar with reorganize, edit document, add pinecone, and shelf toggle actions.
- Add a small ledger/status row near the document title so the PRD progress is visible without introducing another page.

## Interaction Scope

Keep the current static interactions: warehouse switching, document search, shelf expand/collapse, toolbar toasts, and toast messages. Add copy and state fields only where they support the MVP story. Do not add persistence, authentication, upload, browser extension, custom AI prompts, collaboration, or complex history.

## Responsive Requirements

At desktop widths, preserve the reference's left-list plus right-document composition. At narrower widths, stack panels cleanly, keep text inside cards, and avoid overlapping mascot or action controls.

## Verification

Run JavaScript syntax checks, inspect the local page in the browser at `http://127.0.0.1:5173/`, and compare a screenshot against the reference for composition, spacing, visual language, and PRD concept visibility.
