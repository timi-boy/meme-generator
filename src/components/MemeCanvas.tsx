import { useEffect, useRef } from 'react'
import type { PlacementPreset } from '../lib/placements'
import { drawMemeToContext } from '../lib/canvasExport'
import type { MemeTextLines } from '../lib/canvasExport'

interface MemeCanvasProps {
  image: HTMLImageElement | null
  text: MemeTextLines
  preset: PlacementPreset
  width: number
  height: number
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function MemeCanvas({
  image,
  text,
  preset,
  width,
  height,
  selected,
  onClick,
  className,
}: MemeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawMemeToContext(ctx, {
      image,
      text,
      preset,
      width,
      height,
    })
  }, [image, text, preset, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={onClick}
      className={className}
      style={{
        cursor: onClick ? 'pointer' : undefined,
        border: selected ? '3px solid #2563eb' : '1px solid #ccc',
        borderRadius: 8,
        maxWidth: '100%',
      }}
      aria-label={`Preview: ${preset.name}`}
    />
  )
}
