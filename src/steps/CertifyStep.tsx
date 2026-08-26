import { calculateCertify } from '../calc/certify'
import type { CustomerType } from '../calc/types'
import { Card, PrimaryButton, SecondaryButton, SectionLabel } from '../components/ui'

const PATH_LABEL: Record<string, string> = {
  maintain_recurring_sow: 'Maintain / recurring SOW',
  establish_sow: 'Establish SOW',
  project_feasibility_stop: 'Project feasibility → stop',
}

export function CertifyStep({
  customerType,
  onCertify,
  onBack,
}: {
  customerType: CustomerType
  onCertify: () => void
  onBack: () => void
}) {
  const result = calculateCertify(customerType)
  const isStop = result.path === 'project_feasibility_stop'

  return (
    <div>
      <SectionLabel>Establish scope of work and define next action</SectionLabel>
      <Card className={`mb-5 ${isStop ? 'border-hairline bg-ipi-50' : 'border-ipi-900 bg-ipi-100'}`}>
        <div className="text-sm font-medium text-ipi-900">{PATH_LABEL[result.path]}</div>
        <div className="mt-2 text-sm text-ipi-800">{result.nextAction}</div>
      </Card>

      <Card className="mb-5">
        <div className="text-sm font-medium text-ink">Certified opportunity</div>
        <div className="mt-1 text-xs text-ipi-700/70">
          Outcome established with clear path and next action.
        </div>
      </Card>

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onCertify}>
          {isStop ? 'Stop transaction' : 'Certify opportunity'}
        </PrimaryButton>
      </div>
    </div>
  )
}
