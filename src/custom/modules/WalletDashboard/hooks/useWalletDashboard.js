import { useState, useEffect } from 'react'

export const usePrimaryTokens = (desoData) => {
  const [primaryTokens, setPrimaryTokens] = useState([])

  useEffect(() => {
    // In a real application, this might be an API call
    setPrimaryTokens([
      {
        name: 'DESO',
        value: desoData.profile.desoBalanceUSD,
        owned: desoData.profile.desoBalance,
        priceUSD: desoData.desoPrice,
        image: 'https://openfund.com/images/icon-DESO.png',
        comingSoon: false
      },
      {
        name: 'dUSDC',
        value: 25000,
        owned: 25000,
        priceUSD: 1,
        image: 'https://openfund.com/images/icon-USDC.png',
        comingSoon: false
      },
      {
        name: 'Focus',
        value: 0,
        owned: 0,
        priceUSD: 0,
        image: '/placeholder.svg?height=40&width=40',
        comingSoon: true
      }
    ])

    // eslint-disable-next-line
  }, [desoData])

  return primaryTokens
}

export const useOtherCrypto = (desoData) => {
  const [otherCrypto, setOtherCrypto] = useState([])

  useEffect(() => {
    setOtherCrypto([
      {
        name: 'BTC',
        value: 25000,
        owned: 0.45,
        priceUSD: 55555.56,
        image: '/placeholder.svg?height=40&width=40',
        comingSoon: false
      },
      {
        name: 'SOL',
        value: 15000,
        owned: 125,
        priceUSD: 120,
        image: '/placeholder.svg?height=40&width=40',
        comingSoon: false
      },
      {
        name: 'ETH',
        value: 12500,
        owned: 5.5,
        priceUSD: 2272.73,
        image: '/placeholder.svg?height=40&width=40',
        comingSoon: false
      }
    ])

    // eslint-disable-next-line
  }, [desoData])

  return otherCrypto
}
