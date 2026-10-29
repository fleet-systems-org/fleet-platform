import { useEffect, useRef, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@fleet-platform/ui/components/button";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { Alert } from "@fleet-platform/ui/components/alert";
import { MAPA } from "./europe-map";

export function SignIn({ newComputer, onSignedIn }: { newComputer: boolean; onSignedIn: () => void }) {
  const [state, setState] = useState<"login" | "request" | "computer">("login");
  const [login, setLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [state]);
  function back() { setState("login"); setError(""); setSent(false); setShowPassword(false); }
  return <div className="sign-in-layout">
    <div className="sign-in-map" aria-hidden="true">
      <div className="sign-in-map-perspective">
        <svg viewBox={`0 0 ${MAPA.szer} ${MAPA.wys}`} fill="none" aria-hidden="true" focusable="false">
          <defs>
            <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" /></filter>
            <filter id="map-light" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6" /></filter>
          </defs>
          <path d={MAPA.lad} className="sign-in-land" strokeWidth="0.8" strokeLinejoin="round" />
          <path d={MAPA.drogi} className="sign-in-roads" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
          <g filter="url(#map-glow)" opacity="0.4" className="sign-in-route-glow">
            {MAPA.trasy.map(route => <path key={route.id} d={route.d} strokeWidth="9" strokeLinecap="round" />)}
            {MAPA.miasta.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" />)}
          </g>
          <g strokeLinecap="round" strokeLinejoin="round">
            <g filter="url(#map-light)" opacity="0.8">
              {MAPA.trasy.map(route => <g key={route.id}>
                <path d={route.przod} className="sign-in-headlights" strokeWidth="2.6" />
                <path d={route.tyl} className="sign-in-taillights" strokeWidth="2.6" />
              </g>)}
            </g>
            {MAPA.trasy.map(route => <g key={route.id}>
              <path d={route.przod} className="sign-in-headlights" opacity="0.7" strokeWidth="0.9" />
              <path d={route.tyl} className="sign-in-taillights" opacity="0.8" strokeWidth="0.9" />
            </g>)}
          </g>
          {MAPA.miasta.map(([cx, cy]) => <circle key={`${cx}-${cy}`} className="sign-in-city" cx={cx} cy={cy} r="1.8" />)}
        </svg>
      </div>
      <div className="sign-in-map-fade-top" /><div className="sign-in-map-fade-bottom" />
      <div className="sign-in-company">Firma Demo</div>
    </div>
    <div className="sign-in-panel">
      <Badge variant="neutral" className="sign-in-badge">Logowanie systemu biura — symulacja</Badge>
      <div className="sign-in-form stack">
        <p className="sign-in-mobile-company">Firma Demo</p>
        {state === "login" ? <>
          <h1 ref={heading} tabIndex={-1} className="text-page-title">Zaloguj się</h1>
          <form className="stack" noValidate onSubmit={event => {
            event.preventDefault();
            const form = event.currentTarget;
            const password = form.elements.namedItem("demo-password") as HTMLInputElement;
            if (!login.trim() || !password.value.trim()) { setError("Podaj login i hasło."); return; }
            // Only presence is checked. Passwords never enter React state or persistence.
            password.value = ""; setShowPassword(false); setError("");
            if (newComputer) setState("computer"); else onSignedIn();
          }}>
            <Field label="Login" required><Input name="demo-login" autoComplete="username" value={login} onChange={event => setLogin(event.target.value)} aria-invalid={!!error} aria-describedby={error ? "sign-in-error" : undefined} /></Field>
            <div className="sign-in-password-field">
              <div className="sign-in-password-label"><label htmlFor="demo-password">Hasło</label><a href="#s01" onClick={event => { event.preventDefault(); setState("request"); setError(""); }}>Nie pamiętasz hasła?</a></div>
              <div className="sign-in-password"><Input id="demo-password" name="demo-password" type={showPassword ? "text" : "password"} autoComplete="off" required aria-invalid={!!error} aria-describedby={error ? "sign-in-error" : undefined} />
                <Button type="button" variant="text" aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <IconEyeOff aria-hidden /> : <IconEye aria-hidden />}</Button>
              </div>
            </div>
            <label className="sign-in-check"><input type="checkbox" name="remember" />Zapamiętaj mnie</label>
            {error && <Alert id="sign-in-error" variant="error" title={error} />}
            <Button type="submit">Zaloguj</Button>
            <p className="text-meta">Hasło nie jest sprawdzane ani zapisywane. Nie wpisuj prawdziwego hasła.</p>
          </form>
        </> : state === "request" ? <>
          <h1 ref={heading} tabIndex={-1} className="text-page-title">Nie pamiętasz hasła?</h1>
          <p>Hasła nadaje administrator. Podaj login — zapiszemy prośbę, a administrator ustawi Ci nowe hasło tymczasowe.</p>
          <form className="stack" onSubmit={event => { event.preventDefault(); setSent(true); }}>
            <Field label="Login" required><Input autoComplete="username" value={login} onChange={event => { setLogin(event.target.value); setSent(false); }} /></Field>
            {sent && <p role="status">Prośba zapisana. Administrator ustawi Ci nowe hasło tymczasowe.</p>}
            <Button type="submit">Poproś o nowe hasło</Button>
          </form><Button variant="secondary" onClick={back}>Wróć do logowania</Button>
        </> : <div className="stack" role="status">
          <h1 ref={heading} tabIndex={-1} className="text-page-title">Ten komputer czeka na zatwierdzenie</h1>
          <p>Hasło jest poprawne. To pierwsze logowanie na tym komputerze, więc administrator musi go raz zatwierdzić. Po zatwierdzeniu kliknij „Sprawdź ponownie” — kolejne logowania na tym komputerze będą wymagały tylko hasła.</p>
          <p className="text-meta">Zalogowano jako: dyspozytor</p>
          <Button onClick={onSignedIn}>Sprawdź ponownie</Button><Button variant="secondary" onClick={back}>Wyloguj</Button>
        </div>}
      </div>
    </div>
  </div>;
}
