"use client";

import BottomNav from "@/components/user-panel/BottomNav";
import UserNavbar from "@/components/user-panel/UserNavbar";
import { MapTargetContext } from "@/hooks/context/mapTargetContext";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const UserLayout = ({ children }: any) => {
  const pathname = usePathname();
  const isMapPage = pathname === "/home";

  const [searchTarget, setSearchTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <MapTargetContext.Provider
      value={{ target: searchTarget, setTarget: setSearchTarget }}
    >
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50">
        {/* Fixed Top Navbar Container */}
        <div className="fixed top-0 left-0 right-0 z-[5000] flex justify-center pt-4 pointer-events-none">
          <div className="pointer-events-auto">
            <UserNavbar />
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div
          className={cn(
            "flex-1 scroll-smooth",
            isMapPage
              ? "overflow-hidden"
              : "overflow-y-auto custom-scrollbar bg-grid-pattern",
          )}
        >
          <main
            className={cn(
              "w-full min-h-full flex flex-col",
              !isMapPage && "pt-32 pb-40 px-4 md:px-0",
            )}
          >
            {typeof children === "function"
              ? children({ searchTarget })
              : children}
          </main>
        </div>

        {/* Fixed Bottom Navbar Container */}
        <div className="fixed bottom-8 left-0 right-0 z-[5000] flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <BottomNav />
          </div>
        </div>
      </div>
    </MapTargetContext.Provider>
  );
};

export default UserLayout;
