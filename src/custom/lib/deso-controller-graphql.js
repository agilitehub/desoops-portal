// This library provide a set of functions that can be used to interact with the DeSo blockchain.
import { cloneDeep } from 'lodash'
import {
  identity,
  getHodlersForUser,
  getExchangeRates,
  sendDeso,
  transferDeSoToken,
  transferCreatorCoin
} from 'deso-protocol'
import BigNumber from 'bignumber.js'

import Enums from './enums'
import { desoUserModel } from './data-models'
import { calculateDaysSinceLastActive, cleanString, hexToInt } from './utils'
import nftLogo from '../assets/nft-default-logo.png'

const desoConfigure = {
  appName: process.env.REACT_APP_NAME,
  spendingLimitOptions: {
    // IsUnlimited: true
    GlobalDESOLimit: 0.5 * 1e9, // 0.1 Deso
    CreatorCoinOperationLimitMap: {
      '': {
        any: 'UNLIMITED'
      }
    },
    DAOCoinOperationLimitMap: {
      '': {
        transfer: 'UNLIMITED'
      }
    },
    TransactionCountLimitMap: {
      SUBMIT_POST: 'UNLIMITED',
      PRIVATE_MESSAGE: 'UNLIMITED',
      BASIC_TRANSFER: 'UNLIMITED',
      DAO_COIN: 'UNLIMITED',
      DAO_COIN_TRANSFER: 'UNLIMITED',
      CREATOR_COIN: 'UNLIMITED',
      CREATOR_COIN_TRANSFER: 'UNLIMITED'
    }
  }
}

export const getDeSoConfig = () => {
  return desoConfigure
}

/**
 * Logs the user into the DeSo blockchain.
 *
 * @returns {Promise} A promise that resolves a user object, or rejects when an error occurs.
 */
export const desoLogin = async () => {
  try {
    return await identity.login()
  } catch (e) {
    return e
  }
}

/**
 * Logs the user out of DeSo blockchain.
 *
 * @returns {Promise} A promise that resolves a void, or rejects when an error occurs.
 */
export const desoLogout = async () => {
  try {
    await identity.logout()
    return
  } catch (e) {
    // Most likely the user cancelled the logout. We can leave it be
    return e
  }
}

export const changeDeSoLimit = async (desoLimitNanos) => {
  return await identity.requestPermissions({
    ...identity.transactionSpendingLimitOptions,
    GlobalDESOLimit: desoLimitNanos
  })
}

/**
 * Finalizes the DeSo Data Object based on the returned GQL data and the DeSo Price
 *
 * @param {object} currentUser - The DeSo User Objecgt.
 * @param {object} desoData - The current desoData Redux state.
 * @returns {object} A promise that resolves a new instance of the desoData Redux state, or rejects when an error occurs.
 */
export const getDeSoData = async (desoData, gqlData) => {
  const daoHodlings = []
  const ccHodlings = []
  let newEntry = null
  let desoBalance = 0
  let newDeSoData = null
  let tmpGQLData = null

  try {
    newDeSoData = cloneDeep(desoData)
    newDeSoData.profile.publicKey = gqlData.accountByPublicKey.publicKey
    newDeSoData.profile.username = gqlData.accountByPublicKey.username
    newDeSoData.profile.profilePicUrl = await generateProfilePicUrl(newDeSoData.profile.publicKey)

    // Fetch the current price of DeSo
    if (gqlData.accountByPublicKey.desoBalance !== null) {
      desoBalance = gqlData.accountByPublicKey.desoBalance.balanceNanos / Enums.values.NANO_VALUE
    }

    newDeSoData.desoPrice = await getDeSoPricing(newDeSoData.desoPrice)

    // We need to loop through the tokenBalancesAsCreator array to find the DAO and CC Balances
    // But we also need to separate our own balances, and then create holders arrays
    tmpGQLData = gqlData.accountByPublicKey.tokenBalancesAsCreator.nodes
    const { daoHodlers, daoBalance } = await getDAOHodlersAndBalance(newDeSoData.profile.publicKey, tmpGQLData)
    const { ccHodlers, ccBalance } = await getCCHodlersAndBalance(newDeSoData.profile.publicKey, tmpGQLData)

    // Next, we need to loop through the tokenBalancesAsHodler array to find the DAO and CC Balances
    // and then create hodlings arrays
    tmpGQLData = gqlData.accountByPublicKey.tokenBalances

    for (const entry of tmpGQLData.nodes) {
      newEntry = await createUserEntry(entry)

      // Skip if newEntry is null, because it means the user is invalid
      if (newEntry === null) continue

      if (entry.isDaoCoin) {
        daoHodlings.push(newEntry)
      } else {
        ccHodlings.push(newEntry)
      }
    }

    // Finalize Data
    newDeSoData.profile.desoBalanceUSD = Math.floor(desoBalance * newDeSoData.desoPrice * 100) / 100
    newDeSoData.profile.desoBalance = Math.floor(desoBalance * 10000) / 10000
    newDeSoData.profile.daoBalance = daoBalance
    newDeSoData.profile.ccBalance = ccBalance
    newDeSoData.profile.daoHodlers = daoHodlers
    newDeSoData.profile.ccHodlers = ccHodlers
    newDeSoData.profile.daoHodlings = daoHodlings
    newDeSoData.profile.ccHodlings = ccHodlings

    return newDeSoData
  } catch (e) {
    return e
  }
}

