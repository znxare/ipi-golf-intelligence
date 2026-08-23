import { describe, expect, it } from 'vitest'
import { calculateQuantify } from './quantify'
import type { QualifyInput } from './types'

const QUALIFY_INPUT: QualifyInput = {
  courseName: '18H / P72 / 7.5K YD',
  location: '',
  customerType: 'non_existing',
  playableHoursPerDay: 20,
  pricePerRound: 5_500, // Qualify sheet's avg green fee — used for actual revenue too
  expensesPerDay: 300_000,
  salariesPerMonth: 980_000,
  waterReserve: 500_000,
  tankerCost: 1_000,
  superintendent: '',
  directorOfOperations: '',
  procurementHead: '',
  keyDecisionMaker: '',
  ipiAccountOwner: '',
  equipmentAudit: [],
}

describe('calculateQuantify', () => {
  it('derives break-even from monthly golf spend and Quantify\'s own avg price', () => {
    const result = calculateQuantify(QUALIFY_INPUT, {
      pricePerRound: 5_500,
      actualPlayersPerDay: 17,
      golfSpendPerMonth: 8_400_000, // ≈ ₹300,000/day annualized over 336 playable days
      salariesPerMonth: 2_800_000,
      waterPerMonth: 1_120_000,
      breakdown: { equipment: 4_000_000, irrigation: 2_000_000, maintenance: 3_000_000 },
      equipmentVerification: {},
    })

    expect(result.breakEvenPlayersPerDay).toBe(55)
  })

  it('computes actual IPI opportunity as actual revenue minus actual cost of operations', () => {
    const result = calculateQuantify(QUALIFY_INPUT, {
      pricePerRound: 5_500,
      actualPlayersPerDay: 17,
      golfSpendPerMonth: 8_400_000,
      salariesPerMonth: 2_800_000,
      waterPerMonth: 1_120_000,
      breakdown: { equipment: 4_000_000, irrigation: 2_000_000, maintenance: 3_000_000 },
      equipmentVerification: {},
    })

    // Revenue: 17 players/day × ₹5,500 × 336 days = ₹3.14 Cr
    // Cost: (8,400,000 + 2,800,000 + 1,120,000) × 12 = ₹14.78 Cr
    expect(result.actualIpiOpportunity).toBe(31_416_000 - 147_840_000)
  })
})
