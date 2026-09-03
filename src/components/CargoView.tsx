import React, { useState } from 'react';
import {
  Truck,
  Plane,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Navigation,
  Box,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Shipment, Cargo } from '../types';

interface CargoViewProps {
  shipments: Shipment[];
  cargo: Cargo[];
  onRerouteShipment: (shipmentId: string) => void;
  isLoading: boolean;
  highlightShipmentId?: string;
}

export const CargoView: React.FC<CargoViewProps> = ({
  shipments,
  cargo,
  onRerouteShipment,
  isLoading,
  highlightShipmentId
}) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    highlightShipmentId || 'ship-fuel-09'
  );

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];
  const selectedCargo = cargo.find(c => c.id === selectedShipment?.cargo_id);
  const delayedShipment = shipments.find(s => s.status === 'delayed');

  return (
    <div className="space-y-4 font-mono" id="cargo-tracking-module">
      {/* Delayed Shipment Notice Banner */}
      {delayedShipment && (
        <div className="bg-[#F85149]/10 border border-[#F85149]/40 rounded-sm p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F85149] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40 font-bold uppercase tracking-wider text-[10px]">
                  CRITICAL SUPPLY FLIGHT DELAYED
                </span>
                <span className="font-bold text-white">{delayedShipment.tracking_number}</span>
              </div>
              <p className="text-[#8B949E] mt-1 text-[11px]">
                {delayedShipment.delay_reason}
              </p>
            </div>
          </div>

          <button
            id="btn-reroute-shipment"
            onClick={() => onRerouteShipment(delayedShipment.id)}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-sm bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider shadow transition whitespace-nowrap flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>REROUTE VIA HEAVY SLED TRAVERSE</span>
          </button>
        </div>
      )}

      {/* Shipments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {shipments.map(ship => {
          const isDelayed = ship.status === 'delayed';
          const isSelected = selectedShipment?.id === ship.id;

          return (
            <div
              key={ship.id}
              id={`shipment-card-${ship.tracking_number.toLowerCase()}`}
              onClick={() => setSelectedShipmentId(ship.id)}
              className={`p-4 rounded-sm border transition cursor-pointer ${
                isSelected
                  ? 'border-[#58A6FF] bg-[#161B22] shadow-xl'
                  : 'border-subtle bg-panel hover:bg-[#161B22]/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-[#58A6FF]" />
                  {ship.tracking_number}
                </span>

                <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                  isDelayed
                    ? 'bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40 animate-pulse'
                    : 'bg-[#58A6FF]/20 text-[#58A6FF] border border-[#58A6FF]/40'
                }`}>
                  {ship.status}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{ship.cargo_desc}</h4>
              <p className="text-[11px] text-[#8B949E] mb-2">Carrier: {ship.carrier}</p>

              {isDelayed && (
                <div className="text-[10px] text-[#F85149] bg-[#F85149]/10 p-2 rounded-sm border border-[#F85149]/30 mb-2">
                  <span className="font-bold uppercase tracking-wider">Hold Reason:</span> {ship.delay_reason}
                </div>
              )}

              <div className="pt-2 border-t border-subtle text-[11px] text-[#8B949E] flex items-center justify-between">
                <span>Critical Supply: {ship.is_critical_supply ? 'YES (Station Primacy)' : 'NO'}</span>
                <span className="text-[#58A6FF]">Events: {ship.events.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Shipment Deep Dive & Timeline Events */}
      {selectedShipment && (
        <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-subtle">
            <div>
              <span className="text-[#58A6FF] bg-[#58A6FF]/15 px-2 py-0.5 rounded-sm border border-[#58A6FF]/40 font-bold uppercase tracking-wider text-[10px]">
                {selectedShipment.tracking_number}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mt-1.5">
                {selectedShipment.cargo_desc}
              </h3>
              <p className="text-[#8B949E] text-xs mt-0.5">
                Carrier: {selectedShipment.carrier} | Departure: {new Date(selectedShipment.departure_time).toLocaleDateString()}
              </p>
            </div>

            {selectedShipment.status === 'delayed' && (
              <button
                id="btn-shipment-reroute-action"
                onClick={() => onRerouteShipment(selectedShipment.id)}
                disabled={isLoading}
                className="px-4 py-2 rounded-sm bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider shadow transition flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>REROUTE TO SURFACE GROUND TRAVERSE</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Associated Cargo Manifest */}
            <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle">
              <h4 className="font-bold text-white mb-2.5 flex items-center gap-2 uppercase tracking-wider text-[11px]">
                <Box className="w-4 h-4 text-[#F0883E]" />
                Cargo Manifest Items
              </h4>

              {selectedCargo ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#8B949E] border-b border-subtle pb-1.5">
                    <span>Manifest: {selectedCargo.manifest_number}</span>
                    <span>Gross: {selectedCargo.total_weight_kg} kg</span>
                  </div>

                  {selectedCargo.items.map(item => (
                    <div key={item.id} className="p-2.5 rounded-sm bg-[#161B22] border border-subtle flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-[11px]">{item.item_name}</span>
                        <p className="text-[10px] text-[#8B949E]">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#58A6FF] text-xs">{item.quantity} {item.unit}</span>
                        <p className="text-[10px] text-[#8B949E]">{item.weight_kg} kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#8B949E]">Manifest data linked to central supply terminal.</p>
              )}
            </div>

            {/* Shipment Events & Waypoint Milestones (Audit Timeline) */}
            <div className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle">
              <h4 className="font-bold text-white mb-2.5 flex items-center gap-2 uppercase tracking-wider text-[11px]">
                <Clock className="w-4 h-4 text-[#58A6FF]" />
                Shipment Checkpoint Event Log (Immutable)
              </h4>

              <div className="relative pl-4 space-y-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#21262d]">
                {selectedShipment.events.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#58A6FF] border-2 border-[#0d1117]" />
                    <div className="text-white font-bold text-xs">{evt.event_type}</div>
                    <div className="text-[10px] text-[#8B949E]">{evt.location_name} | Logged by: {evt.logged_by}</div>
                    <p className="text-[11px] text-[#C9D1D9] mt-0.5">{evt.details}</p>
                    <span className="text-[9px] text-[#8B949E]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
