import { useEffect, useRef, useState, type ReactNode } from "react";
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
import { cents, costs as k2Costs, coveredCost, dateLabels, decimal, screenNames, screenId, timeErrors, vehicles } from "./model";

import { RouteStops, type RouteStop } from "@fleet-platform/ui/components/places/route-stops";
import { AppFrame } from "@fleet-platform/ui/components/layout/app-frame";
import { StepBar } from "@fleet-platform/ui/components/layout/step-bar";
import { ZonedDateTimeField } from "@fleet-platform/ui/components/time/zoned-date-time-field";
import { PlaceSelection, placeScenario } from "./PlaceSelection";
import { CountryCosts } from "./CountryCosts";
import { Quote, QuoteSummary } from "./Quote";
import { Textarea } from "@fleet-platform/ui/components/textarea";
import { LoadingMessage } from "@fleet-platform/ui/backend/feedback/LoadingMessage";
import { ErrorMessage } from "@fleet-platform/ui/backend/feedback/ErrorMessage";
import { CompleteValue, CompareDrafts } from "./QuoteTools";
import { ValueDetails } from "./ValueDetails";
import { CustomerStop, CustomerRoute, emptyStop } from "./CustomerStop";
import { SignIn, demoAccounts, genericSignInError } from "./SignIn";
import { localizeReview } from "./review-labels";
import { defaultState, findState, screenStates } from "./states";
import { StateNotice, replacesContent } from "./StateNotice";
import { Fleet, KmCheck, SimilarTrips } from "./LaterScreens";
import { VehicleStart } from "./VehicleStart";
import { Correction } from "./Correction";

declare global { interface Window { __PROTOTYPE_START__: () => boolean; __PROTOTYPE_STATE__?: (screen: string, state: string) => void } }
const go = (id: string) => document.dispatchEvent(new CustomEvent("prototype:navigate", { detail: id }));
const money = (value: string) => value.replace(".", ",");

function Link({ to, children }: { to: string; children: ReactNode }) {
  return <Button variant="secondary" asChild><a href={`#${to}`}>{children}</a></Button>;
}

type Account = "none" | "dispatcher" | "owner" | "revoked";
type Session = "active" | "expired" | "revoked";
type Clock = "now" | "weekend" | "dst";
const clocks: Record<Clock, string> = { now: "czw. 12.11.2026, 09:30", weekend: "pt. 13.11.2026, 16:00", dst: "czw. 25.03.2027, 09:30" };
const quoteScreens = ["s09", "s10", "s11", "s12", "s13", "s14", "s15", "s16"];
// s12 states in which the quote is incomplete: known parts stay visible, the result and acceptance do not (sc. 11).
const incompleteQuote = ["s12.4", "s12.5", "s12.6", "s12.7", "s12.8", "s12.9", "s12.10", "s12.11", "s12.13", "s12.21"];
// Phase of each later screen (p19, S07-1).
const screenPhase: Record<string, number> = { s06: 2, s07: 2, s19: 2, s17: 3 };
const stateKinds: Record<string, string> = { base: "widoczne w treści", live: "wywołaj na ekranie", info: "komunikat na ekranie", error: "błąd na ekranie", loading: "zamiast treści", failed: "zamiast treści", empty: "zamiast treści" };

