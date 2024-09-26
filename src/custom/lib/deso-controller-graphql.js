import Store from '../../store'

// This library provide a set of functions that can be used to interact with the DeSo blockchain.
import { cloneDeep } from 'lodash'
import {
  identity,
  getHodlersForUser,
  getExchangeRates,
  sendDeso,
  transferDeSoToken,
  transferCreatorCoin,
  sendDiamonds,
  getAppState
} from 'deso-protocol'
import BigNumber from 'bignumber.js'

import Enums from './enums'
import { desoUserModel } from './data-models'
import { calculateDaysSinceLastActive, cleanString, hexToInt, sortByKey } from './utils'
import nftLogo from '../assets/nft-default-logo.png'
import pollLogo from '../assets/poll-default-logo.png'
import { setupHodlers } from '../modules/DistributionDashboard/controller'
import { resetState } from '../../custom/reducer'

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
    Store.dispatch(resetState())
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

export const processTokenHodlers = async (distributeTo, gqlData, rootState, desoData, configData) => {
  const originalHodlers = []
  let newEntry = null
  let userEntry = null

  try {
    // We need to loop through the tokenBalancesAsCreator array to find the DAO and CC Balances
    // But we also need to separate our own balances, and then create holders arrays
    switch (distributeTo) {
      case Enums.values.DAO:
      case Enums.values.CREATOR:
        gqlData = gqlData.accountByPublicKey.tokenBalancesAsCreator.nodes
        break
      case Enums.values.FOLLOWERS:
        gqlData = gqlData.accountByPublicKey.followers.nodes
        break
      case Enums.values.FOLLOWING:
        gqlData = gqlData.accountByPublicKey.following.nodes
        break
    }

    for (let entry of gqlData) {
      switch (distributeTo) {
        case Enums.values.DAO:
        case Enums.values.CREATOR:
          userEntry = entry.holder || {}
          userEntry.publicKey = entry.hodlerPkid
          break
        case Enums.values.FOLLOWERS:
          userEntry = entry.follower || {}
          userEntry.publicKey = entry.followerPkid
          break
        case Enums.values.FOLLOWING:
          userEntry = entry.followee || {}
          userEntry.publicKey = entry.followedPkid
          break
      }

      // Ignore if entry belongs to current logged in account
      if (userEntry.publicKey === desoData.profile.publicKey) continue
      newEntry = await createUserEntry(entry, userEntry, configData.optOutProfile)

      // Skip if newEntry is null, because it means the user is invalid
      if (newEntry === null) continue
      originalHodlers.push(newEntry)
    }

    if ([Enums.values.FOLLOWERS, Enums.values.FOLLOWING].includes(distributeTo)) {
      sortByKey(originalHodlers, 'username')
    }

    const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(originalHodlers, rootState, desoData)

    return { originalHodlers, finalHodlers, selectedTableKeys, tokenTotal }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const processCustomList = async (gqlData, rootState, desoData, configData, sortByUsername = true) => {
  const originalHodlers = []
  let newEntry = null

  try {
    // We need to loop through the tokenBalancesAsCreator array to find the DAO and CC Balances
    // But we also need to separate our own balances, and then create holders arrays
    gqlData = gqlData.profiles.nodes

    for (const entry of gqlData) {
      newEntry = await createCustomUserEntry(entry, configData.optOutProfile)

      // Skip if newEntry is null, because it means the user is invalid
      if (newEntry === null) continue
      originalHodlers.push(newEntry)
    }

    if (sortByUsername) {
      sortByKey(originalHodlers, 'username')
    }

    const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(originalHodlers, rootState, desoData)

    return { originalHodlers, finalHodlers, selectedTableKeys, tokenTotal }
  } catch (e) {
    return e
  }
}

export const getInitialDeSoData = async (desoData, gqlData, configData) => {
  const daoHodlers = []
  const ccHodlers = []

  let ccHodlings = []
  let daoHodlings = []
  let newEntry = null
  let desoBalance = 0
  let daoBalance = 0
  let ccBalance = 0
  let newDeSoData = null
  let tmpGQLData = null
  let ownEntryCC = null
  let ownEntryDAO = null

  try {
    newDeSoData = cloneDeep(desoData)
    newDeSoData.profile.publicKey = gqlData.accountByPublicKey?.publicKey
    newDeSoData.profile.username = gqlData.accountByPublicKey?.username
    newDeSoData.profile.extraData = gqlData.accountByPublicKey?.extraData
    newDeSoData.profile.description = gqlData.accountByPublicKey?.description
    newDeSoData.profile.profilePicUrl = await generateProfilePicUrl(newDeSoData.profile.publicKey)

    // Fetch the current price of DeSo
    if (gqlData.accountByPublicKey?.desoBalance !== null) {
      desoBalance = gqlData.accountByPublicKey?.desoBalance.balanceNanos / Enums.values.NANO_VALUE
    }

    newDeSoData.desoPrice = await getDeSoPricing(newDeSoData.desoPrice)
    newDeSoData.diamondLevels = await getDiamondLevels()

    // Next, we need to loop through the tokenBalancesAsHodler array to find the DAO and CC Balances
    // and then create hodlings arrays, but we also need to separate our own balances
    tmpGQLData = gqlData.accountByPublicKey?.tokenBalances

    if (tmpGQLData && tmpGQLData.nodes) {
      for (const entry of tmpGQLData.nodes) {
        if (!entry.creator) entry.creator = {}
        entry.creator.publicKey = entry.creatorPkid
        newEntry = await createUserEntry(entry, entry.creator, configData.optOutProfile)

        // Skip if newEntry is null, because it means the user is invalid
        if (newEntry === null) continue

        if (entry.isDaoCoin) {
          if (newEntry.publicKey === newDeSoData.profile.publicKey) {
            daoBalance = newEntry.tokenBalance
            ownEntryDAO = newEntry
          } else {
            daoHodlings.push(newEntry)
          }
        } else {
          if (newEntry.publicKey === newDeSoData.profile.publicKey) {
            ccBalance = newEntry.tokenBalance
            ownEntryCC = newEntry
          } else {
            ccHodlings.push(newEntry)
          }
        }
      }
    }

    // Sort hodling Arrays by username ascending, then if ownEntries are not null, add it to the beginning of the arrays
    ccHodlings = sortByKey(ccHodlings, 'username')
    daoHodlings = sortByKey(daoHodlings, 'username')
    if (ownEntryDAO) daoHodlings.unshift(ownEntryDAO)
    if (ownEntryCC) ccHodlings.unshift(ownEntryCC)

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
    desoPrice = desoPrice.USDCentsPerDeSoExchangeRate / 100
    return desoPrice
  } catch (e) {
    return currDeSoPrice
  }
}

export const getDiamondLevels = async () => {
  let appState = null
  let diamondLevels = null

  try {
    appState = await getAppState()
    diamondLevels = appState.DiamondLevelMap
    return diamondLevels
  } catch (e) {
    throw e
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

export const createUserEntry = (entry, userEntry, optOutProfile) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let newEntry = null
      let tokenBalance = 0
      let desoBalance = 0
      let lastActiveDays = null

      try {
        tokenBalance = entry.balanceNanos / Enums.values.NANO_VALUE
        if (entry.isDaoCoin) tokenBalance = tokenBalance / Enums.values.NANO_VALUE
        tokenBalance = Math.floor(tokenBalance * 10000) / 10000

        // If tokenBalance is NaN, then default to 1
        if (isNaN(tokenBalance)) tokenBalance = 1

        // Determine DeSo Balance
        if (userEntry.desoBalance) {
          desoBalance = userEntry.desoBalance.balanceNanos / Enums.values.NANO_VALUE
          if (isNaN(desoBalance)) desoBalance = 0
        }

        newEntry = desoUserModel()

        // There has to be a User object to be valid
        if (!userEntry) return resolve(null)

        // If there's no username, we need to use the public key in the following format
        if (!userEntry.username) {
          newEntry.hasUsername = false

          userEntry.username = `${userEntry.publicKey.substring(0, 5)}...${userEntry.publicKey.substring(
            userEntry.publicKey.length - 5,
            userEntry.publicKey.length
          )}`
        }

        // Check first if lastActiveTimestamp is null before calculating days
        if (userEntry.transactionStats && userEntry.transactionStats.latestTransactionTimestamp !== null) {
          lastActiveDays = calculateDaysSinceLastActive(userEntry.transactionStats.latestTransactionTimestamp)
        }

        // Finally, we need to check if the user has opted out. Check optOutProfile.recipients[].publicKey to see if the user is in the list
        if (optOutProfile) {
          const optOutIndex = optOutProfile.recipients.findIndex((item) => item.publicKey === userEntry.publicKey)

          if (optOutIndex > -1) {
            newEntry.optedOut = true
          }
        }

        newEntry.publicKey = userEntry.publicKey
        newEntry.username = userEntry.username
        newEntry.lastActiveDays = lastActiveDays
        newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
        newEntry.tokenBalance = tokenBalance
        newEntry.desoBalance = desoBalance

        resolve(newEntry)
      } catch (e) {
        reject(e)
      }
    })()
  })
}

