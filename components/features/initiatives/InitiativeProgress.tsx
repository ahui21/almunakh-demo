'use client';

import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import type { Initiative } from '@/lib/types/dashboard';

interface InitiativeProgressProps {
  initiative: Initiative;
}

export function InitiativeProgress({ initiative }: InitiativeProgressProps) {
  return (
    <div className="flex items-center gap-3">
      <ProgressBar progress={initiative.progress} />
      <StatusBadge status={initiative.status} />
    </div>
  );
}