import { useEffect, useState } from 'react'
import { calculateCertify } from './calc/certify'
import { calculateQualify } from './calc/qualify'
import { calculateQuantify } from './calc/quantify'
import { calculateVerify } from './calc/verify'
import { Badge, PageHeader, StepProgress } from './components/ui'
import {
  createDefaultQuantifyInput,
  createDefaultVerifyInput,
  type Assessment,
} from './domain/assessment'
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
          input={assessment.quantifyInput}
          onChange={(quantifyInput) => setAssessment({ ...assessment, quantifyInput })}
          onBack={() => setAssessment({ ...assessment, step: 'qualify' })}
          onNext={() => {
            const quantifyResult = calculateQuantify(assessment.quantifyInput!)
            const defaultVerify = createDefaultVerifyInput()
            setAssessment({
              ...assessment,
              quantifyResult,
              step: 'verify',
              verifyInput:
                assessment.verifyInput ?? {
                  ...defaultVerify,
                  footfallPerDay: assessment.quantifyInput!.actualPlayersPerDay,
                  breakEvenPlayersPerDay: quantifyResult.breakEvenPlayersPerDay,
                },
            })
          }}
        />
      )}

      {assessment.step === 'verify' && assessment.verifyInput && assessment.quantifyResult && (
        <VerifyStep
          input={assessment.verifyInput}
          quantifyResult={assessment.quantifyResult}
          onChange={(verifyInput) => setAssessment({ ...assessment, verifyInput })}
          onBack={() => setAssessment({ ...assessment, step: 'quantify' })}
          onNext={() => {
            const verifyResult = calculateVerify(assessment.verifyInput!)
            setAssessment({ ...assessment, verifyResult, step: 'certify' })
          }}
        />
      )}

      {assessment.step === 'certify' && (
        <CertifyStep
          customerType={assessment.qualifyInput.customerType}
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
