import {
  identity,
  getNFTCollectionSummary,
  getSinglePost,
  getNFTEntriesForPost,
  getHodlersForUser,
  getExchangeRates,
  getSingleProfile
} from 'deso-protocol'
import Enums from '../../utils/enums'

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

export const getDeSoData = (publicKey) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let daoData = null
      let daoHodlers = null
      let creatorCoinData = null
      let creatorCoinHodlers = null
      let desoPrice = null
      let tmpData = null
      let daoBalance = 0
      let creatorCoinBalance = 0

      try {
        // Get DeSo Price
        desoPrice = await getExchangeRates()
        desoPrice = desoPrice.USDCentsPerDeSoExchangeRate / 100

        // Get DAO Balance and Hodlers
        daoData = await getHodlersForUser({
          FetchAll: true,
          FetchHodlings: true,
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
        creatorCoinData = await getHodlersForUser({
          PublicKeyBase58Check: publicKey,
          FetchHodlings: true,
          FetchAll: true,
          IsDAOCoin: false
        })

        tmpData = creatorCoinData.Hodlers.find((entry) => entry.ProfileEntryResponse.PublicKeyBase58Check === publicKey)
        if (tmpData) creatorCoinBalance = tmpData.BalanceNanos

        creatorCoinHodlers = creatorCoinData.Hodlers.filter(
          (entry) => entry.ProfileEntryResponse.PublicKeyBase58Check !== publicKey
        )

        resolve({ desoPrice, daoBalance, daoHodlers, creatorCoinBalance, creatorCoinHodlers })
      } catch (e) {
        reject(e)
        console.log(e)
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
