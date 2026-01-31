"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox, Text, Center } from "@react-three/drei";
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
      {/* Phone body with enhanced materials */}
      <RoundedBox args={[1.8, 3.6, 0.2]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.95}
          roughness={0.05}
          emissive="#06b6d4"
          emissiveIntensity={0.1}
          reflectivity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Screen with glow */}
      <RoundedBox args={[1.6, 3.3, 0.05]} radius={0.1} smoothness={4} position={[0, 0, 0.13]}>
        <meshPhysicalMaterial
          color="#0a3f5a"
          metalness={0.2}
          roughness={0.3}
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Text on screen - rotates with phone */}
      <Center position={[0, 0.5, 0.18]}>
        <Text
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.4}
          textAlign="center"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        >
          Welcome to
        </Text>
      </Center>
      <Center position={[0, 0.15, 0.18]}>
        <Text
          fontSize={0.28}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.4}
          textAlign="center"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          fontWeight="bold"
        >
          Electivio
        </Text>
      </Center>
      <Center position={[0, -0.3, 0.18]}>
        <Text
          fontSize={0.14}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
          textAlign="center"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        >
          Structured workflows
        </Text>
      </Center>
      <Center position={[0, -0.55, 0.18]}>
        <Text
          fontSize={0.14}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
          textAlign="center"
          font="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        >
          Transparent requirements
        </Text>
      </Center>

      {/* Camera notch */}
      <mesh position={[0, 1.6, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
        <meshPhysicalMaterial color="#000000" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Side buttons */}
      <RoundedBox args={[0.05, 0.3, 0.15]} radius={0.02} position={[0.93, 0.8, 0]}>
        <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </RoundedBox>
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

      {/* Dramatic lighting setup */}
      <ambientLight intensity={0.5} />
      
      {/* Key light - cyan from top right */}
      <pointLight position={[6, 8, 8]} intensity={2} color="#06b6d4" distance={30} decay={2} />
      
      {/* Fill light - indigo from back left */}
      <pointLight position={[-8, 4, -8]} intensity={1.5} color="#6366f1" distance={25} decay={2} />
      
      {/* Rim light - subtle cyan from bottom */}
      <pointLight position={[0, -6, 8]} intensity={1} color="#06b6d4" distance={20} decay={2} />
      
      {/* Directional light for depth */}
      <directionalLight position={[4, 10, 6]} intensity={0.8} color="#ffffff" />

      <color attach="background" args={["transparent"]} />

      <Phone />
    </>
  );
}

export function Phone3D() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative w-full h-full"
      style={{ perspective: "1200px" }}
    >
      <Canvas className="!w-full !h-full">
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
