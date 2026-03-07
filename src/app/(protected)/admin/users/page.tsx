"use client";

import { getAlluserProfiles } from "@/lib/api/getAllUsers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BadgeAlert, BadgeCheck, X, ShieldCheck, UserCog } from "lucide-react";
import { verifyUser, toggleUserActive } from "@/services/api/adminUsers.api";
import { toast } from "sonner";
import { useProfile } from "@/hooks/react-query/useProfile";

const UsersControlPage = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["getting-user-details"],
    queryFn: getAlluserProfiles,
  });

  const { data: currentProfile } = useProfile();
  const currentRole = currentProfile?.role;

  const verifyMutation = useMutation({
    mutationFn: ({ clerkId, status }: { clerkId: string; status: boolean }) =>
      verifyUser(clerkId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getting-user-details"] });
      toast.success("User verification status updated");
    },
    onError: () => toast.error("Failed to update verification status"),
  });

  const activeMutation = useMutation({
    mutationFn: ({ clerkId, status }: { clerkId: string; status: boolean }) =>
      toggleUserActive(clerkId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getting-user-details"] });
      toast.success("User active status updated");
    },
    onError: () => toast.error("Failed to update active status"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            User Management
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Moderate roles, verify identities, and manage access.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-b-2 border-slate-100">
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest px-6 py-4">
                User Details
              </TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest px-6 py-4">
                Phone
              </TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest px-6 py-4">
                Role
              </TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest px-6 py-4 text-center">
                Identity
              </TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest px-6 py-4 text-center">
                Status
              </TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest px-6 py-4 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.map((i: any) => (
              <TableRow
                key={i.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm tracking-tight">
                      {i?.full_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      {i?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 font-bold text-slate-500 text-xs">
                  {i?.phone ?? "NOT LINKED"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      i.role === "ADMIN" || i.role === "SUPER_ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {i?.role}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 border-2",
                        i?.is_verified
                          ? "bg-green-50 border-green-100 text-green-700"
                          : "bg-orange-50 border-orange-100 text-orange-700",
                      )}
                    >
                      {i?.is_verified ? (
                        <BadgeCheck size={12} />
                      ) : (
                        <BadgeAlert size={12} />
                      )}
                      {i?.is_verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 border-2",
                        i?.is_active
                          ? "bg-blue-50 border-blue-100 text-blue-700"
                          : "bg-red-50 border-red-100 text-red-700",
                      )}
                    >
                      {i?.is_active ? (
                        <BadgeCheck size={12} />
                      ) : (
                        <X size={12} />
                      )}
                      {i?.is_active ? "Active" : "Banned"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Permission Check: ADMIN can only manage USER role. SUPER_ADMIN can manage regardless of role but cant edit themselves */}
                    {((currentRole === "SUPER_ADMIN" &&
                      i.clerk_id !== currentProfile?.clerk_id) ||
                      (currentRole === "ADMIN" && i.role === "USER")) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            activeMutation.mutate({
                              clerkId: i.clerk_id,
                              status: !i.is_active,
                            })
                          }
                          disabled={activeMutation.isPending}
                          className={cn(
                            "rounded-xl font-black text-[10px] uppercase h-8 px-4 transition-all",
                            i.is_active
                              ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              : "bg-blue-600 text-white hover:bg-blue-700 border-none",
                          )}
                        >
                          <UserCog size={12} className="mr-1.5" />
                          {i.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        {!i.is_verified && (
                          <Button
                            size="sm"
                            onClick={() =>
                              verifyMutation.mutate({
                                clerkId: i.clerk_id,
                                status: true,
                              })
                            }
                            disabled={verifyMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase h-8 px-4 rounded-xl border-none shadow-md shadow-green-100"
                          >
                            <ShieldCheck size={12} className="mr-1.5" />
                            Verify
                          </Button>
                        )}
                      </div>
                    )}
                    {/* Forbidden State */}
                    {!(
                      currentRole === "SUPER_ADMIN" ||
                      (currentRole === "ADMIN" && i.role === "USER")
                    ) && (
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">
                        Only Super-admin
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersControlPage;
