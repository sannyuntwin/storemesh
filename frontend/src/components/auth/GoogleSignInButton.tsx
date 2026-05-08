"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";

interface GoogleSignInButtonProps {
  callbackUrl?: string;
}

export function GoogleSignInButton({ callbackUrl = "/" }: GoogleSignInButtonProps) {
  const t = useTranslations();

  return (
    <Button
      variant="ghost"
      onClick={() => signIn("google", { callbackUrl })}
      className="h-10 w-full rounded-full border border-[#d7e3f3] !bg-white !text-slate-700 shadow-none hover:-translate-y-0 hover:!bg-[#f3f7fc]"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.64z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3a7.2 7.2 0 0 1-10.73-3.79H1.33v3.1A12 12 0 0 0 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.34 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.33a12 12 0 0 0 0 10.8l4.01-3.1z"
        />
        <path
          fill="#EA4335"
          d="M12 4.77c1.76 0 3.35.6 4.59 1.79l3.44-3.44C17.96 1.17 15.24 0 12 0A12 12 0 0 0 1.33 6.6l4.01 3.1A7.2 7.2 0 0 1 12 4.77z"
        />
      </svg>
      {t("auth.signInWithGoogle")}
    </Button>
  );
}
