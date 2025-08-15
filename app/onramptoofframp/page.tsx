// Path: app/onramptoofframp/page.tsx
"use client";

import { useState } from "react";
import { OnrampOfframpModal } from "@/components/OnrampOfframpModal";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          ONRAMP → OFFRAMP (One Flow)
        </h1>
        <p className="mt-2 text-slate-600">
          Deposit with Visa to USDC on XRPL, then automatically cash out to bank or wallet — all in a single transaction flow.
        </p>

        <div className="mt-8">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Start Combined Onramp & Offramp
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          XRPL Testnet demo — for testing purposes only.
        </p>
      </div>

      {open && <OnrampOfframpModal open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
