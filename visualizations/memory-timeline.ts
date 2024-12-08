import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/dashboard/visualizations/card';
import type { TimeSeriesDataPoint } from '@/types/dashboard';

interface MemoryTimelineProps {
  data: TimeSeriesDataPoint[];
  selectedTimeRange: string;
}

const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ data, selectedTimeRange }) => {
  // Filter data based on selected time range
  const filteredData = selectedTimeRange === 'all' 
    ? data 
    : data.filter(point => point.phase === selectedTimeRange);

  // Custom tooltip to show detailed information
  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-semibold">{`Timestamp: ${label}`}</p>
          <p className="text-green-600">{`Cache Hits: ${payload[0].value}`}</p>
          <p className="text-red-600">{`Cache Misses: ${payload[1].value}`}</p>
          <p className="text-blue-600">{`Total Accesses: ${payload[2].value}`}</p>
          <p className="text-gray-600">{`Phase: ${payload[0].payload.phase}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Memory Access Patterns Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cacheHits" 
                name="Cache Hits" 
                stroke="#2ecc71" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="cacheMisses" 
                name="Cache Misses" 
                stroke="#e74c3c" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="accesses" 
                name="Total Accesses" 
                stroke="#3498db" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryTimeline;
