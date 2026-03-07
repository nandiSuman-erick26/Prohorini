import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userProfileSchema,
  UserProfileSchema,
} from "@/services/validations/schemas/zod.userProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit2, Loader2, X } from "lucide-react";
import { useProfile } from "@/hooks/react-query/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { setIsEditingProfile } from "@/hooks/redux/redux-slices/userProfileSlice";
import { selectIsEditingProfile } from "@/hooks/redux/store/user/userProfileSelector";

export default function ProfileForm() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const isEditing = useAppSelector(selectIsEditingProfile);

  // If profile doesn't exist (no name), we should be in edit mode by default
  const hasProfileData = !!profile?.full_name;

  useEffect(() => {
    if (!hasProfileData && !profileLoading) {
      dispatch(setIsEditingProfile(true));
    }
  }, [hasProfileData, profileLoading, dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    },
  });

  // Load existing profile data into the form
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UserProfileSchema) => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      dispatch(setIsEditingProfile(false));
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(
        error.message || "An error occurred while updating your profile",
      );
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // If cancelling, reset form to database values
      reset({
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        city: profile?.city || "",
        state: profile?.state || "",
      });
    }
    dispatch(setIsEditingProfile(!isEditing));
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasProfileData && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant={isEditing ? "outline" : "secondary"}
            size="sm"
            onClick={toggleEdit}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            {...register("full_name")}
            placeholder="John Doe"
            disabled={!isEditing}
            className={errors.full_name ? "border-destructive" : ""}
          />
          {errors.full_name && (
            <p className="text-destructive text-sm font-medium">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+1 234 567 890"
            disabled={!isEditing}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-destructive text-sm font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="123 Main St"
            disabled={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="New York"
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register("state")}
              placeholder="NY"
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