export function App() {
  const [routeReady, setRouteReady] = useState(true);
  const [entryStep, setEntryStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const [active, setActive] = useState("s01");
  const [signInVersion, setSignInVersion] = useState(0);
  const [newComputer, setNewComputer] = useState(false);
  // Review-bar scenario controls (p01, p02, p03, p19) and the selected state of each screen.
  const [account, setAccount] = useState<Account>("dispatcher");
  const [session, setSession] = useState<Session>("active");
  const [clock, setClock] = useState<Clock>("now");
  const [phase, setPhase] = useState(1);
  const [stateOf, setStateOf] = useState<Record<string, string>>({});
  const [returnTo, setReturnTo] = useState("");
  const [forbiddenNote, setForbiddenNote] = useState("");
  const st = (screen: string) => stateOf[screen] ?? defaultState(screen);
  const setSt = (screen: string, value: string) => setStateOf(states => ({ ...states, [screen]: value }));
  const signedIn = (account === "dispatcher" || account === "owner") && session === "active";
  const owner = account === "owner";
  const later = phase >= 2;

  const [vehicle, setVehicle] = useState("");
  const [starts, setStarts] = useState<Record<string, string>>({});
  const [entryVersion, setEntryVersion] = useState(0);
  const [loading, setLoading] = useState(emptyStop);
  const [unloading, setUnloading] = useState(emptyStop);
  const [acceptedStops, setAcceptedStops] = useState({ loading: emptyStop(), unloading: emptyStop() });
  const places = ["Miejsce B", "Miasto B"].includes(loading.place) && ["Miejsce C", "Miasto C"].includes(unloading.place);
  const [freight, setFreight] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [wash, setWash] = useState("");
  const [washAmount, setWashAmount] = useState("");
  const [washDate, setWashDate] = useState("");
  const [washErrors, setWashErrors] = useState<{ amount?: string; date?: string }>({});
  const [weekend, setWeekend] = useState("");
  const [weekendError, setWeekendError] = useState("");
  const [loadingDate, setLoadingDate] = useState("2026-11-12");
  const [loadingTime, setLoadingTime] = useState("12:00");
  const [unloadingDate, setUnloadingDate] = useState("2026-11-12");
  const [unloadingTime, setUnloadingTime] = useState("13:00");
  const [timeError, setTimeError] = useState<{ loading?: string; unloading?: string }>({});
  const [saveError, setSaveError] = useState("");
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [quoted, setQuoted] = useState(false);
  const [stale, setStale] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [lossReason, setLossReason] = useState("");
  const [acceptanceError, setAcceptanceError] = useState("");
  const [acceptanceNote, setAcceptanceNote] = useState("");
  const acceptTrigger = useRef<HTMLButtonElement>(null);
  const [screenPicker, setScreenPicker] = useState(false);
  const [quoteStops, setQuoteStops] = useState<{ loading: ReturnType<typeof emptyStop>; unloading: ReturnType<typeof emptyStop> }>({ loading: { customer: "", place: "Miejsce B" }, unloading: { customer: "", place: "Miejsce C" } });
  const [message, setMessage] = useState("");

  // Entry → fixture. Money stays decimal text; result = freight − covered cost in integer cents.
  const parsed = parseDecimalInput(freight, { kind: "amount", currency });
  const freightEur = !freight.trim() ? null : parsed.ok ? (currency === "PLN" ? (decimal(cents(parsed.value)) === "255.00" ? "60.00" : "") : decimal(cents(parsed.value))) : "";
  const parsedWash = parseDecimalInput(washAmount, { kind: "amount", currency: "EUR" });
  const ourWash = wash === "ours" && parsedWash.ok && decimal(cents(parsedWash.value)) === "5.00";
  const unloadingBeforeLoading = !!(loadingDate && loadingTime && unloadingDate && unloadingTime) && `${unloadingDate}T${unloadingTime}` < `${loadingDate}T${loadingTime}`;
  const demoReady = vehicle === "Auto 01" && places && (wash === "none" || ourWash) && (freightEur === null || freightEur === "60.00")
    && loadingDate === "2026-11-12" && loadingTime === "12:00" && unloadingDate === "2026-11-12" && unloadingTime === "13:00";
  const dirty = !!(vehicle || loading.place || unloading.place || freight || wash);

  // The shown quote: K2 fixture, its "Nasze mycie" variant, or the requested s12 state.
  const s12 = st("s12");
  const [snapshot, setSnapshot] = useState<{ amount: string | null; covered: string; wash: boolean } | null>(null);
  const viewWash = accepted && snapshot ? snapshot.wash : quoted && ourWash;
  const covered = viewWash ? "43.18" : coveredCost;
  const shownCosts = viewWash ? k2Costs.map(cost => cost.label === "Mycie" ? { ...cost, value: "5.00", source: "Wpisane: Nasze mycie, 5,00 EUR · fikcyjne" } : cost) : k2Costs;
  const amount = accepted && snapshot ? snapshot.amount : s12 === "s12.15" ? "30.00" : s12 === "s12.16" ? "38.18" : s12 === "s12.5" || (quoted && freightEur === null) ? null : "60.00";
  const pending = !accepted && s12 === "s12.20";
  const incomplete = !accepted && (incompleteQuote.includes(s12) || amount === null);
  const isStale = !accepted && (stale || s12 === "s12.19");
  const result = amount === null || (incomplete && !accepted) ? null : decimal(cents(amount) - cents(covered));
  const loss = !!result?.startsWith("-");
  const quoteReady = !pending && result !== null && !isStale && !cancelled;
  const missingReason = amount === null ? "Brak ceny frachtu" : findState(s12)?.text;

  const invalidate = () => { setMessage(""); setSaveError(""); if (quoted && !accepted) setStale(true); };
  function reset() {
    setLossReason(""); setAcceptanceError(""); setAcceptanceNote(""); setConfirm(false); setLeaveConfirm(false);
    setEntryStep(1); setCompletedStep(0); setRouteReady(true); setQuoted(false); setStale(false);
    setEntryVersion(v => v + 1); setTimeError({}); setSaveError(""); setWashErrors({}); setWeekend(""); setWeekendError("");
    setVehicle(""); setLoading(emptyStop()); setUnloading(emptyStop()); setFreight(""); setCurrency("EUR"); setWash(""); setWashAmount(""); setWashDate(""); setAccepted(false); setMessage("");
    setQuoteStops({ loading: { customer: "", place: "Miejsce B" }, unloading: { customer: "", place: "Miejsce C" } });
    setLoadingDate("2026-11-12"); setLoadingTime("12:00"); setUnloadingDate("2026-11-12"); setUnloadingTime("13:00");
    go("s09");
  }
  function signIn(login: string): string | null {
    const known = demoAccounts.find(candidate => candidate.login === login);
    if (!known?.role) return genericSignInError;
    setAccount(known.role); setSession("active"); setSt("s01", "s01.1");
    go(returnTo || (later ? "s06" : "s09")); setReturnTo("");
    return null;
  }
  function signOut() { reset(); setAccount("none"); go("s01"); }
  function chooseClock(value: Clock) {
    setClock(value);
    // p01 drives the states it names in the screen map: weekend → s09.9 and s12.7; clock change → s09.6 and s08.4.
    setStateOf(states => ({ ...states,
      s09: value === "weekend" ? "s09.9" : value === "dst" ? "s09.6" : "s09.1",
      s12: value === "weekend" ? "s12.7" : "s12.1",
      s08: value === "dst" ? "s08.4" : "s08.1" }));
  }
  function chooseAccount(value: Account) {
    setAccount(value);
    if (value === "revoked") { setSession("revoked"); setSt("s01", "s01.5"); }
    else if (value !== "none") setSession("active");
  }
  function chooseSession(value: Session) { setSession(value); if (value !== "active") setSt("s01", "s01.5"); }
  useEffect(() => {
    const changed = (event: Event) => { setActive((event as CustomEvent<string>).detail); setScreenPicker(false); };
    document.addEventListener("prototype:screen-change", changed);
    window.__PROTOTYPE_START__();
    // Verification hook: the same effect as choosing a state in the review bar.
    window.__PROTOTYPE_STATE__ = (screen, state) => setStateOf(states => ({ ...states, [screen]: state }));
    const stopLocalizing = localizeReview();
    return () => { document.removeEventListener("prototype:screen-change", changed); stopLocalizing(); };
  }, []);

  const dateField = (kind: "loading" | "unloading") => {
    const error = timeError[kind] ?? (kind === "unloading" && unloadingBeforeLoading ? "Koniec rozładunku jest przed załadunkiem. Popraw datę albo godzinę." : undefined);
    return <Field label={kind === "loading" ? "Czas załadunku" : "Koniec rozładunku"} required error={error}><ZonedDateTimeField key={`${kind}-time-${entryVersion}`} required timeZone="Europe/Warsaw" zoneLabel="czas warszawski" labels={dateLabels}
      defaultDate={kind === "loading" ? loadingDate : unloadingDate} defaultTime={kind === "loading" ? loadingTime : unloadingTime} onZonedChange={value => {
        (kind === "loading" ? setLoadingDate : setUnloadingDate)(value.ok ? value.date : "");
        (kind === "loading" ? setLoadingTime : setUnloadingTime)(value.ok ? value.time || "" : "");
        setTimeError(errors => ({ ...errors, [kind]: value.ok ? (value.time ? undefined : timeErrors.missingTime) : timeErrors[value.reason] }));
        invalidate();
      }} /></Field>;
  };
  const vehicleOptions = vehicles.map(([name, free, driver, tractor]) => [
    name, name === "Auto 01" && hasAccepted && !cancelled ? "Wolne od 13:00 · Miejsce C" : starts[name] ?? free, driver, tractor,
  ]).sort((a, b) => {
    const time = (free: string) => free.match(/\d{2}:\d{2}/)?.[0] ?? "99:99";
    return time(a[1]).localeCompare(time(b[1])) || a[3].localeCompare(b[3]);
  });
  const vehicleLabel = (name: string) => vehicles.find(([id]) => id === name)?.slice(2).join(" · ") ?? "";
  const entryRoute = <Card><CardTitle>Trasa kursu</CardTitle><RouteStops label="Trasa kursu" timeZone="Warszawa" stops={tripStops(loading, unloading,
    loadingDate.split("-").reverse().join("."), loadingTime, unloadingDate.split("-").reverse().join("."), unloadingTime, vehicleLabel(vehicle))} /><p className="text-meta">Kilometry z symulacji mapy · Szacunek</p></Card>;
  // The viewed K2 fixture is a snapshot, independent of a new or edited entry.
  const viewedStops = accepted ? acceptedStops : quoteStops;
  const quoteRoute = <Card><CardTitle>Trasa kursu</CardTitle><RouteStops label="Trasa kursu" timeZone="Warszawa" stops={tripStops(viewedStops.loading, viewedStops.unloading,
    "12.11.2026", "12:00", "12.11.2026", "13:00", "Kierowca A · DEMO 001")} /><p className="text-meta">Kilometry z symulacji mapy · Szacunek</p></Card>;
  const quoteActions = accepted ? <><Button onClick={reset}>Nowa wycena</Button>{later && <><Link to="s07">Kursy auta</Link><Link to="s06">Wróć do floty</Link></>}<Link to="s18">Korekta lub anulowanie</Link></> : <>
    <Button ref={active === "s16" ? acceptTrigger : undefined} disabled={!quoteReady} onClick={() => { if (active === "s16") { setAcceptanceError(""); setAcceptanceNote(""); setConfirm(true); } else go("s16"); }}>Przyjmij kurs</Button><Link to="s09">Zmień dane</Link></>;
  function advance(step: number) { setCompletedStep(value => Math.max(value, step)); setEntryStep(step + 1); }
  function finishEntry() {
    const s09 = st("s09");
    const washProblems = wash === "ours" ? { amount: parsedWash.ok ? undefined : "Wpisz kwotę mycia, np. 5,00.", date: washDate ? undefined : "Wpisz datę mycia DD.MM.RRRR." } : {};
    setWashErrors(washProblems);
    if (washProblems.amount || washProblems.date) return;
    if (["s09.9", "s09.10"].includes(s09) && !weekend) { setWeekendError("Odpowiedz na pytanie o weekend."); return; }
    if (s09 === "s09.13") {
      // The simulated save fails; every typed value stays and focus moves to the first named field.
      setSaveError("Nie zapisano wpisu: serwer odrzucił fracht (symulacja). Wpisane dane zostały; popraw pole i zapisz ponownie.");
      document.querySelector<HTMLInputElement>("#s09 input[data-freight]")?.focus(); return;
    }
    if (hasAccepted) setMessage("W symulacji przyjęto już K2. Resetuj symulację, aby powtórzyć przykład.");
    else if (demoReady) { setCompletedStep(3); setQuoted(true); setStale(false); setQuoteStops({ loading: { ...loading }, unloading: { ...unloading } }); go("s11"); }
    else setMessage("Wycenę ma tylko przykład K2: Kierowca A · DEMO 001, Miejsce B → Miejsce C, 12.11.2026 12:00–13:00, fracht 60,00 EUR (albo 255,00 PLN, albo pusty) i Bez mycia albo Nasze mycie 5,00 EUR.");
  }
  const s09 = st("s09");
  const content: Record<string, ReactNode> = {
    s01: <SignIn key={signInVersion} stateId={st("s01")} newComputer={newComputer} onSignedIn={signIn} />,
    ...Object.fromEntries(["s02", "s03", "s04"].map(id => [id, <div key={id} className="stack"><p>Nie występuje przy logowaniu systemu biura (W2). Hasła i dostęp nadaje administrator systemu biura.</p><p className="text-meta">Wybrany stan: {findState(st(id))?.label}</p><Link to="s01">Wróć do logowania</Link></div>])),
    s05: owner ? <><h1 className="text-page-title">Ekrany właściciela</h1><Card><p>Właściciel ma dostęp do stawek, członków i aut (s20–s22). Te ekrany są poza prototypem.</p><Link to="s09">Wróć do nowej wyceny</Link></Card></>
      : <><h1 className="text-page-title">Brak uprawnień</h1><Alert variant="error" title="Ta strona wymaga roli właściciela." action={<Link to="s09">Wróć do nowej wyceny</Link>}>Twoja rola: dyspozytor. Nadal możesz wyceniać kursy.</Alert></>,
    s06: <Fleet stateId={st("s06")} owner={owner} acceptedK2={hasAccepted && !cancelled} onQuote={name => { reset(); setVehicle(name); }} />,
    s08: <VehicleStart key={`${vehicle}-${st("s08")}`} stateId={st("s08")} vehicle={vehicleLabel(st("s08") === "s08.2" ? "Auto 02" : vehicle || "Auto 03")}
      initial={st("s08") === "s08.2" || vehicle === "Auto 02" ? undefined : st("s08") === "s08.4" ? { place: "Miejsce B", date: "2027-03-28", time: "02:30" } : { place: "Miejsce B", date: "2026-11-12", time: "15:00" }}
      onSaved={(place, date, time) => setStarts(values => ({ ...values, [st("s08") === "s08.2" ? "Auto 02" : vehicle || "Auto 03"]: date === "2026-11-12" ? `Wolne od ${time} · ${place}` : `Wolne ${date.split("-").reverse().join(".")} od ${time} · ${place}` }))} />,
    s09: <><h1 className="text-page-title">Nowa wycena</h1>
      <p className="text-meta">Przykład K2 · Kierowca A · DEMO 001 · 12.11.2026 · 60,00 EUR · bez mycia. Obliczenia i trasa są symulowane.</p>
      <StateNotice stateId={s09} />
      {s09 === "s09.16" && <Alert variant="neutral" title="Uwaga · Sesja wygasła w trakcie wpisu" action={<Button onClick={() => { setSession("expired"); setSt("s01", "s01.5"); setSt("s09", "s09.1"); setReturnTo("s09"); go("s01"); }}>Zaloguj ponownie</Button>}>Wpisane dane zostają w tym oknie. Los danych po dłuższej przerwie czeka na decyzję (L11).</Alert>}
      {saveError && <ErrorMessage>{saveError}</ErrorMessage>}
      {accepted ? <SuccessMessage>Ten kurs został przyjęty. Przyjęta wycena jest zachowana w symulacji. <Button onClick={reset}>Nowa wycena</Button></SuccessMessage> : <div className="stack">
      <EntryStep number={1} title="Auto" current={entryStep} completed={completedStep} onEdit={setEntryStep} summary={vehicleLabel(vehicle)}>
        <fieldset className="vehicle-options"><legend className="text-meta">Kierowca i ciągnik · 12 aut</legend>
          <div className="vehicle-grid">{vehicleOptions.map(([name, free, driver, tractor]) => <label key={name} className="vehicle-tile">
            <input type="radio" name="entry-vehicle" value={name} checked={vehicle === name} onChange={() => { setVehicle(name); invalidate(); }} />
            <span className="vehicle-driver">{driver}</span>
            <span className="text-meta vehicle-tractor">{tractor}</span>
            <span className={`vehicle-availability${free === "Nieznane" ? " text-meta" : ""}`}>{free}</span>
          </label>)}</div>
        </fieldset>
        <p className="text-meta">Kierowca i numer ciągnika — propozycja spoza specyfikacji; dane fikcyjne.</p>
        {vehicle === "Auto 02" && !starts["Auto 02"] && <Alert variant="neutral" title="Uwaga · Brak pierwszego dojazdu" action={<Button variant="secondary" onClick={() => { setSt("s08", "s08.2"); go("s08"); }}>Wpisz punkt startowy</Button>}>Auto nie ma kursów ani punktu startowego. Wycena będzie niepełna.</Alert>}
        {vehicle && vehicle !== "Auto 01" && <Alert variant="neutral" title="Uwaga · Wycena tylko dla przykładu K2">Pełną wycenę ma Kierowca A · DEMO 001. Dla innych aut prototyp pokazuje wpis i punkt startowy.</Alert>}
        <Button disabled={!vehicle} onClick={() => advance(1)}>Dalej: miejsca i czasy</Button>
      </EntryStep>
      <EntryStep number={2} title="Miejsca i czasy" current={entryStep} completed={completedStep} onEdit={setEntryStep} summary={`${loading.place} · ${loadingDate.split("-").reverse().join(".")}, ${loadingTime} → ${unloading.place} · ${unloadingTime}`}>
        <div className="stop-fields">
          <section className="stack"><h2 className="text-section-title">Załadunek</h2><CustomerStop key={`loading-${entryVersion}`} kind="loading" value={loading} onChange={value => { setLoading(value); invalidate(); }}>{dateField("loading")}</CustomerStop></section>
          <section className="stack"><h2 className="text-section-title">Rozładunek</h2><CustomerStop key={`unloading-${entryVersion}`} kind="unloading" value={unloading} onChange={value => { setUnloading(value); invalidate(); }}>{dateField("unloading")}</CustomerStop></section>
        </div>
        <p className="text-meta">Baza klientów — propozycja spoza specyfikacji; dane fikcyjne. Zarządzanie bazą — poza prototypem.</p>
        <Button disabled={!loading.place || !unloading.place || !loadingDate || !loadingTime || !unloadingDate || !unloadingTime || unloadingBeforeLoading} onClick={() => advance(2)}>Dalej: fracht i mycie</Button>
      </EntryStep>
      <EntryStep number={3} title="Fracht i mycie" current={entryStep} completed={completedStep} onEdit={setEntryStep} summary={`${freight ? `${freight} ${currency}` : "bez frachtu"} · ${wash === "none" ? "bez mycia" : wash === "ours" ? "nasze mycie" : "mycie bez odpowiedzi"}`}><div className="form-grid">
        {/* DS PROPOSAL: amount input left-aligned */}
        <Field label="Fracht netto" optionalText="opcjonalne" hint="Bez frachtu wycena pokaże koszty bez wyniku. W przykładzie: 60,00 EUR albo 255,00 PLN."><DecimalField data-freight className="amount-left" kind="amount" currency={currency} unit={currency} value={freight} onChange={e => { setFreight(e.target.value); invalidate(); }} /></Field>
        <Field label="Waluta" required><Select value={currency} onValueChange={value => { setCurrency(value); invalidate(); }}><SelectTrigger aria-label="Waluta"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="EUR">EUR</SelectItem><SelectItem value="PLN">PLN</SelectItem></SelectContent></Select></Field>
      </div>
        {currency === "PLN" && <Alert variant="neutral" title="Uwaga · Fracht w PLN">Przeliczenie kursem 4,250000 PLN za 1 EUR z tabeli z 11.11.2026 (fikcyjny). Wynik w EUR będzie szacunkiem.</Alert>}
        <Field label="Mycie" required hint="Odpowiedz wprost. Brak wyboru nie oznacza braku mycia.">
        <RadioGroup value={wash} onValueChange={value => { setWash(value); setWashErrors({}); invalidate(); }}>
          <RadioGroupItem value="none" label="Bez mycia" /><RadioGroupItem value="ours" label="Nasze mycie" hint="Kwota i data wymagane, godzina opcjonalna" />
        </RadioGroup></Field>
        {wash === "ours" && <div className="form-grid">
          <Field label="Kwota mycia netto" required hint="W przykładzie: 5,00" error={washErrors.amount}><DecimalField className="amount-left" kind="amount" currency="EUR" unit="EUR" value={washAmount} onChange={e => { setWashAmount(e.target.value); setWashErrors(errors => ({ ...errors, amount: undefined })); invalidate(); }} /></Field>
          <Field label="Data mycia" required hint="Godzina opcjonalna" error={washErrors.date}><ZonedDateTimeField key={`wash-${entryVersion}`} timeOptional timeZone="Europe/Warsaw" zoneLabel="czas warszawski" labels={dateLabels} defaultDate={washDate} defaultTime="" onZonedChange={value => { setWashDate(value.ok ? value.date : ""); setWashErrors(errors => ({ ...errors, date: undefined })); invalidate(); }} /></Field>
        </div>}
        {["s09.9", "s09.10"].includes(s09) && <Field label="Co kierowca robi w weekend?" required error={weekendError || undefined} hint={s09 === "s09.10" ? "Kurs obejmuje dwa weekendy: jeden wybór dla obu (L21)." : "Przykład specyfikacji (Kierowca D · DEMO 004, jeden dzień weekendu)."}>
          <RadioGroup value={weekend} onValueChange={value => { setWeekend(value); setWeekendError(""); }}>
            <RadioGroupItem value="home" label="Wraca do domu" hint="Koszt kursu 100,18 EUR" /><RadioGroupItem value="abroad" label="Odpoczywa za granicą" hint="Koszt kursu 124,18 EUR (ryczałt 24,00 EUR)" /><RadioGroupItem value="continues" label="Jedzie dalej" hint="Koszt kursu 148,18 EUR" />
          </RadioGroup></Field>}
        <Field label="Numer zlecenia" optionalText="opcjonalne"><Input autoComplete="off" /></Field>
        {message && <Alert variant="neutral" title={`Uwaga · ${message}`} />}
        <Button disabled={s09 === "s09.12"} onClick={finishEntry}>Dalej: trasa i kraje</Button>
      </EntryStep></div>}
    </>,
    s10: <><h1 className="text-page-title">Wybór miejsca</h1><Card><CardTitle>Załadunek i rozładunek</CardTitle>
      <PlaceSelection key={`${entryVersion}-${st("s10")}`} {...placeScenario(st("s10"))} onApply={(load, unload) => { setLoading(value => ({ ...value, place: load.name, townOnly: load.kind === "town" })); setUnloading(value => ({ ...value, place: unload.name, townOnly: unload.kind === "town" })); invalidate(); setEntryStep(2); go("s09"); }} />
      <Link to="s09">Wróć do wpisu kursu</Link>
    </Card></>,
    s11: <>
      <StateNotice stateId={st("s11")} />
      {/* DS GAP G13: page composition with exact synthetic rates. */}
      {st("s11") !== "s11.2" && <CountryCosts key={st("s11")} manual={st("s11") === "s11.3"} covered={covered} onReady={setRouteReady} />}
      <div className="actions"><Link to="s09">Wróć do wpisu</Link><Button disabled={st("s11") === "s11.2" || !routeReady} onClick={() => { go("s12"); }}>Wyceń</Button></div></>,
    s12: <>
      {accepted && <SuccessMessage>{cancelled ? "Kurs anulowany. Zostaje w historii z dowodami." : "Kurs przyjęty. Kierowca A · DEMO 001 wolne w Miejscu C od 13:00."}</SuccessMessage>}
      {!accepted && <StateNotice stateId={s12} />}
      {amount === null && s12 !== "s12.5" && <Alert variant="neutral" title="Uwaga · Brak ceny frachtu. Pokazuję koszty bez wyniku." />}
      {isStale && <Alert variant="neutral" title="Uwaga · Wycena nieaktualna" action={<Link to="s09">Wróć do wpisu</Link>}>Dane zmieniły się po wycenie. Przyjęcie jest wyłączone do ponownej wyceny.</Alert>}
      {currency === "PLN" && quoted && <p className="text-meta">Fracht 255,00 PLN → 60,00 EUR po kursie 4,250000 PLN za 1 EUR (tabela z 11.11.2026, fikcyjna) · Szacunek.</p>}
      {pending ? <LoadingMessage>Liczę wycenę…</LoadingMessage> : <Quote costs={shownCosts} covered={covered}>
        {s12 === "s12.12" && <p className="text-meta">Telematyka: Nie uwzględniono. Kategoria bez stawki nie ma kwoty ani procentu.</p>}
        {s12 === "s12.16" && <p className="text-meta">Wynik 0,00 EUR. Linia uzgodnienia pojawia się tylko, gdy składniki różnią się od sumy.</p>}
      </Quote>}
      <div className="actions"><Link to="s14">Uzupełnij daną</Link><Link to="s15">Porównaj szkice</Link><Button variant="secondary" onClick={() => { reset(); setVehicle("Auto 01"); }}>Druga oferta dla tego auta</Button>{phase >= 3 && <Link to="s17">Podobne kursy</Link>}</div>
    </>,
    s13: <><ValueDetails amount={amount ?? "60.00"} owner={owner} stateId={st("s13")} covered={covered} /><div className="actions"><Link to="s12">Wróć do wyceny</Link></div></>,
    s14: <CompleteValue stateId={st("s14")} />,
    s15: <CompareDrafts stateId={st("s15")} accepted={hasAccepted} acceptedLoss={hasAccepted && loss} />,
    s16: !quoteReady && !accepted ? <Alert variant="neutral" title="Uwaga · Przyjęcie niemożliwe">Wycena jest niepełna, nieaktualna, sprzeczna albo jeszcze liczona. Wróć do wyceny.<Link to="s12">Wróć do wyceny</Link></Alert> : <><Card><CardTitle>Przyjęcie zachowa pokazaną wycenę K2</CardTitle><p>Kierowca A · DEMO 001 · Miejsce B → Miejsce C · fracht {amount ? money(amount) : "—"} EUR · koszt {money(covered)} EUR · wynik {result ? money(result) : "—"} EUR.</p>
      {acceptanceNote && <SuccessMessage>{acceptanceNote}</SuccessMessage>}
      <Link to="s12">Anuluj przyjęcie</Link>
    </Card></>,
    s07: replacesContent(st("s07")) ? <><h1 className="text-page-title">Kursy auta</h1><StateNotice stateId={st("s07")} action={<Link to="s08">Wpisz punkt startowy</Link>} /></> : <><h1 className="text-page-title">Kursy auta · Kierowca A · DEMO 001</h1>
      {/* DS GAP G11 and G13: neutral status badges and a chronological list. */}
      <div className="two-columns"><Card><CardTitle>Kolejność kursów</CardTitle><ol className="stack">
        {st("s07") === "s07.5" && <li className="sequence"><Badge variant="neutral">Anulowany</Badge><strong>K0</strong><p>Zostaje w historii z dowodami. Jego odcinki są nieprzypisane i do przeglądu.</p></li>}
        <li className="sequence"><Badge variant="neutral">Przyjęty</Badge><strong>K1</strong><p>Koniec rozładunku: Miejsce A · 12.11.2026, 11:00 (Warszawa).</p></li>
        <li className="sequence"><Badge variant="neutral">{cancelled ? "Anulowany" : hasAccepted ? "Przyjęty" : "Szkic"}</Badge><strong>K2 · Miejsce B → Miejsce C</strong><CustomerRoute loading={hasAccepted ? acceptedStops.loading : loading} unloading={hasAccepted ? acceptedStops.unloading : unloading} /><p>Cały dojazd od K1: A → B, 20 km. Z ładunkiem: B → C, 80 km. Koniec rozładunku: 12.11.2026, 13:00 (Warszawa).</p><Button variant="secondary" onClick={() => { if (hasAccepted) setAccepted(true); go("s12"); }}>Otwórz wycenę K2</Button></li>
        <li className="sequence"><Badge variant="neutral">{hasAccepted ? "Nieaktualna" : "Szkic"}</Badge><strong>K3</strong><p>Ten sam poprzednik K1 · fracht 30,00 EUR. {hasAccepted ? "Wymaga ponownej wyceny po przyjęciu K2." : "Szkic od ostatniego przyjętego kursu (K1)."}</p><Link to="s15">Porównaj szkice</Link></li>
        {st("s07") === "s07.6" && <li className="sequence"><Badge variant="neutral">Do przeglądu</Badge><strong>K4</strong><p>Przyjęty następnik. Poprzednik zmienił się po przyjęciu, więc kurs ma flagę przeglądu harmonogramu.</p></li>}
        {st("s07") === "s07.7" && <li className="sequence"><Badge variant="neutral">Do przeglądu</Badge><strong>Nakładanie: K2 i K4</strong><p>Oba kursy zajmują auto 12.11.2026 między 12:00 a 13:00 (Warszawa). Popraw jeden z nich.</p></li>}
      </ol></Card><Card><CardTitle>Wolne gdzie i kiedy</CardTitle><p className="text-page-title">{hasAccepted && !cancelled ? "Wolne w Miejscu C od 13:00. Dojazd po K2: otwarty, jeszcze nieprzypisany — czeka na kurs." : "Wolne w Miejscu A od 11:00. Szkic nie zmienia dostępności."}</p>
      <div className="actions"><Button onClick={reset}>Nowa wycena</Button><Link to="s19">Kontrola km</Link></div></Card></div>
    </>,
    s17: <SimilarTrips stateId={st("s17")} />,
    s18: <Correction key={String(hasAccepted)} stateId={st("s18")} accepted={hasAccepted} cancelled={cancelled} onDone={action => { if (action === "cancel") setCancelled(true); }} />,
    s19: <KmCheck />,
  };
  const states = screenStates[active] ?? [];
  const selected = findState(st(active));
  return <>
    {/* Review controls remain outside the product AppFrame. */}
    <aside className="doc-toolbar" aria-label="Przegląd prototypu">
      <div className="actions"><Badge variant="neutral">Prototyp</Badge><span className="text-meta">Etap 2 · dane fikcyjne · teraz: {clocks[clock]} (Warszawa)</span>
        <Button variant="secondary" aria-expanded={screenPicker} aria-controls="screen-picker" onClick={() => setScreenPicker(!screenPicker)}>Wybierz ekran</Button>
        <nav id="screen-picker" hidden={!screenPicker} className="screen-nav screen-picker" aria-label="Ekrany">{screenNames.map((name, index) => <a key={name} href={`#${screenId(index)}`}>{screenId(index)} · {name}</a>)}</nav>
        <Button variant="secondary" onClick={() => { if (document.body.classList.contains("proto-focus")) {
          Array.from(document.querySelectorAll<HTMLButtonElement>(".proto-toolbar button")).find(button => button.textContent === "Prezentacja" || button.textContent === "Presentation")?.click();
        } document.getElementById("screen-map")?.scrollIntoView(); }}>Mapa ekranów</Button>
        <Button variant="secondary" onClick={() => { setHasAccepted(false); setCancelled(false); setSnapshot(null); setNewComputer(false); setSignInVersion(v => v + 1); setStateOf({}); setStarts({}); setAccount("dispatcher"); setSession("active"); setClock("now"); setPhase(1); setForbiddenNote(""); reset(); go("s01"); }}>Resetuj symulację</Button>
      </div>
      <details><summary>Scenariusze</summary><div className="stack">
        <div className="form-grid">
          <Field label={`Stan ekranu ${active}`} hint={selected ? `${stateKinds[selected.kind]}${selected.hint ? ` · ${selected.hint}` : ""}` : undefined}>
            <Select value={st(active)} onValueChange={value => setSt(active, value)}><SelectTrigger aria-label={`Stan ekranu ${active}`}><SelectValue /></SelectTrigger>
              <SelectContent>{states.map(state => <SelectItem key={state.id} value={state.id}>{state.id} · {state.label}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="p01 · Zegar demo"><Select value={clock} onValueChange={value => chooseClock(value as Clock)}><SelectTrigger aria-label="p01 · Zegar demo"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="now">Teraz · 12.11.2026, 09:30</SelectItem><SelectItem value="weekend">Weekend · 13.11.2026, 16:00</SelectItem><SelectItem value="dst">Zmiana czasu · 25.03.2027, 09:30</SelectItem></SelectContent></Select></Field>
          <Field label="p02 · Konto"><Select value={account} onValueChange={value => chooseAccount(value as Account)}><SelectTrigger aria-label="p02 · Konto"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Niezalogowany</SelectItem><SelectItem value="dispatcher">Dyspozytor</SelectItem><SelectItem value="owner">Właściciel</SelectItem><SelectItem value="revoked">Odwołany</SelectItem></SelectContent></Select></Field>
          <Field label="p03 · Sesja"><Select value={session} onValueChange={value => chooseSession(value as Session)}><SelectTrigger aria-label="p03 · Sesja"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Aktywna</SelectItem><SelectItem value="expired">Wygasła</SelectItem><SelectItem value="revoked">Odwołana</SelectItem></SelectContent></Select></Field>
          <Field label="p19 · Pokaż, co dojdzie później"><Select value={String(phase)} onValueChange={value => setPhase(Number(value))}><SelectTrigger aria-label="p19 · Pokaż, co dojdzie później"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">Faza 1</SelectItem><SelectItem value="2">Faza 2 · flota, kursy aut, kontrola km</SelectItem><SelectItem value="3">Faza 3 · także podobne kursy</SelectItem></SelectContent></Select></Field>
        </div>
        <div className="actions">
          <label className="sign-in-check"><input type="checkbox" checked={newComputer} onChange={event => setNewComputer(event.target.checked)} />s01 · Nowy komputer czeka na zatwierdzenie</label>
          <Button variant="secondary" onClick={() => { setForbiddenNote(owner ? "Właściciel: ekran stawek (s20) jest poza prototypem." : ""); go("s05"); }}>Otwórz adres stawek (s20)</Button>
          {forbiddenNote && <span className="text-meta">{forbiddenNote}</span>}
        </div>
        <p className="text-meta">p04–p18 to stany ekranów w „Stan ekranu” (numer kontrolki w nawiasie). p04 i p05 nie występują przy logowaniu systemu biura (W2).</p>
      </div></details>
    </aside>
    <div className="doc">
      <nav id="screen-map" className="doc-head stack" aria-label="Mapa ekranów"><h1 className="text-page-title">Prototyp: wycena podczas rozmowy — mapa ekranów</h1><div className="actions">{screenNames.map((name, i) => <Link key={name} to={screenId(i)}>{screenId(i)} · {name}</Link>)}</div></nav>
      {screenNames.map((name, i) => { const id = screenId(i); const needsPhase = screenPhase[id] ?? 1; return <section className="screen" id={id} key={id} aria-label={`${id} · ${name}`}>
        <div className="screen-meta text-meta">{id} · {name}{needsPhase > 1 ? ` · Faza ${needsPhase}` : ""}</div><div className="frame">
          {i > 3 ? <>
            {!signedIn && <div className="screen-content stack"><Alert variant="neutral" title="Uwaga · Zaloguj się" action={<Button onClick={() => { setReturnTo(id); go("s01"); }}>Przejdź do logowania</Button>}>
              {account === "none" ? "Ten ekran wymaga zalogowania." : "Sesja wygasła albo została zakończona. Zaloguj się ponownie."}</Alert></div>}
            {/* Product content stays mounted behind the sign-in gate, so typed values survive an expired session (s09.16). */}
            <div id={`${id}-product`} hidden={!signedIn} onClick={event => {
              const link = (event.target as HTMLElement).closest("nav a");
              if (link?.getAttribute("href") === "#s09") { event.preventDefault(); if (st("s09") === "s09.14" && dirty && !accepted) setLeaveConfirm(true); else reset(); }
            }}>
            <AppFrame navigationLabel="Nawigacja produktu"
              items={[...(later ? [{ href: "#s06", label: "Flota", current: id === "s06" }] : []), { href: "#s09", label: "Nowa wycena", current: quoteScreens.includes(id) }, ...(later ? [{ href: "#s07", label: "Kursy aut", current: id === "s07" }] : [])]}
              later={later ? undefined : { label: "Później", items: ["Kursy aut", "Flota"] }}
              account={<><span className="text-meta">{owner ? "wlasciciel@firma-demo.example · właściciel" : "dyspozytor@firma-demo.example · dyspozytor"}</span><Button variant="text" onClick={signOut}>Wyloguj</Button></>}
              width={quoteScreens.includes(id) ? "centred" : "full"}
              steps={quoteScreens.includes(id) ? <StepBar label="Postęp wyceny" steps={["Auto", "Miejsca i czasy", "Fracht i mycie", "Wycena"]} current={id === "s09" ? entryStep - 1 : id === "s10" ? 1 : 3} doneText="gotowe" /> : undefined}
              panel={["s09", "s10"].includes(id) ? entryRoute : ["s11", "s12", "s13", "s14", "s15", "s16"].includes(id) ? (pending ? <Card><CardTitle>Podsumowanie wyceny</CardTitle><p>Wynik niedostępny. Poczekaj na odpowiedź usługi.</p></Card> : <QuoteSummary amount={amount} result={result} covered={covered} missing={missingReason} actions={quoteActions} />) : undefined}
              panelLabel={["s09", "s10"].includes(id) ? "Trasa kursu" : "Podsumowanie wyceny"}>
              <div className="stack">
              {phase < needsPhase && <Alert variant="neutral" title={`Uwaga · Ten ekran dojdzie w Fazie ${needsPhase}`}>W Fazie 1 go nie ma. Włącz p19 w scenariuszach, żeby zobaczyć go w nawigacji produktu.</Alert>}
              {["s11", "s12", "s13", "s16"].includes(id) && <><h1 className="text-page-title">{id === "s12" ? <>Wycena K2 · Kierowca A · DEMO 001 <Badge variant="neutral">{cancelled ? "Anulowany" : accepted ? "Przyjęty" : isStale ? "Nieaktualna" : "Szkic"}</Badge></> : id === "s11" ? "Trasa i kraje" : id === "s13" ? "Szczegóły wartości" : "Przyjęcie kursu"}</h1>{quoteRoute}</>}
              {["s06", "s08", "s14", "s15", "s17", "s19"].includes(id) || !replacesContent(st(id)) || id === "s07" ? content[id] : <StateNotice stateId={st(id)} />}
              </div>
            </AppFrame></div>
          </> : <div className="screen-content stack">{content[id]}</div>}
        </div><div className="notes"><p className="note text-meta">Prototyp · symulacja, dane fikcyjne · etap 2 · stan: {findState(st(id))?.id} {findState(st(id))?.label}.</p>{["s12", "s13"].includes(id) && <p className="note text-meta">Podział kosztów auta jest fikcyjną ilustracją stawki dziennej; nie jest konfiguracją firmy. Praca: dyspozytor widzi tylko sumę, właściciel także zatwierdzoną stawkę przykładu; bez danych płacowych. Źródła są symulowane, bez połączeń z usługami.</p>}</div>
      </section>; })}
    </div>
    <AlertDialog open={confirm && active === "s16"} onOpenChange={setConfirm}><AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); if (accepted) document.querySelector<HTMLHeadingElement>("#s12 h1")?.focus(); else acceptTrigger.current?.focus(); }}>
      <AlertDialogHeader><AlertDialogTitle>Przyjąć kurs K2?</AlertDialogTitle><AlertDialogDescription>Symulacja: zapisze wycenę {result ? money(result) : "—"} EUR z kursem. Kierowca A · DEMO 001 będzie wolne w Miejscu C od 13:00. Pozostałe szkice staną się nieaktualne.</AlertDialogDescription></AlertDialogHeader>
      <Field label={loss ? "Powód przyjęcia straty" : "Notatka przyjęcia"} required={loss} optionalText={loss ? undefined : "opcjonalne"} hint="Krótko, bez nazwisk i danych osobowych. Do 500 znaków." error={acceptanceError || undefined}><Textarea value={lossReason} onChange={event => { setLossReason(event.target.value); setAcceptanceError(""); }} maxLength={500} /></Field>
      <AlertDialogFooter><AlertDialogCancel>Anuluj</AlertDialogCancel><AlertDialogAction onClick={event => {
        if (!quoteReady || (loss && !lossReason.trim())) { event.preventDefault(); setAcceptanceError("Wpisz powód przyjęcia straty."); return; }
        // s16.5, s16.6, s16.8: the simulated server refuses; the typed note stays in the dialog.
        const refusal: Record<string, string> = {
          "s16.5": "Nie przyjęto: kurs nakłada się z przyjętym kursem K4 (12:00–13:00). Popraw czasy. Notatka została.",
          "s16.6": "Nie przyjęto: harmonogram auta zmienił się w międzyczasie. Odśwież wycenę. Notatka została.",
          "s16.8": "Nie przyjęto: ten sam klucz przyjęcia z innymi danymi. Odśwież wycenę. Notatka została.",
        };
        if (refusal[st("s16")]) { event.preventDefault(); setAcceptanceError(refusal[st("s16")]!); return; }
        setAcceptanceNote(st("s16") === "s16.7" ? "Ponowienie rozpoznane: to samo przyjęcie, zapisane raz." : "");
        setSnapshot({ amount, covered, wash: viewWash });
        setAcceptedStops({ loading: { ...quoteStops.loading }, unloading: { ...quoteStops.unloading } }); setAccepted(true); setHasAccepted(true); go("s12");
      }}>Przyjmij kurs K2</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent></AlertDialog>
    <AlertDialog open={leaveConfirm} onOpenChange={setLeaveConfirm}><AlertDialogContent>
      <AlertDialogHeader><AlertDialogTitle>Wyjść bez zapisu?</AlertDialogTitle><AlertDialogDescription>Masz niezapisane zmiany we wpisie kursu. Po wyjściu wpis zniknie.</AlertDialogDescription></AlertDialogHeader>
      <AlertDialogFooter><AlertDialogCancel>Zostań przy wpisie</AlertDialogCancel><AlertDialogAction onClick={() => { setLeaveConfirm(false); reset(); }}>Odrzuć zmiany</AlertDialogAction></AlertDialogFooter>
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
