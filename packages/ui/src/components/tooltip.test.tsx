// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it } from "vitest";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

beforeAll(() => {
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(cleanup);

it("works without a provider at the root and describes its trigger while open", () => {
  render(<Tooltip open>
    <TooltipTrigger aria-label="Akcje kursu">…</TooltipTrigger>
    <TooltipContent>Popraw, anuluj albo usuń kurs</TooltipContent>
  </Tooltip>);
  const tip = screen.getByRole("tooltip");
  expect(tip.textContent).toBe("Popraw, anuluj albo usuń kurs");
  expect(screen.getByRole("button", { name: "Akcje kursu" }).getAttribute("aria-describedby")).toBe(tip.id);
});
