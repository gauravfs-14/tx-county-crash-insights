"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CountyComparisonChartProps {
  data: Array<{ Cnty_ID: string; crash_count: number }>;
}

export default function CountyComparisonChart({
  data,
}: CountyComparisonChartProps) {
  const chartData = useMemo(() => {
    // Group data by county
    const countyCounts: Record<string, number> = {};

    data.forEach((crash) => {
      const county = crash.Cnty_ID;
      countyCounts[county] = (countyCounts[county] || 0) + crash.crash_count;
    });

    // Convert to chart format, sort by count, and take top 15
    return Object.entries(countyCounts)
      .map(([county, count]) => ({
        county,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 40);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">
          No data available for the selected filters
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="county"
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            name="Crash Count"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
