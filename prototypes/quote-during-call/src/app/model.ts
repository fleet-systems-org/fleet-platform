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
export const vehicles = [
  ["Auto 01", "Wolne w Miejscu A od 12.11.2026, 11:00"],
  ["Auto 02", "Nieznane"],
  ["Auto 03", "Wolne w Miejscu B od 12.11.2026, 15:00 · fikcyjne"],
];
export const valueLabels = {
  estimated: "Szacunek", certain: "Pewne", missing: "brak", conflicting: "Sprzeczne dane",
  details: "Szczegóły", exactValue: "Dokładna wartość", certainty: "Pewność", source: "Źródło",
  sourceDate: "Data źródła", reason: "Powód",
};
