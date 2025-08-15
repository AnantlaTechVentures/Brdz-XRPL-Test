'use client';

import { useState, useEffect } from 'react';
import { List, RefreshCw } from 'lucide-react';
import { ClientTransaction, apiFetch } from '@/lib/api';
import TxStatusBadge from '@/components/TxStatusBadge';
import TransactionReceiptModal from '@/components/TransactionReceiptModal';

type XRPLRow = {
  id: number;
  tx_type: 'ONRAMP' | 'OFFRAMP' | 'OFFRAMP_FIAT';
  tx_hash: string | null;
  source_address: string | null;
  destination_address: string | null;
  currency_code: string;
  amount: string;
  status: string;
  raw_response?: any;
  created_at: string;
  updated_at: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ClientTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<ClientTransaction | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(transactions.length / pageSize);
  const currentTransactions = transactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // sesuai gaya lo
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/xrpl/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resp = await res.json();
      const rows: XRPLRow[] = resp?.history ?? [];

      const mapped: ClientTransaction[] = rows.map((row) => ({
        id: String(row.id),
        type: ['ONRAMP', 'TOPUP', 'ONRAMP_TO_OFFRAMP'].includes(row.tx_type)
          ? 'onramp'
          : 'offramp',
        txid: row.tx_hash || `(no-hash:${row.id})`,
        amount: Number(row.amount),
        currency_code: row.currency_code,
        destination_address: row.destination_address ?? undefined,
        status: row.status,
        created_at: row.created_at,
        raw: row,
      }));

      mapped.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setTransactions(mapped);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const formatAmount = (amount: number, currency: string) =>
    `${amount.toLocaleString()} ${currency}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw
            className="animate-spin mx-auto text-slate-400"
            size={32}
          />
          <p className="text-slate-600 mt-2">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <List className="text-purple-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-600">
              View your transaction history and status
            </p>
          </div>
        </div>

        <button
          onClick={loadTransactions}
          className="btn-outline flex items-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="card text-center py-12">
          <List className="mx-auto text-slate-300" size={64} />
          <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">
            No transactions yet
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Your onramp and offramp transactions will appear here once you
            start using the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/onramptoofframp" className="btn-primary">
              Create Onramp to Offramp
            </a>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((tx) => (
                  <tr
                    key={tx.txid}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tx.type === 'onramp'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tx.type === 'onramp' ? 'Onramp' : 'Offramp'}
                      </span>
                    </td>
                    <td
                      className="py-3 px-4 font-mono text-sm text-blue-600 underline cursor-pointer"
                      onClick={() => setSelectedTx(tx)}
                    >
                      {tx.txid}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">
                        {formatAmount(tx.amount, tx.currency_code)}
                      </span>
                      {tx.destination_address && (
                        <div className="text-xs text-slate-500 mt-1">
                          To: {tx.destination_address.slice(0, 20)}...
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <TxStatusBadge
                        kind={
                          tx.type === 'onramp'
                            ? 'onramptoofframp'
                            : 'offramp'
                        }
                        txid={tx.txid}
                        initialStatus={tx.status}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">
                        {formatDate(tx.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="text-center text-sm text-slate-500">
          Showing {transactions.length} transaction
          {transactions.length !== 1 ? 's' : ''}
        </div>
      )}

      {selectedTx && (
        <TransactionReceiptModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
