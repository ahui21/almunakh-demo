'use client';

import { Clock } from 'lucide-react';
import type { Initiative } from '@/lib/types/dashboard';

interface InitiativeHeaderProps {
  initiative: Initiative;
}

export function InitiativeHeader({ initiative }: InitiativeHeaderProps) {
  return (
    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 pl-6">
      <Clock className="w-3 h-3" />
      <span>Due {initiative.dueDate}</span>
    </div>
  );
}