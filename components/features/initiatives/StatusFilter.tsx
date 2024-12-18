'use client';

import { cn } from '@/lib/utils';

interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  const statuses = [
    { 
      label: 'All', 
      style: {
        backgroundColor: '#DBEAFE', // blue-100
        color: '#1E40AF',          // blue-800
      },
      hoverStyle: { backgroundColor: '#BFDBFE' }, // blue-200
      selectedStyle: 'ring-blue-500'
    },
    { 
      label: 'Planning', 
      style: {
        backgroundColor: '#F3F4F6', // gray-100
        color: '#1F2937',          // gray-800
      },
      hoverStyle: { backgroundColor: '#E5E7EB' }, // gray-200
      selectedStyle: 'ring-gray-500'
    },
    { 
      label: 'In Progress', 
      style: {
        backgroundColor: '#FEF3C7', // yellow-100
        color: '#92400E',          // yellow-800
      },
      hoverStyle: { backgroundColor: '#FDE68A' }, // yellow-200
      selectedStyle: 'ring-yellow-500'
    },
    { 
      label: 'Completed', 
      style: {
        backgroundColor: '#D1FAE5', // green-100
        color: '#065F46',          // green-800
      },
      hoverStyle: { backgroundColor: '#A7F3D0' }, // green-200
      selectedStyle: 'ring-green-500'
    },
  ];

  return (
    <div className="flex gap-1.5">
      {statuses.map(({ label, style, hoverStyle, selectedStyle }) => {
        const isSelected = selectedStatus === label;
        return (
          <button
            key={label}
            onClick={() => onStatusChange(label)}
            style={style}
            onMouseOver={(e) => {
              Object.assign(e.currentTarget.style, hoverStyle);
            }}
            onMouseOut={(e) => {
              Object.assign(e.currentTarget.style, style);
            }}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm transition-colors outline-none border-0',
              isSelected && [
                'font-bold',
                'ring-2',
                'ring-offset-1',
                selectedStyle
              ],
              !isSelected && 'font-medium'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}