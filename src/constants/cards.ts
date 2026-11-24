import { CardType } from "../types/game";

export interface CardConfig {
  type: CardType;
}

export const INITIAL_HEAT_CARDS: CardConfig[] = [
  { type: "1" },
  { type: "1" },
  { type: "1" },
  { type: "2" },
  { type: "2" },
  { type: "2" },
  { type: "3" },
  { type: "3" },
  { type: "3" },
  { type: "4" },
  { type: "4" },
  { type: "4" },
  { type: "H" },
  { type: "4+" },
  { type: "1 | 5" },
  { type: "+" },
  { type: "+" },
  { type: "+" },
  { type: "H" },
  { type: "H" },
  { type: "H" },
  { type: "H" },
  { type: "H" },
  { type: "H" },
];

export const MAX_HAND_SIZE = 7;
export const INITIAL_HEAT_PILE_SIZE = 6;
