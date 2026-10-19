export function ErrorMessage({ children, id }: { children: React.ReactNode; id?: string }) {
  return <p id={id} role="alert" className="text-sm text-destructive">{children}</p>;
}
