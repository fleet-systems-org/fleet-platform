import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { RouteStops, type RouteStop } from "@fleet-platform/ui/components/places/route-stops";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

/** The prototype's synthetic trip: places A–C, whole kilometres, Warsaw times. */
export const tripStops: RouteStop[] = [
  { label: "Start", time: "11:00", date: "12.11.2026", place: "Miejsce A · PL", details: [{ label: "Auto", value: "Auto 01, wolne po poprzednim kursie" }] },
  { label: "Załadunek", time: "12:00", date: "12.11.2026", place: "Miejsce B · DE", details: [{ label: "Klient", value: "Klient D" }, { label: "Dojazd", value: "20 km, bez ładunku" }] },
  { label: "Rozładunek", time: "13:00", date: "12.11.2026", place: "Miejsce C · CZ", details: [{ label: "Z ładunkiem", value: "80 km" }, { label: "Potem", value: "auto wolne w Miejscu C" }] },
];

const meta = {
  title: "Product/Places/Route stops",
  component: RouteStops,
  args: { label: "Trasa kursu", timeZone: "Warszawa", stops: tripStops },
} satisfies Meta<typeof RouteStops>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** In a panel on the entry, route and quote screens (N7b): the card names the list. */
export const InPanel: Story = {
  name: "In a panel",
  render: args => <Card className="w-frame-panel max-w-full"><CardTitle>Trasa kursu</CardTitle><RouteStops {...args} /></Card>,
};

/** Before places and times are entered the page passes its own words, never a made-up time. */
export const NotEntered: Story = {
  name: "Not entered yet",
  args: {
    stops: [
      tripStops[0]!,
      { label: "Załadunek", time: "—", date: "—", place: "Wybierz miejsce" },
      { label: "Rozładunek", time: "—", date: "—", place: "Wybierz miejsce" },
    ],
  },
};

export const Reading: Story = {
  name: "Test: stops read as time, date, place and details",
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("list", { name: "Trasa kursu" });
    const stops = within(list).getAllByRole("listitem");
    await expect(stops).toHaveLength(3);
    await expect(within(stops[1]!).getByText("12:00")).toBeVisible();
    await expect(within(stops[1]!).getByText("12.11.2026 (Warszawa)")).toBeVisible();
    await expect(within(stops[1]!).getByText("Dojazd").tagName).toBe("DT");
    await expect(within(stops[2]!).getByText("80 km").tagName).toBe("DD");
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: args => <div className="w-80"><RouteStops {...args} /></div>,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
