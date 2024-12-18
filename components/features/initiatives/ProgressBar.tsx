'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md';
}

function getProgressColor(progress: number): string {
  if (progress < 33) return 'bg-[#DF2935]';
  if (progress < 66) return 'bg-[#FDCA40]';
  return 'bg-[#069D27]';
}

export function ProgressBar({ progress, size = 'md' }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2';
  
  return (
    <div className="w-[300px]">
      <div className={`text-xs font-medium mb-1 text-right`}>{progress}%</div>
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={cn(getProgressColor(progress), height, "rounded-full transition-all duration-300")}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}