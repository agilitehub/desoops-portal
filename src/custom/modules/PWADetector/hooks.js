/**
 * usePwaFeatures Hook
 * 
 * A React hook that provides comprehensive information about Progressive Web App (PWA) 
 * features, device capabilities, and browser support. It helps developers make 
 * informed decisions about PWA implementation and feature availability.
 * 
 * Usage:
 * ```jsx
 * const MyComponent = () => {
 *   const {
 *     deviceType,          // 'ios', 'android', 'desktop', or 'unknown'
 *     browserType,         // 'chrome', 'firefox', 'safari', 'edge', or 'other'
 *     isStandalone,        // Is the app running as an installed PWA?
 *     canBeStandalone,     // Can the app be installed?
 *     standaloneRequired,  // Must the app be installed to function?
 *     isOnline,           // Is the device connected to the internet
 *     triggerInstallPrompt, // Function to trigger the install prompt
 *     // ... other features
 *   } = usePwaFeatures()
 * 
 *   // Listen for connectivity changes
 *   useEffect(() => {
 *     if (!isOnline) {
 *       // Handle offline state
 *     }
 *   }, [isOnline])
 * 
 *   return (
 *     <div>
 *       <h2>PWA Support Status</h2>
 *       <p>Device: {deviceType}</p>
 *       <p>Browser: {browserType}</p>
 *       <p>Online: {isOnline ? 'Yes' : 'No'}</p>
 *     </div>
 *   )
 * }
 * ```
 * 
 * @author Your Name
 * @version 1.0.0
 * @license MIT
 */

import { useEffect, useState, useCallback } from 'react'
import { checkPwaFeatures } from './utils'

/**
 * Custom hook that detects PWA features and capabilities
 * @returns {Object} Object containing PWA feature support information
 */
export const usePwaFeatures = (options = {}) => {
  const {
    checkOnPermissionChange = true,
    checkOnInstallChange = true,
    checkOnManifestChange = true,
  } = options

  const [features, setFeatures] = useState({
    // Basic PWA Support
    serviceWorkerAllowed: false,    // Can the app use Service Workers
    notificationsAllowed: false,    // Are notifications supported
    standaloneRequired: false,      // Must the app be installed to function
    canBeStandalone: false,         // Can the app be installed
    isStandalone: false,            // Is the app running as installed PWA

    // Device Information
    deviceType: null,               // ios, android, desktop, or unknown
    browserType: null,              // chrome, firefox, safari, edge, or other

    // Additional PWA Features
    isPWAInstalled: false,          // Is the app currently installed
    hasManifest: false,             // Does the app have a web manifest
    isOnline: navigator.onLine,     // Initialize with actual online status
    pushNotificationsSupported: false, // Are push notifications supported
    backgroundSyncSupported: false,    // Is background sync supported
    installPromptAvailable: false,     // Can we prompt to install (non-iOS)
    bluetoothSupported: false,      // Is Bluetooth supported

    // Permissions
    notificationPermission: null,      // Current notification permission status
    persistentStorageAllowed: false,    // Is persistent storage allowed
    deferredPrompt: null,  // Add this to store the install prompt event
  })

  const updateFeatures = useCallback(async () => {
    try {
      const newFeatures = await checkPwaFeatures()
      setFeatures(prev => ({
        ...prev,
        ...newFeatures,
        deferredPrompt: prev.deferredPrompt // Preserve deferredPrompt
      }))
    } catch (error) {
      console.error('Error checking PWA features:', error)
    }
  }, [])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setFeatures(prev => ({
        ...prev,
        installPromptAvailable: true,
        deferredPrompt: e
      }))
    }

    const handleConnectivityChange = (e) => {
      setFeatures(prev => ({
        ...prev,
        isOnline: e.detail.isOnline
      }))
    }

    // Set up event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('pwa:connectivity-change', handleConnectivityChange)

    // Set up observers
    let manifestObserver
    if (checkOnManifestChange) {
      manifestObserver = new MutationObserver(updateFeatures)
      manifestObserver.observe(document.head, {
        childList: true,
        subtree: true
      })
    }

    let permissionObserver
    if (checkOnPermissionChange && navigator.permissions) {
      // Change to use addEventListener instead of polling
      navigator.permissions.query({ name: 'notifications' })
        .then(permissionStatus => {
          permissionStatus.addEventListener('change', updateFeatures)
          permissionObserver = permissionStatus
        })
        .catch(console.error)
    }

    if (checkOnInstallChange) {
      window.addEventListener('appinstalled', updateFeatures)
    }

    // Initial check
    updateFeatures()

    // Cleanup
    return () => {
      if (permissionObserver) {
        permissionObserver.removeEventListener('change', updateFeatures)
      }
      if (checkOnInstallChange) {
        window.removeEventListener('appinstalled', updateFeatures)
      }
      if (manifestObserver) {
        manifestObserver.disconnect()
      }
      window.removeEventListener('pwa:connectivity-change', handleConnectivityChange)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [checkOnPermissionChange, checkOnInstallChange, checkOnManifestChange, updateFeatures])

  // Add a method to trigger the install prompt
  const triggerInstallPrompt = async () => {
    const { deferredPrompt } = features
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // Clear the saved prompt
    setFeatures(prev => ({
      ...prev,
      deferredPrompt: null,
      installPromptAvailable: false
    }))

    return outcome
  }

  return {
    ...features,
    triggerInstallPrompt
  }
}