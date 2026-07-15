/**
 * Derives the front-face image path for a tarot card.
 *
 * Images are stored in public/images/cards/ as 00.jpg through 77.jpg
 * (matching the card's id field in cards.ts).
 *
 * Returns the path suitable for use with Next.js <Image> or Three.js texture.
 * Returns null if no image exists for the card.
 */
export function getCardImageSrc(cardId: number): string | null {
  if (cardId < 0 || cardId > 77) return null;
  return `/images/cards/${String(cardId).padStart(2, "0")}.jpg`;
}
