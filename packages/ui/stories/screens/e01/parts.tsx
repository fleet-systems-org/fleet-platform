// Shared parts of the E01 screen stories: synthetic data from the clickable prototype and the screen map, and the trip
// entry composition. Screens are stories composed from real components (Q4); nothing here is a design-system component.
import type { ReactNode } from "react";
import { AppFrame } from "@fleet-platform/ui/components/layout/app-frame";
import { StepBar } from "@fleet-platform/ui/components/layout/step-bar";
import { RouteStops, type RouteStop } from "@fleet-platform/ui/components/places/route-stops";
import { PlacePicker, type PlaceOption, type PlaceSearchStatus } from "@fleet-platform/ui/components/places/place-picker";
import { ZonedDateTimeField } from "@fleet-platform/ui/components/time/zoned-date-time-field";
import { DecimalField } from "@fleet-platform/ui/components/values/decimal-field";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@fleet-platform/ui/components/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fleet-platform/ui/components/select";
import { Button } from "@fleet-platform/ui/components/button";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { dispatcherNavigation, placePickerLabels, quoteSteps, zonedDateTimeLabels } from "../../product/labels";

export const account = <><p className="text-meta wrap-anywhere">dyspozytor@firma-demo.example</p><Button variant="secondary">Wyloguj</Button></>;

/** Trucks with where and when they are free (prototype model). */
export const vehicles = [
  { id: "auto-01", name: "Auto 01", free: "Wolne w Miejscu A od 12.11.2026, 11:00" },
  { id: "auto-02", name: "Auto 02", free: "Nieznane" },
  { id: "auto-03", name: "Auto 03", free: "Wolne w Miejscu B od 12.11.2026, 15:00" },
];

export const places = {
  a: { id: "a", kind: "place", name: "Miejsce A", detail: "ul. Przykładowa 1, Miasto A", country: "PL" },
  b: { id: "b", kind: "place", name: "Miejsce B", detail: "Beispielstraße 2, Stadt B", country: "DE" },
  c: { id: "c", kind: "address", name: "Miejsce C", detail: "Ukázková 3, Město C", country: "CZ" },
  d1: { id: "d1", kind: "town", name: "Miasto D", detail: "Region Północ", country: "PL", needsConfirmation: true },
  d2: { id: "d2", kind: "town", name: "Miasto D", detail: "Region Południe", country: "PL", needsConfirmation: true },
  townC: { id: "town-c", kind: "town", name: "Město C", country: "CZ" },
} satisfies Record<string, PlaceOption>;

/** The route of the prototype's trip, Warsaw time. */
export const route: RouteStop[] = [
  { label: "Start", time: "11:00", date: "12.11.2026", place: "Miejsce A · PL", details: [{ label: "Auto", value: "Auto 01" }] },
  { label: "Załadunek", time: "12:00", date: "12.11.2026", place: "Miejsce B · DE", details: [{ label: "Dojazd", value: "20 km, bez ładunku" }] },
  { label: "Rozładunek", time: "13:00", date: "12.11.2026", place: "Miejsce C · CZ", details: [{ label: "Z ładunkiem", value: "80 km" }] },
];

/** A completed step collapses to one line with its answer and "Zmień"; later steps wait below (R18.1, N7a). */
export function EntryStep({ number, title, state, answer, next, children }: {
  number: number; title: string; state: "done" | "open" | "waiting"; answer?: string; next?: string; children?: ReactNode;
}) {
  return <Card>
    <div className="flex flex-wrap items-center gap-group">
      <CardTitle className={state === "waiting" ? "text-muted" : undefined}>{number}. {title}</CardTitle>
      {state === "done" && <><span className="min-w-0 flex-1 text-table wrap-anywhere">{answer}</span><Button variant="text" aria-label={`Zmień: ${title}`}>Zmień</Button></>}
    </div>
    {state === "open" && <div className="flex flex-col gap-between pt-panel">{children}{next && <Button className="w-fit">{next}</Button>}</div>}
  </Card>;
}

/** One stop of step 2: the place and its time in Warsaw time. */
export function StopFields({ title, place, status = "idle", options = [], time = {}, placeError, timeError }: {
  title: string; place?: PlaceOption; status?: PlaceSearchStatus; options?: PlaceOption[];
  time?: { date?: string; time?: string }; placeError?: string; timeError?: string;
}) {
  return <section className="flex min-w-0 flex-1 flex-col gap-group">
    <h2 className="text-section-title">{title}</h2>
    <Field label={`Miejsce: ${title.toLowerCase()}`} hint="Adres albo miasto" error={placeError} required>
      <PlacePicker status={status} options={options} defaultValue={place ?? null} labels={placePickerLabels} onAddPlace={() => undefined} />
    </Field>
    <Field label={`Czas: ${title.toLowerCase()}`} error={timeError} required>
      <ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={zonedDateTimeLabels} defaultDate={time.date} defaultTime={time.time} />
    </Field>
  </section>;
}

