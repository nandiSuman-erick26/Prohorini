//
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch } from "../redux/store/rootRedux";
import {
  updateCircleMemberLocation,
  removeCircleMemberLocation,
} from "../redux/redux-slices/userSafetySlice";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useCircleLiveLocations = (currentUserId: string | null) => {
  const dispatch = useAppDispatch();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel("circle-live-locations")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "live_locations",
        },
        (payload) => {
          const data = payload.new as any;

          // 1. Ignore updates from ourselves (we handle self-marker locally)
          if (currentUserId && data.user_id === currentUserId) return;

          // 2. If sharing/SOS is stopped, remove the marker
          if (!data.is_sharing && !data.is_sos_active) {
            dispatch(removeCircleMemberLocation(data.user_id));
            return;
          }

          // 3. Otherwise, update/add the marker
          dispatch(
            updateCircleMemberLocation({
              userId: data.user_id,
              coords: {
                lat: data.latitude,
                lng: data.longitude,
                accuracy: data.accuracy,
                updatedAt: data.updated_at,
              },
              isSharing: data.is_sharing,
              isSosActive: data.is_sos_active,
            }),
          );
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [dispatch, currentUserId]);
};