/**
 * Fetches the Exchange Rates for the $DESO token.
 *
 * @returns {Promise} A promise that resolves the Coinbase Exchange Rate, or rejects when an error occurs.
 */
export const getDeSoPricing = async (currDeSoPrice) => {
  let desoPrice = null

  try {
    desoPrice = await getExchangeRates()
    desoPrice = desoPrice.USDCentsPerDeSoCoinbase / 100
    return desoPrice
  } catch (e) {
    return currDeSoPrice
  }
}

/**
 * Uses the User's public key to generate a URL to their profile picture.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @returns {Promise} A promise that resolves the profile picture URL, or rejects when an error occurs.
 */
export const generateProfilePicUrl = async (publicKey = '') => {
  return `https://blockproducer.deso.org/api/v0/get-single-profile-picture/${publicKey}`
}

export const getDAOHodlersAndBalance = (publicKey, data) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let newEntry = null
      let daoHodlers = []
      let daoBalance = 0

      try {
        for (const entry of data) {
          if (!entry.isDaoCoin) continue

          newEntry = await createUserEntry(entry)

          // Skip if newEntry is null, because it means the user is invalid
          if (newEntry === null) continue

          if (newEntry.publicKey === publicKey) {
            daoBalance = newEntry.tokenBalance
          } else {
            daoHodlers.push(newEntry)
          }
        }

        resolve({ daoHodlers, daoBalance })
      } catch (e) {
        reject(e)
      }
    })()
  })
}

/**
 * Uses the User's public key to fetch all DeSo Users who the User owns DAO Tokens for.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @returns {Promise} A promise that resolves an array of DeSo Users, or rejects when an error occurs.
 */
export const getDAOHodlings = (publicKey) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let data = null
      let newEntry = null
      let daoHodlings = []
      let tokenBalance = 0

      try {
        data = await getHodlersForUser({
          FetchAll: true,
          FetchHodlings: true,
          IsDAOCoin: true,
          PublicKeyBase58Check: publicKey
        })

        for (const entry of data.Hodlers) {
          // Skip if no ProfileEntryResponse
          if (!entry.ProfileEntryResponse) continue

          tokenBalance = entry.BalanceNanosUint256
          tokenBalance = hexToInt(tokenBalance)
          tokenBalance = tokenBalance / Enums.values.NANO_VALUE / Enums.values.NANO_VALUE
          tokenBalance = Math.floor(tokenBalance * 10000) / 10000

          newEntry = desoUserModel()

          newEntry.publicKey = entry.ProfileEntryResponse.PublicKeyBase58Check
          newEntry.username = entry.ProfileEntryResponse.Username
          newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
          newEntry.tokenBalance = tokenBalance

          daoHodlings.push(newEntry)
        }

        resolve(daoHodlings)
      } catch (e) {
        reject(e)
      }
    })()
  })
}

