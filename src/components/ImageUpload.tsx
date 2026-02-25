import { useCallback, useRef } from 'react'

// Picsum Photos (Unsplash Source is deprecated and no longer works)
const PICSUM_BASE = 'https://picsum.photos'
const IMG_SIZE = 600
const SUGGESTED_KEYWORDS = ['funny', 'cat', 'reaction', 'office', 'nature', 'minimal']

interface ImageUploadProps {
  currentImageUrl: string | null
  onImageFromFile: (file: File) => void
  onImageFromUrl: (url: string) => void
}

export function ImageUpload({
  currentImageUrl,
  onImageFromFile,
  onImageFromUrl,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type.startsWith('image/')) {
        onImageFromFile(file)
      }
      e.target.value = ''
    },
    [onImageFromFile]
  )

  const handlePicsumKeyword = useCallback(
    (keyword: string) => {
      const url = `${PICSUM_BASE}/seed/${encodeURIComponent(keyword)}/${IMG_SIZE}/${IMG_SIZE}`
      onImageFromUrl(url)
    },
    [onImageFromUrl]
  )

  const handleCustomKeyword = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const input = e.currentTarget.elements.namedItem('keyword') as HTMLInputElement
      const keyword = input?.value?.trim()
      if (keyword) {
        handlePicsumKeyword(keyword)
        input.value = ''
      }
    },
    [handlePicsumKeyword]
  )

  return (
    <section className="image-upload" style={{ marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Image</h3>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ padding: '0.5rem 1rem', borderRadius: 6 }}
        >
          Upload from device
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Upload image"
        />
        <span style={{ color: '#666', fontSize: '0.9rem' }}>or Picsum:</span>
        {SUGGESTED_KEYWORDS.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => handlePicsumKeyword(kw)}
            style={{ padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.9rem' }}
          >
            {kw}
          </button>
        ))}
        <form onSubmit={handleCustomKeyword} style={{ display: 'flex', gap: '0.25rem' }}>
          <input
            name="keyword"
            type="text"
            placeholder="Keyword..."
            style={{ padding: '0.35rem 0.5rem', width: 120, borderRadius: 4 }}
          />
          <button type="submit" style={{ padding: '0.35rem 0.75rem', borderRadius: 6 }}>
            Get image
          </button>
        </form>
      </div>
      {currentImageUrl && (
        <div style={{ marginTop: '0.5rem' }}>
          <img
            src={currentImageUrl}
            alt="Current meme background"
            style={{ maxWidth: 200, maxHeight: 150, objectFit: 'contain', borderRadius: 8 }}
          />
        </div>
      )}
    </section>
  )
}
