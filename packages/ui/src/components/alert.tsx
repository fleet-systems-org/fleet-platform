// Source: https://ui.shadcn.com/r/styles/new-york-v4/alert.json (MIT), adapted to the Fleet Platform tokens.
import * as React from "react"
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react"
import { cn } from "@fleet-platform/ui/lib/utils"

const variants = {
  // A quote that cannot be shown yet: incomplete or stale. Not an error; the dispatcher has one thing to do.
  neutral: { className: "border-input text-default", Icon: IconInfoCircle, role: "status" },
  // Something failed (Q3): error colour, always with the icon and words.
  error: { className: "border-error text-error", Icon: IconAlertCircle, role: "alert" },
} as const

function Alert({
  className,
  variant = "neutral",
  title,
  action,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** `neutral` for an incomplete or stale result, `error` when something failed. */
  variant?: keyof typeof variants
  /** What happened, in a few words. */
  title: React.ReactNode
  /** What to do next, one or two sentences. */
  children?: React.ReactNode
  /** One action that resolves the message, for example a Button. */
  action?: React.ReactNode
}) {
  const { className: variantClassName, Icon, role } = variants[variant]
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role={role}
      className={cn("flex items-start gap-group rounded-panel border bg-panel p-panel", variantClassName, className)}
      {...props}
    >
      <Icon aria-hidden className="mt-tight size-4 shrink-0" />
      <div className="flex min-w-0 flex-col items-start gap-tight">
        <p data-slot="alert-title" className="text-body-strong">{title}</p>
        {children ? <div data-slot="alert-description" className="max-w-measure text-body text-default">{children}</div> : null}
        {action ? <div data-slot="alert-action" className="pt-tight">{action}</div> : null}
      </div>
    </div>
  )
}

export { Alert }
