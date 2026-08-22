import { PLAYABLE_DAYS_PER_YEAR, SLOT_INTERVAL_MINUTES } from './constants'
import type { QualifyInput, QualifyResult } from './types'

/**
 * Rough share of estimated operating cost typically available for IPI scope
 * at the Qualify stage, before account-specific data exists. Refined by the
 * real Quantify/Verify numbers once gathered — tune this as IPI learns.
 */
export const DEFAULT_IPI_OPPORTUNITY_RATE = 0.14

/** Tee-sheet capacity: one player-unit per bookable slot at the fixed slot interval. */
export function derivePotentialPlayersPerDay(playableHoursPerDay: number): number {
  return Math.round((playableHoursPerDay * 60) / SLOT_INTERVAL_MINUTES)
}

export function calculateQualify(input: QualifyInput): QualifyResult {
  const potentialPlayersPerDay = derivePotentialPlayersPerDay(input.playableHoursPerDay)
  const annualRounds = potentialPlayersPerDay * PLAYABLE_DAYS_PER_YEAR
  const potentialRevenueAnnual = annualRounds * input.pricePerRound
  const estimatedOperatingCostAnnual = input.expensesPerDay * PLAYABLE_DAYS_PER_YEAR
  const ipiOpportunityAnnual = estimatedOperatingCostAnnual * DEFAULT_IPI_OPPORTUNITY_RATE

  return {
    potentialPlayersPerDay,
    annualRounds,
    potentialRevenueAnnual,
    estimatedOperatingCostAnnual,
    ipiOpportunityAnnual,
  }
}
