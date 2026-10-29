// DS GAP G15: geometry only, fixed-height drawing; HTML text uses unscaled DS roles.
export function RouteSchematic() {
  return <figure className="route-schematic stack"><div className="route-drawing" aria-label="A do B: dojazd; B do C: z ładunkiem.">
    <svg viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true"><path className="approach-line" d="M20 20 H150"/><path d="M150 20 H280"/></svg>
    <div className="route-nodes text-label">{['A', 'B', 'C'].map(name => <span key={name}>{name}</span>)}</div>
  </div><div className="route-times text-meta"><span>A · PL<br/>11:00</span><span>B · DE<br/>12:00</span><span>C · CZ<br/>13:00</span></div>
    <div className="text-body"><p>Dojazd A → B · 20 km (linia przerywana)</p><p>Z ładunkiem B → C · 80 km (linia ciągła)</p></div>
    <figcaption className="text-meta">Miejsce A → Miejsce B → Miejsce C · 12.11.2026 (Warszawa). Symulacja mapy — w produkcie mapa trasy wymaga decyzji</figcaption></figure>;
}
