import { useEffect, useState } from 'react'
import { PageHeader, PrimaryButton } from './components/ui'
import { createLead, type Lead, type LeadAction, type LeadCustomerType } from './domain/lead'
import { leadStore } from './store/leadStore'

export const LEAD_CUSTOMER_TYPE_CODE: Record<LeadCustomerType, string> = {
  non_existing: 'NC',
  existing: 'EC',
  new_build: 'NB',
}

export const LEAD_CUSTOMER_TYPE_DOT: Record<LeadCustomerType, string> = {
  non_existing: 'bg-ipi-600',
  existing: 'bg-mint-600',
  new_build: 'bg-amber-600',
}

export const LEAD_ACTION_LABEL: Record<LeadAction, string> = {
  qualify: 'Qualify',
  quantify: 'Quantify',
  verify: 'Verify',
  certify: 'Certify',
}

function opportunityTags(lead: Lead): string {
  const tags: string[] = []
  if (lead.opportunity.equipment) tags.push('EQ')
  if (lead.opportunity.training) tags.push('TR')
  if (lead.opportunity.amc) tags.push('AMC')
  return tags.length > 0 ? tags.join(' • ') : '—'
}

/**
 * "Leads" tab — quick-add a lead, then see every lead in a compact table
 * (#, Customer type, Lead, Requirement, Competition, Opportunity, Action),
 * matching the sales team's lead-tracking sheet. Click a row to open
 * LeadDetail for the full record and its own editable timeline.
 */
export function LeadsList({ onOpen }: { onOpen: (lead: Lead) => void }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [newCourseName, setNewCourseName] = useState('')

  useEffect(() => {
    leadStore.list().then(setLeads)
  }, [])

  function handleCreate() {
    const name = newCourseName.trim()
    if (!name) return
    const lead = createLead(name)
    leadStore.save(lead).then(() => {
      setNewCourseName('')
      onOpen(lead)
    })
  }

  return (
    <div>
      <PageHeader eyebrow="Component 1 — Frozen Backend" title="Leads" />

      <div className="mb-5 flex gap-2">
        <input
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Golf course / account name"
          className="flex-1 rounded-lg border border-hairline bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ipi-600"
        />
        <PrimaryButton onClick={handleCreate}>New lead</PrimaryButton>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-hairline p-10 text-center">
          <div className="text-sm font-medium text-ink">No leads yet</div>
          <div className="mt-1 text-sm text-ipi-700/60">Add a golf course above to start tracking it.</div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-ipi-50/60 text-left text-xs text-ipi-700/60">
                  <th className="w-10 px-4 py-2 font-medium">#</th>
                  <th className="w-14 px-4 py-2 font-medium">C</th>
                  <th className="px-4 py-2 font-medium">Lead</th>
                  <th className="px-4 py-2 font-medium">Req.</th>
                  <th className="px-4 py-2 font-medium">Comp.</th>
                  <th className="px-4 py-2 font-medium">Opportunity</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    onClick={() => onOpen(lead)}
                    className="cursor-pointer border-t border-hairline transition-colors hover:bg-ipi-50/60"
                  >
                    <td className="px-4 py-2.5 text-ipi-700/60">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-2 w-2 flex-none rounded-full ${LEAD_CUSTOMER_TYPE_DOT[lead.customerType]}`} />
                        {LEAD_CUSTOMER_TYPE_CODE[lead.customerType]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-ink">{lead.courseName}</td>
                    <td className="px-4 py-2.5 text-ipi-700/70">{lead.requirement || '—'}</td>
                    <td className="px-4 py-2.5 text-ipi-700/70">{lead.competition || '—'}</td>
                    <td className="font-data px-4 py-2.5 tabular-nums text-ipi-700/70">{opportunityTags(lead)}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ipi-900">
                      {LEAD_ACTION_LABEL[lead.action]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
