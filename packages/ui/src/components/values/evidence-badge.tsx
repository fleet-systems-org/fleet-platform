// The words of a value's evidence (EV-1, EV-2): certainty and missing or conflicting state, and the plan phase where a
// screen must show it. One mapping, so a screen never picks a badge colour or icon for these states by itself.
import * as React from "react"
import { IconAlertTriangle, IconCircleOff } from "@tabler/icons-react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { Badge } from "@fleet-platform/ui/components/badge"

/** Translated words, passed by the application like Field's `optionalText`. */
export type EvidenceBadgeLabels = {
  /** Phase of a planned value, for example "Plan". */
  plan: string
  /** An estimated known value, for example "Szacunek". */
  estimated: string
  /** A missing value, for example "Brak danych". */
  missing: string
  /** A value with conflicting sources, for example "Sprzeczne dane". */
  conflicting: string
}

/**
 * Badges for a value's evidence: "Plan" only when `phase` is passed as "plan" (history rows: EV-2), "Szacunek" for an
 * estimated known value, "Brak danych" or "Sprzeczne dane" for its state. A certain known value gets no badge (P4),
 * and nothing is green, so a missing or unchecked value never looks confirmed.
 */
function EvidenceBadge({
  phase,
  state = "known",
  certainty,
  labels,
  className,
}: {
  /** Pass only where the phase must be visible, for example on entered-trip history rows. */
  phase?: "plan" | "actual"
  state?: "known" | "missing" | "conflicting"
  /** Certainty of a known value. */
  certainty?: "certain" | "estimated"
  labels: EvidenceBadgeLabels
  className?: string
}) {
  const badges = [
    phase === "plan" ? <Badge key="plan">{labels.plan}</Badge> : null,
    state === "known" && certainty === "estimated" ? <Badge key="estimated" variant="estimate">{labels.estimated}</Badge> : null,
    state === "missing" ? <Badge key="missing"><IconCircleOff aria-hidden />{labels.missing}</Badge> : null,
    state === "conflicting" ? <Badge key="conflicting"><IconAlertTriangle aria-hidden />{labels.conflicting}</Badge> : null,
  ].filter(Boolean)
  if (badges.length === 0) return null
  return <span data-slot="evidence-badge" className={cn("inline-flex flex-wrap items-center gap-tight", className)}>{badges}</span>
}

export { EvidenceBadge }
