export type CustomerType = 'existing' | 'non_existing' | 'new_build'

export type AbilityToPay = 'growth' | 'operational' | 'development'

export type CertifyPath =
  | 'maintain_recurring_sow'
  | 'establish_sow'
  | 'project_feasibility_stop'

export interface QualifyInput {
  customerType: CustomerType
  potentialPlayersPerDay: number
  daysOpenPerYear: number
  pricePerRound: number
  estimatedOperatingCostAnnual: number
}

export interface QualifyResult {
  annualRounds: number
  potentialRevenueAnnual: number
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
