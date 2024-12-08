import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/dashboard/visualizations/card';

// Define the metrics interface explicitly here to avoid any type mismatches
interface PerformanceMetrics {
  cacheHitRate: number;
  cacheMissRate: number;
  totalAccesses: number;
  peakAccessRate: number;
}

interface PerformanceMetricsDisplayProps {
  metrics: PerformanceMetrics;
}

// Use type assertion to ensure TypeScript understands the component structure
const PerformanceMetricsDisplay = ({ metrics }: PerformanceMetricsDisplayProps) => {
  // Format numbers before rendering to avoid type comparison issues
  const formattedMetrics = {
    cacheHitRate: metrics.cacheHitRate.toFixed(1),
    cacheMissRate: metrics.cacheMissRate.toFixed(1),
    totalAccesses: metrics.totalAccesses.toLocaleString(),
    peakAccessRate: `${metrics.peakAccessRate}/s`
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <MetricBox
            label="Cache Hit Rate"
            value={`${formattedMetrics.cacheHitRate}%`}
          />
          <MetricBox
            label="Cache Miss Rate"
            value={`${formattedMetrics.cacheMissRate}%`}
          />
          <MetricBox
            label="Total Accesses"
            value={formattedMetrics.totalAccesses}
          />
          <MetricBox
            label="Peak Access Rate"
            value={formattedMetrics.peakAccessRate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Separate component for each metric box to ensure proper typing
interface MetricBoxProps {
  label: string;
  value: string;
}

const MetricBox = ({ label, value }: MetricBoxProps) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-mono font-semibold">{value}</p>
  </div>
);

export default PerformanceMetricsDisplay;