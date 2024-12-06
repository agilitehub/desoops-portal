import { faGem, faUsers, faDollarSign, faCoins, faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import Enums from '../../../custom/lib/enums'
import { generateProfilePicUrl } from '../../../custom/lib/deso-controller-graphql'

export const formatDate = (date) => {
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
  // Less than 30 days
  if (diff < 2592000000) {
    const days = Math.floor(diff / 86400000)
    return `${days}d ago`
  }

  // For older dates, just return ' > 30d ago'
  return ' > 30d ago'
}

export const formatNotifications = async (notifications, desoPrice) => {
  const result = []

  let entry = null
  let amount = null
  let usd = null
  let tmpDescription = null
  let description = null
  let icon = null
  let nanoValue = Enums.values.NANO_VALUE

  for (const notification of notifications) {
    switch (notification.tokenType) {
      case 'diamonds':
        amount = notification.diamondLevel
        usd = Math.floor(((notification.amountNanos / nanoValue) * desoPrice) * 1000) / 1000
        tmpDescription = `Diamond(s) (~$${usd})`
        icon = faGem

        break
      case 'deso':
        amount = notification.amountNanos / nanoValue
        usd = Math.floor(amount * desoPrice * 10000) / 10000
        tmpDescription = `$DESO (~$${usd})`
        icon = faDollarSign
        break
      case 'creatorCoins':
        amount = notification.amountNanos / nanoValue
        tmpDescription = `$${notification.tokenUser} Creator Coin(s)`
        icon = faCoins
        break
      case 'socialTokens':
        amount = notification.amountNanos / nanoValue / nanoValue
        tmpDescription = `$${notification.tokenUser} Social Token(s)`
        icon = faUsers
        break
      default:
        amount = notification.amountNanos / nanoValue / nanoValue
        tmpDescription = `$${notification.tokenUser} token(s)`
        icon = faBitcoinSign
    }

    description = `sent you ${amount} ${tmpDescription}`

    entry = {
      id: notification.id,
      unread: notification.unread,
      transactionDate: notification.transactionDate,
      shortDate: formatDate(new Date(notification.transactionDate)),
      fullDate: dayjs(notification.transactionDate).format('YYYY-MM-DD HH:mm'),
      user: notification.user,
      userPic: await generateProfilePicUrl(notification.publicKey),
      sender: notification.sender,
      senderPic: await generateProfilePicUrl(notification.senderPublicKey),
      tokenUser: notification.tokenUser,
      tokenPic: notification.tokenKey ? await generateProfilePicUrl(notification.tokenKey) : null,
      usd,
      amount,
      description,
      usdExchangeRate: notification.usdExchangeRate,
      icon
    }

    result.push(entry)
  }

  return result
}

export const categorizeNotifications = (notifications) => {
  const today = []
  const thisWeek = []
  const older = []

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfThisWeek = new Date(startOfToday)
  const currentDay = startOfToday.getDay()
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1
  startOfThisWeek.setDate(startOfToday.getDate() - daysToSubtract)

  notifications.forEach((notification) => {
    const notificationDate = new Date(notification.transactionDate)

    if (notificationDate >= startOfToday) {
      today.push(notification)
    } else if (notificationDate >= startOfThisWeek) {
      thisWeek.push(notification)
    } else {
      older.push(notification)
    }
  })

  return { today, thisWeek, older }
}