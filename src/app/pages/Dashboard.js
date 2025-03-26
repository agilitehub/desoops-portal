import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCoins,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import PageLayout from '../components/Layout/PageLayout'

const Dashboard = () => {
  const [selectedDistribution, setSelectedDistribution] = useState('')
  const [myHolders, setMyHolders] = useState(false)
  const [distributionType, setDistributionType] = useState('')
  const [showDistributionSummary, setShowDistributionSummary] = useState(false)

  return (
    <PageLayout>
      <div className="container-padded py-4 md:py-8 max-w-4xl mx-auto">
        {/* Wallet Overview - Grid layout for multiple currencies */}
        <div className="bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl p-2 md:p-4 shadow-lg mb-6 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {/* DESO Balance */}
            <div className="bg-gradient-to-br from-deso-primary via-deso-primary/90 to-deso-accent p-2 md:p-3 rounded-lg text-white shadow-md">
              <div className="text-[10px] md:text-xs font-medium">$DESO</div>
              <div className="text-xs md:text-sm font-bold mt-0.5">0.0005</div>
              <div className="text-[10px] md:text-xs opacity-90">≈ $0.00</div>
            </div>

            {/* DAO Token */}
            <div className="bg-gradient-to-br from-deso-primary via-deso-primary/85 to-deso-accent/90 p-2 md:p-3 rounded-lg text-white shadow-md">
              <div className="text-[10px] md:text-xs font-medium">DAO</div>
              <div className="text-xs md:text-sm font-bold mt-0.5">25.3</div>
              <div className="text-[10px] md:text-xs opacity-90">≈ $12.65</div>
            </div>

            {/* Creator Coin */}
            <div className="bg-gradient-to-br from-deso-primary via-deso-primary/80 to-deso-accent/85 p-2 md:p-3 rounded-lg text-white shadow-md">
              <div className="text-[10px] md:text-xs font-medium">Creator</div>
              <div className="text-xs md:text-sm font-bold mt-0.5">150</div>
              <div className="text-[10px] md:text-xs opacity-90">≈ $75.00</div>
            </div>

            {/* NFT Balance */}
            <div className="bg-gradient-to-br from-deso-primary via-deso-primary/75 to-deso-accent/80 p-2 md:p-3 rounded-lg text-white shadow-md">
              <div className="text-[10px] md:text-xs font-medium">NFTs</div>
              <div className="text-xs md:text-sm font-bold mt-0.5">12</div>
              <div className="text-[10px] md:text-xs opacity-90">Owned</div>
            </div>

            {/* Diamonds */}
            <div className="bg-gradient-to-br from-deso-primary via-deso-primary/70 to-deso-accent/75 p-2 md:p-3 rounded-lg text-white shadow-md">
              <div className="text-[10px] md:text-xs font-medium">Diamonds</div>
              <div className="text-xs md:text-sm font-bold mt-0.5">532</div>
              <div className="text-[10px] md:text-xs opacity-90">Received</div>
            </div>

            {/* Focus */}
            <div className="bg-gradient-to-br from-deso-primary via-deso-primary/65 to-deso-accent/70 p-2 md:p-3 rounded-lg text-white shadow-md">
              <div className="text-[10px] md:text-xs font-medium">Focus</div>
              <div className="text-xs md:text-sm font-bold mt-0.5">1.2k</div>
              <div className="text-[10px] md:text-xs opacity-90">Points</div>
            </div>
          </div>
        </div>

        {/* Setup Wizard - Mobile-friendly steps with dark mode */}
        <div className="bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl shadow-lg mb-6 border border-gray-100 dark:border-gray-700">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-bold text-deso-primary dark:text-white flex items-center">
              <span className="mr-2">1.</span> Select Distribution Type
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            <select 
              className="w-full bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent
                text-deso-primary dark:text-deso-accent font-medium"
              value={selectedDistribution}
              onChange={(e) => setSelectedDistribution(e.target.value)}
            >
              <option value="" className="text-gray-500 dark:text-gray-400">Select who to distribute to</option>
              <option value="creator-coin-holders" className="text-deso-primary dark:text-deso-accent">Creator Coin Holders</option>
              <option value="dao-token-holders" className="text-deso-primary dark:text-deso-accent">DAO Token Holders</option>
              <option value="desoops-users" className="text-deso-primary dark:text-deso-accent">DeSoOps Users</option>
              <option value="followers" className="text-deso-primary dark:text-deso-accent">Followers</option>
              <option value="following" className="text-deso-primary dark:text-deso-accent">Following</option>
              <option value="nft-owners" className="text-deso-primary dark:text-deso-accent">NFT Owners</option>
              <option value="poll-voters" className="text-deso-primary dark:text-deso-accent">Poll Voters</option>
            </select>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-base font-medium text-deso-primary dark:text-deso-accent mb-2">
                  My Holders Only
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className={`py-3 rounded-lg text-center transition-all duration-200 ${
                      !myHolders 
                        ? 'bg-gradient-to-r from-deso-primary to-deso-accent text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setMyHolders(false)}
                  >
                    No
                  </button>
                  <button 
                    className={`py-3 rounded-lg text-center transition-all duration-200 ${
                      myHolders 
                        ? 'bg-gradient-to-r from-deso-primary to-deso-accent text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setMyHolders(true)}
                  >
                    Yes
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-base font-medium text-deso-primary dark:text-deso-accent mb-2">
                  Distribution Token
                </label>
                <select 
                  className="w-full bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                    rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent
                    text-deso-primary dark:text-deso-accent font-medium"
                  value={distributionType}
                  onChange={(e) => setDistributionType(e.target.value)}
                >
                  <option value="" className="text-gray-500">Select token type</option>
                  <option value="deso" className="text-deso-primary">$DESO</option>
                  <option value="creator-coin" className="text-deso-primary">Creator Coin</option>
                  <option value="dao-token" className="text-deso-primary">DAO Token</option>
                  <option value="diamonds" className="text-deso-primary">Diamonds</option>
                  <option value="other-crypto" className="text-deso-primary">Other Crypto</option>
                </select>
              </div>
            </div>

            {distributionType === 'dao-token' && (
              <div>
                <label className="block text-base font-medium text-deso-primary dark:text-deso-accent mb-2">
                  Select DAO Token
                </label>
                <select 
                  className="w-full bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                    rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent
                    text-deso-primary dark:text-deso-accent font-medium"
                >
                  <option value="" className="text-gray-500">Select a DAO token</option>
                </select>
              </div>
            )}
          </div>

          <div className="p-4 border-t dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white 
            dark:from-gray-800 dark:to-gray-700">
            <button 
              onClick={() => setShowDistributionSummary(true)}
              className="w-full py-3 bg-gradient-to-r from-deso-primary to-deso-accent text-white rounded-lg
                hover:shadow-lg transition-all duration-200 flex items-center justify-center text-base font-medium"
            >
              Continue to Distribution
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Distribution Summary - Shown after setup */}
        {showDistributionSummary && (
          <div className="bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-deso-primary dark:text-white flex items-center">
                <span className="mr-2">2.</span> Review & Execute
              </h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                  <span className="text-base text-gray-600 dark:text-gray-300">Total transactions</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">45</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                  <span className="text-base text-gray-600 dark:text-gray-300">$DESO price</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">$8.49</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                  <span className="text-base text-gray-600 dark:text-gray-300">DeSoOps fee</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">$0.045 (~0.0053 $DESO)</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-base text-gray-600 dark:text-gray-300">Distribution cost</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">~$0.045 (~0.0053 $DESO)</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to distribute:
                </label>
                <input
                  type="number"
                  className="w-full bg-white dark:bg-deso-dark border border-gray-300 dark:border-gray-600 
                    rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-deso-primary focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <button className="w-full mt-6 py-4 bg-deso-primary text-white rounded-lg text-lg
                hover:bg-deso-primary/90 transition-colors flex items-center justify-center">
                <FontAwesomeIcon icon={faCoins} className="mr-2" />
                Execute Distribution
              </button>
            </div>
          </div>
        )}

        {/* User Table - Optimized for mobile */}
        <div className="bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-bold text-deso-primary dark:text-white">
              Recipients
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">User</th>
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">Ownership</th>
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">Last Active</th>
                  <th className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Complete setup to view recipients
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard 