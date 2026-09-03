import express, { Request, Response } from 'express';
import { db } from './db';
import fs from 'fs';
import path from 'path';

export const apiRouter = express.Router();

// 1. Health & Mission Control Overview
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'nominal',
    system: 'Project AVALANCHE Mission Control API',
    version: '1.0.0-sih',
    station_priority: true,
    timestamp: new Date().toISOString()
  });
});

apiRouter.get('/overview', (req: Request, res: Response) => {
  const unresolvedAlerts = db.riskAlerts.filter(a => !a.is_resolved);
  const criticalCount = unresolvedAlerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = unresolvedAlerts.filter(a => a.severity === 'HIGH').length;
  const mediumCount = unresolvedAlerts.filter(a => a.severity === 'MEDIUM').length;
  const infoCount = unresolvedAlerts.filter(a => a.severity === 'INFO').length;

  const stationFuel = db.inventoryItems.find(i => i.id === 'inv-fuel-s7');
  const faultyGen = db.assets.find(a => a.id === 'asset-gen-001' && a.current_status === 'faulty');
  const pendingSyncs = db.syncEvents.filter(s => s.status === 'pending').length;
  const activeConflicts = db.conflicts.filter(c => c.status === 'detected').length;

  res.json({
    system_name: 'Project AVALANCHE',
    operational_condition: {
      station_primacy_active: true,
      base_station_status: faultyGen ? 'WARNING_DEGRADED_POWER' : 'NOMINAL_BACKUP_ONLINE',
      fuel_reserves_days: stationFuel ? stationFuel.days_of_supply_remaining : 0,
      fuel_liters_on_hand: stationFuel ? stationFuel.quantity_on_hand : 0,
      fuel_threshold_liters: stationFuel ? stationFuel.safety_stock_threshold : 0,
      ambient_station_temp: -46.5,
      weather_code: 'BLIZZARD_CAT_3'
    },
    metrics: {
      unresolved_alerts_count: unresolvedAlerts.length,
      critical_alerts: criticalCount,
      high_alerts: highCount,
      medium_alerts: mediumCount,
      info_alerts: infoCount,
      expeditions_count: db.expeditions.length,
      expeditions_replanning: db.expeditions.filter(e => e.status === 'replanning').length,
      expeditions_below_threshold: db.expeditions.filter(e => e.readiness_score < 60).length,
      total_assets: db.assets.length,
      faulty_assets: db.assets.filter(a => a.current_status === 'faulty').length,
      active_conflicts: activeConflicts,
      delayed_shipments: db.shipments.filter(s => s.status === 'delayed').length,
      pending_offline_syncs: pendingSyncs
    },
    expeditions: db.expeditions.map(e => ({
      id: e.id,
      code: e.code,
      name: e.name,
      status: e.status,
      readiness_score: e.readiness_score,
      lead_officer: e.lead_officer
    })),
    recent_audits: db.auditLogs.slice(0, 5)
  });
});

// 2. Alerts & Centralized Risk Center
apiRouter.get('/risk-center', (req: Request, res: Response) => {
  const { severity, category, resolved } = req.query;
  let alerts = [...db.riskAlerts];

  if (severity) {
    alerts = alerts.filter(a => a.severity.toLowerCase() === String(severity).toLowerCase());
  }
  if (category) {
    alerts = alerts.filter(a => a.category.toLowerCase() === String(category).toLowerCase());
  }
  if (resolved !== undefined) {
    alerts = alerts.filter(a => a.is_resolved === (resolved === 'true'));
  }

  // Sort: CRITICAL first, then HIGH, then MEDIUM, then INFO
  const rank: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, INFO: 3 };
  alerts.sort((a, b) => {
    if (a.is_resolved !== b.is_resolved) return a.is_resolved ? 1 : -1;
    return (rank[a.severity] ?? 99) - (rank[b.severity] ?? 99);
  });

  res.json({
    total: alerts.length,
    unresolved: alerts.filter(a => !a.is_resolved).length,
    alerts
  });
});

apiRouter.post('/risk-center/:id/resolve', (req: Request, res: Response) => {
  const { actor } = req.body;
  const alert = db.resolveAlert(req.params.id, actor);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json({ success: true, alert });
});

// 3. Expeditions & Station Priority Actions
apiRouter.get('/expeditions', (req: Request, res: Response) => {
  res.json(db.expeditions);
});

