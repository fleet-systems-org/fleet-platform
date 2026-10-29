import { IconAlertCircle } from "@tabler/icons-react";

// An error always has an icon and words, never colour alone (Q3, WCAG 1.4.1).
export function ErrorMessage({ children, id }: { children: React.ReactNode; id?: string }) {
  return <p id={id} role="alert" className="flex max-w-measure items-start gap-tight text-body text-error">
    <IconAlertCircle aria-hidden className="mt-tight size-4 shrink-0" />
    <span>{children}</span>
  </p>;
}
