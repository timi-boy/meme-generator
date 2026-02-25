import { useMemeState } from './hooks/useMemeState'
import { ImageUpload } from './components/ImageUpload'
import { TextEditor } from './components/TextEditor'
import { PlacementPreviews } from './components/PlacementPreviews'
import { ShareActions } from './components/ShareActions'
import './App.css'

function App() {
  const {
    imageUrl,
    imageElement,
    text,
    selectedPlacementId,
    setImageFromUrl,
    setImageFromFile,
    setTextLine,
    setTextLines,
    setPlacement,
  } = useMemeState()

  const handleSelectTemplate = (imageUrlFromTemplate: string, topText: string, bottomText: string) => {
    setImageFromUrl(imageUrlFromTemplate)
    setTextLines({ top: topText, bottom: bottomText })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Meme Generator</h1>
      </header>
      <main className="app-main">
        <div className="app-controls">
          <ImageUpload
            currentImageUrl={imageUrl}
            onImageFromFile={setImageFromFile}
            onImageFromUrl={setImageFromUrl}
          />
          <TextEditor
            text={text}
            onTextLine={setTextLine}
            onTextLines={setTextLines}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>
        <PlacementPreviews
          image={imageElement}
          text={text}
          selectedPlacementId={selectedPlacementId}
          onSelectPlacement={setPlacement}
        />
        <ShareActions
          image={imageElement}
          text={text}
          selectedPlacementId={selectedPlacementId}
        />
      </main>
    </div>
  )
}

export default App
