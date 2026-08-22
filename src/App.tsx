import { useState } from 'react'
import { AssessmentsList } from './AssessmentsList'
import { AssessmentWizard } from './AssessmentWizard'
import { CommercialLayer } from './CommercialLayer'
import type { Assessment } from './domain/assessment'

function Sidebar() {
  return (
    <div className="flex w-48 flex-col gap-4 bg-ipi-900 px-3 py-4">
      <div className="flex items-center gap-2 px-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ipi-600 font-data text-xs font-semibold text-white">
          IPI
        </div>
        <div>
          <div className="text-sm font-medium leading-tight text-white">Golf Intelligence</div>
          <div className="text-[10px] leading-tight text-white/45">Transaction Platform</div>
        </div>
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
