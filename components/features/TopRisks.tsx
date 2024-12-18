'use client';

import { Card } from '@/components/ui/card';
import { Flame, Droplets, Wind, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';

const risks = [
  { name: 'Wildfire', score: 85, trend: 'up', icon: Flame },
  { name: 'Flooding', score: 78, trend: 'down', icon: Droplets },
  { name: 'Hurricanes', score: 72, trend: 'up', icon: Wind },
  { name: 'Power Outages', score: 65, trend: 'down', icon: Zap },
];

export function TopRisks({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6", className)}>
      <CardHeader title="Top Risks" />
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        <div className="space-y-4">
          {risks.map((risk) => (
            <div key={risk.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <risk.icon className="w-5 h-5 text-gray-500" />
                <span className="text-base font-medium">{risk.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">{risk.score}</span>
                {risk.trend === 'up' ? (
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