"use client";

import { Button } from "@/components/Button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-[#f0d4cf] bg-[#fff6f4] p-8 text-center shadow-sm">
      <h2 className="text-2xl font-black text-[#8f2f1f]">Unexpected error</h2>
      <p className="mt-2 text-sm text-[#ad4c3a]">Something broke while rendering this page. Please try again.</p>
      <div className="mt-5">
        <Button className="bg-[#c84d32] hover:bg-[#b64228]" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
