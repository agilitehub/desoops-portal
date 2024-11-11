import { useState, useEffect, useCallback } from 'react'
import { PWA_CONFIG } from './config'

const getIOSVersion = () => {
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/)
  return match ? parseFloat(`${match[1]}.${match[2]}`) : null
}

export const checkSupport = () => {
  const { isIOS, isIOSSafari, isInstalled } = PWA_CONFIG.env

  // Special case for iOS
  if (isIOS) {
    const iosVersion = getIOSVersion()
    const isSupported = isIOSSafari && iosVersion >= PWA_CONFIG.minIOSVersion
    return {
      isSupported,
      needsInstall: isSupported && !isInstalled,
      type: 'ios'
    }
  }

  // For other platforms, check notification support
  const hasNotifications = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
  return {
    isSupported: hasNotifications,
    needsInstall: false,
    type: 'standard'
  }
}

const detectDevice = () => {
  const ua = navigator.userAgent.toLowerCase()

  if (/iphone|ipad|ipod/.test(ua) && !window.MSStream) {
    return 'ios'
  } else if (/android/.test(ua)) {
    return 'android'
  } else if (/windows|macintosh|linux/.test(ua)) {
    return 'desktop'
  }

  return 'unknown'
}

const detectBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()

  if (/(chrome|crios)/.test(ua) && !/(edg|edge)/.test(ua)) {
    return 'chrome'
  } else if (/(firefox|fxios)/.test(ua)) {
    return 'firefox'
  } else if (/safari/.test(ua) && !/(chrome|crios|fxios|opios|mercury)/.test(ua)) {
    return 'safari'
  } else if (/(edg|edge)/.test(ua)) {
    return 'edge'
  }

  return 'other'
}

export const usePWAManager = () => {
  const [state, setState] = useState({
    isVisible: false,
    support: checkSupport()
  })

  const shouldShow = useCallback(() => {
    const dismissed = localStorage.getItem(PWA_CONFIG.storage.DISMISSED_KEY)
    if (dismissed) return false

    const lastPrompt = localStorage.getItem(PWA_CONFIG.storage.LAST_PROMPT_DATE)
    if (lastPrompt && Date.now() - parseInt(lastPrompt) < PWA_CONFIG.remindLaterDelay) {
      return false
    }

    return state.support.isSupported
  }, [state.support.isSupported])

  useEffect(() => {
    setState((prev) => ({ ...prev, isVisible: shouldShow() }))
  }, [shouldShow])

  const dismiss = (temporary = false) => {
    if (!temporary) {
      localStorage.setItem(PWA_CONFIG.storage.DISMISSED_KEY, 'true')
    } else {
      localStorage.setItem(PWA_CONFIG.storage.LAST_PROMPT_DATE, Date.now().toString())
    }
    setState((prev) => ({ ...prev, isVisible: false }))
  }

  return { ...state, dismiss }
}

// Export these if needed by other parts of the application
export { detectDevice, detectBrowser }
