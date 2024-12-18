'use client';

import { memo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  month: string;
  actual: number;
  projected: number;
}

interface LineChartProps {
  data: ChartData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

function LineChartComponent({ 
  data, 
  xAxisLabel = 'Time Period', 
  yAxisLabel = 'Impact Score' 
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart 
        data={data} 
        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month"
          label={{ value: xAxisLabel, position: 'bottom', offset: 0 }}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis
          label={{ 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            offset: 0,
            style: { textAnchor: 'middle' }
          }}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={{ stroke: '#E2E8F0' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            fontSize: '12px'
          }} 
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="#2D7DD2"
          name="Actual Impact"
          strokeWidth={2}
          dot={{ strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Line 
          type="monotone" 
          dataKey="projected" 
          stroke="#FDCA40"
          name="Projected Impact" 
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={{ strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export const LineChart = memo(LineChartComponent);