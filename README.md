# Schedule Optimiser

A personal course scheduler for CMU. Give it the courses you must take plus any
"pick N of" groups, and it enumerates every conflict-free combination of
lectures and sections, then ranks them by four criteria whose priority order you
set in the app.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. Click **Load example** to try
`21-241, 18-213, 15-150, 49-101` plus pick 1 of `17-200, 10-335, 73-102`.

## Publishing

Pushing to `master` runs `.github/workflows/pages.yml`, which tests, builds
with the repository name as the base path, and deploys `dist/` to GitHub
Pages. Enable Pages once in the repository settings with **Source: GitHub
Actions**. The published site is static: it uses the data files committed
under `public/data/` and cannot fetch new SOC details or FCEs, so run
`npm run details`, `npm run fces` and `npm run ingest` locally and commit the
results before pushing.

## Data

The app ships with `public/data/soc.json`, generated from the CMU
"Full Schedule Of Classes" HTML export in `cmu-schedule-of-classes.html`.
To refresh it from a new export:

```bash
npm run ingest -- path/to/export.html
```

You can also load an export straight into the running app with **Load export**
in the top bar (parsed in the browser, kept in memory only).

The export has no instructor column, and no public source lists instructors for
an upcoming semester, so instructors come only from an **Import SIO** paste
(top bar): copy a course's section table from SIO and paste it. Once a course
has imported instructors, its dialog lists them with FCE scores from the
ScottyLabs course API (the data behind cmucourses.com): the instructor's mean
overall-teaching and overall-course scores over their last three terms of that
course, or, when they have never taught it, across every course they have
taught (marked "all courses"). **Use** applies the score to the lectures and
sections that instructor teaches. You can also type a rating for the whole
course, a lecture or a section. Unrated sections count as neutral. The dev
server fetches and caches FCEs in `public/data/`; for a production build
prefetch with:

```bash
npm run fces -- 21-241 18-213 15-150
```

## Course details

Descriptions, prerequisites and the lecture-to-section pairing come from the
SOC course-details page, which the full export lacks. While `npm run dev` is
running, the app fetches each requested course once through a local endpoint
and caches it in `public/data/details.json`. For a production build, prefetch:

```bash
npm run details -- S27 21-241 18-213 15-150
```

When a course's details are known, a section is only paired with the lecture
SOC lists it under (shown as a "paired" tag in the expanded course).

## Availability first

Registration is section by section, and popular sections fill before your
slot. Mark a course **Hard** or **Very hard** in its expanded row and switch on
**Maximise chances of getting in** (Availability section). The optimiser then
commits only to the easy courses' sections and keeps every hard course's
lecture+section options open:

- Plans are ordered by how many options stay open for the hardest course, then
  for the next, and so on, before any other criterion. For a later hard course
  the count is the worst case over whatever you might end up with in the harder
  ones, so it is a guarantee, not a hope.
- Interchangeable sections count separately: each is a seat to try for.
- With an SIO import, open seats count 1, waitlisted 0.5, closed 0.15, so plans
  that keep seats open beat plans that keep only waitlists open.
- An Equal group can be marked **Flex**: the whole group becomes one open tier.
  No course from it is committed; the plan keeps every option's sections open
  and maximises the total open across the group, so at registration you take
  whichever course and section you can get. Ranked groups cannot be flexible.
- The grid draws the open options as dashed ghosts behind the preferred pick;
  the register strip lists them in the order to try, with seat state when known.

## Ranking

Criteria are compared in strict priority order. Each is quantised to a small
tolerance band (15 min for start/end, 10 min for gaps, 0.25 for ratings) so
near-ties fall through to the next criterion.

| Criterion | Measure | Better |
|---|---|---|
| FCE rating | mean manual rating over the schedule's sections | higher |
| Start time | mean first-class start over days with classes | later |
| Time between classes | shortest break between consecutive classes in the week | longer |
| End time | mean last-class end over days with classes | earlier |
| Walking | estimated metres per week between consecutive buildings, from and to your dorm when set | less |

Walking is an estimate. SOC publishes no rooms for an upcoming semester, so
each course is placed in its department's usual building (`src/campus.ts`)
unless you import its SIO rows or set a building in its expanded row.
Coordinates are hand-placed from the campus map.

Imported SIO rows also carry the building and room, which replace the
department estimate for walking. Imports stay in your browser. Enrollment reservations from
the SOC detail page show as a `res` tag on the reserved sections.

A pick-N group can be **Equal** (options interchangeable) or **Ranked** (drag
options into preference order). Ranked is a hard tier, applied before any
criterion: a lower option is used only when no conflict-free schedule exists
with a higher one, and the results footer says how many schedules that hid.
Clicking a block on the weekly grid opens an in-app details dialog for that course, with a link to its SOC page.

## Engine

`src/engine` is a pure, dependency-free module: `parseSoc.ts` (export parser),
`solve.ts` (enumeration with conflict pruning, pins, exclusions, campus and
mini-semester filters), `rank.ts` (scoring and ordering). Tests:

```bash
npm test
```
