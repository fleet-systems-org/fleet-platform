// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it } from "vitest";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

beforeAll(() => {
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(cleanup);

it("shows value details in a measured panel and closes with Escape", () => {
  render(<Popover>
    <PopoverTrigger>1 235 km</PopoverTrigger>
    <PopoverContent aria-label="Szczegóły wartości"><p>Dokładnie 1 234,567 km</p></PopoverContent>
  </Popover>);
  const trigger = screen.getByRole("button", { name: "1 235 km" });
  fireEvent.click(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  const panel = screen.getByRole("dialog", { name: "Szczegóły wartości" });
  expect(panel.className).toContain("shadow-overlay");
  expect(screen.getByText("Dokładnie 1 234,567 km").parentElement!.className).toBe("max-w-measure");
  fireEvent.keyDown(panel, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
});
