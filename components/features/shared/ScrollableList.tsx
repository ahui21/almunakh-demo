'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollableListProps {
  children: ReactNode;
  className?: string;
  height?: string;
}

export function ScrollableList({ children, className, height = "140px" }: ScrollableListProps) {
  return (
    <div className={cn(`space-y-3 h-[${height}] overflow-y-auto pr-2`, className)}>
      {children}
    </div>
  );
}