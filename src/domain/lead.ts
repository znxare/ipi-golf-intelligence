export type LeadCustomerType = 'existing' | 'non_existing' | 'new_build'

/** Pipeline stage this lead is ready for next — same vocabulary as the Assessment wizard steps, plus
 * build_template, which stands in for Qualify on new-build courses (nothing to qualify financially yet). */
export type LeadAction = 'build_template' | 'qualify' | 'quantify' | 'verify' | 'certify'

/** BD's read on the account, independent of the Rupee math — drives the Dashboard's category donut. */
export type LeadCategory = 'growth' | 'operational' | 'developing'

/** Traffic-light rating used for both ability-to-pay and commitment-to-maintain. */
export type LeadRating = 'green' | 'yellow' | 'red'

/** Overall deal health, judged by the owner — separate from stage and rating. */
export type LeadHealth = 'on_track' | 'needs_attention' | 'stuck'

/** Which kinds of deal are in play for this lead — shown as short tags in the Leads list. */
export interface LeadOpportunity {
  equipment: boolean
  training: boolean
  amc: boolean
  irrigation: boolean
  golfCart: boolean
  other: boolean
}

export interface Lead {
  id: string
  createdAt: string
  courseName: string
  customerType: LeadCustomerType
  /** Equipment/brand the course needs, e.g. "Toro", "Elite/Yamaha". */
  requirement: string
  /** Who IPI is up against for this deal — competitor installed, or an offer already on the table. */
  competition: string
  opportunity: LeadOpportunity
  action: LeadAction
  contactName: string
  phone: string
  email: string
  source: string
  notes: string
  category: LeadCategory
  abilityToPay: LeadRating
  maintenanceCommitment: LeadRating
  health: LeadHealth
  owner: string
  /** ISO yyyy-mm-dd — when the next action is targeted to close. */
  targetDate: string
  /** Short free-text describing what needs to happen next, e.g. "Draft SoW", "Funding structure". */
  nextAction: string
  /** Qualify-stage estimate, in Rupees — feeds the Dashboard's potential-opportunity totals. */
  potentialValue: number
  /** Quantify/Verify-stage confirmed figure, in Rupees — feeds the Dashboard's actual-opportunity totals. */
  actualValue: number
}

/** The pipeline stage a lead starts at (or jumps back to) when its customer type is set. */
export function defaultActionForCustomerType(customerType: LeadCustomerType): LeadAction {
  if (customerType === 'existing') return 'quantify'
  if (customerType === 'new_build') return 'build_template'
  return 'qualify'
}

export function createLead(courseName: string): Lead {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    courseName,
    customerType: 'non_existing',
    requirement: '',
    competition: '',
    opportunity: { equipment: false, training: false, amc: false, irrigation: false, golfCart: false, other: false },
    action: 'qualify',
    contactName: '',
    phone: '',
    email: '',
    source: '',
    notes: '',
    category: 'developing',
    abilityToPay: 'yellow',
    maintenanceCommitment: 'yellow',
    health: 'on_track',
    owner: '',
    targetDate: '',
    nextAction: '',
    potentialValue: 0,
    actualValue: 0,
  }
}
