// Place search for route endpoints (P04, PLACE-2, PLACE-3). The dispatcher types an address or a town and chooses
// one result; the picker always says whether the choice is an exact address or only a town, because a town is a
// less exact route endpoint. The page searches (saved places first, then the map provider) and passes the results;
// the picker never merges spellings or picks a result by itself.
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"
import { controlClasses } from "@fleet-platform/ui/components/input"
import { Badge } from "@fleet-platform/ui/components/badge"
import { Button } from "@fleet-platform/ui/components/button"

/** One result. `place` is saved with an exact address, `address` is found by the map provider, `town` is a town only. */
export type PlaceOption = {
  id: string
  kind: "place" | "address" | "town"
  /** "Miejsce A", "Miasto D". */
  name: string
  /** Street address for a place or an address; region for a town. */
  detail?: string
  /** ISO country code; missing when no person has confirmed it, because a country is never invented (PLACE-2). */
  country?: string
  /** The same name exists in another region; the choice needs confirming (PLACE-2). */
  needsConfirmation?: boolean
  /** The dispatcher's spelling when this result matched another spelling ("Miejsce-B"); choosing it saves no alias. */
  typedAs?: string
}

/** `idle`: nothing typed, saved places shown; the other states describe the last search. */
export type PlaceSearchStatus = "idle" | "searching" | "results" | "notFound" | "unavailable"

/** Translated words, passed by the application like Field's `optionalText`. */
export type PlacePickerLabels = {
  /** Kind words, for example "Zapisane miejsce", "Adres", "Tylko miasto". */
  kinds: Record<PlaceOption["kind"], string>
  /** Badge of a same-named town, for example "Do potwierdzenia". */
  needsConfirmation: string
  /** Country not confirmed, for example "kraj niepotwierdzony". */
  noCountry: string
  /** Prefix of another spelling, for example "wpisano". */
  typedAs: string
  searching: string
  /** Shown when the last search found nothing, for example "Nie znaleziono miejsca. Sprawdź pisownię albo wpisz miasto." */
  notFound: string
  /** Shown when the map provider fails, for example "Wyszukiwanie adresów jest niedostępne. Wybierz zapisane miejsce." */
  unavailable: string
  /** Count of results for screen readers, for example `n => \`Wyniki: ${n}\``. */
  results: (count: number) => string
  /** Action that opens adding a place, for example "Dodaj miejsce…". */
  addPlace: string
}

const describe = (option: PlaceOption, labels: PlacePickerLabels) =>
  [labels.kinds[option.kind], option.detail, option.country ?? labels.noCountry].filter(Boolean).join(" · ")

function PlacePicker({
  options,
  status,
  labels,
  defaultValue = null,
  onQueryChange,
  onSelect,
  onAddPlace,
  disabled,
  className,
  ...props
}: {
  /** Saved places while `idle`; the results of the last search otherwise. */
  options: PlaceOption[]
  status: PlaceSearchStatus
  labels: PlacePickerLabels
  defaultValue?: PlaceOption | null
  /** Called with the typed text; the page searches and updates `options` and `status`. */
  onQueryChange?: (query: string) => void
  /** Called with the chosen result; typing again clears the choice (null). */
  onSelect?: (option: PlaceOption | null) => void
  /** Offers adding a place under the box (the page shows it only with `places.write`). */
  onAddPlace?: () => void
  disabled?: boolean
  className?: string
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  required?: boolean
}) {
  const ownId = React.useId()
  const listId = `${ownId}-list`
  const chosenId = `${ownId}-chosen`
  const statusId = `${ownId}-status`
  const control = useFieldControl(props)
  const [text, setText] = React.useState(defaultValue?.name ?? "")
  const [chosen, setChosen] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState(-1)
  const listed = status === "searching" || status === "notFound" ? [] : options
  const message = status === "searching" ? labels.searching : status === "notFound" ? labels.notFound
    : status === "unavailable" ? labels.unavailable : status === "results" ? labels.results(options.length) : ""
  const expanded = open && (listed.length > 0 || status !== "idle")

  const choose = (option: PlaceOption) => {
    setChosen(option)
    setText(option.name)
    setOpen(false)
    setActive(-1)
    onSelect?.(option)
  }

  return (
    <div data-slot="place-picker" className={cn("flex min-w-0 flex-col gap-tight", className)}>
      <div className="relative">
        <input
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && active >= 0 ? `${ownId}-option-${active}` : undefined}
          data-slot="place-picker-input"
          className={cn(controlClasses, "h-control")}
          disabled={disabled}
          {...control}
          aria-describedby={[control["aria-describedby"], chosen ? chosenId : undefined, statusId].filter(Boolean).join(" ")}
          value={text}
          onChange={event => {
            setText(event.target.value)
            setOpen(true)
            setActive(-1)
            if (chosen) {
              setChosen(null)
              onSelect?.(null)
            }
            onQueryChange?.(event.target.value)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={event => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              setOpen(true)
              if (listed.length > 0) {
                const down = event.key === "ArrowDown"
                setActive(current => (current < 0 ? (down ? 0 : listed.length - 1) : (current + (down ? 1 : listed.length - 1)) % listed.length))
              }
            } else if (event.key === "Enter" && expanded && active >= 0) {
              event.preventDefault()
              choose(listed[active]!)
            } else if (event.key === "Escape" && expanded) {
              event.preventDefault()
              setOpen(false)
            }
          }}
        />
        <div
          hidden={!expanded}
          data-slot="place-picker-popup"
          className="absolute inset-x-0 top-full z-50 mt-tight flex flex-col rounded-panel border border-input bg-panel p-tight shadow-overlay"
          // Clicks inside keep focus in the box, so the list does not close before a choice.
          onMouseDown={event => event.preventDefault()}
        >
          {message !== "" && status !== "results" ? <p data-slot="place-picker-message" className="max-w-measure px-group py-tight text-meta">{message}</p> : null}
          <ul id={listId} role="listbox" aria-labelledby={control["aria-labelledby"]} className="flex flex-col">
            {listed.map((option, index) => (
              <li
                key={option.id}
                id={`${ownId}-option-${index}`}
                role="option"
                aria-selected={chosen?.id === option.id}
                data-active={index === active ? "" : undefined}
                className="flex cursor-pointer flex-col gap-tight rounded-control px-group py-tight data-active:bg-page data-active:underline hover:bg-page"
                onClick={() => choose(option)}
              >
                <span className="flex flex-wrap items-center gap-group text-table">
                  {option.name}
                  {option.needsConfirmation ? <Badge>{labels.needsConfirmation}</Badge> : null}
                </span>
                <span className="text-meta">{describe(option, labels)}</span>
                {option.typedAs ? <span className="text-meta">{labels.typedAs}: {option.typedAs}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {chosen ? <p id={chosenId} data-slot="place-picker-chosen" className="text-meta">{describe(chosen, labels)}</p> : null}
      {onAddPlace ? (
        <Button variant="text" size="compact" data-slot="place-picker-add" className="w-fit px-0" disabled={disabled} onClick={onAddPlace}>
          {labels.addPlace}
        </Button>
      ) : null}
      <p id={statusId} role="status" className="sr-only">{expanded ? message : ""}</p>
    </div>
  )
}

export { PlacePicker }
