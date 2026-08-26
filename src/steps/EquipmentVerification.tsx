import type { EquipmentVerificationLine } from '../calc/types'
import { EQUIPMENT_CATALOG } from '../data/equipmentCatalog'

export function EquipmentVerification({
  lines,
  onChange,
}: {
  lines: Record<string, EquipmentVerificationLine>
  onChange: (lines: Record<string, EquipmentVerificationLine>) => void
}) {
  function lineFor(id: string): EquipmentVerificationLine {
    return lines[id] ?? { confirmed: false, sowQty: '' }
  }

  function updateLine(id: string, patch: Partial<EquipmentVerificationLine>) {
    onChange({ ...lines, [id]: { ...lineFor(id), ...patch } })
  }

  return (
    <div className="mb-5 rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
      <div className="border-b border-hairline bg-ipi-50/60 px-4 py-3">
        <div className="text-sm font-medium text-ink">Equipment Template</div>
        <div className="mt-0.5 text-xs text-ipi-700/60">
          Check off each line if the template quantity holds — otherwise write the SOW qty beside it
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[440px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_var(--color-hairline)]">
            <tr className="text-left text-xs text-ipi-700/60">
              <th className="px-4 py-2 font-medium">Equipment</th>
              <th className="px-4 py-2 text-right font-medium">Template Qty</th>
              <th className="w-12 px-4 py-2 text-center font-medium">✓</th>
              <th className="px-4 py-2 text-right font-medium">SOW Qty</th>
            </tr>
          </thead>
          <tbody>
            {EQUIPMENT_CATALOG.map((item) => {
              const line = lineFor(item.id)
              return (
                <tr key={item.id} className="border-b border-hairline last:border-b-0">
                  <td className="px-4 py-2 text-ink">{item.equipment}</td>
                  <td className="font-data px-4 py-2 text-right font-medium tabular-nums text-ink">
                    {item.sowQtyLabel}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={line.confirmed}
                      onChange={(e) => updateLine(item.id, { confirmed: e.target.checked })}
                      className="h-4 w-4 accent-[var(--color-ipi-600)]"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {line.confirmed ? (
                      <span className="font-data tabular-nums text-ipi-700/50">{item.sowQtyLabel}</span>
                    ) : (
                      <input
                        type="text"
                        value={line.sowQty}
                        onChange={(e) => updateLine(item.id, { sowQty: e.target.value })}
                        placeholder="___"
                        className="font-data w-20 rounded-md border border-hairline px-2 py-1 text-right tabular-nums outline-none transition-colors placeholder:text-ipi-700/30 focus:border-ipi-600"
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
