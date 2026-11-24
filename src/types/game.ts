export type CardType = "1" | "2" | "3" | "4" | "4+" | "1 | 5" | "+" | "H" | string;

export interface HeatCard {
  id: string;
  type: CardType;
  faceUp: boolean;
}

export type PileName = "drawPile" | "heatPile" | "discardPile" | "hand" | "playPile";

export interface GameState {
  drawPile: HeatCard[];
  heatPile: HeatCard[];
  discardPile: HeatCard[];
  hand: HeatCard[];
  playPile: HeatCard[];
  isProcessing: boolean;
}

export type GameAction =
  | { type: "INITIALIZE_GAME" }
  | { type: "DRAW_CARDS" }
  | { type: "DRAW_ONE_CARD" }
  | { type: "PLAY_CARD_FROM_HAND"; payload: { cardId: string } }
  | { type: "UNPLAY_CARD_TO_HAND"; payload: { cardId: string } }
  | { type: "MOVE_CARD"; payload: { cardId: string; from: PileName; to: PileName } }
  | { type: "MOVE_HEAT_TO_DISCARD" }
  | { type: "RECYCLE_DISCARD_PILE" }
  | { type: "DRAW_ONE_TO_HAND" }
  | { type: "DISCARD_ALL_PLAYED" }
  | { type: "FINISH_PLAY_CARDS" }
  | { type: "SET_PROCESSING"; payload: boolean };
