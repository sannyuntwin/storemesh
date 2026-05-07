import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[#0b4f9f] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#0e62c4] hover:shadow",
  secondary: "bg-[#e7eef8] text-[#0a3f82] hover:bg-[#dbe8f7]",
  ghost: "bg-transparent text-[#0a3f82] hover:bg-[#eaf2fd]",
  danger: "bg-rose-600 text-white shadow-sm hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow"
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
      ) : null}
      {children}
    </button>
  );
}
