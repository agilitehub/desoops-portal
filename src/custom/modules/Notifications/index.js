import { UserOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './style.module.sass'
import { Empty, message, Spin, Avatar, Card, Drawer } from 'antd'
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

const Notifications = ({ visible, onClose }) => {
  const client = useApolloClient()
  const { profile } = useSelector((state) => state.custom.desoData)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
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
  }, [profile.publicKey, client])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  return (
    <Drawer
      title='Notifications'
      placement='right'
      onClose={onClose}
      open={visible}
      width={500}
    >
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size='large' />
          <div className={styles.loadingText}>Loading...</div>
        </div>
      ) : notifications.length === 0 ? (
        <Empty description='No notifications to show' />
      ) : (
        notifications.map((notification) => (
          <Card key={notification.id} bordered={false}>
            <div>
              <Avatar src={notification.actor.profilePic} icon={!notification.actor.profilePic && <UserOutlined />} />
              <div>
                <span>{notification.actor.username}</span>
                <span>{formatDate(new Date(notification.timestamp))}</span>
                <span>{notification.description}</span>
              </div>
            </div>
          </Card>
        ))
      )}
    </Drawer>
  )
}

export default Notifications
