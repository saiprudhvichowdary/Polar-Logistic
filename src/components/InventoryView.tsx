import React, { useState } from 'react';
import {
  Box,
  Flame,
  AlertTriangle,
  HeartPulse,
  TrendingDown,
  History,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { InventoryItem, InventoryTransaction } from '../types';

interface InventoryViewProps {
  items: InventoryItem[];
  transactions: InventoryTransaction[];
  isLoading: boolean;
  onEnforceStationPrimacy: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  transactions,
  isLoading,
  onEnforceStationPrimacy
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const fuelItem = items.find(i => i.sku === 'SKU-FUEL-A1');
  const isFuelCritical = (fuelItem?.days_of_supply_remaining ?? 0) < 2.0;

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-4 font-mono text-xs" id="inventory-intelligence-module">
      {/* Fuel Burn Rate Alert Card */}
      {isFuelCritical && (
        <div className="bg-[#F85149]/10 border border-[#F85149]/40 rounded-sm p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Flame className="w-6 h-6 text-[#F85149] shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40 font-bold text-[10px] uppercase tracking-wider">
                  CRITICAL INVENTORY SHORTAGE PREDICTED
                </span>
                <span className="font-bold text-white text-xs sm:text-sm">Jet-A1 Polar Arctic Diesel Fuel</span>
              </div>
              <p className="text-[#8B949E] mt-1 text-[11px]">
                At current blizzard burn rate (2,400 L/day for base habitat heating), station fuel reserves will reach zero in{' '}
                <span className="text-[#F85149] font-bold">1.4 days ({fuelItem?.quantity_on_hand.toLocaleString()} Liters remaining)</span>. Station threshold is 5,000 Liters.
              </p>
            </div>
          </div>

          <button
            onClick={onEnforceStationPrimacy}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-sm bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider shadow transition whitespace-nowrap"
          >
            RECLAIM EXPEDITION ALLOCATION
          </button>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Fuel & Propellant', 'Rations & Water', 'Medical & Pharma', 'Life Support Consumable'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-sm transition whitespace-nowrap border text-xs uppercase tracking-wider font-mono ${
              selectedCategory === cat
                ? 'bg-[#21262d] text-white border-[#58A6FF] font-bold shadow-sm'
                : 'bg-panel text-[#8B949E] hover:text-white border-subtle'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredItems.map(item => {
          const isCritical = item.days_of_supply_remaining < 3.0;
          const isWarning = item.days_of_supply_remaining < 7.0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-sm border transition font-mono ${
                isCritical
                  ? 'bg-[#F85149]/10 border-[#F85149]/40'
                  : isWarning
                  ? 'bg-[#F0883E]/10 border-[#F0883E]/40'
                  : 'bg-panel border-subtle hover:bg-[#161B22]/70'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[#8B949E] text-[10px] uppercase tracking-wider">{item.sku}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                  isCritical ? 'bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/40 animate-pulse' : 'bg-[#21262d] text-[#8B949E] border border-subtle'
                }`}>
                  {isCritical ? 'DEFICIT' : 'NOMINAL'}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white mb-1 leading-snug">{item.name}</h4>
              <p className="text-[10px] text-[#8B949E] mb-3">{item.category}</p>

              <div className="space-y-1.5 pt-2 border-t border-subtle text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#8B949E]">Stock on Hand:</span>
                  <span className="font-bold text-white">
                    {item.quantity_on_hand.toLocaleString()} {item.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B949E]">Burn Rate:</span>
                  <span className="text-[#C9D1D9]">
                    {item.daily_burn_rate} {item.unit}/day
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B949E]">Days Remaining:</span>
                  <span className={`font-bold ${isCritical ? 'text-[#F85149]' : 'text-[#3FB950]'}`}>
                    {item.days_of_supply_remaining.toFixed(1)} Days
                  </span>
                </div>
              </div>

              {/* Progress bar compared to threshold */}
              <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full ${isCritical ? 'bg-[#F85149]' : 'bg-[#3FB950]'}`}
                  style={{
                    width: `${Math.min(100, (item.quantity_on_hand / (item.safety_stock_threshold * 1.5)) * 100)}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Ledger (Audit History) */}
      <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-subtle">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#58A6FF]" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Immutable Inventory Transactions Ledger
            </h3>
          </div>
          <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">Append-only audit trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-subtle text-[#8B949E] text-[10px] uppercase tracking-wider">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Balance After</th>
                <th className="pb-2">Authorized By</th>
                <th className="pb-2">Reference ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-[#161B22]/60">
                  <td className="py-2 text-[#8B949E] text-[11px]">
                    {new Date(tx.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-2 font-bold text-white">{tx.transaction_type}</td>
                  <td className={`py-2 font-bold ${tx.quantity < 0 ? 'text-[#F85149]' : 'text-[#3FB950]'}`}>
                    {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                  </td>
                  <td className="py-2 text-[#C9D1D9]">{tx.balance_after.toLocaleString()}</td>
                  <td className="py-2 text-[#8B949E]">{tx.authorized_by}</td>
                  <td className="py-2 text-[#8B949E]">{tx.reference_id || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
