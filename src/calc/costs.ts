import { DAYS_PER_YEAR, WATER_REFILL_INTERVAL_DAYS } from './constants'

/** Reserve needed per refill cycle, from the customer's daily water requirement. */
export function deriveWaterReserveLiters(waterRequiredPerDayLiters: number): number {
  return waterRequiredPerDayLiters * WATER_REFILL_INTERVAL_DAYS
}

/** Tankers needed to fill the reserve in one refill run. */
export function deriveTankersPerRefill(waterReserveLiters: number, tankerCapacityLiters: number): number {
  return Math.ceil(waterReserveLiters / tankerCapacityLiters)
}

/** Daily requirement × refill cycle = reserve per refill, annualized over a calendar year. */
export function deriveAnnualWaterCost(
  waterRequiredPerDayLiters: number,
  tankerCost: number,
  tankerCapacityLiters: number,
): number {
  const waterReserveLiters = deriveWaterReserveLiters(waterRequiredPerDayLiters)
  const costPerRefill = deriveTankersPerRefill(waterReserveLiters, tankerCapacityLiters) * tankerCost
  const refillsPerYear = DAYS_PER_YEAR / WATER_REFILL_INTERVAL_DAYS
  return costPerRefill * refillsPerYear
}

export function deriveAnnualSalaryCost(salariesPerMonth: number): number {
  return salariesPerMonth * 12
}
