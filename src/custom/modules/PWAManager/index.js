import React from 'react'
import { Modal } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { usePWAManager } from './controller'
import styles from './style.module.sass'

const PWAManager = () => {
  const {
    isModalVisible,
    setIsModalVisible,
    shouldShow,
    handleNotificationRequest,
    handleRemindLater,
    handleDontShowAgain
  } = usePWAManager()

  if (!shouldShow) return null

  return (
    <>
      <div className={styles.bellContainer} onClick={() => setIsModalVisible(true)}>
        <FontAwesomeIcon icon={faBell} className={styles.bellIcon} />
      </div>

      <Modal
        title='Enable Push Notifications'
        open={isModalVisible}
        onCancel={handleRemindLater}
        footer={[
          <button key='remind' onClick={handleRemindLater} className={styles.modalButton}>
            Remind Me Later
          </button>,
          <button key='dont-show' onClick={handleDontShowAgain} className={styles.modalButton}>
            Don't Show Again
          </button>,
          <button
            key='enable'
            onClick={handleNotificationRequest}
            className={`${styles.modalButton} ${styles.primaryButton}`}
          >
            Enable Notifications
          </button>
        ]}
      >
        <p>Stay updated with push notifications! Enable notifications to receive important updates and alerts.</p>
      </Modal>
    </>
  )
}

export default PWAManager
