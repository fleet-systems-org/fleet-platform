export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p role="status" className="text-sm text-muted-foreground">{children}</p>;
}
