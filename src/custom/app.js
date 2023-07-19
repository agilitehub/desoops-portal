// This is the root Component of our React Application.
// Here we determine check to see if the user is logged in via their DeSo Identity.
// If yes, we fetch their DeSo data and display the Distribution Dashboard.
// If no, we display the Login page.
// We also display a loading spinner while we are fetching the user's DeSo data.

import React, { useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'

// App Components
import DistributionDashboard from './modules/DistributionDashboard'
import Login from './modules/Login'
import Toolbar from './modules/Toolbar'
import Spinner from './reusables/components/Spinner'

// Utils
import { setDeSoData, resetState } from './reducer'
import { generateProfilePicUrl, getDeSoData } from './lib/deso-controller'
import Enums from './lib/enums'

const App = () => {
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const [initCompleted, setInitCompleted] = useState(false)
  const [userReturned, setUserReturned] = useState(false)

  useEffect(() => {
    // This function gets a user's profile, balance, and other DeSo data
    // and sets it in the store.
    const getDeSoDataHook = async () => {
      let tmpDeSoData = null
      let desoBalance = 0
      let desoBalanceUSD = 0

      try {
        // Retrieve various data sets from the DeSo blockchain related to the user
        tmpDeSoData = await getDeSoData(currentUser.PublicKeyBase58Check, desoData)

        // Calculate the user's DeSo balance in DeSo and USD
        desoBalance = currentUser.ProfileEntryResponse.DESOBalanceNanos / Enums.values.NANO_VALUE
        desoBalanceUSD = Math.floor(desoBalance * tmpDeSoData.desoPrice * 100) / 100
        desoBalance = Math.floor(desoBalance * 10000) / 10000

        // Add final pieces of user profile information to the DeSo data
        tmpDeSoData.profile = {
          ...tmpDeSoData.profile,
          username: currentUser.ProfileEntryResponse.Username,
          profilePicUrl: generateProfilePicUrl(currentUser.PublicKeyBase58Check),
          desoBalance,
          desoBalanceUSD,
          totalFollowing: currentUser.PublicKeysBase58CheckFollowedByUser.length
        }

        // Set the DeSo data in the redux store
        console.log('tmpDeSoData', tmpDeSoData)
        dispatch(setDeSoData(tmpDeSoData))
        setInitCompleted(true)
      } catch (e) {
        console.error(e)
      }
    }

    if (currentUser) {
      if (!userReturned) {
        setUserReturned(true)
        getDeSoDataHook()
      }
    } else if (!currentUser) {
      resetState()
      setInitCompleted(false)
      setUserReturned(false)
    }
  }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && !initCompleted ? (
        <Spinner tip='Initializing DeSo Ops Portal...' />
      ) : currentUser && !initCompleted ? (
        <Spinner tip='Fetching DeSo Data...' />
      ) : currentUser && initCompleted ? (
        <>
          <Toolbar />
          <DistributionDashboard />
        </>
      ) : (
        <Login />
      )}
    </>
  )
}

export default App