apiRouter.get('/expeditions/:id', (req: Request, res: Response) => {
  const exp = db.expeditions.find(e => e.id === req.params.id || e.code === req.params.id);
  if (!exp) return res.status(404).json({ error: 'Expedition not found' });

  const assets = db.assets.filter(a => exp.allocated_asset_ids.includes(a.id));
  const personnel = db.personnel.filter(p => exp.assigned_personnel_ids.includes(p.id));
  const cargo = db.cargo.filter(c => exp.cargo_ids.includes(c.id));
  const location = db.locations.find(l => l.id === exp.target_location_id);
  const conflicts = db.conflicts.filter(c => c.expedition_a_id === exp.id || c.expedition_b_id === exp.id);

  res.json({
    ...exp,
    details: {
      assets,
      personnel,
      cargo,
      location,
      conflicts
    }
  });
});

// Flag Expedition Alpha (or any expedition) for Replanning
apiRouter.post('/expeditions/:id/flag-replanning', (req: Request, res: Response) => {
  const { actor } = req.body;
  const exp = db.flagExpeditionForReplanning(req.params.id, actor);
  if (!exp) return res.status(404).json({ error: 'Expedition not found' });
  res.json({
    success: true,
    message: `Expedition ${exp.code} successfully flagged for replanning under Station Operational Primacy.`,
    expedition: exp
  });
});

// Station Priority: One-click Reclaim Alpha Resources back to Base Station
apiRouter.post('/station-primacy/reclaim-alpha', (req: Request, res: Response) => {
  const { actor } = req.body;
  const success = db.reclaimAlphaResources(actor);
  if (!success) return res.status(500).json({ error: 'Failed to reclaim Alpha resources' });
  res.json({
    success: true,
    message: 'Station Operational Primacy Enforced: Reclaimed 800L fuel and engineering technicians from Alpha to secure Base Station life support.',
    inventory: db.inventoryItems.find(i => i.id === 'inv-fuel-s7'),
    alpha: db.expeditions.find(e => e.id === 'exp-alpha')
  });
});

// 4. Assets, Conflicts & Maintenance
apiRouter.get('/assets', (req: Request, res: Response) => {
  res.json({
    assets: db.assets,
    assetTypes: db.assetTypes,
    maintenanceRecords: db.maintenanceRecords
  });
});

apiRouter.post('/assets/:id/repair-generator', (req: Request, res: Response) => {
  const { actor } = req.body;
  const asset = db.repairGenerator(req.params.id, actor);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  res.json({
    success: true,
    message: `Repaired ${asset.serial_number}. Full power redundancy restored to Station.`,
    asset
  });
});

apiRouter.get('/conflicts', (req: Request, res: Response) => {
  res.json(db.conflicts);
});

apiRouter.post('/conflicts/:id/resolve', (req: Request, res: Response) => {
  const { assignedToExpeditionId, actor } = req.body;
  if (!assignedToExpeditionId) {
    return res.status(400).json({ error: 'assignedToExpeditionId is required' });
  }
  const conflict = db.resolveConflict(req.params.id, assignedToExpeditionId, actor);
  if (!conflict) return res.status(404).json({ error: 'Conflict not found' });
  res.json({
    success: true,
    message: 'Asset allocation conflict resolved successfully.',
    conflict
  });
});

// 5. Cargo & Shipments
apiRouter.get('/cargo', (req: Request, res: Response) => {
  res.json(db.cargo);
});

apiRouter.get('/shipments', (req: Request, res: Response) => {
  res.json(db.shipments);
});

apiRouter.post('/shipments/:id/reroute', (req: Request, res: Response) => {
  const { actor } = req.body;
  const shipment = db.rerouteShipment(req.params.id, actor);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
  res.json({
    success: true,
    message: `Shipment ${shipment.tracking_number} rerouted to surface heavy traverse.`,
    shipment
  });
});

// 6. Inventory Intelligence
apiRouter.get('/inventory', (req: Request, res: Response) => {
  res.json({
    items: db.inventoryItems,
    transactions: db.inventoryTransactions
  });
});

// 7. Offline Synchronization Queue & Simulation
apiRouter.get('/sync-events', (req: Request, res: Response) => {
  res.json({
    pending_count: db.syncEvents.filter(s => s.status === 'pending').length,
    events: db.syncEvents
  });
});

