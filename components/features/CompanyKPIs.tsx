'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';

const kpis = [
  { name: 'Carbon Footprint', value: '12.5M', unit: 'tons', trend: 'down' },
  { name: 'Energy Usage', value: '45.8M', unit: 'kWh', trend: 'up' },
  { name: 'Water Usage', value: '8.2M', unit: 'gal', trend: 'down' },
  { name: 'Waste Generated', value: '2.4M', unit: 'tons', trend: 'up' },
];

export function CompanyKPIs({ className }: { className?: string }) {
  const sortedKpis = [...kpis].sort((a, b) => {
    const valueA = parseFloat(a.value.replace('M', ''));
    const valueB = parseFloat(b.value.replace('M', ''));
    return valueB - valueA;
  });

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader title="KPIs of Note" />
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        <div className="space-y-4">
          {sortedKpis.map((kpi) => (
            <div key={kpi.name} className="flex items-center justify-between">
              <span className="text-base font-medium">{kpi.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">{kpi.value}</span>
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