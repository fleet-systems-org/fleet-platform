// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Alert } from "./alert";

afterEach(cleanup);

it("announces a neutral notice politely with its next step and action", () => {
  render(<Alert title="Zapytaj o weekend" action={<button>Wybierz przypadek weekendu</button>}>Kurs obejmuje weekend. Zapytaj kierowcę, gdzie go spędzi.</Alert>);
  const alert = screen.getByRole("status");
  expect(alert.dataset.variant).toBe("neutral");
  expect(alert.textContent).toBe("Zapytaj o weekendKurs obejmuje weekend. Zapytaj kierowcę, gdzie go spędzi.Wybierz przypadek weekendu");
});

it("reports an error at once and may have only a title", () => {
  render(<Alert variant="error" title="Nie udało się zapisać kursu." />);
  const alert = screen.getByRole("alert");
  expect(alert.dataset.variant).toBe("error");
  expect(alert.textContent).toBe("Nie udało się zapisać kursu.");
});
