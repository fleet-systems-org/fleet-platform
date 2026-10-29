// A figure with its certainty and source (P02, EV-4). The screen shows the value rounded for display, for example
// whole kilometres (R11); the details show the exact published value, certainty, source, date and reason.
"use client"

import * as React from "react"
import { formatDecimal } from "@fleet-platform/ui/lib/decimal"
import { cn } from "@fleet-platform/ui/lib/utils"
import { EvidenceBadge, type EvidenceBadgeLabels } from "@fleet-platform/ui/components/values/evidence-badge"
import { Button } from "@fleet-platform/ui/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@fleet-platform/ui/components/popover"

/** Translated words, passed by the application like Field's `optionalText`. */
type ValueLabels = {
  /** Words of the evidence badge; its "Szacunek" and "Sprzeczne dane" are also used in the details, so each has one source. */
  evidence: EvidenceBadgeLabels
  /** Certainty text of a certain value, for example "Pewne"; certain values get no badge (P4). */
  certain: string
  /** Prefix of a missing value's reason, for example "brak". */
  missing: string
  /** Name prefix of the details panel, for example "Szczegóły". */
  details: string
  exactValue: string
  certainty: string
  source: string
  sourceDate: string
  reason: string
}

/** A source as the application names it, with the date already formatted. */
type SourceText = { name: string; date: string }

type Common = {
  /** What the value is, for example "Dystans kursu"; names the details panel. */
  label: string
  labels: ValueLabels
  /** `compact` inside a 36 px table row. */
  size?: "default" | "compact"
  className?: string
}

type ValueWithSourceProps = Common & (
  | {
      state: "known"
      /** Published decimal string, for example "1234.567". */
      value: string
      unit: string
      /** Decimals on screen; 0 for kilometres (R11). Without it every published decimal is shown. */
      displayScale?: number
      certainty: "certain" | "estimated"
      source: SourceText
      /** Why the value is estimated, in words. */
      reason?: string
    }
  | { state: "missing"; /** Why the value is missing, in words. */ reason: string }
  | { state: "conflicting"; unit: string; candidates: { value: string; source: SourceText }[]; reason?: string }
)

const withUnit = (value: string, unit: string) => `${value} ${unit}`

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return <div className="grid gap-tight"><dt className="text-label">{term}</dt><dd className="text-table">{children}</dd></div>
}

function ValueWithSource(props: ValueWithSourceProps) {
  const { label, labels, size = "default", className } = props

  if (props.state === "missing") {
    // R11.2, P3: a dash and the reason in words, never zero.
    return (
      <span data-slot="value-with-source" data-state="missing" className={cn("text-meta", className)}>
        <span aria-hidden>—</span> {labels.missing}: {props.reason}
      </span>
    )
  }

  const trigger = props.state === "known"
    ? <>
        <span className="text-number">{withUnit(formatDecimal(props.value, { scale: props.displayScale }), props.unit)}</span>
        {/* The space keeps "km" and "Szacunek" apart in the accessible name; flex layout hides it. */}
        {props.certainty === "estimated" ? <>{" "}<EvidenceBadge certainty="estimated" labels={labels.evidence} /></> : null}
      </>
    : <>
        <span aria-hidden className="text-number">—</span>
        <span className="text-table">{labels.evidence.conflicting}</span>
      </>

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="text"
          size={size}
          data-slot="value-with-source"
          data-state={props.state}
          className={cn("flex-wrap px-0 text-default underline decoration-dotted hover:decoration-solid", className)}
        >
          {trigger}
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label={`${labels.details}: ${label}`}>
        <dl className="grid gap-group">
          {props.state === "known" ? <>
            <Row term={labels.exactValue}><span className="text-number">{withUnit(formatDecimal(props.value), props.unit)}</span></Row>
            <Row term={labels.certainty}>{props.certainty === "estimated" ? labels.evidence.estimated : labels.certain}</Row>
            <Row term={labels.source}>{props.source.name}</Row>
            <Row term={labels.sourceDate}>{props.source.date}</Row>
          </> : props.candidates.map(candidate => (
            <Row key={`${candidate.source.name} ${candidate.value}`} term={`${candidate.source.name}, ${candidate.source.date}`}>
              <span className="text-number">{withUnit(formatDecimal(candidate.value), props.unit)}</span>
            </Row>
          ))}
          {props.reason ? <Row term={labels.reason}>{props.reason}</Row> : null}
        </dl>
      </PopoverContent>
    </Popover>
  )
}

export { ValueWithSource, type ValueLabels, type ValueWithSourceProps }
