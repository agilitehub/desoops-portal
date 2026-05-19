/**
 * Focus (FOCUS) token DEX pricing via DeSo node order book.
 * Uses POST api/v0/get-dao-coin-limit-orders — see https://docs.deso.org/deso-backend/api/dao-endpoints
 *
 * Request body keys: DAOCoin1CreatorPublicKeyBase58Check / DAOCoin2CreatorPublicKeyBase58Check.
 * The native coin leg must be the literal string "DESO" (backend IsDesoPkid), not "".
 *
 * Quote styles on the book:
 * - **Small `Price` (< 1)** = already **DESO per 1 FOCUS** (standard bid quote).
 * - **Large `Price` (≥ 1)** = **FOCUS per 1 DESO**; DESO per FOCUS = `1 / Price`.
 *
 * Focus.xyz-style **balance USD** tracks the **liquid bid stack** (small-quote bids), not a bid/ask mid.
 * A naive mid collapses toward tiny best asks when the spread is wide, understating value (~$0.50 vs ~$0.79).
 *
 * **Mark rule:** best DESO/FOCUS among BIDs with **raw `Price` < 1** (same convention as main liquidity).
 * If none, fall back to best normalized bid (`max` of `p < 1 ? p : 1/p`). If no bids, use best normalized ask.
 */
import { api, cleanURL } from 'deso-protocol'

import Enums from './enums'

const ENDPOINT = 'api/v0/get-dao-coin-limit-orders'

function parseOrderPrice(order) {
  if (order.Price === undefined || order.Price === null || order.Price === '') return null
  const p = parseFloat(order.Price)
  if (!Number.isFinite(p) || p <= 0) return null
  return p
}

/**
 * Collapse either quote convention to DESO per 1 FOCUS.
 */
function orderPriceToDesoPerFocus(order) {
  const p = parseOrderPrice(order)
  if (p == null) return null
  return p < 1 ? p : 1 / p
}

function operationTypeKey(order) {
  return String(order.OperationType || '').toUpperCase()
}

/**
 * Mark price in DESO per 1 FOCUS for valuation (wallet USD, Focus price row).
 * Export name kept for callers; implementation is bid-liquid-stack first, not bid/ask mid.
 */
export async function fetchFocusMidPriceDesoPerCoin(options = {}) {
  try {
    const body = {
      DAOCoin1CreatorPublicKeyBase58Check: Enums.values.FOCUS_TOKEN_CREATOR_PUBLIC_KEY,
      DAOCoin2CreatorPublicKeyBase58Check: Enums.values.DESO_ORDER_BOOK_IDENTIFIER
    }
    const endpoint = options.nodeURI ? cleanURL(options.nodeURI, ENDPOINT) : ENDPOINT
    const data = await api.post(endpoint, body)
    const orders = data?.Orders
    if (!Array.isArray(orders) || orders.length === 0) return null

    /** Best bid among orders already quoted as DESO per FOCUS (`Price` &lt; 1). Matches Focus wallet behaviour. */
    let bestLiquidBidDesoPerFocus = -Infinity
    /** Best bid allowing inverted-style quotes (`Price` ≥ 1 → 1/`Price`). */
    let bestAnyBidDesoPerFocus = -Infinity
    let bestAskDesoPerFocus = Infinity

    for (const order of orders) {
      const op = operationTypeKey(order)
      const p = parseOrderPrice(order)
      if (p == null) continue

      if (op === 'BID') {
        if (p < 1 && p > bestLiquidBidDesoPerFocus) bestLiquidBidDesoPerFocus = p
        const norm = orderPriceToDesoPerFocus(order)
        if (norm != null && norm > bestAnyBidDesoPerFocus) bestAnyBidDesoPerFocus = norm
      } else if (op === 'ASK') {
        const norm = orderPriceToDesoPerFocus(order)
        if (norm != null && norm < bestAskDesoPerFocus) bestAskDesoPerFocus = norm
      }
    }

    if (bestLiquidBidDesoPerFocus > 0 && Number.isFinite(bestLiquidBidDesoPerFocus)) {
      return bestLiquidBidDesoPerFocus
    }
    if (bestAnyBidDesoPerFocus > 0 && Number.isFinite(bestAnyBidDesoPerFocus)) {
      return bestAnyBidDesoPerFocus
    }
    if (bestAskDesoPerFocus < Infinity && bestAskDesoPerFocus > 0) {
      return bestAskDesoPerFocus
    }
    return null
  } catch (e) {
    console.error('fetchFocusMidPriceDesoPerCoin:', e)
    return null
  }
}
