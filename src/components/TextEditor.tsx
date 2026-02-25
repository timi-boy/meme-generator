import type { MemeTextLines } from '../lib/canvasExport'
import { TRENDING_MEMES } from '../data/trendingMemes'

interface TextEditorProps {
  text: MemeTextLines
  onTextLine: (key: keyof MemeTextLines, value: string) => void
  onTextLines: (lines: Partial<MemeTextLines>) => void
  onSelectTemplate: (imageUrl: string, topText: string, bottomText: string) => void
}

export function TextEditor({
  text,
  onTextLine,
  onTextLines,
  onSelectTemplate,
}: TextEditorProps) {
  const handleTemplateClick = (template: (typeof TRENDING_MEMES)[0]) => {
    onTextLines({
      top: template.topText,
      bottom: template.bottomText,
      center: '',
      topLeft: '',
    })
    if (template.imageUrl) {
      onSelectTemplate(template.imageUrl, template.topText, template.bottomText)
    }
  }

  return (
    <section className="text-editor" style={{ marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Text</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ minWidth: 70 }}>Top:</span>
          <input
            type="text"
            value={text.top ?? ''}
            onChange={(e) => onTextLine('top', e.target.value)}
            placeholder="Top text"
            style={{ flex: 1, padding: '0.4rem', borderRadius: 4 }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ minWidth: 70 }}>Bottom:</span>
          <input
            type="text"
            value={text.bottom ?? ''}
            onChange={(e) => onTextLine('bottom', e.target.value)}
            placeholder="Bottom text"
            style={{ flex: 1, padding: '0.4rem', borderRadius: 4 }}
          />
        </label>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Trending templates</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {TRENDING_MEMES.filter((t) => t.id !== 'custom').map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleTemplateClick(template)}
              style={{ padding: '0.4rem 0.75rem', borderRadius: 6, fontSize: '0.85rem' }}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
