// path: components/TxStatusBadge.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiFetch, ApiException, updateClientTxStatus } from '@/lib/api';
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface TxStatusBadgeProps {
  kind: string;
  txid: string;
  initialStatus?: string;
}

interface StatusResponse {
  txid: string;
  status: string;
  details?: any;
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SUCCESS: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-100 text-slate-800',
};

const STATUS_ICONS = {
  PENDING: Clock,
  PROCESSING: Loader2,
  SUCCESS: CheckCircle,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
  CANCELLED: XCircle,
};

const FINAL_STATUSES = ['SUCCESS', 'COMPLETED', 'FAILED', 'CANCELLED'];

export default function TxStatusBadge({
  kind,
  txid,
  initialStatus = 'PENDING',
}: TxStatusBadgeProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const SIMULATE_MODE = process.env.NEXT_PUBLIC_SIMULATE_MODE === 'true';

  const fetchStatus = async () => {
    if (SIMULATE_MODE) {
      // 🔹 Mode simulasi → langsung sukses
      setStatus('SUCCESS');
      updateClientTxStatus(txid, 'SUCCESS');
      return;
    }

    if (FINAL_STATUSES.includes((status || '').toUpperCase()) || pollCount >= 30) {
      return; // Stop polling
    }

    setLoading(true);
    setError(null);

    try {
      const response: StatusResponse = await apiFetch(`/xrpl/${kind}/status/${txid}`);
      const newStatus = response.status || 'PENDING';
      setStatus(newStatus);
      updateClientTxStatus(txid, newStatus);
      setPollCount((prev) => prev + 1);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Failed to fetch status');
      }
      console.error('Status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (SIMULATE_MODE) {
      // 🔹 Auto sukses di 0.5 detik biar smooth
      const timer = setTimeout(() => {
        setStatus('SUCCESS');
        updateClientTxStatus(txid, 'SUCCESS');
      }, 500);
      return () => clearTimeout(timer);
    }

    // Polling normal
    if (!FINAL_STATUSES.includes(status)) {
      fetchStatus();
    }
    const interval = setInterval(() => {
      if (!FINAL_STATUSES.includes(status) && pollCount < 30) {
        fetchStatus();
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, pollCount]);

  const statusKey = (status || '').toUpperCase() as keyof typeof STATUS_COLORS;
  const colorClass = STATUS_COLORS[statusKey] || 'bg-slate-100 text-slate-800';
  const IconComponent = STATUS_ICONS[statusKey] || AlertCircle;
  const isAnimated =
    statusKey === 'PROCESSING' ||
    (loading && !FINAL_STATUSES.includes((status || '').toUpperCase()));

  if (error && pollCount < 5 && !SIMULATE_MODE) {
    return (
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-800">
        <AlertCircle size={14} />
        <span className="text-sm font-medium">Error</span>
        <button
          onClick={fetchStatus}
          className="text-xs underline hover:no-underline ml-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${colorClass}`}>
      <IconComponent size={14} className={isAnimated ? 'animate-spin' : ''} />
      <span className="text-sm font-medium">{status}</span>
      {pollCount >= 30 &&
        !FINAL_STATUSES.includes((status || '').toUpperCase()) &&
        !SIMULATE_MODE && (
          <span className="text-xs opacity-75">(timeout)</span>
        )}
    </div>
  );
}
