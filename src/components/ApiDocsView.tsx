import React from 'react';
import {
  FileCode2,
  Terminal,
  ShieldAlert,
  Server,
  Database,
  Layers,
  CheckCircle2,
  Cpu,
  Compass
} from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const endpoints = [
    { method: 'GET', path: '/api/overview', desc: 'Returns system-wide telemetry, operational conditions, and metric counters' },
    { method: 'GET', path: '/api/risk-center', desc: 'Returns risk alerts with filtering by severity, category, or resolved status' },
    { method: 'POST', path: '/api/risk-center/:id/resolve', desc: 'Marks a risk alert as resolved with audit trail logging' },
    { method: 'GET', path: '/api/expeditions', desc: 'Lists expeditions Alpha, Beta, Gamma with dynamic readiness engine scores' },
    { method: 'POST', path: '/api/expeditions/:id/flag-replanning', desc: 'Flags expedition allocation for replanning due to station priority' },
    { method: 'POST', path: '/api/station-primacy/reclaim-alpha', desc: 'Reclaims Expedition Alpha 800L fuel & personnel to Base Station Sector 7' },
    { method: 'GET', path: '/api/assets', desc: 'Lists mission assets with live sensor telemetry and maintenance records' },
    { method: 'POST', path: '/api/assets/:id/repair-generator', desc: 'Overhauls GEN-001 turbine seal and restores station dual power redundancy' },
    { method: 'GET', path: '/api/conflicts', desc: 'Returns detected asset and personnel double-booking conflicts' },
    { method: 'POST', path: '/api/conflicts/:id/resolve', desc: 'Resolves asset contention by awarding to priority expedition' },
    { method: 'GET', path: '/api/shipments', desc: 'Lists supply transports with tracking status, cargo manifests, and timeline events' },
    { method: 'POST', path: '/api/shipments/:id/reroute', desc: 'Reroutes grounded air flight to heavy sled surface traverse' },
    { method: 'GET', path: '/api/inventory', desc: 'Retrieves consumables stock, burn rate forecasts, and transaction history' },
    { method: 'GET', path: '/api/sync-events', desc: 'Retrieves offline field telemetry events pending satellite uplink' },
    { method: 'POST', path: '/api/sync-events/sync-all', desc: 'Executes burst synchronization of all cached offline packets into PostgreSQL' },
    { method: 'POST', path: '/api/database/reset', desc: 'Resets the system back to initial demo failure conditions' }
  ];

  return (
    <div className="space-y-4 font-mono text-xs" id="api-documentation-module">
      {/* Top Architecture Summary Card */}
      <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-[#58A6FF]" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Project AVALANCHE // Smart India Hackathon Architecture &amp; Guide
          </h3>
        </div>
        <p className="text-[#8B949E] leading-relaxed text-xs">
          AVALANCHE (Advanced Visual Logistics &amp; Asset Network for Complex Hazardous Environments) is an extreme-environment mission control logistics engine engineered for Arctic/Antarctic research stations. It enforces the immutable operational doctrine: <span className="text-[#DBAB09] font-bold">&quot;Station Operational Condition Takes Priority&quot;</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4 pt-3.5 border-t border-subtle">
          <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle">
            <span className="font-bold text-[#58A6FF] block mb-1 uppercase tracking-wider text-xs">1. Station Primacy Protocol</span>
            <p className="text-[#8B949E] text-[11px]">
              When station habitat heat, power, or fuel reserves fall below safety thresholds, the engine flags Expedition Alpha for resource replanning.
            </p>
          </div>
          <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle">
            <span className="font-bold text-[#58A6FF] block mb-1 uppercase tracking-wider text-xs">2. Centralized Risk Center</span>
            <p className="text-[#8B949E] text-[11px]">
              Categorizes alerts into 🔴 Critical, 🟠 High, 🟡 Medium, and 🟢 Info. Clicking any alert drills directly into the affected asset, shipment, or expedition.
            </p>
          </div>
          <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle">
            <span className="font-bold text-[#58A6FF] block mb-1 uppercase tracking-wider text-xs">3. Offline-Resilient Telemetry</span>
            <p className="text-[#8B949E] text-[11px]">
              Simulates rugged tablet queues that buffer telemetry during blizzard RF blackouts and burst-sync into PostgreSQL when connectivity resumes.
            </p>
          </div>
        </div>
      </div>

      {/* REST API Endpoints Specification */}
      <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-subtle">
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-[#58A6FF]" />
            Backend REST API Endpoints Specification
          </h4>
          <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">JSON API v1.0.0-sih</span>
        </div>

        <div className="divide-y divide-subtle">
          {endpoints.map((ep, i) => (
            <div key={i} className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-[#161B22]/60 px-1 transition">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider font-mono ${
                  ep.method === 'GET'
                    ? 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
                    : 'bg-[#58A6FF]/20 text-[#58A6FF] border border-[#58A6FF]/40'
                }`}>
                  {ep.method}
                </span>
                <span className="font-bold text-white">{ep.path}</span>
              </div>
              <span className="text-[#8B949E] text-[11px]">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment & Execution Instructions */}
      <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
        <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#58A6FF]" />
          Environment Setup &amp; Verification
        </h4>

        <div className="bg-[#0d1117] p-4 rounded-sm border border-subtle text-[11px] text-[#C9D1D9] font-mono space-y-2">
          <p><span className="text-[#58A6FF] font-bold"># Start the Mission Control Server &amp; UI</span></p>
          <p className="text-white font-bold">npm run dev</p>
          <p className="text-[#8B949E]">// Binds to port 3000 with Express REST API and Vite HMR middleware</p>
          <br />
          <p><span className="text-[#58A6FF] font-bold"># Build for Production Deployment</span></p>
          <p className="text-white font-bold">npm run build</p>
          <p className="text-[#8B949E]">// Compiles Vite frontend to dist/ and bundles server.ts into dist/server.cjs</p>
        </div>
      </div>
    </div>
  );
};
