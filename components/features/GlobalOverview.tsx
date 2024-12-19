import React from 'react';
import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import Map from '@/components/features/map/Map';

interface GlobalOverviewProps {
  className?: string;
}

export function GlobalOverview({ className }: GlobalOverviewProps) {
  return (
    <Card className={cn("p-6", className)}>
      <CardHeader 
        title="Global Overview"
      />
      <div className="h-[calc(100%-3rem)]">
        <Map />
      </div>
    </Card>
  );
} 