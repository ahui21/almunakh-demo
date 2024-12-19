'use client';

import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Initiative } from '@/lib/types/dashboard';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

export function InitiativeItem({ initiative }: { initiative: Initiative }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-medium">{initiative.name}</h4>
              </div>
              <div className="flex items-center gap-3">
                <ProgressBar progress={initiative.progress} />
                <StatusBadge status={initiative.status} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 pl-6">
              <Clock className="w-3 h-3" />
              <span>Due {initiative.dueDate}</span>
            </div>
          </div>
        </div>
  );
}