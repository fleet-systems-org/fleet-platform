// Source: https://ui.shadcn.com/r/styles/new-york-v4/skeleton.json (MIT), adapted to the Fleet Platform tokens.
import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"

/**
 * A still placeholder for content that is loading (T9: no pulse, Q5b). Decorative and hidden from screen readers:
 * the region around it carries aria-busy and a LoadingMessage says what is loading.
 */
function Skeleton({ className, ...props }: Omit<React.ComponentProps<"div">, "children">) {
  return <div data-slot="skeleton" aria-hidden className={cn("rounded-control bg-divider", className)} {...props} />
}

export { Skeleton }
