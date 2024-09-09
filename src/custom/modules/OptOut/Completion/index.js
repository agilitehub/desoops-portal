import React, { useEffect, useReducer } from 'react'
import { Col, Row, Card, Button, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import styles from './style.module.sass'
import { getUsernameForPublicKey } from 'deso-protocol'
import { desoLogout } from '../../../../custom/lib/deso-controller-graphql'
import Enums from '../../../../custom/lib/enums'

const reducer = (state, newState) => ({ ...state, ...newState })

const Completion = ({ rootState, setRootState, handleOptIn, handleOptOut }) => {
  const [state, setState] = useReducer(reducer, {
    headerMessage: '',
    headerClass: '',
    extraContent: null,
    loggedInUsername: null
  })

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const username = await getUsernameForPublicKey(rootState.identityState.currentUser.publicKey)
        setState({ loggedInUsername: username })
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
            headerMessage = `As @${state.loggedInUsername}, you have successfully Opted Out of DeSoOps tagging for user @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                <Row justify='center'>
                  <Col>
                    <Button
                      type='primary'
                      size='large'
                      onClick={() => handleConfirm(true)}
                      style={{ backgroundColor: '#FF9100', fontSize: 18 }}
                    >
                      <Space>
                        <CheckOutlined style={{ fontSize: 18 }} />
                        Opt Back In
                      </Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'CONFLICT':
            headerClass = 'headerConflict'
            headerMessage = `As @${state.loggedInUsername}, you have already Opted Out of DeSoOps tagging for user @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                <Row justify='center'>
                  <Col>
                    <Button
                      type='primary'
                      size='large'
                      onClick={() => handleConfirm(true)}
                      style={{ backgroundColor: '#FF9100', fontSize: 18 }}
                    >
                      <Space>
                        <CheckOutlined style={{ fontSize: 18 }} />
                        Opt Back In
                      </Space>
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
            headerMessage = `As @${state.loggedInUsername}, you have successfully Opted In of DeSoOps tagging for user @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                <Row justify='center'>
                  <Col>
                    <Button
                      type='primary'
                      size='large'
                      onClick={() => handleConfirm(false)}
                      style={{ backgroundColor: '#FF9100', fontSize: 18 }}
                    >
                      <Space>
                        <CloseOutlined style={{ fontSize: 18 }} />
                        Opt Out
                      </Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'NO_ACTION':
            headerClass = 'headerSuccess'
            headerMessage = `As @${state.loggedInUsername}, you are Opted In of DeSoOps tagging for user @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                <Row justify='center'>
                  <Col>
                    <Button
                      type='primary'
                      size='large'
                      onClick={() => handleConfirm(false)}
                      style={{ backgroundColor: '#FF9100', fontSize: 18 }}
                    >
                      <Space>
                        <CloseOutlined style={{ fontSize: 18 }} />
                        Opt Out
                      </Space>
                    </Button>
                  </Col>
                </Row>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'CONFIRMATION':
            headerClass = 'headerSuccess'
            headerMessage = `As @${state.loggedInUsername}, are you sure you want to ${
              rootState.isOptIn ? 'Opt In' : 'Opt Out'
            } for DeSoOps tagging for user @${rootState.username}?`
            extraContent = (
              <div style={{ fontSize: 16 }}>
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
                      style={{ backgroundColor: '#FF9100', fontSize: 18 }}
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
      <Row justify='center' style={{ marginTop: 10 }}>
        <Col>
          <Button size='large' type='primary' onClick={() => desoLogout()} style={{ fontSize: 18 }}>
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

  return (
    <Card type='inner' size='small' className={styles.card}>
      <Row>
        <Col span={24}>
          <center>
            <span className={styles[state.headerClass]}>{state.headerMessage}</span>
          </center>
        </Col>
      </Row>
      <Row justify='center' style={{ marginTop: 10 }}>
        <Col>{state.extraContent}</Col>
      </Row>
    </Card>
  )
}

export default Completion
