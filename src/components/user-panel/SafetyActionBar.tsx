"use client";

import React from "react";
import {
  Radar,
  Shield,
  ShieldAlert,
  Wifi,
  WifiOff,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  startSharingSession,
  stopSharingSession,
  triggerSos,
  clearSos,
  toggleSmartGeofencing,
} from "@/hooks/redux/redux-slices/userSafetySlice";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SafetyActionBar = () => {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = React.useState(false);
  const { sharingSession, safetyStatus, smartGeofencingEnabled } =
    useAppSelector((state) => state.userSafty);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggleSharing = (durationMins: number) => {
    if (sharingSession.active && durationMins === -1) {
      dispatch(stopSharingSession());
    } else if (!sharingSession.active) {
      const now = new Date();
      let expires = null;

      if (durationMins > 0) {
        expires = new Date(now.getTime() + durationMins * 60 * 1000);
      }

      dispatch(
        startSharingSession({
          startedAt: now.toISOString(),
          expiresAt: expires ? expires.toISOString() : null,
        }),
      );
    }
  };

  const durations = [
    { label: "15 Mins", value: 15 },
    { label: "30 Mins", value: 30 },
    { label: "1 Hour", value: 60 },
    { label: "Never", value: 0 },
  ];

  const handleToggleSos = () => {
    if (safetyStatus === "sos") {
      dispatch(clearSos());
    } else {
      dispatch(triggerSos());
    }
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 flex flex-row gap-3 items-center z-[1000]">
      {/* Smart Geofencing Toggle */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1 pr-4 rounded-full shadow-lg border border-zinc-200">
        <Button
          onClick={() => dispatch(toggleSmartGeofencing())}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full transition-colors",
            smartGeofencingEnabled
              ? "bg-yellow-100 text-yellow-600"
              : "bg-zinc-100 text-zinc-400",
          )}
        >
          <Radar
            className={cn("h-5 w-5", !smartGeofencingEnabled && "opacity-50")}
          />
        </Button>
        <div className="flex flex-col">
          {/* <span className="text-[10px] uppercase font-bold text-zinc-500 leading-none">
            Smart Alerts
          </span> */}
          <span className="text-[10px] font-bold text-zinc-400">
            {smartGeofencingEnabled ? "Active" : "Disabled"}
          </span>
        </div>
      </div>

      {/* SOS Button */}
      <Button
        onClick={handleToggleSos}
        className={cn(
          "h-12 w-12 rounded-full shadow-2xl transition-all duration-300 border-4",
          safetyStatus === "sos"
            ? "bg-red-600 hover:bg-red-700 animate-pulse border-white"
            : "bg-zinc-900 hover:bg-zinc-800 border-red-500/50",
        )}
      >
        {safetyStatus === "sos" ? (
          <ShieldAlert className="h-8 w-8 text-white" />
        ) : (
          <Shield className="h-8 w-8 text-red-500" />
        )}
      </Button>

      {/* Sharing Toggle - Hidden in SOS mode to avoid confusion */}
      {safetyStatus !== "sos" && (
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm pl-1 pr-3 rounded-full shadow-lg border border-zinc-200">
          {sharingSession.active ? (
            <Button
              onClick={() => handleToggleSharing(-1)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            >
              <Wifi className="h-5 w-5" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-400 hover:bg-zinc-200 transition-colors"
                >
                  <WifiOff className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white/95 backdrop-blur-md rounded-2xl border-zinc-100 shadow-2xl p-2 z-[1001]"
              >
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1">
                  Share Duration
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100" />
                {durations.map((d) => (
                  <DropdownMenuItem
                    key={d.value}
                    onClick={() => handleToggleSharing(d.value)}
                    className="rounded-xl focus:bg-zinc-50 cursor-pointer py-2"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-bold text-zinc-700">
                        {d.label}
                      </span>
                      <Clock className="h-3 w-3 text-zinc-400" />
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="flex flex-col ml-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 leading-none">
              {sharingSession.active ? "Sharing Live" : "Private"}
            </span>
            {mounted && sharingSession.active && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <Clock className="h-3 w-3" />
                <span>
                  {sharingSession.expiresAt
                    ? new Date(sharingSession.expiresAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )
                    : "Infinite"}
                </span>
              </div>
            )}
          </div>

          {!sharingSession.active && (
            <ChevronDown className="h-3 w-3 text-zinc-400 ml-1" />
          )}
        </div>
      )}
    </div>
  );
};
