"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Three.js components only if needed
const Canvas = dynamic(async () => {
  const module = await import("@react-three/fiber");
  return module.Canvas;
}, { ssr: false });

const PerspectiveCamera = dynamic(async () => {
  const module = await import("@react-three/drei");
  return module.PerspectiveCamera;
}, { ssr: false });

const OrbitControls = dynamic(async () => {
  const module = await import("@react-three/drei");
  return module.OrbitControls;
}, { ssr: false });

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Enhanced 3D Robot with smooth animations
function Robot() {
  const groupRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [isWaving, setIsWaving] = useState(false);
  const waveProgressRef = useRef(0);

  // Trigger wave animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Animate waving
  useFrame(() => {
    if (isWaving && rightArmRef.current) {
      waveProgressRef.current += 0.04;
      const waveAngle = Math.sin(waveProgressRef.current) * 1.2;
      rightArmRef.current.rotation.z = waveAngle;
    } else if (rightArmRef.current) {
      rightArmRef.current.rotation.z *= 0.95;
    }

    if (groupRef.current && !isWaving) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={1.2}>
      {/* Main Body - Torso */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1, 8]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          metalness={0.85} 
          roughness={0.15}
          emissive="#0099cc"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Chest Panel */}
      <mesh position={[0, 0.65, 0.4]}>
        <boxGeometry args={[0.25, 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#0099cc" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#00d9ff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          metalness={0.85} 
          roughness={0.15}
          emissive="#0099cc"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Left Eye */}
      <mesh position={[-0.18, 1.65, 0.42]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#0099ff" 
          emissiveIntensity={1.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Right Eye */}
      <mesh position={[0.18, 1.65, 0.42]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#0099ff" 
          emissiveIntensity={1.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Mouth indicator */}
      <mesh position={[0, 1.4, 0.44]}>
        <boxGeometry args={[0.15, 0.05, 0.02]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          emissive="#0099cc"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.55, 0.85, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial 
            color="#00d9ff" 
            metalness={0.85} 
            roughness={0.15}
          />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color="#0099cc" 
            metalness={0.85} 
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Right Arm (Waving arm) */}
      <group ref={rightArmRef} position={[0.55, 0.85, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial 
            color="#00d9ff" 
            metalness={0.85} 
            roughness={0.15}
          />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color="#0099cc" 
            metalness={0.85} 
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Left Leg */}
      <mesh position={[-0.22, -0.1, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial 
          color="#0066cc" 
          metalness={0.85} 
          roughness={0.15}
        />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.22, -0.1, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial 
          color="#0066cc" 
          metalness={0.85} 
          roughness={0.15}
        />
      </mesh>

      {/* Left Foot */}
      <mesh position={[-0.22, -0.65, 0.1]}>
        <boxGeometry args={[0.2, 0.15, 0.25]} />
        <meshStandardMaterial 
          color="#004499" 
          metalness={0.85} 
          roughness={0.15}
        />
      </mesh>

      {/* Right Foot */}
      <mesh position={[0.22, -0.65, 0.1]}>
        <boxGeometry args={[0.2, 0.15, 0.25]} />
        <meshStandardMaterial 
          color="#004499" 
          metalness={0.85} 
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.3, 2.8]} fov={45} />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={1.5}
        dampingFactor={0.05}
      />
      
      <ambientLight intensity={0.8} />
      <pointLight position={[8, 12, 8]} intensity={1.8} color="#00d9ff" distance={30} decay={2} />
      <pointLight position={[-8, 8, -8]} intensity={1.2} color="#6366f1" distance={25} decay={2} />
      <pointLight position={[0, -5, 10]} intensity={0.6} color="#00d9ff" distance={20} decay={2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#ffffff" />
      
      <color attach="background" args={["#0a0e1a"]} />
      
      <Robot />
    </>
  );
}

export function Robot3D() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full h-96 rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/70 backdrop-blur-xl shadow-2xl shadow-cyan-500/20"
    >
      <Canvas>
        <Scene />
      </Canvas>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <p className="text-xl font-bold bg-linear-to-r from-cyan-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
            👋 Welcome to Medgate
          </p>
        </motion.div>
      </motion.div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-500/20 via-transparent to-transparent pointer-events-none rounded-bl-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-tr-full" />
    </motion.div>
  );
}

