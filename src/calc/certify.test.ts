import { describe, expect, it } from 'vitest'
import { calculateCertify } from './certify'

describe('calculateCertify', () => {
  it('routes an existing customer to Maintain / Recurring SOW', () => {
    expect(calculateCertify('existing').path).toBe('maintain_recurring_sow')
  })

  it('routes a non-existing customer to Establish SOW', () => {
    expect(calculateCertify('non_existing').path).toBe('establish_sow')
  })

  it('routes a new build to Project Feasibility → Stop', () => {
    expect(calculateCertify('new_build').path).toBe('project_feasibility_stop')
  })
})
