export function LoadingMessage({ children }: { children: React.ReactNode }) {
  return <p role="status" aria-live="polite" className="text-body text-muted">{children}</p>;
}
