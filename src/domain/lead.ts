export type LeadCustomerType = 'existing' | 'non_existing' | 'new_build'

/** Pipeline stage this lead is ready for next — same vocabulary as the Assessment wizard steps. */
export type LeadAction = 'qualify' | 'quantify' | 'verify' | 'certify'

/** BD's read on the account, independent of the Rupee math — drives the Dashboard's category donut. */
export type LeadCategory = 'growth' | 'operational' | 'developing'

/** Traffic-light rating used for both ability-to-pay and commitment-to-maintain. */
export type LeadRating = 'green' | 'yellow' | 'red'

/** Overall deal health, judged by the owner — separate from stage and rating. */
export type LeadHealth = 'on_track' | 'needs_attention' | 'stuck'

/** Which kinds of deal are in play for this lead — shown as EQ / TR / AMC tags. */
export interface LeadOpportunity {
  equipment: boolean
  training: boolean
  amc: boolean
}

export interface LeadActivityEntry {
  id: string
  at: string
  note: string
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
  /** Timeline entries logged after creation — stage changes and free-text updates. */
  activity: LeadActivityEntry[]
}

export function createLead(courseName: string): Lead {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    courseName,
    customerType: 'non_existing',
    requirement: '',
    competition: '',
    opportunity: { equipment: false, training: false, amc: false },
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
    activity: [],
  }
}

/** Appends a timestamped timeline entry — used for both stage changes and free-text updates. */
export function appendLeadActivity(lead: Lead, note: string): Lead {
  if (!note.trim()) return lead
  return {
    ...lead,
    activity: [...lead.activity, { id: crypto.randomUUID(), at: new Date().toISOString(), note: note.trim() }],
  }
}
