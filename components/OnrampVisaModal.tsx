// Path: components/OnrampVisaModal.tsx
"use client";

import React, { useState, useEffect } from "react";

interface OnrampVisaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export default function OnrampVisaModal({ open, onClose, onSuccess }: OnrampVisaModalProps) {
  const [step, setStep] = useState<"form" | "processing" | "completed">("form");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [feePercentage, setFeePercentage] = useState(0);
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [walletId, setWalletId] = useState<string | null>(null);

  // Ambil wallet user
  const fetchWalletId = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/lists/my-wallet`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      const wallet = data?.wallets?.find((w: any) => w.currency === currency);
      setWalletId(wallet?.wallet_id || null);
    } catch (err) {
      console.error("❌ Fetch wallet error", err);
    }
  };

  // Ambil fee Visa
  const fetchFee = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/vs-checkout/visa/fee`);
      const data = await res.json();
      if (data?.fee_percentage !== undefined) setFeePercentage(data.fee_percentage);
    } catch (err) {
      console.error("❌ Fetch fee error", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchWalletId();
      fetchFee();
    }
  }, [open, currency]);

  // Progress bar step processing
  useEffect(() => {
    if (step === "processing") {
      setProgressBarWidth(0);
      const interval = setInterval(() => {
        setProgressBarWidth((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep("completed");
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleVisaTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!walletId) return setError("Wallet not found");
    if (!termsAccepted) return setError("Please accept the terms.");
    if (!/^\d{3}$/.test(cvv)) return setError("CVV must 3 numbers.");
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return setError("Wrong Format MM/YY.");
    const [mm] = expiryDate.split("/");
    if (Number(mm) < 1 || Number(mm) > 12) return setError("Not Valid Month.");

    setStep("processing");

    try {
      const payload = {
        card_number: cardNumber,
        expiry_date: expiryDate.replace(/[^0-9]/g, ""),
        cvv,
        amount,
        currency_code: currency,
        wallet_id: walletId,
        card_holder_name: cardHolderName,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/vs-checkout/visa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Topup failed");

      setStep("completed");
      onSuccess(result);
    } catch (err: any) {
      setError(err.message);
      setStep("form");
    }
  };

  const grossAmount = Number(amount) || 0;
  const feeAmount = parseFloat((grossAmount * feePercentage).toFixed(2));
  const netAmount = parseFloat((grossAmount - feeAmount).toFixed(2));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">Visa Onramp</h2>

        {step === "form" && (
          <form onSubmit={handleVisaTopup} className="space-y-4">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="VND">VND</option>
            </select>

            <input
              type="number"
              className="w-full border rounded-lg p-2"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <div className="text-sm text-gray-500">
              Fee: {feeAmount} {currency} | Receive: {netAmount} {currency}
            </div>

            <input
              type="text"
              className="w-full border rounded-lg p-2"
              placeholder="Cardholder Name"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              required
            />
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />

            <div className="flex gap-4">
              <input
                type="text"
                className="w-1/2 border rounded-lg p-2"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                  if (val.length > 5) val = val.slice(0, 5);
                  setExpiryDate(val);
                }}
                required
              />
              <input
                type="text"
                className="w-1/2 border rounded-lg p-2"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                required
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span className="text-sm">Accept terms and conditions</span>
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 text-white rounded-lg py-2 font-semibold"
            >
              Pay {grossAmount.toFixed(2)} {currency}
            </button>
          </form>
        )}

        {step === "processing" && (
          <div className="text-center space-y-4">
            <p>Processing...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progressBarWidth}%` }}
              />
            </div>
          </div>
        )}

        {step === "completed" && (
          <div className="text-center space-y-4">
            <h3 className="text-green-600 font-bold text-lg">Deposit completed!</h3>
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
