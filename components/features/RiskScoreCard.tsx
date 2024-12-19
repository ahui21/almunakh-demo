'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { memo } from 'react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';

interface RiskScoreCardProps {
  className?: string;
}

function RiskScoreCardComponent({ className }: RiskScoreCardProps) {
  const score = 73;

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader title="Overall Risk Score" />
      <div className="flex flex-col items-center justify-center">
        <div className="text-8xl font-bold text-center text-[#DF2935]">{score}</div>
        <div className="mt-4 flex items-center gap-2 text-lg text-[#069D27]">
          <TrendingDown className="w-7 h-7" />
          <span>-7.35% from last week</span>
        </div>
      </div>
    </Card>
  );
}

export const RiskScoreCard = memo(RiskScoreCardComponent);