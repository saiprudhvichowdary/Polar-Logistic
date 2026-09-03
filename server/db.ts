import {
  Location,
  Expedition,
  Personnel,
  AssetType,
  Asset,
  AssetAllocation,
  Conflict,
  MaintenanceRecord,
  Cargo,
  Shipment,
  ShipmentEvent,
  InventoryItem,
  InventoryTransaction,
  SyncEvent,
  RiskAlert,
  Recommendation,
  AuditLog
} from './types';
import { evaluateExpeditionReadiness } from './readinessEngine';

export class DatabaseStore {
  locations: Location[] = [];
  expeditions: Expedition[] = [];
  personnel: Personnel[] = [];
  assetTypes: AssetType[] = [];
  assets: Asset[] = [];
  allocations: AssetAllocation[] = [];
  conflicts: Conflict[] = [];
  maintenanceRecords: MaintenanceRecord[] = [];
  cargo: Cargo[] = [];
  shipments: Shipment[] = [];
  shipmentEvents: ShipmentEvent[] = [];
  inventoryItems: InventoryItem[] = [];
  inventoryTransactions: InventoryTransaction[] = [];
  syncEvents: SyncEvent[] = [];
  riskAlerts: RiskAlert[] = [];
  recommendations: Recommendation[] = [];
  auditLogs: AuditLog[] = [];

  constructor() {
    this.seedDemoData();
    this.recomputeAllReadiness();
  }

