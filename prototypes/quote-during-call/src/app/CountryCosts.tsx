import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { shareTenths, shareText, shareWidth } from './cost-shares';
import { decimal } from "./model";
// Integer-cent allocation: remainder belongs to the final country, preserving each segment total.
export function allocate(total: bigint, distances: bigint[]) {
  const sum = distances.reduce((a,b) => a+b, 0n);
  let remaining = total;
  return distances.map((km,i) => { const value = i === distances.length-1 ? remaining : total * km / sum; remaining -= value; return value; });
}
const segments = [
  { title: 'Dojazd A → B · bez ładunku', countries: ['PL','DE'], km: [12n,8n], fuel: 200n, toll: 200n },
  { title: 'Z ładunkiem B → C', countries: ['DE','CZ'], km: [50n,30n], fuel: 1600n, toll: 800n },
];
const money = (v: bigint) => decimal(v).replace('.', ',');
const routeTotal = segments.reduce((sum, segment) => sum + segment.fuel + segment.toll, 0n);
const routeKm = segments.reduce((sum, segment) => sum + segment.km.reduce((a, b) => a + b, 0n), 0n);
const routeFuel = segments.reduce((sum, segment) => sum + segment.fuel, 0n);
const routeToll = segments.reduce((sum, segment) => sum + segment.toll, 0n);

function CountryRow({ label, km, fuel, toll, group = false, total = false }: {
  label: string; km: bigint; fuel: bigint; toll: bigint; group?: boolean; total?: boolean;
}) {
  const share = shareTenths(decimal(fuel + toll), decimal(routeTotal));
  return <tr className={group ? 'country-group' : undefined}>
    <th scope={group ? 'rowgroup' : 'row'}>{label}<span className="country-meta text-meta">{String(km)} km · paliwo {money(fuel)} · myto {money(toll)}</span></th>
    <td className="country-detail">{String(km)}</td><td className="country-detail">{money(fuel)}</td><td className="country-detail">{money(toll)}</td>
    <td>{group || total ? <strong>{money(fuel + toll)}</strong> : money(fuel + toll)}</td>
    <td>{!group && (total ? `${shareText(share)} %` : <div className="share-cell"><span>{shareText(share)} %</span><span className="share-track" aria-hidden="true"><span style={{ width: shareWidth(share) }}/></span></div>)}</td>
  </tr>;
}

export function CountryCosts() {
  return <Card><CardTitle>Paliwo i myto według odcinka i kraju</CardTitle>
    <table className="compact-table country-cost-table"><caption>Kwoty netto · EUR</caption>
      <thead><tr><th scope="col">Kraj</th><th scope="col" className="country-detail">km</th><th scope="col" className="country-detail">Paliwo</th><th scope="col" className="country-detail">Myto</th><th scope="col">Razem</th><th scope="col">Udział</th></tr></thead>
      {segments.map(segment => {
        const fuel = allocate(segment.fuel, segment.km), toll = allocate(segment.toll, segment.km);
        return <tbody key={segment.title}>
          <CountryRow label={segment.title} km={segment.km.reduce((a, b) => a + b, 0n)} fuel={segment.fuel} toll={segment.toll} group/>
          {segment.countries.map((country, i) => <CountryRow key={country} label={country} km={segment.km[i]!} fuel={fuel[i]!} toll={toll[i]!}/>)}
        </tbody>;
      })}
      <tfoot><CountryRow label="Cały kurs" km={routeKm} fuel={routeFuel} toll={routeToll} total/></tfoot>
    </table>
    <p className="text-meta">Pozostałe koszty w wycenie: 10,18 EUR · łącznie 38,18 EUR.</p>
    <p className="text-meta">Podział km na kraje i koszty krajowe: fikcyjne. Kwoty netto w EUR; kilometry całe.</p>
    <p className="text-meta">Przedział 12.11.2026, 11:00–13:00 nie obejmuje weekendu.</p>
  </Card>;
}
