'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
}

function getProgressColor(progress: number): string {
  if (progress < 33) return 'bg-[#DF2935]';
  if (progress < 66) return 'bg-[#FDCA40]';
  return 'bg-[#069D27]';
}

export function ProgressBar({ progress, size = 'md' }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2' : 'h-3';
  
  return (
    <div className="w-full relative">
      <div className="text-sm font-medium mb-1 text-center">{progress}%</div>
      <div className={cn("w-full bg-gray-400 rounded-full", height)}>
        <div 
          className={cn(
            getProgressColor(progress),
            height,
            "rounded-full transition-all duration-300"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 