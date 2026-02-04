"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { CheckCircle, Users, Award, ArrowRight, Sparkles, Globe, Shield, Zap, GraduationCap, Building2, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { RevealText } from "@/components/ui/reveal-text"
import { MagneticHover } from "@/components/ui/magnetic-hover"
import Reveal from "@/components/Reveal"
import { PageTransition } from "@/components/ui/page-transition"
import { Phone3D } from "../3d-phone"
import { ScrollCue } from "../animation/ScrollCue"
import { cn } from "@/lib/utils"

// Glowing orb component for liquid glass effect
function GlowingOrb({ className, color, size, delay = 0 }: { className: string; color: string; size: string; delay?: number }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl pointer-events-none", className)}
      style={{ 
        background: color,
        width: size,
        height: size,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// Feature pill data
const features = [
  { icon: Shield, label: "Verified Programs", color: "from-cyan-400 to-cyan-600" },
  { icon: Globe, label: "UAE Coverage", color: "from-purple-400 to-purple-600" },
  { icon: Zap, label: "Fast Processing", color: "from-pink-400 to-pink-600" },
  { icon: Star, label: "Premium Support", color: "from-emerald-400 to-emerald-600" },
]

const stats = [
  {
    label: "Partner Hospitals",
    value: "50+",
    icon: Building2,
    color: "cyan",
    description: "World-class institutions"
  },
  {
    label: "Success Rate",
    value: "98%",
    icon: Award,
    color: "purple",
    description: "Placement achievement"
  },
  {
    label: "Active Students",
    value: "1,200+",
    icon: GraduationCap,
    color: "pink",
    description: "Growing community"
  },
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
      mouseX.set((clientX / innerWidth - 0.5) * 30);
      mouseY.set((clientY / innerHeight - 0.5) * 30);
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
          stagger: 0.1,
          duration: 0.8,
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
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
            animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Vibrant glowing orbs */}
        <GlowingOrb className="-top-40 -left-40" color="radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)" size="600px" delay={0} />
        <GlowingOrb className="top-1/4 -right-20" color="radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, transparent 70%)" size="500px" delay={1} />
        <GlowingOrb className="bottom-0 left-1/3" color="radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)" size="550px" delay={2} />
        <GlowingOrb className="top-1/2 left-1/4" color="radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, transparent 70%)" size="400px" delay={1.5} />
        <GlowingOrb className="-bottom-20 -right-20" color="radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, transparent 70%)" size="500px" delay={0.5} />
        
        {/* Interactive mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(ellipse at 20% 30%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 45%), radial-gradient(ellipse at 40% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(34, 211, 238, 0.1) 0%, transparent 40%)`,
            x: springX,
            y: springY,
          }}
        />
        
        {/* Animated gradient lines */}
        <motion.div className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <motion.div className="absolute h-px w-full top-1/4 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute h-px w-full top-2/3 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" animate={{ x: ['100%', '-100%'] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute w-px h-full left-1/4 bg-gradient-to-b from-transparent via-pink-500/25 to-transparent" animate={{ y: ['-100%', '100%'] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
        </motion.div>
        
        {/* Glass noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="mx-auto max-w-2xl">
            {/* Minimal badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <span className="group inline-flex items-center gap-2 text-xs font-medium bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm hover:border-white/20 transition-all duration-500">
                <motion.span 
                  className="relative flex h-2 w-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-cyan-400 to-purple-400"></span>
                </motion.span>
                <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent font-semibold">
                  Now Live • UAE Medical Training Platform
                </span>
                <Sparkles className="w-3 h-3 text-purple-400" />
              </span>
            </motion.div>

            {/* Main headline with reveal animation */}
            <div className="mb-6">
              <RevealText 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                stagger={0.02}
              >
                Medical Training
              </RevealText>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  <AnimatedGradientText>Reimagined</AnimatedGradientText>
                </h1>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg text-slate-300 mb-8 max-w-lg"
            >
              Connect with top UAE hospitals for structured medical observerships. 
              <span className="text-cyan-400"> Verified programs.</span>
              <span className="text-purple-400"> Seamless applications.</span>
              <span className="text-pink-400"> Real results.</span>
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-wrap gap-3 mb-8"
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
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <MagneticHover>
                  <motion.button 
                    onClick={(e) => handleNavigate(e, "/programs")}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ backgroundSize: '200% 200%' }}
                    />
                    <span className="relative z-10 text-white">Browse Programs</span>
                    <ArrowRight className="relative z-10 w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                  </motion.button>
                </MagneticHover>
                
                <MagneticHover>
                  <Link href="/for-hospitals">
                    <motion.button 
                      className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/30 transition-all duration-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Building2 className="w-4 h-4 text-cyan-400" />
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
              className="flex justify-center lg:justify-end items-center h-[500px] relative"
              style={{ y: parallaxY }}
            >
              {/* Glow behind phone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/30 via-purple-500/20 to-pink-500/30 blur-3xl animate-pulse" />
              </div>
              <Phone3D />
            </motion.div>
          </Reveal>
        </div>

        {/* Stats section with liquid glass cards */}
        <div className="hero-stats mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="hero-stat"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className={cn(
                "relative rounded-2xl border bg-white/5 backdrop-blur-xl p-6 overflow-hidden transition-all duration-500 hover:shadow-xl group",
                stat.color === "cyan" ? "border-cyan-500/20 hover:border-cyan-500/40" :
                stat.color === "purple" ? "border-purple-500/20 hover:border-purple-500/40" :
                "border-pink-500/20 hover:border-pink-500/40"
              )}>
                {/* Glow effect on hover */}
                <div className={cn(
                  "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  stat.color === "cyan" ? "bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent" :
                  stat.color === "purple" ? "bg-gradient-to-r from-purple-500/10 via-transparent to-transparent" :
                  "bg-gradient-to-r from-pink-500/10 via-transparent to-transparent"
                )} />
                <div className="relative flex items-start gap-4">
                  <motion.div 
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      stat.color === "cyan" ? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30" :
                      stat.color === "purple" ? "bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30" :
                      "bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30"
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className={cn(
                      "h-7 w-7",
                      stat.color === "cyan" ? "text-cyan-400" :
                      stat.color === "purple" ? "text-purple-400" : "text-pink-400"
                    )} />
                  </motion.div>
                  <div>
                    <motion.div 
                      className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm font-medium text-slate-300">{stat.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.description}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl"
        >
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 overflow-hidden">
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <motion.p 
                  className="text-xs uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"
                >
                  Trusted Platform
                </motion.p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  Start your medical journey with confidence
                </h3>
                <p className="text-slate-400 mt-2 text-sm">
                  Join thousands of students who have successfully completed their observerships.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/programs"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/purpose"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            {/* Colorful feature grid */}
            <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
              {[
                { icon: Shield, label: "Verified Institutions", color: "cyan" },
                { icon: CheckCircle, label: "Compliance Ready", color: "purple" },
                { icon: Users, label: "Mentor Support", color: "pink" },
                { icon: Globe, label: "UAE Coverage", color: "emerald" },
                { icon: Zap, label: "Fast Processing", color: "orange" },
                { icon: Star, label: "Premium Experience", color: "yellow" },
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
                    item.color === "cyan" ? "bg-cyan-500/20" :
                    item.color === "purple" ? "bg-purple-500/20" :
                    item.color === "pink" ? "bg-pink-500/20" :
                    item.color === "emerald" ? "bg-emerald-500/20" :
                    item.color === "orange" ? "bg-orange-500/20" : "bg-yellow-500/20"
                  )}>
                    <item.icon className={cn(
                      "w-4 h-4",
                      item.color === "cyan" ? "text-cyan-400" :
                      item.color === "purple" ? "text-purple-400" :
                      item.color === "pink" ? "text-pink-400" :
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
