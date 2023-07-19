// This library provide a set of functions that can be used to interact with the DeSo blockchain.
import { cloneDeep } from 'lodash'
import {
  identity,
  getNFTCollectionSummary,
  getSinglePost,
  getNFTEntriesForPost,
  getHodlersForUser,
  getExchangeRates,
  getFollowersForUser
} from 'deso-protocol'
import Enums from './enums'
import { desoUserModel } from './data-models'
import { cleanString, hexToInt } from './utils'

/**
 * Logs the user into the DeSo blockchain.
 *
 * @returns {Promise} A promise that resolves a user object, or rejects when an error occurs.
 */
export const desoLogin = () => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const response = await identity.login()
        resolve(response)
      } catch (e) {
        reject(e)
        console.log(e)
      }
    })()
  })
}

/**
 * Logs the user out of DeSo blockchain.
 *
 * @returns {Promise} A promise that resolves a void, or rejects when an error occurs.
 */
export const desoLogout = () => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        await identity.logout()
        resolve()
      } catch (e) {
        reject(e)
        console.log(e)
      }
    })()
  })
}

/**
 * Fetches various data sets from the DeSo blockchain based on the provided public key.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @param {object} desoDataState - The current desoData Redux state.
 * @returns {object} A promise that resolves a new instance of the desoData Redux state, or rejects when an error occurs.
 */
export const getDeSoData = (publicKey, desoDataState) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let daoHodlings = null
      let ccHodlings = null
      let desoPrice = null
      let desoData = null
      let followers = 0

      try {
        desoData = cloneDeep(desoDataState)

        desoPrice = await getDeSoPricing()
        const { daoHodlers, daoBalance } = await getDAOHodlersAndBalance(publicKey)
        daoHodlings = await getDAOHodlings(publicKey)
        const { ccHodlers, ccBalance } = await getCCHodlersAndBalance(publicKey)
        ccHodlings = await getCCHodlings(publicKey)

        // We know how many the current User is following, but we don't know how many are following the current User
        followers = await getTotalFollowersOrFollowing(publicKey, Enums.values.FOLLOWERS)

        // Update the desoData object
        desoData.desoPrice = desoPrice
        desoData.profile.publicKey = publicKey
        desoData.profile.daoBalance = daoBalance
        desoData.profile.ccBalance = ccBalance
        desoData.profile.totalFollowers = followers
        desoData.profile.daoHodlers = daoHodlers
        desoData.profile.daoHodlings = daoHodlings
        desoData.profile.ccHodlers = ccHodlers
        desoData.profile.ccHodlings = ccHodlings

        resolve(desoData)
      } catch (e) {
        reject(e)
        console.log(e)
      }
    })()
  })
}

/**
 * Fetches the Exchange Rates for the $DESO token.
 *
 * @returns {Promise} A promise that resolves the Coinbase Exchange Rate, or rejects when an error occurs.
 */
export const getDeSoPricing = () => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let desoPrice = null

      try {
        desoPrice = await getExchangeRates()
        desoPrice = desoPrice.USDCentsPerDeSoCoinbase / 100
        resolve(desoPrice)
      } catch (e) {
        reject(e)
      }
    })()
  })
}

/**
 * Uses the User's public key to generate a URL to their profile picture.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @returns {Promise} A promise that resolves the profile picture URL, or rejects when an error occurs.
 */
export const generateProfilePicUrl = (publicKey = '') => {
  const result = `https://blockproducer.deso.org/api/v0/get-single-profile-picture/${publicKey}`
  return result
}

/**
 * Uses the User's public key to fetch all DeSo Users who own the User's DAO Tokens. The DAO Balance is also calculated and returned.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @returns {Promise} A promise that resolves an object that contains an array of DAO Hodlers and the DAO Balance, or rejects when an error occurs.
 */
