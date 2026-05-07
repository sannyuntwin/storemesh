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
    <div className="relative overflow-hidden rounded-3xl border border-[#f0d4cf] bg-[#fff6f4] p-8 text-center shadow-sm">
      <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[#f07a5c]/20 blur-2xl" />
      <h3 className="relative text-lg font-bold text-[#8f2f1f]">{title}</h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-[#ad4c3a]">{description}</p>
      <Link
        href={actionHref}
        className="relative mt-5 inline-flex items-center rounded-xl bg-[#c84d32] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#b64228]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
