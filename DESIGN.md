---
name: Schedule Optimiser
description: A dark terminal-world course scheduler; near-black glass, one phosphor green, ANSI course hues, JetBrains Mono for everything.
colors:
  glass-floor: "#050607"
  glass-panel: "#0a0c0e"
  glass-raised: "#101317"
  glass-hover: "#171b21"
  hairline: "#171c22"
  hairline-strong: "#232b35"
  hairline-hover: "#31404f"
  text-primary: "#d9e4d4"
  text-secondary: "#98a797"
  text-tertiary: "#778a7e"
  phosphor: "#4ee38a"
  phosphor-bright: "#86f2b3"
  phosphor-soft: "rgb(78 227 138 / 0.13)"
  phosphor-ring: "rgb(78 227 138 / 0.55)"
  danger: "#ff5f57"
  danger-soft: "rgb(255 95 87 / 0.14)"
  warn: "#ffbd2e"
  warn-soft: "rgb(255 189 46 / 0.14)"
  ok: "#4ee38a"
  ok-soft: "rgb(78 227 138 / 0.14)"
  course-cyan: "hsl(191 90% 70%)"
  course-magenta: "hsl(326 100% 74%)"
  course-yellow: "hsl(65 92% 76%)"
  course-orange: "hsl(31 100% 71%)"
  course-purple: "hsl(265 89% 78%)"
  course-red: "hsl(0 100% 70%)"
  course-blue: "hsl(216 100% 70%)"
  course-green: "hsl(135 94% 65%)"
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
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.55
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
    backgroundColor: "{colors.glass-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  button-hover:
    backgroundColor: "{colors.glass-hover}"
    textColor: "{colors.text-primary}"
  button-disabled:
    backgroundColor: "{colors.glass-raised}"
    textColor: "{colors.text-tertiary}"
  button-on:
    backgroundColor: "{colors.glass-raised}"
    textColor: "{colors.phosphor}"
  button-primary:
    backgroundColor: "{colors.phosphor}"
    textColor: "{colors.glass-floor}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  button-primary-hover:
    backgroundColor: "{colors.phosphor-bright}"
    textColor: "{colors.glass-floor}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  button-ghost-hover:
    backgroundColor: "{colors.glass-raised}"
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
    backgroundColor: "{colors.glass-hover}"
    textColor: "{colors.text-primary}"
  icon-button-on:
    textColor: "{colors.phosphor}"
  field:
    backgroundColor: "{colors.glass-floor}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "28px"
  select:
    backgroundColor: "{colors.glass-floor}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "0 22px 0 6px"
    height: "24px"
  number-input:
    backgroundColor: "{colors.glass-floor}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "0 6px"
    height: "24px"
    width: "46px"
  switch:
    backgroundColor: "{colors.glass-hover}"
    rounded: "{rounded.pill}"
    width: "28px"
    height: "16px"
  switch-on:
    backgroundColor: "{colors.phosphor}"
  tag:
    backgroundColor: "{colors.glass-hover}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "0 6px"
    height: "18px"
  tag-accent:
    backgroundColor: "{colors.phosphor-soft}"
    textColor: "{colors.phosphor}"
  tag-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
  tag-warn:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.warn}"
  tag-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
  rank-badge:
    backgroundColor: "{colors.glass-hover}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    size: "14px"
  group-card:
    backgroundColor: "{colors.glass-floor}"
    rounded: "{rounded.lg}"
    padding: "8px"
  criterion-row:
    backgroundColor: "{colors.glass-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "6px 6px 6px 4px"
    height: "40px"
  criterion-row-lead:
    backgroundColor: "{colors.phosphor-soft}"
    textColor: "{colors.phosphor-bright}"
  result-row:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0 6px 0 4px"
    height: "44px"
  result-row-selected:
    backgroundColor: "{colors.phosphor-soft}"
    textColor: "{colors.text-primary}"
  register-item:
    backgroundColor: "{colors.glass-raised}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "26px"
  about:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    padding: "6px 8px 8px"
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

