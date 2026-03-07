"use client";

import { useGeoSearch } from "@/lib/react-query/useGeoSearch";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Props } from "@/typeScript/types/global.type";
import { ScrollArea } from "../ui/scroll-area";
import { X, Search, MapPin, Loader2, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LocationSearch = ({ onSelect, onClear }: Props) => {
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 600);
  const { data, isLoading } = useGeoSearch(debounced);
  const boxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleSearchAreaClose = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleSearchAreaClose);
    return () => window.removeEventListener("mousedown", handleSearchAreaClose);
  }, []);

  useEffect(() => {
    if (data) {
      setSelectedIndex(-1);
    }
  }, [data]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !data || data.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const item = data[selectedIndex];
      handleSelect(item);
    }
  };

  const handleSelect = (item: any) => {
    onSelect(Number(item?.lat), Number(item?.lon), item?.display_name);
    setQ(item?.display_name);
    setOpen(false);
  };

  const handleClear = () => {
    setQ("");
    setOpen(false);
    onClear?.();
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative flex items-center group">
        <div className="absolute left-5 z-10 transition-transform group-focus-within:scale-110">
          {isLoading ? (
            <Loader2 size={16} className="text-red-500 animate-spin" />
          ) : (
            <Search
              size={16}
              className="text-zinc-400 group-focus-within:text-red-500 transition-colors"
            />
          )}
        </div>

        <Input
          value={q}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          placeholder="Intel search: Zones, Points, Coords..."
          className="w-full pl-12 pr-12 py-2 rounded-[22px] border border-zinc-200/50 bg-white/95 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-sm font-bold placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:border-red-500/40 transition-all"
        />

        <AnimatePresence>
          {q && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 bg-zinc-100/80 hover:bg-zinc-200 p-2 rounded-full text-zinc-500 hover:text-red-500 transition-all flex items-center justify-center backdrop-blur-md"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && q.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full mt-3 w-[calc(100vw-32px)] md:w-full right-0 md:left-0 bg-white/98 backdrop-blur-3xl rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.18)] border border-zinc-100/50 overflow-hidden z-[10005]"
          >
            <div className="px-4 py-2.5 border-b border-zinc-50 bg-zinc-50/40 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 flex items-center gap-2">
                <Compass size={11} className="text-red-500/60" />
                Live Intel
              </span>
              {isLoading && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">
                    SYNCING...
                  </span>
                </div>
              )}
            </div>

            <ScrollArea className="h-60">
              <div className="p-1.5 space-y-0.5">
                {isLoading && !data && (
                  <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <Loader2
                      size={24}
                      className="animate-spin text-zinc-400 mb-2"
                    />
                    <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500">
                      Retrieving Datapoints...
                    </p>
                  </div>
                )}

                {data?.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "group flex items-center gap-4 w-full text-left px-3.5 py-3 rounded-[16px] transition-all duration-200",
                      selectedIndex === i
                        ? "bg-zinc-900 text-white shadow-xl scale-[1.01]"
                        : "hover:bg-zinc-50 text-zinc-600",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-xl transition-colors",
                        selectedIndex === i ? "bg-white/10" : "bg-zinc-100/80",
                      )}
                    >
                      <MapPin
                        size={15}
                        className={cn(
                          selectedIndex === i
                            ? "text-red-400"
                            : "text-zinc-400",
                        )}
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold truncate">
                        {item.display_name.split(",")[0]}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] truncate opacity-70",
                          selectedIndex === i
                            ? "text-zinc-400"
                            : "text-zinc-500",
                        )}
                      >
                        {item.display_name.split(",").slice(1).join(",").trim()}
                      </span>
                    </div>
                  </button>
                ))}

                {data && data.length === 0 && !isLoading && (
                  <div className="py-12 text-center opacity-50">
                    <Compass size={24} className="mx-auto mb-2 text-zinc-300" />
                    <p className="text-xs font-bold text-zinc-400">
                      Neutral signal. No matching intel.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="px-4 py-2.5 bg-zinc-900/98 backdrop-blur-md flex items-center justify-between">
              <div className="flex gap-1.5 items-center">
                <span className="h-1 w-1 rounded-full bg-red-500" />
                <span className="h-1 w-1 rounded-full bg-yellow-500" />
                <span className="h-1 w-1 rounded-full bg-green-500" />
              </div>
              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">
                ENCRYPTED GEOCONFIG V2.4
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearch;
