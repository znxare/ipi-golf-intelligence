import type {
  CertifyResult,
  QualifyInput,
  QualifyResult,
  QuantifyInput,
  QuantifyResult,
  VerifyInput,
  VerifyResult,
} from '../calc/types'

export type WizardStep = 'qualify' | 'quantify' | 'verify' | 'certify'
export type AssessmentStatus = 'in_progress' | 'certified' | 'stopped'

export interface Assessment {
  id: string
  accountName: string
  createdAt: string
  status: AssessmentStatus
  step: WizardStep
  qualifyInput: QualifyInput
  qualifyResult?: QualifyResult
  quantifyInput?: QuantifyInput
  quantifyResult?: QuantifyResult
  verifyInput?: VerifyInput
  verifyResult?: VerifyResult
  certifyResult?: CertifyResult
}

export function createDefaultQualifyInput(): QualifyInput {
  return {
    customerType: 'non_existing',
    potentialPlayersPerDay: 192,
    daysOpenPerYear: 336,
    pricePerRound: 2500,
    estimatedOperatingCostAnnual: 100_800_000,
  }
}

export function createDefaultQuantifyInput(): QuantifyInput {
  return {
    pricePerRound: 5_500,
    actualPlayersPerDay: 17,
    golfSpendPerDay: 300_000,
    salariesPerDay: 100_000,
    waterPerDay: 40_000,
    breakdown: {
      equipment: 4_000_000,
      irrigation: 2_000_000,
      maintenance: 3_000_000,
      management: 5_000_000,
    },
  }
}

export function createDefaultVerifyInput(): VerifyInput {
  return {
    recurringGolfRevenueAnnual: 30_000_000,
    availableCashFlowAnnual: 2_000_000,
    footfallPerDay: 17,
    breakEvenPlayersPerDay: 55,
  }
}

export function createAssessment(accountName: string): Assessment {
  return {
    id: crypto.randomUUID(),
    accountName,
    createdAt: new Date().toISOString(),
    status: 'in_progress',
    step: 'qualify',
    qualifyInput: createDefaultQualifyInput(),
  }
}
