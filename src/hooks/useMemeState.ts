import { useState, useCallback } from 'react'
import type { PlacementId } from '../lib/placements'
import type { MemeTextLines } from '../lib/canvasExport'

export interface MemeState {
  /** Image as object URL (from file) or external URL (Unsplash/template) */
  imageUrl: string | null
  /** Image element loaded for canvas (internal) */
  imageElement: HTMLImageElement | null
  text: MemeTextLines
  selectedPlacementId: PlacementId
}

const defaultText: MemeTextLines = {
  top: '',
  bottom: '',
  center: '',
  topLeft: '',
}

export function useMemeState() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [text, setText] = useState<MemeTextLines>({ ...defaultText })
  const [selectedPlacementId, setSelectedPlacementId] = useState<PlacementId>('topBottom')

  const setImageFromUrl = useCallback((url: string | null) => {
    setImageUrl((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return url
    })
    if (!url) {
      setImageElement(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImageElement(img)
    img.onerror = () => setImageElement(null)
    img.src = url
  }, [])

  const setImageFromFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setImageFromUrl(url)
  }, [setImageFromUrl])

  const setTextLine = useCallback(
    (key: keyof MemeTextLines, value: string) => {
      setText((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const setTextLines = useCallback((lines: Partial<MemeTextLines>) => {
    setText((prev) => ({ ...prev, ...lines }))
  }, [])

  const setPlacement = useCallback((id: PlacementId) => {
    setSelectedPlacementId(id)
  }, [])

  return {
    imageUrl,
    imageElement,
    text,
    selectedPlacementId,
    setImageFromUrl,
    setImageFromFile,
    setTextLine,
    setTextLines,
    setPlacement,
  }
}
