# Texas County Crash Insights

Texas County Crash Insights is a data visualization tool that allows users to explore, analyze, and compare traffic crash data across all Texas counties. The dashboard provides multiple ways to interact with the data including maps, charts, and tables, making it easy to identify trends and patterns in crash occurrences and severities.

## Features

- **Interactive County Map**: Visualize crash density across Texas counties with color-coded indicators
- **Comprehensive Filtering**: Filter data by county, year, and crash severity
- **Key Statistics**: View summary statistics including total crashes, fatal crashes, injury crashes, and affected counties
- **Multiple Visualizations**:
  - Yearly trend analysis
  - Crash severity distribution
  - County comparison charts
- **Data Table**: Explore the raw data with sorting and searching capabilities
- **Export Functionality**: Export filtered data to CSV for further analysis

## Technologies Used

- **Framework**: Next.js 15.x with React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Mapping**: Leaflet with React-Leaflet
- **UI Components**: Shadcn UI
- **Data Visualization**: Custom chart components
- **Icons**: Lucide React

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Usage Guide

### Filtering Data

- Use the filter panel to select specific counties, years, or crash severity levels
- All visualizations and statistics will update automatically based on your selections

### Exploring the Map

- Hover over counties to see detailed crash information
- Use the map legend to understand crash density representations
- Zoom in/out for a closer look at specific regions

### Analyzing Charts

- **Yearly Trends**: Track crash patterns over time (2017-2024)
- **Severity Distribution**: Compare different crash severity levels
- **County Comparison**: Compare crash counts across different counties

### Working with Data Table

- Sort any column by clicking on the column header
- Use the search box to find specific records
- Export filtered data to CSV using the export button
