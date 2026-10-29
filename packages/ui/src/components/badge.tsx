// Source: https://ui.shadcn.com/r/styles/new-york-v4/badge.json (MIT), adapted to the Fleet Platform tokens.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@fleet-platform/ui/lib/utils"

// A badge is a word, never a colour alone (WCAG 1.4.1); the colour only repeats what the word says.
const badgeVariants = cva(
  "inline-flex w-fit max-w-full shrink-0 items-center gap-tight rounded-control border px-tight text-label [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-input bg-panel text-default",
        estimate: "border-estimate-subtle bg-estimate-subtle text-estimate",
        loss: "border-loss-subtle bg-loss-subtle text-loss",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

function Badge({ className, variant = "neutral", ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
