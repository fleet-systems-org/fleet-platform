import { useState } from "react";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { Button } from "@fleet-platform/ui/components/button";
import { Field } from "@fleet-platform/ui/components/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fleet-platform/ui/components/select";
import { ZonedDateTimeField } from "@fleet-platform/ui/components/time/zoned-date-time-field";
import { ErrorMessage } from "@fleet-platform/ui/backend/feedback/ErrorMessage";
import { SuccessMessage } from "@fleet-platform/ui/backend/feedback/SuccessMessage";
import { dateLabels, timeErrors } from "./model";
import { StateNotice } from "./StateNotice";

const places = ["Miejsce A", "Miejsce B", "Miejsce C", "Miejsce E"];

// s08: where and exactly when the vehicle finishes its current work (VehicleStart, D55). Simulation only.
export function VehicleStart({ stateId, vehicle, initial, onSaved }: {
  stateId: string; vehicle: string; initial?: { place: string; date: string; time: string };
  onSaved: (place: string, date: string, time: string) => void;
}) {
  const [place, setPlace] = useState(initial?.place ?? "");
  const [when, setWhen] = useState<{ date: string; time: string } | null>(initial ? { date: initial.date, time: initial.time } : null);
  const [timeError, setTimeError] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  return <div className="stack"><h1 className="text-page-title">Punkt startowy auta · {vehicle}</h1>
    <StateNotice stateId={stateId}/>
    <Card><CardTitle>Gdzie i kiedy auto skończy obecną pracę</CardTitle>
      <form className="stack" noValidate onSubmit={event => {
        event.preventDefault(); setSaved(false);
        if (!place || !when) { setError(`Nie zapisano. Brakuje: ${[!place && "miejsca", !when && "czasu"].filter(Boolean).join(" i ")}.`); return; }
        // s08.5: the simulated server rejects a stale version; the typed values stay in the form.
        if (stateId === "s08.5") { setError("Punkt startowy zmienił się w międzyczasie. Twoje dane zostały w formularzu; sprawdź je i zapisz ponownie."); return; }
        setError(""); setSaved(true); onSaved(place, when.date, when.time);
      }}>
        <Field label="Miejsce startu" required><Select value={place} onValueChange={value => { setPlace(value); setError(""); }}><SelectTrigger aria-label="Miejsce startu"><SelectValue placeholder="Wybierz zapisane miejsce" /></SelectTrigger>
          <SelectContent>{places.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Czas startu" required error={timeError || undefined}><ZonedDateTimeField required timeZone="Europe/Warsaw" zoneLabel="czas warszawski" labels={dateLabels} defaultDate={initial?.date ?? ""} defaultTime={initial?.time ?? ""}
          onZonedChange={value => { setWhen(value.ok && value.time ? { date: value.date, time: value.time } : null); setTimeError(value.ok ? "" : timeErrors[value.reason] ?? ""); setError(""); }} /></Field>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {saved && <SuccessMessage>Punkt startowy zapisany w symulacji. Auto wolne od {when?.time} · {place}.</SuccessMessage>}
        <div className="actions"><Button type="submit">Zapisz punkt startowy</Button><Button variant="secondary" asChild><a href="#s09">Wróć do wpisu kursu</a></Button></div>
      </form>
      <p className="text-meta">Bez historii auta. Start bez kontekstu da się zapisać, ale wycena pozostaje niepełna, dopóki brakuje miejsca albo czasu. Wpisuje dyspozytor i właściciel. Dane fikcyjne.</p>
    </Card>
  </div>;
}
