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
// The daily fixture totals 72 EUR; allocate its 600 cents without losing a cent.
// Largest remainders receive the two residual cents (stable fixture order breaks ties).
const daily = [
  ['Leasing', 24n], ['Ubezpieczenie', 8n], ['Telematyka', 2n], ['Pakiet serwisowy', 6n],
  ['Wynajem cysterny', 10n], ['Części i naprawy', 8n], ['Parkingi i assistance', 3n],
  ['Opłaty kartowe', 1n], ['Koszty stałe działu', 10n],
] as const;
const allocations = daily.map(([label, rate], index) => ({ label, index, value: rate * 600n / 72n, remainder: rate * 600n % 72n }));
const remainder = 600n - allocations.reduce((sum, row) => sum + row.value, 0n);
[...allocations].sort((a, b) => a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1)
  .forEach((row, index) => { if (BigInt(index) < remainder) row.value += 1n; });
export const vehicleCosts = allocations.map(row => ({ label: row.label, value: decimal(row.value), source: 'Fikcyjny podział stawki dziennej', certain: false }));
