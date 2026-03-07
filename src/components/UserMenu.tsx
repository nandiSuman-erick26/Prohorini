"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";
import { LogOut, Settings, User } from "lucide-react";
// import { useClerk } from "@clerk/nextjs";
// import { useAppSelector } from "@/hooks/redux/store/rootRedux";
// const {}= useAppSelector(state=> state.userProfile)

const UserMenu = ({
  imageUrl,
  handleLogout,
  handleProfileVisit,
  handleSetupVisit,
  isProfileIncomplete,
}: {
  imageUrl?: string | null;
  handleLogout: () => void;
  handleProfileVisit?: () => void;
  handleSetupVisit?: () => void;
  isProfileIncomplete?: boolean;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-full bg-zinc-200/50 animate-pulse border border-zinc-100 dark:border-zinc-800" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={imageUrl || "https://github.com/shadcn.png"}
            alt="@shadcn"
            className="bg-green-600 dark:bg-green-800"
          />
          <AvatarFallback>SA</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 mt-2 rounded-2xl border-zinc-200/50 bg-white/95 backdrop-blur-xl shadow-2xl p-2 z-[10010] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-2 py-2 mb-1">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Account Actions
          </p>
        </div>

        <DropdownMenuItem
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-zinc-600 font-bold text-xs hover:bg-zinc-50 transition-colors focus:bg-zinc-50 outline-none group"
          onClick={handleProfileVisit}
        >
          <div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-white transition-colors">
            <User className="h-3.5 w-3.5" />
          </div>
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-zinc-600 font-bold text-xs hover:bg-zinc-50 transition-colors focus:bg-zinc-50 outline-none group"
          onClick={handleSetupVisit}
        >
          <div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-white transition-colors">
            <Settings className="h-3.5 w-3.5" />
          </div>
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-zinc-200/50" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-600 font-black text-xs hover:bg-red-50 focus:bg-red-50 transition-colors outline-none group"
        >
          <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200/50 transition-colors text-red-600">
            <LogOut className="h-3.5 w-3.5" />
          </div>
          LOGOUT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
