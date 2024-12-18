'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-2", className)}>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}