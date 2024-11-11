// This is the root Component of our React Application.
// Here we determine check to see if the user is logged in via their DeSo Identity.
// If yes, we fetch their DeSo data and display the Distribution Dashboard.
// If no, we display the Login page.
// We also display a loading spinner while we are fetching the user's DeSo data.

import React, { useContext, useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'
import { isMobile, isTablet } from 'react-device-detect'
import { useApolloClient } from '@apollo/client'
import { Spin } from 'antd'

// App Components
import DistributionDashboard from '../DistributionDashboard'
import PWAManager from '../PWAManager'
import Login from '../Login'
import Toolbar from '../Toolbar'
import EditProfile from '../EditProfile'

// Utils
import Enums from '../../lib/enums'
import logo from '../../assets/deso-ops-logo-full.png'
import {
  setDeSoData,
  setConfigData,
  resetState,
  setDeviceType,
  setDeSoPrice,
  setDistributionTemplates,
  setEditProfileVisible
} from '../../reducer'
import { initUserSession, getDistributionTemplates, updateFCMToken } from '../../lib/agilite-controller'

import { renderApp } from './controller'
import { getDeSoPricing, getInitialDeSoData } from '../../lib/deso-controller-graphql'
import { GQL_GET_INITIAL_DESO_DATA } from '../../lib/graphql-models'

import './style.sass'
import Notifications from '../Notifications'
import { initializeMessaging, messaging, requestFirebaseToken } from '../../lib/firebase-controller'
import { checkSupport, detectBrowser, detectDevice } from '../PWAManager/controller'
import UpdateChecker from '../PWAUpdateChecker'

const initialState = {
  initializing: false,
  renderState: Enums.appRenderState.LOGIN,
  userReturned: false,
  spinTip: Enums.spinnerMessages.INIT
}

const reducer = (state, newState) => ({ ...state, ...newState })

const CoreApp = () => {
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)
  const configData = useSelector((state) => state.custom.configData)
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const client = useApolloClient()
  const [state, setState] = useReducer(reducer, initialState)
  const coreState = useSelector((state) => state)

  // Determine Device Type
  useEffect(() => {
    const isSmartphone = isMobile && !isTablet
    dispatch(setDeviceType({ isMobile, isTablet, isSmartphone }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine the State of the page and what loads
  useEffect(() => {
    // This function gets a user's profile, balance, and other DeSo data
    // and sets it in the Redux store.
    const init = async () => {
      let tmpConfigData = null
      let tmpTemplates = null
      let newState = null

      try {
        newState = await renderApp(currentUser, isLoading, state)

        switch (newState.renderState) {
          case Enums.appRenderState.SIGNING_IN:
            setState(newState)
            break
          case Enums.appRenderState.LAUNCH:
            // Check if notifications are already permitted
            const support = checkSupport()

            if (!support.needsInstall) {
              if (Notification.permission === 'granted') {
                await initializeMessaging()
              }
            }
            // Only try to get and manage token if messaging is initialized
            if (messaging) {
              await handleNotificationsEnabled()
            }

            setState(newState)
            break
          case Enums.appRenderState.LOGIN:
            // User logged out or was never logged in. Reset the Redux store and state
            dispatch(resetState())
            setState(initialState)
            break
          case Enums.appRenderState.INIT:
            setState(newState)
            // Retrieve configurations from Agilit-e
            tmpConfigData = await initUserSession(currentUser.PublicKeyBase58Check)
            dispatch(setConfigData(tmpConfigData))

            // Retrieve Distribution Templates from Agilit-e
            tmpTemplates = await getDistributionTemplates(currentUser.PublicKeyBase58Check)
            dispatch(setDistributionTemplates(tmpTemplates))

            // Next, we need to fetch the rest of the user's DeSo data
            await getUsersDeSoData()

            setState({ initializing: false })

            break
          default:
            setState(newState)
        }
      } catch (e) {
        console.error(e)
      }
    }

    init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isLoading, state.userReturned, state.initializing])

  const getUsersDeSoData = async () => {
    const tmpConfigData = coreState.custom.configData
    let gqlProps = null
    let gqlData = null

    try {
      gqlProps = {
        publicKey: currentUser.PublicKeyBase58Check
      }

      gqlData = await client.query({
        query: GQL_GET_INITIAL_DESO_DATA,
        variables: gqlProps,
        fetchPolicy: 'no-cache'
      })

      const tmpDeSoData = await getInitialDeSoData(desoData, gqlData.data, tmpConfigData)

      // Fail Safe
      if (!tmpDeSoData.profile.publicKey) {
        tmpDeSoData.profile.publicKey = currentUser.PublicKeyBase58Check
      }

      dispatch(setDeSoData(tmpDeSoData))

      if (gqlData.data.accountByPublicKey) {
        if (
          !gqlData.data.accountByPublicKey.username &&
          (!gqlData.data.accountByPublicKey.extraData?.desoOpsUserProfilePrompt ||
            gqlData.data.accountByPublicKey.extraData?.desoOpsUserProfilePrompt === 'true')
        ) {
          dispatch(setEditProfileVisible(true))
        }
      } else {
        dispatch(setEditProfileVisible(true))
      }
    } catch (e) {
      console.log(e)
    }
  }

  // Update DeSo Price every x seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.renderState === Enums.appRenderState.LAUNCH) updateDeSoPrice(desoData.desoPrice)
    }, Enums.defaults.UPDATE_DESO_PRICE_INTERVAL_SEC)

    return () => clearInterval(interval)
  }, [state.renderState]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateDeSoPrice = async (currDeSoPrice) => {
    try {
      const desoPrice = await getDeSoPricing(currDeSoPrice)
      dispatch(setDeSoPrice(desoPrice))
    } catch (e) {}
  }

  const handleNotificationsEnabled = async () => {
    const firebaseToken = await requestFirebaseToken()

    if (firebaseToken) {
      const device = detectDevice()
      const browser = detectBrowser()
      const existingFcmTokens = configData?.userProfile?.fcm?.tokens || []

      let fcmTokens = [...existingFcmTokens]

      let existingTokenConfig = null
      let createTokenConfig = true
      let updateTokenConfig = false

      console.log('Stored FCM tokens:', fcmTokens)

      existingTokenConfig = fcmTokens.find((t) => t.device === device && t.browser === browser)

      if (existingTokenConfig) {
        createTokenConfig = false

        if (existingTokenConfig.token !== firebaseToken) {
          updateTokenConfig = true
          existingTokenConfig.token = firebaseToken
          existingTokenConfig.lastActive = new Date().toISOString()
        }
      }

      if (createTokenConfig) {
        const newTokenConfig = {
          token: firebaseToken,
          device,
          browser,
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }

        console.log('Adding new FCM token:', newTokenConfig, fcmTokens)
        fcmTokens = [...fcmTokens, newTokenConfig]
        await updateFCMToken(currentUser.PublicKeyBase58Check, Enums.reqTypes.UPDATE_FCM_TOKENS, fcmTokens)
      } else if (updateTokenConfig) {
        await updateFCMToken(currentUser.PublicKeyBase58Check, Enums.reqTypes.UPDATE_FCM_TOKENS, fcmTokens)
      } else {
        console.log('Token config already exists, no action needed')
      }
    }
  }

  const handleGetState = () => {
    switch (state.renderState) {
      case Enums.appRenderState.INIT:
      case Enums.appRenderState.SIGNING_IN:
        return (
          <>
            <div className='cs-spin-wrapper'>
              <Spin size='large' />
              <span>{state.spinTip}</span>
            </div>
            <center>
              <img src={logo} alt={process.env.REACT_APP_NAME} style={{ width: 300 }} />
            </center>
          </>
        )
      case Enums.appRenderState.LAUNCH:
      case Enums.appRenderState.DISTRO:
        return (
          <>
            <DistributionDashboard />
            <PWAManager onNotificationsEnabled={handleNotificationsEnabled} />
            <UpdateChecker />
          </>
        )
      case Enums.appRenderState.NOTIFICATIONS:
        return (
          <>
            <Notifications />
            <PWAManager onNotificationsEnabled={handleNotificationsEnabled} />
            <UpdateChecker />
          </>
        )
      case Enums.appRenderState.LOGIN:
        return (
          <>
            <Login />
            <PWAManager onNotificationsEnabled={handleNotificationsEnabled} />
            <UpdateChecker />
          </>
        )
    }
  }

  return (
    <>
      <Toolbar state={state} setState={setState} />
      {handleGetState()}
      <EditProfile
        isVisible={coreState.custom.editProfileVisible}
        setDeSoData={setDeSoData}
        desoData={desoData}
        getUsersDeSoData={getUsersDeSoData}
      />
    </>
  )
}

export default CoreApp
