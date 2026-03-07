"use client";

import React from "react";
import {
  Filter,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapFiltersProps {
  category: string;
  setCategory: (val: string) => void;
  year: number;
  setYear: (val: number) => void;
  severity: string;
  setSeverity: (val: string) => void;
  radiusKm: number;
  setRadiusKm: (val: number) => void;
  onClear: () => void;
}

export const MapFilters = ({
  category,
  setCategory,
  year,
  setYear,
  severity,
  setSeverity,
  radiusKm,
  setRadiusKm,
  onClear,
}: MapFiltersProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center gap-2">
      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-zinc-200 text-xs gap-2 rounded-full h-9"
          >
            <Filter className="h-3.5 w-3.5" />
            {category === "all"
              ? "All Crime Types"
              : category.replace(/_/g, " ").toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md border-zinc-200">
          <DropdownMenuLabel>Crime Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
            <DropdownMenuRadioItem value="all">
              All Crimes
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="sexual_crime">
              Sexual Crimes
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="violent_assault">
              Violent & Assault
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="drug_related">
              Drug Related
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="property_crime">
              Property Crime
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Year Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-zinc-200 text-xs gap-2 rounded-full h-9"
          >
            <Calendar className="h-3.5 w-3.5" />
            {year}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 bg-white/95 backdrop-blur-md border-zinc-200">
          <DropdownMenuLabel>Analysis Year</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            {years.map((y) => (
              <DropdownMenuRadioItem key={y} value={String(y)}>
                {y}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Radius (Near Me) Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "bg-white/90 backdrop-blur-sm border-zinc-200 text-xs gap-2 rounded-full h-9 transition-colors",
              radiusKm > 0 && "border-blue-200 text-blue-600 bg-blue-50/50",
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            {radiusKm === 0 ? "Global" : `Within ${radiusKm}km`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-md border-zinc-200">
          <DropdownMenuLabel>Search Area</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={String(radiusKm)}
            onValueChange={(v) => setRadiusKm(Number(v))}
          >
            <DropdownMenuRadioItem value="0">
              Global (No Limit)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1">1 km radius</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2">2 km radius</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="5">5 km radius</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="10">
              10 km radius
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Severity Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-zinc-200 text-xs gap-2 rounded-full h-9"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {severity === "all" ? "Min. Severity" : `Severity: ${severity}+`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-md border-zinc-200">
          <DropdownMenuLabel>Intensity Threshold</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={severity} onValueChange={setSeverity}>
            <DropdownMenuRadioItem value="all">
              All Intensities
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="3">
              Moderate (3+)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="4">High (4+)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="5">
              Critical (5)
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Button */}
      {(category !== "all" || severity !== "all" || radiusKm > 0) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-zinc-500 hover:text-red-500 text-xs gap-1 h-9"
        >
          Reset
        </Button>
      )}
    </div>
  );
};
