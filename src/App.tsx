import { useState } from 'react'
import { AssessmentsList } from './AssessmentsList'
import { AssessmentWizard } from './AssessmentWizard'
import { CommercialLayer } from './CommercialLayer'
import { Dashboard } from './Dashboard'
import type { Assessment } from './domain/assessment'
import type { Lead } from './domain/lead'
import { LeadDetail } from './LeadDetail'
import { LeadsList } from './LeadsList'

type Tab = 'dashboard' | 'transaction' | 'leads'

function Sidebar({ tab, onTabChange }: { tab: Tab; onTabChange: (tab: Tab) => void }) {
  function navItemClass(active: boolean) {
    return `flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
      active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`
  }

  return (
    <div className="flex w-48 flex-col gap-4 bg-ipi-900 px-3 py-4">
      <div className="px-1">
        <div className="overflow-hidden rounded-lg bg-white p-1.5">
          <img
            src={`${import.meta.env.BASE_URL}ipi-logo.jpg`}
            alt="IPI"
            className="block h-auto w-full rounded object-contain"
          />
        </div>
        <div className="mt-1.5 text-center text-[10px] tracking-wide text-white/45">Transaction Platform</div>
      </div>
      <div className="flex flex-col gap-1">
        <button type="button" onClick={() => onTabChange('dashboard')} className={navItemClass(tab === 'dashboard')}>
          Dashboard
        </button>
        <button type="button" onClick={() => onTabChange('transaction')} className={navItemClass(tab === 'transaction')}>
          Transaction
        </button>
        <button type="button" onClick={() => onTabChange('leads')} className={navItemClass(tab === 'leads')}>
          Leads
        </button>
      </div>
    </div>
  )
}

function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [openAssessment, setOpenAssessment] = useState<Assessment | null>(null)
  const [openLead, setOpenLead] = useState<Lead | null>(null)

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
      <div className="flex-1 bg-ipi-50 p-6">
        <div className="mx-auto max-w-5xl">
          {openAssessment && openAssessment.status === 'in_progress' && (
            <AssessmentWizard assessment={openAssessment} onDone={setOpenAssessment} />
          )}
          {openAssessment && openAssessment.status !== 'in_progress' && (
            <CommercialLayer assessment={openAssessment} onBack={() => setOpenAssessment(null)} />
          )}
          {!openAssessment && !openLead && tab === 'dashboard' && <Dashboard />}
          {!openAssessment && !openLead && tab === 'transaction' && <AssessmentsList onOpen={setOpenAssessment} />}
          {!openAssessment && !openLead && tab === 'leads' && <LeadsList onOpen={setOpenLead} />}
          {openLead && <LeadDetail lead={openLead} onBack={() => setOpenLead(null)} />}
        </div>
      </div>
    </div>
  )
}

export default App
