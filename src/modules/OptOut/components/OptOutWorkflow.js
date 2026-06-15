import React, { useEffect, useReducer } from 'react'
import { identity, configure, getUsernameForPublicKey } from 'deso-protocol'
import { useLoaderData } from 'react-router-dom'
import { useApolloClient } from '@apollo/client/react'
import { message } from 'antd'

// Utils
import Enums from 'core/infra/enums'
import { useDispatch, useSelector } from 'react-redux'
import { generateProfilePicUrl, getDeSoConfig } from 'core/infra/deso-controller-graphql'
import AppToolbar from 'core/components/layout/AppToolbar'

import { FETCH_SINGLE_PROFILE } from 'core/infra/graphql-models'
import { createOptOutProfile, getOptOutProfile, updateOptOutProfile } from 'core/infra/agilite-controller'
import { optOutModel } from 'core/infra/data-models'
import Completion from '../Completion'
import OptOutLoadingState from './OptOutLoadingState'
import OptOutLoginPrompt from './OptOutLoginPrompt'
import OptOutPageShell from './OptOutPageShell'

import { cloneDeep } from 'lodash'
import { setDeSoData } from 'core/store/slices/custom/reducer'

configure(getDeSoConfig())

const reducer = (state, newState) => ({ ...state, ...newState })

export async function loader({ params }) {
  return { params }
}

