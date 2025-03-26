"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { useCrashData } from "@/hooks/use-crash-data";
import FilterPanel from "@/components/filter-panel";
import CrashStatistics from "@/components/crash-statistics";
import YearlyTrendChart from "@/components/yearly-trend-chart";
import SeverityDistributionChart from "@/components/severity-distribution-chart";
import CountyComparisonChart from "@/components/county-comparison-chart";
import DataTable from "@/components/data-table";
import Footer from "@/components/footer";

// Dynamically import the map component to avoid SSR issues with Leaflet
const CrashMap = dynamic(() => import("@/components/crash-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function Dashboard() {
  const {
    filteredData,
    counties,
    years,
    severities,
    filters,
    setFilters,
    isLoading,
  } = useCrashData();

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Subtle Header Bar */}
      <div className="bg-white border-b border-zinc-200 py-4 mb-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-zinc-800">
              Texas Traffic Crash Dashboard
            </h1>
            <p className="text-zinc-500 text-sm">
              Analyze traffic crash data across Texas counties from 2017-2024
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto pb-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Filter Panel */}
          <Card className="md:col-span-1 shadow-sm border border-zinc-200">
            <CardHeader className="bg-zinc-100 border-b border-zinc-200 pb-3">
              <CardTitle className="text-zinc-700 text-base flex items-center gap-2">
                <span className="size-4 bg-amber-500 rounded-full"></span>
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FilterPanel
                counties={counties}
                years={years}
                severities={severities}
                filters={filters}
                setFilters={setFilters}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Map Panel */}
          <Card className="md:col-span-3 shadow-sm border border-zinc-200 overflow-hidden">
            <CardContent className="p-0">
              <CrashMap filteredData={filteredData} />
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <CrashStatistics filteredData={filteredData} />
        </div>

        {/* Charts Section */}
        <Card className="shadow-sm border border-zinc-200">
          <CardHeader className="bg-zinc-100 border-b border-zinc-200 pb-3">
            <CardTitle className="text-zinc-700 text-base flex items-center gap-2">
              <span className="size-4 bg-red-500 rounded-full"></span>
              <BarChart3 className="size-4 text-zinc-500" />
              Crash Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="yearly">
              <TabsList className="mb-6 bg-zinc-100 p-1">
                <TabsTrigger
                  value="yearly"
                  className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
                >
                  Yearly Trends
                </TabsTrigger>
                <TabsTrigger
                  value="severity"
                  className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
                >
                  Severity Distribution
                </TabsTrigger>
                <TabsTrigger
                  value="county"
                  className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
                >
                  County Comparison
                </TabsTrigger>
              </TabsList>
              <TabsContent value="yearly">
                <YearlyTrendChart data={filteredData} />
              </TabsContent>
              <TabsContent value="severity">
                <SeverityDistributionChart data={filteredData} />
              </TabsContent>
              <TabsContent value="county">
                <CountyComparisonChart data={filteredData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Data Table Section */}
        <Card className="shadow-sm border border-zinc-200 mt-8">
          <CardHeader className="bg-zinc-100 border-b border-zinc-200 pb-3">
            <CardTitle className="text-zinc-700 text-base flex items-center gap-2">
              <span className="size-4 bg-blue-500 rounded-full"></span>
              Detailed Crash Data
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable data={filteredData} />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
