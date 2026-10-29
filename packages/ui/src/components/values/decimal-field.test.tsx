// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Field } from "../field";
import { DecimalField } from "./decimal-field";

afterEach(cleanup);

const describedBy = (element: HTMLElement) => element.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)!.textContent);

it("is a decimal text box named by the Field and described by its hint, error and the amount's currency", () => {
  const onChange = vi.fn();
  render(<Field label="Fracht" hint="Kwota netto uzgodniona z klientem" error="Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00." required>
    <DecimalField kind="amount" currency="EUR" value="18x" onChange={onChange} />
  </Field>);
  const input = screen.getByRole("textbox", { name: "Fracht" });
  expect(input.getAttribute("inputmode")).toBe("decimal");
  expect(input.getAttribute("type")).toBe("text");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.hasAttribute("required")).toBe(true);
  expect(describedBy(input)).toEqual(["Kwota netto uzgodniona z klientem", "Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00.", "EUR"]);
  fireEvent.change(input, { target: { value: "1850,00" } });
  expect(onChange).toHaveBeenCalledOnce();
});

it("works without a unit and keeps a description of its own", () => {
  render(<>
    <p id="own">Wpisz bez waluty</p>
    <DecimalField kind="litres" aria-label="Ilość" aria-describedby="own" defaultValue="" />
  </>);
  const input = screen.getByRole("textbox", { name: "Ilość" });
  expect(describedBy(input)).toEqual(["Wpisz bez waluty"]);
  expect(document.querySelector("[data-slot=decimal-field-unit]")).toBeNull();
});

it("has no description when it has neither a unit nor one of its own", () => {
  render(<DecimalField kind="litres" aria-label="Ilość" />);
  expect(screen.getByRole("textbox", { name: "Ilość" }).hasAttribute("aria-describedby")).toBe(false);
});

it("checks the typed text against its kind when the dispatcher leaves the field", () => {
  const onDecimalChange = vi.fn();
  const onBlur = vi.fn();
  render(<>
    <DecimalField kind="amount" currency="EUR" aria-label="Fracht" defaultValue="1 850,005" onDecimalChange={onDecimalChange} onBlur={onBlur} />
    <DecimalField kind="amount" currency="HUF" unit="Ft" signed aria-label="Korekta" defaultValue="-12" onDecimalChange={onDecimalChange} />
    <DecimalField kind="kilometres" aria-label="Dystans" defaultValue="412,300" />
  </>);
  fireEvent.blur(screen.getByRole("textbox", { name: "Fracht" }));
  expect(onDecimalChange).toHaveBeenLastCalledWith({ ok: false, reason: "scale", scale: 2 });
  expect(onBlur).toHaveBeenCalledOnce();
  fireEvent.blur(screen.getByRole("textbox", { name: "Korekta" }));
  expect(onDecimalChange).toHaveBeenLastCalledWith({ ok: true, value: "-12" });
  expect(screen.getByText("Ft")).toBeTruthy();
  fireEvent.blur(screen.getByRole("textbox", { name: "Dystans" }));
  expect(onDecimalChange).toHaveBeenCalledTimes(2);
});
