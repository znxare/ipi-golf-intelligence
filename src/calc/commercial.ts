import type { EquipmentCatalogItem } from '../data/equipmentCatalog'
import { PLAYABLE_DAYS_PER_YEAR } from './constants'
import { deriveAnnualSalaryCost, deriveAnnualWaterCost } from './costs'
import { deriveEquipmentPriceINR } from './pricing'
import { derivePotentialPlayersPerDay } from './qualify'
import type { CommercialViewData, EquipmentVerificationLine, QualifyInput } from './types'

/** Qty the rep has actually put on the SOW for this line: template qty if confirmed, else their typed override. */
export function deriveVerifiedQty(item: EquipmentCatalogItem, line: EquipmentVerificationLine | undefined): number {
  if (!line) return 0
  if (line.confirmed) return item.templateQtyNumeric
  const override = Number(line.sowQty)
  return Number.isFinite(override) ? override : 0
}

/**
 * Live equipment price total from what's checked off in the Equipment
 * Template, using each item's Toro USD MSRP marked up and converted at the
 * given USD→INR rate (see calc/pricing.ts). Feeds the Equipment figure in
 * the IPI Opportunity Breakdown and the Draft SOW figure in the Commercial
 * Layer.
 */
export function calculateSelectedEquipmentTotal(
  catalog: EquipmentCatalogItem[],
  lines: Record<string, EquipmentVerificationLine>,
  usdInrRate: number,
): { pricedTotal: number; hasUnpriced: boolean } {
  let pricedTotal = 0
  let hasUnpriced = false
  for (const item of catalog) {
    const qty = deriveVerifiedQty(item, lines[item.id])
    if (qty <= 0) continue
    if (item.usdMsrp === null) {
      hasUnpriced = true
    } else {
      pricedTotal += deriveEquipmentPriceINR(item.usdMsrp, usdInrRate) * qty
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
 * (structural estimates: expenses/day, salary/month, water required/day
 * annualized across playable hours/day × 336 playable days/year). Actual draws entirely from Quantify's own monthly actuals
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
  const potentialPlayersPerDay = derivePotentialPlayersPerDay(input.playableHoursPerDay)
  const annualPlayersPotential = potentialPlayersPerDay * PLAYABLE_DAYS_PER_YEAR
  const annualPlayersActual = actual.actualPlayersPerDay * PLAYABLE_DAYS_PER_YEAR

  const potentialRevenuePerDay = potentialPlayersPerDay * input.pricePerRound
  const actualRevenuePerDay = actual.actualPlayersPerDay * input.pricePerRound
  // Break-even is a structural threshold from Qualify's expenses/day and green fee —
  // the same figure for both columns, not something that differs potential vs actual.
  const breakEvenPlayersPerDay = Math.round(input.expensesPerDay / input.pricePerRound)
  const gapToBreakEvenPlayersPotential = potentialPlayersPerDay - breakEvenPlayersPerDay
  const gapToBreakEvenPlayers = breakEvenPlayersPerDay - actual.actualPlayersPerDay

  const revenueSpendPotentialAnnual = annualPlayersPotential * input.pricePerRound
  const revenueSpendActualAnnual = actualRevenuePerDay * PLAYABLE_DAYS_PER_YEAR

  const estimatedOperatingCostAnnual = input.expensesPerDay * PLAYABLE_DAYS_PER_YEAR
  const annualSalaryCost = deriveAnnualSalaryCost(input.salariesPerMonth)
  const annualWaterCost = deriveAnnualWaterCost(
    input.waterRequiredPerDay,
    input.tankerCost,
    input.tankerCapacity,
    input.playableHoursPerDay,
  )
  const totalCostOfOperations = estimatedOperatingCostAnnual + annualSalaryCost + annualWaterCost

  const actualOperatingCostAnnual = actual.actualGolfSpendPerMonth * 12
  const actualSalaryCostAnnual = actual.actualSalariesPerMonth * 12
  const actualWaterCostAnnual = actual.actualWaterPerMonth * 12
  const totalCostOfOperationsActual = actualOperatingCostAnnual + actualSalaryCostAnnual + actualWaterCostAnnual

  const ipiOpportunityPotentialAnnual = revenueSpendPotentialAnnual - totalCostOfOperations
  const ipiOpportunityActualAnnual = revenueSpendActualAnnual - totalCostOfOperationsActual

  return {
    potentialPlayersPerDay,
    annualPlayersPotential,
    annualPlayersActual,
    potentialRevenuePerDay,
    actualRevenuePerDay,
    breakEvenPlayersPerDay,
    gapToBreakEvenPlayersPotential,
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
