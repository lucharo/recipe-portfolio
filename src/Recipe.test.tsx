import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import Recipe from "./Recipe";
import type { Recipe as RecipeT } from "./types";

const recipe: RecipeT = {
  name: "Test Risotto",
  source: "https://example.com/risotto",
  image: null,
  servings: 2,
  ingredients: [
    { name: "stock", quantity: 2, unit: "cups", steps: [1, 2, 3] },
  ],
  methods: ["Warm the stock.", "Add the rice.", "Finish the risotto."],
};

describe("Recipe Play Mode", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1000 });
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    act(() => root.render(<Recipe recipe={recipe} onBack={jest.fn()} />));
    const playButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "play mode"
    );
    if (!playButton) throw new Error("play mode button missing");
    act(() => playButton.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const activeStep = () =>
    container.querySelector<HTMLElement>('.rp-method[data-active="true"]')?.dataset.step;

  const pointerEvent = (type: string, clientX: number, clientY = 200) => {
    const event = new MouseEvent(type, { bubbles: true, clientX, clientY });
    Object.defineProperties(event, {
      isPrimary: { value: true },
      pointerId: { value: 1 },
    });
    return event;
  };

  const tapAt = (target: Element, clientX: number) => {
    act(() => {
      target.dispatchEvent(pointerEvent("pointerdown", clientX));
      target.dispatchEvent(pointerEvent("pointerup", clientX));
      target.dispatchEvent(
        new MouseEvent("click", { bubbles: true, clientX, clientY: 200, detail: 1 })
      );
    });
  };

  test("right-side taps advance and left-side taps go back", () => {
    const playSurface = container.querySelector(".rp-recipe-split");
    if (!playSurface) throw new Error("play surface missing");

    expect(activeStep()).toBe("1");
    tapAt(playSurface, 800);
    expect(activeStep()).toBe("2");
    tapAt(playSurface, 200);
    expect(activeStep()).toBe("1");
  });

  test("an ordinary method tap navigates by screen side instead of jumping", () => {
    const thirdStep = container.querySelector<HTMLElement>('.rp-method[data-step="3"]');
    if (!thirdStep) throw new Error("third step missing");

    expect(activeStep()).toBe("1");
    tapAt(thirdStep, 800);
    expect(activeStep()).toBe("2");
  });

  test("holding a method jumps directly to that step", () => {
    jest.useFakeTimers();
    const thirdStep = container.querySelector<HTMLElement>('.rp-method[data-step="3"]');
    if (!thirdStep) throw new Error("third step missing");

    try {
      act(() => thirdStep.dispatchEvent(pointerEvent("pointerdown", 800)));
      act(() => jest.advanceTimersByTime(600));
      expect(activeStep()).toBe("3");
      act(() => thirdStep.dispatchEvent(pointerEvent("pointerup", 800)));
    } finally {
      jest.useRealTimers();
    }
  });

  test("moving to scroll cancels a play-surface tap", () => {
    const playSurface = container.querySelector(".rp-recipe-split");
    if (!playSurface) throw new Error("play surface missing");

    act(() => {
      playSurface.dispatchEvent(pointerEvent("pointerdown", 800, 200));
      playSurface.dispatchEvent(pointerEvent("pointermove", 800, 240));
      playSurface.dispatchEvent(pointerEvent("pointerup", 800, 240));
    });
    expect(activeStep()).toBe("1");
  });

  test("moving off a method cancels its hold gesture", () => {
    jest.useFakeTimers();
    const thirdStep = container.querySelector<HTMLElement>('.rp-method[data-step="3"]');
    if (!thirdStep) throw new Error("third step missing");

    try {
      act(() => {
        thirdStep.dispatchEvent(pointerEvent("pointerdown", 800, 200));
        thirdStep.dispatchEvent(pointerEvent("pointermove", 800, 240));
      });
      act(() => jest.advanceTimersByTime(600));
      expect(activeStep()).toBe("1");
    } finally {
      jest.useRealTimers();
    }
  });

  test("Space on a focused navigation button activates that button only", () => {
    const nextButton = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("next")
    );
    const prevButton = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("prev")
    );
    if (!nextButton || !prevButton) throw new Error("play navigation buttons missing");

    act(() => nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(activeStep()).toBe("2");
    act(() => {
      prevButton.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: " ", code: "Space" })
      );
      prevButton.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
    });
    expect(activeStep()).toBe("1");
  });

  test("keyboard users can jump to a method and receive current-step semantics", () => {
    const thirdStep = container.querySelector<HTMLElement>('.rp-method[data-step="3"]');
    if (!thirdStep) throw new Error("third step missing");

    act(() =>
      thirdStep.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Enter", code: "Enter" })
      )
    );

    expect(activeStep()).toBe("3");
    expect(thirdStep).toHaveAttribute("aria-current", "step");
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent("Step 3 of 3");
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "3");
  });
});
