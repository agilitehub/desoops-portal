import React, { useEffect, useState } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Modal, Button, Space, Alert } from 'antd'
import { usePWAManager } from './controller'
import styles from './style.module.sass'
import UpdateChecker from './PWAUpdateChecker'
import { faBell, faBellSlash, faCheck, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import { setEditNotificationsVisible } from '../../../custom/reducer'

const IOSInstructions = () => (
  <div style={{ fontSize: '15px' }}>
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
  <div style={{ fontSize: '15px' }}>
    <p>Receive deposit notifications to your device when receiving:</p>
    <ul>
      <li>Diamonds</li>
      <li>$DESO</li>
      <li>Social/DAO Tokens</li>
      <li>Other Crypto (btc, eth, etc.)</li>
      <li>Private Messages (coming soon)</li>
    </ul>
  </div>
)

const PWAManager = ({ disabled = false, stepStatuses, forceShow = false }) => {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)
  const [disableModal, setDisableModal] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorContent, setErrorContent] = useState('')
  const { tokenObtained, initComplete } = stepStatuses

  const [steps, setSteps] = useState({
    1: {
      label: 'Requesting Notification Permissions',
      status: ''
    },
    2: {
      label: 'Obtaining Token',
      status: ''
    },
    3: {
      label: 'Initializing Notifications',
      status: ''
    }
  })

  const { isVisible, support, dismiss, notificationPermission } = usePWAManager(forceShow)

  const handleEnable = async () => {
    try {
      if (support.type === 'ios' && support.needsInstall) {
        setShowModal(false)
        return
      }

      let permission = null

      setStepsVisible(true)
      setDisableModal(true)
      setErrorContent('')
      setIsSuccess(false)

      setSteps((prev) => ({
        ...prev,
        1: { ...prev['1'], status: 'pending' },
        2: { ...prev['2'], status: '' },
        3: { ...prev['3'], status: '' }
      }))

      permission = await Notification.requestPermission()

      switch (permission) {
        case 'granted':
          setSteps((prev) => ({ ...prev, 1: { ...prev['1'], status: 'success' }, 2: { ...prev['2'], status: 'pending' } }))
          break
        case 'denied':
          let errorMessage = 'Permission to receive notifications was denied. To receive notifications, you will need to manually enable notifications in your browser settings and reload DeSoOps.'

          if (support.type === 'ios') {
            errorMessage = 'Permission to receive notifications was denied. To receive notifications, you will need to manually enable notifications in your iOS notification settings for the DeSoOps app.'
          }

          setSteps((prev) => ({ ...prev, 1: { ...prev['1'], status: 'error' } }))
          setErrorContent(errorMessage)

          break
      }

      // TODO: We need to better manage this instance of the install prompt
      // if (support.type === 'standard' && triggerInstallPrompt) {
      //   await triggerInstallPrompt()
      // }
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
    if (!showModal) return

    setSteps((prev) => ({
      ...prev,
      2: { ...prev['2'], status: tokenObtained },
      3: { ...prev['3'], status: initComplete }
    }))

    // Based on the step statuses, determine if we need to handle any errors, or close the modal
    if (tokenObtained === 'error' || initComplete === 'error') {
      setErrorContent(
        'An error occurred while obtaining your token. Please contact @DeSoOps for assistance.'
      )
    } else if (notificationPermission === 'granted' && tokenObtained === 'success' && initComplete === 'success') {
      setIsSuccess(true)
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
        </>
      )}
      <UpdateChecker />
      <Modal
        title={support?.type === 'ios' && support?.needsInstall ? 'Install App' : 'Enable Deposit Notifications'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        maskClosable={!disableModal}
        closable={!disableModal}
      >
        <>
          {support?.type === 'ios' && support?.needsInstall ? <IOSInstructions /> : <NotificationInstructions />}{' '}
          <div className={styles.buttonContainer}>
            <Button
              type='primary'
              size='large'
              icon={<FontAwesomeIcon icon={faBell} />}
              onClick={handleEnable}
              disabled={disableModal}
            >
              {support?.type === 'ios' && support?.needsInstall ? 'Got it!' : 'Enable'}
            </Button>
            <Button
              size='large'
              icon={<FontAwesomeIcon icon={faBellSlash} />}
              onClick={() => handleDontShowAgain()}
              disabled={disableModal}
            >
              Don't Show Again
            </Button>
          </div>
        </>

        {stepsVisible && (
          <ol style={{ listStyleType: 'none', paddingLeft: 25 }}>
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
        )}

        {errorContent && (
          <div style={{ marginTop: 10 }}>
            <Alert
              message='Error'
              description={
                <div>
                  <div style={{ marginBottom: 10 }}>{errorContent}</div>
                  <div className={styles.buttonContainer}>
                    <Button
                      size='small'
                      danger
                      ghost
                      onClick={() => {
                        setShowModal(false)
                        dismiss()
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              }
              type='error'
              showIcon
            />
          </div>
        )}

        {isSuccess && (
          <div style={{ marginTop: 10 }}>
            <Alert
              message='Success'
              description={
                <div>
                  <div style={{ marginBottom: 10 }}>
                    Notifications have been successfully initialized. Tap the 'Deposit Settings' button below should you
                    wish to manage your deposit notification settings.
                  </div>
                  <div className={styles.buttonContainer}>
                    <Button
                      size='small'
                      type='primary'
                      onClick={() => {
                        dispatch(setEditNotificationsVisible(true))
                        setShowModal(false)
                        dismiss()
                      }}
                    >
                      Deposit Settings
                    </Button>
                    <Button size='small' danger ghost onClick={() => {
                      setShowModal(false)
                      dismiss()
                    }}>
                      Close
                    </Button>
                  </div>
                </div>
              }
              type='success'
              showIcon
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export default PWAManager
