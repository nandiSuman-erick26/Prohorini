"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Zap,
  Users,
  Bell,
  MapPin,
  Activity,
  Lock,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      title: "AI Threat Monitoring",
      description:
        "Our intelligence engine analyzes safety patterns to predict and highlight high-risk zones in real-time.",
      icon: Activity,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Geofenced SOS Circle",
      description:
        "Instantly notify your trusted emergency contacts and local authorities the moment you enter a danger zone.",
      icon: Bell,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Safe Passage Mapping",
      description:
        "Navigate through community-verified safe routes, avoiding unlit streets and reported incident areas.",
      icon: MapPin,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  const stats = [
    { label: "Active Guardians", value: "24.8K+" },
    { label: "Alerts Resolved", value: "12,402" },
    { label: "Safe Zones Mapped", value: "852" },
    { label: "Response Time", value: "< 2s" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-500/30 overflow-x-hidden">
      {/* 🔮 Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden overflow-y-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-zinc-800/20 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      {/* 🧭 Navigation Overlay */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 transition-all border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 h-8">
            <Image
              src="/prohorini-logo-with-text.png"
              alt="Prohorini"
              width={140}
              height={40}
              className=" w-auto brightness-125 object-contain"
            />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#stats"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Intelligence
            </a>
            <Link
              href="/sign-in"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Staff Login
            </Link>
          </div>
          <Link
            href="/sign-up"
            className="px-6 h-10 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            Activate Account
          </Link>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest">
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
              Intelligence Phase: Alpha Release
            </div>
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase">
              Protecting <br />
              <span className="text-zinc-500">Every</span> Human <br />
              <span className="text-red-500 underline decoration-8 decoration-red-500/20">
                Step
              </span>
              .
            </h1>
            <p className="text-zinc-400 text-base md:text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Prohorini combines hyper-local threat detection with instant
              emergency response. The next generation of personal safety
              intelligence is here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/dashboard"
                className="bg-red-600 hover:bg-red-700 text-white px-10 h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl shadow-red-900/30 hover:scale-[1.03] active:scale-[0.97]"
              >
                Launch Map Console
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5 px-10 h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                Join Safe Circle
                <UserPlus className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:block hidden"
          >
            <div className="absolute inset-0 bg-red-600/10 blur-[100px] rounded-full" />
            <div className="relative bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[48px] shadow-2xl aspect-square flex items-center justify-center overflow-hidden group">
              <Image
                src="/prohorini-logo.png"
                width={400}
                height={400}
                alt="Safety Shield"
                className="w-full h-auto object-contain brightness-110 contrast-110 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-10 left-10 p-4 bg-zinc-900/80 border border-white/10 rounded-2xl animate-bounce delay-100">
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
              <div className="absolute bottom-20 right-10 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl animate-pulse">
                <Activity className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 📈 Stats Segment */}
      <motion.section
        id="stats"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-zinc-900/30 border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center space-y-1"
              >
                <p className="text-4xl md:text-5xl font-black text-white">
                  {stat.value}
                </p>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🛡️ Pillars Section */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">
              Core Pillars
            </h2>
            <p className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              Ecosystem of Safety
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[40px] space-y-6 hover:border-white/20 transition-all duration-300"
              >
                <div
                  className={`h-16 w-16 ${feature.bg} rounded-3xl flex items-center justify-center`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest group"
                >
                  Learn Protection
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌍 Tactical CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-24 px-6 mb-20"
      >
        <div className="max-w-7xl mx-auto relative group">
          <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-zinc-900/80 border border-white/10 rounded-[64px] p-12 md:p-24 text-center space-y-10 overflow-hidden">
            <div className="space-y-4 relative z-10">
              <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Ready to take <br className="md:hidden" /> control?
              </h2>
              <p className="text-zinc-400 font-medium max-w-xl mx-auto">
                Join the thousands who trust Prohorini to be their guardian in
                the digital and physical world.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link
                href="/sign-up"
                className="px-10 h-16 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
              >
                Create Security Profile
              </Link>
              <Link
                href="/dashboard"
                className="px-10 h-16 bg-zinc-800 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center hover:bg-zinc-700 transition-all"
              >
                View Interactive Map
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 📍 Final Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
          <div className="col-span-1 md:col-span-1 flex flex-col text-center">
            <Image
              src="/prohorini-logo-with-text.png"
              alt="Prohorini"
              width={600}
              height={90}
              className=" w-auto brightness-125 object-contain"
            />
            <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-[280px] mt-[-1.5rem]">
              Advancing human safety through localized intelligence and
              community vigilance.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              Ecosystem
            </h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <Link
                href="/dashboard"
                className="hover:text-red-500 transition-colors"
              >
                Live Map
              </Link>
              <Link
                href="/reports"
                className="hover:text-red-500 transition-colors"
              >
                Verify Incident
              </Link>
              <Link
                href="/infra"
                className="hover:text-red-500 transition-colors"
              >
                Safe Routes
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              Staff Console
            </h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <Link
                href="/admin"
                className="hover:text-red-500 transition-colors"
              >
                Admin Access
              </Link>
              <Link
                href="/admin/sos"
                className="hover:text-red-500 transition-colors"
              >
                Emergency Response
              </Link>
              <Link
                href="/admin/zones"
                className="hover:text-red-500 transition-colors"
              >
                Zone Ops
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              Privacy Hub
            </h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <Link
                href="/privacy"
                className="hover:text-red-500 transition-colors"
              >
                Data Protocol
              </Link>
              <Link
                href="/terms"
                className="hover:text-red-500 transition-colors"
              >
                Ethics Policy
              </Link>
              <span className="text-emerald-500/80 flex items-center gap-2">
                <Lock className="h-3 w-3" />
                GDPR Secure
              </span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-10 text-center">
          <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">
            <span className="text-red-500 font-semibold">
              PROHORINI SAFETY SYSTEMS
            </span>{" "}
            &copy; 2026. ALL INFRASTRUCTURE OPERATIONAL. DEVELOPED BY <br />{" "}
            <span className="text-red-500 font-semibold">@SUMAN NANDI</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
