import { useState } from 'react'
import { PageHeader, PrimaryButton, SecondaryButton, SectionLabel, TextField } from './components/ui'
import type { Lead, LeadCustomerType, LeadHealth, LeadRating } from './domain/lead'
import { LEAD_ACTION_LABEL } from './LeadsList'
import { leadStore } from './store'

const CUSTOMER_TYPE_OPTIONS: LeadCustomerType[] = ['non_existing', 'existing', 'new_build']
const CUSTOMER_TYPE_LABEL: Record<LeadCustomerType, string> = {
  non_existing: 'Non-existing',
  existing: 'Existing IPI',
  new_build: 'New build',
}

/** Still consumed by Dashboard.tsx for the table's Ability/Maintenance/Health dot columns, even though there's no editor for them here anymore. */
export const RATING_DOT: Record<LeadRating, string> = {
  green: 'bg-mint-600',
  yellow: 'bg-amber-600',
  red: 'bg-risk-600',
}
export const HEALTH_LABEL: Record<LeadHealth, string> = {
  on_track: 'On track',
  needs_attention: 'Needs attention',
  stuck: 'Stuck',
}
export const HEALTH_DOT: Record<LeadHealth, string> = {
  on_track: 'bg-mint-600',
  needs_attention: 'bg-amber-600',
  stuck: 'bg-risk-600',
}

/** Edit a lead's basic details locally, then commit them all at once with Save. */
export function LeadDetail({ lead: initialLead, onBack }: { lead: Lead; onBack: () => void }) {
  const [lead, setLead] = useState(initialLead)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  function update(next: Lead) {
    setLead(next)
    setJustSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    await leadStore.save(lead)
    setSaving(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Component 1 — Frozen Backend"
        title={lead.courseName || 'Untitled lead'}
        actions={
          <>
            {justSaved && <span className="text-xs font-medium text-mint-600">Saved</span>}
            <PrimaryButton onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </PrimaryButton>
            <SecondaryButton onClick={onBack}>← Back to Leads</SecondaryButton>
          </>
        }
      />

      <SectionLabel>Lead details</SectionLabel>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <TextField
          label="Golf course / account name"
          value={lead.courseName}
          onChange={(v) => update({ ...lead, courseName: v })}
        />
        <TextField
          label="Contact name"
          value={lead.contactName}
          onChange={(v) => update({ ...lead, contactName: v })}
        />
        <TextField label="Phone" value={lead.phone} onChange={(v) => update({ ...lead, phone: v })} />
        <TextField label="Email" value={lead.email} onChange={(v) => update({ ...lead, email: v })} />
        <TextField
          label="Source"
          value={lead.source}
          onChange={(v) => update({ ...lead, source: v })}
          placeholder="Referral, cold call, event…"
        />
      </div>

      <SectionLabel>Customer type</SectionLabel>
      <div className="mb-5 flex flex-wrap gap-2">
        {CUSTOMER_TYPE_OPTIONS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => update({ ...lead, customerType: c, action: c === 'existing' ? 'quantify' : 'qualify' })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              lead.customerType === c
                ? 'bg-ipi-900 text-white'
                : 'border border-hairline text-ipi-700/70 hover:border-ipi-600'
            }`}
          >
            {CUSTOMER_TYPE_LABEL[c]}
          </button>
        ))}
      </div>

      <SectionLabel>Pipeline stage</SectionLabel>
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-full bg-ipi-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ipi-900">
          {LEAD_ACTION_LABEL[lead.action]}
        </span>
        {lead.action === 'qualify' && (
          <button
            type="button"
            onClick={() => update({ ...lead, action: 'quantify' })}
            className="rounded-full border border-ipi-600 px-3 py-1.5 text-xs font-medium text-ipi-800 transition-colors hover:bg-ipi-50"
          >
            Move to Quantify →
          </button>
        )}
      </div>

      <SectionLabel>Requirement &amp; competition</SectionLabel>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <TextField
          label="Requirement"
          value={lead.requirement}
          onChange={(v) => update({ ...lead, requirement: v })}
          placeholder="Toro, Elite/Yamaha…"
        />
        <TextField
          label="Competition"
          value={lead.competition}
          onChange={(v) => update({ ...lead, competition: v })}
          placeholder="Competitor installed, or an offer already made…"
        />
      </div>

      <SectionLabel>Opportunity</SectionLabel>
      <div className="mb-5 flex flex-wrap gap-4">
        {(
          [
            ['equipment', 'Equipment'],
            ['training', 'Training'],
            ['amc', 'AMC'],
            ['irrigation', 'Irrigation'],
            ['golfCart', 'Golf Cart'],
            ['other', 'Other'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={lead.opportunity[key]}
              onChange={(e) => update({ ...lead, opportunity: { ...lead.opportunity, [key]: e.target.checked } })}
              className="h-4 w-4 accent-[var(--color-ipi-600)]"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3">
        {justSaved && <span className="text-xs font-medium text-mint-600">Saved</span>}
        <SecondaryButton onClick={onBack}>← Back to Leads</SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </PrimaryButton>
      </div>
    </div>
  )
}
