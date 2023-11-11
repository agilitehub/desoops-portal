// This is the root Component of our React Application.
// Here we determine check to see if the user is logged in via their DeSo Identity.
// If yes, we fetch their DeSo data and display the Distribution Dashboard.
// If no, we display the Login page.
// We also display a loading spinner while we are fetching the user's DeSo data.

import React, { useContext, useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'
import { isMobile, isTablet } from 'react-device-detect'
import { useLazyQuery } from '@apollo/client'
import { useColorMode } from '@chakra-ui/color-mode'

// App Components
import DistributionDashboard from 'modules/DistributionDashboard'
import Login from 'modules/Login'
import Toolbar from 'modules/Toolbar'

// Utils
import Enums from 'lib/enums'
import logo from 'assets/deso-ops-logo-full.png'
import logoDark from 'assets/deso-ops-logo-full-dark.png'
import { setDeSoData, setConfigData, resetState, setDeviceType, setDeSoPrice, setDistributionTemplates } from 'reducer'
import { getConfigData, getDistributionTemplates } from 'lib/agilite-controller'

import { getDeSoPricing } from 'lib/deso-controller'
import { renderApp } from './controller'
import { finalizeInitialDeSoData } from 'lib/deso-controller-graphql'
import { GQL_GET_INITIAL_DESO_DATA } from 'lib/graphql-models'
import { Spin } from 'antd'

const initialState = {
  initializing: false,
  renderState: Enums.appRenderState.LOGIN,
  userReturned: false,
  spinTip: Enums.spinnerMessages.INIT
}

const reducer = (state, newState) => ({ ...state, ...newState })

const CoreApp = () => {
  const dispatch = useDispatch()
  const { colorMode } = useColorMode()
  const desoData = useSelector((state) => state.core.desoData)
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const [getInitialDeSoData, { loading, error, data }] = useLazyQuery(GQL_GET_INITIAL_DESO_DATA)
  const [state, setState] = useReducer(reducer, initialState)

  // Determine Device Type
  useEffect(() => {
    const isSmartphone = isMobile && !isTablet
    dispatch(setDeviceType({ isMobile, isTablet, isSmartphone }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Finalize DeSo Object once we have the user's DeSo data via GraphQL
  useEffect(() => {
    const init = async () => {
      let tmpDeSoData = null
      if (!loading && !error && data) {
        // Finalize the DeSo Data Object for the current User
        tmpDeSoData = await finalizeInitialDeSoData(currentUser, desoData, data)
        dispatch(setDeSoData(tmpDeSoData))
        setState({ initializing: false })
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data])

  // Determine the State of the page and what loads
  useEffect(() => {
    // This function gets a user's profile, balance, and other DeSo data
    // and sets it in the Redux store.
    const init = async () => {
      let tmpConfigData = null
      let tmpTemplates = null
      let newState = null
      let gqlProps = null

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
            dispatch(setConfigData(tmpConfigData))

            // Retrieve Distribution Templates from Agilit-e
            tmpTemplates = await getDistributionTemplates(currentUser.PublicKeyBase58Check)
            dispatch(setDistributionTemplates(tmpTemplates))

            // Next, we need to fetch the rest of the user's DeSo data
            if (!data) {
              gqlProps = {
                variables: {
                  publicKey: currentUser.PublicKeyBase58Check,
                  tokenBalancesAsCreatorFilter: {
                    holder: {
                      publicKey: {
                        equalTo: currentUser.PublicKeyBase58Check
                      }
                    }
                  }
                }
              }

              getInitialDeSoData(gqlProps)
            } else {
              // We already have the user's DeSo data via GraphQL
              // Finalize the DeSo Data Object for the current User
              const tmpDeSoData = await finalizeInitialDeSoData(currentUser, desoData, data)
              dispatch(setDeSoData(tmpDeSoData))
              setState({ initializing: false })
            }

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
      if (state.renderState === Enums.appRenderState.LAUNCH) updateDeSoPrice()
    }, Enums.defaults.UPDATE_DESO_PRICE_INTERVAL_SEC)

    return () => clearInterval(interval)
  }, [state.renderState]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateDeSoPrice = async () => {
    try {
      const desoPrice = await getDeSoPricing()
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
            <Spin />
            <span>{state.spinTip}</span>
          </div>
          <center>
            {colorMode === Enums.colorMode.LIGHT ? (
              <img src={logo} alt={process.env.REACT_APP_NAME} style={{ width: 300 }} />
            ) : (
              <img src={logoDark} alt={process.env.REACT_APP_NAME} style={{ width: 300 }} />
            )}
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
