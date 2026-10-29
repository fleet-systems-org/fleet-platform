// Source: https://ui.shadcn.com/r/styles/new-york-v4/input.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"

const controlClasses =
  "w-full min-w-0 rounded-control border border-input bg-panel px-panel text-body text-default placeholder:text-muted disabled:cursor-not-allowed disabled:border-divider disabled:bg-page disabled:text-muted read-only:bg-page aria-invalid:border-error"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const control = useFieldControl(props)
  return <input type={type} data-slot="input" className={cn(controlClasses, "h-control", className)} {...control} />
}

export { Input, controlClasses }
