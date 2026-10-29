import type { ValueLabels } from "@fleet-platform/ui/components/values/value-with-source";
import type { ZonedDateTimeLabels } from "@fleet-platform/ui/components/time/zoned-date-time-field";

/** Polish words the application passes to ValueWithSource (from its translation module in production). */
export const valueLabels: ValueLabels = {
  estimated: "Szacunek",
  certain: "Pewne",
  missing: "brak",
  conflicting: "Sprzeczne dane",
  details: "Szczegóły",
  exactValue: "Dokładna wartość",
  certainty: "Pewność",
  source: "Źródło",
  sourceDate: "Data źródła",
  reason: "Powód",
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
