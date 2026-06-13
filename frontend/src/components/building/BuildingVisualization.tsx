import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FloorData } from '../../types';

interface Props {
  floors: FloorData[];
  onFloorSelect: (floor: FloorData | null) => void;
  selectedFloor: FloorData | null;
  viewMode: 'occupancy' | 'temperature' | 'cooling';
}

const getHeatColor = (value: number, max: number, mode: 'occupancy' | 'temperature' | 'cooling') => {
  const ratio = Math.min(value / max, 1);
  if (mode === 'occupancy') {
    if (ratio < 0.3) return '#00b87a';
    if (ratio < 0.6) return '#f7b928';
    if (ratio < 0.85) return '#ff8c42';
    return '#e0245e';
  }
  if (mode === 'temperature') {
    if (value < 21) return '#1e9df1';
    if (value < 23) return '#00b87a';
    if (value < 25) return '#f7b928';
    return '#e0245e';
  }
  // cooling
  if (ratio < 0.3) return '#b8d4e3';
  if (ratio < 0.6) return '#1e9df1';
  if (ratio < 0.85) return '#0d7dd6';
  return '#0a5ea0';
};

const getValue = (floor: FloorData, mode: 'occupancy' | 'temperature' | 'cooling') => {
  if (mode === 'occupancy') return { value: floor.totalOccupancy, max: floor.maxOccupancy };
  if (mode === 'temperature') return { value: floor.averageTemperature, max: 30 };
  return { value: floor.coolingIntensity, max: 100 };
};

export default function BuildingVisualization({ floors, onFloorSelect, selectedFloor, viewMode }: Props) {
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
  const sortedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);

  const buildingWidth = 320;
  const floorHeight = 62;
  const gap = 3;
  const roofHeight = 30;
  const totalHeight = sortedFloors.length * (floorHeight + gap) + roofHeight + 40;

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox={`0 0 ${buildingWidth + 80} ${totalHeight + 20}`}
        className="w-full max-w-md"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' }}
      >
        {/* Roof */}
        <motion.path
          d={`M ${40} ${roofHeight + 10} L ${buildingWidth / 2 + 40} ${10} L ${buildingWidth + 40} ${roofHeight + 10} Z`}
          fill="var(--color-surface-2)"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* Antenna */}
        <motion.line
          x1={buildingWidth / 2 + 40} y1={10} x2={buildingWidth / 2 + 40} y2={-10}
          stroke="var(--color-text-tertiary)" strokeWidth="2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4 }}
          style={{ transformOrigin: `${buildingWidth / 2 + 40}px 10px` }}
        />
        <motion.circle
          cx={buildingWidth / 2 + 40} cy={-14} r={4}
          fill="var(--color-primary)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
        />

        {/* Floors */}
        {sortedFloors.map((floor, i) => {
          const y = roofHeight + 14 + i * (floorHeight + gap);
          const { value, max } = getValue(floor, viewMode);
          const heatColor = getHeatColor(value, max, viewMode);
          const isHovered = hoveredFloor === floor.id;
          const isSelected = selectedFloor?.id === floor.id;
          const fillRatio = viewMode === 'occupancy'
            ? floor.totalOccupancy / floor.maxOccupancy
            : viewMode === 'temperature'
            ? (floor.averageTemperature - 18) / 12
            : floor.coolingIntensity / 100;

          return (
            <g
              key={floor.id}
              onMouseEnter={() => setHoveredFloor(floor.id)}
              onMouseLeave={() => setHoveredFloor(null)}
              onClick={() => onFloorSelect(isSelected ? null : floor)}
              style={{ cursor: 'pointer' }}
            >
              {/* Floor background */}
              <motion.rect
                x={40} y={y}
                width={buildingWidth} height={floorHeight}
                rx={8}
                fill="var(--color-surface-0)"
                stroke={isSelected ? 'var(--color-primary)' : isHovered ? 'var(--color-text-tertiary)' : 'var(--color-border)'}
                strokeWidth={isSelected ? 2 : 1}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              />

              {/* Heat fill */}
              <motion.rect
                x={41} y={y + 1}
                width={(buildingWidth - 2) * fillRatio}
                height={floorHeight - 2}
                rx={7}
                fill={heatColor}
                opacity={0.15}
                initial={{ width: 0 }}
                animate={{ width: (buildingWidth - 2) * fillRatio }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
              />

              {/* Floor number */}
              <text
                x={56} y={y + 22}
                fontSize={11}
                fontWeight={600}
                fill="var(--color-text-primary)"
                fontFamily="var(--font-sans)"
              >
                F{floor.floorNumber}
              </text>

              {/* Floor name */}
              <text
                x={56} y={y + 38}
                fontSize={10}
                fill="var(--color-text-tertiary)"
                fontFamily="var(--font-sans)"
              >
                {floor.name.split(' — ')[1] || floor.name}
              </text>

              {/* Zone indicators */}
              {floor.zones.slice(0, 5).map((zone, zi) => {
                const zoneColor = zone.hvacActive ? heatColor : 'var(--color-text-tertiary)';
                return (
                  <motion.rect
                    key={zone.id}
                    x={buildingWidth - 60 + zi * 18}
                    y={y + 14}
                    width={12} height={12}
                    rx={3}
                    fill={zoneColor}
                    opacity={zone.hvacActive ? 0.6 : 0.15}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.05 + zi * 0.03 }}
                  />
                );
              })}

              {/* Value label */}
              <text
                x={buildingWidth + 20} y={y + floorHeight / 2 + 4}
                fontSize={11}
                fontWeight={600}
                fill={heatColor}
                fontFamily="var(--font-mono)"
                textAnchor="start"
              >
                {viewMode === 'occupancy' && `${floor.totalOccupancy}`}
                {viewMode === 'temperature' && `${floor.averageTemperature}°`}
                {viewMode === 'cooling' && `${floor.coolingIntensity}%`}
              </text>

              {/* Hover tooltip */}
              <AnimatePresence>
                {isHovered && !isSelected && (
                  <motion.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <rect
                      x={buildingWidth / 2 - 40 + 40} y={y - 28}
                      width={80} height={22}
                      rx={6}
                      fill="var(--color-text-primary)"
                    />
                    <text
                      x={buildingWidth / 2 + 40} y={y - 13}
                      fontSize={10}
                      fill="var(--color-text-inverse)"
                      textAnchor="middle"
                      fontFamily="var(--font-sans)"
                      fontWeight={500}
                    >
                      Click to expand
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* Ground */}
        <rect
          x={20} y={totalHeight - 5}
          width={buildingWidth + 40} height={3}
          rx={1.5}
          fill="var(--color-border)"
        />
      </svg>
    </div>
  );
}
