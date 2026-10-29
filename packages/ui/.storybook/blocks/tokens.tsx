// Documentation-only blocks for the Foundations pages. They render the real CSS variables from src/styles.css
// and are not exported from the package.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@fleet-platform/ui/components/card";
import { applyTextSpacing, findTextSpacingFailures, type TextSpacingFailure } from "../text-spacing";

type ColorRole = { token: string; utility: string; use: string; avoid: string; source: string };

export const colorRoles: ColorRole[] = [
  { token: "surface-page", utility: "bg-page", use: "Page background", avoid: "Panels, trip bars", source: "Existing token" },
  { token: "surface-panel", utility: "bg-panel", use: "Panel, result bar, side panel", avoid: "Page background", source: "R06.1, R07.1, R08.4" },
  { token: "text-default", utility: "text-default", use: "Values, names, routes", avoid: "Helper labels", source: "Existing token" },
  { token: "text-muted", utility: "text-muted", use: "Label above a value, helper text, source label", avoid: "Amounts, trip result", source: "R07.1, R11.1" },
  { token: "text-on-action", utility: "text-on-action", use: "Text on the primary action", avoid: "Any other background", source: "Existing token" },
  { token: "action-primary", utility: "bg-action, text-action", use: "The one main action on a screen", avoid: "Decoration, large backgrounds", source: "N3a, Q3-1" },
  { token: "border-divider", utility: "border-divider", use: "Lines between rows and sections", avoid: "Input borders", source: "R08.1, R14.1" },
  { token: "border-input", utility: "border-input", use: "Input and control borders", avoid: "Row dividers", source: "T1, WCAG 1.4.11" },
  { token: "focus-ring", utility: "outline-focus, ring-focus", use: "Keyboard focus outline", avoid: "Selection, decoration", source: "G1, T4, WCAG 2.4.7" },
  { token: "status-loss-text", utility: "text-loss", use: "The word “Strata” and the negative trip result", avoid: "People, drivers, other errors", source: "N5a, K1, R01" },
  { token: "status-loss-bg", utility: "bg-loss-subtle", use: "Loss badge background", avoid: "Row or panel background", source: "N5a" },
  { token: "status-error", utility: "text-error, border-error", use: "Form and system errors, always with an icon and words", avoid: "Trip loss, decoration", source: "Q3" },
  { token: "badge-estimate-text", utility: "text-estimate", use: "The word “Szacunek”", avoid: "Certain numbers", source: "R11.1, B3, P4" },
  { token: "badge-estimate-bg", utility: "bg-estimate-subtle", use: "Estimate badge background", avoid: "Input borders", source: "R11.1, B3, P4" },
];

type Pair = { fg: string; bg: string; kind: "text" | "ui"; note?: string };

export const contrastPairs: Pair[] = [
  { fg: "text-default", bg: "surface-page", kind: "text" },
  { fg: "text-default", bg: "surface-panel", kind: "text" },
  { fg: "text-muted", bg: "surface-page", kind: "text" },
  { fg: "text-muted", bg: "surface-panel", kind: "text" },
  { fg: "text-on-action", bg: "action-primary", kind: "text" },
  { fg: "action-primary", bg: "surface-panel", kind: "text", note: "action colour used as link text" },
  { fg: "action-primary", bg: "surface-page", kind: "text", note: "action colour used as link text" },
  { fg: "focus-ring", bg: "surface-panel", kind: "ui" },
  { fg: "focus-ring", bg: "surface-page", kind: "ui" },
  { fg: "border-input", bg: "surface-panel", kind: "ui" },
  { fg: "border-input", bg: "surface-page", kind: "ui" },
  { fg: "status-loss-text", bg: "status-loss-bg", kind: "text" },
  { fg: "status-loss-text", bg: "surface-panel", kind: "text" },
  { fg: "status-loss-text", bg: "surface-page", kind: "text" },
  { fg: "status-error", bg: "surface-panel", kind: "text" },
  { fg: "status-error", bg: "surface-page", kind: "text" },
  { fg: "badge-estimate-text", bg: "badge-estimate-bg", kind: "text" },
  { fg: "text-muted", bg: "badge-estimate-bg", kind: "text", note: "estimate method inside the badge" },
  { fg: "border-divider", bg: "surface-panel", kind: "ui", note: "decorative divider only; inputs use border-input" },
  { fg: "status-loss-bg", bg: "surface-panel", kind: "ui", note: "badge edge; the word and the minus sign carry the meaning" },
];

