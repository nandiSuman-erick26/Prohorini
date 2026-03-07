import { Pos } from "@/typeScript/types/global.type";
import { createContext, useContext } from "react";

export const MapTargetContext = createContext<{
  target: Pos | null;
  setTarget: (p: Pos | null) => void;
} | null>(null);

export const useMapTarget = () => {
  const ctx = useContext(MapTargetContext);
  if (!ctx)
    throw new Error(
      "useMapTarget must be used within a MapTargetContextProvider or MapTargetContext missing",
    );
  return ctx;
};
