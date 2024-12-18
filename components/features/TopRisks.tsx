'use client';

import { Card } from '@/components/ui/card';
import { Flame, Droplets, Wind, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';

const risks = [
  { name: 'Supply Chain Disruption', level: 'High', impact: 85 },
  { name: 'Regulatory Changes', level: 'Medium', impact: 65 },
  { name: 'Resource Scarcity', level: 'High', impact: 78 },
  { name: 'Market Volatility', level: 'Low', impact: 45 },
  { name: 'Technology Obsolescence', level: 'Medium', impact: 60 },
];

export function TopRisks({ className }: { className?: string }) {
  const sortedRisks = [...risks].sort((a, b) => b.impact - a.impact);

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader title="Top Risks" />
      <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2">
        <div className="space-y-4">
          {sortedRisks.map((risk) => (
            <div key={risk.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-gray-500" />
                <span className="text-base font-medium">{risk.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">{risk.impact}</span>
                {risk.level === 'High' ? (
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