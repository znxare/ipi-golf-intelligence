export interface EquipmentCatalogItem {
  id: string
  equipment: string
  sowQtyLabel: string
  sowQtyNumeric: number
  unitPriceINR: number | null
}

/**
 * The verified IPI opening position for a standard 18-hole course SOW.
 * Unit prices are the frozen catalog — never edited during negotiation.
 * `unitPriceINR: null` means the line is still TBD (not yet priced).
 */
export const EQUIPMENT_CATALOG: EquipmentCatalogItem[] = [
  { id: 'greens-ride-on-mower', equipment: 'Greens Ride-on Mower', sowQtyLabel: '3', sowQtyNumeric: 3, unitPriceINR: 7_016_000 },
  { id: 'greens-walk-mower', equipment: 'Greens Walk Mower / Backup', sowQtyLabel: '2', sowQtyNumeric: 2, unitPriceINR: null },
  { id: 'greens-roller', equipment: 'Greens Roller', sowQtyLabel: '2', sowQtyNumeric: 2, unitPriceINR: 3_186_000 },
  { id: 'tee-approach-mower', equipment: 'Tee / Approach Mower', sowQtyLabel: '2', sowQtyNumeric: 2, unitPriceINR: null },
  { id: 'fairway-mower', equipment: 'Fairway Mower', sowQtyLabel: '3', sowQtyNumeric: 3, unitPriceINR: 11_500_000 },
  { id: 'rough-mower', equipment: 'Rough Mower', sowQtyLabel: '3', sowQtyNumeric: 3, unitPriceINR: 16_500_000 },
  { id: 'bunker-rake', equipment: 'Bunker Rake', sowQtyLabel: '2', sowQtyNumeric: 2, unitPriceINR: 4_277_000 },
  { id: 'greens-aerator', equipment: 'Greens Aerator', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 6_372_000 },
  { id: 'fairway-aerator', equipment: 'Fairway Aerator', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 6_668_000 },
  { id: 'large-area-aerator', equipment: 'Large Area Aerator', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 8_365_000 },
  { id: 'greens-topdresser', equipment: 'Greens Topdresser', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 3_108_000 },
  { id: 'large-area-topdresser', equipment: 'Large Area Topdresser', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 2_673_000 },
  { id: 'heavy-duty-topdresser', equipment: 'Heavy Duty Topdresser', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 6_013_000 },
  { id: 'greens-tees-sprayer', equipment: 'Greens / Tees Sprayer', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 8_113_000 },
  { id: 'fairway-rough-sprayer', equipment: 'Fairway / Rough Sprayer', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: 11_800_000 },
  { id: 'light-utility-vehicles', equipment: 'Light Utility Vehicles', sowQtyLabel: '6', sowQtyNumeric: 6, unitPriceINR: 2_186_000 },
  { id: 'mid-duty-utility-vehicle', equipment: 'Mid Duty Utility Vehicle', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: null },
  { id: 'heavy-duty-utility-vehicles', equipment: 'Heavy Duty Utility Vehicles', sowQtyLabel: '2', sowQtyNumeric: 2, unitPriceINR: null },
  { id: 'debris-blower', equipment: 'Debris Blower', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: null },
  { id: 'debris-collector', equipment: 'Debris Collector / Sweeper', sowQtyLabel: '1', sowQtyNumeric: 1, unitPriceINR: null },
  { id: 'irrigation-controls', equipment: 'Irrigation / Controls', sowQtyLabel: '1 System', sowQtyNumeric: 1, unitPriceINR: null },
  { id: 'cutting-units', equipment: 'Cutting Units / Reel Backup', sowQtyLabel: '2 Sets', sowQtyNumeric: 2, unitPriceINR: null },
  { id: 'critical-spares', equipment: 'Critical Spares', sowQtyLabel: '1 Package', sowQtyNumeric: 1, unitPriceINR: null },
  { id: 'attachments-implements', equipment: 'Attachments / Implements', sowQtyLabel: 'As Required', sowQtyNumeric: 1, unitPriceINR: null },
]
