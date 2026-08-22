import type { CertifyResult, CustomerType } from './types'

export function calculateCertify(customerType: CustomerType): CertifyResult {
  switch (customerType) {
    case 'existing':
      return {
        path: 'maintain_recurring_sow',
        nextAction: 'Review, renew and 100% of SOW.',
      }
    case 'non_existing':
      return {
        path: 'establish_sow',
        nextAction:
          'Define Scope of Work, prepare solution and commercial proposal.',
      }
    case 'new_build':
      return {
        path: 'project_feasibility_stop',
        nextAction:
          'Feasibility study first. If not viable, STOP the transaction.',
      }
  }
}
