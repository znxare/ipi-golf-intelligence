import { PLAYABLE_DAYS_PER_YEAR } from './constants'
import type { QuantifyInput, QuantifyResult } from './types'

export function calculateQuantify(input: QuantifyInput): QuantifyResult {
  const dailyGolfSpend = (input.golfSpendPerMonth * 12) / PLAYABLE_DAYS_PER_YEAR
  const breakEvenPlayersPerDay = Math.round(dailyGolfSpend / input.pricePerRound)
  const totalIpiOpportunity =
    input.breakdown.equipment + input.breakdown.irrigation + input.breakdown.maintenance

  return { breakEvenPlayersPerDay, totalIpiOpportunity }
}
