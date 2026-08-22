import { describe, expect, it } from 'vitest'
import { calculateVerify } from './verify'

describe('calculateVerify', () => {
  it('classifies a Growth customer: at/above break-even with positive cash flow', () => {
    const result = calculateVerify({
      recurringGolfRevenueAnnual: 30_000_000,
      availableCashFlowAnnual: 5_000_000,
      footfallPerDay: 60,
      breakEvenPlayersPerDay: 55,
    })
    expect(result.abilityToPay).toBe('growth')
  })

  it('classifies an Operational customer: reasonable but below break-even', () => {
    const result = calculateVerify({
      recurringGolfRevenueAnnual: 15_000_000,
      availableCashFlowAnnual: 500_000,
      footfallPerDay: 30,
      breakEvenPlayersPerDay: 55,
    })
    expect(result.abilityToPay).toBe('operational')
  })

  it('classifies a Development customer: low footfall relative to break-even', () => {
    const result = calculateVerify({
      recurringGolfRevenueAnnual: 5_000_000,
      availableCashFlowAnnual: -200_000,
      footfallPerDay: 17,
      breakEvenPlayersPerDay: 55,
    })
    expect(result.abilityToPay).toBe('development')
  })
})
