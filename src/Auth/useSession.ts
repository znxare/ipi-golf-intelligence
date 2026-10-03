import { useCallback, useEffect, useState } from 'react'
import { db, type DbSession } from '../lib/db'

/**
 * Tracks the current Neon Auth session; `loading` stays true only for the initial check.
 * Neon's Supabase adapter doesn't emit SIGNED_IN/SIGNED_OUT events, so callers must `refresh()`
 * after signing in or out.
 */
export function useSession() {
  const [session, setSession] = useState<DbSession | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!db) return
    try {
      const { data } = await db.auth.getSession()
      setSession(data.session)
    } catch (err) {
      // The SDK can abort an in-flight session fetch (e.g. on tab focus changes) — don't leave the
      // app stuck on Loading over it.
      console.warn('Session check failed', err)
    }
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  return { session, loading, refresh }
}
