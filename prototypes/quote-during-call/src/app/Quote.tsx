import { Fragment, useId, useState, type ReactNode } from 'react';
import { Card, CardTitle } from '@fleet-platform/ui/components/card';
import { Badge } from '@fleet-platform/ui/components/badge';
import { Button } from '@fleet-platform/ui/components/button';
import { ValueWithSource } from '@fleet-platform/ui/components/values/value-with-source';
import { EvidenceBadge } from '@fleet-platform/ui/components/values/evidence-badge';
import { valueLabels, costs, coveredCost } from './model';
import { shareTenths, shareText, shareWidth, vehicleCosts, vehicleTotal, vehicleReconciliation, vehicleDisplayedTotal } from './cost-shares';
const money = (s: string) => s.replace('.', ',');
const orderedCosts = [costs[0]!, costs[1]!, costs[4]!, costs[5]!, costs[2]!, costs[3]!];

// N6a / R17.1: one cost table beside one summary; no metric tiles or category colours.
export function Quote() {
  const [expanded, setExpanded] = useState(false);
  const rowsId = useId();
  const roundedSum = orderedCosts.reduce((sum, row) => sum + shareTenths(row.value, coveredCost), 0n);
  return <>
      <Card><CardTitle>Rozbicie kosztów netto</CardTitle><table className="compact-table quote-cost-table"><caption>Kwoty netto · EUR</caption><thead><tr><th scope="col">Koszt</th><th scope="col" className="cost-source">Źródło</th><th scope="col" className="cost-amount">Kwota</th><th scope="col">% kosztu</th></tr></thead>
      {orderedCosts.map(cost => <Fragment key={cost.label}><tbody><CostShareRow cost={cost} expanded={expanded} rowsId={rowsId} onToggle={cost.label === 'Koszty auta' ? () => setExpanded(!expanded) : undefined}/></tbody>{cost.label === 'Koszty auta' && <tbody id={rowsId} hidden={!expanded}>{vehicleCosts.map(c => <Fragment key={c.label}><CostShareRow cost={c} child/></Fragment>)}</tbody>}</Fragment>)}
      <tfoot><tr><th scope="row">Razem</th><td className="cost-source"/><td>38,18 EUR</td><td>100,0 %</td></tr></tfoot></table>
      {roundedSum !== 1000n && <p className="text-meta">Suma zaokrąglonych udziałów: {shareText(roundedSum)} %. Różnica wynika z zaokrągleń; razem: 100,0 %.</p>}
      <VehicleReconciliation/>
      <p className="text-meta">Wszystkie kategorie przykładu uwzględnione. Udziały podkategorii odnoszą się do całego kosztu kursu.</p>
      <Button variant="secondary" asChild><a href="#s13">Szczegóły wartości i źródeł</a></Button></Card>
      <p className="text-meta">Dojazd po rozładunku: otwarty, czeka na następny kurs. Nie obciąża K2. Brak werdyktu dla łańcucha.</p>
  </>;
}

// The existing quote summary is passed to AppFrame's panel slot.
export function QuoteSummary({ amount, result, actions }: { amount: string; result: string; actions: ReactNode }) {
  const loss = result.startsWith('-');
  return <Card><CardTitle>Podsumowanie wyceny</CardTitle>
      <div className="stack"><div><p className="text-meta">Wynik jednego kursu</p>
        {loss && <Badge variant="loss">Strata · {money(result)} EUR</Badge>}
        <ValueWithSource state="known" label="Wynik jednego kursu" labels={valueLabels} value={result} unit="EUR" certainty="estimated" source={{ name: 'Fracht minus uwzględnione koszty · fikcyjne', date: '12.11.2026' }} reason="Koszty i czas są planowane"/>
        <p className="text-meta">Fracht minus uwzględnione koszty · fikcyjne</p></div>
      <div className="availability"><p className="text-meta">Dostępność planowana</p><strong>Wolne w Miejscu C od 13:00</strong><p className="text-meta">12.11.2026 (Warszawa) · koniec rozładunku</p><EvidenceBadge certainty="estimated" labels={valueLabels.evidence}/></div>
      <dl className="summary-totals"><div><dt>Fracht netto</dt><dd><ValueWithSource state="known" label="Fracht netto" labels={valueLabels} value={amount} unit="EUR" certainty="certain" source={{ name: 'Wpis wyceny · fikcyjny', date: '12.11.2026' }}/><p className="text-meta">Wpis wyceny · fikcyjny</p></dd></div>
      <div><dt>Koszt uwzględniony</dt><dd><ValueWithSource state="known" label="Koszt uwzględniony" labels={valueLabels} value={coveredCost} unit="EUR" certainty="estimated" source={{ name: 'Suma kategorii przykładu', date: '12.11.2026' }} reason="Stawki i czas planowane"/><p className="text-meta">Suma kategorii przykładu</p></dd></div></dl>
      <div className="stack quote-actions">{actions}</div></div>
    </Card>;
}


export function CostShareRow({ cost, child = false, expanded, onToggle, rowsId }: { cost: typeof costs[number]; child?: boolean; expanded?: boolean; onToggle?: () => void; rowsId?: string }) {
  const share = shareTenths(cost.value, coveredCost);
  return <tr className={child ? 'vehicle-detail' : undefined}>
    <th scope="row">{onToggle ? <Button variant="text" aria-expanded={expanded} aria-controls={rowsId} onClick={onToggle}>Koszty auta · {expanded ? 'zwiń' : 'rozwiń'}</Button> : cost.label}<span className="cost-source-mobile text-meta">{cost.source}</span></th>
    <td className="cost-source text-meta">{cost.source}</td><td className="cost-amount"><ValueWithSource state="known" size="compact" label={cost.label} labels={valueLabels} value={cost.value} unit="EUR" certainty={cost.certain ? "certain" : "estimated"} source={{ name: cost.source, date: "12.11.2026" }} reason={cost.certain ? undefined : "Stawki i czas planowane · dane fikcyjne"}/></td>
    <td><div className="share-cell"><span>{shareText(share)} %</span><span className="share-track" aria-hidden="true"><span style={{ width: shareWidth(share) }} /></span></div></td>
  </tr>;
}
export function VehicleCostDetails() {
  return <><table className="compact-table quote-cost-table"><caption>Koszty auta · {money(vehicleTotal)} EUR · udziały w całym koszcie kursu</caption><thead><tr><th scope="col">Koszt</th><th scope="col" className="cost-source">Źródło</th><th scope="col" className="cost-amount">Kwota</th><th scope="col">% kosztu</th></tr></thead><tbody>{vehicleCosts.map(cost => <CostShareRow key={cost.label} cost={cost} child/>)}</tbody><tfoot><tr><th scope="row">Razem</th><td className="cost-source"/><td>{money(vehicleTotal)} EUR</td><td>15,7 %</td></tr></tfoot></table><VehicleReconciliation/></>;
}

function VehicleReconciliation() {
  return vehicleReconciliation !== '0.00' ? <p className="text-meta">Koszty auta · uzgodnienie zaokrągleń: {money(vehicleReconciliation)} EUR. Suma pokazanych kategorii: {money(vehicleDisplayedTotal)} EUR. Razem z wartości dokładnych: {money(vehicleTotal)} EUR (72,000000 EUR/dzień × 7200/86400). Stawki fikcyjne; A10 pozostaje otwarte.</p> : null;
}
