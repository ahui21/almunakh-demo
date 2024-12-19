'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import { TimeRangeSelector, type TimeRange } from './shared/TimeRangeSelector';

const locationChanges = {
  week: [
    { id: 1, name: 'JFK Flight Hub', score: 15, trend: 'up', change: +3.4 },
    { id: 2, name: 'MIA Maintenance', score: 78, trend: 'down', change: -3.1 },
    { id: 3, name: 'LAX Operations', score: 62, trend: 'up', change: +5.8 },
    { id: 4, name: 'ORD Headquarters', score: 37, trend: 'up', change: +1.5 },
  ],
  month: [
    { id: 1, name: 'JFK Flight Hub', score: 15, trend: 'down', change: -4.0 },
    { id: 2, name: 'MIA Maintenance', score: 78, trend: 'up', change: +1.2 },
    { id: 3, name: 'LAX Operations', score: 62, trend: 'up', change: +8.8 },
    { id: 4, name: 'ORD Headquarters', score: 37, trend: 'up', change: +7.3 },
  ],
  '6months': [
    { id: 1, name: 'JFK Flight Hub', score: 15, trend: 'up', change: +7.0 },
    { id: 2, name: 'MIA Maintenance', score: 78, trend: 'up', change: +1.1 },
    { id: 3, name: 'LAX Operations', score: 62, trend: 'up', change: +9.8 },
    { id: 4, name: 'ORD Headquarters', score: 37, trend: 'up', change: +7.9 },
  ],
  year: [
    { id: 1, name: 'JFK Flight Hub', score: 15, trend: 'down', change: -1.0 },
    { id: 2, name: 'MIA Maintenance', score: 78, trend: 'up', change: +1.8 },
    { id: 3, name: 'LAX Operations', score: 62, trend: 'up', change: +3.0 },
    { id: 4, name: 'ORD Headquarters', score: 37, trend: 'down', change: -8.7 },
  ],
  '3years': [
    { id: 1, name: 'JFK Flight Hub', score: 15, trend: 'up', change: +1.0 },
    { id: 2, name: 'MIA Maintenance', score: 78, trend: 'down', change: -7.0 },
    { id: 3, name: 'LAX Operations', score: 62, trend: 'down', change: -5.6 },
    { id: 4, name: 'ORD Headquarters', score: 37, trend: 'up', change: +1.9 },
  ],
};

export function TopLocations({ className }: { className?: string }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const locations = locationChanges[timeRange];
  const sortedLocations = [...locations].sort((a, b) => b.score - a.score);

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader 
        title="Top Locations" 
        action={<TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />}
      />
      <div className="h-[calc(100%-2rem)] overflow-y-auto mt-4">
        <div className="space-y-4">
          {sortedLocations.map((location) => (
            <div key={location.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-base font-medium">{location.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold w-12 text-right">{location.score}</span>
                <div className="flex items-center gap-2 w-20">
                  <div className="w-5 flex justify-end">
                    {location.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-[#DF2935]" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-[#069D27]" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium w-12 text-right",
                    location.change > 0 ? "text-[#DF2935]" : "text-[#069D27]"
                  )}>
                    {location.change > 0 ? '+' : ''}{location.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}