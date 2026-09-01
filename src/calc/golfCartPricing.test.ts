import { describe, expect, it } from 'vitest'
import { calculateSelectedGolfCartTotal, deriveSelectedGolfCartBrand, isGolfCartItemEnabled } from './commercial'
import type { GolfCartCatalogItem } from '../data/golfCartCatalog'

const CATALOG: GolfCartCatalogItem[] = [
  { id: 'elite-car', category: 'Golf Cars', equipment: 'Elite Car', model: 'M1', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 600_000, brand: 'elite' },
  { id: 'yamaha-car', category: 'Golf Cars', equipment: 'Yamaha Car', model: 'M2', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 800_000, brand: 'yamaha' },
  { id: 'elite-acc', category: 'Elite Accessories', equipment: 'Elite Accessory', model: 'M3', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 10_000, brand: 'elite' },
  { id: 'yamaha-acc', category: 'Yamaha Accessories', equipment: 'Yamaha Accessory', model: 'M4', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 5_000, brand: 'yamaha' },
]

describe('deriveSelectedGolfCartBrand', () => {
  it('is null when no car is selected, even if an accessory line has stray data', () => {
    expect(deriveSelectedGolfCartBrand(CATALOG, {})).toBeNull()
    expect(deriveSelectedGolfCartBrand(CATALOG, { 'elite-acc': { confirmed: true, sowQty: '' } })).toBeNull()
  })

  it('matches whichever brand\'s car is selected', () => {
    expect(deriveSelectedGolfCartBrand(CATALOG, { 'elite-car': { confirmed: true, sowQty: '' } })).toBe('elite')
    expect(deriveSelectedGolfCartBrand(CATALOG, { 'yamaha-car': { confirmed: false, sowQty: '2' } })).toBe('yamaha')
  })
})

describe('isGolfCartItemEnabled', () => {
  it('leaves both brands\' cars enabled, and all accessories disabled, when nothing is selected yet', () => {
    expect(isGolfCartItemEnabled(CATALOG[0], null)).toBe(true) // elite car
    expect(isGolfCartItemEnabled(CATALOG[1], null)).toBe(true) // yamaha car
    expect(isGolfCartItemEnabled(CATALOG[2], null)).toBe(false) // elite accessory
    expect(isGolfCartItemEnabled(CATALOG[3], null)).toBe(false) // yamaha accessory
  })

  it('locks out the other brand\'s car and accessories once a brand is active', () => {
    expect(isGolfCartItemEnabled(CATALOG[0], 'elite')).toBe(true) // elite car stays enabled
    expect(isGolfCartItemEnabled(CATALOG[1], 'elite')).toBe(false) // yamaha car locked out
    expect(isGolfCartItemEnabled(CATALOG[2], 'elite')).toBe(true) // elite accessory unlocked
    expect(isGolfCartItemEnabled(CATALOG[3], 'elite')).toBe(false) // yamaha accessory stays locked
  })
})

describe('calculateSelectedGolfCartTotal', () => {
  it('is zero when no car is selected, regardless of stray accessory lines', () => {
    const { pricedTotal } = calculateSelectedGolfCartTotal(CATALOG, {
      'elite-acc': { confirmed: true, sowQty: '' },
    })
    expect(pricedTotal).toBe(0)
  })

  it('sums the car plus same-brand accessories only', () => {
    const { pricedTotal } = calculateSelectedGolfCartTotal(CATALOG, {
      'elite-car': { confirmed: true, sowQty: '' },
      'elite-acc': { confirmed: true, sowQty: '' },
      'yamaha-acc': { confirmed: true, sowQty: '' }, // stray other-brand line — must not count
    })
    expect(pricedTotal).toBe(600_000 + 10_000)
  })

  it('honors a typed SOW qty override within the active brand', () => {
    const { pricedTotal } = calculateSelectedGolfCartTotal(CATALOG, {
      'yamaha-car': { confirmed: true, sowQty: '' },
      'yamaha-acc': { confirmed: false, sowQty: '3' },
    })
    expect(pricedTotal).toBe(800_000 + 5_000 * 3)
  })
})
