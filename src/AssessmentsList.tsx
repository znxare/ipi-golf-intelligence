import { useEffect, useState } from 'react'
import { Badge, Card, PageHeader, PrimaryButton } from './components/ui'
import { createAssessment, type Assessment } from './domain/assessment'
import { formatRupeesCompact } from './format'
import { assessmentStore } from './store/assessmentStore'

const STATUS_LABEL: Record<Assessment['status'], string> = {
  in_progress: 'In progress',
  certified: 'Certified',
  stopped: 'Stopped',
}

const STATUS_VARIANT: Record<Assessment['status'], 'neutral' | 'positive' | 'muted'> = {
  in_progress: 'neutral',
  certified: 'positive',
  stopped: 'muted',
}

const CUSTOMER_TYPE_LABEL: Record<string, string> = {
  existing: 'Existing IPI',
  non_existing: 'Non-existing',
  new_build: 'New build',
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
      <PageHeader eyebrow="Component 1 — Frozen Backend" title="Transaction matrix" />

      <div className="mb-5 flex gap-2">
        <input
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Golf course / account name"
          className="flex-1 rounded-lg border border-hairline bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ipi-600"
        />
        <PrimaryButton onClick={handleCreate}>New assessment</PrimaryButton>
      </div>

      {assessments.length === 0 && (
        <div className="rounded-xl border border-dashed border-hairline p-10 text-center">
          <div className="text-sm font-medium text-ink">No assessments yet</div>
          <div className="mt-1 text-sm text-ipi-700/60">
            Add a golf course above to start the Qualify → Certify wizard.
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {assessments.map((a) => (
          <button key={a.id} type="button" onClick={() => onOpen(a)} className="text-left">
            <Card className="flex items-center justify-between transition-colors hover:border-ipi-600">
              <div>
                <div className="text-sm font-medium text-ink">{a.accountName}</div>
                <div className="mt-0.5 text-xs text-ipi-700/60">
                  {CUSTOMER_TYPE_LABEL[a.qualifyInput.customerType] ?? a.qualifyInput.customerType} ·{' '}
                  {new Date(a.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {a.quantifyResult && (
                  <div className="font-data text-sm font-medium tabular-nums text-ipi-900">
                    {formatRupeesCompact(a.quantifyResult.totalIpiOpportunity)}
                  </div>
                )}
                <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABEL[a.status]}</Badge>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
