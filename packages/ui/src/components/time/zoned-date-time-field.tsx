// Date and time in an explicit zone (P07, TIME-1). The dispatcher types the date as "DD.MM.RRRR" and the time as
// "GG:MM" (24 hours) in text boxes, so the format never depends on the browser's language (owner decision
// 2026-10-29); the zone is named next to them. When the dispatcher leaves the field, the local time is resolved
// to an exact instant: a time skipped by the clock going forward is rejected, and a time repeated by the clock going
// back asks which of the two occurrences is meant.
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { Field, useFieldControl } from "@fleet-platform/ui/components/field"
import { controlClasses } from "@fleet-platform/ui/components/input"
import { RadioGroup, RadioGroupItem } from "@fleet-platform/ui/components/radio-group"
import { formatLocalDate, parseLocalDate, parseLocalTime, resolveLocalDateTime, toInstant, type LocalResolution } from "@fleet-platform/ui/lib/zoned-time"

export type ZonedDateTimeResult =
  | { ok: true; date: string; time: string; timeZone: string; offset: string; instant: string }
  /** Only with `timeOptional`: a local calendar date without a time, so without an instant. */
  | { ok: true; date: string; time: undefined; timeZone: string }
  | { ok: false; reason: "empty" | "missingDate" | "missingTime" | "invalidDate" | "invalidTime" | "nonexistent" }
  /** The clock goes back at this time; the dispatcher has not yet chosen an occurrence. */
  | { ok: false; reason: "ambiguous"; offsets: [earlier: string, later: string] }

/** Translated words, passed by the application like Field's `optionalText`. */
export type ZonedDateTimeLabels = {
  /** Accessible name of the date box, for example "Data". */
  date: string
  /** Format shown in the empty date box, for example "DD.MM.RRRR". */
  dateFormat: string
  /** Accessible name of the time box, for example "Godzina". */
  time: string
  /** Format shown in the empty time box, for example "GG:MM". */
  timeFormat: string
  /** Question shown when the time occurs twice, for example "Ta godzina wystąpi dwa razy. Którą wybierasz?" */
  occurrence: string
  /** The first occurrence, for example "przed cofnięciem zegara". */
  earlier: string
  /** The second occurrence, for example "po cofnięciu zegara". */
  later: string
}

type Parsed = { date: string | null; time: string | null; resolution?: LocalResolution }

/** Reads the two boxes; the zone is consulted only for a valid date and time. */
function parse(dateText: string, timeText: string, timeZone: string): Parsed {
  const date = parseLocalDate(dateText)
  const time = parseLocalTime(timeText)
  return { date, time, resolution: date && time ? resolveLocalDateTime(date, time, timeZone) : undefined }
}

function resolve(dateText: string, timeText: string, { date, time, resolution }: Parsed, timeZone: string, timeOptional: boolean, chosen: string | undefined): ZonedDateTimeResult {
  const noDate = dateText.trim() === ""
  const noTime = timeText.trim() === ""
  if (noDate && noTime) return { ok: false, reason: "empty" }
  if (noDate) return { ok: false, reason: "missingDate" }
  if (date === null) return { ok: false, reason: "invalidDate" }
  if (noTime) return timeOptional ? { ok: true, date, time: undefined, timeZone } : { ok: false, reason: "missingTime" }
  if (time === null || !resolution) return { ok: false, reason: "invalidTime" }
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
  /** ISO date, "2026-11-12"; shown as "12.11.2026". */
  defaultDate?: string
  /** Local 24-hour time, "09:30". */
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
  const [date, setDate] = React.useState(defaultDate === "" ? "" : formatLocalDate(defaultDate))
  const [time, setTime] = React.useState(defaultTime)
  const [chosen, setChosen] = React.useState<string>()
  const [occurrences, setOccurrences] = React.useState<[string, string]>()

  const report = (choice: string | undefined) => {
    const parsed = parse(date, time, timeZone)
    setOccurrences(parsed.resolution?.kind === "ambiguous" ? parsed.resolution.offsets : undefined)
    onZonedChange?.(resolve(date, time, parsed, timeZone, timeOptional, choice))
  }
  const edit = (set: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    set(event.target.value)
    setChosen(undefined)
    setOccurrences(undefined)
  }
  const box = (name: string) => ({
    type: "text",
    autoComplete: "off",
    spellCheck: false,
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
          size={10}
          placeholder={labels.dateFormat}
          data-slot="zoned-date-time-date"
          id={control.id}
          required={control.required}
          value={date}
          onChange={edit(setDate)}
          {...box("date")}
        />
        <input
          size={5}
          placeholder={labels.timeFormat}
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
            <RadioGroupItem value={occurrences[0]} label={`${parseLocalTime(time)} ${labels.earlier}`} hint={`UTC${occurrences[0]}`} />
            <RadioGroupItem value={occurrences[1]} label={`${parseLocalTime(time)} ${labels.later}`} hint={`UTC${occurrences[1]}`} />
          </RadioGroup>
        </Field>
      ) : null}
    </div>
  )
}

export { ZonedDateTimeField }
