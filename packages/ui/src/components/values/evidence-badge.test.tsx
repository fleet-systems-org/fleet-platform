// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { EvidenceBadge, type EvidenceBadgeLabels } from "./evidence-badge";

afterEach(cleanup);

const labels: EvidenceBadgeLabels = { plan: "Plan", estimated: "Szacunek", missing: "Brak danych", conflicting: "Sprzeczne dane" };
const words = (element: HTMLElement) => [...element.querySelectorAll("[data-slot=badge]")].map(badge => [badge.textContent, badge.getAttribute("data-variant"), !!badge.querySelector("svg")]);

it("shows nothing for a certain known value or an actual phase (P4)", () => {
  const { container } = render(<>
    <EvidenceBadge labels={labels} />
    <EvidenceBadge certainty="certain" phase="actual" labels={labels} />
  </>);
  expect(container.innerHTML).toBe("");
});

it("names an estimate, the plan phase, and a missing or conflicting state in words", () => {
  const { container } = render(<>
    <EvidenceBadge phase="plan" certainty="estimated" labels={labels} className="extra" />
    <EvidenceBadge state="missing" certainty="estimated" labels={labels} />
    <EvidenceBadge state="conflicting" labels={labels} />
  </>);
  const [both, missing, conflicting] = [...container.querySelectorAll<HTMLElement>("[data-slot=evidence-badge]")];
  expect(both!.className).toContain("extra");
  expect(words(both!)).toEqual([["Plan", "neutral", false], ["Szacunek", "estimate", false]]);
  // Certainty belongs to known values only, so a missing value is not also called an estimate.
  expect(words(missing!)).toEqual([["Brak danych", "neutral", true]]);
  expect(words(conflicting!)).toEqual([["Sprzeczne dane", "neutral", true]]);
  expect(container.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
});
