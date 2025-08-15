// Path: components/OnrampOfframpModal.tsx
'use client';

import { useEffect, useState } from "react";
import { TestingCardModal } from "./TestingCardModal";

interface OnrampOfframpModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnrampOfframpModal({ open, onClose }: OnrampOfframpModalProps) {
  if (!open) return null;

  // Onramp
  const [currency, setCurrency] = useState("USD"); // IDR | USD | VND | USDC
  const [amount, setAmount] = useState("");
  const [useVisa, setUseVisa] = useState(true);
  const [walletId, setWalletId] = useState<string | null>(null);

  // Visa fields
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // MM/YY
  const [cvv, setCvv] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Offramp
  const [targetFiat, setTargetFiat] = useState("IDR");
  const [payoutType, setPayoutType] = useState<"BRDZ_WALLET" | "BANK">("BRDZ_WALLET");
  const [destinationBank, setDestinationBank] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  // Offramp tambahan
  const [walletList, setWalletList] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCountry, setBankCountry] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showTestCard, setShowTestCard] = useState(false);

  // Ambil wallet id saat useVisa aktif
  useEffect(() => {
    const fetchWalletId = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/lists/my-wallet`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        const w = Array.isArray(data?.wallets)
          ? (data.wallets.find((x: any) => (x.currency || x.currency_code) === currency) || data.wallets[0])
          : null;
        setWalletId(w?.wallet_id || null);
      } catch {
        setWalletId(null);
      }
    };

    if (useVisa) fetchWalletId();
  }, [useVisa, currency]);

  // Ambil wallet list untuk Offramp (tanpa auth, filter IDR/USD/VND)
  useEffect(() => {
    const fetchWalletList = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/lists/wallet-list`);
        const data = await res.json();
        if (Array.isArray(data.wallets)) {
          const filtered = data.wallets.filter(
            (w: any) => w.currency === targetFiat
          );
          setWalletList(filtered);
        }
      } catch (err) {
        console.error("❌ Failed to fetch wallet list:", err);
      }
    };
    fetchWalletList();
  }, [targetFiat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: missing token");

      const amt = parseFloat(amount);
      if (!amt || amt <= 0) throw new Error("Amount must be greater than 0");

      // Validasi Onramp (Visa)
      if (useVisa) {
        if (!termsAccepted) throw new Error("Please accept the terms.");
        if (!/^\d{3}$/.test(cvv)) throw new Error("CVV must be 3 digits.");
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) throw new Error("Expiry format must be MM/YY.");
        const [mm] = expiryDate.split("/");
        if (Number(mm) < 1 || Number(mm) > 12) throw new Error("Invalid expiry month.");
        if (!walletId) throw new Error("Wallet not found for Visa payment.");
      }

      // Validasi Offramp tambahan
      if (payoutType === "BRDZ_WALLET" && !selectedWallet) {
        throw new Error("Please select a wallet for payout.");
      }
      if (payoutType === "BANK") {
        if (!accountHolderName || !accountNumber || !swiftCode || !bankName || !bankCountry) {
          throw new Error("All bank details are required.");
        }
      }

      // === STEP 1: ONRAMP ===
      if (useVisa) {
        const visaPayload = {
          card_number: cardNumber,
          expiry_date: expiryDate.replace(/[^0-9]/g, ""),
          cvv,
          amount: amt,
          currency_code: currency,
          wallet_id: walletId,
          card_holder_name: cardHolderName,
        };

        const visaRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/vs-checkout/visa`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(visaPayload),
        });
        const visaData = await visaRes.json();
        if (!visaRes.ok) throw new Error(visaData?.error || "Visa checkout failed");
      }

      const onrampUrl = `${process.env.NEXT_PUBLIC_API_BASE}/xrpl/onramp/init`;
      const onrampPayload =
        currency === "USDC"
          ? { currency_code: "USDC", amount: amt }
          : { fiat_currency: currency, fiat_amount: amt, currency_code: "USDC" };

      const xrplRes = await fetch(onrampUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(onrampPayload),
      });
      const xrplData = await xrplRes.json();
      if (!xrplRes.ok) throw new Error(xrplData?.error || "XRPL onramp failed");

      // === STEP 2: OFFRAMP (otomatis setelah onramp sukses) ===
      const offrampUrl = `${process.env.NEXT_PUBLIC_API_BASE}/xrpl/offramp/init`;
      let offrampPayload: any = { currency_code: "USDC" };

      if (destinationAddress) {
        offrampPayload = {
          ...offrampPayload,
          usdc_amount: xrplData?.usdc_amount || amt,
          destination_address: destinationAddress,
        };
      } else {
        offrampPayload = {
          ...offrampPayload,
          usdc_amount: xrplData?.usdc_amount || amt,
          target_fiat: targetFiat,
          payout_type: payoutType,
          ...(payoutType === "BRDZ_WALLET"
            ? { wallet_id: selectedWallet }
            : {
                account_holder_name: accountHolderName,
                account_number: accountNumber,
                swift_code: swiftCode,
                bank_name: bankName,
                bank_country: bankCountry,
              }),
        };
      }

      const offRes = await fetch(offrampUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(offrampPayload),
      });
      const offData = await offRes.json();
      if (!offRes.ok) throw new Error(offData?.error || "XRPL offramp failed");

      setResult({ onramp: xrplData, offramp: offData });
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white w-full max-w-7xl mx-auto">
      <h2 className="text-lg font-bold mb-4">XRPL Onramp → Offramp (One Flow)</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Onramp Section */}
        <div>
          <h3 className="font-semibold mb-2">Onramp Details</h3>
          <label className="block mb-2">
            Currency:
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded px-4 py-3"
            >
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="VND">VND</option>
              <option value="USDC">USDC</option>
            </select>
          </label>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={useVisa}
              onChange={(e) => setUseVisa(e.target.checked)}
            />
            <span className="text-sm">Use Visa Checkout (sandbox)</span>
          </label>

          {useVisa && (
            <div className="space-y-2 border rounded p-3 bg-slate-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Test card available</span>
                <button
                  type="button"
                  className="text-blue-600 underline text-sm"
                  onClick={() => setShowTestCard(true)}
                >
                  View Test Card
                </button>
              </div>
              <input
                type="text"
                className="w-full border rounded px-4 py-3"
                placeholder="Cardholder Name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                required
              />
              <input
                type="text"
                className="w-full border rounded px-4 py-3"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-1/2 border rounded px-2 py-1"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^0-9]/g, "");
                    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                    if (v.length > 5) v = v.slice(0, 5);
                    setExpiryDate(v);
                  }}
                  maxLength={5}
                  required
                />
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-1/2 border rounded px-2 py-1"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  required
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <span className="text-sm">I accept the terms</span>
              </label>
            </div>
          )}
        </div>

        {/* Offramp Section */}
        <div>
          <h3 className="font-semibold mb-2">Offramp Details</h3>
          <label className="block mb-2">
            Target Fiat:
            <select
              value={targetFiat}
              onChange={(e) => setTargetFiat(e.target.value)}
              className="w-full border rounded px-4 py-3"
            >
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="VND">VND</option>
            </select>
          </label>

          <label className="block mb-2">
            Payout Type:
            <select
              value={payoutType}
              onChange={(e) => setPayoutType(e.target.value as "BRDZ_WALLET" | "BANK")}
              className="w-full border rounded px-4 py-3"
            >
              <option value="BRDZ_WALLET">Wallet</option>
              <option value="BANK">Bank</option>
            </select>
          </label>

          {payoutType === "BRDZ_WALLET" && (
            <label className="block mb-2">
              Select Wallet:
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full border rounded px-4 py-3"
              >
                <option value="">-- Choose Wallet --</option>
                {walletList.map((w) => (
                  <option key={w.wallet_id} value={w.wallet_id}>
                    {w.username} ({w.currency}) — {w.phone}
                  </option>
                ))}
              </select>
            </label>
          )}

          {payoutType === "BANK" && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="w-full border rounded px-4 py-3"
              />
              <input
                type="text"
                placeholder="Account Number / IBAN"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full border rounded px-4 py-3"
              />
              <input
                type="text"
                placeholder="SWIFT Code / VBAN / Routing Number"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                className="w-full border rounded px-4 py-3"
              />
              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full border rounded px-4 py-3"
              />
              <input
                type="text"
                placeholder="Bank Country"
                value={bankCountry}
                onChange={(e) => setBankCountry(e.target.value)}
                className="w-full border rounded px-4 py-3"
              />
            </div>
          )}
        </div>

        {/* Common Amount */}
        <label className="block">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-4 py-3"
            required
            min="0.000001"
            step="0.000001"
            inputMode="decimal"
            placeholder="Enter amount"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 text-lg rounded"
        >
          {loading ? "Processing..." : "Process Onramp & Offramp"}
        </button>
      </form>

      {/* Error / Result */}
      {error && <p className="mt-3 text-red-500">{error}</p>}

      {result && (
        <div className="mt-3">
          <div className="p-3 bg-slate-50 border rounded text-sm">
            <div className="font-medium mb-1">Result</div>
            <div className="space-y-1">
              <div className="font-semibold">Onramp Result:</div>
              <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(result.onramp, null, 2)}</pre>
              <div className="font-semibold">Offramp Result:</div>
              <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(result.offramp, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {showTestCard && <TestingCardModal onClose={() => setShowTestCard(false)} />}
    </div>
  );
}
