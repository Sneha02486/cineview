import React from 'react';
import { SeatData } from '../../types';

interface AllSeatsProps {
  seats: SeatData[];
  selectedSeatIds: string[];
  previewSeatId?: string;
  onSeatClick?: (seat: SeatData) => void;
}

export const AllSeats: React.FC<AllSeatsProps> = ({
  seats,
  selectedSeatIds,
  previewSeatId,
  onSeatClick,
}) => {
  return (
    <group>
      {seats.map((seat) => {
        const isSelected = selectedSeatIds.includes(seat.id);
        const isPreview = previewSeatId === seat.id;
        const isOccupied = seat.isOccupied;

        // Determine seat material color
        let cushionColor = '#3b82f6'; // default available
        if (seat.type === 'VIP') cushionColor = '#8b5cf6';
        if (seat.type === 'PREMIUM') cushionColor = '#0284c7';

        if (isOccupied) {
          cushionColor = '#1f242e'; // dark muted occupied
        } else if (isSelected) {
          cushionColor = '#e61e43'; // vivid crimson selected
        }

        return (
          <group
            key={seat.id}
            position={[seat.posX, seat.posY, seat.posZ]}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOccupied && onSeatClick) {
                onSeatClick(seat);
              }
            }}
          >
            {/* Seat Base Pedestal */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.3, 12]} />
              <meshStandardMaterial color="#111318" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Seat Bottom Cushion */}
            <mesh position={[0, 0.32, 0.05]} castShadow receiveShadow>
              <boxGeometry args={[0.54, 0.12, 0.52]} />
              <meshStandardMaterial
                color={cushionColor}
                roughness={0.65}
                emissive={isSelected ? '#a3122e' : '#000000'}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>

            {/* Seat Backrest (Tilted slightly back) */}
            <mesh
              position={[0, 0.65, 0.26]}
              rotation={[-0.12, 0, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.52, 0.58, 0.12]} />
              <meshStandardMaterial
                color={cushionColor}
                roughness={0.65}
                emissive={isSelected ? '#e61e43' : '#000000'}
                emissiveIntensity={isSelected ? 0.35 : 0}
              />
            </mesh>

            {/* Headrest */}
            <mesh position={[0, 0.98, 0.22]} rotation={[-0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.42, 0.16, 0.14]} />
              <meshStandardMaterial color={cushionColor} roughness={0.7} />
            </mesh>

            {/* Left Armrest */}
            <mesh position={[-0.3, 0.42, 0.06]} castShadow>
              <boxGeometry args={[0.08, 0.08, 0.44]} />
              <meshStandardMaterial color="#181c25" metalness={0.4} roughness={0.5} />
            </mesh>

            {/* Right Armrest */}
            <mesh position={[0.3, 0.42, 0.06]} castShadow>
              <boxGeometry args={[0.08, 0.08, 0.44]} />
              <meshStandardMaterial color="#181c25" metalness={0.4} roughness={0.5} />
            </mesh>

            {/* Current Camera / Preview Seat Marker */}
            {isPreview && (
              <group position={[0, 1.25, 0.1]}>
                <mesh>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial color="#f59e0b" />
                </mesh>
                {/* Glowing beacon ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.22, 0.3, 24]} />
                  <meshBasicMaterial color="#fbbf24" side={2} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

