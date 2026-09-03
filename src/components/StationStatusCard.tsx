import React from 'react';
import {
  ShieldAlert,
  Zap,
  Flame,
  AlertTriangle,
  HeartPulse,
  ArrowDownToLine,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import { OverviewData, Asset, InventoryItem } from '../types';

interface StationStatusCardProps {
  overview: OverviewData | null;
  generator001: Asset | undefined;
  generator002: Asset | undefined;
  fuelItem: InventoryItem | undefined;
  onEnforceStationPrimacy: () => void;
  onRepairGenerator: () => void;
  isLoading: boolean;
}

export const StationStatusCard: React.FC<StationStatusCardProps> = ({
  overview,
  generator001,
  generator002,
  fuelItem,
  onEnforceStationPrimacy,
  onRepairGenerator,
  isLoading
}) => {
  const fuelDays = fuelItem?.days_of_supply_remaining ?? 1.4;
  const fuelLiters = fuelItem?.quantity_on_hand ?? 3450;
  const isGen1Faulty = generator001?.current_status === 'faulty';
  const isFuelCritical = fuelDays < 2.0;

  return (
    <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl relative overflow-hidden" id="station-operational-condition">
      {/* Subtle coordinate dot grid background from Elegant Dark archetype */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#58A6FF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      {/* Top Title & Primacy Status */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-sm bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] glow-red">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white font-mono tracking-wider uppercase">
              BASE STATION SECTOR 7 // OPERATIONAL CONDITION
            </h3>
            <p className="text-[11px] text-[#F0883E] font-mono flex items-center gap-1.5 mt-0.5 uppercase tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0883E] animate-ping" />
              DIRECTIVE: STATION OPERATIONAL CONDITION TAKES PRIORITY OVER FIELD MISSIONS
            </p>
          </div>
        </div>

        <button
          id="btn-reclaim-alpha-action"
          onClick={onEnforceStationPrimacy}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-white hover:bg-slate-200 text-black font-mono text-xs font-bold uppercase tracking-wider shadow transition active:scale-95 disabled:opacity-50"
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>RECLAIM ALPHA ALLOCATIONS</span>
        </button>
      </div>

      {/* Grid of 3 Vital Systems */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. Life-Support Power Generation */}
        <div className={`p-3.5 rounded-sm border font-mono transition ${
          isGen1Faulty
            ? 'bg-[#F85149]/5 border-[#F85149]/50 glow-red'
            : 'bg-[#0d1117] border-subtle'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
            <span className="flex items-center gap-1.5 text-white font-bold tracking-wider uppercase text-[11px]">
              <Zap className="w-3.5 h-3.5 text-[#F0883E]" />
              450kW POWER GRID
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
              isGen1Faulty ? 'bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40' : 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
            }`}>
              {isGen1Faulty ? 'SINGLE REDUNDANCY' : 'DUAL REDUNDANCY'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8B949E]">GEN-001 (Core Turbo):</span>
              <span className={`font-bold ${isGen1Faulty ? 'text-[#F85149] flex items-center gap-1' : 'text-[#3FB950]'}`}>
                {isGen1Faulty ? 'ERR-TURBO-SEAL' : 'OPERATIONAL'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8B949E]">GEN-002 (Life Support):</span>
              <span className="text-[#3FB950] font-bold">ACTIVE (82% LOAD)</span>
            </div>
          </div>

          {isGen1Faulty && (
            <button
              onClick={onRepairGenerator}
              disabled={isLoading}
              className="w-full mt-3 py-1.5 px-2.5 rounded-sm bg-[#F0883E]/10 hover:bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
            >
              <Wrench className="w-3 h-3" />
              <span>DISPATCH REPAIR / RESTORE REDUNDANCY</span>
            </button>
          )}
        </div>

        {/* 2. Fuel Depletion & Burn Rate */}
        <div className={`p-3.5 rounded-sm border font-mono transition ${
          isFuelCritical
            ? 'bg-[#F0883E]/5 border-[#F0883E]/50 glow-amber'
            : 'bg-[#0d1117] border-subtle'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
            <span className="flex items-center gap-1.5 text-white font-bold tracking-wider uppercase text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#F85149]" />
              STATION DIESEL RESERVES
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
              isFuelCritical ? 'bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40 animate-pulse' : 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
            }`}>
              {isFuelCritical ? 'CRITICAL < 15%' : 'SUFFICIENT'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8B949E]">Days of Supply:</span>
              <span className={`text-base font-bold ${isFuelCritical ? 'text-[#F85149]' : 'text-[#3FB950]'}`}>
                {fuelDays.toFixed(1)} DAYS
              </span>
            </div>
            <div className="flex items-center justify-between text-[#8B949E] text-[11px]">
              <span>On Hand: {fuelLiters.toLocaleString()} L</span>
              <span>Burn: 2,400 L/day</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${isFuelCritical ? 'bg-[#F85149]' : 'bg-[#3FB950]'}`}
                style={{ width: `${Math.min(100, (fuelLiters / 5000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Expedition Alpha Impact Summary */}
        <div className="p-3.5 rounded-sm border border-subtle bg-[#0d1117] font-mono text-xs">
          <div className="flex items-center justify-between text-[#8B949E] mb-2">
            <span className="text-white font-bold tracking-wider uppercase text-[11px]">EXPEDITION ALPHA ALLOCATION</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40 font-bold uppercase tracking-wider">
              REPLANNING
            </span>
          </div>
          <p className="text-[11px] text-[#8B949E] leading-relaxed mb-2.5">
            Alpha holds 800L fuel &amp; primary mechanic Nadia Rostova. Station priority mandates pausing Alpha to safeguard Sector 7 heat during blizzard.
          </p>
          <div className="flex items-center justify-between text-[11px] text-[#8B949E] border-t border-subtle pt-2">
            <span>Readiness Score:</span>
            <span className="text-[#F85149] font-bold">42% (Threshold: 60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
