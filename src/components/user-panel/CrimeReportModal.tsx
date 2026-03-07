"use client";
import { useEffect, useState } from "react";
import { convertToWebP } from "@/utils/convertToWebP";
import {
  MapPin,
  Camera,
  ShieldAlert,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { crimeReportSchema } from "@/schemas/crimeReportSchema"
import { useSubmitCrimeReport } from "@/hooks/react-query/useSubmitCrimeReport";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  CrimeReportSchema,
  crimeReportSchema,
} from "@/services/validations/schemas/zod.crimeReport";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CrimeReportModal = ({ isOpen, onClose }: Props) => {
  const { mutateAsync, isPending } = useSubmitCrimeReport();
  const user = useAppSelector((state) => state.userProfile.userProfile);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CrimeReportSchema>({
    resolver: zodResolver(crimeReportSchema),
    defaultValues: {
      is_anonymous: false,
    },
  });

  const photoFile = watch("photo");

  useEffect(() => {
    if (photoFile && photoFile instanceof FileList && photoFile.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(photoFile[0]);
    } else {
      setPhotoPreview(null);
    }
  }, [photoFile]);

  const handleGetLocation = () => {
    setLocationLoading(true);

    const onSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
      setValue("latitude", latitude);
      setValue("longitude", longitude);
      toast.success("Location captured successfully");
      setLocationLoading(false);
    };

    const onFallback = () => {
      // Fast fallback: use network/WiFi location (less accurate but instant)
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        () => {
          toast.error("Failed to fetch location. Please enable GPS.");
          setLocationLoading(false);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
      );
    };

    // Phase 1: Try high-accuracy GPS with a short timeout
    navigator.geolocation.getCurrentPosition(onSuccess, onFallback, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000,
    });
  };

  const onSubmit = async (data: CrimeReportSchema) => {
    console.log("🚀 Submitting Incident Report...", data);
    const lastTime = localStorage.getItem("lastCrimeReport");

    if (lastTime && Date.now() - Number(lastTime) < 120000) {
      toast.warning("Please wait 2 minutes between reports.");
      return;
    }

    try {
      // Extract the file if it's in a FileList
      let photoToUpload: File | undefined = undefined;
      if (data.photo instanceof FileList && data.photo.length > 0) {
        photoToUpload = data.photo[0];
      } else if (data.photo instanceof File) {
        photoToUpload = data.photo;
      }

      // Convert to WebP before uploading to reduce file size
      if (photoToUpload) {
        try {
          photoToUpload = await convertToWebP(photoToUpload);
        } catch (conversionError) {
          console.warn(
            "WebP conversion failed, uploading original:",
            conversionError,
          );
        }
      }

      console.log(
        "📸 Evidence to upload:",
        photoToUpload
          ? `${photoToUpload.name} (${(photoToUpload.size / 1024).toFixed(0)}KB)`
          : "None",
      );

      await mutateAsync({
        userId: user?.id ?? null,
        type: data.type,
        description: data.description,
        lat: data.latitude,
        lng: data.longitude,
        is_anonymous: data.is_anonymous,
        photo: photoToUpload,
      });

      console.log("✅ Submission Successful!");
      localStorage.setItem("lastCrimeReport", Date.now().toString());
      toast.success("Report submitted successfully");
      reset();
      setLocation(null);
      setPhotoPreview(null);
      onClose();
    } catch (error) {
      console.error("❌ Submission failed:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92%] max-w-lg bg-zinc-950/95 backdrop-blur-2xl border-zinc-800 rounded-[32px] p-0 overflow-hidden shadow-2xl z-[10010] flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="bg-red-600/10 border-b border-red-600/20 px-6 py-5 shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-500 font-black text-lg uppercase tracking-tight">
              <ShieldAlert className="h-6 w-6" />
              Report Incident
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs font-bold leading-relaxed mt-1">
              Provide as much detail as possible. Your reports help keep the
              community safe.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-6 space-y-6"
          >
            {/* Hidden Location Fields for Validation */}
            <input
              type="hidden"
              {...register("latitude", { valueAsNumber: true })}
            />
            <input
              type="hidden"
              {...register("longitude", { valueAsNumber: true })}
            />

            <div className="grid grid-cols-1 gap-6">
              {/* Incident Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Incident Type
                </label>
                <select
                  {...register("type")}
                  className="w-full h-11 bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-semibold rounded-2xl px-4 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all appearance-none"
                >
                  <option value="">Select Type...</option>
                  <option value="harassment">⚠️ Harassment</option>
                  <option value="theft">🥷 Theft / Robbery</option>
                  <option value="stalking">👁️ Stalking</option>
                  <option value="assault">👊 Assault</option>
                  <option value="domestic_violence">
                    🏠 Domestic Violence
                  </option>
                  <option value="kidnapping">🚨 Kidnapping</option>
                  <option value="other">❓ Other</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-[10px] font-black uppercase ml-1">
                    Type is required
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Description
              </label>
              <Textarea
                {...register("description")}
                placeholder="Provide a brief description of what happened..."
                className="min-h-[120px] bg-zinc-900 border-zinc-800 text-zinc-200 text-sm font-medium rounded-2xl p-4 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] font-black uppercase ml-1">
                  Minimum 10 characters required
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Evidence (Photo)
              </label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={cn(
                    "flex flex-col items-center justify-center h-40 w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                    photoPreview
                      ? "border-red-500/50"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 group",
                  )}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                        <Camera className="h-6 w-6 text-zinc-400 group-hover:text-zinc-300" />
                      </div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
                        Click to Upload Photo
                      </span>
                    </div>
                  )}
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("photo", null as any);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors backdrop-blur-sm shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Actions Cluster */}
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 shadow-inner">
                <label className="flex items-start gap-3 cursor-pointer group flex-1">
                  <input
                    type="checkbox"
                    {...register("is_anonymous")}
                    className="mt-1 h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-950"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">
                      Anonymous
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">
                      Identity hidden
                    </span>
                  </div>
                </label>

                <div className="h-8 w-px bg-zinc-800" />

                {/* Compact Location Toggle */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                      location
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 rotate-0"
                        : "bg-zinc-800 text-zinc-500 hover:text-zinc-300 -rotate-12 hover:rotate-0",
                      locationLoading && "animate-pulse opacity-50",
                    )}
                  >
                    {locationLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </button>
                  <span
                    className={cn(
                      "text-[8px] font-black uppercase tracking-tighter",
                      location ? "text-emerald-500" : "text-zinc-600",
                    )}
                  >
                    {location ? "SET" : "GPS"}
                  </span>
                </div>
              </div>

              {(errors.latitude || errors.longitude) && (
                <p className="text-red-500 text-[10px] font-black uppercase text-center -mt-4">
                  Critical: Pin Location Required
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-900/20 border-none transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrimeReportModal;