export const createUserEntry = (entry) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let newEntry = null
      let tokenBalance = 0
      let tmpEntry = null
      let lastActiveDays = null

      try {
        tokenBalance = entry.balanceNanos / Enums.values.NANO_VALUE
        if (entry.isDaoCoin) tokenBalance = tokenBalance / Enums.values.NANO_VALUE
        tokenBalance = Math.floor(tokenBalance * 10000) / 10000

        newEntry = desoUserModel()
        tmpEntry = entry.holder || entry.creator

        // If there's no Username, then the user is invalid
        if (!tmpEntry.username) return resolve(null)

        // Check first if lastActiveTimestamp is null before calculating days
        if (tmpEntry.transactionStats.latestTransactionTimestamp !== null) {
          lastActiveDays = calculateDaysSinceLastActive(tmpEntry.transactionStats.latestTransactionTimestamp)
        }

        newEntry.publicKey = tmpEntry.publicKey
        newEntry.username = tmpEntry.username
        newEntry.lastActiveDays = lastActiveDays
        newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
        newEntry.tokenBalance = tokenBalance

        resolve(newEntry)
      } catch (e) {
        reject(e)
      }
    })()
  })
}

export const getCCHodlersAndBalance = (publicKey, data) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let newEntry = null
      let ccHodlers = []
      let ccBalance = 0

      try {
        for (const entry of data) {
          if (entry.isDaoCoin) continue

          newEntry = await createUserEntry(entry)

          // Skip if newEntry is null, because it means the user is invalid
          if (newEntry === null) continue

          if (newEntry.publicKey === publicKey) {
            ccBalance = newEntry.tokenBalance
          } else {
            ccHodlers.push(newEntry)
          }
        }

        resolve({ ccHodlers, ccBalance })
      } catch (e) {
        reject(e)
      }
    })()
  })
}

/**
 * Uses the User's public key to fetch all DeSo Users who the User owns Creator Coins for.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @returns {Promise} A promise that resolves an array of DeSo Users, or rejects when an error occurs.
 */
export const getCCHodlings = (publicKey) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let data = null
      let newEntry = null
      let ccHodlings = []
      let tokenBalance = 0

      try {
        data = await getHodlersForUser({
          FetchAll: true,
          FetchHodlings: true,
          IsDAOCoin: false,
          PublicKeyBase58Check: publicKey
        })

        for (const entry of data.Hodlers) {
          // Skip if no ProfileEntryResponse
          if (!entry.ProfileEntryResponse) continue

          tokenBalance = entry.BalanceNanos / Enums.values.NANO_VALUE
          tokenBalance = Math.floor(tokenBalance * 10000) / 10000

          newEntry = desoUserModel()

          newEntry.publicKey = entry.ProfileEntryResponse?.PublicKeyBase58Check ?? ''
          newEntry.username = entry.ProfileEntryResponse.Username
          newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
          newEntry.tokenBalance = tokenBalance

          ccHodlings.push(newEntry)
        }

        resolve(ccHodlings)
      } catch (e) {
        reject(e)
      }
    })()
  })
}

export const processFollowersOrFollowing = (followType, data) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const result = []
      let errMsg = null
      let tmpEntry = null
      let newEntry = null

      try {
        for (const entry of data) {
          if (followType === Enums.values.FOLLOWERS) {
            tmpEntry = entry.follower
          } else {
            tmpEntry = entry.followee
          }

          // If there's no Username, then the user is invalid
          if (!tmpEntry.username) continue

          newEntry = desoUserModel()

          newEntry.publicKey = tmpEntry.publicKey
          newEntry.username = tmpEntry.username
          newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
          newEntry.lastActiveDays = calculateDaysSinceLastActive(tmpEntry.transactionStats.latestTransactionTimestamp)
          newEntry.tokenBalance = 1

          result.push(newEntry)
        }

        // Sort result by lastActiveDays descending, then by username ascending
        result.sort((a, b) => {
          if (a.lastActiveDays < b.lastActiveDays) {
            return 1
          } else if (a.lastActiveDays > b.lastActiveDays) {
            return -1
          } else {
            if (a.username.toLowerCase() < b.username.toLowerCase()) {
              return -1
            } else if (a.username.toLowerCase() > b.username.toLowerCase()) {
              return 1
            } else {
              return 0
            }
          }
        })

        resolve(result)
      } catch (e) {
        console.error(e)
        reject(errMsg)
      }
    })()
  })
}

