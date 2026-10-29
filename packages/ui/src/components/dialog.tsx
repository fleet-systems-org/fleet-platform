// Source: https://ui.shadcn.com/r/styles/new-york-v4/dialog.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { IconX } from "@tabler/icons-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@fleet-platform/ui/lib/utils"
import { Button } from "@fleet-platform/ui/components/button"

/** Shared with AlertDialog, which has the same look and different behaviour. */
const dialogStyles = {
  // The overlay also centres and scrolls the panel, so a long dialog never leaves the screen at 320 px (WCAG 1.4.10).
  overlay: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-scrim p-between animate-overlay-in",
  content: "relative grid w-full max-w-measure gap-between rounded-panel border border-input bg-panel p-panel text-default shadow-overlay outline-hidden",
  // Room on the right for the 32 px close button in the corner.
  header: "flex flex-col gap-tight pr-section",
  title: "text-section-title",
  description: "text-body",
  footer: "flex flex-wrap items-center justify-end gap-group",
}

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

// A dialog collects typed input, so a click or focus outside never closes it and never loses the input
// (owner decision 2026-10-29); Escape, the close button and the footer's way back still close it.
function keepOpen(event: Event) {
  event.preventDefault()
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** The "Zamknij" icon button in the corner; Escape and the footer's cancel button close the dialog as well. */
  showCloseButton?: boolean
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="dialog-overlay" className={dialogStyles.overlay}>
        <DialogPrimitive.Content data-slot="dialog-content" className={cn(dialogStyles.content, className)} {...props} onInteractOutside={keepOpen}>
          {children}
          {showCloseButton ? (
            <DialogPrimitive.Close asChild>
              <Button variant="text" size="icon-compact" aria-label="Zamknij" className="absolute top-tight right-tight text-default hover:bg-page active:bg-page">
                <IconX aria-hidden />
              </Button>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn(dialogStyles.header, className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn(dialogStyles.footer, className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn(dialogStyles.title, className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn(dialogStyles.description, className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogStyles,
}
