import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@fleet-platform/ui/components/button";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { SuccessMessage } from "@fleet-platform/ui/backend/feedback/SuccessMessage";
import { Alert } from "@fleet-platform/ui/components/alert";
import { RadioGroup, RadioGroupItem } from "@fleet-platform/ui/components/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fleet-platform/ui/components/select";
import { DecimalField } from "@fleet-platform/ui/components/values/decimal-field";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@fleet-platform/ui/components/alert-dialog";
import { parseDecimalInput } from "@fleet-platform/ui/lib/decimal";
import { cents, decimal, screenNames, screenId, vehicles } from "./model";

import { RouteStops, type RouteStop } from "@fleet-platform/ui/components/places/route-stops";
import { AppFrame } from "@fleet-platform/ui/components/layout/app-frame";
import { StepBar } from "@fleet-platform/ui/components/layout/step-bar";
import { ZonedDateTimeField } from "@fleet-platform/ui/components/time/zoned-date-time-field";
import { PlaceSelection } from "./PlaceSelection";
import { CountryCosts } from "./CountryCosts";
import { Quote, QuoteSummary } from "./Quote";
import { ValueDetails } from "./ValueDetails";
import { CustomerStop, CustomerRoute, emptyStop } from "./CustomerStop";
import { SignIn } from "./SignIn";
import { localizeReview } from "./review-labels";

declare global { interface Window { __PROTOTYPE_START__: () => boolean } }
const go = (id: string) => document.dispatchEvent(new CustomEvent("prototype:navigate", { detail: id }));

