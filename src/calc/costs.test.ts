import { describe, expect, it } from 'vitest'
import { deriveAnnualSalaryCost, deriveAnnualWaterCost, deriveTankersPerRefill } from './costs'

describe('deriveTankersPerRefill', () => {
  it('divides the reserve by tanker capacity, rounding up', () => {
    expect(deriveTankersPerRefill(500_000)).toBe(25) // exact: 500,000 / 20,000
    expect(deriveTankersPerRefill(510_000)).toBe(26) // rounds up a partial tanker
  })
})

describe('deriveAnnualWaterCost', () => {
  it('annualizes the refill cost over a 15-day cycle across a calendar year', () => {
    // 25 tankers × ₹1,000 = ₹25,000/refill, × (365/15 ≈ 24.33) refills/yr
    expect(deriveAnnualWaterCost(500_000, 1_000)).toBeCloseTo(608_333.33, 2)
  })
})

describe('deriveAnnualSalaryCost', () => {
  it('multiplies monthly salary by 12', () => {
    expect(deriveAnnualSalaryCost(980_000)).toBe(11_760_000)
  })
})
