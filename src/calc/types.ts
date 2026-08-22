export type CustomerType = 'existing' | 'non_existing' | 'new_build'

export type AbilityToPay = 'growth' | 'operational' | 'development'

export type CertifyPath =
  | 'maintain_recurring_sow'
  | 'establish_sow'
  | 'project_feasibility_stop'

export interface QualifyInput {
  courseName: string
  location: string
  customerType: CustomerType
  playableHoursPerDay: number
  potentialPlayersPerDay: number
  pricePerRound: number
  expensesPerDay: number
  salariesPerMonth: number
  waterReserve: number
  tankerCost: number
  superintendent: string
  directorOfOperations: string
  procurementHead: string
  keyDecisionMaker: string
  ipiAccountOwner: string
}

export interface QualifyResult {
  annualRounds: number
  potentialRevenueAnnual: number
  estimatedOperatingCostAnnual: number
  ipiOpportunityAnnual: number
}

export interface QuantifyInput {
  pricePerRound: number
  actualPlayersPerDay: number
  golfSpendPerDay: number
  salariesPerDay: number
  waterPerDay: number
  breakdown: {
    equipment: number
    irrigation: number
    maintenance: number
    management: number
  }
}

export interface QuantifyResult {
  breakEvenPlayersPerDay: number
  revenuePerDay: number
  ipiOpportunityPerDay: number
  revenueAtBreakEven: number
  gapToBreakEvenPlayers: number
  totalIpiOpportunity: number
}

export interface VerifyInput {
  recurringGolfRevenueAnnual: number
  availableCashFlowAnnual: number
  footfallPerDay: number
  breakEvenPlayersPerDay: number
}

export interface VerifyResult {
  abilityToPay: AbilityToPay
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
  annualPlayersPotential: number
  annualPlayersActual: number
  actualRevenuePerDay: number
  breakEvenPlayersPerDay: number
  gapToBreakEvenPlayers: number
  revenueSpendPotentialAnnual: number
  revenueSpendActualAnnual: number
  annualSalaryCost: number
  annualWaterCost: number
  ipiOpportunityPotentialAnnual: number
  ipiOpportunityActualAnnual: number
}
