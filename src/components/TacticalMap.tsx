import React, { useState } from 'react';
import {
  MapPin,
  Wind,
  Thermometer,
  Shield,
  Plane,
  Truck,
  AlertTriangle,
  Info,
  Layers,
  Compass
} from 'lucide-react';
import { Location, Shipment } from '../types';

interface TacticalMapProps {
  locations: Location[];
  shipments: Shipment[];
  onSelectLocation?: (loc: Location) => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  locations,
  shipments,
  onSelectLocation
}) => {
  const [selectedLocId, setSelectedLocId] = useState<string>('loc-base-07');
  const [showWeatherOverlay, setShowWeatherOverlay] = useState<boolean>(true);

  const selectedLoc = locations.find(l => l.id === selectedLocId) || locations[0];
  const delayedShipment = shipments.find(s => s.status === 'delayed');
  const inTransitShipment = shipments.find(s => s.status === 'in_transit');

  // Coordinates normalized for SVG viewport (800x420)
  const nodePositions: Record<string, { x: number; y: number; label: string }> = {
    'loc-base-07': { x: 380, y: 260, label: 'Sector 7 (Base Hub)' },
    'loc-wayp-ech': { x: 550, y: 170, label: 'Waypost Echo' },
    'loc-glac-rdg': { x: 670, y: 80, label: 'Glacier Ridge (Alpha)' },
    'loc-outp-dlt': { x: 160, y: 190, label: 'Outpost Delta (Runway)' }
  };

  return (
    <div className="bg-panel border border-subtle rounded-sm overflow-hidden shadow-xl" id="tactical-operations-map">
      <div className="p-3 border-b border-subtle bg-[#0d1117] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-[#58A6FF]" />
          <h3 className="text-xs sm:text-sm font-bold text-white font-mono tracking-wider uppercase">
            Tactical Operations &amp; Spatial Vector Grid
          </h3>
          <span className="text-[10px] font-mono text-[#58A6FF] bg-[#58A6FF]/10 border border-[#58A6FF]/30 px-2 py-0.5 rounded-sm uppercase tracking-wider">
            POLAR COORDINATE GRID
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
            className={`px-2.5 py-1 rounded-sm transition border flex items-center gap-1.5 text-[11px] uppercase tracking-wider ${
              showWeatherOverlay
                ? 'bg-[#58A6FF]/15 border-[#58A6FF]/50 text-[#58A6FF] font-bold'
                : 'bg-[#21262d] text-[#8B949E] border-subtle'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Radar Overlay: {showWeatherOverlay ? 'ACTIVE' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Vector Interactive Map Display */}
      <div className="relative w-full h-[320px] bg-[#0B0E14] tactical-grid overflow-hidden">
        {/* Topo lines & Radar sweep background effect */}
        <svg className="w-full h-full" viewBox="0 0 800 360">
          <defs>
            <radialGradient id="radarGlow" cx="45%" cy="60%" r="55%">
              <stop offset="0%" stopColor="#58A6FF" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#58A6FF" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#0B0E14" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="corridorDelayed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F85149" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F0883E" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="corridorActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#58A6FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3FB950" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background circular radar ranges */}
          <circle cx="380" cy="260" r="140" fill="none" stroke="#21262d" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="380" cy="260" r="260" fill="none" stroke="#21262d" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="380" cy="260" r="360" fill="url(#radarGlow)" />

          {/* Corridor Air Lift (Outpost Delta -> Sector 7) - DELAYED BY BLIZZARD */}
          <line
            x1="160"
            y1="190"
            x2="380"
            y2="260"
            stroke="url(#corridorDelayed)"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
          {/* Corridor Surface Traverse (Sector 7 -> Waypost Echo -> Glacier Ridge) */}
          <line
            x1="380"
            y1="260"
            x2="550"
            y2="170"
            stroke="url(#corridorActive)"
            strokeWidth="2.5"
          />
          <line
            x1="550"
            y1="170"
            x2="670"
            y2="80"
            stroke="#30363d"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Blizzard storm boundary simulation overlay */}
          {showWeatherOverlay && (
            <g opacity="0.4">
              <path
                d="M 120,120 Q 200,80 300,150 T 450,110 T 580,60 L 580,200 L 120,240 Z"
                fill="#F85149"
                opacity="0.12"
              />
              <text x="180" y="110" fill="#F85149" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.1em">
                POLAR SQUALL VORTEX (62 KTS)
              </text>
            </g>
          )}

          {/* Grounded Shipment SHIP-X marker */}
          {delayedShipment && (
            <g transform="translate(195, 180)">
              <circle cx="0" cy="0" r="12" fill="#F85149" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="7" fill="#F85149" />
              <text x="12" y="4" fill="#F85149" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                SHIP-X GROUNDED
              </text>
            </g>
          )}

          {/* Active Convoy Beta marker */}
          {inTransitShipment && (
            <g transform="translate(465, 215)">
              <circle cx="0" cy="0" r="5" fill="#58A6FF" />
              <text x="10" y="4" fill="#58A6FF" fontSize="10" fontFamily="JetBrains Mono">
                BETA CONVOY (18km/h)
              </text>
            </g>
          )}

          {/* Interactive Location Nodes */}
          {locations.map(loc => {
            const pos = nodePositions[loc.id] || { x: 400, y: 200, label: loc.name };
            const isSelected = selectedLocId === loc.id;
            const isBase = loc.id === 'loc-base-07';

            return (
              <g
                key={loc.id}
                onClick={() => {
                  setSelectedLocId(loc.id);
                  if (onSelectLocation) onSelectLocation(loc);
                }}
                className="cursor-pointer group"
              >
                {/* Node Ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isBase ? 15 : 11}
                  fill={isSelected ? '#1f6feb' : '#161B22'}
                  stroke={isSelected ? '#58A6FF' : isBase ? '#F0883E' : '#30363d'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200 group-hover:scale-110"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isBase ? 5 : 3.5}
                  fill={isBase ? '#F85149' : isSelected ? '#58A6FF' : '#8B949E'}
                />

                {/* Node Label Box */}
                <rect
                  x={pos.x - 60}
                  y={pos.y + 18}
                  width="120"
                  height="22"
                  rx="2"
                  fill="#0d1117"
                  stroke={isSelected ? '#58A6FF' : '#30363d'}
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x={pos.x}
                  y={pos.y + 32}
                  textAnchor="middle"
                  fill={isSelected ? '#58A6FF' : '#C9D1D9'}
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {pos.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Legend */}
        <div className="absolute top-2 left-2 bg-[#161B22]/90 backdrop-blur border border-subtle rounded-sm p-2 text-[10px] font-mono text-[#8B949E] space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F0883E]"></span>
            <span className="text-[#C9D1D9]">Base Station Hub (Primacy)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-[#F85149]"></span>
            <span>Airlift Corridor (Grounded)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-[#58A6FF]"></span>
            <span>Traverse Ground Trail (Active)</span>
          </div>
        </div>
      </div>

      {/* Selected Location Telemetry Bar */}
      {selectedLoc && (
        <div className="p-3 bg-[#0d1117] border-t border-subtle flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#58A6FF]" />
            <div>
              <span className="font-bold text-white">{selectedLoc.name}</span>
              <span className="text-[#8B949E] ml-2">[{selectedLoc.code}]</span>
            </div>
            <span className="px-2 py-0.5 rounded-sm bg-[#21262d] text-[#C9D1D9] border border-subtle text-[10px]">
              {selectedLoc.type}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#8B949E]">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span className="text-[#C9D1D9]">{selectedLoc.temp_celsius}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-[#F0883E]" />
              <span className="text-[#C9D1D9]">{selectedLoc.weather_condition}</span>
            </div>
            <div className="text-[#8B949E] text-[11px] hidden md:block">
              Alt: {selectedLoc.altitude_m}m | Coords: {selectedLoc.coords_lat.toFixed(2)}°, {selectedLoc.coords_long.toFixed(2)}°
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
