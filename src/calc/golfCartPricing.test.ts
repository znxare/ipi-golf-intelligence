import { describe, expect, it } from 'vitest'
import { calculateSelectedGolfCartTotal, deriveActiveGolfCartBrands, isGolfCartItemEnabled } from './commercial'
import type { GolfCartCatalogItem } from '../data/golfCartCatalog'

const CATALOG: GolfCartCatalogItem[] = [
  { id: 'elite-car', category: 'Golf Cars', equipment: 'Elite Car', model: 'M1', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 600_000, brand: 'elite' },
  { id: 'yamaha-car', category: 'Golf Cars', equipment: 'Yamaha Car', model: 'M2', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 800_000, brand: 'yamaha' },
  { id: 'elite-acc', category: 'Elite Accessories', equipment: 'Elite Accessory', model: 'M3', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 10_000, brand: 'elite' },
  { id: 'yamaha-acc', category: 'Yamaha Accessories', equipment: 'Yamaha Accessory', model: 'M4', description: '', templateQtyLabel: '1', templateQtyNumeric: 1, priceINR: 5_000, brand: 'yamaha' },
]

describe('deriveActiveGolfCartBrands', () => {
  it('is empty when no car is selected, even if an accessory line has stray data', () => {
    expect(deriveActiveGolfCartBrands(CATALOG, {})).toEqual(new Set())
    expect(deriveActiveGolfCartBrands(CATALOG, { 'elite-acc': { confirmed: true, sowQty: '' } })).toEqual(new Set())
  })

  it('includes both brands once both cars are selected', () => {
    expect(
      deriveActiveGolfCartBrands(CATALOG, {
        'elite-car': { confirmed: true, sowQty: '' },
        'yamaha-car': { confirmed: false, sowQty: '2' },
      }),
    ).toEqual(new Set(['elite', 'yamaha']))
  })
})

describe('isGolfCartItemEnabled', () => {
  it('leaves both cars enabled, and all accessories disabled, when nothing is selected yet', () => {
    const none = new Set<'elite' | 'yamaha'>()
    expect(isGolfCartItemEnabled(CATALOG[0], none)).toBe(true) // elite car
    expect(isGolfCartItemEnabled(CATALOG[1], none)).toBe(true) // yamaha car
    expect(isGolfCartItemEnabled(CATALOG[2], none)).toBe(false) // elite accessory
    expect(isGolfCartItemEnabled(CATALOG[3], none)).toBe(false) // yamaha accessory
  })

  it('unlocks only the matching brand\'s accessories, and never locks out the other brand\'s car', () => {
    const eliteOnly = new Set<'elite' | 'yamaha'>(['elite'])
    expect(isGolfCartItemEnabled(CATALOG[0], eliteOnly)).toBe(true) // elite car
    expect(isGolfCartItemEnabled(CATALOG[1], eliteOnly)).toBe(true) // yamaha car — buying both is fine
    expect(isGolfCartItemEnabled(CATALOG[2], eliteOnly)).toBe(true) // elite accessory unlocked
    expect(isGolfCartItemEnabled(CATALOG[3], eliteOnly)).toBe(false) // yamaha accessory still locked
  })

  it('unlocks both brands\' accessories once both cars are selected', () => {
    const both = new Set<'elite' | 'yamaha'>(['elite', 'yamaha'])
    expect(isGolfCartItemEnabled(CATALOG[2], both)).toBe(true)
    expect(isGolfCartItemEnabled(CATALOG[3], both)).toBe(true)
  })
})

describe('calculateSelectedGolfCartTotal', () => {
  it('is zero when no car is selected, regardless of stray accessory lines', () => {
    const { pricedTotal } = calculateSelectedGolfCartTotal(CATALOG, {
      'elite-acc': { confirmed: true, sowQty: '' },
    })
    expect(pricedTotal).toBe(0)
  })

  it('sums a car plus its own-brand accessories only', () => {
    const { pricedTotal } = calculateSelectedGolfCartTotal(CATALOG, {
      'elite-car': { confirmed: true, sowQty: '' },
      'elite-acc': { confirmed: true, sowQty: '' },
      'yamaha-acc': { confirmed: true, sowQty: '' }, // stray other-brand line — must not count, no Yamaha car selected
    })
    expect(pricedTotal).toBe(600_000 + 10_000)
  })

  it('sums both brands together when both cars are selected', () => {
    const { pricedTotal } = calculateSelectedGolfCartTotal(CATALOG, {
      'elite-car': { confirmed: true, sowQty: '' },
      'elite-acc': { confirmed: true, sowQty: '' },
      'yamaha-car': { confirmed: true, sowQty: '' },
      'yamaha-acc': { confirmed: true, sowQty: '' },
    })
    expect(pricedTotal).toBe(600_000 + 10_000 + 800_000 + 5_000)
  })

  it('honors a typed SOW qty override within an active brand', () => {
    const { pricedTotal } = calculateSelectedGolfCartTotal(CATALOG, {
      'yamaha-car': { confirmed: true, sowQty: '' },
      'yamaha-acc': { confirmed: false, sowQty: '3' },
    })
    expect(pricedTotal).toBe(800_000 + 5_000 * 3)
  })
})
