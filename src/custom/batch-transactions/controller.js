import Axios from 'agilite-utils/axios'
import Enums from '../../utils/enums'
import { getDeSo } from '../deso/controller'

export const getHodlers = (Username, IsDAOCoin) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let response = null
      let errMsg = null

      try {
        response = await Axios.post(Enums.urls.GET_HODLERS, {
          PublicKeyBase58Check: Enums.values.EMPTY_STRING,
          Username,
          LastPublicKeyBase58Check: Enums.values.EMPTY_STRING,
          FetchHodlings: false,
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

export const payCeatorHodler = (senderKey, receiverKey, amount, type) => {
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
              ProfilePublicKeyBase58CheckOrUsername: senderKey,
              ReceiverPublicKeyBase58CheckOrUsername: receiverKey,
              // Hex String
              DAOCoinToTransferNanos: '0x' + (amount * 1000000000 * 1000000000).toString(16),
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().dao.transferDAOCoin(request)
            break
          // Creator
          case Enums.values.CREATOR:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              CreatorPublicKeyBase58Check: senderKey,
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

export const payDaoHodler = (senderKey, receiverKey, amount, type) => {
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
              ProfilePublicKeyBase58CheckOrUsername: senderKey,
              ReceiverPublicKeyBase58CheckOrUsername: receiverKey,
              // Hex String
              DAOCoinToTransferNanos: '0x' + (amount * 1000000000 * 1000000000).toString(16),
              MinFeeRateNanosPerKB: 1000
            }

            await getDeSo().dao.transferDAOCoin(request)
            break
          // Creator
          case Enums.values.CREATOR:
            request = {
              SenderPublicKeyBase58Check: senderKey,
              CreatorPublicKeyBase58Check: senderKey,
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
