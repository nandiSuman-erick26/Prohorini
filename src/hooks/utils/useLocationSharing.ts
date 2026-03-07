//
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "../redux/store/rootRedux";
import {
  updateSelfCoords,
  stopSharingSession,
} from "../redux/redux-slices/userSafetySlice";

export const useLocationSharing = (userId: string | null) => {
  const dispatch = useAppDispatch();

  const { sharingSession, safetyStatus } = useAppSelector(
    (state) => state.userSafty,
  );

  const watchRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);

  // Debug: log what userId we received
  // useEffect(() => {
  //   console.log("[useLocationSharing] userId:", userId);
  //   console.log(
  //     "[useLocationSharing] sharingSession.active:",
  //     sharingSession.active,
  //   );
  //   console.log("[useLocationSharing] safetyStatus:", safetyStatus);
  // }, [userId, sharingSession.active, safetyStatus]);

  useEffect(() => {
    // We always want to track position for the local map display,
    // regardless of whether we are 'sharing' with the circle.

    // Clean up previous watcher
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const nowIso = new Date().toISOString();

        dispatch(
          updateSelfCoords({
            lat: latitude,
            lng: longitude,
            accuracy,
            updatedAt: nowIso,
          }),
        );

        const now = Date.now();
        const interval = safetyStatus === "sos" ? 4000 : 10000;

        // Only upload to database if:
        // 1. We have a userId
        // 2. Interval has passed
        // 3. Sharing is ACTIVE OR SOS is ACTIVE
        if (
          userId &&
          now - lastSentRef.current >= interval &&
          (sharingSession.active || safetyStatus === "sos")
        ) {
          // console.log("[useLocationSharing] Upserting to DB...", 
          //   {
          //   user_id: userId,
          //   latitude,
          //   longitude,
          // });

          const { error } = await supabase.from("live_locations").upsert({
            user_id: userId,
            latitude,
            longitude,
            accuracy,
            is_sharing: sharingSession.active,
            is_sos_active: safetyStatus === "sos",
            updated_at: nowIso,
          });

          if (error) {
            console.error("[useLocationSharing] Supabase upsert error:", error);
          }
          //  else {
          //   console.log("[useLocationSharing] Upsert SUCCESS");
          // }

          lastSentRef.current = now;
        }
      },
      (error) => {
        console.log("[useLocationSharing] Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, [userId, sharingSession.active, safetyStatus, dispatch]);

  // 🚨 AUTO-EXPIRY LOGIC:
  // If sharing is active and has an expiry time, set a timer to automatically stop it.
  useEffect(() => {
    if (sharingSession.active && sharingSession.expiresAt) {
      const expiryDate = new Date(sharingSession.expiresAt).getTime();
      const now = Date.now();
      const timeLeft = expiryDate - now;

      if (timeLeft <= 0) {
        // Already expired
        dispatch(stopSharingSession());
        return;
      }

      // console.log(
      //   `[useLocationSharing] Auto-expiry set for ${timeLeft / 1000}s from now.`,
      // );
      const timer = setTimeout(() => {
        // console.log(
        //   "[useLocationSharing] SESSION EXPIRED. Stopping sharing...",
        // );
        dispatch(stopSharingSession());
      }, timeLeft);

      return () => clearTimeout(timer);
    }
  }, [sharingSession.active, sharingSession.expiresAt, dispatch]);

  // 🚨 FINAL UPDATE LOGIC:
  // When sharing/SOS is turned OFF, send one last update to DB so others see it's over.
  useEffect(() => {
    if (!userId) return;

    if (!sharingSession.active && safetyStatus !== "sos") {
      const sendFinalUpdate = async () => {
        // We need current coords to send a valid final update
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (pos) => {
          // console.log("[useLocationSharing] Sending FINAL OFF update to DB...");
          await supabase.from("live_locations").upsert({
            user_id: userId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            is_sharing: false,
            is_sos_active: false,
            updated_at: new Date().toISOString(),
          });
        });
      };
      sendFinalUpdate();
    }
  }, [sharingSession.active, safetyStatus, userId]);
};
