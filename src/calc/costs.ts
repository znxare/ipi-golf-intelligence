import { DAYS_PER_YEAR, TANKER_CAPACITY_LITERS, WATER_REFILL_INTERVAL_DAYS } from './constants'

/** Tankers needed to fill the reserve in one refill run. */
export function deriveTankersPerRefill(waterReserveLiters: number): number {
  return Math.ceil(waterReserveLiters / TANKER_CAPACITY_LITERS)
}

/** Reserve refilled every WATER_REFILL_INTERVAL_DAYS, annualized over a calendar year. */
export function deriveAnnualWaterCost(waterReserveLiters: number, tankerCost: number): number {
  const costPerRefill = deriveTankersPerRefill(waterReserveLiters) * tankerCost
  const refillsPerYear = DAYS_PER_YEAR / WATER_REFILL_INTERVAL_DAYS
  return costPerRefill * refillsPerYear
}

export function deriveAnnualSalaryCost(salariesPerMonth: number): number {
  return salariesPerMonth * 12
}
