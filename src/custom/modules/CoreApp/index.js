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
import { Button, Spin, notification } from 'antd'

// App Components
import DistributionDashboard from '../DistributionDashboard'
import Login from '../Login'
import Toolbar from '../Toolbar'
import EditProfile from '../EditProfile'
import Notifications from '../Notifications'

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
import {
  getConfigData,
  getDistributionTemplates,
  getOptOutProfile,
  getOptOutTemplate
} from '../../lib/agilite-controller'

import { renderApp } from './controller'
import { getDeSoPricing, getInitialDeSoData } from '../../lib/deso-controller-graphql'
import { GQL_GET_INITIAL_DESO_DATA } from '../../lib/graphql-models'

import './style.sass'
import { handlePWAForiOS } from '../../lib/pwa-controller'
import { requestForPushNotifications } from '../../lib/firebase-controller'

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
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const client = useApolloClient()
  const [state, setState] = useReducer(reducer, initialState)
  const coreState = useSelector((state) => state)
  const [api, contextHolder] = notification.useNotification()
  const [token, setToken] = React.useState('')

  // Determine Device Type and init PWA Check
  useEffect(() => {
    const isSmartphone = isMobile && !isTablet
    dispatch(setDeviceType({ isMobile, isTablet, isSmartphone }))
    handlePWAForiOS()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine the State of the page and what loads
  useEffect(() => {
    // This function gets a user's profile, balance, and other DeSo data
    // and sets it in the Redux store.
    const init = async () => {
      let tmpConfigData = null
      let tmpOptOutTemplate = null
      let tmpOptOutProfile = null
      let tmpTemplates = null
      let newState = null

      try {
        newState = await renderApp(currentUser, isLoading, state)

        switch (newState.renderState) {
          case Enums.appRenderState.SIGNING_IN:
            setState(newState)
            break
          case Enums.appRenderState.LAUNCH:
            setState(newState)

            const btn = (
              <Button type='primary' size='small' onClick={() => requestForPushNotifications(setToken)}>
                Confirm
              </Button>
            )

            api.open({
              message: 'Token',
              description: token,
              duration: 0,
              btn,
              key: 'key'
            })

            break
          case Enums.appRenderState.LOGIN:
            // User logged out or was never logged in. Reset the Redux store and state
            dispatch(resetState())
            setState(initialState)
            break
          case Enums.appRenderState.INIT:
            setState(newState)
            // Retrieve configurations from Agilit-e
            tmpConfigData = await getConfigData()
            tmpOptOutTemplate = await getOptOutTemplate()
            tmpConfigData.optOutTemplate = tmpOptOutTemplate
            tmpOptOutProfile = await getOptOutProfile({ publicKey: currentUser.PublicKeyBase58Check })
            tmpConfigData.optOutProfile = tmpOptOutProfile
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
  }, [currentUser, isLoading, state.userReturned, state.initializing, api, token])

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
          </>
        )
      case Enums.appRenderState.LOGIN:
        return (
          <>
            <Login />
          </>
        )
      case Enums.appRenderState.NOTIFICATIONS:
        return <Notifications />
    }
  }

  return (
    <>
      {contextHolder}
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
