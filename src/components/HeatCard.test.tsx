import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HeatCard } from "./HeatCard";

describe("<HeatCard /> Component", () => {
  it("renders front face with correct type label and classes", () => {
    render(
      <HeatCard
        card={{ id: "c1", type: "3", faceUp: true }}
      />
    );

    const typeElement = screen.getByText("3");
    expect(typeElement).toBeDefined();

    const frontFace = typeElement.closest(".heat-card-front");
    expect(frontFace?.classList.contains("heat-card-speed")).toBe(true);
  });

  it("applies heat-card-heat class for 'H' card type", () => {
    render(
      <HeatCard
        card={{ id: "h1", type: "H", faceUp: true }}
      />
    );

    const frontFace = screen.getByText("H").closest(".heat-card-front");
    expect(frontFace?.classList.contains("heat-card-heat")).toBe(true);
  });

  it("applies heat-card-plus class for '+' card type", () => {
    render(
      <HeatCard
        card={{ id: "p1", type: "+", faceUp: true }}
      />
    );

    const frontFace = screen.getByText("+").closest(".heat-card-front");
    expect(frontFace?.classList.contains("heat-card-plus")).toBe(true);
  });

  it("calls onClick when interactive and clicked", () => {
    const handleClick = vi.fn();
    const card = { id: "c1", type: "2", faceUp: true };

    render(
      <HeatCard
        card={card}
        interactive={true}
        onClick={handleClick}
      />
    );

    const cardContainer = screen.getByRole("button");
    fireEvent.click(cardContainer);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(card);
  });

  it("renders with flipped class when faceUp is false", () => {
    const { container } = render(
      <HeatCard
        card={{ id: "c1", type: "2", faceUp: false }}
      />
    );

    const inner = container.querySelector(".card-inner");
    expect(inner?.classList.contains("flipped")).toBe(true);
  });
});
