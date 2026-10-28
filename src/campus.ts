/**
 * Approximate CMU campus coordinates for walking estimates. Positions are hand-placed from the campus map,
 * accurate to roughly a building's footprint; distances are estimates, not measured paths.
 */
export interface Place { code: string; name: string; lat: number; lng: number; kind: 'building' | 'dorm' }

export const BUILDINGS: Place[] = [
  { code: 'GHC', name: 'Gates & Hillman Centers', lat: 40.4435, lng: -79.9447, kind: 'building' },
  { code: 'NSH', name: 'Newell-Simon Hall', lat: 40.4433, lng: -79.9456, kind: 'building' },
  { code: 'WEH', name: 'Wean Hall', lat: 40.4428, lng: -79.9456, kind: 'building' },
  { code: 'DH', name: 'Doherty Hall', lat: 40.4424, lng: -79.9440, kind: 'building' },
  { code: 'BH', name: 'Baker Hall', lat: 40.4415, lng: -79.9442, kind: 'building' },
  { code: 'PH', name: 'Porter Hall', lat: 40.4414, lng: -79.9449, kind: 'building' },
  { code: 'HH', name: 'Hamerschlag Hall', lat: 40.4420, lng: -79.9467, kind: 'building' },
  { code: 'SH', name: 'Scott Hall', lat: 40.4425, lng: -79.9470, kind: 'building' },
  { code: 'ANS', name: 'ANSYS Hall', lat: 40.4427, lng: -79.9473, kind: 'building' },
  { code: 'SC', name: 'Scaife Hall', lat: 40.4421, lng: -79.9472, kind: 'building' },
  { code: 'MM', name: 'Margaret Morrison Carnegie Hall', lat: 40.4409, lng: -79.9429, kind: 'building' },
  { code: 'CFA', name: 'College of Fine Arts', lat: 40.4418, lng: -79.9426, kind: 'building' },
  { code: 'PCA', name: 'Purnell Center', lat: 40.4437, lng: -79.9432, kind: 'building' },
  { code: 'POS', name: 'Posner Hall', lat: 40.4411, lng: -79.9427, kind: 'building' },
  { code: 'HBH', name: 'Hamburg Hall', lat: 40.4443, lng: -79.9466, kind: 'building' },
  { code: 'TEP', name: 'Tepper Quad', lat: 40.4447, lng: -79.9455, kind: 'building' },
  { code: 'TCS', name: 'TCS Hall', lat: 40.4445, lng: -79.9445, kind: 'building' },
  { code: 'CIC', name: 'Collaborative Innovation Center', lat: 40.4438, lng: -79.9454, kind: 'building' },
  { code: 'CUC', name: 'Cohon University Center', lat: 40.4431, lng: -79.9420, kind: 'building' },
  { code: 'WH', name: 'Warner Hall', lat: 40.4431, lng: -79.9437, kind: 'building' },
  { code: 'HL', name: 'Hunt Library', lat: 40.4411, lng: -79.9437, kind: 'building' },
  { code: 'MI', name: 'Mellon Institute', lat: 40.4457, lng: -79.9510, kind: 'building' },
]

export const DORMS: Place[] = [
  { code: 'MOR', name: 'Morewood Gardens', lat: 40.4452, lng: -79.9430, kind: 'dorm' },
  { code: 'MET', name: 'Morewood E-Tower', lat: 40.4454, lng: -79.9435, kind: 'dorm' },
  { code: 'STV', name: 'Stever House', lat: 40.4452, lng: -79.9405, kind: 'dorm' },
  { code: 'MUD', name: 'Mudge House', lat: 40.4467, lng: -79.9410, kind: 'dorm' },
  { code: 'R5', name: 'Residence on Fifth', lat: 40.4480, lng: -79.9390, kind: 'dorm' },
  { code: 'DON', name: 'Donner House', lat: 40.4403, lng: -79.9420, kind: 'dorm' },
  { code: 'HAM', name: 'Hamerschlag House', lat: 40.4409, lng: -79.9415, kind: 'dorm' },
  { code: 'WEL', name: 'Welch House', lat: 40.4409, lng: -79.9411, kind: 'dorm' },
  { code: 'MCG', name: 'McGill / Boss', lat: 40.4399, lng: -79.9413, kind: 'dorm' },
  { code: 'SCO', name: 'Scobell / Henderson', lat: 40.4403, lng: -79.9410, kind: 'dorm' },
  { code: 'ROS', name: 'Roselawn', lat: 40.4411, lng: -79.9405, kind: 'dorm' },
  { code: 'MMA', name: 'Margaret Morrison Apartments', lat: 40.4408, lng: -79.9395, kind: 'dorm' },
  { code: 'DOA', name: 'Doherty Apartments', lat: 40.4418, lng: -79.9395, kind: 'dorm' },
  { code: 'FFX', name: 'Fairfax Apartments', lat: 40.4455, lng: -79.9325, kind: 'dorm' },
  { code: 'SHY', name: 'Shirley Apartments', lat: 40.4440, lng: -79.9320, kind: 'dorm' },
  { code: 'FBA', name: 'Forbes-Beeler Apartments', lat: 40.4437, lng: -79.9325, kind: 'dorm' },
  { code: 'WEB', name: 'Webster Hall', lat: 40.4432, lng: -79.9348, kind: 'dorm' },
]

export const PLACES: Record<string, Place> = Object.fromEntries([...BUILDINGS, ...DORMS].map((p) => [p.code, p]))

/** Department prefix -> the building most of its classes meet in. An estimate until SOC publishes rooms. */
export const DEPARTMENT_BUILDING: Record<string, string> = {
  '02': 'GHC', '03': 'DH', '05': 'NSH', '06': 'DH', '08': 'TCS', '09': 'DH', '10': 'GHC', '11': 'GHC', '12': 'PH',
  '15': 'GHC', '16': 'NSH', '17': 'GHC', '18': 'HH', '19': 'BH', '21': 'WEH', '24': 'SH', '27': 'WEH', '33': 'DH',
  '36': 'BH', '39': 'SH', '42': 'SH', '48': 'MM', '49': 'ANS', '51': 'MM', '54': 'PCA', '57': 'CFA', '60': 'CFA',
  '62': 'CFA', '66': 'BH', '67': 'HBH', '69': 'CUC', '70': 'TEP', '73': 'TEP', '76': 'BH', '79': 'BH', '80': 'BH',
  '82': 'PH', '84': 'PH', '85': 'BH', '88': 'PH', '90': 'HBH', '94': 'HBH',
}

export function defaultBuilding(course: string): string | undefined {
  return DEPARTMENT_BUILDING[course.slice(0, 2)]
}

/** Straight-line metres scaled by a path factor for campus walking. */
export function walkingMetres(a: string, b: string): number | null {
  const pa = PLACES[a], pb = PLACES[b]
  if (!pa || !pb) return null
  if (a === b) return 0
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(pb.lat - pa.lat)
  const dLng = toRad(pb.lng - pa.lng)
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(pa.lat)) * Math.cos(toRad(pb.lat)) * Math.sin(dLng / 2) ** 2
  const d = 2 * R * Math.asin(Math.sqrt(x))
  return Math.round(d * 1.3)
}
