"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { syncGoogleRegistration } from "@/services/authSync";
import { getErrorMessage } from "@/utils/errorMessage";

interface CompleteAddressFormProps {
  callbackUrl: string;
}

export function CompleteAddressForm({ callbackUrl }: CompleteAddressFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const { data: session } = useSession();
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const email = session?.user?.email?.trim().toLowerCase();
      const username = session?.user?.name?.trim();

      if (!email || !username) {
        throw new Error("Missing authenticated user information.");
      }

      await syncGoogleRegistration({
        googleId: session?.user?.googleId ?? undefined,
        providerAccountId: session?.user?.googleId ?? undefined,
        email,
        username,
        address
      });

      pushToast("Address saved successfully.", "success");
      router.replace(callbackUrl);
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error, "Could not save address. Please try again.");
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="address" className="text-sm font-semibold text-slate-700">
          Shipping Address
        </label>
        <textarea
          id="address"
          name="address"
          required
          rows={4}
          className="form-input min-h-24 resize-y"
          placeholder="Enter your shipping address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>

      {errorMessage ? <p className="text-sm font-medium text-rose-700">{errorMessage}</p> : null}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save and Continue"}
      </Button>
    </form>
  );
}
