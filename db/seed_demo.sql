-- ============================================================================
-- PROJECT AVALANCHE: DEMO SCENARIO SEED SCRIPT (PostgreSQL)
-- Implements Smart India Hackathon Extreme Environment Operations
-- ============================================================================

-- 1. Roles & Users
INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111101', 'Station Commander', 'Full operational authority over station & field expeditions'),
('11111111-1111-1111-1111-111111111102', 'Logistics Director', 'Manages cargo manifests, air supply corridors, & supply burn rates'),
('11111111-1111-1111-1111-111111111103', 'Asset Engineer', 'Monitors mechanical health, life support generators & vehicle maintenance');

INSERT INTO users (id, username, email, full_name, role_id, callsign) VALUES
('22222222-2222-2222-2222-222222222201', 'cmd_vance', 'vance@avalanche.station', 'Cmdr. Elena Vance', '11111111-1111-1111-1111-111111111101', 'STATION-LEAD'),
('22222222-2222-2222-2222-222222222202', 'log_arjun', 'arjun@avalanche.station', 'Major Arjun Patel', '11111111-1111-1111-1111-111111111102', 'CARGO-CONTROL'),
('22222222-2222-2222-2222-222222222203', 'eng_tatyana', 'tatyana@avalanche.station', 'Chief Eng. Tatyana Chen', '11111111-1111-1111-1111-111111111103', 'CORE-CHIEF');

-- 2. Locations (Antarctic / Extreme Mountain Station Network)
INSERT INTO locations (id, code, name, type, coords_lat, coords_long, altitude_m, temp_celsius, weather_condition, notes) VALUES
('33333333-3333-3333-3333-333333333301', 'LOC-BASE-07', 'Base Station Sector 7 (Amundsen Hub)', 'Base Station', -89.9979, 139.2730, 2835, -46.5, 'Blizzard Category 3 (Wind 58kts)', 'Primary atmospheric research hub and life-support shelter. Station condition takes priority.'),
('33333333-3333-3333-3333-333333333302', 'LOC-WAYP-ECH', 'Waypost Echo (Ridge Traverse Pass)', 'Forward Waypost', -88.4200, 142.1500, 3120, -52.0, 'Whiteout Warning', 'Intermediate automated fuel cache and radio relay node.'),
('33333333-3333-3333-3333-333333333303', 'LOC-GLAC-RDG', 'Field Site Glacier Ridge', 'Field Glacier Site', -87.1850, 148.9000, 3450, -58.2, 'Sub-Zero Gale Force', 'Deep ice sheet sub-glacial drilling exploration zone (Alpha destination).'),
('33333333-3333-3333-3333-333333333304', 'LOC-OUTP-DLT', 'Outpost Delta (Blue Ice Runway)', 'Air Strip', -89.1500, 135.8000, 2600, -41.0, 'Runway Glazed Ice / Zero Visibility', 'Main cargo airlift landing strip. Current approach blocked.');

-- 3. Expeditions (Alpha, Beta, Gamma)
-- DEMO REQUIREMENT: Alpha readiness below 60% (42%), flagged for replanning due to station operational condition priority!
INSERT INTO expeditions (id, code, name, status, priority_level, lead_officer, target_location_id, scheduled_start, scheduled_end, readiness_score, objective, hazard_class) VALUES
('44444444-4444-4444-4444-444444444401', 'EXP-ALPHA', 'Expedition Alpha (Glacier Core Bore)', 'replanning', 'station_priority', 'Dr. Marcus Thorne', '33333333-3333-3333-3333-333333333303', NOW() + INTERVAL '2 days', NOW() + INTERVAL '18 days', 42, 'Deep bedrock cryo-core extraction. FLAGGED FOR REPLANNING: Station core generator faulty and fuel critically low; station primacy requires resource reclamation.', 'Class 5 Extreme Polar Bore'),
('44444444-4444-4444-4444-444444444402', 'EXP-BETA', 'Expedition Beta (Seismic Array Setup)', 'active', 'high', 'Dr. Sarah Lin', '33333333-3333-3333-3333-333333333302', NOW() - INTERVAL '1 day', NOW() + INTERVAL '9 days', 78, 'Installation of high-frequency tectonic and glacial cracking listening arrays along Waypost Echo ridge.', 'Class 3 Cold Traverse'),
('44444444-4444-4444-4444-444444444403', 'EXP-GAMMA', 'Expedition Gamma (Meteorite Field Recon)', 'planning', 'standard', 'Capt. Liam O Connor', '33333333-3333-3333-3333-333333333304', NOW() + INTERVAL '5 days', NOW() + INTERVAL '14 days', 85, 'Systematic sweep of blue ice moraines for extraterrestrial micrometeorite samples.', 'Class 2 Ice Surface Survey');

