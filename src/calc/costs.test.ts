import { describe, expect, it } from 'vitest'
import { deriveAnnualSalaryCost, deriveAnnualWaterCost, deriveTankersPerDay } from './costs'

describe('deriveTankersPerDay', () => {
  it('divides the daily requirement by tanker capacity, rounding up', () => {
    expect(deriveTankersPerDay(500_000, 20_000)).toBe(25) // exact: 500,000 / 20,000
    expect(deriveTankersPerDay(510_000, 20_000)).toBe(26) // rounds up a partial tanker
  })
})

describe('deriveAnnualWaterCost', () => {
  it('annualizes the daily tanker cost across playable hours/day × 336 playable days/year', () => {
    // 500,000L / 20,000L = 25 tankers/day × ₹1,000 = ₹25,000/day
    // × (20 playable hrs/day × 336 playable days/yr = 6,720) = ₹168,000,000/yr
    expect(deriveAnnualWaterCost(500_000, 1_000, 20_000, 20)).toBe(168_000_000)
  })
})

describe('deriveAnnualSalaryCost', () => {
  it('multiplies monthly salary by 12', () => {
    expect(deriveAnnualSalaryCost(980_000)).toBe(11_760_000)
  })
})
