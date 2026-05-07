"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";

interface CredentialsSignInFormProps {
  callbackUrl?: string;
}

export function CredentialsSignInForm({ callbackUrl = "/seller/dashboard" }: CredentialsSignInFormProps) {
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
      setErrorMessage("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="form-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="form-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
        />
      </div>

      {errorMessage ? <p className="text-xs font-medium text-rose-600">{errorMessage}</p> : null}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in with email"}
      </Button>
    </form>
  );
}