export const createCustomUserEntry = (entry, optOutProfile) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const tokenBalance = 1
      let newEntry = null
      let lastActiveDays = null
      let desoBalance = 0

      try {
        // Determine DeSo Balance
        if (entry.account.desoBalance) {
          desoBalance = entry.account.desoBalance.balanceNanos / Enums.values.NANO_VALUE
          if (isNaN(desoBalance)) desoBalance = 0
        }

        newEntry = desoUserModel()

        // Check first if lastActiveTimestamp is null before calculating days
        if (entry.account.transactionStats && entry.account.transactionStats.latestTransactionTimestamp !== null) {
          lastActiveDays = calculateDaysSinceLastActive(entry.account.transactionStats.latestTransactionTimestamp)
        }

        // Finally, we need to check if the user has opted out. Check optOutProfile.recipients[].publicKey to see if the user is in the list
        if (optOutProfile) {
          const optOutIndex = optOutProfile.recipients.findIndex((item) => item.publicKey === entry.publicKey)

          if (optOutIndex > -1) {
            newEntry.optedOut = true
          }
        }

        newEntry.deSoOpsTransactionCount = entry.transactionCount
        newEntry.publicKey = entry.publicKey
        newEntry.username = entry.username
        newEntry.lastActiveDays = lastActiveDays
        newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
        newEntry.tokenBalance = tokenBalance
        newEntry.desoBalance = desoBalance

        resolve(newEntry)
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
      let lastActiveDays = null

      try {
        for (const entry of data) {
          lastActiveDays = null
          if (followType === Enums.values.FOLLOWERS) {
            tmpEntry = entry.follower
          } else {
            tmpEntry = entry.followee
          }

          // If there's no Username, then the user is invalid
          if (!tmpEntry.username) continue

          if (tmpEntry.transactionStats && tmpEntry.transactionStats.latestTransactionTimestamp !== null) {
            lastActiveDays = calculateDaysSinceLastActive(tmpEntry.transactionStats.latestTransactionTimestamp)
          }

          newEntry = desoUserModel()

          newEntry.publicKey = tmpEntry.publicKey
          newEntry.username = tmpEntry.username
          newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
          newEntry.lastActiveDays = lastActiveDays
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

export const processNFTPost = (nftPost, postHash, isPoll) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let nftMetaData = null

      try {
        nftMetaData = {
          id: postHash,
          imageUrl: nftPost.imageUrls?.length > 0 ? nftPost.imageUrls[0] : isPoll ? pollLogo : nftLogo,
          description: cleanString(nftPost.body ? nftPost.body : '', 100),
          extraData: nftPost.extraData
        }

        resolve(nftMetaData)
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })()
  })
}

