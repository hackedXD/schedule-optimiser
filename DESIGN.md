---
name: Schedule Optimiser
description: A dark terminal-world course scheduler; near-black glass, one phosphor green, ANSI course hues, JetBrains Mono for everything.
colors:
  glass-floor: "#050607"
  glass-panel: "#0a0c0e"
  glass-raised: "#101317"
  glass-hover: "#171b21"
  hairline: "#161b1d"
  hairline-strong: "#22292c"
  hairline-hover: "#2e3a3a"
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
  course-magenta: "hsl(305 75% 62%)"
  course-yellow: "hsl(48 90% 58%)"
  course-cyan: "hsl(184 75% 50%)"
  course-orange: "hsl(24 95% 58%)"
  course-blue: "hsl(222 78% 60%)"
  course-red: "hsl(2 88% 60%)"
  course-purple: "hsl(268 65% 64%)"
  course-lime: "hsl(100 70% 55%)"
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
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "normal"
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
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
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
  segmented:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0 7px"
    height: "22px"
  segmented-hover:
    backgroundColor: "{colors.glass-hover}"
    textColor: "{colors.text-primary}"
  segmented-on:
    backgroundColor: "{colors.phosphor-soft}"
    textColor: "{colors.phosphor-bright}"
  readout:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    padding: "0 10px"
  register-item-open:
    backgroundColor: "{colors.glass-raised}"
    rounded: "{rounded.md}"
    padding: "3px 8px"
    height: "26px"
  option-chip:
    backgroundColor: "{colors.glass-hover}"
    textColor: "{colors.text-primary}"
    rounded: "3px"
    padding: "0 4px"
  option-chip-available:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.text-primary}"
  option-chip-waitlist:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.text-primary}"
  option-chip-closed:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.text-secondary}"
  ghost-row:
    backgroundColor: "transparent"
    textColor: "{colors.text-tertiary}"
    rounded: "{rounded.md}"
    padding: "0 6px"
    height: "28px"
  ghost-row-hover:
    backgroundColor: "{colors.glass-raised}"
    textColor: "{colors.text-primary}"
  paste:
    backgroundColor: "{colors.glass-floor}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  dialog:
    backgroundColor: "{colors.glass-panel}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "0"
    width: "min(520px, calc(100vw - 32px))"
---

# Design System: Schedule Optimiser

## Overview

**Creative North Star: "The Phosphor Terminal"**

A single-user tool a CMU student opens at night, at registration time, to find the exact lecture and section codes to enter. The world is the category standard for a scheduler (inputs left, Monday-to-Friday grid centre, ranked list right) rendered as a terminal: near-black glass in four steps, 1px hairlines, one phosphor green, and a single monospace voice. The green is the terminal's ink: it is the caret, the `$` prompt in the course field, the blinking cursor after the wordmark, the focus ring, the primary action, the lead criterion, the selected result and the "on" state of any control. Semantic status borrows the macOS traffic lights (red, amber, and the same green as "ok"). Course identity is carried by eight ANSI hues (magenta, yellow, cyan, orange, blue, red, purple, lime), the deeper "normal" colour set of a terminal theme rather than its pastel brights, applied as 16% fills with the hue at full strength for text.

