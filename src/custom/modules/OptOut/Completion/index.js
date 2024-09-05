import React, { useEffect, useReducer } from 'react'
import { Col, Row, Card, Button, Modal, Space } from 'antd'
import {
  AppstoreOutlined,
  CheckOutlined,
  CloseOutlined,
  DownCircleOutlined,
  UndoOutlined,
  UpCircleOutlined
} from '@ant-design/icons'

import styles from './style.module.sass'
import { Link } from 'react-router-dom'
import { getUsernameForPublicKey } from 'deso-protocol'

const reducer = (state, newState) => ({ ...state, ...newState })

const Completion = ({ rootState, handleOptIn, handleOptOut }) => {
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
                <Button
                  type='primary'
                  size='large'
                  onClick={() => handleConfirm(true)}
                  style={{ backgroundColor: '#42C470', fontSize: 18 }}
                >
                  <Space>
                    <CheckOutlined style={{ fontSize: 18 }} />
                    Opt Back In
                  </Space>
                </Button>
              </div>
            )
            break
          case 'CONFLICT':
            headerClass = 'headerConflict'
            headerMessage = `As @${state.loggedInUsername}, you have already Opted Out of DeSoOps tagging for user @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                <Button
                  type='primary'
                  size='large'
                  onClick={() => handleConfirm(true)}
                  style={{ backgroundColor: '#42C470', fontSize: 18 }}
                >
                  <Space>
                    <CheckOutlined style={{ fontSize: 18 }} />
                    Opt Back In
                  </Space>
                </Button>
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
                <Button
                  type='primary'
                  size='large'
                  onClick={() => handleConfirm(false)}
                  style={{ backgroundColor: '#FF2E2E', fontSize: 18 }}
                >
                  <Space>
                    <CloseOutlined style={{ fontSize: 18 }} />
                    Opt Out
                  </Space>
                </Button>
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

  const handleConfirm = async (optIn) => {
    Modal.confirm({
      title: optIn ? 'Opt In Confirmation' : 'Opt Out Confirmation',
      content: `As @${state.loggedInUsername}, are you sure you want to ${
        optIn ? 'Opt In' : 'Opt Out'
      } for DeSoOps tagging for user @${rootState.username}?`,
      onOk: async () => {
        if (optIn) {
          await handleOptIn()
        } else {
          await handleOptOut()
        }
      },
      okText: 'Yes',
      cancelText: 'No'
    })
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
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <center>
            <p className={styles.paragraph}>
              You can choose to close this page, or alternatively, you can access the DeSoOps Dashboard by clicking the
              button below.
            </p>
          </center>
        </Col>
      </Row>
      <Row>
        <Col span={24} className={styles.btnWrapper}>
          <Link className={styles.btnDashboard} to='/'>
            <div className={styles.icon}>
              <AppstoreOutlined style={{ fontSize: 20 }} />
            </div>
            <span className={styles.text}>DeSoOps Dashboard</span>
          </Link>
        </Col>
      </Row>
    </Card>
  )
}

export default Completion
