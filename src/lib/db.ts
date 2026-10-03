import { createClient, SupabaseAuthAdapter } from '@neondatabase/neon-js'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL

/** True once VITE_NEON_AUTH_URL/VITE_NEON_DATA_API_URL are set — controls whether the app uses Neon-backed stores + login, or falls back to the original localStorage-only mode. */
export const isDbConfigured = Boolean(authUrl && dataApiUrl)

/**
 * Neon client: Supabase-compatible `auth` (Neon Auth) plus `from()` queries through the Neon Data
 * API. `allowAnonymous` lets logged-out requests through too (RLS grants the `anonymous` role full
 * access) — there's no login requirement for this app; the sign-in UI is kept dormant for later.
 */
export const db = isDbConfigured
  ? createClient({
      auth: { url: authUrl!, adapter: SupabaseAuthAdapter(), allowAnonymous: true },
      dataApi: { url: dataApiUrl! },
    })
  : null

export type DbSession = NonNullable<Awaited<ReturnType<NonNullable<typeof db>['auth']['getSession']>>['data']['session']>
