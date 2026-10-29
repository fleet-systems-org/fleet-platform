import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AppFrame } from "@fleet-platform/ui/components/layout/app-frame";
import { StepBar } from "@fleet-platform/ui/components/layout/step-bar";
import { RouteStops } from "@fleet-platform/ui/components/places/route-stops";
import { ValueWithSource } from "@fleet-platform/ui/components/values/value-with-source";
import { DecimalField } from "@fleet-platform/ui/components/values/decimal-field";
import { Alert } from "@fleet-platform/ui/components/alert";
import { Button } from "@fleet-platform/ui/components/button";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { Field } from "@fleet-platform/ui/components/field";
import { Textarea } from "@fleet-platform/ui/components/textarea";
import { LoadingMessage } from "@fleet-platform/ui/backend/feedback/LoadingMessage";
import { dispatcherNavigation, quoteSteps, valueLabels } from "../../product/labels";
import { account, route } from "./parts";

// s11 route and countries. s11.7 (a detour through another country or day) waits for L01: the entry has no step for
// stops yet. Kilometres are whole on screen and exact in the details (owner decision, s11.8); every route figure is an
// estimate (BND-3). The prototype's synthetic split: approach PL 12 + DE 8, loaded DE 50 + CZ 30.

type Leg = { title: string; parts: [country: string, km: string][]; total: string };
const legs: Leg[] = [
  { title: "Dojazd Miejsce A → Miejsce B, bez ładunku", parts: [["PL", "12.000"], ["DE", "8.000"]], total: "20" },
  { title: "Z ładunkiem Miejsce B → Miejsce C", parts: [["DE", "50.000"], ["CZ", "30.000"]], total: "80" },
];
const map = { name: "Mapa (HERE)", date: "12.11.2026" };
const km = (label: string, value: string, reason = "trasa z mapy dla profilu auta") =>
  <ValueWithSource state="known" size="compact" label={label} labels={valueLabels} value={value} unit="km" displayScale={0} certainty="estimated" source={map} reason={reason} />;

function LegTable({ leg, reason }: { leg: Leg; reason?: string }) {
  return <table className="w-full text-table">
    <caption className="pb-tight text-left text-body-strong">{leg.title}</caption>
    <thead><tr className="border-b border-divider text-left"><th scope="col" className="py-tight">Kraj</th><th scope="col" className="text-right">Kilometry</th></tr></thead>
    <tbody>{leg.parts.map(([country, value]) => <tr key={country} className="border-b border-divider"><th scope="row" className="py-tight text-left">{country}</th><td className="text-right">{km(`${leg.title}: ${country}`, value, reason)}</td></tr>)}</tbody>
    <tfoot><tr><th scope="row" className="py-tight text-left">Razem</th><td className="text-right text-number">{leg.total} km</td></tr></tfoot>
  </table>;
}

/** The route screen in the shared frame: the step bar and the route panel stay as on entry and quote (N7c). */
function RouteScreen({ children, notice, endpoint }: { children?: ReactNode; notice?: ReactNode; endpoint?: string }) {
  const stops = endpoint ? [route[0]!, route[1]!, { ...route[2]!, place: endpoint }] : route;
  return <AppFrame {...dispatcherNavigation} account={account} width="centred"
    steps={<StepBar label="Postęp wyceny" steps={quoteSteps} current={3} doneText="gotowe" />}
    panel={<Card><CardTitle>Trasa kursu</CardTitle><RouteStops label="Trasa kursu" timeZone="Warszawa" stops={stops} /></Card>} panelLabel="Trasa kursu">
    <div className="flex flex-col gap-between">
      <h1 className="text-page-title">Trasa i kraje</h1>
      {notice}
      {children ?? <Card className="flex flex-col gap-between">{legs.map(leg => <LegTable key={leg.title} leg={leg} />)}</Card>}
      <Card><CardTitle>Myto z planera trasy</CardTitle>
        <div className="flex flex-col gap-tight pt-tight">
          <ValueWithSource state="known" label="Myto z planera trasy" labels={valueLabels} value="10.00" unit="EUR" certainty="estimated" source={map} reason="tylko kontrola; do kosztu wchodzi stawka myta z konfiguracji (SRC-4)" />
          <p className="text-meta">Tylko do kontroli. Koszt myta liczy się ze stawek miesięcznych.</p>
        </div>
      </Card>
      <div className="flex flex-wrap gap-group"><Button variant="secondary">Popraw podział na kraje</Button><Button>Wyceń</Button></div>
    </div>
  </AppFrame>;
}