apiRouter.post('/sync-events/:id/sync', (req: Request, res: Response) => {
  const { actor } = req.body;
  const evt = db.syncEvent(req.params.id, actor);
  if (!evt) return res.status(404).json({ error: 'Event not found or already synced' });
  res.json({
    success: true,
    message: `Synchronized event from ${evt.origin_site}. Live database state updated.`,
    event: evt
  });
});

apiRouter.post('/sync-events/sync-all', (req: Request, res: Response) => {
  const { actor } = req.body;
  const events = db.syncAllPendingEvents(actor);
  res.json({
    success: true,
    message: 'All 3 pending offline field telemetry buffers synchronized into core relational tables.',
    events
  });
});

// 8. Locations
apiRouter.get('/locations', (req: Request, res: Response) => {
  res.json(db.locations);
});

// 9. Personnel
apiRouter.get('/personnel', (req: Request, res: Response) => {
  res.json(db.personnel);
});

// 10. Audit History Log (Ensuring important logistics history is preserved)
apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  res.json(db.auditLogs);
});

// 11. Database Schema Explorer & DDL Inspection
apiRouter.get('/database/schema', (req: Request, res: Response) => {
  let initSql = '';
  let seedSql = '';
  try {
    const initPath = path.join(process.cwd(), 'db', 'init.sql');
    if (fs.existsSync(initPath)) {
      initSql = fs.readFileSync(initPath, 'utf8');
    }
    const seedPath = path.join(process.cwd(), 'db', 'seed_demo.sql');
    if (fs.existsSync(seedPath)) {
      seedSql = fs.readFileSync(seedPath, 'utf8');
    }
  } catch (err) {
    console.error('Error reading SQL files:', err);
  }

  res.json({
    tables: [
      { name: 'users', rows: 3, description: 'Command, logistics & engineering operators' },
      { name: 'roles', rows: 3, description: 'Role-based access controls' },
      { name: 'locations', rows: db.locations.length, description: 'Polar bases, wayposts, airfields, glacier sites' },
      { name: 'expeditions', rows: db.expeditions.length, description: 'Expedition Alpha, Beta, Gamma with readiness' },
      { name: 'personnel', rows: db.personnel.length, description: 'Officers, specialists, biometrics' },
      { name: 'asset_types', rows: db.assetTypes.length, description: 'Generators, polar vehicles, drill systems' },
      { name: 'assets', rows: db.assets.length, description: 'Physical hardware, telemetry, runtime status' },
      { name: 'asset_allocations', rows: db.allocations.length, description: 'Scheduling windows and conflict flags' },
      { name: 'conflicts', rows: db.conflicts.length, description: 'Double booking and resource contentions' },
      { name: 'maintenance_records', rows: db.maintenanceRecords.length, description: 'Historical repair logs & parts replaced' },
      { name: 'cargo', rows: db.cargo.length, description: 'Manifests and hazmat/cold-chain constraints' },
      { name: 'cargo_items', rows: 5, description: 'Granular cargo units, weights, and packaging' },
      { name: 'shipments', rows: db.shipments.length, description: 'Airlift & traverse routes, status tracking' },
      { name: 'shipment_events', rows: db.shipmentEvents.length, description: 'Historical checkpoint milestones' },
      { name: 'inventory_items', rows: db.inventoryItems.length, description: 'Stock, burn rates, days of supply remaining' },
      { name: 'inventory_transactions', rows: db.inventoryTransactions.length, description: 'Immutable transaction ledger' },
      { name: 'consumption_records', rows: 4, description: 'Field consumption logs' },
      { name: 'sync_events', rows: db.syncEvents.length, description: 'Offline-first queue buffer with sync replay' },
      { name: 'risk_alerts', rows: db.riskAlerts.length, description: 'Centralized risk center alert repository' },
      { name: 'readiness_scores', rows: 3, description: 'Multi-variable readiness engine outputs' },
      { name: 'recommendations', rows: db.recommendations.length, description: 'Actionable mission control recommendations' }
    ],
    initSql,
    seedSql
  });
});

// 12. Reset to clean demo state for evaluator testing
apiRouter.post('/database/reset', (req: Request, res: Response) => {
  db.seedDemoData();
  db.recomputeAllReadiness();
  db.recordAudit('SYSTEM', 'RESET_DEMO', 'Admin', 'Reset database to original Smart India Hackathon demo state.');
  res.json({
    success: true,
    message: 'Database reset to initial demo scenario state.'
  });
});
