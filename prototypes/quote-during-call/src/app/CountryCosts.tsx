import { useEffect, useState } from "react";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { Alert } from "@fleet-platform/ui/components/alert";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { shareTenths, shareText, shareWidth } from "./cost-shares";
import { coveredCost, decimal } from "./model";

// Synthetic EUR/km at scale 6. Country costs are distance × rate, never an allocated segment amount (SRC-4).
const segments = [
  { title: "Dojazd A → B · bez ładunku", rows: [{ country: "PL", km: "12", fuelRate: "100000", tollRate: "100400" }, { country: "DE", km: "8", fuelRate: "100000", tollRate: "99400" }] },
  { title: "Z ładunkiem B → C", rows: [{ country: "DE", km: "50", fuelRate: "200000", tollRate: "99400" }, { country: "CZ", km: "30", fuelRate: "200000", tollRate: "101000" }] },
];
const publish = (micro: bigint) => (micro + 5000n) / 10000n; // FIN-3 half-up for these nonnegative fixture costs.
const money = (cents: bigint) => decimal(cents).replace(".", ",");
const validKm = (text: string) => /^\d+$/.test(text) && text.length <= 5;

function CountryRow({ label, km, fuel, toll, group = false, total = false, manual = false }: {
  label: string; km: bigint; fuel: bigint; toll: bigint; group?: boolean; total?: boolean; manual?: boolean;
}) {
  const totalCents = publish(fuel + toll);
  const share = shareTenths(decimal(totalCents), coveredCost);
  const reconciliation = totalCents - publish(fuel) - publish(toll);
  return <tr className={group ? "country-group" : undefined}>
    <th scope={group ? "rowgroup" : "row"}>{label}<span className="country-meta text-meta">{String(km)} km · paliwo {money(publish(fuel))} · myto {money(publish(toll))}{manual ? " · wpis ręczny · Szacunek" : ""}</span>{reconciliation !== 0n && <span className="block text-meta">Uzgodnienie zaokrągleń: {money(reconciliation)} EUR</span>}</th>
    <td className="country-detail">{String(km)}</td><td className="country-detail">{money(publish(fuel))}</td><td className="country-detail">{money(publish(toll))}</td>
    <td>{group || total ? <strong>{money(totalCents)}</strong> : money(totalCents)}</td>
    <td>{!group && (total ? `${shareText(share)} %` : <div className="share-cell"><span>{shareText(share)} %</span><span className="share-track" aria-hidden="true"><span style={{ width: shareWidth(share) }}/></span></div>)}</td>
  </tr>;
}

export function CountryCosts({ manual = false, onReady }: { manual?: boolean; onReady: (ready: boolean) => void }) {
  const [distances, setDistances] = useState<Record<string, string>>({});
  const ready = !manual || segments.every((segment, index) => segment.rows.every(row => distances[`${index}-${row.country}`] === row.km));
  useEffect(() => { onReady(ready); }, [onReady, ready]);
  const calculated = segments.map((segment, index) => ({ ...segment, rows: segment.rows.map(row => {
    const text = manual ? distances[`${index}-${row.country}`] ?? "" : row.km;
    const km = validKm(text) ? BigInt(text) : null;
    return { ...row, km, fuel: km === null ? null : km * BigInt(row.fuelRate), toll: km === null ? null : km * BigInt(row.tollRate) };
  }) }));
  const complete = calculated.every(segment => segment.rows.every(row => row.km !== null));
  const sum = (rows: typeof calculated[number]["rows"], key: "km" | "fuel" | "toll") => rows.reduce((value, row) => value + (row[key] ?? 0n), 0n);
  const allRows = calculated.flatMap(segment => segment.rows);
  const exact = sum(allRows, "fuel") + sum(allRows, "toll");
  const displayed = allRows.reduce((value, row) => value + publish(row.fuel ?? 0n) + publish(row.toll ?? 0n), 0n);
  return <Card><CardTitle>Paliwo i myto według odcinka i kraju</CardTitle>
    {manual && <><Alert variant="neutral" title="Uwaga · Usługa trasy niedostępna">Wpisz kilometry na kraj. Dane ręczne są szacunkiem. Przykład wyceny obsługuje 12 / 8 km dojazdu i 50 / 30 km z ładunkiem.</Alert>
      <div className="form-grid">{segments.flatMap((segment, index) => segment.rows.map(row => <Field key={`${index}-${row.country}`} label={`${segment.title} · ${row.country} · km`} required error={distances[`${index}-${row.country}`] && !validKm(distances[`${index}-${row.country}`]!) ? "Wpisz całe, nieujemne km (do 5 cyfr)." : undefined}>
        <Input inputMode="numeric" value={distances[`${index}-${row.country}`] ?? ""} onChange={event => setDistances(values => ({ ...values, [`${index}-${row.country}`]: event.target.value }))}/>
      </Field>))}</div></>}
    {!complete ? <p>Brak kilometrów. Uzupełnij każdy kraj; brak danych nie oznacza zera.</p> : <><table className="compact-table country-cost-table"><caption>Kwoty netto · EUR · Szacunek</caption>
      <thead><tr><th scope="col">Kraj</th><th scope="col" className="country-detail">km</th><th scope="col" className="country-detail">Paliwo</th><th scope="col" className="country-detail">Myto</th><th scope="col">Razem</th><th scope="col">Udział</th></tr></thead>
      {calculated.map(segment => <tbody key={segment.title}><CountryRow label={segment.title} km={sum(segment.rows, "km")} fuel={sum(segment.rows, "fuel")} toll={sum(segment.rows, "toll")} group/>
        {segment.rows.map(row => <CountryRow key={row.country} label={row.country} km={row.km!} fuel={row.fuel!} toll={row.toll!} manual={manual}/>)}</tbody>)}
      <tfoot><CountryRow label="Cały kurs" km={sum(allRows, "km")} fuel={sum(allRows, "fuel")} toll={sum(allRows, "toll")} total/></tfoot>
    </table>{publish(exact) !== displayed && <p className="text-meta">Uzgodnienie zaokrągleń: {money(publish(exact) - displayed)} EUR. Suma liczona raz z wartości dokładnych: {money(publish(exact))} EUR.</p>}</>}
    <p className="text-meta">Udział w całym koszcie przykładu K2: 38,18 EUR. Pozostałe koszty: 10,18 EUR. Inne km nie zmieniają stałej wyceny K2; przycisk Wyceń wymaga km przykładu.</p>
    <p className="text-meta">Stawki fikcyjne EUR/km: paliwo dojazd 0,100000, z ładunkiem 0,200000; myto PL 0,100400, DE 0,099400, CZ 0,101000. Koszt = km × stawka. Każda suma zaokrąglona raz z dokładnych wartości (FIN-3).</p>
    <p className="text-meta">12.11.2026, 11:00–13:00 (Warszawa), bez weekendu. Bez usług mapowych.</p>
  </Card>;
}
