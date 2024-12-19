'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeRange = 'week' | 'month' | '6months' | 'year' | '3years';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onValueChange: (value: TimeRange) => void;
}

export function TimeRangeSelector({ value, onValueChange }: TimeRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[140px] h-8 text-sm">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">vs. last week</SelectItem>
        <SelectItem value="month">vs. last month</SelectItem>
        <SelectItem value="6months">vs. 6 months ago</SelectItem>
        <SelectItem value="year">vs. last year</SelectItem>
        <SelectItem value="3years">vs. 3 years ago</SelectItem>
      </SelectContent>
    </Select>
  );
} 