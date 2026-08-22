import { PLAYABLE_DAYS_PER_YEAR } from './constants'
import type { QualifyInput, QualifyResult } from './types'

/**
 * Rough share of estimated operating cost typically available for IPI scope
 * at the Qualify stage, before account-specific data exists. Refined by the
 * real Quantify/Verify numbers once gathered — tune this as IPI learns.
 */
export const DEFAULT_IPI_OPPORTUNITY_RATE = 0.14

export function calculateQualify(input: QualifyInput): QualifyResult {
  const annualRounds = input.potentialPlayersPerDay * PLAYABLE_DAYS_PER_YEAR
  const potentialRevenueAnnual = annualRounds * input.pricePerRound
  const estimatedOperatingCostAnnual = input.expensesPerDay * PLAYABLE_DAYS_PER_YEAR
  const ipiOpportunityAnnual = estimatedOperatingCostAnnual * DEFAULT_IPI_OPPORTUNITY_RATE

  return { annualRounds, potentialRevenueAnnual, estimatedOperatingCostAnnual, ipiOpportunityAnnual }
}
