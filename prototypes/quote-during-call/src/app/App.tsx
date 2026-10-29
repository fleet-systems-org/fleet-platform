import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@fleet-platform/ui/components/button";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Card, CardTitle, CardDescription } from "@fleet-platform/ui/components/card";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { Alert } from "@fleet-platform/ui/components/alert";
import { RadioGroup, RadioGroupItem } from "@fleet-platform/ui/components/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fleet-platform/ui/components/select";
import { DecimalField } from "@fleet-platform/ui/components/values/decimal-field";
import { ValueWithSource } from "@fleet-platform/ui/components/values/value-with-source";
import { Popover, PopoverContent, PopoverTrigger } from "@fleet-platform/ui/components/popover";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@fleet-platform/ui/components/alert-dialog";
import { parseDecimalInput } from "@fleet-platform/ui/lib/decimal";
import { cents, decimal, costs, coveredCost, screenNames, screenId, vehicles, valueLabels } from "./model";

import { localizeReview } from "./review-labels";

declare global { interface Window { __PROTOTYPE_START__: () => boolean } }
const go = (id: string) => document.dispatchEvent(new CustomEvent("prototype:navigate", { detail: id }));

function Link({ to, children }: { to: string; children: ReactNode }) {
  return <Button variant="secondary" asChild><a href={`#${to}`}>{children}</a></Button>;
}
function Figure({ label, value, unit = "EUR", certain = false, source = "Przykład specyfikacji · dane fikcyjne", scale, showLabel = true }: {
  label: string; value: string; unit?: string; certain?: boolean; source?: string; scale?: number; showLabel?: boolean;
}) {
  return <div className="figure">{showLabel && <span className="text-label">{label}</span>}
    <ValueWithSource state="known" label={label} labels={valueLabels} value={value} unit={unit}
      displayScale={scale} certainty={certain ? "certain" : "estimated"}
      source={{ name: source, date: "12.11.2026" }} reason={certain ? undefined : "Symulacja. Dane demonstracyjne, bez połączenia ze źródłem. Ceny dla przyszłego kursu są szacunkiem."} />
    <span className="text-meta">{source}</span></div>;
}

