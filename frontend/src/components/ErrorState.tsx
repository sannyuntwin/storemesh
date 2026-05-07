import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this section right now. Please try again.",
  actionLabel = "Back to shop",
  actionHref = "/"
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center shadow-sm">
      <h3 className="text-lg font-bold text-rose-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-rose-700">{description}</p>
      <Link
        href={actionHref}
        className="mt-5 inline-flex items-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-500"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
