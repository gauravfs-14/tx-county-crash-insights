/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterPanelProps {
  counties: string[];
  years: number[];
  severities: string[];
  filters: {
    counties: string[];
    years: number[];
    severities: string[];
  };
  setFilters: (filters: any) => void;
  isLoading: boolean;
}

export default function FilterPanel({
  counties,
  years,
  severities,
  filters,
  setFilters,
  isLoading,
}: FilterPanelProps) {
  const [countyOpen, setCountyOpen] = useState(false);

  const handleCountySelect = (county: string) => {
    setFilters({
      ...filters,
      counties: filters.counties.includes(county)
        ? filters.counties.filter((c) => c !== county)
        : [...filters.counties, county],
    });
  };

  const handleYearSelect = (year: number) => {
    setFilters({
      ...filters,
      years: filters.years.includes(year)
        ? filters.years.filter((y) => y !== year)
        : [...filters.years, year],
    });
  };

  const handleSeveritySelect = (severity: string) => {
    setFilters({
      ...filters,
      severities: filters.severities.includes(severity)
        ? filters.severities.filter((s) => s !== severity)
        : [...filters.severities, severity],
    });
  };

  const resetFilters = () => {
    setFilters({
      counties: counties,
      years: years,
      severities: severities,
    });
  };

  return (
    <div className="space-y-4">
      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        disabled={isLoading}
        className="w-full mt-0"
      >
        <X className="size-4 mr-2" />
        Reset Filters
      </Button>

      <Accordion
        type="single"
        collapsible
        defaultValue="counties"
        className="w-full"
      >
        {/* County Filter */}
        <AccordionItem value="counties">
          <AccordionTrigger className="text-sm font-medium">
            Counties
          </AccordionTrigger>
          <AccordionContent>
            <Popover open={countyOpen} onOpenChange={setCountyOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countyOpen}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {filters.counties.length === counties.length
                    ? "All Counties"
                    : filters.counties.length === 0
                    ? "No Counties"
                    : `${filters.counties.length} counties selected`}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0 z-[9999] bg-white"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search county..." />
                  <CommandList>
                    <CommandEmpty>No county found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-60">
                        {counties.map((county) => (
                          <CommandItem
                            key={county}
                            value={county}
                            onSelect={() => handleCountySelect(county)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Checkbox
                                checked={filters.counties.includes(county)}
                                onCheckedChange={() =>
                                  handleCountySelect(county)
                                }
                              />
                              <span className="flex-1">{county}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </AccordionContent>
        </AccordionItem>

        {/* Year Filter */}
        <AccordionItem value="years">
          <AccordionTrigger className="text-sm font-medium">
            Years
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {years.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={filters.years.includes(year)}
                    onCheckedChange={() => handleYearSelect(year)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={`year-${year}`}
                    className="text-sm cursor-pointer"
                  >
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Severity Filter */}
        <AccordionItem value="severity">
          <AccordionTrigger className="text-sm font-medium">
            Crash Severity
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {severities.map((severity) => (
                <div key={severity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`severity-${severity}`}
                    checked={filters.severities.includes(severity)}
                    onCheckedChange={() => handleSeveritySelect(severity)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={`severity-${severity}`}
                    className="text-sm cursor-pointer"
                  >
                    {severity}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
