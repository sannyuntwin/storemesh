import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CredentialsSignInForm } from "@/components/auth/CredentialsSignInForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Login"
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const resolvedCallbackUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/seller/dashboard";

  if (session?.user) {
    redirect(resolvedCallbackUrl);
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/35 blur-2xl" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-blue-100/55 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0b4f9f]">Storemesh Access</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#0a3f82] md:text-4xl">
              Welcome back to your seller workspace
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
              Sign in with your Google account to manage inventory, publish products, and track store activity from one
              clean dashboard.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="surface-panel p-4">
                <p className="text-sm font-semibold text-[#0a3f82]">Fast Access</p>
                <p className="mt-1 text-xs leading-6 text-slate-600">One-click login with Google, no extra password flow.</p>
              </div>
              <div className="surface-panel p-4">
                <p className="text-sm font-semibold text-[#0a3f82]">Protected Tools</p>
                <p className="mt-1 text-xs leading-6 text-slate-600">Seller pages stay restricted to authenticated users.</p>
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Secure Login</p>
          <h2 className="mt-2 text-2xl font-black text-[#0a3f82]">Sign in to continue</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use email/password or continue with Google for your dashboard session.</p>

          <div className="mt-6">
            <CredentialsSignInForm callbackUrl={resolvedCallbackUrl} />
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-blue-100" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">or</span>
            <div className="h-px flex-1 bg-blue-100" />
          </div>

          <div>
            <GoogleSignInButton callbackUrl={resolvedCallbackUrl} />
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            By continuing, you agree to use this portal for assessment and demo purposes. Demo credentials:
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 font-semibold text-slate-700">seller@storemesh.local</code>
            /
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 font-semibold text-slate-700">storemesh123</code>
            .
          </p>

          <div className="mt-5">
            <Link href="/" className="text-sm font-semibold text-[#0b4f9f] underline-offset-4 hover:underline">
              Back to shop
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
