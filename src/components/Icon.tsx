import type { SVGProps } from 'react'

const PATHS: Record<string, string> = {
  plus: 'M8 3v10M3 8h10',
  x: 'M4 4l8 8M12 4l-8 8',
  chevronDown: 'M4 6l4 4 4-4',
  chevronRight: 'M6 4l4 4-4 4',
  chevronLeft: 'M10 4L6 8l4 4',
  up: 'M8 12V4M4 8l4-4 4 4',
  down: 'M8 4v8M4 8l4 4 4-4',
  grip: 'M6 4h.01M10 4h.01M6 8h.01M10 8h.01M6 12h.01M10 12h.01',
  pin: 'M9.5 2.5l4 4-2.5 1-2 4.5-3-3L2.5 13.5M6 10l-3.5 3.5M6 10l-3-3 4.5-2 1-2.5',
  ban: 'M8 14A6 6 0 108 2a6 6 0 000 12zM3.8 3.8l8.4 8.4',
  copy: 'M6 6h7v7H6zM3 10V3h7',
  check: 'M3 8.5l3 3 7-7',
  upload: 'M8 11V3M4.5 6.5L8 3l3.5 3.5M3 13h10',
  info: 'M8 14A6 6 0 108 2a6 6 0 000 12zM8 7.5V11M8 5.3v.01',
  alert: 'M8 2.5l6 11H2l6-11zM8 7v3M8 12v.01',
  reset: 'M3 8a5 5 0 109-3M3 3v3h3',
  star: 'M8 2.5l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 11.3l-3.5 1.9.8-3.9L2.4 6.6l3.9-.5z',
  sliders: 'M3 5h6M11 5h2M3 11h2M7 11h6M9 3.5v3M5 9.5v3',
  enter: 'M13 3v5a2 2 0 01-2 2H3M6 7l-3 3 3 3',
}

export function Icon({ name, size = 16, ...rest }: { name: keyof typeof PATHS | string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={PATHS[name] ?? ''} />
    </svg>
  )
}
