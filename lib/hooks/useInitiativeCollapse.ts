'use client';

import { useState } from 'react';

export function useInitiativeCollapse() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isItemOpen = (id: number) => openItems.includes(id);

  return {
    openItems,
    toggleItem,
    isItemOpen,
  };
}