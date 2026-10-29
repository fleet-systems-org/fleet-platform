// Published synthetic fixture from the approved specification. No live calculation service.
export const costs = [
  { label: "Paliwo", value: "18.00", source: "Cena i spalanie z przykładu specyfikacji" },
  { label: "Myto", value: "10.00", source: "Stawka krajowa z przykładu specyfikacji" },
  { label: "AdBlue", value: "0.18", source: "Stawka z przykładu specyfikacji" },
  { label: "Mycie", value: "0.00", source: "Wpisane: Bez mycia", certain: true },
  { label: "Koszty auta", value: "6.00", source: "Fikcyjna konfiguracja miesiąca 2026-09" },
  { label: "Praca", value: "4.00", source: "Stawka zatwierdzona w przykładzie specyfikacji" },
];
export const coveredCost = "38.18";

export function cents(value: string): bigint {
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
}
export function decimal(value: bigint): string {
  const magnitude = value < 0n ? -value : value;
  return `${value < 0n ? "-" : ""}${magnitude / 100n}.${String(magnitude % 100n).padStart(2, "0")}`;
}
export const screenNames = [
  "Logowanie", "Zaproszenie — nie występuje przy W2", "Reset: prośba — nie występuje przy W2", "Reset: nowe hasło — nie występuje przy W2", "Brak uprawnień",
  "Flota", "Kursy auta", "Punkt startowy auta", "Wpis kursu", "Wybór miejsca",
  "Trasa i kraje", "Wycena", "Szczegóły wartości", "Uzupełnienie danej", "Porównanie szkiców",
  "Przyjęcie kursu", "Podobne kursy", "Korekta, anulowanie", "Kontrola km",
];
export const screenId = (index: number) => `s${String(index + 1).padStart(2, "0")}`;
// All availability fixtures are on the fixed quote day, 12 November 2026.
export const vehicles = [
  ["Auto 01", "Wolne od 11:00 · Miejsce A", "Kierowca A", "DEMO 001"],
  ["Auto 02", "Nieznane", "Kierowca B", "DEMO 002"],
  ["Auto 03", "Wolne od 15:00 · Miejsce B · fikcyjne", "Kierowca C", "DEMO 003"],
  ["Auto 04", "Wolne od 09:00 · Miejsce D", "Kierowca D", "DEMO 004"],
  ["Auto 05", "Wolne od 12:30 · Miejsce E", "Kierowca E", "DEMO 005"],
  ["Auto 06", "Wolne od 10:15 · Miejsce F", "Kierowca F", "DEMO 006"],
  ["Auto 07", "Wolne od 16:00 · Miejsce A", "Kierowca G", "DEMO 007"],
  ["Auto 08", "Wolne od 13:45 · Miejsce G", "Kierowca H", "DEMO 008"],
  ["Auto 09", "Nieznane", "Kierowca I", "DEMO 009"],
  ["Auto 10", "Wolne od 08:30 · Miejsce H", "Kierowca J", "DEMO 010"],
  ["Auto 11", "Wolne od 18:00 · Miejsce C", "Kierowca K", "DEMO 011"],
  ["Auto 12", "Wolne od 14:00 · Miejsce E", "Kierowca L", "DEMO 012"],
];
export const valueLabels = {
  estimated: "Szacunek", certain: "Pewne", missing: "brak", conflicting: "Sprzeczne dane",
  details: "Szczegóły", exactValue: "Dokładna wartość", certainty: "Pewność", source: "Źródło",
  sourceDate: "Data źródła", reason: "Powód",
};
