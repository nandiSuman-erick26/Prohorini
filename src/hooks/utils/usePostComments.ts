import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_comments")
        .select("*, users_profile(full_name, photo_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (
        data?.map((comment: any) => ({
          ...comment,
          users_profile: Array.isArray(comment.users_profile)
            ? comment.users_profile[0]
            : comment.users_profile,
        })) || []
      );
    },
    enabled: !!postId,
  });
};
