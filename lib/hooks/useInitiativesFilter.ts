'use client';

import { useState } from 'react';
import type { Initiative } from '@/lib/types/dashboard';

export type Status = 'All' | 'In Progress' | 'Planning' | 'Completed';

export function useInitiativesFilter(initiatives: Initiative[]) {
  const [selectedStatus, setSelectedStatus] = useState<Status>('All');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredInitiatives = initiatives.filter(
    (initiative) => selectedStatus === 'All' || initiative.status === selectedStatus
  );

  return {
    selectedStatus,
    setSelectedStatus,
    openItems,
    toggleItem,
    filteredInitiatives,
  };
}