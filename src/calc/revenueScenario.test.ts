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

  it('derives Players/Cart Rounds/Carts — cart rounds/day = tee rounds/day × players per cart', () => {
    expect(rows.map((r) => [r.capacityPct, r.playersPerDay, r.cartRoundsPerDay, r.cartsRequired])).toEqual([
      [10, 20, 10, 5],
      [20, 39, 20, 10],
      [30, 58, 30, 15],
      [40, 77, 40, 20],
      [50, 96, 48, 24],
      [60, 116, 58, 29],
      [70, 135, 68, 34],
      [80, 154, 78, 39],
      [90, 173, 88, 44],
      [100, 192, 96, 48],
    ])
  })

  it('derives Tee Rounds/Day as Players/Day ÷ 4 players per tee time', () => {
    expect(rows.map((r) => [r.capacityPct, r.teeRoundsPerDay])).toEqual([
      [10, 5],
      [20, 10],
      [30, 15],
      [40, 20],
      [50, 24],
      [60, 29],
      [70, 34],
      [80, 39],
      [90, 44],
      [100, 48],
    ])
  })

  it('derives Cart Revenue as tee rounds/day × players per cart × revenue per cart round', () => {
    const at = (pct: number) => rows.find((r) => r.capacityPct === pct)!
    expect(at(10).cartRevenuePerDay).toBe(10_000)
    expect(at(60).cartRevenuePerDay).toBe(58_000)
    expect(at(100).cartRevenuePerDay).toBe(96_000)
  })

  it('marks the row where cart rounds/day first crosses Breakeven (playable hrs ÷ cart hrs/tee round)', () => {
    // Threshold = 8 ÷ 4 = 2 rounds/cart/day — already cleared at the smallest (10%) band.
    expect(rows.map((r) => r.status)).toEqual([
      'crossing', 'above', 'above', 'above', 'above', 'above', 'above', 'above', 'above', 'above',
    ])
  })

  it('shows a below band when the round-time threshold is high enough to not be cleared immediately', () => {
    // Threshold = 8 ÷ 0.5 = 16 rounds/cart/day.
    const custom = buildCartCapacityMatrix({
      playableHoursPerDay: 8,
      cartHoursPerTeeRound: 0.5,
      playersPerCart: 2,
      cartRevenuePerRound: 1_000,
      cartCost: 800_000,
    })
    expect(custom.map((r) => [r.capacityPct, r.cartRoundsPerDay, r.status])).toEqual([
      [10, 10, 'below'],
      [20, 20, 'crossing'],
      [30, 30, 'above'],
      [40, 40, 'above'],
      [50, 48, 'above'],
      [60, 58, 'above'],
      [70, 68, 'above'],
      [80, 78, 'above'],
      [90, 88, 'above'],
      [100, 96, 'above'],
    ])
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
    expect(at100.teeRoundsPerDay).toBe(48)
    expect(at100.cartRoundsPerDay).toBe(48)
    expect(at100.cartsRequired).toBe(24)
    expect(at100.cartRevenuePerDay).toBe(72_000)
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
