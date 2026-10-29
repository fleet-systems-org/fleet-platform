export function SuccessMessage({ children }: { children: React.ReactNode }) {
  return <p role="status" aria-live="polite" className="text-body">{children}</p>;
}
