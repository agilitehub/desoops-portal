import Axios from 'agilite-utils/axios'

// Utils
import Enums from '../../lib/enums'
import { getDeSo } from '../../lib/deso-controller'

export const setupHodlers = (desoProfile, distributeTo) => {
  return new Promise((resolve, reject) => {
    const selectedTableKeys = []
    let tmpHodlers = null

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

      // Default all entries in Table to be selected
      for (let i = 0; i < tmpHodlers.length; i++) {
        selectedTableKeys.push(tmpHodlers[i].username)
      }

      calculatePercentages(tmpHodlers)
        .then((result) => {
          resolve({ finalHodlers: result.hodlers, selectedTableKeys, tokenTotal: result.tokenTotal })
        })
        .catch((e) => {
          reject(e)
        })
    } catch (e) {
      reject(e)
    }
  })
}

export const updateHodlers = (hodlers, selectedTableKeys, conditions = {}) => {
  return new Promise((resolve, reject) => {
    let tmpHodlers = null
    let isActive = true

    try {
      // If the length of `selectedTableKeys` is less than the length of the `hodlers` array,
      // disable entries from the `hodlers` array where there's no match in the `selectedTableKeys` array.
      tmpHodlers = hodlers.map((entry) => {
        if (!selectedTableKeys.includes(entry.username)) {
          isActive = false
        } else {
          isActive = true
        }

        return { ...entry, isActive }
      })

      calculatePercentages(tmpHodlers)
        .then((result) => {
          resolve({ finalHodlers: result.hodlers, selectedTableKeys, tokenTotal: result.tokenTotal })
        })
        .catch((e) => {
          reject(e)
        })
    } catch (e) {
      reject(e)
    }
  })
}

export const calculatePercentages = (hodlers, sortOrder = 'desc') => {
  return new Promise((resolve, reject) => {
    let percentOwnership = 0
    let percentOwnershipLabel = ''
    let tokenBalanceLabel = ''

    const tokenTotal = hodlers.reduce((total, entry) => {
      // We only want to calculate the percentage for active entries
      if (!entry.isActive) return total
      return total + entry.tokenBalance
    }, 0)

    const result = hodlers.map((entry) => {
      if (entry.isActive) {
        percentOwnership = (entry.tokenBalance / tokenTotal) * 100
        percentOwnershipLabel = (Math.ceil(percentOwnership * 1000) / 1000).toString()
        tokenBalanceLabel = entry.tokenBalance.toString()
      } else {
        percentOwnership = 0
        percentOwnershipLabel = '0'
        tokenBalanceLabel = '0'
      }

      return { ...entry, percentOwnership, percentOwnershipLabel, tokenBalanceLabel }
    })

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.percentage - b.percentage)
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.percentage - a.percentage)
    }

    resolve({ hodlers: result, tokenTotal })
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
