import { useState } from 'react';
import { Button } from '@fleet-platform/ui/components/button';
import { Card } from '@fleet-platform/ui/components/card';
import { Badge } from '@fleet-platform/ui/components/badge';
import { Field } from '@fleet-platform/ui/components/field';
import { DecimalField } from '@fleet-platform/ui/components/values/decimal-field';
import { Textarea } from '@fleet-platform/ui/components/textarea';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@fleet-platform/ui/components/dialog';
import { SuccessMessage } from '@fleet-platform/ui/backend/feedback/SuccessMessage';
import { DataTable } from '@fleet-platform/ui/backend/tables/DataTable';
import { parseDecimalInput } from '@fleet-platform/ui/lib/decimal';
import { tableMessages } from './model';
import { StateNotice } from './StateNotice';

// Only component composition. No source service or quote revision is written by this fixture.
export function CompleteValue({ stateId }: { stateId: string }) {
  const [value, setValue] = useState('1,000000');
  const [reason, setReason] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  return <Card><h1 className="text-page-title">Uzupełnienie danej</h1><p>Dane fikcyjne. Symulacja wpisu ceny paliwa; stała wycena K2 nie jest przeliczana.</p>
    <StateNotice stateId={stateId}/>
    {saved && <SuccessMessage>Wpis zachowany w symulacji: kto (konto demo), kiedy (12.11.2026, 09:30) i powód. Stała wycena K2 nie jest przeliczana.</SuccessMessage>}
    <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button>Uzupełnij cenę paliwa</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Uzupełnij cenę paliwa</DialogTitle><DialogDescription>Wpis ręczny jest szacunkiem. Podaj cenę netto i źródło, bez danych osobowych. To symulacja, bez zapisu do serwera.</DialogDescription></DialogHeader>
        <form className="stack" onSubmit={event => { event.preventDefault(); const parsed = parseDecimalInput(value, { kind: 'unitPrice' });
          // FIN-1: decimal comma accepted, other notation rejected with an example. FIN-4: out of range is rejected, never clamped.
          if (!parsed.ok) { setError(`Zapis „${value}” odrzucony. Wpisz liczbę z przecinkiem, np. 1,500000.`); return; }
          if (/^-|^0+(\.0+)?$/.test(parsed.value)) { setError('Poza zakresem: cena musi być większa od zera. Wartość odrzucona, nie obcięta.'); return; }
          if (!reason.trim()) { setError('Wpisz źródło i powód wpisu.'); return; }
          if (stateId === 's14.6') { setError('Dana zmieniła się w międzyczasie. Twój wpis został w formularzu; sprawdź go i zapisz ponownie.'); return; }
          setError(''); setSaved(true); setOpen(false); }}>
          <Field label="Cena paliwa netto" required error={error || undefined}><DecimalField kind="unitPrice" unit="EUR/l" value={value} onChange={event => setValue(event.target.value)}/></Field>
          <Field label="Źródło i powód wpisu" required hint="Bez nazwisk i danych osobowych"><Textarea value={reason} onChange={event => setReason(event.target.value)} maxLength={500}/></Field>
          <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Anuluj</Button></DialogClose><Button type="submit">Zachowaj wpis w symulacji</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog><Button variant="secondary" asChild><a href="#s12">Wróć do wyceny</a></Button>
  </Card>;
}

const drafts = [{ id: 'K2', freight: '60,00', cost: '38,18', result: '21,82', free: 'C · 13:00' }, { id: 'K3', freight: '30,00', cost: '38,18', result: '-8,18', free: 'C · 13:00' }];
export function CompareDrafts({ stateId, accepted, acceptedLoss }: { stateId: string; accepted: boolean; acceptedLoss: boolean }) {
  const [discarded, setDiscarded] = useState<string[]>([]);
  const rows = [...drafts, ...(stateId === 's15.3' ? [{ id: 'K4', freight: '60,00', cost: '—', result: '—', free: '—' }] : [])].filter(row => !discarded.includes(row.id));
  return <Card><h1 className="text-page-title">Porównanie szkiców</h1><p>Dwa fikcyjne warianty od K1 · EUR netto · ten sam czas i koszt. Bez rekomendacji.</p>
    {/* DS GAP G08: DataTable has no sort API. Do not add a parallel sorting implementation. */}
    {stateId === 's15.2' || rows.length < 2 ? <StateNotice stateId="s15.2"/> : <DataTable rows={rows.map(row => row.id === 'K2' && acceptedLoss ? { ...row, freight: '30,00', result: '-8,18' } : row)} rowKey={row => row.id} caption="Porównanie szkiców jednego auta" page={1} pageSize={10} total={rows.length} onPageChange={() => {}}
      actions={row => !accepted && row.id !== 'K2' ? <Button variant="secondary" onClick={() => setDiscarded(ids => [...ids, row.id])}>Odrzuć szkic</Button> : null} columns={[
      { key: 'draft', header: 'Szkic', cell: row => <div className="stack"><strong>{row.id}</strong><Badge variant="neutral">{accepted ? row.id === 'K2' ? 'Przyjęty' : 'Nieaktualna' : 'Szkic'}</Badge></div> },
      { key: 'money', header: 'EUR', cell: row => <dl><dt>Fracht</dt><dd>{row.freight}</dd><dt>Koszt</dt><dd>{row.cost}</dd><dt>Wynik · Szacunek</dt><dd>{row.result === '—' ? 'Niepełna · bez wyniku' : row.result.startsWith('-') ? <Badge variant="loss">Strata {row.result}</Badge> : row.result}</dd></dl> },
      { key: 'free', header: 'Wolne', cell: row => <span>{row.free}<span className="block text-meta">12.11.2026 (Warszawa)</span></span> },
    ]} messages={{ ...tableMessages, empty: 'Brak szkiców' }}/>}
    {discarded.length > 0 && <SuccessMessage>Odrzucono szkic {discarded.join(', ')} (nigdy nieprzyjęty) w symulacji.</SuccessMessage>}
    <p className="text-meta">DS GAP G08: DataTable nie udostępnia sortowania. Bez rekomendacji. Porównanie tej samej oferty na kilku autach dojdzie później.</p>
    <Button variant="secondary" asChild><a href="#s12">Wróć do wyceny</a></Button>
  </Card>;
}
