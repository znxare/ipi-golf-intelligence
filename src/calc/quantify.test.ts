import { describe, expect, it } from 'vitest'
import { calculateQuantify } from './quantify'

describe('calculateQuantify', () => {
  it('derives break-even and the breakdown total from monthly actuals', () => {
    const result = calculateQuantify({
      pricePerRound: 5_500,
      actualPlayersPerDay: 17,
      golfSpendPerMonth: 8_400_000, // ≈ ₹300,000/day annualized over 336 playable days
      salariesPerMonth: 2_800_000,
      waterPerMonth: 1_120_000,
      breakdown: {
        equipment: 4_000_000,
        irrigation: 2_000_000,
        maintenance: 3_000_000,
      },
      equipmentVerification: {},
    })

    expect(result.breakEvenPlayersPerDay).toBe(55)
    expect(result.totalIpiOpportunity).toBe(9_000_000) // ₹90 L
  })
})
