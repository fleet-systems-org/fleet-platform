// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

afterEach(cleanup);
it("renders every card slot with merged classes and forwarded props", () => {
  render(<Card className="py-2" aria-label="Synthetic card">
    <CardHeader className="extra-header"><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription><CardAction>Action</CardAction></CardHeader>
    <CardContent>Content</CardContent><CardFooter>Footer</CardFooter>
  </Card>);
  const card = screen.getByLabelText("Synthetic card");
  expect(card.dataset.slot).toBe("card");
  expect(card.className).toContain("py-2"); expect(card.className).not.toContain("py-6");
  const slots = { Title: "card-title", Description: "card-description", Action: "card-action", Content: "card-content", Footer: "card-footer" };
  for (const [text, slot] of Object.entries(slots)) expect(screen.getByText(text).dataset.slot).toBe(slot);
  const header = card.querySelector('[data-slot="card-header"]')!;
  expect(header.className).toContain("extra-header");
});
