// Source: https://ui.shadcn.com/r/styles/new-york-v4/select.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { Select as SelectPrimitive } from "radix-ui"
import { cn } from "@fleet-platform/ui/lib/utils"
import { useFieldControl } from "@fleet-platform/ui/components/field"

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** `compact` (32 px) only inside a 36 px table row. */
  size?: "default" | "compact"
  /** Set by a surrounding Field; announced as aria-required because a button has no required attribute. */
  required?: boolean
}) {
  const { required, ...control } = useFieldControl(props)
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      aria-required={required || undefined}
      className={cn(
        "flex w-full min-w-0 cursor-pointer items-center justify-between gap-group rounded-control border border-input bg-panel text-left text-table text-default hover:bg-page disabled:cursor-not-allowed disabled:border-divider disabled:bg-page disabled:text-muted aria-invalid:border-error data-placeholder:text-muted [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        size === "default" ? "min-h-control px-panel py-tight" : "min-h-control-compact px-group py-tight",
        className
      )}
      {...control}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <IconChevronDown aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-x-hidden overflow-y-auto rounded-control border border-input bg-panel text-default shadow-overlay animate-overlay-in",
          className
        )}
        position={position}
        align={align}
        sideOffset={4}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-tight">{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label data-slot="select-label" className={cn("px-group py-tight text-label", className)} {...props} />
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-control-compact w-full cursor-pointer items-center gap-group rounded-control py-tight pr-between pl-group text-table outline-hidden select-none data-highlighted:bg-page data-highlighted:underline data-disabled:cursor-not-allowed data-disabled:text-muted [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span data-slot="select-item-indicator" className="absolute right-tight flex items-center">
        <SelectPrimitive.ItemIndicator>
          <IconCheck aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn("pointer-events-none my-tight h-px bg-divider", className)} {...props} />
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn("flex items-center justify-center py-tight", className)} {...props}>
      <IconChevronUp aria-hidden className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn("flex items-center justify-center py-tight", className)} {...props}>
      <IconChevronDown aria-hidden className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
