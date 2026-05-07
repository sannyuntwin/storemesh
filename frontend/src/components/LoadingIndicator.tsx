interface LoadingIndicatorProps {
  variant?: "bar" | "circle";
  className?: string;
}

export function LoadingIndicator({ variant = "bar", className }: LoadingIndicatorProps) {
  if (variant === "circle") {
    return (
      <div
        className={["h-7 w-7 animate-spin rounded-full border-2 border-blue-200 border-t-[#0b4f9f]", className]
          .filter(Boolean)
          .join(" ")}
        aria-label="Loading"
        role="status"
      />
    );
  }

  return (
    <div className={["h-1.5 w-full overflow-hidden rounded-full bg-blue-100", className].filter(Boolean).join(" ")}>
      <div className="h-full w-1/3 rounded-full bg-[#0b4f9f] animate-[loading-bar_1.2s_ease-in-out_infinite]" />
    </div>
  );
}
