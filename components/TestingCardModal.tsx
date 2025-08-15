// Path: components/TestingCardModal.tsx
import Image from "next/image";

export function TestingCardModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-112 fixed top-6 z-20 w-[calc(100%-32px)] space-y-3 rounded-3xl bg-white p-5 shadow-md lg:right-6 lg:w-[419px]">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>
      <div className="flex items-center gap-5 text-lg font-medium">
        <Image src="/credit-card-outline.svg" alt="Credit Card" width={24} height={24} />
        <span>Test payments</span>
      </div>
      <p className="hidden text-gray-500 lg:block">
        Use the following test card to complete your payment in sandbox mode.
      </p>
      <div className="border-console-border flex items-center justify-between gap-2 rounded-md border py-1 pl-3 pr-1 shadow-sm">
        <span className="truncate text-sm">4957030420210462</span>
        <button
          onClick={() => navigator.clipboard.writeText("4957030420210462")}
          className="border-console-border rounded-md border px-4 py-2 text-xs font-medium transition"
        >
          Copy
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600 space-y-2 border-t pt-4">
        <p className="text-orange-500">
          ⚠️ <strong>Note:</strong> You are using the <strong>Staging (Testnet) Mode</strong>.
        </p>
        <p>
          All funds deposited and transferred between wallets are <strong>virtual</strong> and used for <strong>testing only</strong>.
        </p>
        <ul className="list-disc list-inside text-gray-700 pl-2">
          <li><strong>Card Number:</strong> 4957030420210462</li>
          <li><strong>Expiry Date:</strong> Any valid MM/YY</li>
          <li><strong>CVV:</strong> 022</li>
          <li><strong>Max Amount:</strong> No limit for XRPL demo</li>
        </ul>
      </div>
    </div>
  );
}
