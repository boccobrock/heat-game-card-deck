import React from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { CardPile } from "./components/CardPile";
import { Hand } from "./components/Hand";
import { PlayArea } from "./components/PlayArea";
import { ActionButtons } from "./components/ActionButtons";
import "./styles/theme.css";

const HeatGameBoard: React.FC = () => {
  const {
    state,
    playPileTotal,
    drawCards,
    drawOneCard,
    playCard,
    unplayCard,
    moveCard,
    moveHeatToDiscard,
    recycleDiscardPile,
    playCards,
    resetGame,
  } = useGame();

  const canDraw = state.hand.length < 7 && state.drawPile.length > 0;
  const canPlay = state.playPile.length > 0;

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>HEAT: PEDAL TO THE METAL</h1>
        <p>Deck & Engine Management</p>
      </header>

      {/* Main Top Row: Draw Pile, Heat Pile, Discard Pile */}
      <div id="mainRow">
        <CardPile
          id="drawPile"
          label="Draw Pile"
          cards={state.drawPile}
          layout="stack"
          clickable={canDraw && !state.isProcessing}
          onClick={() => {
            if (canDraw && !state.isProcessing) {
              drawOneCard();
            }
          }}
          title={canDraw ? "Click to draw 1 card" : "Hand full or draw pile empty"}
        />

        <CardPile
          id="heatPile"
          label="Engine Heat"
          cards={state.heatPile}
          layout="cascade"
          cascadeOffsetPx={30}
          clickable={state.heatPile.length > 0 && !state.isProcessing}
          cardDraggable={!state.isProcessing}
          onClick={() => {
            if (state.heatPile.length > 0 && !state.isProcessing) {
              moveHeatToDiscard();
            }
          }}
          title="Click or drag heat card to Discard to cool down engine"
        />

        <CardPile
          id="discardPile"
          label="Discard Pile"
          cards={state.discardPile}
          layout="stack"
          emptyIcon="🗑️"
          clickable={state.discardPile.length > 0 && !state.isProcessing}
          droppable={!state.isProcessing}
          onCardDrop={(cardId, fromPile) => {
            if (fromPile === "heatPile") {
              moveHeatToDiscard();
            } else if (fromPile === "hand" || fromPile === "play") {
              moveCard(
                cardId,
                fromPile as "hand" | "playPile",
                "discardPile"
              );
            }
          }}
          onClick={() => {
            if (state.discardPile.length > 0 && !state.isProcessing) {
              recycleDiscardPile();
            }
          }}
          title={
            state.discardPile.length > 0
              ? "Click to recycle discard pile into draw pile (shuffled)"
              : "Drop cards here or discard"
          }
        />
      </div>

      {/* Middle Row: Action Buttons */}
      <ActionButtons
        onDraw={drawCards}
        onPlay={playCards}
        playTotal={playPileTotal}
        canDraw={canDraw}
        canPlay={canPlay}
        isProcessing={state.isProcessing}
      />

      {/* Bottom Row: Player Hand and Play Area */}
      <div id="playerRow">
        <Hand
          cards={state.hand}
          onCardClick={playCard}
          onCardDrop={(cardId, fromPile) => {
            if (fromPile === "play") {
              unplayCard(cardId);
            }
          }}
          disabled={state.isProcessing}
        />

        <PlayArea
          cards={state.playPile}
          onCardClick={unplayCard}
          onCardDrop={(cardId, fromPile) => {
            if (fromPile === "hand") {
              playCard(cardId);
            }
          }}
          disabled={state.isProcessing}
        />
      </div>

      {/* Bottom utility controls */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button
          onClick={resetGame}
          disabled={state.isProcessing}
          style={{
            background: "transparent",
            color: "rgba(255, 255, 255, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <HeatGameBoard />
    </GameProvider>
  );
};

export default App;
