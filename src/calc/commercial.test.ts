import { describe, expect, it } from 'vitest'
import { calculateCommercialView } from './commercial'
import type { QualifyInput } from './types'

const EXAMPLE_CUSTOMER: QualifyInput = {
  courseName: '18H / P72 / 7.5K YD',
  location: '',
  customerType: 'non_existing',
  playableHoursPerDay: 20, // 20h × 60 / 10min slots = 120 tee times/day × 4 players = 480 players/day
  pricePerRound: 5_500,
  expensesPerDay: 300_000,
  salariesPerMonth: 980_000, // ₹1.176 Cr/year
  waterReserve: 500_000,
  tankerCost: 1_000,
  superintendent: '',
  directorOfOperations: '',
  procurementHead: '',
  keyDecisionMaker: '',
  ipiAccountOwner: '',
  equipmentAudit: [],
}

const ACTUAL = { actualPlayersPerDay: 17, actualSpendPerMonth: 8_400_000 }

describe('calculateCommercialView', () => {
  const result = calculateCommercialView(EXAMPLE_CUSTOMER, ACTUAL)

  it('matches the worked example on the actual-side figures', () => {
    expect(result.annualPlayersActual).toBe(5_712)
    expect(result.actualRevenuePerDay).toBe(93_500)
    expect(result.breakEvenPlayersPerDay).toBe(55)
    expect(result.gapToBreakEvenPlayers).toBe(38)
    expect(result.annualSalaryCost).toBe(11_760_000) // ₹1.176 Cr
    expect(result.revenueSpendActualAnnual).toBe(100_800_000) // actualSpendPerMonth × 12
  })

  it('computes the potential side from the Customer Input Card', () => {
    expect(result.annualPlayersPotential).toBe(161_280) // 480/day × 336
    expect(result.revenueSpendPotentialAnnual).toBe(887_040_000)
  })

  it('derives water cost from reserve, tanker cost, and refills across a calendar year', () => {
    // 500,000L / 20,000L = 25 tankers/refill × ₹1,000 = ₹25,000/refill, × (365/15) refills/yr
    expect(result.annualWaterCost).toBeCloseTo(608_333.33, 2)
  })

  it('nets total cost of operations (expenses + salary + water) against revenue for IPI opportunity', () => {
    expect(result.estimatedOperatingCostAnnual).toBe(100_800_000)
    expect(result.totalCostOfOperations).toBeCloseTo(113_168_333.33, 2)
    expect(result.ipiOpportunityPotentialAnnual).toBeCloseTo(773_871_666.67, 2)
    expect(result.ipiOpportunityActualAnnual).toBeCloseTo(-12_368_333.33, 2)
  })
})
