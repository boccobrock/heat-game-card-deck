import React, { useState } from "react";
import { HeatCard as HeatCardType } from "../types/game";
import { HeatCard } from "./HeatCard";

interface CardPileProps {
  id: string;
  label: string;
  cards: readonly HeatCardType[];
  layout?: "stack" | "cascade";
  cascadeOffsetPx?: number;
  emptyIcon?: string;
  onClick?: () => void;
  onCardClick?: (card: HeatCardType, index: number) => void;
  clickable?: boolean;
  cardInteractive?: boolean;
  cardDraggable?: boolean;
  droppable?: boolean;
  onCardDrop?: (cardId: string, fromPile: string) => void;
  style?: React.CSSProperties;
  badge?: string | number;
  title?: string;
}

export const CardPile: React.FC<CardPileProps> = ({
  id,
  label,
  cards,
  layout = "stack",
  cascadeOffsetPx = 36,
  emptyIcon,
  onClick,
  onCardClick,
  clickable = false,
  cardInteractive = false,
  cardDraggable = false,
  droppable = false,
  onCardDrop,
  style,
  badge = cards.length,
  title,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (!droppable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the deck-base itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!droppable) return;
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = e.dataTransfer.getData("application/json");
      if (data) {
        const { cardId, fromPile } = JSON.parse(data);
        if (cardId && onCardDrop) {
          onCardDrop(cardId, fromPile);
        }
      }
    } catch (err) {
      console.error("Failed to parse drop data", err);
    }
  };

  return (
    <div id={id} className="pile-section">
      <div className="pile-label">
        <span>{label}</span>
        <span className="pile-badge">{badge}</span>
      </div>

      <div
        className={`deck-base ${clickable ? "clickable" : ""} ${
          isDragOver ? "drag-over" : ""
        }`}
        onClick={onClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={style}
        title={title}
      >
        {cards.length === 0 && emptyIcon && (
          <div className="discard-empty-icon">{emptyIcon}</div>
        )}

        {cards.map((card, index) => {
          let cardStyle: React.CSSProperties = {
            zIndex: index,
          };

          if (layout === "cascade") {
            cardStyle = {
              ...cardStyle,
              left: `${index * cascadeOffsetPx}px`,
              top: "0px",
            };
          } else {
            // Stack layout with subtle offset for depth
            cardStyle = {
              ...cardStyle,
              left: `${Math.min(index * 0.5, 6)}px`,
              top: `${Math.min(index * 0.5, 6)}px`,
            };
          }

          return (
            <HeatCard
              key={card.id}
              card={card}
              fromPile={id}
              interactive={cardInteractive}
              draggable={cardDraggable}
              onClick={onCardClick ? () => onCardClick(card, index) : undefined}
              style={cardStyle}
            />
          );
        })}
      </div>
    </div>
  );
};
