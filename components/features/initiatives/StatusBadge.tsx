'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'In Progress' | 'Planning' | 'Completed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#069D27]/10 text-[#069D27]';
      case 'In Progress':
        return 'bg-[#FDCA40]/10 text-[#FDCA40]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      getStatusColor(status)
    )}>
      {status}
    </span>
  );
}