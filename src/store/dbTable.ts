import { db } from '../lib/db'

/**
 * Generic Neon-backed store (via the Data API) for a table shaped `{ id uuid primary key, data jsonb, updated_at timestamptz }`.
 * The whole domain object is kept as one JSONB blob (matching what localStorage already did), so adding a
 * field to Lead/Assessment never needs a schema migration — only `backfill` needs to know about it.
 */
export function createDbStore<T extends { id: string; createdAt: string }>(table: string, backfill: (item: T) => T) {
  function client() {
    if (!db) throw new Error(`The database is not configured — cannot use the "${table}" store.`)
    return db
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
    /** Inserts items whose id isn't in the table yet; rows already in the database are left untouched. */
    async insertMissing(items: T[]): Promise<void> {
      if (items.length === 0) return
      const now = new Date().toISOString()
      const { error } = await client()
        .from(table)
        .upsert(
          items.map((item) => ({ id: item.id, data: item, updated_at: now })),
          { onConflict: 'id', ignoreDuplicates: true },
        )
      if (error) throw error
    },
    async remove(id: string): Promise<void> {
      const { error } = await client().from(table).delete().eq('id', id)
      if (error) throw error
    },
  }
}
