const ua = navigator.userAgent.toLowerCase()

const detectEnvironment = () => {
  const isIOS = /iphone|ipad|ipod/.test(ua) && !window.MSStream
  const isIOSSafari = isIOS && /safari/.test(ua) && !/(chrome|crios|fxios|opios|mercury)/.test(ua)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

  return {
    isIOS,
    isIOSSafari,
    isStandalone,
    isInstalled: isStandalone
  }
}

export const PWA_CONFIG = {
  storage: {
    DISMISSED_KEY: 'pwa-dismissed',
    LAST_PROMPT_DATE: 'pwa-last-prompt-date'
  },
  browsers: {
    CHROME: 'chrome',
    FIREFOX: 'firefox',
    SAFARI: 'safari',
    EDGE: 'edge',
    OTHER: 'other'
  },
  devices: {
    IOS: 'ios',
    ANDROID: 'android',
    DESKTOP: 'desktop',
    UNKNOWN: 'unknown'
  },
  platform: navigator.userAgentData?.platform || ua.match(/(win|mac|linux)/i)?.[1] || '',
  env: detectEnvironment(),
  remindLaterDelay: 24 * 60 * 60 * 1000, // 24 hours
  minIOSVersion: 16.4
}