  seedDemoData() {
    this.locations = [
      {
        id: 'loc-base-07',
        code: 'LOC-BASE-07',
        name: 'Base Station Sector 7 (Amundsen Hub)',
        type: 'Base Station',
        coords_lat: -89.9979,
        coords_long: 139.273,
        altitude_m: 2835,
        temp_celsius: -46.5,
        weather_condition: 'Blizzard Category 3 (Wind 58kts)',
        is_operational: true,
        notes: 'Primary atmospheric research hub and life-support shelter. Station condition takes priority.'
      },
      {
        id: 'loc-wayp-ech',
        code: 'LOC-WAYP-ECH',
        name: 'Waypost Echo (Ridge Traverse Pass)',
        type: 'Forward Waypost',
        coords_lat: -88.42,
        coords_long: 142.15,
        altitude_m: 3120,
        temp_celsius: -52.0,
        weather_condition: 'Whiteout Warning',
        is_operational: true,
        notes: 'Intermediate automated fuel cache and radio relay node.'
      },
      {
        id: 'loc-glac-rdg',
        code: 'LOC-GLAC-RDG',
        name: 'Field Site Glacier Ridge',
        type: 'Field Glacier Site',
        coords_lat: -87.185,
        coords_long: 148.9,
        altitude_m: 3450,
        temp_celsius: -58.2,
        weather_condition: 'Sub-Zero Gale Force',
        is_operational: true,
        notes: 'Deep ice sheet sub-glacial drilling exploration zone (Alpha destination).'
      },
      {
        id: 'loc-outp-dlt',
        code: 'LOC-OUTP-DLT',
        name: 'Outpost Delta (Blue Ice Runway)',
        type: 'Air Strip',
        coords_lat: -89.15,
        coords_long: 135.8,
        altitude_m: 2600,
        temp_celsius: -41.0,
        weather_condition: 'Runway Glazed Ice / Zero Visibility',
        is_operational: true,
        notes: 'Main cargo airlift landing strip. Current air approach blocked.'
      }
    ];

    this.assetTypes = [
      {
        id: 'type-gen-600',
        category: 'Power / Life Support',
        model_name: 'Titan-600 Cryo Turbo-Generator (450kW)',
        manufacturer: 'Nordic Polar Power Systems',
        maintenance_interval_hours: 200,
        critical_for_station: true
      },
      {
        id: 'type-snowcat',
        category: 'Extreme Vehicle',
        model_name: 'Kässbohrer PistenBully Polar Snowcat 600',
        manufacturer: 'Kässbohrer Geländefahrzeug',
        maintenance_interval_hours: 150,
        critical_for_station: true
      },
      {
        id: 'type-drill',
        category: 'Scientific Rig',
        model_name: 'Subglacial Hot-Water Cryo-Drill Rig',
        manufacturer: 'AWI Glaciology Labs',
        maintenance_interval_hours: 100,
        critical_for_station: false
      },
      {
        id: 'type-bv206',
        category: 'Extreme Vehicle',
        model_name: 'Hägglunds BV-206 Articulated Carrier',
        manufacturer: 'BAE Systems Hägglunds',
        maintenance_interval_hours: 180,
        critical_for_station: false
      }
    ];

    this.assets = [
      {
        id: 'asset-gen-001',
        asset_type_id: 'type-gen-600',
        asset_type_name: 'Titan-600 Cryo Turbo-Generator (450kW)',
        category: 'Power / Life Support',
        serial_number: 'GEN-001',
        name: 'Primary Core Habitat Generator 01',
        current_status: 'faulty',
        operational_hours: 412.5,
        location_id: 'loc-base-07',
        telemetry: {
          oil_pressure_psi: 11.2,
          bearing_temp_c: 118,
          vibration_mm_s: 8.9,
          error_code: 'ERR-TURBO-SEAL-FAIL',
          output_kw: 0
        },
        last_service_date: '2026-07-15T00:00:00Z',
        next_service_due: '2026-08-28T00:00:00Z',
        allocated_expedition_id: 'exp-alpha'
      },
      {
        id: 'asset-gen-002',
        asset_type_id: 'type-gen-600',
        asset_type_name: 'Titan-600 Cryo Turbo-Generator (450kW)',
        category: 'Power / Life Support',
        serial_number: 'GEN-002',
        name: 'Secondary Station Life-Support Generator 02',
        current_status: 'operational',
        operational_hours: 189.0,
        location_id: 'loc-base-07',
        telemetry: {
          oil_pressure_psi: 46.5,
          bearing_temp_c: 62,
          vibration_mm_s: 1.4,
          status: 'NOMINAL_LOAD_82%',
          output_kw: 380
        },
        last_service_date: '2026-08-18T00:00:00Z',
        next_service_due: '2026-09-30T00:00:00Z'
      },
      {
        id: 'asset-vhc-99',
        asset_type_id: 'type-snowcat',
        asset_type_name: 'Kässbohrer PistenBully Polar Snowcat 600',
        category: 'Extreme Vehicle',
        serial_number: 'VHC-99',
        name: 'Polar Traverse Snowcat VHC-99',
        current_status: 'operational',
        operational_hours: 310.2,
        location_id: 'loc-base-07',
        telemetry: {
          fuel_level_pct: 74,
          track_tension: 'optimal',
          engine_temp_c: 68,
          odometer_km: 1395.0
        },
        last_service_date: '2026-08-15T00:00:00Z',
        next_service_due: '2026-10-05T00:00:00Z',
        allocated_expedition_id: 'exp-beta'
      },
      {
        id: 'asset-rig-cor-03',
        asset_type_id: 'type-drill',
        asset_type_name: 'Subglacial Hot-Water Cryo-Drill Rig',
        category: 'Scientific Rig',
        serial_number: 'RIG-COR-03',
        name: 'Deep Ice Core Drill System Alpha-03',
        current_status: 'operational',
        operational_hours: 88.0,
        location_id: 'loc-base-07',
        telemetry: {
          bit_wear_pct: 14,
          hydraulic_fluid: 'optimal',
          melt_head_temp_c: 85
        },
        last_service_date: '2026-08-10T00:00:00Z',
        next_service_due: '2026-10-12T00:00:00Z',
        allocated_expedition_id: 'exp-alpha'
      },
      {
        id: 'asset-vhc-102',
        asset_type_id: 'type-bv206',
        asset_type_name: 'Hägglunds BV-206 Articulated Carrier',
        category: 'Extreme Vehicle',
        serial_number: 'VHC-102',
        name: 'BV-206 Personnel Carrier Delta',
        current_status: 'operational',
        operational_hours: 142.0,
        location_id: 'loc-outp-dlt',
        telemetry: {
          fuel_level_pct: 91,
          cabin_heater: 'nominal',
          battery_v: 24.6
        },
        last_service_date: '2026-08-25T00:00:00Z',
        next_service_due: '2026-10-25T00:00:00Z'
      }
    ];

    this.allocations = [
      {
        id: 'alloc-vhc99-beta',
        asset_id: 'asset-vhc-99',
        expedition_id: 'exp-beta',
        allocated_by: 'Field Ops Desk',
        allocated_at: '2026-09-01T08:00:00Z',
        required_from: '2026-09-01T00:00:00Z',
        required_until: '2026-09-10T00:00:00Z',
        conflict_detected: true,
        conflict_details: 'Simultaneously scheduled for Expedition Gamma traverse.',
        is_active: true
      },
      {
        id: 'alloc-vhc99-gamma',
        asset_id: 'asset-vhc-99',
        expedition_id: 'exp-gamma',
        allocated_by: 'Survey Branch',
        allocated_at: '2026-09-02T04:30:00Z',
        required_from: '2026-09-07T00:00:00Z',
        required_until: '2026-09-16T00:00:00Z',
        conflict_detected: true,
        conflict_details: 'Asset VHC-99 has not returned from Expedition Beta before Gamma scheduled departure.',
        is_active: true
      },
      {
        id: 'alloc-gen001-alpha',
        asset_id: 'asset-gen-001',
        expedition_id: 'exp-alpha',
        allocated_by: 'Station Command',
        allocated_at: '2026-08-28T12:00:00Z',
        required_from: '2026-09-04T00:00:00Z',
        required_until: '2026-09-20T00:00:00Z',
        conflict_detected: false,
        conflict_details: 'Flagged for replanning: Station operational condition takes priority.',
        is_active: true
      },
      {
        id: 'alloc-rig03-alpha',
        asset_id: 'asset-rig-cor-03',
        expedition_id: 'exp-alpha',
        allocated_by: 'Science Directorate',
        allocated_at: '2026-08-28T12:00:00Z',
        required_from: '2026-09-04T00:00:00Z',
        required_until: '2026-09-20T00:00:00Z',
        conflict_detected: false,
        is_active: true
      }
    ];

    this.conflicts = [
      {
        id: 'conf-vhc99',
        conflict_type: 'Asset Double Booking',
        entity_type: 'asset',
        entity_id: 'asset-vhc-99',
        expedition_a_id: 'exp-beta',
        expedition_b_id: 'exp-gamma',
        status: 'detected',
        resolution_notes: 'VHC-99 Snowcat requested concurrently by Beta (Seismic Ridge) and Gamma (Blue Ice Recon). Requires commander resolution.',
        detected_at: '2026-09-02T04:35:00Z'
      }
    ];

    this.maintenanceRecords = [
      {
        id: 'maint-gen-001',
        asset_id: 'asset-gen-001',
        maintenance_type: 'Emergency Repair',
        status: 'in_progress',
        technician: 'Chief Eng. Tatyana Chen',
        description: 'Turbocharger seal disintegrated causing dangerous oil pressure drop to 11.2 PSI during -46C freeze. Unit emergency shutdown to avoid engine seizure. Station operating on sole backup GEN-002.',
        parts_replaced: 'Awaiting Turbine Seal Ring Kit Part #TITAN-600-TK',
        hours_logged: 6.5,
        created_at: '2026-09-01T14:20:00Z'
      },
      {
        id: 'maint-vhc-99',
        asset_id: 'asset-vhc-99',
        maintenance_type: 'Pre-Traverse Inspection',
        status: 'completed',
        technician: 'Nadia Rostova',
        description: 'Replaced hydraulic line seals and tested cold start heating blocks at -40C.',
        parts_replaced: 'High-pressure Arctic O-Rings',
        hours_logged: 3.0,
        completed_at: '2026-08-30T16:00:00Z',
        created_at: '2026-08-30T10:00:00Z'
      }
    ];

    this.personnel = [
      {
        id: 'per-01',
        badge_number: 'BADGE-801',
        full_name: 'Dr. Marcus Thorne',
        specialization: 'Lead Glaciologist',
        assigned_expedition_id: 'exp-alpha',
        current_location_id: 'loc-base-07',
        fitness_for_duty: 'fit',
        biometric_status: { heart_rate: 72, spo2: 98, core_temp: 36.9 }
      },
      {
        id: 'per-02',
        badge_number: 'BADGE-802',
        full_name: 'Nadia Rostova',
        specialization: 'Heavy Rig Operator & Mechanic',
        assigned_expedition_id: 'exp-alpha',
        current_location_id: 'loc-base-07',
        fitness_for_duty: 'fit',
        biometric_status: { heart_rate: 78, spo2: 96, core_temp: 36.7 }
      },
      {
        id: 'per-03',
        badge_number: 'BADGE-803',
        full_name: 'Dr. Sarah Lin',
        specialization: 'Geophysicist',
        assigned_expedition_id: 'exp-beta',
        current_location_id: 'loc-wayp-ech',
        fitness_for_duty: 'fit',
        biometric_status: { heart_rate: 80, spo2: 95, core_temp: 36.5 }
      },
      {
        id: 'per-04',
        badge_number: 'BADGE-804',
        full_name: 'Sven Lindqvist',
        specialization: 'Cold-Traverse Pilot',
        assigned_expedition_id: 'exp-beta',
        current_location_id: 'loc-wayp-ech',
        fitness_for_duty: 'fatigued',
        biometric_status: { heart_rate: 86, spo2: 93, core_temp: 36.2 }
      },
      {
        id: 'per-05',
        badge_number: 'BADGE-805',
        full_name: 'Capt. Liam O\'Connor',
        specialization: 'Exo-Planetary Geologist',
        assigned_expedition_id: 'exp-gamma',
        current_location_id: 'loc-base-07',
        fitness_for_duty: 'fit',
        biometric_status: { heart_rate: 71, spo2: 99, core_temp: 37.0 }
      },
      {
        id: 'per-06',
        badge_number: 'BADGE-806',
        full_name: 'Dr. Aisha Al-Mansoor',
        specialization: 'Station Trauma Surgeon',
        current_location_id: 'loc-base-07',
        fitness_for_duty: 'fit',
        biometric_status: { heart_rate: 68, spo2: 98, core_temp: 36.8 }
      }
    ];

    this.cargo = [
      {
        id: 'cargo-fuel-flight',
        manifest_number: 'CRG-FUEL-JET-A1',
        description: 'Emergency Station Fuel Replenishment Flight Pack (12,000L Arctic Blend)',
        total_weight_kg: 9600.0,
        is_hazmat: true,
        requires_cold_chain: false,
        items: [
          {
            id: 'crg-item-1',
            cargo_id: 'cargo-fuel-flight',
            item_name: 'Arctic Grade Diesel/Jet-A1 Fuel Bladders',
            sku: 'SKU-FL-JET',
            quantity: 12,
            unit: '1000L Bladders',
            weight_kg: 9600.0
          }
        ]
      },
      {
        id: 'cargo-beta-seis',
        manifest_number: 'CRG-SEIS-PACK',
        description: 'Expedition Beta Precision Geophone Arrays & Data Telemetry Buoys',
        total_weight_kg: 1450.0,
        is_hazmat: false,
        requires_cold_chain: true,
        assigned_expedition_id: 'exp-beta',
        items: [
          {
            id: 'crg-item-2',
            cargo_id: 'cargo-beta-seis',
            item_name: 'Ultra-Low Temp Geophones (-60C rated)',
            sku: 'SKU-SCI-GEO',
            quantity: 36,
            unit: 'units',
            weight_kg: 720.0
          },
          {
            id: 'crg-item-3',
            cargo_id: 'cargo-beta-seis',
            item_name: 'Telemetry Satellite Uplink Antennas',
            sku: 'SKU-COM-SAT',
            quantity: 4,
            unit: 'masts',
            weight_kg: 730.0
          }
        ]
      },
      {
        id: 'cargo-alpha-bore',
        manifest_number: 'CRG-ALPHA-BORE',
        description: 'Expedition Alpha Sub-Glacial Core Casing & Cryo-Preservation Dewars',
        total_weight_kg: 2800.0,
        is_hazmat: true,
        requires_cold_chain: true,
        assigned_expedition_id: 'exp-alpha',
        items: [
          {
            id: 'crg-item-4',
            cargo_id: 'cargo-alpha-bore',
            item_name: 'Titanium Core Drill Collars 120mm',
            sku: 'SKU-RIG-COL',
            quantity: 20,
            unit: 'sections',
            weight_kg: 1800.0
          },
          {
            id: 'crg-item-5',
            cargo_id: 'cargo-alpha-bore',
            item_name: 'Liquid Nitrogen Storage Dewars',
            sku: 'SKU-LN2-DEW',
            quantity: 6,
            unit: 'dewars',
            weight_kg: 1000.0
          }
        ]
      }
    ];

    this.shipments = [
      {
        id: 'ship-fuel-09',
        tracking_number: 'SHIP-X-ARCTIC-AIR-09',
        cargo_id: 'cargo-fuel-flight',
        cargo_desc: 'Emergency 12,000L Fuel Flight Pack',
        origin_location_id: 'loc-outp-dlt',
        destination_location_id: 'loc-base-07',
        carrier: 'LC-130 Hercules Ski-Wing Air Guard',
        status: 'delayed',
        departure_time: '2026-09-02T04:00:00Z',
        estimated_arrival: '2026-09-02T12:00:00Z',
        delay_reason: 'Polar vortex crosswinds (62 kts) and zero-visibility blowing snow forced abort at Outpost Delta. Grounded pending blizzard lull.',
        is_critical_supply: true,
        events: [
          {
            id: 'evt-1',
            shipment_id: 'ship-fuel-09',
            event_type: 'Departure Clearance',
            location_name: 'Outpost Delta (Blue Ice Runway)',
            timestamp: '2026-09-02T04:00:00Z',
            details: 'Aircraft laden with 12,000L fuel bladders cleared for transit to Sector 7.',
            logged_by: 'Tower Ops Delta'
          },
          {
            id: 'evt-2',
            shipment_id: 'ship-fuel-09',
            event_type: 'Weather Hold & Abort',
            location_name: 'Outpost Delta Runway',
            timestamp: '2026-09-02T08:15:00Z',
            details: 'Grounded by catastrophic squall line. Airspace closed. Delayed by +36 hours minimum.',
            logged_by: 'Major Arjun Patel'
          }
        ]
      },
      {
        id: 'ship-beta-convoy',
        tracking_number: 'SHIP-BETA-TRV-02',
        cargo_id: 'cargo-beta-seis',
        cargo_desc: 'Expedition Beta Precision Geophone Arrays',
        origin_location_id: 'loc-base-07',
        destination_location_id: 'loc-wayp-ech',
        carrier: 'Waypost Heavy Sled Convoy 1',
        status: 'in_transit',
        departure_time: '2026-09-02T00:00:00Z',
        estimated_arrival: '2026-09-03T02:00:00Z',
        is_critical_supply: false,
        events: [
          {
            id: 'evt-3',
            shipment_id: 'ship-beta-convoy',
            event_type: 'Convoy Departed',
            location_name: 'Base Station Sector 7',
            timestamp: '2026-09-02T00:00:00Z',
            details: 'Convoy underway toward Waypost Echo. Tracking nominal at 18 km/h.',
            logged_by: 'Logistics Desk'
          }
        ]
      }
    ];

    this.inventoryItems = [
      {
        id: 'inv-fuel-s7',
        sku: 'INV-FUEL-S7',
        name: 'Station Main Arctic Jet-A1 Diesel Reserves',
        category: 'Fuel & Propellant',
        location_id: 'loc-base-07',
        quantity_on_hand: 3450.0,
        safety_stock_threshold: 5000.0,
        daily_burn_rate: 2400.0,
        days_of_supply_remaining: 1.4,
        unit: 'Liters',
        predicted_shortage_date: '2026-09-04T04:00:00Z'
      },
      {
        id: 'inv-rat-mre',
        sku: 'INV-RAT-MRE',
        name: 'High-Calorie Polar Survival Rations Pack (4500 kcal)',
        category: 'Rations & Water',
        location_id: 'loc-base-07',
        quantity_on_hand: 840.0,
        safety_stock_threshold: 300.0,
        daily_burn_rate: 32.0,
        days_of_supply_remaining: 26.2,
        unit: 'Packs',
        predicted_shortage_date: '2026-09-28T00:00:00Z'
      },
      {
        id: 'inv-med-hypo',
        sku: 'INV-MED-HYPO',
        name: 'Core Rewarming & Hypothermia Triage Kits',
        category: 'Medical & Pharma',
        location_id: 'loc-base-07',
        quantity_on_hand: 18.0,
        safety_stock_threshold: 10.0,
        daily_burn_rate: 0.4,
        days_of_supply_remaining: 45.0,
        unit: 'Kits',
        predicted_shortage_date: '2026-10-17T00:00:00Z'
      },
      {
        id: 'inv-fuel-echo',
        sku: 'INV-FUEL-ECHO',
        name: 'Waypost Echo Forward Fuel Pods',
        category: 'Fuel & Propellant',
        location_id: 'loc-wayp-ech',
        quantity_on_hand: 4200.0,
        safety_stock_threshold: 1500.0,
        daily_burn_rate: 150.0,
        days_of_supply_remaining: 28.0,
        unit: 'Liters',
        predicted_shortage_date: '2026-09-30T00:00:00Z'
      }
    ];

    this.inventoryTransactions = [
      {
        id: 'tx-01',
        inventory_item_id: 'inv-fuel-s7',
        transaction_type: 'Expedition Issue',
        quantity: -800.0,
        balance_after: 3450.0,
        authorized_by: 'Logistics Officer',
        reference_id: 'ALPHA-STAGE-PREP',
        timestamp: '2026-09-01T12:00:00Z'
      },
      {
        id: 'tx-02',
        inventory_item_id: 'inv-fuel-s7',
        transaction_type: 'Emergency Reserve Transfer',
        quantity: 0.0,
        balance_after: 3450.0,
        authorized_by: 'Station Commander',
        reference_id: 'STATION-CONDITION-LOCK',
        timestamp: '2026-09-02T01:00:00Z'
      }
    ];

    this.expeditions = [
      {
        id: 'exp-alpha',
        code: 'EXP-ALPHA',
        name: 'Expedition Alpha (Glacier Core Bore)',
        status: 'replanning',
        priority_level: 'station_priority',
        lead_officer: 'Dr. Marcus Thorne',
        target_location_id: 'loc-glac-rdg',
        scheduled_start: '2026-09-04T00:00:00Z',
        scheduled_end: '2026-09-20T00:00:00Z',
        readiness_score: 42,
        objective: 'Deep bedrock cryo-core extraction. FLAGGED FOR REPLANNING: Station core generator faulty and fuel critically low; station primacy requires resource reclamation.',
        hazard_class: 'Class 5 Extreme Polar Bore',
        allocated_asset_ids: ['asset-gen-001', 'asset-rig-cor-03'],
        assigned_personnel_ids: ['per-01', 'per-02'],
        cargo_ids: ['cargo-alpha-bore']
      },
      {
        id: 'exp-beta',
        code: 'EXP-BETA',
        name: 'Expedition Beta (Seismic Array Setup)',
        status: 'active',
        priority_level: 'high',
        lead_officer: 'Dr. Sarah Lin',
        target_location_id: 'loc-wayp-ech',
        scheduled_start: '2026-09-01T00:00:00Z',
        scheduled_end: '2026-09-11T00:00:00Z',
        readiness_score: 78,
        objective: 'Installation of high-frequency tectonic and glacial cracking listening arrays along Waypost Echo ridge.',
        hazard_class: 'Class 3 Cold Traverse',
        allocated_asset_ids: ['asset-vhc-99'],
        assigned_personnel_ids: ['per-03', 'per-04'],
        cargo_ids: ['cargo-beta-seis']
      },
      {
        id: 'exp-gamma',
        code: 'EXP-GAMMA',
        name: 'Expedition Gamma (Meteorite Field Recon)',
        status: 'planning',
        priority_level: 'standard',
        lead_officer: 'Capt. Liam O\'Connor',
        target_location_id: 'loc-outp-dlt',
        scheduled_start: '2026-09-07T00:00:00Z',
        scheduled_end: '2026-09-16T00:00:00Z',
        readiness_score: 85,
        objective: 'Systematic sweep of blue ice moraines for extraterrestrial micrometeorite samples.',
        hazard_class: 'Class 2 Ice Surface Survey',
        allocated_asset_ids: ['asset-vhc-99'],
        assigned_personnel_ids: ['per-05'],
        cargo_ids: []
      }
    ];

    this.syncEvents = [
      {
        id: 'sync-evt-01',
        client_device_id: 'DEV-TRAVERSE-ECHO-1',
        origin_site: 'Waypost Echo Automated Weather Pod',
        entity_type: 'asset_telemetry',
        action: 'UPDATE',
        payload: {
          asset_serial: 'VHC-99',
          location_code: 'LOC-WAYP-ECH',
          fuel_level_pct: 71,
          odometer_km: 1420.5,
          ambient_temp_c: -52.4,
          note: 'Passed checkpoint Alpha-Ridge in heavy drift.'
        },
        status: 'pending',
        retry_count: 0,
        created_at: '2026-09-02T16:10:00Z'
      },
      {
        id: 'sync-evt-02',
        client_device_id: 'DEV-SURVEY-RIG-ALPHA',
        origin_site: 'Field Site Glacier Ridge Remote Beacon',
        entity_type: 'inventory_consumption',
        action: 'CREATE',
        payload: {
          sku: 'INV-RAT-MRE',
          quantity_consumed: 8,
          logged_by: 'Dr. Marcus Thorne',
          biometric_alert: 'Cold exposure level 2, hot rations administered.'
        },
        status: 'pending',
        retry_count: 0,
        created_at: '2026-09-02T17:05:00Z'
      },
      {
        id: 'sync-evt-03',
        client_device_id: 'DEV-AIR-CREW-DELTA',
        origin_site: 'Outpost Delta Runway Terminal',
        entity_type: 'checkpoint_log',
        action: 'UPDATE',
        payload: {
          shipment_tracking: 'SHIP-X-ARCTIC-AIR-09',
          runway_state: 'Runway de-icing crew mobilized. Expect window in 18 hrs.'
        },
        status: 'pending',
        retry_count: 0,
        created_at: '2026-09-02T17:45:00Z'
      }
    ];

    this.riskAlerts = [
      {
        id: 'alert-01',
        severity: 'CRITICAL',
        category: 'Inventory Shortage',
        title: 'Critical Station Fuel Depletion (<15%)',
        message: 'Sector 7 Base Station has only 1.4 days of diesel remaining (3,450L on hand). Station life support and habitat heat at imminent risk.',
        affected_object_type: 'inventory',
        affected_object_id: 'inv-fuel-s7',
        is_resolved: false,
        action_required: 'Enforce Station Primacy: Reclaim Expedition Alpha fuel allocations or divert emergency pods.',
        created_at: '2026-09-02T02:00:00Z'
      },
      {
        id: 'alert-02',
        severity: 'CRITICAL',
        category: 'Asset Fault',
        title: 'GEN-001 Primary Core Generator Failed',
        message: 'Turbocharger seal failure on Primary 450kW generator. Station currently running on sole un-redundant backup GEN-002.',
        affected_object_type: 'asset',
        affected_object_id: 'asset-gen-001',
        is_resolved: false,
        action_required: 'Dispatch emergency overhaul kit or transfer Alpha engineering resources to station core.',
        created_at: '2026-09-01T14:20:00Z'
      },
      {
        id: 'alert-03',
        severity: 'HIGH',
        category: 'Cargo Delayed',
        title: 'Shipment SHIP-X Grounded by Vortex',
        message: 'Twin Otter flight carrying 12,000L fuel bladders delayed at Outpost Delta due to 62kt crosswinds and blinding whiteout.',
        affected_object_type: 'shipment',
        affected_object_id: 'ship-fuel-09',
        is_resolved: false,
        action_required: 'Track satellite weather corridor; prepare ground traverse backup route.',
        created_at: '2026-09-02T08:15:00Z'
      },
      {
        id: 'alert-04',
        severity: 'HIGH',
        category: 'Asset Allocation Conflict',
        title: 'Asset VHC-99 Double-Booked for Beta & Gamma',
        message: 'Kässbohrer Snowcat VHC-99 scheduled concurrently for Seismic Ridge Traverse and Meteorite Blue Ice Reconnaissance.',
        affected_object_type: 'asset',
        affected_object_id: 'asset-vhc-99',
        is_resolved: false,
        action_required: 'Reassign Gamma to secondary carrier or stagger departure schedule.',
        created_at: '2026-09-02T04:35:00Z'
      },
      {
        id: 'alert-05',
        severity: 'HIGH',
        category: 'Readiness Deficit',
        title: 'Expedition Alpha Readiness Critical (42% < 60%)',
        message: 'Expedition Alpha readiness has collapsed to 42% due to generator failure, fuel scarcity, and harsh weather. Station priority mandates replanning.',
        affected_object_type: 'expedition',
        affected_object_id: 'exp-alpha',
        is_resolved: false,
        action_required: 'Approve Replanning Order: Return Alpha power and fuel assets to Base Station reserves.',
        created_at: '2026-09-02T05:00:00Z'
      },
      {
        id: 'alert-06',
        severity: 'MEDIUM',
        category: 'Offline Sync Pending',
        title: '3 Field Telemetry Buffers Awaiting Uplink',
        message: 'Waypost Echo remote logger and field traverse telemetry units have 3 offline queue packets waiting for satellite sync burst.',
        affected_object_type: 'sync',
        affected_object_id: 'sync-queue-hub',
        is_resolved: false,
        action_required: 'Execute burst synchronization over encrypted burst radio channel.',
        created_at: '2026-09-02T16:10:00Z'
      }
    ];

    this.recommendations = [
      {
        id: 'rec-01',
        expedition_id: 'exp-alpha',
        priority: 'immediate',
        action_type: 'Trigger Replanning',
        rationale: 'Station operational condition takes priority: Base Station heat and power reserves are at critical threshold while GEN-001 is broken and SHIP-X fuel flight is grounded.',
        suggested_payload: {
          action: 'REPLAN_ALPHA',
          reclaim_fuel_liters: 800,
          divert_technician: 'Nadia Rostova'
        },
        is_applied: false,
        generated_at: '2026-09-02T06:00:00Z'
      }
    ];

    this.auditLogs = [
      {
        id: 'log-01',
        timestamp: '2026-09-01T14:25:00Z',
        category: 'ASSET_ALARM',
        action: 'STATUS_CHANGE',
        actor: 'Station Telemetry Monitor',
        details: 'GEN-001 triggered ERR-TURBO-SEAL-FAIL. Status updated to FAULTY.'
      },
      {
        id: 'log-02',
        timestamp: '2026-09-02T04:36:00Z',
        category: 'CONFLICT_DETECTED',
        action: 'SCHEDULE_OVERLAP',
        actor: 'Allocation Intelligence Engine',
        details: 'Asset VHC-99 flagged with conflict between Expedition Beta and Expedition Gamma.'
      },
      {
        id: 'log-03',
        timestamp: '2026-09-02T08:20:00Z',
        category: 'CARGO_DELAY',
        action: 'FLIGHT_ABORT',
        actor: 'Major Arjun Patel',
        details: 'Shipment SHIP-X marked DELAYED due to severe Category 3 polar blizzard.'
      },
      {
        id: 'log-04',
        timestamp: '2026-09-02T09:00:00Z',
        category: 'STATION_COMMAND',
        action: 'STATION_PRIMACY_ACTIVE',
        actor: 'Cmdr. Elena Vance',
        details: 'Station Operational Condition declared absolute priority. Expedition Alpha flagged for resource replanning.'
      }
    ];
  }

