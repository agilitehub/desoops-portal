import Axios from 'agilite-utils/axios'

// Utils
import Enums from '../../lib/enums'
import { distributionTransactionModel } from '../../lib/data-models'
import { cloneDeep } from 'lodash'

export const setupHodlers = (hodlers) => {
  return new Promise(async (resolve, reject) => {
    const selectedTableKeys = []
    let percentResult = null

    try {
      // Default all entries in Table to be selected
      for (let i = 0; i < hodlers.length; i++) {
        selectedTableKeys.push(hodlers[i].username)
      }

      percentResult = await calculatePercentages(hodlers)
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

        hodler.estimatedPaymentUSD = Math.floor(estimatedPaymentUSD * 1000) / 1000

        // Round the estimated payment in tokens to 3 decimal places
        hodler.estimatedPaymentLabel = Math.floor(estimatedPaymentToken * 10000) / 10000
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
      if (!conditions.filterUsers || conditions.filterAmount === null) {
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

export const prepUsersForClipboard = (userList) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const tmpResult = []
      let result = null

      try {
        for (const username of userList) {
          tmpResult.push(`@${username}`)
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

export const prepDistributionTransaction = async (
  desoData,
  rootState,
  summaryState,
  finalHodlers,
  paymentModal,
  isUpdate,
  startedAt
) => {
  let distTransaction = null

  try {
    distTransaction = distributionTransactionModel()

    distTransaction.startedAt = startedAt || new Date()
    if (isUpdate) distTransaction.completedAt = new Date()

    distTransaction.publicKey = desoData.profile.publicKey
    distTransaction.desoPriceUSD = desoData.desoPrice
    distTransaction.feePerTransactionUSD = rootState.feePerTransactionUSD
    distTransaction.distributeTo = rootState.distributeTo
    distTransaction.distributionType = rootState.distributionType
    distTransaction.distributionAmount = rootState.distributionAmount
    distTransaction.tokenToUse = rootState.tokenToUse
    distTransaction.nftId = rootState.nftId

    distTransaction.rules.spreadAmountBasedOn = rootState.spreadAmountBasedOn
    distTransaction.rules.filterUsers = rootState.filterUsers
    distTransaction.rules.filterAmountIs = rootState.filterAmountIs
    distTransaction.rules.filterAmount = rootState.filterAmount || 0

    distTransaction.totalFeeUSD = summaryState.totalFeeUSD
    distTransaction.totalFeeDESO = summaryState.totalFeeDESO

    distTransaction.paymentCount = paymentModal.paymentCount
    distTransaction.successCount = paymentModal.successCount
    distTransaction.failCount = paymentModal.failCount
    distTransaction.remainingCount = paymentModal.remainingCount

    // Loop through finalHodlers and add a subset of each entry to the recipients array
    for (const hodler of finalHodlers) {
      distTransaction.recipients.push({
        publicKey: hodler.publicKey,
        isActive: hodler.isActive,
        isVisible: hodler.isVisible,
        isError: hodler.isError,
        errorMessage: hodler.errorMessage,
        tokenBalance: hodler.tokenBalance,
        estimatedPaymentToken: hodler.estimatedPaymentToken,
        estimatedPaymentUSD: hodler.estimatedPaymentUSD,
        percentOwnership: hodler.percentOwnership
      })
    }

    return distTransaction
  } catch (e) {
    throw new Error(e)
  }
}

export const slimRootState = async (rootState) => {
  let slimRootState = cloneDeep(rootState)

  // check if nftMetaData is empty, if no, set the nftId to metaData.id
  if (Object.keys(slimRootState.nftMetaData).length > 0) {
    slimRootState.nftId = slimRootState.nftMetaData.id
  }

  delete slimRootState.loading
  delete slimRootState.isExecuting
  delete slimRootState.activeRulesTab
  delete slimRootState.distributionAmountEnabled
  delete slimRootState.finalHodlers
  delete slimRootState.selectedTableKeys
  delete slimRootState.tokenTotal
  delete slimRootState.nftUrl
  delete slimRootState.nftMetaData
  delete slimRootState.nftHodlers
  delete slimRootState.openNftSearch
  delete slimRootState.paymentModal

  return slimRootState
}
