'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RiskMetric } from '@/lib/types/dashboard';

export function MetricSelector({ value, onValueChange }: { 
  value: RiskMetric; 
  onValueChange: (value: RiskMetric) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[280px] bg-white">
        <SelectValue placeholder="Select metric" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="World Risk Index">World Risk Index</SelectItem>
        <SelectItem value="Exposure">Exposure</SelectItem>
        <SelectItem value="Vulnerability">Vulnerability</SelectItem>
        <SelectItem value="Susceptibility">Susceptibility</SelectItem>
        <SelectItem value="Lack of Coping Capabilities">Lack of Coping Capabilities</SelectItem>
        <SelectItem value="Lack of Adaptive Capacities">Lack of Adaptive Capacities</SelectItem>
      </SelectContent>
    </Select>
  );
} 