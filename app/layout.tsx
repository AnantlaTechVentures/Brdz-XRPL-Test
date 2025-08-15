import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'BRDZ XRPL Ramp - Enterprise Fintech PoC',
  description: 'XRPL onramp and offramp solution with FX integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased">
        <Navbar />
        <main className="container py-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="container py-8">
            <div className="text-center text-slate-600">
              <p>&copy; 2025 BRDZ XRPL Ramp. Enterprise Fintech PoC.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}