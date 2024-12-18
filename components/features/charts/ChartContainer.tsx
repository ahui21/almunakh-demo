'use client';

import { ReactNode } from 'react';

interface ChartContainerProps {
  children: ReactNode;
  height?: string;
}

export function ChartContainer({ children, height = "calc(100%-5rem)" }: ChartContainerProps) {
  return (
    <div className={`h-[${height}]`}>
      {children}
    </div>
  );
}