import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Empty, Avatar, Drawer, Space, Button, List } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { formatNotifications, categorizeNotifications, formatDate } from '../controllers'
import { fetchUserNotifications, markNotificationsAsRead } from 'core/infra/agilite-controller'
import { setUnreadCount as setUnreadCountRedux, setNotificationsVisible } from 'core/store/slices/custom/reducer'

const Notifications = () => {
  // Hooks
  const dispatch = useDispatch()
  const initialNotifications = useSelector((state) => state.custom.configData.notifications)
  const initialUnreadCount = useSelector((state) => state.custom.unreadCount)
  const notificationLimit = useSelector((state) => state.custom.configData.notificationLimit)
  const notificationsVisible = useSelector((state) => state.custom.notificationsVisible)
  const profile = useSelector((state) => state.custom.desoData.profile)
  const desoPrice = useSelector((state) => state.custom.desoData.desoPrice)

  // Local state
  const [notifications, setNotifications] = useState([])
  const [tmpNewNotifications, setTmpNewNotifications] = useState([])
  const [newNotificationKey, setNewNotificationKey] = useState(null)
  const [tmpMoreNotifications, setTmpMoreNotifications] = useState([])
  const [moreNotificationKey, setMoreNotificationKey] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [newNotifications, setNewNotifications] = useState([])
  const drawerContentRef = useRef(null)
  const isFirstMount = useRef(true)

  const refreshShortDates = useCallback(() => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        shortDate: formatDate(new Date(notification.transactionDate))
      }))
    )
  }, [])

  // Manages processing of new notifications
  useEffect(() => {
    const init = async () => {
      if (newNotificationKey) {
        let combinedNotifications = []

        // Remove duplicates from tmpNotifications and check if there are any left to process
        const uniqueNotifications = tmpNewNotifications.filter((n) => !notifications.some((n2) => n2.id === n.id))

        setTmpNewNotifications([]) // Clear tmpNewNotifications as they've been processed
        if (uniqueNotifications.length === 0) return

        const formattedNotifications = await formatNotifications(uniqueNotifications, desoPrice)

        // Update notifications
        if (notificationsVisible) {
          const uniqueNewNotifications = formattedNotifications.filter(
            (n) => !newNotifications.some((n2) => n2.id === n.id)
          )
          combinedNotifications = [...uniqueNewNotifications, ...newNotifications, ...notifications] // This is used to determine the unread count
          setNewNotifications([...uniqueNewNotifications, ...newNotifications])
        } else {
          combinedNotifications = [...formattedNotifications, ...notifications]
          setNotifications(combinedNotifications)
        }

        const newUnreadCount = combinedNotifications.filter((n) => n.unread).length
        dispatch(setUnreadCountRedux(newUnreadCount))
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNotificationKey])

  // Manages processing of more notifications
  useEffect(() => {
    const init = async () => {
      if (moreNotificationKey) {
        setHasMore(tmpMoreNotifications.length >= notificationLimit)
        const formattedNotifications = await formatNotifications(tmpMoreNotifications, desoPrice)

        // Update notifications
        setNotifications([...notifications, ...formattedNotifications])
        setTmpMoreNotifications([])
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moreNotificationKey])

  const checkNewNotifications = useCallback(async () => {
    try {
      const response = await fetchUserNotifications(profile.publicKey)
      if (response.length === 0) return
      // Set notification key based on a concatenation of the response
      setNewNotificationKey(response.map((n) => n.id).join('-'))
      setTmpNewNotifications(response)
    } catch (error) {
      console.error('Failed to check for new deposit notifications:', error)
    }
    // }, [profile.publicKey, desoPrice, dispatch])
  }, [profile.publicKey])

  useEffect(() => {
    let intervalId = null

    const init = async () => {
      if (isFirstMount.current) {
        isFirstMount.current = false
        const formattedNotifications = await formatNotifications(initialNotifications, desoPrice)
        const tmpUnreadCount = formattedNotifications.filter((notification) => notification.unread).length

        setNotifications(formattedNotifications)
        setHasMore(formattedNotifications.length >= notificationLimit)
        dispatch(setUnreadCountRedux(tmpUnreadCount))

        intervalId = setInterval(checkNewNotifications, 30000)
      }
    }

    init()

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categorizedNotifications = useMemo(() => categorizeNotifications(notifications || []), [notifications])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const lastTimestamp = notifications[notifications.length - 1].transactionDate
    const response = await fetchUserNotifications(profile.publicKey, lastTimestamp)
    setLoadingMore(false)

    if (response.length === 0) return

    setMoreNotificationKey(response.map((n) => n.id).join('-'))
    setTmpMoreNotifications(response)
    refreshShortDates()
  }

  const handleOnClose = async () => {
    try {
      const tmpUnreadCount = notifications.filter((n) => n.unread).length
      dispatch(setNotificationsVisible(false))
      dispatch(setUnreadCountRedux(0))

      if (tmpUnreadCount > 0) {
        // Mark notifications as read
        setNotifications(notifications.map((n) => ({ ...n, unread: false })))
        await markNotificationsAsRead(notifications.filter((n) => n.unread).map((n) => n.id))
      }
    } catch (error) {
      console.error('Failed to mark deposit notifications as read:', error)
    }
  }

  const handleShowNewNotifications = () => {
    setNotifications([...newNotifications, ...notifications])
    setNewNotifications([])
    refreshShortDates()

    if (drawerContentRef.current) {
      drawerContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Add an effect to refresh dates when drawer opens
  useEffect(() => {
    if (notificationsVisible) {
      refreshShortDates()
    }
  }, [notificationsVisible, refreshShortDates])

  const toTitleCase = (str) => {
    // Convert camelCase to separate words and capitalize each word
    return str
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim() // Remove any leading/trailing spaces
  }

  return (
    <Drawer
      title={
        <Space className='w-full justify-between'>
          <span>{`Deposits (${initialUnreadCount} unread)`}</span>
        </Space>
      }
      placement='right'
      onClose={handleOnClose}
      open={notificationsVisible}
      width={500}
      className='[&_.ant-drawer-body]:h-[calc(100%-60px)] [&_.ant-drawer-body]:overflow-hidden [&_.ant-drawer-body]:p-0 [&_.ant-drawer-header]:sticky [&_.ant-drawer-header]:top-0 [&_.ant-drawer-header]:z-[1] [&_.ant-drawer-header]:border-b [&_.ant-drawer-header]:border-[#f0f0f0]'
    >
      <div className='h-full overflow-y-auto scroll-smooth p-4 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[#888] [&::-webkit-scrollbar-track]:bg-[#f1f1f1] [&::-webkit-scrollbar]:w-1.5' ref={drawerContentRef}>
        <>
          {newNotifications.length > 0 && (
            <div className='sticky z-[1] -mt-[18px] mb-2 flex items-center justify-center border-b border-[#f0f0f0] bg-white/95 px-2 py-3 backdrop-blur-sm'>
              <Button type='primary' onClick={handleShowNewNotifications} className='min-w-[200px] bg-deso-blue-deep/90 hover:!bg-deso-blue-deep'>
                <FontAwesomeIcon icon={faBell} className='mr-2 text-sm' />
                Show {newNotifications.length} New Notification{newNotifications.length !== 1 ? 's' : ''}
              </Button>
            </div>
          )}

          {initialNotifications.length === 0 ? (
            <Empty description='No new deposit notifications to show' />
          ) : (
            <>
              {Object.entries(categorizedNotifications).map(
                ([category, items]) =>
                  items.length > 0 && (
                    <div key={category}>
                      <h3>{toTitleCase(category)}</h3>
                      <List
                        itemLayout='horizontal'
                        dataSource={items}
                        renderItem={(notification) => (
                          <List.Item
                            className={`!mb-0.5 !rounded-[10px] !p-[3px] max-md:mx-[5px] last:!mb-0 ${notification.unread ? 'border-l-[3px] border-l-[#1890ff] bg-[#e6f7ff]' : ''}`}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  size={30}
                                  src={notification.senderPic}
                                  icon={!notification.senderPic && <UserOutlined />}
                                  className='mr-3 h-10 w-10'
                                />
                              }
                              title={
                                <div className='-ml-5 mt-[3px] flex items-center justify-between'>
                                  <span className='mr-2 font-semibold'>{notification.sender}</span>
                                  <span className='mr-[5px] whitespace-nowrap text-xs text-black/45'>{notification.shortDate}</span>
                                </div>
                              }
                              description={
                                <>
                                  <div className='-ml-5 mr-[25px] break-words text-black/85'>{notification.description}</div>
                                  <div className='mr-[5px] mt-2 whitespace-nowrap text-right text-xs text-black/35'>{notification.fullDate}</div>
                                </>
                              }
                            />
                            {notification.icon && (
                              <div className='absolute right-2.5 flex h-full items-center'>
                                <FontAwesomeIcon icon={notification.icon} className='text-lg text-deso-blue-deep/80' />
                              </div>
                            )}
                          </List.Item>
                        )}
                      />
                    </div>
                  )
              )}

              {hasMore && (
                <div className='flex justify-center py-4'>
                  <Button
                    onClick={handleLoadMore}
                    loading={loadingMore}
                    disabled={!hasMore}
                    className='min-w-[200px] cursor-pointer rounded border-none bg-deso-blue-deep/90 px-4 py-1.5 font-medium text-white transition-colors hover:!bg-deso-blue-deep disabled:cursor-not-allowed disabled:bg-deso-blue-deep/50'
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      </div>
    </Drawer>
  )
}

export default Notifications
