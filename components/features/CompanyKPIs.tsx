'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { TimeRangeSelector, type TimeRange } from './shared/TimeRangeSelector';
import { cn } from '@/lib/utils';

// Define changes for different time periods
const kpiChanges = {
  week: [
    { name: 'Flight delays', value: '731', unit: 'flights', trend: 'down', change: -4.4 },
    { name: 'Operational costs', value: '680M', unit: '$', trend: 'down', change: -6.6 },
    { name: 'Fleet vulnerability', value: '21%', unit: 'index', trend: 'down', change: -2.9 },
    { name: 'Infrastucture resilience', value: '12%', unit: 'index', trend: 'down', change: -5.1 },
  ],
  month: [
    { name: 'Flight delays', value: '731', unit: 'flights', trend: 'down', change: -1.0 },
    { name: 'Operational costs', value: '680M', unit: '$', trend: 'down', change: -1.2 },
    { name: 'Fleet vulnerability', value: '21%', unit: 'index', trend: 'down', change: -1.1 },
    { name: 'Infrastucture resilience', value: '12%', unit: 'index', trend: 'down', change: -1.5 },
  ],
  '6months': [
    { name: 'Flight delays', value: '731', unit: 'flights', trend: 'up', change: +7.3 },
    { name: 'Operational costs', value: '680M', unit: '$', trend: 'up', change: +7.3 },
    { name: 'Fleet vulnerability', value: '21%', unit: 'index', trend: 'up', change: +1.3 },
    { name: 'Infrastucture resilience', value: '12%', unit: 'index', trend: 'up', change: +1.2 },
  ],
  year: [
    { name: 'Flight delays', value: '731', unit: 'flights', trend: 'up', change: +1.7 },
    { name: 'Operational costs', value: '680M', unit: '$', trend: 'up', change: +5.5 },
    { name: 'Fleet vulnerability', value: '21%', unit: 'index', trend: 'up', change: +9.1 },
    { name: 'Infrastucture resilience', value: '12%', unit: 'index', trend: 'up', change: +9.3 },
  ],
  '3years': [
    { name: 'Flight delays', value: '731', unit: 'flights', trend: 'up', change: +1.5 },
    { name: 'Operational costs', value: '680M', unit: '$', trend: 'up', change: +1.4 },
    { name: 'Fleet vulnerability', value: '21%', unit: 'index', trend: 'up', change: +8.9 },
    { name: 'Infrastucture resilience', value: '12%', unit: 'index', trend: 'up', change: +1.3 },
  ],
};

export function CompanyKPIs({ className }: { className?: string }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const kpis = kpiChanges[timeRange];

  const sortedKpis = [...kpis].sort((a, b) => {
    const valueA = parseFloat(a.value.replace('M', ''));
    const valueB = parseFloat(b.value.replace('M', ''));
    return valueB - valueA;
  });

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader 
        title="KPIs of Note" 
        action={<TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />}
      />
      <div className="h-[calc(100%-2rem)] overflow-y-auto mt-4">
        <div className="space-y-4">
          {sortedKpis.map((kpi) => (
            <div key={kpi.name} className="flex items-center justify-between">
              <span className="text-base font-medium flex-1">{kpi.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold w-20 text-right">{kpi.value}</span>
                <div className="flex items-center gap-2 w-20">
                  <div className="w-5 flex justify-end">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-[#DF2935]" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-[#069D27]" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium w-12 text-right",
                    kpi.change > 0 ? "text-[#DF2935]" : "text-[#069D27]"
                  )}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
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