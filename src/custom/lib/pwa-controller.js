// Utility function to check if the device is iOS
const isIOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent)
}

// Utility function to get the iOS version
const getIOSVersion = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const match = userAgent.match(/os (\d+_\d+)/)
  if (match) {
    const version = match[1].replace('_', '.')
    return parseFloat(version)
  }
  return null
}

// Utility function to check if the app is installed as a PWA
const isPWAInstalled = () => {
  return window.navigator.standalone === true // True when PWA is added to home screen on iOS
}

// Main function to handle iOS version and PWA installation check
const handlePWAForiOS = () => {
  if (isIOS()) {
    const iOSVersion = getIOSVersion()

    if (iOSVersion >= 16.4) {
      if (!isPWAInstalled()) {
        // Prompt the user to add the PWA to their home screen
        alert(
          'To receive notifications, please add this app to your home screen. Tap the share icon and select "Add to Home Screen".'
        )
      } else {
        console.log('PWA is already installed on iOS 16.4+.')
      }
    } else {
      // iOS version is earlier than 16.4, so no push notifications are possible
      alert('Your device is running iOS version earlier than 16.4. Push notifications are not supported.')
    }
  }
}

export { handlePWAForiOS }
