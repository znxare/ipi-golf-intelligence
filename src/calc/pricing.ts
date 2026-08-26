/** Markup on Toro's USD MSRP before INR conversion — freight, import duty, taxes, local terms. */
export const USD_MSRP_MARKUP = 1.4

/** 2026 MSRP (USD) × markup × live USD→INR rate. */
export function deriveEquipmentPriceINR(usdMsrp: number, usdInrRate: number): number {
  return usdMsrp * USD_MSRP_MARKUP * usdInrRate
}
