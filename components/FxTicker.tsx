// ✅ path: components/FxTicker.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

interface FxTickerItem {
  symbol: string;
  value: number;
  change: number;
  percent: number;
  isUp: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// 🔹 Mapping simbol mata uang berdasarkan quote
const currencySymbols: Record<string, string> = {
  USD: '$',
  IDR: 'Rp',
  VND: '₫'
};

export default function FxTicker() {
  const [data, setData] = useState<FxTickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicker = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/fx/usdc-ticker`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch FX data');
      }

      const tickerList: FxTickerItem[] = json.data || [];

      // ✅ Filter hanya USDC/USD, USDC/IDR, USDC/VND
      const filtered = tickerList.filter(t =>
        ['USDC/USD', 'USDC/IDR', 'USDC/VND'].includes(t.symbol)
      );

      setData(filtered);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch FX data');
      console.error('FX Ticker error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center space-x-2 py-4">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-slate-600">Loading FX data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={20} />
          <span className="font-medium">FX Data Error</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{error}</p>
        <button
          onClick={fetchTicker}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card">
        <p className="text-slate-600">No FX data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-blue-600" size={20} />
          <h3 className="font-semibold text-lg">FX Ticker</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            Live
          </span>
        </div>
      </div>

      {/* ✅ Loop semua pair terpilih */}
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, idx) => {
          const [base, quote] = item.symbol.split('/');
          const currencySymbol = currencySymbols[quote] || '$';

          return (
            <div
              key={idx}
              className="col-span-2 border-b border-slate-200 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Symbol</p>
                  <p className="text-xl font-bold text-slate-900">{item.symbol}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Price</p>
                  <p className="text-xl font-bold text-slate-900">
                    {currencySymbol}
                    {item.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">24h Change</p>
                  <p
                    className={`text-lg font-semibold ${
                      item.isUp ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {item.isUp ? '+' : ''}
                    {currencySymbol}{item.change.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">24h Change %</p>
                  <p
                    className={`text-lg font-semibold ${
                      item.isUp ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {item.isUp ? '+' : ''}
                    {item.percent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
