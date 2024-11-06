import { notification } from 'antd'
import { useState, useEffect } from 'react'

const checkIOSVersion = () => {
  const userAgent = window.navigator.userAgent
  const iOSMatch = userAgent.match(/OS (\d+)_(\d+)/)

  if (iOSMatch) {
    const majorVersion = parseInt(iOSMatch[1], 10)
    const minorVersion = parseInt(iOSMatch[2], 10)
    return majorVersion + minorVersion / 10
  }
  return null
}

const checkNotificationSupport = () => {
  // Check if the browser supports notifications
  if (!('Notification' in window)) {
    return false
  }

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    return false
  }

  // Check if Push API is supported
  if (!('PushManager' in window)) {
    return false
  }

  return true
}

export const shouldShowPWAManager = (userStatus = '') => {
  // Check user status first
  if (userStatus !== '') {
    return false
  }

  // Check basic notification support
  if (!checkNotificationSupport()) {
    return false
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = navigator.platform.toLowerCase()

  // Check for private browsing mode in Safari
  if (window.safari && window.safari.pushNotification) {
    const permissionData = window.safari.pushNotification.permission('web.com.yoursite')
    if (permissionData.permission === 'denied') {
      return false
    }
  }

  // iOS specific checks
  const isIOS = /ipad|iphone|ipod/.test(userAgent) && !window.MSStream
  const isIOSSafari = isIOS && /safari/.test(userAgent) && !/(chrome|crios|fxios|opios|mercury)/.test(userAgent)

  if (isIOS) {
    // Check iOS version for Safari
    if (isIOSSafari) {
      const iOSVersion = checkIOSVersion()
      if (iOSVersion && iOSVersion < 16.4) {
        return false
      }
    } else {
      // iOS browsers other than Safari don't support push notifications
      return false
    }
  }

  // Android specific checks
  const isAndroid = /android/.test(userAgent)
  if (isAndroid) {
    // Check if using supported browser (Chrome, Firefox, Edge, Opera)
    const isSupportedBrowser = /(chrome|firefox|edge|opr)/.test(userAgent)
    if (!isSupportedBrowser) {
      return false
    }
  }

  // Desktop specific checks
  const isDesktop = /(win|mac|linux)/i.test(platform)
  if (isDesktop) {
    // Check if using supported browser
    const isUnsupportedBrowser = /(ie|trident)/.test(userAgent)
    if (isUnsupportedBrowser) {
      return false
    }
  }

  // Check if in standalone PWA mode
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')

  if (isStandalone) {
    // Already installed as PWA, might want to show notifications anyway
    // Depends on your use case
    return true
  }

  // Check if notifications are already granted
  if (Notification.permission === 'granted') {
    return false
  }

  // Check if notifications are already denied by the user
  if (Notification.permission === 'denied') {
    return false
  }

  return true
}

export const usePWAManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    // Check if notifications are already enabled or permanently dismissed
    const checkNotificationStatus = () => {
      const dismissed = localStorage.getItem('pwa-notifications-dismissed')
      if (dismissed === 'true' || Notification.permission === 'granted') {
        setShouldShow(false)
      }
    }

    checkNotificationStatus()
  }, [])

  const handleNotificationRequest = async () => {
    try {
      const result = await Notification.requestPermission()
      if (result === 'granted') {
        notification.success({
          message: 'Notifications Enabled',
          description: 'You will now receive push notifications'
        })
        setShouldShow(false)
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  const handleRemindLater = () => {
    setIsModalVisible(false)
  }

  const handleDontShowAgain = () => {
    localStorage.setItem('pwa-notifications-dismissed', 'true')
    setShouldShow(false)
    setIsModalVisible(false)
  }

  return {
    isModalVisible,
    setIsModalVisible,
    shouldShow,
    handleNotificationRequest,
    handleRemindLater,
    handleDontShowAgain
  }
}
