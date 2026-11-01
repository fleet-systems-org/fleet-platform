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

// Only component composition. No source service or quote revision is written by this fixture.
export function CompleteValue() {
  const [value, setValue] = useState('1,000000');
  const [reason, setReason] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  return <Card><h1 className="text-page-title">Uzupełnienie danej</h1><p>Dane fikcyjne. Symulacja wpisu ceny paliwa; stała wycena K2 nie jest przeliczana.</p>
    {saved && <SuccessMessage>Wpis zachowany w symulacji. Wycenę po zmianie danych pokaże etap 2.</SuccessMessage>}
    <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button>Uzupełnij cenę paliwa</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Uzupełnij cenę paliwa</DialogTitle><DialogDescription>Wpis ręczny jest szacunkiem. Podaj cenę netto i źródło, bez danych osobowych. To symulacja, bez zapisu do serwera.</DialogDescription></DialogHeader>
        <form className="stack" onSubmit={event => { event.preventDefault(); const parsed = parseDecimalInput(value, { kind: 'unitPrice' }); if (!parsed.ok || !reason.trim()) { setError('Wpisz poprawną cenę i źródło danych.'); return; } setError(''); setSaved(true); setOpen(false); }}>
          <Field label="Cena paliwa netto" required error={error || undefined}><DecimalField kind="unitPrice" unit="EUR/l" value={value} onChange={event => setValue(event.target.value)}/></Field>
          <Field label="Źródło i powód wpisu" required hint="Bez nazwisk i danych osobowych"><Textarea value={reason} onChange={event => setReason(event.target.value)} maxLength={500}/></Field>
          <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Anuluj</Button></DialogClose><Button type="submit">Zachowaj wpis w symulacji</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog><Button variant="secondary" asChild><a href="#s12">Wróć do wyceny</a></Button>
  </Card>;
}

const drafts = [{ id: 'K2', freight: '60,00', cost: '38,18', result: '21,82', free: 'C · 13:00' }, { id: 'K3', freight: '30,00', cost: '38,18', result: '-8,18', free: 'C · 13:00' }];
export function CompareDrafts({ accepted, acceptedLoss }: { accepted: boolean; acceptedLoss: boolean }) {
  return <Card><h1 className="text-page-title">Porównanie szkiców</h1><p>Dwa fikcyjne warianty od K1 · EUR netto · ten sam czas i koszt. Bez rekomendacji.</p>
    {/* DS GAP G08: DataTable has no sort API. Do not add a parallel sorting implementation. */}
    <DataTable rows={drafts.map(row => row.id === 'K2' && acceptedLoss ? { ...row, freight: '30,00', result: '-8,18' } : row)} rowKey={row => row.id} caption="Porównanie szkiców K2 i K3" page={1} pageSize={2} total={2} onPageChange={() => {}} columns={[
      { key: 'draft', header: 'Szkic', cell: row => <div className="stack"><strong>{row.id}</strong><Badge variant="neutral">{accepted ? row.id === 'K2' ? 'Przyjęty' : 'Nieaktualna' : 'Szkic'}</Badge></div> },
      { key: 'money', header: 'EUR', cell: row => <dl><dt>Fracht</dt><dd>{row.freight}</dd><dt>Koszt</dt><dd>{row.cost}</dd><dt>Wynik · Szacunek</dt><dd>{row.result.startsWith('-') ? <Badge variant="loss">Strata {row.result}</Badge> : row.result}</dd></dl> },
      { key: 'free', header: 'Wolne', cell: row => <span>{row.free}<span className="block text-meta">12.11.2026 (Warszawa)</span></span> },
    ]} messages={{ loading: 'Wczytuję…', empty: 'Brak szkiców', previous: 'Poprzednia', next: 'Następna', actions: 'Działania', page: (page, pages) => `Strona ${page} z ${pages}` }}/>
    <p className="text-meta">DS GAP G08: DataTable nie udostępnia sortowania. Pełne scenariusze porównania — etap 2.</p>
    <Button variant="secondary" asChild><a href="#s12">Wróć do wyceny</a></Button>
  </Card>;
}
