// Decimal entry for amounts and quantities (P01). The value stays text from keystroke to request (FIN-1); when the
// dispatcher leaves the field it is checked against its kind's scale (FIN-3) and reported through onDecimalChange.
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"
import { controlClasses } from "@fleet-platform/ui/components/input"
import { parseDecimalInput, type DecimalInputResult, type DecimalKind } from "@fleet-platform/ui/lib/decimal"

function DecimalField({
  kind,
  signed = false,
  unit,
  onDecimalChange,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "inputMode"> & {
  /** Kind of value; sets the allowed decimal places (FIN-3): eurAmount 2, unitPrice/fxRate/consumption 6, kilometres/litres 3. */
  kind: DecimalKind
  /** Allows a minus sign where the feature schema allows negative values. */
  signed?: boolean
  /** Unit or currency shown after the value, for example "EUR"; also read as part of the description. */
  unit?: string
  /** Called when the dispatcher leaves the field: a decimal string, or the reason it is not one. */
  onDecimalChange?: (result: DecimalInputResult) => void
}) {
  const unitId = React.useId()
  const control = useFieldControl({
    ...props,
    "aria-describedby": [props["aria-describedby"], unit ? unitId : undefined].filter(Boolean).join(" ") || undefined,
  })
  return (
    <div data-slot="decimal-field" data-kind={kind} className={cn("flex min-w-0 items-center gap-group", className)}>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        data-slot="decimal-field-input"
        className={cn(controlClasses, "h-control text-right text-number")}
        {...control}
        onBlur={event => {
          props.onBlur?.(event)
          onDecimalChange?.(parseDecimalInput(event.currentTarget.value, { kind, signed }))
        }}
      />
      {unit ? <span id={unitId} data-slot="decimal-field-unit" className="shrink-0 text-table text-default">{unit}</span> : null}
    </div>
  )
}

export { DecimalField }
