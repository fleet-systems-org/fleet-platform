// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it } from "vitest";
import { Field } from "./field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./select";

beforeAll(() => {
  // jsdom has no layout APIs; Radix Select measures its content when open.
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
  Element.prototype.scrollIntoView ??= () => {};
  Element.prototype.hasPointerCapture ??= () => false;
});
afterEach(cleanup);

it("takes its name, description, invalid and required state from the Field", () => {
  render(<Field label="Waluta frachtu" hint="Waluta z umowy z klientem" error="Wybierz walutę z listy." required>
    <Select><SelectTrigger><SelectValue placeholder="Wybierz walutę" /></SelectTrigger><SelectContent><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select>
  </Field>);
  const trigger = screen.getByRole("combobox", { name: "Waluta frachtu" });
  expect(trigger.getAttribute("aria-required")).toBe("true");
  expect(trigger.getAttribute("aria-invalid")).toBe("true");
  expect(trigger.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)!.textContent)).toEqual(["Waluta z umowy z klientem", "Wybierz walutę z listy."]);
  expect(trigger.dataset.size).toBe("default");
  expect(trigger.textContent).toBe("Wybierz walutę");
});

it("renders the open list with groups, a separator and the chosen option in a compact trigger", () => {
  render(<Select open value="PLN">
    <SelectTrigger size="compact" aria-label="Waluta"><SelectValue /></SelectTrigger>
    <SelectContent>
      <SelectGroup><SelectLabel>Najczęstsze</SelectLabel><SelectItem value="EUR">EUR</SelectItem></SelectGroup>
      <SelectSeparator />
      <SelectItem value="PLN">PLN</SelectItem>
    </SelectContent>
  </Select>);
  const trigger = screen.getByRole("combobox", { name: "Waluta", hidden: true });
  expect(trigger.dataset.size).toBe("compact");
  expect(trigger.hasAttribute("aria-required")).toBe(false);
  expect(screen.getByRole("listbox")).toBeTruthy();
  expect(screen.getByText("Najczęstsze")).toBeTruthy();
  // Radix marks the chosen option with data-state; aria-selected follows the highlighted option.
  expect(screen.getByRole("option", { name: "PLN" }).dataset.state).toBe("checked");
  expect(screen.getByRole("option", { name: "EUR" }).dataset.state).toBe("unchecked");
});