const OptOut = () => {
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)
  const client = useApolloClient()
  const { params } = useLoaderData()

  const [state, setState] = useReducer(reducer, {
    identityState: null,
    renderState: Enums.appRenderState.PREP,
    optOutStatus: null,
    username: null,
    publicKey: null,
    optOutProfileState: null,
    loggedInUsername: null,
    isOptIn: false
  })

  useEffect(() => {
    identity.subscribe((state) => {
      setState({ identityState: state })
    })
  }, [])

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const username = await getUsernameForPublicKey(state.identityState.currentUser.publicKey)
        setState({ loggedInUsername: username })
      } catch (e) {
        console.error(e)
      }
    }

    if (state.identityState) {
      getLoggedInUser()
    }
    // eslint-disable-next-line
  }, [state.identityState])

  useEffect(() => {
    const init = async () => {
      let newDeSoData = null
      let gqlProps = null
      let gqlData = null

      try {
        // We need to confirm that a valid Public Key was provided in the URL
        if (!params.publicKey) {
          setState({
            renderState: Enums.appRenderState.COMPLETION,
            optOutStatus: 'NO_PUBLIC_KEY'
          })

          return
        }

        // Only run if the identityState has been set
        if (!state.identityState) return

        if (
          state.identityState.event === 'SUBSCRIBE' &&
          !state.identityState.currentUser &&
          state.renderState === Enums.appRenderState.PREP
        ) {
          setState({ renderState: Enums.appRenderState.LOGIN })
        } else if (
          state.identityState.event === 'SUBSCRIBE' &&
          state.identityState.currentUser &&
          state.renderState === Enums.appRenderState.PREP
        ) {
          gqlProps = { publicKey: state.identityState.currentUser.publicKey }

          gqlData = await client.query({
            query: FETCH_SINGLE_PROFILE,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          gqlData = gqlData.data.accountByPublicKey

          newDeSoData = cloneDeep(desoData)
          newDeSoData.profile.publicKey = gqlData.publicKey
          newDeSoData.profile.username = gqlData.username
          newDeSoData.profile.profilePicUrl = await generateProfilePicUrl(newDeSoData.profile.publicKey)

          dispatch(setDeSoData(newDeSoData))
          setState({ renderState: Enums.appRenderState.INIT })
        } else if (
          state.identityState.event === 'LOGIN_END' &&
          state.identityState.currentUser &&
          state.renderState === Enums.appRenderState.LOGIN
        ) {
          gqlProps = { publicKey: state.identityState.currentUser.publicKey }

          gqlData = await client.query({
            query: FETCH_SINGLE_PROFILE,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          gqlData = gqlData.data.accountByPublicKey

          newDeSoData = cloneDeep(desoData)
          newDeSoData.profile.publicKey = gqlData.publicKey
          newDeSoData.profile.username = gqlData.username
          newDeSoData.profile.profilePicUrl = await generateProfilePicUrl(newDeSoData.profile.publicKey)

          dispatch(setDeSoData(newDeSoData))
          setState({ renderState: Enums.appRenderState.INIT })
        } else if (state.identityState.event === 'LOGOUT_END' && !state.identityState.currentUser) {
          setState({ renderState: Enums.appRenderState.LOGIN })
        }
      } catch (e) {
        console.error(e)
      }
    }

    setTimeout(() => {
      init()
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.identityState, state.renderState])

  // First thing we need to do is check if the user is logged in
  useEffect(() => {
    const init = async () => {
      let gqlProps = null
      let gqlData = null
      let optOutProfile = null
      let optOutEntry = null
      let response = null
      let qry = null

      try {
        // Check the renderState to see if we can proceed
        if (state.renderState === Enums.appRenderState.PREP || !state.identityState) return

        switch (state.renderState) {
          case Enums.appRenderState.LOGIN:
            // Prompt user to login
            await identity.login()
            break
          case Enums.appRenderState.INIT:
            // Fetch the User Profile from DeSo
            gqlProps = { publicKey: params.publicKey }

            gqlData = await client.query({
              query: FETCH_SINGLE_PROFILE,
              variables: gqlProps,
              fetchPolicy: 'no-cache'
            })

            gqlData = gqlData.data.accountByPublicKey

            if (!gqlData) {
              // No valid profile was found
              setState({
                renderState: Enums.appRenderState.COMPLETION,
                optOutStatus: 'PUBLIC_KEY_NOT_FOUND',
                publicKey: params.publicKey
              })

              return
            } else {
              setState({
                username: gqlData.username,
                publicKey: gqlData.publicKey
              })
            }

            // Check for existing OptOut Profile in Agilit-e
            qry = { publicKey: gqlData.publicKey }
            response = await getOptOutProfile(qry)

            if (response) {
              setState({ optOutProfileState: response })

              // Check publicKey in response.recipients array to see if the user has already been opted out
              optOutEntry = response.recipients.find((recipient) => recipient.publicKey === desoData.profile.publicKey)

              if (optOutEntry) {
                // User has already been opted out
                setState({
                  renderState: Enums.appRenderState.COMPLETION,
                  optOutStatus: 'CONFLICT'
                })
              } else {
                setState({
                  renderState: Enums.appRenderState.COMPLETION,
                  optOutStatus: 'CONFIRMATION',
                  isOptIn: false
                })
              }
            } else {
              // Create OptOut Profile in Agilit-e
              optOutProfile = optOutModel(gqlData.publicKey, desoData.profile.publicKey)
              response = await createOptOutProfile(optOutProfile)

              setState({
                renderState: Enums.appRenderState.COMPLETION,
                optOutStatus: 'SUCCESS'
              })
            }

            break
        }
      } catch (e) {
        console.error(e)
      }
    }

    init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.renderState])

  const handleOptIn = async () => {
    let tmpOptOutProfileState = cloneDeep(state.optOutProfileState)
    let tmpIndex = -1

    try {
      setState({ renderState: Enums.appRenderState.LOADING })

      tmpIndex = tmpOptOutProfileState.recipients.findIndex(
        (recipient) => recipient.publicKey === desoData.profile.publicKey
      )

      if (tmpIndex > -1) {
        tmpOptOutProfileState.recipients.splice(tmpIndex, 1)

        tmpOptOutProfileState = await updateOptOutProfile(tmpOptOutProfileState._id, tmpOptOutProfileState)

        setState({
          optOutProfileState: tmpOptOutProfileState,
          renderState: Enums.appRenderState.COMPLETION,
          optOutStatus: 'SUCCESS_OPT_IN'
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleOptOut = async () => {
    let tmpOptOutProfileState = cloneDeep(state.optOutProfileState)

    try {
      setState({ renderState: Enums.appRenderState.LOADING })

      tmpOptOutProfileState.recipients.push({
        publicKey: desoData.profile.publicKey,
        timestamp: new Date()
      })

      tmpOptOutProfileState = await updateOptOutProfile(tmpOptOutProfileState._id, tmpOptOutProfileState)

      setState({
        optOutProfileState: tmpOptOutProfileState,
        renderState: Enums.appRenderState.COMPLETION,
        optOutStatus: 'SUCCESS'
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogin = async () => {
    try {
      await identity.login()
    } catch (e) {
      message.error(e)
    }
  }

  const loadingMessage =
    state.renderState === Enums.appRenderState.PREP
      ? Enums.spinnerMessages.PREP
      : state.renderState === Enums.appRenderState.LOADING
        ? Enums.spinnerMessages.LOADING
        : state.renderState === Enums.appRenderState.INIT
          ? Enums.spinnerMessages.INIT_REQUEST
          : null

  const isLoadingState = Boolean(loadingMessage)

  return (
    <>
      <AppToolbar />
      <OptOutPageShell
        title={
          <>
            <span className='text-deso-blue-deep'>Opt In/Out of </span>
            <span className='text-deso-orange'>DeSoOps</span>
            <span className='text-deso-blue-deep'> Tagging</span>
          </>
        }
      >
        {isLoadingState ? <OptOutLoadingState message={loadingMessage} /> : null}

        {state.renderState === Enums.appRenderState.COMPLETION ? (
          <Completion
            handleOptIn={handleOptIn}
            handleOptOut={handleOptOut}
            rootState={state}
            setRootState={setState}
          />
        ) : null}

        {state.renderState === Enums.appRenderState.LOGIN ? <OptOutLoginPrompt onLogin={handleLogin} /> : null}
      </OptOutPageShell>
    </>
  )
}

export default OptOut
