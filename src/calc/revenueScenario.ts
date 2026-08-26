/**
 * Golf + Cart Revenue Scenario — a frozen reference matrix shown at Certify,
 * independent of any one course's Qualify inputs. It answers two sales
 * questions with fixed, course-agnostic assumptions: "what does golf + cart
 * revenue look like at each capacity band?" and "what capacity band clears a
 * given daily spend, at a given green fee?"
 */

export const CAPACITY_BANDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const

/** 100%-capacity baseline: an 8-hour playable day → 48 tee times × 4 players/tee time. */
export const BASE_PLAYERS_PER_DAY = 192
export const PLAYERS_PER_CART = 2
export const ROUNDS_PER_CART_PER_DAY = 2

export const GREEN_FEE_SCENARIOS = [3_500, 5_000, 7_500] as const
export const CART_REVENUE_PER_ROUND = 1_000
export const SPEND_PER_DAY_BANDS = [100_000, 150_000, 200_000, 250_000, 300_000] as const
export const CART_CAPEX = 800_000

export type CapacityStatus = 'below' | 'crossing' | 'above'

export interface CapacityRow {
  capacityPct: number
  playersPerDay: number
  roundsPerDay: number
  carts: number
  golfRevenueByFee: number[]
  cartRevenue: number
  status: CapacityStatus
}

function statusForBand(pct: number): CapacityStatus {
  if (pct <= 20) return 'below'
  if (pct <= 50) return 'crossing'
  return 'above'
}

export function derivePlayersAtCapacity(capacityPct: number): number {
  return Math.ceil((BASE_PLAYERS_PER_DAY * capacityPct) / 100)
}

export function deriveRoundsAtCapacity(capacityPct: number): number {
  return Math.ceil(derivePlayersAtCapacity(capacityPct) / PLAYERS_PER_CART)
}

export function deriveCartsAtCapacity(capacityPct: number): number {
  return Math.ceil(deriveRoundsAtCapacity(capacityPct) / ROUNDS_PER_CART_PER_DAY)
}

export function buildCapacityMatrix(): CapacityRow[] {
  return CAPACITY_BANDS.map((capacityPct) => {
    const playersPerDay = derivePlayersAtCapacity(capacityPct)
    const roundsPerDay = deriveRoundsAtCapacity(capacityPct)
    return {
      capacityPct,
      playersPerDay,
      roundsPerDay,
      carts: deriveCartsAtCapacity(capacityPct),
      golfRevenueByFee: GREEN_FEE_SCENARIOS.map((fee) => playersPerDay * fee),
      cartRevenue: roundsPerDay * CART_REVENUE_PER_ROUND,
      status: statusForBand(capacityPct),
    }
  })
}

export interface BreakEvenCell {
  playersNeeded: number
  /** First capacity band (from CAPACITY_BANDS) whose players/day clears playersNeeded; null if not cleared by 100%. */
  band: number | null
}

/** Players needed to cover a day's spend at a given green fee, and the first capacity band that clears it. */
export function deriveBreakEvenCell(spendPerDay: number, greenFee: number): BreakEvenCell {
  const playersNeeded = Math.ceil(spendPerDay / greenFee)
  const band = CAPACITY_BANDS.find((pct) => derivePlayersAtCapacity(pct) >= playersNeeded) ?? null
  return { playersNeeded, band }
}

export interface CartBreakEven {
  roundsToRecoverCapital: number
  playerRoundsToRecoverCapital: number
  daysToRecoverCapital: number
}

/** Fixed per-cart economics — same for every spend/fee combination, so it isn't a function of either. */
export function deriveCartBreakEven(): CartBreakEven {
  const roundsToRecoverCapital = CART_CAPEX / CART_REVENUE_PER_ROUND
  return {
    roundsToRecoverCapital,
    playerRoundsToRecoverCapital: roundsToRecoverCapital * PLAYERS_PER_CART,
    daysToRecoverCapital: roundsToRecoverCapital / ROUNDS_PER_CART_PER_DAY,
  }
}
