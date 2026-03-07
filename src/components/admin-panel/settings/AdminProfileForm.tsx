"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Shield,
  Camera,
  Loader2,
  Save,
  UserCheck,
} from "lucide-react";
import { useProfile } from "@/hooks/react-query/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/redux/store/rootRedux";
import { setProfile } from "@/hooks/redux/redux-slices/profile/adminSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  userProfileSchema,
  UserProfileSchema,
} from "@/services/validations/schemas/zod.userProfile";

const AdminProfileForm = () => {
  const { data: profile, isLoading: isFetching } = useProfile();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
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

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
      });
      dispatch(setProfile(profile));
    }
  }, [profile, reset, dispatch]);

  const onSubmit = async (data: UserProfileSchema) => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while updating your profile",
      );
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profile-photo", file);

    try {
      const res = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile photo updated");
    } catch (error: any) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
          Fetching profile details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border-2 border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
        {/* Header/Cover Section */}
        <div className="relative h-32 bg-zinc-950 px-8 flex items-end">
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={10} className="text-red-400" />
              {profile?.role || "ADMIN"} ACCESS
            </span>
          </div>

          <div className="translate-y-12 flex items-end gap-6 mb-4">
            <div className="relative group">
              <div className="h-24 w-24 bg-white rounded-3xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                {profile?.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-zinc-200" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 h-8 w-8 bg-red-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Camera size={12} />
                )}
              </button>
            </div>

            <div className="pb-2">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase p-2">
                {profile?.full_name || "New Admin"}
              </h2>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Mail size={12} className="text-red-400" />
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                Account Information
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium">
                Manage your personal and contact details
              </p>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="h-9 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-widest rounded-xl border-none shadow-lg shadow-zinc-200"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  className="h-9 px-6 text-zinc-500 font-black text-[11px] uppercase tracking-widest rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || !isDirty}
                  className="h-9 px-6 bg-red-500 hover:bg-red-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl border-none shadow-lg shadow-red-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <User size={12} className="text-red-500" />
                  Full Name
                </Label>
                <Input
                  {...register("full_name")}
                  disabled={!isEditing}
                  placeholder="Your full name"
                  className="h-11 rounded-xl border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:border-red-200 focus:ring-red-200 transition-all"
                />
                {errors.full_name && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={12} className="text-red-500" />
                  Phone Number
                </Label>
                <Input
                  {...register("phone")}
                  disabled={!isEditing}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-11 rounded-xl border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:border-red-200 focus:ring-red-200 transition-all"
                />
                {errors.phone && (
                  <p className="text-[10px] font-bold text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin size={12} className="text-red-500" />
                  Office / Home Address
                </Label>
                <Input
                  {...register("address")}
                  disabled={!isEditing}
                  placeholder="123, Admin Street, City"
                  className="h-11 rounded-xl border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:border-red-200 focus:ring-red-200 transition-all"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Building size={12} className="text-red-500" />
                  City
                </Label>
                <Input
                  {...register("city")}
                  disabled={!isEditing}
                  placeholder="e.g. Kolkata"
                  className="h-11 rounded-xl border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:border-red-200 focus:ring-red-200 transition-all"
                />
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Globe size={12} className="text-red-500" />
                  State
                </Label>
                <Input
                  {...register("state")}
                  disabled={!isEditing}
                  placeholder="e.g. West Bengal"
                  className="h-11 rounded-xl border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:border-red-200 focus:ring-red-200 transition-all"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 border-t border-zinc-50">
                <div className="bg-zinc-50 rounded-2xl p-4 flex items-center gap-4 border border-zinc-100">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-zinc-400 shadow-sm border border-zinc-100">
                    <Shield size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-zinc-900 uppercase">
                      Verification Notice
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      Changing your critical details might require
                      re-verification or log entry in the security audit trail.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Security Activity (Read-only) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-zinc-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <UserCheck size={20} />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">
                Account Status
              </h4>
              <p className="text-[10px] text-emerald-600 font-bold uppercase">
                Active & Secure
              </p>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
            Your account is currently under active monitoring. Your role permits
            access to SOS controls, user verification, and infrastructure
            management.
          </p>
        </div>

        <div className="bg-white border-2 border-zinc-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">
                Security ID
              </h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">
                {profile?.clerk_id?.slice(0, 16)}...
              </p>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
            This is your unique security identifier. Do not share your
            credentials or this ID with unauthorized personnel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileForm;
