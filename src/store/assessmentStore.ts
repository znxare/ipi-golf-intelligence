import type { Assessment } from '../domain/assessment'

export interface AssessmentStore {
  list(): Promise<Assessment[]>
  get(id: string): Promise<Assessment | undefined>
  save(assessment: Assessment): Promise<void>
  remove(id: string): Promise<void>
}

const STORAGE_KEY = 'ipi.assessments.v1'

function readAll(): Assessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Assessment[]) : []
  } catch {
    return []
  }
}

function writeAll(assessments: Assessment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments))
}

/**
 * localStorage-backed implementation for the MVP. Swap for a Supabase-backed
 * implementation of the same AssessmentStore interface once multi-user
 * persistence/auth is needed — nothing above this layer should need to change.
 */
export const assessmentStore: AssessmentStore = {
  async list() {
    return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async get(id) {
    return readAll().find((a) => a.id === id)
  },
  async save(assessment) {
    const all = readAll()
    const idx = all.findIndex((a) => a.id === assessment.id)
    if (idx >= 0) all[idx] = assessment
    else all.push(assessment)
    writeAll(all)
  },
  async remove(id) {
    writeAll(readAll().filter((a) => a.id !== id))
  },
}
