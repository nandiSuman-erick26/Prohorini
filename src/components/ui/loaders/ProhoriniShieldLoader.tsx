"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ProhoriniShieldLoaderProps {
  message?: string;
}

const ProhoriniShieldLoader = ({
  message = "Securing your environment...",
}: ProhoriniShieldLoaderProps) => {
  const [coords, setCoords] = useState({ x: "23.8103N", y: "90.4125E" });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate changing tactical coordinates (Dhakha area roughly)
      const lat = (23.7 + Math.random() * 0.2).toFixed(4);
      const lng = (90.3 + Math.random() * 0.2).toFixed(4);
      setCoords({ x: `${lat}N`, y: `${lng}E` });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950 overflow-hidden z-[9999]">
      {/* 🟦 Tactical HUD Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 left-0 w-full h-px bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-[scannerSweep_4s_linear_infinite]" />
      </div>

      {/* 📡 HUD Corners */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 border-l-2 border-t-2 border-red-500/30 w-8 h-8 md:w-12 md:h-12 rounded-tl-xl" />
      <div className="absolute top-6 right-6 md:top-10 md:right-10 border-r-2 border-t-2 border-red-500/30 w-8 h-8 md:w-12 md:h-12 rounded-tr-xl" />
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 border-l-2 border-b-2 border-red-500/30 w-8 h-8 md:w-12 md:h-12 rounded-bl-xl" />
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 border-r-2 border-b-2 border-red-500/30 w-8 h-8 md:w-12 md:h-12 rounded-br-xl" />

      {/* 📊 Telemetry Data */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 space-y-1">
        <p className="text-[8px] md:text-[10px] font-black text-red-500/40 uppercase tracking-widest">
          System Status: INITIALIZING
        </p>
        <p className="text-[8px] md:text-[10px] font-black text-red-500/40 uppercase tracking-widest">
          Encryption: AES-256-GCM
        </p>
      </div>
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-right space-y-1">
        <p className="text-[8px] md:text-[10px] font-black text-red-500/40 uppercase tracking-widest">
          LOC_INTEL: {coords.x}
        </p>
        <p className="text-[8px] md:text-[10px] font-black text-red-500/40 uppercase tracking-widest">
          {coords.y}
        </p>
      </div>

      {/* 🛡️ Core Visuals */}
      <div className="relative flex flex-col items-center justify-center gap-6 md:gap-10 scale-90 md:scale-110">
        <div className="relative flex items-center justify-center">
          {/* Radar Circles */}
          <div className="absolute h-64 w-64 rounded-full border border-red-500/5 animate-[radarPing_4s_ease-out_infinite]" />
          <div className="absolute h-48 w-48 rounded-full border border-red-500/10 animate-[radarPing_4s_ease-out_1s_infinite]" />
          <div className="absolute h-32 w-32 rounded-full border border-red-500/20 animate-[radarPing_4s_ease-out_2s_infinite]" />

          {/* Glow Backdrop */}
          <div className="absolute h-24 w-24 bg-red-600/10 rounded-full blur-3xl animate-pulse" />

          {/* Shield Module */}
          <div className="relative h-24 w-24 flex items-center justify-center group">
            {/* Spinning Technical Segments */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500/40 border-b-red-500/40 animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-[-12px] rounded-full border-2 border-transparent border-l-red-500/20 border-r-red-500/20 animate-[spin_8s_linear_infinite_reverse]" />

            <Image
              src="/prohorini-logo.png"
              alt="Security Core"
              width={80}
              height={80}
              className="h-16 w-16 object-contain animate-[shieldPulse_2s_ease-in-out_infinite] brightness-125 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            />
          </div>
        </div>

        {/* 📝 Tactical Message */}
        <div className="flex flex-col items-center gap-4 w-[90vw] md:w-auto">
          <div className="px-4 md:px-6 py-2 bg-red-500/5 border border-red-500/20 rounded-full backdrop-blur-md w-full text-center">
            <p className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.4em] animate-pulse">
              {message}
            </p>
          </div>

          <div className="flex gap-2">
            <span className="h-1 w-6 bg-red-500/20 rounded-full overflow-hidden">
              <span className="block h-full bg-red-500 w-1/3 animate-[progressMove_1.5s_infinite]" />
            </span>
            <span className="h- w-1 text-[8px] font-black text-red-500/40 tracking-widest uppercase">
              STABLE
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scannerSweep {
          0% {
            top: -10%;
          }
          100% {
            top: 110%;
          }
        }
        @keyframes radarPing {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes shieldPulse {
          0%,
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.1);
            filter: brightness(1.3);
          }
        }
        @keyframes progressMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProhoriniShieldLoader;
