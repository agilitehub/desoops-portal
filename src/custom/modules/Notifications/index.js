import React, { useState, useEffect, useCallback, useRef } from 'react'
import dayjs from 'dayjs'

import { UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Empty, message, Spin, Avatar, Card, Drawer, Space, Button } from 'antd'
import { formatNotifications } from './controller'
import { getNotifications, markNotificationsAsRead } from '../../lib/agilite-controller'
import { useApolloClient } from '@apollo/client'
import { setUnreadNotifications } from '../../../custom/reducer'

import styles from './style.module.sass'

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

const Notifications = ({ visible, onClose }) => {
  // Hooks
  const client = useApolloClient()
  const dispatch = useDispatch()
  const { profile, unreadNotifications: unreadCount } = useSelector((state) => ({
    profile: state.custom.desoData.profile,
    unreadNotifications: state.custom.unreadNotifications
  }))

  // Modified state
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [newNotifications, setNewNotifications] = useState([])
  const drawerContentRef = useRef(null)

  const loadNotifications = useCallback(
    async (isInitial = true) => {
      if (isInitial) setLoading(true)

      try {
        const lastTimestamp = isInitial ? null : notifications[notifications.length - 1]?.timestamp
        const response = await getNotifications(profile.publicKey, 30, lastTimestamp)

        const formattedNotifications = await formatNotifications(response, client)

        const tmpNotifications = isInitial ? formattedNotifications : [...notifications, ...formattedNotifications]

        setNotifications(tmpNotifications)
        setHasMore(formattedNotifications.length === 30)

        if (isInitial) dispatch(setUnreadNotifications(tmpNotifications.filter((n) => n.unread).length))
      } catch (error) {
        message.error('Failed to load notifications')
        console.error(error)
      } finally {
        if (isInitial) setLoading(false)
        setLoadingMore(false)
      }
    },
    [profile.publicKey, client, notifications, dispatch]
  )

  const loadMore = async () => {
    setLoadingMore(true)
    await loadNotifications(false)
  }

  const handleOnClose = async () => {
    let tmpUnreadCount = 0
    onClose()

    try {
      tmpUnreadCount = notifications.filter((n) => n.unread).length
      dispatch(setUnreadNotifications(tmpUnreadCount))

      if (tmpUnreadCount > 0) {
        await markNotificationsAsRead(notifications.map((n) => n._id))
      }
    } catch (error) {
      message.error('Failed to mark notifications as read')
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const checkNewNotifications = useCallback(async () => {
    if (!visible || !notifications.length) return

    const newestTimestamp = notifications[0]?.timestamp
    if (!newestTimestamp) return

    try {
      const response = await getNotifications(profile.publicKey, 30, null)
      const formattedNotifications = await formatNotifications(response, client)

      // Filter notifications newer than our newest one
      const newItems = formattedNotifications.filter(
        (notification) => new Date(notification.timestamp) > new Date(newestTimestamp)
      )

      if (newItems.length > 0) {
        setNewNotifications((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map((n) => n._id))
          const uniqueNewItems = newItems.filter((n) => !existingIds.has(n._id))
          return [...uniqueNewItems, ...prev]
        })
      }
    } catch (error) {
      console.error('Failed to check for new notifications:', error)
    }
  }, [visible, notifications, profile.publicKey, client])

  const handleShowNewNotifications = () => {
    let tmpNotifications = null

    setNotifications((prev) => [...newNotifications, ...prev])

    tmpNotifications = [...notifications, ...newNotifications]
    dispatch(setUnreadNotifications(tmpNotifications.filter((n) => n.unread).length))
    setNewNotifications([])

    // Scroll to top smoothly
    if (drawerContentRef.current) {
      drawerContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (visible) return

    loadNotifications()

    const interval = setInterval(() => {
      loadNotifications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)

    // eslint-disable-next-line
  }, [visible])

  useEffect(() => {
    if (!visible) {
      setNewNotifications([])
      return
    }

    // Initial check for new notifications
    checkNewNotifications()

    // Set up polling interval
    const interval = setInterval(checkNewNotifications, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [visible, checkNewNotifications])

  return (
    <Drawer
      title={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>{`Notifications (${unreadCount} unread)`}</span>
        </Space>
      }
      placement='right'
      onClose={handleOnClose}
      open={visible}
      width={500}
      className={styles.drawer}
    >
      <div className={styles.drawerContent} ref={drawerContentRef}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size='large' />
            <div className={styles.loadingText}>Loading...</div>
          </div>
        ) : (
          <>
            {newNotifications.length > 0 && (
              <div className={styles.newNotificationsBar}>
                <Button type='primary' onClick={handleShowNewNotifications}>
                  Show {newNotifications.length} New Notification{newNotifications.length !== 1 ? 's' : ''}
                </Button>
              </div>
            )}

            {notifications.length === 0 ? (
              <Empty description='No notifications to show' />
            ) : (
              <>
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    bordered={false}
                    className={`${notification.unread ? styles.unread : styles.read} ${styles.card}`}
                  >
                    <div className={styles.notificationContent}>
                      <Avatar
                        size={40}
                        src={notification.actor.profilePic}
                        icon={!notification.actor.profilePic && <UserOutlined />}
                        className={styles.avatar}
                      />
                      <div className={styles.notificationDetails}>
                        <div className={styles.notificationHeader}>
                          <span className={styles.username}>{notification.actor.username}</span>
                          <span className={styles.timestamp}>{formatDate(new Date(notification.timestamp))}</span>
                        </div>
                        <div className={styles.description}>{notification.description}</div>
                      </div>
                    </div>
                  </Card>
                ))}

                {hasMore && (
                  <div className={styles.loadMoreContainer}>
                    <Button onClick={loadMore} loading={loadingMore} disabled={!hasMore}>
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Drawer>
  )
}

export default Notifications
