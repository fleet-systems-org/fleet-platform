// Decimal entry for amounts and quantities (P01). The value stays text from keystroke to request: the consumer
// passes the typed text and turns it into a decimal string with `parseDecimalInput` (FIN-1).
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"
import { controlClasses } from "@fleet-platform/ui/components/input"

function DecimalField({
  unit,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "inputMode"> & {
  /** Unit or currency shown after the value, for example "EUR"; also read as part of the description. */
  unit?: string
}) {
  const unitId = React.useId()
  const control = useFieldControl({
    ...props,
    "aria-describedby": [props["aria-describedby"], unit ? unitId : undefined].filter(Boolean).join(" ") || undefined,
  })
  return (
    <div data-slot="decimal-field" className={cn("flex min-w-0 items-center gap-group", className)}>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        data-slot="decimal-field-input"
        className={cn(controlClasses, "h-control text-right text-number")}
        {...control}
      />
      {unit ? <span id={unitId} data-slot="decimal-field-unit" className="shrink-0 text-table text-default">{unit}</span> : null}
    </div>
  )
}

export { DecimalField }
