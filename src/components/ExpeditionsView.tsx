import React, { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Users,
  Box,
  Zap,
  ArrowRight,
  TrendingDown,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { Expedition, Asset, Personnel, Cargo, Conflict } from '../types';

interface ExpeditionsViewProps {
  expeditions: Expedition[];
  assets: Asset[];
  personnel: Personnel[];
  cargo: Cargo[];
  conflicts: Conflict[];
  onFlagReplanning: (expeditionId: string) => void;
  onEnforceStationPrimacy: () => void;
  isLoading: boolean;
  selectedExpeditionId?: string;
}

export const ExpeditionsView: React.FC<ExpeditionsViewProps> = ({
  expeditions,
  assets,
  personnel,
  cargo,
  conflicts,
  onFlagReplanning,
  onEnforceStationPrimacy,
  isLoading,
  selectedExpeditionId: initialSelectedId
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId || 'exp-alpha');

  const selectedExp = expeditions.find(e => e.id === selectedId) || expeditions[0];
  const assignedAssets = assets.filter(a => selectedExp?.allocated_asset_ids.includes(a.id));
  const assignedPersonnel = personnel.filter(p => selectedExp?.assigned_personnel_ids.includes(p.id));
  const assignedCargo = cargo.filter(c => selectedExp?.cargo_ids.includes(c.id));
  const relatedConflicts = conflicts.filter(
    c => c.expedition_a_id === selectedExp?.id || c.expedition_b_id === selectedExp?.id
  );

  return (
    <div className="space-y-4" id="expeditions-management-module">
      {/* Top Banner Explaining Station Primacy and Replanning */}
      <div className="bg-[#F0883E]/10 border border-[#F0883E]/40 rounded-sm p-3.5 text-xs font-mono text-[#F0883E] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#F0883E] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase tracking-wider">STATION OPERATIONAL PRIMACY PROTOCOL:</span>{' '}
          When Base Station Sector 7 experiences life-support deficits (such as GEN-001 failure or fuel buffer &lt; 15%), field expedition allocations are subjected to automatic replanning. Expedition Alpha has been designated for resource reclamation.
        </div>
      </div>

      {/* 3 Expeditions Grid Cards (Alpha, Beta, Gamma) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {expeditions.map(exp => {
          const isSelected = selectedExp?.id === exp.id;
          const isBelowThreshold = exp.readiness_score < 60;
          const isAlpha = exp.code === 'EXP-ALPHA';

          return (
            <div
              key={exp.id}
              id={`expedition-card-${exp.code.toLowerCase()}`}
              onClick={() => setSelectedId(exp.id)}
              className={`p-4 rounded-sm border transition cursor-pointer relative overflow-hidden font-mono ${
                isSelected
                  ? 'border-[#58A6FF] bg-[#161B22] shadow-xl'
                  : 'border-subtle bg-panel hover:bg-[#161B22]/70'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 text-[#58A6FF]" />
                  {exp.code}
                </span>

                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                  exp.status === 'replanning'
                    ? 'bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40 animate-pulse'
                    : exp.status === 'active'
                    ? 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
                    : 'bg-[#21262d] text-[#8B949E] border border-subtle'
                }`}>
                  {exp.status === 'replanning' ? 'REPLANNING REQUIRED' : exp.status}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white mb-1 leading-snug">
                {exp.name}
              </h4>
              <p className="text-[11px] text-[#8B949E] line-clamp-2 mb-3">
                {exp.objective}
              </p>

              {/* Readiness Score Gauge */}
              <div className="pt-2.5 border-t border-subtle">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#8B949E] text-[11px]">Readiness Score:</span>
                  <span className={`text-sm font-bold ${
                    isBelowThreshold ? 'text-[#F85149]' : 'text-[#3FB950]'
                  }`}>
                    {exp.readiness_score}% {isBelowThreshold ? '(CRITICAL)' : ''}
                  </span>
                </div>

                <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden relative">
                  {/* Threshold mark at 60% */}
                  <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-[#DBAB09] z-10" title="Threshold 60%" />
                  <div
                    className={`h-full ${
                      isBelowThreshold ? 'bg-[#F85149]' : 'bg-[#3FB950]'
                    }`}
                    style={{ width: `${exp.readiness_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-[#8B949E] mt-1.5">
                  <span>0%</span>
                  <span className="text-[#DBAB09] font-bold">THRESHOLD: 60%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Quick Badge for Station Primacy on Alpha */}
              {isAlpha && (
                <div className="mt-3 p-1.5 rounded-sm bg-[#F85149]/10 border border-[#F85149]/40 text-[10px] font-mono text-[#F85149] flex items-center justify-between">
                  <span className="font-bold tracking-wider uppercase">Station Primacy</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFlagReplanning(exp.id);
                    }}
                    className="px-2 py-0.5 rounded-sm bg-[#F85149] hover:bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider"
                  >
                    Flag Replan
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Expedition Deep Dive Details */}
      {selectedExp && (
        <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-subtle">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-[#58A6FF] bg-[#58A6FF]/15 px-2 py-0.5 rounded-sm border border-[#58A6FF]/40 font-bold uppercase tracking-wider">
                  {selectedExp.code}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wide">
                  {selectedExp.name}
                </h3>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                Lead: <span className="text-[#C9D1D9] font-semibold">{selectedExp.lead_officer}</span> | Hazard Class: <span className="text-[#F0883E] font-semibold">{selectedExp.hazard_class}</span>
              </p>
            </div>

            {/* Actions for this expedition */}
            <div className="flex items-center gap-2">
              <button
                id="btn-expedition-flag-replanning"
                onClick={() => onFlagReplanning(selectedExp.id)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-sm bg-[#F0883E]/10 hover:bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40 text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>FLAG ALLOCATION FOR REPLANNING</span>
              </button>

              {selectedExp.code === 'EXP-ALPHA' && (
                <button
                  id="btn-expedition-reclaim-resources"
                  onClick={onEnforceStationPrimacy}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-sm bg-white hover:bg-slate-200 text-black text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow"
                >
                  <span>RECLAIM RESOURCES</span>
                </button>
              )}
            </div>
          </div>

          {/* Readiness Breakdown Engine Matrix */}
          <div className="mt-4 p-4 rounded-sm bg-[#0d1117] border border-subtle">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#58A6FF]" />
              Dynamic Readiness Engine Assessment Breakdown
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3">
              <div className="p-2.5 rounded-sm bg-[#161B22] border border-subtle">
                <span className="text-[#8B949E] block text-[10px] uppercase">Asset Health Score</span>
                <span className="text-base font-bold text-white">
                  {selectedExp.readiness_breakdown?.asset_health_score ?? 35}%
                </span>
              </div>
              <div className="p-2.5 rounded-sm bg-[#161B22] border border-subtle">
                <span className="text-[#8B949E] block text-[10px] uppercase">Cargo Readiness</span>
                <span className="text-base font-bold text-white">
                  {selectedExp.readiness_breakdown?.cargo_readiness_score ?? 50}%
                </span>
              </div>
              <div className="p-2.5 rounded-sm bg-[#161B22] border border-subtle">
                <span className="text-[#8B949E] block text-[10px] uppercase">Crew Staffing</span>
                <span className="text-base font-bold text-white">
                  {selectedExp.readiness_breakdown?.personnel_score ?? 85}%
                </span>
              </div>
              <div className="p-2.5 rounded-sm bg-[#161B22] border border-subtle">
                <span className="text-[#8B949E] block text-[10px] uppercase">Weather Risk Factor</span>
                <span className="text-base font-bold text-[#F0883E]">
                  {selectedExp.readiness_breakdown?.weather_risk_factor ?? 75}%
                </span>
              </div>
            </div>

            {/* Readiness Engine Issues Checklist */}
            {selectedExp.readiness_breakdown?.issues && selectedExp.readiness_breakdown.issues.length > 0 && (
              <div className="space-y-1.5 mt-2">
                <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-wider">Identified Readiness Deficits:</span>
                {selectedExp.readiness_breakdown.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-mono text-[#F85149] bg-[#F85149]/10 px-2.5 py-1.5 rounded-sm border border-[#F85149]/30">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F85149] shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabular Details of Allocated Assets, Personnel, and Cargo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Allocated Assets */}
            <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle font-mono text-xs">
              <h5 className="font-bold text-white mb-2.5 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Zap className="w-3.5 h-3.5 text-[#F0883E]" />
                Allocated Assets ({assignedAssets.length})
              </h5>
              {assignedAssets.length === 0 ? (
                <p className="text-[#8B949E] text-[11px]">No physical assets assigned.</p>
              ) : (
                <div className="space-y-2">
                  {assignedAssets.map(asset => (
                    <div key={asset.id} className="p-2.5 rounded-sm bg-[#161B22] border border-subtle flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-[11px]">{asset.serial_number}</span>
                        <p className="text-[10px] text-[#8B949E]">{asset.name}</p>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                        asset.current_status === 'faulty' ? 'bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40' : 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
                      }`}>
                        {asset.current_status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assigned Personnel */}
            <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle font-mono text-xs">
              <h5 className="font-bold text-white mb-2.5 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#58A6FF]" />
                Assigned Personnel ({assignedPersonnel.length})
              </h5>
              {assignedPersonnel.length === 0 ? (
                <p className="text-[#8B949E] text-[11px]">No officers currently assigned.</p>
              ) : (
                <div className="space-y-2">
                  {assignedPersonnel.map(person => (
                    <div key={person.id} className="p-2.5 rounded-sm bg-[#161B22] border border-subtle flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-[11px]">{person.full_name}</span>
                        <p className="text-[10px] text-[#8B949E]">{person.specialization}</p>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                        person.fitness_for_duty === 'fatigued' ? 'bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40' : 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
                      }`}>
                        {person.fitness_for_duty}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cargo Manifests */}
            <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle font-mono text-xs">
              <h5 className="font-bold text-white mb-2.5 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Box className="w-3.5 h-3.5 text-[#F0883E]" />
                Cargo Manifests ({assignedCargo.length})
              </h5>
              {assignedCargo.length === 0 ? (
                <p className="text-[#8B949E] text-[11px]">No cargo packs staged.</p>
              ) : (
                <div className="space-y-2">
                  {assignedCargo.map(c => (
                    <div key={c.id} className="p-2.5 rounded-sm bg-[#161B22] border border-subtle">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{c.manifest_number}</span>
                        <span className="text-[#8B949E] text-[10px]">{c.total_weight_kg} kg</span>
                      </div>
                      <p className="text-[10px] text-[#8B949E] mt-0.5">{c.description}</p>
                      {c.is_hazmat && (
                        <span className="inline-block mt-1 text-[9px] bg-[#F85149]/20 text-[#F85149] px-1 rounded-sm border border-[#F85149]/40 font-bold uppercase">
                          HAZMAT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