/** Manual kilometres per country with a reason (BND-4): used when the route is missing or the dispatcher corrects it. */
function ManualSplit({ total, parts, error }: { total: string; parts: [string, string][]; error?: string }) {
  return <Card className="flex flex-col gap-between">
    <CardTitle>Z ładunkiem Miejsce B → Miejsce C: kilometry po krajach</CardTitle>
    <Field label="Razem" required><DecimalField kind="kilometres" unit="km" defaultValue={total} /></Field>
    {parts.map(([country, value]) => <Field key={country} label={`Kraj ${country}`} error={error && country === parts.at(-1)![0] ? error : undefined} required>
      <DecimalField kind="kilometres" unit="km" defaultValue={value} />
    </Field>)}
    <Field label="Powód zmiany" hint="Na przykład: objazd przez zamkniętą granicę" required><Textarea /></Field>
    <Button className="w-fit">Zapisz podział</Button>
  </Card>;
}

const meta = {
  title: "Screens/E01/s11 Route and countries",
  component: RouteScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RouteScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

/** s11.1 Approach and loaded leg with kilometres per country as estimates; the planner toll is only a control (SRC-4). */
export const Default: Story = { name: "s11.1 Route by country" };

/** s11.2 The route is calculated until the server answers; the screen sets no time limit (L08). */
export const Calculating: Story = { name: "s11.2 Calculating the route", args: { children: <Card><LoadingMessage>Liczę trasę…</LoadingMessage></Card> } };

/** s11.3 The map provider is unavailable: the route is missing and the dispatcher enters the split by hand (ROUTE-1, BND-4). */
export const Unavailable: Story = {
  name: "s11.3 Map provider unavailable",
  args: {
    notice: <Alert title="Trasy nie policzono">Dostawca map nie odpowiada. Wpisz kilometry po krajach i powód; wycena oznaczy je jako wpisane ręcznie.</Alert>,
    children: <ManualSplit total="" parts={[["DE", ""], ["CZ", ""]]} />,
  },
};

/** s11.4 Parts that do not add up to the total make fuel and toll incomplete (BND-4). */
export const PartsMismatch: Story = {
  name: "s11.4 Parts do not add up",
  args: { children: <ManualSplit total="80" parts={[["DE", "50"], ["CZ", "20"]]} error="Kraje dają 70 km, a razem jest 80 km. Bez zgodnej sumy paliwo i myto będą niepełne." /> },
};

/** s11.5 Changing only the total without a split leaves fuel and toll incomplete (BND-4). */
export const TotalOnly: Story = {
  name: "s11.5 Total changed without a split",
  args: { notice: <Alert title="Paliwo i myto będą niepełne">Zmieniono samą sumę kilometrów bez podziału na kraje. Wpisz podział, aby policzyć paliwo i myto.</Alert> },
};

/** s11.6 After an edit the original estimate stays beside the revision and the previous quote is stale (BND-4). */
export const AfterEdit: Story = {
  name: "s11.6 After an edit",
  args: {
    notice: <Alert title="Poprzednia wycena jest nieaktualna">Zmieniono podział na kraje. Policz wycenę ponownie.</Alert>,
    children: <Card className="flex flex-col gap-between">
      <LegTable leg={legs[0]!} />
      <LegTable leg={{ title: "Z ładunkiem Miejsce B → Miejsce C, po zmianie", parts: [["DE", "56.000"], ["CZ", "30.000"]], total: "86" }} reason="wpisane ręcznie: objazd" />
      <LegTable leg={{ title: "Z ładunkiem Miejsce B → Miejsce C, pierwotny szacunek", parts: [["DE", "50.000"], ["CZ", "30.000"]], total: "80" }} />
    </Card>,
  },
};

/** L09: a town-only unloading point; its distance is an estimate to the town. */
export const TownOnly: Story = { name: "L09 Town only", args: { endpoint: "Město C · CZ · Tylko miasto" } };

export const Checks: Story = {
  name: "Test: whole kilometres, estimates and the toll control",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("12 km").length).toBeGreaterThan(0);
    await expect(canvas.getAllByText("Szacunek").length).toBeGreaterThanOrEqual(5);
    await expect(canvas.getByText("Tylko do kontroli. Koszt myta liczy się ze stawek miesięcznych.")).toBeVisible();
    await expect(canvas.getByRole("list", { name: "Postęp wyceny" }).querySelector("[aria-current=step]")).toHaveTextContent("Wycena");
  },
};
