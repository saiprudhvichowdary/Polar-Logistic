import React from 'react';
import {
  Radio,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Database,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { SyncEvent } from '../types';

interface OfflineSyncViewProps {
  events: SyncEvent[];
  onSyncOne: (id: string) => void;
  onSyncAll: () => void;
  isLoading: boolean;
}

export const OfflineSyncView: React.FC<OfflineSyncViewProps> = ({
  events,
  onSyncOne,
  onSyncAll,
  isLoading
}) => {
  const pendingEvents = events.filter(e => e.status === 'pending');
  const syncedEvents = events.filter(e => e.status === 'synced');

  return (
    <div className="space-y-4 font-mono text-xs" id="offline-sync-module">
      {/* Top Banner */}
      <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#58A6FF]" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              OFFLINE BUFFER &amp; ASYNCHRONOUS BURST SYNCHRONIZATION
            </h3>
          </div>
          <p className="text-[#8B949E] text-xs mt-1">
            Extreme Arctic conditions frequently sever low-earth orbit satellite links. Field units record local transactions in offline queues and burst-sync to the central PostgreSQL instance once link is re-established.
          </p>
        </div>

        {pendingEvents.length > 0 && (
          <button
            id="btn-sync-all-pending"
            onClick={onSyncAll}
            disabled={isLoading}
            className="px-4 py-2 rounded-sm bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider shadow transition flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>TRIGGER BURST SYNC ({pendingEvents.length} PENDING)</span>
          </button>
        )}
      </div>

      {/* Pending Queue */}
      <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-subtle">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F0883E]" />
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Pending Field Telemetry Queue ({pendingEvents.length})
            </h4>
          </div>
          <span className="text-[#8B949E] text-[10px] uppercase tracking-wider">Resilient local cache</span>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="p-8 text-center text-[#8B949E]">
            <CheckCircle2 className="w-8 h-8 text-[#3FB950] mx-auto mb-2" />
            <p className="font-bold text-white text-xs uppercase tracking-wider">All Field Queues Synchronized</p>
            <p className="text-[#8B949E] text-[11px] mt-1">
              Zero pending offline packets. Local database mirrors active telemetry.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingEvents.map(event => (
              <div
                key={event.id}
                id={`sync-card-${event.id}`}
                className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-sm bg-[#F0883E]/20 text-[#F0883E] border border-[#F0883E]/40 text-[9px] font-bold uppercase tracking-wider">
                      PENDING BURST
                    </span>
                    <span className="text-white font-bold">{event.client_device_id}</span>
                    <span className="text-[#8B949E]">[{event.origin_site}]</span>
                  </div>

                  <p className="text-[#8B949E] text-[11px]">
                    Action: <span className="text-[#58A6FF] font-bold">{event.action}</span> on entity <span className="text-white">{event.entity_type}</span>
                  </p>

                  <div className="bg-[#161B22] p-2.5 rounded-sm border border-subtle font-mono text-[10px] text-[#C9D1D9] overflow-x-auto max-w-xl">
                    <pre>{JSON.stringify(event.payload, null, 2)}</pre>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSyncOne(event.id)}
                    disabled={isLoading}
                    className="px-3.5 py-1.5 rounded-sm bg-[#21262d] hover:bg-[#30363d] text-white border border-subtle text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                  >
                    <span>Commit Packet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Synchronized History */}
      {syncedEvents.length > 0 && (
        <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-subtle">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Recent Synchronized Event Ledger ({syncedEvents.length})
              </h4>
            </div>
          </div>

          <div className="divide-y divide-subtle">
            {syncedEvents.map(event => (
              <div key={event.id} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white">{event.action}</span>
                  <span className="text-[#8B949E] ml-2">from {event.client_device_id} ({event.origin_site})</span>
                </div>
                <div className="text-[#3FB950] flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SYNCED {event.synced_at ? new Date(event.synced_at).toLocaleTimeString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
