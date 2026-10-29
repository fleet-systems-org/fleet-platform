// Decimal text for the interface: values travel as decimal strings and never pass through JavaScript number (FIN-1).

export type DecimalInputResult =
  | { ok: true; value: string }
  | { ok: false; reason: "empty" | "format" | "negative" }
  | { ok: false; reason: "scale"; scale: number }

/**
 * Decimal places a typed value may have, by kind (FIN-3; owner decision 2026-10-29): unit prices, FX rates and
 * consumption 6; kilometres and litres 3. Amounts take theirs from the currency (`decimalScale`).
 */
export const decimalScales = {
  unitPrice: 6,
  fxRate: 6,
  consumption: 6,
  kilometres: 3,
  litres: 3,
} as const

export type DecimalKind = "amount" | keyof typeof decimalScales

/** An amount names its ISO 4217 currency; other kinds have none. */
export type DecimalKindOptions = { kind: "amount"; currency: string } | { kind: keyof typeof decimalScales; currency?: never }

/**
 * Decimal places allowed for a kind of value. An amount has as many as Intl gives its currency (FIN-4; owner
 * decision 2026-10-29): PLN, EUR and CZK 2, HUF 0.
 */
export function decimalScale(options: DecimalKindOptions): number {
  if (options.kind !== "amount") return decimalScales[options.kind]
  return new Intl.NumberFormat("en", { style: "currency", currency: options.currency }).resolvedOptions().maximumFractionDigits!
}

/** The lexical form of `decimalStringSchema` in the core package: optional minus, no leading zeros, dot separator. */
const decimalString = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/

/**
 * Turns what the dispatcher typed into a decimal string. Accepts the Polish comma and spaces between digit groups;
 * rejects text with both a comma and a dot. Never rounds or truncates: a value with more decimals than its kind
 * allows is rejected with that scale (FIN-2, FIN-4). Negative zero becomes zero, and a known zero stays known (FIN-1).
 */
export function parseDecimalInput(text: string, { signed = false, ...kind }: DecimalKindOptions & { signed?: boolean }): DecimalInputResult {
  const scale = decimalScale(kind)
  const compact = text.replace(/[\s  ]/g, "")
  if (compact === "") return { ok: false, reason: "empty" }
  if (compact.includes(",") && compact.includes(".")) return { ok: false, reason: "format" }
  const value = compact.replaceAll(",", ".")
  if (!decimalString.test(value)) return { ok: false, reason: "format" }
  if (/^-0(?:\.0+)?$/.test(value)) return { ok: true, value: value.slice(1) }
  if (value.startsWith("-") && !signed) return { ok: false, reason: "negative" }
  const decimals = value.split(".")[1]?.length ?? 0
  if (decimals > scale) return { ok: false, reason: "scale", scale }
  return { ok: true, value }
}

/**
 * Formats a decimal string the Polish way ("1 234,567"). With `scale` the value is rounded for display, ties away
 * from zero as in FIN-3; without it every published decimal is shown. Negative zero shows as zero (FIN-1).
 * Intl formats the string exactly; it is never converted to number.
 */
export function formatDecimal(value: string, { scale }: { scale?: number } = {}): string {
  const digits = scale ?? value.split(".")[1]?.length ?? 0
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    roundingMode: "halfExpand",
    useGrouping: "always",
    signDisplay: "negative",
  }).format(value as Intl.StringNumericLiteral)
}
