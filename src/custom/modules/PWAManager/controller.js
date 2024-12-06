import { useState, useEffect, useCallback } from 'react'
import { usePwaFeatures } from '../PWADetector/hooks'

// Check localStorage for dismissal state
const memoryStorage = {
  dismissed: localStorage.getItem('pwa-dismissed') === 'true'
}

export const usePWAManager = (forceShow = false) => {
  const features = usePwaFeatures({
    checkOnPermissionChange: true,
    checkOnInstallChange: true,
    checkOnManifestChange: true
  })

  const [isVisible, setIsVisible] = useState(false)

  // Simplified state calculation using features.support
  useEffect(() => {
    const shouldShow = forceShow ||
      (!memoryStorage.dismissed &&
        features?.support?.isSupported &&
        (features.notificationPermission === 'default' || features?.support?.needsInstall)
      )

    setIsVisible(shouldShow)
  }, [
    forceShow,
    features?.support?.isSupported,
    features.notificationPermission,
    features?.support?.needsInstall
  ])

  const dismiss = useCallback(() => {
    memoryStorage.dismissed = true
    setIsVisible(false)
  }, [])

  return {
    ...features,
    isVisible,
    dismiss
  }
}
