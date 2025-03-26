"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface YearlyTrendChartProps {
  data: {
    Year: number;
    Crash_Sev_ID: string;
    crash_count: number;
  }[];
}

export default function YearlyTrendChart({ data }: YearlyTrendChartProps) {
  const chartData = useMemo(() => {
    // Group data by year and severity
    const yearlyData: Record<number, Record<string, number>> = {};

    data.forEach((crash) => {
      const year = crash.Year;
      const severity = crash.Crash_Sev_ID;

      if (!yearlyData[year]) {
        yearlyData[year] = {};
      }

      yearlyData[year][severity] =
        (yearlyData[year][severity] || 0) + crash.crash_count;
    });

    // Convert to chart format
    return Object.entries(yearlyData)
      .map(([year, severities]) => {
        const total = Object.values(severities).reduce(
          (sum, count) => sum + count,
          0
        );

        return {
          year: Number(year),
          total,
          ...severities,
        };
      })
      .sort((a, b) => a.year - b.year);
  }, [data]);

  // Get all unique severity types
  const severityTypes = useMemo(() => {
    const types = new Set<string>();
    data.forEach((crash) => types.add(crash.Crash_Sev_ID));
    return Array.from(types);
  }, [data]);

  // Define colors for each severity
  const severityColors: Record<string, string> = {
    Killed: "#ef4444",
    "Incapacitating Injury": "#f97316",
    "Non-Incapacitating": "#eab308",
    "Possible Injury": "#84cc16",
    "Not Injured": "#22c55e",
    Unknown: "#94a3b8",
    "N/A": "#cbd5e1",
  };

  if (chartData.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">
          No data available for the selected filters
        </p>
      </Card>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Total Crashes"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          {severityTypes.map((severity) => (
            <Line
              key={severity}
              type="monotone"
              dataKey={severity}
              name={severity}
              stroke={severityColors[severity] || "#9ca3af"}
              strokeWidth={1.5}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
