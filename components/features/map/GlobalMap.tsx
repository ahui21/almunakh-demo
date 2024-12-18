'use client';

import { Card } from '@/components/ui/card';
import { TimeFilter } from './TimeFilter';
import { MapContainer } from './MapContainer';
import { cn } from '@/lib/utils';

interface GlobalMapProps {
  className?: string;
}

export function GlobalMap({ className }: GlobalMapProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Global Dashboard</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Current status of all worldwide locations
          </p>
        </div>
        <TimeFilter />
      </div>
      <MapContainer />
    </Card>
  );
}