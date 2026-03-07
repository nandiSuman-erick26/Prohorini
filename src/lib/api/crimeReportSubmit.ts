import { SubmitCrimePayload } from "@/typeScript/types/crime";
import { supabase } from "../supabaseClient";

export const submitCrimeReport = async (data: SubmitCrimePayload) => {
  let photoUrl: string | null = null;
  if (data.photo) {
    const filePath = `crime/${Date.now()}-${data.photo.name}`;

    const { error: Upload_error } = await supabase.storage
      .from("crime_evidence")
      .upload(filePath, data?.photo);

    if (Upload_error) throw Upload_error;

    const { data: public_Url } = supabase.storage
      .from("crime_evidence")
      .getPublicUrl(filePath);

    photoUrl = public_Url.publicUrl;
  }

  const { error } = await supabase.from("crime_reports").insert({
    user_id: data.userId,
    type: data.type,
    description: data.description,
    lat: data.lat,
    lng: data.lng,
    photo_url: photoUrl,
    is_anonymous: data.is_anonymous,
    status: "pending",
  });

  if (error) throw error;
};
