import {
  CART_COST_DEFAULT,
  CART_HOURS_PER_TEE_ROUND_DEFAULT,
  CART_REVENUE_PER_ROUND_DEFAULT,
  PLAYERS_PER_CART_DEFAULT,
  TANKER_CAPACITY_LITERS,
} from '../calc/constants'
import type {
  CertifyResult,
  QualifyInput,
  QualifyResult,
  QuantifyInput,
  QuantifyResult,
} from '../calc/types'
import type { Lead } from './lead'

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
  certifyResult?: CertifyResult
  negotiation?: Record<string, NegotiationLine>
}

export function createDefaultQualifyInput(): QualifyInput {
  return {
    courseName: '',
    location: '',
    customerType: 'non_existing',
    playableHoursPerDay: 12,
    pricePerRound: 5_500,
    expensesPerDay: 300_000,
    salariesPerMonth: 980_000,
    waterRequiredPerDay: 200_000,
    tankerCost: 1_000,
    tankerCapacity: TANKER_CAPACITY_LITERS,
    cartHoursPerTeeRound: CART_HOURS_PER_TEE_ROUND_DEFAULT,
    playersPerCart: PLAYERS_PER_CART_DEFAULT,
    cartRevenuePerRound: CART_REVENUE_PER_ROUND_DEFAULT,
    cartCost: CART_COST_DEFAULT,
    superintendent: '',
    directorOfOperations: '',
    procurementHead: '',
    keyDecisionMaker: '',
    ipiAccountOwner: '',
    equipmentAudit: [],
  }
}

export function createDefaultQuantifyInput(actualPlayersPerDay = 17): QuantifyInput {
  return {
    pricePerRound: 5_500,
    actualPlayersPerDay,
    golfSpendPerMonth: 8_400_000,
    salariesPerMonth: 2_800_000,
    waterPerMonth: 1_120_000,
    breakdown: {
      equipment: 4_000_000,
      irrigation: 2_000_000,
      maintenance: 3_000_000,
      golfCart: 0,
    },
    equipmentVerification: {},
    golfCartVerification: {},
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

/**
 * Starts a Transaction straight at the Quantify step for a lead that's already past Qualify in
 * the pipeline — pre-fills the course name and customer type so Quantify's numbers line up.
 */
export function createAssessmentFromLead(lead: Lead): Assessment {
  return {
    id: crypto.randomUUID(),
    accountName: lead.courseName,
    createdAt: new Date().toISOString(),
    status: 'in_progress',
    step: 'quantify',
    qualifyInput: { ...createDefaultQualifyInput(), courseName: lead.courseName, customerType: lead.customerType },
    quantifyInput: createDefaultQuantifyInput(),
  }
}
