// Decimal entry for amounts and quantities (P01). The value stays text from keystroke to request (FIN-1); when the
// dispatcher leaves the field it is checked against its kind's scale (FIN-3, FIN-4) and reported through onDecimalChange.
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"
import { controlClasses } from "@fleet-platform/ui/components/input"
import { parseDecimalInput, type DecimalInputResult, type DecimalKindOptions } from "@fleet-platform/ui/lib/decimal"

function DecimalField({
  kind,
  currency,
  signed = false,
  unit = currency,
  onDecimalChange,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "inputMode"> & DecimalKindOptions & {
  /** Allows a minus sign where the feature schema allows negative values. */
  signed?: boolean
  /** Unit shown after the value, for example "EUR/l"; an amount shows its currency. Also read as part of the description. */
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
          onDecimalChange?.(parseDecimalInput(event.currentTarget.value, { ...({ kind, currency } as DecimalKindOptions), signed }))
        }}
      />
      {unit ? <span id={unitId} data-slot="decimal-field-unit" className="shrink-0 text-table text-default">{unit}</span> : null}
    </div>
  )
}

export { DecimalField }
