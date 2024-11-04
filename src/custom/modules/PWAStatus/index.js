import React, { useState, useEffect } from 'react'
import { Card, Space, Typography, Button, message } from 'antd'
import { BellOutlined, SendOutlined } from '@ant-design/icons'
import { promptIOSInstall, requestNotificationPermission } from '../../lib/pwa-controller'
import { getMessaging, getToken } from 'firebase/messaging'

const { Text } = Typography

const PWAStatus = () => {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState('default')
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState('checking...')
  const [firebaseToken, setFirebaseToken] = useState(null)
  
  useEffect(() => {
    // Check if iOS install prompt should be shown
    setShowIOSPrompt(promptIOSInstall())
    
    // Check notification permission status
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission)
    }

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setServiceWorkerStatus('active')
      }).catch(() => {
        setServiceWorkerStatus('inactive')
      })
    } else {
      setServiceWorkerStatus('unsupported')
    }
  }, [])
  
  const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission()
    if (permission) {
      setNotificationStatus('granted')
      message.success('Notifications enabled successfully!')
      
      // Get Firebase token after permission is granted
      try {
        const messaging = getMessaging()
        const token = await getToken(messaging, { 
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY 
        })
        
        if (token) {
          setFirebaseToken(token)
          console.log('Firebase token:', token)
          // Here you would typically send this token to your backend
        } else {
          console.log('No registration token available')
        }
      } catch (err) {
        console.error('Error getting Firebase token:', err)
        message.error('Failed to initialize notifications')
      }
    }
  }

  const sendTestNotification = async () => {
    if (!firebaseToken) {
      message.error('Firebase token not available')
      return
    }

    try {
      // Here you would typically call your backend API to send a test notification
      // using the Firebase Admin SDK
      message.success('Test notification sent!')
    } catch (error) {
      console.error('Error sending test notification:', error)
      message.error('Failed to send test notification')
    }
  }

  return (
    <Card title="App Status" style={{ maxWidth: 600, margin: '20px auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {showIOSPrompt && (
          <div style={{ background: '#fffbe6', padding: '10px', borderRadius: '4px' }}>
            To install this app on iOS: tap the share button and then "Add to Home Screen"
          </div>
        )}
        
        <div>
          <Text strong>Service Worker: </Text>
          <Text>{serviceWorkerStatus}</Text>
        </div>

        <div>
          <Text strong>Push Notifications: </Text>
          <Text>{notificationStatus}</Text>
        </div>
        
        {notificationStatus === 'default' && (
          <Button 
            icon={<BellOutlined />}
            onClick={handleEnableNotifications}
          >
            Enable Notifications
          </Button>
        )}

        {notificationStatus === 'granted' && (
          <Button 
            icon={<SendOutlined />}
            onClick={sendTestNotification}
            type="primary"
          >
            Send Test Notification
          </Button>
        )}

        <div style={{ marginTop: 20 }}>
          <Text type="secondary">
            Debug Info:
            <pre style={{ background: '#f5f5f5', padding: 10 }}>
              {JSON.stringify({
                notificationStatus,
                serviceWorkerStatus,
                showIOSPrompt,
                hasFirebaseToken: !!firebaseToken,
                isPWA: window.matchMedia('(display-mode: standalone)').matches,
                isSecureContext: window.isSecureContext,
              }, null, 2)}
            </pre>
          </Text>
        </div>
      </Space>
    </Card>
  )
}

export default PWAStatus
