// Frontend Data Types

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export type AlertCategory =
  | 'Cargo Delayed'
  | 'Inventory Shortage'
  | 'Asset Fault'
  | 'Asset Allocation Conflict'
  | 'Readiness Deficit'
  | 'Offline Sync Pending'
  | 'Weather Hazard'
  | 'System Notification';

export interface RiskAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  affected_object_type: 'expedition' | 'asset' | 'shipment' | 'inventory' | 'sync';
  affected_object_id: string;
  is_resolved: boolean;
  action_required?: string;
  resolved_by?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  type: 'Base Station' | 'Forward Waypost' | 'Field Glacier Site' | 'Air Strip';
  coords_lat: number;
  coords_long: number;
  altitude_m: number;
  temp_celsius: number;
  weather_condition: string;
  is_operational: boolean;
  notes?: string;
}

export interface ReadinessBreakdown {
  overall_score: number;
  asset_health_score: number;
  cargo_readiness_score: number;
  personnel_score: number;
  weather_risk_factor: number;
  threshold: number;
  evaluated_at: string;
  issues: string[];
}

export interface Personnel {
  id: string;
  callsign: string;
  full_name: string;
  role_id: string;
  specialization: string;
  fitness_for_duty: 'fit' | 'fatigued' | 'medical_hold' | 'quarantined';
  current_location_id: string;
  assigned_expedition_id?: string;
}

export interface Expedition {
  id: string;
  code: string;
  name: string;
  status: 'planning' | 'active' | 'replanning' | 'staged' | 'aborted' | 'completed';
  priority_level: 'critical' | 'high' | 'standard' | 'station_priority';
  lead_officer: string;
  target_location_id: string;
  scheduled_start: string;
  scheduled_end: string;
  readiness_score: number;
  objective: string;
  hazard_class: string;
  readiness_breakdown?: ReadinessBreakdown;
  allocated_asset_ids: string[];
  assigned_personnel_ids: string[];
  cargo_ids: string[];
}

export interface Asset {
  id: string;
  asset_type_id: string;
  asset_type_name?: string;
  category?: string;
  serial_number: string;
  name: string;
  current_status: 'operational' | 'faulty' | 'maintenance' | 'decommissioned' | 'in_transit';
  operational_hours: number;
  location_id: string;
  telemetry: Record<string, any>;
  last_service_date?: string;
  next_service_due?: string;
  allocated_expedition_id?: string;
}

export interface Conflict {
  id: string;
  conflict_type: string;
  entity_type: 'asset' | 'personnel' | 'location';
  entity_id: string;
  expedition_a_id: string;
  expedition_b_id: string;
  status: 'detected' | 'reviewing' | 'resolved' | 'overridden';
  resolution_notes?: string;
  detected_at: string;
  resolved_at?: string;
}

export interface MaintenanceRecord {
  id: string;
  asset_id: string;
  maintenance_type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'waiting_parts';
  technician: string;
  description: string;
  parts_replaced?: string;
  hours_logged: number;
  completed_at?: string;
  created_at: string;
}

export interface CargoItem {
  id: string;
  cargo_id: string;
  item_name: string;
  sku: string;
  quantity: number;
  unit: string;
  weight_kg: number;
}

export interface Cargo {
  id: string;
  manifest_number: string;
  description: string;
  total_weight_kg: number;
  is_hazmat: boolean;
  requires_cold_chain: boolean;
  assigned_expedition_id?: string;
  items: CargoItem[];
}

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  event_type: string;
  location_name: string;
  timestamp: string;
  details: string;
  logged_by: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  cargo_id: string;
  cargo_desc?: string;
  origin_location_id: string;
  destination_location_id: string;
  carrier: string;
  status: 'manifested' | 'in_transit' | 'delayed' | 'arrived' | 'diverted';
  departure_time: string;
  estimated_arrival: string;
  actual_arrival?: string;
  delay_reason?: string;
  is_critical_supply: boolean;
  events: ShipmentEvent[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Fuel & Propellant' | 'Rations & Water' | 'Medical & Pharma' | 'Life Support Consumable';
  location_id: string;
  quantity_on_hand: number;
  safety_stock_threshold: number;
  daily_burn_rate: number;
  days_of_supply_remaining: number;
  unit: string;
  predicted_shortage_date?: string;
}

export interface InventoryTransaction {
  id: string;
  inventory_item_id: string;
  transaction_type: string;
  quantity: number;
  balance_after: number;
  authorized_by: string;
  reference_id?: string;
  timestamp: string;
}

export interface SyncEvent {
  id: string;
  client_device_id: string;
  origin_site: string;
  entity_type: string;
  action: string;
  payload: Record<string, any>;
  status: 'pending' | 'synced' | 'conflict' | 'rejected';
  conflict_reason?: string;
  retry_count: number;
  created_at: string;
  synced_at?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  category: string;
  action: string;
  actor: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface OverviewData {
  system_name: string;
  operational_condition: {
    station_primacy_active: boolean;
    base_station_status: string;
    fuel_reserves_days: number;
    fuel_liters_on_hand: number;
    fuel_threshold_liters: number;
    ambient_station_temp: number;
    weather_code: string;
  };
  metrics: {
    unresolved_alerts_count: number;
    critical_alerts: number;
    high_alerts: number;
    medium_alerts: number;
    info_alerts: number;
    expeditions_count: number;
    expeditions_replanning: number;
    expeditions_below_threshold: number;
    total_assets: number;
    faulty_assets: number;
    active_conflicts: number;
    delayed_shipments: number;
    pending_offline_syncs: number;
  };
  expeditions: Array<{
    id: string;
    code: string;
    name: string;
    status: string;
    readiness_score: number;
    lead_officer: string;
  }>;
  recent_audits: AuditLog[];
}
