// path to: lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.brdz.link/api';

export interface ApiError {
  message: string;
  status: number;
}

export class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check both localStorage and sessionStorage
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

export function setTokenStorage(token: string, mode: 'local' | 'session' = 'session'): void {
  if (typeof window === 'undefined') return;
  
  // Clear both storages first
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  
  // Set in chosen storage
  if (mode === 'local') {
    localStorage.setItem('auth_token', token);
  } else {
    sessionStorage.setItem('auth_token', token);
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
}

export async function apiFetch(path: string, init?: RequestInit): Promise<any> {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...init?.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...init,
      headers,
    });
    
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      throw new ApiException(
        data?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiException(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

// Client-side transaction storage
export interface ClientTransaction {
  id: string;
  type: 'onramp' | 'offramp' | 'onramptoofframp';
  txid: string;
  amount: number;
  currency_code: string;
  destination_address?: string;
  status: string;
  created_at: string;
  raw?: any;
  raw_response?: any;
}

export function storeClientTx(tx: ClientTransaction): void {
  if (typeof window === 'undefined') return;
  
  const existing = loadClientTxs();
  const updated = [...existing.filter(t => t.txid !== tx.txid), tx];
  
  localStorage.setItem('client_transactions', JSON.stringify(updated));
}

export function loadClientTxs(): ClientTransaction[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('client_transactions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load client transactions:', error);
    return [];
  }
}

export function updateClientTxStatus(txid: string, status: string): void {
  if (typeof window === 'undefined') return;
  
  const transactions = loadClientTxs();
  const updated = transactions.map(tx => 
    tx.txid === txid ? { ...tx, status } : tx
  );
  
  localStorage.setItem('client_transactions', JSON.stringify(updated));
}