// Reads the colour a CSS variable resolves to in the current document, as three 0–255 channels.
function resolveColor(probe: HTMLElement, token: string): number[] {
  probe.style.color = `var(--${token})`;
  return (getComputedStyle(probe).color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
}

function luminance([r, g, b]: number[]): number {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function toHex(channels: number[]): string {
  return `#${channels.map(channel => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
}

function useResolved<T>(compute: (probe: HTMLElement) => T): [React.RefObject<HTMLSpanElement | null>, T | undefined] {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<T>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (ref.current) setValue(compute(ref.current)); }, []);
  return [ref, value];
}

const cell = "border-b border-divider px-group py-tight text-left align-top";

export function ColorRoles() {
  const [probe, values] = useResolved(element => colorRoles.map(role => toHex(resolveColor(element, role.token))));
  return <>
    <span ref={probe} hidden />
    <table className="w-full border-collapse text-table">
      <thead><tr>{["Swatch", "Token", "Utility", "Value", "Use for", "Never for", "Source"].map(h => <th key={h} scope="col" className={`${cell} text-body-strong`}>{h}</th>)}</tr></thead>
      <tbody>{colorRoles.map((role, index) => <tr key={role.token}>
        <td className={cell}><span aria-hidden className="block size-8 rounded-control border border-input" style={{ background: `var(--${role.token})` }} /></td>
        <td className={cell}><code>--{role.token}</code></td>
        <td className={cell}><code>{role.utility}</code></td>
        <td className={`${cell} text-number`}>{values?.[index]}</td>
        <td className={cell}>{role.use}</td>
        <td className={cell}>{role.avoid}</td>
        <td className={cell}>{role.source}</td>
      </tr>)}</tbody>
    </table>
  </>;
}

export function ContrastTable() {
  const [probe, ratios] = useResolved(element => contrastPairs.map(pair => {
    const a = luminance(resolveColor(element, pair.fg));
    const b = luminance(resolveColor(element, pair.bg));
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }));
  return <>
    <span ref={probe} hidden />
    <table className="w-full border-collapse text-table">
      <caption className="text-left text-meta">Measured in this document from the resolved CSS variables (WCAG 2.x relative luminance).</caption>
      <thead><tr>{["Sample", "Foreground", "Background", "Ratio", "Threshold", "Result", "Note"].map(h => <th key={h} scope="col" className={`${cell} text-body-strong`}>{h}</th>)}</tr></thead>
      <tbody>{contrastPairs.map((pair, index) => {
        const ratio = ratios?.[index];
        const threshold = pair.kind === "text" ? 4.5 : 3;
        const passes = ratio !== undefined && ratio >= threshold;
        return <tr key={`${pair.fg}-${pair.bg}`}>
          <td className={cell}><span aria-hidden className="inline-block rounded-control px-group py-tight" style={pair.kind === "text" ? { color: `var(--${pair.fg})`, background: `var(--${pair.bg})` } : { border: `2px solid var(--${pair.fg})`, background: `var(--${pair.bg})` }}>{pair.kind === "text" ? "Aa 123" : "    "}</span></td>
          <td className={cell}><code>{pair.fg}</code></td>
          <td className={cell}><code>{pair.bg}</code></td>
          <td className={`${cell} whitespace-nowrap text-number`}>{ratio === undefined ? "—" : `${ratio.toFixed(2).replace(".", ",")} : 1`}</td>
          <td className={`${cell} whitespace-nowrap text-number`}>{threshold.toString().replace(".", ",")} : 1 ({pair.kind === "text" ? "text" : "interface"})</td>
          <td className={cell}>{ratio === undefined ? "—" : passes ? "Pass" : "Below threshold"}</td>
          <td className={cell}>{pair.note ?? ""}</td>
        </tr>;
      })}</tbody>
    </table>
  </>;
}

const typeRoles = [
  { role: "page-title", className: "text-page-title", spec: "20/28, 600", use: "One per screen: the screen name", source: "R14.1, N2a", sample: "Wycena kursu" },
  { role: "section-title", className: "text-section-title", spec: "16/24, 600", use: "Panel and section headings", source: "R14.1", sample: "Trasa i kilometry" },
  { role: "body", className: "text-body", spec: "14/21, 500", use: "Running text and messages; line height 1.5 x size", source: "N2b, R14.1, owner decision 2026-10-29, WCAG 1.4.8", sample: "Kurs zaczyna się w miejscu poprzedniego rozładunku i niesie cały pusty dojazd." },
  { role: "table", className: "text-table", spec: "14/20, 500", use: "Table rows and single-line values", source: "N2b, Q3-1, T3, owner decision 2026-10-29", sample: "Zestaw 03 · Poznań · 30.10.2026 14:00" },
  { role: "body-strong", className: "text-body-strong", spec: "14/20, 600", use: "Table headers; the one emphasised value", source: "P7 (proposal), Q3-1", sample: "Wynik kursu" },
  { role: "label", className: "text-label", spec: "12/16, 500, text-muted", use: "Field label, label above a value", source: "N2b, R07.1, R14.1", sample: "Dojazd" },
  { role: "meta", className: "text-meta", spec: "12/16, 500, text-muted", use: "Source, date, secondary details", source: "N2b, R11.1, P2", sample: "wpisane, 29.10.2026 08:40" },
  { role: "number", className: "text-number", spec: "14/20, 500, tabular-nums", use: "Amounts, kilometres, times; right-aligned in columns", source: "N2b, P8, R07.1, R15.1", sample: "1 850,00 EUR · 667 km" },
  { role: "code", className: "text-code", spec: "12/16, system monospace", use: "Code in this documentation only", source: "Proposal", sample: "text-meta" },
];

export function TypeRoles() {
  return <table className="w-full border-collapse text-table">
    <thead><tr>{["Role", "Class", "Sample", "Size, line, weight", "Use for", "Source"].map(h => <th key={h} scope="col" className={`${cell} text-body-strong`}>{h}</th>)}</tr></thead>
    <tbody>{typeRoles.map(role => <tr key={role.role}>
      <td className={cell}>{role.role}</td>
      <td className={cell}><code>{role.className}</code></td>
      <td className={cell}><span className={role.className}>{role.sample}</span></td>
      <td className={cell}>{role.spec}</td>
      <td className={cell}>{role.use}</td>
      <td className={cell}>{role.source}</td>
    </tr>)}</tbody>
  </table>;
}

const spacingLevels = [
  { level: "Label to value", token: "space-tight", utility: "gap-tight", raw: "space-1, 4 px" },
  { level: "Inside a group", token: "space-group", utility: "gap-group", raw: "space-2, 8 px" },
  { level: "Inside a panel", token: "space-panel", utility: "p-panel", raw: "space-3, 12 px" },
  { level: "Between groups", token: "space-between", utility: "gap-between", raw: "space-4, 16 px" },
  { level: "Between screen sections", token: "space-section", utility: "gap-section", raw: "space-6, 24 px" },
];

export function SpacingLevels() {
  return <table className="w-full border-collapse text-table">
    <thead><tr>{["Relation", "Token", "Utility", "Raw value", "Size"].map(h => <th key={h} scope="col" className={`${cell} text-body-strong`}>{h}</th>)}</tr></thead>
    <tbody>{spacingLevels.map(level => <tr key={level.token}>
      <td className={cell}>{level.level}</td>
      <td className={cell}><code>--{level.token}</code></td>
      <td className={cell}><code>{level.utility}</code></td>
      <td className={cell}>{level.raw}</td>
      <td className={cell}><span aria-hidden className="block h-4 bg-action" style={{ width: `var(--${level.token})` }} /></td>
    </tr>)}</tbody>
  </table>;
}

export function SpacingExample() {
  return <section aria-label="Spacing example" className="flex max-w-measure flex-col gap-between rounded-panel border border-divider bg-panel p-panel">
    <h3 className="text-section-title">Trasa i kilometry</h3>
    <div className="flex gap-group">
      {[["Dojazd", "120 km"], ["Ładowne", "547 km"], ["Razem", "667 km"]].map(([label, value]) => <div key={label} className="flex flex-col gap-tight">
        <span className="text-meta">{label}</span>
        <span className="text-number">{value}</span>
      </div>)}
    </div>
  </section>;
}

export function ShapeSamples() {
  return <div className="flex flex-wrap items-start gap-between text-body">
    <div className="flex flex-col gap-tight"><span className="block h-row w-40 rounded-control border border-input bg-panel" aria-hidden /><span>radius-control, 4 px: inputs, buttons, badges</span></div>
    <div className="flex flex-col gap-tight"><span className="block h-24 w-40 rounded-panel border border-divider bg-panel" aria-hidden /><span>radius-panel, 8 px: panels</span></div>
    <div className="flex flex-col gap-tight"><span className="block h-24 w-40 rounded-panel border border-input bg-panel shadow-overlay" aria-hidden /><span>shadow-overlay: dialogs, menus, popovers</span></div>
  </div>;
}

export function MotionSample() {
  const [open, setOpen] = useState(false);
  return <div className="flex flex-col items-start gap-group text-body">
    <button type="button" className="rounded-control border border-input bg-panel px-panel py-tight" aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? "Ukryj szczegóły" : "Pokaż szczegóły"}</button>
    <p className={`rounded-panel border border-divider bg-panel p-panel transition-opacity duration-overlay ease-standard ${open ? "opacity-100" : "opacity-0"}`} aria-hidden={!open}>Overlay content appears in motion-overlay (110 ms); with reduced motion it appears at once.</p>
  </div>;
}

export function Frame({ width, children }: { width: number; children: ReactNode }) {
  return <figure className="flex flex-col gap-tight">
    <figcaption className="text-meta">{width} px</figcaption>
    <div className="overflow-hidden rounded-panel border border-divider bg-page p-panel" style={{ width }}>{children}</div>
  </figure>;
}

/** Sample region for the WCAG 1.4.12 check: real package components and the text roles, at 320 px. */
export function TextSpacingSample() {
  return <div className="flex w-80 flex-col gap-between rounded-panel border border-divider bg-page p-panel">
    <p className="text-page-title">Wycena kursu</p>
    <Card>
      <CardHeader><CardTitle>Brakuje danych do wyceny</CardTitle></CardHeader>
      <CardContent>
        <p className="text-body">Nie można policzyć wyniku kursu, dopóki nie odpowiesz na pytanie o mycie. Wybierz „Bez mycia” albo „Nasze mycie” i podaj kwotę.</p>
      </CardContent>
    </Card>
    <div className="flex flex-col gap-tight">
      <span className="text-label">Dojazd</span>
      <span className="text-number">120 km</span>
      <span className="text-meta">wpisane, 29.10.2026 08:40</span>
    </div>
    <div className="flex h-row items-center justify-between border-b border-divider text-table">
      <span>Zestaw 03</span><span className="text-number">14:00</span>
    </div>
  </div>;
}

export function TextSpacingCheck() {
  const region = useRef<HTMLDivElement>(null);
  const removeSpacing = useRef<(() => void) | null>(null);
  const [failures, setFailures] = useState<TextSpacingFailure[]>();
  const applied = failures !== undefined;
  const toggle = () => {
    if (!region.current) return;
    if (removeSpacing.current) {
      removeSpacing.current();
      removeSpacing.current = null;
      setFailures(undefined);
      return;
    }
    removeSpacing.current = applyTextSpacing(region.current);
    setFailures(findTextSpacingFailures(region.current));
  };
  return <div className="flex flex-col gap-group">
    <button type="button" aria-pressed={applied} className="self-start rounded-control border border-input bg-panel px-panel py-tight text-body" onClick={toggle}>
      {applied ? "Remove WCAG 1.4.12 spacing" : "Apply WCAG 1.4.12 spacing"}
    </button>
    <p role="status" className="text-body">{failures === undefined ? "Spacing off: normal text roles." : failures.length === 0 ? "Spacing on: no clipped or overflowing text." : `Spacing on: ${failures.length} problem(s): ${failures.map(f => `${f.element} ${f.problem}`).join("; ")}`}</p>
    <div ref={region}><TextSpacingSample /></div>
  </div>;
}
