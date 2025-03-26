/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export function useTexasCounties() {
  const [counties, setCounties] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCounties = async () => {
      setIsLoading(true);

      try {
        // Fetch the GeoJSON data from the provided URL
        const response = await fetch(
          "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch counties GeoJSON");
        }

        const data = await response.json();

        // Filter to only include Texas counties (state FIPS code 48)
        // and transform the data to match our expected format
        const texasCounties = {
          type: "FeatureCollection",
          features: data.features
            .filter((feature: any) => {
              // Texas FIPS codes start with 48
              return feature.id.startsWith("48");
            })
            .map((feature: any) => {
              // Transform the data to match our expected format
              // The NAME property is used in our existing code
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  NAME: feature.properties.NAME,
                },
              };
            }),
        };

        setCounties(texasCounties);
      } catch (err) {
        console.error("Error fetching counties:", err);
        setError(err instanceof Error ? err : new Error(String(err)));

        // Fallback to simplified data if fetch fails
        setCounties(createSimplifiedTexasCounties());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounties();
  }, []);

  return { counties, isLoading, error };
}

// Fallback function to create a simplified Texas counties GeoJSON
function createSimplifiedTexasCounties() {
  // Create a simple rectangular shape for each county
  const counties = [
    "Harris",
    "Dallas",
    "Travis",
    "Bexar",
    "Tarrant",
    "Collin",
    "Denton",
    "El Paso",
    "Fort Bend",
    "Hidalgo",
    "Montgomery",
    "Williamson",
    "Cameron",
    "Brazoria",
    "Nueces",
  ];

  const features = counties.map((county, index) => {
    // Create a simple rectangular shape for each county
    // Position them in a grid layout
    const row = Math.floor(index / 5);
    const col = index % 5;

    const x1 = -102 + col * 2;
    const y1 = 28 + row * 2;
    const x2 = x1 + 1.5;
    const y2 = y1 + 1.5;

    return {
      type: "Feature",
      properties: {
        NAME: county,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
            [x1, y1],
          ],
        ],
      },
    };
  });

  return {
    type: "FeatureCollection",
    features,
  };
}
