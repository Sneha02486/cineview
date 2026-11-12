import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SeatData } from '../../types';
import { CINEMA_HALL_CONFIG, SCREEN_CONFIG } from './cinemaGeometry';

interface CameraRigProps {
  targetSeat: SeatData | null;
  onTransitionComplete?: () => void;
}

export const CameraRig: React.FC<CameraRigProps> = ({ targetSeat }) => {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, SCREEN_CONFIG.screenCenter.y, SCREEN_CONFIG.screenCenter.z));
  const targetLookAt = new THREE.Vector3(0, SCREEN_CONFIG.screenCenter.y, SCREEN_CONFIG.screenCenter.z);

  useFrame((_, delta) => {
    // Determine the desired camera position
    let targetX = 0;
    let targetY = 3.2;
    let targetZ = 16.0;

    if (targetSeat) {
      targetX = targetSeat.posX;
      targetY = targetSeat.posY + CINEMA_HALL_CONFIG.eyeLevelOffset;
      targetZ = targetSeat.posZ;
    }

    const targetPos = new THREE.Vector3(targetX, targetY, targetZ);

    // Smooth exponential damping (frame-rate independent lerp)
    const lerpSpeed = Math.min(delta * 4.5, 0.25);
    camera.position.lerp(targetPos, lerpSpeed);

    // Smoothly orient camera towards the screen
    currentLookAt.current.lerp(targetLookAt, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

