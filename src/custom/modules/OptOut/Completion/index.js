import React, { useEffect, useReducer } from 'react'
import { Col, Row, Card, Button, Modal } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'

import styles from './style.module.sass'
import { Link } from 'react-router-dom'

const reducer = (state, newState) => ({ ...state, ...newState })

const Completion = ({ rootState, handleOptIn, handleOptOut }) => {
  const [state, setState] = useReducer(reducer, {
    headerMessage: '',
    headerClass: '',
    extraContent: null
  })

  useEffect(() => {
    const init = async () => {
      try {
        let headerMessage = null
        let headerClass = null
        let extraContent = null

        switch (rootState.optOutStatus) {
          case 'SUCCESS':
            headerClass = 'headerSuccess'
            headerMessage = `You have successfully Opted Out of DeSoOps tagging via user - @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                Alternatively:{' '}
                <Button onClick={() => handleConfirm(true)} style={{ margin: 0, padding: 0 }} type='link'>
                  Opt In
                </Button>
              </div>
            )
            break
          case 'CONFLICT':
            headerClass = 'headerConflict'
            headerMessage = `You have already Opted Out of DeSoOps tagging via user - @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                Alternatively:{' '}
                <Button onClick={() => handleConfirm(true)} style={{ margin: 0, padding: 0 }} type='link'>
                  Opt In
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
            headerMessage = `You have successfully Opted In of DeSoOps tagging via user - @${rootState.username}`
            extraContent = (
              <div style={{ fontSize: 16 }}>
                Alternatively:{' '}
                <Button onClick={() => handleConfirm(false)} style={{ margin: 0, padding: 0 }} type='link'>
                  Opt Out
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

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.optOutStatus])

  const handleConfirm = async (optIn) => {
    Modal.confirm({
      title: optIn ? 'Opt In Confirmation' : 'Opt Out Confirmation',
      content: `Are you sure you want to ${optIn ? 'Opt In' : 'Opt Out'} of DeSoOps tagging via user - @${
        rootState.username
      }?`,
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
      <Row justify='center'>
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
