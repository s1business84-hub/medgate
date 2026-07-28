"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { CheckCircle, Users, Award, ArrowRight, Sparkles, Globe, Shield, Zap, GraduationCap, Star, Building } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState, useMemo } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { RevealText } from "@/components/ui/reveal-text"
import { MagneticHover } from "@/components/ui/magnetic-hover"
import Reveal from "@/components/Reveal"
import { PageTransition } from "@/components/ui/page-transition"
import { Phone3D } from "../3d-phone"
import { ScrollCue } from "../animation/ScrollCue"
import { LetterByLetter } from "@/components/animation/LetterByLetter"
import { cn } from "@/lib/utils"

// Seeded PRNG so the server and client produce identical star fields.
// Module-scope Math.random() is NOT enough: the module is evaluated once on the
// server and again in the browser, yielding different values and a hydration
// mismatch on every load.
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateStarPositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    left: seededRandom(i * 4 + 1) * 100,
    top: seededRandom(i * 4 + 2) * 100,
    duration: 3 + seededRandom(i * 4 + 3) * 2,
    delay: seededRandom(i * 4 + 4) * 5,
  }));
};

const STAR_POSITIONS = generateStarPositions(30);

// Glowing orb component for liquid glass effect
function GlowingOrb({ className, color, size, delay = 0 }: { className: string; color: string; size: string; delay?: number }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl pointer-events-none will-change-auto", className)}
      style={{ 
        background: color,
        width: size,
        height: size,
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// Feature pill data
const features = [
  { icon: Shield, label: "Verified Programs", color: "from-blue-400 to-blue-600" },
  { icon: Globe, label: "UAE Coverage", color: "from-blue-400 to-blue-600" },
  { icon: Zap, label: "Fast Processing", color: "from-blue-400 to-indigo-600" },
  { icon: Star, label: "Premium Support", color: "from-indigo-400 to-indigo-600" },
]

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetUrl, setTargetUrl] = useState<string>("")
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleNavigate = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    setTargetUrl(url)
    setIsTransitioning(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 20);
      mouseY.set((clientY / innerHeight - 0.5) * 20);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (typeof window === "undefined" || !heroRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-stat",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-stats",
            start: "top 80%",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Page transition */}
      <PageTransition 
        isOpen={isTransitioning} 
        onComplete={() => setIsTransitioning(false)}
        targetUrl={targetUrl}
      />

      {/* === ENHANCED LIQUID GLASS BACKGROUND === */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
        
        {/* Animated grid */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 will-change-auto"
            style={{
              backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
            animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Vibrant glowing orbs */}
        <GlowingOrb className="-top-40 -left-40" color="radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)" size="600px" delay={0} />
        <GlowingOrb className="top-1/4 -right-20" color="radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, transparent 70%)" size="500px" delay={1.5} />
        <GlowingOrb className="bottom-0 left-1/3" color="radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)" size="550px" delay={3} />
        
        {/* Interactive mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-70 will-change-auto"
          style={{
            background: `radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 45%), radial-gradient(ellipse at 40% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(96, 165, 250, 0.1) 0%, transparent 40%)`,
            x: springX,
            y: springY,
          }}
        />
        
        {/* Animated gradient lines */}
        <motion.div className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <motion.div className="absolute h-px w-full top-1/4 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute h-px w-full top-2/3 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" animate={{ x: ['100%', '-100%'] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute w-px h-full left-1/4 bg-gradient-to-b from-transparent via-indigo-500/25 to-transparent" animate={{ y: ['-100%', '100%'] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
        </motion.div>
        
        {/* Additional floating orbs for depth */}
        <GlowingOrb className="top-1/2 left-1/4" color="radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 60%)" size="400px" delay={2} />
        <GlowingOrb className="bottom-1/4 right-1/3" color="radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 65%)" size="450px" delay={2.5} />
        
        {/* Animated star field */}
        <div className="absolute inset-0 overflow-hidden">
          {STAR_POSITIONS.map((star, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-slate-950/80 to-transparent pointer-events-none" />
        
        {/* Glass noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="mx-auto max-w-2xl">
            {/* Minimal badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 sm:mb-8"
            >
              <span className="group inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium bg-gradient-to-r from-blue-500/10 via-blue-500/10 to-indigo-500/10 border border-white/10 rounded-full px-3 sm:px-4 py-2 backdrop-blur-sm hover:border-white/20 transition-all duration-500">
                <motion.span 
                  className="relative flex h-2 w-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-blue-400 to-indigo-400"></span>
                </motion.span>
                <span className="bg-gradient-to-r from-blue-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent font-semibold">
                  Now Live • UAE Medical Training Platform
                </span>
                <Sparkles className="w-3 h-3 text-indigo-400" />
              </span>
            </motion.div>

            {/* Main headline with reveal animation */}
            <div className="mb-6">
              <RevealText 
                className="text-[2.5rem] sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]"
                stagger={0.02}
              >
                Medical Training
              </RevealText>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h1 className="text-[2.5rem] sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                  <LetterByLetter text="Reimagined" delay={0.5} duration={0.06} gradient={true} />
                </h1>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 max-w-lg"
            >
              Connect with top UAE hospitals for structured medical observerships. 
              <span className="text-blue-400"> Verified programs.</span>
              <span className="text-blue-400"> Seamless applications.</span>
              <span className="text-indigo-400"> Real results.</span>
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                >
                  <div className={cn("p-1 rounded-full bg-gradient-to-r", feature.color)}>
                    <feature.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <Reveal delay={0.7} y={30}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
                <MagneticHover>
                  <motion.button 
                    onClick={(e) => handleNavigate(e, "/programs")}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-600"
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      style={{ backgroundSize: '200% 200%' }}
                    />
                    <span className="relative z-10 text-white">Browse Programs</span>
                    <ArrowRight className="relative z-10 w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-600 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                  </motion.button>
                </MagneticHover>
                
                <MagneticHover>
                  <Link href="/for-hospitals">
                    <motion.button 
                      className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/30 transition-all duration-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Building className="w-4 h-4 text-blue-400" />
                      <span>For Hospitals</span>
                    </motion.button>
                  </Link>
                </MagneticHover>
              </div>
            </Reveal>
          </div>

          {/* Right Column - 3D Phone */}
          <Reveal delay={0.3} y={40}>
            <motion.div 
              className="flex justify-center lg:justify-end items-center h-125 relative"
              style={{ y: parallaxY }}
            >
              {/* Glow behind phone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-indigo-500/30 blur-3xl animate-pulse" />
              </div>
              <Phone3D />
            </motion.div>
          </Reveal>
        </div>

        {/* Define-Design-Develop Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl"
        >
          {/* DEFINE Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent backdrop-blur-xl p-6 overflow-hidden"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%)'
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Define</h3>
              <p className="text-sm text-slate-400 mb-4">
                Clear eligibility criteria and program requirements
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Academic & regulatory standards
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Success metrics defined
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Hospital certifications
                </li>
              </ul>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
          </motion.div>

          {/* DESIGN Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent backdrop-blur-xl p-6 overflow-hidden"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%)'
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Design</h3>
              <p className="text-sm text-slate-400 mb-4">
                Structured workflows and transparent processes
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Student application journey
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Hospital decision workflows
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Real-time tracking systems
                </li>
              </ul>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
          </motion.div>

          {/* DEVELOP Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-600/5 to-transparent backdrop-blur-xl p-6 overflow-hidden"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15), transparent 70%)'
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Develop</h3>
              <p className="text-sm text-slate-400 mb-4">
                Continuous refinement through pilot programs
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Real-world pilot testing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Feedback-driven improvements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Scalable excellence models
                </li>
              </ul>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-bl-full" />
          </motion.div>
        </motion.div>

        {/* Trust indicators card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 max-w-4xl"
        >
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 overflow-hidden">
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <motion.p 
                  className="text-xs uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent font-semibold"
                >
                  Trusted Platform
                </motion.p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  Start your medical journey with confidence
                </h3>
                <p className="text-slate-400 mt-2 text-sm">
                  Be among the first students to access verified observership programs as our hospital partnerships go live.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <motion.button 
                  onClick={(e) => handleNavigate(e, "/programs")}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Browse Programs
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <Link
                  href="/for-hospitals"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  For Hospitals
                </Link>
              </div>
            </div>
            
            {/* Colorful feature grid */}
            <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
              {[
                { icon: Shield, label: "Verified Institutions", color: "cyan" },
                { icon: CheckCircle, label: "Compliance Ready", color: "blue" },
                { icon: Users, label: "Mentor Support", color: "indigo" },
                { icon: Globe, label: "UAE Coverage", color: "cyan" },
                { icon: Zap, label: "Fast Processing", color: "blue" },
                { icon: Star, label: "Premium Experience", color: "indigo" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 group"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                    item.color === "cyan" ? "bg-blue-500/20" :
                    item.color === "blue" ? "bg-blue-500/20" :
                    item.color === "indigo" ? "bg-indigo-500/20" :
                    item.color === "emerald" ? "bg-emerald-500/20" :
                    item.color === "orange" ? "bg-orange-500/20" : "bg-yellow-500/20"
                  )}>
                    <item.icon className={cn(
                      "w-4 h-4",
                      item.color === "cyan" ? "text-blue-400" :
                      item.color === "blue" ? "text-blue-400" :
                      item.color === "indigo" ? "text-indigo-400" :
                      item.color === "emerald" ? "text-emerald-400" :
                      item.color === "orange" ? "text-orange-400" : "text-yellow-400"
                    )} />
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollCue />
    </section>
  )
}
