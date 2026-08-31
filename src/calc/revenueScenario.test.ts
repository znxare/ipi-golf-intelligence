import { describe, expect, it } from 'vitest'
import { buildCartCapacityMatrix, deriveCartBreakEven, deriveRoundsPerCartPerDay } from './revenueScenario'

/** 8h playable × 60/10min slots × 4 players/tee time = 192 players/day at 100% capacity — same baseline as the old frozen reference chart. */
const REFERENCE_INPUT = {
  playableHoursPerDay: 8,
  cartHoursPerTeeRound: 4,
  playersPerCart: 2,
  cartRevenuePerRound: 1_000,
  cartCost: 800_000,
}

describe('deriveRoundsPerCartPerDay', () => {
  it('divides playable hours by round time', () => {
    expect(deriveRoundsPerCartPerDay(8, 4)).toBe(2)
    expect(deriveRoundsPerCartPerDay(12, 4)).toBe(3)
    expect(deriveRoundsPerCartPerDay(8, 0)).toBe(0)
  })
})

describe('buildCartCapacityMatrix', () => {
  const rows = buildCartCapacityMatrix(REFERENCE_INPUT)

  it('matches the reference chart\'s Players/Cart Rounds/Carts at every capacity band', () => {
    expect(rows.map((r) => [r.capacityPct, r.playersPerDay, r.cartRoundsPerDay, r.cartsRequired])).toEqual([
      [10, 20, 10, 5],
      [20, 39, 20, 10],
      [30, 58, 29, 15],
      [40, 77, 39, 20],
      [50, 96, 48, 24],
      [60, 116, 58, 29],
      [70, 135, 68, 34],
      [80, 154, 77, 39],
      [90, 173, 87, 44],
      [100, 192, 96, 48],
    ])
  })

  it('matches the reference chart\'s Cart Revenue', () => {
    const at = (pct: number) => rows.find((r) => r.capacityPct === pct)!
    expect(at(10).cartRevenuePerDay).toBe(10_000)
    expect(at(60).cartRevenuePerDay).toBe(58_000)
    expect(at(100).cartRevenuePerDay).toBe(96_000)
  })

  it('reflects a different course\'s inputs — 1 player/cart, ₹1,500/round', () => {
    const custom = buildCartCapacityMatrix({
      playableHoursPerDay: 8,
      cartHoursPerTeeRound: 4,
      playersPerCart: 1,
      cartRevenuePerRound: 1_500,
      cartCost: 800_000,
    })
    const at100 = custom.find((r) => r.capacityPct === 100)!
    expect(at100.playersPerDay).toBe(192)
    expect(at100.cartRoundsPerDay).toBe(192)
    expect(at100.cartsRequired).toBe(96)
    expect(at100.cartRevenuePerDay).toBe(288_000)
  })
})

describe('deriveCartBreakEven', () => {
  it('matches the reference chart\'s fixed 800 Rds / 1,600 Plyr / 400 Days', () => {
    expect(deriveCartBreakEven(REFERENCE_INPUT)).toEqual({
      roundsToRecoverCapital: 800,
      playerRoundsToRecoverCapital: 1_600,
      daysToRecoverCapital: 400,
    })
  })

  it('tracks a cheaper cart / higher revenue-per-round scenario', () => {
    expect(
      deriveCartBreakEven({
        playableHoursPerDay: 8,
        cartHoursPerTeeRound: 4,
        playersPerCart: 2,
        cartRevenuePerRound: 2_000,
        cartCost: 400_000,
      }),
    ).toEqual({
      roundsToRecoverCapital: 200,
      playerRoundsToRecoverCapital: 400,
      daysToRecoverCapital: 100,
    })
  })
})
