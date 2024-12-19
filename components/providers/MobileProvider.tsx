'use client';

import { useState, useEffect } from 'react';
import { MobileWarning } from '@/components/shared/MobileWarning';

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Don't render anything on the server
  if (!isClient) return null;

  if (isMobile) {
    return <MobileWarning />;
  }

  return <>{children}</>;
} 