import { describe, expect, it } from 'vitest'
import { calculateQualify } from './qualify'

describe('calculateQualify', () => {
  it('derives potential players/day from playable hours and the fixed slot interval', () => {
    const result = calculateQualify({
      courseName: 'Test Course',
      location: '',
      customerType: 'non_existing',
      playableHoursPerDay: 20, // 20h × 60 / 10min slots = 120 players/day
      pricePerRound: 2500,
      expensesPerDay: 300_000, // ₹3.00 L/day → ₹10.08 Cr/year
      salariesPerMonth: 980_000,
      waterReserve: 500_000,
      tankerCost: 1_000,
      superintendent: '',
      directorOfOperations: '',
      procurementHead: '',
      keyDecisionMaker: '',
      ipiAccountOwner: '',
      equipmentAudit: [],
    })

    expect(result.potentialPlayersPerDay).toBe(120)
    expect(result.annualRounds).toBe(40_320)
    expect(result.potentialRevenueAnnual).toBe(100_800_000) // ₹10.08 Cr
    expect(result.ipiOpportunityAnnual).toBeCloseTo(14_112_000, -2) // ₹1.4 Cr
  })
})
