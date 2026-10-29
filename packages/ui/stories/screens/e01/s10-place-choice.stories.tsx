import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import type { PlaceOption, PlaceSearchStatus } from "@fleet-platform/ui/components/places/place-picker";
import { placePickerLabels } from "../../product/labels";
import { places, route, StopFields, TripEntry } from "./parts";

/** s10: choosing the loading place inside the entry step "Miejsca i czasy" (PLACE-2, PLACE-3, L08, L09). */
function PlaceChoice({ status, options, place, unloading = places.c }: { status: PlaceSearchStatus; options: PlaceOption[]; place?: PlaceOption; unloading?: PlaceOption }) {
  return <TripEntry open={2} stops={<div className="flex flex-col gap-section md:flex-row">
    <StopFields title="Załadunek" status={status} options={options} place={place} time={{ date: "2026-11-12", time: "12:00" }} />
    <StopFields title="Rozładunek" place={unloading} time={{ date: "2026-11-12", time: "13:00" }} />
  </div>} />;
}

const meta = {
  title: "Screens/E01/s10 Place choice",
  component: PlaceChoice,
  parameters: { layout: "fullscreen" },
  args: { status: "idle", options: [places.a, places.b] },
} satisfies Meta<typeof PlaceChoice>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Opens the loading place list, as the dispatcher does by moving into the box. */
const openList: Story["play"] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole("combobox", { name: "Miejsce: załadunek" }));
};

/** s10.1 Saved places are listed before anything is typed. */
export const Default: Story = { name: "s10.1 Saved places", play: openList };

/** s10.2 The search runs until the server answers; the screen sets no time limit (L08). */
export const Searching: Story = { name: "s10.2 Searching", args: { status: "searching", options: [] }, play: openList };

/** s10.3 Several results: a person chooses the point (BND-4, PLACE-3). */
export const SeveralResults: Story = { name: "s10.3 Several results", args: { status: "results", options: [places.b, places.c, places.a] }, play: openList };

/** s10.4 The same town in two regions: both listed, each to be confirmed (PLACE-2). */
export const SameTownTwoRegions: Story = { name: "s10.4 Same town in two regions", args: { status: "results", options: [places.d1, places.d2] }, play: openList };

/** s10.5 Another spelling: shown as typed, chosen by a person, no alias saved (PLACE-2). */
export const OtherSpelling: Story = { name: "s10.5 Other spelling", args: { status: "results", options: [{ ...places.b, typedAs: "Miejsce-B" }] }, play: openList };

/** s10.6 Nothing found: saved places and the company's towns stay listed (L09). */
export const NotFound: Story = { name: "s10.6 Not found", args: { status: "notFound", options: [places.a, places.b, places.townC] }, play: openList };

/** s10.7 The map provider is unavailable: saved places and towns can still be chosen; nothing can be added (L09). */
export const Unavailable: Story = { name: "s10.7 Map provider unavailable", args: { status: "unavailable", options: [places.a, places.b, places.townC] }, play: openList };

/** s10.8 A map address is chosen: "Dodaj miejsce" saves it as a place in one action (places.write, L09). */
export const AddFromMap: Story = { name: "s10.8 Add a place from a map address", args: { status: "results", options: [places.c], place: places.c, unloading: places.b } };

/** L09: a town-only endpoint is named so in the route, and its distance is an estimate. */
export const TownOnly: Story = {
  name: "L09 Town only",
  render: () => <TripEntry open={2} routeStops={[route[0]!, route[1]!, { ...route[2]!, place: "Město C · CZ · Tylko miasto", details: [{ label: "Z ładunkiem", value: "80 km, szacunek do środka miasta" }] }]}
    stops={<div className="flex flex-col gap-section md:flex-row">
      <StopFields title="Załadunek" place={places.b} time={{ date: "2026-11-12", time: "12:00" }} />
      <StopFields title="Rozładunek" place={places.townC} time={{ date: "2026-11-12", time: "13:00" }} />
    </div>} />,
};

export const Checks: Story = {
  name: "Test: L09 choices and adding only from the map",
  args: NotFound.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("combobox", { name: "Miejsce: załadunek" });
    await userEvent.click(box);
    await expect(canvas.getByText(placePickerLabels.notFound, { selector: "[data-slot=place-picker-message]" })).toBeVisible();
    await expect(canvas.getAllByRole("option")).toHaveLength(3);
    await userEvent.click(canvas.getByRole("option", { name: /Město C/ }));
    await expect(box).toHaveAccessibleDescription(expect.stringContaining("Tylko miasto"));
    // A town is not a map address, so nothing can be added; the unloading map address can be.
    await expect(canvas.getAllByRole("button", { name: placePickerLabels.addPlace })).toHaveLength(1);
  },
};
