// Date and time in an explicit zone (P07, TIME-1). The dispatcher picks the date from the browser's calendar and
// types the time; the zone is named next to them. When the dispatcher leaves the field, the local time is resolved
// to an exact instant: a time skipped by the clock going forward is rejected, and a time repeated by the clock going
// back asks which of the two occurrences is meant.
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { Field, useFieldControl } from "@fleet-platform/ui/components/field"
import { controlClasses } from "@fleet-platform/ui/components/input"
import { RadioGroup, RadioGroupItem } from "@fleet-platform/ui/components/radio-group"
import { resolveLocalDateTime, toInstant, type LocalResolution } from "@fleet-platform/ui/lib/zoned-time"

export type ZonedDateTimeResult =
  | { ok: true; date: string; time: string; timeZone: string; offset: string; instant: string }
  /** Only with `timeOptional`: a local calendar date without a time, so without an instant. */
  | { ok: true; date: string; time: undefined; timeZone: string }
  | { ok: false; reason: "empty" | "missingDate" | "missingTime" | "nonexistent" }
  /** The clock goes back at this time; the dispatcher has not yet chosen an occurrence. */
  | { ok: false; reason: "ambiguous"; offsets: [earlier: string, later: string] }

/** Translated words, passed by the application like Field's `optionalText`. */
export type ZonedDateTimeLabels = {
  /** Accessible name of the date box, for example "Data". */
  date: string
  /** Accessible name of the time box, for example "Godzina". */
  time: string
  /** Question shown when the time occurs twice, for example "Ta godzina wystąpi dwa razy. Którą wybierasz?" */
  occurrence: string
  /** The first occurrence, for example "przed cofnięciem zegara". */
  earlier: string
  /** The second occurrence, for example "po cofnięciu zegara". */
  later: string
}

function resolve(date: string, time: string, timeZone: string, timeOptional: boolean, resolution: LocalResolution | undefined, chosen: string | undefined): ZonedDateTimeResult {
  if (date === "" && time === "") return { ok: false, reason: "empty" }
  if (date === "") return { ok: false, reason: "missingDate" }
  if (!resolution) return timeOptional ? { ok: true, date, time: undefined, timeZone } : { ok: false, reason: "missingTime" }
  if (resolution.kind === "nonexistent") return { ok: false, reason: "nonexistent" }
  const resolved = (offset: string): ZonedDateTimeResult => ({ ok: true, date, time, timeZone, offset, instant: toInstant(date, time, offset) })
  if (resolution.kind === "unique") return resolved(resolution.offset)
  const offset = resolution.offsets.find(candidate => candidate === chosen)
  return offset === undefined ? { ok: false, reason: "ambiguous", offsets: resolution.offsets } : resolved(offset)
}

function ZonedDateTimeField({
  timeZone,
  zoneLabel,
  labels,
  timeOptional = false,
  defaultDate = "",
  defaultTime = "",
  disabled,
  onZonedChange,
  className,
  ...props
}: {
  /** IANA zone of the place, for example "Europe/Warsaw". */
  timeZone: string
  /** Translated name of the zone shown after the time, for example "Czas warszawski"; also read as a description. */
  zoneLabel: string
  labels: ZonedDateTimeLabels
  /** A date alone is complete (wash date, time optional: D63); it gives no instant. */
  timeOptional?: boolean
  /** ISO date, "2026-11-12". */
  defaultDate?: string
  /** Local time, "09:30". */
  defaultTime?: string
  disabled?: boolean
  /** Called when the dispatcher leaves the field or chooses an occurrence: the resolved value, or the reason it is not one. */
  onZonedChange?: (result: ZonedDateTimeResult) => void
  className?: string
  id?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  required?: boolean
}) {
  const ownId = React.useId()
  const zoneId = `${ownId}-zone`
  const control = useFieldControl(props)
  const [date, setDate] = React.useState(defaultDate)
  const [time, setTime] = React.useState(defaultTime)
  const [chosen, setChosen] = React.useState<string>()
  const [occurrences, setOccurrences] = React.useState<[string, string]>()

  const report = (choice: string | undefined) => {
    const resolution = date !== "" && time !== "" ? resolveLocalDateTime(date, time, timeZone) : undefined
    setOccurrences(resolution?.kind === "ambiguous" ? resolution.offsets : undefined)
    onZonedChange?.(resolve(date, time, timeZone, timeOptional, resolution, choice))
  }
  const edit = (set: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    set(event.target.value)
    setChosen(undefined)
    setOccurrences(undefined)
  }
  const box = (name: string) => ({
    disabled,
    "aria-labelledby": [control["aria-labelledby"], `${ownId}-${name}`].filter(Boolean).join(" "),
    "aria-describedby": [control["aria-describedby"], zoneId].filter(Boolean).join(" "),
    "aria-invalid": control["aria-invalid"],
    className: cn(controlClasses, "h-control w-auto"),
  })

  return (
    <div data-slot="zoned-date-time-field" className={cn("flex min-w-0 flex-col gap-group", className)}>
      <div
        role="group"
        aria-labelledby={control["aria-labelledby"]}
        className="flex min-w-0 flex-wrap items-center gap-group"
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) report(chosen)
        }}
      >
        <span id={`${ownId}-date`} hidden>{labels.date}</span>
        <span id={`${ownId}-time`} hidden>{labels.time}</span>
        <input
          type="date"
          data-slot="zoned-date-time-date"
          id={control.id}
          required={control.required}
          value={date}
          onChange={edit(setDate)}
          {...box("date")}
        />
        <input
          type="time"
          step={60}
          data-slot="zoned-date-time-time"
          required={control.required && !timeOptional}
          value={time}
          onChange={edit(setTime)}
          {...box("time")}
        />
        <span id={zoneId} data-slot="zoned-date-time-zone" className="shrink-0 text-table text-default">{zoneLabel}</span>
      </div>
      {occurrences ? (
        <Field label={labels.occurrence} required>
          <RadioGroup
            value={chosen ?? ""}
            onValueChange={offset => { setChosen(offset); report(offset) }}
          >
            <RadioGroupItem value={occurrences[0]} label={`${time} ${labels.earlier}`} hint={`UTC${occurrences[0]}`} />
            <RadioGroupItem value={occurrences[1]} label={`${time} ${labels.later}`} hint={`UTC${occurrences[1]}`} />
          </RadioGroup>
        </Field>
      ) : null}
    </div>
  )
}

export { ZonedDateTimeField }
