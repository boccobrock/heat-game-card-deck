import React from "react";
import { HeatCard as HeatCardType } from "../types/game";
import { CardPile } from "./CardPile";

interface PlayAreaProps {
  cards: readonly HeatCardType[];
  onCardClick?: (cardId: string) => void;
  onCardDrop?: (cardId: string, fromPile: string) => void;
  disabled?: boolean;
}

export const PlayArea: React.FC<PlayAreaProps> = ({
  cards,
  onCardClick,
  onCardDrop,
  disabled = false,
}) => {
  return (
    <CardPile
      id="play"
      label="Play Area"
      cards={cards}
      layout="cascade"
      cascadeOffsetPx={36}
      cardInteractive={!disabled}
      cardDraggable={!disabled}
      droppable={!disabled}
      onCardClick={(card) => {
        if (!disabled && onCardClick) {
          onCardClick(card.id);
        }
      }}
      onCardDrop={(cardId, fromPile) => {
        if (!disabled && onCardDrop) {
          onCardDrop(cardId, fromPile);
        }
      }}
      title={disabled ? undefined : "Click card to return to Hand, or drop cards here"}
    />
  );
};
