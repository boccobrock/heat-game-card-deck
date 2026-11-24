import React from "react";

interface ActionButtonsProps {
  onDraw: () => void;
  onPlay: () => void;
  playTotal: number;
  canDraw: boolean;
  canPlay: boolean;
  isProcessing: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDraw,
  onPlay,
  playTotal,
  canDraw,
  canPlay,
  isProcessing,
}) => {
  return (
    <div id="buttonRow">
      <button
        id="drawButton"
        onClick={onDraw}
        disabled={!canDraw || isProcessing}
        title="Draw cards until your hand has 7 cards"
      >
        <span className="button-text">+ Draw Cards</span>
      </button>

      <button
        id="playCardsButton"
        onClick={onPlay}
        disabled={!canPlay || isProcessing}
        title="Play cards and resolve speed/effects"
      >
        <span className="button-text">
          {isProcessing ? "Resolving..." : `Play Cards (Total: ${playTotal})`}
        </span>
      </button>
    </div>
  );
};
