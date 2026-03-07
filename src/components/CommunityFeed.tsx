"use client";

import { useEffect, useRef, useState } from "react";
import { getCommunityPost } from "@/hooks/react-query/useCommunityPost";
import { Spinner } from "./ui/spinner";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleLike } from "@/hooks/react-query/useToggleLike";
import { supabase } from "@/lib/supabaseClient";
import PostComment from "./user-panel/PostComment";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Clock,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import SkeletonCard from "./ui/loaders/SkeletonCard";

const CommunityFeed = ({ targetUserId }: { targetUserId?: string }) => {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const queryClient = useQueryClient();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    getCommunityPost(userProfile?.id!, targetUserId);
  const { mutate: toggleLike } = useToggleLike();
  // console.log("data", data)
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    const channel = supabase
      .channel("community-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_posts",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["community-post"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="space-y-10">
        <SkeletonCard variant="default" lines={3} />
        <SkeletonCard variant="default" lines={2} />
        <SkeletonCard variant="default" lines={4} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {data?.pages.map((page) =>
        page.map((post) => (
          <div
            key={post?.id}
            className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <div className="flex items-start justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden border border-slate-100">
                  {post?.users_profile?.photo_url ? (
                    <img
                      src={post?.users_profile?.photo_url}
                      className="h-full w-full object-cover"
                      alt={post?.users_profile?.full_name || "User"}
                    />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 capitalize tracking-tight">
                    {post?.users_profile?.full_name || "Verified Citizen"}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <Clock size={10} />
                    {post?.created_at
                      ? formatDistanceToNow(new Date(post.created_at)) + " ago"
                      : "Just now"}
                  </div>
                </div>
              </div>
              <button className="h-8 w-8 text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="bg-slate-50/50 rounded-[32px] overflow-hidden border border-slate-100/50 transition-all group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-100/50">
              {post?.content && (
                <div className="p-6">
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                    {post?.content}
                  </p>
                </div>
              )}

              {post?.image_url &&
                post.image_url !== "{}" &&
                post.image_url !== "null" && (
                  <div className="px-2 pb-2">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-full h-auto max-h-[500px] object-cover rounded-[24px] shadow-sm"
                    />
                  </div>
                )}
            </div>

            <div className="mt-4 px-2 space-y-4">
              {/* Engagement Stats & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() =>
                      toggleLike({
                        postId: post.id,
                        userId: userProfile?.id!,
                        isLiked: post.liked_by_user,
                      })
                    }
                    className="flex items-center gap-2 group/btn"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${post.liked_by_user ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 group-hover/btn:bg-red-50 group-hover/btn:text-red-400"}`}
                    >
                      <Heart
                        size={18}
                        fill={post.liked_by_user ? "currentColor" : "none"}
                      />
                    </div>
                    <span
                      className={`text-xs font-black uppercase tracking-widest ${post.liked_by_user ? "text-red-500" : "text-slate-400 group-hover/btn:text-red-400"}`}
                    >
                      {post.like_count}
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedPost(expandedPost === post.id ? null : post.id)
                    }
                    className="flex items-center gap-2 group/btn"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${expandedPost === post.id ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400 group-hover/btn:bg-blue-50 group-hover/btn:text-blue-400"}`}
                    >
                      <MessageCircle size={18} />
                    </div>
                    <span
                      className={`text-xs font-black uppercase tracking-widest ${expandedPost === post.id ? "text-blue-500" : "text-slate-400 group-hover/btn:text-blue-400"}`}
                    >
                      {post.comment_count}
                    </span>
                  </button>
                </div>

                <button className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                  <Share2 size={16} />
                </button>
              </div>

              {/* Comment Section Container */}
              {expandedPost === post.id && (
                <div className="pt-4 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                  <PostComment postId={post?.id} />
                </div>
              )}
            </div>
          </div>
        )),
      )}

      <div ref={loaderRef} className="h-20 flex justify-center items-center">
        {isFetchingNextPage ? (
          <Spinner />
        ) : hasNextPage ? (
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Scrolling deeper...
          </div>
        ) : (
          <div className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">
            You've reached the end of the pulse
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
