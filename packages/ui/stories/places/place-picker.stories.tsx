import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "@fleet-platform/ui/components/field";
import { PlacePicker, type PlaceOption, type PlaceSearchStatus } from "@fleet-platform/ui/components/places/place-picker";
import { placePickerLabels as labels } from "../product/labels";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

// Synthetic places as in the specification's examples (letters, no real companies or addresses).
const saved: PlaceOption[] = [
  { id: "a", kind: "place", name: "Miejsce A", detail: "ul. Przykładowa 1, Miasto A", country: "PL" },
  { id: "b", kind: "place", name: "Miejsce B", detail: "Beispielstraße 2, Stadt B", country: "DE" },
];
const found: PlaceOption[] = [
  ...saved,
  { id: "c", kind: "address", name: "Miejsce C", detail: "Ukázková 3, Město C", country: "CZ" },
  { id: "e", kind: "address", name: "Miejsce E", detail: "Beispielweg 5, Stadt E", country: "CH" },
  { id: "d1", kind: "town", name: "Miasto D", detail: "Region Północ", country: "PL", needsConfirmation: true },
  { id: "d2", kind: "town", name: "Miasto D", detail: "Region Południe", country: "PL", needsConfirmation: true },
];
/** Unicode, case, diacritics, spaces and punctuation are ignored when matching, as for town aliases (PLACE-2). */
const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

type Provider = "works" | "unavailable";

/** The page's part: searches after a pause in typing and passes results and status to the picker. */
function LoadingPlace({ provider = "works", delay = 300 }: { provider?: Provider; delay?: number }) {
  const [status, setStatus] = useState<PlaceSearchStatus>("idle");
  const [options, setOptions] = useState(saved);
  const [chosen, setChosen] = useState<PlaceOption | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const search = (query: string) => {
    clearTimeout(timer.current);
    const key = normalize(query);
    if (key === "") { setStatus("idle"); setOptions(saved); return; }
    setStatus("searching");
    timer.current = setTimeout(() => {
      const ownMatches = saved.filter(option => normalize(option.name).includes(key));
      if (provider === "unavailable") { setStatus("unavailable"); setOptions(ownMatches); return; }
      const matches = found.filter(option => normalize(option.name).includes(key))
        .map(option => (normalize(option.name) === key && option.name.toLowerCase() !== query.trim().toLowerCase() ? { ...option, typedAs: query.trim() } : option));
      setStatus(matches.length > 0 ? "results" : "notFound");
      setOptions(matches);
    }, delay);
  };
  return <div className="grid max-w-measure gap-group">
    <Field label="Miejsce załadunku" hint="Adres albo miasto, np. Miejsce A" required>
      <PlacePicker status={status} options={options} labels={labels} onQueryChange={search} onSelect={setChosen} onAddPlace={() => undefined} />
    </Field>
    <output className="text-meta">{chosen ? `Wybrane: ${chosen.id} (${chosen.kind})` : "Nic nie wybrano"}</output>
  </div>;
}

const meta = {
  title: "Product/Places/Place picker",
  component: PlacePicker,
  args: { status: "results", options: found, labels, disabled: false },
  argTypes: { status: { control: "select", options: ["idle", "searching", "results", "notFound", "unavailable"] } },
  decorators: [Story => <div className="max-w-measure"><Story /></div>],
  // The list opens over the content below the box; docs give each story room for it.
  parameters: { docs: { story: { height: "26rem" } } },
  render: args => <Field label="Miejsce załadunku" hint="Adres albo miasto" required><PlacePicker {...args} /></Field>,
} satisfies Meta<typeof PlacePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Type "miejsce", "miasto d", "Miejsce-B" or "xyz" (s10.1–s10.6). */
export const Search: Story = {
  name: "Search with saved places and the map provider",
  render: () => <LoadingPlace />,
};

/** The map provider fails: saved places can still be chosen (s10.7, ROUTE-1). */
export const ProviderUnavailable: Story = {
  name: "Map provider unavailable",
  render: () => <LoadingPlace provider="unavailable" />,
};

export const States: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Pusty" required><PlacePicker status="idle" options={[]} labels={labels} /></Field>
    <Field label="Wybrane miejsce" required><PlacePicker status="idle" options={[]} labels={labels} defaultValue={saved[0]} /></Field>
    <Field label="Wybrane samo miasto" required><PlacePicker status="idle" options={[]} labels={labels} defaultValue={found[4]} /></Field>
    <Field label="Błąd" error="Wybierz miejsce załadunku z listy." required><PlacePicker status="idle" options={[]} labels={labels} /></Field>
    <Field label="Zablokowany" hint="Dostępne po wybraniu auta" required><PlacePicker status="idle" options={[]} labels={labels} disabled onAddPlace={() => undefined} /></Field>
  </div>,
};

export const Choosing: Story = {
  name: "Test: search, same-named towns, spelling and choice",
  render: () => <LoadingPlace delay={50} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("combobox", { name: "Miejsce załadunku" });
    // Focus lists saved places.
    await userEvent.click(box);
    await expect(canvas.getAllByRole("option")).toHaveLength(2);
    // Same name in two regions: both shown, each to be confirmed, never merged (PLACE-2).
    await userEvent.type(box, "miasto d");
    await expect(await canvas.findByText("Tylko miasto · Region Północ · PL")).toBeVisible();
    await expect(canvas.getAllByText("Do potwierdzenia")).toHaveLength(2);
    // Another spelling is shown as typed and only chosen by a person.
    await userEvent.clear(box);
    await userEvent.type(box, "Miejsce-B");
    await expect(await canvas.findByText("wpisano: Miejsce-B")).toBeVisible();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(canvas.getByText("Wybrane: b (place)")).toBeVisible();
    await expect(box).toHaveValue("Miejsce B");
    await expect(box).toHaveAccessibleDescription(expect.stringContaining("Zapisane miejsce · Beispielstraße 2, Stadt B · DE"));
    // Nothing found says what to do.
    await userEvent.clear(box);
    await userEvent.type(box, "xyz");
    await expect(await canvas.findByText(labels.notFound, { selector: "[data-slot=place-picker-message]" })).toBeVisible();
    await expect(canvas.getByText("Nic nie wybrano")).toBeVisible();
  },
};

export const Unavailable: Story = {
  name: "Test: map provider unavailable",
  render: () => <LoadingPlace provider="unavailable" delay={50} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox", { name: "Miejsce załadunku" }), "miejsce");
    await expect(await canvas.findByText(labels.unavailable, { selector: "[data-slot=place-picker-message]" })).toBeVisible();
    await userEvent.click(canvas.getByRole("option", { name: /Miejsce A/ }));
    await expect(canvas.getByText("Wybrane: a (place)")).toBeVisible();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: () => <div className="w-80"><LoadingPlace delay={50} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox", { name: "Miejsce załadunku" }), "miasto d");
    await canvas.findAllByText("Do potwierdzenia");
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
