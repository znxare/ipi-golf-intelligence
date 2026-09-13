import { useState } from 'react'
import { Card, Field, PageHeader, PrimaryButton, SecondaryButton, SectionLabel, TextField } from './components/ui'
import type { Lead, LeadAction, LeadCategory, LeadCustomerType, LeadHealth, LeadRating } from './domain/lead'
import { LEAD_ACTION_LABEL } from './LeadsList'
import { leadStore } from './store'

const CUSTOMER_TYPE_OPTIONS: LeadCustomerType[] = ['non_existing', 'existing', 'new_build']
const CUSTOMER_TYPE_LABEL: Record<LeadCustomerType, string> = {
  non_existing: 'Non-existing',
  existing: 'Existing IPI',
  new_build: 'New build',
}
const ACTION_OPTIONS: LeadAction[] = ['qualify', 'quantify', 'verify', 'certify']

const CATEGORY_OPTIONS: LeadCategory[] = ['growth', 'operational', 'developing']
export const CATEGORY_LABEL: Record<LeadCategory, string> = {
  growth: 'Growth',
  operational: 'Operational',
  developing: 'Developing',
}
export const CATEGORY_DOT: Record<LeadCategory, string> = {
  growth: 'bg-ipi-700',
  operational: 'bg-mint-600',
  developing: 'bg-ipi-700/30',
}

const RATING_OPTIONS: LeadRating[] = ['green', 'yellow', 'red']
export const RATING_LABEL: Record<LeadRating, string> = { green: 'Good', yellow: 'Watch', red: 'At risk' }
export const RATING_DOT: Record<LeadRating, string> = {
  green: 'bg-mint-600',
  yellow: 'bg-amber-600',
  red: 'bg-risk-600',
}

const HEALTH_OPTIONS: LeadHealth[] = ['on_track', 'needs_attention', 'stuck']
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

function RatingPicker<T extends string>({
  options,
  value,
  dot,
  label,
  onChange,
}: {
  options: T[]
  value: T
  dot: Record<T, string>
  label: Record<T, string>
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt ? 'bg-ipi-900 text-white' : 'border border-hairline text-ipi-700/70 hover:border-ipi-600'
          }`}
        >
          <span className={`h-2 w-2 flex-none rounded-full ${dot[opt]}`} />
          {label[opt]}
        </button>
      ))}
    </div>
  )
}

/** Edit a lead's pipeline details locally, then commit them all at once with Save. */
export function LeadDetail({ lead: initialLead, onBack }: { lead: Lead; onBack: () => void }) {
  const [lead, setLead] = useState(initialLead)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  function update(next: Lead) {
    setLead(next)
    setJustSaved(false)
  }

  function handleActionChange(action: LeadAction) {
    update({ ...lead, action })
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
            onClick={() => update({ ...lead, customerType: c })}
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

      <SectionLabel>Pipeline scoring — feeds the Dashboard</SectionLabel>
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Customer category</div>
          <RatingPicker
            options={CATEGORY_OPTIONS}
            value={lead.category}
            dot={CATEGORY_DOT}
            label={CATEGORY_LABEL}
            onChange={(category) => update({ ...lead, category })}
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Deal health</div>
          <RatingPicker
            options={HEALTH_OPTIONS}
            value={lead.health}
            dot={HEALTH_DOT}
            label={HEALTH_LABEL}
            onChange={(health) => update({ ...lead, health })}
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Ability to pay</div>
          <RatingPicker
            options={RATING_OPTIONS}
            value={lead.abilityToPay}
            dot={RATING_DOT}
            label={RATING_LABEL}
            onChange={(abilityToPay) => update({ ...lead, abilityToPay })}
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Commitment to maintain</div>
          <RatingPicker
            options={RATING_OPTIONS}
            value={lead.maintenanceCommitment}
            dot={RATING_DOT}
            label={RATING_LABEL}
            onChange={(maintenanceCommitment) => update({ ...lead, maintenanceCommitment })}
          />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Field
          label="Potential opportunity (₹)"
          value={lead.potentialValue}
          onChange={(v) => update({ ...lead, potentialValue: Number.isNaN(v) ? 0 : v })}
        />
        <Field
          label="Actual opportunity (₹)"
          value={lead.actualValue}
          onChange={(v) => update({ ...lead, actualValue: Number.isNaN(v) ? 0 : v })}
        />
        <TextField label="Deal owner" value={lead.owner} onChange={(v) => update({ ...lead, owner: v })} />
        <label className="block">
          <span className="mb-1 block text-xs text-ipi-700/70">Target date</span>
          <span className="flex items-center rounded-lg border border-hairline bg-white px-2 py-1.5 transition-colors focus-within:border-ipi-600">
            <input
              type="date"
              value={lead.targetDate}
              onChange={(e) => update({ ...lead, targetDate: e.target.value })}
              className="w-full bg-transparent text-sm outline-none"
            />
          </span>
        </label>
        <div className="col-span-2">
          <TextField
            label="Next action"
            value={lead.nextAction}
            onChange={(v) => update({ ...lead, nextAction: v })}
            placeholder="Draft SoW, Funding structure, Customer meeting…"
          />
        </div>
      </div>

      <SectionLabel>Action</SectionLabel>
      <div className="mb-5 flex flex-wrap gap-2">
        {ACTION_OPTIONS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => handleActionChange(a)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              lead.action === a
                ? 'bg-ipi-900 text-white'
                : 'border border-hairline text-ipi-700/70 hover:border-ipi-600'
            }`}
          >
            {LEAD_ACTION_LABEL[a]}
          </button>
        ))}
      </div>

      <SectionLabel>Notes</SectionLabel>
      <Card className="mb-5">
        <textarea
          value={lead.notes}
          onChange={(e) => update({ ...lead, notes: e.target.value })}
          placeholder="General notes about this lead…"
          rows={3}
          className="w-full resize-none text-sm outline-none placeholder:text-ipi-700/30"
        />
      </Card>

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
