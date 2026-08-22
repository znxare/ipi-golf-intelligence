import { useState } from 'react'
import { AssessmentsList } from './AssessmentsList'
import { AssessmentWizard } from './AssessmentWizard'
import { CommercialLayer } from './CommercialLayer'
import type { Assessment } from './domain/assessment'

function Sidebar() {
  return (
    <div className="flex w-48 flex-col gap-4 bg-ipi-900 px-3 py-4">
      <div className="px-1">
        <div className="overflow-hidden rounded-lg bg-white p-1.5">
          <img src="/ipi-logo.jpg" alt="IPI" className="block h-auto w-full rounded object-contain" />
        </div>
        <div className="mt-1.5 text-center text-[10px] tracking-wide text-white/45">Transaction Platform</div>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-white/15 px-2.5 py-2 text-sm text-white">
        Transaction
      </div>
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
