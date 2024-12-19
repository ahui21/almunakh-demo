'use client';

import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { mapMarkers } from '@/lib/data/dashboard';
import { useState } from 'react';
import { MetricSelector } from './map/MetricSelector';
import type { RiskMetric } from '@/lib/types/dashboard';

const MapWithNoSSR = dynamic(() => import('@/components/features/map/Map'), {
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
  const [selectedMetric, setSelectedMetric] = useState<RiskMetric>('World Risk Index');

  return (
    <Card className={cn('p-6', className)}>
      <CardHeader 
        title="Global Overview" 
        action={
          <MetricSelector
            value={selectedMetric}
            onValueChange={setSelectedMetric}
          />
        }
      />
      <div className="h-[calc(100%-3rem)] rounded-lg overflow-hidden">
        <MapWithNoSSR 
          markers={mapMarkers} 
          selectedMetric={selectedMetric}
        />
      </div>
    </Card>
  );
}