import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { decimal } from "./model";
// Integer-cent allocation: remainder belongs to the final country, preserving each segment total.
export function allocate(total: bigint, distances: bigint[]) {
  const sum = distances.reduce((a,b) => a+b, 0n);
  let remaining = total;
  return distances.map((km,i) => { const value = i === distances.length-1 ? remaining : total * km / sum; remaining -= value; return value; });
}
const segments = [
  { title: 'Dojazd A → B', countries: ['PL','DE'], km: [12n,8n], fuel: 200n, toll: 200n },
  { title: 'Z ładunkiem B → C', countries: ['DE','CZ'], km: [50n,30n], fuel: 1600n, toll: 800n },
];
const money = (v: bigint) => decimal(v).replace('.', ',');
export function CountryCosts() {
  return <><p className="text-meta">Podział km na kraje i koszty krajowe: fikcyjne. Kwoty netto w EUR; kilometry całe.</p><div className="two-columns">{segments.map(s => {
    const fuel = allocate(s.fuel,s.km), toll = allocate(s.toll,s.km);
    return <Card key={s.title}><CardTitle>{s.title}</CardTitle><table className="compact-table"><caption>Podział fikcyjny · EUR</caption><thead><tr><th>Kraj</th><th>km</th><th>Paliwo</th><th>Myto</th></tr></thead><tbody>{s.countries.map((c,i) => <tr key={c}><th>{c}</th><td>{String(s.km[i])}</td><td>{money(fuel[i])}</td><td>{money(toll[i])}</td></tr>)}</tbody><tfoot><tr><th>Suma</th><td>{String(s.km.reduce((a,b)=>a+b))}</td><td>{money(s.fuel)}</td><td>{money(s.toll)}</td></tr></tfoot></table><p>Paliwo + myto: <strong>{money(s.fuel+s.toll)} EUR</strong></p></Card>;
  })}</div><Card><CardTitle>Cały kurs · 100 km</CardTitle><p>Paliwo: 18,00 EUR · Myto: 10,00 EUR · Razem: 28,00 EUR</p><p className="text-meta">Podział proporcjonalny na groszach. Reszta zaokrąglenia trafia do ostatniego kraju odcinka; w tym przykładzie korekta wynosi 0,00 EUR. Pozostałe koszty w wycenie: 10,18 EUR. Łącznie 38,18 EUR.</p></Card></>;
}
