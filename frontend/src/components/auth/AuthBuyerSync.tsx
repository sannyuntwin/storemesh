"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { syncGoogleRegistration } from "@/services/authSync";

const buildSyncCacheKey = (email: string, googleId: string | undefined) => {
  return `storemesh_google_registration_sync:${email}:${googleId ?? "no-google-id"}`;
};

export function AuthBuyerSync() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      return;
    }

    const email = session.user.email?.trim().toLowerCase();
    const username = session.user.name?.trim();
    const provider = session.user.provider;
    const googleId = session.user.googleId ?? undefined;

    if (!email || !username) {
      return;
    }

    if (provider !== "google" && !googleId) {
      return;
    }

    const syncKey = buildSyncCacheKey(email, googleId);
    if (typeof window !== "undefined" && window.sessionStorage.getItem(syncKey) === "done") {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const result = await syncGoogleRegistration({
          googleId,
          providerAccountId: googleId,
          email,
          username
        });

        if (cancelled) {
          return;
        }

        if (!result.profileCompleted && pathname !== "/complete-address") {
          const callbackUrl = pathname && pathname.length > 0 ? pathname : "/";
          router.replace(`/complete-address?callbackUrl=${encodeURIComponent(callbackUrl)}`);
          return;
        }

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(syncKey, "done");
        }
      } catch {
        // Keep UI functional even if sync fails; user can continue and retry later.
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, session?.user, status]);

  return null;
}
