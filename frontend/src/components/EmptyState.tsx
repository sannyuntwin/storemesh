import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  emoji?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref, emoji = "🛍️" }: EmptyStateProps) {
  return (
    <div className="surface-card border-dashed p-8 text-center">
      <p className="text-3xl" aria-hidden>
        {emoji}
      </p>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center rounded-xl bg-[#0b4f9f] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0e62c4]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
