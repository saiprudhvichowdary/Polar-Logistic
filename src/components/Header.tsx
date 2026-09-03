import React from 'react';
import {
  ShieldAlert,
  Radio,
  RefreshCw,
  Zap,
  Flame,
  AlertTriangle,
  Compass,
  Box,
  Truck,
  Database,
  FileCode2,
  Server
} from 'lucide-react';
import { OverviewData } from '../types';

interface HeaderProps {
  overview: OverviewData | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onEnforceStationPrimacy: () => void;
  onResetDemo: () => void;
  isActionLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  overview,
  activeTab,
  setActiveTab,
  onEnforceStationPrimacy,
  onResetDemo,
  isActionLoading
}) => {
  const unresolvedAlerts = overview?.metrics.unresolved_alerts_count ?? 0;
  const criticalCount = overview?.metrics.critical_alerts ?? 0;
  const pendingSyncs = overview?.metrics.pending_offline_syncs ?? 0;
  const fuelDays = overview?.operational_condition.fuel_reserves_days ?? 1.4;
  const isPowerDegraded = overview?.operational_condition.base_station_status.includes('WARNING');

  const navItems = [
    { id: 'dashboard', label: 'Mission Control', icon: Compass },
    { id: 'expeditions', label: 'Expeditions (Alpha/Beta/Gamma)', icon: Radio, badge: overview?.metrics.expeditions_replanning ? '1 Replanning' : undefined },
    { id: 'assets', label: 'Assets & Hardware', icon: Zap, badge: overview?.metrics.active_conflicts ? '1 Conflict' : undefined },
    { id: 'cargo', label: 'Cargo & Shipments', icon: Truck, badge: overview?.metrics.delayed_shipments ? '1 Delayed' : undefined },
    { id: 'inventory', label: 'Inventory & Burn', icon: Box, badge: fuelDays < 2.0 ? 'Fuel <15%' : undefined },
    { id: 'sync', label: 'Offline Resilience', icon: Radio, badge: pendingSyncs > 0 ? `${pendingSyncs} Queue` : undefined },
    { id: 'database', label: 'PostgreSQL Schema', icon: Database },
    { id: 'api-docs', label: 'API & Architecture', icon: FileCode2 }
  ];

  return (
    <header className="border-b border-subtle bg-[#0d1117]/98 backdrop-blur sticky top-0 z-40">
      {/* Top Banner: Telemetry & Extreme Condition Status with Elegant Dark Header structure */}
      <div className="px-4 lg:px-6 py-3 border-b border-subtle flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Mission Directive */}
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 bg-[#3FB950] flex items-center justify-center font-bold text-black rounded-sm shadow-sm font-mono text-sm tracking-tighter shrink-0">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-widest uppercase text-white font-sans">
                Project Avalanche
              </h1>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F85149] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F85149]"></span>
              </span>
            </div>
            <p className="text-[10px] text-[#8B949E] font-mono uppercase tracking-tight">
              Mission Control // Station Operational Priority
            </p>
          </div>
        </div>

        {/* Telemetry Block */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6 font-mono text-[11px] ml-auto">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[#8B949E] text-[9px] tracking-wider">COORD</span>
            <span className="text-[#C9D1D9]">77.8489° S, 166.6683° E</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[#8B949E] text-[9px] tracking-wider">SYNC STATUS</span>
            <span className={pendingSyncs > 0 ? 'text-[#F0883E] font-bold' : 'text-[#3FB950]'}>
              {pendingSyncs > 0 ? `${pendingSyncs} UPDATES PENDING` : 'ALL SYNCHRONIZED'}
            </span>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-[#8B949E] text-[9px] tracking-wider">STATION WEATHER</span>
            <span className="text-[#58A6FF]">-46.5°C // 58 KTS // CAT 3</span>
          </div>

          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[#8B949E] text-[9px] tracking-wider">FUEL / POWER</span>
            <span className={fuelDays < 2.0 ? 'text-[#F85149] font-bold' : 'text-[#3FB950]'}>
              {fuelDays.toFixed(1)}d ({overview?.operational_condition.fuel_liters_on_hand.toLocaleString() ?? '3,450'}L) // {isPowerDegraded ? 'FAULT' : 'OK'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-enforce-station-primacy"
              onClick={onEnforceStationPrimacy}
              disabled={isActionLoading}
              title="Reclaim Expedition Alpha resources to Base Station Sector 7 to prevent critical power/fuel loss"
              className="flex items-center gap-1.5 bg-[#F85149] hover:bg-[#da3633] text-white font-mono font-bold px-3 py-1.5 rounded-sm border border-[#F85149]/60 shadow text-xs transition active:scale-95 disabled:opacity-50 tracking-wider uppercase glow-red"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ENFORCE PRIMACY</span>
            </button>

            <button
              id="btn-reset-demo"
              onClick={onResetDemo}
              disabled={isActionLoading}
              title="Reset system state back to initial Smart India Hackathon demo conditions"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-[#21262d] hover:bg-[#30363d] text-[#C9D1D9] border border-subtle text-xs font-mono transition"
            >
              <RefreshCw className={`w-3 h-3 ${isActionLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">RESET</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="px-4 lg:px-6 flex items-center justify-between overflow-x-auto no-scrollbar gap-1 pt-1 bg-[#0B0E14]/60">
        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition border-b-2 whitespace-nowrap rounded-t-sm ${
                  isActive
                    ? 'bg-[#161B22] text-white border-[#58A6FF] font-bold shadow-sm'
                    : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#161B22]/50 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#58A6FF]' : 'text-[#8B949E]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm font-bold uppercase ${
                    item.badge.includes('Replanning') || item.badge.includes('Fuel')
                      ? 'bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40'
                      : item.badge.includes('Conflict')
                      ? 'bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40'
                      : 'bg-[#58A6FF]/20 text-[#58A6FF] border border-[#58A6FF]/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#8B949E] pl-4 shrink-0">
          <span className="flex items-center gap-1.5 text-white">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F85149] animate-pulse"></span>
            <span className="text-[#F85149] font-bold">{criticalCount}</span> CRITICAL
          </span>
          <span className="text-[#30363d]">|</span>
          <span className="text-[#F0883E]">{unresolvedAlerts} TOTAL ALERTS</span>
        </div>
      </div>
    </header>
  );
};
