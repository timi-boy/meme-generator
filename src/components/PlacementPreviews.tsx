import { PLACEMENT_PRESETS } from '../lib/placements'
import type { PlacementId } from '../lib/placements'
import type { MemeTextLines } from '../lib/canvasExport'
import { MemeCanvas } from './MemeCanvas'

const PREVIEW_SIZE = 200

interface PlacementPreviewsProps {
  image: HTMLImageElement | null
  text: MemeTextLines
  selectedPlacementId: PlacementId
  onSelectPlacement: (id: PlacementId) => void
}

export function PlacementPreviews({
  image,
  text,
  selectedPlacementId,
  onSelectPlacement,
}: PlacementPreviewsProps) {
  return (
    <section className="placement-previews" style={{ marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Preview – choose placement</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {PLACEMENT_PRESETS.map((preset) => (
          <div key={preset.id} style={{ textAlign: 'center' }}>
            <MemeCanvas
              image={image}
              text={text}
              preset={preset}
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE}
              selected={selectedPlacementId === preset.id}
              onClick={() => onSelectPlacement(preset.id)}
            />
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{preset.name}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
