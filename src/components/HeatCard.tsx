import React, { useState } from "react";
import { HeatCard as HeatCardType } from "../types/game";

interface HeatCardProps {
  card: HeatCardType;
  faceUp?: boolean;
  onClick?: (card: HeatCardType) => void;
  interactive?: boolean;
  draggable?: boolean;
  fromPile?: string;
  onDragStart?: (card: HeatCardType, fromPile?: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const HeatCard: React.FC<HeatCardProps> = ({
  card,
  faceUp = card.faceUp,
  onClick,
  interactive = false,
  draggable = false,
  fromPile,
  onDragStart,
  style,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const isPlus = card.type === "+";
  const isHeat = card.type === "H";
  const typeClass = isHeat
    ? "heat-card-heat"
    : isPlus
    ? "heat-card-plus"
    : "heat-card-speed";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick(card);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ cardId: card.id, fromPile })
    );
    if (onDragStart) {
      onDragStart(card, fromPile);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`card-container ${interactive ? "interactive" : ""} ${
        isDragging ? "card-dragging" : ""
      } ${className}`}
      style={style}
      onClick={handleClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`card-inner ${faceUp ? "" : "flipped"}`}>
        {/* Front Face */}
        <div className={`card-front card-shadow heat-card-front ${typeClass}`}>
          <span className="card-number">{card.type}</span>
        </div>

        {/* Back Face */}
        <div className="card-back card-shadow" />
      </div>
    </div>
  );
};
