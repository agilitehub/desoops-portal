/**
 * PWA Feature Detection Utilities
 */

/**
 * Device type constants
 * @enum {string}
 */
export const DeviceType = {
  IOS: 'ios',
  ANDROID: 'android',
  DESKTOP: 'desktop',
  UNKNOWN: 'unknown'
}

/**
 * Browser type constants
 * @enum {string}
 */
export const BrowserType = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  SAFARI: 'safari',
  EDGE: 'edge',
  OTHER: 'other'
}

/**
 * Detects iOS version from user agent
 * @returns {number|null} iOS version number or null
 */
export const getIOSVersion = () => {
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/)
  return match ? parseFloat(`${match[1]}.${match[2]}`) : null
}

/**
 * Detects device type from user agent and platform
 * @returns {'ios'|'android'|'desktop'|'unknown'} Device type
 */
export const detectDevice = () => {
  // Try modern API first
  if (navigator.userAgentData) {
    const mobile = navigator.userAgentData.mobile
    const platform = navigator.userAgentData.platform?.toLowerCase() || ''

    if (!mobile) {
      if (platform.includes('mac') || platform.includes('win') || platform.includes('linux')) {
        return DeviceType.DESKTOP
      }
    }

    if (platform.includes('ios')) return DeviceType.IOS
    if (platform.includes('android')) return DeviceType.ANDROID
  }

  // Fallback to user agent
  const ua = navigator.userAgent.toLowerCase()

  // Desktop detection
  if (ua.includes('macintosh') || ua.includes('windows') || ua.includes('linux')) {
    return DeviceType.DESKTOP
  }

  // Mobile detection
  if ((ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) && !window.MSStream) {
    return DeviceType.IOS
  }
  if (ua.includes('android')) {
    return DeviceType.ANDROID
  }

  return DeviceType.UNKNOWN
}

/**
 * Detects browser type from user agent
 * @returns {'chrome'|'firefox'|'safari'|'edge'|'other'} Browser type
 */
export const detectBrowser = () => {
  // Try modern API first
  if (navigator.userAgentData) {
    const brands = navigator.userAgentData.brands
    if (brands.some(b => b.brand.toLowerCase().includes('firefox'))) return BrowserType.FIREFOX
    if (brands.some(b => b.brand.toLowerCase().includes('chrome'))) return BrowserType.CHROME
    if (brands.some(b => b.brand.toLowerCase().includes('edge'))) return BrowserType.EDGE
  }

  // Fallback to user agent
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('firefox')) return BrowserType.FIREFOX
  if (ua.includes('chrome') && !ua.includes('edg') && !ua.includes('opr')) return BrowserType.CHROME
  if (ua.includes('safari') && !ua.includes('chrome')) return BrowserType.SAFARI
  if (ua.includes('edg')) return BrowserType.EDGE

  return BrowserType.OTHER
}

const isSecureContext = () => {
  return window.isSecureContext ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
}

/**
 * Checks if Bluetooth API is supported
 * @returns {boolean} Whether Bluetooth is supported
 */
const isBluetoothSupported = () => {
  return Boolean(
    navigator.bluetooth ||
    'bluetooth' in navigator
  )
}

/**
 * Checks all PWA features and returns their status
 * @returns {Promise<Object>} Object containing all PWA feature statuses
 */
export const checkPwaFeatures = async () => {
  // Device and Browser Detection
  const deviceType = detectDevice()
  const browserType = detectBrowser()
  const iosVersion = getIOSVersion()

  // Service Worker Support - Check secure context first
  const serviceWorkerAllowed = isSecureContext() && Boolean(
    navigator.serviceWorker ||
    'serviceWorker' in navigator ||
    'ServiceWorker' in window ||
    'mozServiceWorker' in navigator
  )

  // Notification Support
  const notificationsAllowed = Boolean(
    'Notification' in window ||
    'mozNotification' in navigator
  )

  // Push and Background Sync Support - Firefox-specific
  const pushNotificationsSupported = Boolean(
    serviceWorkerAllowed && (
      'PushManager' in window ||
      'mozPushManager' in window ||
      'push' in window ||
      'mozPush' in navigator
    )
  )

  const backgroundSyncSupported = Boolean(
    serviceWorkerAllowed && (
      'SyncManager' in window ||
      'mozSyncManager' in window ||
      'sync' in window ||
      'mozSync' in navigator
    )
  )

  // Standalone Mode
  const isStandalone = Boolean(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone
  )

  // Web Manifest
  const hasManifest = Boolean(
    document.querySelector('link[rel="manifest"]') ||
    document.querySelector('link[rel="pwa-manifest"]')
  )

  // Online Status
  let isOnline = navigator.onLine

  // Add event listeners for connectivity changes
  window.addEventListener('online', () => {
    isOnline = true
    window.dispatchEvent(new CustomEvent('pwa:connectivity-change', {
      detail: { isOnline: true }
    }))
  })

  window.addEventListener('offline', () => {
    isOnline = false
    window.dispatchEvent(new CustomEvent('pwa:connectivity-change', {
      detail: { isOnline: false }
    }))
  })

  // Notification Permission
  const notificationPermission = window.Notification
    ? Notification.permission
    : 'denied'

  // Storage Persistence
  let persistentStorageAllowed = false
  try {
    if (navigator.storage?.persist) {
      persistentStorageAllowed = await navigator.storage.persist()
    }
  } catch (error) {
    // Silently handle storage persistence error
  }

  // Standalone Requirements
  const standaloneRequired = Boolean(
    deviceType === DeviceType.IOS &&
    iosVersion >= 16.4 &&
    !isStandalone
  )

  const canBeStandalone = Boolean(
    serviceWorkerAllowed &&
    hasManifest
  )

  const isPWAInstalled = isStandalone

  // Add Bluetooth support check
  const bluetoothSupported = isBluetoothSupported()

  // Support object for PWAManager
  const support = {
    isSupported: deviceType === DeviceType.DESKTOP
      ? (browserType === BrowserType.CHROME || browserType === BrowserType.EDGE)
      : deviceType === DeviceType.IOS
        ? browserType === BrowserType.SAFARI
        : notificationsAllowed || canBeStandalone,
    needsInstall: standaloneRequired,
    type: deviceType === DeviceType.IOS ? DeviceType.IOS : 'standard'
  }

  return {
    serviceWorkerAllowed,
    notificationsAllowed,
    standaloneRequired,
    canBeStandalone,
    isStandalone,
    deviceType,
    browserType,
    isPWAInstalled,
    hasManifest,
    isOnline,
    pushNotificationsSupported,
    backgroundSyncSupported,
    notificationPermission,
    persistentStorageAllowed,
    bluetoothSupported,
    support
  }
}