export const processNFTEntries = (publicKey, nftEntries) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let nftHodlers = []
      let newEntry = null
      let lastActiveDays = null

      try {
        for (const entry of nftEntries) {
          lastActiveDays = null
          // Ignore if NFT is owned by current user
          if (!entry.owner) entry.owner = {}
          entry.owner.publicKey = entry.ownerPkid
          if (entry.owner.publicKey === publicKey) continue

          // Check if the user is already in the hodlers list
          const userIndex = nftHodlers.findIndex((item) => item.publicKey === entry.owner.publicKey)

          if (userIndex > -1) {
            // User found. Increment token balance
            nftHodlers[userIndex].tokenBalance++
            continue
          }

          if (entry.owner.transactionStats && entry.owner.transactionStats.latestTransactionTimestamp !== null) {
            lastActiveDays = calculateDaysSinceLastActive(entry.owner.transactionStats.latestTransactionTimestamp)
          }

          // User not found. Add to hodlers list
          newEntry = desoUserModel()

          newEntry.publicKey = entry.owner.publicKey
          newEntry.username = entry.owner.username

          if (!newEntry.username) {
            newEntry.hasUsername = false
            newEntry.username = `${newEntry.publicKey.substring(0, 5)}...${newEntry.publicKey.substring(
              newEntry.publicKey.length - 5,
              newEntry.publicKey.length
            )}`
          }

          newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
          newEntry.lastActiveDays = lastActiveDays

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

        resolve(nftHodlers)
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })()
  })
}

export const processPollEntries = (pollEntries, pollOptions) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const pollHodlers = []

      try {
        for (const entry of pollEntries) {
          if (pollOptions.includes(entry.associationValue)) {
            const newEntry = desoUserModel()
            let lastActiveDays = null

            newEntry.publicKey = entry.transactor.publicKey
            newEntry.username = entry.transactor.username

            if (!newEntry.username) {
              newEntry.hasUsername = false
              newEntry.username = `${newEntry.publicKey.substring(0, 5)}...${newEntry.publicKey.substring(
                newEntry.publicKey.length - 5,
                newEntry.publicKey.length
              )}`
            }

            if (
              entry.transactor.transactionStats &&
              entry.transactor.transactionStats.latestTransactionTimestamp !== null
            ) {
              lastActiveDays = calculateDaysSinceLastActive(
                entry.transactor.transactionStats.latestTransactionTimestamp
              )
            }

            newEntry.profilePicUrl = await generateProfilePicUrl(newEntry.publicKey)
            newEntry.lastActiveDays = lastActiveDays

            newEntry.tokenBalance = 1
            pollHodlers.push(newEntry)
          }
        }

        resolve(pollHodlers)
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

export const diamondPosts = async (sender, recipient, postHash, noOfDiamonds) => {
  let response = null

  try {
    response = await sendDiamonds({
      SenderPublicKeyBase58Check: sender,
      ReceiverPublicKeyBase58Check: recipient,
      DiamondPostHashHex: postHash,
      DiamondLevel: noOfDiamonds,
      MinFeeRateNanosPerKB: 1000
    })

    return response
  } catch (e) {
    throw new Error(e)
  }
}
