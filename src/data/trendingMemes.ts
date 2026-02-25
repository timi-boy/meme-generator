/**
 * Curated list of trending meme templates (image URL + default text).
 * Uses Picsum Photos (Unsplash Source is deprecated and no longer works).
 */

export interface TrendingMemeTemplate {
  id: string
  name: string
  /** Image URL (e.g. Picsum Photos) */
  imageUrl: string
  /** Default text for top / bottom (classic two-line meme) */
  topText: string
  bottomText: string
}

const PICSUM_BASE = 'https://picsum.photos'
const IMG_SIZE = 600

export const TRENDING_MEMES: TrendingMemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake',
    imageUrl: `${PICSUM_BASE}/seed/drake/${IMG_SIZE}/${IMG_SIZE}`,
    topText: 'Something bad',
    bottomText: 'Something good',
  },
  {
    id: 'distracted',
    name: 'Distracted',
    imageUrl: `${PICSUM_BASE}/seed/distracted/${IMG_SIZE}/${IMG_SIZE}`,
    topText: 'Me ignoring responsibilities',
    bottomText: 'Me making memes',
  },
  {
    id: 'success',
    name: 'Success Kid',
    imageUrl: `${PICSUM_BASE}/seed/success/${IMG_SIZE}/${IMG_SIZE}`,
    topText: 'When you finally',
    bottomText: 'get it working',
  },
  {
    id: 'change-mind',
    name: 'Change My Mind',
    imageUrl: `${PICSUM_BASE}/seed/debate/${IMG_SIZE}/${IMG_SIZE}`,
    topText: 'Change my mind:',
    bottomText: 'Memes are art',
  },
  {
    id: 'custom',
    name: 'Custom / Upload',
    imageUrl: '',
    topText: 'Top text',
    bottomText: 'Bottom text',
  },
]
