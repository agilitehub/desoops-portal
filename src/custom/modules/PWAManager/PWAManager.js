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

const PWAManager = ({ disabled = false, stepStatuses, forceShow = false }) => {
  const [showModal, setShowModal] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { tokenObtained, initComplete } = stepStatuses

  const [steps, setSteps] = useState({
    '1': {
      label: 'Requesting Notification Permissions',
      status: ''
    },
    '2': {
      label: 'Obtaining Token',
      status: ''
    },
    '3': {
      label: 'Initializing Notifications',
      status: ''
    }
  })

  const { isVisible, support, dismiss, triggerInstallPrompt, notificationPermission } = usePWAManager(forceShow)

  const handleEnable = async () => {
    try {
      if (support.type === 'ios' && support.needsInstall) {
        dismiss()
        setShowModal(false)
        return
      }

      setStepsVisible(true)
      let permission = null

      if (notificationPermission === 'default') {
        setSteps((prev) => ({ ...prev, '1': { ...prev['1'], status: 'pending' } }))
        permission = await Notification.requestPermission()
        if (permission === 'granted') {
          setSteps((prev) => ({ ...prev, '1': { ...prev['1'], status: 'success' } }))
        } else {
          setSteps((prev) => ({ ...prev, '1': { ...prev['1'], status: 'error' } }))

          // TODO: Handle error. Prompt user to manually enable notifications in settings
        }
      }

      // TODO: We need to better manage this instance of the install prompt
      // if (support.type === 'standard' && triggerInstallPrompt) {
      //   await triggerInstallPrompt()
      // }

      dismiss()
      setShowModal(false)
    } catch (error) {
      console.error('Error enabling deposit notifications or installing PWA:', error)
    }
  }

  const handleDontShowAgain = () => {
    localStorage.setItem('pwa-dismissed', 'true')
    dismiss()
    setShowModal(false)
  }

  useEffect(() => {
    setSteps((prev) => ({
      ...prev,
      '2': { ...prev['2'], status: tokenObtained },
      '3': { ...prev['3'], status: initComplete }
    }))

    // Based on the step statuses, determine if we need to handle any errors, or close the modal
    if (tokenObtained === 'error' || initComplete === 'error') {
      // TODO: Handle error in dialog by providing user feedback and disabling stepsVisible
    } else {
      // TODO: Handle success in the modal, providing feedback and allowing user to edit deposit settings.
      // They can either close or edit deposit settings. If edit deposit settings, close modal and launch settings modal.
      // setShowModal(false)
    }

    // eslint-disable-next-line
  }, [tokenObtained, initComplete])

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
              <ol>
                {Object.values(steps).map((step, index) => (
                  <li key={index}>
                    {step.status === 'success' ? (
                      <Space style={{ color: 'green' }}>
                        <FontAwesomeIcon icon={faCheck} /> {step.label}
                      </Space>
                    ) : step.status === 'pending' ? (
                      <Space style={{ color: 'blue' }}>
                        <FontAwesomeIcon icon={faSpinner} className={styles.spinningIcon} /> {step.label}
                      </Space>
                    ) : step.status === 'error' ? (
                      <Space style={{ color: 'red' }}>
                        <FontAwesomeIcon icon={faTimes} /> {step.label}
                      </Space>
                    ) : (
                      <Space>{step.label}</Space>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <>{support.type === 'ios' && support.needsInstall ? <IOSInstructions /> : <NotificationInstructions />}</>
            )}

            <div className={styles.buttonContainer}>
              <Button type='primary' size='large' icon={<FontAwesomeIcon icon={faBell} />} onClick={handleEnable} disabled={stepsVisible}>
                {support.type === 'ios' && support.needsInstall ? 'Got it!' : 'Enable'}
              </Button>
              <Button
                size='large'
                icon={<FontAwesomeIcon icon={faBellSlash} />}
                onClick={() => handleDontShowAgain()}
                disabled={stepsVisible}
              >
                Don't Show Again
              </Button>
            </div>

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
