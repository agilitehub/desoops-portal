import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faExchangeAlt,
  faCoins,
  faChartLine,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import PageLayout from '../components/Layout/PageLayout'

const CoinSwap = () => {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('deso')
  const [toToken, setToToken] = useState('creator')

  const handleSwap = () => {
    // Handle swap logic here
  }

  return (
    <PageLayout>
      <div className="container-padded py-16 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-deso-primary dark:text-white drop-shadow-[0_8px_16px_rgba(19,66,146,0.5)] dark:drop-shadow-[0_8px_16px_rgba(255,127,80,0.5)]">
            DeSo Coin Swap
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Easily swap between $DESO, Creator Coins, and DAO Tokens with our secure and efficient exchange.
          </p>
        </div>

        {/* Swap Interface */}
        <div className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-8 
          shadow-[0_12px_32px_rgba(19,66,146,0.25)]
          dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)]">
          
          {/* From Token */}
          <div className="mb-6">
            <label className="block text-base font-medium text-deso-primary dark:text-deso-accent mb-2">
              From
            </label>
            <div className="flex gap-4">
              <select 
                className="flex-1 bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                  rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent
                  text-deso-primary dark:text-deso-accent font-medium"
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
              >
                <option value="deso">$DESO</option>
                <option value="creator">Creator Coin</option>
                <option value="dao">DAO Token</option>
              </select>
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                  rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent
                  text-deso-primary dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center my-4">
            <div className="p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full">
              <FontAwesomeIcon 
                icon={faExchangeAlt} 
                className="text-2xl text-deso-primary dark:text-deso-light transform rotate-90" 
              />
            </div>
          </div>

          {/* To Token */}
          <div className="mb-8">
            <label className="block text-base font-medium text-deso-primary dark:text-deso-accent mb-2">
              To
            </label>
            <div className="flex gap-4">
              <select 
                className="flex-1 bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                  rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent
                  text-deso-primary dark:text-deso-accent font-medium"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
              >
                <option value="creator">Creator Coin</option>
                <option value="deso">$DESO</option>
                <option value="dao">DAO Token</option>
              </select>
              <input
                type="number"
                placeholder="0.00"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="flex-1 bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                  rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent
                  text-deso-primary dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="w-full flex justify-center items-center px-6 py-4 rounded-lg text-lg font-semibold
              bg-gradient-to-r from-deso-primary via-deso-blue to-deso-accent text-white
              transition-all duration-200 transform hover:scale-105 
              shadow-[0_8px_24px_rgba(19,66,146,0.5)] hover:shadow-[0_12px_32px_rgba(19,66,146,0.6)]
              dark:from-deso-light dark:via-deso-dodger dark:to-deso-accent
              dark:shadow-[0_8px_24px_rgba(100,190,255,0.5)] dark:hover:shadow-[0_12px_32px_rgba(100,190,255,0.6)]
              relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
              translate-x-[-100%] animate-shimmer group-hover:translate-x-[100%] transition-transform duration-1000" />
            <FontAwesomeIcon icon={faCoins} className="mr-2 relative" />
            <span className="relative">Swap Tokens</span>
          </button>

          {/* Exchange Rate */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="flex justify-between items-center text-sm text-blue-700 dark:text-blue-100">
              <span>Exchange Rate</span>
              <div className="flex items-center">
                <span>1 $DESO = 0.5 Creator Coins</span>
                <FontAwesomeIcon icon={faArrowRight} className="mx-2 text-xs" />
                <span>$8.49</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4">
              <FontAwesomeIcon icon={faCoins} className="text-2xl text-deso-primary dark:text-deso-light" />
            </div>
            <h3 className="text-lg font-semibold text-deso-primary dark:text-white mb-2">Instant Swaps</h3>
            <p className="text-gray-600 dark:text-gray-300">Execute trades instantly with our automated market maker</p>
          </div>
          <div className="text-center">
            <div className="inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4">
              <FontAwesomeIcon icon={faChartLine} className="text-2xl text-deso-primary dark:text-deso-light" />
            </div>
            <h3 className="text-lg font-semibold text-deso-primary dark:text-white mb-2">Best Rates</h3>
            <p className="text-gray-600 dark:text-gray-300">Get competitive rates with minimal slippage</p>
          </div>
          <div className="text-center">
            <div className="inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4">
              <FontAwesomeIcon icon={faShieldHalved} className="text-2xl text-deso-primary dark:text-deso-light" />
            </div>
            <h3 className="text-lg font-semibold text-deso-primary dark:text-white mb-2">Secure Trading</h3>
            <p className="text-gray-600 dark:text-gray-300">Trade with confidence using our secure platform</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default CoinSwap 