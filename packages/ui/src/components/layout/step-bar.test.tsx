// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { StepBar } from "./step-bar";

afterEach(cleanup);

const steps = ["Auto", "Miejsca i czasy", "Fracht i mycie", "Wycena"];

it("marks completed, current and later steps and colours the line after a completed step (R18.2)", () => {
  render(<StepBar label="Postęp wyceny" steps={steps} current={2} doneText="gotowe" className="extra" />);
  const list = screen.getByRole("list", { name: "Postęp wyceny" });
  expect(list.className).toContain("extra");
  const rows = screen.getAllByRole("listitem");
  expect(rows.map(row => [row.textContent, row.getAttribute("data-state"), row.getAttribute("aria-current")])).toEqual([
    ["Auto — gotowe", "done", null],
    ["Miejsca i czasy — gotowe", "done", null],
    ["3Fracht i mycie", "current", "step"],
    ["4Wycena", "waiting", null],
  ]);
  // A completed step shows a check instead of its number; the marker is hidden from screen readers.
  expect(rows[0]!.querySelector("svg")).not.toBeNull();
  expect(rows[0]!.firstElementChild!.getAttribute("aria-hidden")).toBe("true");
  const lines = rows.map(row => [...row.firstElementChild!.children].filter((_, index) => index !== 1).map(line => line.className.match(/border-(transparent|action|divider)/)![1]));
  expect(lines).toEqual([
    ["transparent", "action"],
    ["action", "action"],
    ["action", "divider"],
    ["divider", "transparent"],
  ]);
  expect(rows[3]!.className).toContain("text-muted");
});
