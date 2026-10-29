// Source: https://ui.shadcn.com/r/styles/new-york-v4/button.json (MIT), adapted to the Fleet Platform tokens.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@fleet-platform/ui/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-group rounded-control border py-tight text-center text-body transition-colors duration-instant disabled:cursor-not-allowed disabled:border-divider disabled:bg-page disabled:text-muted aria-disabled:cursor-not-allowed aria-disabled:border-divider aria-disabled:bg-page aria-disabled:text-muted [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-action bg-action text-on-action hover:border-action-hover hover:bg-action-hover active:border-action-hover active:bg-action-hover",
        secondary: "border-input bg-panel text-default hover:bg-page active:bg-page",
        text: "border-transparent bg-transparent text-action underline-offset-4 hover:underline active:underline disabled:bg-transparent disabled:border-transparent aria-disabled:bg-transparent aria-disabled:border-transparent",
      },
      size: {
        default: "min-h-control px-panel",
        compact: "min-h-control-compact px-group",
        icon: "size-control",
        "icon-compact": "size-control-compact",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (for example a link) with button styles. */
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={asChild ? type : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
