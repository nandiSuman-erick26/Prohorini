"use client";

import { useEffect, useState } from "react";
import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";

export default function Loading() {
  const [show, setShow] = useState(true);

  // We keep this component mounted for at least 1.5 seconds
  // to let the user appreciate the tactical animation
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real Next.js loading.tsx, the framework will unmount this
      // when the page is ready. This state is just a safety measure.
      setShow(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 transition-opacity duration-1000">
      <ProhoriniShieldLoader message="Datalink Established. Initializing Core..." />
    </div>
  );
}
