'use client';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md';
}

export function ProgressBar({ progress, size = 'md' }: ProgressBarProps) {
  // Function to calculate color based on progress using a diverging scale
  const getProgressColor = (value: number) => {
    // Red to Yellow to Green diverging scale
    if (value <= 25) return '#EF4444';  // Red (0-25%)
    if (value <= 37.5) return '#F87171'; // Red-Orange (26-37.5%)
    if (value <= 50) return '#FCD34D';   // Orange-Yellow (37.5-50%)
    if (value <= 62.5) return '#FBBF24'; // Yellow (50-62.5%)
    if (value <= 75) return '#34D399';   // Yellow-Green (62.5-75%)
    return '#22C55E';                    // Green (75-100%)
  };

  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`${height} transition-all duration-300 ease-in-out rounded-full`}
          style={{
            width: `${progress}%`,
            backgroundColor: getProgressColor(progress)
          }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-[32px]">
        {progress}%
      </span>
    </div>
  );
}