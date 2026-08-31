/**
 * Cart Revenue Scenario — capacity ramp and capital-recovery break-even for
 * this course's own cart economics. Unlike the old frozen reference matrix,
 * every number here is driven by the course's Customer Input Card: playable
 * hours/day (tee-sheet capacity) and the cart assumptions (round time,
 * players/cart, revenue/cart round, cart cost).
 */

import { derivePotentialPlayersPerDay } from './qualify'

export const CAPACITY_BANDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const

export interface CartScenarioInput {
  playableHoursPerDay: number
  cartHoursPerTeeRound: number
  playersPerCart: number
  cartRevenuePerRound: number
  cartCost: number
}

/** Rounds a single cart can run per day: playable hours ÷ hours per tee round. */
export function deriveRoundsPerCartPerDay(playableHoursPerDay: number, cartHoursPerTeeRound: number): number {
  if (cartHoursPerTeeRound <= 0) return 0
  return playableHoursPerDay / cartHoursPerTeeRound
}

export interface CartCapacityRow {
  capacityPct: number
  playersPerDay: number
  cartRoundsPerDay: number
  cartsRequired: number
  cartRevenuePerDay: number
}

export function buildCartCapacityMatrix(input: CartScenarioInput): CartCapacityRow[] {
  const basePlayersPerDay = derivePotentialPlayersPerDay(input.playableHoursPerDay)
  const roundsPerCartPerDay = deriveRoundsPerCartPerDay(input.playableHoursPerDay, input.cartHoursPerTeeRound)

  return CAPACITY_BANDS.map((capacityPct) => {
    const playersPerDay = Math.ceil((basePlayersPerDay * capacityPct) / 100)
    const cartRoundsPerDay = input.playersPerCart > 0 ? Math.ceil(playersPerDay / input.playersPerCart) : 0
    const cartsRequired = roundsPerCartPerDay > 0 ? Math.ceil(cartRoundsPerDay / roundsPerCartPerDay) : 0
    return {
      capacityPct,
      playersPerDay,
      cartRoundsPerDay,
      cartsRequired,
      cartRevenuePerDay: cartRoundsPerDay * input.cartRevenuePerRound,
    }
  })
}

export interface CartBreakEven {
  roundsToRecoverCapital: number
  playerRoundsToRecoverCapital: number
  daysToRecoverCapital: number
}

/** Capital recovery for one cart: how many rounds/player-rounds/days until revenue covers cart cost. */
export function deriveCartBreakEven(input: CartScenarioInput): CartBreakEven {
  const roundsPerCartPerDay = deriveRoundsPerCartPerDay(input.playableHoursPerDay, input.cartHoursPerTeeRound)
  const roundsToRecoverCapital = input.cartRevenuePerRound > 0 ? input.cartCost / input.cartRevenuePerRound : 0
  return {
    roundsToRecoverCapital,
    playerRoundsToRecoverCapital: roundsToRecoverCapital * input.playersPerCart,
    daysToRecoverCapital: roundsPerCartPerDay > 0 ? roundsToRecoverCapital / roundsPerCartPerDay : 0,
  }
}
