import { useEffect, useState } from 'react'

/** Used until (or unless) the live rate loads, so equipment pricing never breaks offline. */
export const FALLBACK_USD_INR_RATE = 87

export interface UsdInrRate {
  rate: number
  isLive: boolean
  loading: boolean
}

/**
 * USD→INR rate from open.er-api.com (ExchangeRate-API's free, keyless, CORS-
 * enabled endpoint — verified to send `Access-Control-Allow-Origin: *`) —
 * fetched once per mount. Falls back to FALLBACK_USD_INR_RATE if the request
 * fails or is unreachable.
 */
export function useUsdInrRate(): UsdInrRate {
  const [rate, setRate] = useState(FALLBACK_USD_INR_RATE)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => {
        if (!res.ok) throw new Error(`rate fetch failed: ${res.status}`)
        return res.json()
      })
      .then((data: { result?: string; rates?: { INR?: number } }) => {
        const live = data.rates?.INR
        if (!cancelled && data.result === 'success' && typeof live === 'number' && live > 0) {
          setRate(live)
          setIsLive(true)
        }
      })
      .catch(() => {
        // Stay on the fallback rate.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { rate, isLive, loading }
}
