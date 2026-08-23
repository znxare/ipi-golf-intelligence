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
 * IPI opportunity = the customer's revenue capacity, minus the total cost of
 * operations (day-to-day expenses + salary + water) they carry regardless of
 * who services the course. What's left is the budget IPI's scope of work can
 * address.
 *
 * Potential draws entirely from Qualify's frozen Customer Input Card
 * (structural estimates: expenses/day, salary/month, water reserve on a
 * refill cycle). Actual draws entirely from Quantify's own monthly actuals
 * once it's been run — golf course spend, salaries and water are each
 * reported directly per month there, so they're annualized by ×12 rather
 * than re-derived. For a New Build course Quantify never runs, so `actual`
 * is all zeros, which is correct: there's no current operation to measure.
 */
export function calculateCommercialView(
  input: QualifyInput,
  actual: {
    actualPlayersPerDay: number
    actualGolfSpendPerMonth: number
    actualSalariesPerMonth: number
    actualWaterPerMonth: number
  },
): CommercialViewData {
  const annualPlayersPotential = derivePotentialPlayersPerDay(input.playableHoursPerDay) * PLAYABLE_DAYS_PER_YEAR
  const annualPlayersActual = actual.actualPlayersPerDay * PLAYABLE_DAYS_PER_YEAR

  const actualRevenuePerDay = actual.actualPlayersPerDay * input.pricePerRound
  const breakEvenPlayersPerDay = Math.round(input.expensesPerDay / input.pricePerRound)
  const gapToBreakEvenPlayers = breakEvenPlayersPerDay - actual.actualPlayersPerDay

  const revenueSpendPotentialAnnual = annualPlayersPotential * input.pricePerRound
  const revenueSpendActualAnnual = actualRevenuePerDay * PLAYABLE_DAYS_PER_YEAR

  const estimatedOperatingCostAnnual = input.expensesPerDay * PLAYABLE_DAYS_PER_YEAR
  const annualSalaryCost = deriveAnnualSalaryCost(input.salariesPerMonth)
  const annualWaterCost = deriveAnnualWaterCost(input.waterReserve, input.tankerCost)
  const totalCostOfOperations = estimatedOperatingCostAnnual + annualSalaryCost + annualWaterCost

  const actualOperatingCostAnnual = actual.actualGolfSpendPerMonth * 12
  const actualSalaryCostAnnual = actual.actualSalariesPerMonth * 12
  const actualWaterCostAnnual = actual.actualWaterPerMonth * 12
  const totalCostOfOperationsActual = actualOperatingCostAnnual + actualSalaryCostAnnual + actualWaterCostAnnual

  const ipiOpportunityPotentialAnnual = revenueSpendPotentialAnnual - totalCostOfOperations
  const ipiOpportunityActualAnnual = revenueSpendActualAnnual - totalCostOfOperationsActual

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
    actualOperatingCostAnnual,
    actualSalaryCostAnnual,
    actualWaterCostAnnual,
    totalCostOfOperationsActual,
    ipiOpportunityPotentialAnnual,
    ipiOpportunityActualAnnual,
  }
}
