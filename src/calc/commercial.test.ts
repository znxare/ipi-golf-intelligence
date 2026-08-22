import { describe, expect, it } from 'vitest'
import { calculateCommercialView } from './commercial'
import type { QualifyInput } from './types'

const EXAMPLE_CUSTOMER: QualifyInput = {
  courseName: '18H / P72 / 7.5K YD',
  location: '',
  customerType: 'non_existing',
  playableHoursPerDay: 12,
  potentialPlayersPerDay: 192,
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
}

const ACTUAL = { actualPlayersPerDay: 17, actualSpendPerDay: 300_000 }

describe('calculateCommercialView', () => {
  const result = calculateCommercialView(EXAMPLE_CUSTOMER, ACTUAL)

  it('matches the worked example on the actual-side figures', () => {
    expect(result.annualPlayersActual).toBe(5_712)
    expect(result.actualRevenuePerDay).toBe(93_500)
    expect(result.breakEvenPlayersPerDay).toBe(55)
    expect(result.gapToBreakEvenPlayers).toBe(38)
    expect(result.annualSalaryCost).toBe(11_760_000) // ₹1.176 Cr
    expect(result.revenueSpendActualAnnual).toBe(100_800_000) // actualSpendPerDay × 336
  })

  it('computes the potential side from the Customer Input Card', () => {
    expect(result.annualPlayersPotential).toBe(64_512)
    expect(result.revenueSpendPotentialAnnual).toBe(354_816_000)
  })

  it('derives water cost from reserve, tanker cost and the fixed tanker capacity', () => {
    // 500,000L reserve / 20,000L tanker × ₹1,000 = ₹25,000
    expect(result.annualWaterCost).toBe(25_000)
  })
})
