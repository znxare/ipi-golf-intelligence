import { describe, expect, it } from 'vitest'
import {
  buildCartCapacityMatrix,
  buildGolfCapacityMatrix,
  deriveCartBreakEven,
  deriveFrozenCartBreakEven,
  deriveGolfBreakEvenCell,
  deriveRoundsPerCartPerDay,
} from './revenueScenario'

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

describe('buildGolfCapacityMatrix (frozen reference)', () => {
  const rows = buildGolfCapacityMatrix()

  it('matches the reference chart\'s Players/Rounds/Carts at every capacity band', () => {
    expect(rows.map((r) => [r.capacityPct, r.playersPerDay, r.roundsPerDay, r.carts])).toEqual([
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

  it('matches the reference chart\'s Golf Revenue at ₹3.5K/₹5K/₹7.5K and Cart Revenue', () => {
    const at = (pct: number) => rows.find((r) => r.capacityPct === pct)!
    expect(at(10).golfRevenueByFee).toEqual([70_000, 100_000, 150_000])
    expect(at(10).cartRevenue).toBe(10_000)
    expect(at(60).golfRevenueByFee).toEqual([406_000, 580_000, 870_000])
    expect(at(60).cartRevenue).toBe(58_000)
    expect(at(100).golfRevenueByFee).toEqual([672_000, 960_000, 1_440_000])
    expect(at(100).cartRevenue).toBe(96_000)
  })

  it('bands 10-20% below, 30-50% crossing, 60-100% above', () => {
    expect(rows.map((r) => r.status)).toEqual([
      'below', 'below',
      'crossing', 'crossing', 'crossing',
      'above', 'above', 'above', 'above', 'above',
    ])
  })
})

describe('deriveGolfBreakEvenCell', () => {
  it('matches the reference chart\'s BE capacity band table', () => {
    expect(deriveGolfBreakEvenCell(100_000, 3_500)).toEqual({ playersNeeded: 29, band: 20 })
    expect(deriveGolfBreakEvenCell(100_000, 5_000)).toEqual({ playersNeeded: 20, band: 10 })
    expect(deriveGolfBreakEvenCell(100_000, 7_500)).toEqual({ playersNeeded: 14, band: 10 })

    expect(deriveGolfBreakEvenCell(150_000, 3_500)).toEqual({ playersNeeded: 43, band: 30 })
    expect(deriveGolfBreakEvenCell(150_000, 5_000)).toEqual({ playersNeeded: 30, band: 20 })
    expect(deriveGolfBreakEvenCell(150_000, 7_500)).toEqual({ playersNeeded: 20, band: 10 })

    expect(deriveGolfBreakEvenCell(200_000, 3_500)).toEqual({ playersNeeded: 58, band: 30 })
    expect(deriveGolfBreakEvenCell(200_000, 5_000)).toEqual({ playersNeeded: 40, band: 30 })
    expect(deriveGolfBreakEvenCell(200_000, 7_500)).toEqual({ playersNeeded: 27, band: 20 })

    expect(deriveGolfBreakEvenCell(250_000, 3_500)).toEqual({ playersNeeded: 72, band: 40 })
    expect(deriveGolfBreakEvenCell(250_000, 5_000)).toEqual({ playersNeeded: 50, band: 30 })
    expect(deriveGolfBreakEvenCell(250_000, 7_500)).toEqual({ playersNeeded: 34, band: 20 })

    expect(deriveGolfBreakEvenCell(300_000, 3_500)).toEqual({ playersNeeded: 86, band: 50 })
    expect(deriveGolfBreakEvenCell(300_000, 5_000)).toEqual({ playersNeeded: 60, band: 40 })
    expect(deriveGolfBreakEvenCell(300_000, 7_500)).toEqual({ playersNeeded: 40, band: 30 })
  })
})

describe('deriveFrozenCartBreakEven', () => {
  it('matches the reference chart\'s fixed 800 Rds / 1,600 Plyr / 400 Days', () => {
    expect(deriveFrozenCartBreakEven()).toEqual({
      roundsToRecoverCapital: 800,
      playerRoundsToRecoverCapital: 1_600,
      daysToRecoverCapital: 400,
    })
  })
})
