import { Fragment, useState } from 'react';
import { Card, CardTitle } from '@fleet-platform/ui/components/card';
import { Badge } from '@fleet-platform/ui/components/badge';
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
  { label: 'Myto', exact: '0,100000 EUR/km', source: 'Przykład specyfikacji', reason: 'Opłata planowana' },
  { label: 'AdBlue', exact: '0,010000 EUR/l', source: 'Przykład specyfikacji', reason: 'Zużycie planowane' },
  { label: 'Koszty auta', exact: '72,000000 EUR/dzień × 2/24 dnia = 6,00 EUR', source: 'Konfiguracja przykładu', reason: 'Czas kursu planowany' },
  { label: 'Praca', exact: '48,000000 EUR/dzień × 2/24 dnia = 4,00 EUR', source: 'Stawka zatwierdzona w przykładzie', reason: 'Czas kursu planowany' },
];
export function ValueDetails() {
  const [expanded, setExpanded] = useState(false);
  return <Card><CardTitle>K2 · źródła danych</CardTitle>
    <table className="compact-table value-details-table" role="table"><caption>Dokładne wartości i źródła</caption>
      <thead><tr>{['Wartość', 'Dokładnie', 'Pewność', 'Źródło', 'Data', 'Powód szacunku'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{values.map(row => <Fragment key={row.label}><tr>
        <th scope="row">{row.label === 'Koszty auta' ? <Button variant="text" aria-expanded={expanded} aria-controls="source-vehicle-costs" onClick={() => setExpanded(!expanded)}>Koszty auta · {expanded ? 'zwiń' : 'rozwiń'}</Button> : row.label}</th>
        <td data-label="Dokładnie" className="exact-value">{row.exact}</td><td data-label="Pewność">{row.reason && <Badge variant="estimate">Szacunek</Badge>}</td>
        <td data-label="Źródło" className="text-meta">{row.source}</td><td data-label="Data" className="text-meta source-date">12.11.2026</td><td data-label="Powód szacunku" className="text-meta">{row.reason || '—'}</td>
      </tr>{row.label === 'Koszty auta' && <tr id="source-vehicle-costs" hidden={!expanded}><td colSpan={6} className="vehicle-source-detail"><VehicleCostDetails/></td></tr>}</Fragment>)}</tbody>
    </table><p className="text-meta">Dane z przykładu specyfikacji; fikcyjne.</p>
  </Card>;
}
