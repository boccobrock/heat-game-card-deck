import { GameAction, GameState } from "../types/game";
import {
  discardAllPlayed,
  drawCardsToLimit,
  drawOneCard,
  finishPlayCards,
  moveCardBetweenPiles,
  moveHeatToDiscard,
  playCardFromHand,
  recycleDiscardPile,
  setupInitialGame,
  unplayCardToHand,
} from "../logic/gameLogic";

export const initialGameState: GameState = setupInitialGame();

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INITIALIZE_GAME":
      return setupInitialGame();

    case "DRAW_CARDS":
      return drawCardsToLimit(state);

    case "DRAW_ONE_CARD":
      return drawOneCard(state);

    case "PLAY_CARD_FROM_HAND":
      return playCardFromHand(state, action.payload.cardId);

    case "UNPLAY_CARD_TO_HAND":
      return unplayCardToHand(state, action.payload.cardId);

    case "MOVE_CARD": {
      const { cardId, from, to } = action.payload;
      return moveCardBetweenPiles(state, cardId, from, to);
    }

    case "MOVE_HEAT_TO_DISCARD":
      return moveHeatToDiscard(state);

    case "RECYCLE_DISCARD_PILE":
      return recycleDiscardPile(state);

    case "DRAW_ONE_TO_HAND": {
      if (state.drawPile.length === 0) return state;
      const topCard = {
        ...state.drawPile[0],
        faceUp: true,
      };
      return {
        ...state,
        drawPile: state.drawPile.slice(1),
        hand: [...state.hand, topCard],
      };
    }

    case "DISCARD_ALL_PLAYED":
      return discardAllPlayed(state);

    case "FINISH_PLAY_CARDS":
      return finishPlayCards(state);

    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.payload,
      };

    default:
      return state;
  }
}