Labels speak in the shell's own register. Nothing in the interface is uppercase or letter-spaced: section heads read as shell comments (`# courses`, `# schedules`), sub-heads as second-level comments (`## lectures`, `## fces for this semester's instructors`), the register strip opens with a `$ register` prompt in phosphor, and every column head, readout key, day head and `dt` key is a lowercase word at normal tracking in secondary or tertiary text. Hierarchy comes from the prefix glyph, weight and tone, not from case.

There is one typeface. JetBrains Mono carries every string in the interface, codes and sentences alike; `--sans` exists only as an alias of `--mono` so legacy class hooks resolve to the same face. Prose is distinguished from data by size and leading (11–11.5px / 1.5–1.55 in secondary or tertiary text) rather than by a second family. Density is high and even: body 12.5px, controls 28px tall, list rows 26–44px, section padding 14px. Depth is tonal, never cast on the page itself: surfaces step up by lightness and hairlines separate regions; the box-shadows in the page are the 3px soft halo on a focused field or paste box and the fading inset ring on a just-moved result row. The one object that leaves the page, the course dialog, is the exception: it floats on a dimmed, 2px-blurred backdrop with a deep cast shadow, because it is the only surface that is not part of the terminal plane.

Motion is short and eased out hard (120ms / 200ms on `cubic-bezier(0.16, 1, 0.3, 1)`) and used for state only, with three exceptions: the wordmark's cursor blinks on a 1.1s stepped cycle, the one authored motion in the world; the results list re-sorts in place when the ranking order changes, where moved rows carry a 1px inset green ring that fades over 1.4s; and the course dialog enters with a 200ms fade-and-rise.

**Key Characteristics:**
- Dark only (`color-scheme: dark`, no light theme); four near-black glass surfaces plus three neutral grey-green hairline tones and a green-grey text ramp.
- One typeface: JetBrains Mono 400/500/600 for everything, tabular numerals and slashed zero on by default; no sans-serif anywhere.
- Shell-comment labels: every heading and key is lowercase at normal tracking; section heads carry `# `, sub-heads `## `, the register label a phosphor `$ `. No uppercase, no letter-spacing.
- One accent (phosphor green) for prompt, cursor, caret, selection, lead, primary action, focus, "on", and the `{` `}` brackets of an inline group; it is also the "ok" status colour.
- Traffic-light semantics: red / amber / green as 14% tints with the full colour as text and icon, and as seat-state tints behind option chips.
- Eight deeper ANSI course hues as `hsl()` triplets (saturation 65–95%, lightness 50–64%), applied as 16% fill / 45% border / 100% text; open options are the same hue as a dashed, hatched ghost.
- Flat, hairline-bordered surfaces; no gradients (except the loading shimmer and the ghost hatch), no cast shadows and no blur on the page; the modal dialog is the single floating exception.
- Short eased-out transitions; motion only as a response to state, plus the blinking cursor and the dialog's entry.

## Colors

A near-black glass ramp, neutral grey-green hairlines, a green-grey text ramp, and a single phosphor-green signal; status and course colour are tints at 13–16% alpha with the full-strength colour on top.

