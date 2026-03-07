"use client";

import { useState } from "react";
import { useCreateComment } from "@/hooks/react-query/useCreateComment";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import { usePostComments } from "@/hooks/utils/usePostComments";
import { Send, User as UserIcon, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { SkeletonListItem } from "../ui/loaders/SkeletonCard";

const PostComment = ({ postId }: { postId: string }) => {
  const [commentText, setCommentText] = useState("");
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const { data: comments, isLoading } = usePostComments(postId);
  const { mutate: createComment, isPending } = useCreateComment();

  return (
    <div className="space-y-6 pt-6">
      {/* Scrollable Comments Area */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading && (
          <div className="space-y-3">
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </div>
        )}

        {comments?.length === 0 && !isLoading && (
          <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              No intelligence gathered yet
            </p>
          </div>
        )}

        {comments?.map((c: any) => (
          <div key={c.id} className="flex gap-3 group/comment">
            <div className="h-8 w-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0 shadow-sm overflow-hidden">
              {c.users_profile?.photo_url ? (
                <img
                  src={c.users_profile?.photo_url}
                  className="h-full w-full object-cover"
                  alt={c.users_profile?.full_name || "User"}
                />
              ) : (
                <UserIcon size={14} />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-800 capitalize tracking-tight">
                  {c.users_profile?.full_name ||
                    `Citizen #${c.user_id?.slice(-4)}`}
                </span>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  <Clock size={8} />
                  {c.created_at
                    ? formatDistanceToNow(new Date(c.created_at)) + " ago"
                    : "now"}
                </div>
              </div>
              <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm transition-all group-hover/comment:border-slate-200">
                <p className="text-slate-600 text-[13px] font-medium leading-relaxed">
                  {c.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="relative group">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add to the community pulse..."
          className="w-full h-12 pl-5 pr-14 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none shadow-inner"
        />

        <button
          disabled={!commentText || isPending}
          onClick={() => {
            if (!commentText) return;
            createComment({
              postId,
              userId: userProfile?.id!,
              comment: commentText,
            });
            setCommentText("");
          }}
          className="absolute right-1.5 top-1.5 h-9 w-9 bg-zinc-950 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg active:scale-95"
        >
          {isPending ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PostComment;