export const stopsDone = <div className="flex flex-col gap-section md:flex-row">
  <StopFields title="Załadunek" place={places.b} time={{ date: "2026-11-12", time: "12:00" }} />
  <StopFields title="Rozładunek" place={places.c} time={{ date: "2026-11-12", time: "13:00" }} />
</div>;

/** Step 3: freight with its currency, the wash question without a default answer, the optional order number. */
export function FreightAndWash({ freight = "60,00", freightHint, wash, washErrors = {}, extra }: {
  freight?: string; freightHint?: string; wash?: "none" | "ours"; washErrors?: { amount?: string; date?: string }; extra?: ReactNode;
}) {
  return <>
    <div className="flex flex-col gap-between md:flex-row">
      <Field label="Fracht netto" hint={freightHint} optionalText="opcjonalne" className="flex-1">
        <DecimalField kind="amount" currency="EUR" defaultValue={freight} />
      </Field>
      <Field label="Waluta frachtu" required>
        <Select defaultValue="EUR"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select>
      </Field>
    </div>
    <Field label="Mycie" hint="Odpowiedz wprost. Brak wyboru nie oznacza braku mycia." required>
      <RadioGroup defaultValue={wash}>
        <RadioGroupItem value="none" label="Bez mycia" />
        <RadioGroupItem value="ours" label="Nasze mycie" hint="Kwota i data mycia" />
      </RadioGroup>
    </Field>
    {wash === "ours" && <div className="flex flex-col gap-between md:flex-row">
      <Field label="Kwota mycia" error={washErrors.amount} required className="flex-1"><DecimalField kind="amount" currency="EUR" /></Field>
      <Field label="Data mycia" hint="Godzina opcjonalna" error={washErrors.date} required className="flex-1">
        <ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={zonedDateTimeLabels} timeOptional />
      </Field>
    </div>}
    {extra}
    <Field label="Numer zlecenia" optionalText="opcjonalne"><Input autoComplete="off" /></Field>
  </>;
}

/** The trip entry screen: three entry steps before the quote, the route beside them (N7a, N7c). */
export function TripEntry({ open, stops = stopsDone, freight, notice, overlay, routeStops = route }: {
  /** 1 vehicle, 2 places and times, 3 freight and wash. */
  open: 1 | 2 | 3; stops?: ReactNode; freight?: ReactNode; notice?: ReactNode; overlay?: ReactNode; routeStops?: RouteStop[];
}) {
  const state = (step: number) => (step < open ? "done" : step === open ? "open" : "waiting");
  const next = ["Dalej: miejsca i czasy", "Dalej: fracht i mycie", "Dalej: trasa"][open - 1];
  return <AppFrame {...dispatcherNavigation} account={account} width="centred"
    steps={<StepBar label="Postęp wyceny" steps={quoteSteps} current={open - 1} doneText="gotowe" />}
    panel={<Card><CardTitle>Trasa kursu</CardTitle><RouteStops label="Trasa kursu" timeZone="Warszawa" stops={routeStops} /></Card>} panelLabel="Trasa kursu">
    <div className="flex flex-col gap-between">
      <h1 className="text-page-title">Nowa wycena</h1>
      {notice}
      <EntryStep number={1} title="Auto" state={state(1)} next={next} answer={`${vehicles[0]!.name} · ${vehicles[0]!.free}`}>
        <Field label="Auto" required>
          <RadioGroup defaultValue="auto-01">{vehicles.map(vehicle => <RadioGroupItem key={vehicle.id} value={vehicle.id} label={vehicle.name} hint={vehicle.free} />)}</RadioGroup>
        </Field>
      </EntryStep>
      <EntryStep number={2} title="Miejsca i czasy" state={state(2)} next={next} answer="Miejsce B · 12.11.2026, 12:00 → Miejsce C · 13:00">{stops}</EntryStep>
      <EntryStep number={3} title="Fracht i mycie" state={state(3)} next={next} answer="60,00 EUR · bez mycia">{freight ?? <FreightAndWash />}</EntryStep>
    </div>
    {overlay}
  </AppFrame>;
}
