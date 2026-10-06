import { createAssessmentFromLead, type Assessment } from '../domain/assessment'
import type { Lead } from '../domain/lead'
import { isDbConfigured } from '../lib/db'
import { assessmentStore as localAssessmentStore, withCartDefaults } from './assessmentStore'
import { leadStore as localLeadStore, withLeadDefaults } from './leadStore'
import { createDbStore } from './dbTable'

export type { AssessmentStore } from './assessmentStore'
export type { LeadStore } from './leadStore'

/**
 * Picks the Neon-backed store when VITE_NEON_AUTH_URL/VITE_NEON_DATA_API_URL are set at build
 * time, otherwise falls back to the original localStorage-only stores — so the app keeps working
 * with zero config until a database is actually connected.
 */
const dbLeadStore = isDbConfigured ? createDbStore<Lead>('leads', withLeadDefaults) : null
const dbAssessmentStore = isDbConfigured ? createDbStore<Assessment>('assessments', withCartDefaults) : null

export const leadStore = dbLeadStore ?? localLeadStore
export const assessmentStore = dbAssessmentStore ?? localAssessmentStore

/**
 * Saves a lead at the Quantify stage and opens a new Transaction for it, pre-filled from the
 * lead — the one action behind both the Leads table's quick action and Lead details' button.
 */
export async function startQuantifyTransaction(lead: Lead): Promise<Assessment> {
  const next: Lead = { ...lead, action: 'quantify' }
  await leadStore.save(next)
  const assessment = createAssessmentFromLead(next)
  await assessmentStore.save(assessment)
  return assessment
}

const IMPORTED_KEY = 'ipi.browserDataImported.v1'

/**
 * One-time copy of leads/assessments saved in this browser's localStorage (from before the database
 * was connected) into the database. Rows that already exist there are never overwritten, and the
 * localStorage copy is kept as a backup. No-op without a database or once this browser has imported.
 */
export async function importBrowserData(): Promise<{ leads: number; assessments: number }> {
  if (!dbLeadStore || !dbAssessmentStore) return { leads: 0, assessments: 0 }
  try {
    if (localStorage.getItem(IMPORTED_KEY)) return { leads: 0, assessments: 0 }
  } catch {
    return { leads: 0, assessments: 0 }
  }

  const [leads, assessments] = await Promise.all([localLeadStore.list(), localAssessmentStore.list()])
  await dbLeadStore.insertMissing(leads)
  await dbAssessmentStore.insertMissing(assessments)
  localStorage.setItem(IMPORTED_KEY, new Date().toISOString())
  return { leads: leads.length, assessments: assessments.length }
}
