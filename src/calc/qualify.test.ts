import { describe, expect, it } from 'vitest'
import { calculateQualify } from './qualify'

describe('calculateQualify', () => {
  it('derives potential players/day from playable hours, the fixed slot interval, and 4 players per tee time', () => {
    const result = calculateQualify({
      courseName: 'Test Course',
      location: '',
      customerType: 'non_existing',
      playableHoursPerDay: 20, // 20h × 60 / 10min slots = 120 tee times/day × 4 players = 480 players/day
      pricePerRound: 2500,
      expensesPerDay: 300_000, // ₹3.00 L/day → ₹10.08 Cr/year
      salariesPerMonth: 980_000,
      waterRequiredPerDay: 500_000,
      tankerCost: 1_000,
      tankerCapacity: 20_000,
      superintendent: '',
      directorOfOperations: '',
      procurementHead: '',
      keyDecisionMaker: '',
      ipiAccountOwner: '',
      equipmentAudit: [],
    })

    expect(result.potentialPlayersPerDay).toBe(480)
    expect(result.annualPlayers).toBe(161_280)
    expect(result.potentialRevenueAnnual).toBe(403_200_000) // ₹40.32 Cr
    expect(result.estimatedOperatingCostAnnual).toBe(100_800_000) // ₹10.08 Cr
    // 500,000L/day × 15-day cycle = 7,500,000L reserve ÷ 20,000L = 375 tankers/refill
    // × ₹1,000 = ₹375,000/refill, × (365/15) refills/yr
    expect(result.annualWaterCost).toBe(9_125_000)
    expect(result.annualSalaryCost).toBe(11_760_000) // ₹1.176 Cr
    expect(result.totalCostOfOperations).toBe(121_685_000)
    expect(result.ipiOpportunityAnnual).toBe(281_515_000)
  })
})
