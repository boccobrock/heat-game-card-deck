import { GameState, HeatCard, PileName } from "../types/game";
import {
  INITIAL_HEAT_CARDS,
  INITIAL_HEAT_PILE_SIZE,
  MAX_HAND_SIZE,
} from "../constants/cards";

/**
 * Fisher-Yates array shuffle (pure)
 */
export function shuffleCards<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Create a fresh deck with unique IDs and faceUp false
 */
export function createInitialDeck(): HeatCard[] {
  return INITIAL_HEAT_CARDS.map((card, index) => ({
    id: `card-${index}-${card.type}`,
    type: card.type,
    faceUp: false,
  }));
}

/**
 * Calculate the total speed value of cards in the play pile
 */
export function calculatePlayPileTotal(playPile: readonly HeatCard[]): number {
  let total = 0;
  for (const card of playPile) {
    const parsed = parseInt(card.type, 10);
    if (!isNaN(parsed)) {
      total += parsed;
    } else if (card.type === "1 | 5") {
      // Default to 1 (matching original behavior)
      total += 1;
    }
  }
  return total;
}

/**
 * Initial game state setup:
 * 1. 24 cards created
 * 2. 6 dealt to heat pile and flipped face up
 * 3. Remaining 18 shuffled in draw pile
 * 4. 7 dealt from draw pile to player hand and flipped face up
 */
export function setupInitialGame(): GameState {
  const allCards = createInitialDeck();

  // 6 cards to heat pile
  const heatPileCards = allCards.slice(0, INITIAL_HEAT_PILE_SIZE).map((card) => ({
    ...card,
    faceUp: true,
  }));

  // Remaining cards shuffled
  const remainingCards = shuffleCards(allCards.slice(INITIAL_HEAT_PILE_SIZE));

  // 7 cards to hand
  const handCards = remainingCards.slice(0, MAX_HAND_SIZE).map((card) => ({
    ...card,
    faceUp: true,
  }));

  // Rest stay in draw pile (face down)
  const drawPileCards = remainingCards.slice(MAX_HAND_SIZE).map((card) => ({
    ...card,
    faceUp: false,
  }));

  return {
    drawPile: drawPileCards,
    heatPile: heatPileCards,
    discardPile: [],
    hand: handCards,
    playPile: [],
    isProcessing: false,
  };
}

/**
 * Draw cards from drawPile up to max hand size (7)
 */
export function drawCardsToLimit(state: GameState): GameState {
  const currentHandSize = state.hand.length;
  const cardsNeeded = Math.max(0, MAX_HAND_SIZE - currentHandSize);

  if (cardsNeeded <= 0 || state.drawPile.length === 0) {
    return state;
  }

  const drawCount = Math.min(cardsNeeded, state.drawPile.length);
  const drawnCards = state.drawPile.slice(0, drawCount).map((card) => ({
    ...card,
    faceUp: true,
  }));

  return {
    ...state,
    drawPile: state.drawPile.slice(drawCount),
    hand: [...state.hand, ...drawnCards],
  };
}

/**
 * Draw a single card from draw pile into hand (if hand < 7)
 */
export function drawOneCard(state: GameState): GameState {
  if (state.hand.length >= MAX_HAND_SIZE || state.drawPile.length === 0) {
    return state;
  }

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

/**
 * Play a specific card from hand into playPile
 */
export function playCardFromHand(state: GameState, cardId: string): GameState {
  const cardIndex = state.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return state;
  }

  const card = state.hand[cardIndex];
  const newHand = state.hand.filter((c) => c.id !== cardId);

  return {
    ...state,
    hand: newHand,
    playPile: [...state.playPile, { ...card, faceUp: true }],
  };
}

/**
 * Unplay/undo: return a card from playPile back to hand
 */
export function unplayCardToHand(state: GameState, cardId: string): GameState {
  const cardIndex = state.playPile.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return state;
  }

  const card = state.playPile[cardIndex];
  const newPlayPile = state.playPile.filter((c) => c.id !== cardId);

  return {
    ...state,
    playPile: newPlayPile,
    hand: [...state.hand, { ...card, faceUp: true }],
  };
}

/**
 * Move top card from heat pile to discard pile
 */
export function moveHeatToDiscard(state: GameState): GameState {
  if (state.heatPile.length === 0) {
    return state;
  }

  const topHeatCard = state.heatPile[state.heatPile.length - 1];
  const remainingHeat = state.heatPile.slice(0, -1);

  return {
    ...state,
    heatPile: remainingHeat,
    discardPile: [...state.discardPile, topHeatCard],
  };
}

/**
 * Recycle discard pile back into draw pile:
 * All cards become face-down, merged into drawPile, then shuffled
 */
export function recycleDiscardPile(state: GameState): GameState {
  if (state.discardPile.length === 0) {
    return state;
  }

  const recycledCards = state.discardPile.map((card) => ({
    ...card,
    faceUp: false,
  }));

  const combinedDrawPile = shuffleCards([...state.drawPile, ...recycledCards]);

  return {
    ...state,
    drawPile: combinedDrawPile,
    discardPile: [],
  };
}

/**
 * Finish resolving cards in playPile when no '+' cards remain:
 * - 'H' cards go to heat pile
 * - all other cards go to discard pile
 */
export function finishPlayCards(state: GameState): GameState {
  if (state.playPile.length === 0) {
    return { ...state, isProcessing: false };
  }

  const heatCards: HeatCard[] = [];
  const otherCards: HeatCard[] = [];

  for (const card of state.playPile) {
    if (card.type === "H") {
      heatCards.push({ ...card, faceUp: true });
    } else {
      otherCards.push(card);
    }
  }

  return {
    ...state,
    playPile: [],
    heatPile: [...state.heatPile, ...heatCards],
    discardPile: [...state.discardPile, ...otherCards],
    isProcessing: false,
  };
}

/**
 * Move all cards in playPile to discardPile (used after '+' card resolution)
 */
export function discardAllPlayed(state: GameState): GameState {
  if (state.playPile.length === 0) {
    return { ...state, isProcessing: false };
  }

  return {
    ...state,
    discardPile: [...state.discardPile, ...state.playPile],
    playPile: [],
    isProcessing: false,
  };
}

/**
 * Move a specific card between piles (for drag and drop)
 */
export function moveCardBetweenPiles(
  state: GameState,
  cardId: string,
  from: PileName,
  to: PileName
): GameState {
  if (from === to) return state;

  const sourceList = state[from];
  const card = sourceList.find((c) => c.id === cardId);
  if (!card) return state;

  const newSource = sourceList.filter((c) => c.id !== cardId);
  const updatedCard = {
    ...card,
    faceUp: to !== "drawPile", // face-down if moved to draw pile
  };

  const newDest = [...state[to], updatedCard];

  return {
    ...state,
    [from]: newSource,
    [to]: newDest,
  };
}
