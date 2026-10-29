import { useState } from 'react';
import { Input } from '@fleet-platform/ui/components/input';
import { Button } from '@fleet-platform/ui/components/button';

// SCOPE PROPOSAL: customer directory (owner request 2026-10-29)
const demoPlaces = ['Miejsce A', 'Miejsce B', 'Miejsce C', 'Miejsce E', 'Miasto D'];
const customers = [
  { name: 'Klient Demo Alfa', city: 'Miasto D', places: ['Miejsce B'] },
  { name: 'Klient Demo Beta', city: 'Miejsce C', places: ['Miejsce C', 'Miejsce E', 'Miasto D'] },
  { name: 'Klient Demo Gamma', city: 'Miejsce A', places: ['Miejsce A', 'Miejsce B'] },
  { name: 'Klient Demo Delta', city: 'Miasto D', places: ['Miasto D'] },
  { name: 'Klient Demo Epsilon', city: 'Miejsce E', places: ['Miejsce E'] },
  { name: 'Klient Demo Zeta', city: 'Miejsce C', places: ['Miejsce C'] },
];
export type CustomerStopValue = { customer: string; place: string };
export const emptyStop = (): CustomerStopValue => ({ customer: '', place: '' });
function Search({ id, label, value, options, onChange, onSelect }: {
  id: string; label: string; value: string; options: { value: string; label: string }[];
  onChange: (value: string) => void; onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false); const [index, setIndex] = useState(0);
  const matches = value.trim() ? options.filter(option => option.label.toLocaleLowerCase('pl').includes(value.trim().toLocaleLowerCase('pl'))) : [];
  function choose(selected: string) { onSelect(selected); setOpen(false); }
  return <div className="stack"><label className="text-label" htmlFor={id}>{label} <span className="text-meta">(opcjonalne)</span></label>
    <Input id={id} role="combobox" autoComplete="off" value={value} aria-autocomplete="list" aria-expanded={open && matches.length > 0} aria-controls={`${id}-list`} aria-activedescendant={open && matches[index] ? `${id}-option-${index}` : undefined}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onChange={event => { onChange(event.target.value); setOpen(true); setIndex(0); }} onKeyDown={event => {
        if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) { event.stopPropagation(); event.preventDefault(); }
        if (event.key === 'Escape') setOpen(false);
        if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && matches.length) { setOpen(true); setIndex(i => (i + (event.key === 'ArrowDown' ? 1 : matches.length - 1)) % matches.length); }
        if (event.key === 'Enter' && open && matches[index]) choose(matches[index].value);
      }}/>
    {open && value.trim() && <ul className="place-results" id={`${id}-list`} role="listbox" aria-label={label}>{matches.map((option, i) => <li id={`${id}-option-${i}`} key={option.value} role="option" aria-selected={index === i} onMouseDown={event => event.preventDefault()} onClick={() => choose(option.value)}>{option.label}</li>)}{matches.length === 0 && <li role="presentation">Brak wyników w danych fikcyjnych.</li>}</ul>}
  </div>;
}
export function CustomerStop({ kind, value, onChange }: { kind: 'loading' | 'unloading'; value: CustomerStopValue; onChange: (value: CustomerStopValue) => void }) {
  const customer = customers.find(c => c.name === value.customer);
  const [query, setQuery] = useState(value.customer);
  const word = kind === 'loading' ? 'załadunku' : 'rozładunku';
  return <section className="stack">
    <Search id={`${kind}-customer`} label={`Klient ${word}`} value={query} options={customers.map(c => ({ value: c.name, label: `${c.name} · ${c.city}` }))}
      onChange={text => { setQuery(text); onChange({ ...value, customer: '' }); }} onSelect={name => { const selected = customers.find(c => c.name === name)!; setQuery(name); onChange({ customer: name, place: selected.places.length === 1 ? selected.places[0]! : '' }); }}/>
    {customer && customer.places.length > 1 && <div className="stack"><p className="text-label">Zapisane miejsca klienta · wybierz jedno</p><div className="actions">{customer.places.map(place => <Button key={place} variant="secondary" aria-pressed={value.place === place} onClick={() => onChange({ ...value, place })}>{place}</Button>)}</div></div>}
    <Search id={`${kind}-place`} label={`Miejsce ${word}`} value={value.place} options={demoPlaces.map(place => ({ value: place, label: `${place} · dane fikcyjne` }))} onChange={place => onChange({ ...value, place })} onSelect={place => onChange({ ...value, place })}/>
    <p className="text-meta">Baza klientów — propozycja spoza specyfikacji; dane fikcyjne. zarządzanie bazą — poza prototypem</p>
  </section>;
}
export function CustomerRoute({ loading, unloading }: { loading: CustomerStopValue; unloading: CustomerStopValue }) {
  return <div className="text-body"><p>Klient załadunku: {loading.customer || 'nie wybrano'} · {loading.place || 'miejsce nie wybrane'}</p><p>Klient rozładunku: {unloading.customer || 'nie wybrano'} · {unloading.place || 'miejsce nie wybrane'}</p></div>;
}
