import { Fragment, useState } from 'react';
import { Card, CardTitle } from '@fleet-platform/ui/components/card';
import { ValueWithSource } from '@fleet-platform/ui/components/values/value-with-source';
import { valueLabels } from './model';
import { Button } from '@fleet-platform/ui/components/button';
import { VehicleCostDetails } from './Quote';

// EV-4 / D65 / FIN-3: this is the accessible exact-value view, with evidence inline.
// Strings retain the published scale; no money or fuel passes through Number.
const values = [
  { label: 'Dojazd', exact: '20,000 km', source: 'Trasa przykładu', reason: 'Trasa planowana' },
  { label: 'Odcinek z ładunkiem', exact: '80,000 km', source: 'Trasa przykładu', reason: 'Trasa planowana' },
  { label: 'Fracht', exact: '60,00 EUR', source: 'Wpis wyceny', reason: '' },
  { label: 'Cena paliwa', exact: '1,000000 EUR/l', source: 'Przykład specyfikacji', reason: 'Cena dla przyszłego kursu' },
  { label: 'Spalanie · pusty', exact: '10,000000 l/100 km', source: 'Przykład specyfikacji', reason: 'Zużycie planowane' },
  { label: 'Spalanie · załadowany', exact: '20,000000 l/100 km', source: 'Przykład specyfikacji', reason: 'Zużycie planowane' },
  { label: 'Paliwo', exact: '18,000 l', source: 'Dystans × spalanie', reason: 'Z szacowanych odcinków' },
  { label: 'Myto PL', exact: '0,100400 EUR/km', source: 'Fikcyjna stawka krajowa PL', reason: 'Opłata planowana' },
  { label: 'Myto DE', exact: '0,099400 EUR/km', source: 'Fikcyjna stawka krajowa DE', reason: 'Opłata planowana' },
  { label: 'Myto CZ', exact: '0,101000 EUR/km', source: 'Fikcyjna stawka krajowa CZ', reason: 'Opłata planowana' },
  { label: 'AdBlue', exact: '0,010000 EUR/l', source: 'Przykład specyfikacji', reason: 'Zużycie planowane' },
  { label: 'Koszty auta', exact: '72,000000 EUR/dzień × 2/24 dnia = 6,00 EUR', source: 'Konfiguracja przykładu', reason: 'Czas kursu planowany' },
  { label: 'Praca', exact: '48,000000 EUR/dzień × 2/24 dnia = 4,00 EUR', source: 'Stawka zatwierdzona w przykładzie', reason: 'Czas kursu planowany' },
];
export function ValueDetails({ amount = "60.00" }: { amount?: string }) {
  const [expanded, setExpanded] = useState(false);
  return <Card><CardTitle>K2 · źródła danych</CardTitle>
    <table className="compact-table value-details-table" role="table"><caption>Dokładne wartości i źródła</caption>
      <thead><tr>{['Wartość', 'Dokładnie', 'Źródło', 'Data', 'Powód szacunku'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{values.map(row => <Fragment key={row.label}><tr>
        <th scope="row">{row.label === 'Koszty auta' ? <Button variant="text" aria-expanded={expanded} aria-controls="source-vehicle-costs" onClick={() => setExpanded(!expanded)}>Koszty auta · {expanded ? 'zwiń' : 'rozwiń'}</Button> : row.label}</th>
        <td data-label="Dokładnie" className="exact-value"><ValueWithSource state="known" label={row.label} labels={valueLabels} value={row.label === 'Fracht' ? amount : row.exact.split(' ')[0]!.replace(',', '.')} unit={row.exact.split(' ').slice(1).join(' ')} certainty={row.reason ? 'estimated' : 'certain'} source={{ name: row.source, date: '12.11.2026' }} reason={row.reason || undefined}/></td>
        <td data-label="Źródło" className="text-meta">{row.source}</td><td data-label="Data" className="text-meta source-date">12.11.2026</td><td data-label="Powód szacunku" className="text-meta">{row.reason || '—'}</td>
      </tr>{row.label === 'Koszty auta' && <tr id="source-vehicle-costs" hidden={!expanded}><td colSpan={5} className="vehicle-source-detail"><VehicleCostDetails/></td></tr>}</Fragment>)}</tbody>
    </table><p className="text-meta">Dane z przykładu specyfikacji; fikcyjne.</p>
  </Card>;
}
