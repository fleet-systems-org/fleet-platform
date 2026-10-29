// Source: https://ui.shadcn.com/r/styles/new-york-v4/textarea.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"
import { controlClasses } from "@fleet-platform/ui/components/input"

function Textarea({ className, rows = 3, ...props }: React.ComponentProps<"textarea">) {
  const control = useFieldControl(props)
  return <textarea data-slot="textarea" rows={rows} className={cn(controlClasses, "min-h-control py-group", className)} {...control} />
}

export { Textarea }
