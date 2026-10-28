---
name: Schedule Optimiser
description: A dark, monospace-led course scheduler at Linear's craft level; three columns, hairlines, one blue.
colors:
  ink-floor: "#0b0d11"
  ink-panel: "#10131a"
  ink-raised: "#161a22"
  ink-hover: "#1d222c"
  hairline: "#1c2130"
  hairline-strong: "#262d3d"
  hairline-hover: "#33405a"
  text-primary: "#e7eaf1"
  text-secondary: "#a0a8b8"
  text-tertiary: "#7f8aa3"
  signal-blue: "#6e9cf5"
  signal-blue-bright: "#8db0ff"
  signal-blue-soft: "rgb(110 156 245 / 0.14)"
  signal-blue-ring: "rgb(110 156 245 / 0.55)"
  signal-blue-selection: "rgb(110 156 245 / 0.35)"
  danger: "#f0716f"
  danger-soft: "rgb(240 113 111 / 0.14)"
  warn: "#e3b341"
  warn-soft: "rgb(227 179 65 / 0.14)"
  ok: "#58c58c"
  ok-soft: "rgb(88 197 140 / 0.14)"
  course-blue: "hsl(222 80% 68%)"
  course-violet: "hsl(268 70% 70%)"
  course-teal: "hsl(172 55% 55%)"
  course-amber: "hsl(38 85% 62%)"
  course-rose: "hsl(345 70% 68%)"
  course-lime: "hsl(95 50% 58%)"
  course-orange: "hsl(20 80% 64%)"
  course-cyan: "hsl(195 70% 60%)"
typography:
  display:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.01em"
    fontFeature: "'tnum' 1, 'zero' 1"
  headline:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.45
  title:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0.04em"
  body:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum' 1, 'zero' 1"
  body-prose:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.06em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  pill: "8px"
spacing:
  "2": "2px"
  "4": "4px"
  "6": "6px"
  "8": "8px"
  "10": "10px"
  "12": "12px"
  "14": "14px"
  "16": "16px"
components:
  button:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  button-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.text-primary}"
  button-disabled:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.text-tertiary}"
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.ink-floor}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-bright}"
    textColor: "{colors.ink-floor}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  button-ghost-hover:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.text-primary}"
  button-sm:
    padding: "0 8px"
    height: "24px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.text-tertiary}"
    rounded: "{rounded.sm}"
    size: "24px"
  icon-button-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.text-primary}"
  icon-button-on:
    textColor: "{colors.signal-blue}"
  field:
    backgroundColor: "{colors.ink-floor}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "28px"
  number-input:
    backgroundColor: "{colors.ink-floor}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "0 6px"
    height: "24px"
    width: "46px"
  switch:
    backgroundColor: "{colors.ink-hover}"
    rounded: "{rounded.pill}"
    width: "28px"
    height: "16px"
  switch-on:
    backgroundColor: "{colors.signal-blue}"
  tag:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "0 6px"
    height: "18px"
  tag-accent:
    backgroundColor: "{colors.signal-blue-soft}"
    textColor: "{colors.signal-blue}"
  tag-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
  tag-warn:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.warn}"
  tag-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
  group-card:
    backgroundColor: "{colors.ink-floor}"
    rounded: "{rounded.lg}"
    padding: "8px"
  criterion-row:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "6px 6px 6px 4px"
    height: "40px"
  criterion-row-lead:
    backgroundColor: "{colors.signal-blue-soft}"
    textColor: "{colors.signal-blue-bright}"
  result-row:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0 6px 0 4px"
    height: "44px"
  result-row-selected:
    backgroundColor: "{colors.signal-blue-soft}"
    textColor: "{colors.text-primary}"
  register-item:
    backgroundColor: "{colors.ink-raised}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "26px"
  banner-warn:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.warn}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  banner-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
---

# Design System: Schedule Optimiser

## Overview

**Creative North Star: "The Registration Console"**

A single-user tool a CMU student opens at night, at registration time, to find the exact lecture and section codes to enter. The world is the category standard for a scheduler (inputs left, Monday-to-Friday grid centre, ranked list right) executed at Linear's craft level: a dark-only interface built from four steps of cool near-black, 1px hairlines, one desaturated electric blue, and a monospace voice. Nothing is decorative; monospace is the product's own language (course codes, section labels, clock times, ranks, tabular numerals), so JetBrains Mono carries everything that is data and Inter is reserved for the few sentences of prose and course titles.

