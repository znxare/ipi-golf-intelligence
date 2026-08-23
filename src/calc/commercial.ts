import type { EquipmentCatalogItem } from '../data/equipmentCatalog'
import { PLAYABLE_DAYS_PER_YEAR } from './constants'
import { deriveAnnualSalaryCost, deriveAnnualWaterCost } from './costs'
import { derivePotentialPlayersPerDay } from './qualify'
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
 * IPI opportunity = the customer's spend/revenue capacity, minus the total
 * cost of operations (day-to-day expenses + salary + water refills) they
 * carry regardless of who services the course. What's left is the budget
 * IPI's scope of work can address.
 *
 * Qualify's Customer Input Card only captures potential/structural facts —
 * actuals (players, spend) come from Quantify once it's been run. For a
 * New Build course Quantify never runs, so `actual` is all zeros, which is
 * correct: there's no current operation to measure yet. The cost side is
 * always drawn from the frozen Customer Input Card, so it's the same for
 * both the potential and actual opportunity figures.
 */
export function calculateCommercialView(
  input: QualifyInput,
  actual: { actualPlayersPerDay: number; actualSpendPerMonth: number },
): CommercialViewData {
  const annualPlayersPotential = derivePotentialPlayersPerDay(input.playableHoursPerDay) * PLAYABLE_DAYS_PER_YEAR
  const annualPlayersActual = actual.actualPlayersPerDay * PLAYABLE_DAYS_PER_YEAR

  const actualRevenuePerDay = actual.actualPlayersPerDay * input.pricePerRound
  const breakEvenPlayersPerDay = Math.round(input.expensesPerDay / input.pricePerRound)
  const gapToBreakEvenPlayers = breakEvenPlayersPerDay - actual.actualPlayersPerDay

  const revenueSpendPotentialAnnual = annualPlayersPotential * input.pricePerRound
  const revenueSpendActualAnnual = actual.actualSpendPerMonth * 12

  const estimatedOperatingCostAnnual = input.expensesPerDay * PLAYABLE_DAYS_PER_YEAR
  const annualSalaryCost = deriveAnnualSalaryCost(input.salariesPerMonth)
  const annualWaterCost = deriveAnnualWaterCost(input.waterReserve, input.tankerCost)
  const totalCostOfOperations = estimatedOperatingCostAnnual + annualSalaryCost + annualWaterCost

  const ipiOpportunityPotentialAnnual = revenueSpendPotentialAnnual - totalCostOfOperations
  const ipiOpportunityActualAnnual = revenueSpendActualAnnual - totalCostOfOperations

  return {
    annualPlayersPotential,
    annualPlayersActual,
    actualRevenuePerDay,
    breakEvenPlayersPerDay,
    gapToBreakEvenPlayers,
    revenueSpendPotentialAnnual,
    revenueSpendActualAnnual,
    estimatedOperatingCostAnnual,
    annualSalaryCost,
    annualWaterCost,
    totalCostOfOperations,
    ipiOpportunityPotentialAnnual,
    ipiOpportunityActualAnnual,
  }
}
