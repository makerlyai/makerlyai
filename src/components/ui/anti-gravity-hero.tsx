"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Environment, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// --- 3D Desktop Card Component ---
function Card3D() {
  const cardRef = useRef<THREE.Group>(null);

  // Parallax tilt on mouse hover
  useFrame((state) => {
    if (!cardRef.current) return;
    const t = state.clock.getElapsedTime();
    // Idle bobbing and slow rotation is handled by <Float>
    // Here we add the responsive mouse tilt
    const targetX = (state.pointer.x * Math.PI) / 4;
    const targetY = (state.pointer.y * Math.PI) / 4;

    cardRef.current.rotation.y = THREE.MathUtils.lerp(
      cardRef.current.rotation.y,
      targetX,
      0.1
    );
    cardRef.current.rotation.x = THREE.MathUtils.lerp(
      cardRef.current.rotation.x,
      -targetY,
      0.1
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.1, 0.1]}>
      <group ref={cardRef}>
        {/* Main Glass Card Body */}
        <RoundedBox args={[3.5, 5.5, 0.1]} radius={0.15} smoothness={4}>
          <meshPhysicalMaterial
            transparent
            opacity={0.9}
            roughness={0.1}
            transmission={0.9}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            ior={1.5}
            color="#e0eaff"
          />
        </RoundedBox>

        {/* Card Border / Inner Core for visibility */}
        <RoundedBox args={[3.45, 5.45, 0.05]} radius={0.12} smoothness={4} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
        </RoundedBox>

        {/* Magnetic Strip / Design Element */}
        <mesh position={[0, -1.5, 0.06]}>
          <planeGeometry args={[3.5, 0.4]} />
          <meshStandardMaterial color="#1a4b9c" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* ID Card Content (Text) */}
        <Text
          position={[-1.3, 2, 0.08]}
          fontSize={0.25}
          color="#121212"
          anchorX="left"
          anchorY="top"
          fontWeight="bold"
        >
          MAKERLY AI
        </Text>
        <Text
          position={[-1.3, 1.6, 0.08]}
          fontSize={0.15}
          color="#1a4b9c"
          anchorX="left"
          anchorY="top"
          letterSpacing={0.1}
        >
          MAKER-001
        </Text>

        <Text
          position={[0, 0, 0.08]}
          fontSize={0.6}
          color="#121212"
          anchorX="center"
          anchorY="middle"
          fontWeight="black"
        >
          ACCESS
        </Text>
        
        {/* Holographic Chip */}
        <RoundedBox args={[0.5, 0.4, 0.02]} radius={0.05} position={[-1, 1, 0.06]}>
           <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// --- CSS Mobile Fallback Card Component ---
function CSSMobileCardFallback() {
  return (
    <div className="relative w-full max-w-sm mx-auto h-[450px] flex items-center justify-center perspective-[1000px]">
      <motion.div
        animate={{
          y: [-15, 15, -15],
          rotateY: [-5, 5, -5],
          rotateX: [2, -2, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-[280px] h-[440px] rounded-2xl glass-panel relative overflow-hidden flex flex-col p-6 shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute top-0 left-0 w-full h-[150%] bg-gradient-to-tr from-transparent via-white/20 to-transparent -rotate-45 translate-y-[-50%] pointer-events-none" />
        
        <h3 className="text-xl font-black text-white tracking-widest drop-shadow-md">MAKERLY AI</h3>
        <p className="text-sm font-bold text-brand-blue tracking-widest mt-1">MAKER-001</p>
        
        <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600 mt-6 shadow-inner" />
        
        <div className="flex-grow flex items-center justify-center">
           <h2 className="text-4xl font-black text-white mix-blend-overlay tracking-tighter">ACCESS</h2>
        </div>
        
        <div className="absolute bottom-16 left-0 w-full h-8 bg-brand-blue/80 backdrop-blur-md" />
      </motion.div>
      
      {/* CSS Fake Shadow */}
      <motion.div 
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/40 blur-xl rounded-[100%]"
      />
    </div>
  );
}

// --- Main Exported Section ---
export function AntiGravityHero() {
  const [isMobile, setIsMobile] = useState(true); // Default true for SSR safety
  
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-20">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center pointer-events-none">
         <div className="w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Text Content */}
        <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1 px-4 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-semibold tracking-widest text-brand-blue mb-4 uppercase">
              Secure Architecture
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-lg mb-6">
              Unlock the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300">Future.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-lg mx-auto lg:mx-0 font-light">
              Gain exclusive access to MakerlyAI's proprietary machine learning models and next-generation glassmorphism UI blueprints.
            </p>
          </motion.div>
        </div>

        {/* Right ID Card Content */}
        <div className="w-full h-[500px] md:h-[600px] relative order-1 lg:order-2 flex items-center justify-center">
          {isMobile ? (
            <CSSMobileCardFallback />
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#1a4b9c" />
                <Environment preset="city" />
                <Card3D />
                <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
              </Canvas>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}
