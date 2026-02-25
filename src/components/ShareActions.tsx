import { useCallback } from 'react'
import { getPreset } from '../lib/placements'
import type { PlacementId } from '../lib/placements'
import { memeToDataURL, memeToBlob } from '../lib/canvasExport'
import type { MemeTextLines } from '../lib/canvasExport'

const EXPORT_WIDTH = 600
const EXPORT_HEIGHT = 600

interface ShareActionsProps {
  image: HTMLImageElement | null
  text: MemeTextLines
  selectedPlacementId: PlacementId
}

export function ShareActions({
  image,
  text,
  selectedPlacementId,
}: ShareActionsProps) {
  const preset = getPreset(selectedPlacementId)

  const handleDownload = useCallback(() => {
    if (!preset) return
    const dataUrl = memeToDataURL({
      image,
      text,
      preset,
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
    })
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'meme.png'
    a.click()
  }, [image, text, preset])

  const handleShare = useCallback(async () => {
    if (!preset) return
    const blob = await memeToBlob({
      image,
      text,
      preset,
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
    })
    if (!blob) return
    const file = new File([blob], 'meme.png', { type: 'image/png' })
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Meme',
          text: 'Check out my meme!',
          files: [file],
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleDownload()
        }
      }
    } else {
      handleDownload()
    }
  }, [image, text, preset, handleDownload])

  return (
    <section className="share-actions" style={{ marginTop: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Share</h3>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={handleDownload}
          style={{ padding: '0.5rem 1rem', borderRadius: 6 }}
        >
          Download
        </button>
        <button
          type="button"
          onClick={handleShare}
          style={{ padding: '0.5rem 1rem', borderRadius: 6 }}
        >
          Share
        </button>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
        Share uses the Web Share API when available; otherwise download is used.
      </p>
    </section>
  )
}
