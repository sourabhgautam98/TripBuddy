import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'TripBuddy — Agentic Travel Planner & Interactive Itineraries',
  description:
    'Plan personalized, map-based, day-by-day travel itineraries with an autonomous AI travel agent that calculates routes, discovers verified places, and optimizes schedules.',
  keywords: ['AI travel agent', 'itinerary planner', 'route optimizer', 'travel AI', 'Dehradun travel', 'Jaipur travel'],
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#090d16] text-slate-100 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} TripBuddy Real-world route calculations & verified places.</p>
            <div className="flex items-center gap-6">
              <span className="text-slate-400">Powered by Sourabh Gautam</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
