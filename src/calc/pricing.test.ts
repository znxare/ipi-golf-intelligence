import { describe, expect, it } from 'vitest'
import { deriveEquipmentPriceINR, USD_MSRP_MARKUP } from './pricing'

describe('deriveEquipmentPriceINR', () => {
  it('multiplies USD MSRP by the markup and the USD→INR rate', () => {
    expect(USD_MSRP_MARKUP).toBe(1.4)
    // $44,167 × 1.4 × ₹87/USD
    expect(deriveEquipmentPriceINR(44_167, 87)).toBeCloseTo(44_167 * 1.4 * 87, 5)
  })

  it('scales linearly with the exchange rate', () => {
    expect(deriveEquipmentPriceINR(10_000, 90)).toBeCloseTo(2 * deriveEquipmentPriceINR(10_000, 45), 5)
  })
})
