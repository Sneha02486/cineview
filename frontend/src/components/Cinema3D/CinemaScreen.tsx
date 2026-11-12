import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SCREEN_CONFIG } from './cinemaGeometry';

interface CinemaScreenProps {
  movieTitle?: string;
  backdropUrl?: string;
}

export const CinemaScreen: React.FC<CinemaScreenProps> = ({ backdropUrl }) => {
  // Create a subtly curved cinema screen geometry
  const curvedGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      SCREEN_CONFIG.width,
      SCREEN_CONFIG.height,
      48,
      16
    );
    const pos = geo.attributes.position;
    const curveRadius = SCREEN_CONFIG.curveRadius;

    // Apply cylindrical concave curve towards audience
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Curve equation: delta Z = -(x^2) / (2 * R)
      const curvedZ = -(x * x) / (2 * curveRadius);
      pos.setZ(i, curvedZ);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Frame geometry slightly larger than the screen
  const frameGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      SCREEN_CONFIG.width + 0.6,
      SCREEN_CONFIG.height + 0.6,
      48,
      16
    );
    const pos = geo.attributes.position;
    const curveRadius = SCREEN_CONFIG.curveRadius;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const curvedZ = -(x * x) / (2 * curveRadius) - 0.05;
      pos.setZ(i, curvedZ);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Procedural fallback or loaded movie texture
  const screenTexture = useMemo(() => {
    if (backdropUrl) {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      const tex = loader.load(backdropUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // High quality procedural cinema test pattern
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep space gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#0a0f1d');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#030712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Glowing nebula
    const radial = ctx.createRadialGradient(512, 256, 20, 512, 256, 320);
    radial.addColorStop(0, 'rgba(230, 30, 67, 0.8)');
    radial.addColorStop(0.4, 'rgba(99, 102, 241, 0.4)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1024, 512);

    // Cinema title text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('C I N E V I E W   I M A X', 512, 230);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px "Inter", sans-serif';
    ctx.fillText('SEE YOUR VIEW BEFORE YOU BOOK', 512, 280);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [backdropUrl]);

  return (
    <group position={SCREEN_CONFIG.position}>
      {/* Black Bezel Frame */}
      <mesh geometry={frameGeometry}>
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Main Curved Projection Screen */}
      <mesh geometry={curvedGeometry}>
        <meshStandardMaterial
          map={screenTexture}
          emissive="#ffffff"
          emissiveMap={screenTexture}
          emissiveIntensity={0.65}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Screen Light Projection into Auditorium */}
      <pointLight
        position={[0, 0, 2.0]}
        color="#c7d2fe"
        intensity={80}
        distance={25}
        decay={2}
      />
      <spotLight
        position={[0, 0, 1.0]}
        target-position={[0, 0, 15]}
        color="#e0e7ff"
        intensity={60}
        angle={Math.PI / 3}
        penumbra={0.6}
        distance={28}
      />

      {/* Stage Dais / Screen Base Platform */}
      <mesh position={[0, -SCREEN_CONFIG.height / 2 - 0.5, 0]}>
        <boxGeometry args={[SCREEN_CONFIG.width + 2, 0.8, 2.5]} />
        <meshStandardMaterial color="#111317" roughness={0.8} />
      </mesh>

      {/* Green Exit Signs on Side Walls */}
      <group position={[-SCREEN_CONFIG.width / 2 - 2.5, -SCREEN_CONFIG.height / 2 + 1.2, 0.5]}>
        <mesh>
          <boxGeometry args={[0.8, 0.4, 0.08]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.2} />
        </mesh>
      </group>
      <group position={[SCREEN_CONFIG.width / 2 + 2.5, -SCREEN_CONFIG.height / 2 + 1.2, 0.5]}>
        <mesh>
          <boxGeometry args={[0.8, 0.4, 0.08]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};

