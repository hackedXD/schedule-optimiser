# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Vite + React + TypeScript, with the scheduling engine (parser, solver, ranker) as a pure, dependency-free module with its own tests so it can be exercised without the UI. Runs locally with one command; no backend, no accounts. Chosen because the user asked for a recommendation and the tool is a single-user local app whose hard part is the solver, not infrastructure.

## Users

One person: the owner, a Carnegie Mellon University student, planning their own course schedule at registration time. They run the tool locally on their own machine a few times per semester, usually in a short, focused burst when the Schedule of Classes is published and again when registration opens. No other audiences are confirmed. No sharing, accounts, or hosting are in scope.

## Product Purpose

Given a set of courses the student must take, plus choice groups ("pick 1 of these three"), the tool enumerates every conflict-free combination of lecture and section choices, then ranks those schedules by an ordered list of built-in criteria. Success is the student finding, in one sitting, the specific lecture/section codes to register for, with confidence that no better-ranked valid combination was missed.

## Positioning

Exhaustive enumeration with a user-reorderable priority list. Unlike picking sections by hand or using a scheduler that shows one "best" result, this tool builds the complete feasible set and lets the student change what "best" means (rating first, or late starts first, or gaps first) and watch the ranking change. The ordering of criteria is a first-class control in the app, not a hidden weighting.

## Operating Context

- Source data is the CMU "Full Schedule Of Classes" HTML export (file: `cmu-schedule-of-classes.html`, Spring 2027, run date 28-Oct-2026). The student downloads this page themselves and drops it into the tool; the tool never fetches from CMU directly.
- The export has eight columns: Course (five digits, e.g. `21241`), Title, Units, Lec/Sec, Days, Begin, End, Location. Course rows carry course/title/units; subsequent rows with those cells blank belong to the same course. Rows with a blank Lec/Sec cell are additional meeting times for the preceding section.
- Lec/Sec values seen: `Lec`, `Lec 1`/`Lec 2`/`Lec 3`, single or double letters (`A`…`Z`, `AA`, `PP`), and mini-semester suffixes (`A3`, `A4`, `M3`, `W4`), where `3`/`4` denote first/second half-semester.
- Day letters: `M T W R F S U` (R = Thursday, U = Sunday). `TBA` days with blank times occur for about 2,800 rows and cannot be scheduled.
- Times are `hh:mmAM/PM`, 12-hour.
- Locations include Pittsburgh plus Doha, San Jose, Kigali, New York, Washington DC, Lisbon. The student is in Pittsburgh; other campuses are noise for them.
- The export has no instructor column. Faculty Course Evaluation (FCE) data lives elsewhere at CMU and is not yet part of this tool.
- The SOC course-details page (`enr-apps.as.cmu.edu/open/SOC/SOCServlet/courseDetails?COURSE=<code>&SEMESTER=<S27>`) is public and carries the description, prerequisites, corequisites, cross-listings, notes, related URLs, special-permission flag, enrollment reservations and the lecture/section grouping. It has no instructor either. An unknown course returns HTTP 500. The tool fetches it once per requested course, server-side, and caches it in `public/data/details.json`.
- Students write course codes as `21-241`; the export stores them as `21241`. Both forms must be accepted.

## Capabilities and Constraints

Confirmed:
- Input: a list of required course codes and zero or more choice groups of the form "pick N of [codes]". The canonical example: `21-241, 18-213, 15-150, 49-101`, and pick 1 of `17-200, 10-335, 73-102`.
- Enumeration: every combination of one lecture (where a course has lectures) and one section (where a course has sections) per course, across all choice-group selections, filtered to combinations with no time overlap on any shared day.
- Ranking by six built-in criteria whose order the student can rearrange in the app (the last two added 28-Oct-2026):
  1. FCE rating of the instructor for that class (higher is better).
  2. Start time: later daily starts are better.
  3. Ample time between classes: breathing room between consecutive meetings is better than back-to-back.
  4. End time: earlier daily ends are better (the brief lists "end time" without a direction; earlier is assumed and must be confirmable).
  5. Group preference: a pick-N group can be marked Ranked, and schedules that take earlier-listed options rank higher. Equal groups contribute nothing.
  6. Walking ("pathing"): estimated metres per week between consecutive classes' buildings, from and to a chosen dorm when set. SOC publishes no rooms before the semester, so each course is placed in its department's usual building (`src/campus.ts`, hand-placed coordinates) unless the student overrides the building per course. The estimate is labelled as such in the UI.
- FCE is on hold. The criterion remains in the list and is live, fed by ratings the student types in manually. Because the export has no instructor, manual ratings attach to a course or to a specific lecture/section label. Unrated items are treated as neutral so the criterion never penalises missing data.
- Terminology: "course" (e.g. 15-150), "lecture" (Lec, Lec 1…), "section" (A, B…), "meeting" (one days+time block), "schedule" (one complete, conflict-free pick).

Open decisions (recorded, not invented):
- Lecture-to-section pairing is not in the export, but the SOC course-details page lists sections under their lecture. When that page has been fetched for a course, the solver only pairs a section with its listed lecture (the detail page labels a lone lecture "Lec 1" where the export says "Lec"); without it, any lecture pairs with any section, and pin/exclude still apply.
- Exact direction of the "end time" criterion (earlier assumed).
- How the ordered criteria combine (strict priority order vs. weighted). Strict priority with a sensible tolerance so near-ties fall through to the next criterion is the working assumption; the UI must make the order the visible control.
- Whether mini-semester sections and non-Pittsburgh locations should be hidden by default (assumed: Pittsburgh only by default, mini sections shown and labelled).

## Brand Commitments

- Visual direction (chosen 28-Oct-2026): the category standard for a scheduler, executed at the craft level of Linear. Inputs panel, a Monday-to-Friday weekly grid with coloured course blocks, a ranked results list. Familiar on purpose.
- Voice (revised 28-Oct-2026 at the user's request): a fully technical, terminal register. Near-black ground, phosphor-green accent, ANSI-style course colours, JetBrains Mono for every piece of text. Monospace is the product's own language here (course codes, section labels, times, ranks), not a costume.
- No name, logo, or copy assets exist yet. "Schedule Optimiser" is the working name.

## Evidence on Hand

- `cmu-schedule-of-classes.html`: the real Spring 2027 export, 3,223 courses, roughly 8,700 table rows. All seven example courses are present with real lecture and section times.
- No FCE data file. Do not fabricate instructor names or ratings; the UI must present missing ratings as missing.
- No logo, brand assets, or copy exist. The product has no name yet.

## Product Principles

1. Never miss a valid schedule. Completeness of enumeration is the product's reason to exist; performance work must never prune feasible combinations silently.
2. The ranking is the student's, not the tool's. Criteria order is a visible, reversible control, and the effect of changing it must be immediately legible in the results.
3. Show the data's gaps honestly. Missing FCE ratings, TBA times, and unknown lecture/section pairings are surfaced, not papered over.
4. Built for one person at registration time. Optimise for speed to a decision and for registering the exact codes, not for onboarding strangers.
5. The export is the source of truth. Parse what CMU publishes; do not maintain a hand-edited copy of the catalogue.
