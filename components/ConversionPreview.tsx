// path to: components/ConversionPreview.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiFetch, ApiException } from '@/lib/api';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface ConversionPreviewProps {
  amount: number;
  from: string;
  to?: string;
}

interface ConversionData {
  from: string;
  to: string;
  amount: number;
  converted_amount: number;
  exchange_rate: number;
  timestamp: string;
}

export default function ConversionPreview({ amount, from, to = 'USD' }: ConversionPreviewProps) {
  const [data, setData] = useState<ConversionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversion = async () => {
    if (!amount || amount <= 0) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(`/fx/convertall?from=${from}&to=${to}&amount=${amount}`);
      setData(response);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Failed to fetch conversion rate');
      }
      console.error('Conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchConversion();
    }, 500); // Debounce API calls

    return () => clearTimeout(debounceTimer);
  }, [amount, from, to]);

  if (!amount || amount <= 0) {
    return (
      <div className="card border-slate-100">
        <div className="text-center py-4">
          <p className="text-slate-500">Enter an amount to see conversion preview</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card border-blue-200">
        <div className="flex items-center justify-center space-x-2 py-4">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          <span className="text-slate-600">Calculating conversion...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200">
        <div className="flex items-center space-x-2 text-red-600 mb-2">
          <AlertCircle size={20} />
          <span className="font-medium">Conversion Error</span>
        </div>
        <p className="text-sm text-slate-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="card border-green-200 bg-green-50">
      <div className="flex items-center space-x-2 mb-4">
        <h4 className="font-semibold text-slate-900">Conversion Preview</h4>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-sm text-slate-600">{data.from}</p>
          <p className="text-2xl font-bold text-slate-900">
            {data?.amount?.toLocaleString() ?? '0'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <ArrowRight className="text-slate-400" size={20} />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-slate-600">{data.to}</p>
          <p className="text-2xl font-bold text-green-600">
            {data?.converted_amount?.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 4 
            }) ?? '0.00'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-green-200">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Exchange Rate:</span>
          <span className="font-medium">
            1 {data?.from ?? ''} = {(data?.exchange_rate ?? 0).toFixed(6)} {data?.to ?? ''}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Updated:</span>
          <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}