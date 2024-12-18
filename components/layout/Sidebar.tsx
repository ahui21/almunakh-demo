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
import { PremiumOverlay } from '@/components/ui/premium-overlay';
import { useState } from 'react';

const premiumOnlyMessage = "Sorry, this is only available for premium users only.";

export function Sidebar() {
  const pathname = usePathname();
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);
  const { toast } = useToast();

  const showPremiumError = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPremiumOverlay(true);
  };

  const mainLinks = [
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
  ];

  const settingsLinks = [
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

  const NavLink = ({ name, href, icon: Icon, isPremium }: typeof mainLinks[0]) => {
    if (isPremium) {
      return (
        <button
          onClick={showPremiumError}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 text-primary-foreground/90 rounded-md hover:bg-primary-foreground/10 transition-colors",
            pathname === href && "bg-primary-foreground/20 text-primary-foreground font-medium"
          )}
        >
          <Icon className="w-5 h-5" />
          <span>{name}</span>
        </button>
      );
    }

    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-2 text-primary-foreground/90 rounded-md hover:bg-primary-foreground/10 transition-colors",
          pathname === href && "bg-primary-foreground/20 text-primary-foreground font-medium"
        )}
      >
        <Icon className="w-5 h-5" />
        <span>{name}</span>
      </Link>
    );
  };

  return (
    <>
      <aside className="fixed left-0 top-0 w-60 h-screen bg-primary text-primary-foreground border-r border-primary/20 flex flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Almunakh</h1>
          <p className="text-sm text-primary-foreground/70">Climate Impact Dashboard</p>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {mainLinks.map((link) => (
              <li key={link.name}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings Section */}
        <div className="p-4 border-t border-primary-foreground/10">
          <h2 className="text-sm font-semibold text-primary-foreground/70 px-4 mb-2">Settings</h2>
          <ul className="space-y-1">
            {settingsLinks.map((link) => (
              <li key={link.name}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary-foreground/10">
          <div className="text-xs text-primary-foreground/70">
            <p>© 2024 Almunakh</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </aside>
      
      <PremiumOverlay 
        isOpen={showPremiumOverlay} 
        onClose={() => setShowPremiumOverlay(false)} 
      />
    </>
  );
}