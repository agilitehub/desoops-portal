import React, { useState } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Modal, Collapse } from 'antd'
import { usePWAManager } from './controller'
import styles from './style.module.sass'
import { initializeMessaging } from '../../lib/firebase-controller'
import UpdateChecker from './PWAUpdateChecker'

const IOSInstructions = () => (
  <div>
    <p>To receive notifications, you need to install DeSoOps by adding it to your home screen.</p>
    <ol>
      <li>Tap the share button (📤) in Safari's toolbar</li>
      <li>Scroll down and tap "Add to Home Screen"</li>
      <li>Tap "Add" in the top right</li>
      <li>Launch DeSoOps from your home screen</li>
    </ol>
  </div>
)

const NotificationInstructions = () => (
  <div>
    <p>Receive notifications to your device when receiving:</p>
    <ul>
      <li>Diamonds</li>
      <li>$DESO</li>
      <li>Social/DAO Tokens</li>
      <li>Other Crypto (btc, eth, etc.)</li>
      <li>Private Messages</li> {/* TODO: Add this in next version */}
    </ul>
  </div>
)

const PWAManager = ({ onNotificationsEnabled, onDontShowAgain, disabled }) => {
  const [showModal, setShowModal] = useState(false)
  const {
    isVisible,
    support,
    dismiss,
    triggerInstallPrompt,
    ...pwaFeatures
  } = usePWAManager()

  const handleEnable = async () => {
    try {
      if (support.type === 'ios') {
        // Handle iOS case
        setShowModal(false)
        dismiss()
        return
      }

      if (pwaFeatures.installPromptAvailable) {
        // Handle PWA installation
        const outcome = await triggerInstallPrompt()
        if (outcome === 'accepted') {
          dismiss()
        }
      } else {
        // Handle notification permission
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          await initializeMessaging()
          onNotificationsEnabled?.()
          dismiss()
        }
      }

      setShowModal(false)
    } catch (error) {
      console.error('Error enabling notifications or installing PWA:', error)
      setShowModal(false)
    }
  }

  const handleDontShowAgain = () => {
    dismiss()
    setShowModal(false)
    onDontShowAgain()
  }

  return (
    <>
      {!disabled && isVisible && (
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
              <button onClick={() => handleDontShowAgain()}>Don't Show Again</button>
            </div>

            <Collapse
              className={styles.debugSection}
              items={[
                {
                  key: '1',
                  label: 'Debug Information',
                  children: (
                    <pre style={{ fontSize: '12px' }}>
                      {JSON.stringify(
                        {
                          support,
                          isVisible,
                          ...pwaFeatures
                        },
                        null,
                        2
                      )}
                    </pre>
                  )
                }
              ]}
            />
          </Modal>
        </>
      )}
      <UpdateChecker />
    </>
  )
}

export default PWAManager
