import { describe, expect, it } from 'vitest'
import { calculateSelectedEquipmentTotal, deriveVerifiedQty } from './commercial'
import { deriveEquipmentPriceINR } from './pricing'
import type { EquipmentCatalogItem } from '../data/equipmentCatalog'

const CATALOG: EquipmentCatalogItem[] = [
  { id: 'a', category: 'Cat', equipment: 'A', model: 'M1', description: 'd', usdMsrp: 10_000 },
  { id: 'b', category: 'Cat', equipment: 'B', model: 'M2', description: 'd', usdMsrp: 20_000 },
  { id: 'c', category: 'Cat', equipment: 'C (unpriced)', model: 'M3', description: 'd', usdMsrp: null },
]

describe('deriveVerifiedQty', () => {
  it('reads a positive numeric qty', () => {
    expect(deriveVerifiedQty({ qty: '3' })).toBe(3)
  })

  it('treats blank, zero, negative, or missing as not selected', () => {
    expect(deriveVerifiedQty({ qty: '' })).toBe(0)
    expect(deriveVerifiedQty({ qty: '0' })).toBe(0)
    expect(deriveVerifiedQty({ qty: '-2' })).toBe(0)
    expect(deriveVerifiedQty(undefined)).toBe(0)
  })
})

describe('calculateSelectedEquipmentTotal', () => {
  const RATE = 87

  it('sums priceINR × qty across selected items only, at the given rate', () => {
    const lines = { a: { qty: '2' }, b: { qty: '' } }
    const { pricedTotal, hasUnpriced } = calculateSelectedEquipmentTotal(CATALOG, lines, RATE)
    expect(pricedTotal).toBeCloseTo(deriveEquipmentPriceINR(10_000, RATE) * 2, 5)
    expect(hasUnpriced).toBe(false)
  })

  it('flags hasUnpriced when a selected item has no USD MSRP', () => {
    const lines = { c: { qty: '1' } }
    const { pricedTotal, hasUnpriced } = calculateSelectedEquipmentTotal(CATALOG, lines, RATE)
    expect(pricedTotal).toBe(0)
    expect(hasUnpriced).toBe(true)
  })
})
