// N7a / R18.2: progress is informational; completed steps are edited in the form.
export function StepBar({ current }: { current: number }) {
  return <ol className="step-bar" aria-label="Postęp wyceny">
    {['Auto', 'Miejsca i czasy', 'Fracht i mycie', 'Wycena'].map((label, index) => {
      const step = index + 1;
      return <li key={label} className={step < current ? 'done' : step === current ? 'current' : 'waiting'} aria-current={step === current ? 'step' : undefined}>
        <span className="step-circle" aria-hidden="true">{step < current ? <svg viewBox="0 0 16 16"><path d="m4 8 3 3 5-6" /></svg> : step}</span>
        <span className="text-meta">{label}{step < current && <span className="sr-only"> — gotowe</span>}</span>
      </li>;
    })}
  </ol>;
}
