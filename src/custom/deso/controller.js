import Axios from 'agilite-utils/axios'
import Deso from 'deso-protocol'
import Enums from '../../utils/enums'

const deso = new Deso()

export const desoLogin = () => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const request = 4
        const response = await deso.identity.login(request)
        resolve(response)
      } catch (e) {
        reject(e)
        console.log(e)
      }
    })()
  })
}

export const desoLogout = (publicKey) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      let response = null

      try {
        response = await deso.identity.logout(publicKey)
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

        response = await deso.user.getSingleProfile(request)
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

        response = await deso.nft.getNftCollectionSummary(request)

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

        response = await deso.posts.getSinglePost(request)

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

        response = await deso.nft.getNftEntriesForPostHash(request)

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

        response = await deso.user.getSingleProfile(request)

        resolve(response)
      } catch (e) {
        console.log(e)
        reject(Enums.messages.UNKNOWN_ERROR)
      }
    })()
  })
}

export const getDeSo = () => {
  return deso
}
