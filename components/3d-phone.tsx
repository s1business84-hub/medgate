"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// 3D Phone that revolves
function Phone() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Phone body */}
      <RoundedBox args={[1.8, 3.6, 0.2]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.1}
          emissive="#0f172a"
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[1.6, 3.3, 0.05]} radius={0.1} smoothness={4} position={[0, 0, 0.13]}>
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.6}
          roughness={0.2}
          emissive="#06b6d4"
          emissiveIntensity={0.4}
        />
      </RoundedBox>

      {/* Screen glow effect */}
      <mesh position={[0, 0, 0.14]}>
        <planeGeometry args={[1.5, 3.2]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Camera notch */}
      <mesh position={[0, 1.6, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Side buttons */}
      <RoundedBox args={[0.05, 0.3, 0.15]} radius={0.02} position={[0.93, 0.8, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </RoundedBox>
    </group>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />

      {/* Advanced lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 8, 5]} intensity={1.5} color="#06b6d4" distance={25} decay={2} />
      <pointLight position={[-5, 5, -5]} intensity={1.2} color="#6366f1" distance={20} decay={2} />
      <pointLight position={[0, -3, 8]} intensity={0.8} color="#06b6d4" distance={20} decay={2} />
      <directionalLight position={[3, 8, 5]} intensity={0.5} color="#ffffff" />

      <color attach="background" args={["#0a0e1a"]} />

      <Phone />
    </>
  );
}

export function Phone3D() {
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

      {/* Animated greeting */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <p className="text-xl font-bold bg-linear-to-r from-cyan-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
            📱 Welcome to Electivio
          </p>
        </motion.div>
      </motion.div>

      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-500/20 via-transparent to-transparent pointer-events-none rounded-bl-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-tr-full" />
    </motion.div>
  );
}