  recomputeAllReadiness() {
    const stationFuel = this.inventoryItems.find(i => i.id === 'inv-fuel-s7');
    const stationGenerators = this.assets.filter(a => a.category === 'Power / Life Support');

    for (const exp of this.expeditions) {
      const allocatedAssets = this.assets.filter(a => exp.allocated_asset_ids.includes(a.id));
      const expShipments = this.shipments.filter(s => {
        const cargo = this.cargo.find(c => c.id === s.cargo_id);
        return cargo && cargo.assigned_expedition_id === exp.id;
      });

      const breakdown = evaluateExpeditionReadiness(
        exp,
        allocatedAssets,
        expShipments,
        stationFuel,
        stationGenerators
      );

      exp.readiness_score = breakdown.overall_score;
      exp.readiness_breakdown = breakdown;
    }
  }

  recordAudit(category: string, action: string, actor: string, details: string, metadata?: Record<string, any>) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      category,
      action,
      actor,
      details,
      metadata
    });
  }

  // --- Station Operational Condition & Expedition Alpha Replanning ---
  flagExpeditionForReplanning(expeditionId: string, actor: string = 'Station Commander') {
    const exp = this.expeditions.find(e => e.id === expeditionId);
    if (!exp) return null;

    exp.status = 'replanning';
    exp.priority_level = 'station_priority';

    this.recordAudit(
      'EXPEDITION_REPLAN',
      'FLAG_FOR_REPLANNING',
      actor,
      `Expedition ${exp.code} allocation flagged for replanning to preserve Station Operational Condition.`
    );

    // Update alert
    const alert = this.riskAlerts.find(a => a.affected_object_id === exp.id);
    if (alert) {
      alert.message = `${exp.code} formally flagged for replanning. Station command reclaiming power and fuel reserves.`;
    }

    this.recomputeAllReadiness();
    return exp;
  }

  reclaimAlphaResources(actor: string = 'Cmdr. Elena Vance') {
    const alpha = this.expeditions.find(e => e.id === 'exp-alpha');
    const fuelItem = this.inventoryItems.find(i => i.id === 'inv-fuel-s7');
    const gen001 = this.assets.find(a => a.id === 'asset-gen-001');

    if (!alpha || !fuelItem) return false;

    // 1. Reclaim 800L staging fuel back to Station main tank
    fuelItem.quantity_on_hand += 800;
    fuelItem.days_of_supply_remaining = Number((fuelItem.quantity_on_hand / fuelItem.daily_burn_rate).toFixed(1));

    // Log transaction
    this.inventoryTransactions.unshift({
      id: `tx-${Date.now()}`,
      inventory_item_id: fuelItem.id,
      transaction_type: 'Station Priority Fuel Reclamation',
      quantity: 800,
      balance_after: fuelItem.quantity_on_hand,
      authorized_by: actor,
      reference_id: 'ALPHA-RECLAIM-ORDER-01',
      timestamp: new Date().toISOString()
    });

    // 2. Re-assign technician Nadia Rostova to Station Core Repair
    const nadia = this.personnel.find(p => p.badge_number === 'BADGE-802');
    if (nadia) {
      nadia.assigned_expedition_id = undefined;
    }

    // 3. Mark Alpha's generator allocation released to station priority
    const genAlloc = this.allocations.find(a => a.asset_id === 'asset-gen-001' && a.expedition_id === 'exp-alpha');
    if (genAlloc) {
      genAlloc.is_active = false;
      genAlloc.conflict_details = 'Reclaimed for Station Life-Support Primacy.';
    }

    // 4. Mark recommendation applied
    const rec = this.recommendations.find(r => r.expedition_id === 'exp-alpha');
    if (rec) {
      rec.is_applied = true;
    }

    this.recordAudit(
      'STATION_PRIMACY',
      'RESOURCE_RECLAMATION',
      actor,
      'Reclaimed 800L fuel and emergency engineering crew from Expedition Alpha to secure Station Sector 7 heat and power.'
    );

    // Resolve or downgrade fuel shortage alert
    const fuelAlert = this.riskAlerts.find(a => a.affected_object_id === 'inv-fuel-s7');
    if (fuelAlert && fuelItem.days_of_supply_remaining >= 1.7) {
      fuelAlert.severity = 'HIGH';
      fuelAlert.message = `Fuel bolstered by 800L reclamation (now ${fuelItem.quantity_on_hand}L, ${fuelItem.days_of_supply_remaining} days). Monitoring blizzard corridor.`;
    }

    this.recomputeAllReadiness();
    return true;
  }

  repairGenerator(assetId: string = 'asset-gen-001', actor: string = 'Chief Eng. Tatyana Chen') {
    const asset = this.assets.find(a => a.id === assetId);
    if (!asset) return null;

    asset.current_status = 'operational';
    asset.telemetry = {
      oil_pressure_psi: 48.0,
      bearing_temp_c: 64,
      vibration_mm_s: 1.2,
      output_kw: 440,
      status: 'OVERHAULED_NOMINAL'
    };

    // Close maintenance record
    const maint = this.maintenanceRecords.find(m => m.asset_id === assetId && m.status === 'in_progress');
    if (maint) {
      maint.status = 'completed';
      maint.completed_at = new Date().toISOString();
      maint.parts_replaced = 'Turbine Seal Kit TITAN-600-TK and synthetic Arctic lube flush';
    }

    // Resolve alert
    const alert = this.riskAlerts.find(a => a.affected_object_id === assetId);
    if (alert) {
      alert.is_resolved = true;
      alert.resolved_by = actor;
      alert.resolved_at = new Date().toISOString();
    }

    this.recordAudit(
      'ASSET_MAINTENANCE',
      'REPAIR_COMPLETED',
      actor,
      `Repaired ${asset.serial_number} (${asset.name}). Restored 450kW power redundancy to Station Sector 7.`
    );

    this.recomputeAllReadiness();
    return asset;
  }

  resolveConflict(conflictId: string, assignedToExpeditionId: string, actor: string = 'Cmdr. Elena Vance') {
    const conflict = this.conflicts.find(c => c.id === conflictId);
    if (!conflict) return null;

    conflict.status = 'resolved';
    conflict.resolved_at = new Date().toISOString();

    const winnerExp = this.expeditions.find(e => e.id === assignedToExpeditionId);
    const loserExpId = conflict.expedition_a_id === assignedToExpeditionId ? conflict.expedition_b_id : conflict.expedition_a_id;
    const loserExp = this.expeditions.find(e => e.id === loserExpId);

    conflict.resolution_notes = `Resolved by Station Command: Awarded exclusively to ${winnerExp ? winnerExp.name : assignedToExpeditionId}. ${loserExp ? loserExp.name : loserExpId} departure staggered by 10 days.`;

    // Update allocations
    for (const alloc of this.allocations.filter(a => a.asset_id === conflict.entity_id)) {
      if (alloc.expedition_id === assignedToExpeditionId) {
        alloc.conflict_detected = false;
        alloc.conflict_details = 'Confirmed allocation post-resolution.';
      } else {
        alloc.conflict_detected = false;
        alloc.is_active = false;
        alloc.conflict_details = 'De-allocated: Reassigned to alternate window.';
      }
    }

    // Resolve alert
    const alert = this.riskAlerts.find(a => a.affected_object_id === conflict.entity_id && a.category === 'Asset Allocation Conflict');
    if (alert) {
      alert.is_resolved = true;
      alert.resolved_by = actor;
      alert.resolved_at = new Date().toISOString();
    }

    this.recordAudit(
      'CONFLICT_RESOLUTION',
      'RESOLVE_DOUBLE_BOOKING',
      actor,
      conflict.resolution_notes
    );

    this.recomputeAllReadiness();
    return conflict;
  }

  syncEvent(eventId: string, actor: string = 'Field Radio Link') {
    const evt = this.syncEvents.find(e => e.id === eventId);
    if (!evt || evt.status !== 'pending') return null;

    evt.status = 'synced';
    evt.synced_at = new Date().toISOString();

    // Apply event payload to live system state
    if (evt.entity_type === 'asset_telemetry' && evt.payload.asset_serial) {
      const asset = this.assets.find(a => a.serial_number === evt.payload.asset_serial);
      if (asset) {
        asset.telemetry.odometer_km = evt.payload.odometer_km;
        asset.telemetry.fuel_level_pct = evt.payload.fuel_level_pct;
        asset.operational_hours += 4.5;
      }
    } else if (evt.entity_type === 'inventory_consumption' && evt.payload.sku) {
      const inv = this.inventoryItems.find(i => i.sku === evt.payload.sku);
      if (inv) {
        inv.quantity_on_hand -= (evt.payload.quantity_consumed || 1);
        inv.days_of_supply_remaining = Number((inv.quantity_on_hand / inv.daily_burn_rate).toFixed(1));
        this.inventoryTransactions.unshift({
          id: `tx-sync-${Date.now()}`,
          inventory_item_id: inv.id,
          transaction_type: 'Offline Field Consumption Sync',
          quantity: -(evt.payload.quantity_consumed || 1),
          balance_after: inv.quantity_on_hand,
          authorized_by: evt.client_device_id,
          reference_id: evt.id,
          timestamp: new Date().toISOString()
        });
      }
    } else if (evt.entity_type === 'checkpoint_log' && evt.payload.shipment_tracking) {
      const shipment = this.shipments.find(s => s.tracking_number === evt.payload.shipment_tracking);
      if (shipment) {
        shipment.events.push({
          id: `evt-sync-${Date.now()}`,
          shipment_id: shipment.id,
          event_type: 'Runway De-icing Uplink',
          location_name: 'Outpost Delta Runway Terminal',
          timestamp: new Date().toISOString(),
          details: evt.payload.runway_state || 'De-icing ops commenced.',
          logged_by: evt.client_device_id
        });
      }
    }

    this.recordAudit(
      'OFFLINE_SYNC',
      'TELEMETRY_INGEST',
      evt.client_device_id,
      `Synchronized field buffer from ${evt.origin_site}: ${evt.entity_type} processed.`
    );

    // Check if any pending syncs remain
    const remainingPending = this.syncEvents.filter(s => s.status === 'pending');
    if (remainingPending.length === 0) {
      const syncAlert = this.riskAlerts.find(a => a.affected_object_type === 'sync');
      if (syncAlert) {
        syncAlert.is_resolved = true;
        syncAlert.resolved_by = actor;
        syncAlert.resolved_at = new Date().toISOString();
      }
    }

    this.recomputeAllReadiness();
    return evt;
  }

  syncAllPendingEvents(actor: string = 'Satellite Burst Controller') {
    const pending = this.syncEvents.filter(s => s.status === 'pending');
    for (const evt of pending) {
      this.syncEvent(evt.id, actor);
    }
    return this.syncEvents;
  }

  resolveAlert(alertId: string, actor: string = 'Mission Controller') {
    const alert = this.riskAlerts.find(a => a.id === alertId);
    if (!alert) return null;
    alert.is_resolved = true;
    alert.resolved_by = actor;
    alert.resolved_at = new Date().toISOString();

    this.recordAudit('ALERT_CENTER', 'ALERT_RESOLVED', actor, `Resolved alert: ${alert.title}`);
    return alert;
  }

  rerouteShipment(shipmentId: string, actor: string = 'Major Arjun Patel') {
    const shipment = this.shipments.find(s => s.id === shipmentId);
    if (!shipment) return null;

    shipment.status = 'in_transit';
    shipment.delay_reason = 'Rerouted via Surface Cat Traverse Trail C. Moving under ice tractor escort.';
    shipment.carrier = 'Polar Traverse Heavy Sled Unit 4';
    shipment.events.push({
      id: `evt-reroute-${Date.now()}`,
      shipment_id: shipment.id,
      event_type: 'Traverse Escort Reroute',
      location_name: 'Outpost Delta',
      timestamp: new Date().toISOString(),
      details: 'Air transport grounded by polar vortex. Cargo transferred to heavy surface sled convoy.',
      logged_by: actor
    });

    const alert = this.riskAlerts.find(a => a.affected_object_id === shipment.id);
    if (alert) {
      alert.severity = 'MEDIUM';
      alert.message = 'Shipment converted to ground heavy traverse line. ETA 22 hours.';
    }

    this.recordAudit('CARGO_OPERATIONS', 'REROUTE_SHIPMENT', actor, `Rerouted ${shipment.tracking_number} to surface traverse.`);
    this.recomputeAllReadiness();
    return shipment;
  }
}

export const db = new DatabaseStore();
