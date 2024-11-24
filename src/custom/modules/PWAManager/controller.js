import { useState, useEffect, useCallback } from 'react'
import { usePwaFeatures } from './PWADetector/hooks'
import { PWA_CONFIG } from './config'

// Simplify memory storage to only track dismissal
const memoryStorage = {
  dismissed: false
}

export const usePWAManager = (forceShow = false) => {
  const features = usePwaFeatures({
    checkOnPermissionChange: true,
    checkOnInstallChange: true,
    checkOnManifestChange: true
  })

  // Combine all feature-related state into one useState
  const [state, setState] = useState({
    isVisible: false,
    support: {
      isSupported: false,
      needsInstall: false,
      type: 'standard'
    },
    ...features // Include initial features
  })

  // Calculate new state only when features change
  useEffect(() => {
    const supportObject = {
      isSupported: features.deviceType === 'ios'
        ? features.browserType === 'safari'
        : features.notificationsAllowed,
      needsInstall: features.standaloneRequired,
      type: features.deviceType === 'ios' ? 'ios' : 'standard'
    }

    const notificationPermission = features.notificationsPermission || 'default'

    const shouldShow = forceShow ||
      (!memoryStorage.dismissed &&
        supportObject.isSupported &&
        (notificationPermission === 'default' || supportObject.needsInstall)
      )

    setState(prev => ({
      ...prev,
      ...features,
      isVisible: shouldShow,
      support: supportObject
    }))
  }, [
    forceShow,
    features.deviceType,
    features.browserType,
    features.iosVersion,
    features.notificationsAllowed,
    features.standaloneRequired,
    features.notificationsPermission
  ])

  const dismiss = useCallback(() => {
    memoryStorage.dismissed = true
    setState(prev => ({ ...prev, isVisible: false }))
  }, [])

  return { ...state, dismiss }
}
