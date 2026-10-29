import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Skeleton } from "@fleet-platform/ui/components/skeleton";
import { ValueWithSource, type ValueWithSourceProps } from "@fleet-platform/ui/components/values/value-with-source";
import { LoadingMessage } from "@fleet-platform/ui/backend/feedback/LoadingMessage";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";
import { valueLabels } from "./labels";

// The controls show the known state; the other states have their own stories.
type KnownProps = Extract<ValueWithSourceProps, { state: "known" }>;

// Synthetic values; sources, certainty and reasons follow the E01 foundations (SRC-1, ROUTE-1, EV-1–EV-4).
const meta = {
  title: "Product/Values/Value with source",
  component: ValueWithSource as React.FC<KnownProps>,
  args: {
    state: "known", label: "Dystans kursu", labels: valueLabels, value: "1234.567", unit: "km", displayScale: 0,
    certainty: "certain", source: { name: "Trasa od dostawcy map", date: "28.10.2026" },
  },
  argTypes: {
    state: { control: false }, labels: { control: false }, source: { control: false },
    certainty: { control: "inline-radio", options: ["certain", "estimated"] },
    size: { control: "inline-radio", options: ["default", "compact"] },
  },
} satisfies Meta<KnownProps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const Row = ({ name, children }: { name: string; children: React.ReactNode }) =>
  <div data-row className="flex flex-wrap items-center justify-between gap-x-between gap-y-tight border-b border-divider py-tight"><span className="text-label">{name}</span><div className="flex justify-end">{children}</div></div>;

/** One line per state, right-aligned as in a result column (P8). */
export const States: Story = {
  render: () => <div className="grid max-w-measure">
    <Row name="Pewna (cena z kart, potwierdzona fakturą)">
      <ValueWithSource state="known" label="Cena paliwa w Polsce" labels={valueLabels} value="1.401250" unit="EUR/l" certainty="certain"
        source={{ name: "Karty paliwowe, potwierdzone fakturą", date: "27.10.2026" }} />
    </Row>
    <Row name="Szacunek (biuletyn, kurs w przyszłości)">
      <ValueWithSource state="known" label="Cena paliwa w Niemczech" labels={valueLabels} value="1.512340" unit="EUR/l" certainty="estimated"
        source={{ name: "Tygodniowy biuletyn cen paliw Komisji Europejskiej", date: "27.10.2026" }}
        reason="Brak tankowań w Niemczech z ostatnich 14 dni; cena publiczna przeliczona na netto, kurs w przyszłości." />
    </Row>
    <Row name="Brak (pusty)">
      <ValueWithSource state="missing" label="Cena paliwa w Czechach" labels={valueLabels} reason="ceny paliwa dla Czech" />
    </Row>
    <Row name="Brak trasy (błąd dostawcy)">
      <ValueWithSource state="missing" label="Dystans kursu" labels={valueLabels} reason="trasy od dostawcy map; wpisz podział na kraje ręcznie" />
    </Row>
    <Row name="Sprzeczne">
      <ValueWithSource state="conflicting" label="Cena paliwa w Niemczech" labels={valueLabels} unit="EUR/l"
        candidates={[{ value: "1.498000", source: { name: "Źródło A", date: "27.10.2026" } }, { value: "1.512000", source: { name: "Źródło B", date: "27.10.2026" } }]}
        reason="Wynik nie zostanie policzony, dopóki nie rozstrzygniesz, które źródło obowiązuje." />
    </Row>
    <Row name="Ładowanie">
      <div aria-busy="true" className="flex flex-col items-end gap-tight"><Skeleton className="h-4 w-24" /><LoadingMessage>Pobieram cenę paliwa.</LoadingMessage></div>
    </Row>
    <Row name="W wierszu tabeli (compact)">
      <ValueWithSource state="known" size="compact" label="Dystans kursu" labels={valueLabels} value="1234.567" unit="km" displayScale={0}
        certainty="certain" source={{ name: "Trasa od dostawcy map", date: "28.10.2026" }} />
    </Row>
  </div>,
};

export const Open: Story = {
  name: "Open: details of an estimate",
  parameters: { docs: { story: { inline: false, iframeHeight: 320 } } },
  render: () => <ValueWithSource state="known" label="Cena paliwa w Niemczech" labels={valueLabels} value="1.512340" unit="EUR/l" certainty="estimated"
    source={{ name: "Tygodniowy biuletyn cen paliw Komisji Europejskiej", date: "27.10.2026" }}
    reason="Brak tankowań w Niemczech z ostatnich 14 dni; cena publiczna przeliczona na netto." />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
    await screen.findByRole("dialog");
  },
};

export const Keyboard: Story = {
  name: "Test: whole kilometres, exact details, keyboard",
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "1 235 km" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const details = await screen.findByRole("dialog", { name: "Szczegóły: Dystans kursu" });
    // Exact published value in the details; the separators are no-break spaces.
    await waitFor(() => expect(details).toBeVisible());
    await expect(details).toHaveTextContent(/Dokładna wartość1\s234,567\skm/);
    await expect(details).toHaveTextContent("PewnośćPewne");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: () => <div className="w-80">{States.render!({} as never, {} as never)}</div>,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
    // No value overlaps its row label at 320 px.
    for (const row of canvasElement.querySelectorAll("[data-row]")) {
      const [label, value] = [row.firstElementChild!.getBoundingClientRect(), row.lastElementChild!.getBoundingClientRect()];
      const overlaps = label.right > value.left && label.bottom > value.top && value.bottom > label.top;
      await expect(overlaps, row.textContent ?? "").toBe(false);
    }
  },
};
