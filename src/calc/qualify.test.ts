import { describe, expect, it } from 'vitest'
import { calculateQualify } from './qualify'

describe('calculateQualify', () => {
  it('matches the Step 1 screenshot worked example', () => {
    const result = calculateQualify({
      courseCode: '18H / P72 / 7.5K YD',
      location: '',
      customerType: 'non_existing',
      daysOpenPerYear: 336,
      pricePerRound: 2500,
      potentialPlayersPerDay: 192,
      actualPlayersPerDay: 17,
      potentialMaintenanceSpendPerDay: 300_000, // ₹3.00 L/day → ₹10.08 Cr/year
      actualCustomerSpendPerMonth: 3_000_000,
      salaryCostPerDay: 35_000,
      waterRequirementPotentialPerDay: 2_000_000,
      waterReserve: 500_000,
      tankerCapacity: 20_000,
      tankerCost: 1_000,
      refillsPerYear: 12,
      superintendent: '',
      directorOfOperations: '',
      procurementHead: '',
      keyDecisionMaker: '',
      ipiAccountOwner: '',
    })

    expect(result.annualRounds).toBe(64_512)
    expect(result.potentialRevenueAnnual).toBe(161_280_000) // ₹16.1 Cr
    expect(result.ipiOpportunityAnnual).toBeCloseTo(14_112_000, -2) // ₹1.4 Cr
  })
})
