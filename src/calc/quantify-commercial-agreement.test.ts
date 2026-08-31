import { describe, expect, it } from 'vitest'
import { calculateCommercialView } from './commercial'
import { calculateQuantify } from './quantify'
import type { QualifyInput, QuantifyInput } from './types'

const QUALIFY_INPUT: QualifyInput = {
  courseName: '18H / P72 / 7.5K YD',
  location: '',
  customerType: 'non_existing',
  playableHoursPerDay: 12,
  pricePerRound: 5_500,
  expensesPerDay: 300_000,
  salariesPerMonth: 980_000,
  waterRequiredPerDay: 500_000,
  tankerCost: 1_000,
  tankerCapacity: 20_000,
  cartHoursPerTeeRound: 4,
  playersPerCart: 2,
  cartRevenuePerRound: 1_000,
  cartCost: 800_000,
  superintendent: '',
  directorOfOperations: '',
  procurementHead: '',
  keyDecisionMaker: '',
  ipiAccountOwner: '',
  equipmentAudit: [],
}

const QUANTIFY_INPUT: QuantifyInput = {
  pricePerRound: 5_500,
  actualPlayersPerDay: 17,
  golfSpendPerMonth: 8_400_000,
  salariesPerMonth: 2_800_000,
  waterPerMonth: 1_120_000,
  breakdown: { equipment: 4_000_000, irrigation: 2_000_000, maintenance: 3_000_000, golfCart: 0 },
  equipmentVerification: {},
}

describe('calculateQuantify vs calculateCommercialView agreement', () => {
  it('produce the same actual IPI opportunity figure for identical inputs', () => {
    const quantifyResult = calculateQuantify(QUALIFY_INPUT, QUANTIFY_INPUT)
    const commercial = calculateCommercialView(QUALIFY_INPUT, {
      actualPlayersPerDay: QUANTIFY_INPUT.actualPlayersPerDay,
      actualGolfSpendPerMonth: QUANTIFY_INPUT.golfSpendPerMonth,
      actualSalariesPerMonth: QUANTIFY_INPUT.salariesPerMonth,
      actualWaterPerMonth: QUANTIFY_INPUT.waterPerMonth,
    })

    expect(quantifyResult.actualIpiOpportunity).toBe(commercial.ipiOpportunityActualAnnual)
  })
})
