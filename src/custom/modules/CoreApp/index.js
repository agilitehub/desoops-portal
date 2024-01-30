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
import DistributionDashboard from 'custom/modules/DistributionDashboard'
import Login from 'custom/modules/Login'
import Toolbar from 'custom/modules/Toolbar'

// Utils
import Enums from 'custom/lib/enums'
import logo from 'custom/assets/deso-ops-logo-full.png'
import {
  setDeSoData,
  setConfigData,
  resetState,
  setDeviceType,
  setDeSoPrice,
  setDistributionTemplates
} from 'custom/reducer'
import {
  getConfigData,
  getDistributionTemplates,
  getOptOutProfile,
  getOptOutTemplate
} from 'custom/lib/agilite-controller'

import { renderApp } from './controller'
import { getDeSoPricing, getInitialDeSoData } from 'custom/lib/deso-controller-graphql'
import { GQL_GET_INITIAL_DESO_DATA } from 'custom/lib/graphql-models'

import './style.sass'

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
      let tmpOptOutTemplate = null
      let tmpOptOutProfile = null
      let tmpTemplates = null
      let newState = null
      let gqlProps = null
      let gqlData = null

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
            tmpConfigData = await getConfigData()
            tmpOptOutTemplate = await getOptOutTemplate()
            tmpConfigData.optOutTemplate = tmpOptOutTemplate
            tmpOptOutProfile = await getOptOutProfile({ publicKey: currentUser.PublicKeyBase58Check })
            tmpConfigData.optOutProfile = tmpOptOutProfile
            console.log(tmpConfigData)
            dispatch(setConfigData(tmpConfigData))

            // Retrieve Distribution Templates from Agilit-e
            tmpTemplates = await getDistributionTemplates(currentUser.PublicKeyBase58Check)
            dispatch(setDistributionTemplates(tmpTemplates))

            // Next, we need to fetch the rest of the user's DeSo data
            gqlProps = {
              publicKey: currentUser.PublicKeyBase58Check
            }

            gqlData = await client.query({
              query: GQL_GET_INITIAL_DESO_DATA,
              variables: gqlProps,
              fetchPolicy: 'no-cache'
            })

            const tmpDeSoData = await getInitialDeSoData(desoData, gqlData.data)
            dispatch(setDeSoData(tmpDeSoData))
            setState({ initializing: false })

            break
        }
      } catch (e) {
        console.error(e)
      }
    }

    init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isLoading, state.userReturned, state.initializing, state.renderState])

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

  switch (state.renderState) {
    case Enums.appRenderState.INIT:
    case Enums.appRenderState.SIGNING_IN:
      return (
        <>
          <Toolbar />
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
          <Toolbar />
          <DistributionDashboard />
        </>
      )
    case Enums.appRenderState.LOGIN:
      return (
        <>
          <Toolbar />
          <Login />
        </>
      )
  }
}

export default CoreApp
