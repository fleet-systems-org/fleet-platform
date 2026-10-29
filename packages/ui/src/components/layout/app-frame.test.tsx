// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AppFrame } from "./app-frame";

afterEach(cleanup);

const items = [
  { href: "/wyceny/nowa", label: "Nowa wycena", current: true },
  { href: "/kursy", label: "Kursy aut" },
];

it("puts the entries the page passes, later phases and the account in the left navigation (N7d, L12)", () => {
  render(<AppFrame navigationLabel="Nawigacja" items={items} later={{ label: "Później", items: ["Rozliczenia"] }} account={<button type="button">Wyloguj</button>} className="extra">
    <h1>Nowa wycena</h1>
  </AppFrame>);
  const navigation = screen.getByRole("navigation", { name: "Nawigacja" });
  const links = within(navigation).getAllByRole("link");
  expect(links.map(link => [link.textContent, link.getAttribute("href"), link.getAttribute("aria-current")])).toEqual([
    ["Nowa wycena", "/wyceny/nowa", "page"],
    ["Kursy aut", "/kursy", null],
  ]);
  // A later entry is muted text, not a link to a screen that does not exist.
  expect(within(navigation).getByText("Rozliczenia").closest("a")).toBeNull();
  expect(within(navigation).getByText("Później")).toBeTruthy();
  expect(within(navigation).getByRole("button", { name: "Wyloguj" })).toBeTruthy();
  expect(within(screen.getByRole("main")).getByRole("heading", { name: "Nowa wycena" })).toBeTruthy();
  expect(document.querySelector("[data-slot=app-frame]")!.className).toContain("extra");
  // Full width by default: work screens such as the fleet keep the whole width.
  expect(screen.getByRole("main").firstElementChild!.className).not.toContain("max-w-frame-content");
  expect(screen.queryByRole("complementary")).toBeNull();
});

it("centres the content with the step bar and a named panel on entry, route and quote (N7c)", () => {
  render(<AppFrame navigationLabel="Nawigacja" items={items} width="centred" steps={<ol aria-label="Postęp wyceny" />} panel={<p>Wynik</p>} panelLabel="Podsumowanie wyceny">
    <p>Formularz</p>
  </AppFrame>);
  const main = screen.getByRole("main");
  expect(main.firstElementChild!.className).toContain("max-w-frame-content");
  expect(within(main).getByRole("list", { name: "Postęp wyceny" })).toBeTruthy();
  expect(within(main).getByRole("complementary", { name: "Podsumowanie wyceny" }).textContent).toBe("Wynik");
  expect(screen.getByRole("navigation").querySelectorAll("ul")).toHaveLength(1);
});
