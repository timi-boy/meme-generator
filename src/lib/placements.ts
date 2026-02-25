/**
 * Placement presets for meme text (position, alignment, which lines go where).
 */

export type PlacementId = 'top' | 'bottom' | 'topBottom' | 'center' | 'topLeft'

export interface PlacementPreset {
  id: PlacementId
  name: string
  /** Where to draw: 'top' | 'bottom' | 'center' | 'topLeft'. For topBottom we use top + bottom. */
  positions: ('top' | 'bottom' | 'center' | 'topLeft')[]
  /** Text alignment on canvas */
  align: 'left' | 'center' | 'right'
}

export const PLACEMENT_PRESETS: PlacementPreset[] = [
  { id: 'top', name: 'Top', positions: ['top'], align: 'center' },
  { id: 'bottom', name: 'Bottom', positions: ['bottom'], align: 'center' },
  { id: 'topBottom', name: 'Top + Bottom', positions: ['top', 'bottom'], align: 'center' },
  { id: 'center', name: 'Center', positions: ['center'], align: 'center' },
  { id: 'topLeft', name: 'Top left', positions: ['topLeft'], align: 'left' },
]

export function getPreset(id: PlacementId): PlacementPreset | undefined {
  return PLACEMENT_PRESETS.find((p) => p.id === id)
}
