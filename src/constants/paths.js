/**
 * Central segment helpers — pair with MAIN_TOOLBAR_ITEMS and src/routes.js.
 *
 * Phase 3 wires real paths; meanwhile segments are reserved for outbound links.
 */

export const ROUTE_SEGMENTS = {
  DISTRIBUTE: 'distribute',
  WALLET: 'wallet'
}

const APP_ROOT = ''

/** @param {string} segment Segment after leading slash when nested under logged-in shell */
export function buildAppPath(segment = '') {
  if (!segment) return APP_ROOT === '' ? '/' : APP_ROOT
  const base = APP_ROOT.replace(/\/$/, '')
  const path = `${base}/${segment}`.replace(/\/+/g, '/')
  return path.startsWith('/') ? path : `/${path}`
}
