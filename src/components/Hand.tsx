import React from "react";
import { HeatCard as HeatCardType } from "../types/game";
import { CardPile } from "./CardPile";

interface HandProps {
  cards: readonly HeatCardType[];
  onCardClick: (cardId: string) => void;
  onCardDrop?: (cardId: string, fromPile: string) => void;
  disabled?: boolean;
}

export const Hand: React.FC<HandProps> = ({
  cards,
  onCardClick,
  onCardDrop,
  disabled = false,
}) => {
  return (
    <CardPile
      id="hand"
      label="Hand"
      cards={cards}
      layout="cascade"
      cascadeOffsetPx={38}
      cardInteractive={!disabled}
      cardDraggable={!disabled}
      droppable={!disabled}
      onCardClick={(card) => {
        if (!disabled) {
          onCardClick(card.id);
        }
      }}
      onCardDrop={(cardId, fromPile) => {
        if (!disabled && onCardDrop) {
          onCardDrop(cardId, fromPile);
        }
      }}
      title={disabled ? undefined : "Click or drag card to Play Area"}
    />
  );
};
