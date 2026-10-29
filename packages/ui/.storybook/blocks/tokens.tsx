// Documentation-only blocks for the Foundations pages. They render the real CSS variables from src/styles.css
// and are not exported from the package.
import { useEffect, useRef, useState, type ReactNode } from "react";

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
    <table className="w-full border-collapse text-body">
      <thead><tr>{["Swatch", "Token", "Utility", "Value", "Use for", "Never for", "Source"].map(h => <th key={h} scope="col" className={`${cell} font-semibold`}>{h}</th>)}</tr></thead>
      <tbody>{colorRoles.map((role, index) => <tr key={role.token}>
        <td className={cell}><span aria-hidden className="block size-8 rounded-control border border-input" style={{ background: `var(--${role.token})` }} /></td>
        <td className={cell}><code>--{role.token}</code></td>
        <td className={cell}><code>{role.utility}</code></td>
        <td className={`${cell} tabular-nums`}>{values?.[index]}</td>
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
    <table className="w-full border-collapse text-body">
      <caption className="text-left text-label text-muted">Measured in this document from the resolved CSS variables (WCAG 2.x relative luminance).</caption>
      <thead><tr>{["Sample", "Foreground", "Background", "Ratio", "Threshold", "Result", "Note"].map(h => <th key={h} scope="col" className={`${cell} font-semibold`}>{h}</th>)}</tr></thead>
      <tbody>{contrastPairs.map((pair, index) => {
        const ratio = ratios?.[index];
        const threshold = pair.kind === "text" ? 4.5 : 3;
        const passes = ratio !== undefined && ratio >= threshold;
        return <tr key={`${pair.fg}-${pair.bg}`}>
          <td className={cell}><span aria-hidden className="inline-block rounded-control px-group py-tight" style={pair.kind === "text" ? { color: `var(--${pair.fg})`, background: `var(--${pair.bg})` } : { border: `2px solid var(--${pair.fg})`, background: `var(--${pair.bg})` }}>{pair.kind === "text" ? "Aa 123" : "    "}</span></td>
          <td className={cell}><code>{pair.fg}</code></td>
          <td className={cell}><code>{pair.bg}</code></td>
          <td className={`${cell} whitespace-nowrap tabular-nums`}>{ratio === undefined ? "—" : `${ratio.toFixed(2).replace(".", ",")} : 1`}</td>
          <td className={`${cell} whitespace-nowrap tabular-nums`}>{threshold.toString().replace(".", ",")} : 1 ({pair.kind === "text" ? "text" : "interface"})</td>
          <td className={cell}>{ratio === undefined ? "—" : passes ? "Pass" : "Below threshold"}</td>
          <td className={cell}>{pair.note ?? ""}</td>
        </tr>;
      })}</tbody>
    </table>
  </>;
}

const typeRoles = [
  { role: "Page heading", className: "text-page font-semibold", spec: "type-20, 20/28, 600", sample: "Wycena kursu" },
  { role: "Section heading", className: "text-heading font-semibold", spec: "type-16, 16/24, 600", sample: "Trasa i kilometry" },
  { role: "Body", className: "text-body", spec: "type-14, 14/20, 400", sample: "Kurs zaczyna się w miejscu poprzedniego rozładunku." },
  { role: "Label", className: "text-label font-semibold", spec: "type-12, 12/16, 600", sample: "Dojazd" },
  { role: "Metadata and source", className: "text-label text-muted", spec: "type-12, 12/16, 400, text-muted", sample: "wpisane, 29.10.2026 08:40" },
  { role: "Numbers", className: "text-body tabular-nums", spec: "type-14, tabular-nums, right-aligned in columns", sample: "1 850,00 EUR  |  667,180 km" },
  { role: "Code (documentation only)", className: "font-mono text-label", spec: "type-12, system monospace", sample: "text-muted" },
];

export function TypeRoles() {
  return <table className="w-full border-collapse">
    <thead><tr>{["Role", "Sample", "Token and weight", "Classes"].map(h => <th key={h} scope="col" className={`${cell} text-body font-semibold`}>{h}</th>)}</tr></thead>
    <tbody>{typeRoles.map(role => <tr key={role.role}>
      <td className={`${cell} text-body`}>{role.role}</td>
      <td className={cell}><span className={role.className}>{role.sample}</span></td>
      <td className={`${cell} text-body`}>{role.spec}</td>
      <td className={`${cell} text-body`}><code>{role.className}</code></td>
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
  return <table className="w-full border-collapse text-body">
    <thead><tr>{["Relation", "Token", "Utility", "Raw value", "Size"].map(h => <th key={h} scope="col" className={`${cell} font-semibold`}>{h}</th>)}</tr></thead>
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
    <h3 className="text-heading font-semibold">Trasa i kilometry</h3>
    <div className="flex gap-group">
      {[["Dojazd", "120,000 km"], ["Ładowne", "547,180 km"], ["Razem", "667,180 km"]].map(([label, value]) => <div key={label} className="flex flex-col gap-tight">
        <span className="text-label text-muted">{label}</span>
        <span className="text-body tabular-nums">{value}</span>
      </div>)}
    </div>
  </section>;
}

export function ShapeSamples() {
  return <div className="flex flex-wrap items-start gap-between text-body">
    <div className="flex flex-col gap-tight"><span className="block h-row w-40 rounded-control border border-input bg-panel" aria-hidden /><span>radius-control, 4 px: inputs, buttons, badges</span></div>
    <div className="flex flex-col gap-tight"><span className="block h-24 w-40 rounded-panel border border-divider bg-panel" aria-hidden /><span>radius-panel, 8 px: panels</span></div>
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
    <figcaption className="text-label text-muted">{width} px</figcaption>
    <div className="overflow-hidden rounded-panel border border-divider bg-page p-panel" style={{ width }}>{children}</div>
  </figure>;
}
