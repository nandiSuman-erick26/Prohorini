"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useProfile } from "@/hooks/react-query/useProfile";
import { useAppDispatch } from "@/hooks/redux/store/rootRedux";
import { setUserProfile } from "@/hooks/redux/redux-slices/userProfileSlice";

const LiveMap = dynamic(() => import("@/components/user-panel/LiveMap"), {
  ssr: false,
});

const Home = () => {
  const { data: profile } = useProfile();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profile) {
      dispatch(setUserProfile(profile));
    }
  }, [profile, dispatch]);

  return (
    <div className="relative h-screen w-screen">
      <LiveMap />
    </div>
  );
};

export default Home;
