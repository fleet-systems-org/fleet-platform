// DS GAP G15 route schematic: geometry only, no map provider.
export function RouteSchematic() {
  return <figure className="route-schematic stack"><svg viewBox="0 0 300 80" role="img" aria-label="A do B: dojazd; B do C: z ładunkiem.">
    <path className="approach-line" d="M30 40 H150" /><path d="M150 40 H270" />
    {[30, 150, 270].map((x, i) => <g key={x}><circle cx={x} cy="40" r="12"/><text x={x} y="45" textAnchor="middle">{['A','B','C'][i]}</text></g>)}
  </svg><div className="route-times text-meta"><span>A · PL<br/>11:00</span><span>B · DE<br/>12:00</span><span>C · CZ<br/>13:00</span></div>
    <div className="text-body"><p>Dojazd A → B · 20 km (linia przerywana)</p><p>Z ładunkiem B → C · 80 km (linia ciągła)</p></div>
    <figcaption className="text-meta">Miejsce A → Miejsce B → Miejsce C · 12.11.2026 (Warszawa). Symulacja mapy — w produkcie mapa trasy wymaga decyzji</figcaption></figure>;
}
