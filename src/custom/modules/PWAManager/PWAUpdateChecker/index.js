import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'

const UpdateChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [currentVersion, setCurrentVersion] = useState(null)
  const [newVersion, setNewVersion] = useState(null)

  // Initial version check
  useEffect(() => {
    const getInitialVersion = async () => {
      try {
        const response = await fetch('/version.json?nocache=' + new Date().getTime())
        const data = await response.json()

        // Compare with stored version to handle post-update state
        const storedVersion = localStorage.getItem('app_version')
        if (storedVersion !== data.version) {
          localStorage.setItem('app_version', data.version)
        }

        setCurrentVersion(data.version)
      } catch (error) {
        console.error('Error getting initial version:', error)
      }
    }

    getInitialVersion()
  }, [])

  // Periodic update check
  useEffect(() => {
    if (!currentVersion) return // Don't start checking until we have initial version

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/version.json?nocache=' + new Date().getTime())
        const data = await response.json()

        if (data.version !== currentVersion) {
          setUpdateAvailable(true)
          setNewVersion(data.version)
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Error checking for updates:', error)
      }
    }, 60 * 1000) // 60 seconds

    return () => {
      clearInterval(interval)
    }
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
      <p>A new version of the app is available.</p>
      <p>Current version: {currentVersion}</p>
      <p>New version: {newVersion}</p>
      <p>Please update to get the latest features and improvements.</p>
    </Modal>
  )
}

export default UpdateChecker
