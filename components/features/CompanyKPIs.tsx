'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';

const kpis = [
  { location: 'New York', score: 85, trend: 'up' },
  { location: 'Los Angeles', score: 78, trend: 'down' },
  { location: 'Miami', score: 92, trend: 'up' },
  { location: 'Chicago', score: 75, trend: 'down' },
  { location: 'Houston', score: 88, trend: 'up' },
];

export function CompanyKPIs({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6", className)}>
      <CardHeader title="KPIs of Note" />
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <div key={kpi.location} className="flex items-center justify-between">
              <span className="text-base font-medium">{kpi.location}</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">{kpi.score}</span>
                {kpi.trend === 'up' ? (
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