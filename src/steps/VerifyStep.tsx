import { calculateQuantify } from '../calc/quantify'
import type { QualifyInput, QuantifyInput } from '../calc/types'
import { PrimaryButton, SecondaryButton, SectionLabel } from '../components/ui'
import { CustomerAssumptionCard } from '../CustomerAssumptionCard'
import { IpiOpportunityBreakdown } from '../IpiOpportunityBreakdown'

export function VerifyStep({
  qualifyInput,
  quantifyInput,
  onNext,
  onBack,
}: {
  qualifyInput: QualifyInput
  quantifyInput: QuantifyInput
  onNext: () => void
  onBack: () => void
}) {
  const quantifyResult = calculateQuantify(quantifyInput)

  return (
    <div>
      <SectionLabel>Customer Assumption Card — results generated from customer inputs</SectionLabel>
      <div className="mb-5">
        <CustomerAssumptionCard qualifyInput={qualifyInput} quantifyInput={quantifyInput} />
      </div>

      <IpiOpportunityBreakdown breakdown={quantifyInput.breakdown} total={quantifyResult.totalIpiOpportunity} />

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Certify →</PrimaryButton>
      </div>
    </div>
  )
}
