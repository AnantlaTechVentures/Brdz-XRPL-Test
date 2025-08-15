// path: app/future-roadmap/page.tsx
'use client';

import { Lightbulb, Rocket, Network, QrCode, Users } from 'lucide-react';

export default function FutureRoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Lightbulb className="text-yellow-500" size={40} />
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Future Roadmap</h1>
          <p className="text-slate-600 text-lg">
            Vision and Development Plan for XRLP Anantla
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="card p-6">
        <p className="text-slate-700 leading-relaxed">
          As part of our long-term vision, XRLP Anantla is committed to pushing
          the boundaries of blockchain-based fiat payment systems. Our
          development roadmap outlines the next strategic steps we plan to take
          — subject to securing investment through{' '}
          <a
            href="https://xrplgrants.org/"
            target="_blank"
            className="text-blue-600 underline"
          >
            XRPL Grants
          </a>{' '}
          and other funding opportunities.
        </p>
      </div>

      {/* Roadmap Sections */}
      <div className="space-y-8">
        {/* 1. Crosschain */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Network className="text-purple-600" size={28} />
            <h2 className="text-2xl font-semibold text-slate-900">
              Crosschain Infrastructure
            </h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            We aim to build a seamless crosschain solution connecting EVM-based
            chains, Polygon, Solana, and XRPL. This allows users holding USDC
            on other chains to swap or bridge to XRPL, enabling instant fiat-to-fiat
            payments via XRPL's settlement capabilities.
          </p>
        </div>

        {/* 2. AI MCP Purchasing */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Rocket className="text-green-600" size={28} />
            <h2 className="text-2xl font-semibold text-slate-900">
              AI MCP Purchasing & Payment
            </h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            By integrating Model Context Protocol (MCP) with XRPL, we will
            enable AI-driven purchasing and payment flows. This includes
            automated decision-making, real-time currency conversion, and
            smart contract execution — all natively within XRPL’s environment.
          </p>
        </div>

        {/* 3. QR-based Fiat-to-Fiat */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <QrCode className="text-blue-600" size={28} />
            <h2 className="text-2xl font-semibold text-slate-900">
              QR-based Fiat-to-Fiat Payments
            </h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            We plan to implement QR payment capabilities that transcend
            traditional fiat limitations. With XRPL’s instant settlement and
            onramp-to-offramp conversion, users can pay in one fiat currency
            while the recipient receives another — instantly and seamlessly.
          </p>
        </div>
      </div>

      {/* Core Team */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="text-slate-700" size={28} />
          <h2 className="text-2xl font-semibold text-slate-900">Core Team</h2>
        </div>
        <ul className="list-disc pl-6 text-slate-700 space-y-1">
          <li>Rahul Sharma – Chief Executive Officer</li>
          <li>Hendri Rahmat – Lead Developer & Blockchain Engineer</li>
          <li>Rangga Dwi – Frontend Mobile Engineer</li>
        </ul>
      </div>
    </div>
  );
}
