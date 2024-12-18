import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import 'leaflet/dist/leaflet.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
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
      <body className={`${inter.className} antialiased`}>
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