import type { ValueLabels } from "@fleet-platform/ui/components/values/value-with-source";
import type { EvidenceBadgeLabels } from "@fleet-platform/ui/components/values/evidence-badge";

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

/** Polish words the application passes to EvidenceBadge. */
export const evidenceBadgeLabels: EvidenceBadgeLabels = { plan: "Plan", estimated: "Szacunek", missing: "Brak danych", conflicting: "Sprzeczne dane" };