Density is high and even. The body size is 12.5px, controls are 28px tall, list rows are 26–44px, and section padding is 14px. Depth is tonal, never cast: surfaces step up by lightness and hairlines separate regions; there are no box-shadows anywhere in the build except the 3px soft halo on a focused text field. Colour is held in reserve: the blue appears only on the selected result, the leading criterion, the primary action, the focus ring, and the "on" state of icon controls. Course identity is carried by eight muted hues at 16% alpha fills with full-strength text.

Motion is short and eased out hard (120ms / 200ms on `cubic-bezier(0.16, 1, 0.3, 1)`), used for state changes only. The one deliberate moment is the results list re-sorting in place when the ranking order changes: moved rows carry a 1px inset blue ring that fades over 1.4s.

**Key Characteristics:**
- Dark only (`color-scheme: dark`, no light theme); four cool near-black surfaces plus two hairline tones.
- Monospace-first typography with tabular numerals and slashed zero on by default; Inter only for prose and course titles.
- One accent (signal blue) for selection, lead, primary action and focus; semantic red / amber / green only as 14% tints with full-strength text.
- Flat, hairline-bordered surfaces; no gradients, no shadows, no blur.
- Eight course hues as `hsl()` triplets, applied as 16% fill / 45% border / 100% text.
- Short eased-out transitions; motion only as a response to state.

## Colors

A cool, blue-leaning near-black ramp with a single electric-blue signal; everything else is a tint at 14% alpha with the full-strength colour on top for text.

