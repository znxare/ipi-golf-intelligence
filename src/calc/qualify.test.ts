import { describe, expect, it } from 'vitest'
import { calculateQualify } from './qualify'

describe('calculateQualify', () => {
  it('matches the Step 1 screenshot worked example', () => {
    const result = calculateQualify({
      customerType: 'non_existing',
      potentialPlayersPerDay: 192,
      daysOpenPerYear: 336,
      pricePerRound: 2500,
      estimatedOperatingCostAnnual: 100_800_000, // ₹10.08 Cr
    })

    expect(result.annualRounds).toBe(64_512)
    expect(result.potentialRevenueAnnual).toBe(161_280_000) // ₹16.1 Cr
    expect(result.ipiOpportunityAnnual).toBeCloseTo(14_112_000, -2) // ₹1.4 Cr
  })
})
