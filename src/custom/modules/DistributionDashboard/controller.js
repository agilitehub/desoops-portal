import Axios from 'agilite-utils/axios'

// Utils
import Enums from '../../lib/enums'
import { getDeSo } from '../../lib/deso-controller'
import { hexToInt } from '../../lib/utils'

export const setupHodlers = (desoProfile, distributeTo) => {
  return new Promise((resolve, reject) => {
    let allHodlers = []
    let tmpHodlers = null
    let coinAmount = 0
    let coinTotal = 0

    try {
      // If user selects DAO or Creator Coin Hodlers, we need to get the relevant users
      switch (distributeTo) {
        case Enums.values.DAO:
          tmpHodlers = JSON.parse(JSON.stringify(desoProfile.daoHodlers))
          break
        case Enums.values.CREATOR:
          tmpHodlers = JSON.parse(JSON.stringify(desoProfile.ccHodlers))
          break
      }

      // Calculate Coin Total and valid Hodlers
      tmpHodlers.map((entry) => {
        // Ignore entry if it does not have a Profile OR if it is the same as current logged in user
        if (entry.ProfileEntryResponse && entry.ProfileEntryResponse.Username !== desoProfile.username) {
          // Set Defaults
          entry.status = Enums.values.EMPTY_STRING

          // Determine Number of Coins based on the Coin Type (value)
          if (distributeTo === Enums.values.DAO) {
            coinAmount = entry.BalanceNanosUint256
            coinAmount = hexToInt(coinAmount)
            coinAmount = coinAmount / Enums.values.NANO_VALUE / Enums.values.NANO_VALUE
          } else {
            coinAmount = entry.BalanceNanos
            coinAmount = coinAmount / Enums.values.NANO_VALUE
          }

          entry.coinAmount = coinAmount
          entry.percentOwnership = coinTotal += coinAmount
          allHodlers.push(entry)
        }

        return null
      })

      calculatePercentages(allHodlers, coinTotal, 'desc', 3)
        .then((result) => {
          allHodlers = result
          resolve({ allHodlers, coinTotal })
        })
        .catch((e) => {
          reject(e)
        })
    } catch (e) {
      reject(e)
    }
  })
}

const calculatePercentages = (hodlers, coinTotal, sortOrder = 'desc', decimalPlaces) => {
  return new Promise((resolve, reject) => {
    const result = hodlers.map((entry) => {
      const percentage = (entry.coinAmount / coinTotal) * 100
      const formattedCoinAmount = decimalPlaces != null ? entry.coinAmount.toFixed(decimalPlaces) : entry.coinAmount
      return { ...entry, percentage, coinAmount: formattedCoinAmount }
    })

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.percentage - b.percentage)
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.percentage - a.percentage)
    }

    resolve(result)
  })
}

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
