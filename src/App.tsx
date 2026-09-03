import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { RiskCenter } from './components/RiskCenter';
import { TacticalMap } from './components/TacticalMap';
import { StationStatusCard } from './components/StationStatusCard';
import { ExpeditionsView } from './components/ExpeditionsView';
import { AssetsView } from './components/AssetsView';
import { CargoView } from './components/CargoView';
import { InventoryView } from './components/InventoryView';
import { OfflineSyncView } from './components/OfflineSyncView';
import { DatabaseExplorerView } from './components/DatabaseExplorerView';
import { ApiDocsView } from './components/ApiDocsView';
import { api } from './api/client';
import {
  OverviewData,
  RiskAlert,
  Expedition,
  Asset,
  Conflict,
  Cargo,
  Shipment,
  InventoryItem,
  InventoryTransaction,
  SyncEvent,
  Location,
  AuditLog
} from './types';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Core domain states
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Highlighted object state for direct drill-down from alerts
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string>('exp-alpha');
  const [highlightAssetId, setHighlightAssetId] = useState<string>('asset-gen-001');
  const [highlightShipmentId, setHighlightShipmentId] = useState<string>('ship-fuel-09');

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const loadAllData = useCallback(async () => {
    try {
      const [
        ovData,
        alertData,
        expData,
        assetData,
        confData,
        cargoData,
        shipData,
        invData,
        syncData,
        locData,
        personnelData,
        auditData
      ] = await Promise.all([
        api.getOverview(),
        api.getRiskAlerts(),
        api.getExpeditions(),
        api.getAssets(),
        api.getConflicts(),
        api.getCargo(),
        api.getShipments(),
        api.getInventory(),
        api.getSyncEvents(),
        api.getLocations(),
        api.getPersonnel(),
        api.getAuditLogs()
      ]);

      setOverview(ovData);
      setAlerts(alertData.alerts);
      setExpeditions(expData);
      setAssets(assetData.assets);
      setMaintenanceRecords(assetData.maintenanceRecords);
      setConflicts(confData);
      setCargo(cargoData);
      setShipments(shipData);
      setInventoryItems(invData.items);
      setInventoryTransactions(invData.transactions);
      setSyncEvents(syncData.events);
      setLocations(locData);
      setPersonnel(personnelData);
      setAuditLogs(auditData);
    } catch (err) {
      console.error('Failed to load mission data:', err);
      showToast('Error syncing with mission control server.', 'warning');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Direct drill-down handler from Risk Center
  const handleNavigateToObject = (type: string, id: string) => {
    switch (type) {
      case 'expedition':
        setSelectedExpeditionId(id);
        setActiveTab('expeditions');
        showToast(`Navigated directly to Expedition ${id.toUpperCase()}`, 'info');
        break;
      case 'asset':
        setHighlightAssetId(id);
        setActiveTab('assets');
        showToast(`Navigated directly to Asset ${id.toUpperCase()}`, 'info');
        break;
      case 'shipment':
        setHighlightShipmentId(id);
        setActiveTab('cargo');
        showToast(`Navigated directly to Shipment ${id.toUpperCase()}`, 'info');
        break;
      case 'inventory':
        setActiveTab('inventory');
        showToast('Navigated directly to Inventory Intelligence', 'info');
        break;
      case 'sync':
        setActiveTab('sync');
        showToast('Navigated directly to Offline Sync Resilience', 'info');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  // Operational Action 1: Enforce Station Primacy (Reclaim Expedition Alpha resources)
  const handleEnforceStationPrimacy = async () => {
    setIsActionLoading(true);
    try {
      const res = await api.reclaimStationResources('Cmdr. Elena Vance');
      showToast(`STATION PRIMACY ENFORCED: ${res.message}`, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reclaim resources', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 2: Flag Expedition for Replanning
  const handleFlagReplanning = async (expeditionId: string) => {
    setIsActionLoading(true);
    try {
      const res = await api.flagExpeditionReplanning(expeditionId, 'Station Commander');
      showToast(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to flag replanning', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 3: Repair Primary Generator GEN-001
  const handleRepairGenerator = async (assetId: string = 'asset-gen-001') => {
    setIsActionLoading(true);
    try {
      const res = await api.repairGenerator(assetId, 'Chief Eng. Tatyana Chen');
      showToast(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to overhaul generator', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 4: Resolve Asset Allocation Conflict
  const handleResolveConflict = async (conflictId: string, assignedToExpeditionId: string) => {
    setIsActionLoading(true);
    try {
      const res = await api.resolveConflict(conflictId, assignedToExpeditionId, 'Cmdr. Elena Vance');
      showToast(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve conflict', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 5: Reroute Grounded Flight to Surface Convoy
  const handleRerouteShipment = async (shipmentId: string) => {
    setIsActionLoading(true);
    try {
      const res = await api.rerouteShipment(shipmentId, 'Major Arjun Patel');
      showToast(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reroute shipment', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 6: Resolve an Individual Risk Alert
  const handleResolveAlert = async (alertId: string) => {
    setIsActionLoading(true);
    try {
      const res = await api.resolveAlert(alertId, 'Station Logistics Officer');
      showToast(`Alert [${alertId}] marked as resolved.`, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve alert', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 7: Sync a Single Offline Packet
  const handleSyncOne = async (id: string) => {
    setIsActionLoading(true);
    try {
      const res = await api.syncEvent(id, 'Field Radio Uplink');
      showToast(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to sync packet', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 8: Sync All Offline Packets
  const handleSyncAll = async () => {
    setIsActionLoading(true);
    try {
      const res = await api.syncAllPending('Satellite Burst Master');
      showToast(res.message, 'success');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to sync all packets', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Operational Action 9: Reset System Demo State
  const handleResetDemo = async () => {
    setIsActionLoading(true);
    try {
      const res = await api.resetDatabase();
      showToast(`DEMO RESET: ${res.message}`, 'info');
      await loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reset demo state', 'warning');
    } finally {
      setIsActionLoading(false);
    }
  };

  const gen001 = assets.find(a => a.serial_number === 'GEN-001' || a.id === 'asset-gen-001');
  const gen002 = assets.find(a => a.serial_number === 'GEN-002' || a.id === 'asset-gen-002');
  const fuelItem = inventoryItems.find(i => i.sku === 'SKU-FUEL-A1');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#C9D1D9] flex flex-col selection:bg-[#58A6FF] selection:text-black font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-12 right-5 z-50 animate-slide-up max-w-md">
          <div className={`p-3.5 rounded-sm border border-subtle shadow-2xl flex items-start gap-3 font-mono text-xs ${
            notification.type === 'success'
              ? 'bg-[#161B22] text-[#3FB950] border-[#3FB950]/50'
              : notification.type === 'warning'
              ? 'bg-[#161B22] text-[#F0883E] border-[#F0883E]/50'
              : 'bg-[#161B22] text-[#58A6FF] border-[#58A6FF]/50'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#3FB950] shrink-0 mt-0.5" />
            ) : notification.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-[#F0883E] shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-[#58A6FF] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-snug">{notification.message}</div>
            <button onClick={() => setNotification(null)} className="text-[#8B949E] hover:text-[#C9D1D9]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Mission Control Header */}
      <Header
        overview={overview}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onEnforceStationPrimacy={handleEnforceStationPrimacy}
        onResetDemo={handleResetDemo}
        isActionLoading={isActionLoading}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {isLoading ? (
          <div className="p-16 text-center text-[#8B949E] font-mono text-xs">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-[#58A6FF] border-t-transparent rounded-full mb-3" />
            <p>CONNECTING TO ARCTIC MISSION CONTROL RELATIONAL STORE...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-5 animate-fade-in">
                {/* 1. Vital Operational Primacy & Station Life Support */}
                <StationStatusCard
                  overview={overview}
                  generator001={gen001}
                  generator002={gen002}
                  fuelItem={fuelItem}
                  onEnforceStationPrimacy={handleEnforceStationPrimacy}
                  onRepairGenerator={() => handleRepairGenerator('asset-gen-001')}
                  isLoading={isActionLoading}
                />

                {/* 2. Centralized Risk Center with Drill-Down */}
                <RiskCenter
                  alerts={alerts}
                  onNavigateToObject={handleNavigateToObject}
                  onResolveAlert={handleResolveAlert}
                  isLoading={isActionLoading}
                />

                {/* 3. Tactical Vector Map of Extreme Operational Theater */}
                <TacticalMap
                  locations={locations}
                  shipments={shipments}
                />

                {/* 4. Recent Station Operations Audit Stream */}
                <div className="bg-[#161B22] border border-subtle rounded-sm p-4 font-mono text-xs shadow-xl">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-subtle">
                    <span className="font-bold text-white tracking-wider uppercase">OPERATIONAL AUDIT TRAIL (IMMUTABLE LOGS)</span>
                    <span className="text-[#8B949E] text-[10px] uppercase">Real-Time Append Only</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {auditLogs.slice(0, 6).map(log => (
                      <div key={log.id} className="flex items-center justify-between text-[#8B949E] hover:text-[#C9D1D9] py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#58A6FF]">[{log.category}]</span>
                          <span className="text-[#C9D1D9] font-bold">{log.action}:</span>
                          <span className="text-[#8B949E]">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-[#8B949E] shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString()} ({log.actor})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expeditions' && (
              <div className="animate-fade-in">
                <ExpeditionsView
                  expeditions={expeditions}
                  assets={assets}
                  personnel={personnel}
                  cargo={cargo}
                  conflicts={conflicts}
                  onFlagReplanning={handleFlagReplanning}
                  onEnforceStationPrimacy={handleEnforceStationPrimacy}
                  isLoading={isActionLoading}
                  selectedExpeditionId={selectedExpeditionId}
                />
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="animate-fade-in">
                <AssetsView
                  assets={assets}
                  conflicts={conflicts}
                  maintenanceRecords={maintenanceRecords}
                  expeditions={expeditions}
                  onRepairGenerator={handleRepairGenerator}
                  onResolveConflict={handleResolveConflict}
                  isLoading={isActionLoading}
                  highlightAssetId={highlightAssetId}
                />
              </div>
            )}

            {activeTab === 'cargo' && (
              <div className="animate-fade-in">
                <CargoView
                  shipments={shipments}
                  cargo={cargo}
                  onRerouteShipment={handleRerouteShipment}
                  isLoading={isActionLoading}
                  highlightShipmentId={highlightShipmentId}
                />
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="animate-fade-in">
                <InventoryView
                  items={inventoryItems}
                  transactions={inventoryTransactions}
                  isLoading={isActionLoading}
                  onEnforceStationPrimacy={handleEnforceStationPrimacy}
                />
              </div>
            )}

            {activeTab === 'sync' && (
              <div className="animate-fade-in">
                <OfflineSyncView
                  events={syncEvents}
                  onSyncOne={handleSyncOne}
                  onSyncAll={handleSyncAll}
                  isLoading={isActionLoading}
                />
              </div>
            )}

            {activeTab === 'database' && (
              <div className="animate-fade-in">
                <DatabaseExplorerView />
              </div>
            )}

            {activeTab === 'api-docs' && (
              <div className="animate-fade-in">
                <ApiDocsView />
              </div>
            )}
          </>
        )}
      </main>

      {/* Minimal Elegant Dark Footer */}
      <footer className="h-9 bg-black border-t border-subtle flex items-center px-4 sm:px-6 justify-between text-[10px] text-[#8B949E] font-mono tracking-widest uppercase">
        <div className="flex items-center gap-4 sm:gap-6">
          <span>PostgreSQL: Connection Stable</span>
          <span className="hidden sm:inline">Latency: 24ms</span>
          <span className="hidden md:inline">Power: 88%</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">AVALANCHE OPS v1.4.2</span>
          <span className="text-[#3FB950] font-bold">System Nominal</span>
        </div>
      </footer>
    </div>
  );
}
