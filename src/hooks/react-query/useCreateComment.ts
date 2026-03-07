import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateCommentPayload {
  postId: string;
  userId: string;
  comment: string;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId, comment }: CreateCommentPayload) => {
      const { data, error } = await supabase
        .from("community_comments")
        .insert({
          post_id: postId,
          user_id: userId,
          comment,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: (newComment, variables) => {
      // update feed comment count
      queryClient.setQueriesData(
        { queryKey: ["community-post"] },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any[]) =>
              page.map((post) =>
                post.id === variables.postId
                  ? {
                      ...post,
                      comment_count: post.comment_count + 1,
                    }
                  : post,
              ),
            ),
          };
        },
      );
      //update comment list cache
      queryClient.setQueryData(
        ["post-comments", variables.postId],
        (old: any) => (old ? [...old, newComment] : [newComment]),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["community-post"] });
    },

    // 🔥 Optimistic update
    // onMutate: async ({ postId }) => {
    //   await queryClient.cancelQueries({
    //     queryKey: ["community-posts"]
    //   })

    //   const previousData =
    //     queryClient.getQueryData(["community-posts"])

    //   queryClient.setQueryData(["community-posts"], (old: any) => {
    //     if (!old) return old

    //     return {
    //       ...old,
    //       pages: old.pages.map((page: any[]) =>
    //         page.map((post) =>
    //           post.id === postId
    //             ? {
    //                 ...post,
    //                 comment_count: post.comment_count + 1
    //               }
    //             : post
    //         )
    //       )
    //     }
    //   })

    //   return { previousData }
    // },

    // onError: (_err, _vars, context) => {
    //   queryClient.setQueryData(
    //     ["community-posts"],
    //     context?.previousData
    //   )
    // }
  });
};
