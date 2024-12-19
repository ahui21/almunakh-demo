import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import 'leaflet/dist/leaflet.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Almunakh - Climate Impact Dashboard',
  description: 'Monitor and analyze environmental impact metrics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-52">
            <Header />
            <main className="flex-1 overflow-auto bg-gray-50 p-4">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}