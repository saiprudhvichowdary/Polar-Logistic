import React, { useState } from 'react';
import {
  Zap,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Truck,
  Activity,
  Calendar,
  Layers
} from 'lucide-react';
import { Asset, Conflict, MaintenanceRecord, Expedition } from '../types';

interface AssetsViewProps {
  assets: Asset[];
  conflicts: Conflict[];
  maintenanceRecords: MaintenanceRecord[];
  expeditions: Expedition[];
  onRepairGenerator: (assetId: string) => void;
  onResolveConflict: (conflictId: string, assignedToExpeditionId: string) => void;
  isLoading: boolean;
  highlightAssetId?: string;
}

export const AssetsView: React.FC<AssetsViewProps> = ({
  assets,
  conflicts,
  maintenanceRecords,
  expeditions,
  onRepairGenerator,
  onResolveConflict,
  isLoading,
  highlightAssetId
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(highlightAssetId || 'asset-gen-001');
  const [conflictToResolve, setConflictToResolve] = useState<Conflict | null>(null);
  const [selectedResolutionExpId, setSelectedResolutionExpId] = useState<string>('exp-beta');

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
  const activeConflicts = conflicts.filter(c => c.status === 'detected');
  const vhc99Conflict = conflicts.find(c => c.entity_id === 'asset-vhc-99' && c.status === 'detected');

  return (
    <div className="space-y-4" id="assets-hardware-module">
      {/* Active Conflict Banner if VHC-99 is in contention */}
      {vhc99Conflict && (
        <div className="bg-[#F0883E]/10 border border-[#F0883E]/40 rounded-sm p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-[#F0883E] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40 font-bold uppercase tracking-wider">
                  ALLOCATION CONFLICT DETECTED
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">Asset VHC-99 (Polar Snowcat 600)</span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                Asset is double-booked concurrently for Expedition Beta (Ridge Traverse) and Expedition Gamma (Meteorite Recon).
              </p>
            </div>
          </div>

          <button
            id="btn-trigger-resolve-conflict"
            onClick={() => {
              setConflictToResolve(vhc99Conflict);
              setSelectedResolutionExpId('exp-beta');
            }}
            className="px-3.5 py-1.5 rounded-sm bg-white hover:bg-slate-200 text-black font-bold text-xs shadow transition uppercase tracking-wider whitespace-nowrap"
          >
            RESOLVE ALLOCATION CONFLICT
          </button>
        </div>
      )}

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {assets.map(asset => {
          const isFaulty = asset.current_status === 'faulty';
          const isSelected = selectedAsset?.id === asset.id;
          const hasConflict = activeConflicts.some(c => c.entity_id === asset.id);

          return (
            <div
              key={asset.id}
              id={`asset-card-${asset.serial_number.toLowerCase()}`}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`p-4 rounded-sm border transition cursor-pointer font-mono ${
                isSelected
                  ? 'border-[#58A6FF] bg-[#161B22] shadow-xl'
                  : 'border-subtle bg-panel hover:bg-[#161B22]/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2 font-mono">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-[#F0883E]" />
                  {asset.serial_number}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                  isFaulty
                    ? 'bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40 animate-pulse'
                    : hasConflict
                    ? 'bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40'
                    : 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
                }`}>
                  {isFaulty ? 'FAULTY / OFFLINE' : hasConflict ? 'CONFLICT FLAGGED' : asset.current_status}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{asset.name}</h4>
              <p className="text-[11px] text-[#8B949E] font-mono mb-3">{asset.category}</p>

              <div className="pt-2 border-t border-subtle text-xs font-mono flex items-center justify-between text-[#8B949E]">
                <span className="text-[11px]">Runtime: {asset.operational_hours} hrs</span>
                {isFaulty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRepairGenerator(asset.id);
                    }}
                    className="px-2.5 py-1 rounded-sm bg-[#F0883E]/15 hover:bg-[#F0883E]/30 text-[#F0883E] border border-[#F0883E]/40 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Repair Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Asset Detailed Diagnostics */}
      {selectedAsset && (
        <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl font-mono">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-subtle">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-[#58A6FF] bg-[#58A6FF]/15 px-2 py-0.5 rounded-sm border border-[#58A6FF]/40 font-bold uppercase tracking-wider">
                  {selectedAsset.serial_number}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                  {selectedAsset.name}
                </h3>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                Model: {selectedAsset.asset_type_name} | Location: Sector 7 Base Hub
              </p>
            </div>

            {selectedAsset.current_status === 'faulty' && (
              <button
                id="btn-asset-repair-action"
                onClick={() => onRepairGenerator(selectedAsset.id)}
                disabled={isLoading}
                className="px-4 py-2 rounded-sm bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider shadow transition flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>EXECUTE EMERGENCY REPAIR &amp; OVERHAUL</span>
              </button>
            )}
          </div>

          {/* Telemetry Sensor Dashboard */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#58A6FF]" />
              Real-Time Sensor Telemetry Diagnostics
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              {Object.entries(selectedAsset.telemetry || {}).map(([key, val]) => (
                <div key={key} className="p-3 rounded-sm bg-[#0d1117] border border-subtle">
                  <span className="text-[#8B949E] block text-[10px] uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                  <span className={`text-sm font-bold ${
                    String(val).includes('ERR') || (typeof val === 'number' && key.includes('psi') && val < 20)
                      ? 'text-[#F85149]'
                      : 'text-white'
                  }`}>
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Records Table (Audit History) */}
          <div className="mt-4 pt-4 border-t border-subtle">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B949E]" />
              Asset Maintenance Audit History (Preserved Immutable Log)
            </h4>

            <div className="divide-y divide-subtle rounded-sm bg-[#0d1117] border border-subtle overflow-hidden text-xs">
              {maintenanceRecords
                .filter(m => m.asset_id === selectedAsset.id)
                .map(rec => (
                  <div key={rec.id} className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{rec.maintenance_type}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-sm font-bold uppercase tracking-wider ${
                          rec.status === 'completed' ? 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40' : 'bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40'
                        }`}>
                          {rec.status}
                        </span>
                        <span className="text-[#8B949E] text-[11px]">Tech: {rec.technician}</span>
                      </div>
                      <p className="text-[#8B949E] mt-1">{rec.description}</p>
                      {rec.parts_replaced && (
                        <p className="text-[11px] text-[#58A6FF] mt-0.5">Parts: {rec.parts_replaced}</p>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8B949E] shrink-0">
                      Logged: {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Conflict Resolution Dialog/Modal */}
      {conflictToResolve && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#F0883E] rounded-sm max-w-lg w-full p-5 font-mono shadow-2xl">
            <div className="flex items-center gap-2 text-[#F0883E] mb-3">
              <AlertOctagon className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Resolve Double-Booking Conflict: Asset VHC-99
              </h3>
            </div>
            <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
              Asset <span className="text-[#58A6FF] font-bold">VHC-99 Polar Snowcat 600</span> is scheduled concurrently for Expedition Beta (Waypost Echo Ridge) and Expedition Gamma (Meteorite Field Recon). Select which mission takes priority. The secondary mission will have its departure window staggered by 10 days.
            </p>

            <div className="space-y-2 mb-5">
              <label
                onClick={() => setSelectedResolutionExpId('exp-beta')}
                className={`p-3 rounded-sm border block cursor-pointer transition ${
                  selectedResolutionExpId === 'exp-beta'
                    ? 'border-[#58A6FF] bg-[#58A6FF]/10'
                    : 'border-subtle bg-[#0d1117] hover:bg-[#21262d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Award to Expedition Beta (Seismic Ridge)</span>
                  <span className="text-[10px] text-[#3FB950] uppercase font-bold">High Priority</span>
                </div>
                <p className="text-[11px] text-[#8B949E] mt-1">
                  Keep active seismic array schedule on track along Waypost Echo pass.
                </p>
              </label>

              <label
                onClick={() => setSelectedResolutionExpId('exp-gamma')}
                className={`p-3 rounded-sm border block cursor-pointer transition ${
                  selectedResolutionExpId === 'exp-gamma'
                    ? 'border-[#58A6FF] bg-[#58A6FF]/10'
                    : 'border-subtle bg-[#0d1117] hover:bg-[#21262d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Award to Expedition Gamma (Meteorite Recon)</span>
                  <span className="text-[10px] text-[#8B949E] uppercase font-bold">Standard Priority</span>
                </div>
                <p className="text-[11px] text-[#8B949E] mt-1">
                  Re-assign vehicle to Outpost Delta blue ice sweep; stagger Beta schedule.
                </p>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-subtle">
              <button
                onClick={() => setConflictToResolve(null)}
                className="px-3.5 py-1.5 rounded-sm bg-[#21262d] hover:bg-[#30363d] text-[#C9D1D9] text-xs uppercase font-mono tracking-wider border border-subtle"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-resolve-conflict"
                onClick={() => {
                  onResolveConflict(conflictToResolve.id, selectedResolutionExpId);
                  setConflictToResolve(null);
                }}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-sm bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider transition font-mono"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
