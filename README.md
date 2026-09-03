# PROJECT AVALANCHE (Smart India Hackathon)
### Advanced Visual Logistics & Asset Network for Complex Hazardous Environments

> **Core Mission Directive:** *"Station operational condition takes priority. Flag Expedition Alpha allocation for replanning."*

Project AVALANCHE is a mission control logistics intelligence and asset network application designed for extreme, high-risk operational environments (such as Arctic and Antarctic polar research stations).

---

## Key Features & User Requirements Fulfilled

### 1. Station Operational Primacy
- **Base Station Sector 7 Priority:** When life-support systems (power generation, heating, or fuel reserves) fall below critical thresholds during extreme weather conditions (-46.5°C, Category 3 Blizzard, 58 knot winds), station survival takes automatic precedence over field expeditions.
- **Expedition Alpha Replanning:** The system automatically flags **Expedition Alpha (Glacier Core Bore)** for resource replanning, pausing its planned departure and reclaiming 800L of diesel fuel and technical crew to guarantee base habitat heating.

### 2. Centralized Risk Center (Section 12)
A unified, real-time risk triage center categorizing alerts by severity:
- 🔴 **Critical:** Fuel shortage below threshold (<15% buffer, 1.4 days of supply remaining), single generator power redundancy (`ERR-TURBO-SEAL-FAIL` on GEN-001).
- 🟠 **High:** Supply transport grounded (`SHIP-X-ARCTIC-AIR-09` 12,000L fuel delivery delayed by polar vortex), concurrent asset allocation conflict (VHC-99 Snowcat double-booked for Expedition Beta and Gamma).
- 🟡 **Medium:** Offline field sensor packets pending satellite uplink burst synchronization.
- 🟢 **Informational:** System operational nominal benchmarks and audit logs.
- **Direct Drill-Down:** Clicking **"Investigate Object"** on any alert automatically routes the operator directly to the affected asset, shipment, expedition, or inventory ledger.

### 3. Dynamic Multi-Variable Readiness Engine
Evaluates expedition viability across five dimensions:
- Asset physical health & maintenance status
- Cargo packing and delivery status
- Personnel fitness for duty
- Environmental blizzard hazard class
- Station operational primacy penalty (applies a -25% readiness deduction if the station is in power/fuel deficit)

### 4. Normalized PostgreSQL Database (21 Relational Tables)
Defined in `db/init.sql` with full foreign keys, check constraints, immutable event streams, and comprehensive audit history:
1. `users` — System accounts and cryptographic credentials
2. `roles` — Role-based access control (RBAC)
3. `expeditions` — Mission profiles, objectives, and statuses
4. `personnel` — Field officers, callsigns, specializations, and fitness
5. `locations` — Polar stations, wayposts, glaciers, and airstrips
6. `cargo` — Manifest records, weights, hazmat flags, and cold-chain indicators
7. `cargo_items` — Line items with SKUs and quantities
8. `shipments` — Transport logistics tracking records
9. `shipment_events` — Immutable waypoint checkpoint timeline
10. `assets` — Physical hardware, serial numbers, operational hours, telemetry
11. `asset_types` — Equipment classification specifications
12. `asset_allocations` — Relational joins between expeditions and equipment
13. `maintenance_records` — Overhaul histories and parts replaced (never overwritten)
14. `inventory_items` — Fuel, food, medical supplies, and burn rates
15. `inventory_transactions` — Append-only ledger of receipts, allocations, and reclaims
16. `consumption_records` — Daily burn logs for forecast modeling
17. `sync_events` — Offline field buffers waiting for satellite connection
18. `conflicts` — Automated double-booking detection and resolution notes
19. `risk_alerts` — Real-time risk center alerts with status flags
20. `readiness_scores` — Historical readiness calculation scores
21. `recommendations` — AI and algorithmic logistics remediation recommendations

### 5. Offline Satellite Uplink Resilience
Simulates remote field devices (e.g. rugged tablets at Waypost Echo or Glacier Ridge) buffering sensor packets during RF blackouts. Operators can trigger a **Burst Sync** to ingest all cached telemetry into the central relational database.

---

## Technical Stack & Architecture

- **Backend:** Node.js, Express, TypeScript (`server.ts`, `server/routes.ts`, `server/db.ts`)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Database Architecture:** PostgreSQL relational schema (`db/init.sql`), demo seed scenario (`db/seed_demo.sql`)
- **Design Archetype:** Mission Control Tactical Surface — JetBrains Mono typography, high-contrast dark neutrals (`#090D13`, `#121721`), functional status telemetry, and responsive spatial vector mapping.

---

## Running the Project

```bash
# Start development server (serves on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
