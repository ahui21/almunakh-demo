'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StatusFilter } from './initiatives/StatusFilter';
import { initiatives } from '@/lib/data/dashboard';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface InitiativesTrackerProps {
  className?: string;
}

export function InitiativesTracker({ className }: InitiativesTrackerProps) {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedInitiatives, setExpandedInitiatives] = useState<number[]>([]);

  const toggleInitiative = (id: number) => {
    setExpandedInitiatives(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredInitiatives = initiatives.filter(
    (initiative) => selectedStatus === 'All' || initiative.status === selectedStatus
  );

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader 
        title="Active Initiatives" 
        action={<StatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />}
      />
      <div className="h-[calc(100%-5rem)] overflow-y-auto pr-2 mt-6">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-gray-500">
          <div className="col-span-4">Initiative</div>
          <div className="col-span-2">POC</div>
          <div className="col-span-4">Progress</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="space-y-4">
          {filteredInitiatives.map((initiative) => (
            <div key={initiative.id} className="space-y-2">
              {/* Main Initiative Row */}
              <div
                className="grid grid-cols-12 gap-4 items-center cursor-pointer hover:bg-gray-50 rounded-md p-2"
                onClick={() => toggleInitiative(initiative.id)}
              >
                {/* Initiative Name & Due Date - 4 columns (1/3) */}
                <div className="col-span-4 flex items-center gap-2">
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    expandedInitiatives.includes(initiative.id) && "transform rotate-90"
                  )} />
                  <div>
                    <div className="font-medium text-base truncate">{initiative.name}</div>
                    <div className="text-sm text-gray-500">
                      Due {format(new Date(initiative.dueDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                
                {/* POC - 2 columns (1/6) */}
                <div className="col-span-2 text-base truncate">
                  {initiative.poc}
                </div>

                {/* Progress Bar - 4 columns (1/3) */}
                <div className="col-span-4">
                  <ProgressBar progress={initiative.progress} size="md" />
                </div>

                {/* Status Badge - 2 columns (1/6) */}
                <div className="col-span-2">
                  <StatusBadge status={initiative.status} />
                </div>
              </div>

              {/* Sub-Initiatives with adjusted alignment */}
              {expandedInitiatives.includes(initiative.id) && initiative.subInitiatives && (
                <div className="border-l border-gray-200">
                  {initiative.subInitiatives.map((sub) => (
                    <div key={sub.id} className="grid grid-cols-12 gap-4 items-center p-2">
                      {/* Name - Still indented */}
                      <div className="col-span-4 pl-10">
                        <div className="font-medium text-sm truncate">{sub.name}</div>
                        <div className="text-sm text-gray-500">
                          Due {format(new Date(sub.dueDate), 'MMM d, yyyy')}
                        </div>
                      </div>

                      {/* POC - Aligned with parent */}
                      <div className="col-span-2 text-sm truncate">
                        {sub.poc}
                      </div>

                      {/* Progress Bar - Aligned with parent */}
                      <div className="col-span-4">
                        <ProgressBar progress={sub.progress} size="sm" />
                      </div>

                      {/* Status Badge - Aligned with parent */}
                      <div className="col-span-2">
                        <StatusBadge status={sub.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}