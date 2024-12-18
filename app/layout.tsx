import './globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import 'leaflet/dist/leaflet.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
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
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-60">
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