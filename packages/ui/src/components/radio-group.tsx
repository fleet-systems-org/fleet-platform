// Source: https://ui.shadcn.com/r/styles/new-york-v4/radio-group.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"

/** A group with no preselected option: a missing answer stays missing until the dispatcher chooses (R09, R13). */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  const control = useFieldControl(props)
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("group flex flex-col", className)} {...control} />
}

function RadioGroupItem({
  className,
  label,
  hint,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  /** Visible name of the option; the whole row is the click target. */
  label: React.ReactNode
  /** One line that says what the option means for the quote. */
  hint?: React.ReactNode
}) {
  const id = React.useId()
  const hintId = `${id}-hint`
  return (
    <label
      data-slot="radio-group-option"
      className={cn("flex min-h-control cursor-pointer items-start gap-group py-group has-disabled:cursor-not-allowed has-disabled:text-muted", className)}
    >
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        aria-labelledby={`${id}-label`}
        aria-describedby={hint ? hintId : undefined}
        className="mt-tight flex size-4 shrink-0 cursor-pointer disabled:cursor-not-allowed items-center justify-center rounded-full border border-input bg-panel hover:border-action aria-checked:border-action disabled:border-divider disabled:bg-page group-aria-invalid:border-error"
        {...props}
      >
        <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="size-2 rounded-full bg-action" />
      </RadioGroupPrimitive.Item>
      <span className="flex flex-col gap-tight">
        <span id={`${id}-label`} className="text-body">{label}</span>
        {hint ? <span id={hintId} className="max-w-measure text-meta">{hint}</span> : null}
      </span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem }
