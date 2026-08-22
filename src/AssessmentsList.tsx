import { useEffect, useState } from 'react'
import { Card, PrimaryButton } from './components/ui'
import { createAssessment, type Assessment } from './domain/assessment'
import { formatRupeesCompact } from './format'
import { assessmentStore } from './store/assessmentStore'

const STATUS_LABEL: Record<Assessment['status'], string> = {
  in_progress: 'In progress',
  certified: 'Certified',
  stopped: 'Stopped',
}

const STATUS_CLASS: Record<Assessment['status'], string> = {
  in_progress: 'bg-ipi-50 text-ipi-700/70',
  certified: 'bg-ipi-100 text-ipi-900',
  stopped: 'bg-ipi-50 text-ipi-700/50',
}

export function AssessmentsList({ onOpen }: { onOpen: (assessment: Assessment) => void }) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [newAccountName, setNewAccountName] = useState('')

  useEffect(() => {
    assessmentStore.list().then(setAssessments)
  }, [])

  function handleCreate() {
    const name = newAccountName.trim()
    if (!name) return
    const assessment = createAssessment(name)
    assessmentStore.save(assessment).then(() => onOpen(assessment))
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Golf course / account name"
          className="flex-1 rounded-lg border border-ipi-100 bg-white px-3 py-2 text-sm outline-none"
        />
        <PrimaryButton onClick={handleCreate}>New assessment</PrimaryButton>
      </div>

      {assessments.length === 0 && (
        <div className="rounded-xl border border-dashed border-ipi-100 p-8 text-center text-sm text-ipi-700/60">
          No assessments yet. Add a golf course above to start the Qualify → Certify wizard.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {assessments.map((a) => (
          <button key={a.id} type="button" onClick={() => onOpen(a)} className="text-left">
            <Card className="flex items-center justify-between hover:border-ipi-700">
              <div>
                <div className="text-sm font-medium text-ink">{a.accountName}</div>
                <div className="mt-0.5 text-xs text-ipi-700/60">
                  {a.qualifyInput.customerType.replace('_', '-')} · {new Date(a.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {a.quantifyResult && (
                  <div className="text-sm font-medium text-ipi-900">
                    {formatRupeesCompact(a.quantifyResult.totalIpiOpportunity)}
                  </div>
                )}
                <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_CLASS[a.status]}`}>
                  {STATUS_LABEL[a.status]}
                </span>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
