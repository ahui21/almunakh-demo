'use client';

import { Card } from '@/components/ui/card';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';

const locations = [
  { name: 'New York', score: 85, trend: 'up' },
  { name: 'Los Angeles', score: 78, trend: 'down' },
  { name: 'Miami', score: 92, trend: 'up' },
  { name: 'Chicago', score: 75, trend: 'down' },
  { name: 'Houston', score: 88, trend: 'up' },
];

export function TopLocations({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6", className)}>
      <CardHeader title="Top Locations" />
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-base font-medium">{location.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">{location.score}</span>
                {location.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-[#DF2935]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#069D27]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}