-- 4. Personnel
INSERT INTO personnel (id, badge_number, full_name, specialization, assigned_expedition_id, current_location_id, fitness_for_duty, biometric_status) VALUES
('55555555-5555-5555-5555-555555555501', 'BADGE-801', 'Dr. Marcus Thorne', 'Lead Glaciologist', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'fit', '{"heart_rate": 72, "spo2": 98, "core_temp": 36.9}'),
('55555555-5555-5555-5555-555555555502', 'BADGE-802', 'Nadia Rostova', 'Heavy Rig Operator', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'fit', '{"heart_rate": 78, "spo2": 96, "core_temp": 36.7}'),
('55555555-5555-5555-5555-555555555503', 'BADGE-803', 'Dr. Sarah Lin', 'Geophysicist', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', 'fit', '{"heart_rate": 80, "spo2": 95, "core_temp": 36.5}'),
('55555555-5555-5555-5555-555555555504', 'BADGE-804', 'Sven Lindqvist', 'Cold-Traverse Pilot', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', 'fatigued', '{"heart_rate": 86, "spo2": 93, "core_temp": 36.2}'),
('55555555-5555-5555-5555-555555555505', 'BADGE-805', 'Capt. Liam O Connor', 'Exo-Planetary Geologist', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'fit', '{"heart_rate": 71, "spo2": 99, "core_temp": 37.0}'),
('55555555-5555-5555-5555-555555555506', 'BADGE-806', 'Dr. Aisha Al-Mansoor', 'Trauma Surgeon', NULL, '33333333-3333-3333-3333-333333333301', 'fit', '{"heart_rate": 68, "spo2": 98, "core_temp": 36.8}');

-- 5. Asset Types
INSERT INTO asset_types (id, category, model_name, manufacturer, maintenance_interval_hours, critical_for_station) VALUES
('66666666-6666-6666-6666-666666666601', 'Power / Life Support', 'Titan-600 Cryo Turbo-Generator (450kW)', 'Nordic Polar Power Systems', 200, TRUE),
('66666666-6666-6666-6666-666666666602', 'Extreme Vehicle', 'Kässbohrer PistenBully Polar Snowcat 600', 'Kässbohrer Geländefahrzeug', 150, TRUE),
('66666666-6666-6666-6666-666666666603', 'Scientific Rig', 'Subglacial Hot-Water Cryo-Drill Rig', 'AWI Glaciology Labs', 100, FALSE),
('66666666-6666-6666-6666-666666666604', 'Extreme Vehicle', 'Haaglunds BV-206 Articulated Carrier', 'BAE Systems Hägglunds', 180, FALSE);

-- 6. Assets
-- DEMO REQUIREMENT: One generator marked faulty (GEN-001)
-- DEMO REQUIREMENT: One asset allocation conflict (VHC-99 allocated to Beta & Gamma)
INSERT INTO assets (id, asset_type_id, serial_number, name, current_status, operational_hours, location_id, telemetry, last_service_date, next_service_due) VALUES
('77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666601', 'GEN-001', 'Primary Core Habitat Generator 01', 'faulty', 412.5, '33333333-3333-3333-3333-333333333301', '{"oil_pressure_psi": 11.2, "bearing_temp_c": 118, "vibration_mm_s": 8.9, "error_code": "ERR-TURBO-SEAL-FAIL"}', NOW() - INTERVAL '45 days', NOW() - INTERVAL '5 days'),
('77777777-7777-7777-7777-777777777702', '66666666-6666-6666-6666-666666666601', 'GEN-002', 'Secondary Station Life-Support Generator 02', 'operational', 189.0, '33333333-3333-3333-3333-333333333301', '{"oil_pressure_psi": 46.5, "bearing_temp_c": 62, "vibration_mm_s": 1.4, "status": "NOMINAL_LOAD_82%"}', NOW() - INTERVAL '12 days', NOW() + INTERVAL '28 days'),
('77777777-7777-7777-7777-777777777703', '66666666-6666-6666-6666-666666666602', 'VHC-99', 'Polar Traverse Snowcat VHC-99', 'operational', 310.2, '33333333-3333-3333-3333-333333333301', '{"fuel_level_pct": 74, "track_tension": "optimal", "engine_temp_c": 68}', NOW() - INTERVAL '15 days', NOW() + INTERVAL '35 days'),
('77777777-7777-7777-7777-777777777704', '66666666-6666-6666-6666-666666666603', 'RIG-COR-03', 'Deep Ice Core Drill System Alpha-03', 'operational', 88.0, '33333333-3333-3333-3333-333333333301', '{"bit_wear_pct": 14, "hydraulic_fluid": "optimal"}', NOW() - INTERVAL '20 days', NOW() + INTERVAL '40 days'),
('77777777-7777-7777-7777-777777777705', '66666666-6666-6666-6666-666666666604', 'VHC-102', 'BV-206 Personnel Carrier Delta', 'operational', 142.0, '33333333-3333-3333-3333-333333333304', '{"fuel_level_pct": 91, "cabin_heater": "nominal"}', NOW() - INTERVAL '8 days', NOW() + INTERVAL '50 days');

-- 7. Asset Allocations & Conflicts
-- DEMO REQUIREMENT: VHC-99 double allocated to Beta and Gamma -> Conflict Detected!
INSERT INTO asset_allocations (id, asset_id, expedition_id, allocated_by, required_from, required_until, conflict_detected, conflict_details) VALUES
('88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777703', '44444444-4444-4444-4444-444444444402', 'Field Ops Desk', NOW() - INTERVAL '1 day', NOW() + INTERVAL '9 days', TRUE, 'Schedule overlap: Asset VHC-99 is simultaneously scheduled for Expedition Gamma traverse.'),
('88888888-8888-8888-8888-888888888802', '77777777-7777-7777-7777-777777777703', '44444444-4444-4444-4444-444444444403', 'Survey Branch', NOW() + INTERVAL '5 days', NOW() + INTERVAL '14 days', TRUE, 'Schedule overlap: Asset VHC-99 has not returned from Expedition Beta before Gamma scheduled departure.'),
('88888888-8888-8888-8888-888888888803', '77777777-7777-7777-7777-777777777701', '44444444-4444-4444-4444-444444444401', 'Station Command', NOW() + INTERVAL '2 days', NOW() + INTERVAL '18 days', FALSE, 'Alpha allocation flagged for replanning due to station generator emergency and power priority.');

-- Record in conflicts table
INSERT INTO conflicts (id, conflict_type, entity_type, entity_id, expedition_a_id, expedition_b_id, status, resolution_notes) VALUES
('99999999-9999-9999-9999-999999999901', 'Asset Double Booking', 'asset', '77777777-7777-7777-7777-777777777703', '44444444-4444-4444-4444-444444444402', '44444444-4444-4444-4444-444444444403', 'detected', 'VHC-99 Snowcat requested concurrently by Beta (Seismic Ridge) and Gamma (Blue Ice Recon). Requires commander resolution.');

-- 8. Maintenance Records
INSERT INTO maintenance_records (id, asset_id, maintenance_type, status, technician, description, parts_replaced, hours_logged, completed_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777701', 'Emergency Repair', 'in_progress', 'Chief Eng. Tatyana Chen', 'Turbocharger seal disintegrated causing dangerous oil pressure drop to 11.2 PSI during -46C freeze. Unit emergency shutdown to avoid engine seizure. Station operating on sole backup GEN-002.', 'Awaiting Turbine Seal Ring Kit Part #TITAN-600-TK', 6.5, NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '77777777-7777-7777-7777-777777777703', 'Pre-Traverse Inspection', 'completed', 'Nadia Rostova', 'Replaced hydraulic line seals and tested cold start heating blocks at -40C.', 'High-pressure Arctic O-Rings', 3.0, NOW() - INTERVAL '3 days');

-- 9. Cargo & Shipments
-- DEMO REQUIREMENT: One cargo shipment delayed (SHIP-X)
INSERT INTO cargo (id, manifest_number, description, total_weight_kg, is_hazmat, requires_cold_chain, assigned_expedition_id) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'CRG-FUEL-JET-A1', 'Emergency Station Fuel Replenishment Flight Pack (12,000L Arctic Blend)', 9600.0, TRUE, FALSE, NULL),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'CRG-SEIS-PACK', 'Expedition Beta Precision Geophone Arrays & Data Telemetry Buoys', 1450.0, FALSE, TRUE, '44444444-4444-4444-4444-444444444402'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'CRG-ALPHA-BORE', 'Expedition Alpha Sub-Glacial Core Casing & Cryo-Preservation Dewars', 2800.0, TRUE, TRUE, '44444444-4444-4444-4444-444444444401');

INSERT INTO cargo_items (id, cargo_id, item_name, sku, quantity, unit, weight_kg) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'Arctic Grade Diesel/Jet-A1 Fuel Bladders', 'SKU-FL-JET', 12, '1000L Bladders', 9600.0),
('cccccccc-cccc-cccc-cccc-cccccccccc02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'Ultra-Low Temp Geophones (-60C rated)', 'SKU-SCI-GEO', 36, 'units', 720.0),
('cccccccc-cccc-cccc-cccc-cccccccccc03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'Titanium Core Drill Collars 120mm', 'SKU-RIG-COL', 20, 'sections', 1800.0);

INSERT INTO shipments (id, tracking_number, cargo_id, origin_location_id, destination_location_id, carrier, status, departure_time, estimated_arrival, actual_arrival, delay_reason, is_critical_supply) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', 'SHIP-X-ARCTIC-AIR-09', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', '33333333-3333-3333-3333-333333333304', '33333333-3333-3333-3333-333333333301', 'LC-130 Hercules Ski-Wing Air Guard', 'delayed', NOW() - INTERVAL '14 hours', NOW() - INTERVAL '6 hours', NULL, 'Polar vortex crosswinds (62 kts) and zero-visibility blowing snow forced abort at Outpost Delta. Grounded pending blizzard lull.', TRUE),
('dddddddd-dddd-dddd-dddd-dddddddddd02', 'SHIP-BETA-TRV-02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', '33333333-3333-3333-3333-333333333301', '33333333-3333-3333-3333-333333333302', 'Waypost Heavy Sled Convoy 1', 'in_transit', NOW() - INTERVAL '18 hours', NOW() + INTERVAL '8 hours', NULL, NULL, FALSE);

INSERT INTO shipment_events (id, shipment_id, event_type, location_name, timestamp, details, logged_by) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'Departure', 'Outpost Delta (Blue Ice Runway)', NOW() - INTERVAL '14 hours', 'Aircraft laden with 12,000L fuel bladders cleared for transit to Sector 7.', 'Tower Ops Delta'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'Weather Delay', 'Outpost Delta Runway', NOW() - INTERVAL '10 hours', 'Grounded by catastrophic squall line. Airspace closed. Delayed by +36 hours.', 'Major Arjun Patel');

