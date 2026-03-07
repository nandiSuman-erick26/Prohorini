import { fetchUserProfile } from "@/lib/api/getProfile";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const { user, isLoaded } = useUser();

  return useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => await fetchUserProfile(user!.id),
    enabled: isLoaded && !!user,
  });
};
