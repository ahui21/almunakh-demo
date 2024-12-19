'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Flame, Droplets, Wind, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import { TimeRangeSelector, type TimeRange } from './shared/TimeRangeSelector';

const riskChanges = {
  week: [
    { id: 1, name: 'Wildfire', score: 85, trend: 'up', change: 15.3, icon: Flame },
    { id: 2, name: 'Flooding', score: 78, trend: 'down', change: -8.2, icon: Droplets },
    { id: 3, name: 'Hurricanes', score: 72, trend: 'up', change: 12.7, icon: Wind },
    { id: 4, name: 'Power Outages', score: 65, trend: 'down', change: -5.4, icon: Zap },
  ],
  month: [
    { id: 1, name: 'Wildfire', score: 85, trend: 'up', change: 22.6, icon: Flame },
    { id: 2, name: 'Flooding', score: 78, trend: 'down', change: -12.8, icon: Droplets },
    { id: 3, name: 'Hurricanes', score: 72, trend: 'up', change: 18.9, icon: Wind },
    { id: 4, name: 'Power Outages', score: 65, trend: 'down', change: -9.7, icon: Zap },
  ],
  '6months': [
    { id: 1, name: 'Wildfire', score: 85, trend: 'up', change: 35.2, icon: Flame },
    { id: 2, name: 'Flooding', score: 78, trend: 'down', change: -18.4, icon: Droplets },
    { id: 3, name: 'Hurricanes', score: 72, trend: 'up', change: 28.6, icon: Wind },
    { id: 4, name: 'Power Outages', score: 65, trend: 'down', change: -14.2, icon: Zap },
  ],
  year: [
    { id: 1, name: 'Wildfire', score: 85, trend: 'up', change: 52.8, icon: Flame },
    { id: 2, name: 'Flooding', score: 78, trend: 'down', change: -25.6, icon: Droplets },
    { id: 3, name: 'Hurricanes', score: 72, trend: 'up', change: 42.3, icon: Wind },
    { id: 4, name: 'Power Outages', score: 65, trend: 'down', change: -19.8, icon: Zap },
  ],
  '3years': [
    { id: 1, name: 'Wildfire', score: 85, trend: 'up', change: 78.4, icon: Flame },
    { id: 2, name: 'Flooding', score: 78, trend: 'down', change: -32.9, icon: Droplets },
    { id: 3, name: 'Hurricanes', score: 72, trend: 'up', change: 65.7, icon: Wind },
    { id: 4, name: 'Power Outages', score: 65, trend: 'down', change: -28.3, icon: Zap },
  ],
};

export function TopRisks({ className }: { className?: string }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const risks = riskChanges[timeRange];
  const sortedRisks = [...risks].sort((a, b) => b.score - a.score);

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader 
        title="Top Risks" 
        action={<TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />}
      />
      <div className="h-[calc(100%-2rem)] overflow-y-auto mt-4">
        <div className="space-y-4">
          {sortedRisks.map((risk) => (
            <div key={risk.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <risk.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{risk.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold w-12 text-right">{risk.score}</span>
                <div className="flex items-center gap-2 w-20">
                  <div className="w-5 flex justify-end">
                    {risk.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-[#DF2935]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-[#069D27]" />
                    )}
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
                    {risk.change > 0 ? '+' : ''}{risk.change}%
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