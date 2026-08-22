import { describe, expect, it } from 'vitest'
import { calculateCommercialView } from './commercial'
import type { QualifyInput } from './types'

const EXAMPLE_CUSTOMER: QualifyInput = {
  courseCode: '18H / P72 / 7.5K YD',
  location: '',
  customerType: 'non_existing',
  daysOpenPerYear: 336,
  pricePerRound: 5_500,
  potentialPlayersPerDay: 192,
  actualPlayersPerDay: 17,
  potentialMaintenanceSpendPerDay: 300_000,
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
}

describe('calculateCommercialView', () => {
  const result = calculateCommercialView(EXAMPLE_CUSTOMER)

  it('matches the worked example on the actual-side figures', () => {
    expect(result.annualPlayersActual).toBe(5_712)
    expect(result.actualRevenuePerDay).toBe(93_500)
    expect(result.breakEvenPlayersPerDay).toBe(55)
    expect(result.gapToBreakEvenPlayers).toBe(38)
    expect(result.annualSalaryCost).toBe(11_760_000) // ₹1.176 Cr
    expect(result.annualWaterCostActual).toBe(300_000) // ₹3.00 L
    expect(result.revenueSpendActualAnnual).toBe(36_000_000) // ₹3.60 Cr
    expect(result.ipiOpportunityActualAnnual).toBeCloseTo(23_940_000, -2) // ₹2.39 Cr
  })

  it('computes the potential side from the Customer Input Card consistently', () => {
    expect(result.annualPlayersPotential).toBe(64_512)
    // Note: at a single ₹5,500 Avg Green Fee for potential and actual, this is
    // ₹35.48 Cr — higher than the ₹16.10 Cr in the pasted worked example,
    // which implies a lower potential-only rate (~₹2,500) not currently
    // captured as an input. Flagged for the user rather than guessed at.
    expect(result.revenueSpendPotentialAnnual).toBe(354_816_000)
  })
})
