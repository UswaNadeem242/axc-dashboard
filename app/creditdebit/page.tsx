"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreditDebitRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/accounts/credit-debit-note");
  }, [router]);

  return (
    <div className="flex h-64 w-full items-center justify-center text-xs text-gray-500">
      Redirecting to Credit / Debit Note...
    </div>
  );
}