**Creative North Star: "The Phosphor Terminal"**

A single-user tool a CMU student opens at night, at registration time, to find the exact lecture and section codes to enter. The world is the category standard for a scheduler (inputs left, Monday-to-Friday grid centre, ranked list right) rendered as a terminal: near-black glass in four steps, 1px hairlines, one phosphor green, and a single monospace voice. The green is the terminal's ink: it is the caret, the `$` prompt in the course field, the blinking cursor after the wordmark, the focus ring, the primary action, the lead criterion, the selected result and the "on" state of any control. Semantic status borrows the macOS traffic lights (red, amber, and the same green as "ok"). Course identity is carried by eight saturated ANSI hues (cyan, magenta, yellow, orange, purple, red, blue, green), the colours a terminal theme would print, applied as 16% fills with the hue at full strength for text.

There is one typeface. JetBrains Mono carries every string in the interface, codes and sentences alike; `--sans` exists only as an alias of `--mono` so legacy class hooks resolve to the same face. Prose is distinguished from data by size and leading (11–11.5px / 1.5–1.55 in secondary or tertiary text) rather than by a second family. Density is high and even: body 12.5px, controls 28px tall, list rows 26–44px, section padding 14px. Depth is tonal, never cast: surfaces step up by lightness and hairlines separate regions; the only box-shadows in the build are the 3px soft halo on a focused field and the fading inset ring on a just-moved result row.

Motion is short and eased out hard (120ms / 200ms on `cubic-bezier(0.16, 1, 0.3, 1)`) and used for state only, with two exceptions: the wordmark's cursor blinks on a 1.1s stepped cycle, the one authored motion in the world, and the results list re-sorting in place when the ranking order changes, where moved rows carry a 1px inset green ring that fades over 1.4s.

**Key Characteristics:**
- Dark only (`color-scheme: dark`, no light theme); four near-black glass surfaces plus three hairline tones, all faintly cool with a green-grey text ramp.
- One typeface: JetBrains Mono 400/500/600 for everything, tabular numerals and slashed zero on by default; no sans-serif anywhere.
- One accent (phosphor green) for prompt, cursor, caret, selection, lead, primary action, focus and "on"; it is also the "ok" status colour.
- Traffic-light semantics: red / amber / green as 14% tints with the full colour as text and icon.
- Eight saturated ANSI course hues as `hsl()` triplets, applied as 16% fill / 45% border / 100% text.
- Flat, hairline-bordered surfaces; no gradients (except the loading shimmer), no cast shadows, no blur.
- Short eased-out transitions; motion only as a response to state, plus the blinking cursor.

## Colors

A near-black glass ramp with a faint cool cast, a green-grey text ramp, and a single phosphor-green signal; status and course colour are tints at 13–16% alpha with the full-strength colour on top.

