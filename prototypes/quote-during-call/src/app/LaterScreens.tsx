import { useState } from "react";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Button } from "@fleet-platform/ui/components/button";
import { Alert } from "@fleet-platform/ui/components/alert";
import { DataTable } from "@fleet-platform/ui/backend/tables/DataTable";
import { tableMessages, vehicles } from "./model";
import { StateNotice, replacesContent } from "./StateNotice";

// Synthetic fleet rows (Phase 2). Availability comes from the same fixtures as step 1 of s09; no live GPS (#23 AC4).
const fleetStatus: Record<string, string> = {
  "Auto 01": "Dojazd po ostatnim rozładunku: czeka na kurs",
  "Auto 02": "Brak kursów i punktu startowego",
  "Auto 03": "Tylko punkt startowy",
  "Auto 04": "Szkic przez weekend",
  "Auto 05": "Przyjęty kurs · Do przeglądu",
  "Auto 06": "Przyjęty kurs · kraj poza biuletynem",
};

export function Fleet({ stateId, owner, acceptedK2, onQuote }: { stateId: string; owner: boolean; acceptedK2: boolean; onQuote: (vehicle: string) => void }) {
  const [page, setPage] = useState(1);
  const rows = stateId === "s06.9" ? [] : vehicles.map(([name, free, driver, tractor]) => ({
    name, label: `${driver} · ${tractor}`, free: name === "Auto 01" && acceptedK2 ? "Wolne od 13:00 · Miejsce C" : free, status: fleetStatus[name] ?? "Przyjęty kurs",
  }));
  return <div className="stack"><h1 className="text-page-title">Flota: gdzie i kiedy auta wolne</h1>
    {owner && stateId === "s06.10" && <Alert variant="neutral" title="Uwaga · Dane z kart paliwowych są starsze niż próg">Ceny paliwa w wycenach mogą być nieaktualne. Sprawdź import kart.</Alert>}
    {replacesContent(stateId) && stateId !== "s06.9" ? <StateNotice stateId={stateId}/> : <Card>
      <DataTable rows={rows.slice((page - 1) * 10, page * 10)} rowKey={row => row.name} caption="Auta firmy · 12.11.2026, 09:30 (Warszawa)" page={page} pageSize={10} total={rows.length} onPageChange={setPage}
        messages={{ ...tableMessages, empty: "Brak aut. Lista z telematyki jest pusta albo niedostępna." }}
        columns={[
          { key: "vehicle", header: "Kierowca i ciągnik", cell: row => <strong>{row.label}</strong> },
          { key: "free", header: "Wolne gdzie i od kiedy", cell: row => <span>{row.free}</span> },
          { key: "status", header: "Stan", cell: row => <Badge variant="neutral">{row.status}</Badge> },
        ]}
        actions={row => <div className="actions"><Button variant="secondary" onClick={() => onQuote(row.name)}>Wyceń</Button>{row.name === "Auto 02" && <Button variant="text" asChild><a href="#s08">Punkt startowy</a></Button>}</div>}/>
      <p className="text-meta">Bez pozycji GPS na żywo: „wolne” wynika z kursów i punktów startowych. Dane fikcyjne.</p>
    </Card>}
  </div>;
}

// History rows from the screen map's fixture (s17): invoices, one tool trip; the reverse invoice C → B is omitted (#26 AC2).
const history = [
  { key: "f1", date: "08.09.2026", route: "Miasto B → Miasto C", price: "58,00 EUR", source: "Faktura · Szacunek", result: "—", empty: "—" },
  { key: "f2", date: "22.09.2026", route: "Miasto B → Miasto C", price: "62,00 EUR", source: "Faktura · Szacunek", result: "—", empty: "—" },
  { key: "f3", date: "06.10.2026", route: "Miasto B → Miasto C", price: "250,00 PLN", source: "Faktura · Szacunek", result: "—", empty: "—" },
  { key: "t1", date: "—", route: "Miejsce B → Miejsce C", price: "60,00 EUR", source: "Kurs z narzędzia · plan", result: "21,82 EUR", empty: "20 km" },
];

