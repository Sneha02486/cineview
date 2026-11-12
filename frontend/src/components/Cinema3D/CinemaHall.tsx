import React from 'react';
import * as THREE from 'three';
import { CINEMA_HALL_CONFIG } from './cinemaGeometry';

export const CinemaHall: React.FC = () => {
  const { width, depth, height } = CINEMA_HALL_CONFIG;

  return (
    <group>
      {/* Ambient Theater Lighting */}
      <ambientLight intensity={0.12} />

      {/* Screen Illumination (Directional glow bouncing from screen onto seats) */}
      <spotLight
        position={[0, 4.5, 3]}
        target-position={[0, 1.5, 14]}
        intensity={1.2}
        angle={Math.PI / 3}
        penumbra={0.8}
        color="#cce4ff"
        castShadow
      />

      {/* Ceiling Ambient Downlights */}
      <pointLight position={[0, height - 0.5, 12]} intensity={0.4} distance={20} color="#ffeedd" />
      <pointLight position={[0, height - 0.5, 22]} intensity={0.3} distance={20} color="#ffeedd" />

      {/* Side Wall Step/Aisle Lighting (Subtle warm amber LEDs) */}
      {[-width / 2 + 0.3, width / 2 - 0.3].map((x, idx) => (
        <group key={idx}>
          {[6, 12, 18, 24].map((z, sIdx) => (
            <pointLight
              key={sIdx}
              position={[x, 0.4 + (z - 5) * 0.16, z]}
              intensity={0.25}
              distance={4}
              color="#ffaa44"
            />
          ))}
        </group>
      ))}

      {/* Floor / Stepped Stadium Platform */}
      <mesh position={[0, -0.05, depth / 2]} receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Stepped Tier Risers (10 rows, elevated backwards) */}
      {Array.from({ length: 10 }).map((_, rIdx) => {
        const rowZ = 6.0 + rIdx * 1.85;
        const tierHeight = 0.35 + rIdx * 0.32;
        const tierDepth = 2.0;
        return (
          <group key={rIdx} position={[0, tierHeight / 2, rowZ]}>
            {/* Carpeted Tier Step */}
            <mesh receiveShadow>
              <boxGeometry args={[width - 1.5, tierHeight, tierDepth]} />
              <meshStandardMaterial color="#131620" roughness={0.95} />
            </mesh>
            {/* Subtle Step Safety LED Strip */}
            <mesh position={[0, tierHeight / 2 - 0.02, -tierDepth / 2 + 0.05]}>
              <boxGeometry args={[width - 2.0, 0.02, 0.02]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        );
      })}

      {/* Front Screen Stage / Border */}
      <mesh position={[0, 0.4, 1.2]} receiveShadow>
        <boxGeometry args={[width - 2, 0.8, 2.5]} />
        <meshStandardMaterial color="#08090d" roughness={0.9} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, height / 2, depth]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#0a0c12" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Left Wall with Acoustic Slat Panels */}
      <group position={[-width / 2, height / 2, depth / 2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[depth, height]} />
          <meshStandardMaterial color="#0a0d14" roughness={0.8} />
        </mesh>
        {/* Decorative Vertical Acoustic Slats */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[(i - 6) * 2.2, 0, 0.05]}>
            <boxGeometry args={[0.35, height - 1.5, 0.1]} />
            <meshStandardMaterial color="#1a1e2b" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Right Wall with Acoustic Slat Panels */}
      <group position={[width / 2, height / 2, depth / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[depth, height]} />
          <meshStandardMaterial color="#0a0d14" roughness={0.8} />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[(i - 6) * 2.2, 0, 0.05]}>
            <boxGeometry args={[0.35, height - 1.5, 0.1]} />
            <meshStandardMaterial color="#1a1e2b" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Ceiling */}
      <mesh position={[0, height, depth / 2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#050608" roughness={0.9} />
      </mesh>
    </group>
  );
};