### Primary
- **Phosphor** (`phosphor`, #4ee38a): the terminal's ink and the one accent. The `$` prompt glyph in the course field, the wordmark's blinking cursor and mark icon, the caret and native `accent-color`, links, the primary button fill, the rank of the selected result, the index of the leading criterion, "on" buttons and icon buttons, the lead column head, the "Show more" link in a course's about block, the `$ ` prefix of the register label, the `{` `}` brackets that frame an inline pick group, the priority badge of the "open" readout, and the drop-target border while dragging.
- **Phosphor Bright** (`phosphor-bright`, #86f2b3): hover of the primary button, the leading readout's value, the leading criterion's name, the "on" segment of a segmented control, and the label of an offering the student is taking; the brighter step reads as emphasis, not as a second accent.
- **Phosphor Soft** (`phosphor-soft`, 13% alpha): the selected result row, the leading criterion row, the accent tag background, the "on" segment fill, the "taking" offering row, the applied FCE row, and the 3px halo around a focused field or paste box.
- **Phosphor Ring** (`phosphor-ring`, 55% alpha): the 2px `:focus-visible` outline everywhere, the focus outline on a grid block, and the inset ring on a just-moved result row.

### Secondary (traffic-light status)
- **Danger Red** (`danger`, #ff5f57): parse-failure banner, invalid field border and its "not a course code" hint, the "excluded" icon button when on, danger tags, the swatch of an unknown course; always paired with `danger-soft` for backgrounds. `danger-soft` alone tints a **closed** option chip in the register, with the text dropped to secondary.
- **Warn Amber** (`warn`, #ffbd2e): the warning banner and warn tags, with `warn-soft` behind; `warn-soft` alone tints a **waitlist** option chip.
- **OK Green** (`ok`, #4ee38a): the ok tag with `ok-soft` behind; `ok-soft` alone tints an **available** option chip. Identical to the accent by design: in this world "good" and "active" are the same ink.

### Tertiary (course identity)
Eight ANSI hues indexed by the course's position in the request, in this order: **course-magenta** (305°), **course-yellow** (48°), **course-cyan** (184°), **course-orange** (24°), **course-blue** (222°), **course-red** (2°), **course-purple** (268°), **course-lime** (100°). Each is used four ways from one `hsl()` triplet: full strength for block text, the swatch, the register code and the ghost's label; 16% alpha for the block fill; 45% alpha for the block border and the ghost's dashed border. Saturation sits at 65–95% and lightness at 50–64%, the terminal's normal (not bold) colour set, so hues read as ink on the near-black grid rather than as pastel highlights and no two neighbours in the index share a temperature.

### Neutral
- **Glass Floor** (`glass-floor`, #050607): page background, the centre column, text-field and select wells, the pick-group card interior, and the text colour on anything filled with phosphor.
- **Glass Panel** (`glass-panel`, #0a0c0e): top bar, left and right panels, the week grid, rank head, register strip, empty-state diagnostics, the course dialog, the favicon tile.
- **Glass Raised** (`glass-raised`, #101317): default button fill, criterion rows, open course rows, register chips, row hover, ghost-row hover, skeleton base.
- **Glass Hover** (`glass-hover`, #171b21): hover of buttons, offerings, FCE rows and segments; the switch track, tag backgrounds, the default option chip, the wordmark mark, rank and priority badges, skeleton highlight.
- **Hairline** (`hairline`, #161b1d): every structural 1px border: panel edges, section dividers, grid rules, readout dividers, register chip border, dialog head and foot rules, SIO preview rows, the compact FCE box's top rule.
- **Hairline Strong** (`hairline-strong`, #22292c): borders on controls (button, field, select, number input, switch, segmented control and its segment dividers, paste box, group card, diagnostic box), the dialog frame, the inline group's 1px spine, and the scrollbar thumb.
- **Hairline Hover** (`hairline-hover`, #2e3a3a): hovered button and select border and the hovered scrollbar thumb.

The three hairlines are grey-green (their blue cast was removed) so they sit in the same family as the text ramp and never read as a second, cooler hue against the phosphor.
- **Text Primary** (`text-primary`, #d9e4d4): codes, values, headings, inline `code` in the about block; a pale green-grey rather than white.
- **Text Secondary** (`text-secondary`, #98a797): section titles, course titles, result rows at rest, toggle and row-field labels, day heads, segments at rest, about-block and dialog prose, the "any of" word in an open register chip.
- **Text Tertiary** (`text-tertiary`, #778a7e): counts, help copy, axis hours, column heads, readout keys, the `# ` and `## ` comment prefixes, placeholders, disabled text, excluded offerings, "none" values, about-block and dialog `dt` keys, the register label, the ghost-row prompt, the select's chevron.

### Named Rules
**The One Ink Rule.** Phosphor green is the terminal's ink and marks exactly these things: the prompt and cursor, what is selected, what leads, the primary action, focus, "on", and the brackets that frame a group. It is never used for decoration, headings, or icons at rest; the `# ` comment prefix on a heading is tertiary, not green.

**The Tint-Plus-Ink Rule.** Status and course colours never fill a surface at full strength. The fill is the colour at 13–16% alpha; the text is the colour at 100%. The only solid colour fills in the world are the primary button, the lead priority badge, the checked switch track and the cursor.

**The Hairline Rule.** Regions on the page are separated by 1px `hairline` borders, never by shadow, gradient, or a change of more than one surface step. Only a modal that leaves the page (the course dialog) may cast.

**The Seat-State Rule.** Seat availability is shown as a tint behind the option chip, never as coloured text: `ok-soft` for available, `warn-soft` for waitlist, `danger-soft` for closed (with the text dropped to secondary). The chip's text stays primary so the code remains legible on every tint.

## Typography

**Display Font:** JetBrains Mono (with `ui-monospace, SFMono-Regular, Menlo, monospace`)
**Body Font:** JetBrains Mono (same stack); set at 12.5px / 1.45 on `body` with `'tnum' 1, 'zero' 1` on by default.
**Label/Mono Font:** the same face; there is no second family. `--sans` aliases `--mono` and the `.sans` utility resolves to mono.

The single face loads from Google Fonts (`index.html`): JetBrains Mono 400/500/600, `display=swap`, with preconnects to `fonts.googleapis.com` and `fonts.gstatic.com`.

**Character:** Everything is terminal output. Codes, times, ranks and values sit in tabular columns with slashed zeros so `0`/`O` never collide; sentences (help copy, course descriptions, banners, the empty state) are the same face at a smaller size with looser leading, in secondary or tertiary text, so prose reads as a quieter line of the same transcript rather than a different voice.

### Hierarchy
- **Display** (600, 15px, -0.01em): the rank readout `#3 of 144` in the rank head; the only size above 14px in the world.
- **Headline** (600, 14px): the empty-state heading.
- **Title** (600, 11.5px, lowercase, normal tracking): section headings (`# courses`, `# ranking`, `# walking`, `# filters`, `# availability`, `# schedules`) in secondary text with a `# ` prefix in tertiary at 400; day heads (11px / 600, secondary, lowercase `mon`…`fri`); sub-heads (`## lectures`, `## sections`, `## fce history`) at 10.5px / 600 in tertiary with a `## ` prefix at 400. The dialog title is 13px / 500 with the code at 600.
- **Body** (400, 12.5px / 1.45): default; course codes at 600, offering labels and criterion names at 500. Readout values are 12.5px / 500; result values 11px; the wordmark is 600 / -0.01em; the group brackets `{` `}` are 13px / 600 in phosphor.
- **Body prose** (400, 11–11.5px / 1.5–1.55): `.help` paragraphs (11px / 1.5, tertiary), the `.about` block (11.5px / 1.55, secondary), banners (11.5px / 1.4), the paste box (11.5px / 1.45), the empty-state paragraph (12.5px / 1.5, secondary), criterion direction lines (10.5px / 1.25, tertiary).
- **Label** (400, 10.5px, lowercase, normal tracking, tertiary): readout keys (`open 15-122`, `start`), results column heads, about-block and dialog `dt` keys (`prereq`, `cross-listed`), segment captions (`Easy` / `Hard` / `Very hard`, secondary), the register label (11px, `$ register` with a phosphor prompt), ghost labels on the grid (10px, course hue), SIO preview rows (11px). Tags are 10.5px / 500 / +0.02em; option chips 11px with 9.5px `small` seat notes; sub-values 10px; rank and priority badges 9.5px / 600; mini-semester corner marks 9px.

### Named Rules
**The One Face Rule.** Every string in the interface is JetBrains Mono. Prose is distinguished from data by size, leading and text tone, never by a second family. Do not reintroduce a sans-serif.

**The Shell Comment Rule.** No label, heading or key is uppercase or letter-spaced. A heading is a lowercase word in the comment register: section heads prefixed `# `, sub-heads `## `, both prefixes in tertiary at 400 so the word carries the weight; the register label is a `$ ` prompt in phosphor. Hierarchy comes from the prefix, the weight (600 vs 400) and the tone (secondary vs tertiary), never from case or tracking. New surfaces take the same prefix for the same level, and nothing else gets a prefix.

**The Twelve-and-a-Half Rule.** Body is 12.5px. Everything else is within 9–15px; nothing is larger than the rank display at 15px.

## Layout

A fixed three-column workspace filling the viewport. The app is a CSS grid of `44px 1fr` rows and `320px minmax(0,1fr) 380px` columns: top bar across, inputs panel left, grid centre, results panel right. Panels scroll internally; the page itself does not. The left panel stacks sections (Courses, Pick from, Ranking, Walking, Filters) separated by hairlines, each padded `14px 14px 16px` with a 10px gap below the section head. A section's controls sit in 28px `row-field` rows (label left, select right, 10px gap) and `toggle` rows, with `help` paragraphs 10px below. The centre is a column: 48px rank head (`0 16px`, 14px gap) whose readouts are pushed right in a `min-width: 0; overflow: hidden` strip so they truncate rather than wrap, each readout `0 10px` with a left hairline and `white-space: nowrap`; a scrolling `grid-wrap` padded `12px 16px 8px`; and a register strip (`10px 16px 12px`, min 52px). The right panel is a 48px head, a 10.5px column-head row, the scrolling list padded `4px 6px 8px`, and a footnote.

The week grid is `48px` axis plus one `minmax(0,1fr)` column per day, a 26px day-head row, minimum height 560px, hairline-bordered with a 10px radius. Blocks are `<button>`s absolutely positioned by minute with 3px side insets and 1px vertical gaps; ghost blocks for open options use the same insets and sit beneath the solid blocks in the same column.

Inside the courses section an inline group is a 32px `group-row` indented 24px (for its `{` bracket at 9px from the left), followed by `group-options` indented 12px with an 8px left pad and a 1px `hairline-strong` spine, closed by a `}` bracket 4px above the bottom. Modals are `<dialog>` elements sized `min(520px, 100vw − 32px)` (640px for the SIO import), capped at `100vh − 48px`, with a `12px 10px 12px 16px` head, a scrolling body and a `10px 12px 10px 16px` foot.

Spacing rhythm is a 2px base used at 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16; nothing larger than 24px (the empty-state padding) occurs. Control heights: 28px standard (`--control-h`), 24px small buttons, icon buttons, selects and number inputs, 22px segments, 26px offerings and register chips (an open chip grows from 26px as its option chips wrap), 28px ghost rows, 30px FCE rows, 32px course and group rows, 40px criterion rows, 44px result rows, 48px rank and results heads. Badges are 14px squares.

Breakpoints:
- **≤1100px**: two columns (`300px minmax(0,1fr)`); the results panel drops below the grid as a 320px-tall row with a top hairline instead of a left one.
- **≤760px**: one column, page scrolls (`height: auto`); panels stack top → left → centre → right, results panel fixed at 420px tall; the rank head wraps with readouts on their own full-width row; the week grid tightens (38px axis, 520px min, blocks lose time and title and stack the code vertically at 10px); the top bar hides the wordmark text (and with it the cursor), the optional status strings and the status dots.
- `prefers-reduced-motion: reduce` collapses all transitions and animations to 0.01ms, including the cursor blink.

## Elevation & Depth

No cast shadows on the page. Depth is tonal: four surface steps (`glass-floor` → `glass-panel` → `glass-raised` → `glass-hover`) plus three hairline tones, and any region is distinguished from its neighbour by a 1px hairline, a one-step surface change, or both. Interactive surfaces step up one tone on hover (button `glass-raised` → `glass-hover`, row transparent → `glass-raised`) and back down on active; grid blocks, which already carry their own hue, brighten by 15% (`filter: brightness(1.15)`) instead. The box-shadows on the page are the focused field's and paste box's `0 0 0 3px phosphor-soft` halo and the moved result row's fading 1px inset ring; both are state signals, not elevation. Wells (text fields, selects, number inputs, the paste box, group cards) sit on `glass-floor`, one step *below* the panel, so inputs read as recessed rather than lifted. Ghost blocks are the opposite of lifted: a dashed 45% border and a 3% white diagonal hatch on no fill, so an open option reads as an outline drawn on the grid beneath the solid pick. Scrollbars are 10px thin tracks on transparent with a `hairline-strong` thumb.

The single floating layer is the course dialog (`<dialog>`, also used for the SIO import): `glass-panel` on a `hairline-strong` frame with a 10px radius, a two-part cast shadow (`0 24px 48px -16px rgb(0 0 0 / 0.7), 0 4px 12px rgb(0 0 0 / 0.5)`) and a `::backdrop` of `rgb(5 6 7 / 0.6)` with `backdrop-filter: blur(2px)`; it enters over 200ms from 6px below at 98.5% scale. It is the only element with a cast shadow or blur, and it earns both by being the one surface that is not on the terminal plane.

### Named Rules
**The No-Shadow Rule.** Nothing on the page casts. Hover lifts a surface by one tonal step (or brightens a hued block); focus draws a ring; selection tints. Only a modal that leaves the page may cast, and it must still carry a hairline frame and a surface step first; a popover or menu does not qualify.

## Shapes

Small, consistent radii on a rectilinear plan. Three steps: 4px (`sm`) for icon buttons, selects, number inputs, tags, rank badges, the wordmark mark, course blocks and ghosts, offering and FCE rows, the skeleton and the focus-ring corner; 6px (`md`) for buttons, fields, the paste box, the segmented control, course rows, group rows, ghost rows, drag rows, criterion rows, result rows, register chips, banners, diagnostic boxes, the SIO preview box; 10px (`lg`) for the week grid frame, pick-group cards and the dialog. Option chips and priority badges are the one 3px exception. Ghost blocks are the only dashed border in the world (1px, course hue at 45%), and the inline group is the only element framed by glyphs: a phosphor `{` on its first row and `}` after its last, with a 1px `hairline-strong` spine between. The switch is a 16px-tall pill (8px radius) with a 10px round knob. Swatches are 8px (or 6px inline) squares with a 2px radius; status dots in the top bar are 3px circles; the cursor is a 7×13px solid rectangle with no radius. Borders are always 1px; controls use `hairline-strong`, structure uses `hairline`. Course blocks are the only elements with a coloured border at rest (the course hue at 45%); a drag target borrows a 1px phosphor border transiently. Icons are hand-drawn 16-unit line paths at 1.5 stroke, round caps and joins, rendered at 12–14px inside controls; the select's chevron is the same drawing inlined as a 10px data-URI background in tertiary ink.

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
- **Open register chip** (`reg-item.open`): the same chip for a course kept open in availability mode, allowed to wrap (`3px 8px`, 5px gap, min 26px): the code, a tertiary `·`, the word "any of" in secondary, then up to six **option chips** (`opt`: 11px primary text, `0 4px`, 3px radius, `glass-hover` fill) with the seat state as the tint (`available` → `ok-soft`, `waitlist` → `warn-soft`, `closed` → `danger-soft` with secondary text) and a 9.5px tertiary `small` seat note; inside a group each option leads with its own course code in that course's hue at 600. Overflow is a secondary `+N`.
- **Segmented control** (`segmented`): an inline radio group on one `hairline-strong` frame with a 6px radius, segments 22px tall at `0 7px` and 10.5px, secondary text, divided by `hairline-strong` rules. Hover → `glass-hover` and primary text; `.on` → `phosphor-soft` fill and phosphor-bright text. Used for the per-course seat difficulty (`Easy` / `Hard` / `Very hard`) in a `row-field.seat` that never wraps.

### Cards / Containers
- **Pick-group card:** 10px radius, `hairline-strong` border, `glass-floor` interior (recessed), 8px padding, 8px bottom margin. Its ranked rows are wrapped in a `drag-row` (6px radius, transparent 1px border) that carries the drag states: dragging → 40% opacity; drop target → phosphor border; both at 120ms.
- **Criterion row:** 40px min, 6px radius, `glass-raised`, grab cursor, 16px grip + 20px right-aligned index + name/direction stack + arrow buttons (20×16px) that appear on hover/focus-within. The first row is the lead: `phosphor-soft` fill, name in phosphor bright, index in phosphor at 600. Dragging → 40% opacity; drop target → phosphor border.
- **Inline group** (`group-inline`): a pick group lives in the course list, not in a card. Its 32px `group-row` is indented 24px behind a phosphor `{` (13px / 600, absolute at 9px), holds a "pick N" number input (34px wide), a ghost `Flex` switch-button and ops at the right; its options follow in `group-options` behind a 1px `hairline-strong` spine, each wrapped in a `drag-row` when ranked; a 28px tertiary **ghost row** (`+ add option`, 11.5px, 6px radius) closes the list and lifts to `glass-raised` / primary on hover; a phosphor `}` sits 4px above the bottom. An `inline` field variant (transparent until focused, then `glass-floor` on a phosphor border with no halo) is the add-option input.
- **About block** (`about`): the expanded course's description, `6px 8px 8px`, 11.5px / 1.55 secondary prose; the description clamps to 4 lines with a phosphor "Show more" link (11px) beneath; a two-column `dl` (10.5px lowercase tertiary keys, 11px secondary values, `2px 10px` gaps) lists `prereq`, `coreq`, `cross-listed`, `notes`, `permission` and `links`; inline `code` is 11px primary. While loading it shows a 30px skeleton; missing or unavailable detail is a tertiary sentence.
- **FCE history** (`fce-history`): a `## fce history` sub-head (10.5px / 600 tertiary) with a 400-weight source note, then 30px `fce-row`s (name 11.5px primary over a 10px tertiary date, two right-aligned 11.5px scores with the second tertiary, and a small Apply button that turns primary once applied). Hover → `glass-hover`; applied → `phosphor-soft`. The `compact` variant used inside a course's detail caps the rows at 150px with internal scroll behind a top hairline, `padding-top: 10px`.
- **Course dialog** (`course-dialog`): the floating course sheet (see Elevation & Depth): swatch + 13px / 500 title with the code at 600 and a close icon button in a hairline-ruled head; an 11.5px secondary meta line with 3px tertiary dots; a two-column `dialog-meta` list (10.5px tertiary keys, 11.5px secondary values, `3px 12px` gaps); the about block, offerings (a `taking` row is `phosphor-soft` with its label phosphor bright) and FCE history inset to 16px; and a hairline-ruled foot with a tertiary "Esc to close" and a small `Open on SOC` button. Clicking the backdrop closes it.
- **SIO import** (`sio-dialog`): the same dialog at 640px with a `paste` textarea (full width, `8px 10px`, 11.5px / 1.45, `glass-floor` well on `hairline-strong`, 6px radius; focus → phosphor border and the 3px halo) and a `sio-preview` beneath: a row-field select for the target course, help copy, and a `sio-rows` box (hairline frame, 6px radius, 220px max with scroll) of `52px 150px 1fr 90px` grid rows at 11px, `4px 8px`, hairline-separated, with unmatched values in tertiary. Cancel and a primary Import sit in the foot.
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
- **Rank head:** 48px, `glass-panel`, bottom hairline, `0 16px`; rank display at 15px / 600 with a 12px tertiary "of N", prev/next icon buttons, then readouts pushed right in a clipped `min-width: 0` strip, each `0 10px` with a left hairline, no minimum width and `nowrap`. A readout is a 10.5px lowercase tertiary key (`start`, `walking`) with a 14px priority badge above a 12.5px / 500 value; the lead readout's badge is solid phosphor on `glass-floor` text and its value is phosphor bright. In availability mode an `open` readout leads with a `∗` badge in solid phosphor and a `N/M` value.
- **Results head:** 48px with the `# schedules` title and count, then a 10.5px lowercase column-head row where the lead column (or the `open` column in availability mode) is phosphor.
- **Register strip:** opens with `$ register` (11px, tertiary word, phosphor `$ `), then the chips, then the Copy button pushed right.

### Signature: Result row and Course block
- **Result row:** 44px, 6px radius, a `34px + 4×1fr` grid of right-aligned 11px values in the current criterion order with the lead value in primary text at 500, and a second line of course swatches + section codes at 11px tertiary. Rest: secondary text, transparent. Hover: `glass-raised`. Selected: `phosphor-soft` fill, primary text, rank in phosphor. Moved (after a re-rank): a 1px inset `phosphor-ring` box-shadow fading to transparent over 1400ms.
- **Course block:** a `<button>` absolutely positioned in its day column, 4px radius, `4px 6px` padding, course hue at 16% fill, 45% border, 100% text, left-aligned; code at 11.5px / 600 with the section label at 500 and 90% opacity, time at 10.5px / 85%, title at 10.5px / 85%, ellipsised. Hover → `brightness(1.15)`; focus → 2px `phosphor-ring` outline at 0 offset; click opens the SOC detail page. Short blocks drop time and title; mini-semester blocks carry an `m3`/`m4` corner mark at 9px. Transform and opacity transition at 200ms.
- **Ghost block** (`week .ghost`): an open option of a hard course in availability mode, drawn beneath the solid pick in the same column: no fill, a 1px dashed border in the course hue at 45%, a `repeating-linear-gradient(135deg)` hatch of 3% white every 6px, 4px radius, `2px 5px` padding, the section labels at 10px in the course hue (up to three, then `+N`), ellipsised on one line. Opacity scales from 45% to 100% with the option's weight. It is not a button (`cursor: help`, a `title` with the full option list); a slot already in the preferred pick is drawn solid and gets no ghost.
- **Offering row:** 26px, 4px radius, secondary text; label primary at 500; TBA times italic tertiary; **excluded** → label and time tertiary with `line-through`; pin / exclude icon buttons at right.
- **Copied state:** the Copy button swaps to the primary variant with a check icon and the word "Copied" for 1600ms, then reverts.
- **Skeleton:** `glass-raised`→`glass-hover` linear shimmer, 1.4s, 4px radius.

## Do's and Don'ts

### Do:
- **Do** keep controls at 28px (24px small, selects and number inputs) with a 6px (4px small) radius and a 1px `hairline-strong` border; hover is one tonal step up, not a transform.
- **Do** set every string in JetBrains Mono with tabular numerals; mark prose by dropping to 11–11.5px with 1.5–1.55 leading in secondary or tertiary text.
- **Do** write every heading, key and column head lowercase at normal tracking, and prefix headings in the comment register: `# ` on a section head, `## ` on a sub-head (prefix in tertiary at 400), `$ ` in phosphor on the register prompt only.
- **Do** reserve phosphor for prompt, cursor, selection, lead, primary action, focus, "on" and the `{` `}` group brackets; the lead criterion, selected result, "on" segment and "taking" offering are the only green-filled rows on screen.
- **Do** build status and course colour as a 13–16% tint fill with the full-strength colour as text and (for course blocks) a 45% border; show seat state as a tint behind an option chip with primary text, and an open option as a dashed, hatched ghost in the course hue.
- **Do** separate regions with 1px `hairline` borders and surface steps; wells sit one step below their panel on `glass-floor`.
- **Do** use the standard ease `cubic-bezier(0.16, 1, 0.3, 1)` at 120ms for colour state and 200ms for position; honour `prefers-reduced-motion`.
- **Do** draw icons as 16-unit line paths at 1.5 stroke with round caps, rendered at 12–14px; inline the same drawing as a data URI where a background image is the only option (the select chevron).
- **Do** make anything clickable a real `<button>` with an `aria-label` and the shared focus ring, as the grid blocks are.

### Don't:
- **Don't** add box-shadows, gradients, blur or glows on the page; the only halo is the 3px focus halo on a field or paste box, the only gradients are the loading shimmer and the ghost hatch, and the only cast shadow and blur belong to the modal dialog and its backdrop.
- **Don't** introduce a light theme or theme switch; the world is `color-scheme: dark` only.
- **Don't** fill a surface with a status or course colour at full strength; solid fills belong to the primary button, the lead and open badges, the checked switch and the cursor.
- **Don't** reintroduce Inter or any sans-serif; one face is the terminal's whole voice.
- **Don't** uppercase or letter-space any label, heading or key, and don't use a second accent or a hue-coded heading; headings are lowercase 11.5px mono in secondary text behind a tertiary `# `.
- **Don't** give a prefix glyph to anything that is not a heading or the register prompt; `# `, `## ` and `$ ` are the whole vocabulary.
- **Don't** set text above 15px or below 9px; the type world lives between 9px corner marks and the 15px rank display.
- **Don't** add authored motion beyond the cursor blink, the moved-row ring and the dialog's 200ms entry; everything else animates only as a response to state.
- **Don't** replace drawn line icons with glyph fonts, emoji or an icon package.
