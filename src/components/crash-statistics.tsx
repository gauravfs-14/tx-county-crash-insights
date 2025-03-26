"use client";

import type React from "react";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Skull, Car, Activity } from "lucide-react";

interface CrashData {
  crash_count: number;
  Crash_Sev_ID: string;
  Cnty_ID: string;
}

interface CrashStatisticsProps {
  filteredData: CrashData[];
}

export default function CrashStatistics({
  filteredData,
}: CrashStatisticsProps) {
  const stats = useMemo(() => {
    // Initialize counters
    let totalCrashes = 0;
    let fatalCrashes = 0;
    let injuryCrashes = 0;
    const countiesAffected = new Set();

    // Calculate statistics
    filteredData.forEach((crash) => {
      totalCrashes += crash.crash_count;

      if (crash.Crash_Sev_ID === "Killed") {
        fatalCrashes += crash.crash_count;
      }

      if (
        crash.Crash_Sev_ID === "Incapacitating Injury" ||
        crash.Crash_Sev_ID === "Non-Incapacitating" ||
        crash.Crash_Sev_ID === "Possible Injury"
      ) {
        injuryCrashes += crash.crash_count;
      }

      countiesAffected.add(crash.Cnty_ID);
    });

    return {
      totalCrashes,
      fatalCrashes,
      injuryCrashes,
      countiesAffected: countiesAffected.size,
    };
  }, [filteredData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Crashes"
        value={stats.totalCrashes.toLocaleString()}
        icon={<Car className="size-5 text-blue-500" />}
        description="All reported crashes"
      />

      <StatCard
        title="Fatal Crashes"
        value={stats.fatalCrashes.toLocaleString()}
        icon={<Skull className="size-5 text-red-500" />}
        description="Crashes with fatalities"
      />

      <StatCard
        title="Injury Crashes"
        value={stats.injuryCrashes.toLocaleString()}
        icon={<AlertTriangle className="size-5 text-amber-500" />}
        description="Crashes with injuries"
      />

      <StatCard
        title="Counties Affected"
        value={stats.countiesAffected.toLocaleString()}
        icon={<Activity className="size-5 text-green-500" />}
        description="Counties with reported crashes"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">{title}</p>
            <p className="text-3xl font-bold text-zinc-800">{value}</p>
          </div>
          <div className="rounded-full p-2 bg-zinc-100">{icon}</div>
        </div>
        <p className="text-xs text-zinc-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
