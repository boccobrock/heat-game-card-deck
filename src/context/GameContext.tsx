import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { GameAction, GameState, PileName } from "../types/game";
import { gameReducer, initialGameState } from "./gameReducer";
import { calculatePlayPileTotal } from "../logic/gameLogic";

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  playPileTotal: number;
  drawCards: () => Promise<void>;
  drawOneCard: () => void;
  playCard: (cardId: string) => void;
  unplayCard: (cardId: string) => void;
  moveCard: (cardId: string, from: PileName, to: PileName) => void;
  moveHeatToDiscard: () => void;
  recycleDiscardPile: () => void;
  playCards: () => Promise<void>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Keep a mutable ref to latest state for asynchronous action sequences
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const playPileTotal = useMemo(() => {
    return calculatePlayPileTotal(state.playPile);
  }, [state.playPile]);

  /**
   * Draw cards up to 7 with 100ms stagger between each card (matching original deal delay)
   */
  const drawCards = useCallback(async () => {
    const currentState = stateRef.current;
    if (currentState.isProcessing) return;

    const cardsNeeded = Math.max(0, 7 - currentState.hand.length);
    if (cardsNeeded <= 0 || currentState.drawPile.length === 0) return;

    dispatch({ type: "SET_PROCESSING", payload: true });

    const totalToDraw = Math.min(cardsNeeded, currentState.drawPile.length);
    for (let i = 0; i < totalToDraw; i++) {
      const fresh = stateRef.current;
      if (fresh.drawPile.length === 0 || fresh.hand.length >= 7) break;

      dispatch({ type: "DRAW_ONE_CARD" });

      if (i < totalToDraw - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    dispatch({ type: "SET_PROCESSING", payload: false });
  }, []);

  const drawOneCard = useCallback(() => {
    dispatch({ type: "DRAW_ONE_CARD" });
  }, []);

  const playCard = useCallback((cardId: string) => {
    dispatch({ type: "PLAY_CARD_FROM_HAND", payload: { cardId } });
  }, []);

  const unplayCard = useCallback((cardId: string) => {
    dispatch({ type: "UNPLAY_CARD_TO_HAND", payload: { cardId } });
  }, []);

  const moveCard = useCallback((cardId: string, from: PileName, to: PileName) => {
    dispatch({ type: "MOVE_CARD", payload: { cardId, from, to } });
  }, []);

  const moveHeatToDiscardAction = useCallback(() => {
    dispatch({ type: "MOVE_HEAT_TO_DISCARD" });
  }, []);

  const recycleDiscardPileAction = useCallback(() => {
    dispatch({ type: "RECYCLE_DISCARD_PILE" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "INITIALIZE_GAME" });
  }, []);

  /**
   * Resolves playCards button action:
   * 1. If '+' cards exist in play pile:
   *    For each '+' card:
   *      Draw 1 card from deck into hand
   *      Wait 1 second so player sees the card in hand
   *      If drawn card is 1-4, move from hand to play pile (updates total)
   *      Else, move from hand to discard pile
   *    Wait 800ms
   *    Move all cards from play pile to discard pile
   * 2. If no '+' cards:
   *    Move 'H' cards to heat pile, others to discard pile
   */
  const playCards = useCallback(async () => {
    const currentState = stateRef.current;
    if (currentState.isProcessing || currentState.playPile.length === 0) return;

    dispatch({ type: "SET_PROCESSING", payload: true });

    const plusCards = currentState.playPile.filter((c) => c.type === "+");

    if (plusCards.length > 0) {
      for (let i = 0; i < plusCards.length; i++) {
        const freshState = stateRef.current;
        if (freshState.drawPile.length === 0) break;

        const drawnCard = freshState.drawPile[0];

        // Draw card into hand
        dispatch({ type: "DRAW_ONE_TO_HAND" });

        // Wait 1 second (matching original timeout)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const isSpeedNumber = ["1", "2", "3", "4"].includes(drawnCard.type);

        if (isSpeedNumber) {
          // Put in play pile (which also recalculates play total)
          dispatch({
            type: "PLAY_CARD_FROM_HAND",
            payload: { cardId: drawnCard.id },
          });
        } else {
          // Put in discard pile
          dispatch({
            type: "MOVE_CARD",
            payload: { cardId: drawnCard.id, from: "hand", to: "discardPile" },
          });
        }
      }

      // Allow player to see final play area state briefly
      await new Promise((resolve) => setTimeout(resolve, 800));

      // After all '+' cards are resolved, move all cards from play pile to discard pile
      dispatch({ type: "DISCARD_ALL_PLAYED" });
    } else {
      // No '+' cards: heat cards go to heat pile, others go to discard pile
      dispatch({ type: "FINISH_PLAY_CARDS" });
    }
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      dispatch,
      playPileTotal,
      drawCards,
      drawOneCard,
      playCard,
      unplayCard,
      moveCard,
      moveHeatToDiscard: moveHeatToDiscardAction,
      recycleDiscardPile: recycleDiscardPileAction,
      playCards,
      resetGame,
    }),
    [
      state,
      playPileTotal,
      drawCards,
      drawOneCard,
      playCard,
      unplayCard,
      moveCard,
      moveHeatToDiscardAction,
      recycleDiscardPileAction,
      playCards,
      resetGame,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
