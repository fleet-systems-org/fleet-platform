// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Badge } from "./badge";

afterEach(cleanup);

it("is a neutral word by default and keeps the chosen variant", () => {
  render(<><Badge>Niezweryfikowane</Badge><Badge variant="estimate">Szacunek</Badge></>);
  expect(screen.getByText("Niezweryfikowane").dataset.variant).toBe("neutral");
  expect(screen.getByText("Szacunek").dataset.variant).toBe("estimate");
});