export const processNFTs = (nftPost, nftEntries) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let nftMetaData = null
      let nftHodlers = []
      let newEntry = null

      try {
        nftMetaData = {
          id: nftPost.id,
          imageUrl: nftPost.post.imageUrls.length > 0 ? nftPost.post.imageUrls[0] : nftLogo,
          description: cleanString(nftPost.post.body, 100)
        }

        for (const entry of nftEntries) {
          // Check if the user is already in the hodlers list
          const userIndex = nftHodlers.findIndex((item) => item.publicKey === entry.owner.publicKey)

          if (userIndex > -1) {
            // User found. Increment token balance
            nftHodlers[userIndex].tokenBalance++
            continue
          }

          // User not found. Add to hodlers list
          newEntry = desoUserModel()

          newEntry.publicKey = entry.owner.publicKey
          newEntry.username = entry.owner.username
          newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
          newEntry.lastActiveDays = calculateDaysSinceLastActive(
            entry.owner.transactionStats.latestTransactionTimestamp
          )

          newEntry.tokenBalance = 1
          nftHodlers.push(newEntry)
        }

        // Sort nftHodlers by tokenBalance descending, then by username ascending
        nftHodlers.sort((a, b) => {
          if (a.tokenBalance < b.tokenBalance) {
            return 1
          } else if (a.tokenBalance > b.tokenBalance) {
            return -1
          } else {
            if (a.username.toLowerCase() < b.username.toLowerCase()) {
              return -1
            } else if (a.username.toLowerCase() > b.username.toLowerCase()) {
              return 1
            } else {
              return 0
            }
          }
        })

        resolve({ nftMetaData, nftHodlers })
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })()
  })
}

/**
 * Sends DESO from one user to another.
 * @async
 * @function
 * @param {string} sender - The public key of the sender.
 * @param {string} recipient - The public key or username of the recipient.
 * @param {number} amount - The amount of DESO to send, in nanos.
 * @returns {Promise<Object>} - A Promise that resolves with the response from the identity.sendDeso call.
 * @throws {Error} - Throws an error if the identity.sendDeso call fails.
 */
export const sendDESO = async (sender, recipient, amount) => {
  let response = null

  try {
    response = await sendDeso({
      SenderPublicKeyBase58Check: sender,
      RecipientPublicKeyOrUsername: recipient,
      AmountNanos: Math.round(amount * Enums.values.NANO_VALUE),
      MinFeeRateNanosPerKB: 1000
    })

    return response
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * Sends DAO tokens from one user to another.
 * @async
 * @function
 * @param {string} sender - The public key of the sender.
 * @param {string} recipient - The public key or username of the recipient.
 * @param {string} token - The public key or username of the DAO token to be sent.
 * @param {number} amount - The amount of DAO tokens to send, in nanos as a hex string.
 * @returns {Promise<Object>} - A Promise that resolves with the response from the transferDeSoToken call.
 * @throws {Error} - Throws an error if the transferDeSoToken call fails.
 */
export const sendDAOTokens = async (sender, recipient, token, amount) => {
  let response = null
  let finalAmount = null
  let hexAmount = null

  try {
    finalAmount = Math.floor(amount * Enums.values.NANO_VALUE * Enums.values.NANO_VALUE).toString()
    finalAmount = new BigNumber(finalAmount)
    hexAmount = finalAmount.toString(16)
    finalAmount = Enums.values.HEX_PREFIX + hexAmount

    response = await transferDeSoToken({
      SenderPublicKeyBase58Check: sender,
      ProfilePublicKeyBase58CheckOrUsername: token,
      ReceiverPublicKeyBase58CheckOrUsername: recipient,
      DAOCoinToTransferNanos: finalAmount,
      MinFeeRateNanosPerKB: 1000
    })

    return response
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * Sends Creator Coins from one user to another.
 * @async
 * @function
 * @param {string} sender - The public key of the sender.
 * @param {string} recipient - The public key or username of the recipient.
 * @param {string} creatorCoin - The public key of the Creator Coin to be sent.
 * @param {number} amount - The amount of Creator Coins to send, in nanos.
 * @returns {Promise<Object>} - A Promise that resolves with the response from the sendCreatorCoins call.
 * @throws {Error} - Throws an error if the sendCreatorCoins call fails.
 */
export const sendCreatorCoins = async (sender, recipient, creatorCoin, amount) => {
  let response = null

  try {
    response = await transferCreatorCoin({
      SenderPublicKeyBase58Check: sender,
      CreatorPublicKeyBase58Check: creatorCoin,
      ReceiverUsernameOrPublicKeyBase58Check: recipient,
      CreatorCoinToTransferNanos: Math.floor(amount * Enums.values.NANO_VALUE),
      MinFeeRateNanosPerKB: 1000
    })

    return response
  } catch (e) {
    throw new Error(e)
  }
}
