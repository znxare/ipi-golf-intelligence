export type GolfCartBrand = 'elite' | 'yamaha'

export interface GolfCartCatalogItem {
  id: string
  category: string
  equipment: string
  model: string
  description: string
  /** Standard SOW template quantity — the rep confirms it as-is, or overrides with SOW Qty. */
  templateQtyLabel: string
  templateQtyNumeric: number
  /** Ex-Bangalore price in INR — already converted, no USD/rate step needed (unlike the Toro equipment catalog). */
  priceINR: number
  /** An accessory needs a car of this same brand on the order — see deriveActiveGolfCartBrands in calc/commercial.ts. */
  brand: GolfCartBrand
  /** Filename under public/golf-carts/ — car line items only; accessories have no product shot. */
  imageFile?: string
}

/** True for the golf car line items themselves (as opposed to accessories). */
export function isGolfCartCar(item: GolfCartCatalogItem): boolean {
  return item.category === 'Golf Cars'
}

/**
 * Golf car range and accessories, converted from IPI's Elite and Yamaha
 * DR2E price lists (Ex-Bangalore pricing). Feeds the Golf Cart Template in
 * Quantify, mirroring how EQUIPMENT_CATALOG feeds the Equipment Template.
 */
export const GOLF_CART_CATALOG: GolfCartCatalogItem[] = [
  { id: 'elite-golf-2-seater', category: 'Golf Cars', equipment: 'Elite Golf 2 Seater', model: 'Elite-2S-Li', description: 'Lithium 105AH, AC 48V 4KW motor, LED lights', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 600_000, brand: 'elite', imageFile: 'elite-2s.png' },
  { id: 'yamaha-dr2e-cruise-trojan', category: 'Golf Cars', equipment: 'Yamaha DR2E Cruise — Trojan', model: 'J1K700010A', description: 'AC motor 4.4HP, Trojan battery 8V ×6 (170AH)', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 795_000, brand: 'yamaha', imageFile: 'yamaha-dr2e.png' },
  { id: 'yamaha-dr2e-cruise-lithium', category: 'Golf Cars', equipment: 'Yamaha DR2E Cruise — Lithium', model: 'J1K700010A', description: 'AC motor 4.4HP, Lithium 105AH, on-board charger', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 858_000, brand: 'yamaha', imageFile: 'yamaha-dr2e.png' },

  { id: 'elite-caddy-stand', category: 'Elite Accessories', equipment: 'Caddy Stand', model: 'Elite-CDS', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 10_950, brand: 'elite' },
  { id: 'elite-sand-bottle', category: 'Elite Accessories', equipment: 'Sand Bottle', model: '3406000592', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 1_650, brand: 'elite' },
  { id: 'elite-ball-washer', category: 'Elite Accessories', equipment: 'Ball Washer', model: '3406000992', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 5_000, brand: 'elite' },
  { id: 'elite-cooler-kit', category: 'Elite Accessories', equipment: 'Cooler Kit', model: '3401000096', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 7_000, brand: 'elite' },
  { id: 'elite-rain-cover-2-seater', category: 'Elite Accessories', equipment: 'Rain Cover — 2 Seater', model: 'Elite RC-2', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 8_500, brand: 'elite' },
  { id: 'elite-luxury-seat-2-seater', category: 'Elite Accessories', equipment: 'Luxury Seat — 2 Seater (Red)', model: 'E2-Luxury Seat', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 28_000, brand: 'elite' },

  { id: 'yamaha-sand-bottle-kit', category: 'Yamaha Accessories', equipment: 'Sand Bottle Kit', model: 'GCA-J0A40-00', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 3_500, brand: 'yamaha' },
  { id: 'yamaha-side-mirror', category: 'Yamaha Accessories', equipment: 'Side Mirror (Left & Right)', model: 'CUST-GCA-JW681-30-40', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 500, brand: 'yamaha' },
  { id: 'yamaha-6-pack-cooler', category: 'Yamaha Accessories', equipment: '6-Pack Cooler', model: 'GCA-JW132-01', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 6_500, brand: 'yamaha' },
  { id: 'yamaha-golf-club-ball-washer', category: 'Yamaha Accessories', equipment: 'Golf Club & Ball Washer', model: 'GCAJW1310100', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 5_000, brand: 'yamaha' },
  { id: 'yamaha-5-panel-mirror-kit', category: 'Yamaha Accessories', equipment: '5 Panel Mirror Kit', model: 'GCA-JW680-00-00', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 5_000, brand: 'yamaha' },
  { id: 'yamaha-rain-cover-2-seater', category: 'Yamaha Accessories', equipment: 'Rain Cover — 2 Seater', model: 'CUST-RC-2 Seater', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 8_500, brand: 'yamaha' },
  { id: 'yamaha-seat-cover', category: 'Yamaha Accessories', equipment: 'Seat Cover (Cushion & Backrest)', model: 'CUST-Seat Cover', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 4_500, brand: 'yamaha' },
  { id: 'yamaha-storage-cover-2-seater', category: 'Yamaha Accessories', equipment: 'Storage Cover — 2 Seater', model: 'CUST-STR-2 Seater', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 7_500, brand: 'yamaha' },
  { id: 'yamaha-caddy-stand', category: 'Yamaha Accessories', equipment: 'Caddy Stand', model: 'CUST-Caddy-Pipe', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 15_000, brand: 'yamaha' },
]
