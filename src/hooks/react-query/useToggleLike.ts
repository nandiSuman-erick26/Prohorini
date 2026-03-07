import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleLike = () => {
  const likeQry = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      userId,
      isLiked,
    }: {
      postId: string;
      userId: string;
      isLiked: boolean;
    }) => {
      if (isLiked) {
        return supabase
          .from("community_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
      } else {
        return supabase
          .from("community_likes")
          .insert({ post_id: postId, user_id: userId });
      }
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await likeQry.cancelQueries({ queryKey: ["community-post"] });

      // Snapshot the previous value
      const previousData = likeQry.getQueriesData({
        queryKey: ["community-post"],
      });

      // Optimistically update to the new value
      likeQry.setQueriesData({ queryKey: ["community-post"] }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any[]) =>
            page.map((post) =>
              post.id === variables.postId
                ? {
                    ...post,
                    like_count: variables.isLiked
                      ? post.like_count - 1
                      : post.like_count + 1,
                    liked_by_user: !variables.isLiked,
                  }
                : post,
            ),
          ),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          likeQry.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Invalidate the cache to ensure we have the correct data from the server
      likeQry.invalidateQueries({ queryKey: ["community-post"] });
    },
  });
};
