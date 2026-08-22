import type { VerifyInput, VerifyResult } from './types'

/**
 * Ability-to-pay thresholds, read off recurring golf revenue and footfall
 * relative to break-even. These are business rules IPI can tune per
 * screenshot's Growth / Operational / Development definitions — not ML.
 */
const GROWTH_FOOTFALL_RATIO = 1
const OPERATIONAL_FOOTFALL_RATIO = 0.5

export function calculateVerify(input: VerifyInput): VerifyResult {
  const footfallRatio =
    input.breakEvenPlayersPerDay > 0
      ? input.footfallPerDay / input.breakEvenPlayersPerDay
      : 0

  if (footfallRatio >= GROWTH_FOOTFALL_RATIO && input.availableCashFlowAnnual > 0) {
    return { abilityToPay: 'growth' }
  }
  if (footfallRatio >= OPERATIONAL_FOOTFALL_RATIO) {
    return { abilityToPay: 'operational' }
  }
  return { abilityToPay: 'development' }
}
