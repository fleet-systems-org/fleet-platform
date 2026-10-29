// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Button } from "./button";

afterEach(cleanup);

it("is a non-submitting primary button by default and keeps an explicit type", () => {
  render(<><Button>Policz wycenę</Button><Button type="submit" variant="secondary" size="compact">Zapisz</Button></>);
  const quote = screen.getByRole("button", { name: "Policz wycenę" });
  expect(quote.getAttribute("type")).toBe("button");
  expect(quote.dataset).toMatchObject({ variant: "primary", size: "default" });
  const save = screen.getByRole("button", { name: "Zapisz" });
  expect(save.getAttribute("type")).toBe("submit");
  expect(save.dataset).toMatchObject({ variant: "secondary", size: "compact" });
});

it("renders its child as a link without a button type", () => {
  render(<Button asChild variant="text"><a href="/kursy">Wróć do kursów</a></Button>);
  const link = screen.getByRole("link", { name: "Wróć do kursów" });
  expect(link.hasAttribute("type")).toBe(false);
  expect(link.dataset.variant).toBe("text");
});