### Primary
- **Signal Blue** (`signal-blue`, #6e9cf5): the one accent. Primary button fill, selected result row text rank, the "1" priority badge of the leading criterion, "on" icon buttons, links, caret, native `accent-color`, the lead column head in the results table.
- **Signal Blue Bright** (`signal-blue-bright`, #8db0ff): hover of the primary button and the text of the leading readout and leading criterion name; the brighter step reads as emphasis, not as a second accent.
- **Signal Blue Soft** (`signal-blue-soft`, 14% alpha): the selected result row background, the leading criterion row background, the accent tag background, and the 3px halo around a focused field.
- **Signal Blue Ring** (`signal-blue-ring`, 55% alpha): the 2px `:focus-visible` outline and the inset ring on a just-moved result row.
- **Signal Blue Selection** (35% alpha): text selection highlight only.

### Secondary (status)
- **Danger Red** (`danger`, #f0716f): parse-failure banner, invalid field border, the "excluded" icon button when on, danger tags; always paired with `danger-soft` for backgrounds.
- **Warn Amber** (`warn`, #e3b341): the warning banner and warn tags, with `warn-soft` behind.
- **OK Green** (`ok`, #58c58c): the ok tag with `ok-soft` behind. Rare.

### Tertiary (course identity)
Eight muted hues indexed by the course's position in the request: **course-blue** (222°), **course-violet** (268°), **course-teal** (172°), **course-amber** (38°), **course-rose** (345°), **course-lime** (95°), **course-orange** (20°), **course-cyan** (195°). Each is used three ways from one `hsl()` triplet: full strength for block text, the swatch and the register code; 16% alpha for the block fill; 45% alpha for the block border. Lightness sits between 55% and 70% so every hue reads on the dark grid.

### Neutral
- **Ink Floor** (`ink-floor`, #0b0d11): page background, the centre column, text-field wells, the pick-group card interior, and the text colour on anything filled with signal blue.
- **Ink Panel** (`ink-panel`, #10131a): top bar, left and right panels, the week grid, rank head, register strip, empty-state diagnostics.
- **Ink Raised** (`ink-raised`, #161a22): default button fill, criterion rows, open course rows, register chips, row hover.
- **Ink Hover** (`ink-hover`, #1d222c): hover of buttons and offerings, the switch track, tag backgrounds, the wordmark mark, priority badges.
- **Hairline** (`hairline`, #1c2130): every structural 1px border — panel edges, section dividers, grid rules, register chip border.
- **Hairline Strong** (`hairline-strong`, #262d3d): borders on controls (button, field, number input, switch, group card) and the scrollbar thumb.
- **Hairline Hover** (`hairline-hover`, #33405a): hovered button border and hovered scrollbar thumb.
- **Text Primary** (`text-primary`, #e7eaf1): codes, values, headings.
- **Text Secondary** (`text-secondary`, #a0a8b8): section titles, course titles, result rows at rest, toggle labels, day heads.
- **Text Tertiary** (`text-tertiary`, #7f8aa3): counts, hints, axis hours, column heads, placeholders, disabled text, excluded offerings, "none" values.

### Named Rules
**The One Blue Rule.** Signal blue marks exactly four things: what is selected, what leads, the primary action, and focus. It is never used for decoration, headings, or icons at rest.

**The Tint-Plus-Ink Rule.** Status and course colours never fill a surface at full strength. The fill is the colour at 14–16% alpha; the text is the colour at 100%. The only solid colour fill in the world is the primary button.

**The Hairline Rule.** Regions are separated by 1px `hairline` borders, never by shadow, gradient, or a change of more than one surface step.

## Typography

**Display Font:** JetBrains Mono (with `ui-monospace, SFMono-Regular, Menlo, monospace`)
**Body Font:** JetBrains Mono (same stack); set at 12.5px / 1.45 on `body` with `'tnum' 1, 'zero' 1` on by default.
**Label/Prose Font:** Inter (with `system-ui, -apple-system, 'Segoe UI', sans-serif`), applied via the `.sans` utility with `font-feature-settings: normal`.

Both faces load from Google Fonts (`index.html`): Inter 400/500/600 and JetBrains Mono 400/500/600/700, `display=swap`, with preconnects to `fonts.googleapis.com` and `fonts.gstatic.com`.

**Character:** Monospace is the voice of the data, not a costume. Codes, times, ranks and values are mono with tabular figures and slashed zeros so columns line up and `0`/`O` never collide. Inter steps in only where a human wrote a sentence: course titles, helper paragraphs, the empty state, banners, the results footnote. The two faces never share a line except code + title in a course row.

### Hierarchy
- **Display** (600, 15px, -0.01em): the rank readout `#3 of 144` in the rank head; the only size above 14px in the world.
- **Headline** (600, 14px): the empty-state heading.
- **Title** (600, 11px, +0.04em, uppercase): section headings (COURSES, RANKING, SCHEDULES), day heads, offering group labels (10.5px). Secondary text colour.
- **Body** (400, 12.5px / 1.45, mono): default; course codes at 600, offering labels and criterion names at 500. Readout values are 13px / 500; result values 12px.
- **Body prose** (400, 12px / 1.5, Inter): course titles (12px, secondary), helper copy (11–11.5px, tertiary), banners (11.5px / 1.4), empty-state paragraph.
- **Label** (400, 10px, +0.06em, uppercase, tertiary): readout keys, results column heads, the REGISTER label (10.5px). Tags are 10.5px / 500 / +0.02em; sub-values 10px.

### Named Rules
**The Mono-For-Data Rule.** If it is a code, a time, a number or a rank it is set in JetBrains Mono with tabular numerals. If it is a sentence it is Inter. No exceptions.

**The Twelve-and-a-Half Rule.** Body is 12.5px. Everything else is within 10–15px; nothing is larger than the rank display at 15px.

## Layout

A fixed three-column workspace filling the viewport. The app is a CSS grid of `44px 1fr` rows and `320px minmax(0,1fr) 340px` columns: top bar across, inputs panel left, grid centre, results panel right. Panels scroll internally; the page itself does not. The left panel stacks sections (Courses, Pick from, Ranking, Filters) separated by hairlines, each padded `14px 14px 16px` with a 10px gap below the section head. The centre is a column: 48px rank head, a scrolling `grid-wrap` padded `12px 16px 8px`, and a register strip (`10px 16px 12px`, min 52px). The right panel is a 48px head, a 10px column-head row, the scrolling list padded `4px 6px 8px`, and a footnote.

The week grid is `48px` axis plus one `minmax(0,1fr)` column per day, a 26px day-head row, minimum height 560px, hairline-bordered with a 10px radius. Blocks are absolutely positioned by minute with 3px side insets and 1px vertical gaps.

Spacing rhythm is a 2px base used at 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16; nothing larger than 24px (the empty-state padding) occurs. Control heights: 28px standard (`--control-h`), 24px small buttons and icon buttons and number inputs, 26px offerings and register chips, 32px course rows, 40px criterion rows, 44px result rows, 48px rank and results heads.

Breakpoints:
- **≤1100px**: two columns (`300px minmax(0,1fr)`); the results panel drops below the grid as a 320px-tall row with a top hairline instead of a left one.
- **≤760px**: one column, page scrolls (`height: auto`); panels stack top → left → centre → right, results panel fixed at 420px tall; the rank head wraps with readouts on their own full-width row; the week grid tightens (38px axis, 520px min, blocks lose time and title and stack the code vertically at 10px); the top bar hides the wordmark text, the source string and the status dots.
- `prefers-reduced-motion: reduce` collapses all transitions and animations to 0.01ms.

## Elevation & Depth

No shadows. Depth is tonal: four surface steps (`ink-floor` → `ink-panel` → `ink-raised` → `ink-hover`) plus two hairline tones, and any region is distinguished from its neighbour by a 1px hairline, a one-step surface change, or both. Interactive surfaces step up one tone on hover (button `ink-raised` → `ink-hover`, row transparent → `ink-raised`) and back down on active. The only box-shadow in the build is the focused field's `0 0 0 3px signal-blue-soft` halo, which is a focus signal, not elevation. Wells (text fields, group cards) sit on `ink-floor`, one step *below* the panel, so inputs read as recessed rather than lifted. Scrollbars are 10px thin tracks on transparent with an `hairline-strong` thumb.

### Named Rules
**The No-Shadow Rule.** Nothing casts. Hover lifts a surface by one tonal step; focus draws a ring; selection tints. If a future popover needs separation it must earn it with a hairline and a surface step first.

## Shapes

Small, consistent radii on a rectilinear plan. Three steps: 4px (`sm`) for icon buttons, number inputs, tags, course blocks, offering rows and the focus-ring corner; 6px (`md`) for buttons, fields, course rows, criterion rows, result rows, register chips, banners; 10px (`lg`) for the week grid frame, pick-group cards and the loading skeleton. The switch is a 16px-tall pill (8px radius) with a 10px round knob. Swatches are 8px (or 6px inline) squares with a 2px radius; status dots in the top bar are 3px circles. Borders are always 1px; controls use `hairline-strong`, structure uses `hairline`. Course blocks are the only elements with a coloured border (the course hue at 45%). Icons are hand-drawn 16-unit line paths at 1.5 stroke, round caps and joins, rendered at 12–14px inside controls.

## Components

Controls are flat, quiet and exact: one tonal step on hover, a blue ring on keyboard focus, no transform, no shadow. Every state is a colour change on the same geometry.

### Buttons
- **Shape:** gently rounded (6px), 28px tall, `0 10px` padding, inline-flex with a 6px gap for a 13px icon; small variant 24px tall, `0 8px`, 11.5px text.
- **Default:** `ink-raised` fill, `hairline-strong` border, primary text. Hover → `ink-hover` fill and `hairline-hover` border; active → back to `ink-raised`. Disabled → tertiary text, default cursor.
- **Primary:** solid signal blue, transparent border, `ink-floor` text at 600. Hover → signal blue bright. Used for the single call to action in an empty state and, transiently, the Copy button after a successful copy.
- **Ghost:** transparent fill and border, secondary text. Hover → `ink-raised` fill, primary text. Used in heads ("Clear", "Group", "Bundled export").
- **Icon button:** 24px square, 4px radius, tertiary colour. Hover → `ink-hover` fill, primary colour. `.on` → signal blue; `.danger.on` → danger red. Disabled → 35% opacity.
- **Transitions:** background, border-color, color at 120ms on the standard ease.

### Chips (tags)
- **Style:** 18px tall, 4px radius, `0 6px`, 10.5px / 500 / +0.02em mono; `ink-hover` fill with secondary text.
- **Variants:** `accent`, `danger`, `warn`, `ok` each use the 14% soft tint as fill and the full colour as text.
- **Register chip** (`reg-item`): 26px, 6px radius, `ink-raised` on a `hairline` border; code in the course hue at 600, separators tertiary, alternates secondary.

### Cards / Containers
- **Pick-group card:** 10px radius, `hairline-strong` border, `ink-floor` interior (recessed), 8px padding, 8px bottom margin.
- **Criterion row:** 40px min, 6px radius, `ink-raised`, grab cursor, 16px grip + 20px right-aligned index + name/direction stack + arrow buttons that appear on hover/focus-within. The first row is the lead: `signal-blue-soft` fill, name in signal blue bright, index in signal blue at 600. Dragging → 40% opacity; drop target → signal-blue border.
- **Week grid:** `ink-panel` frame, hairline rules per hour, 10px radius, overflow hidden.
- **Banner:** 6px radius, `8px 10px`, 11.5px Inter / 1.4, soft tint fill with full-colour text and a 14px leading icon.
- **Empty-state diagnostic:** `ink-panel`, `hairline-strong` border, 6px radius, `10px 12px`, 11.5px secondary text.

### Inputs / Fields
- **Field:** 28px, 6px radius, `ink-floor` well on a `hairline-strong` border, `0 8px`, 8px gap for a trailing hint (tertiary, 11px) or icon. Placeholder tertiary.
- **Focus:** `:focus-within` → border signal blue plus `0 0 0 3px signal-blue-soft` halo, 120ms.
- **Invalid:** border danger red; hint text in danger.
- **Number input:** 46×24px, 4px radius, right-aligned, same well; focus → signal-blue border; spin button at 40% opacity.
- **Switch:** 28×16px pill, `ink-hover` track on `hairline-strong`, 10px secondary knob; `aria-checked="true"` → signal blue track and border, knob slides 12px and turns `ink-floor`. The surrounding toggle row is 28px, secondary text, primary on hover.

### Navigation
- **Top bar:** 44px, `ink-panel`, bottom hairline, `0 14px`, 16px gap. Wordmark is a 20px `ink-hover` rounded (5px) mark holding a 13px signal-blue icon plus the name at 600 / -0.01em. Status runs in secondary text with 3px tertiary dots as separators. Actions sit right as small default/ghost buttons.
- **Rank head:** 48px, `ink-panel`, bottom hairline; rank display at 15px / 600, prev/next icon buttons, then four readouts pushed right, each `0 14px` with a left hairline and 92px min width. A readout is a 10px uppercase key with a 14px priority badge above a 13px / 500 value; the lead readout's badge is solid signal blue on `ink-floor` text and its value is signal blue bright.
- **Results head:** 48px with the section title and count, then a 10px uppercase column-head row where the lead column is signal blue.

### Signature: Result row and Course block
- **Result row:** 44px, 6px radius, a `34px + 4×1fr` grid of right-aligned 12px values in the current criterion order with the lead value in primary text at 500, and a second line of course swatches + section codes at 11px tertiary. Rest: secondary text, transparent. Hover: `ink-raised`. Selected: `signal-blue-soft` fill, primary text, rank in signal blue. Moved (after a re-rank): a 1px inset `signal-blue-ring` box-shadow fading to transparent over 1400ms.
- **Course block:** absolutely positioned in its day column, 4px radius, `4px 6px` padding, course hue at 16% fill, 45% border, 100% text; code at 11.5px / 600 with the section label at 500 and 90% opacity, time at 10.5px / 85%, title in Inter 10.5px / 85%, ellipsised. Short blocks drop time and title; mini-semester blocks carry an `m3`/`m4` corner mark at 9px. Transform and opacity transition at 200ms.
- **Offering row:** 26px, 4px radius, secondary text; label primary at 500; TBA times italic tertiary; **excluded** → label and time tertiary with `line-through`; pin / exclude icon buttons at right.
- **Copied state:** the Copy button swaps to the primary variant with a check icon and the word "Copied" for 1600ms, then reverts.
- **Skeleton:** `ink-raised`→`ink-hover` linear shimmer, 1.4s, 4px radius (10px on the grid placeholder).

## Do's and Don'ts

### Do:
- **Do** keep controls at 28px (24px small) with a 6px radius and a 1px `hairline-strong` border; hover is one tonal step up, not a transform.
- **Do** set every code, time, rank and number in JetBrains Mono with tabular numerals; reserve Inter for sentences and course titles.
- **Do** reserve signal blue for selection, lead, primary action and focus; the lead criterion and selected result are the only blue-filled rows on screen.
- **Do** build status and course colour as a 14–16% tint fill with the full-strength colour as text and (for course blocks) a 45% border.
- **Do** separate regions with 1px `hairline` borders and surface steps; wells sit one step below their panel on `ink-floor`.
- **Do** use the standard ease `cubic-bezier(0.16, 1, 0.3, 1)` at 120ms for colour state and 200ms for position; honour `prefers-reduced-motion`.
- **Do** draw icons as 16-unit line paths at 1.5 stroke with round caps, rendered at 12–14px.

### Don't:
- **Don't** add box-shadows, gradients, blur or glows; the only halo in the world is the 3px focus halo on a field.
- **Don't** introduce a light theme or theme switch; the world is `color-scheme: dark` only.
- **Don't** fill a surface with a status or course colour at full strength; solid fills belong to the primary button alone.
- **Don't** use a second accent or a hue-coded heading; headings are 11px uppercase mono in secondary text.
- **Don't** set text above 15px or below 9px; the type world lives between 10px labels and the 15px rank display.
- **Don't** replace drawn line icons with glyph fonts, emoji or an icon package.
