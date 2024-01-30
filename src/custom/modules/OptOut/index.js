import React, { useEffect, useReducer } from 'react'
import { identity, configure } from 'deso-protocol'
import { useLoaderData } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'
import { Col, Row, message, Card, Button } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

// Utils
import Enums from '../../lib/enums'
import { useSelector } from 'react-redux'
import { getDeSoConfig } from '../../lib/deso-controller-graphql'
import Toolbar from 'custom/modules/Toolbar'

import Spinner from 'custom/reusables/components/Spinner'
import { FETCH_SINGLE_PROFILE } from 'custom/lib/graphql-models'
import { createOptOutProfile, getOptOutProfile, updateOptOutProfile } from 'custom/lib/agilite-controller'
import { optOutModel } from 'custom/lib/data-models'
import Completion from './Completion'

import logo from 'custom/assets/deso-ops-logo-full.png'
import styles from './style.module.sass'

configure(getDeSoConfig())

const reducer = (state, newState) => ({ ...state, ...newState })

export async function loader({ params }) {
  return { params }
}

const OptOut = () => {
  const { params } = useLoaderData()
  const { isTablet, isSmartphone } = useSelector((state) => state.custom.userAgent)
  const client = useApolloClient()

  const [state, setState] = useReducer(reducer, {
    identityState: null,
    renderState: Enums.appRenderState.PREP,
    loadingInitiated: false,
    userReturned: false,
    optOutStatus: null,
    optOutReponse: '',
    username: null,
    publicKey: null
  })

  useEffect(() => {
    identity.subscribe((state) => {
      setState({ identityState: state })
    })
  }, [])

  useEffect(() => {
    const init = async () => {
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
          setState({ renderState: Enums.appRenderState.INIT })
        } else if (
          state.identityState.event === 'LOGIN_END' &&
          state.identityState.currentUser &&
          state.renderState === Enums.appRenderState.LOGIN
        ) {
          setState({ renderState: Enums.appRenderState.INIT })
        }
      } catch (e) {
        console.error(e)
      }
    }

    setTimeout(() => {
      init()
    }, 500)
  }, [state.identityState, state.renderState, params.publicKey])

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
              // Check publicKey in response.recipients array to see if the user has already been opted out
              optOutEntry = response.recipients.find(
                (recipient) => recipient.publicKey === state.identityState.currentUser.PublicKeyBase58Check
              )

              if (optOutEntry) {
                // User has already been opted out
                setState({
                  renderState: Enums.appRenderState.COMPLETION,
                  optOutStatus: 'CONFLICT'
                })
              } else {
                // User has not been opted out. Add them to the recipients array
                response.recipients.push({
                  publicKey: state.identityState.currentUser.PublicKeyBase58Check,
                  username: state.identityState.currentUser.Username,
                  optOutDate: new Date()
                })

                // Update the OptOut Profile in Agilit-e
                response = await updateOptOutProfile(response._id, response)

                setState({
                  renderState: Enums.appRenderState.COMPLETION,
                  optOutStatus: 'SUCCESS'
                })
              }
            } else {
              // Create OptOut Profile in Agilit-e
              optOutProfile = optOutModel(gqlData.publicKey, state.identityState.currentUser.PublicKeyBase58Check)
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

  const handleLogin = async () => {
    try {
      await identity.login()
    } catch (e) {
      message.error(e)
    }
  }

  return (
    <>
      <Toolbar />
      <Row className={styles.wrapper}>
        <Col span={24}>
          <Card type='inner' size='small' className={styles.card}>
            <Row>
              <Col span={24}>
                <center>
                  <img src={logo} alt='DeSoOps Portal' className={styles.logo} />
                  <span className={styles.header}>OPT-OUT NOTIFICATIONS</span>
                </center>
                {state.renderState === Enums.appRenderState.PREP ? <Spinner tip={Enums.spinnerMessages.PREP} /> : null}

                {state.renderState === Enums.appRenderState.LOADING ? (
                  <Spinner tip={Enums.spinnerMessages.LOADING} />
                ) : null}

                {state.renderState === Enums.appRenderState.INIT ? (
                  <Spinner tip={Enums.spinnerMessages.INIT_REQUEST} />
                ) : null}

                {state.renderState === Enums.appRenderState.COMPLETION ? <Completion rootState={state} /> : null}

                {state.renderState === Enums.appRenderState.LOGIN ? (
                  <Row>
                    <Col span={24}>
                      <center>
                        <p className={styles.paragraph}>
                          You will need to sign to your DeSo account to Opt-Out of receiving notifications from DeSoOps.
                        </p>
                      </center>
                    </Col>
                    <Col span={24} className={styles.btnWrapper}>
                      <button onClick={handleLogin}>
                        <div className={styles.icon}>
                          <LoginOutlined style={{ fontSize: 20 }} />
                        </div>
                        <span className={styles.text}>SIGN IN WITH DESO</span>
                      </button>
                    </Col>
                  </Row>
                ) : null}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OptOut
