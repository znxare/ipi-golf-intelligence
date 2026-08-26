import { useState } from 'react'
import { CommercialView } from '../CommercialView'
import { PrimaryButton, SecondaryButton, SectionLabel, TabButton } from '../components/ui'
import type { Assessment, NegotiationLine } from '../domain/assessment'
import { NegotiationTable } from '../NegotiationTable'

type Sheet = 'commercial-view' | 'negotiation'

/**
 * Verify = the Commercial View (pre-negotiation intelligence, read-only) and
 * Customer Negotiation (the working table) that used to only be reachable
 * after Certify. Negotiation now happens here, ahead of Certify — matching
 * the front-facing commercial layer: Commercial View → Negotiation →
 * remaining gap → Certify.
 */
export function VerifyStep({
  assessment,
  onNegotiationChange,
  onNext,
  onBack,
}: {
  assessment: Assessment
  onNegotiationChange: (negotiation: Record<string, NegotiationLine>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [sheet, setSheet] = useState<Sheet>('commercial-view')

  return (
    <div>
      <SectionLabel>Pre-negotiation intelligence, then customer negotiation</SectionLabel>

      <div className="mb-5 flex gap-1 rounded-lg border border-hairline bg-ipi-50 p-1">
        <TabButton active={sheet === 'commercial-view'} onClick={() => setSheet('commercial-view')}>
          Commercial View
        </TabButton>
        <TabButton active={sheet === 'negotiation'} onClick={() => setSheet('negotiation')}>
          Customer Negotiation
        </TabButton>
      </div>

      {sheet === 'commercial-view' && <CommercialView assessment={assessment} />}
      {sheet === 'negotiation' && <NegotiationTable assessment={assessment} onChange={onNegotiationChange} />}

      <div className="mt-5 flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Certify →</PrimaryButton>
      </div>
    </div>
  )
}
