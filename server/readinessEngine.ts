import { Expedition, Asset, Shipment, InventoryItem, ReadinessBreakdown } from './types';

export function evaluateExpeditionReadiness(
  expedition: Expedition,
  allocatedAssets: Asset[],
  associatedShipments: Shipment[],
  stationFuel: InventoryItem | undefined,
  stationGenerators: Asset[]
): ReadinessBreakdown {
  const issues: string[] = [];

  // 1. Asset Health (Weight: 35%)
  let assetScore = 100;
  if (allocatedAssets.length === 0) {
    assetScore = 40;
    issues.push('No primary assets allocated yet');
  } else {
    for (const asset of allocatedAssets) {
      if (asset.current_status === 'faulty') {
        assetScore -= 45;
        issues.push(`Critical asset [${asset.serial_number} - ${asset.name}] is FAULTY`);
      } else if (asset.current_status === 'maintenance') {
        assetScore -= 25;
        issues.push(`Asset [${asset.serial_number}] is under active maintenance`);
      }
    }
  }
  assetScore = Math.max(10, Math.min(100, assetScore));

  // 2. Cargo Readiness (Weight: 25%)
  let cargoScore = 100;
  for (const shipment of associatedShipments) {
    if (shipment.status === 'delayed') {
      cargoScore -= 40;
      issues.push(`Shipment [${shipment.tracking_number}] is DELAYED: ${shipment.delay_reason || 'Adverse weather'}`);
    } else if (shipment.status === 'in_transit') {
      cargoScore -= 10;
    }
  }
  cargoScore = Math.max(15, Math.min(100, cargoScore));

  // 3. Personnel Score (Weight: 20%)
  let personnelScore = 90;
  if (expedition.assigned_personnel_ids.length < 2) {
    personnelScore -= 20;
    issues.push('Crew staffing below mandatory polar minimum of 2');
  }

  // 4. Station Condition Primacy & Weather Risk (Weight: 20%)
  let weatherRisk = 30; // base risk
  if (expedition.hazard_class.includes('Class 5')) {
    weatherRisk = 75;
    issues.push('Extreme Arctic Hazard Class 5 in target bore sector');
  } else if (expedition.hazard_class.includes('Class 3')) {
    weatherRisk = 45;
  }

  // Station Primacy Check:
  // If Station Fuel is dangerously low or Station has broken core generator,
  // station condition takes priority over exploratory missions like Alpha.
  let stationPrimacyPenalty = 0;
  const faultyStationGen = stationGenerators.find(g => g.current_status === 'faulty');
  if (faultyStationGen && expedition.priority_level !== 'critical' && expedition.code === 'EXP-ALPHA') {
    stationPrimacyPenalty += 20;
    issues.push(`Station Primary Generator [${faultyStationGen.serial_number}] is offline: station life support priority`);
  }

  if (stationFuel && stationFuel.days_of_supply_remaining < 2.0 && expedition.code === 'EXP-ALPHA') {
    stationPrimacyPenalty += 15;
    issues.push(`Station Fuel reserves under critical threshold (${stationFuel.days_of_supply_remaining.toFixed(1)} days supply)`);
  }

  // Calculate weighted overall score
  const rawScore =
    (assetScore * 0.35) +
    (cargoScore * 0.25) +
    (personnelScore * 0.20) +
    ((100 - weatherRisk) * 0.20) -
    stationPrimacyPenalty;

  const overall = Math.max(5, Math.min(100, Math.round(rawScore)));

  if (overall < 60) {
    issues.push(`READINESS COLLAPSE: Score ${overall}% is below mandatory mission threshold of 60%`);
  }

  return {
    overall_score: overall,
    asset_health_score: Math.round(assetScore),
    cargo_readiness_score: Math.round(cargoScore),
    personnel_score: Math.round(personnelScore),
    weather_risk_factor: weatherRisk,
    threshold: 60,
    evaluated_at: new Date().toISOString(),
    issues
  };
}
