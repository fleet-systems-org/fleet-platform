import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { Badge } from "@fleet-platform/ui/components/badge";
import { costs, coveredCost } from "./model";
import { RouteSchematic } from "./RouteSchematic";
const money = (s: string) => s.replace('.', ',');
export function Quote({ variant, amount, result }: { variant: string; amount: string; result: string }) {
  const loss = result.startsWith('-');
  const outcome = <div className="quote-outcome"><div><span className="text-label">Wynik jednego kursu · EUR</span><strong className={`quote-value ${loss ? 'loss-result' : variant === 'C' ? 'proposed-profit' : ''}`}>{loss ? 'Strata ' : ''}{money(result)}</strong><Badge variant="estimate">Szacunek</Badge>{variant === 'C' && !loss && <span className="text-meta">Kolor zysku: propozycja DS</span>}</div><div className="availability"><span className="text-label">Dostępność planowana</span><strong>Wolne w Miejscu C od 13:00</strong><span className="text-meta">12.11.2026 (Warszawa)</span></div></div>;
  const totals = <div className="quote-bar">{[['Fracht netto', money(amount)+' EUR'],['Koszt uwzględniony',money(coveredCost)+' EUR'],['Wynik · szacunek',money(result)+' EUR'],['Dojazd','20 km'],['Z ładunkiem','80 km']].map(([l,v])=><div key={l}><span className="text-label">{l}</span><strong>{v}</strong></div>)}</div>;
  return <div className={`quote quote-${variant} stack`}><Badge variant="neutral">Wariant {variant}</Badge>
    {variant === 'B' ? <><div className="planner-layout"><Card><CardTitle>Trasa kursu</CardTitle><RouteSchematic/></Card><Card>{outcome}</Card></div><Card>{totals}</Card></> : <><Card>{outcome}{variant === 'A' && totals}</Card><Card><CardTitle>Trasa kursu</CardTitle><RouteSchematic/></Card></>}
    <Card><CardTitle>Rozbicie kosztów netto</CardTitle>{variant === 'C' ? <><div className="calculator-summary">{totals}</div><div className="cost-sections">{[['Trasa',costs.slice(0,3)],['Obsługa kursu',costs.slice(3)]].map(([title, rows]) => <section key={String(title)} className="cost-group"><h2 className="text-section-title">{String(title)}</h2>{(rows as typeof costs).map(c => <div className="cost-row" key={c.label}><span>{c.label}</span><strong className="cost-pill">{money(c.value)} EUR</strong></div>)}</section>)}</div></> : <table className="compact-table"><caption>Kwoty netto · EUR</caption><thead><tr><th>Koszt</th><th>Kwota</th><th>Pewność</th></tr></thead><tbody>{costs.map(c=><tr key={c.label}><th>{c.label}</th><td>{money(c.value)}</td><td>{c.certain ? 'Pewne' : 'Szacunek'}</td></tr>)}</tbody><tfoot><tr><th>Razem</th><td>38,18</td><td>Szacunek</td></tr></tfoot></table>}
    <p className="text-meta">Wszystkie kategorie uwzględnione. Praca: tylko suma, bez danych płacowych. Źródła i dokładne wartości w szczegółach.</p></Card>
  </div>;
}