function Link({ to, children }: { to: string; children: ReactNode }) {
  return <Button variant="secondary" asChild><a href={`#${to}`}>{children}</a></Button>;
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [routeReady, setRouteReady] = useState(true);
  const [routeState, setRouteState] = useState("results");
  const [entryStep, setEntryStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const [active, setActive] = useState("s01");
  const [signInVersion, setSignInVersion] = useState(0);
  const [newComputer, setNewComputer] = useState(false);
  const [role, setRole] = useState("dispatcher");
  const [later, setLater] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [entryVersion, setEntryVersion] = useState(0);
  const [loading, setLoading] = useState(emptyStop);
  const [unloading, setUnloading] = useState(emptyStop);
  const [acceptedStops, setAcceptedStops] = useState({ loading: emptyStop(), unloading: emptyStop() });
  const places = ["Miejsce B", "Miasto B"].includes(loading.place) && ["Miejsce C", "Miasto C"].includes(unloading.place);
  const [freight, setFreight] = useState("");
  const [wash, setWash] = useState("");
  const [loadingDate, setLoadingDate] = useState("2026-11-12");
  const [loadingTime, setLoadingTime] = useState("12:00");
  const [unloadingDate, setUnloadingDate] = useState("2026-11-12");
  const [unloadingTime, setUnloadingTime] = useState("13:00");
  const [accepted, setAccepted] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [screenPicker, setScreenPicker] = useState(false);
  const [quoteStops, setQuoteStops] = useState<{ loading: ReturnType<typeof emptyStop>; unloading: ReturnType<typeof emptyStop> }> ({ loading: { customer: "", place: "Miejsce B" }, unloading: { customer: "", place: "Miejsce C" } });
  const [message, setMessage] = useState("");
  const parsed = parseDecimalInput(freight, { kind: "amount", currency: "EUR" });
  const amount = parsed.ok ? decimal(cents(parsed.value)) : "60.00";
  const demoReady = vehicle === "Auto 01" && places && wash === "none" && parsed.ok && amount === "60.00"
    && loadingDate === "2026-11-12" && loadingTime === "12:00" && unloadingDate === "2026-11-12" && unloadingTime === "13:00";
  const invalidate = () => { setMessage(""); };
  function reset() {
    setEntryStep(1); setCompletedStep(0); setRouteState("results"); setRouteReady(true);
    setEntryVersion(v => v + 1);
    setVehicle(""); setLoading(emptyStop()); setUnloading(emptyStop()); setFreight(""); setWash(""); setAccepted(false); setMessage("");
    setQuoteStops({ loading: { customer: "", place: "Miejsce B" }, unloading: { customer: "", place: "Miejsce C" } });
    setLoadingDate("2026-11-12"); setLoadingTime("12:00"); setUnloadingDate("2026-11-12"); setUnloadingTime("13:00");
    go("s09");
  }
  useEffect(() => {
    const changed = (event: Event) => { setActive((event as CustomEvent<string>).detail); setScreenPicker(false); setMenuOpen(false); };
    document.addEventListener("prototype:screen-change", changed);
    window.__PROTOTYPE_START__();
    const stopLocalizing = localizeReview();
    return () => { document.removeEventListener("prototype:screen-change", changed); stopLocalizing(); };
  }, []);

  const dateLabels = { date: "Data", dateFormat: "DD.MM.RRRR", time: "Godzina", timeFormat: "GG:MM", occurrence: "Którą godzinę wybierasz?", earlier: "przed cofnięciem zegara", later: "po cofnięciu zegara" };
  const dateField = (kind: "loading" | "unloading") => <Field label={kind === "loading" ? "Czas załadunku" : "Koniec rozładunku"} required error={!(kind === "loading" ? loadingDate : unloadingDate) ? "Wpisz poprawną datę DD.MM.RRRR i godzinę GG:MM." : undefined}><ZonedDateTimeField key={`${kind}-time-${entryVersion}`} required timeZone="Europe/Warsaw" zoneLabel="czas warszawski" labels={dateLabels} defaultDate="2026-11-12" defaultTime={kind === "loading" ? "12:00" : "13:00"} onZonedChange={value => {
    (kind === "loading" ? setLoadingDate : setUnloadingDate)(value.ok ? value.date : "");
    (kind === "loading" ? setLoadingTime : setUnloadingTime)(value.ok ? value.time || "" : ""); invalidate();
  }} /></Field>;
  const vehicleOptions = vehicles.map(([name, free, driver, tractor]) => [
    name, name === "Auto 01" && hasAccepted ? "Wolne od 13:00 · Miejsce C" : free, driver, tractor,
  ]).sort((a, b) => {
    const time = (free: string) => free.match(/\d{2}:\d{2}/)?.[0] ?? "99:99";
    return time(a[1]).localeCompare(time(b[1])) || a[3].localeCompare(b[3]);
  });
  const entryRoute = <Card><CardTitle>Trasa kursu</CardTitle><RouteStops label="Trasa kursu" timeZone="Warszawa" stops={tripStops(loading, unloading,
    loadingDate.split("-").reverse().join("."), loadingTime, unloadingDate.split("-").reverse().join("."), unloadingTime,
    vehicles.find(([name]) => name === vehicle)?.slice(2).join(" · ") ?? "")} /><p className="text-meta">Kilometry z symulacji mapy · Szacunek</p></Card>;
  // The viewed K2 fixture is a snapshot, independent of a new or edited entry.
  const viewedStops = accepted ? acceptedStops : quoteStops;
  const quoteRoute = <Card><CardTitle>Trasa kursu</CardTitle><RouteStops label="Trasa kursu" timeZone="Warszawa" stops={tripStops(viewedStops.loading, viewedStops.unloading,
    "12.11.2026", "12:00", "12.11.2026", "13:00", "Kierowca A · DEMO 001")} /><p className="text-meta">Kilometry z symulacji mapy · Szacunek</p></Card>;
  const quoteActions = accepted ? <><Button onClick={reset}>Nowa wycena</Button>{later && <Link to="s07">Kursy auta</Link>}</> : <>
    <Button onClick={() => { if (active === "s16") setConfirm(true); else go("s16"); }}>Przyjmij kurs</Button><Link to="s09">Zmień dane</Link></>;
  function advance(step: number) { setCompletedStep(value => Math.max(value, step)); setEntryStep(step + 1); }
  const content: Record<string, ReactNode> = {
    s01: <SignIn key={signInVersion} newComputer={newComputer} onSignedIn={() => go("s09")} />,
    ...Object.fromEntries(["s02", "s03", "s04"].map(id => [id, <div key={id} className="stack"><p>Nie występuje przy logowaniu systemu biura (W2).</p><Link to="s01">Wróć do logowania</Link></div>])),
    s09: <><h1 className="text-page-title">Nowa wycena</h1>
      <p className="text-meta">Etap 1: przykład K2 · Kierowca A · DEMO 001 · 12.11.2026 · 60,00 EUR · bez mycia. Obliczenia i trasa są symulowane.</p>
      {accepted ? <SuccessMessage>Ten kurs został przyjęty. Przyjęta wycena jest zachowana w symulacji. <Button onClick={reset}>Nowa wycena</Button></SuccessMessage> : <div className="stack">
      <EntryStep number={1} title="Auto" current={entryStep} completed={completedStep} onEdit={setEntryStep} summary={vehicles.find(([name]) => name === vehicle)?.slice(2).join(" · ") ?? ""}>
        <fieldset className="vehicle-options"><legend className="text-meta">Kierowca i ciągnik · 12 aut</legend>
          <div className="vehicle-grid">{vehicleOptions.map(([name, free, driver, tractor]) => <label key={name} className="vehicle-tile">
            <input type="radio" name="entry-vehicle" value={name} checked={vehicle === name} onChange={() => { setVehicle(name); invalidate(); }} />
            <span className="vehicle-driver">{driver}</span>
            <span className="text-meta vehicle-tractor">{tractor}</span>
            <span className={`vehicle-availability${free === "Nieznane" ? " text-meta" : ""}`}>{free}</span>
          </label>)}</div>
        </fieldset>
        <p className="text-meta">Kierowca i numer ciągnika — propozycja spoza specyfikacji; dane fikcyjne.</p>
        {vehicle && vehicle !== "Auto 01" && <Alert variant="neutral" title="Uwaga · To auto dojdzie w etapie 2" action={<Link to="s08">Punkt startowy auta</Link>}>Przykład etapu 1: Kierowca A · DEMO 001.</Alert>}
        <Button disabled={!vehicle} onClick={() => advance(1)}>Dalej: miejsca i czasy</Button>
      </EntryStep>
      <EntryStep number={2} title="Miejsca i czasy" current={entryStep} completed={completedStep} onEdit={setEntryStep} summary={`${loading.place} · ${loadingDate.split("-").reverse().join(".")}, ${loadingTime} → ${unloading.place} · ${unloadingTime}`}>

        <div className="stop-fields">
          <section className="stack"><h2 className="text-section-title">Załadunek</h2><CustomerStop key={`loading-${entryVersion}`} kind="loading" value={loading} onChange={value => { setLoading(value); invalidate(); }}>{dateField("loading")}</CustomerStop></section>
          <section className="stack"><h2 className="text-section-title">Rozładunek</h2><CustomerStop key={`unloading-${entryVersion}`} kind="unloading" value={unloading} onChange={value => { setUnloading(value); invalidate(); }}>{dateField("unloading")}</CustomerStop></section>
        </div>
        <p className="text-meta">Baza klientów — propozycja spoza specyfikacji; dane fikcyjne. Zarządzanie bazą — poza prototypem.</p>

        <Button disabled={!loading.place || !unloading.place || !loadingDate || !loadingTime || !unloadingDate || !unloadingTime} onClick={() => advance(2)}>Dalej: fracht i mycie</Button>
      </EntryStep>
      <EntryStep number={3} title="Fracht i mycie" current={entryStep} completed={completedStep} onEdit={setEntryStep} summary={`${freight} EUR · ${wash === "none" ? "bez mycia" : "nasze mycie"}`}><div className="form-grid">
        {/* DS PROPOSAL: amount input left-aligned */}
        <Field label="Fracht netto" hint="W przykładzie wpisz 60,00" required><DecimalField className="amount-left" kind="amount" currency="EUR" unit="EUR" value={freight} onChange={e => { setFreight(e.target.value); invalidate(); }} /></Field>
        <Field label="Waluta" required><Select defaultValue="EUR"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select></Field>
      </div><Field label="Mycie" required hint="Odpowiedz wprost. Brak wyboru nie oznacza braku mycia.">
        <RadioGroup value={wash} onValueChange={value => { setWash(value); invalidate(); }}>
          <RadioGroupItem value="none" label="Bez mycia" /><RadioGroupItem value="ours" label="Nasze mycie" hint="Kwota i data — etap 2" />
        </RadioGroup></Field>
        {wash === "ours" && <Alert variant="neutral" title="Uwaga · Nasze mycie dojdzie w etapie 2">Ten etap pokazuje przykład bez mycia.</Alert>}
        <Field label="Numer zlecenia" optionalText="opcjonalne"><Input autoComplete="off" /></Field>
        {message && <Alert variant="neutral" title={`Uwaga · ${message}`} />}
        <Button onClick={() => { if (hasAccepted) setMessage("W etapie 1 przyjęto już K2. Resetuj symulację, aby powtórzyć przykład."); else if (demoReady) { setCompletedStep(3); setQuoteStops({ loading: { ...loading }, unloading: { ...unloading } }); go("s11"); } else setMessage("Wybierz Kierowca A · DEMO 001, miejsca B → C, czasy przykładu, fracht 60,00 i Bez mycia."); }}>Dalej: trasa i kraje</Button>
      </EntryStep></div>}

    </>,
    s10: <><h1 className="text-page-title">Wybór miejsca</h1><Card><CardTitle>Załadunek i rozładunek</CardTitle>
      <PlaceSelection key={entryVersion} onApply={(load, unload) => { setLoading(value => ({ ...value, place: load.name, townOnly: load.kind === "town" })); setUnloading(value => ({ ...value, place: unload.name, townOnly: unload.kind === "town" })); invalidate(); setEntryStep(2); go("s09"); }}/>
      <Link to="s09">Wróć do wpisu kursu</Link>
    </Card></>,
    s11: <>
      <Field label="s11 · Odpowiedź serwera"><select aria-label="s11 · Odpowiedź serwera" className="scenario-select" value={routeState} onChange={event => { setRouteState(event.target.value); setRouteReady(event.target.value === "results"); }}><option value="results">Trasa znaleziona</option><option value="searching">Liczę trasę…</option><option value="unavailable">Usługa niedostępna — ręczne km</option></select></Field>
      {/* DS GAP G13: page composition with exact synthetic rates. */}
      {routeState === "searching" ? <p role="status">Liczę trasę…</p> : <CountryCosts manual={routeState === "unavailable"} onReady={setRouteReady}/>}
      <div className="actions"><Link to="s09">Wróć do wpisu</Link><Button disabled={routeState === "searching" || !routeReady} onClick={() => { go("s12"); }}>Wyceń</Button></div></>,
    s12: <>
      {accepted && <SuccessMessage>Kurs przyjęty. Kierowca A · DEMO 001 wolne w Miejscu C od 13:00.</SuccessMessage>}
      <Quote/>
    </>,
    s13: <><ValueDetails/><div className="actions"><Link to="s12">Wróć do wyceny</Link></div></>,
    s16: <><Card><CardTitle>Przyjęcie zachowa wycenę K2</CardTitle><p>Kierowca A · DEMO 001 · Miejsce B → Miejsce C · fracht 60,00 EUR · koszt 38,18 EUR · wynik 21,82 EUR.</p>
      <Link to="s12">Anuluj przyjęcie</Link>
    </Card></>,
    s07: <><h1 className="text-page-title">Kursy auta · Kierowca A · DEMO 001</h1>
      {/* DS GAP G11 and G13: neutral status badges and a chronological list. */}
      <div className="two-columns"><Card><CardTitle>Kolejność kursów</CardTitle><ol className="stack">
        <li className="sequence"><Badge variant="neutral">Przyjęty</Badge><strong>K1</strong><p>Koniec rozładunku: Miejsce A · 12.11.2026, 11:00 (Warszawa).</p></li>
        <li className="sequence"><Badge variant="neutral">{hasAccepted ? "Przyjęty" : "Szkic"}</Badge><strong>K2 · Miejsce B → Miejsce C</strong><CustomerRoute loading={hasAccepted ? acceptedStops.loading : loading} unloading={hasAccepted ? acceptedStops.unloading : unloading}/><p>Cały dojazd od K1: A → B, 20 km. Z ładunkiem: B → C, 80 km. Koniec rozładunku: 12.11.2026, 13:00 (Warszawa).</p><Button variant="secondary" onClick={() => { if (hasAccepted) { setAccepted(true); setFreight("60.00"); } go("s12"); }}>Otwórz wycenę K2</Button></li>
        <li className="sequence"><Badge variant="neutral">{hasAccepted ? "Nieaktualna" : "Szkic"}</Badge><strong>K3</strong><p>Ten sam poprzednik K1 · fracht 30,00 EUR. {hasAccepted ? "Wymaga ponownej wyceny po przyjęciu K2." : "Porównanie szkiców dojdzie w etapie 2."}</p></li>
      </ol></Card><Card><CardTitle>Wolne gdzie i kiedy</CardTitle><p className="text-page-title">{hasAccepted ? "Wolne w Miejscu C od 13:00. Dojazd po K2: otwarty, jeszcze nieprzypisany — czeka na kurs." : "Wolne w Miejscu A od 11:00. Szkic nie zmienia dostępności."}</p>
      <Button onClick={reset}>Nowa wycena</Button></Card></div>
    </>,
  };
  return <>
    {/* Review controls remain outside the product AppFrame. */}
    <aside className="doc-toolbar" aria-label="Przegląd prototypu">
      <div className="actions"><Badge variant="neutral">Prototyp</Badge><span className="text-meta">Etap 1 · dane fikcyjne · teraz: 12.11.2026, 09:30 (Warszawa)</span>
        <Button variant="secondary" aria-expanded={screenPicker} aria-controls="screen-picker" onClick={() => setScreenPicker(!screenPicker)}>Wybierz ekran</Button>
        <nav id="screen-picker" hidden={!screenPicker} className="screen-nav screen-picker" aria-label="Ekrany">{screenNames.map((name, index) => <a key={name} href={`#${screenId(index)}`}>{screenId(index)} · {name}</a>)}</nav>
        <Button variant="secondary" onClick={() => { if (document.body.classList.contains("proto-focus")) {
          Array.from(document.querySelectorAll<HTMLButtonElement>(".proto-toolbar button")).find(button => button.textContent === "Prezentacja" || button.textContent === "Presentation")?.click();
        } document.getElementById("screen-map")?.scrollIntoView(); }}>Mapa ekranów</Button>
        <Button variant="secondary" onClick={() => { setHasAccepted(false); setNewComputer(false); setSignInVersion(v => v + 1); reset(); go("s01"); }}>Resetuj symulację</Button>
      </div>
      <details><summary>Scenariusze</summary><div className="form-grid">
        <label className="sign-in-check"><input type="checkbox" checked={newComputer} onChange={event => setNewComputer(event.target.checked)} />Nowy komputer — czeka na zatwierdzenie</label>

        <Field label="p02 · Konto"><Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dispatcher">Dyspozytor</SelectItem><SelectItem value="owner">Właściciel</SelectItem></SelectContent></Select></Field>
        <Field label="p19 · Zakres"><Select value={later ? "later" : "phase1"} onValueChange={v => setLater(v === "later")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="phase1">Faza 1</SelectItem><SelectItem value="later">Pokaż, co dojdzie później</SelectItem></SelectContent></Select></Field>
      </div></details>
    </aside>
    <div className="doc">
      <nav id="screen-map" className="doc-head stack" aria-label="Mapa ekranów"><h1 className="text-page-title">Prototyp: wycena podczas rozmowy — mapa ekranów</h1><div className="actions">{screenNames.map((name, i) => <Link key={name} to={screenId(i)}>{screenId(i)} · {name}</Link>)}</div></nav>
      {screenNames.map((name, i) => { const id = screenId(i); return <section className="screen" id={id} key={id} aria-label={`${id} · ${name}`}>
        <div className="screen-meta text-meta">{id} · {name}</div><div className="frame">
          {i > 3 ? <>
            <div className="product-menu"><Button variant="secondary" aria-expanded={menuOpen} aria-controls={`${id}-product`} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Zamknij menu" : "Menu"}</Button></div>
            <div id={`${id}-product`} onClick={event => {
              const link = (event.target as HTMLElement).closest('nav a');
              if (link?.getAttribute("href") === "#s09") { event.preventDefault(); reset(); }
              if (link) setMenuOpen(false);
            }}>
            <AppFrame className={menuOpen ? "product-menu-open" : ""} navigationLabel="Nawigacja produktu"
              items={[{ href: "#s09", label: "Nowa wycena", current: ["s09", "s10", "s11", "s12", "s13", "s16"].includes(id) }, ...(later ? [{ href: "#s07", label: "Kursy aut", current: id === "s07" }, { href: "#s06", label: "Flota", current: id === "s06" }] : [])]}
              later={later ? undefined : { label: "Później", items: ["Kursy aut", "Flota"] }}
              account={<><span className="text-meta">{role === "owner" ? "właściciel" : "dyspozytor"}</span><Button variant="text" onClick={() => { reset(); go("s01"); }}>Wyloguj</Button></>}
              width={["s09", "s10", "s11", "s12", "s13", "s16"].includes(id) ? "centred" : "full"}
              steps={["s09", "s10", "s11", "s12", "s13", "s16"].includes(id) ? <StepBar label="Postęp wyceny" steps={["Auto", "Miejsca i czasy", "Fracht i mycie", "Wycena"]} current={id === "s09" ? entryStep - 1 : id === "s10" ? 1 : 3} doneText="gotowe"/> : undefined}
              panel={["s09", "s10"].includes(id) ? entryRoute : ["s11", "s12", "s13", "s16"].includes(id) ? <QuoteSummary amount="60.00" result="21.82" actions={quoteActions}/> : undefined}
              panelLabel={["s09", "s10"].includes(id) ? "Trasa kursu" : "Podsumowanie wyceny"}>
              <div className="stack">
              {["s11", "s12", "s13", "s16"].includes(id) && <><h1 className="text-page-title">{id === "s12" ? <>Wycena K2 · Kierowca A · DEMO 001 <Badge variant="neutral">{accepted ? "Przyjęty" : "Szkic"}</Badge></> : id === "s11" ? "Trasa i kraje" : id === "s13" ? "Szczegóły wartości" : "Przyjęcie kursu"}</h1>{quoteRoute}</>}
              {content[id] ?? <><h1 className="text-page-title">{name}</h1><Card><p>Ten ekran dojdzie w etapie 2.</p><Link to="s09">Wróć do nowej wyceny</Link></Card></>}
              </div>
            </AppFrame></div>
          </> : <div className="screen-content stack">{content[id]}</div>}
        </div><div className="notes"><p className="note text-meta">Prototyp · symulacja, dane fikcyjne · etap 1.</p>{["s12", "s13"].includes(id) && <p className="note text-meta">Podział kosztów auta jest fikcyjną ilustracją stawki dziennej; nie jest konfiguracją firmy. Praca: tylko suma i zatwierdzona stawka przykładu, bez danych płacowych. Źródła są symulowane, bez połączeń z usługami.</p>}</div>
      </section>; })}
    </div>
    <AlertDialog open={confirm && active === "s16"} onOpenChange={setConfirm}><AlertDialogContent>
      <AlertDialogHeader><AlertDialogTitle>Przyjąć kurs K2?</AlertDialogTitle><AlertDialogDescription>Symulacja: zapisze wycenę 21,82 EUR z kursem. Kierowca A · DEMO 001 będzie wolne w Miejscu C od 13:00. Pozostałe szkice staną się nieaktualne.</AlertDialogDescription></AlertDialogHeader>
      <AlertDialogFooter><AlertDialogCancel>Anuluj</AlertDialogCancel><AlertDialogAction onClick={() => { setAcceptedStops({ loading: { ...quoteStops.loading }, unloading: { ...quoteStops.unloading } }); setAccepted(true); setHasAccepted(true); go("s12"); }}>Przyjmij kurs K2</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent></AlertDialog>
  </>;
}

function EntryStep({ number, title, current, completed, onEdit, summary, children }: {
  number: number; title: string; current: number; completed: number; onEdit: (step: number) => void; summary: string; children: ReactNode;
}) {
  const done = number <= completed && number !== current;
  return <Card className={number > current && !done ? "entry-waiting" : undefined}>
    <div className={`step-heading${done ? " step-collapsed" : ""}`}><CardTitle>{number}. {title}</CardTitle>{done && <><Badge variant="neutral">Gotowe</Badge><span className="step-answer" title={summary}>{summary}</span><Button variant="text" onClick={() => onEdit(number)} aria-label={`Zmień: ${title}`}>Zmień</Button></>}</div>
    <div className="stack" hidden={number !== current}>{children}</div>
  </Card>;
}
// Page-owned text and fixture data; shared RouteStops owns the rendering.
function tripStops(loading: { customer: string; place: string; townOnly?: boolean }, unloading: { customer: string; place: string; townOnly?: boolean }, loadingDate: string, loadingTime: string, unloadingDate: string, unloadingTime: string, vehicle: string): RouteStop[] {
  const countries: Record<string, string> = { "Miejsce A": "PL", "Miejsce B": "DE", "Miejsce C": "CZ", "Miejsce E": "CH", "Miasto D": "PL", "Miasto B": "DE", "Miasto C": "CZ" };
  const place = (stop: typeof loading) => stop.place ? `${stop.place} · ${countries[stop.place] || "kraj niepotwierdzony"}${stop.townOnly ? " · Tylko miasto · Szacunek" : ""}` : "Wybierz miejsce";
  return [
    { label: "Start", time: "11:00", date: "12.11.2026", place: "Miejsce A · PL", details: [{ label: "Auto", value: vehicle ? `${vehicle}, wolne po K1` : "Wybierz auto" }] },
    { label: "Załadunek", time: loadingTime || "—", date: loadingDate || "—", place: place(loading), details: [...(loading.customer ? [{ label: "Klient", value: loading.customer }] : []), { label: "Dojazd", value: `20 km, bez ładunku · Szacunek${loading.townOnly ? " · Tylko miasto" : ""}` }] },
    { label: "Rozładunek", time: unloadingTime || "—", date: unloadingDate || "—", place: place(unloading), details: [...(unloading.customer ? [{ label: "Klient", value: unloading.customer }] : []), { label: "Z ładunkiem", value: `80 km · Szacunek${unloading.townOnly ? " · Tylko miasto" : ""}` }, { label: "Potem", value: unloading.place ? `auto wolne w ${unloading.place === "Miejsce C" ? "Miejscu C" : unloading.place}` : "wybierz miejsce rozładunku" }] },
  ];
}
