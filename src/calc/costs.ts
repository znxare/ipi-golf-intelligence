import { PLAYABLE_DAYS_PER_YEAR } from './constants'

/** Tankers needed per day to meet the daily water requirement. */
export function deriveTankersPerDay(waterRequiredPerDayLiters: number, tankerCapacityLiters: number): number {
  return Math.ceil(waterRequiredPerDayLiters / tankerCapacityLiters)
}

/** Daily tanker cost, annualized across playable hours/day × 336 playable days/year. */
export function deriveAnnualWaterCost(
  waterRequiredPerDayLiters: number,
  tankerCost: number,
  tankerCapacityLiters: number,
  playableHoursPerDay: number,
): number {
  const costPerRefillCycle = deriveTankersPerDay(waterRequiredPerDayLiters, tankerCapacityLiters) * tankerCost
  const refillsPerYear = playableHoursPerDay * PLAYABLE_DAYS_PER_YEAR
  return costPerRefillCycle * refillsPerYear
}

export function deriveAnnualSalaryCost(salariesPerMonth: number): number {
  return salariesPerMonth * 12
}
