// One sentence that says why the list is empty and, when there is one, one next action (P9, R16.1).
export function EmptyState({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return <div role="status" className="flex flex-col items-start gap-group">
    <p className="max-w-measure text-body text-muted">{children}</p>
    {action}
  </div>;
}
