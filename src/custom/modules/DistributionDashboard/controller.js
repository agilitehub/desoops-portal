import Axios from 'agilite-utils/axios'

// Utils
import Enums from '../../lib/enums'
import { distributionTemplateModel, distributionTransactionModel } from '../../lib/data-models'
import { cloneDeep } from 'lodash'

export const setupHodlers = async (hodlers, rootState, desoData) => {
  try {
    let percentResult = null
    let tmpHodlers = cloneDeep(hodlers)

    const filterResult = await processHodlerConditions(tmpHodlers, rootState, desoData)

    percentResult = await calculatePercentages(filterResult.hodlers)
    percentResult.hodlers = await calculateEstimatedPayment(
      rootState.distributionAmount,
      rootState.distributionType,
      rootState.spreadAmountBasedOn,
      percentResult.hodlers,
      desoData
    )

    return {
      originalHodlers: hodlers,
      finalHodlers: percentResult.hodlers,
      selectedTableKeys: filterResult.selectedTableKeys,
      tokenTotal: percentResult.tokenTotal
    }
  } catch (e) {
    return e
  }
}

export const updateTableSelection = async (hodlers, rootState, desoData, selectedTableKeys) => {
  try {
    let percentResult = null
    let tmpHodlers = cloneDeep(hodlers)

    // Disable entries from the `hodlers` array where there's no match in the `selectedTableKeys` array.
    tmpHodlers = tmpHodlers.map((entry) => {
      if (!selectedTableKeys.includes(entry.username)) {
        entry.isActive = false
      } else {
        entry.isActive = true
      }

      return entry
    })

    percentResult = await calculatePercentages(tmpHodlers)
    percentResult.hodlers = await calculateEstimatedPayment(
      rootState.distributionAmount,
      rootState.distributionType,
      rootState.spreadAmountBasedOn,
      percentResult.hodlers,
      desoData
    )

    return {
      finalHodlers: percentResult.hodlers,
      selectedTableKeys,
      tokenTotal: percentResult.tokenTotal
    }
  } catch (e) {
    return e
  }
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

export const calculateEstimatedPayment = (
  distributionAmount,
  distributionType,
  spreadAmountBasedOn,
  hodlers,
  desoData
) => {
  let estimatedPaymentToken = null
  let estimatedPaymentUSD = null
  let activeHodlers = 0
  let desoPrice = null

  try {
    // Ignore if there is no amount
    if (distributionAmount === '') return hodlers
    if (distributionType === Enums.paymentTypes.DESO) desoPrice = desoData.desoPrice

    // Count the number of active hodlers based on the `isActive` property being set to true
    activeHodlers = hodlers.reduce((total, entry) => {
      if (entry.isActive) return total + 1
      return total
    }, 0)

    // Calculate the estimated payment for each hodler
    hodlers.forEach((hodler) => {
      estimatedPaymentToken = 0

      if (distributionAmount === '' || !hodler.isActive) {
        estimatedPaymentToken = 0
        estimatedPaymentUSD = 0
      } else if (spreadAmountBasedOn === 'Equal Spread') {
        // Calculate the estimated payment based on an equal distribution
        estimatedPaymentToken = distributionAmount / activeHodlers
      } else if (spreadAmountBasedOn === 'Ownership') {
        // Calculate the estimated payment based on percentage ownership
        estimatedPaymentToken = (distributionAmount * hodler.percentOwnership) / 100
      }

      // Update the estimated payment in tokens
      hodler.estimatedPaymentToken = estimatedPaymentToken

      // Calculate the estimated payment in USD if desoPrice is provided
      if (desoPrice !== null && distributionAmount !== '') {
        estimatedPaymentUSD = estimatedPaymentToken * desoPrice
      } else {
        estimatedPaymentUSD = 0
      }

      hodler.estimatedPaymentUSD = Math.floor(estimatedPaymentUSD * 1000) / 1000

      // Round the estimated payment in tokens to 3 decimal places
      hodler.estimatedPaymentLabel = Math.floor(estimatedPaymentToken * 10000) / 10000
    })

    return hodlers
  } catch (e) {
    return e
  }
}

export const processHodlerConditions = async (hodlers, rootState) => {
  let selectedTableKeys = []

  try {
    const conditions = {
      filterUsers: rootState.filterUsers,
      filterAmountIs: rootState.filterAmountIs,
      filterAmount: rootState.filterAmount,
      returnAmount: rootState.returnAmount,
      lastActiveDays: rootState.lastActiveDays
    }

    if (
      !conditions.filterUsers ||
      (conditions.filterAmount === null &&
        (conditions.returnAmount === null || conditions.returnAmount === undefined) &&
        (conditions.lastActiveDays === null || conditions.lastActiveDays === undefined))
    ) {
      // Step 2: If `conditions` is an empty object, set the `isVisible` property of all entries in the `hodlers` array to `true`.
      hodlers.forEach((hodler) => {
        hodler.isVisible = true
        hodler.isActive = true
      })

      // Reset the `selectedTableKeys` array to include all entries in the `hodlers` array
      selectedTableKeys = hodlers.map((hodler) => hodler.username)
    } else {
      // Step 3: If filterUsers is true, first default the `isVisible` property of all entries in the `hodlers` array to `true`.
      hodlers.forEach((hodler) => {
        hodler.isVisible = true
        hodler.isActive = true
      })

      // Step 4: Set the `isVisible` property of each entry in the `hodlers` array based on whether the `tokenBalance` property is greater than, less than, equal to, or not equal to `conditions.filterAmount`.
      hodlers.forEach((hodler) => {
        if (conditions.filterAmount !== null) {
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

          hodler.isActive = hodler.isVisible
        }

        // Next, if there is a conditions.lastActiveDays, the hodler.isVisible is only true if the holder's lastTransactionTimestamp in the array is less than or equal the conditions.lastActiveDays
        if (
          conditions.lastActiveDays !== null &&
          conditions.lastActiveDays !== undefined &&
          conditions.lastActiveDays !== 0
        ) {
          hodler.isVisible = hodler.isVisible && hodler.lastActiveDays <= conditions.lastActiveDays
          hodler.isActive = hodler.isVisible
        }

        if (hodler.isVisible) {
          selectedTableKeys.push(hodler.username)
        }
      })

      // Now, if there is a conditions.returnAmount, the hodler.isVisible is only true if the holder's index in the array is less than the conditions.returnAmount
      if (conditions.returnAmount !== null && conditions.returnAmount !== 0 && conditions.returnAmount !== undefined) {
        // Set all hodlers.isVisible to false except the top x in the array based on the conditions.returnAmount
        // Also populate the Table Keys
        selectedTableKeys = []
        hodlers = hodlers.filter((hodler) => hodler.isVisible)

        hodlers.forEach((hodler, index) => {
          if (index >= conditions.returnAmount) {
            hodler.isVisible = false
            hodler.isActive = false
          } else {
            selectedTableKeys.push(hodler.username)
          }
        })
      }
    }

    return { hodlers, selectedTableKeys }
  } catch (e) {
    return e
  }
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
        for (const entry of userList) {
          tmpResult.push(`@${entry.username}`)
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

export const generateOptOutLink = async (publicKey) => {
  try {
    // Using the current url, generate a link to the opt-out page
    const url = `${window.location.origin}/optout/${publicKey}`
    return url
  } catch (e) {
    return e
  }
}

export const prepDistributionTransaction = async (desoData, rootState, summaryState, finalHodlers, paymentModal) => {
  let distTransaction = null

  try {
    distTransaction = distributionTransactionModel()

    distTransaction.startedAt = new Date()

    distTransaction.publicKey = desoData.profile.publicKey
    distTransaction.desoPriceUSD = desoData.desoPrice
    distTransaction.feePerTransactionUSD = rootState.feePerTransactionUSD
    distTransaction.distributeTo = rootState.distributeTo
    distTransaction.myHodlers = rootState.myHodlers
    distTransaction.distributeDeSoUser =
      rootState.distributeDeSoUser.length > 0 ? rootState.distributeDeSoUser[0].key : ''
    distTransaction.distributionType = rootState.distributionType
    distTransaction.distributionAmount = rootState.distributionAmount
    distTransaction.tokenToUse = rootState.tokenToUse
    distTransaction.nftId = rootState.nftId

    distTransaction.rules.spreadAmountBasedOn = rootState.spreadAmountBasedOn
    distTransaction.rules.filterUsers = rootState.filterUsers
    distTransaction.rules.filterAmountIs = rootState.filterAmountIs
    distTransaction.rules.filterAmount = rootState.filterAmount || 0
    distTransaction.rules.returnAmount = rootState.returnAmount || 0
    distTransaction.rules.lastActiveDays = rootState.lastActiveDays || 0

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
        isKnownError: hodler.isKnownError,
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

export const prepDistributionTransactionUpdate = async (distTransaction, finalHodlers, paymentModal) => {
  try {
    distTransaction.completedAt = new Date()

    distTransaction.paymentCount = paymentModal.paymentCount
    distTransaction.successCount = paymentModal.successCount
    distTransaction.failCount = paymentModal.failCount
    distTransaction.remainingCount = paymentModal.remainingCount

    // Loop through finalHodlers and add a subset of each entry to the recipients array
    distTransaction.recipients = []

    for (const hodler of finalHodlers) {
      distTransaction.recipients.push({
        publicKey: hodler.publicKey,
        isActive: hodler.isActive,
        isVisible: hodler.isVisible,
        isError: hodler.isError,
        isKnownError: hodler.isKnownError,
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

export const prepDistributionTemplate = async (desoData, rootState, name, rulesEnabled, isUpdate) => {
  let transaction = null

  try {
    transaction = distributionTemplateModel()

    transaction.createdAt = new Date()
    transaction.modifiedAt = isUpdate ? new Date() : transaction.createdAt
    transaction.name = name

    transaction.publicKey = desoData.profile.publicKey
    transaction.distributeTo = rootState.distributeTo
    transaction.myHodlers = rootState.myHodlers
    transaction.distributeDeSoUser = rootState.distributeDeSoUser.length > 0 ? rootState.distributeDeSoUser[0].key : ''
    transaction.distributionType = rootState.distributionType
    transaction.distributionAmount = rootState.distributionAmount
    transaction.tokenToUse = rootState.tokenToUse

    transaction.nftId = rootState.nftMetaData.id || ''
    transaction.nftUrl = rootState.nftUrl || ''
    transaction.nftImageUrl = rootState.nftMetaData.imageUrl || ''
    transaction.nftDescription = rootState.nftMetaData.description || ''
    transaction.nftHodlers = rootState.nftHodlers || []
    transaction.rules.enabled = rulesEnabled
    transaction.rules.spreadAmountBasedOn = rootState.spreadAmountBasedOn
    transaction.rules.filterUsers = rootState.filterUsers
    transaction.rules.filterAmountIs = rootState.filterAmountIs
    transaction.rules.filterAmount = rootState.filterAmount || 0
    transaction.rules.returnAmount = rootState.returnAmount || 0
    transaction.rules.lastActiveDays = rootState.lastActiveDays || 0

    if (transaction.distributeTo === Enums.values.CUSTOM) {
      transaction.customList = rootState.customListModal.userList
    }

    return transaction
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
  delete slimRootState.originalHodlers
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
