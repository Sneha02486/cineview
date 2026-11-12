import { CameraSeatMetrics, SeatData } from '../../types';

export const SCREEN_CONFIG = {
  width: 17.0,
  height: 7.2,
  position: [0, 4.0, 1.5] as [number, number, number],
  curveRadius: 28.0, // Subtle curvature for IMAX realism
  screenCenter: { x: 0, y: 4.0, z: 1.5 },
};

export const CINEMA_HALL_CONFIG = {
  width: 24.0,
  depth: 30.0,
  height: 9.5,
  eyeLevelOffset: 0.85, // Eye level height above seat base
};

/**
 * Calculates scientific viewing metrics from a specific seat position
 */
export function calculateSeatMetrics(seat: SeatData): CameraSeatMetrics {
  const eyeX = seat.posX;
  const eyeY = seat.posY + CINEMA_HALL_CONFIG.eyeLevelOffset;
  const eyeZ = seat.posZ;

  const dx = eyeX - SCREEN_CONFIG.screenCenter.x;
  const dy = eyeY - SCREEN_CONFIG.screenCenter.y;
  const dz = eyeZ - SCREEN_CONFIG.screenCenter.z;

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Screen horizontal boundaries at screen plane (Z = 1.5)
  const halfWidth = SCREEN_CONFIG.width / 2;
  const angleLeft = Math.atan2(-halfWidth - eyeX, eyeZ - SCREEN_CONFIG.screenCenter.z);
  const angleRight = Math.atan2(halfWidth - eyeX, eyeZ - SCREEN_CONFIG.screenCenter.z);
  const horizontalAngleRad = Math.abs(angleRight - angleLeft);
  const horizontalAngleDeg = (horizontalAngleRad * 180) / Math.PI;

  // Vertical viewing tilt (angle to screen center)
  const verticalAngleRad = Math.atan2(SCREEN_CONFIG.screenCenter.y - eyeY, eyeZ - SCREEN_CONFIG.screenCenter.z);
  const verticalAngleDeg = (verticalAngleRad * 180) / Math.PI;

  // Rating commentary according to SMPTE / THX standards
  let comfortScore = 'Balanced Viewing';
  let recommendationNote = 'Standard comfortable viewing distance';

  if (horizontalAngleDeg >= 55) {
    comfortScore = 'Ultra-Immersive IMAX Zone';
    recommendationNote = 'Massive screen presence, fills peripheral vision';
  } else if (horizontalAngleDeg >= 42) {
    comfortScore = 'THX Certified Sweet Spot';
    recommendationNote = 'Director-preferred reference field of view & acoustic center';
  } else if (horizontalAngleDeg >= 32) {
    comfortScore = 'Comfortable Stadium Panorama';
    recommendationNote = 'Full-screen sightline with gentle eye motion';
  } else {
    comfortScore = 'High Angle Balcony Perspective';
    recommendationNote = 'Elevated wide view of the entire auditorium';
  }

  return {
    seatCode: seat.seatCode,
    row: seat.row,
    number: seat.number,
    type: seat.type,
    price: seat.price,
    distanceToScreen: Number(distance.toFixed(1)),
    horizontalViewingAngle: Number(horizontalAngleDeg.toFixed(1)),
    verticalViewingAngle: Number(verticalAngleDeg.toFixed(1)),
    comfortScore,
    recommendationNote,
  };
}