export const getDAOHodlersAndBalance = (publicKey) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let data = null
      let newEntry = null
      let daoHodlers = []
      let daoBalance = 0
      let tokenBalance = 0

      try {
        data = await getHodlersForUser({
          FetchAll: true,
          FetchHodlings: false,
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

          // Don't add current user to hodlers list, but rather fetch and format their balance
          if (entry.ProfileEntryResponse.PublicKeyBase58Check !== publicKey) {
            newEntry = desoUserModel()

            newEntry.publicKey = entry.ProfileEntryResponse.PublicKeyBase58Check
            newEntry.username = entry.ProfileEntryResponse.Username
            newEntry.profilePicUrl = generateProfilePicUrl(newEntry.publicKey)
            newEntry.tokenBalance = tokenBalance

            daoHodlers.push(newEntry)
          } else {
            daoBalance = tokenBalance
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
          newEntry.profilePicUrl = generateProfilePicUrl(newEntry.publicKey)
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

/**
 * Uses the User's public key to fetch all DeSo Users who own the User's Creator Coins. The Creator Coin Balance is also calculated and returned.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @returns {Promise} A promise that resolves an object that contains an array of Creator Coin Hodlers and the Creator Coin Balance, or rejects when an error occurs.
 */
export const getCCHodlersAndBalance = (publicKey) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let data = null
      let newEntry = null
      let ccHodlers = []
      let ccBalance = 0
      let tokenBalance = 0

      try {
        data = await getHodlersForUser({
          FetchAll: true,
          FetchHodlings: false,
          IsDAOCoin: false,
          PublicKeyBase58Check: publicKey
        })

        for (const entry of data.Hodlers) {
          // Skip if no ProfileEntryResponse
          if (!entry.ProfileEntryResponse) continue

          tokenBalance = entry.BalanceNanos / Enums.values.NANO_VALUE
          tokenBalance = Math.floor(tokenBalance * 10000) / 10000

          // Don't add current user to hodlers list, but rather fetch and format their balance
          if (entry.ProfileEntryResponse.PublicKeyBase58Check !== publicKey) {
            newEntry = desoUserModel()

            newEntry.publicKey = entry.ProfileEntryResponse.PublicKeyBase58Check
            newEntry.username = entry.ProfileEntryResponse.Username
            newEntry.profilePicUrl = generateProfilePicUrl(newEntry.publicKey)
            newEntry.tokenBalance = tokenBalance

            ccHodlers.push(newEntry)
          } else {
            ccBalance = tokenBalance
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
          newEntry.profilePicUrl = generateProfilePicUrl(newEntry.publicKey)
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

/**
 * Uses the User's public key to either fetch the total count of DeSo Users who follow the User, or the total count of the DeSo Users who the User follows.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @param {string} followType - The type of follow to fetch. Either 'followers' or 'following'.
 *
 * @returns {Promise} A promise that resolves the total count of followers or following, or rejects when an error occurs.
 */
export const getTotalFollowersOrFollowing = (publicKey, followType) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let userData = null
      let errMsg = null
      let params = null

      try {
        params = {
          PublicKeyBase58Check: publicKey,
          GetEntriesFollowingUsername: followType === Enums.values.FOLLOWERS
        }

        // First get # of followers
        userData = await getFollowersForUser(params)
        resolve(userData.NumFollowers)
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

/**
 * Uses the User's public key to either fetch the usernames of all DeSo Users who follow the User, or all DeSo Users who the User follows.
 *
 * @param {string} publicKey - The public key of the DeSo User.
 * @param {string} followType - The type of follow to fetch. Either 'followers' or 'following'.
 * @param {number} numberToFetch - The number of followers or following to fetch.
 *
 * @returns {Promise} A promise that resolves an array of DeSo Usernames, or rejects when an error occurs.
 */
export const getFollowersOrFollowing = (publicKey, followType, numberToFetch) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const result = []
      let userData = null
      let errMsg = null
      let params = null
      let user = null

      try {
        params = {
          PublicKeyBase58Check: publicKey,
          GetEntriesFollowingUsername: followType === Enums.values.FOLLOWERS,
          NumToFetch: numberToFetch
        }

        userData = await getFollowersForUser(params)

        for (const item of Object.keys(userData.PublicKeyToProfileEntry)) {
          user = { ...userData.PublicKeyToProfileEntry[item] }
          result.push(user.Username)
        }

        resolve(result)
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

/**
 * Uses the hex value from an NFT URL link to fetch the NFT details.
 *
 * @param {string} postHashHex - The hex value from an NFT URL link.
 *
 * @returns {Promise} A promise that resolves an object containing the NFT details, or rejects when an error occurs.
 */
export const getNFTdetails = (postHashHex) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let request = null
      let response = null

      try {
        request = {
          PostHashHex: postHashHex
        }

        response = await getNFTCollectionSummary(request)
        resolve(response)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })()
  })
}

/**
 * Uses the hex value from an NFT URL link to fetch all NFT entries that exist for the NFT Collection
 *
 * @param {string} postHashHex - The hex value from an NFT URL link.
 *
 * @returns {Promise} A promise that resolves an object containing the NFT entries, or rejects when an error occurs.
 */
export const getNFTEntries = (postHashHex) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let request = null
      let response = null

      try {
        request = {
          PostHashHex: postHashHex
        }

        response = await getNFTEntriesForPost(request)

        resolve(response)
      } catch (e) {
        console.log(e)
        reject(Enums.messages.UNKNOWN_ERROR)
      }
    })()
  })
}

// TODO: Remove these functions from the app once the logic that uses it is refactored
export const getPostDetails = (postHashHex) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let request = null
      let response = null

      try {
        request = {
          PostHashHex: postHashHex,
          CommentLimit: 1000
        }

        response = await getSinglePost(request)

        resolve(response)
      } catch (e) {
        console.log(e)
        reject(Enums.messages.UNKNOWN_ERROR)
      }
    })()
  })
}

export const getDeSo = () => {
  return {}
}
