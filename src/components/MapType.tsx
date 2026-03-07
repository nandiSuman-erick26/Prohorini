"use client";
import React, { useState } from "react";
import { Maptype } from "@/typeScript/types/redux.type";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { setMapType } from "@/hooks/redux/redux-slices/adminMapSlice";
import {
  Layers,
  Check,
  Map as MapIcon,
  Globe,
  Moon,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAP_OPTIONS: { id: Maptype; label: string; icon: any; color: string }[] =
  [
    {
      id: "street",
      label: "Street",
      icon: MapIcon,
      color: "bg-blue-100 from-blue-400 to-indigo-500",
    },
    {
      id: "satellite",
      label: "Satellite",
      icon: Globe,
      color: "bg-green-100 from-emerald-500 to-teal-700",
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
      color: "bg-zinc-800 from-zinc-700 to-black",
    },
    {
      id: "topo",
      label: "Terrain",
      icon: Activity,
      color: "bg-amber-100 from-orange-300 to-amber-600",
    },
  ];

const MapType = () => {
  const dispatch = useAppDispatch();
  const { mapType } = useAppSelector((state) => state.adminMap);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-9 w-9 md:w-auto md:px-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg border outline-none",
              open
                ? "bg-zinc-900 border-zinc-900 text-white"
                : "bg-white/90 backdrop-blur-md border-zinc-200 text-zinc-600 hover:bg-white",
            )}
          >
            <Layers className="h-4 w-4" />
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-wider">
              Layers
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="left"
          align="start"
          sideOffset={12}
          className="p-2 bg-white/95 backdrop-blur-xl border-zinc-200 shadow-2xl rounded-[18px] w-[220px] grid grid-cols-2 gap-2 z-[1001]"
        >
          <div className="col-span-2 mb-0.5">
            <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
              Map Type
            </h3>
          </div>

          {MAP_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                dispatch(setMapType(option.id));
                setOpen(false);
              }}
              className="flex flex-col gap-1.5 group outline-none"
            >
              <div
                className={cn(
                  "relative h-14 w-full rounded-xl overflow-hidden border-2 transition-all duration-300",
                  mapType === option.id
                    ? "border-blue-500 ring-4 ring-blue-500/10"
                    : "border-transparent group-hover:border-zinc-300",
                )}
              >
                {/* Visual Preview Tile */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-80",
                    option.color,
                  )}
                />

                {/* Abstract Pattern overlay for "Map" feel */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-center bg-fixed scale-50" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <option.icon
                    className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      option.id === "dark" ? "text-white/40" : "text-white/60",
                    )}
                  />
                </div>

                {mapType === option.id && (
                  <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5 shadow-lg">
                    <Check className="h-2 w-2 text-white stroke-[4]" />
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  mapType === option.id ? "text-blue-600" : "text-zinc-500",
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MapType;
