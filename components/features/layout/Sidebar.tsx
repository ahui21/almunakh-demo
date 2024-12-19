'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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

export function Sidebar() {
  const pathname = usePathname();
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);

  const showPremiumError = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPremiumOverlay(true);
  };
} 