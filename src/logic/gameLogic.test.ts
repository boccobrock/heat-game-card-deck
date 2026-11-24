import { describe, it, expect } from "vitest";
import {
  calculatePlayPileTotal,
  createInitialDeck,
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
} from "./gameLogic";
import { gameReducer } from "../context/gameReducer";

describe("Game Logic - Pure Functions", () => {
  it("initializes a standard 24-card deck", () => {
    const deck = createInitialDeck();
    expect(deck).toHaveLength(24);
    expect(deck.every((c) => !c.faceUp)).toBe(true);
  });

  it("sets up initial game state with 6 heat, 7 hand, and 11 draw cards", () => {
    const state = setupInitialGame();
    expect(state.heatPile).toHaveLength(6);
    expect(state.heatPile.every((c) => c.faceUp)).toBe(true);
    expect(state.hand).toHaveLength(7);
    expect(state.hand.every((c) => c.faceUp)).toBe(true);
    expect(state.drawPile).toHaveLength(11);
    expect(state.drawPile.every((c) => !c.faceUp)).toBe(true);
    expect(state.discardPile).toHaveLength(0);
    expect(state.playPile).toHaveLength(0);
  });

  it("calculates play pile total correctly including '1 | 5' and special cards", () => {
    const total = calculatePlayPileTotal([
      { id: "1", type: "1", faceUp: true },
      { id: "2", type: "3", faceUp: true },
      { id: "3", type: "4", faceUp: true },
      { id: "4", type: "1 | 5", faceUp: true },
      { id: "5", type: "+", faceUp: true },
      { id: "6", type: "H", faceUp: true },
    ]);
    // 1 + 3 + 4 + 1 = 9
    expect(total).toBe(9);
  });

  it("plays a card from hand to play pile", () => {
    const state = setupInitialGame();
    const cardId = state.hand[0].id;
    const next = playCardFromHand(state, cardId);

    expect(next.hand).toHaveLength(6);
    expect(next.playPile).toHaveLength(1);
    expect(next.playPile[0].id).toBe(cardId);
    expect(next.playPile[0].faceUp).toBe(true);
  });

  it("unplays (undoes) a card from play pile back to hand", () => {
    const state = setupInitialGame();
    const cardId = state.hand[0].id;
    const played = playCardFromHand(state, cardId);
    const unplayed = unplayCardToHand(played, cardId);

    expect(unplayed.hand).toHaveLength(7);
    expect(unplayed.playPile).toHaveLength(0);
    expect(unplayed.hand[unplayed.hand.length - 1].id).toBe(cardId);
  });

  it("draws cards up to hand limit (7)", () => {
    const state = setupInitialGame();
    // Play 3 cards
    let current = playCardFromHand(state, state.hand[0].id);
    current = playCardFromHand(current, current.hand[0].id);
    current = playCardFromHand(current, current.hand[0].id);
    expect(current.hand).toHaveLength(4);

    const refilled = drawCardsToLimit(current);
    expect(refilled.hand).toHaveLength(7);
    expect(refilled.drawPile).toHaveLength(state.drawPile.length - 3);
  });

  it("moves heat card to discard", () => {
    const state = setupInitialGame();
    const next = moveHeatToDiscard(state);
    expect(next.heatPile).toHaveLength(5);
    expect(next.discardPile).toHaveLength(1);
  });

  it("recycles discard pile into draw pile face down and shuffled", () => {
    const state = setupInitialGame();
    const withDiscard = moveHeatToDiscard(state);
    const recycled = recycleDiscardPile(withDiscard);

    expect(recycled.discardPile).toHaveLength(0);
    expect(recycled.drawPile).toHaveLength(state.drawPile.length + 1);
    expect(recycled.drawPile.every((c) => !c.faceUp)).toBe(true);
  });

  it("finishes play cards by routing 'H' cards to heat and others to discard", () => {
    const state = setupInitialGame();
    const withPlayed = {
      ...state,
      playPile: [
        { id: "h1", type: "H", faceUp: true },
        { id: "s1", type: "2", faceUp: true },
        { id: "s2", type: "4", faceUp: true },
      ],
    };

    const finished = finishPlayCards(withPlayed);
    expect(finished.playPile).toHaveLength(0);
    expect(finished.heatPile).toHaveLength(state.heatPile.length + 1);
    expect(finished.discardPile).toHaveLength(2);
  });

  it("moves cards between arbitrary piles for drag and drop", () => {
    const state = setupInitialGame();
    const card = state.hand[0];
    const moved = moveCardBetweenPiles(state, card.id, "hand", "discardPile");

    expect(moved.hand).toHaveLength(6);
    expect(moved.discardPile).toHaveLength(1);
    expect(moved.discardPile[0].id).toBe(card.id);
  });
});

describe("Game Reducer Integration", () => {
  it("processes game actions predictably", () => {
    let state = setupInitialGame();

    // Draw one card action
    const cardId = state.hand[0].id;
    state = gameReducer(state, {
      type: "PLAY_CARD_FROM_HAND",
      payload: { cardId },
    });
    expect(state.hand).toHaveLength(6);
    expect(state.playPile).toHaveLength(1);

    state = gameReducer(state, { type: "DRAW_ONE_CARD" });
    expect(state.hand).toHaveLength(7);

    state = gameReducer(state, { type: "DISCARD_ALL_PLAYED" });
    expect(state.playPile).toHaveLength(0);
    expect(state.discardPile).toHaveLength(1);
  });
});
