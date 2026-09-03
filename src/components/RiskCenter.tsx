import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Filter,
  ShieldCheck,
  Zap,
  Truck,
  Box,
  Radio,
  Clock
} from 'lucide-react';
import { RiskAlert, AlertSeverity } from '../types';

interface RiskCenterProps {
  alerts: RiskAlert[];
  onNavigateToObject: (type: string, id: string) => void;
  onResolveAlert: (alertId: string) => void;
  onQuickAction?: (actionType: string, payload: any) => void;
  isLoading?: boolean;
}

export const RiskCenter: React.FC<RiskCenterProps> = ({
  alerts,
  onNavigateToObject,
  onResolveAlert,
  onQuickAction,
  isLoading
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [showResolved, setShowResolved] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.is_resolved) return false;
    if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.message.toLowerCase().includes(q) ||
        alert.category.toLowerCase().includes(q) ||
        alert.affected_object_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/40 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F85149] animate-ping" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#F0883E]/10 text-[#F0883E] border border-[#F0883E]/40 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0883E]" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#DBAB09]/10 text-[#DBAB09] border border-[#DBAB09]/40 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DBAB09]" />
            MEDIUM
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/40 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#58A6FF]" />
            INFO
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cargo Delayed':
        return <Truck className="w-3.5 h-3.5 text-[#F0883E]" />;
      case 'Inventory Shortage':
        return <Box className="w-3.5 h-3.5 text-[#F85149]" />;
      case 'Asset Fault':
      case 'Asset Allocation Conflict':
        return <Zap className="w-3.5 h-3.5 text-[#F0883E]" />;
      case 'Offline Sync Pending':
        return <Radio className="w-3.5 h-3.5 text-[#58A6FF]" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-[#8B949E]" />;
    }
  };

  const criticalCount = alerts.filter(a => !a.is_resolved && a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => !a.is_resolved && a.severity === 'HIGH').length;
  const mediumCount = alerts.filter(a => !a.is_resolved && a.severity === 'MEDIUM').length;
  const infoCount = alerts.filter(a => !a.is_resolved && a.severity === 'INFO').length;

  return (
    <section className="bg-panel border border-subtle rounded-sm overflow-hidden shadow-xl" id="centralized-risk-center">
      {/* Header & Category Filtering */}
      <div className="p-4 border-b border-subtle flex flex-wrap items-center justify-between gap-3 bg-[#0d1117]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F85149] animate-pulse"></span>
            <h2 className="text-xs font-black text-white font-mono tracking-[0.2em] uppercase">
              ALERTS &amp; RISK CENTER
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#21262d] text-[#C9D1D9] font-mono border border-subtle">
              {alerts.filter(a => !a.is_resolved).length} ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-[#8B949E] mt-0.5">
            Click any alert row or &apos;Investigate&apos; button to drill down directly to the affected asset, shipment, expedition, or inventory item.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono">
          <button
            id="filter-severity-all"
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-2.5 py-1 rounded-sm transition border text-[11px] uppercase tracking-wider ${
              selectedSeverity === 'ALL'
                ? 'bg-[#30363d] text-white border-slate-500 font-bold'
                : 'bg-[#21262d]/70 text-[#8B949E] hover:text-[#C9D1D9] border-subtle'
            }`}
          >
            ALL ({alerts.length})
          </button>
          <button
            id="filter-severity-critical"
            onClick={() => setSelectedSeverity('CRITICAL')}
            className={`px-2.5 py-1 rounded-sm transition border text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
              selectedSeverity === 'CRITICAL'
                ? 'bg-[#F85149]/20 text-[#F85149] border-[#F85149] font-bold'
                : 'bg-[#21262d]/70 text-[#8B949E] hover:text-[#F85149] border-subtle'
            }`}
          >
            <span>Critical</span>
            <span className="bg-[#F85149]/30 text-[#F85149] px-1 rounded-sm text-[9px]">{criticalCount}</span>
          </button>
          <button
            id="filter-severity-high"
            onClick={() => setSelectedSeverity('HIGH')}
            className={`px-2.5 py-1 rounded-sm transition border text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
              selectedSeverity === 'HIGH'
                ? 'bg-[#F0883E]/20 text-[#F0883E] border-[#F0883E] font-bold'
                : 'bg-[#21262d]/70 text-[#8B949E] hover:text-[#F0883E] border-subtle'
            }`}
          >
            <span>High</span>
            <span className="bg-[#F0883E]/30 text-[#F0883E] px-1 rounded-sm text-[9px]">{highCount}</span>
          </button>
          <button
            id="filter-severity-medium"
            onClick={() => setSelectedSeverity('MEDIUM')}
            className={`px-2.5 py-1 rounded-sm transition border text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
              selectedSeverity === 'MEDIUM'
                ? 'bg-[#DBAB09]/20 text-[#DBAB09] border-[#DBAB09] font-bold'
                : 'bg-[#21262d]/70 text-[#8B949E] hover:text-[#DBAB09] border-subtle'
            }`}
          >
            <span>Medium</span>
            <span className="bg-[#DBAB09]/30 text-[#DBAB09] px-1 rounded-sm text-[9px]">{mediumCount}</span>
          </button>
          <button
            id="filter-severity-info"
            onClick={() => setSelectedSeverity('INFO')}
            className={`px-2.5 py-1 rounded-sm transition border text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
              selectedSeverity === 'INFO'
                ? 'bg-[#58A6FF]/20 text-[#58A6FF] border-[#58A6FF] font-bold'
                : 'bg-[#21262d]/70 text-[#8B949E] hover:text-[#58A6FF] border-subtle'
            }`}
          >
            <span>Info</span>
            <span className="bg-[#58A6FF]/30 text-[#58A6FF] px-1 rounded-sm text-[9px]">{infoCount}</span>
          </button>

          <label className="flex items-center gap-1.5 ml-2 cursor-pointer text-[#8B949E] hover:text-[#C9D1D9] text-[11px]">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={e => setShowResolved(e.target.checked)}
              className="rounded-sm bg-[#161B22] border-subtle text-[#58A6FF] focus:ring-0"
            />
            <span>Show Resolved</span>
          </label>
        </div>
      </div>

      {/* Alert List */}
      <div className="divide-y divide-subtle max-h-[460px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-[#8B949E]">
            <ShieldCheck className="w-10 h-10 text-[#3FB950] mx-auto mb-2 opacity-80" />
            <p className="font-mono text-sm">No active alerts match this filter.</p>
            <p className="text-xs text-[#8B949E] mt-1">Operational condition telemetry nominal in this bracket.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';
            const isMedium = alert.severity === 'MEDIUM';

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`p-4 transition hover:bg-[#21262d]/40 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  alert.is_resolved
                    ? 'opacity-40 bg-transparent'
                    : isCritical
                    ? 'border-l-2 border-critical bg-critical-subtle'
                    : isHigh
                    ? 'border-l-2 border-high bg-high-subtle'
                    : isMedium
                    ? 'border-l-2 border-medium bg-medium-subtle'
                    : 'border-l-2 border-info bg-info-subtle'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    {getSeverityBadge(alert.severity)}
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#C9D1D9] bg-[#21262d] px-2 py-0.5 rounded-sm border border-subtle">
                      {getCategoryIcon(alert.category)}
                      {alert.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#8B949E] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {alert.is_resolved && (
                      <span className="text-xs text-[#3FB950] font-mono font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RESOLVED {alert.resolved_by ? `by ${alert.resolved_by}` : ''}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                    {alert.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#8B949E] leading-relaxed">
                    {alert.message}
                  </p>

                  {alert.action_required && !alert.is_resolved && (
                    <div className="mt-2 text-[10px] font-mono text-[#F0883E] bg-[#F0883E]/10 border border-[#F0883E]/30 px-2 py-0.5 rounded-sm inline-block">
                      <span className="font-bold">ACTION:</span> {alert.action_required}
                    </div>
                  )}
                </div>

                {/* Direct Drill-down and Resolution Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    id={`btn-investigate-${alert.id}`}
                    onClick={() => onNavigateToObject(alert.affected_object_type, alert.affected_object_id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#C9D1D9] border border-subtle rounded-sm text-xs font-mono transition active:scale-95 shadow-sm"
                    title={`Go directly to affected ${alert.affected_object_type}`}
                  >
                    <span>INVESTIGATE OBJECT</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#58A6FF]" />
                  </button>

                  {!alert.is_resolved && (
                    <button
                      id={`btn-resolve-${alert.id}`}
                      onClick={() => onResolveAlert(alert.id)}
                      disabled={isLoading}
                      className="px-2.5 py-1.5 bg-[#3FB950]/15 hover:bg-[#3FB950]/30 text-[#3FB950] border border-[#3FB950]/40 rounded-sm text-xs font-mono transition"
                      title="Mark this risk alert as addressed/resolved"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer bar with quick summary */}
      <div className="px-4 py-2 bg-[#0d1117] border-t border-subtle text-[11px] font-mono text-[#8B949E] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="text-[#C9D1D9]">Target Object Links: Active</span>
          <span className="text-[#30363d]">|</span>
          <span className="text-[#F85149]">Station Condition Primacy: Enforced</span>
        </div>
        <span className="text-[#8B949E]">Autonomous Recheck Interval: 30s</span>
      </div>
    </section>
  );
};
