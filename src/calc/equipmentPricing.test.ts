import { describe, expect, it } from 'vitest'
import { calculateSelectedEquipmentTotal, deriveVerifiedQty } from './commercial'
import { deriveEquipmentPriceINR } from './pricing'
import type { EquipmentCatalogItem } from '../data/equipmentCatalog'

const CATALOG: EquipmentCatalogItem[] = [
  { id: 'a', category: 'Cat', equipment: 'A', model: 'M1', description: 'd', templateQtyLabel: '3', templateQtyNumeric: 3, usdMsrp: 10_000 },
  { id: 'b', category: 'Cat', equipment: 'B', model: 'M2', description: 'd', templateQtyLabel: '2', templateQtyNumeric: 2, usdMsrp: 20_000 },
  { id: 'c', category: 'Cat', equipment: 'C (unpriced)', model: 'M3', description: 'd', templateQtyLabel: '1', templateQtyNumeric: 1, usdMsrp: null },
]

describe('deriveVerifiedQty', () => {
  it('uses the template qty when confirmed', () => {
    expect(deriveVerifiedQty(CATALOG[0], { confirmed: true, sowQty: '' })).toBe(3)
  })

  it('uses the typed override when not confirmed', () => {
    expect(deriveVerifiedQty(CATALOG[0], { confirmed: false, sowQty: '5' })).toBe(5)
  })

  it('treats missing or blank as not selected', () => {
    expect(deriveVerifiedQty(CATALOG[0], undefined)).toBe(0)
    expect(deriveVerifiedQty(CATALOG[0], { confirmed: false, sowQty: '' })).toBe(0)
  })
})

describe('calculateSelectedEquipmentTotal', () => {
  const RATE = 87

  it('sums priceINR × qty across selected items only, at the given rate', () => {
    const lines = { a: { confirmed: true, sowQty: '' }, b: { confirmed: false, sowQty: '' } }
    const { pricedTotal, hasUnpriced } = calculateSelectedEquipmentTotal(CATALOG, lines, RATE)
    expect(pricedTotal).toBeCloseTo(deriveEquipmentPriceINR(10_000, RATE) * 3, 5)
    expect(hasUnpriced).toBe(false)
  })

  it('flags hasUnpriced when a selected item has no USD MSRP', () => {
    const lines = { c: { confirmed: true, sowQty: '' } }
    const { pricedTotal, hasUnpriced } = calculateSelectedEquipmentTotal(CATALOG, lines, RATE)
    expect(pricedTotal).toBe(0)
    expect(hasUnpriced).toBe(true)
  })

  it('honors a typed SOW qty override', () => {
    const lines = { b: { confirmed: false, sowQty: '4' } }
    const { pricedTotal } = calculateSelectedEquipmentTotal(CATALOG, lines, RATE)
    expect(pricedTotal).toBeCloseTo(deriveEquipmentPriceINR(20_000, RATE) * 4, 5)
  })
})
