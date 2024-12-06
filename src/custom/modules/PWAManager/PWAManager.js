import React, { useEffect, useState } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Modal, Button, Space } from 'antd'
import { usePWAManager } from './controller'
import styles from './style.module.sass'
import UpdateChecker from './PWAUpdateChecker'
import { faBell, faBellSlash, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const IOSInstructions = () => (
  <div>
    <p>To receive deposit notifications, you need to install DeSoOps by adding it to your home screen.</p>
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
    <p>Receive deposit notifications to your device when receiving:</p>
    <ul>
      <li>Diamonds</li>
      <li>$DESO</li>
      <li>Social/DAO Tokens</li>
      <li>Other Crypto (btc, eth, etc.)</li>
      {/* <li>Private Messages</li> TODO: Add this in next version */}
    </ul>
  </div>
)

const PWAManager = ({ disabled = false, forceShow = false }) => {
  const [showModal, setShowModal] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([
    {
      label: 'Requesting Notification Permissions'
    },
    {
      label: 'Obtaining Token'
    },
    {
      label: 'Initializing Notifications'
    }
  ])

  const { isVisible, support, dismiss, triggerInstallPrompt, notificationPermission } = usePWAManager(forceShow)

  const handleEnable = async () => {
    try {
      if (support.type === 'ios' && support.needsInstall) {
        dismiss()
        setShowModal(false)
        return
      }

      setStepsVisible(true)

      if (notificationPermission === 'default') {
        setCurrentStep(0)
        await Notification.requestPermission()
      }

      if (support.type === 'standard' && triggerInstallPrompt) {
        await triggerInstallPrompt()
      }

      dismiss()
      setShowModal(false)
    } catch (error) {
      console.error('Error enabling deposit notifications or installing PWA:', error)
      setShowModal(false)
    }
  }

  const handleDontShowAgain = () => {
    localStorage.setItem('pwa-dismissed', 'true')
    dismiss()
    setShowModal(false)
  }

  useEffect(() => {
    if (notificationPermission === 'granted') {
      setCurrentStep(currentStep + 1)
    }

    // eslint-disable-next-line
  }, [notificationPermission])

  return (
    <>
      {(forceShow || (!disabled && isVisible)) && (
        <>
          <div className={styles.bellContainer} onClick={() => setShowModal(true)}>
            <BellOutlined className={styles.bellIcon} />
          </div>

          <Modal
            title={support.type === 'ios' && support.needsInstall ? 'Install App' : 'Enable Deposit Notifications'}
            open={showModal}
            onCancel={() => setShowModal(false)}
            footer={null}
            maskClosable={!stepsVisible}
            closable={!stepsVisible}
          >
            {stepsVisible ? (
              <ul>
                {steps.map((step, index) => (
                  <li key={index}>
                    {index < currentStep ? (
                      <Space style={{ color: 'green' }}>
                        {step.label} <FontAwesomeIcon icon={faCheck} />
                      </Space>
                    ) : index === currentStep ? (
                      <Space style={{ color: 'blue' }}>
                        {step.label} <FontAwesomeIcon icon={faSpinner} className={styles.spinningIcon} />
                      </Space>
                    ) : (
                      <div style={{ color: '#aaa' }}>{step.label}</div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <>{support.type === 'ios' && support.needsInstall ? <IOSInstructions /> : <NotificationInstructions />}</>
            )}

            {!stepsVisible ? (
              <div className={styles.buttonContainer}>
                <Button type='primary' size='large' icon={<FontAwesomeIcon icon={faBell} />} onClick={handleEnable}>
                  {support.type === 'ios' && support.needsInstall ? 'Got it!' : 'Enable'}
                </Button>
                <Button
                  size='large'
                  icon={<FontAwesomeIcon icon={faBellSlash} />}
                  onClick={() => handleDontShowAgain()}
                >
                  Don't Show Again
                </Button>
              </div>
            ) : undefined}

            {/* <Collapse
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
                          notificationPermission
                        },
                        null,
                        2
                      )}
                    </pre>
                  )
                }
              ]}
            /> */}
          </Modal>
        </>
      )}
      <UpdateChecker />
    </>
  )
}

export default PWAManager
