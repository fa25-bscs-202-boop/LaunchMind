export function TextReportSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
      <div className="mt-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}

export function ListReportSection({ label, items }: { label: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="rounded-lg border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
