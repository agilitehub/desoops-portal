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
  const { Metadata } = notification.data
  const {
    TxnType,
    BasicTransferTxindexMetadata,
    BitcoinExchangeTxindexMetadata,
    CreatorCoinTxindexMetadata,
    CreatorCoinTransferTxindexMetadata,
    DAOCoinTransferTxindexMetadata
  } = Metadata

  let type = ''
  let description = ''

  switch (TxnType) {
    case 'CREATOR_COIN':
      type = 'CREATOR_COIN'
      if (CreatorCoinTxindexMetadata) {
        const operation = CreatorCoinTxindexMetadata.OperationType.toLowerCase()
        const amount = formatAmount(
          CreatorCoinTxindexMetadata.DeSoToSellNanos || CreatorCoinTxindexMetadata.CreatorCoinToSellNanos
        )
        description = `${operation} ${amount} of your creator coins`
      }
      break

    case 'CREATOR_COIN_TRANSFER':
      type = 'CREATOR_COIN'
      if (CreatorCoinTransferTxindexMetadata) {
        const amount = formatAmount(CreatorCoinTransferTxindexMetadata.CreatorCoinToTransferNanos)
        description = `transferred you ${amount} creator coins of ${CreatorCoinTransferTxindexMetadata.CreatorUsername}`
      }
      break

    case 'BITCOIN_EXCHANGE':
      type = 'BITCOIN_EXCHANGE'
      if (BitcoinExchangeTxindexMetadata) {
        const amount = formatAmount(BitcoinExchangeTxindexMetadata.NanosCreated)
        description = `exchanged Bitcoin for ${amount} DESO`
      }
      break

    case 'DAO_COIN_TRANSFER':
      type = 'DAO_COIN'
      if (DAOCoinTransferTxindexMetadata) {
        const amount = formatAmount(parseInt(DAOCoinTransferTxindexMetadata.DAOCoinToTransferNanos, 16))
        description = `transferred you ${amount} DAO coins of ${DAOCoinTransferTxindexMetadata.CreatorUsername}`
      }
      break

    case 'BASIC_TRANSFER':
      type = 'TRANSFER'
      if (BasicTransferTxindexMetadata) {
        if (BasicTransferTxindexMetadata.DiamondLevel) {
          const level = BasicTransferTxindexMetadata.DiamondLevel
          description = `gave you ${level} diamond${level > 1 ? 's' : ''}`
        } else {
          const amount = formatAmount(BasicTransferTxindexMetadata.TotalOutputNanos, false)
          description = `sent you ${amount} DESO`
        }
      }
      break
    default:
      type = null
  }

  return { type, description }
}

// Main function to format notifications
export const formatNotifications = async (notifications, client) => {
  const formattedNotifications = await Promise.all(
    notifications.map(async (notification) => {
      // Get notification type and description
      const { type, description } = getNotificationDetails(notification)

      // If type is null, we don't care about this notification and need to skip it
      if (!type) {
        return null
      }

      const { Metadata, Index } = notification.data
      const { BlockHashHex, TransactorPublicKeyBase58Check } = Metadata

      // Get the profile of who triggered the notification
      let actorProfile = null
      try {
        const response = await client.query({
          query: FETCH_SINGLE_PROFILE,
          variables: { publicKey: TransactorPublicKeyBase58Check },
          fetchPolicy: 'no-cache'
        })
        actorProfile = response.data.accountByPublicKey
      } catch (error) {
        console.error('Error fetching actor profile:', error)
      }

      return {
        id: Index,
        timestamp: notification.data.Timestamp,
        type,
        description,
        blockHash: BlockHashHex,
        isRead: notification.isRead,
        actor: {
          publicKey: TransactorPublicKeyBase58Check,
          username: actorProfile?.username || TransactorPublicKeyBase58Check,
          profilePic: actorProfile ? await generateProfilePicUrl(actorProfile.publicKey) : null
        }
      }
    })
  )

  return formattedNotifications.filter(Boolean)
}
