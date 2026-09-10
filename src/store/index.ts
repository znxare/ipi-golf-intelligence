import type { Assessment } from '../domain/assessment'
import type { Lead } from '../domain/lead'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { assessmentStore as localAssessmentStore, withCartDefaults } from './assessmentStore'
import { leadStore as localLeadStore, withLeadDefaults } from './leadStore'
import { createSupabaseStore } from './supabaseTable'

export type { AssessmentStore } from './assessmentStore'
export type { LeadStore } from './leadStore'

/**
 * Picks the Supabase-backed store when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are set at build
 * time, otherwise falls back to the original localStorage-only stores — so the app keeps working
 * with zero config until a database is actually connected.
 */
export const leadStore = isSupabaseConfigured ? createSupabaseStore<Lead>('leads', withLeadDefaults) : localLeadStore

export const assessmentStore = isSupabaseConfigured
  ? createSupabaseStore<Assessment>('assessments', withCartDefaults)
  : localAssessmentStore
