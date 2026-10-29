// Progress of a multi-step form on one line (R18.2, N7a): a completed step shows a check, the current step is filled,
// later steps are outlined and muted, and the line after a completed step takes the action colour. Informational only:
// completed steps are changed in the form ("Zmień", R18.1), so the bar has no links.
import * as React from "react"
import { IconCheck } from "@tabler/icons-react"
import { cn } from "@fleet-platform/ui/lib/utils"

function StepBar({
  label,
  steps,
  current,
  doneText,
  className,
}: {
  /** Accessible name of the list, for example "Postęp wyceny". */
  label: string
  /** Step names in order, for example "Auto", "Miejsca i czasy", "Fracht i mycie", "Wycena". */
  steps: string[]
  /** Index of the current step, from 0. Steps before it are completed. */
  current: number
  /** Word read after a completed step by screen readers, for example "gotowe". */
  doneText: string
  className?: string
}) {
  return (
    <ol aria-label={label} data-slot="step-bar" className={cn("flex w-full", className)}>
      {steps.map((step, index) => {
        const state = index < current ? "done" : index === current ? "current" : "waiting"
        return (
          <li
            key={step}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={cn("flex min-w-0 flex-1 flex-col items-center gap-tight text-center", state === "waiting" ? "text-muted" : "text-default")}
          >
            <span className="flex w-full items-center" aria-hidden="true">
              <span className={cn("flex-1 border-t", index === 0 ? "border-transparent" : index <= current ? "border-action" : "border-divider")} />
              <span
                className={cn(
                  "grid size-section shrink-0 place-items-center rounded-full border text-table tabular-nums",
                  state === "waiting" ? "border-input" : "border-action bg-action text-on-action",
                )}
              >
                {state === "done" ? <IconCheck className="size-4" /> : index + 1}
              </span>
              <span className={cn("flex-1 border-t", index === steps.length - 1 ? "border-transparent" : index < current ? "border-action" : "border-divider")} />
            </span>
            <span className="text-table">
              {step}
              {state === "done" && <span className="sr-only"> — {doneText}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export { StepBar }
