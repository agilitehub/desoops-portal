import React, { useState } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { usePWAManager } from './controller'
import styles from './style.module.sass'
import { initializeMessaging } from '../../lib/firebase-controller'

const IOSInstructions = () => (
  <ol>
    <li>Tap the share button (📤) in Safari's toolbar</li>
    <li>Scroll down and tap "Add to Home Screen"</li>
    <li>Tap "Add" in the top right</li>
    <li>Return to the app from your home screen</li>
  </ol>
)

const NotificationInstructions = () => (
  <div>
    <p>Stay updated with instant notifications about your activity:</p>
    <ul>
      <li>New followers and mentions</li>
      <li>Comments and reactions</li>
    </ul>
  </div>
)

const PWAManager = ({ onNotificationsEnabled }) => {
  const [showModal, setShowModal] = useState(false)
  const { isVisible, support, dismiss } = usePWAManager()

  if (!isVisible) return null

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        await initializeMessaging()
        onNotificationsEnabled?.()
        dismiss()
      }

      setShowModal(false)
    } catch (error) {
      console.error('Error enabling notifications:', error)
      setShowModal(false)
    }
  }

  return (
    <>
      <div className={styles.bellContainer} onClick={() => setShowModal(true)}>
        <BellOutlined className={styles.bellIcon} />
      </div>

      <Modal
        title={support.type === 'ios' ? 'Install App' : 'Enable Notifications'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        {support.type === 'ios' ? <IOSInstructions /> : <NotificationInstructions />}

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleEnable}>
            {support.type === 'ios' ? 'Got it!' : 'Enable'}
          </button>
          <button onClick={() => dismiss(true)}>Remind Later</button>
          <button onClick={() => dismiss()}>Don't Show Again</button>
        </div>
      </Modal>
    </>
  )
}

export default PWAManager
