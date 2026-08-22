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

export interface NegotiationLine {
  negotiatedQty: number
  notes: string
}

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
  negotiation?: Record<string, NegotiationLine>
}

export function createDefaultQualifyInput(): QualifyInput {
  return {
    courseCode: '18H / P72 / 7.5K YD',
    location: '',
    customerType: 'non_existing',
    daysOpenPerYear: 336,
    pricePerRound: 5_500,
    potentialPlayersPerDay: 192,
    actualPlayersPerDay: 17,
    potentialMaintenanceSpendPerDay: 300_000,
    actualCustomerSpendPerMonth: 3_000_000,
    salaryCostPerDay: 35_000,
    waterRequirementPotentialPerDay: 2_000_000,
    waterReserve: 500_000,
    tankerCapacity: 20_000,
    tankerCost: 1_000,
    refillsPerYear: 12,
    superintendent: '',
    directorOfOperations: '',
    procurementHead: '',
    keyDecisionMaker: '',
    ipiAccountOwner: '',
  }
}

export function createDefaultQuantifyInput(actualPlayersPerDay = 17): QuantifyInput {
  return {
    pricePerRound: 5_500,
    actualPlayersPerDay,
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
