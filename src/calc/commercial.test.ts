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
  waterRequiredPerDay: 500_000,
  tankerCost: 1_000,
  tankerCapacity: 20_000,
  superintendent: '',
  directorOfOperations: '',
  procurementHead: '',
  keyDecisionMaker: '',
  ipiAccountOwner: '',
  equipmentAudit: [],
}

const ACTUAL = {
  actualPlayersPerDay: 17,
  actualGolfSpendPerMonth: 8_400_000,
  actualSalariesPerMonth: 900_000,
  actualWaterPerMonth: 50_000,
}

describe('calculateCommercialView', () => {
  const result = calculateCommercialView(EXAMPLE_CUSTOMER, ACTUAL)

  it('matches the worked example on the actual-side figures', () => {
    expect(result.annualPlayersActual).toBe(5_712)
    expect(result.actualRevenuePerDay).toBe(93_500) // actual players/day × Qualify's avg green fee
    expect(result.breakEvenPlayersPerDay).toBe(55)
    expect(result.gapToBreakEvenPlayers).toBe(38)
    expect(result.revenueSpendActualAnnual).toBe(31_416_000) // actualRevenuePerDay × 336 playable days
  })

  it('computes the potential side from the Customer Input Card', () => {
    expect(result.potentialPlayersPerDay).toBe(480)
    expect(result.annualPlayersPotential).toBe(161_280) // 480/day × 336
    expect(result.potentialRevenuePerDay).toBe(2_640_000) // 480/day × ₹5,500
    expect(result.revenueSpendPotentialAnnual).toBe(887_040_000)
  })

  it('shares one break-even threshold across both columns, and derives each gap from its own capacity', () => {
    expect(result.breakEvenPlayersPerDay).toBe(55) // round(300,000 / 5,500), same for potential and actual
    expect(result.gapToBreakEvenPlayersPotential).toBe(425) // 480 potential players/day − 55 break-even
    expect(result.gapToBreakEvenPlayers).toBe(38) // 55 break-even − 17 actual players/day
  })

  it('derives potential water cost from daily requirement, tanker cost, and playable hours/day × 336 days/yr', () => {
    // 500,000L / 20,000L = 25 tankers/day × ₹1,000 = ₹25,000/day
    // × (20 playable hrs/day × 336 playable days/yr = 6,720) = ₹168,000,000/yr
    expect(result.annualWaterCost).toBe(168_000_000)
    expect(result.annualSalaryCost).toBe(11_760_000) // ₹1.176 Cr
  })

  it('nets potential total cost of operations (expenses + salary + water) against potential revenue', () => {
    expect(result.estimatedOperatingCostAnnual).toBe(100_800_000)
    expect(result.totalCostOfOperations).toBe(280_560_000)
    expect(result.ipiOpportunityPotentialAnnual).toBe(606_480_000)
  })

  it("annualizes Quantify's own monthly actuals (×12, no refill math) for the actual cost side", () => {
    expect(result.actualOperatingCostAnnual).toBe(100_800_000) // golf spend/month × 12
    expect(result.actualSalaryCostAnnual).toBe(10_800_000) // salaries/month × 12
    expect(result.actualWaterCostAnnual).toBe(600_000) // water/month × 12
    expect(result.totalCostOfOperationsActual).toBe(112_200_000)
    expect(result.ipiOpportunityActualAnnual).toBe(-80_784_000) // revenueSpendActualAnnual − totalCostOfOperationsActual
  })
})
