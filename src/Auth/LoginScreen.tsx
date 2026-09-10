import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

/** Email/password gate shown when Supabase is configured but no session exists yet. */
export function LoginScreen() {
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setInfo('')
    setBusy(true)

    const { error: authError } =
      mode === 'sign_in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setBusy(false)
    if (authError) {
      setError(authError.message)
      return
    }
    if (mode === 'sign_up') {
      setInfo('Account created. Check your email to confirm, then sign in.')
      setMode('sign_in')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ipi-950 via-ipi-900 to-ipi-700 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_16px_40px_rgba(10,42,30,0.35)]">
        <div className="mb-5 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ipi-700/50">IPI Golf Intelligence</div>
          <div className="mt-0.5 text-lg font-semibold text-ink">{mode === 'sign_in' ? 'Sign in' : 'Create an account'}</div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ipi-700/70">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ipi-600"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ipi-700/70">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ipi-600"
              autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <div className="rounded-lg bg-risk-100 px-3 py-2 text-xs text-risk-600">{error}</div>}
          {info && <div className="rounded-lg bg-mint-100 px-3 py-2 text-xs text-mint-600">{info}</div>}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-ipi-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ipi-800 disabled:opacity-40"
          >
            {busy ? 'Please wait…' : mode === 'sign_in' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'sign_in' ? 'sign_up' : 'sign_in'))
            setError('')
            setInfo('')
          }}
          className="mt-4 w-full text-center text-xs text-ipi-700/60 hover:text-ipi-800"
        >
          {mode === 'sign_in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
