/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTexasCounties } from "../hooks/use-texas-counties";

interface CrashData {
  Cnty_ID: string;
  Crash_Sev_ID: string;
  crash_count: number;
}

interface CrashMapProps {
  filteredData: CrashData[];
}

export default function CrashMap({ filteredData }: CrashMapProps) {
  const { counties, isLoading } = useTexasCounties();
  const [, setHoveredCounty] = useState<string | null>(null);
  const [legendCollapsed, setLegendCollapsed] = useState(false);

  // Calculate crash counts by county
  const countyCrashCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredData.forEach((crash) => {
      const county = crash.Cnty_ID;
      counts[county] = (counts[county] || 0) + crash.crash_count;
    });

    return counts;
  }, [filteredData]);

  // Find max crash count for color scaling
  const maxCrashCount = useMemo(() => {
    return Math.max(...Object.values(countyCrashCounts), 1);
  }, [countyCrashCounts]);

  // Style function for GeoJSON
  const getCountyStyle = (feature: any) => {
    const countyName = feature.properties.NAME;
    const crashCount = countyCrashCounts[countyName] || 0;
    const opacity =
      crashCount > 0 ? 0.2 + (crashCount / maxCrashCount) * 0.8 : 0.1;

    return {
      fillColor: "#ef4444",
      weight: 1,
      opacity: 1,
      color: "#666",
      fillOpacity: opacity,
    };
  };

  // Event handlers for GeoJSON features
  const onEachFeature = (feature: any, layer: any) => {
    const countyName = feature.properties.NAME;
    const crashCount = countyCrashCounts[countyName] || 0;

    // Get severity breakdown for this county
    const countyData = filteredData.filter(
      (crash) => crash.Cnty_ID === countyName
    );
    const severityCounts: Record<string, number> = {};

    countyData.forEach((crash) => {
      severityCounts[crash.Crash_Sev_ID] =
        (severityCounts[crash.Crash_Sev_ID] || 0) + crash.crash_count;
    });

    // Create tooltip content
    let tooltipContent = `
      <div class="county-tooltip">
        <h3 class="font-medium">${countyName} County</h3>
        <p>Total Crashes: ${crashCount.toLocaleString()}</p>
    `;

    if (Object.keys(severityCounts).length > 0) {
      tooltipContent += `<div class="mt-2 text-xs space-y-1">`;

      Object.entries(severityCounts).forEach(([severity, count]) => {
        tooltipContent += `
          <div class="flex justify-between">
            <span>${severity}:</span>
            <span>${count.toLocaleString()}</span>
          </div>
        `;
      });

      tooltipContent += `</div>`;
    }

    tooltipContent += `</div>`;

    // Bind tooltip to layer
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: "auto",
      className: "county-tooltip-wrapper",
    });

    layer.on({
      mouseover: () => setHoveredCounty(countyName),
      mouseout: () => setHoveredCounty(null),
    });
  };

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading map data...
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={[31.5, -99.5]} // Center of Texas
        zoom={6}
        style={{ height: "500px", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {counties && (
          <GeoJSON
            data={counties}
            style={getCountyStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Compact Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 shadow-md z-[1000] rounded-md overflow-hidden text-xs">
        <div
          className="flex items-center justify-between px-2 py-1 bg-zinc-100 cursor-pointer"
          onClick={() => setLegendCollapsed(!legendCollapsed)}
        >
          <span className="font-medium">Crash Density</span>
          {legendCollapsed ? (
            <svg
              className="size-3 text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="size-3 text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {!legendCollapsed && (
          <div className="p-2">
            <div className="h-2 w-24 rounded-sm bg-gradient-to-r from-red-200 to-red-600 mb-1"></div>
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        )}
      </div>

      {/* Add custom styles for the tooltip */}
      <style jsx global>{`
        .county-tooltip-wrapper {
          background: white;
          border: none;
          border-radius: 0.375rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          padding: 0.5rem 0.75rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", sans-serif;
          z-index: 9999;
        }

        .county-tooltip-wrapper .leaflet-tooltip-content {
          padding: 0;
        }

        .county-tooltip h3 {
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .county-tooltip p {
          margin: 0 0 0.5rem 0;
          font-size: 0.8125rem;
        }

        .county-tooltip .flex {
          display: flex;
          justify-content: space-between;
          margin-top: 0.125rem;
        }

        .county-tooltip-wrapper .leaflet-tooltip-tip {
          display: none;
        }
      `}</style>
    </div>
  );
}
