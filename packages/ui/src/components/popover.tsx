// Source: https://ui.shadcn.com/r/styles/new-york-v4/popover.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "@fleet-platform/ui/lib/utils"

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  children,
  align = "start",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-max max-w-(--radix-popover-content-available-width) rounded-panel border border-input bg-panel p-panel text-body text-default shadow-overlay outline-hidden animate-overlay-in",
          className
        )}
        {...props}
      >
        {/* The inner measure keeps lines at about 65 characters; the outer limit keeps the panel on a 320 px screen. */}
        <div className="max-w-measure">{children}</div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
