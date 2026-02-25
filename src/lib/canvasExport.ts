/**
 * Draw image + text onto a canvas and export as PNG blob or data URL.
 */

import type { PlacementPreset } from './placements'

const DEFAULT_FONT = 'Impact, sans-serif'
const DEFAULT_FONT_SIZE_RATIO = 0.08 // of min(width, height)
const STROKE_WIDTH = 3
const PADDING_RATIO = 0.03

export interface MemeTextLines {
  top?: string
  bottom?: string
  center?: string
  topLeft?: string
}

export interface DrawMemeOptions {
  image: HTMLImageElement | null
  text: MemeTextLines
  preset: PlacementPreset
  width: number
  height: number
  fontFamily?: string
  fontSize?: number
}

function getTextLinesForPreset(text: MemeTextLines, preset: PlacementPreset): string[] {
  const lines: string[] = []
  for (const pos of preset.positions) {
    const line =
      pos === 'top'
        ? text.top
        : pos === 'bottom'
          ? text.bottom
          : pos === 'center'
            ? (text.center ?? text.top)
            : (text.topLeft ?? text.top)
    lines.push(line ?? '')
  }
  return lines.length ? lines : ['']
}

/**
 * Draw the meme (image + text) onto the given canvas 2d context.
 */
export function drawMemeToContext(
  ctx: CanvasRenderingContext2D,
  options: DrawMemeOptions
): void {
  const { image, text, preset, width, height, fontFamily = DEFAULT_FONT } = options
  const padding = Math.min(width, height) * PADDING_RATIO
  const fontSize = options.fontSize ?? Math.min(width, height) * DEFAULT_FONT_SIZE_RATIO

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)

  if (image) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const sw = image.naturalWidth * scale
    const sh = image.naturalHeight * scale
    const sx = (width - sw) / 2
    const sy = (height - sh) / 2
    ctx.drawImage(image, sx, sy, sw, sh)
  }

  const lines = getTextLinesForPreset(text, preset)
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.textAlign = preset.align
  ctx.textBaseline = 'top'

  const lineHeight = fontSize * 1.2
  const maxTextWidth = width - padding * 2

  const positionY = (vertical: 'top' | 'bottom' | 'center' | 'topLeft'): number => {
    if (vertical === 'top') return padding
    if (vertical === 'bottom') return height - padding - lineHeight
    if (vertical === 'center') return (height - lineHeight) / 2
    return padding // topLeft
  }

  const positionX = (): number => {
    if (preset.align === 'center') return width / 2
    if (preset.align === 'right') return width - padding
    return padding
  }

  for (let i = 0; i < preset.positions.length; i++) {
    const pos = preset.positions[i]
    const line = lines[i] ?? ''
    const y = positionY(pos)
    const x = positionX()

    ctx.strokeStyle = '#000'
    ctx.lineWidth = STROKE_WIDTH
    ctx.strokeText(line, x, y, maxTextWidth)
    ctx.fillStyle = '#fff'
    ctx.fillText(line, x, y, maxTextWidth)
  }
}

/**
 * Create an off-screen canvas, draw the meme, and return as PNG data URL.
 */
export function memeToDataURL(options: DrawMemeOptions): string {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  drawMemeToContext(ctx, options)
  return canvas.toDataURL('image/png')
}

/**
 * Create an off-screen canvas, draw the meme, and return as PNG blob (for Web Share).
 */
export function memeToBlob(options: DrawMemeOptions): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.resolve(null)
  drawMemeToContext(ctx, options)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}
