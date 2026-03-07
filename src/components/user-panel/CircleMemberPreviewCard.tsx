import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  setEditingContactId,
  setDeletingContactId,
} from "@/hooks/redux/redux-slices/userProfileSlice";
import { selectDeletingContactId } from "@/hooks/redux/store/user/userProfileSelector";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  phone?: string;
  relationship?: string;
  allowLocation?: boolean;
  notify_on_denger?: boolean;
}

interface Props {
  members: Member[];
}

const CircleMemberPreviewCard = ({ members }: Props) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const deletingId = useAppSelector(selectDeletingContactId);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    dispatch(setDeletingContactId(id));
    try {
      const res = await fetch(`/api/emergency-contacts?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete contact");

      await queryClient.invalidateQueries({ queryKey: ["circle-contacts"] });
      toast.success("Contact deleted");
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      dispatch(setDeletingContactId(null));
    }
  };

  const toggleNotify = async (id: string, currentState: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/emergency-contacts?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notify_on_denger: !currentState }),
      });

      if (!res.ok) throw new Error("Failed to update notification settings");

      await queryClient.invalidateQueries({ queryKey: ["circle-contacts"] });
    } catch (error: any) {
      console.error("Error toggling notification:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Safety Circle
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Recent contacts
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5"
          >
            Manage
          </Button>
        </div>

        <div className="p-5">
          {members.length === 0 ? (
            <div className="py-4 text-center space-y-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                No circle members yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center group/item relative"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 group-hover/item:text-slate-900 transition-colors line-clamp-1">
                        {member.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
                        {member.relationship || "Contact"}
                      </span>
                    </div>
                  </div>

                  {/* Settings Toggle */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          member.notify_on_denger
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {member.notify_on_denger ? "Active" : "Inactive"}
                      </span>
                      {togglingId === member.id ? (
                        <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                      ) : (
                        <Switch
                          checked={member.notify_on_denger || false}
                          onCheckedChange={() =>
                            toggleNotify(member.id, !!member.notify_on_denger)
                          }
                          className="scale-75 data-[state=checked]:bg-emerald-500"
                        />
                      )}
                    </div>

                    {/* Actions on Hover */}
                    <div className="hidden group-hover/item:flex items-center gap-1 bg-white/80 backdrop-blur-sm pl-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-primary hover:bg-primary/5"
                        onClick={() => {
                          dispatch(setEditingContactId(member.id));
                          window.scrollTo({
                            top:
                              document.getElementById("emergency-form")
                                ?.offsetTop || 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => deleteContact(member.id)}
                        disabled={deletingId === member.id}
                      >
                        {deletingId === member.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {members.length > 5 && (
                <p className="text-[10px] text-center text-slate-400 font-medium pt-2 border-t border-slate-50">
                  + {members.length - 5} more members
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CircleMemberPreviewCard;
