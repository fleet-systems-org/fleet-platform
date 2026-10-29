"use client"
// Field: a visible label, an optional hint and an error message wired to one control through ARIA.
import * as React from "react"
import { IconAlertCircle } from "@tabler/icons-react"
import { cn } from "@fleet-platform/ui/lib/utils"
import { Label } from "@fleet-platform/ui/components/label"

type FieldControl = { id: string; "aria-labelledby": string; "aria-describedby"?: string; "aria-invalid"?: true; required?: boolean }

const FieldContext = React.createContext<FieldControl | null>(null)

/**
 * Props a control inside a Field receives. The Field owns the id, so the label always points at the control;
 * aria-labelledby also names controls that a <label for> cannot name, such as a radio group (WAI-ARIA APG);
 * the control's own description is appended to the hint and error, and invalid or required from either side applies.
 */
function useFieldControl<P extends { id?: string; "aria-labelledby"?: string; "aria-describedby"?: string; "aria-invalid"?: React.AriaAttributes["aria-invalid"]; required?: boolean }>(props: P): P {
  const field = React.useContext(FieldContext)
  if (!field) return props
  const describedBy = [field["aria-describedby"], props["aria-describedby"]].filter(Boolean).join(" ") || undefined
  return { ...props, id: field.id, "aria-labelledby": field["aria-labelledby"], "aria-describedby": describedBy, "aria-invalid": field["aria-invalid"] ?? props["aria-invalid"], required: field.required || props.required }
}

function Field({
  label,
  hint,
  error,
  required = false,
  optionalText,
  className,
  children,
}: {
  /** Visible name of the field; never replaced by a placeholder. */
  label: React.ReactNode
  /** Short help shown under the label, for example a format. */
  hint?: React.ReactNode
  /** What is wrong and what to do; shown under the control with an icon. */
  error?: React.ReactNode
  /** Marks the control as required for the browser and assistive technology. */
  required?: boolean
  /** Translated word for an optional field, for example "opcjonalne"; shown only when the field is not required. */
  optionalText?: string
  className?: string
  /** One control: Input, Textarea, Select, RadioGroup or another component that calls useFieldControl. */
  children: React.ReactNode
}) {
  const id = React.useId()
  const labelId = `${id}-label`
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined
  const control: FieldControl = { id, "aria-labelledby": labelId, "aria-describedby": describedBy, ...(error ? { "aria-invalid": true } : {}), required }

  return (
    <div data-slot="field" data-invalid={error ? "" : undefined} className={cn("flex flex-col gap-tight", className)}>
      <Label id={labelId} htmlFor={id}>
        {label}
        {!required && optionalText ? <span className="text-meta">({optionalText})</span> : null}
      </Label>
      {hint ? <p id={hintId} className="max-w-measure text-meta">{hint}</p> : null}
      <FieldContext.Provider value={control}>{children}</FieldContext.Provider>
      {error ? (
        <p id={errorId} className="flex max-w-measure items-start gap-tight text-body text-error">
          <IconAlertCircle aria-hidden className="mt-tight" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}

export { Field, useFieldControl }
