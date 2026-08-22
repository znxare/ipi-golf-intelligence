import type { EquipmentCatalogItem } from '../data/equipmentCatalog'
import { PLAYABLE_DAYS_PER_YEAR, TANKER_CAPACITY_LITERS } from './constants'
import type { CommercialViewData, QualifyInput } from './types'

export function calculateDraftSowTotal(catalog: EquipmentCatalogItem[]): {
  pricedTotal: number
  hasUnpriced: boolean
} {
  let pricedTotal = 0
  let hasUnpriced = false
  for (const item of catalog) {
    if (item.unitPriceINR === null) {
      hasUnpriced = true
    } else {
      pricedTotal += item.unitPriceINR * item.sowQtyNumeric
    }
  }
  return { pricedTotal, hasUnpriced }
}

/**
 * IPI opportunity = the customer's spend/revenue capacity, minus the two
 * fixed costs (salary, water) they carry regardless of who services the
 * course. What's left is the budget IPI's scope of work can address.
 *
 * Qualify's Customer Input Card only captures potential/structural facts —
 * actuals (players, spend) come from Quantify once it's been run. For a
 * New Build course Quantify never runs, so `actual` is all zeros, which is
 * correct: there's no current operation to measure yet.
 */
export function calculateCommercialView(
  input: QualifyInput,
  actual: { actualPlayersPerDay: number; actualSpendPerMonth: number },
): CommercialViewData {
  const annualPlayersPotential = input.potentialPlayersPerDay * PLAYABLE_DAYS_PER_YEAR
  const annualPlayersActual = actual.actualPlayersPerDay * PLAYABLE_DAYS_PER_YEAR

  const actualRevenuePerDay = actual.actualPlayersPerDay * input.pricePerRound
  const breakEvenPlayersPerDay = Math.round(input.expensesPerDay / input.pricePerRound)
  const gapToBreakEvenPlayers = breakEvenPlayersPerDay - actual.actualPlayersPerDay

  const revenueSpendPotentialAnnual = annualPlayersPotential * input.pricePerRound
  const revenueSpendActualAnnual = actual.actualSpendPerMonth * 12

  const annualSalaryCost = input.salariesPerMonth * 12

  // One reserve refill's cost — recurring frequency isn't captured anymore,
  // so this is shown as a single figure rather than split potential/actual.
  const annualWaterCost = (input.waterReserve / TANKER_CAPACITY_LITERS) * input.tankerCost

  const ipiOpportunityPotentialAnnual = revenueSpendPotentialAnnual - annualSalaryCost - annualWaterCost
  const ipiOpportunityActualAnnual = revenueSpendActualAnnual - annualSalaryCost - annualWaterCost

  return {
    annualPlayersPotential,
    annualPlayersActual,
    actualRevenuePerDay,
    breakEvenPlayersPerDay,
    gapToBreakEvenPlayers,
    revenueSpendPotentialAnnual,
    revenueSpendActualAnnual,
    annualSalaryCost,
    annualWaterCost,
    ipiOpportunityPotentialAnnual,
    ipiOpportunityActualAnnual,
  }
}
