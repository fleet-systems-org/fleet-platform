// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Field } from "./field";
import { RadioGroup, RadioGroupItem } from "./radio-group";

afterEach(cleanup);

it("starts with no choice, is named by the Field and selects an option from its label", () => {
  const onValueChange = vi.fn();
  render(<Field label="Mycie cysterny" error="Wybierz, czy będzie mycie." required>
    <RadioGroup onValueChange={onValueChange}>
      <RadioGroupItem value="none" label="Bez mycia" />
      <RadioGroupItem value="ours" label="Nasze mycie" hint="Koszt przewoźnika, z kwotą i datą" />
    </RadioGroup>
  </Field>);
  const group = screen.getByRole("radiogroup", { name: "Mycie cysterny" });
  expect(group.getAttribute("aria-required")).toBe("true");
  expect(group.getAttribute("aria-invalid")).toBe("true");
  expect(screen.getAllByRole("radio").every(radio => radio.getAttribute("aria-checked") === "false")).toBe(true);
  const ours = screen.getByRole("radio", { name: "Nasze mycie" });
  expect(ours).toHaveProperty("textContent", "");
  expect(document.getElementById(ours.getAttribute("aria-describedby")!)!.textContent).toBe("Koszt przewoźnika, z kwotą i datą");
  expect(screen.getByRole("radio", { name: "Bez mycia" }).hasAttribute("aria-describedby")).toBe(false);
  fireEvent.click(screen.getByText("Nasze mycie"));
  expect(onValueChange).toHaveBeenCalledWith("ours");
  expect(ours.getAttribute("aria-checked")).toBe("true");
});
