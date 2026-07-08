declare module "tarot-card-meanings" {
  interface NpmCard {
    number: number;
    name: string;
    element: string;
    planet: string;
    upright: string;
    reversed: string;
    love: string;
    career: string;
    yesNo: string;
    keywords: string[];
  }

  export const majorArcana: NpmCard[];

  export function getAllCards(): NpmCard[];
  export function getMajorArcana(): NpmCard[];
  export function getCard(name: string): NpmCard | null;
  export function getRandomCard(): NpmCard;
  export function getYesOrNo(): { card: string; answer: string; meaning: string };
  export function getYesCards(): NpmCard[];
  export function getNoCards(): NpmCard[];
}
