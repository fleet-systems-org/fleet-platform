"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { z } from "zod";
import type { ApiResult } from "../api/apiCall";
import { ErrorMessage } from "../feedback/ErrorMessage";
import { LoadingMessage } from "../feedback/LoadingMessage";
import { SuccessMessage } from "../feedback/SuccessMessage";

export type CrudField = { name: string; label: string; type?: "text" | "email" | "textarea"; inputMode?: "text" | "decimal"; required?: boolean };
export type CrudFormMessages = { submit: string; cancel: string; pending: string; success: string; translate: (key: string) => string };

// Deliberately minimal: flat string-valued fields. Decimal inputs remain strings.
export function CrudForm<T>({ schema, fields, initialValues, onSubmit, onCancel, confirmDiscard, messages }: {
  schema: z.ZodType<T>;
  fields: readonly CrudField[];
  initialValues: Record<string, string>;
  onSubmit: (value: T) => Promise<ApiResult<unknown>>;
  onCancel: () => void;
  confirmDiscard: () => boolean;
  messages: CrudFormMessages;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState(initialValues);
  const [saved, setSaved] = useState(initialValues);
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [failure, setFailure] = useState<string>();
  const [success, setSuccess] = useState(false);
  const dirty = Object.keys({ ...values, ...saved }).some(key => values[key] !== saved[key]);
  useEffect(() => {
    if (!dirty) return;
    const protect = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty]);
  useEffect(() => {
    if (!pending && Object.keys(errors).length > 0) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors, pending]);
  const cancel = () => { if (!lock.current && (!dirty || confirmDiscard())) onCancel(); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setPending(true); setFailure(undefined); setSuccess(false); setErrors({});
    try {
      const parsed = await schema.safeParseAsync(values);
      if (!parsed.success) {
        const next: Record<string, string[]> = Object.create(null);
        for (const issue of parsed.error.issues) (next[issue.path.join(".") || "_form"] ??= []).push("validation.invalid");
        setErrors(next); setFailure("api.validation"); return;
      }
      const result = await onSubmit(parsed.data);
      if (!result.ok) { setErrors(result.error.fieldErrors ?? {}); setFailure(result.error.messageKey); return; }
      setSaved({ ...values }); setSuccess(true);
    } catch { setFailure("api.network"); }
    finally { lock.current = false; setPending(false); }
  }
  function keyboard(event: KeyboardEvent<HTMLFormElement>) {
    if (event.defaultPrevented || event.nativeEvent.isComposing || lock.current) return;
    const target = event.target as HTMLElement;
    // Do not hijack keyboard interaction in nested popovers/dialogs/comboboxes.
    const overlay = target.closest('[role="dialog"], [role="combobox"], [role="listbox"]');
    if (overlay && event.currentTarget.contains(overlay)) return;
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault(); event.currentTarget.requestSubmit();
    } else if (event.key === "Escape") { event.preventDefault(); cancel(); }
  }
  return <form ref={formRef} onSubmit={submit} onKeyDown={keyboard} noValidate aria-busy={pending} className="space-y-4">
    <fieldset disabled={pending} className="space-y-4">
      {fields.map(field => {
        const inputId = `${id}-${field.name}`;
        const fieldErrors = errors[field.name] ?? errors[`body.${field.name}`];
        const props = {
          id: inputId, name: field.name, value: values[field.name] ?? "", required: field.required,
          inputMode: field.inputMode, "aria-invalid": !!fieldErrors,
          "aria-describedby": fieldErrors ? `${inputId}-error` : undefined,
          className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-2",
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setValues(current => ({ ...current, [field.name]: event.target.value })); setSuccess(false); },
        };
        return <div key={field.name} className="space-y-1">
          <label htmlFor={inputId} className="text-sm font-medium">{field.label}</label>
          {field.type === "textarea" ? <textarea {...props} /> : <input {...props} type={field.type ?? "text"} />}
          {fieldErrors && <ErrorMessage id={`${inputId}-error`}>{fieldErrors.map(messages.translate).join(" ")}</ErrorMessage>}
        </div>;
      })}
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{messages.submit}</button>
        <button type="button" onClick={cancel} className="rounded-md border px-4 py-2">{messages.cancel}</button>
      </div>
    </fieldset>
    {pending && <LoadingMessage>{messages.pending}</LoadingMessage>}
    {failure && <ErrorMessage>{messages.translate(failure)}</ErrorMessage>}
    {success && <SuccessMessage>{messages.success}</SuccessMessage>}
  </form>;
}
