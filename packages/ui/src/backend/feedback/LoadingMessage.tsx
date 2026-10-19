export function LoadingMessage({ children }: { children: React.ReactNode }) {
  return <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{children}</p>;
}