export function SimilarTrips({ stateId }: { stateId: string }) {
  const rows = stateId === "s17.5" ? [] : stateId === "s17.7" ? history.map(row => row.key === "f2" ? { ...row, route: "Nierozpoznane miejsce → Miasto C", source: "Faktura · miejsce do przypisania" } : row) : history;
  return <div className="stack"><h1 className="text-page-title">Podobne kursy · Miasto B → Miasto C</h1>
    {replacesContent(stateId) && stateId !== "s17.5" ? <StateNotice stateId={stateId}/> : <Card>
      <DataTable rows={rows} rowKey={row => row.key} caption="Ten sam kierunek, cena źródłowa w swojej walucie" page={1} pageSize={10} total={rows.length} onPageChange={() => {}}
        messages={{ ...tableMessages, empty: "Brak podobnych kursów. Wycena liczy się dalej." }}
        columns={[
          { key: "date", header: "Data", cell: row => row.date },
          { key: "route", header: "Kierunek", cell: row => row.route },
          { key: "price", header: "Cena źródłowa", cell: row => <span>{row.price}<span className="block text-meta">{row.source}</span></span> },
          { key: "result", header: "Wynik planu", cell: row => row.result },
          { key: "empty", header: "Puste km", cell: row => row.empty },
        ]}/>
      <p className="text-meta">Kierunek odwrotny (Miasto C → Miasto B) pominięty. Kwoty w PLN nie są przeliczane ani układane jako EUR. Faktury nie mają wyniku ani pustych km. Dane fikcyjne.</p>
    </Card>}
    <Button variant="secondary" asChild><a href="#s12">Wróć do wyceny</a></Button>
  </div>;
}

// s19: words carry the verdict; no green badge without evidence (#24, UI Fleet).
const legs = [
  { key: "k2a", trip: "K2 · dojazd A → B", km: "20", status: "Zgodne", note: "Każdy km w jednym kursie, w przedziale z dowodem" },
  { key: "k2b", trip: "K2 · z ładunkiem B → C", km: "80", status: "Niezweryfikowane", note: "Brak dowodów z telematyki; nie liczę jako zgodne ani zero" },
  { key: "k3", trip: "K3 · szkic", km: "—", status: "Brak danych", note: "Telematyka nie przysłała odcinka" },
  { key: "gap", trip: "Między K1 i K2", km: "—", status: "Do przeglądu", note: "Luka albo nakładanie: K1 i K2" },
  { key: "k5", trip: "Kierowca E · DEMO 005", km: "—", status: "Do przeglądu", note: "Sprzeczne odczyty albo reset licznika" },
  { key: "open", trip: "Po ostatnim rozładunku", km: "—", status: "Jeszcze nieprzypisane", note: "Otwarty dojazd, nie luka" },
];

export function KmCheck() {
  return <div className="stack"><h1 className="text-page-title">Kontrola kilometrów · Kierowca A · DEMO 001</h1>
    <Card><CardTitle>Odcinki i dowody</CardTitle>
      <DataTable rows={legs} rowKey={row => row.key} caption="Kilometry z telematyki, całe km; „—” bez danych" page={1} pageSize={10} total={legs.length} onPageChange={() => {}} messages={tableMessages}
        columns={[
          { key: "trip", header: "Odcinek", cell: row => row.trip },
          { key: "km", header: "km", cell: row => row.km },
          { key: "status", header: "Stan", cell: row => <span className="stack"><Badge variant="neutral">{row.status}</Badge><span className="text-meta">{row.note}</span></span> },
        ]}/>
      <p className="text-meta">Otwarty dojazd przez północ końca miesiąca jest jednym odcinkiem, nie dwoma. Wszystkie odczyty fikcyjne.</p>
    </Card>
    <Button variant="secondary" asChild><a href="#s07">Wróć do kursów auta</a></Button>
  </div>;
}
