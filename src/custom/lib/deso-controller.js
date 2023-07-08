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
      let daoData = null
      let daoHodlers = null
      let ccData = null
      let ccHodlers = null
      let desoPrice = null
      let tmpData = null
      let daoBalance = 0
      let ccBalance = 0
      let followers = 0
      let result = {}

      try {
        result = JSON.parse(JSON.stringify(currentState))

        // Get DeSo Price
        desoPrice = await getExchangeRates()
        desoPrice = desoPrice.USDCentsPerDeSoExchangeRate / 100

        // Get DAO Balance and Hodlers
        daoData = await getHodlersForUser({
          FetchAll: true,
          FetchHodlings: false,
          IsDAOCoin: true,
          PublicKeyBase58Check: publicKey
        })

        tmpData = daoData.Hodlers.find((entry) => entry.ProfileEntryResponse.PublicKeyBase58Check === publicKey)

        if (tmpData) {
          daoBalance =
            parseInt(daoData.Hodlers[0].BalanceNanosUint256) / Enums.values.NANO_VALUE / Enums.values.NANO_VALUE

          // Format daoBalance to be rounded to 4 decimal places
          daoBalance = Math.floor(daoBalance * 10000) / 10000
        }

        daoHodlers = daoData.Hodlers.filter((entry) => entry.ProfileEntryResponse.PublicKeyBase58Check !== publicKey)

        // Get Creator Coin Balance and Hodlers
        ccData = await getHodlersForUser({
          PublicKeyBase58Check: publicKey,
          FetchHodlings: false,
          FetchAll: true,
          IsDAOCoin: false
        })

        tmpData = ccData.Hodlers.find((entry) => entry.ProfileEntryResponse.PublicKeyBase58Check === publicKey)
        if (tmpData) ccBalance = tmpData.BalanceNanos

        ccHodlers = ccData.Hodlers.filter((entry) => entry.ProfileEntryResponse.PublicKeyBase58Check !== publicKey)

        // We know how many the user is following, but we don't know how many are following the user
        followers = await getTotalFollowersOrFollowing(publicKey, Enums.values.FOLLOWERS)

        result.desoPrice = desoPrice
        result.profile.publicKey = publicKey
        result.profile.daoBalance = daoBalance
        result.profile.ccBalance = ccBalance
        result.profile.totalFollowers = followers
        result.profile.totalDAOHodlers = daoHodlers.length
        result.profile.totalCCHodlers = ccHodlers.length
        result.profile.daoHodlers = daoHodlers
        result.profile.ccHodlers = ccHodlers

        resolve(result)
      } catch (e) {
        reject(e)
        console.log(e)
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
