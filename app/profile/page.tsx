// ✅ Path: app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>({});
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1️⃣/2️⃣ Ambil semua dari localStorage langsung
        const lsKeys = [
        "username",
        "email",
        "role",
        "e_kyc_status",
        "user_id",
        "client_id",
        "pending_username",
        "simulatedBalance",
        "xrpl_address",
        ];
        let userData: Record<string, any> = {};
        lsKeys.forEach((key) => {
        const val = localStorage.getItem(key);
        if (val) userData[key] = val;
        });
        setUser(userData);

        // 3️⃣ Ambil wallet list
        const walletRes = await fetch(`${API_BASE}/lists/my-wallet`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const walletData = await walletRes.json();
        if (Array.isArray(walletData.wallets)) {
          setWallets(walletData.wallets);
        }
      } catch (err) {
        console.error("❌ Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user?.username && !user?.email) {
    return (
      <div className="p-6">
        <p className="text-red-500">User not logged in.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600">View and manage your account details</p>
      </div>

      {/* User Info */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        {user.username && <p><strong>Username:</strong> {user.username}</p>}
        {user.email && <p><strong>Email:</strong> {user.email}</p>}
        {user.role && <p><strong>Role:</strong> {user.role}</p>}
        {user.e_kyc_status && <p><strong>KYC Status:</strong> {user.e_kyc_status}</p>}
        {user.client_id && <p><strong>Client ID:</strong> {user.client_id}</p>}
        {user.pending_username && <p><strong>Pending Username:</strong> {user.pending_username}</p>}
      </div>

      {/* Wallets */}
      {wallets.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">My BRDZ Wallets</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Currency</th>
                <th className="p-2">Balance</th>
                <th className="p-2">Wallet ID</th>
              </tr>
            </thead>
            <tbody>
            {wallets
                .filter(w => ['IDR', 'USD', 'VND'].includes(w.currency))
                .map((w) => (
                <tr key={w.wallet_id} className="border-t">
                    <td className="p-2">{w.currency}</td>
                    <td className="p-2">
                    {Number(w.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 6,
                    })}
                    </td>
                    <td className="p-2 flex items-center gap-2">
                    {w.wallet_id}
                    <button
                        type="button"
                        onClick={() => copyToClipboard(w.wallet_id)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <Copy size={16} />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* XRPL Address */}
      {user.xrpl_address && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">XRPL Info</h2>
          <p className="flex items-center gap-2">
            <strong>XRPL Address:</strong> {user.xrpl_address}
            <button
              type="button"
              onClick={() => copyToClipboard(user.xrpl_address)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Copy size={16} />
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
