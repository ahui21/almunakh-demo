'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { format, addMonths, startOfMonth } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImpactProjectionsProps {
  className?: string;
}

const timeRanges = {
  '3m': 3,
  '6m': 6,
  '1y': 12,
  '3y': 36,
  '10y': 120
};

const generateMonthlyData = (startDate: Date, months: number, baseValue: number) => {
  return Array.from({ length: months }, (_, i) => {
    const date = addMonths(startDate, i);
    const monthlyIncrease = i * 75000;
    const variation = Math.sin(i * 0.5) * 50000;
    
    const baseline = baseValue + monthlyIncrease + variation;
    const withRisks = baseline * 1.2; // 20% above baseline
    const withOpportunities = baseline * 1.3; // 30% above baseline
    const withBoth = baseline * 1.5; // 50% above baseline
    
    return {
      date: format(date, 'MMM yyyy'),
      fullDate: format(date, 'MMMM yyyy'),
      baseline,
      withRisks,
      withOpportunities,
      withBoth,
      _maxValue: withBoth
    };
  });
};

const formatDollar = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatMillions = (value: number) => 
  `$${(value / 1000000).toFixed(1)}M`;

export function ImpactProjections({ className }: ImpactProjectionsProps) {
  const [timeRange, setTimeRange] = useState<keyof typeof timeRanges>('1y');
  const [showRisks, setShowRisks] = useState(false);
  const [showOpportunities, setShowOpportunities] = useState(false);
  
  const data = useMemo(() => generateMonthlyData(
    startOfMonth(new Date()),
    timeRanges[timeRange],
    1000000
  ), [timeRange]);

  const yDomain = [
    0,
    Math.ceil(Math.max(...data.map(d => d._maxValue)) / 1000000) * 1000000
  ];

  const baselineLine = useMemo(() => (
    <Line
      type="monotone"
      dataKey="baseline"
      stroke="#000000"
      strokeWidth={2}
      dot={{ fill: '#000000', r: 4 }}
      activeDot={{ r: 6 }}
      name="Baseline Scenario"
    />
  ), []);

  const riskLine = useMemo(() => (
    <Line
      type="monotone"
      dataKey="withRisks"
      stroke="#EF4444"
      strokeWidth={2}
      dot={{ fill: '#EF4444', r: 4 }}
      activeDot={{ r: 6 }}
      name="w/ Risk Mitigation"
      style={{ display: showRisks ? 'initial' : 'none' }}
    />
  ), [showRisks]);

  const opportunitiesLine = useMemo(() => (
    <Line
      type="monotone"
      dataKey="withOpportunities"
      stroke="#22C55E"
      strokeWidth={2}
      dot={{ fill: '#22C55E', r: 4 }}
      activeDot={{ r: 6 }}
      name="w/ New Opportunities"
      style={{ display: showOpportunities ? 'initial' : 'none' }}
    />
  ), [showOpportunities]);

  const combinedLine = useMemo(() => (
    <Line
      type="monotone"
      dataKey="withBoth"
      stroke="#3B82F6"
      strokeWidth={2}
      dot={{ fill: '#3B82F6', r: 4 }}
      activeDot={{ r: 6 }}
      name="Combined Impact"
      style={{ display: showRisks && showOpportunities ? 'initial' : 'none' }}
    />
  ), [showRisks, showOpportunities]);

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader 
        title="Impact Projections" 
        action={
          <div className="flex items-center gap-4 ml-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="risks" 
                  checked={showRisks}
                  onCheckedChange={(checked) => setShowRisks(checked as boolean)}
                  className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                />
                <label
                  htmlFor="risks"
                  className="text-xs font-medium whitespace-nowrap text-red-600"
                >
                  w/ Risk Mitigation
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="opportunities" 
                  checked={showOpportunities}
                  onCheckedChange={(checked) => setShowOpportunities(checked as boolean)}
                  className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <label
                  htmlFor="opportunities"
                  className="text-xs font-medium whitespace-nowrap text-green-600"
                >
                  w/ New Opportunities
                </label>
              </div>
            </div>
            <Select 
              value={timeRange} 
              onValueChange={(value: keyof typeof timeRanges) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">Next 3 months</SelectItem>
                <SelectItem value="6m">Next 6 months</SelectItem>
                <SelectItem value="1y">Next year</SelectItem>
                <SelectItem value="3y">Next 3 years</SelectItem>
                <SelectItem value="10y">Next 10 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
      <div className="h-[calc(100%-3rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 25,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#6B7280' }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={formatMillions}
              tick={{ fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              domain={yDomain}
              ticks={Array.from(
                { length: 6 }, 
                (_, i) => (yDomain[1] / 5) * i
              )}
            />
            <Tooltip 
              formatter={(value: number) => formatDollar(value)}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '8px 12px'
              }}
            />
            
            {baselineLine}
            {riskLine}
            {opportunitiesLine}
            {combinedLine}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}