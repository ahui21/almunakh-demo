'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Target, 
  MapPin, 
  BarChart, 
  FileText, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const premiumOnlyMessage = "Sorry, this is only available for premium users only.";

export function Sidebar() {
  const pathname = usePathname();
  const { toast } = useToast();

  const showPremiumError = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      variant: "destructive",
      title: "Premium Feature",
      description: premiumOnlyMessage,
    });
  };

  const links = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      isPremium: false
    },
    {
      name: 'Initiatives',
      href: '/initiatives',
      icon: Target,
      isPremium: true
    },
    {
      name: 'Locations',
      href: '/locations',
      icon: MapPin,
      isPremium: true
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart,
      isPremium: true
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      isPremium: true
    },
    {
      name: 'Preferences',
      href: '/preferences',
      icon: Settings,
      isPremium: true
    },
    {
      name: 'Help & Support',
      href: '/support',
      icon: HelpCircle,
      isPremium: true
    }
  ];

  return (
    <div className="fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold">Almunakh</h1>
        <p className="text-sm text-gray-500">Climate Impact Dashboard</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map(({ name, href, icon: Icon, isPremium }) => (
            <li key={name}>
              <Link
                href={href}
                onClick={isPremium ? showPremiumError : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                  pathname === href && "bg-gray-100 text-gray-900 font-medium"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>© 2024 Almunakh</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
} 