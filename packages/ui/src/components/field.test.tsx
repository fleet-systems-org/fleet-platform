// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Field } from "./field";
import { Input } from "./input";
import { Textarea } from "./textarea";

afterEach(cleanup);

it("wires the label, hint and error to the control", () => {
  render(<Field label="Fracht" hint="Kwota netto, np. 1850,00" error="Wpisz kwotę, np. 1850,00." required><Input inputMode="decimal" /></Field>);
  const input = screen.getByLabelText("Fracht");
  const describedBy = input.getAttribute("aria-describedby")!.split(" ");
  expect(describedBy.map(id => document.getElementById(id)!.textContent)).toEqual(["Kwota netto, np. 1850,00", "Wpisz kwotę, np. 1850,00."]);
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.hasAttribute("required")).toBe(true);
  expect(screen.queryByText("(opcjonalne)")).toBeNull();
});

it("marks an optional field in words and leaves a valid field without description", () => {
  render(<Field label="Uwagi" optionalText="opcjonalne"><Textarea /></Field>);
  const textarea = screen.getByRole("textbox");
  expect(screen.getByText("(opcjonalne)")).toBeTruthy();
  expect(textarea.hasAttribute("aria-describedby")).toBe(false);
  expect(textarea.hasAttribute("aria-invalid")).toBe(false);
  expect(textarea.hasAttribute("required")).toBe(false);
});

it("keeps the label link, appends the control's own description and leaves a control outside a field unchanged", () => {
  render(<><p id="zrodlo">Z GPS</p><Field label="Miejsce załadunku" hint="Miasto i kod"><Input id="zaladunek" aria-describedby="zrodlo" aria-invalid required /></Field><Input aria-label="Szukaj" /></>);
  const place = screen.getByLabelText("Miejsce załadunku");
  expect(place.id).not.toBe("zaladunek");
  expect(place.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)!.textContent)).toEqual(["Miasto i kod", "Z GPS"]);
  expect(place.getAttribute("aria-invalid")).toBe("true");
  expect(place.hasAttribute("required")).toBe(true);
  const search = screen.getByRole("textbox", { name: "Szukaj" });
  expect(search.hasAttribute("id")).toBe(false);
});
