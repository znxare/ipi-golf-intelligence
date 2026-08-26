import { useEffect, useState } from 'react'
import { calculateCertify } from './calc/certify'
import { calculateQualify } from './calc/qualify'
import { calculateQuantify } from './calc/quantify'
import { Badge, PageHeader, StepProgress } from './components/ui'
import { createDefaultQuantifyInput, type Assessment } from './domain/assessment'
import { assessmentStore } from './store/assessmentStore'
import { CertifyStep } from './steps/CertifyStep'
import { QualifyStep } from './steps/QualifyStep'
import { QuantifyStep } from './steps/QuantifyStep'
import { VerifyStep } from './steps/VerifyStep'

const STEPS = [
  { key: 'qualify', label: 'Qualify', index: 1 },
  { key: 'quantify', label: 'Quantify', index: 2 },
  { key: 'verify', label: 'Verify', index: 3 },
  { key: 'certify', label: 'Certify', index: 4 },
]

export function AssessmentWizard({
  assessment: initial,
  onDone,
}: {
  assessment: Assessment
  onDone: (assessment: Assessment) => void
}) {
  const [assessment, setAssessment] = useState<Assessment>(initial)

  useEffect(() => {
    assessmentStore.save(assessment)
  }, [assessment])

  const isNewBuild = assessment.qualifyInput.customerType === 'new_build'

  return (
    <div>
      <PageHeader
        eyebrow="Component 1 — Frozen Backend"
        title={assessment.accountName}
        actions={<Badge>Step {STEPS.find((s) => s.key === assessment.step)?.index} of 4</Badge>}
      />

      <StepProgress steps={STEPS} currentStep={assessment.step} />

      {assessment.step === 'qualify' && (
        <QualifyStep
          input={assessment.qualifyInput}
          onChange={(qualifyInput) => setAssessment({ ...assessment, qualifyInput })}
          onNext={() => {
            const qualifyResult = calculateQualify(assessment.qualifyInput)
            setAssessment({
              ...assessment,
              qualifyResult,
              step: isNewBuild ? 'certify' : 'quantify',
              quantifyInput: assessment.quantifyInput ?? createDefaultQuantifyInput(),
            })
          }}
        />
      )}

      {assessment.step === 'quantify' && assessment.quantifyInput && (
        <QuantifyStep
          qualifyInput={assessment.qualifyInput}
          input={assessment.quantifyInput}
          onChange={(quantifyInput) => setAssessment({ ...assessment, quantifyInput })}
          onBack={() => setAssessment({ ...assessment, step: 'qualify' })}
          onNext={() => {
            const quantifyResult = calculateQuantify(assessment.qualifyInput, assessment.quantifyInput!)
            setAssessment({ ...assessment, quantifyResult, step: 'verify' })
          }}
        />
      )}

      {assessment.step === 'verify' && assessment.quantifyResult && assessment.quantifyInput && (
        <VerifyStep
          qualifyInput={assessment.qualifyInput}
          quantifyInput={assessment.quantifyInput}
          onBack={() => setAssessment({ ...assessment, step: 'quantify' })}
          onNext={() => setAssessment({ ...assessment, step: 'certify' })}
        />
      )}

      {assessment.step === 'certify' && (
        <CertifyStep
          customerType={assessment.qualifyInput.customerType}
          avgGreenFee={assessment.qualifyInput.pricePerRound}
          expensesPerDay={assessment.qualifyInput.expensesPerDay}
          onBack={() =>
            setAssessment({ ...assessment, step: isNewBuild ? 'qualify' : 'verify' })
          }
          onCertify={() => {
            const certifyResult = calculateCertify(assessment.qualifyInput.customerType)
            const finished: Assessment = {
              ...assessment,
              certifyResult,
              status: certifyResult.path === 'project_feasibility_stop' ? 'stopped' : 'certified',
            }
            setAssessment(finished)
            assessmentStore.save(finished).then(() => onDone(finished))
          }}
        />
      )}
    </div>
  )
}
