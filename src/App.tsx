import { useState } from 'react'
import { AssessmentsList } from './AssessmentsList'
import { AssessmentWizard } from './AssessmentWizard'
import { CommercialLayer } from './CommercialLayer'
import type { Assessment } from './domain/assessment'

const NAV_ITEMS = [
  { label: 'Transaction matrix', active: true },
  { label: 'Pipeline', active: false },
  { label: 'Accounts', active: false },
  { label: 'Settings', active: false },
]

function Sidebar() {
  return (
    <div className="flex w-44 flex-col gap-1 bg-ipi-900 px-3 py-4">
      <div className="mb-3 px-1.5 text-sm font-medium text-white">IPI golf intelligence</div>
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
            item.active ? 'bg-white/15 text-white' : 'text-white/65'
          }`}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}

function App() {
  const [openAssessment, setOpenAssessment] = useState<Assessment | null>(null)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-ipi-50 p-6">
        <div className="mx-auto max-w-5xl">
          {openAssessment && openAssessment.status === 'in_progress' && (
            <AssessmentWizard assessment={openAssessment} onDone={setOpenAssessment} />
          )}
          {openAssessment && openAssessment.status !== 'in_progress' && (
            <CommercialLayer assessment={openAssessment} onBack={() => setOpenAssessment(null)} />
          )}
          {!openAssessment && <AssessmentsList onOpen={setOpenAssessment} />}
        </div>
      </div>
    </div>
  )
}

export default App
