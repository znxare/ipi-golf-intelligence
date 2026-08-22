import { describe, expect, it } from 'vitest'
import { calculateQuantify } from './quantify'

describe('calculateQuantify', () => {
  it('matches the Step 2 screenshot worked example', () => {
    const result = calculateQuantify({
      pricePerRound: 5_500,
      actualPlayersPerDay: 17,
      golfSpendPerDay: 300_000,
      salariesPerDay: 100_000,
      waterPerDay: 40_000,
      breakdown: {
        equipment: 4_000_000,
        irrigation: 2_000_000,
        maintenance: 3_000_000,
        management: 5_000_000,
      },
    })

    expect(result.breakEvenPlayersPerDay).toBe(55)
    expect(result.revenuePerDay).toBe(93_500)
    expect(result.ipiOpportunityPerDay).toBe(160_000)
    expect(result.revenueAtBreakEven).toBe(302_500)
    expect(result.gapToBreakEvenPlayers).toBe(38)
    expect(result.totalIpiOpportunity).toBe(14_000_000) // ₹1.4 Cr
  })
})
