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
  Cell,
} from "recharts";

interface CrashData {
  Crash_Sev_ID: string;
  crash_count: number;
}

interface SeverityDistributionChartProps {
  data: CrashData[];
}

export default function SeverityDistributionChart({
  data,
}: SeverityDistributionChartProps) {
  const chartData = useMemo(() => {
    // Group data by severity
    const severityCounts: Record<string, number> = {};

    data.forEach((crash) => {
      const severity = crash.Crash_Sev_ID;
      severityCounts[severity] =
        (severityCounts[severity] || 0) + crash.crash_count;
    });

    // Convert to chart format and sort by count
    return Object.entries(severityCounts)
      .map(([severity, count]) => ({
        severity,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  // Define colors for each severity
  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      Killed: "#ef4444",
      "Incapacitating Injury": "#f97316",
      "Non-Incapacitating": "#eab308",
      "Possible Injury": "#84cc16",
      "Not Injured": "#22c55e",
      Unknown: "#94a3b8",
      "N/A": "#cbd5e1",
    };

    return colors[severity] || "#9ca3af";
  };

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
    <div className="h-[400px] w-full mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 120, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            label={{
              value: "Crash Count",
              position: "insideBottom",
              offset: -10,
            }}
          />
          <YAxis dataKey="severity" type="category" tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" name="Crash Count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getSeverityColor(entry.severity)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
