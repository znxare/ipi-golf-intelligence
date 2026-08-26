export interface EquipmentCatalogItem {
  id: string
  category: string
  equipment: string
  model: string
  description: string
  /** Standard 18-hole SOW template quantity — the rep confirms it as-is, or overrides with SOW Qty. */
  templateQtyLabel: string
  templateQtyNumeric: number
  /** 2026 Toro commercial MSRP in USD, for planning & opportunity assessment only. null = "Contact IPI for Pricing". */
  usdMsrp: number | null
}

/**
 * Toro 2026 Golf Course Equipment — USD Pricing Information Card. Indicative
 * 2026 commercial MSRP (USD); final India pricing varies with configuration,
 * attachments, freight, import duty, taxes & local terms (USD→INR conversion
 * not included in the MSRP itself — see calc/pricing.ts). Template quantities
 * carry forward the standard 18-hole SOW fleet composition per equipment type.
 */
export const EQUIPMENT_CATALOG: EquipmentCatalogItem[] = [
  { id: 'greensmaster-3150-d', category: 'Greens Mowers (Ride-On)', equipment: 'Greensmaster 3150-D', model: '04610', description: 'Hybrid ride-on greens mower, quintuple cutting units', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 44_167 },
  { id: 'greensmaster-3250-d', category: 'Greens Mowers (Ride-On)', equipment: 'Greensmaster 3250-D', model: '04620', description: 'Diesel ride-on greens mower, quintuple cutting units', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 52_367 },
  { id: 'reelmaster-3575', category: 'Fairway Mowers (Reel)', equipment: 'Reelmaster 3575', model: '03780', description: 'Fairway mower, 5 reel, Kubota diesel', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 64_191 },
  { id: 'reelmaster-5010-h', category: 'Fairway Mowers (Reel)', equipment: 'Reelmaster 5010-H', model: '04052', description: 'Fairway mower, 5 reel, 28.5 HP (21.3 kW)', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 78_297 },
  { id: 'reelmaster-5510-d', category: 'Fairway Mowers (Reel)', equipment: 'Reelmaster 5510-D', model: '04171', description: 'Fairway mower, 5 reel, 37 HP (27.6 kW)', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 86_086 },
  { id: 'groundsmaster-4300', category: 'Rough Mowers (Rotary)', equipment: 'Groundsmaster 4300', model: '30611', description: 'Rotary rough mower, 4WD, 4-wheel steer', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 102_791 },
  { id: 'groundsmaster-4500', category: 'Rough Mowers (Rotary)', equipment: 'Groundsmaster 4500', model: '30811', description: 'Rotary rough mower, 4WD, 4-wheel steer', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 122_929 },
  { id: 'sand-pro-5040', category: 'Bunker Rakes', equipment: 'Sand Pro 5040', model: '08700', description: 'Self-propelled bunker rake, hydraulic lift', templateQtyLabel: '2', templateQtyNumeric: 2, usdMsrp: 31_924 },
  { id: 'procore-648s', category: 'Aeration Equipment (Greens)', equipment: 'ProCore 648s', model: '64880', description: 'Greens aerator, 48" width', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 47_549 },
  { id: 'procore-864', category: 'Aeration Equipment (Fairways)', equipment: 'ProCore 864', model: '86625', description: 'Fairway aerator, 64" width', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 49_770 },
  { id: 'procore-1298', category: 'Aeration Equipment (Large Area)', equipment: 'ProCore 1298', model: '129-4-11', description: 'Large area aerator, 98" width', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 62_434 },
  { id: 'greenspro-1260', category: 'Greens Rollers', equipment: 'GreensPro 1260', model: '04580', description: 'Greens roller, 72" width', templateQtyLabel: '2', templateQtyNumeric: 2, usdMsrp: 23_780 },
  { id: 'topdresser-2500', category: 'Topdressers', equipment: 'Topdresser 2500', model: '07310', description: 'Greens topdresser, 2.5 cu ft (0.07 m³)', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 23_201 },
  { id: 'propass-200-wireless', category: 'Topdressers (Large Area)', equipment: 'ProPass 200 Wireless', model: '44810', description: 'Large area topdresser, 2.3 cu ft (0.065 m³)', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 19_944 },
  { id: 'mh-400-wireless', category: 'Topdressers (Heavy Duty)', equipment: 'MH-400 Wireless', model: '44821', description: 'Heavy duty topdresser, 8.0 cu ft (0.23 m³)', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 44_883 },
  { id: 'flex-1021', category: 'Greens Walk Mowers (Backup)', equipment: 'Flex 1021', model: '02612', description: 'Walk-behind greens mower, 21" width', templateQtyLabel: '2', templateQtyNumeric: 2, usdMsrp: 13_687 },
  { id: 'multi-pro-1750', category: 'Sprayers (Greens / Tees)', equipment: 'Multi Pro 1750', model: '41172', description: 'Sprayer, 175 gallon (662 L)', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 59_251 },
  { id: 'multi-pro-5800-g', category: 'Sprayers (Fairways / Roughs)', equipment: 'Multi Pro 5800-G', model: '44462', description: 'Sprayer, 580 gallon (2,194 L)', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 88_129 },
  { id: 'workman-gtx-electric', category: 'Utility Vehicles (Light Duty)', equipment: 'Workman GTX Electric', model: '07385', description: 'Electric utility vehicle, 800 lb (363 kg) capacity', templateQtyLabel: '6', templateQtyNumeric: 6, usdMsrp: 16_309 },
  { id: 'workman-gtx-lithium-intl', category: 'Utility Vehicles (Light Duty)', equipment: 'Workman GTX Lithium INTL', model: '07387', description: 'Lithium utility vehicle, 800 lb (363 kg) capacity', templateQtyLabel: '6', templateQtyNumeric: 6, usdMsrp: 20_249 },
  { id: 'workman-hdx-d', category: 'Utility Vehicles (Heavy Duty)', equipment: 'Workman HDX-D', model: '07205', description: 'Diesel utility vehicle, 1,200 lb (545 kg) capacity', templateQtyLabel: '2', templateQtyNumeric: 2, usdMsrp: 18_723 },
  { id: 'workman-mdx-d', category: 'Utility Vehicles (Med Duty)', equipment: 'Workman MDX-D', model: '07201', description: 'Diesel utility vehicle, 1,000 lb (454 kg) capacity', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 15_409 },
  { id: 'proforce-debris-blower', category: 'Debris Equipment (Blower)', equipment: 'ProForce Debris Blower', model: '44518', description: 'Truck-mounted blower, 37 HP', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 14_839 },
  { id: 'versa-vac', category: 'Debris Equipment (Collector)', equipment: 'Versa-Vac', model: '44581', description: 'Debris collector system, truck-mounted', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: 28_339 },
  { id: 'toro-lynx', category: 'Irrigation / Controls', equipment: 'Toro Lynx Central Control', model: 'LYNX', description: 'Central irrigation control system', templateQtyLabel: '1 System', templateQtyNumeric: 1, usdMsrp: null },
  { id: 'critical-spares', category: 'Critical Spares / Cutting Units', equipment: 'Reel / Bedknife / Spare Sets', model: 'Various', description: 'As per machine requirement', templateQtyLabel: '2 Sets', templateQtyNumeric: 2, usdMsrp: null },
  { id: 'attachments-implements', category: 'Attachments / Implements', equipment: 'Various Attachments', model: 'Various', description: 'Carts, blades, brushes, tines, etc.', templateQtyLabel: 'As Required', templateQtyNumeric: 1, usdMsrp: null },
]
