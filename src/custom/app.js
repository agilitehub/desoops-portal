// This is the root Component of our React Application.
// Here we determine check to see if the user is logged in via their DeSo Identity.
// If yes, we fetch their DeSo data and display the Distribution Dashboard.
// If no, we display the Login page.
// We also display a loading spinner while we are fetching the user's DeSo data.

import React, { useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'
import { isMobile, isTablet } from 'react-device-detect'

// App Components
import DistributionDashboard from './modules/DistributionDashboard'
import Login from './modules/Login'
import Toolbar from './modules/Toolbar'
import Spinner from './reusables/components/Spinner'

// Utils
import { setDeSoData, setAgiliteData, resetState, setDeviceType } from './reducer'
import {
  generateProfilePicUrl,
  getCCHodlersAndBalance,
  getCCHodlings,
  getDAOHodlersAndBalance,
  getDAOHodlings,
  getDeSoPricing,
  getTotalFollowersOrFollowing
} from './lib/deso-controller'
import Enums from './lib/enums'
import { getAgiliteData } from './lib/agilite-controller'
import logo from './assets/deso-ops-logo-full-v2.png'
import { cloneDeep } from 'lodash'

const App = () => {
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const [initCompleted, setInitCompleted] = useState(false)
  const [userReturned, setUserReturned] = useState(false)
  const [spinTip, setSpinTip] = useState('')

  // Determine Device Type
  useEffect(() => {
    dispatch(setDeviceType({ isMobile, isTablet }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // This function gets a user's profile, balance, and other DeSo data
    // and sets it in the store.
    const getDeSoDataHook = async () => {
      let tmpDeSoData = null
      let tmpAgiliteData = null
      let desoBalance = 0
      let desoBalanceUSD = 0
      let daoHodlings = null
      let ccHodlings = null
      let followers = 0

      try {
        setSpinTip('Initializing DeSo Ops Portal...')
        // First we retrieve configurations from Agilit-e
        tmpAgiliteData = await getAgiliteData()
        dispatch(setAgiliteData(tmpAgiliteData))

        // Retrieve various data sets from the DeSo blockchain related to the user
        tmpDeSoData = cloneDeep(desoData)
        tmpDeSoData.desoPrice = await getDeSoPricing()

        setSpinTip('Fetching DAO Hodlers and Balance...')
        const { daoHodlers, daoBalance } = await getDAOHodlersAndBalance(currentUser.PublicKeyBase58Check)
        daoHodlings = await getDAOHodlings(currentUser.PublicKeyBase58Check)

        setSpinTip('Fetching Creator Coin Hodlers and Balance...')
        const { ccHodlers, ccBalance } = await getCCHodlersAndBalance(currentUser.PublicKeyBase58Check)
        ccHodlings = await getCCHodlings(currentUser.PublicKeyBase58Check)

        setSpinTip('Finalizing Blockchain Data...')
        // We know how many the current User is following, but we don't know how many are following the current User
        followers = await getTotalFollowersOrFollowing(currentUser.PublicKeyBase58Check, Enums.values.FOLLOWERS)

        // Calculate the user's DeSo balance in DeSo and USD
        desoBalance = currentUser.ProfileEntryResponse.DESOBalanceNanos / Enums.values.NANO_VALUE
        desoBalanceUSD = Math.floor(desoBalance * tmpDeSoData.desoPrice * 100) / 100
        desoBalance = Math.floor(desoBalance * 10000) / 10000

        // Update the tmpDeSoData Profile object
        tmpDeSoData.profile.publicKey = currentUser.PublicKeyBase58Check
        tmpDeSoData.profile.username = currentUser.ProfileEntryResponse.Username
        tmpDeSoData.profile.profilePicUrl = await generateProfilePicUrl(currentUser.PublicKeyBase58Check)
        tmpDeSoData.profile.desoBalance = desoBalance
        tmpDeSoData.profile.desoBalanceUSD = desoBalanceUSD

        tmpDeSoData.profile.daoBalance = daoBalance
        tmpDeSoData.profile.ccBalance = ccBalance
        tmpDeSoData.profile.totalFollowers = followers
        tmpDeSoData.profile.totalFollowing = currentUser.PublicKeysBase58CheckFollowedByUser.length
        tmpDeSoData.profile.daoHodlers = daoHodlers
        tmpDeSoData.profile.daoHodlings = daoHodlings
        tmpDeSoData.profile.ccHodlers = ccHodlers
        tmpDeSoData.profile.ccHodlings = ccHodlings

        // Set the DeSo data in the redux store
        // console.log('tmpDeSoData', tmpDeSoData)
        setSpinTip('')
        dispatch(setDeSoData(tmpDeSoData))
        setInitCompleted(true)
      } catch (e) {
        console.error(e)
      }
    }
    console.log('App.js - currentUser', currentUser, userReturned)
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
        <>
          <Spinner tip={spinTip} />
          <center>
            <img src={logo} alt='DeSo Ops Portal' style={{ width: 300 }} />
          </center>
        </>
      ) : currentUser && !initCompleted ? (
        <>
          <Spinner tip={spinTip} />
          <center>
            <img src={logo} alt='DeSo Ops Portal' style={{ width: 300 }} />
          </center>
        </>
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
