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
  AuditLog,
  Location
} from '../types';

export const api = {
  async getOverview(): Promise<OverviewData> {
    const res = await fetch('/api/overview');
    if (!res.ok) throw new Error('Failed to fetch overview');
    return res.json();
  },

  async getRiskAlerts(params?: { severity?: string; category?: string; resolved?: boolean }): Promise<{
    total: number;
    unresolved: number;
    alerts: RiskAlert[];
  }> {
    const query = new URLSearchParams();
    if (params?.severity) query.set('severity', params.severity);
    if (params?.category) query.set('category', params.category);
    if (params?.resolved !== undefined) query.set('resolved', String(params.resolved));

    const res = await fetch(`/api/risk-center?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch risk alerts');
    return res.json();
  },

  async resolveAlert(id: string, actor: string = 'Mission Controller'): Promise<{ success: boolean; alert: RiskAlert }> {
    const res = await fetch(`/api/risk-center/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  },

  async getExpeditions(): Promise<Expedition[]> {
    const res = await fetch('/api/expeditions');
    if (!res.ok) throw new Error('Failed to fetch expeditions');
    return res.json();
  },

  async getExpeditionDetails(id: string): Promise<Expedition & { details: any }> {
    const res = await fetch(`/api/expeditions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch expedition details');
    return res.json();
  },

  async flagExpeditionReplanning(id: string, actor: string = 'Station Commander'): Promise<{
    success: boolean;
    message: string;
    expedition: Expedition;
  }> {
    const res = await fetch(`/api/expeditions/${id}/flag-replanning`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    if (!res.ok) throw new Error('Failed to flag expedition for replanning');
    return res.json();
  },

  async reclaimStationResources(actor: string = 'Cmdr. Elena Vance'): Promise<{
    success: boolean;
    message: string;
    inventory: InventoryItem;
    alpha: Expedition;
  }> {
    const res = await fetch('/api/station-primacy/reclaim-alpha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    if (!res.ok) throw new Error('Failed to reclaim resources');
    return res.json();
  },

  async getAssets(): Promise<{ assets: Asset[]; assetTypes: any[]; maintenanceRecords: any[] }> {
    const res = await fetch('/api/assets');
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
  },

  async repairGenerator(id: string, actor: string = 'Chief Eng. Tatyana Chen'): Promise<{
    success: boolean;
    message: string;
    asset: Asset;
  }> {
    const res = await fetch(`/api/assets/${id}/repair-generator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    if (!res.ok) throw new Error('Failed to repair generator');
    return res.json();
  },

  async getConflicts(): Promise<Conflict[]> {
    const res = await fetch('/api/conflicts');
    if (!res.ok) throw new Error('Failed to fetch conflicts');
    return res.json();
  },

  async resolveConflict(conflictId: string, assignedToExpeditionId: string, actor: string = 'Cmdr. Elena Vance'): Promise<{
    success: boolean;
    message: string;
    conflict: Conflict;
  }> {
    const res = await fetch(`/api/conflicts/${conflictId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedToExpeditionId, actor })
    });
    if (!res.ok) throw new Error('Failed to resolve conflict');
    return res.json();
  },

  async getCargo(): Promise<Cargo[]> {
    const res = await fetch('/api/cargo');
    if (!res.ok) throw new Error('Failed to fetch cargo');
    return res.json();
  },

  async getShipments(): Promise<Shipment[]> {
    const res = await fetch('/api/shipments');
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return res.json();
  },

  async rerouteShipment(shipmentId: string, actor: string = 'Major Arjun Patel'): Promise<{
    success: boolean;
    message: string;
    shipment: Shipment;
  }> {
    const res = await fetch(`/api/shipments/${shipmentId}/reroute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    if (!res.ok) throw new Error('Failed to reroute shipment');
    return res.json();
  },

  async getInventory(): Promise<{ items: InventoryItem[]; transactions: InventoryTransaction[] }> {
    const res = await fetch('/api/inventory');
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  },

  async getSyncEvents(): Promise<{ pending_count: number; events: SyncEvent[] }> {
    const res = await fetch('/api/sync-events');
    if (!res.ok) throw new Error('Failed to fetch sync events');
    return res.json();
  },

  async syncEvent(id: string, actor: string = 'Field Radio Link'): Promise<{
    success: boolean;
    message: string;
    event: SyncEvent;
  }> {
    const res = await fetch(`/api/sync-events/${id}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    if (!res.ok) throw new Error('Failed to sync event');
    return res.json();
  },

  async syncAllPending(actor: string = 'Satellite Burst Controller'): Promise<{
    success: boolean;
    message: string;
    events: SyncEvent[];
  }> {
    const res = await fetch('/api/sync-events/sync-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    if (!res.ok) throw new Error('Failed to sync all events');
    return res.json();
  },

  async getLocations(): Promise<Location[]> {
    const res = await fetch('/api/locations');
    if (!res.ok) throw new Error('Failed to fetch locations');
    return res.json();
  },

  async getPersonnel(): Promise<any[]> {
    const res = await fetch('/api/personnel');
    if (!res.ok) throw new Error('Failed to fetch personnel');
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getDatabaseSchema(): Promise<{
    tables: Array<{ name: string; rows: number; description: string }>;
    initSql: string;
    seedSql: string;
  }> {
    const res = await fetch('/api/database/schema');
    if (!res.ok) throw new Error('Failed to fetch database schema');
    return res.json();
  },

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/database/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset database');
    return res.json();
  }
};
