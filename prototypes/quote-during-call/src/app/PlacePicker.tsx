import { useState } from "react";
import { Input } from "@fleet-platform/ui/components/input";
import { Button } from "@fleet-platform/ui/components/button";
// DS GAP G03: synthetic address suggestions; no geocoding service.
const places = [
  ['Miejsce A', 'PL', 'Region Alfa'], ['Miejsce B', 'DE', 'Region Beta'], ['Miejsce C', 'CZ', 'Region Gamma'],
  ['Miejsce E', 'CH', 'Region Epsilon'], ['Miasto D', 'PL', 'Region Delta'], ['Miasto D', 'PL', 'Region Omega'],
  ['Alfowo', 'PL', 'Region Alfa'], ['Betograd', 'DE', 'Region Beta'], ['Gammowo', 'CZ', 'Region Gamma'],
].map(([name, country, region]) => ({ name, label: `${name} · ${country} · ${region} · fikcyjne` }));
function PlaceInput({ id, label, onSelect }: { id: string; label: string; onSelect: (value: string) => void }) {
  const [query, setQuery] = useState(''); const [open, setOpen] = useState(false); const [index, setIndex] = useState(0);
  const results = query.trim() ? places.filter(p => p.label.toLocaleLowerCase('pl').includes(query.trim().toLocaleLowerCase('pl'))) : [];
  function choose(value: string) { setQuery(value); onSelect(value); setOpen(false); }
  return <div className="stack search-field"><label htmlFor={id} className="text-label">{label}</label><Input id={id} role="combobox" autoComplete="off" aria-autocomplete="list" aria-expanded={open && results.length > 0} aria-controls={`${id}-list`} aria-activedescendant={open && results[index] ? `${id}-${index}` : undefined}
    value={query} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onChange={e => { setQuery(e.target.value); onSelect(''); setIndex(0); setOpen(true); }} onKeyDown={e => {
      if (['Escape', 'ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) e.stopPropagation();
      if (e.key === 'Escape') { setOpen(false); e.preventDefault(); }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && results.length) { e.preventDefault(); setOpen(true); setIndex(i => (i + (e.key === 'ArrowDown' ? 1 : results.length - 1)) % results.length); }
      if (e.key === 'Enter' && open && results[index]) { e.preventDefault(); choose(results[index].name); }
    }} />
    {open && query && <ul id={`${id}-list`} role="listbox" aria-label={label} className="place-results">{results.map((p,i) => <li key={p.label} id={`${id}-${i}`} role="option" aria-selected={i === index} onMouseDown={e => e.preventDefault()} onClick={() => choose(p.name)}>{p.label}</li>)}{!results.length && <li role="presentation">Brak fikcyjnych miejsc. Spróbuj „Miejsce”.</li>}</ul>}
  </div>;
}
export function PlacePicker({ onApply }: { onApply: () => void }) {
  const [load, setLoad] = useState(''); const [unload, setUnload] = useState('');
  return <div className="stack"><p>Symulacja wyszukiwarki adresów — w produkcie geokodowanie (PLACE-3)</p><p className="text-meta">Wpisz pierwszą literę nazwy. Wszystkie miejsca i regiony są fikcyjne. Przykład wyceny obsługuje B → C.</p>
    <PlaceInput id="load-place" label="Miejsce załadunku" onSelect={setLoad}/><PlaceInput id="unload-place" label="Miejsce rozładunku" onSelect={setUnload}/>
    {load && unload && (load !== 'Miejsce B' || unload !== 'Miejsce C') && <p>Ta para nie ma wyceny w etapie 1. Wybierz Miejsce B → Miejsce C.</p>}
    <Button disabled={load !== 'Miejsce B' || unload !== 'Miejsce C'} onClick={onApply}>Zastosuj miejsca</Button>
  </div>;
}
