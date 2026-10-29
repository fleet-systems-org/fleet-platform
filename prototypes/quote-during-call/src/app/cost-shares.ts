import { cents, decimal } from './model';

// R17.1: round exact integer-cent shares to one decimal, half up.
export function shareTenths(value: string, total: string): bigint {
  const denominator = cents(total);
  return denominator === 0n ? 0n : (cents(value) * 1000n + denominator / 2n) / denominator;
}
export function shareText(tenths: bigint): string {
  return `${tenths / 10n},${tenths % 10n}`;
}
export function shareWidth(tenths: bigint): string {
  return `${tenths / 10n}.${tenths % 10n}%`;
}
// Fictitious daily rates in EUR; each category independently covers 7200 seconds.
// Keep the rational cent numerator exact until publishing; no cent allocation or policy choice.
const elapsedSeconds = 7200n;
const secondsPerDay = 86400n;
const daily = [
  ['Leasing', 24n], ['Ubezpieczenie', 8n], ['Telematyka', 2n], ['Pakiet serwisowy', 6n],
  ['Wynajem cysterny', 10n], ['Części i naprawy', 8n], ['Parkingi i assistance', 3n],
  ['Opłaty kartowe', 1n], ['Koszty stałe działu', 10n],
] as const;
const publish = (centSeconds: bigint) => (centSeconds + secondsPerDay / 2n) / secondsPerDay;
export const vehicleCosts = daily.map(([label, rate]) => ({
  label, value: decimal(publish(rate * 100n * elapsedSeconds)),
  source: `Fikcyjna stawka ${rate},000000 EUR/dzień × 7200/86400`, certain: false,
}));
export const vehicleTotal = decimal(publish(daily.reduce((sum, [, rate]) => sum + rate * 100n * elapsedSeconds, 0n)));
export const vehicleReconciliation = decimal(cents(vehicleTotal) - vehicleCosts.reduce((sum, row) => sum + cents(row.value), 0n));
export const vehicleDisplayedTotal = decimal(vehicleCosts.reduce((sum, row) => sum + cents(row.value), 0n));
