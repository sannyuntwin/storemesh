"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/Button";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function LogoutButton({ className, variant = "secondary" }: LogoutButtonProps) {
  return (
    <Button variant={variant} className={className} onClick={() => signOut({ callbackUrl: "/" })}>
      Log out
    </Button>
  );
}
