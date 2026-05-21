// This is the root Component of our React Application.
// Here we determine check to see if the user is logged in via their DeSo Identity.
// If yes, we fetch their DeSo data and display the Distribution Dashboard.
// If no, we display the Login page.
// We also display a loading spinner while we are fetching the user's DeSo data.

import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'
import { isMobile, isTablet } from 'react-device-detect'
import { useApolloClient } from '@apollo/client/react'
import { Spin } from 'antd'
import { Outlet } from 'react-router-dom'
import { usePwaFeatures } from '../PWADetector/hooks'
import { setNotificationsVisible } from 'core/store/slices/custom/reducer'

// App Components
import PWAManager from '../PWAManager'
import Login from '../Login'
import AppToolbar from 'core/components/layout/AppToolbar'
import EditProfile from '../EditProfile'
import Notifications from '../Notifications'

// Utils
import Enums from 'core/infra/enums'
import logo from 'assets/deso-ops-logo-full.png'
import {
  setDeSoData,
  setConfigData,
  resetState,
  setDeviceType,
  setMarketPrices,
  setDistributionTemplates,
  setEditProfileVisible
} from 'core/store/slices/custom/reducer'
import { initUserSession, getDistributionTemplates, updateFCMToken } from 'core/infra/agilite-controller'

import { renderApp } from './controllers'
import { getDeSoPricing, getInitialDeSoData } from 'core/infra/deso-controller-graphql'
import { fetchFocusMidPriceUsdPerCoin } from 'core/infra/focus-market'
import { GQL_GET_INITIAL_DESO_DATA } from 'core/infra/graphql-models'

import './style.sass'
import { initializeMessaging } from 'core/infra/firebase-controller'
import EditNotifications from '../EditNotifications'
import ComingSoon from '../ComingSoon'
import { cloneDeep } from 'lodash'

const initialState = {
  initializing: false,
  renderState: Enums.appRenderState.LOGIN,
  userReturned: false,
  spinTip: Enums.spinnerMessages.INIT,
  appReady: false
}

const reducer = (state, newState) => ({ ...state, ...newState })

const CoreApp = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const desoData = useSelector((state) => state.custom.desoData)
  const configData = useSelector((state) => state.custom.configData)
  const editProfileVisible = useSelector((state) => state.custom.editProfileVisible)
  const editNotificationsVisible = useSelector((state) => state.custom.editNotificationsVisible)
  const comingSoonObject = useSelector((state) => state.custom.comingSoon)
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const client = useApolloClient()
  const [state, setState] = useReducer(reducer, initialState)
  const { notificationPermission, browserType, deviceType, standaloneRequired } = usePwaFeatures()
  const [stepStatuses, setStepStatus] = useState({
    tokenObtained: '',
    initComplete: ''
  })

  // Determine Device Type
  useEffect(() => {
    const isSmartphone = isMobile && !isTablet
    dispatch(setDeviceType({ isMobile, isTablet, isSmartphone }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine the State of the page and what loads
  useEffect(() => {
    const init = async () => {
      let tmpConfigData = null
      let tmpTemplates = null
      let newState = null

      try {
        newState = await renderApp(currentUser, isLoading, state)

        switch (newState.renderState) {
          case Enums.appRenderState.SIGNING_IN:
          case Enums.appRenderState.LAUNCH:
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
            tmpConfigData = await initUserSession(currentUser.PublicKeyBase58Check, browserType, deviceType)
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

  // On App Launch, we need to check if the notificationPermission changed
  useEffect(() => {
    if (state.appReady && notificationPermission === 'granted') {
      handleNotificationsEnabled()
    }
    // eslint-disable-next-line
  }, [notificationPermission, state.appReady])

  const getUsersDeSoData = async () => {
    const tmpConfigData = configData
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
      console.error(e)
    }
  }

  // Update DESO + Focus market prices on the same interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.renderState === Enums.appRenderState.LAUNCH) {
        void updateLiveMarketPrices()
      }
    }, Enums.defaults.UPDATE_DESO_PRICE_INTERVAL_SEC)

    return () => clearInterval(interval)
  }, [state.renderState]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateLiveMarketPrices = async () => {
    try {
      const curr = store.getState().custom.desoData
      const desoPrice = await getDeSoPricing(curr.desoPrice)
      const focusUsdRaw = await fetchFocusMidPriceUsdPerCoin()
      const focusPriceUsd = focusUsdRaw != null ? focusUsdRaw : 0
      const focusPriceDeso = focusUsdRaw != null && desoPrice > 0 ? focusUsdRaw / desoPrice : 0
      dispatch(
        setMarketPrices({
          desoPrice,
          focusPriceDeso,
          focusPriceUsd
        })
      )
    } catch (e) {
      /* keep last known prices */
    }
  }

  const handleNotificationsEnabled = async () => {
    setStepStatus((prev) => ({ ...prev, tokenObtained: 'pending' }))
    const firebaseToken = await initializeMessaging()
    const timestamp = new Date().toISOString()

    if (firebaseToken) {
      setStepStatus((prev) => ({ ...prev, tokenObtained: 'success', initComplete: 'pending' }))
      const existingFcmTokens = configData?.userProfile?.notifications?.tokens || []

      let fcmTokens = cloneDeep(existingFcmTokens)

      let existingTokenConfig = null
      let createTokenConfig = true
      let updateTokenConfig = false

      existingTokenConfig = fcmTokens.find((t) => t.device === deviceType && t.browser === browserType)

      if (existingTokenConfig) {
        createTokenConfig = false

        if (existingTokenConfig.token !== firebaseToken) {
          updateTokenConfig = true
          existingTokenConfig.token = firebaseToken
          existingTokenConfig.lastActive = timestamp
        }
      }

      if (createTokenConfig) {
        const newTokenConfig = {
          token: firebaseToken,
          device: deviceType,
          browser: browserType,
          lastActive: timestamp,
          createdAt: timestamp
        }

        fcmTokens = [...fcmTokens, newTokenConfig]
        await updateFCMToken(currentUser.PublicKeyBase58Check, Enums.reqTypes.UPDATE_FCM_TOKENS, fcmTokens)
      } else if (updateTokenConfig) {
        await updateFCMToken(currentUser.PublicKeyBase58Check, Enums.reqTypes.UPDATE_FCM_TOKENS, fcmTokens)
      }

      setStepStatus((prev) => ({ ...prev, initComplete: 'success' }))
    } else {
      setStepStatus((prev) => ({ ...prev, tokenObtained: 'error' }))
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
        return (
          <>
            <Outlet />
            <Notifications />
          </>
        )
      case Enums.appRenderState.LOGIN:
        return (
          <>
            <Login />
          </>
        )
    }
  }

  return (
    <>
      <AppToolbar onNotificationsClick={() => dispatch(setNotificationsVisible(true))} />
      {handleGetState()}
      <PWAManager
        disabled={!state.appReady && !(state.renderState === Enums.appRenderState.LOGIN && standaloneRequired)}
        stepStatuses={stepStatuses}
      />
      <EditProfile
        isVisible={editProfileVisible}
        setDeSoData={setDeSoData}
        desoData={desoData}
        getUsersDeSoData={getUsersDeSoData}
      />
      <EditNotifications isVisible={editNotificationsVisible} setDeSoData={setDeSoData} desoData={desoData} />
      <ComingSoon
        isVisible={comingSoonObject.isVisible}
        title={comingSoonObject.title}
        description={comingSoonObject.description}
      />
    </>
  )
}

export default CoreApp
