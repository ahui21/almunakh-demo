'use client';

import { useState } from 'react';
import type { Initiative } from '@/lib/types/dashboard';

export type Status = 'All' | 'In Progress' | 'Planning' | 'Completed';

export function useStatusFilter(initiatives: Initiative[]) {
  const [selectedStatus, setSelectedStatus] = useState<Status>('All');

  const filteredInitiatives = initiatives.filter(
    (initiative) => selectedStatus === 'All' || initiative.status === selectedStatus
  );

  return {
    selectedStatus,
    setSelectedStatus,
    filteredInitiatives,
  };
}