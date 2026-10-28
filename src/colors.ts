/** Eight muted course hues. Index by position of the course in the request. */
export const COURSE_HUES = [
  { name: 'blue', h: 222, s: 80, l: 68 },
  { name: 'violet', h: 268, s: 70, l: 70 },
  { name: 'teal', h: 172, s: 55, l: 55 },
  { name: 'amber', h: 38, s: 85, l: 62 },
  { name: 'rose', h: 345, s: 70, l: 68 },
  { name: 'lime', h: 95, s: 50, l: 58 },
  { name: 'orange', h: 20, s: 80, l: 64 },
  { name: 'cyan', h: 195, s: 70, l: 60 },
]

export function courseColor(index: number): { fg: string; bg: string; border: string } {
  const c = COURSE_HUES[index % COURSE_HUES.length]
  return {
    fg: `hsl(${c.h} ${c.s}% ${c.l}%)`,
    bg: `hsl(${c.h} ${c.s}% ${c.l}% / 0.16)`,
    border: `hsl(${c.h} ${c.s}% ${c.l}% / 0.45)`,
  }
}
