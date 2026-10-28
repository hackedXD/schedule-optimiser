---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/styles.css","src/components"]
---

# Surface: the optimiser workspace (src/App.tsx)

Scope: the single-page app. Visitor mode: Operate.

Audience and job: one CMU student at registration time, at night at a laptop, pasting course codes and choosing the exact lecture/section codes to register for. Task: enter required courses and pick-N groups, reorder four ranking criteria, read the ranked feasible schedules, inspect one on a weekly grid, copy its codes. Proof/content: the real Spring 2027 Schedule of Classes export. Constraints: no FCE data yet (manual ratings only), no instructor names, lecture/section pairing unknown (pin/exclude controls express it).

Chosen direction: the category standard at Linear's craft level in a terminal register, all-monospace. Memorable moment: changing the criteria order reranks the results list in place with row identity preserved, and the moved rows glow briefly.

Unresolved: end-time direction assumed earlier-is-better; neutral treatment of unrated sections.

## Direction contract

THESIS: A scheduler a category-fluent student trusts on sight: three columns, inputs to grid to results, nothing to learn. It refuses the hidden "best schedule" button; the ranking order is the visible primary control and the whole feasible set stays on screen.

OWN-WORLD (revised 28-Oct-2026, user-pinned "terminal" register): near-black ground in four steps with 1px hairlines; one phosphor-green accent for selection, primary action and the wordmark's blinking cursor; eight ANSI-style course hues at low-alpha fills with full-strength text; traffic-light red/amber/green for danger/warn/ok. JetBrains Mono carries every piece of text, prose included. Controls are flat, 28px tall, 6px radius, no gradients, no shadows. Drawn line icons at 1.5 stroke.

STORY: The student sees their courses on the left, a full week in the middle, every valid schedule ranked on the right. They drag "Start time" above "FCE" and watch the list reorder; they click a row and the grid redraws; they copy the register line.

FIRST VIEWPORT: 1440 wide. 44px top bar: wordmark left, semester and result count centre, "Load export" right. Left panel 320px: Courses (required rows plus pick-N groups inside the same section, rows click to expand, groups can be Ranked with draggable options; an input with a $ prompt that accepts pasted comma lists), then Ranking (six numbered draggable rows), Walking (dorm picker), then Filters. Centre: rank header (#n of N, prev/next, four readouts with the leading criterion emphasised), the Mon–Fri grid from 8am to 9pm with hour rules and course blocks, and a register strip of the exact codes with Copy. Right panel 380px: the ranked list, each row rank + four compact readouts in the current criterion order + section codes. Primary action: the ranking list itself; secondary: Copy codes.

FORM: The category standard (canon exit taken by the user); the grounded list's assigned candidate 6 (The Punch Deck) was declined by the user. Seed key c160665f. Craft bar: Linear.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
