import type { QuantifyInput, QuantifyResult } from './types'

export function calculateQuantify(input: QuantifyInput): QuantifyResult {
  const breakEvenPlayersPerDay = Math.round(
    input.golfSpendPerDay / input.pricePerRound,
  )
  const revenuePerDay = input.actualPlayersPerDay * input.pricePerRound
  const ipiOpportunityPerDay =
    input.golfSpendPerDay - input.salariesPerDay - input.waterPerDay
  const revenueAtBreakEven = breakEvenPlayersPerDay * input.pricePerRound
  const gapToBreakEvenPlayers = breakEvenPlayersPerDay - input.actualPlayersPerDay
  const totalIpiOpportunity =
    input.breakdown.equipment +
    input.breakdown.irrigation +
    input.breakdown.maintenance +
    input.breakdown.management

  return {
    breakEvenPlayersPerDay,
    revenuePerDay,
    ipiOpportunityPerDay,
    revenueAtBreakEven,
    gapToBreakEvenPlayers,
    totalIpiOpportunity,
  }
}
