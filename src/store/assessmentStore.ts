import {
  CART_COST_DEFAULT,
  CART_HOURS_PER_TEE_ROUND_DEFAULT,
  CART_REVENUE_PER_ROUND_DEFAULT,
  PLAYERS_PER_CART_DEFAULT,
} from '../calc/constants'
import type { Assessment } from '../domain/assessment'

export interface AssessmentStore {
  list(): Promise<Assessment[]>
  get(id: string): Promise<Assessment | undefined>
  save(assessment: Assessment): Promise<void>
  remove(id: string): Promise<void>
}

const STORAGE_KEY = 'ipi.assessments.v1'

/** Backfills cart-assumption fields onto assessments saved before they existed. */
function withCartDefaults(assessment: Assessment): Assessment {
  const q = assessment.qualifyInput
  if (
    q.cartHoursPerTeeRound !== undefined &&
    q.playersPerCart !== undefined &&
    q.cartRevenuePerRound !== undefined &&
    q.cartCost !== undefined
  ) {
    return assessment
  }
  return {
    ...assessment,
    qualifyInput: {
      ...q,
      cartHoursPerTeeRound: q.cartHoursPerTeeRound ?? CART_HOURS_PER_TEE_ROUND_DEFAULT,
      playersPerCart: q.playersPerCart ?? PLAYERS_PER_CART_DEFAULT,
      cartRevenuePerRound: q.cartRevenuePerRound ?? CART_REVENUE_PER_ROUND_DEFAULT,
      cartCost: q.cartCost ?? CART_COST_DEFAULT,
    },
  }
}

function readAll(): Assessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Assessment[]).map(withCartDefaults) : []
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
