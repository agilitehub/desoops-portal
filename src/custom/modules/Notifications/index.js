import { UserOutlined } from '@ant-design/icons'
import ContainerCard from '../../reusables/components/ContainerCard'
import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import styles from './style.module.sass'
import { Col, Empty, message, Row, Spin, Avatar } from 'antd'
import { formatNotifications } from './controller'
import { getNotifications } from '../../lib/agilite-controller'
import dayjs from 'dayjs'
import { useApolloClient } from '@apollo/client'

const formatDate = (date) => {
  const now = new Date()
  const diff = now - date

  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now'
  }
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}d ago`
  }
  // Otherwise return the formatted date and time
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

const Notifications = () => {
  const client = useApolloClient()
  const {
    custom: {
      userAgent: { isTablet, isSmartphone, isMobile },
      desoData: { profile }
    }
  } = useSelector((state) => state)

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const deviceType = useMemo(
    () => ({
      isSmartphone,
      isTablet,
      isMobile
    }),
    [isSmartphone, isTablet, isMobile]
  )

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await getNotifications(profile.publicKey, 1, 50)
      const formattedNotifications = await formatNotifications(response, client)
      setNotifications(formattedNotifications)
    } catch (error) {
      message.error('Failed to load notifications')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Row justify='center'>
      <Col xs={22} xl={20} xxl={16}>
        <ContainerCard title='Notifications' deviceType={deviceType}>
          <button className={styles.refreshButton} onClick={loadNotifications} disabled={loading}>
            Refresh
          </button>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin size='large' />
              <div className={styles.loadingText}>Loading...</div>
            </div>
          ) : notifications.length === 0 ? (
            <Empty description='No notifications to show' />
          ) : (
            <>
              {notifications.filter(Boolean).map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${notification.isRead ? '' : styles.unread}`}
                >
                  <Avatar
                    src={notification.actor.profilePic}
                    icon={!notification.actor.profilePic && <UserOutlined />}
                    className={styles.avatar}
                  />
                  <div className={styles.contentWrapper}>
                    <div className={styles.header}>
                      <span className={styles.username}>{notification.actor.username}</span>
                      <span className={styles.timestamp}>{formatDate(new Date(notification.timestamp))}</span>
                    </div>
                    <span className={styles.description}>{notification.description}</span>
                    {notification.post && <div className={styles.postPreview}>{notification.post.body}</div>}
                  </div>
                </div>
              ))}
            </>
          )}
        </ContainerCard>
      </Col>
    </Row>
  )
}

export default Notifications
