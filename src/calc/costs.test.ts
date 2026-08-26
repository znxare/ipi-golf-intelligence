import { describe, expect, it } from 'vitest'
import {
  deriveAnnualSalaryCost,
  deriveAnnualWaterCost,
  deriveTankersPerRefill,
  deriveWaterReserveLiters,
} from './costs'

describe('deriveWaterReserveLiters', () => {
  it('multiplies the daily requirement by the 15-day refill cycle', () => {
    expect(deriveWaterReserveLiters(500_000)).toBe(7_500_000)
  })
})

describe('deriveTankersPerRefill', () => {
  it('divides the reserve by tanker capacity, rounding up', () => {
    expect(deriveTankersPerRefill(500_000, 20_000)).toBe(25) // exact: 500,000 / 20,000
    expect(deriveTankersPerRefill(510_000, 20_000)).toBe(26) // rounds up a partial tanker
  })
})

describe('deriveAnnualWaterCost', () => {
  it('annualizes the refill cost over a 15-day cycle across a calendar year', () => {
    // 500,000L/day × 15-day cycle = 7,500,000L reserve ÷ 20,000L = 375 tankers/refill
    // × ₹1,000 = ₹375,000/refill, × (365/15) refills/yr
    expect(deriveAnnualWaterCost(500_000, 1_000, 20_000)).toBe(9_125_000)
  })
})

describe('deriveAnnualSalaryCost', () => {
  it('multiplies monthly salary by 12', () => {
    expect(deriveAnnualSalaryCost(980_000)).toBe(11_760_000)
  })
})
