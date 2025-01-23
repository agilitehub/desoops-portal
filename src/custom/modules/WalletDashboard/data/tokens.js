export const primaryTokens = [
  {
    name: 'DESO',
    amount: 1250,
    value: 45000,
    change: 5.2,
    owned: 1250.45,
    priceUSD: 36,
    image: 'https://openfund.com/images/icon-DESO.png'
  },
  {
    name: 'dUSDC',
    amount: 25000,
    value: 25000,
    change: 0.1,
    owned: 25000,
    priceUSD: 1,
    image: 'https://openfund.com/images/icon-USDC.png'
  }
]

export const otherCrypto = [
  {
    name: 'BTC',
    amount: 0.45,
    value: 25000,
    change: -2.5,
    owned: 0.45,
    priceUSD: 55555.56,
    image: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'SOL',
    amount: 125,
    value: 15000,
    change: 12.5,
    owned: 125,
    priceUSD: 120,
    image: '/placeholder.svg?height=40&width=40'
  },
  {
    name: 'ETH',
    amount: 5.5,
    value: 12500,
    change: 3.2,
    owned: 5.5,
    priceUSD: 2272.73,
    image: '/placeholder.svg?height=40&width=40'
  }
]

export const generateCreatorCoins = () => {
  return Array(100)
    .fill(null)
    .map((_, index) => ({
      key: index,
      name: `Creator${index + 1}`,
      amount: Math.floor(Math.random() * 10000),
      value: Math.floor(Math.random() * 10000),
      change: (Math.random() * 40 - 20).toFixed(2),
      owned: Math.floor(Math.random() * 10000),
      ownership: (Math.random() * 5).toFixed(2),
      priceUSD: (Math.random() * 10).toFixed(2),
      image: '/placeholder.svg?height=40&width=40'
    }))
}
