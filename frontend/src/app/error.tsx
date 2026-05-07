"use client";

import { Button } from "@/components/Button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
      <h2 className="text-2xl font-black text-rose-900">Unexpected error</h2>
      <p className="mt-2 text-sm text-rose-700">Something broke while rendering this page. Please try again.</p>
      <div className="mt-5">
        <Button variant="danger" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