### Primary
- **Phosphor** (`phosphor`, #4ee38a): the terminal's ink and the one accent. The `$` prompt glyph in the course field, the wordmark's blinking cursor and mark icon, the caret and native `accent-color`, links, the primary button fill, the rank of the selected result, the index of the leading criterion, "on" buttons and icon buttons, the lead column head, the "Show more" link in a course's about block, and the drop-target border while dragging.
- **Phosphor Bright** (`phosphor-bright`, #86f2b3): hover of the primary button, the leading readout's value and the leading criterion's name; the brighter step reads as emphasis, not as a second accent.
- **Phosphor Soft** (`phosphor-soft`, 13% alpha): the selected result row, the leading criterion row, the accent tag background, and the 3px halo around a focused field.
- **Phosphor Ring** (`phosphor-ring`, 55% alpha): the 2px `:focus-visible` outline everywhere, the focus outline on a grid block, and the inset ring on a just-moved result row.

### Secondary (traffic-light status)
- **Danger Red** (`danger`, #ff5f57): parse-failure banner, invalid field border and its "not a course code" hint, the "excluded" icon button when on, danger tags, the swatch of an unknown course; always paired with `danger-soft` for backgrounds.
- **Warn Amber** (`warn`, #ffbd2e): the warning banner and warn tags, with `warn-soft` behind.
- **OK Green** (`ok`, #4ee38a): the ok tag with `ok-soft` behind. Identical to the accent by design: in this world "good" and "active" are the same ink.

### Tertiary (course identity)
Eight saturated ANSI hues indexed by the course's position in the request: **course-cyan** (191°), **course-magenta** (326°), **course-yellow** (65°), **course-orange** (31°), **course-purple** (265°), **course-red** (0°), **course-blue** (216°), **course-green** (135°). Each is used three ways from one `hsl()` triplet: full strength for block text, the swatch and the register code; 16% alpha for the block fill; 45% alpha for the block border. Saturation sits at 89–100% and lightness at 65–78% so every hue prints bright on the near-black grid, like a terminal's bold colour set.

### Neutral
- **Glass Floor** (`glass-floor`, #050607): page background, the centre column, text-field and select wells, the pick-group card interior, and the text colour on anything filled with phosphor.
- **Glass Panel** (`glass-panel`, #0a0c0e): top bar, left and right panels, the week grid, rank head, register strip, empty-state diagnostics, the favicon tile.
- **Glass Raised** (`glass-raised`, #101317): default button fill, criterion rows, open course rows, register chips, row hover, skeleton base.
- **Glass Hover** (`glass-hover`, #171b21): hover of buttons and offerings, the switch track, tag backgrounds, the wordmark mark, rank and priority badges, skeleton highlight.
- **Hairline** (`hairline`, #171c22): every structural 1px border: panel edges, section dividers, grid rules, register chip border.
- **Hairline Strong** (`hairline-strong`, #232b35): borders on controls (button, field, select, number input, switch, group card, diagnostic box) and the scrollbar thumb.
- **Hairline Hover** (`hairline-hover`, #31404f): hovered button and select border and the hovered scrollbar thumb.
- **Text Primary** (`text-primary`, #d9e4d4): codes, values, headings, inline `code` in the about block; a pale green-grey rather than white.
- **Text Secondary** (`text-secondary`, #98a797): section titles, course titles, result rows at rest, toggle and row-field labels, day heads, about-block prose.
- **Text Tertiary** (`text-tertiary`, #778a7e): counts, help copy, axis hours, column heads, placeholders, disabled text, excluded offerings, "none" values, about-block keys, the select's chevron.

### Named Rules
**The One Ink Rule.** Phosphor green is the terminal's ink and marks exactly these things: the prompt and cursor, what is selected, what leads, the primary action, focus, and "on". It is never used for decoration, headings, or icons at rest.

**The Tint-Plus-Ink Rule.** Status and course colours never fill a surface at full strength. The fill is the colour at 13–16% alpha; the text is the colour at 100%. The only solid colour fills in the world are the primary button, the lead priority badge, the checked switch track and the cursor.

**The Hairline Rule.** Regions are separated by 1px `hairline` borders, never by shadow, gradient, or a change of more than one surface step.

## Typography

**Display Font:** JetBrains Mono (with `ui-monospace, SFMono-Regular, Menlo, monospace`)
**Body Font:** JetBrains Mono (same stack); set at 12.5px / 1.45 on `body` with `'tnum' 1, 'zero' 1` on by default.
**Label/Mono Font:** the same face; there is no second family. `--sans` aliases `--mono` and the `.sans` utility resolves to mono.

The single face loads from Google Fonts (`index.html`): JetBrains Mono 400/500/600, `display=swap`, with preconnects to `fonts.googleapis.com` and `fonts.gstatic.com`.

**Character:** Everything is terminal output. Codes, times, ranks and values sit in tabular columns with slashed zeros so `0`/`O` never collide; sentences (help copy, course descriptions, banners, the empty state) are the same face at a smaller size with looser leading, in secondary or tertiary text, so prose reads as a quieter line of the same transcript rather than a different voice.

### Hierarchy
- **Display** (600, 15px, -0.01em): the rank readout `#3 of 144` in the rank head; the only size above 14px in the world.
- **Headline** (600, 14px): the empty-state heading.
- **Title** (600, 11px, +0.04em, uppercase): section headings (COURSES, RANKING, WALKING, FILTERS, SCHEDULES), day heads, offering group labels (10.5px, tertiary). Secondary text colour.
- **Body** (400, 12.5px / 1.45): default; course codes at 600, offering labels and criterion names at 500. Readout values are 13px / 500; result values 11px; the wordmark is 600 / -0.01em.
- **Body prose** (400, 11–11.5px / 1.5–1.55): `.help` paragraphs (11px / 1.5, tertiary), the `.about` block (11.5px / 1.55, secondary), banners (11.5px / 1.4), the empty-state paragraph (12.5px / 1.5, secondary), criterion direction lines (10.5px / 1.25, tertiary).
- **Label** (400, 10px, +0.06em, uppercase, tertiary): readout keys, results column heads, about-block `dt` keys, the REGISTER label (10.5px). Tags are 10.5px / 500 / +0.02em; sub-values 10px; rank and priority badges 9.5px / 600; mini-semester corner marks 9px.

### Named Rules
**The One Face Rule.** Every string in the interface is JetBrains Mono. Prose is distinguished from data by size, leading and text tone, never by a second family. Do not reintroduce a sans-serif.

**The Twelve-and-a-Half Rule.** Body is 12.5px. Everything else is within 9–15px; nothing is larger than the rank display at 15px.

## Layout

A fixed three-column workspace filling the viewport. The app is a CSS grid of `44px 1fr` rows and `320px minmax(0,1fr) 380px` columns: top bar across, inputs panel left, grid centre, results panel right. Panels scroll internally; the page itself does not. The left panel stacks sections (Courses, Pick from, Ranking, Walking, Filters) separated by hairlines, each padded `14px 14px 16px` with a 10px gap below the section head. A section's controls sit in 28px `row-field` rows (label left, select right, 10px gap) and `toggle` rows, with `help` paragraphs 10px below. The centre is a column: 48px rank head, a scrolling `grid-wrap` padded `12px 16px 8px`, and a register strip (`10px 16px 12px`, min 52px). The right panel is a 48px head, a 10px column-head row, the scrolling list padded `4px 6px 8px`, and a footnote.

The week grid is `48px` axis plus one `minmax(0,1fr)` column per day, a 26px day-head row, minimum height 560px, hairline-bordered with a 10px radius. Blocks are `<button>`s absolutely positioned by minute with 3px side insets and 1px vertical gaps.

Spacing rhythm is a 2px base used at 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16; nothing larger than 24px (the empty-state padding) occurs. Control heights: 28px standard (`--control-h`), 24px small buttons, icon buttons, selects and number inputs, 26px offerings and register chips, 32px course rows, 40px criterion rows, 44px result rows, 48px rank and results heads. Badges are 14px squares.

Breakpoints:
- **≤1100px**: two columns (`300px minmax(0,1fr)`); the results panel drops below the grid as a 320px-tall row with a top hairline instead of a left one.
- **≤760px**: one column, page scrolls (`height: auto`); panels stack top → left → centre → right, results panel fixed at 420px tall; the rank head wraps with readouts on their own full-width row; the week grid tightens (38px axis, 520px min, blocks lose time and title and stack the code vertically at 10px); the top bar hides the wordmark text (and with it the cursor), the optional status strings and the status dots.
- `prefers-reduced-motion: reduce` collapses all transitions and animations to 0.01ms, including the cursor blink.

## Elevation & Depth

No cast shadows. Depth is tonal: four surface steps (`glass-floor` → `glass-panel` → `glass-raised` → `glass-hover`) plus three hairline tones, and any region is distinguished from its neighbour by a 1px hairline, a one-step surface change, or both. Interactive surfaces step up one tone on hover (button `glass-raised` → `glass-hover`, row transparent → `glass-raised`) and back down on active; grid blocks, which already carry their own hue, brighten by 15% (`filter: brightness(1.15)`) instead. The only box-shadows in the build are the focused field's `0 0 0 3px phosphor-soft` halo and the moved result row's fading 1px inset ring; both are state signals, not elevation. Wells (text fields, selects, number inputs, group cards) sit on `glass-floor`, one step *below* the panel, so inputs read as recessed rather than lifted. Scrollbars are 10px thin tracks on transparent with a `hairline-strong` thumb.

### Named Rules
**The No-Shadow Rule.** Nothing casts. Hover lifts a surface by one tonal step (or brightens a hued block); focus draws a ring; selection tints. If a future popover needs separation it must earn it with a hairline and a surface step first.

## Shapes

Small, consistent radii on a rectilinear plan. Three steps: 4px (`sm`) for icon buttons, selects, number inputs, tags, rank badges, the wordmark mark, course blocks, offering rows, the skeleton and the focus-ring corner; 6px (`md`) for buttons, fields, course rows, drag rows, criterion rows, result rows, register chips, banners, diagnostic boxes; 10px (`lg`) for the week grid frame and pick-group cards. The switch is a 16px-tall pill (8px radius) with a 10px round knob. Swatches are 8px (or 6px inline) squares with a 2px radius; status dots in the top bar are 3px circles; the cursor is a 7×13px solid rectangle with no radius. Borders are always 1px; controls use `hairline-strong`, structure uses `hairline`. Course blocks are the only elements with a coloured border at rest (the course hue at 45%); a drag target borrows a 1px phosphor border transiently. Icons are hand-drawn 16-unit line paths at 1.5 stroke, round caps and joins, rendered at 12–14px inside controls; the select's chevron is the same drawing inlined as a 10px data-URI background in tertiary ink.

## Components

Controls are flat, quiet and exact: one tonal step on hover, a green ring on keyboard focus, no transform, no shadow. Every state is a colour change on the same geometry.

### Buttons
- **Shape:** gently rounded (6px), 28px tall, `0 10px` padding, inline-flex with a 6px gap for a 13px icon; small variant 24px tall, `0 8px`, 11.5px text.
- **Default:** `glass-raised` fill, `hairline-strong` border, primary text. Hover → `glass-hover` fill and `hairline-hover` border; active → back to `glass-raised`. Disabled → tertiary text, default cursor. `.on` → text turns phosphor on the same fill.
- **Primary:** solid phosphor, transparent border, `glass-floor` text at 600. Hover → phosphor bright. Used for the single call to action in an empty state and, transiently, the Copy button after a successful copy.
- **Ghost:** transparent fill and border, secondary text. Hover → `glass-raised` fill, primary text. Used in heads ("Clear", "Group", "Bundled export").
- **Icon button:** 24px square, 4px radius, tertiary colour. Hover → `glass-hover` fill, primary colour. `.on` → phosphor; `.danger.on` → danger red. Disabled → 35% opacity. `.chevron` variant is a non-interactive disclosure glyph (`pointer-events: none`).
- **Transitions:** background, border-color, color at 120ms on the standard ease.

### Chips (tags)
- **Style:** 18px tall, 4px radius, `0 6px`, 10.5px / 500 / +0.02em; `glass-hover` fill with secondary text.
- **Variants:** `accent`, `danger`, `warn`, `ok` each use the 13–14% soft tint as fill and the full colour as text.
- **Rank badge** (`rank-badge`): 14px square, 4px radius, `glass-hover` fill, secondary text at 9.5px / 600, pulled 3px left; replaces the swatch on a ranked course inside a pick group. The readout's priority badge (`pri`) is the same geometry at a 3px radius, and solid phosphor on `glass-floor` text when it leads.
- **Register chip** (`reg-item`): 26px, 6px radius, `glass-raised` on a `hairline` border; code in the course hue at 600, separators tertiary, alternates secondary.

### Cards / Containers
- **Pick-group card:** 10px radius, `hairline-strong` border, `glass-floor` interior (recessed), 8px padding, 8px bottom margin. Its ranked rows are wrapped in a `drag-row` (6px radius, transparent 1px border) that carries the drag states: dragging → 40% opacity; drop target → phosphor border; both at 120ms.
- **Criterion row:** 40px min, 6px radius, `glass-raised`, grab cursor, 16px grip + 20px right-aligned index + name/direction stack + arrow buttons (20×16px) that appear on hover/focus-within. The first row is the lead: `phosphor-soft` fill, name in phosphor bright, index in phosphor at 600. Dragging → 40% opacity; drop target → phosphor border.
- **About block** (`about`): the expanded course's description, `6px 8px 8px`, 11.5px / 1.55 secondary prose; the description clamps to 4 lines with a phosphor "Show more" link (11px) beneath; a two-column `dl` (10px uppercase tertiary keys at +0.06em, 11px secondary values, `2px 10px` gaps) lists prereqs, coreqs, cross-lists, notes and links; inline `code` is 11px primary. While loading it shows a 30px skeleton; missing or unavailable detail is a tertiary sentence.
- **Week grid:** `glass-panel` frame, hairline rules per hour, 10px radius, overflow hidden.
- **Banner:** 6px radius, `8px 10px`, 11.5px / 1.4, soft tint fill with full-colour text and a 14px leading icon.
- **Empty-state diagnostic:** `glass-panel`, `hairline-strong` border, 6px radius, `10px 12px`, 11.5px secondary text.

### Inputs / Fields
- **Field:** 28px, 6px radius, `glass-floor` well on a `hairline-strong` border, `0 8px`, 8px gap. The course field opens with a `$` prompt glyph in phosphor at 600 (aria-hidden) and closes with a trailing hint (tertiary, 11px) or a 12px enter icon. Placeholder tertiary.
- **Focus:** `:focus-within` → border phosphor plus `0 0 0 3px phosphor-soft` halo, 120ms.
- **Invalid:** border danger red; hint text in danger.
- **Select:** native `<select>` with `appearance: none`, 24px tall, 4px radius, `0 22px 0 6px`, `glass-floor` well on a `hairline-strong` border, primary text, ellipsised; a 10px tertiary chevron is inlined as a background 6px from the right. Hover → `hairline-hover` border; focus → phosphor border. Used inside a `row-field`: a 28px flex row, secondary label left, select stretched right, 10px gap.
- **Help:** `help` paragraphs follow a control at 10px, 11px / 1.5, tertiary; the place for one sentence of operating guidance.
- **Number input:** 46×24px, 4px radius, right-aligned, same well; focus → phosphor border; spin button at 40% opacity.
- **Switch:** 28×16px pill, `glass-hover` track on `hairline-strong`, 10px secondary knob; `aria-checked="true"` → phosphor track and border, knob slides 12px and turns `glass-floor`. The surrounding toggle row is 28px, secondary text, primary on hover.

### Navigation
- **Top bar:** 44px, `glass-panel`, bottom hairline, `0 14px`, 16px gap. Wordmark is a 20px `glass-hover` rounded (4px) mark holding a 13px phosphor sliders icon plus `schedule-optimiser` at 600 / -0.01em, followed by a 7×13px phosphor cursor block that blinks (`steps(1)`, 1.1s, 50% off). Status runs in secondary text with 3px tertiary dots as separators. Actions sit right as small default/ghost buttons.
- **Rank head:** 48px, `glass-panel`, bottom hairline; rank display at 15px / 600, prev/next icon buttons, then readouts pushed right, each `0 14px` with a left hairline and 92px min width. A readout is a 10px uppercase key with a 14px priority badge above a 13px / 500 value; the lead readout's badge is solid phosphor on `glass-floor` text and its value is phosphor bright.
- **Results head:** 48px with the section title and count, then a 10px uppercase column-head row where the lead column is phosphor.

### Signature: Result row and Course block
- **Result row:** 44px, 6px radius, a `34px + 4×1fr` grid of right-aligned 11px values in the current criterion order with the lead value in primary text at 500, and a second line of course swatches + section codes at 11px tertiary. Rest: secondary text, transparent. Hover: `glass-raised`. Selected: `phosphor-soft` fill, primary text, rank in phosphor. Moved (after a re-rank): a 1px inset `phosphor-ring` box-shadow fading to transparent over 1400ms.
- **Course block:** a `<button>` absolutely positioned in its day column, 4px radius, `4px 6px` padding, course hue at 16% fill, 45% border, 100% text, left-aligned; code at 11.5px / 600 with the section label at 500 and 90% opacity, time at 10.5px / 85%, title at 10.5px / 85%, ellipsised. Hover → `brightness(1.15)`; focus → 2px `phosphor-ring` outline at 0 offset; click opens the SOC detail page. Short blocks drop time and title; mini-semester blocks carry an `m3`/`m4` corner mark at 9px. Transform and opacity transition at 200ms.
- **Offering row:** 26px, 4px radius, secondary text; label primary at 500; TBA times italic tertiary; **excluded** → label and time tertiary with `line-through`; pin / exclude icon buttons at right.
- **Copied state:** the Copy button swaps to the primary variant with a check icon and the word "Copied" for 1600ms, then reverts.
- **Skeleton:** `glass-raised`→`glass-hover` linear shimmer, 1.4s, 4px radius.

## Do's and Don'ts

### Do:
- **Do** keep controls at 28px (24px small, selects and number inputs) with a 6px (4px small) radius and a 1px `hairline-strong` border; hover is one tonal step up, not a transform.
- **Do** set every string in JetBrains Mono with tabular numerals; mark prose by dropping to 11–11.5px with 1.5–1.55 leading in secondary or tertiary text.
- **Do** reserve phosphor for prompt, cursor, selection, lead, primary action, focus and "on"; the lead criterion and selected result are the only green-filled rows on screen.
- **Do** build status and course colour as a 13–16% tint fill with the full-strength colour as text and (for course blocks) a 45% border.
- **Do** separate regions with 1px `hairline` borders and surface steps; wells sit one step below their panel on `glass-floor`.
- **Do** use the standard ease `cubic-bezier(0.16, 1, 0.3, 1)` at 120ms for colour state and 200ms for position; honour `prefers-reduced-motion`.
- **Do** draw icons as 16-unit line paths at 1.5 stroke with round caps, rendered at 12–14px; inline the same drawing as a data URI where a background image is the only option (the select chevron).
- **Do** make anything clickable a real `<button>` with an `aria-label` and the shared focus ring, as the grid blocks are.

### Don't:
- **Don't** add box-shadows, gradients, blur or glows; the only halo in the world is the 3px focus halo on a field and the only gradient is the loading shimmer.
- **Don't** introduce a light theme or theme switch; the world is `color-scheme: dark` only.
- **Don't** fill a surface with a status or course colour at full strength; solid fills belong to the primary button, the lead badge, the checked switch and the cursor.
- **Don't** reintroduce Inter or any sans-serif; one face is the terminal's whole voice.
- **Don't** use a second accent or a hue-coded heading; headings are 11px uppercase mono in secondary text.
- **Don't** set text above 15px or below 9px; the type world lives between 9px corner marks and the 15px rank display.
- **Don't** add authored motion beyond the cursor blink and the moved-row ring; everything else animates only as a response to state.
- **Don't** replace drawn line icons with glyph fonts, emoji or an icon package.
