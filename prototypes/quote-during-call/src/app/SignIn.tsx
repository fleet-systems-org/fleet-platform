import { useEffect, useRef, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@fleet-platform/ui/components/button";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { Alert } from "@fleet-platform/ui/components/alert";
import { europeLand, demoRoutes, demoCities } from "./europe-map";

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
      <svg viewBox="0 0 900 750" focusable="false"><path className="sign-in-land" d={europeLand} />
        <g className="sign-in-routes">{demoRoutes.map(route => <path key={route} d={route} />)}</g>
        {demoCities.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}
      </svg><div className="sign-in-company">Firma Demo</div>
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
