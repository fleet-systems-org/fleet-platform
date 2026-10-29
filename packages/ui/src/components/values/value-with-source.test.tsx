// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it } from "vitest";
import { ValueWithSource, type ValueLabels } from "./value-with-source";

beforeAll(() => {
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(cleanup);

const labels: ValueLabels = {
  evidence: { plan: "Plan", estimated: "Szacunek", missing: "Brak danych", conflicting: "Sprzeczne dane" }, certain: "Pewne", missing: "brak", details: "Szczegóły",
  exactValue: "Dokładna wartość", certainty: "Pewność", source: "Źródło", sourceDate: "Data źródła", reason: "Powód",
};
const nbsp = " ";

it("shows a certain value without a badge and its exact value with the source in the details (EV-4)", () => {
  render(<ValueWithSource state="known" label="Cena paliwa w Polsce" labels={labels} value="1.401250" unit="EUR/l"
    certainty="certain" source={{ name: "Karty paliwowe, potwierdzone fakturą", date: "27.10.2026" }} />);
  const trigger = screen.getByRole("button", { name: `1,401250${nbsp}EUR/l` });
  expect(trigger.dataset.size).toBe("default");
  expect(screen.queryByText("Szacunek")).toBeNull();
  fireEvent.click(trigger);
  const details = screen.getByRole("dialog", { name: "Szczegóły: Cena paliwa w Polsce" });
  expect(details.textContent).toBe(`Dokładna wartość1,401250${nbsp}EUR/lPewnośćPewneŹródłoKarty paliwowe, potwierdzone fakturąData źródła27.10.2026`);
});

it("shows routed kilometres as a whole-number estimate and the exact value in the details (R11, owner decision)", () => {
  render(<ValueWithSource state="known" label="Dystans kursu" labels={labels} value="1234.567" unit="km" displayScale={0}
    certainty="estimated" source={{ name: "Trasa od dostawcy map", date: "28.10.2026" }} reason="Kilometry z planowanej trasy dostawcy map, nie z przejazdu." />);
  fireEvent.click(screen.getByRole("button", { name: `1${nbsp}235${nbsp}km Szacunek` }));
  expect(screen.getByRole("dialog", { name: "Szczegóły: Dystans kursu" }).textContent).toContain(`Dokładna wartość1${nbsp}234,567${nbsp}kmPewnośćSzacunek`);
});

it("marks an estimate with a word on screen and gives the reason in the details", () => {
  render(<ValueWithSource state="known" label="Cena paliwa" labels={labels} value="1.512340" unit="EUR/l" size="compact"
    certainty="estimated" source={{ name: "Tygodniowy biuletyn cen paliw", date: "27.10.2026" }} reason="Brak tankowań w tym kraju z ostatnich 14 dni" />);
  const trigger = screen.getByRole("button", { name: `1,512340${nbsp}EUR/l Szacunek` });
  expect(trigger.dataset.size).toBe("compact");
  fireEvent.click(trigger);
  const details = screen.getByRole("dialog", { name: "Szczegóły: Cena paliwa" });
  expect(details.textContent).toContain("PewnośćSzacunek");
  expect(details.textContent).toContain("PowódBrak tankowań w tym kraju z ostatnich 14 dni");
});

it("shows a missing value as a dash and the reason, never as zero", () => {
  const { container } = render(<ValueWithSource state="missing" label="Cena paliwa" labels={labels} reason="cena paliwa dla Niemiec" />);
  expect(container.textContent).toBe("— brak: cena paliwa dla Niemiec");
  expect(container.textContent).not.toContain("0");
  expect(screen.queryByRole("button")).toBeNull();
});

it("shows a conflict in words and lists every candidate with its source", () => {
  render(<ValueWithSource state="conflicting" label="Cena paliwa" labels={labels} unit="EUR/l" candidates={[
    { value: "1.498000", source: { name: "Źródło A", date: "27.10.2026" } },
    { value: "1.512000", source: { name: "Źródło B", date: "27.10.2026" } },
  ]} />);
  fireEvent.click(screen.getByRole("button", { name: "Sprzeczne dane" }));
  const details = screen.getByRole("dialog", { name: "Szczegóły: Cena paliwa" });
  expect(details.textContent).toBe(`Źródło A, 27.10.20261,498000${nbsp}EUR/lŹródło B, 27.10.20261,512000${nbsp}EUR/l`);
});