-- 10. Inventory Items & Shortages
-- DEMO REQUIREMENT: One predicted fuel shortage (<15% at Station Sector 7)
INSERT INTO inventory_items (id, sku, name, category, location_id, quantity_on_hand, safety_stock_threshold, daily_burn_rate, days_of_supply_remaining, unit, predicted_shortage_date) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffff01', 'INV-FUEL-S7', 'Station Main Arctic Jet-A1 Diesel Reserves', 'Fuel & Propellant', '33333333-3333-3333-3333-333333333301', 3450.0, 5000.0, 2400.0, 1.4, 'Liters', NOW() + INTERVAL '34 hours'),
('ffffffff-ffff-ffff-ffff-ffffffffff02', 'INV-RAT-MRE', 'High-Calorie Polar Survival Rations Pack (4500 kcal)', 'Rations & Water', '33333333-3333-3333-3333-333333333301', 840.0, 300.0, 32.0, 26.2, 'Packs', NOW() + INTERVAL '26 days'),
('ffffffff-ffff-ffff-ffff-ffffffffff03', 'INV-MED-HYPO', 'Core Rewarming & Hypothermia Triage Kits', 'Medical & Pharma', '33333333-3333-3333-3333-333333333301', 18.0, 10.0, 0.4, 45.0, 'Kits', NOW() + INTERVAL '45 days'),
('ffffffff-ffff-ffff-ffff-ffffffffff04', 'INV-FUEL-ECHO', 'Waypost Echo Forward Fuel Pods', 'Fuel & Propellant', '33333333-3333-3333-3333-333333333302', 4200.0, 1500.0, 150.0, 28.0, 'Liters', NOW() + INTERVAL '28 days');

