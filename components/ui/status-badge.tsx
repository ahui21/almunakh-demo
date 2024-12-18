'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'In Progress' | 'Planning' | 'Completed';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = {
    'Planning': 'bg-gray-100 text-gray-700 border-gray-200',
    'In Progress': 'bg-amber-100 text-amber-800 border-amber-200',
    'Completed': 'bg-green-100 text-green-700 border-green-200'
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
      colors[status]
    )}>
      {status}
    </span>
  );
} 