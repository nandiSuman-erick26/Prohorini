"use client";

import {
  User,
  Phone,
  Map,
  Clapperboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
const sideAction = [
  { name: "Home", icon: <Clapperboard size={18} />, link: "/dashboard" },
  { name: "Map", icon: <Map size={18} />, link: "/home" },
  { name: "Contacts", icon: <Phone size={18} />, link: "/emergency-contacts" },
  { name: "Profile", icon: <User size={18} />, link: "/profile" },
];
const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="h-14 border bg-yellow-50 border-yellow-100 flex justify-around items-center w-[350px] md:w-[500px] rounded-full shadow-2xl px-2">
      {sideAction.map((item, index) => {
        const active = pathname === item?.link;
        return (
          <div key={index} className="flex items-center p-1 cursor-pointer">
            <button
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300",
                active
                  ? "bg-yellow-300 text-yellow-900 shadow-md scale-110"
                  : "text-zinc-500 hover:bg-yellow-100/50",
              )}
              onClick={() => router.push(item.link || "#")}
            >
              {item.icon}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
