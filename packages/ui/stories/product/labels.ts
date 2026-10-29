import type { ValueLabels } from "@fleet-platform/ui/components/values/value-with-source";
import type { EvidenceBadgeLabels } from "@fleet-platform/ui/components/values/evidence-badge";
import type { PlacePickerLabels } from "@fleet-platform/ui/components/places/place-picker";
import type { ZonedDateTimeLabels } from "@fleet-platform/ui/components/time/zoned-date-time-field";

/** Polish words the application passes to EvidenceBadge. */
export const evidenceBadgeLabels: EvidenceBadgeLabels = { plan: "Plan", estimated: "Szacunek", missing: "Brak danych", conflicting: "Sprzeczne dane" };

/** Polish words the application passes to ValueWithSource (from its translation module in production). */
export const valueLabels: ValueLabels = {
  evidence: evidenceBadgeLabels,
  certain: "Pewne",
  missing: "brak",
  details: "Szczegóły",
  exactValue: "Dokładna wartość",
  certainty: "Pewność",
  source: "Źródło",
  sourceDate: "Data źródła",
  reason: "Powód",
};

/** Polish words the application passes to PlacePicker. */
export const placePickerLabels: PlacePickerLabels = {
  kinds: { place: "Zapisane miejsce", address: "Adres", town: "Tylko miasto" },
  needsConfirmation: "Do potwierdzenia",
  noCountry: "kraj niepotwierdzony",
  typedAs: "wpisano",
  searching: "Szukam…",
  notFound: "Nie znaleziono adresu. Sprawdź pisownię albo wybierz zapisane miejsce lub samo miasto.",
  unavailable: "Wyszukiwanie adresów jest teraz niedostępne. Wybierz zapisane miejsce albo samo miasto.",
  results: count => `Wyniki: ${count}`,
  addPlace: "Dodaj miejsce",
};

/** Polish words the application passes to ZonedDateTimeField. */
export const zonedDateTimeLabels: ZonedDateTimeLabels = {
  date: "Data",
  dateFormat: "DD.MM.RRRR",
  time: "Godzina",
  timeFormat: "GG:MM",
  occurrence: "Ta godzina wystąpi tej nocy dwa razy. Którą wybierasz?",
  earlier: "przed cofnięciem zegara",
  later: "po cofnięciu zegara",
};

/** Navigation of a dispatcher as the page passes it (L12: no owner entries); "Flota" waits under "Później" (N7d). */
export const dispatcherNavigation = {
  navigationLabel: "Nawigacja",
  items: [{ href: "#nowa-wycena", label: "Nowa wycena", current: true }, { href: "#kursy", label: "Kursy aut" }],
  later: { label: "Później", items: ["Flota"] },
};

/** Steps of the quote entry form (N7a). */
export const quoteSteps = ["Auto", "Miejsca i czasy", "Fracht i mycie", "Wycena"];
