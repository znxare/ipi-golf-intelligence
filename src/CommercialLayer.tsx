import { useEffect, useState } from 'react'
import { CommercialView } from './CommercialView'
import { SecondaryButton, TabButton } from './components/ui'
import type { Assessment, NegotiationLine } from './domain/assessment'
import { NegotiationTable } from './NegotiationTable'
import { assessmentStore } from './store/assessmentStore'

type Sheet = 'commercial-view' | 'negotiation'

/**
 * Component 2 — Commercial Layer. Reads the frozen Customer Input Card,
 * never writes to it. Kept as its own component (not merged into the
 * wizard) — Commercial View stays read-only, Negotiation is the only
 * editable sheet.
 */
export function CommercialLayer({
  assessment: initial,
  onBack,
}: {
  assessment: Assessment
  onBack: () => void
}) {
  const [assessment, setAssessment] = useState<Assessment>(initial)
  const [sheet, setSheet] = useState<Sheet>('commercial-view')

  useEffect(() => {
    assessmentStore.save(assessment)
  }, [assessment])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-ink">{assessment.accountName}</div>
          <div className="text-xs text-ipi-700/60">Commercial Layer</div>
        </div>
        <SecondaryButton onClick={onBack}>← Back to list</SecondaryButton>
      </div>

      <div className="mb-5 flex gap-1 rounded-lg bg-ipi-50 p-1">
        <TabButton active={sheet === 'commercial-view'} onClick={() => setSheet('commercial-view')}>
          Sheet 1 — Commercial View
        </TabButton>
        <TabButton active={sheet === 'negotiation'} onClick={() => setSheet('negotiation')}>
          Sheet 2 — Customer Negotiation
        </TabButton>
      </div>

      {sheet === 'commercial-view' && <CommercialView assessment={assessment} />}

      {sheet === 'negotiation' && (
        <NegotiationTable
          assessment={assessment}
          onChange={(negotiation: Record<string, NegotiationLine>) =>
            setAssessment({ ...assessment, negotiation })
          }
        />
      )}
    </div>
  )
}
