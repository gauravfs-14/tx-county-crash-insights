"use client";

import { useState, useEffect, useMemo } from "react";
import crashDataJson from "../data/crash-data.json";

interface CrashData {
  Cnty_ID: string;
  Year: number;
  Crash_Sev_ID: string;
  crash_count: number;
  [key: string]: string | number; // Add string index signature
}

export function useCrashData() {
  const [data, setData] = useState<CrashData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract unique values for filters
  const counties = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.Cnty_ID))).sort();
  }, [data]);

  const years = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.Year))).sort();
  }, [data]);

  const severities = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.Crash_Sev_ID))).sort();
  }, [data]);

  // Set up filters
  const [filters, setFilters] = useState({
    counties: [] as string[],
    years: [] as number[],
    severities: [] as string[],
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Use the raw crash data directly
        // Process into expected format with minimal transformation
        const rawData = crashDataJson.map((item) => ({
          Cnty_ID: item.Cnty_ID, // Simple county naming
          Year: parseInt(item.Year), // Years from 2017-2024
          Crash_Sev_ID: item.Crash_Sev_ID,
          crash_count: parseInt(item.crash_count),
        }));

        setData(rawData);

        // Initialize filters with all values
        setFilters({
          counties: Array.from(new Set(rawData.map((item) => item.Cnty_ID))),
          years: Array.from(new Set(rawData.map((item) => item.Year))),
          severities: Array.from(
            new Set(rawData.map((item) => item.Crash_Sev_ID))
          ),
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (
      filters.counties.length === 0 &&
      filters.years.length === 0 &&
      filters.severities.length === 0
    ) {
      return data;
    }

    return data.filter((item) => {
      const countyMatch =
        filters.counties.length === 0 ||
        filters.counties.includes(item.Cnty_ID);
      const yearMatch =
        filters.years.length === 0 || filters.years.includes(item.Year);
      const severityMatch =
        filters.severities.length === 0 ||
        filters.severities.includes(item.Crash_Sev_ID);

      return countyMatch && yearMatch && severityMatch;
    });
  }, [data, filters]);

  return {
    data,
    filteredData,
    counties,
    years,
    severities,
    filters,
    setFilters,
    isLoading,
  };
}
