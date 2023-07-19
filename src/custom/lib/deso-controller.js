import {
  identity,
  getNFTCollectionSummary,
  getSinglePost,
  getNFTEntriesForPost,
  getHodlersForUser,
  getExchangeRates,
  getSingleProfile,
  getFollowersForUser
} from 'deso-protocol'
import Enums from './enums'
import { desoUserModel } from './data-models'
import { hexToInt } from './utils'

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

export const desoLogout = () => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let response = null

      try {
        response = await identity.logout()
        resolve(response)
      } catch (e) {
        reject(e)
        console.log(e)
      }
    })()
  })
}

export const getDeSoData = (publicKey, currentState) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let daoHodlers = null
      let daoHodlings = null
      let ccHodlers = null
      let ccHodlings = null
      let desoPrice = null
      let desoData = null
      let daoBalance = 0
      let ccBalance = 0
      let followers = 0

      try {
        desoData = JSON.parse(JSON.stringify(currentState))

        desoPrice = await getDeSoPricing()
        ;({ daoHodlers, daoBalance } = await getDAOHodlersAndBalance(publicKey))
        daoHodlings = await getDAOHodlings(publicKey)
        ;({ ccHodlers, ccBalance } = await getCCHodlersAndBalance(publicKey))
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

export const generateProfilePicUrl = (publicKey = '') => {
  const result = `https://blockproducer.deso.org/api/v0/get-single-profile-picture/${publicKey}`
  return result
}

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
        reject(Enums.messages.UNKNOWN_ERROR)
      }
    })()
  })
}

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

export const getUserStateless = (key) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let request = null
      let response = null

      try {
        request = {
          PublicKeyBase58Check: key
        }

        response = await getSingleProfile(request)

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
