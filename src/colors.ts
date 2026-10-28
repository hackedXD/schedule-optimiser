/** Eight ANSI-style course hues. Index by position of the course in the request. */
export const COURSE_HUES = [
  { name: 'cyan', h: 191, s: 90, l: 70 },
  { name: 'magenta', h: 326, s: 100, l: 74 },
  { name: 'yellow', h: 65, s: 92, l: 76 },
  { name: 'orange', h: 31, s: 100, l: 71 },
  { name: 'purple', h: 265, s: 89, l: 78 },
  { name: 'red', h: 0, s: 100, l: 70 },
  { name: 'blue', h: 216, s: 100, l: 70 },
  { name: 'green', h: 135, s: 94, l: 65 },
]

export function courseColor(index: number): { fg: string; bg: string; border: string } {
  const c = COURSE_HUES[index % COURSE_HUES.length]
  return {
    fg: `hsl(${c.h} ${c.s}% ${c.l}%)`,
    bg: `hsl(${c.h} ${c.s}% ${c.l}% / 0.16)`,
    border: `hsl(${c.h} ${c.s}% ${c.l}% / 0.45)`,
  }
}
