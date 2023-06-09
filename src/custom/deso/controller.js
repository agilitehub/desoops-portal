import Axios from 'agilite-utils/axios'
import { identity, getNFTCollectionSummary, getSinglePost, getNFTEntriesForPost } from 'deso-protocol'
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

export const getSingleProfile = (key) => {
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
        reject(e)
        console.log(e)
      }
    })()
  })
}

export const getDaoBalance = (publicKey) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let hodlerObject = null
      let exchangeObject = null
      let daoBalance = 0

      try {
        hodlerObject = await Axios.post(Enums.desoUrls.DAO_BALANCE, {
          FetchAll: true,
          FetchHodlings: true,
          IsDAOCoin: true,
          PublicKeyBase58Check: publicKey
        })

        exchangeObject = await Axios.get(Enums.desoUrls.EXCHANGE_RATE)

        if (hodlerObject.data.Hodlers.length > 0) {
          daoBalance = (
            parseInt(hodlerObject.data.Hodlers[0].BalanceNanosUint256) /
            Enums.values.NANO_VALUE /
            Enums.values.NANO_VALUE
          ).toFixed(0)

          if (daoBalance < 1) daoBalance = 0
        }

        resolve({ daoBalance, desoPrice: exchangeObject.data.USDCentsPerDeSoExchangeRate / 100, creatorCoinBalance: 0 })
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
