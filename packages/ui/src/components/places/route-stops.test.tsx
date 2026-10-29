// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { RouteStops } from "./route-stops";

afterEach(cleanup);

it("reads each stop as label, time, date in the zone, place and label–value details (N7b, R19.1)", () => {
  render(<RouteStops label="Trasa kursu" timeZone="Warszawa" className="extra" stops={[
    { label: "Start", time: "11:00", date: "12.11.2026", place: "Miejsce A · PL" },
    { label: "Załadunek", time: "12:30", date: "12.11.2026", place: "Miejsce B · DE", details: [{ label: "Dojazd", value: "20 km, bez ładunku" }] },
    { label: "Rozładunek", time: "—", date: "—", place: "Wybierz miejsce", details: [] },
  ]} />);
  const list = screen.getByRole("list", { name: "Trasa kursu" });
  expect(list.className).toContain("extra");
  const [start, loading, unloading] = within(list).getAllByRole("listitem");
  expect([...start!.querySelectorAll("p")].map(p => p.textContent)).toEqual(["Start", "11:00", "12.11.2026 (Warszawa)", "Miejsce A · PL"]);
  expect(start!.querySelector("dl")).toBeNull();
  expect(within(loading!).getByText("Dojazd").tagName).toBe("DT");
  expect(within(loading!).getByText("20 km, bez ładunku").tagName).toBe("DD");
  // An empty details list renders no empty definition list.
  expect(unloading!.querySelector("dl")).toBeNull();
});
