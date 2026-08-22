import type { EquipmentCatalogItem } from '../data/equipmentCatalog'
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
 */
export function calculateCommercialView(input: QualifyInput): CommercialViewData {
  const annualPlayersPotential = input.potentialPlayersPerDay * input.daysOpenPerYear
  const annualPlayersActual = input.actualPlayersPerDay * input.daysOpenPerYear

  const actualRevenuePerDay = input.actualPlayersPerDay * input.pricePerRound
  const breakEvenPlayersPerDay = Math.round(
    input.potentialMaintenanceSpendPerDay / input.pricePerRound,
  )
  const gapToBreakEvenPlayers = breakEvenPlayersPerDay - input.actualPlayersPerDay

  const revenueSpendPotentialAnnual = annualPlayersPotential * input.pricePerRound
  const revenueSpendActualAnnual = input.actualCustomerSpendPerMonth * 12

  const annualSalaryCost = input.salaryCostPerDay * input.daysOpenPerYear

  const annualWaterCostPotential =
    (input.waterRequirementPotentialPerDay * input.daysOpenPerYear / input.tankerCapacity) *
    input.tankerCost
  const annualWaterCostActual =
    (input.waterReserve * input.refillsPerYear / input.tankerCapacity) * input.tankerCost

  const ipiOpportunityPotentialAnnual =
    revenueSpendPotentialAnnual - annualSalaryCost - annualWaterCostPotential
  const ipiOpportunityActualAnnual =
    revenueSpendActualAnnual - annualSalaryCost - annualWaterCostActual

  return {
    annualPlayersPotential,
    annualPlayersActual,
    actualRevenuePerDay,
    breakEvenPlayersPerDay,
    gapToBreakEvenPlayers,
    revenueSpendPotentialAnnual,
    revenueSpendActualAnnual,
    annualSalaryCost,
    annualWaterCostPotential,
    annualWaterCostActual,
    ipiOpportunityPotentialAnnual,
    ipiOpportunityActualAnnual,
  }
}
