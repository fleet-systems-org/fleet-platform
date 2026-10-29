// Source: https://ui.shadcn.com/r/styles/new-york-v4/label.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from "@fleet-platform/ui/lib/utils"

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("flex items-center gap-tight text-label select-none peer-disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

export { Label }
