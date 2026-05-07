import { HTMLAttributes } from "react";

interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

const roundedClasses: Record<NonNullable<LoadingSkeletonProps["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
};

export function LoadingSkeleton({ className, rounded = "lg", ...props }: LoadingSkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]",
        roundedClasses[rounded],
        className
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
