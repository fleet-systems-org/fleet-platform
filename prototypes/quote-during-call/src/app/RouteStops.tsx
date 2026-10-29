import { Card, CardTitle } from '@fleet-platform/ui/components/card';
import type { CustomerStopValue } from './CustomerStop';
const countries: Record<string, string> = { 'Miejsce A': 'PL', 'Miejsce B': 'DE', 'Miejsce C': 'CZ', 'Miejsce E': 'CH', 'Miasto D': 'PL' };
const placeLabel = (place: string) => place ? `${place} · ${countries[place] || 'dane fikcyjne'}` : 'Wybierz miejsce';
// N7b / R19.1: the route reads as stops and times, never scalable diagram text.
export function RouteStops({ loading, unloading, loadingDate, loadingTime, unloadingDate, unloadingTime, vehicle }: {
  loading: CustomerStopValue; unloading: CustomerStopValue;
  loadingDate: string; loadingTime: string; unloadingDate: string; unloadingTime: string; vehicle: string;
}) {
  const stops = [
    { label: 'Start', time: '11:00', date: '12.11.2026', place: 'Miejsce A · PL', details: [['Auto', vehicle ? `${vehicle}, wolne po K1` : 'Wybierz auto']] },
    { label: 'Załadunek', time: loadingTime, date: loadingDate, place: placeLabel(loading.place), details: [...(loading.customer ? [['Klient', loading.customer]] : []), ['Dojazd', '20 km, bez ładunku'], ['Uwaga', 'godzina fikcyjna']] },
    { label: 'Rozładunek', time: unloadingTime, date: unloadingDate, place: placeLabel(unloading.place), details: [...(unloading.customer ? [['Klient', unloading.customer]] : []), ['Z ładunkiem', '80 km'], ['Potem', unloading.place ? `auto wolne w ${unloading.place === 'Miejsce C' ? 'Miejscu C' : unloading.place}` : 'wybierz miejsce rozładunku']] },
  ];
  return <Card><CardTitle>Trasa kursu</CardTitle><ol className="route-stops">{stops.map(stop => <li className="route-stop" key={stop.label}>
    <strong>{stop.label}</strong><div><p className="route-time">{stop.time || '—'}</p><p className="text-meta">{stop.date || '—'} (Warszawa)</p><strong>{stop.place}</strong></div>
    <dl>{stop.details.map(([label, value]) => <div key={label}><dt className="text-meta">{label}</dt><dd>{value}</dd></div>)}</dl>
  </li>)}</ol><p className="route-caveat text-meta">Kilometry z symulacji mapy</p></Card>;
}
