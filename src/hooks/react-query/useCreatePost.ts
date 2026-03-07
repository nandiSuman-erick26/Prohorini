import { supabase } from "@/lib/supabaseClient";
import { CreatePostPayload } from "@/typeScript/types/post.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePost = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      let image_Url: string | null = null;

      if (payload?.image) {
        const filePath = `community/${Date.now()}-${payload?.image.name}`;
        const { error: upload_error } = await supabase.storage
          .from("community_images")
          .upload(filePath, payload?.image);

        if (upload_error) throw upload_error;

        const { data } = await supabase.storage
          .from("community_images")
          .getPublicUrl(filePath);

        image_Url = data?.publicUrl;
      }

      const { error: content_error } = await supabase
        .from("community_posts")
        .insert({
          user_id: payload?.userId,
          content: payload?.content,
          image_url: image_Url,
        });
      if (content_error) throw content_error;
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["community-post"] });
    },
  });
};
