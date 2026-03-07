import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="h-screen bg-zinc-950 flex flex-col lg:flex-row gap-6 lg:gap-24 items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Hi-Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 md:gap-6 max-w-[200px] md:max-w-md animate-in fade-in slide-in-from-left-5 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full" />
          <Image
            src="/prohorini-logo.png"
            width={300}
            height={90}
            alt="Prohorini"
            className="relative w-32 md:w-full h-auto object-contain brightness-110 contrast-125"
            priority
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-black text-white tracking-[0.2em] uppercase leading-none">
            Prohorini
          </h1>
          <p className="hidden md:block text-[10px] md:text-xs font-black text-red-500 uppercase tracking-[0.4em] opacity-80 pl-1 mt-2">
            Guardian for women
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in slide-in-from-right-5 duration-700 delay-200">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[24px] md:rounded-[32px] p-2 shadow-2xl overflow-hidden scale-90 md:scale-100">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest h-10 md:h-12 rounded-2xl transition-all shadow-xl shadow-red-900/20 border-none",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "sr-only",
                headerSubtitle: "sr-only",
                socialButtonsBlockButton:
                  "rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 h-10 md:h-12",
                socialButtonsBlockButtonText:
                  "text-white font-bold uppercase text-[10px] tracking-widest",
                formFieldLabel:
                  "text-zinc-400 font-black uppercase text-[9px] tracking-widest mb-1",
                formFieldInput:
                  "rounded-xl border-white/10 bg-white/5 text-white h-10 md:h-11 focus:border-red-500 transition-all",
                rootBox: "w-full",
                cardBox: "w-full",
                footer: "bg-transparent",
                footerActionText:
                  "text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-tight",
                footerActionLink:
                  "text-red-500 font-black text-[10px] md:text-xs uppercase tracking-tight hover:text-red-400",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-red-500",
                formFieldAction: "text-red-500 hover:text-red-400 font-bold",
                dividerLine: "bg-white/5",
                dividerText:
                  "text-zinc-600 uppercase font-black text-[9px] tracking-widest",
              },
            }}
            afterSignInUrl="/admin"
          />
        </div>
      </div>
    </div>
  );
}

//------------------------------------------------------------
//------------------------------------------------------------
// ===== ADMIN ======
// email: admin_prohorini@gmail.com
// password: P@$$key123
//
// ===== SUPER ADMIN =======
// email: super_admin_prohorini@gamil.com
// password: P@$$key123
//
//-----------------------------------------------------------
//-----------------------------------------------------------
