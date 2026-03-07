import { convertToWebP } from "@/utils/convertToWebP";
import { useRef } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/react-query/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  setIsUploadingPhoto,
  setPhotoPreviewUrl,
} from "@/hooks/redux/redux-slices/userProfileSlice";
import {
  selectIsUploadingPhoto,
  selectPhotoPreviewUrl,
} from "@/hooks/redux/store/user/userProfileSelector";

const ProfilePhotoUploader = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsUploadingPhoto);
  const preview = useAppSelector(selectPhotoPreviewUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userData } = useProfile();
  console.log("userdata", userData);

  const queryClient = useQueryClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(setPhotoPreviewUrl(reader.result as string));
    };
    reader.readAsDataURL(file);

    dispatch(setIsUploadingPhoto(true));

    try {
      // Convert to WebP before uploading to reduce file size
      let fileToUpload: File = file;
      try {
        fileToUpload = await convertToWebP(file);
      } catch (conversionError) {
        console.warn(
          "WebP conversion failed, uploading original:",
          conversionError,
        );
      }

      const formData = new FormData();
      formData.append("profile-photo", fileToUpload);
      const res = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to upload profile picture:", errorData);
        toast.error(`Failed to upload: ${errorData.error || "Unknown error"}`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        toast.success("Profile picture uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      dispatch(setIsUploadingPhoto(false));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative group">
        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
          <AvatarImage
            src={preview || userData?.photo_url || null}
            alt="Profile"
            // onLoadingStatusChange={(status) => {
            //   if (status === "error") {
            //     console.error(
            //       "Failed to load profile photo from URL:",
            //       preview || userData?.photo_url,
            //     );
            //   }
            // }}
          />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold uppercase">
            {userData?.full_name?.substring(0, 2) || "PF"}
          </AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full shadow-lg border-2 border-background hover:scale-110 transition-transform"
          onClick={triggerFileInput}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
      />

      <div className="text-center">
        <h3 className="text-lg font-semibold">Profile Photo</h3>
        <p className="text-sm text-muted-foreground">
          Click the camera icon to update your photo.
        </p>
      </div>
    </div>
  );
};

export default ProfilePhotoUploader;
