import Link from "next/link";

export type ContextShortcut = {
  id: string;
  title: string;
  description?: string;
  href: string;
};

type CatalogContextShortcutProps = {
  shortcut: ContextShortcut;
};

/** Inline smart shortcut between category groups — API/composed, not hard-coded steel SKUs. */
export function CatalogContextShortcut({ shortcut }: CatalogContextShortcutProps) {
  return (
    <Link
      href={shortcut.href}
      className="flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 shadow-[var(--shadow-soft)] transition active:scale-[0.99]"
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-text">{shortcut.title}</span>
        {shortcut.description ? (
          <span className="mt-0.5 block text-xs text-text-muted">
            {shortcut.description}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-sm font-medium text-accent" aria-hidden>
        ←
      </span>
    </Link>
  );
}
