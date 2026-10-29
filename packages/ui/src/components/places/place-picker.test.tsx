// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Field } from "../field";
import { PlacePicker, type PlaceOption, type PlacePickerLabels, type PlaceSearchStatus } from "./place-picker";

afterEach(cleanup);

const labels: PlacePickerLabels = {
  kinds: { place: "Zapisane miejsce", address: "Adres", town: "Tylko miasto" },
  needsConfirmation: "Do potwierdzenia",
  noCountry: "kraj niepotwierdzony",
  typedAs: "wpisano",
  searching: "Szukam…",
  notFound: "Nie znaleziono miejsca.",
  unavailable: "Wyszukiwanie adresów jest niedostępne. Wybierz zapisane miejsce.",
  results: count => `Wyniki: ${count}`,
  addPlace: "Dodaj miejsce…",
};
const a: PlaceOption = { id: "a", kind: "place", name: "Miejsce A", detail: "ul. Przykładowa 1", country: "PL" };
const b: PlaceOption = { id: "b", kind: "address", name: "Miejsce B", detail: "Beispielstraße 2", country: "DE", typedAs: "Miejsce-B" };
const d: PlaceOption = { id: "d", kind: "town", name: "Miasto D", detail: "Region Północ", needsConfirmation: true };

function picker(status: PlaceSearchStatus, options: PlaceOption[], extra: Partial<React.ComponentProps<typeof PlacePicker>> = {}) {
  const onSelect = vi.fn();
  const onQueryChange = vi.fn();
  const view = render(<Field label="Miejsce załadunku" hint="Adres albo miasto" required>
    <PlacePicker status={status} options={options} labels={labels} onSelect={onSelect} onQueryChange={onQueryChange} {...extra} />
  </Field>);
  const box = screen.getByRole("combobox", { name: "Miejsce załadunku" }) as HTMLInputElement;
  return { onSelect, onQueryChange, box, view };
}
const visibleOptions = () => screen.queryAllByRole("option").map(option => option.textContent);

it("is a combobox named by the Field that lists saved places when focused", () => {
  const { box } = picker("idle", [a, d]);
  expect(box.getAttribute("aria-autocomplete")).toBe("list");
  expect(box.getAttribute("aria-expanded")).toBe("false");
  expect(box.required).toBe(true);
  fireEvent.focus(box);
  expect(box.getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByRole("listbox", { name: "Miejsce załadunku" }).id).toBe(box.getAttribute("aria-controls"));
  expect(visibleOptions()).toEqual([
    "Miejsce AZapisane miejsce · ul. Przykładowa 1 · PL",
    "Miasto DDo potwierdzeniaTylko miasto · Region Północ · kraj niepotwierdzony",
  ]);
  fireEvent.blur(box);
  expect(box.getAttribute("aria-expanded")).toBe("false");
});

it("stays closed with nothing to show", () => {
  const { box } = picker("idle", []);
  fireEvent.focus(box);
  expect(box.getAttribute("aria-expanded")).toBe("false");
});

it("chooses with the keyboard, wrapping around, and says whether the choice is an address or a town", () => {
  const { box, onSelect } = picker("results", [a, b, d]);
  fireEvent.keyDown(box, { key: "Enter" });
  expect(onSelect).not.toHaveBeenCalled();
  fireEvent.keyDown(box, { key: "ArrowUp" });
  expect(box.getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[2]!.id);
  fireEvent.keyDown(box, { key: "ArrowDown" });
  expect(box.getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[0]!.id);
  fireEvent.keyDown(box, { key: "ArrowDown" });
  fireEvent.keyDown(box, { key: "ArrowUp" });
  fireEvent.keyDown(box, { key: "ArrowUp" });
  expect(box.getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[2]!.id);
  fireEvent.keyDown(box, { key: "Enter" });
  expect(onSelect).toHaveBeenLastCalledWith(d);
  expect(box.value).toBe("Miasto D");
  expect(box.getAttribute("aria-expanded")).toBe("false");
  expect(screen.getByText("Tylko miasto · Region Północ · kraj niepotwierdzony", { selector: "[data-slot=place-picker-chosen]" })).toBeTruthy();
  expect(box.getAttribute("aria-describedby")).toContain(document.querySelector("[data-slot=place-picker-chosen]")!.id);
  // Reopened, the chosen option is marked selected.
  fireEvent.keyDown(box, { key: "ArrowDown" });
  expect(screen.getAllByRole("option")[2]!.getAttribute("aria-selected")).toBe("true");
  fireEvent.keyDown(box, { key: "Escape" });
  expect(box.getAttribute("aria-expanded")).toBe("false");
  fireEvent.keyDown(box, { key: "Escape" });
  fireEvent.keyDown(box, { key: "a" });
});

