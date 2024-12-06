import { DeviceType, BrowserType } from '../PWADetector/utils'

export const PWA_CONFIG = {
  storage: {
    DISMISSED_KEY: 'pwa-dismissed',
    LAST_PROMPT_DATE: 'pwa-last-prompt-date'
  },
  browsers: BrowserType,
  devices: DeviceType,
  remindLaterDelay: 24 * 60 * 60 * 1000, // 24 hours
  minIOSVersion: 16.4
}
