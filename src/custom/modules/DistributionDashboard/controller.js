import Axios from 'agilite-utils/axios'

// Utils
import Enums from '../../lib/enums'
import { getDeSo } from '../../lib/deso-controller'

export const getHodlers = (Username, IsDAOCoin, fetchHodlings) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let response = null
      let errMsg = null

      try {
        response = await Axios.post(Enums.desoUrls.GET_HODLERS, {
          PublicKeyBase58Check: Enums.values.EMPTY_STRING,
          Username,
          LastPublicKeyBase58Check: Enums.values.EMPTY_STRING,
          FetchHodlings: fetchHodlings,
          FetchAll: true,
          IsDAOCoin
        })
        resolve(response.data)
      } catch (e) {
        if (e.response?.data?.message) {
          errMsg = e.response.data.message
        } else {
          errMsg = Enums.messages.UNKNOWN_ERROR
        }

        console.error(e)
        reject(errMsg)
      }
    })()
  })
}

export const payCeatorHodler = (senderKey, receiverKey, creatorKey, amount, type) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let request = null

      try {
        switch (type) {
          // $DESO
          case Enums.values.DESO:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              RecipientPublicKeyOrUsername: receiverKey,
              AmountNanos: Math.round(amount * Enums.values.NANO_VALUE),
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().wallet.sendDesoRequest(request)
            break
          // DAO
          case Enums.values.DAO:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              ProfilePublicKeyBase58CheckOrUsername: creatorKey ? creatorKey : senderKey,
              ReceiverPublicKeyBase58CheckOrUsername: receiverKey,
              // Hex String
              DAOCoinToTransferNanos:
                Enums.values.HEX_PREFIX + (amount * Enums.values.NANO_VALUE * Enums.values.NANO_VALUE).toString(16),
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().dao.transferDAOCoin(request)
            break
          // Creator
          case Enums.values.CREATOR:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              CreatorPublicKeyBase58Check: creatorKey ? creatorKey : senderKey,
              CreatorCoinToTransferNanos: parseInt((amount * Enums.values.NANO_VALUE).toFixed(0)),
              ReceiverUsernameOrPublicKeyBase58Check: receiverKey,
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().wallet.transferCreatorCoin(request)
            break
          default:
            break
        }

        resolve()
      } catch (e) {
        reject(e)
      }
    })()
  })
}

export const payDaoHodler = (senderKey, receiverKey, creatorKey, amount, type) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let request = null

      try {
        switch (type) {
          // $DESO
          case Enums.values.DESO:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              RecipientPublicKeyOrUsername: receiverKey,
              AmountNanos: Math.round(amount * Enums.values.NANO_VALUE),
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().wallet.sendDesoRequest(request)
            break
          // DAO
          case Enums.values.DAO:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              ProfilePublicKeyBase58CheckOrUsername: creatorKey ? creatorKey : senderKey,
              ReceiverPublicKeyBase58CheckOrUsername: receiverKey,
              // Hex String
              DAOCoinToTransferNanos:
                Enums.values.HEX_PREFIX + (amount * Enums.values.NANO_VALUE * Enums.values.NANO_VALUE).toString(16),
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().dao.transferDAOCoin(request)
            break
          // Creator
          case Enums.values.CREATOR:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              CreatorPublicKeyBase58Check: creatorKey ? creatorKey : senderKey,
              CreatorCoinToTransferNanos: parseInt((amount * Enums.values.NANO_VALUE).toFixed(0)),
              ReceiverUsernameOrPublicKeyBase58Check: receiverKey,
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().wallet.transferCreatorCoin(request)
            break
          default:
            break
        }

        resolve()
      } catch (e) {
        reject(e)
      }
    })()
  })
}

export const prepUsersForClipboard = (userList, transactionType) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const tmpResult = []
      let result = null

      try {
        switch (transactionType) {
          case Enums.values.FOLLOWERS:
          case Enums.values.FOLLOWING:
            for (const username of userList) {
              tmpResult.push(`@${username}`)
            }

            break
          case Enums.values.NFT:
          case Enums.values.POST:
            for (const user of userList) {
              tmpResult.push(`@${user.username}`)
            }

            break
          default:
            for (const user of userList) {
              tmpResult.push(`@${user.ProfileEntryResponse.Username}`)
            }
        }

        result = {
          length: tmpResult.length,
          data: `${tmpResult.join(' ')} `
        }
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })()
  })
}
