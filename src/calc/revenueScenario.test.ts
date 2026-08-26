import { describe, expect, it } from 'vitest'
import { buildCapacityMatrix, deriveBreakEvenCell, deriveCartBreakEven } from './revenueScenario'

describe('buildCapacityMatrix', () => {
  const rows = buildCapacityMatrix()

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

describe('deriveBreakEvenCell', () => {
  it('matches the reference chart\'s BE capacity band table', () => {
    expect(deriveBreakEvenCell(100_000, 3_500)).toEqual({ playersNeeded: 29, band: 20 })
    expect(deriveBreakEvenCell(100_000, 5_000)).toEqual({ playersNeeded: 20, band: 10 })
    expect(deriveBreakEvenCell(100_000, 7_500)).toEqual({ playersNeeded: 14, band: 10 })

    expect(deriveBreakEvenCell(150_000, 3_500)).toEqual({ playersNeeded: 43, band: 30 })
    expect(deriveBreakEvenCell(150_000, 5_000)).toEqual({ playersNeeded: 30, band: 20 })
    expect(deriveBreakEvenCell(150_000, 7_500)).toEqual({ playersNeeded: 20, band: 10 })

    expect(deriveBreakEvenCell(200_000, 3_500)).toEqual({ playersNeeded: 58, band: 30 })
    expect(deriveBreakEvenCell(200_000, 5_000)).toEqual({ playersNeeded: 40, band: 30 })
    expect(deriveBreakEvenCell(200_000, 7_500)).toEqual({ playersNeeded: 27, band: 20 })

    expect(deriveBreakEvenCell(250_000, 3_500)).toEqual({ playersNeeded: 72, band: 40 })
    expect(deriveBreakEvenCell(250_000, 5_000)).toEqual({ playersNeeded: 50, band: 30 })
    expect(deriveBreakEvenCell(250_000, 7_500)).toEqual({ playersNeeded: 34, band: 20 })

    expect(deriveBreakEvenCell(300_000, 3_500)).toEqual({ playersNeeded: 86, band: 50 })
    expect(deriveBreakEvenCell(300_000, 5_000)).toEqual({ playersNeeded: 60, band: 40 })
    expect(deriveBreakEvenCell(300_000, 7_500)).toEqual({ playersNeeded: 40, band: 30 })
  })
})

describe('deriveCartBreakEven', () => {
  it('matches the reference chart\'s fixed 800 Rds / 1,600 Plyr / 400 Days', () => {
    expect(deriveCartBreakEven()).toEqual({
      roundsToRecoverCapital: 800,
      playerRoundsToRecoverCapital: 1_600,
      daysToRecoverCapital: 400,
    })
  })
})
