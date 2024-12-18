'use client';

import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('@/components/features/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
});

interface GlobalMapProps {
  className?: string;
}

export function GlobalMap({ className }: GlobalMapProps) {
  return (
    <Card className={cn("p-6", className)}>
      <CardHeader 
        title="Global Overview" 
        subtitle="Current status of all worldwide locations"
      />
      <div className="h-[calc(100%-3rem)] rounded-lg overflow-hidden">
        <MapWithNoSSR />
      </div>
    </Card>
  );
}