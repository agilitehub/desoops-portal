export const promptIOSInstall = () => {
  // Check if the device is iOS and not in standalone mode
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  
  return isIOS && !isStandalone
}

export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return false
  }
}

export const checkServiceWorkerStatus = async () => {
  if (!('serviceWorker' in navigator)) {
    return 'unsupported'
  }

  try {
    const registration = await navigator.serviceWorker.ready
    return registration.active ? 'active' : 'inactive'
  } catch (error) {
    console.error('Error checking service worker status:', error)
    return 'error'
  }
}

export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone || 
         document.referrer.includes('android-app://')
}
