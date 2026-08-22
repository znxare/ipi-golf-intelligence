import type { EquipmentAuditItem, EquipmentCondition } from '../calc/types'
import { formatNumber } from '../format'

const CONDITION_OPTIONS: { value: EquipmentCondition; label: string }[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]

const CONDITION_BADGE: Record<EquipmentCondition, string> = {
  excellent: 'bg-mint-100 text-mint-600',
  good: 'bg-ipi-100 text-ipi-800',
  fair: 'bg-amber-100 text-amber-600',
  poor: 'bg-risk-100 text-risk-600',
}

function emptyItem(): EquipmentAuditItem {
  return { id: crypto.randomUUID(), name: '', quantity: 1, condition: 'good' }
}

export function EquipmentAudit({
  items,
  onChange,
}: {
  items: EquipmentAuditItem[]
  onChange: (items: EquipmentAuditItem[]) => void
}) {
  const totalFleet = items.reduce((sum, i) => sum + (Number.isFinite(i.quantity) ? i.quantity : 0), 0)

  function updateItem(id: string, patch: Partial<EquipmentAuditItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  function removeItem(id: string) {
    onChange(items.filter((i) => i.id !== id))
  }

  function addItem() {
    onChange([...items, emptyItem()])
  }

  return (
    <div className="mb-5 rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
      <div className="flex items-center justify-between border-b border-hairline bg-ipi-50/60 px-4 py-3">
        <div>
          <div className="text-sm font-medium text-ink">Existing Equipment Fleet</div>
          <div className="mt-0.5 text-xs text-ipi-700/60">
            What the course already runs — asked because this customer isn't an IPI account yet
          </div>
        </div>
        <div className="text-right">
          <div className="font-data text-lg font-semibold tabular-nums text-ipi-900">
            {formatNumber(totalFleet)}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-ipi-700/50">Total Fleet</div>
        </div>
      </div>

      <div className="px-4 py-4">
        {items.length === 0 && (
          <div className="mb-3 rounded-lg border border-dashed border-hairline px-3 py-4 text-center text-xs text-ipi-700/50">
            No equipment logged yet.
          </div>
        )}

        {items.length > 0 && (
          <div className="mb-3 flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-lg border border-hairline p-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  placeholder="e.g. John Deere 2500B Greens Mower"
                  className="min-w-0 flex-1 rounded-md border border-hairline px-2 py-1.5 text-sm outline-none transition-colors focus:border-ipi-600"
                />
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: Math.max(1, e.target.valueAsNumber || 1) })}
                  className="font-data w-16 rounded-md border border-hairline px-2 py-1.5 text-right text-sm tabular-nums outline-none transition-colors focus:border-ipi-600"
                />
                <select
                  value={item.condition}
                  onChange={(e) => updateItem(item.id, { condition: e.target.value as EquipmentCondition })}
                  className={`rounded-md border-0 px-2 py-1.5 text-xs font-medium outline-none ${CONDITION_BADGE[item.condition]}`}
                >
                  {CONDITION_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name || 'equipment'}`}
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-risk-600 transition-colors hover:bg-risk-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-dashed border-hairline px-3 py-2 text-xs font-medium text-ipi-700 transition-colors hover:border-ipi-600 hover:text-ipi-900"
        >
          + Add equipment
        </button>
      </div>
    </div>
  )
}

