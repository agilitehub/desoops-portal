import Axios from 'agilite-utils/axios'

// Utils
import Enums from '../../lib/enums'
import { getDeSo } from '../../lib/deso-controller'

export const setupHodlers = (desoProfile, distributeTo) => {
  return new Promise(async (resolve, reject) => {
    const selectedTableKeys = []
    let tmpHodlers = null
    let percentResult = null

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

      percentResult = await calculatePercentages(tmpHodlers)
      resolve({ finalHodlers: percentResult.hodlers, selectedTableKeys, tokenTotal: percentResult.tokenTotal })
    } catch (e) {
      reject(e)
    }
  })
}

export const updateHodlers = (
  hodlers,
  selectedTableKeys,
  conditions,
  distributionAmount,
  spreadAmountBasedOn,
  desoPrice
) => {
  return new Promise(async (resolve, reject) => {
    let result = null

    try {
      // If conditions are passed in, either as an empty Object or a populated Object, we need to first process the `hodlers` array
      // If conditions is an empty object, we need to set all entries to be visible by populating the `isVisible` property
      // If conditions is a populated object, we need to set all entries to be inactive by populating the `isVisible` property...
      // ...by using conditions.filterAmountIs to check if the tokenBalance in each entry is >, <, >=, or <= conditions.filterAmount
      if (conditions) {
        result = await processHodlerConditions(hodlers, conditions)
        // Hodlers does not need to be set here as it is already set in processHodlerConditions
        selectedTableKeys = result.selectedTableKeys
      }

      // Disable entries from the `hodlers` array where there's no match in the `selectedTableKeys` array.
      hodlers = hodlers.map((entry) => {
        if (!selectedTableKeys.includes(entry.username)) {
          entry.isActive = false
        } else {
          entry.isActive = true
        }

        return entry
      })

      result = await calculatePercentages(hodlers)
      await calculateEstimatedPayment(hodlers, distributionAmount, spreadAmountBasedOn, desoPrice)

      resolve({ finalHodlers: hodlers, selectedTableKeys, tokenTotal: result.tokenTotal })
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

    try {
      const tokenTotal = hodlers.reduce((total, entry) => {
        // We only want to calculate the percentage for active entries
        if (!entry.isActive) return total
        return total + entry.tokenBalance
      }, 0)

      hodlers.map((entry) => {
        if (entry.isActive && entry.tokenBalance > 0) {
          percentOwnership = (entry.tokenBalance / tokenTotal) * 100
          percentOwnershipLabel = Math.floor(percentOwnership * 1000) / 1000
          tokenBalanceLabel = entry.tokenBalance.toString()
        } else {
          percentOwnership = 0
          percentOwnershipLabel = '0'
          tokenBalanceLabel = '0'
        }

        entry.percentOwnership = percentOwnership
        entry.percentOwnershipLabel = percentOwnershipLabel
        entry.tokenBalanceLabel = tokenBalanceLabel

        return null
      })

      if (sortOrder === 'asc') {
        hodlers.sort((a, b) => a.percentage - b.percentage)
      } else if (sortOrder === 'desc') {
        hodlers.sort((a, b) => b.percentage - a.percentage)
      }

      resolve({ hodlers, tokenTotal })
    } catch (e) {
      reject(e)
    }
  })
}

export const calculateEstimatedPayment = (hodlers, amount, spreadAmountBasedOn, desoPrice) => {
  return new Promise((resolve, reject) => {
    let estimatedPaymentToken = null
    let estimatedPaymentLabel = null
    let estimatedPaymentUSD = null
    let activeHodlers = 0

    try {
      // Count the number of active hodlers based on the `isActive` property being set to true
      activeHodlers = hodlers.reduce((total, entry) => {
        if (entry.isActive) return total + 1
        return total
      }, 0)

      // Calculate the estimated payment for each hodler
      hodlers.forEach((hodler) => {
        estimatedPaymentToken = 0
        estimatedPaymentLabel = ''

        if (amount === '' || !hodler.isActive) {
          estimatedPaymentToken = 0
          estimatedPaymentUSD = 0
        } else if (spreadAmountBasedOn === 'Equal Spread') {
          // Calculate the estimated payment based on an equal distribution
          estimatedPaymentToken = amount / activeHodlers
        } else if (spreadAmountBasedOn === 'Ownership') {
          // Calculate the estimated payment based on percentage ownership
          estimatedPaymentToken = (amount * hodler.percentOwnership) / 100
        }

        // Update the estimated payment in tokens
        hodler.estimatedPaymentToken = estimatedPaymentToken

        // Calculate the estimated payment in USD if desoPrice is provided
        if (desoPrice !== null && amount !== '') {
          estimatedPaymentUSD = estimatedPaymentToken * desoPrice
        } else {
          estimatedPaymentUSD = 0
        }

        hodler.estimatedPaymentUSD = estimatedPaymentUSD

        // Round the estimated payment in tokens to 3 decimal places and stringify it
        estimatedPaymentLabel = Math.floor(estimatedPaymentToken * 10000) / 10000
        hodler.estimatedPaymentLabel = estimatedPaymentLabel
      })

      resolve(hodlers)
    } catch (e) {
      reject(e)
    }
  })
}

const processHodlerConditions = (hodlers, conditions) => {
  return new Promise((resolve, reject) => {
    let selectedTableKeys = []

    try {
      if (!conditions.filterUsers || conditions.filterAmount === '') {
        // Step 2: If `conditions` is an empty object, set the `isVisible` property of all entries in the `hodlers` array to `true`.
        hodlers.forEach((hodler) => {
          hodler.isVisible = true
        })

        // Reset the `selectedTableKeys` array to include all entries in the `hodlers` array
        selectedTableKeys = hodlers.map((hodler) => hodler.username)
      } else {
        // Step 3: If filterUsers is true, first default the `isVisible` property of all entries in the `hodlers` array to `false`.
        hodlers.forEach((hodler) => {
          hodler.isVisible = false
        })

        // Step 4: Set the `isVisible` property of each entry in the `hodlers` array based on whether the `tokenBalance` property is greater than, less than, equal to, or not equal to `conditions.filterAmount`.
        hodlers.forEach((hodler) => {
          switch (conditions.filterAmountIs) {
            case '>':
              hodler.isVisible = hodler.tokenBalance > conditions.filterAmount
              break
            case '<':
              hodler.isVisible = hodler.tokenBalance < conditions.filterAmount
              break
            case '>=':
              hodler.isVisible = hodler.tokenBalance >= conditions.filterAmount
              break
            case '<=':
              hodler.isVisible = hodler.tokenBalance <= conditions.filterAmount
              break
          }

          if (hodler.isVisible) {
            selectedTableKeys.push(hodler.username)
          }
        })
      }

      resolve({ hodlers, selectedTableKeys })
    } catch (e) {
      reject(e)
    }
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
