// Path: app/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import XRPL_Anantla from '@/public/XRPL_Anantla.png'; // pastikan file ada di /public

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6">
            BRDZ <span className="bg-blue-600 text-white px-2 py-1 rounded">XRPL</span> Ramp
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Enterprise-grade XRPL onramp and offramp solution with real-time FX integration. 
            Seamless fiat-to-crypto conversions powered by Coinbase FX data.
          </p>

          {/* Gambar tengah - besar sampai hampir ke tombol */}
          <div className="flex justify-center mb-8">
            <div className="relative w-72 h-36 sm:w-80 sm:h-40 hover:scale-105 transition-transform duration-300">
              <Image
                src={XRPL_Anantla}
                alt="XRPL Anantla"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Tombol - posisi lebih bawah */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
            <Link 
              href="/login" 
              className="btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/login" 
              className="btn-outline inline-flex items-center justify-center text-lg px-8 py-4"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Enterprise Fintech Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Built for scale, security, and seamless user experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Real-time FX</h3>
            <p className="text-slate-600">
              Live exchange rates with automatic conversion previews and 5-second polling updates.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure Transactions</h3>
            <p className="text-slate-600">
              JWT-based authentication with real-time transaction status monitoring and secure API integration.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-4">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Multi-Currency</h3>
            <p className="text-slate-600">
              Support for IDR, USD, VND, and USDC with intelligent routing and conversion optimization.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 rounded-xl p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Ready to Experience Enterprise Fintech?
        </h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          Join the future of XRPL-powered financial services with our comprehensive onramp and offramp solution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="btn-primary inline-flex items-center justify-center space-x-2 px-8 py-3"
          >
            <span>Access Dashboard</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
