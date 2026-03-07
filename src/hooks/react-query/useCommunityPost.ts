import { supabase } from "@/lib/supabaseClient";
import { useInfiniteQuery } from "@tanstack/react-query";

const limit = 10;
export const getCommunityPost = (userId: string, targetUserId?: string) => {
  return useInfiniteQuery({
    queryKey: ["community-post", targetUserId || "all"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = limit * pageParam;
      const to = from + limit - 1;

      let query = supabase
        .from("community_posts")
        .select(
          `id, content, image_url, user_id, created_at, users_profile(full_name, photo_url)`,
        )
        .order("created_at", { ascending: false });

      if (targetUserId) {
        query = query.eq("user_id", targetUserId);
      }

      const { data: post, error } = await query.range(from, to);

      if (error) throw error;
      if (!post || post.length === 0) return [];
      const postIds = post.map((p) => p.id);
      const { data: likes } = await supabase
        .from("community_likes")
        .select("post_id, user_id")
        .in("post_id", postIds);
      const { data: comments } = await supabase
        .from("community_comments")
        .select("post_id")
        .in("post_id", postIds);
      return post.map((post: any) => {
        const postLikes = likes?.filter((l) => l.post_id === post.id) ?? [];

        const postComments =
          comments?.filter((c) => c.post_id === post.id) ?? [];

        return {
          ...post,
          users_profile: Array.isArray(post.users_profile)
            ? post.users_profile[0]
            : post.users_profile,
          like_count: postLikes.length,
          comment_count: postComments.length,
          liked_by_user: postLikes.some((l) => l.user_id === userId),
        };
      });
    },
    getNextPageParam: (lastpage, allpages) => {
      if (lastpage.length === 0) return undefined;
      return allpages.length;
    },
    initialPageParam: 0,
  });
};
