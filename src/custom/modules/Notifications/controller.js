import Enums from '../../../custom/lib/enums'
import { FETCH_SINGLE_PROFILE } from '../../../custom/lib/graphql-models'
import { generateProfilePicUrl } from '../../../custom/lib/deso-controller-graphql'

// Helper function to get notification type and description
const formatAmount = (amount, divideTwice = true) => {
  return (
    divideTwice ? amount / Enums.values.NANO_VALUE / Enums.values.NANO_VALUE : amount / Enums.values.NANO_VALUE
  ).toFixed(2)
}

const getNotificationDetails = (notification) => {
  const { tokenType, amountNanos, diamondLevel } = notification

  let description = ''

  switch (tokenType) {
    case 'diamonds':
      description = `gave you ${diamondLevel} diamond${diamondLevel > 1 ? 's' : ''}`
      break

    case 'deso':
      const desoAmount = formatAmount(amountNanos, false)
      description = `sent you ${desoAmount} DESO`
      break

    case 'creatorCoins':
      const ccAmount = formatAmount(amountNanos)
      description = `transferred you ${ccAmount} creator coins`
      break

    case 'socialTokens':
      const stAmount = formatAmount(amountNanos)
      description = `transferred you ${stAmount} social tokens`
      break

    case 'otherCrypto':
      const cryptoAmount = formatAmount(amountNanos)
      description = `exchanged crypto for ${cryptoAmount} DESO`
      break

    default:
      return null
  }

  return { description }
}

// Main function to format notifications
export const formatNotifications = async (notifications, client) => {
  const formattedNotifications = await Promise.all(
    notifications.map(async (notification) => {
      // Get notification type and description
      const { description } = getNotificationDetails(notification)

      // If type is null, we don't care about this notification and need to skip it
      if (!description) {
        return null
      }

      // Get the profile of who triggered the notification
      let actorProfile = null
      try {
        const response = await client.query({
          query: FETCH_SINGLE_PROFILE,
          variables: { publicKey: notification.senderPublicKey },
          fetchPolicy: 'no-cache'
        })
        actorProfile = response.data.accountByPublicKey
      } catch (error) {
        console.error('Error fetching actor profile:', error)
      }

      return {
        _id: notification._id,
        id: notification.id,
        timestamp: notification.transactionDate,
        createdAt: notification.createdAt,
        description,
        unread: notification.unread,
        actor: {
          publicKey: notification.senderPublicKey,
          username: actorProfile?.username || notification.senderPublicKey,
          profilePic: actorProfile ? await generateProfilePicUrl(actorProfile.publicKey) : null
        }
      }
    })
  )

  return formattedNotifications.filter(Boolean)
}
