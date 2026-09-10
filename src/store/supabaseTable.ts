import { supabase } from '../lib/supabaseClient'

/**
 * Generic Supabase-backed store for a table shaped `{ id uuid primary key, data jsonb, updated_at timestamptz }`.
 * The whole domain object is kept as one JSONB blob (matching what localStorage already did), so adding a
 * field to Lead/Assessment never needs a schema migration — only `backfill` needs to know about it.
 */
export function createSupabaseStore<T extends { id: string; createdAt: string }>(table: string, backfill: (item: T) => T) {
  function client() {
    if (!supabase) throw new Error(`Supabase is not configured — cannot use the "${table}" store.`)
    return supabase
  }

  return {
    async list(): Promise<T[]> {
      const { data, error } = await client().from(table).select('data')
      if (error) throw error
      return (data ?? []).map((row) => backfill(row.data as T)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async get(id: string): Promise<T | undefined> {
      const { data, error } = await client().from(table).select('data').eq('id', id).maybeSingle()
      if (error) throw error
      return data ? backfill(data.data as T) : undefined
    },
    async save(item: T): Promise<void> {
      const { error } = await client()
        .from(table)
        .upsert({ id: item.id, data: item, updated_at: new Date().toISOString() })
      if (error) throw error
    },
    async remove(id: string): Promise<void> {
      const { error } = await client().from(table).delete().eq('id', id)
      if (error) throw error
    },
  }
}
