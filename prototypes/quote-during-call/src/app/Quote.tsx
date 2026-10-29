import { Fragment, useState, type ReactNode } from 'react';
import { Card, CardTitle } from '@fleet-platform/ui/components/card';
import { Badge } from '@fleet-platform/ui/components/badge';
import { Button } from '@fleet-platform/ui/components/button';
import { costs, coveredCost } from './model';
import { shareTenths, shareText, shareWidth, vehicleCosts } from './cost-shares';
import { RouteSchematic } from './RouteSchematic';
const money = (s: string) => s.replace('.', ',');
const orderedCosts = [costs[0]!, costs[1]!, costs[4]!, costs[5]!, costs[2]!, costs[3]!];

// N6a / R17.1: one cost table beside one summary; no metric tiles or category colours.
export function Quote({ amount, result, actions, customers }: { amount: string; result: string; actions: ReactNode; customers: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const loss = result.startsWith('-');
  const roundedSum = orderedCosts.reduce((sum, row) => sum + shareTenths(row.value, coveredCost), 0n);
  function row(cost: typeof costs[number], child = false) {
    const share = shareTenths(cost.value, coveredCost);
    return <tr className={child ? 'vehicle-detail' : undefined}>
      <th scope="row">{cost.label === 'Koszty auta' ? <Button variant="text" aria-expanded={expanded} aria-controls="vehicle-cost-rows" onClick={() => setExpanded(!expanded)}>Koszty auta · {expanded ? 'zwiń' : 'rozwiń'}</Button> : cost.label}<span className="cost-source-mobile text-meta">{cost.source}</span></th>
      <td className="cost-source text-meta">{cost.source}</td><td className="cost-amount">{money(cost.value)} EUR{!cost.certain && <Badge variant="estimate">Szacunek</Badge>}</td>
      <td><div className="share-cell"><span>{shareText(share)} %</span><span className="share-track" aria-hidden="true"><span style={{ width: shareWidth(share) }} /></span></div></td>
    </tr>;
  }
  return <div className="quote-layout">
    <aside className="quote-summary"><Card><CardTitle>Podsumowanie wyceny</CardTitle>
      <div className="stack"><div><p className="text-meta">Wynik jednego kursu</p><div className="actions"><strong className={`quote-value${loss ? ' loss-result' : ''}`}>{loss ? 'Strata ' : ''}{money(result)} EUR</strong><Badge variant="estimate">Szacunek</Badge></div></div>
      <div className="availability"><p className="text-meta">Dostępność planowana</p><strong>Wolne w Miejscu C od 13:00</strong><p className="text-meta">12.11.2026 (Warszawa) · koniec rozładunku</p></div>
      <dl className="summary-totals"><div><dt>Fracht netto</dt><dd>{money(amount)} EUR</dd></div><div><dt>Koszt uwzględniony</dt><dd>{money(coveredCost)} EUR <Badge variant="estimate">Szacunek</Badge></dd></div></dl>
      <div className="stack quote-actions">{actions}</div></div>
    </Card></aside>
    <div className="quote-detail stack"><Card><CardTitle>Trasa kursu</CardTitle><RouteSchematic/>{customers}</Card>
      <Card><CardTitle>Rozbicie kosztów netto</CardTitle><table className="compact-table quote-cost-table"><caption>Kwoty netto · EUR</caption><thead><tr><th scope="col">Koszt</th><th scope="col" className="cost-source">Źródło</th><th scope="col">Kwota</th><th scope="col">% kosztu</th></tr></thead>
      {orderedCosts.map(cost => <Fragment key={cost.label}><tbody>{row(cost)}</tbody>{cost.label === 'Koszty auta' && <tbody id="vehicle-cost-rows" hidden={!expanded}>{vehicleCosts.map(c => <Fragment key={c.label}>{row(c, true)}</Fragment>)}</tbody>}</Fragment>)}
      <tfoot><tr><th scope="row">Razem</th><td className="cost-source"/><td>38,18 EUR</td><td>100,0 %</td></tr></tfoot></table>
      {roundedSum !== 1000n && <p className="text-meta">Suma zaokrąglonych udziałów: {shareText(roundedSum)} %. Różnica wynika z zaokrągleń; razem: 100,0 %.</p>}
      <p className="text-meta">Wszystkie kategorie konfiguracji przykładu uwzględnione. Koszty auta: fikcyjny podział stawki dziennej, proporcjonalny podział 6,00 EUR z uzgodnieniem groszy. Udziały podkategorii odnoszą się do całego kosztu kursu. Praca: tylko suma, bez danych płacowych.</p>
      <Button variant="secondary" asChild><a href="#s13">Szczegóły wartości i źródeł</a></Button></Card>
      <p className="text-meta">Dojazd po rozładunku: otwarty, czeka na następny kurs. Nie obciąża K2. Brak werdyktu dla łańcucha.</p>
    </div>
  </div>;
}
