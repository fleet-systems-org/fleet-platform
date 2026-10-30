import { useEffect, useState } from "react";
import { PlacePicker, type PlaceOption, type PlacePickerLabels, type PlaceSearchStatus } from "@fleet-platform/ui/components/places/place-picker";
import { Field } from "@fleet-platform/ui/components/field";
import { Button } from "@fleet-platform/ui/components/button";
import { Alert } from "@fleet-platform/ui/components/alert";
import { SuccessMessage } from "@fleet-platform/ui/backend/feedback/SuccessMessage";

const labels: PlacePickerLabels = {
  kinds: { place: "Zapisane miejsce", address: "Adres", town: "Tylko miasto" },
  needsConfirmation: "Do potwierdzenia", noCountry: "kraj niepotwierdzony", typedAs: "wpisano",
  searching: "Szukam…", notFound: "Nie znaleziono adresu. Wybierz zapisane miejsce lub miasto firmy.",
  unavailable: "Wyszukiwanie adresów jest niedostępne. Wybierz zapisane miejsce lub miasto firmy.",
  results: count => `Wyniki: ${count}`, addPlace: "Dodaj miejsce",
};
const saved: PlaceOption[] = [
  { id: "a", kind: "place", name: "Miejsce A", detail: "ul. Przykładowa 1, Miasto A", country: "PL" },
  { id: "b", kind: "place", name: "Miejsce B", detail: "Beispielstraße 2, Miasto B", country: "DE" },
];
const towns: PlaceOption[] = [
  { id: "town-b", kind: "town", name: "Miasto B", detail: "Region Beta · Szacunek", country: "DE" },
  { id: "town-c", kind: "town", name: "Miasto C", detail: "Region Gamma · Szacunek", country: "CZ" },
];
const addresses: PlaceOption[] = [
  { id: "c", kind: "address", name: "Miejsce C", detail: "Ukázková 3, Miasto C", country: "CZ" },
  { id: "e", kind: "address", name: "Miejsce E", detail: "Beispielweg 5, Miasto E", country: "CH" },
];
type Scenario = "results" | "notFound" | "unavailable" | "searching";
const normalize = (text: string) => text.trim().toLocaleLowerCase("pl");

// Page-owned synthetic server responses. The picker only renders options/status (L08, L09).
function Endpoint({ label, scenario, ownPlaces, onSelect, onSave }: {
  label: string; scenario: Scenario; ownPlaces: PlaceOption[];
  onSelect: (option: PlaceOption | null) => void; onSave: (option: PlaceOption) => void;
}) {
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<PlaceOption | null>(null);
  const [status, setStatus] = useState<PlaceSearchStatus>(scenario === "results" ? "idle" : scenario);
  const [options, setOptions] = useState(ownPlaces);
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (scenario !== "results" || !query.trim()) return;
    // A simulated successful response, not a client-side timeout or failure cutoff.
    const response = setTimeout(() => {
      const matches = [...ownPlaces, ...addresses.filter(address => !ownPlaces.some(place => place.id === address.id))].filter(option => normalize(`${option.name} ${option.detail}`).includes(normalize(query)));
      setStatus(matches.length ? "results" : "notFound");
      setOptions(matches.length ? matches : [...ownPlaces, ...towns]);
    }, 300);
    return () => clearTimeout(response);
  }, [query, scenario, ownPlaces]);
  return <div className="stack"><Field label={label} required>
    <PlacePicker key={version} defaultValue={chosen} labels={labels} options={scenario === "results" ? (query.trim() ? options : ownPlaces) : [...ownPlaces, ...towns]} status={scenario === "results" ? status : scenario}
      onQueryChange={text => { setQuery(text); setStatus(text.trim() ? "searching" : "idle"); setMessage(""); }} onSelect={option => { setChosen(option); onSelect(option); setMessage(""); }}
      onAddPlace={option => { const place: PlaceOption = { ...option, kind: "place" }; onSave(place); setChosen(place); onSelect(place); setVersion(value => value + 1); setMessage("Miejsce zapisane w symulacji."); }}/>
  </Field>
    {chosen?.kind === "town" && <Alert variant="neutral" title="Uwaga · Tylko miasto">Punkt i odległość są szacunkiem. Wybór nie potwierdza dokładnego adresu.</Alert>}
    {message && <SuccessMessage>{message}</SuccessMessage>}
  </div>;
}

export function PlaceSelection({ onApply }: { onApply: (loading: PlaceOption, unloading: PlaceOption) => void }) {
  const [scenario, setScenario] = useState<Scenario>("results");
  const [ownPlaces, setOwnPlaces] = useState(saved);
  const [loading, setLoading] = useState<PlaceOption | null>(null);
  const [unloading, setUnloading] = useState<PlaceOption | null>(null);
  return <div className="stack"><p className="text-meta">Symulacja wyszukiwarki. Wszystkie adresy i miasta są fikcyjne. Przykład K2: Miejsce B → Miejsce C.</p>
    <Field label="Symulowana odpowiedź mapy"><select aria-label="Symulowana odpowiedź mapy" className="scenario-select" value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setLoading(null); setUnloading(null); }}>
      <option value="results">Adresy znalezione</option><option value="notFound">Brak wyników</option><option value="unavailable">Mapa niedostępna</option><option value="searching">Szukam…</option>
    </select></Field>
    {(["Załadunek", "Rozładunek"] as const).map((word, index) => <Endpoint key={`${scenario}-${word}`} label={`Miejsce ${index === 0 ? "załadunku" : "rozładunku"}`} scenario={scenario} ownPlaces={ownPlaces}
      onSelect={index === 0 ? setLoading : setUnloading} onSave={place => setOwnPlaces(values => [...values.filter(value => value.id !== place.id), place])}/>)}
    <p className="text-meta">Wybierz oba punkty. Inne pary niż B → C można wpisać; ich wycena dojdzie w etapie 2.</p>
    <Button disabled={!loading || !unloading} onClick={() => { if (loading && unloading) onApply(loading, unloading); }}>Zastosuj miejsca</Button>
  </div>;
}
