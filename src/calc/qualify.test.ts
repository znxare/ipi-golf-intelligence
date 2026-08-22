import { describe, expect, it } from 'vitest'
import { calculateQualify } from './qualify'

describe('calculateQualify', () => {
  it('matches the Step 1 screenshot worked example', () => {
    const result = calculateQualify({
      courseName: 'Test Course',
      location: '',
      customerType: 'non_existing',
      playableHoursPerDay: 12,
      potentialPlayersPerDay: 192,
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

    expect(result.annualRounds).toBe(64_512)
    expect(result.potentialRevenueAnnual).toBe(161_280_000) // ₹16.1 Cr
    expect(result.ipiOpportunityAnnual).toBeCloseTo(14_112_000, -2) // ₹1.4 Cr
  })
})
