/** Eight ANSI-style course hues. Index by position of the course in the request. */
export const COURSE_HUES = [
  { name: 'magenta', h: 305, s: 75, l: 62 },
  { name: 'yellow', h: 48, s: 90, l: 58 },
  { name: 'cyan', h: 184, s: 75, l: 50 },
  { name: 'orange', h: 24, s: 95, l: 58 },
  { name: 'blue', h: 222, s: 78, l: 60 },
  { name: 'red', h: 2, s: 88, l: 60 },
  { name: 'purple', h: 268, s: 65, l: 64 },
  { name: 'lime', h: 100, s: 70, l: 55 },
]

export function courseColor(index: number): { fg: string; bg: string; border: string } {
  const c = COURSE_HUES[index % COURSE_HUES.length]
  return {
    fg: `hsl(${c.h} ${c.s}% ${c.l}%)`,
    bg: `hsl(${c.h} ${c.s}% ${c.l}% / 0.16)`,
    border: `hsl(${c.h} ${c.s}% ${c.l}% / 0.45)`,
  }
}