INSERT INTO inventory_transactions (id, inventory_item_id, transaction_type, quantity, balance_after, authorized_by, reference_id) VALUES
('10101010-1010-1010-1010-101010101001', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Expedition Issue', -800.0, 3450.0, 'Logistics Officer', 'ALPHA-STAGE-PREP'),
('10101010-1010-1010-1010-101010101002', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Emergency Station Reserve Transfer', 0.0, 3450.0, 'Station Commander', 'STATION-CONDITION-LOCK');

-- 11. Readiness Engine Scores
INSERT INTO readiness_scores (id, expedition_id, overall_score, asset_health_score, cargo_readiness_score, personnel_score, weather_risk_factor, threshold) VALUES
('20202020-2020-2020-2020-202020202001', '44444444-4444-4444-4444-444444444401', 42, 28, 54, 88, 75, 60),
('20202020-2020-2020-2020-202020202002', '44444444-4444-4444-4444-444444444402', 78, 72, 85, 82, 40, 60),
('20202020-2020-2020-2020-202020202003', '44444444-4444-4444-4444-444444444403', 85, 80, 92, 94, 25, 60);

-- 12. Centralized Risk Center Alerts (🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Informational)
INSERT INTO risk_alerts (id, severity, category, title, message, affected_object_type, affected_object_id, is_resolved, action_required) VALUES
('30303030-3030-3030-3030-303030303001', 'CRITICAL', 'Inventory Shortage', 'Critical Station Fuel Depletion (<15%)', 'Sector 7 Base Station has only 1.4 days of diesel remaining (3,450L on hand). Station life support and habitat heat at imminent risk.', 'inventory', 'ffffffff-ffff-ffff-ffff-ffffffffff01', FALSE, 'Enforce Station Primacy: Reclaim Expedition Alpha fuel allocations or divert emergency pods.'),
('30303030-3030-3030-3030-303030303002', 'CRITICAL', 'Asset Fault', 'GEN-001 Primary Core Generator Failed', 'Turbocharger seal failure on Primary 450kW generator. Station currently running on sole un-redundant backup GEN-002.', 'asset', '77777777-7777-7777-7777-777777777701', FALSE, 'Dispatch emergency overhaul kit or transfer Alpha engineering resources.'),
('30303030-3030-3030-3030-303030303003', 'HIGH', 'Cargo Delayed', 'Shipment SHIP-X Grounded by Vortex', 'Twin Otter flight carrying 12,000L fuel bladders delayed at Outpost Delta due to 62kt crosswinds and blinding whiteout.', 'shipment', 'dddddddd-dddd-dddd-dddd-dddddddddd01', FALSE, 'Track satellite weather corridor; prepare ground traverse backup route.'),
('30303030-3030-3030-3030-303030303004', 'HIGH', 'Asset Allocation Conflict', 'Asset VHC-99 Double-Booked for Beta & Gamma', 'Kässbohrer Snowcat VHC-99 scheduled concurrently for Seismic Ridge Traverse and Meteorite Blue Ice Reconnaissance.', 'asset', '77777777-7777-7777-7777-777777777703', FALSE, 'Reassign Gamma to secondary carrier or stagger departure schedule.'),
('30303030-3030-3030-3030-303030303005', 'HIGH', 'Readiness Deficit', 'Expedition Alpha Readiness Critical (42% < 60%)', 'Expedition Alpha readiness has collapsed to 42% due to generator failure, fuel scarcity, and harsh weather. Station priority mandates replanning.', 'expedition', '44444444-4444-4444-4444-444444444401', FALSE, 'Approve Replanning Order: Return Alpha power and fuel assets to Base Station reserves.'),
('30303030-3030-3030-3030-303030303006', 'MEDIUM', 'Offline Sync Pending', '3 Field Telemetry Buffers Awaiting Uplink', 'Waypost Echo remote logger and field traverse telemetry units have 3 offline queue packets waiting for satellite sync burst.', 'sync', 'sync-queue-hub', FALSE, 'Execute burst synchronization over encrypted burst radio channel.');

-- 13. Offline Sync Simulation Events (3 pending updates)
-- DEMO REQUIREMENT: Three offline updates waiting to synchronize
INSERT INTO sync_events (id, client_device_id, origin_site, entity_type, action, payload, status) VALUES
('40404040-4040-4040-4040-404040404001', 'DEV-TRAVERSE-ECHO-1', 'Waypost Echo Automated Weather Pod', 'asset_telemetry', 'UPDATE', '{"asset_serial": "VHC-99", "location_code": "LOC-WAYP-ECH", "fuel_level_pct": 71, "odometer_km": 1420.5, "ambient_temp_c": -52.4, "note": "Passed checkpoint Alpha-Ridge in heavy drift."}', 'pending'),
('40404040-4040-4040-4040-404040404002', 'DEV-SURVEY-RIG-ALPHA', 'Field Site Glacier Ridge Remote Beacon', 'inventory_consumption', 'CREATE', '{"sku": "INV-RAT-MRE", "quantity_consumed": 8, "logged_by": "Dr. Marcus Thorne", "biometric_alert": "Cold exposure level 2, hot rations administered."}', 'pending'),
('40404040-4040-4040-4040-404040404003', 'DEV-AIR-CREW-DELTA', 'Outpost Delta Runway Terminal', 'checkpoint_log', 'UPDATE', '{"shipment_tracking": "SHIP-X-ARCTIC-AIR-09", "runway_state": "Runway de-icing crew mobilized. Expect window in 18 hrs."}', 'pending');

-- 14. Operational Condition Recommendations
INSERT INTO recommendations (id, expedition_id, priority, action_type, rationale, suggested_payload) VALUES
('50505050-5050-5050-5050-505050505001', '44444444-4444-4444-4444-444444444401', 'immediate', 'Trigger Replanning', 'Station operational condition takes priority: Base Station heat and power reserves are at critical threshold while GEN-001 is broken and SHIP-X fuel flight is grounded.', '{"action": "REPLAN_ALPHA", "reclaim_fuel_liters": 800, "divert_technician": "Nadia Rostova"}');
