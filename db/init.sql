-- ============================================================================
-- PROJECT AVALANCHE: RELATIONAL DATABASE INITIALIZATION SCHEMA (PostgreSQL 14+)
-- Advanced Visual Logistics & Asset Network for Complex Hazardous Environments
-- Target Domain: Extreme Polar / High-Altitude Station Logistics & Mission Ops
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ACCESS CONTROL & IDENTITY
-- ----------------------------------------------------------------------------
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    callsign VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. SPATIAL TOPOLOGY & EXPEDITIONS
-- ----------------------------------------------------------------------------
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Base Station', 'Forward Waypost', 'Field Glacier Site', 'Air Strip'
    coords_lat NUMERIC(9,6) NOT NULL,
    coords_long NUMERIC(9,6) NOT NULL,
    altitude_m INT NOT NULL DEFAULT 0,
    temp_celsius NUMERIC(4,1) NOT NULL DEFAULT -35.0,
    weather_condition VARCHAR(100) NOT NULL DEFAULT 'Blizzard Advisory',
    is_operational BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE expeditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'planning', -- 'planning', 'active', 'replanning', 'staged', 'aborted', 'completed'
    priority_level VARCHAR(20) NOT NULL DEFAULT 'standard', -- 'critical', 'high', 'standard', 'station_priority'
    lead_officer VARCHAR(150) NOT NULL,
    target_location_id UUID REFERENCES locations(id) ON DELETE RESTRICT,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    readiness_score INT NOT NULL DEFAULT 0, -- Calculated 0-100 by Readiness Engine
    objective TEXT NOT NULL,
    hazard_class VARCHAR(50) NOT NULL DEFAULT 'Severe Arctic Class 4',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE personnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    specialization VARCHAR(100) NOT NULL, -- 'Cryo-Engineer', 'Medic Specialist', 'Geophysicist', 'Logistics Chief'
    assigned_expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    current_location_id UUID REFERENCES locations(id) ON DELETE RESTRICT,
    fitness_for_duty VARCHAR(50) NOT NULL DEFAULT 'fit', -- 'fit', 'fatigued', 'quarantine', 'evac_required'
    biometric_status JSONB DEFAULT '{"heart_rate": 74, "spo2": 97, "core_temp": 36.8}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. ASSETS, CAPABILITIES & HARDWARE
-- ----------------------------------------------------------------------------
CREATE TABLE asset_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL, -- 'Power / Life Support', 'Extreme Vehicle', 'Scientific Rig', 'Communications'
    model_name VARCHAR(150) NOT NULL,
    manufacturer VARCHAR(150),
    maintenance_interval_hours INT NOT NULL DEFAULT 250,
    critical_for_station BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_type_id UUID NOT NULL REFERENCES asset_types(id) ON DELETE RESTRICT,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    current_status VARCHAR(50) NOT NULL DEFAULT 'operational', -- 'operational', 'faulty', 'maintenance', 'decommissioned', 'in_transit'
    operational_hours NUMERIC(8,2) NOT NULL DEFAULT 0.0,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    telemetry JSONB DEFAULT '{"fuel_level": 88, "rpm": 1800, "temp_c": 64, "oil_pressure": 48}',
    last_service_date TIMESTAMPTZ,
    next_service_due TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE asset_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    expedition_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
    allocated_by VARCHAR(100) NOT NULL DEFAULT 'Station Command',
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    required_from TIMESTAMPTZ NOT NULL,
    required_until TIMESTAMPTZ NOT NULL,
    conflict_detected BOOLEAN NOT NULL DEFAULT FALSE,
    conflict_details TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(50) NOT NULL, -- 'Scheduled Overhaul', 'Emergency Repair', 'Post-Freeze Inspection'
    status VARCHAR(50) NOT NULL DEFAULT 'completed', -- 'scheduled', 'in_progress', 'completed', 'waiting_parts'
    technician VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    parts_replaced TEXT,
    hours_logged NUMERIC(6,2) NOT NULL DEFAULT 4.0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CARGO & SHIPMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE cargo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manifest_number VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    total_weight_kg NUMERIC(8,2) NOT NULL,
    is_hazmat BOOLEAN NOT NULL DEFAULT FALSE,
    requires_cold_chain BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cargo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cargo_id UUID NOT NULL REFERENCES cargo(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(30) NOT NULL, -- 'cylinders', 'crates', 'units', 'liters'
    weight_kg NUMERIC(8,2) NOT NULL
);

CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    cargo_id UUID NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT,
    origin_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    destination_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    carrier VARCHAR(100) NOT NULL, -- 'Twin Otter Air Wing 3', 'Heavy Cat Traverse Line', 'C-130 Hercules Cargo Drop'
    status VARCHAR(50) NOT NULL DEFAULT 'in_transit', -- 'manifested', 'in_transit', 'delayed', 'arrived', 'diverted'
    departure_time TIMESTAMPTZ NOT NULL,
    estimated_arrival TIMESTAMPTZ NOT NULL,
    actual_arrival TIMESTAMPTZ,
    delay_reason TEXT,
    is_critical_supply BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shipment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'Departure', 'Waypoint Checkpoint', 'Weather Delay', 'Reroute', 'Delivery'
    location_name VARCHAR(150) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    details TEXT NOT NULL,
    logged_by VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 5. INVENTORY INTELLIGENCE & CONSUMABLES
-- ----------------------------------------------------------------------------
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Fuel & Propellant', 'Rations & Water', 'Medical & Pharma', 'Life Support Consumable'
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    quantity_on_hand NUMERIC(10,2) NOT NULL,
    safety_stock_threshold NUMERIC(10,2) NOT NULL,
    daily_burn_rate NUMERIC(8,2) NOT NULL,
    days_of_supply_remaining NUMERIC(6,1) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    predicted_shortage_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'Receipt', 'Expedition Issue', 'Emergency Station Reserve Transfer', 'Depletion'
    quantity NUMERIC(10,2) NOT NULL,
    balance_after NUMERIC(10,2) NOT NULL,
    authorized_by VARCHAR(100) NOT NULL,
    reference_id VARCHAR(100),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE consumption_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    quantity_consumed NUMERIC(8,2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT
);

-- ----------------------------------------------------------------------------
-- 6. READINESS ENGINE, ALERTS & RISK MANAGEMENT
-- ----------------------------------------------------------------------------
CREATE TABLE readiness_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expedition_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
    overall_score INT NOT NULL, -- 0 - 100
    asset_health_score INT NOT NULL,
    cargo_readiness_score INT NOT NULL,
    personnel_score INT NOT NULL,
    weather_risk_factor INT NOT NULL,
    threshold INT NOT NULL DEFAULT 60,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conflict_type VARCHAR(50) NOT NULL, -- 'Asset Double Booking', 'Schedule Overlap', 'Power Budget Deficit'
    entity_type VARCHAR(50) NOT NULL, -- 'asset', 'personnel', 'location'
    entity_id UUID NOT NULL,
    expedition_a_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
    expedition_b_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'detected', -- 'detected', 'reviewing', 'resolved', 'overridden'
    resolution_notes TEXT,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE risk_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    severity VARCHAR(20) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'
    category VARCHAR(50) NOT NULL, -- 'Cargo Delayed', 'Inventory Shortage', 'Asset Fault', 'Asset Allocation Conflict', 'Readiness Deficit', 'Offline Sync Pending'
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    affected_object_type VARCHAR(50) NOT NULL, -- 'expedition', 'asset', 'shipment', 'inventory', 'sync'
    affected_object_id VARCHAR(100) NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    action_required TEXT,
    resolved_by VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expedition_id UUID REFERENCES expeditions(id) ON DELETE CASCADE,
    priority VARCHAR(20) NOT NULL, -- 'immediate', 'advisory', 'routine'
    action_type VARCHAR(50) NOT NULL, -- 'Reallocate Asset', 'Trigger Replanning', 'Dispatch Emergency Fuel', 'Hold Departure'
    rationale TEXT NOT NULL,
    suggested_payload JSONB,
    is_applied BOOLEAN NOT NULL DEFAULT FALSE,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. OFFLINE SYNC RESILIENCE & TELEMETRY QUEUE
-- ----------------------------------------------------------------------------
CREATE TABLE sync_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_device_id VARCHAR(100) NOT NULL,
    origin_site VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'asset_telemetry', 'inventory_consumption', 'personnel_checkin', 'checkpoint_log'
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'HEARTBEAT'
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'synced', 'conflict', 'rejected'
    conflict_reason TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

-- Indexes for performance & rapid mission control queries
CREATE INDEX idx_expeditions_status ON expeditions(status);
CREATE INDEX idx_assets_status ON assets(current_status);
CREATE INDEX idx_risk_alerts_unresolved ON risk_alerts(is_resolved, severity);
CREATE INDEX idx_sync_events_pending ON sync_events(status);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_inventory_burn ON inventory_items(days_of_supply_remaining);
