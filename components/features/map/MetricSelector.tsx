'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RiskMetric } from '@/lib/types/dashboard';

interface MetricSelectorProps {
  selectedMetric: RiskMetric;
  onMetricChange: (metric: RiskMetric) => void;
}

export function MetricSelector({ selectedMetric, onMetricChange }: MetricSelectorProps) {
  return (
    <Select value={selectedMetric} onValueChange={onMetricChange}>
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