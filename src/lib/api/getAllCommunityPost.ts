import { supabase } from "@/lib/supabaseClient";

export const fetchPosts = async () => {
  const { data: post, error } = await supabase
    .from("community_posts")
    .select(
      `
    id, content, image_url, created_at, users_profile(name, photo_url), community_likes(count), community_comments(count)
    `,
    )
    .order("created_at", { ascending: false });
  if (error) throw error;

  return post;
};
