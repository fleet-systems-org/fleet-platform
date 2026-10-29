// A trip read as stops and times (N7b, R19.1): each stop is a block with its label on the left, the time first, then the
// date and place, then details as label–value pairs. It replaces the A → B → C schematic on entry, route and quote.
import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"

/** One stop. The page formats every text: times and dates in Warsaw time (TIME-1), the place with its country. */
export type RouteStop = {
  /** For example "Start", "Załadunek", "Rozładunek". */
  label: string
  /** "11:00", or the page's word for a time not entered yet. */
  time: string
  /** "12.11.2026"; the list adds the zone word from `timeZone`. */
  date: string
  /** "Miejsce A · PL". */
  place: React.ReactNode
  /** Customer, kilometres, and whether a leg is the approach or loaded, said in words (N7b). */
  details?: { label: string; value: React.ReactNode }[]
}

function RouteStops({
  label,
  stops,
  timeZone,
  className,
}: {
  /** Accessible name of the list, for example "Trasa kursu". */
  label: string
  stops: RouteStop[]
  /** Zone word shown after each date, for example "Warszawa". */
  timeZone: string
  className?: string
}) {
  return (
    <ol aria-label={label} data-slot="route-stops" className={cn("flex flex-col", className)}>
      {stops.map(stop => (
        <li key={stop.label} className="flex flex-col gap-tight border-divider py-panel not-first:border-t">
          <div className="flex gap-panel">
            <p className="w-24 shrink-0 text-body-strong">{stop.label}</p>
            <div className="flex min-w-0 flex-col">
              <p className="text-section-title tabular-nums">{stop.time}</p>
              <p className="text-meta">{stop.date} ({timeZone})</p>
              <p className="text-body-strong wrap-anywhere">{stop.place}</p>
            </div>
          </div>
          {stop.details && stop.details.length > 0 && (
            <dl className="flex flex-col gap-tight">
              {stop.details.map(detail => (
                <div key={detail.label} className="flex gap-panel">
                  <dt className="w-24 shrink-0 text-meta">{detail.label}</dt>
                  <dd className="min-w-0 text-table wrap-anywhere">{detail.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </li>
      ))}
    </ol>
  )
}

export { RouteStops }
