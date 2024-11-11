import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'

const UpdateChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [currentVersion, setCurrentVersion] = useState(null)

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        // Get the version when the app was loaded
        if (!currentVersion) {
          const response = await fetch('/version.json')
          const data = await response.json()
          setCurrentVersion(data.version)
          localStorage.setItem('app_version', data.version)
          return
        }

        // Check for new version every 5 minutes
        const interval = setInterval(async () => {
          const response = await fetch('/version.json?nocache=' + new Date().getTime())
          const data = await response.json()

          if (data.version !== currentVersion) {
            setUpdateAvailable(true)
            clearInterval(interval)
          }
        }, 5 * 60 * 1000)

        return () => clearInterval(interval)
      } catch (error) {
        console.error('Error checking for updates:', error)
      }
    }

    checkForUpdates()
  }, [currentVersion])

  const handleUpdate = () => {
    // Force reload from server, not cache
    window.location.reload(true)
  }

  if (!updateAvailable) return null

  return (
    <Modal
      title='Update Available'
      open={updateAvailable}
      onOk={handleUpdate}
      onCancel={() => setUpdateAvailable(false)}
      okText='Update Now'
      cancelText='Later'
    >
      <p>A new version of the app is available. Please update to get the latest features and improvements.</p>
    </Modal>
  )
}

export default UpdateChecker
