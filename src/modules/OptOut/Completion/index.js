import React, { useEffect, useReducer } from 'react'
import { Col, Row, Card, Button, Space } from 'antd'

import { getUsernameForPublicKey } from 'deso-protocol'
import { desoLogout } from 'core/infra/deso-controller-graphql'
import Enums from 'core/infra/enums'

const HEADER_CLASS = {
  headerSuccess: 'text-[22px] text-success max-sm:text-[19px]',
  headerConflict: 'text-[22px] text-deso-orange max-sm:text-[19px]',
  headerError: 'text-[22px] text-error max-sm:text-[19px]'
}

const reducer = (state, newState) => ({ ...state, ...newState })

const Completion = ({ rootState, setRootState, handleOptIn, handleOptOut }) => {
  const [state, setState] = useReducer(reducer, {
    headerMessage: '',
    headerClass: '',
    extraContent: null,
    loggedInUsername: null,
    loading: false
  })

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        setState({ loading: true })
        const username = await getUsernameForPublicKey(rootState.identityState.currentUser.publicKey)
        setState({ loggedInUsername: username, loading: false })
      } catch (e) {
        console.error(e)
      }
    }

    getLoggedInUser()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        let headerMessage = null
        let headerClass = null
        let extraContent = null

        switch (rootState.optOutStatus) {
          case 'SUCCESS':
            headerClass = 'headerSuccess'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you have successfully Opted Out of DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>
              </div>
            )
            extraContent = (
              <div className='text-base'>
                <Row justify='center'>
                  <Col>
                    <Button type='primary' size='large' onClick={() => handleConfirm(true)} className='!bg-success text-lg'>
                      <Space>Opt Back In</Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'CONFLICT':
            headerClass = 'headerConflict'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you have already Opted Out of DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>
              </div>
            )
            extraContent = (
              <div className='text-base'>
                <Row justify='center'>
                  <Col>
                    <Button type='primary' size='large' onClick={() => handleConfirm(true)} className='!bg-success text-lg'>
                      <Space>Opt Back In</Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'NO_PUBLIC_KEY':
            headerClass = 'headerError'
            headerMessage = 'No Public Key was provided in the URL. Please review and try again.'
            break
          case 'PUBLIC_KEY_NOT_FOUND':
            headerClass = 'headerError'
            headerMessage =
              'The Public Key provided in the URL does not match any existing DeSo Profiles. Please review and try again.'
            break
          case 'SUCCESS_OPT_IN':
            headerClass = 'headerSuccess'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you have successfully Opted into DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>
              </div>
            )
            extraContent = (
              <div className='text-base'>
                <Row justify='center'>
                  <Col>
                    <Button type='primary' size='large' onClick={() => handleConfirm(false)} className='!bg-error text-lg'>
                      <Space>Opt Out</Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'NO_ACTION':
            headerClass = 'headerSuccess'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you are Opted into DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>
              </div>
            )
            extraContent = (
              <div className='text-base'>
                <Row justify='center'>
                  <Col>
                    <Button type='primary' size='large' onClick={() => handleConfirm(false)} className='!bg-error text-lg'>
                      <Space>Opt Out</Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'CONFIRMATION':
            headerClass = 'headerConflict'
            headerMessage = (
              <div>
                <b>CONFIRMATION:</b>
                <br />
                As <b>@{state.loggedInUsername}</b>, are you sure you want to{' '}
                {rootState.isOptIn ? 'Opt into' : 'Opt Out of'} DeSoOps tagging for user <b>@{rootState.username}</b>?
              </div>
            )
            extraContent = (
              <div className='text-base'>
                <Row justify='center'>
                  <Col>
                    <Button
                      type='primary'
                      size='large'
                      onClick={() => {
                        if (rootState.isOptIn) {
                          handleOptIn()
                        } else {
                          handleOptOut()
                        }
                      }}
                      className='!bg-deso-orange text-lg'
                    >
                      <Space>Yes - {rootState.isOptIn ? 'Opt In' : 'Opt Out'}</Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(true)}
              </div>
            )
            break
        }

        setState({ headerMessage, headerClass, extraContent })
      } catch (e) {
        console.error(e)
      }
    }

    if (state.loggedInUsername) {
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.optOutStatus, state.loggedInUsername])

  const renderSwitchAccount = (renderNo) => {
    return (
      <Row justify='center' className='mt-2.5'>
        <Col>
          <Button size='large' type='primary' onClick={() => handleDesoLogout()} className='text-lg'>
            {renderNo ? 'No - ' : ''}Switch Account
          </Button>
        </Col>
      </Row>
    )
  }

  const handleConfirm = async (optIn) => {
    if (optIn) {
      setRootState({
        renderState: Enums.appRenderState.COMPLETION,
        optOutStatus: 'CONFIRMATION',
        isOptIn: true
      })
    } else {
      setRootState({
        renderState: Enums.appRenderState.COMPLETION,
        optOutStatus: 'CONFIRMATION',
        isOptIn: false
      })
    }
  }

  const handleDesoLogout = async () => {
    desoLogout()
  }

  return (
    <Card type='inner' size='small' className='border-none bg-transparent' loading={state.loading}>
      <Row>
        <Col span={24}>
          <center>
            <span className={HEADER_CLASS[state.headerClass] || ''}>{state.headerMessage}</span>
          </center>
        </Col>
      </Row>
      <Row justify='center' className='mt-2.5'>
        <Col>{state.extraContent}</Col>
      </Row>
    </Card>
  )
}

export default Completion
