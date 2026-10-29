// Source: https://ui.shadcn.com/r/styles/new-york-v4/alert-dialog.json (MIT), adapted to the Fleet Platform tokens.
"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
import { cn } from "@fleet-platform/ui/lib/utils"
import { Button } from "@fleet-platform/ui/components/button"
import { dialogStyles } from "@fleet-platform/ui/components/dialog"

function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay data-slot="alert-dialog-overlay" className={dialogStyles.overlay}>
        <AlertDialogPrimitive.Content data-slot="alert-dialog-content" className={cn(dialogStyles.content, className)} {...props} />
      </AlertDialogPrimitive.Overlay>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  // No close button in the corner: the dispatcher answers with one of the two footer buttons or Escape.
  return <div data-slot="alert-dialog-header" className={cn(dialogStyles.header, "pr-0", className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn(dialogStyles.footer, className)} {...props} />
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn(dialogStyles.title, className)} {...props} />
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={cn(dialogStyles.description, className)} {...props} />
}

/** The confirming action. Always the primary button: there is no red button, the title and label carry the weight (N5a, Q3). */
function AlertDialogAction(props: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <Button asChild>
      <AlertDialogPrimitive.Action data-slot="alert-dialog-action" {...props} />
    </Button>
  )
}

/** Keeps things as they are. Receives focus when the dialog opens, so Enter never confirms by accident. */
function AlertDialogCancel(props: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <Button variant="secondary" asChild>
      <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" {...props} />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
}
