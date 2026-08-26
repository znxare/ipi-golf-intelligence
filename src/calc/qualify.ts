import { PLAYABLE_DAYS_PER_YEAR, PLAYERS_PER_TEE_TIME, SLOT_INTERVAL_MINUTES } from './constants'
import { deriveAnnualSalaryCost, deriveAnnualWaterCost } from './costs'
import type { QualifyInput, QualifyResult } from './types'

/** Tee-sheet capacity: tee times per day at the fixed slot interval, × 4 players per tee time. */
export function derivePotentialPlayersPerDay(playableHoursPerDay: number): number {
  const teeTimesPerDay = (playableHoursPerDay * 60) / SLOT_INTERVAL_MINUTES
  return Math.round(teeTimesPerDay * PLAYERS_PER_TEE_TIME)
}

export function calculateQualify(input: QualifyInput): QualifyResult {
  const potentialPlayersPerDay = derivePotentialPlayersPerDay(input.playableHoursPerDay)
  const annualPlayers = potentialPlayersPerDay * PLAYABLE_DAYS_PER_YEAR
  const potentialRevenueAnnual = annualPlayers * input.pricePerRound
  const estimatedOperatingCostAnnual = input.expensesPerDay * PLAYABLE_DAYS_PER_YEAR
  const annualWaterCost = deriveAnnualWaterCost(input.waterRequiredPerDay, input.tankerCost, input.tankerCapacity)
  const annualSalaryCost = deriveAnnualSalaryCost(input.salariesPerMonth)
  const totalCostOfOperations = estimatedOperatingCostAnnual + annualWaterCost + annualSalaryCost
  const ipiOpportunityAnnual = potentialRevenueAnnual - totalCostOfOperations

  return {
    potentialPlayersPerDay,
    annualPlayers,
    potentialRevenueAnnual,
    estimatedOperatingCostAnnual,
    annualWaterCost,
    annualSalaryCost,
    totalCostOfOperations,
    ipiOpportunityAnnual,
  }
}
