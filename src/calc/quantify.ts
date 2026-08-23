import { PLAYABLE_DAYS_PER_YEAR } from './constants'
import type { QualifyInput, QuantifyInput, QuantifyResult } from './types'

/**
 * Actual IPI Opportunity = the customer's real revenue (actual players/day ×
 * Qualify's avg green fee × 336 playable days) minus their real annual cost
 * of operations (golf spend + salaries + water, each reported per month in
 * Quantify and annualized ×12). Mirrors calculateCommercialView's actual
 * side — kept as its own calc since Quantify only needs this one figure,
 * not the potential/actual comparison Commercial View builds.
 */
export function calculateQuantify(qualifyInput: QualifyInput, input: QuantifyInput): QuantifyResult {
  const dailyGolfSpend = (input.golfSpendPerMonth * 12) / PLAYABLE_DAYS_PER_YEAR
  const breakEvenPlayersPerDay = Math.round(dailyGolfSpend / input.pricePerRound)

  const actualRevenueAnnual = input.actualPlayersPerDay * qualifyInput.pricePerRound * PLAYABLE_DAYS_PER_YEAR
  const actualCostOfOperationsAnnual = (input.golfSpendPerMonth + input.salariesPerMonth + input.waterPerMonth) * 12
  const actualIpiOpportunity = actualRevenueAnnual - actualCostOfOperationsAnnual

  return { breakEvenPlayersPerDay, actualIpiOpportunity }
}
