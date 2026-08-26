export type CustomerType = 'existing' | 'non_existing' | 'new_build'

export type CertifyPath =
  | 'maintain_recurring_sow'
  | 'establish_sow'
  | 'project_feasibility_stop'

export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'poor'

export interface EquipmentAuditItem {
  id: string
  name: string
  quantity: number
  condition: EquipmentCondition
}

export interface QualifyInput {
  courseName: string
  location: string
  customerType: CustomerType
  playableHoursPerDay: number
  pricePerRound: number
  expensesPerDay: number
  salariesPerMonth: number
  waterRequiredPerDay: number
  tankerCost: number
  tankerCapacity: number
  superintendent: string
  directorOfOperations: string
  procurementHead: string
  keyDecisionMaker: string
  ipiAccountOwner: string
  /** Existing equipment fleet — only asked for a Non-existing customer, the one path with a real fleet to audit. */
  equipmentAudit: EquipmentAuditItem[]
}

export interface QualifyResult {
  potentialPlayersPerDay: number
  annualPlayers: number
  potentialRevenueAnnual: number
  estimatedOperatingCostAnnual: number
  annualWaterCost: number
  annualSalaryCost: number
  totalCostOfOperations: number
  ipiOpportunityAnnual: number
}

export interface EquipmentVerificationLine {
  /** Rep confirms the template quantity is correct as-is. */
  confirmed: boolean
  /** Only meaningful when not confirmed — the rep's override. */
  sowQty: string
}

export interface QuantifyInput {
  pricePerRound: number
  actualPlayersPerDay: number
  golfSpendPerMonth: number
  salariesPerMonth: number
  waterPerMonth: number
  breakdown: {
    equipment: number
    irrigation: number
    maintenance: number
  }
  /** Keyed by equipment catalog id. */
  equipmentVerification: Record<string, EquipmentVerificationLine>
}

export interface QuantifyResult {
  breakEvenPlayersPerDay: number
  actualIpiOpportunity: number
}

export interface CertifyResult {
  path: CertifyPath
  nextAction: string
}

/**
 * Commercial View (Sheet 1 — pre-negotiation intelligence). Derived entirely
 * from the frozen Customer Input Card, independent of the Quantify/Verify
 * assumption fields — the Commercial Layer reads the Frozen Backend, it
 * never writes to it.
 */
export interface CommercialViewData {
  potentialPlayersPerDay: number
  annualPlayersPotential: number
  annualPlayersActual: number
  potentialRevenuePerDay: number
  actualRevenuePerDay: number
  breakEvenPlayersPerDay: number
  gapToBreakEvenPlayersPotential: number
  gapToBreakEvenPlayers: number
  revenueSpendPotentialAnnual: number
  revenueSpendActualAnnual: number
  estimatedOperatingCostAnnual: number
  annualSalaryCost: number
  annualWaterCost: number
  totalCostOfOperations: number
  actualOperatingCostAnnual: number
  actualSalaryCostAnnual: number
  actualWaterCostAnnual: number
  totalCostOfOperationsActual: number
  ipiOpportunityPotentialAnnual: number
  ipiOpportunityActualAnnual: number
}
