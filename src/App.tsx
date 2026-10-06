import { useEffect, useState } from 'react'
import { AssessmentsList } from './AssessmentsList'
import { AssessmentWizard } from './AssessmentWizard'
import { useSession } from './Auth/useSession'
import { Icon } from './components/ui'
import { CommercialLayer } from './CommercialLayer'
import { Dashboard } from './Dashboard'
import type { Assessment } from './domain/assessment'
import type { Lead } from './domain/lead'
import { db, isDbConfigured } from './lib/db'
import { LeadDetail } from './LeadDetail'
import { LeadsList } from './LeadsList'
import { importBrowserData } from './store'

type Tab = 'dashboard' | 'transaction' | 'leads'

const NAV_ICON = {
  dashboard: 'M4 12L12 4l8 8M6 10v10h12V10',
  transaction: 'M7 3h8l4 4v14H7zM15 3v4h4M9 13h6M9 17h6',
  leads: 'M8 11a3 3 0 100-6 3 3 0 000 6zM3 20a5 5 0 0110 0M17 11a3 3 0 100-6 3 3 0 000 6zM13.2 14.2a5 5 0 016.8 5.8',
}

const ICON_SEARCH = 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3'
const ICON_BELL = 'M6 9a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9zM10 18a2 2 0 004 0'
const ICON_ACCOUNT = 'M4 20a8 8 0 0116 0M12 12a4 4 0 100-8 4 4 0 000 8z'

function Sidebar({ tab, onTabChange }: { tab: Tab; onTabChange: (tab: Tab) => void }) {
  const items: { key: Tab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: NAV_ICON.dashboard },
    { key: 'transaction', label: 'Transaction', icon: NAV_ICON.transaction },
    { key: 'leads', label: 'Leads', icon: NAV_ICON.leads },
  ]

  return (
    <div className="relative flex w-52 flex-none flex-col gap-5 overflow-hidden bg-ipi-950 px-3 py-4">
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}sidebar-bg.jpg)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ipi-950/92 via-ipi-950/70 to-ipi-950/95" />

      <div className="relative px-1">
        <img
          src={`${import.meta.env.BASE_URL}ipi-logo.png`}
          alt="IPI"
          className="block h-auto w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
        />
        <div className="mt-2 text-center text-[10px] uppercase tracking-[0.15em] text-white/40">Transaction Platform</div>
      </div>
      <div className="relative flex flex-col gap-1">
        {items.map((item) => {
          const active = tab === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                active
                  ? 'bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-sm'
                  : 'text-white/60 hover:bg-white/8 hover:text-white/90'
              }`}
            >
              <span className={active ? 'text-mint-600' : 'text-white/40'}>
                <Icon path={item.icon} />
              </span>
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="relative mt-auto px-1 text-[11px] leading-snug text-white/30">Smarter Solutions.
        <br />Healthier Landscapes.</div>
    </div>
  )
}

function TopHeader({
  search,
  onSearchChange,
  userEmail,
  onSignOut,
}: {
  search: string
  onSearchChange: (v: string) => void
  userEmail?: string
  onSignOut: () => void
}) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <div className="flex items-center gap-4 border-b border-hairline bg-white/80 px-6 py-3 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-hairline bg-ipi-50/60 px-3 py-2 text-sm text-ipi-700/60 focus-within:border-ipi-600">
        <span className="text-ipi-700/40">
          <Icon path={ICON_SEARCH} />
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer, project, lead…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ipi-700/35"
        />
      </div>
      <div className="hidden text-xs text-ipi-700/50 sm:block">{today}</div>
      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ipi-700/60 transition-colors hover:bg-ipi-50"
      >
        <Icon path={ICON_BELL} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-risk-600" />
      </button>
      <button
        type="button"
        aria-label={userEmail ? `Signed in as ${userEmail} — sign out` : 'Account'}
        title={userEmail ? `Signed in as ${userEmail} — click to sign out` : undefined}
        onClick={userEmail ? onSignOut : undefined}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ipi-100 text-ipi-800 transition-colors hover:bg-ipi-100/70"
      >
        <Icon path={ICON_ACCOUNT} />
      </button>
    </div>
  )
}

function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [openAssessment, setOpenAssessment] = useState<Assessment | null>(null)
  const [openLead, setOpenLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const { session, refresh } = useSession()
  const [importState, setImportState] = useState<'pending' | 'done' | 'failed'>('pending')

  // The database allows anonymous access, so this runs regardless of sign-in: copy any
  // leads/assessments still saved in this browser into the database before the screens load,
  // so they show up in the shared pipeline.
  useEffect(() => {
    if (!isDbConfigured || importState !== 'pending') return
    importBrowserData()
      .then(() => setImportState('done'))
      .catch((err) => {
        console.error('Importing browser data into the database failed', err)
        setImportState('failed')
      })
  }, [importState])

  if (isDbConfigured && importState === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ipi-50 text-sm text-ipi-700/60">
        Syncing leads saved in this browser to the database…
      </div>
    )
  }

  if (isDbConfigured && importState === 'failed') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ipi-50 px-4 text-center text-sm text-ipi-700/70">
        <div>Couldn't move the leads saved in this browser into the database. They're still safe in this browser.</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setImportState('pending')}
            className="rounded-lg bg-ipi-900 px-4 py-2 text-sm font-medium text-white hover:bg-ipi-800"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => setImportState('done')}
            className="rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ipi-800 hover:bg-white"
          >
            Skip for now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        tab={tab}
        onTabChange={(next) => {
          setTab(next)
          setOpenAssessment(null)
          setOpenLead(null)
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader search={search} onSearchChange={setSearch} userEmail={session?.user.email}
          onSignOut={() => db?.auth.signOut().finally(refresh)}
        />
        <div className="min-w-0 flex-1 overflow-y-auto bg-ipi-50 p-6">
          <div className="mx-auto max-w-6xl">
            {openAssessment && openAssessment.status === 'in_progress' && (
              <AssessmentWizard assessment={openAssessment} onDone={setOpenAssessment} />
            )}
            {openAssessment && openAssessment.status !== 'in_progress' && (
              <CommercialLayer assessment={openAssessment} onBack={() => setOpenAssessment(null)} />
            )}
            {!openAssessment && !openLead && tab === 'dashboard' && <Dashboard onOpenLead={setOpenLead} search={search} />}
            {!openAssessment && !openLead && tab === 'transaction' && <AssessmentsList onOpen={setOpenAssessment} />}
            {!openAssessment && !openLead && tab === 'leads' && (
              <LeadsList onOpen={setOpenLead} onStartTransaction={handleStartTransaction} />
            )}
            {openLead && (
              <LeadDetail
                lead={openLead}
                onBack={() => setOpenLead(null)}
                onStartTransaction={handleStartTransaction}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )

  function handleStartTransaction(assessment: Assessment) {
    setOpenLead(null)
    setTab('transaction')
    setOpenAssessment(assessment)
  }
}

export default App
