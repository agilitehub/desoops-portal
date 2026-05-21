/**
 * Focus (FOCUS) USD price via DeSo node quote endpoint.
 * POST api/v0/get-quote-currency-price-in-usd — MidPrice is USD per 1 FOCUS.
 */
import { api, cleanURL } from 'deso-protocol'

import Enums from './enums'

const ENDPOINT = 'api/v0/get-quote-currency-price-in-usd'

/**
 * @param {{ nodeURI?: string }} [options]
 * @returns {Promise<number|null>} MidPrice as USD per 1 FOCUS, or null if unavailable
 */
export async function fetchFocusMidPriceUsdPerCoin(options = {}) {
  try {
    const body = {
      QuoteCurrencyPublicKeyBase58Check: Enums.values.FOCUS_QUOTE_CURRENCY_PUBLIC_KEY
    }
    const endpoint = options.nodeURI ? cleanURL(options.nodeURI, ENDPOINT) : ENDPOINT
    const data = await api.post(endpoint, body)
    if (data?.MidPrice === undefined || data?.MidPrice === null || data?.MidPrice === '') return null
    const mid = parseFloat(String(data.MidPrice))
    return Number.isFinite(mid) && mid > 0 ? mid : null
  } catch (e) {
    console.error('fetchFocusMidPriceUsdPerCoin:', e)
    return null
  }
}
