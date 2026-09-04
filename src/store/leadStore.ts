import type { Lead } from '../domain/lead'

export interface LeadStore {
  list(): Promise<Lead[]>
  get(id: string): Promise<Lead | undefined>
  save(lead: Lead): Promise<void>
  remove(id: string): Promise<void>
}

const STORAGE_KEY = 'ipi.leads.v1'

/** Backfills fields onto leads saved before they existed (customerType/requirement/competition/opportunity/action). */
function withLeadDefaults(lead: Lead): Lead {
  const needsBackfill =
    lead.customerType === undefined ||
    lead.requirement === undefined ||
    lead.competition === undefined ||
    lead.opportunity === undefined ||
    lead.action === undefined

  if (!needsBackfill) return lead

  return {
    ...lead,
    customerType: lead.customerType ?? 'non_existing',
    requirement: lead.requirement ?? '',
    competition: lead.competition ?? '',
    opportunity: lead.opportunity ?? { equipment: false, training: false, amc: false },
    action: lead.action ?? 'qualify',
  }
}

function readAll(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Lead[]).map(withLeadDefaults) : []
  } catch {
    return []
  }
}

function writeAll(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

/**
 * localStorage-backed implementation for the MVP, same shape as
 * assessmentStore — swap for a Supabase-backed implementation of the same
 * LeadStore interface once multi-user persistence/auth is needed.
 */
export const leadStore: LeadStore = {
  async list() {
    return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async get(id) {
    return readAll().find((l) => l.id === id)
  },
  async save(lead) {
    const all = readAll()
    const idx = all.findIndex((l) => l.id === lead.id)
    if (idx >= 0) all[idx] = lead
    else all.push(lead)
    writeAll(all)
  },
  async remove(id) {
    writeAll(readAll().filter((l) => l.id !== id))
  },
}
