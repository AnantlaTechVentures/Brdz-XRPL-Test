'use client';

import Link from 'next/link';
import { ArrowUpCircle, ArrowDownCircle, List, TrendingUp } from 'lucide-react';
import FxTicker from '@/components/FxTicker';

export default function DashboardPage() {
  const quickActions = [
    {
      title: 'Onramp to Offramp',
      description: 'Convert fiat currency to USDC (XRPL environment) and Convert USDC (XRPL environment) to fiat currency',
      icon: ArrowUpCircle,
      href: '/onramptoofframp',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Future Roadmap', 
      description: 'XRLP Anantla – Future Development Roadmap',
      icon: ArrowDownCircle,
      href: '/future-roadmap',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Transactions',
      description: 'View your transaction history and status',
      icon: List,
      href: '/transactions',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <TrendingUp className="text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Monitor FX data and manage your XRPL transactions</p>
        </div>
      </div>

      {/* FX Ticker Section */}
      <section>
        <FxTicker />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="card hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${action.color}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Status Overview */}
      <section className="card bg-slate-50">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">System Status</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-emerald-600 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">FX API</span>
            </div>
            <p className="text-sm text-slate-600">Operational</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-emerald-600 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">XRPL Network</span>
            </div>
            <p className="text-sm text-slate-600">Operational</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-emerald-600 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Transaction Processing</span>
            </div>
            <p className="text-sm text-slate-600">Operational</p>
          </div>
        </div>
      </section>
    </div>
  );
}