it("chooses with the mouse without losing focus, and typing again clears the choice", () => {
  const { box, onSelect, onQueryChange } = picker("results", [a, b]);
  fireEvent.focus(box);
  const option = screen.getAllByRole("option")[1]!;
  expect(fireEvent.mouseDown(option)).toBe(false);
  fireEvent.click(option);
  expect(onSelect).toHaveBeenLastCalledWith(b);
  expect(screen.getByText("wpisano: Miejsce-B", { exact: false })).toBeTruthy();
  fireEvent.change(box, { target: { value: "Miejsce" } });
  expect(onSelect).toHaveBeenLastCalledWith(null);
  expect(onQueryChange).toHaveBeenLastCalledWith("Miejsce");
  expect(document.querySelector("[data-slot=place-picker-chosen]")).toBeNull();
  fireEvent.change(box, { target: { value: "Miejsce B" } });
  expect(onSelect).toHaveBeenCalledTimes(2);
});

it("says when it is searching, found nothing or cannot reach the map provider", () => {
  const { box, view } = picker("searching", [a]);
  fireEvent.focus(box);
  expect(screen.getByRole("status").textContent).toBe("Szukam…");
  expect(visibleOptions()).toEqual([]);
  view.rerender(<Field label="Miejsce załadunku" required><PlacePicker status="notFound" options={[a]} labels={labels} /></Field>);
  expect(screen.getByText("Nie znaleziono miejsca.", { selector: "[data-slot=place-picker-message]" })).toBeTruthy();
  expect(visibleOptions()).toEqual([]);
  view.rerender(<Field label="Miejsce załadunku" required><PlacePicker status="unavailable" options={[a]} labels={labels} /></Field>);
  expect(screen.getByText(labels.unavailable, { selector: "[data-slot=place-picker-message]" })).toBeTruthy();
  expect(visibleOptions()).toHaveLength(1);
  view.rerender(<Field label="Miejsce załadunku" required><PlacePicker status="results" options={[a, b]} labels={labels} /></Field>);
  expect(screen.getByRole("status").textContent).toBe("Wyniki: 2");
  expect(document.querySelector("[data-slot=place-picker-message]")).toBeNull();
});

it("offers adding a place under the box and works outside a Field", () => {
  const onAddPlace = vi.fn();
  const view = render(<PlacePicker status="idle" options={[]} labels={labels} defaultValue={a} onAddPlace={onAddPlace} aria-label="Miejsce" />);
  const box = screen.getByRole("combobox", { name: "Miejsce" }) as HTMLInputElement;
  expect(box.value).toBe("Miejsce A");
  fireEvent.keyDown(box, { key: "ArrowDown" });
  fireEvent.change(box, { target: { value: "x" } });
  fireEvent.click(screen.getByRole("button", { name: "Dodaj miejsce…" }));
  expect(onAddPlace).toHaveBeenCalledOnce();
  view.rerender(<PlacePicker status="idle" options={[]} labels={labels} onAddPlace={onAddPlace} disabled aria-label="Miejsce" />);
  expect((screen.getByRole("button", { name: "Dodaj miejsce…" }) as HTMLButtonElement).disabled).toBe(true);
});