export function App() {
  const [active, setActive] = useState("s01");
  const [role, setRole] = useState("dispatcher");
  const [later, setLater] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [places, setPlaces] = useState(false);
  const [query, setQuery] = useState("");
  const [freight, setFreight] = useState("");
  const [wash, setWash] = useState("");
  const [loadingDate, setLoadingDate] = useState("2026-11-12");
  const [loadingTime, setLoadingTime] = useState("12:00");
  const [unloadingDate, setUnloadingDate] = useState("2026-11-12");
  const [unloadingTime, setUnloadingTime] = useState("13:00");
  const [accepted, setAccepted] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState(false);
  const [screenPicker, setScreenPicker] = useState(false);
  const [quoted, setQuoted] = useState(false);
  const [message, setMessage] = useState("");
  const parsed = parseDecimalInput(freight, { scale: 2 });
  const amount = parsed.ok ? decimal(cents(parsed.value)) : "60.00";
  const result = decimal(cents(amount) - cents(coveredCost));
  const demoReady = vehicle === "Auto 01" && places && wash === "none" && parsed.ok && amount === "60.00"
    && loadingDate === "2026-11-12" && loadingTime === "12:00" && unloadingDate === "2026-11-12" && unloadingTime === "13:00";
  const invalidate = () => { setQuoted(false); setMessage(""); };
  function reset() {
    setVehicle(""); setPlaces(false); setQuery(""); setFreight(""); setWash(""); setAccepted(false); setQuoted(false); setMessage("");
    setLoadingDate("2026-11-12"); setLoadingTime("12:00"); setUnloadingDate("2026-11-12"); setUnloadingTime("13:00");
    go("s09");
  }
  useEffect(() => {
    const changed = (event: Event) => { setActive((event as CustomEvent<string>).detail); setPicker(false); setScreenPicker(false); };
    document.addEventListener("prototype:screen-change", changed);
    window.__PROTOTYPE_START__();
    const stopLocalizing = localizeReview();
    return () => { document.removeEventListener("prototype:screen-change", changed); stopLocalizing(); };
  }, []);

  const header = <header className="product-header">
    <nav aria-label="Nawigacja produktu" className="actions">
      <Button variant="text" onClick={reset}>Nowa wycena</Button><Link to="s07">Kursy aut</Link>
      {later && <Link to="s06">Flota</Link>}
    </nav>
    <div className="actions"><span className="text-meta">{role === "owner" ? "wlasciciel" : "dyspozytor"}@firma-demo.example</span>
      <Button variant="text" onClick={() => { reset(); go("s01"); }}>Wyloguj</Button></div>
  </header>;
  const content: Record<string, ReactNode> = {
    s01: <Card><CardTitle><h1 className="text-page-title">Logowanie</h1></CardTitle><CardDescription>Firma Demo · dane fikcyjne</CardDescription>
      <Alert title="Symulacja logowania">Hasło nie jest sprawdzane ani zapisywane. Nie wpisuj prawdziwego hasła. Sposób logowania czeka na decyzję.</Alert>
      <form className="stack" onSubmit={event => { event.preventDefault(); event.currentTarget.reset(); go("s09"); }}>
        <Field label="E-mail" required><Input type="email" name="demo-email" autoComplete="off" defaultValue="dyspozytor@firma-demo.example" /></Field>
        <Field label="Hasło demonstracyjne" hint="Dowolny tekst. Nie używaj prawdziwego hasła."><Input type="password" autoComplete="off" /></Field>
        <Button type="submit">Zaloguj — symulacja</Button><Link to="s03">Nie pamiętam hasła</Link>
      </form></Card>,
    s09: <><h1 className="text-page-title">Nowa wycena</h1>
      <p className="text-meta">Etap 1: przykład K2 · Auto 01 · 12.11.2026 · 60,00 EUR · bez mycia. Obliczenia i trasa są symulowane.</p>
      {accepted ? <Alert title="Ten kurs został przyjęty" action={<Button onClick={reset}>Nowa wycena</Button>}>Przyjęta wycena jest zachowana w symulacji. Zacznij nową wycenę, aby wpisać kolejny kurs.</Alert> : <>
      <Card><CardTitle>1. Wybierz auto</CardTitle><Field label="Auto" required>
        <RadioGroup value={vehicle} onValueChange={value => { setVehicle(value); invalidate(); }}>
          {vehicles.map(([name, free]) => <RadioGroupItem key={name} value={name} label={name} hint={name === "Auto 01" && hasAccepted ? "Wolne w Miejscu C od 12.11.2026, 13:00" : free} />)}
        </RadioGroup></Field>
        {vehicle && vehicle !== "Auto 01" && <Alert title="To auto dojdzie w etapie 2" action={<Link to="s08">Punkt startowy auta</Link>}>Ścieżka etapu 1 korzysta z Auta 01.</Alert>}
      </Card>
      <Card><CardTitle>2. Miejsca i czasy</CardTitle>
        <div className="actions"><span>{places ? "Miejsce B (DE) → Miejsce C (CZ)" : "Wybierz miejsce załadunku i rozładunku"}</span><Link to="s10">Wybierz miejsca</Link></div>
        {/* DS GAP G02: separate native date and time inputs, fixed and labelled company timezone. */}
        <p className="text-meta">Czas warszawski (Europe/Warsaw). Godzina załadunku 12:00 jest fikcyjna. Start kursu: Miejsce A, 12.11.2026, 11:00 — koniec rozładunku K1.</p>
        <div className="form-grid">
          <Field label="Data załadunku" required><Input type="date" value={loadingDate} onChange={e => { setLoadingDate(e.target.value); invalidate(); }} /></Field>
          <Field label="Godzina załadunku" required><Input type="time" value={loadingTime} onChange={e => { setLoadingTime(e.target.value); invalidate(); }} /></Field>
          <Field label="Data końca rozładunku" required><Input type="date" value={unloadingDate} onChange={e => { setUnloadingDate(e.target.value); invalidate(); }} /></Field>
          <Field label="Godzina końca rozładunku" required><Input type="time" value={unloadingTime} onChange={e => { setUnloadingTime(e.target.value); invalidate(); }} /></Field>
        </div>
      </Card>
      <Card><CardTitle>3. Fracht i mycie</CardTitle><div className="form-grid">
        <Field label="Fracht netto" hint="W przykładzie wpisz 60,00" required><DecimalField unit="EUR" value={freight} onChange={e => { setFreight(e.target.value); invalidate(); }} /></Field>
        <Field label="Waluta" required><Select defaultValue="EUR"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select></Field>
      </div><Field label="Mycie" required hint="Odpowiedz wprost. Brak wyboru nie oznacza braku mycia.">
        <RadioGroup value={wash} onValueChange={value => { setWash(value); invalidate(); }}>
          <RadioGroupItem value="none" label="Bez mycia" /><RadioGroupItem value="ours" label="Nasze mycie" hint="Kwota i data — etap 2" />
        </RadioGroup></Field>
        {wash === "ours" && <Alert title="Nasze mycie dojdzie w etapie 2">Ten etap pokazuje przykład bez mycia.</Alert>}
        <Field label="Numer zlecenia" optionalText="opcjonalne"><Input autoComplete="off" /></Field>
        {message && <Alert title={message} />}
        <Button onClick={() => { if (hasAccepted) setMessage("W etapie 1 przyjęto już K2. Resetuj symulację, aby powtórzyć przykład."); else if (demoReady) go("s11"); else setMessage("Wybierz Auto 01, miejsca B → C, czasy przykładu, fracht 60,00 i Bez mycia."); }}>Dalej: trasa i kraje</Button>
      </Card></>}
    </>,
    s10: <><h1 className="text-page-title">Wybór miejsca</h1><Card><CardTitle>Załadunek i rozładunek</CardTitle>
      <p className="text-meta">Symulacja wyszukiwania, bez geokodowania. Dostępna para przykładu: Miejsce B (DE) → Miejsce C (CZ).</p>
      {/* DS GAP G03: Input with a Popover of owner-approved synthetic saved places. */}
      <Popover open={picker} onOpenChange={setPicker}><PopoverTrigger asChild><Button variant="secondary">Szukaj zapisanych miejsc</Button></PopoverTrigger>
        <PopoverContent aria-label="Zapisane miejsca"><div className="stack"><Field label="Szukaj miejsca"><Input value={query} onChange={e => setQuery(e.target.value)} /></Field>
          {"Miejsce B Miejsce C".toLocaleLowerCase("pl").includes(query.toLocaleLowerCase("pl"))
            ? <Button onClick={() => { setPlaces(true); invalidate(); go("s09"); }}>Wybierz B (DE) → C (CZ)</Button>
            : <p>W etapie 1 szukaj Miejsca B lub C.</p>}
        </div></PopoverContent></Popover>
      <Button onClick={() => { setPlaces(true); invalidate(); go("s09"); }}>Użyj Miejsca B (DE) i Miejsca C (CZ)</Button>
      <Link to="s09">Wróć do wpisu kursu</Link>
    </Card></>,
    s11: <><h1 className="text-page-title">Trasa i kraje</h1>
      {/* DS GAP G13: token-based segment and country list, no route editor or map service. */}
      <Card><CardTitle>K2 · cały dojazd od K1</CardTitle><p>Start: Miejsce A · 12.11.2026, 11:00 (Warszawa). Koniec: Miejsce C · 13:00.</p>
        <div className="result-row"><Figure label="Dojazd A → B" value="20.000" unit="km" scale={0} /><Figure label="Z ładunkiem B → C" value="80.000" unit="km" scale={0} /><Figure label="Razem" value="100.000" unit="km" scale={0} /></div>
        <Alert title="Podział na kraje nie jest symulowany">100 km z przykładu specyfikacji. Miejsca mają kraje PL → DE → CZ; przykład nie podaje kilometrów dla każdego kraju. Wynik poniżej dotyczy wyłącznie danych przykładu, nie rzeczywistej trasy międzynarodowej.</Alert>
        <p>Myto z przykładu: 10,00 EUR. Myto planera jest tylko kontrolą — brak połączenia z planerem.</p>
        <p className="text-meta">Przedział 12.11.2026, 11:00–13:00 nie obejmuje weekendu.</p>
        <div className="actions"><Link to="s09">Wróć do wpisu</Link><Button onClick={() => { if (demoReady && !accepted) { setQuoted(true); go("s12"); } else go("s09"); }}>Wyceń</Button></div>
      </Card></>,
    s12: <><h1 className="text-page-title">Wycena K2 · Auto 01 <Badge variant="neutral">{accepted ? "Przyjęty" : "Szkic"}</Badge></h1>
      {accepted && <Alert title="Kurs przyjęty. Auto 01 wolne w Miejscu C od 13:00." />}
      {!quoted && !accepted ? <Alert title="Najpierw wpisz i wyceń kurs" action={<Link to="s09">Przejdź do wpisu</Link>}>Ścieżka etapu 1 korzysta z przykładu K2.</Alert> : <>
      {/* DS GAP G13: result and next availability share one token-based row. */}
      <Card><div className="result-row"><Figure label="Fracht netto" value={amount} certain source="Wpisane w symulacji" /><Figure label="Koszt uwzględniony" value={coveredCost} />
        <Figure label="Wynik jednego kursu" value={result} /><div className="figure"><span className="text-label">Dostępność planowana</span><strong className="text-body-strong">Wolne w Miejscu C od 13:00</strong><span className="text-meta">12.11.2026 (Warszawa) · koniec rozładunku</span></div></div>
      </Card>
      <Card><CardTitle>Rozbicie kosztów netto</CardTitle><dl className="stack">{costs.map(cost => <div className="cost-row" key={cost.label}><dt>{cost.label}</dt><dd><Figure showLabel={false} label={cost.label} value={cost.value} certain={cost.certain} source={cost.source} /></dd></div>)}</dl>
        <p className="text-meta">Wszystkie kategorie konfiguracji przykładu uwzględnione. Koszty auta: 6,00 EUR; fikcyjny podział w szczegółach. Praca: tylko suma, bez danych płacowych.</p>
        <Link to="s13">Szczegóły wartości i źródeł</Link>
      </Card>
      <p className="text-meta">Dojazd po rozładunku: otwarty, czeka na następny kurs. Nie obciąża K2. Brak werdyktu dla łańcucha.</p>
      <div className="actions">{accepted ? <><Button onClick={reset}>Nowa wycena</Button><Link to="s07">Kursy auta</Link></> : <><Link to="s09">Zmień dane</Link><Link to="s16">Przyjmij kurs</Link></>}</div>
      </>}
    </>,
    s13: <><h1 className="text-page-title">Szczegóły wartości</h1><Card><CardTitle>K2 · źródła danych</CardTitle>
      <p>Każda podkreślona liczba otwiera szczegóły: dokładna wartość, pewność, źródło, data i powód szacunku.</p>
      <div className="result-row"><Figure label="Dokładny dojazd" value="20.000" unit="km" scale={0} /><Figure label="Dokładny odcinek z ładunkiem" value="80.000" unit="km" scale={0} /><Figure label="Fracht" value={amount} certain source="Wpisane w symulacji" /></div>
      <p className="text-meta">Dokładnie: 20,000 km + 80,000 km. Cena paliwa 1,000000 EUR/l, spalanie 10,000000 i 20,000000 l/100 km, paliwo 18,000 l; myto 0,100000 EUR/km; AdBlue 0,010000 EUR/l. Dane z przykładu specyfikacji, nie z usługi.</p>
      <p>Koszty auta: 72,000000 EUR/dzień × 2/24 dnia = 6,00 EUR. Fikcyjny podział stawki dziennej: leasing 24, ubezpieczenie 8, telematyka 2, pakiet serwisowy 6, wynajem cysterny 10, części i naprawy 8, parkingi i assistance 3, opłaty kartowe 1, koszty stałe działu 10 EUR. Podział pochodzi z szarego prototypu; nie jest konfiguracją firmy.</p>
      <p>Praca: 4,00 EUR. Źródło: zatwierdzona stawka z przykładu specyfikacji. Dane płacowe i wyprowadzenie stawki nie są częścią tego prototypu.</p>
      <div className="actions"><Link to="s12">Wróć do wyceny</Link><Link to="s16">Przyjmij kurs</Link></div>
    </Card></>,
    s16: <><h1 className="text-page-title">Przyjęcie kursu</h1><Card><CardTitle>Przyjęcie zachowa wycenę K2</CardTitle><p>Auto 01 · Miejsce B → Miejsce C · fracht 60,00 EUR · koszt 38,18 EUR · wynik 21,82 EUR.</p>
      {quoted && !accepted ? <Button onClick={() => setConfirm(true)}>Przejdź do przyjęcia</Button> : <Link to="s12">Wróć do wyceny</Link>}
      <Link to="s12">Anuluj przyjęcie</Link>
    </Card></>,
    s07: <><h1 className="text-page-title">Kursy auta · Auto 01</h1>
      {/* DS GAP G11 and G13: neutral status badges and a chronological list. */}
      <Card><CardTitle>Kolejność kursów</CardTitle><ol className="stack">
        <li className="sequence"><Badge variant="neutral">Przyjęty</Badge><strong>K1</strong><p>Koniec rozładunku: Miejsce A · 12.11.2026, 11:00 (Warszawa).</p></li>
        <li className="sequence"><Badge variant="neutral">{hasAccepted ? "Przyjęty" : "Szkic"}</Badge><strong>K2 · Miejsce B → Miejsce C</strong><p>Cały dojazd od K1: A → B, 20 km. Z ładunkiem: B → C, 80 km. Koniec rozładunku: 12.11.2026, 13:00 (Warszawa).</p><Button variant="secondary" onClick={() => { if (hasAccepted) { setAccepted(true); setQuoted(true); setFreight("60.00"); } go("s12"); }}>Otwórz wycenę K2</Button></li>
        <li className="sequence"><Badge variant="neutral">{hasAccepted ? "Nieaktualna" : "Szkic"}</Badge><strong>K3</strong><p>Ten sam poprzednik K1 · fracht 30,00 EUR. {hasAccepted ? "Wymaga ponownej wyceny po przyjęciu K2." : "Porównanie szkiców dojdzie w etapie 2."}</p></li>
      </ol><p>{hasAccepted ? "Wolne w Miejscu C od 13:00. Dojazd po K2: otwarty, jeszcze nieprzypisany — czeka na kurs." : "Wolne w Miejscu A od 11:00. Szkic nie zmienia dostępności."}</p>
      <Button onClick={reset}>Nowa wycena</Button></Card>
    </>,
  };
  return <>
    {/* DS GAP G12: review bar and product frame assembled from existing tokens and controls. */}
    <aside className="doc-toolbar" aria-label="Przegląd prototypu">
      <div className="actions"><Badge variant="neutral">Prototyp</Badge><span className="text-meta">Etap 1 · dane fikcyjne · teraz: 12.11.2026, 09:30 (Warszawa)</span>
        <Button variant="secondary" aria-expanded={screenPicker} aria-controls="screen-picker" onClick={() => setScreenPicker(!screenPicker)}>Wybierz ekran</Button>
        <nav id="screen-picker" hidden={!screenPicker} className="screen-nav screen-picker" aria-label="Ekrany">{screenNames.map((name, index) => <a key={name} href={`#${screenId(index)}`}>{screenId(index)} · {name}</a>)}</nav>
        <Button variant="secondary" onClick={() => { document.body.classList.remove("proto-focus"); document.getElementById("screen-map")?.scrollIntoView(); }}>Mapa ekranów</Button>
        <Button variant="secondary" onClick={() => { setHasAccepted(false); reset(); go("s01"); }}>Resetuj symulację</Button>
      </div>
      <details><summary>Scenariusze</summary><div className="form-grid">
        <Field label="p02 · Konto"><Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dispatcher">Dyspozytor</SelectItem><SelectItem value="owner">Właściciel</SelectItem></SelectContent></Select></Field>
        <Field label="p19 · Zakres"><Select value={later ? "later" : "phase1"} onValueChange={v => setLater(v === "later")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="phase1">Faza 1</SelectItem><SelectItem value="later">Pokaż, co dojdzie później</SelectItem></SelectContent></Select></Field>
      </div></details>
    </aside>
    <main className="doc">
      <nav id="screen-map" className="doc-head stack" aria-label="Mapa ekranów"><h1 className="text-page-title">Prototyp: wycena podczas rozmowy — mapa ekranów</h1><div className="actions">{screenNames.map((name, i) => <Link key={name} to={screenId(i)}>{screenId(i)} · {name}</Link>)}</div></nav>
      {screenNames.map((name, i) => { const id = screenId(i); return <section className="screen" id={id} key={id} aria-label={`${id} · ${name}`}>
        <div className="screen-meta text-meta">{id} · {name}</div><div className="frame">{i > 3 && header}<div className="screen-content stack">
          {content[id] ?? <><h1 className="text-page-title">{name}</h1><Card><p>Ten ekran dojdzie w etapie 2.</p><Link to="s09">Wróć do nowej wyceny</Link></Card></>}
        </div></div><div className="notes"><p className="note text-meta">Prototyp · symulacja, dane fikcyjne · etap 1.</p></div>
      </section>; })}
    </main>
    <AlertDialog open={confirm && active === "s16"} onOpenChange={setConfirm}><AlertDialogContent>
      <AlertDialogHeader><AlertDialogTitle>Przyjąć kurs K2?</AlertDialogTitle><AlertDialogDescription>Symulacja: zapisze wycenę 21,82 EUR z kursem. Auto 01 będzie wolne w Miejscu C od 13:00. Pozostałe szkice staną się nieaktualne.</AlertDialogDescription></AlertDialogHeader>
      <AlertDialogFooter><AlertDialogCancel>Anuluj</AlertDialogCancel><AlertDialogAction onClick={() => { setAccepted(true); setHasAccepted(true); go("s12"); }}>Przyjmij kurs K2</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent></AlertDialog>
  </>;
}
