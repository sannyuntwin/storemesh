"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";

interface CredentialsSignInFormProps {
  callbackUrl?: string;
}

export function CredentialsSignInForm({ callbackUrl = "/seller/dashboard" }: CredentialsSignInFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false
    });

    if (!result || result.error) {
      setErrorMessage(t("auth.invalidCredentials"));
      setIsSubmitting(false);
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          {t("auth.email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-[#d7e3f3] bg-[#eef4fb] px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0b4f9f] focus:bg-white focus:ring-2 focus:ring-[#0b4f9f]/15"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("auth.emailPlaceholder")}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            {t("auth.password")}
          </label>
          <span className="text-xs text-slate-400">{t("auth.forgotPassword")}</span>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-[#d7e3f3] bg-[#eef4fb] px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0b4f9f] focus:bg-white focus:ring-2 focus:ring-[#0b4f9f]/15"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t("auth.passwordPlaceholder")}
        />
      </div>

      {errorMessage ? <p className="text-xs font-medium text-rose-600">{errorMessage}</p> : null}

      <div className="pt-3 text-center">
        <Button
          type="submit"
          className="h-10 min-w-[148px] rounded-full bg-[#0b4f9f] px-6 text-xs tracking-[0.08em] text-white hover:bg-[#0e62c4]"
          loading={isSubmitting}
        >
          {isSubmitting ? t("auth.signingIn") : `${t("navigation.signIn")}  →`}
        </Button>
      </div>
    </form>
  );
}
