'use client';

import { TrendingDown, TrendingUp, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { memo } from 'react';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import { scaleLinear } from 'd3-scale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RiskScoreCardProps {
  className?: string;
}

// Create a d3 color scale for better readability
const colorScale = scaleLinear<string>()
  .domain([0, 50, 100])
  .range(['#ef4444', '#eab308', '#22c55e'])
  .clamp(true);

function RiskScoreCardComponent({ className }: RiskScoreCardProps) {
  const score = 73;
  const trend = -7.35;
  const scoreColor = colorScale(score);

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg font-semibold">
          Overall Almunakh Score™
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              The Overall Almunakh Score™ is calculated based on your preparedness for short-term and long-term climate risks and opportunities (0 is lowest, 100 is highest).
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div 
          className="text-8xl font-bold text-center leading-none"
          style={{ color: scoreColor }}
        >
          {score}
        </div>
        <div className={cn(
          "mt-2 flex items-center gap-2 text-lg",
          trend < 0 ? "text-red-500" : "text-green-500"
        )}>
          {trend < 0 ? (
            <TrendingDown className="w-7 h-7" />
          ) : (
            <TrendingUp className="w-7 h-7" />
          )}
          <span>{Math.abs(trend)}% from last week</span>
        </div>
      </div>
    </Card>
  );
}

export const RiskScoreCard = memo(RiskScoreCardComponent);