import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ActionButtons } from "./ActionButtons";

describe("<ActionButtons /> Component", () => {
  it("renders buttons with total and handles clicks", () => {
    const handleDraw = vi.fn();
    const handlePlay = vi.fn();

    render(
      <ActionButtons
        onDraw={handleDraw}
        onPlay={handlePlay}
        playTotal={7}
        canDraw={true}
        canPlay={true}
        isProcessing={false}
      />
    );

    const drawButton = screen.getByText("+ Draw Cards");
    const playButton = screen.getByText("Play Cards (Total: 7)");

    expect(drawButton).toBeDefined();
    expect(playButton).toBeDefined();

    fireEvent.click(drawButton);
    expect(handleDraw).toHaveBeenCalledTimes(1);

    fireEvent.click(playButton);
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when cannot draw or play, or when isProcessing", () => {
    render(
      <ActionButtons
        onDraw={vi.fn()}
        onPlay={vi.fn()}
        playTotal={0}
        canDraw={false}
        canPlay={false}
        isProcessing={true}
      />
    );

    const drawButton = screen.getByRole("button", { name: /\+ Draw Cards/i });
    const playButton = screen.getByRole("button", { name: /Resolving/i });

    expect((drawButton as HTMLButtonElement).disabled).toBe(true);
    expect((playButton as HTMLButtonElement).disabled).toBe(true);
  });
});
