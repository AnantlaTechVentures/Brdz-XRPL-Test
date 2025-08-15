//Path: components\TransactionReceiptModal.tsx

'use client';

import { X } from 'lucide-react';
import { ClientTransaction } from '@/lib/api';

interface TransactionReceiptModalProps {
  transaction: ClientTransaction;
  onClose: () => void;
}

export default function TransactionReceiptModal({
  transaction,
  onClose,
}: TransactionReceiptModalProps) {
        const anyTx = transaction as any;
        const jsonPretty = JSON.stringify(
        anyTx.raw ?? anyTx.raw_response ?? transaction,
        null,
        2
    );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Transaction Receipt
          </h2>

          <div className="mb-4">
            <p>
              <span className="font-semibold">Type:</span> {transaction.type}
            </p>
            <p>
              <span className="font-semibold">Transaction ID:</span>{' '}
              {transaction.txid}
            </p>
            <p>
              <span className="font-semibold">Amount:</span>{' '}
              {transaction.amount} {transaction.currency_code}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              {transaction.status}
            </p>
            <p>
              <span className="font-semibold">Created At:</span>{' '}
              {transaction.created_at}
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Raw Details</h3>
          <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
            {jsonPretty}
          </pre>
        </div>
      </div>
    </div>
  );
}
